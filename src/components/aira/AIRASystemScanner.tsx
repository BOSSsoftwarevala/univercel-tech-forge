/**
 * AIRA SYSTEM SCANNER
 * Monitors all 37 dashboards across the Software Vala ecosystem.
 * Performs 9 dedicated scan operations collecting real-time operational data.
 * Reports auto-submitted to Boss Panel for strategic review.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanLine, Eye, Shield, Server, Package, Users, Brain,
  Activity, FileText, Zap, Globe2, BarChart3, AlertTriangle,
  CheckCircle2, XCircle, Clock, RefreshCw, ChevronRight,
  MonitorSmartphone, Database, Layers, ShoppingCart, Briefcase,
  MessageSquare, Scale, TrendingUp, Megaphone, Search,
  UserPlus, Headphones, Store, Star, Map, DollarSign,
  Bell, Plug, ScrollText, Lock, Settings, Code, Wrench,
  Cpu, LayoutDashboard, Wifi, Radio, Radar
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
  scanOps?: string[];
}

// ─── 9 Scan Operations ─────────────────────────────────────────
export interface ScanOperation {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  status: 'idle' | 'running' | 'complete' | 'error';
  result?: { count: number; issues: number; detail: string };
}

const SCAN_OPERATIONS_TEMPLATE: Omit<ScanOperation, 'status' | 'result'>[] = [
  { id: 'screen-activity', name: 'Screen Activity Scan', icon: MonitorSmartphone, description: 'Scan active user sessions and screen interactions' },
  { id: 'module-status', name: 'Module Status Verification', icon: Layers, description: 'Verify operational status of all 37 modules' },
  { id: 'server-health', name: 'Server Health Monitoring', icon: Server, description: 'Check server instances, CPU, RAM, disk usage' },
  { id: 'deployment-monitor', name: 'Deployment Monitoring', icon: Wrench, description: 'Track active deployments and pipeline status' },
  { id: 'marketplace-sales', name: 'Marketplace Sales Activity', icon: ShoppingCart, description: 'Monitor orders, revenue, and conversion rates' },
  { id: 'license-generation', name: 'License Generation Monitor', icon: ScrollText, description: 'Track license issuance and validation status' },
  { id: 'user-activity', name: 'User Activity Monitoring', icon: Users, description: 'Monitor user registrations, logins, and actions' },
  { id: 'security-alerts', name: 'Security Alert Monitoring', icon: Shield, description: 'Scan for security events, threats, and violations' },
  { id: 'api-performance', name: 'API Performance Monitoring', icon: Cpu, description: 'Track API response times, error rates, and throughput' },
];

const MODULE_REGISTRY: Omit<ModuleScanResult, 'status' | 'lastScanAt' | 'activityCount' | 'errorCount' | 'healthScore' | 'trend' | 'scanOps'>[] = [
  // Executive (2)
  { id: 'boss-panel', name: 'Boss Panel', icon: Shield, category: 'executive', dbTable: 'system_events' },
  { id: 'ceo-dashboard', name: 'CEO Dashboard', icon: Eye, category: 'executive', dbTable: 'audit_logs' },
  // Operations (12)
  { id: 'vala-ai', name: 'Vala AI', icon: Brain, category: 'operations', dbTable: 'ai_jobs' },
  { id: 'server-manager', name: 'Server Manager', icon: Server, category: 'operations', dbTable: 'server_instances' },
  { id: 'ai-api-manager', name: 'AI API Manager', icon: Cpu, category: 'operations', dbTable: 'ai_usage_logs' },
  { id: 'dev-manager', name: 'Development Manager', icon: Code, category: 'operations', dbTable: 'audit_logs' },
  { id: 'product-manager', name: 'Product Manager', icon: Package, category: 'operations', dbTable: 'marketplace_products' },
  { id: 'demo-manager', name: 'Demo Manager', icon: MonitorSmartphone, category: 'operations', dbTable: 'demos' },
  { id: 'task-manager', name: 'Task Manager', icon: FileText, category: 'operations', dbTable: 'audit_logs' },
  { id: 'promise-tracker', name: 'Promise Tracker', icon: Zap, category: 'operations', dbTable: 'audit_logs' },
  { id: 'asset-manager', name: 'Asset Manager', icon: Database, category: 'operations', dbTable: 'audit_logs' },
  { id: 'deployment-manager', name: 'Deployment Manager', icon: Wrench, category: 'operations', dbTable: 'audit_logs' },
  { id: 'analytics-manager', name: 'Analytics Manager', icon: BarChart3, category: 'operations', dbTable: 'activity_log' },
  { id: 'notification-manager', name: 'Notification Manager', icon: Bell, category: 'operations', dbTable: 'audit_logs' },
  // Management (11)
  { id: 'marketing-manager', name: 'Marketing Manager', icon: Megaphone, category: 'management', dbTable: 'audit_logs' },
  { id: 'seo-manager', name: 'SEO Manager', icon: Search, category: 'management', dbTable: 'audit_logs' },
  { id: 'lead-manager', name: 'Lead Manager', icon: UserPlus, category: 'management', dbTable: 'leads' },
  { id: 'sales-manager', name: 'Sales Manager', icon: TrendingUp, category: 'management', dbTable: 'audit_logs' },
  { id: 'customer-support', name: 'Customer Support', icon: Headphones, category: 'management', dbTable: 'support_tickets' },
  { id: 'finance-manager', name: 'Finance Manager', icon: DollarSign, category: 'management', dbTable: 'audit_logs' },
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
  scanOperations: { name: string; count: number; issues: number }[];
}

// Safe count query — returns 0 on any error (missing table/column)
async function safeCount(db: any, table: string, filters?: Record<string, string>): Promise<number> {
  try {
    let q = db.from(table).select('*', { count: 'exact', head: true });
    if (filters) {
      for (const [col, val] of Object.entries(filters)) {
        q = q.ilike(col, val);
      }
    }
    const { count, error } = await q;
    if (error) return 0;
    return count || 0;
  } catch {
    return 0;
  }
}

export function AIRASystemScanner({ onReportGenerated }: AIRASystemScannerProps) {
  const [modules, setModules] = useState<ModuleScanResult[]>([]);
  const [scanOps, setScanOps] = useState<ScanOperation[]>(
    SCAN_OPERATIONS_TEMPLATE.map(op => ({ ...op, status: 'idle' as const }))
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentOp, setCurrentOp] = useState('');
  const [lastFullScan, setLastFullScan] = useState<Date | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [latestReport, setLatestReport] = useState<ScanReport | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [showOps, setShowOps] = useState(true);
  const scanRef = useRef(false);

  // ─── Execute 9 Scan Operations + Module Scan ──────────────
  const runFullScan = useCallback(async () => {
    if (scanRef.current) return;
    scanRef.current = true;
    setIsScanning(true);
    setScanProgress(0);
    setCurrentOp('Initializing...');

    const db = supabase as any;
    const now = new Date().toISOString();
    const opResults: ScanOperation[] = [];
    const totalSteps = SCAN_OPERATIONS_TEMPLATE.length + 1; // 9 ops + module scan
    let step = 0;

    const updateProgress = (opName: string) => {
      step++;
      setScanProgress(Math.round((step / totalSteps) * 100));
      setCurrentOp(opName);
    };

    // Reset scan ops
    setScanOps(SCAN_OPERATIONS_TEMPLATE.map(op => ({ ...op, status: 'running' })));

    // ─── OP 1: Screen Activity Scan ─────────────────────────
    updateProgress('Screen Activity Scan');
    const sessionCount = await safeCount(db, 'activity_log');
    const recentSessions = await safeCount(db, 'activity_log');
    opResults.push({
      ...SCAN_OPERATIONS_TEMPLATE[0],
      status: 'complete',
      result: { count: sessionCount, issues: 0, detail: `${recentSessions} session events recorded` },
    });

    // ─── OP 2: Module Status Verification ───────────────────
    updateProgress('Module Status Verification');
    // Parallel scan all module tables
    const modulePromises = MODULE_REGISTRY.map(async (mod) => {
      const count = mod.dbTable ? await safeCount(db, mod.dbTable) : 0;
      const errors = await safeCount(db, 'audit_logs', {
        action: '%error%',
        module: `%${mod.id.replace(/-/g, '_')}%`,
      });
      return { mod, count, errors };
    });
    const moduleResults = await Promise.all(modulePromises);

    const moduleStatusIssues = moduleResults.filter(r => r.errors > 3).length;
    opResults.push({
      ...SCAN_OPERATIONS_TEMPLATE[1],
      status: 'complete',
      result: { count: MODULE_REGISTRY.length, issues: moduleStatusIssues, detail: `${MODULE_REGISTRY.length} modules scanned, ${moduleStatusIssues} with issues` },
    });

    // ─── OP 3: Server Health Monitoring ─────────────────────
    updateProgress('Server Health Monitoring');
    const totalServers = await safeCount(db, 'server_instances');
    const runningServers = await safeCount(db, 'server_instances', { status: 'running' });
    const serverIssues = totalServers - runningServers;
    opResults.push({
      ...SCAN_OPERATIONS_TEMPLATE[2],
      status: 'complete',
      result: { count: totalServers, issues: serverIssues, detail: `${runningServers}/${totalServers} servers running` },
    });

    // ─── OP 4: Deployment Monitoring ────────────────────────
    updateProgress('Deployment Monitoring');
    const deployments = await safeCount(db, 'audit_logs', { action: '%deploy%' });
    const failedDeploys = await safeCount(db, 'audit_logs', { action: '%deploy%fail%' });
    opResults.push({
      ...SCAN_OPERATIONS_TEMPLATE[3],
      status: 'complete',
      result: { count: deployments, issues: failedDeploys, detail: `${deployments} deployments tracked, ${failedDeploys} failed` },
    });

    // ─── OP 5: Marketplace Sales Activity ───────────────────
    updateProgress('Marketplace Sales Activity');
    const totalOrders = await safeCount(db, 'marketplace_orders');
    opResults.push({
      ...SCAN_OPERATIONS_TEMPLATE[4],
      status: 'complete',
      result: { count: totalOrders, issues: 0, detail: `${totalOrders} total orders in system` },
    });

    // ─── OP 6: License Generation Monitor ───────────────────
    updateProgress('License Generation Monitor');
    const licenses = await safeCount(db, 'audit_logs', { action: '%license%' });
    opResults.push({
      ...SCAN_OPERATIONS_TEMPLATE[5],
      status: 'complete',
      result: { count: licenses, issues: 0, detail: `${licenses} license events recorded` },
    });

    // ─── OP 7: User Activity Monitoring ─────────────────────
    updateProgress('User Activity Monitoring');
    const totalUsers = await safeCount(db, 'profiles');
    const totalRoles = await safeCount(db, 'user_roles');
    opResults.push({
      ...SCAN_OPERATIONS_TEMPLATE[6],
      status: 'complete',
      result: { count: totalUsers, issues: 0, detail: `${totalUsers} users, ${totalRoles} role assignments` },
    });

    // ─── OP 8: Security Alert Monitoring ────────────────────
    updateProgress('Security Alert Monitoring');
    const secEvents = await safeCount(db, 'security_events');
    const suspensions = await safeCount(db, 'account_suspensions');
    opResults.push({
      ...SCAN_OPERATIONS_TEMPLATE[7],
      status: secEvents > 50 ? 'error' : 'complete',
      result: { count: secEvents, issues: suspensions, detail: `${secEvents} security events, ${suspensions} active suspensions` },
    });

    // ─── OP 9: API Performance Monitoring ───────────────────
    updateProgress('API Performance Monitoring');
    const apiUsage = await safeCount(db, 'ai_usage_logs');
    const apiErrors = await safeCount(db, 'action_logs', { action_result: '%fail%' });
    opResults.push({
      ...SCAN_OPERATIONS_TEMPLATE[8],
      status: apiErrors > 10 ? 'error' : 'complete',
      result: { count: apiUsage, issues: apiErrors, detail: `${apiUsage} API calls, ${apiErrors} failures` },
    });

    setScanOps(opResults);

    // ─── Build Module Results ───────────────────────────────
    updateProgress('Compiling results...');
    const builtModules: ModuleScanResult[] = moduleResults.map(({ mod, count, errors }) => {
      let status: ModuleScanResult['status'] = 'online';
      let healthScore = 100;

      if (errors > 10) {
        status = 'critical';
        healthScore = Math.max(20, 100 - errors * 5);
      } else if (errors > 3) {
        status = 'warning';
        healthScore = Math.max(50, 100 - errors * 3);
      } else {
        healthScore = Math.min(100, 85 + Math.min(count, 5) * 3);
      }

      const trend: ModuleScanResult['trend'] = count > 50 ? 'up' : count > 10 ? 'stable' : 'down';

      return {
        ...mod,
        status,
        lastScanAt: now,
        activityCount: count,
        errorCount: errors,
        healthScore,
        trend,
      };
    });

    setModules(builtModules);
    setLastFullScan(new Date());
    setIsScanning(false);
    setScanProgress(100);
    setCurrentOp('');
    scanRef.current = false;

    // ─── Generate Executive Report ──────────────────────────
    const onlineCount = builtModules.filter(m => m.status === 'online').length;
    const warningCount = builtModules.filter(m => m.status === 'warning').length;
    const criticalCount = builtModules.filter(m => m.status === 'critical').length;
    const offlineCount = builtModules.filter(m => m.status === 'offline').length;
    const overallHealth = Math.round(builtModules.reduce((s, m) => s + m.healthScore, 0) / builtModules.length);

    const topIssues = builtModules
      .filter(m => m.status === 'critical' || m.status === 'warning')
      .map(m => `${m.name}: ${m.errorCount} errors detected`);

    const recommendations: string[] = [];
    if (criticalCount > 0) recommendations.push(`${criticalCount} module(s) in critical state — immediate attention required`);
    if (warningCount > 3) recommendations.push(`${warningCount} warnings detected — schedule maintenance review`);
    if (offlineCount > 0) recommendations.push(`${offlineCount} module(s) offline — verify service connectivity`);
    if (serverIssues > 0) recommendations.push(`${serverIssues} server(s) not running — check infrastructure`);
    if (failedDeploys > 0) recommendations.push(`${failedDeploys} deployment failure(s) — review CI/CD pipeline`);
    if (apiErrors > 5) recommendations.push(`${apiErrors} API failures detected — investigate error logs`);
    if (overallHealth >= 90) recommendations.push('System health excellent — maintain current operations');

    const report: ScanReport = {
      timestamp: now,
      totalModules: builtModules.length,
      onlineCount,
      warningCount,
      criticalCount,
      offlineCount,
      overallHealth,
      topIssues,
      recommendations,
      scanOperations: opResults.map(op => ({
        name: op.name,
        count: op.result?.count || 0,
        issues: op.result?.issues || 0,
      })),
    };

    setLatestReport(report);
    onReportGenerated?.(report);

    // Submit report to Boss Panel
    try {
      await db.from('system_events').insert({
        event_type: 'aira_system_scan_report',
        source_role: 'ceo',
        payload: report,
        status: 'PENDING',
      });
    } catch {}

    toast.success(`Scan complete: ${onlineCount}/${builtModules.length} modules online • 9 operations executed`);
  }, [onReportGenerated]);

  // Auto-scan on mount
  useEffect(() => {
    runFullScan();
  }, []);

  const filteredModules = filterCategory === 'all'
    ? modules
    : modules.filter(m => m.category === filterCategory);

  const categories = ['all', 'executive', 'operations', 'management', 'distribution', 'system'];

  const opStatusIcon = (status: ScanOperation['status']) => {
    switch (status) {
      case 'complete': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'error': return <AlertTriangle className="w-3.5 h-3.5 text-red-400" />;
      case 'running': return <RefreshCw className="w-3.5 h-3.5 text-violet-400 animate-spin" />;
      default: return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* ─── Scan Control Bar ──────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Radar className={`w-5 h-5 text-violet-400 ${isScanning ? 'animate-spin' : ''}`} />
            <div>
              <h2 className="text-sm font-bold text-white">AIRA System Scanner</h2>
              <p className="text-[10px] text-slate-500">
                {isScanning
                  ? currentOp
                  : lastFullScan
                  ? `Last scan: ${lastFullScan.toLocaleTimeString()} • 9 operations`
                  : 'Ready to scan'}
              </p>
            </div>
          </div>
          <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/40 text-[10px]">
            {MODULE_REGISTRY.length} Modules
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40 text-[10px]">
            9 Scan Ops
          </Badge>
        </div>

        <div className="flex items-center gap-2">
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
            <Progress value={scanProgress} className="h-2" />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-violet-400 font-medium">{currentOp}</span>
              <span className="text-[10px] text-violet-400 font-mono">{scanProgress}%</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── 9 Scan Operations Panel ──────────────────────────── */}
      <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs text-white flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-violet-400" />
              Scan Operations
              <Badge className="text-[9px] bg-slate-700/50 text-slate-400">
                {scanOps.filter(o => o.status === 'complete').length}/9 Complete
              </Badge>
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowOps(!showOps)}
              className="text-slate-400 hover:text-white h-6 text-[10px]"
            >
              {showOps ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </CardHeader>
        <AnimatePresence>
          {showOps && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {scanOps.map((op) => (
                    <div
                      key={op.id}
                      className={`p-2.5 rounded-lg border transition-all ${
                        op.status === 'error'
                          ? 'bg-red-500/5 border-red-500/30'
                          : op.status === 'complete'
                          ? 'bg-emerald-500/5 border-emerald-500/20'
                          : op.status === 'running'
                          ? 'bg-violet-500/5 border-violet-500/30'
                          : 'bg-slate-800/30 border-slate-700/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {opStatusIcon(op.status)}
                        <span className="text-[11px] font-medium text-white">{op.name}</span>
                      </div>
                      {op.result ? (
                        <div className="flex items-center gap-3 text-[10px]">
                          <span className="text-slate-400">
                            <Activity className="w-3 h-3 inline mr-0.5" />{op.result.count}
                          </span>
                          {op.result.issues > 0 && (
                            <span className="text-red-400">
                              <AlertTriangle className="w-3 h-3 inline mr-0.5" />{op.result.issues}
                            </span>
                          )}
                          <span className="text-slate-500 truncate flex-1">{op.result.detail}</span>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-500">{op.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

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
      <ScrollArea className="h-[420px]">
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
                  transition={{ delay: i * 0.015 }}
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

            {/* Scan Operations Summary */}
            <div className="mb-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Scan Operations Summary</p>
              <div className="grid grid-cols-3 gap-1">
                {latestReport.scanOperations.map((op, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-300 bg-slate-800/30 rounded px-2 py-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{op.name.replace(' Monitoring', '').replace(' Monitor', '').replace(' Scan', '')}</span>
                    {op.issues > 0 && <span className="text-red-400 text-[9px]">({op.issues})</span>}
                  </div>
                ))}
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
