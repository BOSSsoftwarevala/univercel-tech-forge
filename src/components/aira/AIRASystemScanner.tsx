/**
 * AIRA SYSTEM SCANNER
 * Monitors all 37 dashboards across the Software Vala ecosystem.
 * Collects operational data, detects anomalies, generates executive reports.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanLine, Eye, Shield, Server, Package, Users, Brain,
  Activity, FileText, Zap, Globe2, BarChart3, AlertTriangle,
  CheckCircle2, XCircle, Clock, RefreshCw, ChevronRight,
  MonitorSmartphone, Database, Layers, ShoppingCart, Briefcase,
  MessageSquare, Scale, TrendingUp, Megaphone, Search,
  UserPlus, Headphones, Store, Star, Map, DollarSign,
  Bell, Plug, ScrollText, Lock, Settings, Code, Wrench,
  Cpu, Network, LayoutDashboard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ─── 37 Monitored Modules ─────────────────────────────────────
export interface ModuleScanResult {
  id: string;
  name: string;
  icon: React.ElementType;
  category: 'executive' | 'operations' | 'management' | 'distribution' | 'system';
  status: 'online' | 'warning' | 'critical' | 'offline' | 'scanning';
  lastScanAt: string;
  activityCount: number;
  errorCount: number;
  healthScore: number;
  trend: 'up' | 'down' | 'stable';
  dbTable?: string;
}

const MODULE_REGISTRY: Omit<ModuleScanResult, 'status' | 'lastScanAt' | 'activityCount' | 'errorCount' | 'healthScore' | 'trend'>[] = [
  // Executive (2)
  { id: 'boss-panel', name: 'Boss Panel', icon: Shield, category: 'executive', dbTable: 'system_events' },
  { id: 'ceo-dashboard', name: 'CEO Dashboard', icon: Eye, category: 'executive', dbTable: 'audit_logs' },
  // Operations (12)
  { id: 'vala-ai', name: 'Vala AI', icon: Brain, category: 'operations', dbTable: 'ai_jobs' },
  { id: 'server-manager', name: 'Server Manager', icon: Server, category: 'operations', dbTable: 'server_instances' },
  { id: 'ai-api-manager', name: 'AI API Manager', icon: Cpu, category: 'operations', dbTable: 'ai_usage_logs' },
  { id: 'dev-manager', name: 'Development Manager', icon: Code, category: 'operations', dbTable: 'audit_logs' },
  { id: 'product-manager', name: 'Product Manager', icon: Package, category: 'operations', dbTable: 'products' },
  { id: 'demo-manager', name: 'Demo Manager', icon: MonitorSmartphone, category: 'operations', dbTable: 'demos' },
  { id: 'task-manager', name: 'Task Manager', icon: FileText, category: 'operations', dbTable: 'audit_logs' },
  { id: 'promise-tracker', name: 'Promise Tracker', icon: Zap, category: 'operations', dbTable: 'audit_logs' },
  { id: 'asset-manager', name: 'Asset Manager', icon: Database, category: 'operations', dbTable: 'audit_logs' },
  { id: 'deployment-manager', name: 'Deployment Manager', icon: Wrench, category: 'operations', dbTable: 'audit_logs' },
  { id: 'analytics-manager', name: 'Analytics Manager', icon: BarChart3, category: 'operations', dbTable: 'activity_log' },
  { id: 'notification-manager', name: 'Notification Manager', icon: Bell, category: 'operations', dbTable: 'notifications' },
  // Management (11)
  { id: 'marketing-manager', name: 'Marketing Manager', icon: Megaphone, category: 'management', dbTable: 'audit_logs' },
  { id: 'seo-manager', name: 'SEO Manager', icon: Search, category: 'management', dbTable: 'audit_logs' },
  { id: 'lead-manager', name: 'Lead Manager', icon: UserPlus, category: 'management', dbTable: 'leads' },
  { id: 'sales-manager', name: 'Sales Manager', icon: TrendingUp, category: 'management', dbTable: 'audit_logs' },
  { id: 'customer-support', name: 'Customer Support', icon: Headphones, category: 'management', dbTable: 'support_tickets' },
  { id: 'finance-manager', name: 'Finance Manager', icon: DollarSign, category: 'management', dbTable: 'wallet_transactions' },
  { id: 'legal-manager', name: 'Legal Manager', icon: Scale, category: 'management', dbTable: 'audit_logs' },
  { id: 'pro-manager', name: 'Pro Manager', icon: Star, category: 'management', dbTable: 'audit_logs' },
  { id: 'role-manager', name: 'Role Manager', icon: Users, category: 'management', dbTable: 'user_roles' },
  { id: 'security-manager', name: 'Security Manager', icon: Lock, category: 'management', dbTable: 'security_events' },
  { id: 'integration-manager', name: 'Integration Manager', icon: Plug, category: 'management', dbTable: 'audit_logs' },
  // Distribution (7)
  { id: 'franchise-manager', name: 'Franchise Manager', icon: Store, category: 'distribution', dbTable: 'franchise_accounts' },
  { id: 'reseller-manager', name: 'Reseller Manager', icon: Briefcase, category: 'distribution', dbTable: 'reseller_accounts' },
  { id: 'influencer-manager', name: 'Influencer Manager', icon: Star, category: 'distribution', dbTable: 'audit_logs' },
  { id: 'continent-admin', name: 'Continent Admin', icon: Globe2, category: 'distribution', dbTable: 'audit_logs' },
  { id: 'country-admin', name: 'Country Admin', icon: Map, category: 'distribution', dbTable: 'area_manager_accounts' },
  { id: 'marketplace-manager', name: 'Marketplace Manager', icon: ShoppingCart, category: 'distribution', dbTable: 'marketplace_orders' },
  { id: 'marketplace-user', name: 'Marketplace User System', icon: LayoutDashboard, category: 'distribution', dbTable: 'marketplace_orders' },
  // System (5)
  { id: 'developer-dashboard', name: 'Developer Dashboard', icon: Code, category: 'system', dbTable: 'audit_logs' },
  { id: 'user-dashboard', name: 'User Dashboard', icon: Users, category: 'system', dbTable: 'profiles' },
  { id: 'system-settings', name: 'System Settings', icon: Settings, category: 'system', dbTable: 'audit_logs' },
  { id: 'license-manager', name: 'License Manager', icon: ScrollText, category: 'system', dbTable: 'audit_logs' },
  { id: 'audit-logs-manager', name: 'Audit Logs Manager', icon: Layers, category: 'system', dbTable: 'audit_logs' },
  { id: 'demo-system-manager', name: 'Demo System Manager', icon: MonitorSmartphone, category: 'system', dbTable: 'demos' },
];

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  executive: { label: 'Executive', color: 'text-violet-400 bg-violet-500/20 border-violet-500/40' },
  operations: { label: 'Operations', color: 'text-blue-400 bg-blue-500/20 border-blue-500/40' },
  management: { label: 'Management', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' },
  distribution: { label: 'Distribution', color: 'text-amber-400 bg-amber-500/20 border-amber-500/40' },
  system: { label: 'System', color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40' },
};

const STATUS_CONFIG = {
  online: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', dot: 'bg-emerald-500', label: 'ONLINE' },
  warning: { color: 'text-amber-400', bg: 'bg-amber-500/20', dot: 'bg-amber-500', label: 'WARNING' },
  critical: { color: 'text-red-400', bg: 'bg-red-500/20', dot: 'bg-red-500', label: 'CRITICAL' },
  offline: { color: 'text-slate-500', bg: 'bg-slate-700/50', dot: 'bg-slate-600', label: 'OFFLINE' },
  scanning: { color: 'text-violet-400', bg: 'bg-violet-500/20', dot: 'bg-violet-500', label: 'SCANNING' },
};

interface AIRASystemScannerProps {
  onReportGenerated?: (report: ScanReport) => void;
}

export interface ScanReport {
  timestamp: string;
  totalModules: number;
  onlineCount: number;
  warningCount: number;
  criticalCount: number;
  offlineCount: number;
  overallHealth: number;
  topIssues: string[];
  recommendations: string[];
}

export function AIRASystemScanner({ onReportGenerated }: AIRASystemScannerProps) {
  const [modules, setModules] = useState<ModuleScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [lastFullScan, setLastFullScan] = useState<Date | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [latestReport, setLatestReport] = useState<ScanReport | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  // Perform full system scan
  const runFullScan = useCallback(async () => {
    setIsScanning(true);
    setScanProgress(0);

    const results: ModuleScanResult[] = [];
    const db = supabase as any;
    const now = new Date().toISOString();

    for (let i = 0; i < MODULE_REGISTRY.length; i++) {
      const mod = MODULE_REGISTRY[i];
      setScanProgress(Math.round(((i + 1) / MODULE_REGISTRY.length) * 100));

      let activityCount = 0;
      let errorCount = 0;
      let status: ModuleScanResult['status'] = 'online';
      let healthScore = 100;
      let trend: ModuleScanResult['trend'] = 'stable';

      try {
        // Query activity from associated table
        if (mod.dbTable) {
          const countRes = await db.from(mod.dbTable).select('id', { count: 'exact', head: true });
          activityCount = countRes.count || 0;

          // Check for recent errors in audit_logs for this module
          const errRes = await db
            .from('audit_logs')
            .select('id', { count: 'exact', head: true })
            .ilike('action', '%error%')
            .ilike('module', `%${mod.id.replace(/-/g, '_')}%`);
          errorCount = errRes.count || 0;
        }

        // Calculate health
        if (errorCount > 10) {
          status = 'critical';
          healthScore = Math.max(20, 100 - errorCount * 5);
        } else if (errorCount > 3) {
          status = 'warning';
          healthScore = Math.max(50, 100 - errorCount * 3);
        } else {
          status = 'online';
          healthScore = Math.min(100, 85 + Math.min(activityCount, 5) * 3);
        }

        // Trend based on activity
        trend = activityCount > 50 ? 'up' : activityCount > 10 ? 'stable' : 'down';
      } catch {
        status = 'offline';
        healthScore = 0;
      }

      results.push({
        ...mod,
        status,
        lastScanAt: now,
        activityCount,
        errorCount,
        healthScore,
        trend,
      });
    }

    setModules(results);
    setLastFullScan(new Date());
    setIsScanning(false);
    setScanProgress(100);

    // Generate report
    const onlineCount = results.filter(m => m.status === 'online').length;
    const warningCount = results.filter(m => m.status === 'warning').length;
    const criticalCount = results.filter(m => m.status === 'critical').length;
    const offlineCount = results.filter(m => m.status === 'offline').length;
    const overallHealth = Math.round(results.reduce((s, m) => s + m.healthScore, 0) / results.length);

    const topIssues = results
      .filter(m => m.status === 'critical' || m.status === 'warning')
      .map(m => `${m.name}: ${m.errorCount} errors detected`);

    const recommendations: string[] = [];
    if (criticalCount > 0) recommendations.push(`${criticalCount} module(s) in critical state — immediate attention required`);
    if (warningCount > 3) recommendations.push(`${warningCount} warnings detected — schedule maintenance review`);
    if (offlineCount > 0) recommendations.push(`${offlineCount} module(s) offline — verify service connectivity`);
    if (overallHealth >= 90) recommendations.push('System health excellent — maintain current operations');

    const report: ScanReport = {
      timestamp: now,
      totalModules: results.length,
      onlineCount,
      warningCount,
      criticalCount,
      offlineCount,
      overallHealth,
      topIssues,
      recommendations,
    };

    setLatestReport(report);
    onReportGenerated?.(report);

    // Submit report to Boss Panel via system_events
    try {
      await db.from('system_events').insert({
        event_type: 'aira_system_scan_report',
        source_role: 'ceo',
        payload: report,
        status: 'PENDING',
      });
    } catch {}

    toast.success(`Scan complete: ${onlineCount}/${results.length} modules online`);
  }, [onReportGenerated]);

  // Auto-scan on mount
  useEffect(() => {
    runFullScan();
  }, []);

  const filteredModules = filterCategory === 'all'
    ? modules
    : modules.filter(m => m.category === filterCategory);

  const categories = ['all', 'executive', 'operations', 'management', 'distribution', 'system'];

  return (
    <div className="space-y-4">
      {/* ─── Scan Control Bar ──────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ScanLine className={`w-5 h-5 text-violet-400 ${isScanning ? 'animate-pulse' : ''}`} />
            <div>
              <h2 className="text-sm font-bold text-white">System Scanner</h2>
              <p className="text-[10px] text-slate-500">
                {isScanning
                  ? `Scanning... ${scanProgress}%`
                  : lastFullScan
                  ? `Last scan: ${lastFullScan.toLocaleTimeString()}`
                  : 'Ready to scan'}
              </p>
            </div>
          </div>
          <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/40 text-[10px]">
            {MODULE_REGISTRY.length} Modules
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <div className="flex bg-slate-800/60 rounded-lg p-0.5 border border-slate-700/50">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                  filterCategory === cat
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]?.label}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            onClick={runFullScan}
            disabled={isScanning}
            className="bg-violet-600 hover:bg-violet-700 text-xs h-7"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Full Scan'}
          </Button>
        </div>
      </div>

      {/* ─── Scan Progress ──────────────────────────────────── */}
      {isScanning && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="relative">
            <Progress value={scanProgress} className="h-1.5" />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-slate-500">Scanning modules...</span>
              <span className="text-[10px] text-violet-400 font-mono">{scanProgress}%</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── Status Summary ──────────────────────────────────── */}
      {modules.length > 0 && !isScanning && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            { label: 'Online', count: modules.filter(m => m.status === 'online').length, color: 'emerald', total: modules.length },
            { label: 'Warning', count: modules.filter(m => m.status === 'warning').length, color: 'amber', total: modules.length },
            { label: 'Critical', count: modules.filter(m => m.status === 'critical').length, color: 'red', total: modules.length },
            { label: 'Offline', count: modules.filter(m => m.status === 'offline').length, color: 'slate', total: modules.length },
            { label: 'Health', count: latestReport?.overallHealth || 0, color: 'violet', total: 100, suffix: '%' },
          ].map((s, i) => (
            <div key={i} className="bg-slate-900/60 border border-slate-700/40 rounded-lg p-2.5 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</p>
              <p className={`text-xl font-bold text-${s.color}-400`}>
                {s.count}{s.suffix || ''}
              </p>
              <p className="text-[9px] text-slate-600">/ {s.total}{s.suffix ? '' : ' modules'}</p>
            </div>
          ))}
        </div>
      )}

      {/* ─── Module Grid ──────────────────────────────────────── */}
      <ScrollArea className="h-[520px]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
          <AnimatePresence>
            {filteredModules.map((mod, i) => {
              const sc = STATUS_CONFIG[mod.status];
              const isExpanded = expandedModule === mod.id;
              const catConfig = CATEGORY_LABELS[mod.category];

              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <div
                    className={`bg-slate-900/70 border rounded-lg transition-all cursor-pointer hover:border-violet-500/30 ${
                      mod.status === 'critical'
                        ? 'border-red-500/40'
                        : mod.status === 'warning'
                        ? 'border-amber-500/30'
                        : 'border-slate-700/40'
                    }`}
                    onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg ${sc.bg} flex items-center justify-center`}>
                            <mod.icon className={`w-3.5 h-3.5 ${sc.color}`} />
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-white leading-tight">{mod.name}</h4>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded border ${catConfig.color}`}>
                              {catConfig.label}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${mod.status === 'scanning' ? 'animate-pulse' : ''}`} />
                          <span className={`text-[9px] font-mono ${sc.color}`}>{sc.label}</span>
                        </div>
                      </div>

                      {/* Mini metrics row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[10px]">
                          <span className="text-slate-400">
                            <Activity className="w-3 h-3 inline mr-0.5" />{mod.activityCount}
                          </span>
                          <span className={mod.errorCount > 0 ? 'text-red-400' : 'text-slate-500'}>
                            <AlertTriangle className="w-3 h-3 inline mr-0.5" />{mod.errorCount}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                mod.healthScore >= 80 ? 'bg-emerald-500'
                                : mod.healthScore >= 50 ? 'bg-amber-500'
                                : 'bg-red-500'
                              }`}
                              style={{ width: `${mod.healthScore}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono">{mod.healthScore}%</span>
                        </div>
                      </div>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-2 pt-2 border-t border-slate-700/30"
                          >
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                              <div>
                                <span className="text-slate-500">Records</span>
                                <p className="text-white font-medium">{mod.activityCount.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-slate-500">Errors</span>
                                <p className={mod.errorCount > 0 ? 'text-red-400 font-medium' : 'text-white font-medium'}>{mod.errorCount}</p>
                              </div>
                              <div>
                                <span className="text-slate-500">Trend</span>
                                <p className={`font-medium ${mod.trend === 'up' ? 'text-emerald-400' : mod.trend === 'down' ? 'text-red-400' : 'text-slate-300'}`}>
                                  {mod.trend === 'up' ? '↑ Growing' : mod.trend === 'down' ? '↓ Low' : '→ Stable'}
                                </p>
                              </div>
                              <div>
                                <span className="text-slate-500">Last Scan</span>
                                <p className="text-white font-medium">{new Date(mod.lastScanAt).toLocaleTimeString()}</p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-slate-500 text-[10px]">Data Source</span>
                              <p className="text-violet-400 text-[10px] font-mono">{mod.dbTable || 'N/A'}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* ─── Executive Report Card ──────────────────────────── */}
      {latestReport && !isScanning && (
        <Card className="bg-gradient-to-r from-violet-900/20 to-indigo-900/20 border-violet-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-400" />
              Executive Scan Report
              <Badge className="bg-emerald-500/20 text-emerald-400 text-[9px]">AUTO-SUBMITTED TO BOSS PANEL</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{latestReport.onlineCount}</p>
                <p className="text-[10px] text-slate-500">Online</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-400">{latestReport.warningCount}</p>
                <p className="text-[10px] text-slate-500">Warnings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">{latestReport.criticalCount}</p>
                <p className="text-[10px] text-slate-500">Critical</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-violet-400">{latestReport.overallHealth}%</p>
                <p className="text-[10px] text-slate-500">Health</p>
              </div>
            </div>

            {latestReport.recommendations.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">AIRA Recommendations</p>
                {latestReport.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
                    <ChevronRight className="w-3 h-3 text-violet-400 mt-0.5 shrink-0" />
                    {rec}
                  </div>
                ))}
              </div>
            )}

            {latestReport.topIssues.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Issues Detected</p>
                {latestReport.topIssues.slice(0, 5).map((issue, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-amber-300">
                    <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                    {issue}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AIRASystemScanner;
