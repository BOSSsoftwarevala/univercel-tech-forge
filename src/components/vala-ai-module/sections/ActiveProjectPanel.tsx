/**
 * VALA AI - Active Project Panel
 * Shows current project status, files, and build info
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen, FileCode, Globe, GitBranch, Clock, 
  CheckCircle2, AlertCircle, RefreshCw, ExternalLink,
  Layers, Database, Server, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const MOCK_PROJECT = {
  name: 'Restaurant POS System',
  status: 'active',
  lastBuild: '2 min ago',
  domain: 'restaurant-pos.softwarevala.com',
  repo: 'github.com/BOSSsoftwarevala/restaurant-pos',
  screens: 12,
  apis: 18,
  tables: 8,
  progress: 85,
  files: [
    { name: 'src/App.tsx', status: 'modified', size: '4.2 KB' },
    { name: 'src/pages/Dashboard.tsx', status: 'new', size: '8.1 KB' },
    { name: 'src/pages/Orders.tsx', status: 'new', size: '6.3 KB' },
    { name: 'src/components/MenuGrid.tsx', status: 'new', size: '3.8 KB' },
    { name: 'src/api/routes.ts', status: 'new', size: '2.1 KB' },
    { name: 'database/schema.sql', status: 'new', size: '1.5 KB' },
  ],
  recentActions: [
    { action: 'Generated 12 screens', time: '2 min ago', type: 'success' as const },
    { action: 'Created database schema', time: '3 min ago', type: 'success' as const },
    { action: 'API endpoints designed', time: '4 min ago', type: 'success' as const },
    { action: 'Build deployed to demo', time: '5 min ago', type: 'success' as const },
  ],
};

const ActiveProjectPanel: React.FC = () => {
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success('Project synced successfully');
    }, 1500);
  };

  const handleOpenDemo = () => {
    toast.info(`Opening: ${MOCK_PROJECT.domain}`);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: '#0B0F1A' }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(37, 99, 235, 0.2)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
            <FolderOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{MOCK_PROJECT.name}</h1>
            <p className="text-xs flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Active
              </span>
              <span>•</span>
              <span>Last build: {MOCK_PROJECT.lastBuild}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 px-3 text-xs gap-1.5 text-white/60 hover:text-white hover:bg-white/5" onClick={handleSync}>
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <Button size="sm" className="h-8 px-3 text-xs gap-1.5" style={{ background: '#2563eb' }} onClick={handleOpenDemo}>
            <ExternalLink className="w-3.5 h-3.5" />
            Open Demo
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Screens', value: MOCK_PROJECT.screens, icon: Layers, color: '#2563eb' },
              { label: 'APIs', value: MOCK_PROJECT.apis, icon: Server, color: '#7c3aed' },
              { label: 'DB Tables', value: MOCK_PROJECT.tables, icon: Database, color: '#10b981' },
              { label: 'Progress', value: `${MOCK_PROJECT.progress}%`, icon: Eye, color: '#f59e0b' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <stat.icon className="w-4 h-4 mb-2" style={{ color: stat.color }} />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Project Links */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <Globe className="w-5 h-5" style={{ color: '#10b981' }} />
              <div>
                <div className="text-xs font-semibold text-white">Demo Domain</div>
                <div className="text-[11px] font-mono" style={{ color: '#10b981' }}>{MOCK_PROJECT.domain}</div>
              </div>
            </div>
            <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.15)' }}>
              <GitBranch className="w-5 h-5" style={{ color: '#60a5fa' }} />
              <div>
                <div className="text-xs font-semibold text-white">Repository</div>
                <div className="text-[11px] font-mono" style={{ color: '#60a5fa' }}>{MOCK_PROJECT.repo}</div>
              </div>
            </div>
          </div>

          {/* Files List */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <FileCode className="w-4 h-4" style={{ color: '#60a5fa' }} />
              Generated Files
            </h3>
            <div className="space-y-1">
              {MOCK_PROJECT.files.map((file) => (
                <div key={file.name} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5" style={{ color: '#06b6d4' }} />
                    <span className="text-xs font-mono text-white/70">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{file.size}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{
                      background: file.status === 'new' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color: file.status === 'new' ? '#10b981' : '#f59e0b',
                    }}>{file.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Actions */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: '#f59e0b' }} />
              Recent Actions
            </h3>
            <div className="space-y-2">
              {MOCK_PROJECT.recentActions.map((action, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                  <span className="text-xs text-white/70 flex-1">{action.action}</span>
                  <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{action.time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ActiveProjectPanel;
