import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, AlertTriangle, Search, Clock, CheckCircle, XCircle, Activity } from "lucide-react";

const SEOAudit = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [auditLogs] = useState([
    { id: "AUD001", time: "2026-03-08 14:32:15", action: "Site Audit Completed", actor: "SEO-AUTO", module: "Audit Engine", severity: "info", details: "Full crawl of 1,847 pages completed in 12 minutes" },
    { id: "AUD002", time: "2026-03-08 13:45:22", action: "Keyword Added", actor: "SEO-****-4521", module: "Keywords", severity: "low", details: "Added 'ai powered crm tools' to tracking list" },
    { id: "AUD003", time: "2026-03-08 12:18:09", action: "Meta Rule Proposed", actor: "SEO-****-4521", module: "Meta Rules", severity: "medium", details: "New title template for product pages proposed" },
    { id: "AUD004", time: "2026-03-08 11:55:33", action: "Toxic Backlink Detected", actor: "SEO-AUTO", module: "Backlinks", severity: "high", details: "Spam backlink from suspicious domain detected" },
    { id: "AUD005", time: "2026-03-08 10:22:41", action: "Automation Toggle", actor: "SEO-****-4521", module: "Automation", severity: "medium", details: "Auto Schema Suggestions enabled" },
    { id: "AUD006", time: "2026-03-08 09:15:18", action: "Issue Escalated", actor: "SEO-****-4521", module: "Issues", severity: "high", details: "Slow page load escalated to Server Manager" },
    { id: "AUD007", time: "2026-03-07 16:45:22", action: "Competitor Added", actor: "SEO-****-4521", module: "Competitors", severity: "low", details: "competitor-site.com added to monitoring" },
    { id: "AUD008", time: "2026-03-07 15:30:33", action: "Re-crawl Requested", actor: "SEO-****-4521", module: "Indexing", severity: "low", details: "Requested re-crawl for /products section" },
    { id: "AUD009", time: "2026-03-07 14:12:55", action: "Keyword Paused", actor: "SEO-****-4521", module: "Keywords", severity: "low", details: "Paused tracking for 'enterprise software'" },
    { id: "AUD010", time: "2026-03-07 11:28:41", action: "Ranking Alert", actor: "SEO-AUTO", module: "Rankings", severity: "high", details: "3 keywords dropped below position 20" },
  ]);

  const getSeverityBadge = (sev: string) => {
    const styles: Record<string, string> = {
      high: "bg-red-500/20 text-red-400 border-red-500/30",
      medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      info: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    };
    return styles[sev] || styles.info;
  };

  const filtered = auditLogs.filter(log => 
    !searchQuery || log.action.toLowerCase().includes(searchQuery.toLowerCase()) || log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const highCount = auditLogs.filter(l => l.severity === "high").length;
  const autoCount = auditLogs.filter(l => l.actor === "SEO-AUTO").length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Audit Trail</h2>
        </div>
        <Badge className="bg-slate-700 text-slate-300">🔒 Immutable Log — Read Only</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-slate-400">Total Events</p>
            <p className="text-2xl font-bold text-white">{auditLogs.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-red-400">High Severity</p>
            <p className="text-2xl font-bold text-red-400">{highCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-cyan-500/10 border-cyan-500/20">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-cyan-400">Auto-Generated</p>
            <p className="text-2xl font-bold text-cyan-400">{autoCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-slate-400">Manual Actions</p>
            <p className="text-2xl font-bold text-white">{auditLogs.length - autoCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-center gap-3">
        <AlertTriangle className="h-4 w-4 text-amber-400" />
        <p className="text-amber-400 text-xs">This is an immutable audit log. No modifications, deletions, or exports are permitted. All actions are permanently recorded.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input placeholder="Search audit logs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
      </div>

      {/* Log Table */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-400 w-40">Timestamp</TableHead>
                <TableHead className="text-slate-400">Action</TableHead>
                <TableHead className="text-slate-400">Module</TableHead>
                <TableHead className="text-slate-400">Actor</TableHead>
                <TableHead className="text-slate-400">Severity</TableHead>
                <TableHead className="text-slate-400">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => (
                <TableRow key={log.id} className="border-slate-700/50 hover:bg-slate-800/30">
                  <TableCell className="text-slate-400 font-mono text-xs">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {log.time}
                    </div>
                  </TableCell>
                  <TableCell className="text-white text-sm font-medium">{log.action}</TableCell>
                  <TableCell><Badge className="bg-slate-700/50 text-slate-300 text-xs">{log.module}</Badge></TableCell>
                  <TableCell className="text-slate-300 font-mono text-xs">{log.actor}</TableCell>
                  <TableCell><Badge className={getSeverityBadge(log.severity)}>{log.severity}</Badge></TableCell>
                  <TableCell className="text-slate-400 text-xs max-w-xs truncate">{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SEOAudit;
