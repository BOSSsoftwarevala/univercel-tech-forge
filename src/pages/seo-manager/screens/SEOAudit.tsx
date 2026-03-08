import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, AlertTriangle, Search, Clock, Loader2 } from "lucide-react";
import { useSEOActivityLogs } from "@/hooks/useSEOData";

const SEOAudit = () => {
  const { logs, loading } = useSEOActivityLogs();
  const [searchQuery, setSearchQuery] = useState("");

  const getSeverityBadge = (sev: string) => {
    const styles: Record<string, string> = {
      high: "bg-red-500/20 text-red-400 border-red-500/30",
      medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      info: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    };
    return styles[sev] || styles.info;
  };

  const filtered = logs.filter((log: any) =>
    !searchQuery || log.action_type?.toLowerCase().includes(searchQuery.toLowerCase()) || log.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        <span className="ml-3 text-slate-400">Loading audit trail...</span>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Audit Trail</h2>
        </div>
        <Badge className="bg-slate-700 text-slate-300">🔒 Immutable Log — Read Only</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-slate-400">Total Events</p>
            <p className="text-2xl font-bold text-white">{logs.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-red-400">High Severity</p>
            <p className="text-2xl font-bold text-red-400">{logs.filter((l: any) => l.metadata?.severity === "high").length}</p>
          </CardContent>
        </Card>
        <Card className="bg-cyan-500/10 border-cyan-500/20">
          <CardContent className="pt-4 pb-3 text-center">
            <p className="text-xs text-cyan-400">Auto-Generated</p>
            <p className="text-2xl font-bold text-cyan-400">{logs.filter((l: any) => l.metadata?.auto).length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-center gap-3">
        <AlertTriangle className="h-4 w-4 text-amber-400" />
        <p className="text-amber-400 text-xs">This is an immutable audit log. No modifications, deletions, or exports are permitted.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input placeholder="Search audit logs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white" />
      </div>

      {logs.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="pt-8 pb-8 text-center">
            <Shield className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">No Audit Events</h3>
            <p className="text-slate-400 text-sm">Activity logs will appear here as actions are performed.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-400 w-40">Timestamp</TableHead>
                  <TableHead className="text-slate-400">Action</TableHead>
                  <TableHead className="text-slate-400">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((log: any) => (
                  <TableRow key={log.id} className="border-slate-700/50 hover:bg-slate-800/30">
                    <TableCell className="text-slate-400 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-white text-sm font-medium">{log.action_type}</TableCell>
                    <TableCell className="text-slate-400 text-xs max-w-xs truncate">{log.description || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default SEOAudit;
