import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Shield, ScrollText, RefreshCw, Brain, Database, Eye, Edit, Lock, CheckCircle, History } from "lucide-react";
import { toast } from "sonner";

interface LMPolicyManagementProps {
  activeSubSection: string;
}

const policies = [
  { id: "1", name: "Privacy Policy", type: "Privacy", status: "active", version: "v5.2", updated: "Jan 2025" },
  { id: "2", name: "Terms & Conditions", type: "Legal", status: "active", version: "v4.1", updated: "Dec 2024" },
  { id: "3", name: "Refund Policy", type: "Commercial", status: "active", version: "v2.3", updated: "Nov 2024" },
  { id: "4", name: "Usage Policy", type: "Usage", status: "active", version: "v3.0", updated: "Jan 2025" },
  { id: "5", name: "AI Usage Policy", type: "AI/ML", status: "active", version: "v1.5", updated: "Jan 2025" },
  { id: "6", name: "Data Retention Policy", type: "Data", status: "active", version: "v2.1", updated: "Dec 2024" },
];

const LMPolicyManagement = ({ activeSubSection }: LMPolicyManagementProps) => {
  const handleAction = (action: string, item: string) => {
    const toastMap: Record<string, () => void> = {
      view: () => toast.info(`Viewing: ${item}`),
      edit: () => toast.info(`Editing: ${item}`),
      lock: () => toast.warning(`Locking: ${item}`),
      publish: () => toast.success(`Published: ${item}`),
      revoke: () => toast.error(`Revoked: ${item}`),
      history: () => toast.info(`Viewing history: ${item}`),
    };
    toastMap[action]?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-lg">
          <FileText className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Policy Management</h1>
          <p className="text-muted-foreground">Manage all system policies and terms</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { icon: Shield, label: "Privacy Policy", onClick: () => handleAction("view", "Privacy Policy") },
          { icon: ScrollText, label: "Terms & Conditions", onClick: () => handleAction("view", "Terms & Conditions") },
          { icon: RefreshCw, label: "Refund Policy", onClick: () => handleAction("view", "Refund Policy") },
          { icon: FileText, label: "Usage Policy", onClick: () => handleAction("view", "Usage Policy") },
          { icon: Brain, label: "AI Usage Policy", onClick: () => handleAction("view", "AI Usage Policy") },
          { icon: Database, label: "Data Retention", onClick: () => handleAction("view", "Data Retention Policy") },
        ].map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="cursor-pointer hover:scale-105 transition-transform bg-violet-500/10 border-violet-500/30"
              onClick={action.onClick}
            >
              <CardContent className="p-4 text-center">
                <action.icon className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">{action.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Policies List */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-400" />
            Active Policies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {policies.map((policy) => (
              <motion.div
                key={policy.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{policy.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{policy.type}</Badge>
                      <span className="text-xs text-muted-foreground">{policy.version}</span>
                      <span className="text-xs text-muted-foreground">Updated: {policy.updated}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/20 text-emerald-400">{policy.status}</Badge>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("view", policy.name)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("edit", policy.name)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("lock", policy.name)}>
                      <Lock className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("publish", policy.name)}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("history", policy.name)}>
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

export default LMPolicyManagement;
