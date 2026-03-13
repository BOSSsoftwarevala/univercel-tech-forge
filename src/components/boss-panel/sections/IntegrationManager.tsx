import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Link2, CheckCircle, XCircle, AlertCircle, RefreshCw, Plus,
  Shield, Zap, Globe, Database, MessageSquare, CreditCard,
  Mail, Cloud, Activity, Settings, Eye, Power
} from 'lucide-react';
import { toast } from 'sonner';

const T = {
  glass: 'hsla(222, 47%, 11%, 0.72)',
  glassBorder: 'hsla(215, 40%, 35%, 0.25)',
  text: 'hsl(210, 40%, 98%)',
  muted: 'hsl(215, 22%, 65%)',
  dim: 'hsl(215, 15%, 42%)',
  blue: 'hsl(217, 92%, 65%)',
  green: 'hsl(160, 84%, 44%)',
  amber: 'hsl(38, 95%, 55%)',
  red: 'hsl(346, 82%, 55%)',
  purple: 'hsl(262, 85%, 63%)',
  cyan: 'hsl(199, 90%, 55%)',
  rowHover: 'hsla(217, 91%, 60%, 0.07)',
};

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const rise = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 28 } } };

const Glass = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div variants={rise} className={`rounded-2xl overflow-hidden ${className}`}
    style={{ background: T.glass, backdropFilter: 'blur(20px)', border: `1px solid ${T.glassBorder}`, boxShadow: `0 8px 32px -8px hsla(222,47%,4%,0.5)` }}>
    {children}
  </motion.div>
);

const INTEGRATIONS = [
  { id: 'stripe', name: 'Stripe Payments', icon: CreditCard, status: 'connected', category: 'Payments', lastSync: '2 min ago', requests: '14.2K/day', color: T.purple },
  { id: 'supabase', name: 'Lovable Cloud DB', icon: Database, status: 'connected', category: 'Database', lastSync: 'Live', requests: '128K/day', color: T.blue },
  { id: 'sendgrid', name: 'SendGrid Email', icon: Mail, status: 'connected', category: 'Email', lastSync: '5 min ago', requests: '2.4K/day', color: T.cyan },
  { id: 'twilio', name: 'Twilio SMS/OTP', icon: MessageSquare, status: 'connected', category: 'Messaging', lastSync: '1 min ago', requests: '8.7K/day', color: T.green },
  { id: 'openai', name: 'Vala AI Engine', icon: Zap, status: 'connected', category: 'AI', lastSync: 'Live', requests: '45K/day', color: T.amber },
  { id: 'cloudflare', name: 'Cloudflare CDN', icon: Globe, status: 'connected', category: 'CDN', lastSync: '10 min ago', requests: '1.2M/day', color: T.amber },
  { id: 'aws-s3', name: 'Cloud Storage', icon: Cloud, status: 'connected', category: 'Storage', lastSync: '3 min ago', requests: '6.8K/day', color: T.muted },
  { id: 'sentry', name: 'Sentry Monitoring', icon: Shield, status: 'warning', category: 'Monitoring', lastSync: '15 min ago', requests: '3.1K/day', color: T.red },
  { id: 'slack', name: 'Slack Alerts', icon: MessageSquare, status: 'disconnected', category: 'Alerts', lastSync: '2 days ago', requests: '0/day', color: T.dim },
  { id: 'analytics', name: 'Analytics Engine', icon: Activity, status: 'connected', category: 'Analytics', lastSync: '1 min ago', requests: '22.7K/day', color: T.purple },
];

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'connected') return <CheckCircle className="w-4 h-4" style={{ color: T.green }} />;
  if (status === 'warning') return <AlertCircle className="w-4 h-4" style={{ color: T.amber }} />;
  return <XCircle className="w-4 h-4" style={{ color: T.red }} />;
};

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    connected: { bg: `${T.green}18`, fg: T.green, label: 'Connected' },
    warning: { bg: `${T.amber}18`, fg: T.amber, label: 'Warning' },
    disconnected: { bg: `${T.red}18`, fg: T.red, label: 'Disconnected' },
  };
  const s = map[status] || map.disconnected;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
      style={{ background: s.bg, color: s.fg }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.fg }} />
      {s.label}
    </span>
  );
};

export function IntegrationManager() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const connected = INTEGRATIONS.filter(i => i.status === 'connected').length;
  const warning = INTEGRATIONS.filter(i => i.status === 'warning').length;
  const disconnected = INTEGRATIONS.filter(i => i.status === 'disconnected').length;

  const categories = ['all', ...Array.from(new Set(INTEGRATIONS.map(i => i.category)))];

  const filtered = INTEGRATIONS.filter(i => {
    const matchCat = activeFilter === 'all' || i.category === activeFilter;
    const matchSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <motion.div className="space-y-5" variants={stagger} initial="hidden" animate="show" style={{ color: T.text }}>
      {/* Header */}
      <motion.div variants={rise} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight">Integration Manager</h1>
          <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>Manage all third-party service integrations and API connections</p>
        </div>
        <button onClick={() => toast.info('Integration marketplace coming soon')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
          style={{ background: T.blue, color: 'hsl(210,40%,98%)' }}>
          <Plus className="w-3.5 h-3.5" /> Add Integration
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={stagger} className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Integrations', value: INTEGRATIONS.length, icon: Link2, color: T.blue },
          { label: 'Connected', value: connected, icon: CheckCircle, color: T.green },
          { label: 'Warnings', value: warning, icon: AlertCircle, color: T.amber },
          { label: 'Disconnected', value: disconnected, icon: XCircle, color: T.red },
        ].map((s) => (
          <Glass key={s.label} className="p-4">
            <s.icon className="w-4 h-4 mb-2" style={{ color: s.color }} />
            <p className="text-2xl font-black" style={{ color: T.text }}>{s.value}</p>
            <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: T.muted }}>{s.label}</p>
          </Glass>
        ))}
      </motion.div>

      {/* Filters + Search */}
      <motion.div variants={rise} className="flex items-center gap-3">
        <input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search integrations..."
          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
          style={{ background: 'hsla(215,28%,15%,0.8)', border: `1px solid ${T.glassBorder}`, color: T.text }}
        />
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'hsla(222,47%,9%,0.8)', border: `1px solid ${T.glassBorder}` }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveFilter(cat)}
              className="px-3 py-1.5 rounded text-[11px] font-semibold transition-all capitalize"
              style={{ background: activeFilter === cat ? T.blue : 'transparent', color: activeFilter === cat ? 'white' : T.muted }}>
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Integration Grid */}
      <motion.div variants={stagger} className="grid grid-cols-2 gap-3">
        {filtered.map((integration) => (
          <Glass key={integration.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${integration.color}15`, border: `1px solid ${integration.color}25` }}>
                <integration.icon className="w-5 h-5" style={{ color: integration.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-bold truncate" style={{ color: T.text }}>{integration.name}</p>
                  <StatusIcon status={integration.status} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                    style={{ background: 'hsla(215,28%,20%,0.6)', color: T.muted }}>{integration.category}</span>
                  <StatusBadge status={integration.status} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px]" style={{ color: T.dim }}>Last sync: <span style={{ color: T.muted }}>{integration.lastSync}</span></p>
                    <p className="text-[10px]" style={{ color: T.dim }}>Volume: <span style={{ color: T.muted }}>{integration.requests}</span></p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => toast.info(`Viewing ${integration.name}`)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: 'hsla(217,92%,65%,0.1)', color: T.blue }}>
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => toast.success(`${integration.name} refreshed`)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: 'hsla(160,84%,44%,0.1)', color: T.green }}>
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => toast.info(`${integration.name} settings`)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: 'hsla(215,28%,20%,0.4)', color: T.muted }}>
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Glass>
        ))}
      </motion.div>
    </motion.div>
  );
}
