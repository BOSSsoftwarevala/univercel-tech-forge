import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Brain, UserCheck, Crown, Lock, Upload, Eye, Edit, History, XCircle } from "lucide-react";
import { toast } from "sonner";

interface LMApprovalControlProps {
  activeSubSection: string;
}

const approvalItems = [
  { id: "1", name: "AI Draft Review Queue", type: "AI → Human", status: "pending", count: 12, priority: "High" },
  { id: "2", name: "Manager Approval Pending", type: "Manager Review", status: "pending", count: 8, priority: "Medium" },
  { id: "3", name: "Boss Override Requests", type: "Executive", status: "pending", count: 2, priority: "Critical" },
  { id: "4", name: "Locked Agreements", type: "Locked", status: "locked", count: 45, priority: "N/A" },
  { id: "5", name: "Published Agreements", type: "Published", status: "active", count: 189, priority: "N/A" },
];

const LMApprovalControl = ({ activeSubSection }: LMApprovalControlProps) => {
  const handleAction = (action: string, item: string) => {
    const toastMap: Record<string, () => void> = {
      view: () => toast.info(`Viewing: ${item}`),
      approve: () => toast.success(`Approved: ${item}`),
      reject: () => toast.error(`Rejected: ${item}`),
      lock: () => toast.warning(`Locked: ${item}`),
      unlock: () => toast.success(`Unlocked: ${item}`),
      publish: () => toast.success(`Published: ${item}`),
      history: () => toast.info(`Viewing history: ${item}`),
    };
    toastMap[action]?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-lg">
          <CheckCircle className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Approval & Control</h1>
          <p className="text-muted-foreground">Manage approvals and publishing workflow</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: Brain, label: "AI Review", onClick: () => handleAction("view", "AI Draft Review") },
          { icon: UserCheck, label: "Manager Approval", onClick: () => handleAction("view", "Manager Approval") },
          { icon: Crown, label: "Boss Override", onClick: () => handleAction("view", "Boss Override") },
          { icon: Lock, label: "Lock Agreement", onClick: () => handleAction("lock", "Agreement") },
          { icon: Upload, label: "Publish", onClick: () => handleAction("publish", "Agreement") },
        ].map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="cursor-pointer hover:scale-105 transition-transform bg-green-500/10 border-green-500/30"
              onClick={action.onClick}
            >
              <CardContent className="p-4 text-center">
                <action.icon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">{action.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Approval Queue */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Approval Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {approvalItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      <span className="text-xs text-muted-foreground">{item.count} items</span>
                      {item.priority !== "N/A" && (
                        <Badge className={item.priority === "Critical" ? "bg-red-500/20 text-red-400" : item.priority === "High" ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"}>
                          {item.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={item.status === "active" ? "bg-emerald-500/20 text-emerald-400" : item.status === "locked" ? "bg-amber-500/20 text-amber-400" : "bg-yellow-500/20 text-yellow-400"}>
                    {item.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("view", item.name)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("approve", item.name)}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("reject", item.name)}>
                      <XCircle className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("lock", item.name)}>
                      <Lock className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("history", item.name)}>
                      <History className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMApprovalControl;
