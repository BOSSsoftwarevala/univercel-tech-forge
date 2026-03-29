/**
 * REFUND & ADJUSTMENT SECTION
 * PERMANENT POLICY: No Return / No Exchange / No Refund for digital products
 * Only wallet adjustments allowed (with Boss approval)
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ShieldAlert,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Search,
  Eye,
  Ban,
  AlertTriangle,
  Lock,
  FileText
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';
import { useFinanceSecurityGuard } from '@/hooks/useFinanceSecurityGuard';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface RefundAdjustmentProps {
  activeView: FinanceView;
}

const RefundAdjustment: React.FC<RefundAdjustmentProps> = ({ activeView }) => {
  const { isRefundAllowed, logFinancialAction, requestBossApproval } = useFinanceSecurityGuard();
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  const [showAdjustmentDialog, setShowAdjustmentDialog] = useState(false);

  const getTitle = () => {
    switch (activeView) {
      case 'refund_requests': return 'Refund Requests';
      case 'refund_approved': return 'Approved Refunds';
      case 'refund_rejected': return 'Rejected Refunds';
      case 'refund_wallet_adjust': return 'Wallet Adjustments';
      default: return 'Refund & Adjustment';
    }
  };

  const handleRefundAttempt = () => {
    const result = isRefundAllowed();
    if (!result.allowed) {
      toast.error('Refund Not Allowed', { description: result.reason, duration: 6000 });
      logFinancialAction('refund_attempt_blocked', 'refund_management', {
        policy: 'no_return_no_exchange',
        reason: result.reason
      });
    }
  };

  const handleWalletAdjustment = async () => {
    const approvalId = await requestBossApproval('wallet_adjustment', 0, {
      type: 'wallet_credit_debit',
      requires_boss_approval: true
    });
    if (approvalId) {
      toast.info('Adjustment request sent for Boss approval', { description: 'No financial action proceeds without authorization.' });
      await logFinancialAction('wallet_adjustment_requested', 'refund_management', { approval_id: approvalId });
    }
    setShowAdjustmentDialog(false);
  };

  const policies = [
    { icon: Ban, title: 'No Return Policy', desc: 'Digital products cannot be returned once delivered.', color: 'text-red-500' },
    { icon: Ban, title: 'No Exchange Policy', desc: 'Software products are non-exchangeable.', color: 'text-red-500' },
    { icon: Ban, title: 'No Refund Policy', desc: 'All purchases are final sale. No refund after payment confirmation.', color: 'text-red-500' },
    { icon: Lock, title: 'Boss Approval Required', desc: 'Any exceptional financial adjustment requires Boss/Admin approval.', color: 'text-amber-500' },
    { icon: ShieldAlert, title: 'Fraud Prevention Active', desc: 'Suspicious refund attempts are logged and flagged.', color: 'text-blue-500' },
  ];

  const stats = [
    { label: 'Policy', value: 'NO REFUND', icon: Ban, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30' },
    { label: 'Attempts Blocked', value: 'All', icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { label: 'Adjustments', value: 'Approval Only', icon: Lock, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { label: 'Security Status', value: 'ENFORCED', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Permanent security policy enforced on all digital products</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowPolicyDialog(true)}>
            <FileText className="w-4 h-4" />
            View Policy
          </Button>
          {activeView === 'refund_wallet_adjust' && (
            <Button size="sm" className="gap-2" onClick={() => setShowAdjustmentDialog(true)}>
              <ArrowUpDown className="w-4 h-4" />
              Request Adjustment
            </Button>
          )}
        </div>
      </div>

      {/* PERMANENT POLICY BANNER */}
      <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-red-800 dark:text-red-300">⚠️ PERMANENT SECURITY POLICY</h2>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                All marketplace digital products are <strong>FINAL SALE</strong>. No return, no exchange, no refund after purchase. 
                Digital software cannot be returned once delivered. This policy is permanently enforced and cannot be overridden.
              </p>
              <div className="flex gap-3 mt-3">
                <Badge variant="destructive" className="text-xs font-semibold">NO RETURN</Badge>
                <Badge variant="destructive" className="text-xs font-semibold">NO EXCHANGE</Badge>
                <Badge variant="destructive" className="text-xs font-semibold">NO REFUND</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Policy Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {policies.map((policy, idx) => {
          const Icon = policy.icon;
          return (
            <Card key={idx} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 ${policy.color}`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{policy.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{policy.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Refund Attempt Section (shows blocked message) */}
      {activeView !== 'refund_wallet_adjust' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-500" />
              Refund Processing — DISABLED
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Ban className="w-16 h-16 mx-auto text-red-300 dark:text-red-700 mb-4" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Refund System Permanently Disabled</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                Per company policy, all digital software products are final sale. 
                The refund processing system has been permanently disabled to prevent unauthorized refund attempts.
              </p>
              <Button variant="outline" size="sm" onClick={handleRefundAttempt} className="text-red-600 border-red-200">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Why can't I process refunds?
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallet Adjustments (only with approval) */}
      {activeView === 'refund_wallet_adjust' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-blue-500" />
              Wallet Adjustments (Boss Approval Required)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Lock className="w-12 h-12 mx-auto text-amber-400 mb-4" />
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                Wallet adjustments (credits/debits) require Boss/Admin approval. 
                No financial adjustment can be executed without proper authorization.
              </p>
              <Button size="sm" onClick={() => setShowAdjustmentDialog(true)} className="gap-2">
                <ArrowUpDown className="w-4 h-4" />
                Request New Adjustment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Policy Dialog */}
      <Dialog open={showPolicyDialog} onOpenChange={setShowPolicyDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              Finance Security Policy
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">Policy Type: PERMANENT</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">This policy cannot be modified or overridden by any user.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Ban className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-700 dark:text-slate-300"><strong>No Return:</strong> Digital products cannot be returned after delivery.</p>
              </div>
              <div className="flex items-start gap-2">
                <Ban className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-700 dark:text-slate-300"><strong>No Exchange:</strong> Software products are non-exchangeable.</p>
              </div>
              <div className="flex items-start gap-2">
                <Ban className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-700 dark:text-slate-300"><strong>No Refund:</strong> All purchases are final. No refund after payment confirmation.</p>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-700 dark:text-slate-300"><strong>OTP Required:</strong> All critical financial actions require OTP verification.</p>
              </div>
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-700 dark:text-slate-300"><strong>Fraud Prevention:</strong> Suspicious activity automatically blocked and reported.</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPolicyDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjustment Request Dialog */}
      <Dialog open={showAdjustmentDialog} onOpenChange={setShowAdjustmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-500" />
              Request Wallet Adjustment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                ⚠️ This request will be sent to Boss/Admin for approval. No adjustment is executed without authorization.
              </p>
            </div>
            <p className="text-sm text-slate-500">
              Wallet adjustments are the only permitted financial modification. 
              All adjustments are logged immutably and require Boss approval before execution.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjustmentDialog(false)}>Cancel</Button>
            <Button onClick={handleWalletAdjustment} className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Submit for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RefundAdjustment;
