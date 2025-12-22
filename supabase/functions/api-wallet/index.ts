import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  jsonResponse,
  errorResponse,
  validateRequired,
  createAuditLog,
  isValidUUID,
  isValidNumber,
} from "../_shared/utils.ts";
import { withAuth, RequestContext } from "../_shared/middleware.ts";

// Withdrawal limits per role
const WITHDRAWAL_LIMITS: Record<string, { min: number; max: number; dailyMax: number }> = {
  super_admin: { min: 0, max: Infinity, dailyMax: Infinity },
  admin: { min: 100, max: 1000000, dailyMax: 500000 },
  finance_manager: { min: 100, max: 500000, dailyMax: 200000 },
  franchise: { min: 500, max: 200000, dailyMax: 100000 },
  reseller: { min: 500, max: 100000, dailyMax: 50000 },
  developer: { min: 500, max: 50000, dailyMax: 25000 },
  influencer: { min: 200, max: 50000, dailyMax: 25000 },
  prime: { min: 1000, max: 100000, dailyMax: 50000 },
  client: { min: 500, max: 25000, dailyMax: 10000 },
};

// Commission rate limits by role
const COMMISSION_RATE_LIMITS: Record<string, { min: number; max: number }> = {
  franchise: { min: 40, max: 60 },
  reseller: { min: 10, max: 20 },
  influencer: { min: 5, max: 15 },
  developer: { min: 0, max: 100 }, // Task-based, varies
};

serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api-wallet", "");

  // GET /wallet/balance
  if (path === "/balance" && req.method === "GET") {
    return withAuth(req, [], async ({ supabaseAdmin, user }) => {
      const { data: wallet } = await supabaseAdmin
        .from("wallets")
        .select("*")
        .eq("user_id", user.userId)
        .single();

      if (!wallet) {
        // Create wallet if doesn't exist
        const { data: newWallet } = await supabaseAdmin.from("wallets").insert({
          user_id: user.userId,
          balance: 0,
          currency: "INR",
        }).select().single();

        return jsonResponse({
          wallet_id: newWallet.wallet_id,
          balance: 0,
          currency: "INR",
          pending: 0,
        });
      }

      // Get pending transactions
      const { data: pending } = await supabaseAdmin
        .from("transactions")
        .select("amount")
        .eq("wallet_id", wallet.wallet_id)
        .eq("type", "pending");

      const pendingAmount = pending?.reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0) || 0;

      return jsonResponse({
        wallet_id: wallet.wallet_id,
        balance: Number(wallet.balance) || 0,
        currency: wallet.currency,
        pending: pendingAmount,
      });
    }, { module: "wallet", action: "balance" });
  }

  // POST /wallet/add
  if (path === "/add" && req.method === "POST") {
    return withAuth(req, ["super_admin", "admin", "finance_manager"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["user_id", "amount", "reference"]);
      if (validation) return errorResponse(validation);

      // Validate UUID
      if (!isValidUUID(body.user_id)) {
        return errorResponse("Invalid user ID format");
      }

      // Validate amount - must be positive number
      const amount = Number(body.amount);
      if (!isValidNumber(amount, 0.01, 10000000)) {
        return errorResponse("Amount must be between 0.01 and 10,000,000");
      }

      const { data: wallet } = await supabaseAdmin
        .from("wallets")
        .select("*")
        .eq("user_id", body.user_id)
        .single();

      if (!wallet) return errorResponse("Wallet not found", 404);

      // Use atomic update with RPC to prevent race conditions
      const newBalance = Number(wallet.balance) + amount;

      // Check for potential overflow
      if (newBalance > 999999999) {
        return errorResponse("Balance would exceed maximum limit");
      }

      const { error: updateError } = await supabaseAdmin
        .from("wallets")
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq("wallet_id", wallet.wallet_id)
        .eq("balance", wallet.balance); // Optimistic locking

      if (updateError) {
        return errorResponse("Transaction failed - please retry", 409);
      }

      await supabaseAdmin.from("transactions").insert({
        wallet_id: wallet.wallet_id,
        type: body.type || "credit",
        amount: amount,
        reference: body.reference,
        related_user: user.userId,
        related_role: user.role,
        status: "completed",
      });

      // Audit log for financial transaction
      await createAuditLog(supabaseAdmin, user.userId, user.role, "wallet", "funds_added", {
        target_user_id: body.user_id,
        amount,
        new_balance: newBalance,
        reference: body.reference,
      });

      return jsonResponse({
        message: "Funds added",
        new_balance: newBalance,
      });
    }, { module: "wallet", action: "add" });
  }

  // POST /wallet/withdraw
  if (path === "/withdraw" && req.method === "POST") {
    return withAuth(req, [], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["amount"]);
      if (validation) return errorResponse(validation);

      const amount = Number(body.amount);
      
      // Validate amount is a positive number
      if (!isValidNumber(amount, 0.01)) {
        return errorResponse("Amount must be a positive number");
      }

      // Get role-based limits
      const limits = WITHDRAWAL_LIMITS[user.role] || WITHDRAWAL_LIMITS.client;
      
      // Check minimum withdrawal
      if (amount < limits.min) {
        return errorResponse(`Minimum withdrawal amount is ₹${limits.min}`);
      }

      // Check maximum single withdrawal
      if (amount > limits.max) {
        return errorResponse(`Maximum withdrawal amount is ₹${limits.max}`);
      }

      const { data: wallet } = await supabaseAdmin
        .from("wallets")
        .select("*")
        .eq("user_id", user.userId)
        .single();

      if (!wallet) return errorResponse("Wallet not found", 404);

      const currentBalance = Number(wallet.balance) || 0;

      // Check for sufficient balance (prevent negative balance)
      if (currentBalance < amount) {
        return errorResponse("Insufficient balance", 400);
      }

      // Check daily withdrawal limit
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: todayWithdrawals } = await supabaseAdmin
        .from("payout_requests")
        .select("amount")
        .eq("user_id", user.userId)
        .gte("timestamp", today.toISOString())
        .in("status", ["pending", "processing", "completed"]);

      const todayTotal = (todayWithdrawals || []).reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
      
      if (todayTotal + amount > limits.dailyMax) {
        return errorResponse(`Daily withdrawal limit of ₹${limits.dailyMax} exceeded. Already withdrawn: ₹${todayTotal}`);
      }

      // Check for duplicate requests (fraud detection)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const { data: recentRequests } = await supabaseAdmin
        .from("payout_requests")
        .select("id")
        .eq("user_id", user.userId)
        .eq("amount", amount)
        .eq("status", "pending")
        .gte("timestamp", fiveMinutesAgo.toISOString());

      if (recentRequests && recentRequests.length > 0) {
        return errorResponse("Duplicate withdrawal request detected. Please wait before submitting another request.", 429);
      }

      // Create payout request
      const { data: payout, error } = await supabaseAdmin.from("payout_requests").insert({
        user_id: user.userId,
        amount: amount,
        status: "pending",
        payment_method: body.payment_method || "bank_transfer",
      }).select().single();

      if (error) return errorResponse(error.message, 400);

      // Deduct from wallet using optimistic locking
      const newBalance = currentBalance - amount;
      const { error: updateError } = await supabaseAdmin
        .from("wallets")
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq("wallet_id", wallet.wallet_id)
        .eq("balance", wallet.balance); // Optimistic locking

      if (updateError) {
        // Rollback payout request if wallet update fails
        await supabaseAdmin.from("payout_requests").delete().eq("payout_id", payout.payout_id);
        return errorResponse("Transaction failed - please retry", 409);
      }

      await supabaseAdmin.from("transactions").insert({
        wallet_id: wallet.wallet_id,
        type: "withdrawal_pending",
        amount: -amount,
        reference: `Payout request ${payout.payout_id}`,
        related_user: user.userId,
        status: "pending",
      });

      // Audit log
      await createAuditLog(supabaseAdmin, user.userId, user.role, "wallet", "withdrawal_requested", {
        payout_id: payout.payout_id,
        amount,
        new_balance: newBalance,
        payment_method: body.payment_method || "bank_transfer",
      });

      return jsonResponse({
        message: "Withdrawal request submitted",
        payout_id: payout.payout_id,
        amount: amount,
        status: "pending",
      });
    }, { module: "wallet", action: "withdraw" });
  }

  // POST /wallet/transfer
  if (path === "/transfer" && req.method === "POST") {
    return withAuth(req, ["super_admin", "admin", "finance_manager"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["from_user_id", "to_user_id", "amount", "reference"]);
      if (validation) return errorResponse(validation);

      // Validate UUIDs
      if (!isValidUUID(body.from_user_id) || !isValidUUID(body.to_user_id)) {
        return errorResponse("Invalid user ID format");
      }

      // Prevent self-transfer
      if (body.from_user_id === body.to_user_id) {
        return errorResponse("Cannot transfer to same wallet");
      }

      const amount = Number(body.amount);
      if (!isValidNumber(amount, 0.01, 10000000)) {
        return errorResponse("Amount must be between 0.01 and 10,000,000");
      }

      // Get both wallets
      const { data: fromWallet } = await supabaseAdmin
        .from("wallets")
        .select("*")
        .eq("user_id", body.from_user_id)
        .single();

      const { data: toWallet } = await supabaseAdmin
        .from("wallets")
        .select("*")
        .eq("user_id", body.to_user_id)
        .single();

      if (!fromWallet || !toWallet) return errorResponse("One or both wallets not found", 404);
      
      const fromBalance = Number(fromWallet.balance) || 0;
      if (fromBalance < amount) return errorResponse("Insufficient balance in source wallet", 400);

      // Atomic transfer with optimistic locking
      const newFromBalance = fromBalance - amount;
      const newToBalance = (Number(toWallet.balance) || 0) + amount;

      // Update source wallet
      const { error: fromError } = await supabaseAdmin
        .from("wallets")
        .update({ balance: newFromBalance, updated_at: new Date().toISOString() })
        .eq("wallet_id", fromWallet.wallet_id)
        .eq("balance", fromWallet.balance);

      if (fromError) {
        return errorResponse("Transfer failed - please retry", 409);
      }

      // Update destination wallet
      const { error: toError } = await supabaseAdmin
        .from("wallets")
        .update({ balance: newToBalance, updated_at: new Date().toISOString() })
        .eq("wallet_id", toWallet.wallet_id);

      if (toError) {
        // Rollback source wallet
        await supabaseAdmin
          .from("wallets")
          .update({ balance: fromBalance })
          .eq("wallet_id", fromWallet.wallet_id);
        return errorResponse("Transfer failed - rolled back", 500);
      }

      // Log transactions
      await supabaseAdmin.from("transactions").insert([
        {
          wallet_id: fromWallet.wallet_id,
          type: "transfer_out",
          amount: -amount,
          reference: body.reference,
          related_user: body.to_user_id,
          status: "completed",
        },
        {
          wallet_id: toWallet.wallet_id,
          type: "transfer_in",
          amount: amount,
          reference: body.reference,
          related_user: body.from_user_id,
          status: "completed",
        },
      ]);

      // Audit log
      await createAuditLog(supabaseAdmin, user.userId, user.role, "wallet", "transfer_completed", {
        from_user: body.from_user_id,
        to_user: body.to_user_id,
        amount,
        reference: body.reference,
      });

      return jsonResponse({
        message: "Transfer completed",
        amount: amount,
      });
    }, { module: "wallet", action: "transfer" });
  }

  // POST /wallet/commission (process commission)
  if (path.startsWith("/commission/") && req.method === "POST") {
    const commissionType = path.replace("/commission/", "");
    
    return withAuth(req, ["super_admin", "admin", "finance_manager"], async ({ supabaseAdmin, body, user }) => {
      const validation = validateRequired(body, ["sale_amount", "commission_rate"]);
      if (validation) return errorResponse(validation);

      const saleAmount = Number(body.sale_amount);
      const commissionRate = Number(body.commission_rate);

      // Validate sale amount
      if (!isValidNumber(saleAmount, 0.01, 100000000)) {
        return errorResponse("Invalid sale amount");
      }

      // Validate commission rate based on role type
      const rateLimits = COMMISSION_RATE_LIMITS[commissionType] || { min: 0, max: 100 };
      if (!isValidNumber(commissionRate, rateLimits.min, rateLimits.max)) {
        return errorResponse(`Commission rate must be between ${rateLimits.min}% and ${rateLimits.max}%`);
      }

      // Get target user ID based on commission type
      let targetUserId: string | null = null;
      if (commissionType === "franchise" && body.franchise_id) {
        const { data: franchise } = await supabaseAdmin
          .from("franchise_accounts")
          .select("user_id")
          .eq("id", body.franchise_id)
          .single();
        targetUserId = franchise?.user_id;
      } else if (commissionType === "reseller" && body.reseller_id) {
        const { data: reseller } = await supabaseAdmin
          .from("reseller_accounts")
          .select("user_id")
          .eq("id", body.reseller_id)
          .single();
        targetUserId = reseller?.user_id;
      }

      if (!targetUserId) {
        return errorResponse("Target user not found", 404);
      }

      // Calculate commission
      const commissionAmount = Math.round((saleAmount * commissionRate) / 100 * 100) / 100;

      // Get wallet
      const { data: wallet } = await supabaseAdmin
        .from("wallets")
        .select("*")
        .eq("user_id", targetUserId)
        .single();

      if (!wallet) {
        return errorResponse("Wallet not found for user", 404);
      }

      // Check for duplicate commission (fraud detection)
      if (body.lead_id) {
        const { data: existingCommission } = await supabaseAdmin
          .from("transactions")
          .select("id")
          .eq("wallet_id", wallet.wallet_id)
          .eq("type", "commission")
          .eq("related_sale", body.lead_id);

        if (existingCommission && existingCommission.length > 0) {
          return errorResponse("Commission already processed for this sale", 409);
        }
      }

      // Credit commission with optimistic locking
      const newBalance = (Number(wallet.balance) || 0) + commissionAmount;
      
      const { error: updateError } = await supabaseAdmin
        .from("wallets")
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq("wallet_id", wallet.wallet_id)
        .eq("balance", wallet.balance);

      if (updateError) {
        return errorResponse("Commission processing failed - please retry", 409);
      }

      // Log transaction
      await supabaseAdmin.from("transactions").insert({
        wallet_id: wallet.wallet_id,
        type: "commission",
        amount: commissionAmount,
        reference: `${commissionType} commission: ${commissionRate}% of ₹${saleAmount}`,
        related_user: user.userId,
        related_role: user.role,
        related_sale: body.lead_id || null,
        status: "completed",
      });

      // Audit log
      await createAuditLog(supabaseAdmin, user.userId, user.role, "wallet", "commission_processed", {
        target_user: targetUserId,
        commission_type: commissionType,
        sale_amount: saleAmount,
        commission_rate: commissionRate,
        commission_amount: commissionAmount,
        lead_id: body.lead_id,
      });

      return jsonResponse({
        message: "Commission processed",
        commission_amount: commissionAmount,
        new_balance: newBalance,
      });
    }, { module: "wallet", action: "commission" });
  }

  // GET /wallet/transactions
  if (path === "/transactions" && req.method === "GET") {
    return withAuth(req, [], async ({ supabaseAdmin, user }) => {
      const { data: wallet } = await supabaseAdmin
        .from("wallets")
        .select("wallet_id")
        .eq("user_id", user.userId)
        .single();

      if (!wallet) return jsonResponse({ transactions: [] });

      const urlParams = new URL(req.url);
      const page = Math.max(1, parseInt(urlParams.searchParams.get("page") || "1"));
      const limit = Math.min(100, Math.max(1, parseInt(urlParams.searchParams.get("limit") || "50")));

      const { data: transactions, count } = await supabaseAdmin
        .from("transactions")
        .select("*", { count: "exact" })
        .eq("wallet_id", wallet.wallet_id)
        .order("timestamp", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      return jsonResponse({
        transactions: transactions?.map((t: any) => ({
          id: t.transaction_id,
          type: t.type,
          amount: Number(t.amount) || 0,
          reference: t.reference,
          status: t.status,
          timestamp: t.timestamp,
        })) || [],
        pagination: { page, limit, total: count || 0 },
      });
    }, { module: "wallet", action: "transactions" });
  }

  return errorResponse("Not found", 404);
});
