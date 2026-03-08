/**
 * AI API MANAGER - OPENAI PLATFORM CLONE
 * Standalone full-screen layout with OpenAI-style clean UI
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cpu, Key, BarChart3, Settings, ChevronLeft, Zap, Activity,
  DollarSign, AlertTriangle, Play, Pause, Square, RefreshCw,
  TrendingUp, Clock, Shield, FileText, Eye, EyeOff, Copy,
  Plus, Trash2, CheckCircle, XCircle, ArrowUpRight
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

type AASection = 'overview' | 'api-keys' | 'usage' | 'models' | 'rate-limits' | 'billing' | 'settings';

const SIDEBAR_ITEMS: { id: AASection; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'models', label: 'Models', icon: Cpu },
  { id: 'usage', label: 'Usage', icon: BarChart3 },
  { id: 'rate-limits', label: 'Rate Limits', icon: Shield },
  { id: 'billing', label: 'Billing', icon: DollarSign },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const AI_MODELS = [
  { name: 'GPT-4o', provider: 'OpenAI', status: 'active', requests: '45.2K', cost: '$124.50', latency: '1.2s' },
  { name: 'GPT-4o-mini', provider: 'OpenAI', status: 'active', requests: '128.4K', cost: '$38.20', latency: '0.4s' },
  { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', status: 'active', requests: '22.8K', cost: '$67.80', latency: '1.5s' },
  { name: 'Gemini 2.5 Pro', provider: 'Google', status: 'active', requests: '18.1K', cost: '$45.60', latency: '1.1s' },
  { name: 'Gemini 2.5 Flash', provider: 'Google', status: 'active', requests: '89.3K', cost: '$12.40', latency: '0.3s' },
  { name: 'DALL-E 3', provider: 'OpenAI', status: 'paused', requests: '5.2K', cost: '$26.00', latency: '3.2s' },
  { name: 'Whisper', provider: 'OpenAI', status: 'active', requests: '3.1K', cost: '$8.40', latency: '2.1s' },
  { name: 'ElevenLabs TTS', provider: 'ElevenLabs', status: 'active', requests: '7.8K', cost: '$31.20', latency: '0.8s' },
];

const API_KEYS = [
  { name: 'Production Key', prefix: 'sk-...7X9K', created: '2026-01-15', lastUsed: '2m ago', status: 'active' },
  { name: 'Staging Key', prefix: 'sk-...4B2M', created: '2026-02-01', lastUsed: '1h ago', status: 'active' },
  { name: 'Dev Key', prefix: 'sk-...9R1Q', created: '2026-02-20', lastUsed: '3d ago', status: 'active' },
  { name: 'Legacy Key', prefix: 'sk-...2F5N', created: '2025-11-10', lastUsed: '30d ago', status: 'revoked' },
];

export function AIAPIManagerLayout() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AASection>('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return <OverviewScreen />;
      case 'api-keys': return <APIKeysScreen />;
      case 'models': return <ModelsScreen />;
      case 'usage': return <UsageScreen />;
      case 'rate-limits': return <RateLimitsScreen />;
      case 'billing': return <BillingScreen />;
      case 'settings': return <SettingsScreen />;
      default: return <OverviewScreen />;
    }
  };

  return (
    <div className="flex h-screen" style={{ background: '#fff', color: '#171717' }}>
      {/* Sidebar - OpenAI Platform style */}
      <aside className="w-[220px] flex-shrink-0 flex flex-col border-r" style={{ background: '#fafafa', borderColor: '#e5e5e5' }}>
        <div className="h-[52px] flex items-center px-4 border-b" style={{ borderColor: '#e5e5e5' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold" style={{ color: '#171717' }}>AI API Manager</span>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-xs border-b transition-colors"
          style={{ color: '#999', borderColor: '#e5e5e5' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#171717')}
          onMouseLeave={e => (e.currentTarget.style.color = '#999')}
        >
          <ChevronLeft className="w-3 h-3" />
          Back
        </button>

        <nav className="flex-1 py-2">
          {SIDEBAR_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] transition-all"
                style={{
                  color: isActive ? '#171717' : '#666',
                  background: isActive ? '#e5e5e5' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  borderRight: isActive ? '2px solid #10a37f' : '2px solid transparent',
                }}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t" style={{ borderColor: '#e5e5e5' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px]" style={{ color: '#999' }}>All APIs operational</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-white">
        <ScrollArea className="h-full">
          <div className="p-6 max-w-5xl">{renderContent()}</div>
        </ScrollArea>
      </main>
    </div>
  );
}

function OverviewScreen() {
  const totalCost = AI_MODELS.reduce((s, m) => s + parseFloat(m.cost.replace('$', '')), 0);
  const totalRequests = AI_MODELS.reduce((s, m) => s + parseFloat(m.requests.replace('K', '')) * 1000, 0);
  const activeModels = AI_MODELS.filter(m => m.status === 'active').length;

  const kpis = [
    { label: 'Total Requests', value: `${(totalRequests / 1000).toFixed(0)}K`, icon: Zap, color: '#10a37f' },
    { label: 'Total Cost (MTD)', value: `$${totalCost.toFixed(2)}`, icon: DollarSign, color: '#f59e0b' },
    { label: 'Active Models', value: `${activeModels}`, icon: Cpu, color: '#3b82f6' },
    { label: 'Avg Latency', value: '0.9s', icon: Clock, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#171717' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#666' }}>Monitor your AI API usage and performance</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border p-4" style={{ borderColor: '#e5e5e5' }}>
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              <span className="text-xs" style={{ color: '#666' }}>{kpi.label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#171717' }}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Models Table */}
      <div className="rounded-lg border" style={{ borderColor: '#e5e5e5' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: '#e5e5e5' }}>
          <span className="text-sm font-semibold" style={{ color: '#171717' }}>Active Models</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: '#e5e5e5' }}>
              {['Model', 'Provider', 'Requests', 'Cost', 'Latency', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-2 text-left text-[11px] font-semibold uppercase" style={{ color: '#999' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AI_MODELS.map(model => (
              <tr key={model.name} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors" style={{ borderColor: '#f0f0f0' }}>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: '#171717' }}>{model.name}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#666' }}>{model.provider}</td>
                <td className="px-4 py-3 text-sm font-mono" style={{ color: '#171717' }}>{model.requests}</td>
                <td className="px-4 py-3 text-sm font-mono" style={{ color: '#171717' }}>{model.cost}</td>
                <td className="px-4 py-3 text-sm font-mono" style={{ color: '#666' }}>{model.latency}</td>
                <td className="px-4 py-3">
                  <Badge className="text-[10px]" style={{
                    background: model.status === 'active' ? 'rgba(16,163,127,0.1)' : 'rgba(245,158,11,0.1)',
                    color: model.status === 'active' ? '#10a37f' : '#f59e0b',
                    border: 'none'
                  }}>{model.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {model.status === 'active' ? (
                      <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => toast.info(`${model.name} paused`)}>
                        <Pause className="w-3 h-3" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => toast.info(`${model.name} resumed`)}>
                        <Play className="w-3 h-3" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => toast.info(`${model.name} restarted`)}>
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function APIKeysScreen() {
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#171717' }}>API Keys</h1>
          <p className="text-sm mt-1" style={{ color: '#666' }}>Manage your API authentication keys</p>
        </div>
        <Button size="sm" className="gap-1" style={{ background: '#10a37f', color: '#fff' }}>
          <Plus className="w-3 h-3" /> Create new key
        </Button>
      </div>

      <div className="rounded-lg border" style={{ borderColor: '#e5e5e5' }}>
        {API_KEYS.map(key => (
          <div key={key.prefix} className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0" style={{ borderColor: '#f0f0f0' }}>
            <Key className="w-4 h-4" style={{ color: key.status === 'active' ? '#10a37f' : '#999' }} />
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: '#171717' }}>{key.name}</p>
              <span className="text-[11px] font-mono" style={{ color: '#999' }}>{key.prefix}</span>
            </div>
            <span className="text-[11px]" style={{ color: '#999' }}>Last used: {key.lastUsed}</span>
            <Badge className="text-[10px]" style={{
              background: key.status === 'active' ? 'rgba(16,163,127,0.1)' : 'rgba(239,68,68,0.1)',
              color: key.status === 'active' ? '#10a37f' : '#ef4444',
              border: 'none'
            }}>{key.status}</Badge>
          </div>
        ))}
      </div>

      <div className="rounded-lg border p-4" style={{ borderColor: '#e5e5e5', background: '#fffbeb' }}>
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium" style={{ color: '#92400e' }}>Security Notice</p>
            <p className="text-xs mt-1" style={{ color: '#a16207' }}>Never expose API keys in client-side code. All keys are encrypted and stored securely.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelsScreen() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: '#171717' }}>Models</h1>
      <div className="grid grid-cols-2 gap-4">
        {AI_MODELS.map(model => (
          <div key={model.name} className="rounded-lg border p-4 hover:shadow-sm transition-shadow" style={{ borderColor: '#e5e5e5' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: '#171717' }}>{model.name}</span>
              <Badge className="text-[10px]" style={{
                background: model.status === 'active' ? 'rgba(16,163,127,0.1)' : 'rgba(245,158,11,0.1)',
                color: model.status === 'active' ? '#10a37f' : '#f59e0b',
                border: 'none'
              }}>{model.status}</Badge>
            </div>
            <div className="space-y-1 text-xs" style={{ color: '#666' }}>
              <div className="flex justify-between"><span>Provider</span><span style={{ color: '#171717' }}>{model.provider}</span></div>
              <div className="flex justify-between"><span>Requests</span><span style={{ color: '#171717' }}>{model.requests}</span></div>
              <div className="flex justify-between"><span>Cost</span><span style={{ color: '#171717' }}>{model.cost}</span></div>
              <div className="flex justify-between"><span>Avg Latency</span><span style={{ color: '#171717' }}>{model.latency}</span></div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" className="flex-1 text-[11px] h-7" style={{ borderColor: '#e5e5e5' }}>
                <Play className="w-3 h-3 mr-1" /> Run
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-[11px] h-7" style={{ borderColor: '#e5e5e5' }}>
                <BarChart3 className="w-3 h-3 mr-1" /> Stats
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsageScreen() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: '#171717' }}>Usage</h1>
      <p className="text-sm" style={{ color: '#666' }}>Track API consumption across all models</p>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Requests Today', value: '12,482', change: '+18%' },
          { label: 'Tokens Used', value: '4.2M', change: '+12%' },
          { label: 'Cost Today', value: '$42.80', change: '-5%' },
        ].map(stat => (
          <div key={stat.label} className="rounded-lg border p-4" style={{ borderColor: '#e5e5e5' }}>
            <p className="text-xs" style={{ color: '#666' }}>{stat.label}</p>
            <p className="text-xl font-bold mt-1" style={{ color: '#171717' }}>{stat.value}</p>
            <span className="text-xs" style={{ color: stat.change.startsWith('+') ? '#10a37f' : '#ef4444' }}>{stat.change}</span>
          </div>
        ))}
      </div>
      <div className="rounded-lg border p-6 h-64 flex items-center justify-center" style={{ borderColor: '#e5e5e5' }}>
        <div className="text-center" style={{ color: '#999' }}>
          <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Usage chart — Real-time data loading</p>
        </div>
      </div>
    </div>
  );
}

function RateLimitsScreen() {
  const limits = [
    { model: 'GPT-4o', rpm: 500, tpm: '600K', current_rpm: 120, current_tpm: '142K' },
    { model: 'GPT-4o-mini', rpm: 5000, tpm: '2M', current_rpm: 890, current_tpm: '480K' },
    { model: 'Gemini 2.5 Pro', rpm: 1000, tpm: '1M', current_rpm: 210, current_tpm: '320K' },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: '#171717' }}>Rate Limits</h1>
      <div className="rounded-lg border" style={{ borderColor: '#e5e5e5' }}>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: '#e5e5e5' }}>
              {['Model', 'RPM Limit', 'Current RPM', 'TPM Limit', 'Current TPM'].map(h => (
                <th key={h} className="px-4 py-2 text-left text-[11px] font-semibold uppercase" style={{ color: '#999' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {limits.map(l => (
              <tr key={l.model} className="border-b last:border-b-0" style={{ borderColor: '#f0f0f0' }}>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: '#171717' }}>{l.model}</td>
                <td className="px-4 py-3 text-sm font-mono" style={{ color: '#666' }}>{l.rpm}</td>
                <td className="px-4 py-3 text-sm font-mono" style={{ color: '#171717' }}>{l.current_rpm}</td>
                <td className="px-4 py-3 text-sm font-mono" style={{ color: '#666' }}>{l.tpm}</td>
                <td className="px-4 py-3 text-sm font-mono" style={{ color: '#171717' }}>{l.current_tpm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BillingScreen() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: '#171717' }}>Billing</h1>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Current Month', value: '$354.10', sub: 'March 2026' },
          { label: 'Last Month', value: '$298.50', sub: 'February 2026' },
          { label: 'Budget Limit', value: '$500.00', sub: '70.8% used' },
        ].map(item => (
          <div key={item.label} className="rounded-lg border p-4" style={{ borderColor: '#e5e5e5' }}>
            <p className="text-xs" style={{ color: '#666' }}>{item.label}</p>
            <p className="text-xl font-bold mt-1" style={{ color: '#171717' }}>{item.value}</p>
            <p className="text-xs mt-1" style={{ color: '#999' }}>{item.sub}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border p-4" style={{ borderColor: '#e5e5e5' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: '#171717' }}>Budget Usage</span>
          <span className="text-sm font-mono" style={{ color: '#f59e0b' }}>70.8%</span>
        </div>
        <div className="h-2 rounded-full" style={{ background: '#f0f0f0' }}>
          <div className="h-full rounded-full" style={{ width: '70.8%', background: 'linear-gradient(90deg, #10a37f, #f59e0b)' }} />
        </div>
        <p className="text-xs mt-2" style={{ color: '#999' }}>Warning threshold: 80% • Auto-stop: 100%</p>
      </div>
    </div>
  );
}

function SettingsScreen() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold" style={{ color: '#171717' }}>Settings</h1>
      <div className="rounded-lg border p-6" style={{ borderColor: '#e5e5e5' }}>
        <h3 className="text-sm font-medium mb-4" style={{ color: '#171717' }}>API Configuration</h3>
        <div className="space-y-3">
          {['Auto-stop at budget limit', 'Email alerts for usage spikes', 'Model fallback on rate limit', 'Request logging'].map(s => (
            <div key={s} className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: '#f0f0f0' }}>
              <span className="text-sm" style={{ color: '#333' }}>{s}</span>
              <Badge className="text-[10px]" style={{ background: 'rgba(16,163,127,0.1)', color: '#10a37f', border: 'none' }}>Enabled</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIAPIManagerLayout;
