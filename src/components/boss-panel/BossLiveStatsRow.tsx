import React, { useState, useEffect, memo } from 'react';
import { DollarSign, Users, Building2, Server, Eye, Edit3, RefreshCw, Play, StopCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
  error: 'bg-red-500/20 text-red-400 border-red-500/50',
};

const T = {
  primary: '#2563eb',
  primaryLight: '#3b82f6',
};

const Chart = memo(({ type = 'bar' }: { type?: 'bar' | 'line' }) => (
  <div className="flex items-end justify-around gap-1 p-3 rounded" style={{ height: 80, background: 'rgba(37,99,235,0.05)' }}>
    {type === 'bar' ? (
      [35, 60, 40, 75, 50, 65, 85, 55, 70, 80, 45, 90].map((h, i) => (
        <div key={i} style={{ width: '100%', height: `${h}%`, background: i === 11 ? T.primary : 'rgba(37,99,235,0.25)', borderRadius: '2px 2px 0 0' }} />
      ))
    ) : (
      <svg width="100%" height="100%" viewBox="0 0 200 50" preserveAspectRatio="none">
        <defs><linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.primary} stopOpacity="0.3"/><stop offset="100%" stopColor={T.primary} stopOpacity="0"/></linearGradient></defs>
        <path d="M0,40 20,35 40,25 60,30 80,18 100,22 120,12 140,28 160,8 180,18 200,5 200,50 0,50Z" fill="url(#chartGrad2)"/>
        <polyline points="0,40 20,35 40,25 60,30 80,18 100,22 120,12 140,28 160,8 180,18 200,5" fill="none" stroke={T.primary} strokeWidth="2"/>
      </svg>
    )}
  </div>
));

const ActionBtn = memo(({ icon: Icon, label, onClick, variant = 'default', loading = false }: {
  icon: React.ElementType; label: string; onClick: () => void; variant?: 'default' | 'destructive' | 'outline'; loading?: boolean;
}) => (
  <Button size="sm" variant={variant} className="h-7 px-2 text-xs gap-1 font-medium" onClick={onClick} disabled={loading}>
    <Icon className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> {label}
  </Button>
));

interface RowProps {
  handleBoxAction: (actionType: string, entityId: string) => void;
}

export const BossLiveStatsRow = memo(({ handleBoxAction }: RowProps) => {
  const [stats, setStats] = useState({ revenue: 0, users: 0, franchises: 0, uptime: '—' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [walletsRes, profilesRes, franchiseRes] = await Promise.all([
          supabase.from('wallets').select('balance').limit(1000),
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('franchise_accounts').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        ]);

        const totalRevenue = (walletsRes.data || []).reduce((sum, w) => sum + (Number(w.balance) || 0), 0);

        setStats({
          revenue: totalRevenue,
          users: profilesRes.count || 0,
          franchises: franchiseRes.count || 0,
          uptime: '—',
        });
      } catch (e) { console.error('Stats fetch error:', e); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val}`;
  };

  const cards = [
    { icon: DollarSign, label: 'REVENUE', value: loading ? '...' : formatCurrency(stats.revenue), sub: 'From wallet balances', id: 'revenue', chart: 'bar' as const, actions: ['view', 'edit', 'update'] },
    { icon: Users, label: 'USERS', value: loading ? '...' : stats.users.toLocaleString(), sub: 'Registered profiles', id: 'users', chart: 'line' as const, actions: ['view', 'edit', 'update'] },
    { icon: Building2, label: 'FRANCHISES', value: loading ? '...' : stats.franchises.toLocaleString(), sub: 'Active franchises', id: 'franchises', chart: 'bar' as const, actions: ['view', 'edit', 'update'] },
    { icon: Server, label: 'SYSTEM', value: stats.uptime, sub: 'System status', id: 'system', chart: 'line' as const, actions: ['view', 'start', 'stop'] },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <motion.div key={card.id} whileHover={{ y: -2 }} style={{ background: 'linear-gradient(180deg, #0d1a2d 0%, #0a1628 100%)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: 8, overflow: 'hidden' }}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <card.icon size={18} style={{ color: '#60a5fa' }} />
                <span className="text-xs font-semibold tracking-wider" style={{ color: '#60a5fa' }}>{card.label}</span>
              </div>
              {loading ? <Loader2 size={14} className="animate-spin text-blue-400" /> : <Badge className={STATUS_COLORS['active']}>Active</Badge>}
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color: '#e2e8f0' }}>{card.value}</p>
            <p className="text-xs" style={{ color: '#94a3b8' }}>{card.sub}</p>
            <Chart type={card.chart} />
          </div>
          <div className="px-4 py-2 flex gap-2 border-t border-blue-500/10">
            {card.actions.includes('view') && <ActionBtn icon={Eye} label="View" onClick={() => handleBoxAction('view', card.id)} />}
            {card.actions.includes('edit') && <ActionBtn icon={Edit3} label="Edit" onClick={() => handleBoxAction('edit', card.id)} />}
            {card.actions.includes('update') && <ActionBtn icon={RefreshCw} label="Update" onClick={() => handleBoxAction('update', card.id)} />}
            {card.actions.includes('start') && <ActionBtn icon={Play} label="Start" onClick={() => handleBoxAction('start', card.id)} />}
            {card.actions.includes('stop') && <ActionBtn icon={StopCircle} label="Stop" onClick={() => handleBoxAction('stop', card.id)} variant="destructive" />}
          </div>
        </motion.div>
      ))}
    </div>
  );
});
