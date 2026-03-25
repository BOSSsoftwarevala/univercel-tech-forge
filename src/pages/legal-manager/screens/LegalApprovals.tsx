import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

const LegalApprovals = () => {
  const [approvals, setApprovals] = useState([
    { id: "APR001", item: "Privacy Policy Update v4.2", requestedBy: "SEO-****-4521", impact: "Global policy change", status: "pending" },
    { id: "APR002", item: "New Vendor Contract", requestedBy: "FIN-****-7832", impact: "Financial commitment", status: "pending" },
    { id: "APR003", item: "Trademark Registration (EU)", requestedBy: "MKT-****-1245", impact: "IP protection", status: "approved" },
    { id: "APR004", item: "Data Retention Policy Change", requestedBy: "CMP-****-9023", impact: "Compliance requirement", status: "pending" },
    { id: "APR005", item: "NDA Template Update", requestedBy: "HR-****-3456", impact: "HR process change", status: "rejected" },
  ]);

  const handleApprove = (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: "approved" } : a));
    toast.success(`Approval ${id} approved`);
  };

  const handleReject = (id: string) => {
    toast.error(`Approval ${id} rejected - reason required`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "approved": return "bg-emerald-500/20 text-emerald-400";
      case "rejected": return "bg-red-500/20 text-red-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Approvals</h2>
        <Badge className="bg-yellow-500/20 text-yellow-400">
          {approvals.filter(a => a.status === "pending").length} Pending
        </Badge>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-amber-400">Approval Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-400">Item</TableHead>
                <TableHead className="text-slate-400">Requested By</TableHead>
                <TableHead className="text-slate-400">Impact</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.map((approval) => (
                <TableRow key={approval.id} className="border-slate-700/50">
                  <TableCell className="text-white font-medium">{approval.item}</TableCell>
                  <TableCell className="text-slate-300 font-mono text-sm">{approval.requestedBy}</TableCell>
                  <TableCell className="text-slate-300">{approval.impact}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(approval.status)}>{approval.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {approval.status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove(approval.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(approval.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
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

export default LegalApprovals;
