import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const LegalIncidentsDisputes = () => {
  const [incidents] = useState([
    { id: "INC001", type: "IP Infringement", parties: "External vs Company", severity: "high", status: "investigating", date: "2025-06-18" },
    { id: "INC002", type: "Contract Breach", parties: "Vendor D vs Company", severity: "critical", status: "pending_action", date: "2025-06-15" },
    { id: "INC003", type: "Data Privacy Complaint", parties: "User vs Company", severity: "medium", status: "resolved", date: "2025-06-10" },
    { id: "INC004", type: "Trademark Dispute", parties: "Competitor vs Company", severity: "high", status: "escalated", date: "2025-06-08" },
    { id: "INC005", type: "Payment Dispute", parties: "Reseller vs Company", severity: "low", status: "investigating", date: "2025-06-05" },
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400";
      case "high": return "bg-orange-500/20 text-orange-400";
      case "medium": return "bg-yellow-500/20 text-yellow-400";
      case "low": return "bg-blue-500/20 text-blue-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "investigating": return "bg-blue-500/20 text-blue-400";
      case "pending_action": return "bg-yellow-500/20 text-yellow-400";
      case "resolved": return "bg-emerald-500/20 text-emerald-400";
      case "escalated": return "bg-purple-500/20 text-purple-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const handleInvestigate = (id: string) => {
    toast.info(`Investigation started for case ${id}`);
  };

  const handleRecommendAction = (id: string) => {
    toast.success(`Action recommendation submitted for case ${id}`);
  };

  const handleEscalate = (id: string) => {
    toast.warning(`Case ${id} escalated to Super Admin`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Incidents & Disputes</h2>
        <div className="flex gap-2">
          <Badge className="bg-red-500/20 text-red-400">
            {incidents.filter(i => i.severity === "critical").length} Critical
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400">
            {incidents.filter(i => i.status === "investigating").length} Investigating
          </Badge>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-amber-400">All Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-400">Case ID</TableHead>
                <TableHead className="text-slate-400">Type</TableHead>
                <TableHead className="text-slate-400">Parties</TableHead>
                <TableHead className="text-slate-400">Severity</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.id} className="border-slate-700/50">
                  <TableCell className="text-amber-400 font-mono">{incident.id}</TableCell>
                  <TableCell className="text-white">{incident.type}</TableCell>
                  <TableCell className="text-slate-300">{incident.parties}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(incident.status)}>{incident.status.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleInvestigate(incident.id)}>
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleRecommendAction(incident.id)}>
                        <FileText className="h-4 w-4 text-emerald-400" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEscalate(incident.id)}>
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      </Button>
                    </div>
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

export default LegalIncidentsDisputes;
