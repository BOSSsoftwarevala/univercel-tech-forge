import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, MessageSquare, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const LegalRequests = () => {
  const [requests] = useState([
    { id: "REQ001", raisedBy: "FRA-****-4521", type: "Contract Review", priority: "high", status: "pending", date: "2025-06-20" },
    { id: "REQ002", raisedBy: "RES-****-7832", type: "Policy Clarification", priority: "medium", status: "in_progress", date: "2025-06-19" },
    { id: "REQ003", raisedBy: "DEV-****-1245", type: "NDA Request", priority: "low", status: "pending", date: "2025-06-19" },
    { id: "REQ004", raisedBy: "INF-****-9023", type: "Compliance Query", priority: "high", status: "resolved", date: "2025-06-18" },
    { id: "REQ005", raisedBy: "SUP-****-3456", type: "Legal Opinion", priority: "critical", status: "escalated", date: "2025-06-17" },
    { id: "REQ006", raisedBy: "FRA-****-6789", type: "Trademark Query", priority: "medium", status: "pending", date: "2025-06-17" },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-400";
      case "high": return "bg-orange-500/20 text-orange-400";
      case "medium": return "bg-yellow-500/20 text-yellow-400";
      case "low": return "bg-blue-500/20 text-blue-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-slate-500/20 text-slate-400";
      case "in_progress": return "bg-blue-500/20 text-blue-400";
      case "resolved": return "bg-emerald-500/20 text-emerald-400";
      case "escalated": return "bg-purple-500/20 text-purple-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const handleReview = (id: string) => {
    toast.info(`Reviewing request ${id}`);
  };

  const handleRespond = (id: string) => {
    toast.success(`Response sent for request ${id}`);
  };

  const handleEscalate = (id: string) => {
    toast.warning(`Request ${id} escalated to Super Admin`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Legal Requests</h2>
        <Badge className="bg-amber-500/20 text-amber-400">
          {requests.filter(r => r.status === "pending").length} Pending
        </Badge>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-amber-400">All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-slate-400">Request ID</TableHead>
                <TableHead className="text-slate-400">Raised By</TableHead>
                <TableHead className="text-slate-400">Type</TableHead>
                <TableHead className="text-slate-400">Priority</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id} className="border-slate-700/50">
                  <TableCell className="text-amber-400 font-mono">{request.id}</TableCell>
                  <TableCell className="text-slate-300 font-mono text-sm">{request.raisedBy}</TableCell>
                  <TableCell className="text-white">{request.type}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>{request.status.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleReview(request.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleRespond(request.id)}>
                        <MessageSquare className="h-4 w-4 text-emerald-400" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEscalate(request.id)}>
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

export default LegalRequests;
