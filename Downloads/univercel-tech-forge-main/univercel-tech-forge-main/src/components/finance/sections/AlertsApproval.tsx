/**
 * ALERTS & APPROVAL SECTION - DB-Driven
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Settings, Shield, CheckCircle, XCircle, Clock, Eye, ThumbsUp, ThumbsDown, DollarSign, Loader2 } from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';
import { useGlobalActions } from '@/hooks/useGlobalActions';
import { supabase } from '@/integrations/supabase/client';
import { EmptyState } from '@/components/ui/empty-state';

interface AlertsApprovalProps {
  activeView: FinanceView;
}

const AlertsApproval: React.FC<AlertsApprovalProps> = ({ activeView }) => {
  const { approve, reject, update } = useGlobalActions();
  const [loading, setLoading] = useState(true);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [stats, setStats] = useState({ pending: 0, highRisk: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pendingRes, approvedRes] = await Promise.all([
          supabase.from('action_approval_queue').select('*').eq('approval_status', 'pending').order('created_at', { ascending: false }).limit(20),
          supabase.from('approval_audit_logs').select('action').gte('created_at', new Date().toISOString().split('T')[0]),
        ]);
        
        const items = pendingRes.data || [];
        const auditLogs = approvedRes.data || [];

        setPendingApprovals(items);
        setStats({
          pending: items.length,
          highRisk: items.filter(i => (i.risk_score || 0) > 70).length,
          approved: auditLogs.filter(l => l.action === 'approved').length,
          rejected: auditLogs.filter(l => l.action === 'rejected').length,
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const getTitle = () => {
    switch (activeView) {
      case 'alert_high_amount': return 'High Amount Approvals';
      case 'alert_manual_override': return 'Manual Override Requests';
      case 'alert_risky_transaction': return 'Risky Transaction Alerts';
      default: return 'Alerts & Approval';
    }
  };

  const handleApproveRequest = (requestId: string) => { approve('deal', requestId, { action: 'approve' }); };
  const handleRejectRequest = (requestId: string) => { reject('deal', requestId, 'Rejected by Finance Manager'); };
  const handleAlertSettings = () => { update('setting', 'alerts', { action: 'open_settings' }); };

  const statsCards = [
    { label: 'Pending Approvals', value: String(stats.pending), icon: Clock, color: 'amber' },
    { label: 'High Risk Alerts', value: String(stats.highRisk), icon: AlertTriangle, color: 'red' },
    { label: 'Approved Today', value: String(stats.approved), icon: CheckCircle, color: 'emerald' },
    { label: 'Rejected Today', value: String(stats.rejected), icon: XCircle, color: 'slate' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Bell className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{getTitle()}</h1>
            <p className="text-sm text-muted-foreground">Review and approve financial requests</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleAlertSettings}>
          <Settings className="w-4 h-4" /> Alert Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : <Icon className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold text-foreground">{loading ? '...' : stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-500" />
            Pending Approval Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : pendingApprovals.length === 0 ? (
            <EmptyState title="No pending approvals" description="Financial approval requests will appear here" />
          ) : (
            <div className="space-y-4">
              {pendingApprovals.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{request.action_type} - {request.action_target}</p>
                      <p className="text-xs text-muted-foreground">{request.user_role} • {new Date(request.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {request.risk_score && <Badge variant={request.risk_score > 70 ? 'destructive' : 'secondary'}>Risk: {request.risk_score}</Badge>}
                    <div className="flex gap-1">
                      <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApproveRequest(request.id)}>
                        <ThumbsUp className="w-3 h-3" /> Approve
                      </Button>
                      <Button variant="destructive" size="sm" className="gap-1" onClick={() => handleRejectRequest(request.id)}>
                        <ThumbsDown className="w-3 h-3" /> Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsApproval;
