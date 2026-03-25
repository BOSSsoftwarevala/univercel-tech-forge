// ============================================
// DEPLOYMENTS — VERCEL CLONE
// Git-push → Build → Deploy Pipeline
// ============================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, CheckCircle2, Clock, XCircle, GitBranch, 
  Server, Eye, RotateCcw, ExternalLink, GitCommit,
  Loader2, ChevronDown, Filter, MoreHorizontal, Plus,
  ArrowUpRight, Play, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Deployment {
  id: string;
  name: string;
  branch: string;
  commit: string;
  commitMsg: string;
  server: string;
  status: 'ready' | 'building' | 'error' | 'queued' | 'cancelled';
  environment: 'production' | 'preview';
  time: string;
  duration: string;
  url?: string;
  author: string;
}

const mockDeployments: Deployment[] = [
  { 
    id: 'dpl_1', name: 'softwarewala.net', branch: 'main', 
    commit: 'a3f8c21', commitMsg: 'fix: auth redirect loop on mobile',
    server: 'srv1183368', status: 'ready', environment: 'production',
    time: '2m ago', duration: '48s', url: 'https://softwarewala.net',
    author: 'Boss'
  },
  { 
    id: 'dpl_2', name: 'softwarewala.net', branch: 'feat/deploy-pipeline', 
    commit: 'b7d2e45', commitMsg: 'feat: add VPS auto-deploy pipeline',
    server: 'srv1183368', status: 'building', environment: 'preview',
    time: '5m ago', duration: '32s',
    author: 'DevTeam'
  },
  { 
    id: 'dpl_3', name: 'client-demo.softwarewala.net', branch: 'main', 
    commit: 'c1e9f67', commitMsg: 'chore: update dependencies',
    server: 'srv1183368', status: 'ready', environment: 'production',
    time: '1h ago', duration: '1m 12s', url: 'https://client-demo.softwarewala.net',
    author: 'System'
  },
  { 
    id: 'dpl_4', name: 'api.softwarewala.net', branch: 'hotfix/cors', 
    commit: 'e4a1b89', commitMsg: 'fix: CORS headers for edge functions',
    server: 'srv1183368', status: 'error', environment: 'production',
    time: '3h ago', duration: '2m 01s',
    author: 'DevTeam'
  },
  { 
    id: 'dpl_5', name: 'staging.softwarewala.net', branch: 'develop', 
    commit: 'f2c3d10', commitMsg: 'feat: new marketplace UI components',
    server: 'srv1183368', status: 'ready', environment: 'preview',
    time: '5h ago', duration: '55s', url: 'https://staging.softwarewala.net',
    author: 'Boss'
  },
  { 
    id: 'dpl_6', name: 'softwarewala.net', branch: 'main', 
    commit: '98ab12c', commitMsg: 'refactor: optimize bundle size',
    server: 'srv1183368', status: 'cancelled', environment: 'production',
    time: '8h ago', duration: '15s',
    author: 'System'
  },
];

const SMDeployments = () => {
  const [filter, setFilter] = useState<'all' | 'production' | 'preview'>('all');
  const [deployments] = useState<Deployment[]>(mockDeployments);

  const filtered = filter === 'all' 
    ? deployments 
    : deployments.filter(d => d.environment === filter);

  const statusConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
    ready: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Ready' },
    building: { icon: Loader2, color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Building' },
    error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Error' },
    queued: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Queued' },
    cancelled: { icon: XCircle, color: 'text-[#666]', bg: 'bg-[#222]', label: 'Cancelled' },
  };

  const handleRedeploy = (name: string) => {
    toast.success(`Redeploying ${name}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Deployments</h1>
          <p className="text-sm text-[#888] mt-1">View and manage all deployments across your infrastructure</p>
        </div>
        <Button className="bg-white text-black hover:bg-[#ccc] text-sm font-medium h-9 px-4">
          <Plus className="w-3.5 h-3.5 mr-2" />
          Deploy
        </Button>
      </div>

      {/* Filter Tabs — Vercel style */}
      <div className="flex items-center gap-1 border-b border-[#333]">
        {(['all', 'production', 'preview'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2.5 text-sm capitalize transition-colors relative ${
              filter === tab 
                ? 'text-white' 
                : 'text-[#888] hover:text-white'
            }`}
          >
            {tab}
            {filter === tab && (
              <motion.div layoutId="deployTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
        ))}
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#888] hover:text-white transition-colors">
          <Filter className="w-3.5 h-3.5" />
          Filter
        </button>
      </div>

      {/* Deployment List — Vercel Style */}
      <div className="border border-[#333] rounded-lg overflow-hidden">
        {filtered.map((deployment, i) => {
          const config = statusConfig[deployment.status];
          const StatusIcon = config.icon;
          const isBuilding = deployment.status === 'building';

          return (
            <motion.div
              key={deployment.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 px-5 py-4 bg-[#0a0a0a] hover:bg-[#111] transition-colors ${
                i < filtered.length - 1 ? 'border-b border-[#222]' : ''
              }`}
            >
              {/* Status */}
              <div className={`flex-shrink-0 ${config.color}`}>
                <StatusIcon className={`w-[18px] h-[18px] ${isBuilding ? 'animate-spin' : ''}`} />
              </div>

              {/* Main Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium truncate">{deployment.name}</span>
                  {deployment.url && (
                    <a 
                      href={deployment.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#888] hover:text-blue-400 transition-colors"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-[#888]">
                    <GitBranch className="w-3 h-3" />
                    {deployment.branch}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#666]">
                    <GitCommit className="w-3 h-3" />
                    {deployment.commit}
                  </span>
                  <span className="text-xs text-[#555] truncate max-w-[200px]">
                    {deployment.commitMsg}
                  </span>
                </div>
              </div>

              {/* Environment Badge */}
              <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                deployment.environment === 'production'
                  ? 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                  : 'text-[#888] border-[#333] bg-[#111]'
              }`}>
                {deployment.environment === 'production' ? 'Production' : 'Preview'}
              </span>

              {/* Time & Duration */}
              <div className="text-right flex-shrink-0 w-24">
                <p className="text-xs text-[#888]">{deployment.time}</p>
                <p className="text-[11px] text-[#555]">{deployment.duration}</p>
              </div>

              {/* Author */}
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">
                {deployment.author.charAt(0)}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {deployment.status === 'error' && (
                  <button 
                    onClick={() => handleRedeploy(deployment.name)}
                    className="p-1.5 text-[#888] hover:text-white hover:bg-[#222] rounded transition-colors"
                    title="Redeploy"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button className="p-1.5 text-[#888] hover:text-white hover:bg-[#222] rounded transition-colors">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Build Output Preview */}
      {deployments.some(d => d.status === 'building') && (
        <div className="border border-[#333] rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-[#111] border-b border-[#222] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span className="text-sm text-white font-medium">Build Output</span>
            </div>
            <span className="text-xs text-[#555] font-mono">Live</span>
          </div>
          <div className="bg-[#0a0a0a] p-4 font-mono text-xs leading-6 text-[#888] max-h-48 overflow-auto">
            <div className="text-[#555]">[12:34:01] Cloning repository...</div>
            <div className="text-emerald-500">[12:34:03] ✓ Repository cloned</div>
            <div className="text-[#555]">[12:34:03] Installing dependencies...</div>
            <div className="text-emerald-500">[12:34:15] ✓ Dependencies installed (1,247 packages)</div>
            <div className="text-[#555]">[12:34:15] Building project...</div>
            <div className="text-amber-400">[12:34:32] ⏳ Running vite build...</div>
            <div className="text-[#444]">  dist/assets/index-a3f8c21.js   542.3 kB │ gzip: 164.2 kB</div>
            <div className="text-[#444]">  dist/assets/index-b7d2e45.css   48.1 kB │ gzip: 8.7 kB</div>
            <div className="animate-pulse text-white">▋</div>
          </div>
        </div>
      )}

      {/* Stats Footer */}
      <div className="flex items-center justify-between text-xs text-[#555] pt-2 border-t border-[#222]">
        <span>{filtered.length} deployments shown</span>
        <span>Last deploy: {deployments[0]?.time}</span>
      </div>
    </div>
  );
};

export default SMDeployments;
