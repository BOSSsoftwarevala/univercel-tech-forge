import React, { useState, useEffect, memo } from 'react';
import { Brain, Clock, ShieldAlert, FileText, Activity, Eye, Pause, RefreshCw, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
  error: 'bg-red-500/20 text-red-400 border-red-500/50',
};

const ActionBtn = memo(({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) => (
  <Button size="sm" className="h-7 px-2 text-xs gap-1 font-medium" onClick={onClick}>
    <Icon className="w-3 h-3" /> {label}
  </Button>
));

interface RowProps {
  handleBoxAction: (actionType: string, entityId: string) => void;
}

export const BossActivityAlertsRow = memo(({ handleBoxAction }: RowProps) => {
  const [data, setData] = useState({ aiJobs: 0, pendingEvents: 0, unresolvedAlerts: 0, todayLogs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const [aiRes, pendingRes, alertsRes, logsRes] = await Promise.all([
          supabase.from('ai_jobs').select('id', { count: 'exact', head: true }).eq('status', 'running'),
          supabase.from('system_events').select('id', { count: 'exact', head: true }).eq('status', 'PENDING'),
          supabase.from('boss_alerts').select('id', { count: 'exact', head: true }).eq('is_resolved', false),
          supabase.from('audit_logs').select('id', { count: 'exact', head: true }).gte('timestamp', today),
        ]);
        setData({
          aiJobs: aiRes.count || 0,
          pendingEvents: pendingRes.count || 0,
          unresolvedAlerts: alertsRes.count || 0,
          todayLogs: logsRes.count || 0,
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <motion.div whileHover={{ y: -2 }} style={{ background: 'linear-gradient(180deg, #0d1a2d 0%, #0a1628 100%)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: 8, overflow: 'hidden' }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(37, 99, 235, 0.15)' }}>
        <div className="flex items-center gap-2">
          <Activity size={16} style={{ color: '#60a5fa' }} />
          <span className="text-sm font-semibold tracking-wider" style={{ color: '#60a5fa' }}>ACTIVITY & ALERTS</span>
        </div>
        <div className="flex items-center gap-4">
          {loading ? <Loader2 size={14} className="animate-spin text-blue-400" /> : (
            <>
              <Badge className={STATUS_COLORS['active']}>AI: {data.aiJobs > 0 ? 'Processing' : 'Idle'}</Badge>
              <Badge className={STATUS_COLORS['pending']}>{data.pendingEvents} Pending</Badge>
              <Badge className={STATUS_COLORS['error']}>{data.unresolvedAlerts} Alerts</Badge>
            </>
          )}
        </div>
      </div>
      <div className="p-4 grid grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="p-3 rounded" style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Brain size={14} style={{ color: '#60a5fa' }} />
            <span className="text-xs font-medium" style={{ color: '#60a5fa' }}>AI STATUS</span>
          </div>
          <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>{loading ? '...' : `${data.aiJobs} active jobs`}</p>
          <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>From AI jobs table</p>
          <div className="mt-3 flex gap-1">
            <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'ai-status')} />
            <ActionBtn icon={FileText} label="Logs" onClick={() => handleBoxAction('viewLogs', 'ai-status')} />
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="p-3 rounded" style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} style={{ color: '#60a5fa' }} />
            <span className="text-xs font-medium" style={{ color: '#60a5fa' }}>PENDING ACTIONS</span>
          </div>
          <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>{loading ? '...' : `${data.pendingEvents} items`}</p>
          <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>Awaiting review</p>
          <div className="mt-3 flex gap-1">
            <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'pending-actions')} />
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="p-3 rounded" style={{ background: 'rgba(220, 38, 38, 0.05)', border: '1px solid rgba(220, 38, 38, 0.1)' }}>
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={14} style={{ color: '#dc2626' }} />
            <span className="text-xs font-medium" style={{ color: '#dc2626' }}>ALERTS</span>
          </div>
          <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>{loading ? '...' : `${data.unresolvedAlerts} unresolved`}</p>
          <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>From alerts table</p>
          <div className="mt-3 flex gap-1">
            <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'alerts')} />
            <ActionBtn icon={Pause} label="Pause" onClick={() => handleBoxAction('pause', 'alerts')} />
          </div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="p-3 rounded" style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} style={{ color: '#60a5fa' }} />
            <span className="text-xs font-medium" style={{ color: '#60a5fa' }}>LOGS</span>
          </div>
          <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>{loading ? '...' : `${data.todayLogs} entries today`}</p>
          <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>Audit trail</p>
          <div className="mt-3 flex gap-1">
            <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', 'logs')} />
            <ActionBtn icon={RefreshCw} label="Refresh" onClick={() => handleBoxAction('update', 'logs')} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});
