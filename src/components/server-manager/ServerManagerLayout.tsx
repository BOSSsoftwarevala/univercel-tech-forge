/**
 * SERVER MANAGER - VERCEL CLONE
 * Standalone full-screen layout with Vercel-style dark UI
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Server, Activity, Globe, GitBranch, Shield, Database,
  AlertTriangle, Settings, ChevronLeft, Terminal, Rocket,
  HardDrive, Cpu, MemoryStick, Clock, CheckCircle, XCircle,
  ArrowUpRight, RefreshCw, Lock, Zap, BarChart3, Eye
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SMSystemHealth } from './SMSystemHealth';
import { SMDeployments } from './SMDeployments';
import { SMBackups } from './SMBackups';
import { SMInfraLogs } from './SMInfraLogs';

type SMSection = 'overview' | 'deployments' | 'domains' | 'logs' | 'health' | 'backups' | 'settings';

const SIDEBAR_ITEMS: { id: SMSection; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'deployments', label: 'Deployments', icon: Rocket },
  { id: 'domains', label: 'Domains & SSL', icon: Globe },
  { id: 'health', label: 'System Health', icon: Cpu },
  { id: 'logs', label: 'Logs', icon: Terminal },
  { id: 'backups', label: 'Backups', icon: Database },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const SERVERS = [
  { name: 'Production', region: 'ap-south-1', status: 'online', cpu: 34, ram: 62, disk: 45, uptime: '99.98%' },
  { name: 'Staging', region: 'ap-south-1', status: 'online', cpu: 12, ram: 28, disk: 22, uptime: '99.95%' },
  { name: 'EU-West', region: 'eu-west-1', status: 'online', cpu: 22, ram: 41, disk: 38, uptime: '99.97%' },
];

const DEPLOYMENTS = [
  { id: 'dpl_1', branch: 'main', commit: 'fix: auth redirect', status: 'ready', time: '2m ago', env: 'Production' },
  { id: 'dpl_2', branch: 'feat/dashboard', commit: 'add: metrics panel', status: 'building', time: '5m ago', env: 'Preview' },
  { id: 'dpl_3', branch: 'main', commit: 'update: pricing', status: 'ready', time: '1h ago', env: 'Production' },
  { id: 'dpl_4', branch: 'fix/mobile', commit: 'fix: responsive layout', status: 'ready', time: '3h ago', env: 'Preview' },
  { id: 'dpl_5', branch: 'main', commit: 'chore: deps update', status: 'error', time: '6h ago', env: 'Production' },
];

const DOMAINS = [
  { domain: 'softwarevala.com', ssl: true, status: 'active', type: 'Primary' },
  { domain: 'app.softwarevala.com', ssl: true, status: 'active', type: 'Subdomain' },
  { domain: 'api.softwarevala.com', ssl: true, status: 'active', type: 'API' },
  { domain: 'staging.softwarevala.com', ssl: true, status: 'active', type: 'Staging' },
];

export function ServerManagerLayout() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SMSection>('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return <OverviewScreen />;
      case 'deployments': return <SMDeployments />;
      case 'domains': return <DomainsScreen />;
      case 'health': return <SMSystemHealth />;
      case 'logs': return <SMInfraLogs />;
      case 'backups': return <SMBackups />;
      case 'settings': return <SettingsScreen />;
      default: return <OverviewScreen />;
    }
  };

  return (
    <div className="flex h-screen" style={{ background: '#000', color: '#ededed' }}>
      {/* Sidebar - Vercel style */}
      <aside className="w-[220px] flex-shrink-0 flex flex-col border-r" style={{ background: '#0a0a0a', borderColor: '#1a1a1a' }}>
        {/* Header */}
        <div className="h-[52px] flex items-center justify-between px-4 border-b" style={{ borderColor: '#1a1a1a' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
              <span className="text-black font-bold text-xs">▲</span>
            </div>
            <span className="text-sm font-semibold text-white">Server Manager</span>
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-xs transition-colors border-b"
          style={{ color: '#666', borderColor: '#1a1a1a' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#666')}
        >
          <ChevronLeft className="w-3 h-3" />
          Back
        </button>

        {/* Navigation */}
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
                  color: isActive ? '#fff' : '#888',
                  background: isActive ? '#1a1a1a' : 'transparent',
                  borderRight: isActive ? '2px solid #fff' : '2px solid transparent',
                }}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t" style={{ borderColor: '#1a1a1a' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px]" style={{ color: '#666' }}>All systems operational</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <ScrollArea className="h-full">
          <div className="p-6">{renderContent()}</div>
        </ScrollArea>
      </main>
    </div>
  );
}

/** Overview Screen - Vercel-style */
function OverviewScreen() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-sm mt-1" style={{ color: '#666' }}>Infrastructure status and recent activity</p>
      </div>

      {/* Server Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SERVERS.map(server => (
          <motion.div
            key={server.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border p-4"
            style={{ background: '#0a0a0a', borderColor: '#1a1a1a' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4" style={{ color: '#888' }} />
                <span className="text-sm font-medium text-white">{server.name}</span>
              </div>
              <Badge className="text-[10px]" style={{
                background: server.status === 'online' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                color: server.status === 'online' ? '#10b981' : '#ef4444',
                border: 'none'
              }}>
                {server.status}
              </Badge>
            </div>
            <div className="space-y-2">
              <MetricBar label="CPU" value={server.cpu} />
              <MetricBar label="RAM" value={server.ram} />
              <MetricBar label="Disk" value={server.disk} />
            </div>
            <div className="flex items-center justify-between mt-3 text-[11px]" style={{ color: '#666' }}>
              <span>{server.region}</span>
              <span>Uptime: {server.uptime}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Deployments */}
      <div className="rounded-lg border" style={{ background: '#0a0a0a', borderColor: '#1a1a1a' }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#1a1a1a' }}>
          <span className="text-sm font-medium text-white">Recent Deployments</span>
          <Badge variant="outline" className="text-[10px]" style={{ borderColor: '#333', color: '#888' }}>
            {DEPLOYMENTS.length} total
          </Badge>
        </div>
        <div>
          {DEPLOYMENTS.map(dep => (
            <div key={dep.id} className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 hover:bg-white/[0.02] transition-colors" style={{ borderColor: '#1a1a1a' }}>
              <div className="w-6">
                {dep.status === 'ready' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                {dep.status === 'building' && <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />}
                {dep.status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{dep.commit}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <GitBranch className="w-3 h-3" style={{ color: '#666' }} />
                  <span className="text-[11px]" style={{ color: '#666' }}>{dep.branch}</span>
                </div>
              </div>
              <Badge className="text-[10px]" style={{
                background: dep.env === 'Production' ? 'rgba(37,99,235,0.15)' : 'rgba(168,85,247,0.15)',
                color: dep.env === 'Production' ? '#3b82f6' : '#a855f7',
                border: 'none'
              }}>
                {dep.env}
              </Badge>
              <span className="text-[11px]" style={{ color: '#666' }}>{dep.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Domains Screen */
function DomainsScreen() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Domains & SSL</h1>
          <p className="text-sm mt-1" style={{ color: '#666' }}>Manage domains, DNS, and SSL certificates</p>
        </div>
        <Button size="sm" style={{ background: '#fff', color: '#000' }}>Add Domain</Button>
      </div>

      <div className="rounded-lg border" style={{ background: '#0a0a0a', borderColor: '#1a1a1a' }}>
        {DOMAINS.map((d, i) => (
          <div key={d.domain} className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0" style={{ borderColor: '#1a1a1a' }}>
            <Globe className="w-4 h-4" style={{ color: '#888' }} />
            <div className="flex-1">
              <p className="text-sm text-white font-medium">{d.domain}</p>
              <span className="text-[11px]" style={{ color: '#666' }}>{d.type}</span>
            </div>
            <div className="flex items-center gap-2">
              {d.ssl && (
                <Badge className="text-[10px]" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'none' }}>
                  <Lock className="w-3 h-3 mr-1" /> SSL
                </Badge>
              )}
              <Badge className="text-[10px]" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'none' }}>
                {d.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Settings Screen */
function SettingsScreen() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <div className="rounded-lg border p-6" style={{ background: '#0a0a0a', borderColor: '#1a1a1a' }}>
        <h3 className="text-sm font-medium text-white mb-4">General</h3>
        <div className="space-y-4">
          {['Auto-scaling', 'Auto-healing', 'Backup Schedule', 'Alert Notifications'].map(setting => (
            <div key={setting} className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: '#1a1a1a' }}>
              <span className="text-sm" style={{ color: '#ccc' }}>{setting}</span>
              <Badge className="text-[10px]" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'none' }}>Enabled</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Metric Bar */
function MetricBar({ label, value }: { label: string; value: number }) {
  const color = value > 80 ? '#ef4444' : value > 60 ? '#f59e0b' : '#10b981';
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] w-8" style={{ color: '#666' }}>{label}</span>
      <div className="flex-1 h-1.5 rounded-full" style={{ background: '#1a1a1a' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-[10px] font-mono w-8 text-right" style={{ color }}>{value}%</span>
    </div>
  );
}

export default ServerManagerLayout;
