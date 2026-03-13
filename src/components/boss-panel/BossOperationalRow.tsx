import React, { useState, useEffect, memo } from 'react';
import { Crown, Brain, Cpu, CreditCard, Globe2, ShieldAlert, Eye, Edit3, Play, StopCircle, Pause, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const T = { card: '#111827', border: '#1f2937', primary: '#2563eb', text: '#ffffff', muted: '#9ca3af' };
const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
  error: 'bg-red-500/20 text-red-400 border-red-500/50',
};

const ActionBtn = memo(({ icon: Icon, label, onClick, variant = 'default' }: {
  icon: React.ElementType; label: string; onClick: () => void; variant?: 'default' | 'destructive' | 'outline';
}) => (
  <Button size="sm" variant={variant} className="h-7 px-2 text-xs gap-1 font-medium" onClick={onClick}>
    <Icon className="w-3 h-3" /> {label}
  </Button>
));

interface RowProps {
  handleBoxAction: (actionType: string, entityId: string) => void;
}

export const BossOperationalRow = memo(({ handleBoxAction }: RowProps) => {
  const [data, setData] = useState({ aiRequests: 0, pendingTasks: 0, openTickets: 0, alertCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [aiRes, ticketsRes, alertsRes] = await Promise.all([
          supabase.from('ai_usage_logs').select('id', { count: 'exact', head: true }),
          supabase.from('system_events').select('id', { count: 'exact', head: true }).eq('status', 'PENDING'),
          supabase.from('boss_alerts').select('id', { count: 'exact', head: true }).eq('is_resolved', false),
        ]);
        setData({
          aiRequests: aiRes.count || 0,
          pendingTasks: 0,
          openTickets: ticketsRes.count || 0,
          alertCount: alertsRes.count || 0,
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const cards = [
    { icon: Crown, label: 'CEO', value: loading ? '...' : `${data.pendingTasks} Tasks`, sub: 'Pending actions', id: 'ceo', actions: [{ icon: Eye, label: 'View', act: 'view' }, { icon: Edit3, label: 'Edit', act: 'edit' }] },
    { icon: Brain, label: 'VALA AI', value: loading ? '...' : `${data.aiRequests} Requests`, sub: 'AI processing logs', id: 'vala-ai', actions: [{ icon: Eye, label: 'View', act: 'view' }, { icon: Play, label: 'Start AI', act: 'startAi' }, { icon: StopCircle, label: 'Stop AI', act: 'stopAi', variant: 'destructive' as const }] },
    { icon: Cpu, label: 'SERVER', value: '—', sub: 'Server metrics', id: 'server', actions: [{ icon: Eye, label: 'View', act: 'view' }, { icon: Play, label: 'Start', act: 'start' }, { icon: StopCircle, label: 'Stop', act: 'stop', variant: 'destructive' as const }] },
    { icon: CreditCard, label: 'SALES & SUPPORT', value: loading ? '...' : `${data.openTickets} Open`, sub: 'Pending events', id: 'sales', actions: [{ icon: Eye, label: 'View', act: 'view' }, { icon: Edit3, label: 'Edit', act: 'edit' }] },
    { icon: Globe2, label: 'FRANCHISE OPS', value: '—', sub: 'Franchise operations', id: 'franchise-ops', actions: [{ icon: Eye, label: 'View', act: 'view' }, { icon: Edit3, label: 'Edit', act: 'edit' }] },
    { icon: ShieldAlert, label: 'SYSTEM HEALTH', value: loading ? '...' : `${data.alertCount} Alerts`, sub: 'Unresolved alerts', id: 'system-health', actions: [{ icon: Eye, label: 'View', act: 'view' }, { icon: Pause, label: 'Pause', act: 'pause' }] },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <motion.div key={card.id} whileHover={{ y: -2 }} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <card.icon size={16} style={{ color: T.primary }} />
                <span className="text-sm font-semibold" style={{ color: T.text }}>{card.label}</span>
              </div>
              {loading ? <Loader2 size={12} className="animate-spin text-blue-400" /> : <Badge className={STATUS_COLORS['active']}>Active</Badge>}
            </div>
            <p className="text-lg font-bold" style={{ color: T.text }}>{card.value}</p>
            <p className="text-xs" style={{ color: T.muted }}>{card.sub}</p>
          </div>
          <div className="px-3 py-2 flex gap-2 border-t border-white/5">
            {card.actions.map((a) => (
              <ActionBtn key={a.act} icon={a.icon} label={a.label} onClick={() => handleBoxAction(a.act, card.id)} variant={(a as any).variant || 'default'} />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
});
