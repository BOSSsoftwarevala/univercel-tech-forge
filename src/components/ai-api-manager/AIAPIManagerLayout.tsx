/**
 * AI API MANAGER — Enterprise Clone
 * OpenAI Platform-style dark UI with 8 core modules
 * Request Router, Cache, Failover, Security, Usage, Models, Keys, Rate Limits
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cpu, Key, BarChart3, Settings, ChevronLeft, Zap, Activity,
  DollarSign, AlertTriangle, Play, Pause, RefreshCw,
  Clock, Shield, Eye, EyeOff, Copy,
  Plus, Trash2, CheckCircle, XCircle, ArrowUpRight,
  GitBranch, Database, ShieldCheck, FileText, Router, HardDrive,
  TrendingUp, TrendingDown, Globe, Lock, Unlock, RotateCcw
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

type AASection = 'overview' | 'api-keys' | 'models' | 'router' | 'usage' | 'rate-limits' | 'cache' | 'failover' | 'security' | 'settings';

const SIDEBAR_ITEMS: { id: AASection; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'overview', label: 'Dashboard', icon: Activity },
  { id: 'api-keys', label: 'API Keys', icon: Key, badge: '4' },
  { id: 'models', label: 'Models', icon: Cpu, badge: '12' },
  { id: 'router', label: 'Request Router', icon: GitBranch },
  { id: 'usage', label: 'Usage Monitor', icon: BarChart3 },
  { id: 'rate-limits', label: 'Rate Limits', icon: Shield },
  { id: 'cache', label: 'Response Cache', icon: Database },
  { id: 'failover', label: 'Failover System', icon: RefreshCw },
  { id: 'security', label: 'Security & Audit', icon: ShieldCheck },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const AI_MODELS = [
  { name: 'GPT-5', provider: 'OpenAI', status: 'active', requests: '45.2K', cost: '$224.50', latency: '1.8s', tokens: '12.4M', tier: 'premium' },
  { name: 'GPT-5-mini', provider: 'OpenAI', status: 'active', requests: '128.4K', cost: '$48.20', latency: '0.6s', tokens: '32.1M', tier: 'standard' },
  { name: 'GPT-5-nano', provider: 'OpenAI', status: 'active', requests: '89.1K', cost: '$12.40', latency: '0.2s', tokens: '18.8M', tier: 'economy' },
  { name: 'GPT-4o', provider: 'OpenAI', status: 'active', requests: '34.7K', cost: '$98.30', latency: '1.2s', tokens: '9.2M', tier: 'standard' },
  { name: 'o4-mini', provider: 'OpenAI', status: 'active', requests: '22.3K', cost: '$42.10', latency: '0.5s', tokens: '5.8M', tier: 'standard' },
  { name: 'Claude Sonnet 4', provider: 'Anthropic', status: 'active', requests: '22.8K', cost: '$67.80', latency: '1.5s', tokens: '7.1M', tier: 'premium' },
  { name: 'Claude Haiku 3.5', provider: 'Anthropic', status: 'active', requests: '56.2K', cost: '$18.90', latency: '0.3s', tokens: '14.2M', tier: 'economy' },
  { name: 'Gemini 2.5 Pro', provider: 'Google', status: 'active', requests: '18.1K', cost: '$45.60', latency: '1.1s', tokens: '6.4M', tier: 'premium' },
  { name: 'Gemini 2.5 Flash', provider: 'Google', status: 'active', requests: '89.3K', cost: '$12.40', latency: '0.3s', tokens: '22.6M', tier: 'economy' },
  { name: 'Gemini 3 Flash', provider: 'Google', status: 'active', requests: '31.5K', cost: '$8.20', latency: '0.2s', tokens: '8.9M', tier: 'economy' },
  { name: 'DALL-E 3', provider: 'OpenAI', status: 'paused', requests: '5.2K', cost: '$26.00', latency: '3.2s', tokens: '—', tier: 'premium' },
  { name: 'ElevenLabs TTS', provider: 'ElevenLabs', status: 'active', requests: '7.8K', cost: '$31.20', latency: '0.8s', tokens: '—', tier: 'standard' },
];

const API_KEYS = [
  { name: 'Production Key', prefix: 'sk-...7X9K', created: '2026-01-15', lastUsed: '2m ago', status: 'active', requests: '245K' },
  { name: 'Staging Key', prefix: 'sk-...4B2M', created: '2026-02-01', lastUsed: '1h ago', status: 'active', requests: '18K' },
  { name: 'VALA Builder Key', prefix: 'sk-...8D3P', created: '2026-02-15', lastUsed: '5m ago', status: 'active', requests: '89K' },
  { name: 'Dev Key', prefix: 'sk-...9R1Q', created: '2026-02-20', lastUsed: '3d ago', status: 'active', requests: '4.2K' },
  { name: 'Legacy Key', prefix: 'sk-...2F5N', created: '2025-11-10', lastUsed: '30d ago', status: 'revoked', requests: '0' },
];

const ROUTE_RULES = [
  { id: 1, name: 'Code Generation', pattern: '*code*|*build*|*generate*', target: 'GPT-5', fallback: 'Claude Sonnet 4', priority: 'high', active: true },
  { id: 2, name: 'Chat & Support', pattern: '*chat*|*help*|*support*', target: 'GPT-5-mini', fallback: 'Gemini 2.5 Flash', priority: 'medium', active: true },
  { id: 3, name: 'Classification', pattern: '*classify*|*categorize*', target: 'GPT-5-nano', fallback: 'Claude Haiku 3.5', priority: 'low', active: true },
  { id: 4, name: 'Vision & Image', pattern: '*image*|*vision*|*photo*', target: 'GPT-4o', fallback: 'Gemini 2.5 Pro', priority: 'medium', active: true },
  { id: 5, name: 'Voice & TTS', pattern: '*voice*|*speech*|*audio*', target: 'ElevenLabs TTS', fallback: 'Whisper', priority: 'medium', active: true },
  { id: 6, name: 'Fast Queries', pattern: '*quick*|*simple*|*short*', target: 'Gemini 3 Flash', fallback: 'GPT-5-nano', priority: 'low', active: false },
];

const CACHE_ENTRIES = [
  { key: 'hash:a8f2c...', model: 'GPT-5-mini', hits: 342, saved: '$4.82', ttl: '24h', size: '2.1KB' },
  { key: 'hash:b3d1e...', model: 'Claude Haiku', hits: 128, saved: '$1.28', ttl: '12h', size: '1.4KB' },
  { key: 'hash:c7a9f...', model: 'Gemini Flash', hits: 891, saved: '$8.91', ttl: '48h', size: '3.2KB' },
  { key: 'hash:d2b4c...', model: 'GPT-5-nano', hits: 567, saved: '$3.40', ttl: '6h', size: '0.8KB' },
  { key: 'hash:e5f8a...', model: 'GPT-5', hits: 89, saved: '$12.46', ttl: '1h', size: '4.7KB' },
];

const FAILOVER_LOG = [
  { time: '14:32:08', from: 'GPT-5', to: 'Claude Sonnet 4', reason: 'Rate limit 429', latency: '+0.3s', status: 'success' },
  { time: '13:15:42', from: 'Gemini 2.5 Pro', to: 'GPT-4o', reason: 'Timeout 30s', latency: '+0.8s', status: 'success' },
  { time: '11:08:19', from: 'ElevenLabs TTS', to: 'Whisper', reason: 'Service 503', latency: '+1.2s', status: 'success' },
  { time: '09:45:33', from: 'Claude Sonnet 4', to: 'GPT-5', reason: 'Auth error 401', latency: '+0.5s', status: 'success' },
  { time: '08:22:11', from: 'GPT-5-nano', to: 'Gemini 3 Flash', reason: 'Rate limit 429', latency: '+0.1s', status: 'success' },
];

const AUDIT_LOG = [
  { time: '16:45:12', action: 'API Key Created', user: 'admin@softwarewala.net', resource: 'VALA Builder Key', severity: 'info' },
  { time: '15:30:08', action: 'Model Paused', user: 'admin@softwarewala.net', resource: 'DALL-E 3', severity: 'warning' },
  { time: '14:32:08', action: 'Failover Triggered', user: 'system', resource: 'GPT-5 → Claude Sonnet', severity: 'warning' },
  { time: '12:15:44', action: 'Rate Limit Updated', user: 'admin@softwarewala.net', resource: 'GPT-5-mini RPM: 5000→8000', severity: 'info' },
  { time: '10:08:22', action: 'Suspicious Request Blocked', user: 'system', resource: 'IP: 103.xx.xx.42', severity: 'critical' },
  { time: '08:45:11', action: 'Cache Cleared', user: 'admin@softwarewala.net', resource: 'All models', severity: 'info' },
];

// Shared style tokens
const S = {
  bg: 'hsl(222, 47%, 7%)',
  surface1: 'hsl(222, 40%, 10%)',
  surface2: 'hsl(222, 35%, 13%)',
  border: 'hsl(222, 30%, 18%)',
  borderLight: 'hsl(222, 25%, 22%)',
  text: 'hsl(210, 20%, 95%)',
  textMuted: 'hsl(215, 15%, 55%)',
  accent: '#10a37f',
  accentBg: 'rgba(16, 163, 127, 0.1)',
  amber: '#f59e0b',
  amberBg: 'rgba(245, 158, 11, 0.1)',
  red: '#ef4444',
  redBg: 'rgba(239, 68, 68, 0.1)',
  blue: '#3b82f6',
  blueBg: 'rgba(59, 130, 246, 0.1)',
  purple: '#8b5cf6',
  purpleBg: 'rgba(139, 92, 246, 0.1)',
};

export function AIAPIManagerLayout() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AASection>('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return <OverviewScreen />;
      case 'api-keys': return <APIKeysScreen />;
      case 'models': return <ModelsScreen />;
      case 'router': return <RouterScreen />;
      case 'usage': return <UsageScreen />;
      case 'rate-limits': return <RateLimitsScreen />;
      case 'cache': return <CacheScreen />;
      case 'failover': return <FailoverScreen />;
      case 'security': return <SecurityScreen />;
      case 'settings': return <SettingsScreen />;
      default: return <OverviewScreen />;
    }
  };

  return (
    <div className="flex h-screen" style={{ background: S.bg, color: S.text }}>
      {/* Sidebar */}
      <aside className="w-[230px] flex-shrink-0 flex flex-col border-r" style={{ background: S.surface1, borderColor: S.border }}>
        <div className="h-[52px] flex items-center px-4 border-b" style={{ borderColor: S.border }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: S.accent }}>
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold" style={{ color: S.text }}>AI API Manager</span>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-xs border-b transition-colors hover:opacity-80"
          style={{ color: S.textMuted, borderColor: S.border }}
        >
          <ChevronLeft className="w-3 h-3" />
          Back to Panel
        </button>

        <nav className="flex-1 py-2 overflow-auto">
          {SIDEBAR_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] transition-all"
                style={{
                  color: isActive ? S.text : S.textMuted,
                  background: isActive ? S.surface2 : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  borderRight: isActive ? `2px solid ${S.accent}` : '2px solid transparent',
                }}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: S.surface2, color: S.textMuted }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Status footer */}
        <div className="px-4 py-3 border-t" style={{ borderColor: S.border }}>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: S.accent }} />
            <span className="text-[10px]" style={{ color: S.textMuted }}>All APIs operational</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: S.amber }} />
            <span className="text-[10px]" style={{ color: S.textMuted }}>Cache: 94% hit rate</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-hidden" style={{ background: S.bg }}>
        <ScrollArea className="h-full">
          <div className="p-6 max-w-6xl">{renderContent()}</div>
        </ScrollArea>
      </main>
    </div>
  );
}

/* ─── SECTION HEADER ─── */
function SectionHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: S.text }}>{title}</h1>
        <p className="text-sm mt-0.5" style={{ color: S.textMuted }}>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

/* ─── KPI CARD ─── */
function KPICard({ label, value, icon: Icon, color, change }: { label: string; value: string; icon: React.ElementType; color: string; change?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border p-4" style={{ borderColor: S.border, background: S.surface1 }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-medium" style={{ color: S.textMuted }}>{label}</span>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <p className="text-2xl font-bold" style={{ color: S.text }}>{value}</p>
      {change && (
        <span className="text-[11px] font-medium" style={{ color: change.startsWith('+') ? S.accent : S.red }}>
          {change}
        </span>
      )}
    </motion.div>
  );
}

/* ─── TABLE WRAPPER ─── */
function TableCard({ title, headers, children, action }: { title: string; headers: string[]; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: S.border, background: S.surface1 }}>
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: S.border }}>
        <span className="text-sm font-semibold" style={{ color: S.text }}>{title}</span>
        {action}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: S.border }}>
              {headers.map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ color: S.textMuted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status, label }: { status: 'active' | 'paused' | 'revoked' | 'success' | 'error' | 'warning'; label?: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    active: { bg: S.accentBg, fg: S.accent },
    success: { bg: S.accentBg, fg: S.accent },
    paused: { bg: S.amberBg, fg: S.amber },
    warning: { bg: S.amberBg, fg: S.amber },
    revoked: { bg: S.redBg, fg: S.red },
    error: { bg: S.redBg, fg: S.red },
  };
  const c = colors[status] || colors.active;
  return (
    <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.fg }}>
      {label || status}
    </span>
  );
}

/* ═══════════════════════════════════════════
   1. OVERVIEW / DASHBOARD
═══════════════════════════════════════════ */
function OverviewScreen() {
  const totalCost = AI_MODELS.reduce((s, m) => s + parseFloat(m.cost.replace('$', '')), 0);
  const totalRequests = AI_MODELS.reduce((s, m) => s + parseFloat(m.requests.replace('K', '')) * 1000, 0);
  const activeModels = AI_MODELS.filter(m => m.status === 'active').length;

  return (
    <div className="space-y-6">
      <SectionHeader title="Dashboard" subtitle="Monitor your AI API infrastructure in real-time" />

      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Total Requests" value={`${(totalRequests / 1000).toFixed(0)}K`} icon={Zap} color={S.accent} change="+18%" />
        <KPICard label="Total Cost (MTD)" value={`$${totalCost.toFixed(2)}`} icon={DollarSign} color={S.amber} change="+12%" />
        <KPICard label="Active Models" value={`${activeModels}`} icon={Cpu} color={S.blue} />
        <KPICard label="Avg Latency" value="0.8s" icon={Clock} color={S.purple} change="-15%" />
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border p-4" style={{ borderColor: S.border, background: S.surface1 }}>
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4" style={{ color: S.blue }} />
            <span className="text-xs font-medium" style={{ color: S.textMuted }}>Cache Performance</span>
          </div>
          <p className="text-lg font-bold" style={{ color: S.text }}>94.2% <span className="text-xs font-normal" style={{ color: S.accent }}>hit rate</span></p>
          <p className="text-[11px] mt-1" style={{ color: S.textMuted }}>$30.87 saved today</p>
        </div>
        <div className="rounded-lg border p-4" style={{ borderColor: S.border, background: S.surface1 }}>
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="w-4 h-4" style={{ color: S.amber }} />
            <span className="text-xs font-medium" style={{ color: S.textMuted }}>Failover Events</span>
          </div>
          <p className="text-lg font-bold" style={{ color: S.text }}>5 <span className="text-xs font-normal" style={{ color: S.accent }}>today</span></p>
          <p className="text-[11px] mt-1" style={{ color: S.textMuted }}>100% recovery rate</p>
        </div>
        <div className="rounded-lg border p-4" style={{ borderColor: S.border, background: S.surface1 }}>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4" style={{ color: S.accent }} />
            <span className="text-xs font-medium" style={{ color: S.textMuted }}>Security Status</span>
          </div>
          <p className="text-lg font-bold" style={{ color: S.text }}>Secure</p>
          <p className="text-[11px] mt-1" style={{ color: S.textMuted }}>1 blocked request today</p>
        </div>
      </div>

      {/* Models Table */}
      <TableCard title="Active Models" headers={['Model', 'Provider', 'Requests', 'Cost', 'Latency', 'Tier', 'Status', 'Actions']}>
        {AI_MODELS.slice(0, 6).map(model => (
          <tr key={model.name} className="border-b last:border-b-0 transition-colors" style={{ borderColor: `${S.border}80` }}
            onMouseEnter={e => (e.currentTarget.style.background = S.surface2)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <td className="px-4 py-3 text-sm font-medium" style={{ color: S.text }}>{model.name}</td>
            <td className="px-4 py-3 text-sm" style={{ color: S.textMuted }}>{model.provider}</td>
            <td className="px-4 py-3 text-sm font-mono" style={{ color: S.text }}>{model.requests}</td>
            <td className="px-4 py-3 text-sm font-mono" style={{ color: S.text }}>{model.cost}</td>
            <td className="px-4 py-3 text-sm font-mono" style={{ color: S.textMuted }}>{model.latency}</td>
            <td className="px-4 py-3">
              <StatusBadge status={model.tier === 'premium' ? 'warning' : model.tier === 'standard' ? 'active' : 'active'} label={model.tier} />
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={model.status as any} />
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="w-6 h-6 hover:bg-white/5" onClick={() => toast.info(`${model.name} toggled`)}>
                  {model.status === 'active' ? <Pause className="w-3 h-3" style={{ color: S.textMuted }} /> : <Play className="w-3 h-3" style={{ color: S.textMuted }} />}
                </Button>
                <Button variant="ghost" size="icon" className="w-6 h-6 hover:bg-white/5" onClick={() => toast.info(`${model.name} restarted`)}>
                  <RefreshCw className="w-3 h-3" style={{ color: S.textMuted }} />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </TableCard>
    </div>
  );
}

/* ═══════════════════════════════════════════
   2. API KEYS
═══════════════════════════════════════════ */
function APIKeysScreen() {
  return (
    <div className="space-y-6">
      <SectionHeader title="API Keys" subtitle="Manage encrypted authentication keys"
        action={
          <Button size="sm" className="gap-1.5 text-xs" style={{ background: S.accent, color: '#fff' }}
            onClick={() => toast.success('New API key generated')}>
            <Plus className="w-3 h-3" /> Create Key
          </Button>
        }
      />

      <TableCard title="All Keys" headers={['Key', 'Prefix', 'Created', 'Last Used', 'Requests', 'Status', 'Actions']}>
        {API_KEYS.map(key => (
          <tr key={key.prefix} className="border-b last:border-b-0" style={{ borderColor: `${S.border}80` }}>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <Key className="w-3.5 h-3.5" style={{ color: key.status === 'active' ? S.accent : S.textMuted }} />
                <span className="text-sm font-medium" style={{ color: S.text }}>{key.name}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-sm font-mono" style={{ color: S.textMuted }}>{key.prefix}</td>
            <td className="px-4 py-3 text-sm" style={{ color: S.textMuted }}>{key.created}</td>
            <td className="px-4 py-3 text-sm" style={{ color: S.textMuted }}>{key.lastUsed}</td>
            <td className="px-4 py-3 text-sm font-mono" style={{ color: S.text }}>{key.requests}</td>
            <td className="px-4 py-3"><StatusBadge status={key.status as any} /></td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="w-6 h-6 hover:bg-white/5" onClick={() => { navigator.clipboard.writeText(key.prefix); toast.success('Key copied'); }}>
                  <Copy className="w-3 h-3" style={{ color: S.textMuted }} />
                </Button>
                <Button variant="ghost" size="icon" className="w-6 h-6 hover:bg-white/5" onClick={() => toast.info('Key rotated')}>
                  <RotateCcw className="w-3 h-3" style={{ color: S.textMuted }} />
                </Button>
                {key.status === 'active' && (
                  <Button variant="ghost" size="icon" className="w-6 h-6 hover:bg-white/5" onClick={() => toast.warning('Key revoked')}>
                    <Trash2 className="w-3 h-3" style={{ color: S.red }} />
                  </Button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </TableCard>

      <div className="rounded-lg border p-4" style={{ borderColor: S.border, background: 'rgba(245, 158, 11, 0.05)' }}>
        <div className="flex items-start gap-2">
          <Lock className="w-4 h-4 mt-0.5" style={{ color: S.amber }} />
          <div>
            <p className="text-sm font-medium" style={{ color: S.amber }}>Encryption Active</p>
            <p className="text-xs mt-1" style={{ color: S.textMuted }}>All API keys are AES-256 encrypted at rest. Keys are never exposed in logs or client-side code.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   3. MODELS
═══════════════════════════════════════════ */
function ModelsScreen() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Models" subtitle="Control available AI models across all providers" />
      <div className="grid grid-cols-3 gap-4">
        {AI_MODELS.map(model => (
          <motion.div key={model.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border p-4 transition-all hover:border-opacity-80"
            style={{ borderColor: S.border, background: S.surface1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: S.text }}>{model.name}</span>
              <StatusBadge status={model.status as any} />
            </div>
            <div className="space-y-1.5 text-[12px]">
              {[
                ['Provider', model.provider],
                ['Requests', model.requests],
                ['Tokens', model.tokens],
                ['Cost', model.cost],
                ['Latency', model.latency],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span style={{ color: S.textMuted }}>{label}</span>
                  <span className="font-mono" style={{ color: S.text }}>{val}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" className="flex-1 text-[10px] h-7 border-0 hover:bg-white/5"
                style={{ background: S.surface2, color: S.text }}
                onClick={() => toast.info(`${model.name} ${model.status === 'active' ? 'paused' : 'activated'}`)}>
                {model.status === 'active' ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                {model.status === 'active' ? 'Pause' : 'Start'}
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-[10px] h-7 border-0 hover:bg-white/5"
                style={{ background: S.surface2, color: S.text }}
                onClick={() => toast.info(`${model.name} restarted`)}>
                <RefreshCw className="w-3 h-3 mr-1" /> Restart
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   4. REQUEST ROUTER
═══════════════════════════════════════════ */
function RouterScreen() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Request Router" subtitle="Route prompts to the optimal AI model based on rules"
        action={
          <Button size="sm" className="gap-1.5 text-xs" style={{ background: S.accent, color: '#fff' }}
            onClick={() => toast.success('New route rule added')}>
            <Plus className="w-3 h-3" /> Add Rule
          </Button>
        }
      />

      {/* Flow Diagram */}
      <div className="rounded-lg border p-5" style={{ borderColor: S.border, background: S.surface1 }}>
        <div className="flex items-center justify-center gap-3 text-xs">
          {['User Prompt', '→', 'API Manager', '→', 'Rule Matching', '→', 'Model Selection', '→', 'AI Response'].map((step, i) => (
            <span key={i} className="font-medium" style={{ color: i % 2 === 0 ? S.text : S.textMuted }}>
              {i % 2 === 0 ? (
                <span className="px-3 py-1.5 rounded-md" style={{ background: S.surface2, border: `1px solid ${S.border}` }}>{step}</span>
              ) : step}
            </span>
          ))}
        </div>
      </div>

      <TableCard title="Routing Rules" headers={['Rule', 'Pattern', 'Target Model', 'Fallback', 'Priority', 'Active']}>
        {ROUTE_RULES.map(rule => (
          <tr key={rule.id} className="border-b last:border-b-0" style={{ borderColor: `${S.border}80` }}>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-3.5 h-3.5" style={{ color: S.accent }} />
                <span className="text-sm font-medium" style={{ color: S.text }}>{rule.name}</span>
              </div>
            </td>
            <td className="px-4 py-3 text-[11px] font-mono" style={{ color: S.textMuted }}>{rule.pattern}</td>
            <td className="px-4 py-3 text-sm" style={{ color: S.text }}>{rule.target}</td>
            <td className="px-4 py-3 text-sm" style={{ color: S.textMuted }}>{rule.fallback}</td>
            <td className="px-4 py-3">
              <StatusBadge status={rule.priority === 'high' ? 'warning' : rule.priority === 'medium' ? 'active' : 'active'} label={rule.priority} />
            </td>
            <td className="px-4 py-3">
              <Switch checked={rule.active} onCheckedChange={() => toast.info(`Rule ${rule.name} toggled`)} />
            </td>
          </tr>
        ))}
      </TableCard>
    </div>
  );
}

/* ═══════════════════════════════════════════
   5. USAGE MONITOR
═══════════════════════════════════════════ */
function UsageScreen() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Usage Monitor" subtitle="Track API consumption, tokens, and costs across all models" />

      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Requests Today" value="12,482" icon={Zap} color={S.accent} change="+18%" />
        <KPICard label="Tokens Used" value="4.2M" icon={BarChart3} color={S.blue} change="+12%" />
        <KPICard label="Cost Today" value="$42.80" icon={DollarSign} color={S.amber} change="-5%" />
        <KPICard label="Avg Response" value="0.8s" icon={Clock} color={S.purple} change="-15%" />
      </div>

      {/* Per-model usage */}
      <TableCard title="Model Usage Breakdown" headers={['Model', 'Requests', 'Tokens', 'Cost', 'Avg Latency', 'Status']}>
        {AI_MODELS.filter(m => m.status === 'active').map(m => (
          <tr key={m.name} className="border-b last:border-b-0" style={{ borderColor: `${S.border}80` }}>
            <td className="px-4 py-3 text-sm font-medium" style={{ color: S.text }}>{m.name}</td>
            <td className="px-4 py-3 text-sm font-mono" style={{ color: S.text }}>{m.requests}</td>
            <td className="px-4 py-3 text-sm font-mono" style={{ color: S.text }}>{m.tokens}</td>
            <td className="px-4 py-3 text-sm font-mono" style={{ color: S.text }}>{m.cost}</td>
            <td className="px-4 py-3 text-sm font-mono" style={{ color: S.textMuted }}>{m.latency}</td>
            <td className="px-4 py-3"><StatusBadge status="active" /></td>
          </tr>
        ))}
      </TableCard>

      {/* Budget tracker */}
      <div className="rounded-lg border p-5" style={{ borderColor: S.border, background: S.surface1 }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold" style={{ color: S.text }}>Monthly Budget</span>
          <span className="text-sm font-mono" style={{ color: S.amber }}>$354 / $500</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: S.surface2 }}>
          <div className="h-full rounded-full" style={{ width: '70.8%', background: `linear-gradient(90deg, ${S.accent}, ${S.amber})` }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px]" style={{ color: S.textMuted }}>Warning at 80% • Auto-stop at 100%</span>
          <span className="text-[10px] font-mono" style={{ color: S.amber }}>70.8%</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   6. RATE LIMITS
═══════════════════════════════════════════ */
function RateLimitsScreen() {
  const limits = [
    { model: 'GPT-5', rpm: 500, tpm: '600K', current_rpm: 120, current_tpm: '142K', usage: 24 },
    { model: 'GPT-5-mini', rpm: 5000, tpm: '2M', current_rpm: 890, current_tpm: '480K', usage: 17.8 },
    { model: 'GPT-5-nano', rpm: 10000, tpm: '4M', current_rpm: 2100, current_tpm: '1.2M', usage: 21 },
    { model: 'Claude Sonnet 4', rpm: 1000, tpm: '1M', current_rpm: 210, current_tpm: '320K', usage: 21 },
    { model: 'Gemini 2.5 Pro', rpm: 1500, tpm: '1.5M', current_rpm: 340, current_tpm: '450K', usage: 22.7 },
    { model: 'Gemini 2.5 Flash', rpm: 8000, tpm: '4M', current_rpm: 1800, current_tpm: '1.8M', usage: 22.5 },
  ];
  return (
    <div className="space-y-6">
      <SectionHeader title="Rate Limits" subtitle="Configure per-model request and token limits to prevent abuse" />

      <TableCard title="Rate Limit Configuration" headers={['Model', 'RPM Limit', 'Current RPM', 'TPM Limit', 'Current TPM', 'Usage']}>
        {limits.map(l => (
          <tr key={l.model} className="border-b last:border-b-0" style={{ borderColor: `${S.border}80` }}>
            <td className="px-4 py-3 text-sm font-medium" style={{ color: S.text }}>{l.model}</td>
            <td className="px-4 py-3 text-sm font-mono" style={{ color: S.textMuted }}>{l.rpm.toLocaleString()}</td>
            <td className="px-4 py-3 text-sm font-mono" style={{ color: S.text }}>{l.current_rpm.toLocaleString()}</td>
            <td className="px-4 py-3 text-sm font-mono" style={{ color: S.textMuted }}>{l.tpm}</td>
            <td className="px-4 py-3 text-sm font-mono" style={{ color: S.text }}>{l.current_tpm}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: S.surface2 }}>
                  <div className="h-full rounded-full" style={{ width: `${l.usage}%`, background: l.usage > 80 ? S.red : l.usage > 50 ? S.amber : S.accent }} />
                </div>
                <span className="text-[10px] font-mono" style={{ color: S.textMuted }}>{l.usage}%</span>
              </div>
            </td>
          </tr>
        ))}
      </TableCard>
    </div>
  );
}

/* ═══════════════════════════════════════════
   7. RESPONSE CACHE
═══════════════════════════════════════════ */
function CacheScreen() {
  const totalSaved = CACHE_ENTRIES.reduce((s, e) => s + parseFloat(e.saved.replace('$', '')), 0);
  const totalHits = CACHE_ENTRIES.reduce((s, e) => s + e.hits, 0);

  return (
    <div className="space-y-6">
      <SectionHeader title="Response Cache" subtitle="Cache AI responses to reduce cost and latency"
        action={
          <Button size="sm" variant="outline" className="gap-1.5 text-xs border-0 hover:bg-white/5"
            style={{ background: S.surface2, color: S.text }}
            onClick={() => toast.success('Cache cleared')}>
            <Trash2 className="w-3 h-3" /> Clear Cache
          </Button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Hit Rate" value="94.2%" icon={CheckCircle} color={S.accent} />
        <KPICard label="Total Hits" value={totalHits.toLocaleString()} icon={Zap} color={S.blue} />
        <KPICard label="Cost Saved" value={`$${totalSaved.toFixed(2)}`} icon={DollarSign} color={S.accent} />
        <KPICard label="Cache Size" value="12.2KB" icon={HardDrive} color={S.purple} />
      </div>

      {/* Flow */}
      <div className="rounded-lg border p-4" style={{ borderColor: S.border, background: S.surface1 }}>
        <div className="flex items-center justify-center gap-3 text-xs">
          {['Prompt', '→', 'Hash Check', '→', 'Cache Hit?', '→', 'Return / Call API'].map((step, i) => (
            <span key={i} style={{ color: i % 2 === 0 ? S.text : S.textMuted }}>
              {i % 2 === 0 ? (
                <span className="px-3 py-1.5 rounded-md font-medium" style={{ background: S.surface2, border: `1px solid ${S.border}` }}>{step}</span>
              ) : step}
            </span>
          ))}
        </div>
      </div>

      <TableCard title="Cached Responses" headers={['Cache Key', 'Model', 'Hits', 'Cost Saved', 'TTL', 'Size']}>
        {CACHE_ENTRIES.map(entry => (
          <tr key={entry.key} className="border-b last:border-b-0" style={{ borderColor: `${S.border}80` }}>
            <td className="px-4 py-3 text-[11px] font-mono" style={{ color: S.textMuted }}>{entry.key}</td>
            <td className="px-4 py-3 text-sm" style={{ color: S.text }}>{entry.model}</td>
            <td className="px-4 py-3 text-sm font-mono" style={{ color: S.text }}>{entry.hits}</td>
            <td className="px-4 py-3 text-sm font-mono" style={{ color: S.accent }}>{entry.saved}</td>
            <td className="px-4 py-3 text-sm" style={{ color: S.textMuted }}>{entry.ttl}</td>
            <td className="px-4 py-3 text-sm font-mono" style={{ color: S.textMuted }}>{entry.size}</td>
          </tr>
        ))}
      </TableCard>
    </div>
  );
}

/* ═══════════════════════════════════════════
   8. FAILOVER SYSTEM
═══════════════════════════════════════════ */
function FailoverScreen() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Failover System" subtitle="Automatic provider switching on failure — zero downtime guarantee" />

      <div className="grid grid-cols-3 gap-4">
        <KPICard label="Failovers Today" value="5" icon={RefreshCw} color={S.amber} />
        <KPICard label="Recovery Rate" value="100%" icon={CheckCircle} color={S.accent} />
        <KPICard label="Avg Extra Latency" value="+0.6s" icon={Clock} color={S.purple} />
      </div>

      {/* Flow */}
      <div className="rounded-lg border p-4" style={{ borderColor: S.border, background: S.surface1 }}>
        <div className="flex items-center justify-center gap-3 text-xs">
          {['Primary Fails', '→', 'Detect Error', '→', 'Switch Provider', '→', 'Return Response'].map((step, i) => (
            <span key={i} style={{ color: i % 2 === 0 ? S.text : S.textMuted }}>
              {i % 2 === 0 ? (
                <span className="px-3 py-1.5 rounded-md font-medium" style={{ background: S.surface2, border: `1px solid ${S.border}` }}>{step}</span>
              ) : step}
            </span>
          ))}
        </div>
      </div>

      <TableCard title="Recent Failover Events" headers={['Time', 'Primary', 'Failover To', 'Reason', 'Extra Latency', 'Result']}>
        {FAILOVER_LOG.map((event, i) => (
          <tr key={i} className="border-b last:border-b-0" style={{ borderColor: `${S.border}80` }}>
            <td className="px-4 py-3 text-[11px] font-mono" style={{ color: S.textMuted }}>{event.time}</td>
            <td className="px-4 py-3 text-sm" style={{ color: S.red }}>{event.from}</td>
            <td className="px-4 py-3 text-sm" style={{ color: S.accent }}>{event.to}</td>
            <td className="px-4 py-3 text-sm" style={{ color: S.textMuted }}>{event.reason}</td>
            <td className="px-4 py-3 text-sm font-mono" style={{ color: S.amber }}>{event.latency}</td>
            <td className="px-4 py-3"><StatusBadge status="success" /></td>
          </tr>
        ))}
      </TableCard>
    </div>
  );
}

/* ═══════════════════════════════════════════
   9. SECURITY & AUDIT
═══════════════════════════════════════════ */
function SecurityScreen() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Security & Audit" subtitle="Encryption status, access control, and audit trail" />

      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Encryption" value="AES-256" icon={Lock} color={S.accent} />
        <KPICard label="Keys Active" value="4" icon={Key} color={S.blue} />
        <KPICard label="Blocked Today" value="1" icon={ShieldCheck} color={S.red} />
        <KPICard label="Audit Events" value="24" icon={FileText} color={S.purple} />
      </div>

      {/* Security checklist */}
      <div className="rounded-lg border p-5" style={{ borderColor: S.border, background: S.surface1 }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: S.text }}>Security Checklist</h3>
        <div className="space-y-2">
          {[
            { label: 'API keys encrypted at rest', status: true },
            { label: 'Environment variables secured', status: true },
            { label: 'Access restricted to authorized roles', status: true },
            { label: 'Request logging enabled', status: true },
            { label: 'Rate limiting active', status: true },
            { label: 'Failover encryption in transit', status: true },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2.5 py-1.5">
              <CheckCircle className="w-3.5 h-3.5" style={{ color: S.accent }} />
              <span className="text-sm" style={{ color: S.text }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log */}
      <TableCard title="Audit Log" headers={['Time', 'Action', 'User', 'Resource', 'Severity']}>
        {AUDIT_LOG.map((log, i) => (
          <tr key={i} className="border-b last:border-b-0" style={{ borderColor: `${S.border}80` }}>
            <td className="px-4 py-3 text-[11px] font-mono" style={{ color: S.textMuted }}>{log.time}</td>
            <td className="px-4 py-3 text-sm font-medium" style={{ color: S.text }}>{log.action}</td>
            <td className="px-4 py-3 text-sm" style={{ color: S.textMuted }}>{log.user}</td>
            <td className="px-4 py-3 text-sm" style={{ color: S.textMuted }}>{log.resource}</td>
            <td className="px-4 py-3">
              <StatusBadge status={log.severity === 'critical' ? 'error' : log.severity === 'warning' ? 'warning' : 'active'} label={log.severity} />
            </td>
          </tr>
        ))}
      </TableCard>
    </div>
  );
}

/* ═══════════════════════════════════════════
   10. SETTINGS
═══════════════════════════════════════════ */
function SettingsScreen() {
  const settings = [
    { label: 'Auto-stop at budget limit', enabled: true },
    { label: 'Email alerts for usage spikes', enabled: true },
    { label: 'Model fallback on rate limit', enabled: true },
    { label: 'Request logging to audit trail', enabled: true },
    { label: 'Response caching', enabled: true },
    { label: 'Auto-failover switching', enabled: true },
    { label: 'Webhook notifications', enabled: false },
    { label: 'Cost anomaly detection', enabled: true },
  ];
  return (
    <div className="space-y-6 max-w-3xl">
      <SectionHeader title="Settings" subtitle="Configure API manager behavior and notifications" />

      <div className="rounded-lg border" style={{ borderColor: S.border, background: S.surface1 }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: S.border }}>
          <span className="text-sm font-semibold" style={{ color: S.text }}>API Configuration</span>
        </div>
        <div className="p-5 space-y-1">
          {settings.map(s => (
            <div key={s.label} className="flex items-center justify-between py-2.5 border-b last:border-b-0" style={{ borderColor: `${S.border}60` }}>
              <span className="text-sm" style={{ color: S.text }}>{s.label}</span>
              <Switch checked={s.enabled} onCheckedChange={() => toast.success(`${s.label} toggled`)} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-5" style={{ borderColor: S.border, background: S.surface1 }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: S.text }}>Danger Zone</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: S.text }}>Revoke all API keys</p>
              <p className="text-[11px]" style={{ color: S.textMuted }}>This will invalidate all active keys immediately</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs border-0" style={{ background: S.redBg, color: S.red }}
              onClick={() => toast.error('All keys revoked')}>
              Revoke All
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: S.text }}>Clear all cache</p>
              <p className="text-[11px]" style={{ color: S.textMuted }}>Remove all cached responses across models</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs border-0" style={{ background: S.amberBg, color: S.amber }}
              onClick={() => toast.warning('Cache cleared')}>
              Clear Cache
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAPIManagerLayout;
