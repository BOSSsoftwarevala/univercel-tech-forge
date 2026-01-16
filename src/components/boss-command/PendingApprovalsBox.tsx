import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Pause, DollarSign, User, Shield, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface ApprovalItem {
  id: string;
  type: 'payment' | 'role' | 'legal' | 'reseller';
  title: string;
  requestedBy: string;
  entity: string;
  financialImpact?: number;
  timePending: Date;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  tableKey: string;
  realId: string;
}

export function PendingApprovalsBox() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const fetchApprovals = async () => {
    try {
      const [approvalsRes, actionRes, resellerRes, payoutRes] = await Promise.all([
        supabase.from('approvals').select('*').eq('status', 'pending').order('created_at', { ascending: true }).limit(50),
        supabase.from('action_approval_queue').select('*').eq('approval_status', 'pending').order('created_at', { ascending: true }).limit(50),
        supabase.from('reseller_applications').select('*').eq('status', 'pending').order('created_at', { ascending: true }).limit(50),
        supabase.from('payout_requests').select('*').eq('status', 'pending').order('requested_at', { ascending: true }).limit(50),
      ]);

      const items: ApprovalItem[] = [];

      approvalsRes.data?.forEach(a => {
        items.push({
          id: `approval-${a.id}`, tableKey: 'approvals', realId: a.id,
          type: 'legal', title: a.request_type || 'Approval', requestedBy: 'User', entity: 'System',
          timePending: new Date(a.created_at || Date.now()),
          riskLevel: (a.risk_score || 0) > 70 ? 'high' : (a.risk_score || 0) > 40 ? 'medium' : 'low',
          source: 'System'
        });
      });

      actionRes.data?.forEach(a => {
        items.push({
          id: `action-${a.id}`, tableKey: 'action_approval_queue', realId: a.id,
          type: 'role', title: `${a.action_type}: ${a.action_target}`, requestedBy: a.user_role || 'User', entity: a.action_target,
          timePending: new Date(a.created_at || Date.now()),
          riskLevel: (a.risk_score || 0) > 70 ? 'critical' : (a.risk_score || 0) > 50 ? 'high' : 'medium',
          source: 'Action'
        });
      });

      resellerRes.data?.forEach(a => {
        items.push({
          id: `reseller-${a.id}`, tableKey: 'reseller_applications', realId: a.id,
          type: 'reseller', title: `Reseller: ${a.full_name || 'New'}`, requestedBy: a.email || 'Unknown', entity: 'Application',
          timePending: new Date(a.created_at || Date.now()), riskLevel: 'medium', source: 'Application'
        });
      });

      payoutRes.data?.forEach(a => {
        items.push({
          id: `payout-${a.payout_id}`, tableKey: 'payout_requests', realId: a.payout_id,
          type: 'payment', title: `Payout: ₹${(a.amount || 0).toLocaleString()}`, requestedBy: a.user_role || 'User',
          entity: a.user_id?.slice(0, 8) || 'User', financialImpact: a.amount,
          timePending: new Date(a.requested_at || Date.now()),
          riskLevel: (a.amount || 0) > 100000 ? 'critical' : (a.amount || 0) > 50000 ? 'high' : 'medium',
          source: 'Finance'
        });
      });

      items.sort((a, b) => {
        const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel] || a.timePending.getTime() - b.timePending.getTime();
      });

      setApprovals(items);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
    const interval = setInterval(fetchApprovals, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (item: ApprovalItem, action: 'approved' | 'rejected') => {
    setProcessingIds(prev => new Set(prev).add(item.id));
    try {
      const statusField = item.tableKey === 'action_approval_queue' ? 'approval_status' : 'status';
      const idField = item.tableKey === 'payout_requests' ? 'payout_id' : 'id';
      
      await supabase.from(item.tableKey as any).update({ [statusField]: action }).eq(idField, item.realId);
      toast.success(action === 'approved' ? 'Approved' : 'Rejected');
      setApprovals(prev => prev.filter(a => a.id !== item.id));
      setSelectedIds(prev => { const next = new Set(prev); next.delete(item.id); return next; });
    } catch (error) {
      toast.error('Failed');
    } finally {
      setProcessingIds(prev => { const next = new Set(prev); next.delete(item.id); return next; });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment': return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'role': return <Shield className="w-4 h-4 text-blue-400" />;
      case 'reseller': return <User className="w-4 h-4 text-cyan-400" />;
      default: return <FileText className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getRiskBadge = (level: string) => {
    const styles: Record<string, string> = {
      critical: 'bg-red-600 text-white', high: 'bg-red-500/20 text-red-400',
      medium: 'bg-amber-500/20 text-amber-400', low: 'bg-zinc-500/20 text-zinc-400'
    };
    return <Badge className={`${styles[level]} text-[10px] px-1.5`}>{level.toUpperCase()}</Badge>;
  };

  return (
    <div className="bg-[#0d0d12] border border-zinc-800/80 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-[#0a0a0f]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <h3 className="font-semibold text-white text-sm">PENDING APPROVALS</h3>
          <Badge className="bg-red-500/20 text-red-400 text-xs">{approvals.length}</Badge>
        </div>
        {selectedIds.size > 0 && (
          <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700 h-7 text-xs"
            onClick={() => { selectedIds.forEach(id => { const item = approvals.find(a => a.id === id); if (item) handleAction(item, 'approved'); }); }}>
            <CheckCircle2 className="w-3 h-3" /> Approve {selectedIds.size}
          </Button>
        )}
      </div>

      <ScrollArea className="h-[320px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-32"><Loader2 className="w-5 h-5 animate-spin text-zinc-500" /></div>
        ) : approvals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-zinc-500">
            <CheckCircle2 className="w-8 h-8 mb-2 text-emerald-500/50" /><span className="text-sm">All caught up!</span>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {approvals.map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`p-3 hover:bg-zinc-800/30 ${item.riskLevel === 'critical' ? 'bg-red-500/5' : ''}`}>
                <div className="flex items-start gap-3">
                  <Checkbox checked={selectedIds.has(item.id)} onCheckedChange={() => {
                    setSelectedIds(prev => { const next = new Set(prev); next.has(item.id) ? next.delete(item.id) : next.add(item.id); return next; });
                  }} className="mt-1 border-zinc-600" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeIcon(item.type)}
                      <span className="text-sm font-medium text-white truncate">{item.title}</span>
                      {getRiskBadge(item.riskLevel)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span>By: {item.requestedBy}</span>
                      {item.financialImpact && <span className="text-emerald-400 font-mono">₹{item.financialImpact.toLocaleString()}</span>}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-600">
                      <Clock className="w-3 h-3" />{formatDistanceToNow(item.timePending, { addSuffix: true })}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-emerald-400 hover:bg-emerald-500/10"
                      onClick={() => handleAction(item, 'approved')} disabled={processingIds.has(item.id)}>
                      {processingIds.has(item.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400 hover:bg-red-500/10"
                      onClick={() => handleAction(item, 'rejected')} disabled={processingIds.has(item.id)}>
                      <XCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-amber-400 hover:bg-amber-500/10"><Pause className="w-4 h-4" /></Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
