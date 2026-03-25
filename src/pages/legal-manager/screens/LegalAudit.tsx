import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, AlertTriangle } from "lucide-react";

const LegalAudit = () => {
  const [auditLogs] = useState([
    { id: "AUD001", time: "2025-06-20 14:32:15", action: "Policy Updated", actor: "LGL-****-4521", result: "Approved", approvalRef: "APR-2025-0892" },
    { id: "AUD002", time: "2025-06-20 13:45:22", action: "Contract Reviewed", actor: "LGL-****-4521", result: "Flagged Risk", approvalRef: "N/A" },
    { id: "AUD003", time: "2025-06-20 12:18:09", action: "Trademark Added", actor: "LGL-****-4521", result: "Pending Approval", approvalRef: "APR-2025-0891" },
    { id: "AUD004", time: "2025-06-20 11:55:33", action: "Incident Escalated", actor: "LGL-****-4521", result: "Escalated", approvalRef: "ESC-2025-0234" },
    { id: "AUD005", time: "2025-06-20 10:22:41", action: "Compliance Reviewed", actor: "LGL-****-4521", result: "Compliant", approvalRef: "N/A" },
    { id: "AUD006", time: "2025-06-19 16:45:18", action: "Legal Request Resolved", actor: "LGL-****-4521", result: "Resolved", approvalRef: "N/A" },
    { id: "AUD007", time: "2025-06-19 15:30:22", action: "Approval Given", actor: "LGL-****-4521", result: "Approved", approvalRef: "APR-2025-0890" },
    { id: "AUD008", time: "2025-06-19 14:12:55", action: "Approval Rejected", actor: "LGL-****-4521", result: "Rejected", approvalRef: "APR-2025-0889" },
  ]);

  const getResultColor = (result: string) => {
    switch (result) {
      case "Approved": case "Compliant": case "Resolved": return "text-emerald-400";
      case "Pending Approval": return "text-yellow-400";
      case "Rejected": case "Flagged Risk": return "text-red-400";
      case "Escalated": return "text-purple-400";
      default: return "text-slate-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-amber-400" />
          <h2 className="text-xl font-semibold text-white">Audit Trail</h2>
        </div>
        <Badge className="bg-slate-700 text-slate-300">Read Only</Badge>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-400" />
        <p className="text-yellow-400 text-sm">
          This is an immutable audit log. No modifications or exports are permitted.
        </p>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-amber-400">Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-400">Time</TableHead>
                <TableHead className="text-slate-400">Action</TableHead>
                <TableHead className="text-slate-400">Actor</TableHead>
                <TableHead className="text-slate-400">Result</TableHead>
                <TableHead className="text-slate-400">Approval Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id} className="border-slate-700/50">
                  <TableCell className="text-slate-300 font-mono text-sm">{log.time}</TableCell>
                  <TableCell className="text-white">{log.action}</TableCell>
                  <TableCell className="text-slate-300 font-mono text-sm">{log.actor}</TableCell>
                  <TableCell className={getResultColor(log.result)}>{log.result}</TableCell>
                  <TableCell className={log.approvalRef === "N/A" ? "text-slate-500" : "text-amber-400 font-mono text-sm"}>
                    {log.approvalRef}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LegalAudit;
