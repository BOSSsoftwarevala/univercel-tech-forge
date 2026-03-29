import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Send, X, CheckCircle, RefreshCw, Eye } from "lucide-react";
import { toast } from "sonner";
import { useSystemActions } from "@/hooks/useSystemActions";

const MMApprovals = () => {
  const { actions, executeAction, isLoading } = useSystemActions();
  const [approvals, setApprovals] = useState([
    { id: "APR001", item: "Summer Campaign Budget", requestedBy: "MKT-****-7821", impact: "₹5L spend", status: "pending", date: "2025-06-20" },
    { id: "APR002", item: "New Creative Upload", requestedBy: "MKT-****-7821", impact: "Banner update", status: "pending", date: "2025-06-19" },
    { id: "APR003", item: "Location Target: USA", requestedBy: "MKT-****-7821", impact: "4.2M audience", status: "approved", date: "2025-06-18" },
    { id: "APR004", item: "Festival Discount 40%", requestedBy: "MKT-****-7821", impact: "All sectors", status: "approved", date: "2025-06-17" },
    { id: "APR005", item: "API Key Rotation", requestedBy: "MKT-****-7821", impact: "Security", status: "rejected", date: "2025-06-16" },
  ]);

  const handleApprove = useCallback((id: string, item: string) => {
    actions.approve('marketing', 'ApprovalRequest', id, item);
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a));
  }, [actions]);

  const handleReject = useCallback((id: string, item: string) => {
    actions.reject('marketing', 'ApprovalRequest', id, 'Rejected by Marketing Manager', item);
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
  }, [actions]);

  const handleView = useCallback((id: string, item: string) => {
    actions.read('marketing', 'ApprovalRequest', id, item);
  }, [actions]);

  const handleRefresh = useCallback(() => {
    actions.refresh('marketing', 'ApprovalQueue');
  }, [actions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "approved": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "rejected": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const pendingCount = approvals.filter(a => a.status === "pending").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Approval Queue</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Badge className="bg-yellow-500/20 text-yellow-400">
            {pendingCount} Pending
          </Badge>
        </div>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-emerald-400">All Approval Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-400">Item</TableHead>
                <TableHead className="text-slate-400">Requested By</TableHead>
                <TableHead className="text-slate-400">Impact</TableHead>
                <TableHead className="text-slate-400">Date</TableHead>
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
                  <TableCell className="text-slate-300">{approval.date}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(approval.status)}>
                      {approval.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {approval.status === "pending" && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleApprove(approval.id, approval.item)}>
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleReject(approval.id, approval.item)}>
                          <X className="h-4 w-4 text-red-400" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleView(approval.id, approval.item)}>
                          <Eye className="h-4 w-4 text-blue-400" />
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

export default MMApprovals;
