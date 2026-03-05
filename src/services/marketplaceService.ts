// marketplaceService.ts
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface OrderDetails {
  productId: string;
  productName: string;
  franchiseId: string;
  userId: string;
  userRole: string;
  amount: number;
  baseAmount: number;
  discountPercent: number;
  currentWalletBalance: number;
  requirements?: string;
}

export interface PlaceOrderResult {
  success: boolean;
  orderNumber?: string;
  error?: string;
}

class MarketplaceService {
  async placeOrder(orderDetails: OrderDetails): Promise<PlaceOrderResult> {
    const {
      productId,
      productName,
      franchiseId,
      userId,
      userRole,
      amount,
      baseAmount,
      discountPercent,
      currentWalletBalance,
      requirements,
    } = orderDetails;

    // Validate sufficient balance
    if (currentWalletBalance < amount) {
      const shortfall = amount - currentWalletBalance;
      toast.error(`Insufficient balance. Please add ₹${shortfall.toLocaleString()} to proceed.`);
      return { success: false, error: 'Insufficient wallet balance' };
    }

    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const newBalance = currentWalletBalance - amount;

    // 1. Create order record
    const { data: orderRecord, error: orderError } = await (supabase as any).from('orders').insert({
      franchise_id: franchiseId,
      product_id: productId,
      product_name: productName,
      amount,
      base_amount: baseAmount,
      discount_percent: discountPercent,
      requirements: requirements || null,
      status: 'pending',
      order_number: orderNumber,
      ordered_by: userId,
    }).select('id').single();

    if (orderError) {
      return { success: false, error: orderError.message };
    }

    // 2. Record wallet debit in ledger (compensate by deleting order on failure)
    const { error: walletError } = await supabase.from('franchise_wallet_ledger').insert({
      franchise_id: franchiseId,
      amount,
      balance_after: newBalance,
      category: 'software_purchase',
      transaction_type: 'debit',
      description: `Purchase: ${productName} (${orderNumber})`,
      reference_id: orderNumber,
      reference_type: 'marketplace_order',
    });

    if (walletError) {
      // Compensating transaction: remove the order record
      await (supabase as any).from('orders').delete().eq('id', orderRecord?.id);
      return { success: false, error: walletError.message };
    }

    // 3. Log to live_activity_logs (fire-and-forget — non-critical)
    supabase.from('live_activity_logs').insert({
      user_id: userId,
      user_role: userRole as any,
      action_type: 'lead_action' as any,
      action_description: `Marketplace order placed: ${productName}`,
      metadata: {
        order_number: orderNumber,
        product_id: productId,
        product_name: productName,
        amount,
      },
      status: 'success' as any,
    }).then(({ error }) => {
      if (error) console.error('[MarketplaceService] Activity log failed:', error.message);
    });

    // 4. Send in-app notification to user (fire-and-forget — non-critical)
    supabase.from('user_notifications').insert({
      user_id: userId,
      type: 'order',
      message: `Your order for ${productName} has been placed successfully. Order: ${orderNumber}`,
      event_type: 'order_placed',
    }).then(({ error }) => {
      if (error) console.error('[MarketplaceService] Notification failed:', error.message);
    });

    return { success: true, orderNumber };
  }

  async notifyUsers(orderDetails: Partial<OrderDetails>): Promise<void> {
    if (!orderDetails.userId || !orderDetails.productName) return;
    await supabase.from('user_notifications').insert({
      user_id: orderDetails.userId,
      type: 'info',
      message: `Update on your order for ${orderDetails.productName}`,
      event_type: 'order_update',
    });
  }
}

export const marketplaceService = new MarketplaceService();