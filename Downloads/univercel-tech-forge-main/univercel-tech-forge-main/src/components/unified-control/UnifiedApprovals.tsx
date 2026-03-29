import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, XCircle, Clock, AlertTriangle, 
  FileText, Package, Users, CreditCard, Rocket, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const PENDING_APPROVALS = [
  { id: 1, type: "demo", title: "New CRM Demo", requester: "Dev Team", priority: "high", time: "10 mins ago", details: "Complete CRM system demo with all modules" },
  { id: 2, type: "product", title: "HR Management Product", requester: "Product Team", priority: "high", time: "1 hour ago", details: "New HR product line for enterprise clients" },
  { id: 3, type: "client", title: "Client Scope Change", requester: "Sales Team", priority: "medium", time: "2 hours ago", details: "Additional features requested by ABC Corp" },
  { id: 4, type: "billing", title: "Billing Override Request", requester: "Finance", priority: "low", time: "3 hours ago", details: "Discount approval for VIP client" },
  { id: 5, type: "deploy", title: "Production Deploy v2.1", requester: "Dev Team", priority: "critical", time: "5 mins ago", details: "Major release with security patches" },
];

const APPROVAL_HISTORY = [
  { id: 1, title: "Sales Demo", decision: "approved", by: "Boss", time: "1 day ago" },
  { id: 2, title: "API Cost Override", decision: "rejected", by: "Boss", time: "2 days ago" },
  { id: 3, title: "New Lead Source", decision: "approved", by: "Boss", time: "3 days ago" },
  { id: 4, title: "Server Scale Up", decision: "approved", by: "Boss", time: "4 days ago" },
];

export const UnifiedApprovals = () => {
  const [selectedApproval, setSelectedApproval] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "demo": return Package;
      case "product": return FileText;
      case "client": return Users;
      case "billing": return CreditCard;
      case "deploy": return Rocket;
      default: return FileText;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "red";
      case "high": return "orange";
      case "medium": return "amber";
      default: return "slate";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Approvals (Boss Panel)</h2>
          <p className="text-muted-foreground">All actions requiring boss approval</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-red-500/50 text-red-400">
            <Shield className="w-3 h-3 mr-1" />
            Boss Only Access
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Pending", value: 5, color: "orange" },
          { label: "Critical", value: 1, color: "red" },
          { label: "Approved Today", value: 12, color: "green" },
          { label: "Rejected Today", value: 2, color: "slate" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/30`}
          >
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Pending Approvals */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white">Pending Approvals</h3>
        {PENDING_APPROVALS.map((approval) => {
          const Icon = getTypeIcon(approval.type);
          const priorityColor = getPriorityColor(approval.priority);
          const isSelected = selectedApproval === approval.id;
          
          return (
            <motion.div
              key={approval.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer",
                isSelected 
                  ? "bg-orange-500/10 border-orange-500/50" 
                  : "bg-muted/20 border-border/50 hover:border-orange-500/30"
              )}
              onClick={() => setSelectedApproval(isSelected ? null : approval.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg bg-${priorityColor}-500/20 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${priorityColor}-400`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-white">{approval.title}</h4>
                    <Badge
                      variant="outline"
                      className={`text-xs border-${priorityColor}-500/50 text-${priorityColor}-400`}
                    >
                      {approval.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{approval.details}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-muted-foreground">
                      From: <span className="text-white">{approval.requester}</span>
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {approval.time}
                    </span>
                  </div>
                </div>
                {!isSelected && (
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-green-500 hover:bg-green-600 h-8">
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 h-8">
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 pt-4 border-t border-border/30"
                >
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add rejection reason (optional for approval)..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="bg-background/50"
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        className="border-red-500/50 text-red-400"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button className="bg-green-500 hover:bg-green-600">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Approval History */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
        <h3 className="text-sm font-medium text-white mb-3">Recent Decisions</h3>
        <div className="space-y-2">
          {APPROVAL_HISTORY.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-background/30">
              <div className="flex items-center gap-3">
                {item.decision === "approved" ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-sm text-white">{item.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">by {item.by}</span>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
