import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Search,
  Download,
  Eye,
  MoreHorizontal,
  Shield,
  Loader2,
  RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PayoutRequest {
  payout_id: string;
  user_id: string;
  amount: number;
  status: string;
  payment_method: string;
  user_role: string;
  timestamp: string;
  requested_at: string;
  approved_at: string | null;
  approved_by: string | null;
  rejected_at: string | null;
  rejected_by: string | null;
  rejection_reason: string | null;
  wallet_debited: boolean;
}

const PayoutManager = () => {
  const { toast } = useToast();
  const { userRole, user } = useAuth();
  const [filter, setFilter] = useState("all");
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; payoutId: string | null }>({
    open: false,
    payoutId: null,
  });
  const [rejectReason, setRejectReason] = useState("");
  const [stats, setStats] = useState({
    requested: { value: 0, count: 0 },
    pending: { value: 0, count: 0 },
    approved: { value: 0, count: 0 },
    rejected: { value: 0, count: 0 },
  });

  // Check if user can approve/reject payouts (Super Admin or Master only)
  const canApprove = userRole === "super_admin" || userRole === "master";

  const fetchPayouts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("payout_requests")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) throw error;

      setPayouts(data || []);

      // Calculate stats
      const newStats = {
        requested: { value: 0, count: 0 },
        pending: { value: 0, count: 0 },
        approved: { value: 0, count: 0 },
        rejected: { value: 0, count: 0 },
      };

      (data || []).forEach((p: PayoutRequest) => {
        const amount = Number(p.amount) || 0;
        if (p.status === "requested") {
          newStats.requested.value += amount;
          newStats.requested.count++;
        } else if (p.status === "pending") {
          newStats.pending.value += amount;
          newStats.pending.count++;
        } else if (p.status === "approved" || p.status === "completed") {
          newStats.approved.value += amount;
          newStats.approved.count++;
        } else if (p.status === "rejected") {
          newStats.rejected.value += amount;
          newStats.rejected.count++;
        }
      });

      setStats(newStats);
    } catch (error: any) {
      toast({
        title: "Error fetching payouts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      requested: "bg-amber-100 text-amber-700 border-amber-300",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      approved: "bg-cyan-100 text-cyan-700 border-cyan-300",
      processing: "bg-blue-100 text-blue-700 border-blue-300",
      completed: "bg-green-100 text-green-700 border-green-300",
      rejected: "bg-red-100 text-red-700 border-red-300",
      failed: "bg-red-100 text-red-700 border-red-300",
    };
    return styles[status] || styles.requested;
  };

  const handleApprove = async (payoutId: string) => {
    if (!canApprove) {
      toast({
        title: "Access Denied",
        description: "Only Super Admin or Master can approve payouts.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(payoutId);
    try {
      const { data, error } = await supabase.rpc("approve_payout", {
        p_payout_id: payoutId,
        p_approver_id: user?.id,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; amount?: number; new_balance?: number };
      if (!result.success) {
        throw new Error(result.error || "Unknown error");
      }

      toast({
        title: "Payout Approved",
        description: `Payout approved. Wallet debited ₹${result.amount}. New balance: ₹${result.new_balance}`,
      });

      fetchPayouts();
    } catch (error: any) {
      toast({
        title: "Approval Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectDialog.payoutId) return;
    
    if (!canApprove) {
      toast({
        title: "Access Denied",
        description: "Only Super Admin or Master can reject payouts.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(rejectDialog.payoutId);
    try {
      const { data, error } = await supabase.rpc("reject_payout", {
        p_payout_id: rejectDialog.payoutId,
        p_rejector_id: user?.id,
        p_reason: rejectReason || "Rejected by administrator",
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; amount?: number };
      if (!result.success) {
        throw new Error(result.error || "Unknown error");
      }

      toast({
        title: "Payout Rejected",
        description: `Payout rejected. Amount ₹${result.amount} returned to wallet.`,
        variant: "destructive",
      });

      setRejectDialog({ open: false, payoutId: null });
      setRejectReason("");
      fetchPayouts();
    } catch (error: any) {
      toast({
        title: "Rejection Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const openRejectDialog = (payoutId: string) => {
    if (!canApprove) {
      toast({
        title: "Access Denied",
        description: "Only Super Admin or Master can reject payouts.",
        variant: "destructive",
      });
      return;
    }
    setRejectDialog({ open: true, payoutId });
  };

  const filteredPayouts = payouts.filter((p) => filter === "all" || p.status === filter);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payout Manager</h1>
          <p className="text-slate-500 text-sm">
            {canApprove 
              ? "Approve or reject withdrawal requests. Only approved payouts debit the wallet."
              : "View payout requests. Contact Super Admin to approve/reject."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchPayouts} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Authorization Notice */}
      {!canApprove && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">View Only Mode</p>
              <p className="text-sm text-amber-600 dark:text-amber-300">
                Only Super Admin or Master can approve/reject payouts. Wallet is debited only after approval.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Requested</p>
            <div className="flex items-end justify-between mt-1">
              <p className="text-2xl font-bold text-amber-600">{formatCurrency(stats.requested.value)}</p>
              <Badge variant="secondary" className="text-xs">{stats.requested.count} items</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Pending Review</p>
            <div className="flex items-end justify-between mt-1">
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pending.value)}</p>
              <Badge variant="secondary" className="text-xs">{stats.pending.count} items</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Approved</p>
            <div className="flex items-end justify-between mt-1">
              <p className="text-2xl font-bold text-cyan-600">{formatCurrency(stats.approved.value)}</p>
              <Badge variant="secondary" className="text-xs">{stats.approved.count} items</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Rejected</p>
            <div className="flex items-end justify-between mt-1">
              <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.rejected.value)}</p>
              <Badge variant="secondary" className="text-xs">{stats.rejected.count} items</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search by ID or role..." className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          {["all", "requested", "pending", "approved", "rejected"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className={filter === f ? "bg-cyan-600 hover:bg-cyan-700" : ""}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Payouts Table */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Payout Queue
            {canApprove && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                <Shield className="w-3 h-3 mr-1" />
                Approval Access
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
            </div>
          ) : filteredPayouts.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No payout requests found
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPayouts.map((payout) => (
                <div
                  key={payout.payout_id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-sm font-medium">
                      {(payout.user_role || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {payout.payout_id.slice(0, 8)}...
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {payout.user_role || "Unknown"}
                        </Badge>
                        {!payout.wallet_debited && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                            Wallet Not Debited
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {payout.payment_method} • {new Date(payout.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(Number(payout.amount))}
                      </p>
                      {payout.rejection_reason && (
                        <p className="text-xs text-red-500">{payout.rejection_reason}</p>
                      )}
                    </div>

                    <Badge className={`${getStatusBadge(payout.status)} border`}>
                      {payout.status === "requested" && <Clock className="w-3 h-3 mr-1" />}
                      {payout.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                      {payout.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {payout.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                      {payout.status.replace("_", " ")}
                    </Badge>

                    <div className="flex items-center gap-2">
                      {(payout.status === "requested" || payout.status === "pending") && canApprove && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-cyan-600 border-cyan-300 hover:bg-cyan-50"
                            onClick={() => handleApprove(payout.payout_id)}
                            disabled={isProcessing === payout.payout_id}
                          >
                            {isProcessing === payout.payout_id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => openRejectDialog(payout.payout_id)}
                            disabled={isProcessing === payout.payout_id}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {(payout.status === "requested" || payout.status === "pending") && !canApprove && (
                        <Badge variant="outline" className="text-xs">
                          Awaiting Approval
                        </Badge>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Download Invoice</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onOpenChange={(open) => setRejectDialog({ open, payoutId: open ? rejectDialog.payoutId : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payout Request</DialogTitle>
            <DialogDescription>
              This will reject the payout and return funds to the user's wallet if already debited.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog({ open: false, payoutId: null })}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={isProcessing !== null}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Reject Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayoutManager;