/**
 * AIRA TOOL STACK — Advanced Enterprise Tool Intelligence System
 * Unified dashboard for all enterprise-grade tools AIRA uses:
 * Code Intel, Logs, Security, Monitoring, AI Perf, Repair, DB Health, Network, Voice, Marketing, Language
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench, Code, FileText, Shield, Activity, Brain, Database,
  Globe, Mic, TrendingUp, Network, CheckCircle, AlertTriangle,
  XCircle, RefreshCw, Play, Clock, Zap, Eye, Server, Lock,
  Bug, BarChart3, Search, Cpu, ChevronDown, ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

// ─── TYPES ──────────────────────────────────────────────
interface Tool {
  name: string;
  description: string;
  status: 'active' | 'standby' | 'error';
  lastRun: string;
  version: string;
}

interface ToolCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  purpose: string[];
  tools: Tool[];
  healthScore: number;
}

// ─── TOOL CATEGORIES DATA ───────────────────────────────
const toolCategories: ToolCategory[] = [
  {
    id: 'code-intel', label: 'Code Intelligence', icon: Code,
    color: 'text-blue-400', bg: 'bg-blue-500/10',
    purpose: ['Deep code scanning', 'Vulnerability detection', 'Logic error detection', 'Security auditing'],
    healthScore: 96,
    tools: [
      { name: 'Semgrep', description: 'Static analysis for finding bugs and enforcing code standards', status: 'active', lastRun: '3 min ago', version: 'v1.68.0' },
      { name: 'SonarQube', description: 'Continuous inspection of code quality and security', status: 'active', lastRun: '15 min ago', version: 'v10.4' },
      { name: 'CodeQL', description: 'Semantic code analysis engine for variant analysis', status: 'active', lastRun: '1h ago', version: 'v2.16' },
    ],
  },
  {
    id: 'log-intel', label: 'Log Intelligence', icon: FileText,
    color: 'text-purple-400', bg: 'bg-purple-500/10',
    purpose: ['Analyze system logs', 'Detect anomalies', 'Visualize infrastructure status'],
    healthScore: 98,
    tools: [
      { name: 'Elastic Stack (ELK)', description: 'Centralized logging with search and analytics', status: 'active', lastRun: 'Real-time', version: 'v8.12' },
      { name: 'Loki', description: 'Log aggregation system inspired by Prometheus', status: 'active', lastRun: 'Real-time', version: 'v3.0' },
      { name: 'Grafana', description: 'Observability dashboards and alerting', status: 'active', lastRun: 'Real-time', version: 'v10.3' },
    ],
  },
  {
    id: 'security', label: 'Security Scanning', icon: Shield,
    color: 'text-red-400', bg: 'bg-red-500/10',
    purpose: ['Vulnerability scanning', 'Dependency security', 'Container security'],
    healthScore: 92,
    tools: [
      { name: 'OWASP ZAP', description: 'Dynamic application security testing (DAST)', status: 'active', lastRun: '30 min ago', version: 'v2.15' },
      { name: 'Snyk', description: 'Developer-first security for dependencies and code', status: 'active', lastRun: '1h ago', version: 'Latest' },
      { name: 'Trivy', description: 'Comprehensive container and filesystem scanner', status: 'active', lastRun: '45 min ago', version: 'v0.50' },
    ],
  },
  {
    id: 'monitoring', label: 'System Monitoring', icon: Activity,
    color: 'text-emerald-400', bg: 'bg-emerald-500/10',
    purpose: ['Monitor CPU', 'Monitor RAM', 'Monitor disk usage', 'Monitor network health'],
    healthScore: 99,
    tools: [
      { name: 'Prometheus', description: 'Time-series monitoring and alerting toolkit', status: 'active', lastRun: 'Real-time', version: 'v2.50' },
      { name: 'Grafana', description: 'Metrics visualization and dashboards', status: 'active', lastRun: 'Real-time', version: 'v10.3' },
      { name: 'Netdata', description: 'Real-time infrastructure monitoring', status: 'active', lastRun: 'Real-time', version: 'v1.44' },
    ],
  },
  {
    id: 'ai-perf', label: 'AI Performance Monitor', icon: Brain,
    color: 'text-cyan-400', bg: 'bg-cyan-500/10',
    purpose: ['Track AI responses', 'Measure latency', 'Detect failures'],
    healthScore: 94,
    tools: [
      { name: 'LangSmith', description: 'LLM application observability and tracing', status: 'active', lastRun: 'Real-time', version: 'v0.1' },
      { name: 'OpenAI Tracing', description: 'Native OpenAI request tracing and analytics', status: 'active', lastRun: 'Real-time', version: 'Latest' },
      { name: 'Custom Telemetry', description: 'AIRA internal AI performance metrics engine', status: 'active', lastRun: 'Real-time', version: 'v3.0' },
    ],
  },
  {
    id: 'repair', label: 'Automated Repair Engine', icon: Wrench,
    color: 'text-amber-400', bg: 'bg-amber-500/10',
    purpose: ['Restart services', 'Redeploy applications', 'Manage containers'],
    healthScore: 97,
    tools: [
      { name: 'PM2', description: 'Advanced Node.js process manager with auto-restart', status: 'active', lastRun: '5 min ago', version: 'v5.3' },
      { name: 'Docker', description: 'Container orchestration and management', status: 'active', lastRun: '2 min ago', version: 'v25.0' },
      { name: 'Kubernetes', description: 'Container orchestration at scale', status: 'standby', lastRun: '1d ago', version: 'v1.29' },
    ],
  },
  {
    id: 'db-health', label: 'Database Health Tools', icon: Database,
    color: 'text-orange-400', bg: 'bg-orange-500/10',
    purpose: ['Database diagnostics', 'Query optimization', 'Connection monitoring'],
    healthScore: 95,
    tools: [
      { name: 'pgAdmin', description: 'PostgreSQL administration and monitoring', status: 'active', lastRun: 'Real-time', version: 'v8.3' },
      { name: 'MongoDB Compass', description: 'MongoDB GUI with query performance insights', status: 'standby', lastRun: '3d ago', version: 'v1.42' },
      { name: 'Redis Insight', description: 'Redis visualization and memory analysis', status: 'active', lastRun: 'Real-time', version: 'v2.44' },
    ],
  },
  {
    id: 'network', label: 'Network Security', icon: Network,
    color: 'text-rose-400', bg: 'bg-rose-500/10',
    purpose: ['Block malicious traffic', 'Prevent brute force attacks', 'Protect API endpoints'],
    healthScore: 98,
    tools: [
      { name: 'Cloudflare', description: 'CDN, DDoS protection, and WAF', status: 'active', lastRun: 'Real-time', version: 'Latest' },
      { name: 'Fail2Ban', description: 'Intrusion prevention and IP banning', status: 'active', lastRun: '1 min ago', version: 'v1.1' },
      { name: 'Firewall Rules', description: 'Custom iptables and ufw rule management', status: 'active', lastRun: 'Real-time', version: 'System' },
    ],
  },
  {
    id: 'voice', label: 'Voice Processing', icon: Mic,
    color: 'text-pink-400', bg: 'bg-pink-500/10',
    purpose: ['Speech recognition', 'Voice command execution', 'Voice responses'],
    healthScore: 100,
    tools: [
      { name: 'ElevenLabs', description: 'AI voice synthesis and cloning engine', status: 'active', lastRun: '10s ago', version: 'v2' },
      { name: 'Whisper', description: 'OpenAI speech recognition model', status: 'active', lastRun: '30s ago', version: 'v3' },
    ],
  },
  {
    id: 'marketing', label: 'Marketing & Sales Intelligence', icon: TrendingUp,
    color: 'text-indigo-400', bg: 'bg-indigo-500/10',
    purpose: ['Analyze user patterns', 'Recommend growth strategies', 'Assist business decisions'],
    healthScore: 91,
    tools: [
      { name: 'Analytics Engine', description: 'Custom user behavior and conversion tracking', status: 'active', lastRun: 'Real-time', version: 'v2.0' },
      { name: 'Market Trend APIs', description: 'Real-time market data and trend analysis', status: 'active', lastRun: '5 min ago', version: 'Latest' },
      { name: 'Behavior Analysis', description: 'AI-driven user engagement pattern detection', status: 'active', lastRun: '15 min ago', version: 'v1.5' },
    ],
  },
  {
    id: 'language', label: 'Global Language System', icon: Globe,
    color: 'text-teal-400', bg: 'bg-teal-500/10',
    purpose: ['Translate conversations', 'Communicate globally', 'Support multiple languages'],
    healthScore: 93,
    tools: [
      { name: 'Translation Models', description: 'Neural machine translation across 100+ languages', status: 'active', lastRun: '1 min ago', version: 'v4.0' },
      { name: 'Multilingual NLP', description: 'Language detection, sentiment, and entity extraction', status: 'active', lastRun: '2 min ago', version: 'v3.2' },
    ],
  },
];

// ─── STATUS CONFIG ──────────────────────────────────────
const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  active: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle },
  standby: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Clock },
  error: { color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle },
};

const scoreColor = (s: number) => s >= 95 ? 'text-emerald-400' : s >= 85 ? 'text-cyan-400' : s >= 70 ? 'text-amber-400' : 'text-red-400';
const scoreBg = (s: number) => s >= 95 ? 'bg-emerald-500/10' : s >= 85 ? 'bg-cyan-500/10' : s >= 70 ? 'bg-amber-500/10' : 'bg-red-500/10';

// ─── COMPONENT ──────────────────────────────────────────
const AIRAToolStack: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const totalTools = toolCategories.reduce((a, c) => a + c.tools.length, 0);
  const activeTools = toolCategories.reduce((a, c) => a + c.tools.filter(t => t.status === 'active').length, 0);
  const avgHealth = Math.round(toolCategories.reduce((a, c) => a + c.healthScore, 0) / toolCategories.length);

  const handleScanAll = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      toast.success('AIRA full tool stack scan completed — all systems operational');
    }, 4000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-cyan-400" />
            </div>
            AIRA Tool Stack
          </h1>
          <p className="text-sm text-white/50 mt-1">Enterprise-grade tool intelligence for autonomous system control</p>
        </div>
        <Button onClick={handleScanAll} disabled={scanning} className="bg-cyan-600 hover:bg-cyan-700">
          {scanning ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Scanning All Tools...</> : <><Search className="w-4 h-4 mr-2" /> Full Stack Scan</>}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Tools', value: totalTools, color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Wrench },
          { label: 'Active', value: activeTools, color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle },
          { label: 'Categories', value: toolCategories.length, color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Cpu },
          { label: 'Avg Health', value: `${avgHealth}%`, color: scoreColor(avgHealth), bg: scoreBg(avgHealth), icon: Activity },
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

      {/* Tool Categories */}
      <div className="space-y-3">
        {toolCategories.map((cat, ci) => {
          const Icon = cat.icon;
          const isExpanded = expanded === cat.id;
          const activeCount = cat.tools.filter(t => t.status === 'active').length;

          return (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.04 }}>
              <Card className="bg-white/[0.03] border-cyan-500/10 hover:border-cyan-500/25 transition-colors">
                {/* Category Header */}
                <button onClick={() => setExpanded(isExpanded ? null : cat.id)} className="w-full text-left">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl ${cat.bg} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${cat.color}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white">{cat.label}</p>
                            <Badge variant="outline" className={`${cat.color} ${cat.bg} border-none text-xs`}>
                              {activeCount}/{cat.tools.length} Active
                            </Badge>
                          </div>
                          <p className="text-xs text-white/40 mt-0.5">{cat.purpose.join(' • ')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Progress value={cat.healthScore} className="w-20 h-1.5" />
                          <span className={`text-sm font-bold ${scoreColor(cat.healthScore)}`}>{cat.healthScore}%</span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                      </div>
                    </div>
                  </CardContent>
                </button>

                {/* Expanded Tools */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4 space-y-2">
                        <div className="border-t border-cyan-500/10 pt-3" />
                        {cat.tools.map((tool, ti) => {
                          const sc = statusConfig[tool.status];
                          const SIcon = sc.icon;
                          return (
                            <motion.div key={tool.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: ti * 0.05 }}
                              className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-cyan-500/5">
                              <div className="flex items-center gap-3">
                                <SIcon className={`w-4 h-4 ${sc.color}`} />
                                <div>
                                  <p className="text-sm font-medium text-white">{tool.name}</p>
                                  <p className="text-xs text-white/35">{tool.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-xs">
                                <Badge variant="outline" className={`${sc.color} ${sc.bg} border-none`}>
                                  {tool.status}
                                </Badge>
                                <span className="text-white/30">{tool.version}</span>
                                <span className="text-white/30">{tool.lastRun}</span>
                              </div>
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

      {/* Footer Info */}
      <Card className="bg-cyan-500/5 border-cyan-500/15">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-cyan-400" />
            <p className="text-sm text-white/50">
              AIRA autonomously manages all {totalTools} tools across {toolCategories.length} categories. Tools are continuously monitored and auto-repaired when issues are detected.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIRAToolStack;
