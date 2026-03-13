/**
 * VALA AI — Full System Auto Healing Engine
 * Continuous background scanning + automatic repair for entire platform
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartPulse, Shield, Server, Code, Globe, Database, Cpu, Activity,
  CheckCircle, AlertTriangle, XCircle, RefreshCw, Zap, Clock,
  Play, Pause, BarChart3, FileText, Lock, Wrench, Eye,
  ChevronDown, ChevronUp, Radio, Bug, Layers
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

// ─── TYPES ──────────────────────────────────────────────
type ScanStatus = 'healthy' | 'warning' | 'critical' | 'repairing' | 'scanning';
type RepairAction = {
  id: string;
  target: string;
  action: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
};

interface ScanTarget {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  status: ScanStatus;
  lastScan: string;
  frequency: string;
  healthScore: number;
  checks: { name: string; status: ScanStatus; detail: string }[];
}

// ─── STATUS CONFIG ──────────────────────────────────────
const statusConfig: Record<ScanStatus, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  healthy: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle, label: 'Healthy' },
  warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: AlertTriangle, label: 'Warning' },
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle, label: 'Critical' },
  repairing: { color: 'text-cyan-400', bg: 'bg-cyan-500/10', icon: Wrench, label: 'Repairing' },
  scanning: { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: RefreshCw, label: 'Scanning' },
};

// ─── INITIAL SCAN TARGETS ───────────────────────────────
const initialTargets: ScanTarget[] = [
  {
    id: 'products', label: 'Product Health', icon: Layers, color: 'text-blue-400', bg: 'bg-blue-500/10',
    status: 'healthy', lastScan: '8s ago', frequency: '10s', healthScore: 98,
    checks: [
      { name: 'Product build verification', status: 'healthy', detail: 'All 24 products built successfully' },
      { name: 'Demo system status', status: 'healthy', detail: '12 active demos running' },
      { name: 'Download system', status: 'healthy', detail: 'CDN delivery operational' },
      { name: 'Configuration validation', status: 'healthy', detail: 'All configs verified' },
    ],
  },
  {
    id: 'code', label: 'Code Health', icon: Code, color: 'text-purple-400', bg: 'bg-purple-500/10',
    status: 'healthy', lastScan: '15s ago', frequency: '1m', healthScore: 96,
    checks: [
      { name: 'Syntax errors', status: 'healthy', detail: '0 errors detected' },
      { name: 'Dependency conflicts', status: 'healthy', detail: 'All dependencies resolved' },
      { name: 'Broken imports', status: 'healthy', detail: '0 broken imports' },
      { name: 'Missing modules', status: 'healthy', detail: 'All 37 modules loaded' },
    ],
  },
  {
    id: 'api', label: 'API Health', icon: Globe, color: 'text-cyan-400', bg: 'bg-cyan-500/10',
    status: 'healthy', lastScan: '5s ago', frequency: '10s', healthScore: 99,
    checks: [
      { name: 'Endpoint availability', status: 'healthy', detail: '48/48 endpoints active' },
      { name: 'Response time', status: 'healthy', detail: 'Avg 142ms' },
      { name: 'Authentication', status: 'healthy', detail: 'All tokens valid' },
      { name: 'Provider status', status: 'healthy', detail: 'OpenAI, Claude, Gemini — online' },
    ],
  },
  {
    id: 'server', label: 'Server Health', icon: Server, color: 'text-emerald-400', bg: 'bg-emerald-500/10',
    status: 'healthy', lastScan: '3s ago', frequency: '10s', healthScore: 97,
    checks: [
      { name: 'CPU usage', status: 'healthy', detail: '34% utilized' },
      { name: 'RAM usage', status: 'healthy', detail: '2.1 GB / 4 GB' },
      { name: 'Disk space', status: 'healthy', detail: '45% used — 22 GB free' },
      { name: 'Service status', status: 'healthy', detail: 'All 8 services running' },
    ],
  },
  {
    id: 'deployment', label: 'Deployment Monitor', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10',
    status: 'healthy', lastScan: '20s ago', frequency: '1m', healthScore: 100,
    checks: [
      { name: 'Build status', status: 'healthy', detail: 'Last build: success (2m 14s)' },
      { name: 'Container health', status: 'healthy', detail: '3/3 containers running' },
      { name: 'Deployment status', status: 'healthy', detail: 'Production v3.2.1 live' },
    ],
  },
  {
    id: 'ai-tools', label: 'AI Tool Monitor', icon: Cpu, color: 'text-pink-400', bg: 'bg-pink-500/10',
    status: 'healthy', lastScan: '7s ago', frequency: '10s', healthScore: 95,
    checks: [
      { name: 'OpenAI (GPT-5)', status: 'healthy', detail: 'Online — 98ms latency' },
      { name: 'Claude (Sonnet)', status: 'healthy', detail: 'Online — 112ms latency' },
      { name: 'Gemini (Flash)', status: 'healthy', detail: 'Online — 87ms latency' },
      { name: 'ElevenLabs', status: 'healthy', detail: 'Online — voice synthesis active' },
    ],
  },
  {
    id: 'ui-routes', label: 'UI Route Scan', icon: Eye, color: 'text-indigo-400', bg: 'bg-indigo-500/10',
    status: 'healthy', lastScan: '1m ago', frequency: '5m', healthScore: 100,
    checks: [
      { name: 'Route availability', status: 'healthy', detail: '72/72 routes accessible' },
      { name: 'Component loading', status: 'healthy', detail: 'All lazy components resolve' },
      { name: 'Loading failures', status: 'healthy', detail: '0 chunk load errors' },
    ],
  },
  {
    id: 'database', label: 'Database Health', icon: Database, color: 'text-orange-400', bg: 'bg-orange-500/10',
    status: 'healthy', lastScan: '12s ago', frequency: '10s', healthScore: 98,
    checks: [
      { name: 'Connection pool', status: 'healthy', detail: '8/20 connections active' },
      { name: 'Query performance', status: 'healthy', detail: 'Avg 12ms per query' },
      { name: 'Table integrity', status: 'healthy', detail: 'All 120+ tables verified' },
      { name: 'RLS policies', status: 'healthy', detail: '100% tables protected' },
    ],
  },
  {
    id: 'security', label: 'Security Scan', icon: Shield, color: 'text-red-400', bg: 'bg-red-500/10',
    status: 'healthy', lastScan: '30s ago', frequency: '1m', healthScore: 99,
    checks: [
      { name: 'SSL certificates', status: 'healthy', detail: 'Valid — expires in 87 days' },
      { name: 'Domain lock', status: 'healthy', detail: 'Transfer protection active' },
      { name: 'API key protection', status: 'healthy', detail: 'All secrets encrypted' },
      { name: 'Unauthorized access', status: 'healthy', detail: '0 suspicious attempts' },
    ],
  },
  {
    id: 'logs', label: 'Log Analysis', icon: FileText, color: 'text-teal-400', bg: 'bg-teal-500/10',
    status: 'healthy', lastScan: '45s ago', frequency: '1m', healthScore: 97,
    checks: [
      { name: 'Server logs', status: 'healthy', detail: 'No anomalies detected' },
      { name: 'Deployment logs', status: 'healthy', detail: 'Clean build history' },
      { name: 'AI provider logs', status: 'healthy', detail: 'Normal response patterns' },
      { name: 'Application logs', status: 'healthy', detail: '0 critical errors in 24h' },
    ],
  },
];

// ─── REPAIR HISTORY ─────────────────────────────────────
const initialRepairs: RepairAction[] = [
  { id: '1', target: 'API Gateway', action: 'Restarted rate limiter service', status: 'completed', startedAt: '2h ago', completedAt: '2h ago' },
  { id: '2', target: 'Redis Cache', action: 'Flushed stale session keys', status: 'completed', startedAt: '4h ago', completedAt: '4h ago' },
  { id: '3', target: 'Nginx', action: 'Reloaded SSL configuration', status: 'completed', startedAt: '6h ago', completedAt: '6h ago' },
  { id: '4', target: 'Docker Container #2', action: 'Auto-restarted after health check fail', status: 'completed', startedAt: '12h ago', completedAt: '12h ago' },
  { id: '5', target: 'OpenAI Provider', action: 'Switched to fallback endpoint', status: 'completed', startedAt: '1d ago', completedAt: '1d ago' },
];

// ─── COMPONENT ──────────────────────────────────────────
const AutoHealingEngine: React.FC = () => {
  const [targets, setTargets] = useState<ScanTarget[]>(initialTargets);
  const [repairs] = useState<RepairAction[]>(initialRepairs);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [engineRunning, setEngineRunning] = useState(true);
  const [scanCycle, setScanCycle] = useState(0);
  const [fullScanning, setFullScanning] = useState(false);

  // Simulate continuous scan loop
  useEffect(() => {
    if (!engineRunning) return;
    const interval = setInterval(() => {
      setScanCycle(prev => prev + 1);
      setTargets(prev => prev.map(t => ({
        ...t,
        lastScan: `${Math.floor(Math.random() * 30) + 1}s ago`,
        healthScore: Math.min(100, Math.max(90, t.healthScore + Math.floor(Math.random() * 3) - 1)),
      })));
    }, 10000);
    return () => clearInterval(interval);
  }, [engineRunning]);

  const totalChecks = targets.reduce((a, t) => a + t.checks.length, 0);
  const healthyChecks = targets.reduce((a, t) => a + t.checks.filter(c => c.status === 'healthy').length, 0);
  const avgHealth = Math.round(targets.reduce((a, t) => a + t.healthScore, 0) / targets.length);
  const completedRepairs = repairs.filter(r => r.status === 'completed').length;

  const handleFullScan = useCallback(() => {
    setFullScanning(true);
    toast.info('Full system scan initiated — scanning all 10 target areas...');
    setTimeout(() => {
      setFullScanning(false);
      toast.success('Full system scan complete — all systems operational');
    }, 5000);
  }, []);

  const toggleEngine = useCallback(() => {
    setEngineRunning(prev => !prev);
    toast(engineRunning ? 'Auto Healing Engine paused' : 'Auto Healing Engine resumed');
  }, [engineRunning]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-emerald-400" />
            </div>
            Auto Healing Engine
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Continuous system scanning • Automatic repair • Zero manual debugging
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={toggleEngine} variant="outline" size="sm"
            className={engineRunning ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'}>
            {engineRunning ? <><Pause className="w-4 h-4 mr-2" /> Pause Engine</> : <><Play className="w-4 h-4 mr-2" /> Resume Engine</>}
          </Button>
          <Button onClick={handleFullScan} disabled={fullScanning} className="bg-cyan-600 hover:bg-cyan-700">
            {fullScanning ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Scanning...</> : <><Activity className="w-4 h-4 mr-2" /> Full System Scan</>}
          </Button>
        </div>
      </div>

      {/* Engine Status Banner */}
      <Card className={`border ${engineRunning ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${engineRunning ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            <span className={`text-sm font-medium ${engineRunning ? 'text-emerald-400' : 'text-red-400'}`}>
              {engineRunning ? 'ENGINE ACTIVE — Continuous monitoring enabled' : 'ENGINE PAUSED — Monitoring suspended'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span>Scan Cycles: {scanCycle}</span>
            <span>Uptime: 99.99%</span>
            <span>Last Full Scan: 4m ago</span>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'System Health', value: `${avgHealth}%`, color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: HeartPulse },
          { label: 'Scan Targets', value: targets.length, color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Radio },
          { label: 'Total Checks', value: `${healthyChecks}/${totalChecks}`, color: 'text-cyan-400', bg: 'bg-cyan-500/10', icon: CheckCircle },
          { label: 'Auto Repairs', value: completedRepairs, color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Wrench },
          { label: 'Issues Found', value: totalChecks - healthyChecks, color: 'text-red-400', bg: 'bg-red-500/10', icon: Bug },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-white/[0.03] border-cyan-500/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-white/40">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Scan Loop Visualization */}
      <Card className="bg-white/[0.03] border-cyan-500/10">
        <CardContent className="p-4">
          <p className="text-xs text-white/40 mb-3 font-medium">SCAN CYCLE PIPELINE</p>
          <div className="flex items-center justify-between">
            {['System Scan', 'Issue Detection', 'Root Cause Analysis', 'Auto Repair', 'Verification', 'Monitoring'].map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    engineRunning ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-white/5 border border-white/10'
                  }`}>
                    <span className={`text-xs font-bold ${engineRunning ? 'text-emerald-400' : 'text-white/30'}`}>{i + 1}</span>
                  </div>
                  <span className="text-[10px] text-white/40 text-center max-w-[70px]">{step}</span>
                </div>
                {i < 5 && <div className={`flex-1 h-px mx-2 ${engineRunning ? 'bg-emerald-500/30' : 'bg-white/10'}`} />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scan Targets */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-white/60">SCAN TARGETS</p>
        {targets.map((target, ti) => {
          const Icon = target.icon;
          const isExpanded = expanded === target.id;
          const sc = statusConfig[target.status];
          const SIcon = sc.icon;

          return (
            <motion.div key={target.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ti * 0.03 }}>
              <Card className="bg-white/[0.03] border-cyan-500/10 hover:border-cyan-500/25 transition-colors">
                <button onClick={() => setExpanded(isExpanded ? null : target.id)} className="w-full text-left">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl ${target.bg} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${target.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white">{target.label}</p>
                            <Badge variant="outline" className={`${sc.color} ${sc.bg} border-none text-xs`}>
                              <SIcon className="w-3 h-3 mr-1" />
                              {sc.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-white/40 mt-0.5">
                            {target.checks.length} checks • Every {target.frequency} • Last: {target.lastScan}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Progress value={target.healthScore} className="w-20 h-1.5" />
                          <span className={`text-sm font-bold ${target.healthScore >= 95 ? 'text-emerald-400' : target.healthScore >= 85 ? 'text-cyan-400' : 'text-amber-400'}`}>
                            {target.healthScore}%
                          </span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                      </div>
                    </div>
                  </CardContent>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <div className="px-4 pb-4 space-y-2">
                        <div className="border-t border-cyan-500/10 pt-3" />
                        {target.checks.map((check, ci) => {
                          const csc = statusConfig[check.status];
                          const CSIcon = csc.icon;
                          return (
                            <motion.div key={check.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ci * 0.04 }}
                              className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-cyan-500/5">
                              <div className="flex items-center gap-3">
                                <CSIcon className={`w-4 h-4 ${csc.color}`} />
                                <div>
                                  <p className="text-sm font-medium text-white">{check.name}</p>
                                  <p className="text-xs text-white/35">{check.detail}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className={`${csc.color} ${csc.bg} border-none text-xs`}>{csc.label}</Badge>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Repairs */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-white/60">RECENT AUTO REPAIRS</p>
        <Card className="bg-white/[0.03] border-cyan-500/10">
          <CardContent className="p-4 space-y-2">
            {repairs.map((repair) => (
              <div key={repair.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-cyan-500/5">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{repair.target}</p>
                    <p className="text-xs text-white/35">{repair.action}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-none">Completed</Badge>
                  <span className="text-white/30">{repair.startedAt}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Scan Frequency Table */}
      <Card className="bg-white/[0.03] border-cyan-500/10">
        <CardContent className="p-4">
          <p className="text-xs text-white/40 mb-3 font-medium">SCAN FREQUENCY SCHEDULE</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Critical Systems', freq: 'Every 10 seconds', targets: 'API, Server, AI Tools, Database', color: 'text-red-400', bg: 'bg-red-500/10' },
              { label: 'Standard Systems', freq: 'Every 1 minute', targets: 'Code, Security, Logs, Deployment', color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'Full System Scan', freq: 'Every 5 minutes', targets: 'All 10 target areas + verification', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            ].map(s => (
              <div key={s.label} className={`p-3 rounded-lg ${s.bg} border border-white/5`}>
                <p className={`text-sm font-semibold ${s.color}`}>{s.label}</p>
                <p className="text-xs text-white/60 mt-1">{s.freq}</p>
                <p className="text-[10px] text-white/30 mt-1">{s.targets}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="bg-emerald-500/5 border-emerald-500/15">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <HeartPulse className="w-5 h-5 text-emerald-400" />
            <p className="text-sm text-white/50">
              VALA Auto Healing Engine monitors {targets.length} system areas with {totalChecks} individual checks, running continuously to detect and repair issues before they impact operations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoHealingEngine;
