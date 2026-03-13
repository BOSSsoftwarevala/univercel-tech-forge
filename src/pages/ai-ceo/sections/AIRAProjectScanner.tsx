import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ScanSearch, Shield, Bug, Zap, CheckCircle2, AlertTriangle,
  XCircle, RefreshCw, FileCode, Server, Database, Lock,
  Eye, TrendingUp, Clock, Play
} from "lucide-react";

interface ScanResult {
  id: string;
  module: string;
  category: "code-health" | "security" | "performance" | "api-usage" | "deployment";
  severity: "critical" | "warning" | "info";
  finding: string;
  autoFixAvailable: boolean;
  status: "open" | "auto-fixed" | "acknowledged";
}

const SCAN_RESULTS: ScanResult[] = [
  { id: "1", module: "Marketplace", category: "security", severity: "critical", finding: "RLS policy missing on product_reviews table", autoFixAvailable: true, status: "open" },
  { id: "2", module: "Server Manager", category: "performance", severity: "warning", finding: "3 servers above 85% CPU for 2+ hours", autoFixAvailable: true, status: "open" },
  { id: "3", module: "Finance Module", category: "code-health", severity: "warning", finding: "Deprecated API call in wallet transaction handler", autoFixAvailable: false, status: "open" },
  { id: "4", module: "Auth System", category: "security", severity: "critical", finding: "Session token rotation interval exceeds 24hrs", autoFixAvailable: true, status: "open" },
  { id: "5", module: "Boss Panel", category: "api-usage", severity: "info", finding: "API calls at 72% of daily quota", autoFixAvailable: false, status: "acknowledged" },
  { id: "6", module: "VALA AI Builder", category: "deployment", severity: "info", finding: "Last deployment 6 hours ago — all healthy", autoFixAvailable: false, status: "acknowledged" },
  { id: "7", module: "Chat System", category: "performance", severity: "warning", finding: "WebSocket reconnection rate spike detected", autoFixAvailable: true, status: "auto-fixed" },
  { id: "8", module: "Notification Engine", category: "code-health", severity: "info", finding: "3 unused imports in notification handler", autoFixAvailable: true, status: "auto-fixed" },
];

const SCAN_CATEGORIES = [
  { id: "all", label: "All", count: SCAN_RESULTS.length },
  { id: "security", label: "Security", count: SCAN_RESULTS.filter(r => r.category === "security").length },
  { id: "performance", label: "Performance", count: SCAN_RESULTS.filter(r => r.category === "performance").length },
  { id: "code-health", label: "Code Health", count: SCAN_RESULTS.filter(r => r.category === "code-health").length },
  { id: "api-usage", label: "API Usage", count: SCAN_RESULTS.filter(r => r.category === "api-usage").length },
  { id: "deployment", label: "Deployment", count: SCAN_RESULTS.filter(r => r.category === "deployment").length },
];

const AIRAProjectScanner = () => {
  const [filter, setFilter] = useState("all");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(100);

  const filtered = filter === "all" ? SCAN_RESULTS : SCAN_RESULTS.filter(r => r.category === filter);
  const criticals = SCAN_RESULTS.filter(r => r.severity === "critical" && r.status === "open").length;
  const warnings = SCAN_RESULTS.filter(r => r.severity === "warning" && r.status === "open").length;
  const autoFixed = SCAN_RESULTS.filter(r => r.status === "auto-fixed").length;

  const handleScan = () => {
    setScanning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setScanning(false); return 100; }
        return p + 5;
      });
    }, 150);
  };

  const severityStyle = (s: string) => {
    if (s === "critical") return { badge: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle, color: "text-red-400" };
    if (s === "warning") return { badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: AlertTriangle, color: "text-yellow-400" };
    return { badge: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30", icon: Eye, color: "text-cyan-400" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex items-center justify-center shadow-xl shadow-orange-500/20">
            <ScanSearch className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Project Scanner</h1>
            <p className="text-orange-400/80">Continuous Scanning • 37 Modules • Auto-Fix Engine</p>
          </div>
        </div>
        <Button
          onClick={handleScan}
          disabled={scanning}
          className="bg-orange-500/20 text-orange-400 border border-orange-500/40 hover:bg-orange-500/30"
        >
          {scanning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
          {scanning ? "Scanning..." : "Run Full Scan"}
        </Button>
      </div>

      {/* Scan Progress */}
      {scanning && (
        <Card className="bg-slate-900/50 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-orange-400">Scanning all 37 modules...</p>
              <span className="text-sm text-orange-300 font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Critical Issues", value: criticals, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Warnings", value: warnings, icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { label: "Auto-Fixed", value: autoFixed, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Modules Scanned", value: "37/37", icon: Shield, color: "text-cyan-400", bg: "bg-cyan-500/10" },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <m.icon className={`w-5 h-5 ${m.color}`} />
                </div>
                <div>
                  <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                  <p className="text-xs text-slate-400">{m.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs + Results */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-base">Scan Results</CardTitle>
            <div className="flex gap-2">
              {SCAN_CATEGORIES.map(cat => (
                <Button
                  key={cat.id}
                  size="sm"
                  variant="ghost"
                  className={`h-7 px-3 text-xs ${filter === cat.id ? "bg-orange-500/20 text-orange-400" : "text-slate-400 hover:text-white"}`}
                  onClick={() => setFilter(cat.id)}
                >
                  {cat.label} ({cat.count})
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[340px]">
            <div className="space-y-2">
              {filtered.map((result, i) => {
                const style = severityStyle(result.severity);
                const Icon = style.icon;
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/20 hover:border-slate-600/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Icon className={`w-4 h-4 ${style.color} flex-shrink-0`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-slate-700/50 text-slate-300 text-[10px]">{result.module}</Badge>
                          <Badge className={`${style.badge} text-[10px]`}>{result.severity}</Badge>
                        </div>
                        <p className="text-sm text-white mt-1">{result.finding}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {result.status === "auto-fixed" ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Auto-Fixed ✓</Badge>
                      ) : result.autoFixAvailable ? (
                        <Button size="sm" className="h-7 px-3 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30">
                          <Zap className="w-3 h-3 mr-1" /> Auto-Fix
                        </Button>
                      ) : (
                        <Badge className="bg-slate-600/30 text-slate-400 text-xs">Manual</Badge>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Self-Healing Pipeline */}
      <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
        <p className="text-xs text-orange-400/80 mb-3 uppercase tracking-wider font-medium">Self-Healing Pipeline</p>
        <div className="flex items-center justify-center gap-3">
          {["Read Logs", "Identify Issue", "Repair Config", "Restart Service", "Redeploy", "Validate"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className="px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-xs text-orange-300">{s}</div>
              {i < 5 && <span className="text-orange-500/50">→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIRAProjectScanner;
