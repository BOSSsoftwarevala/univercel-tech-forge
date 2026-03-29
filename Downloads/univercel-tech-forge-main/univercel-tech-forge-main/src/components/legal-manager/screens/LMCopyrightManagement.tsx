import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copyright, Code, Image, FileText, AlertTriangle, Gavel, Eye, Edit, Lock, CheckCircle, History, XCircle } from "lucide-react";
import { toast } from "sonner";

interface LMCopyrightManagementProps {
  activeSubSection: string;
}

const copyrightItems = [
  { id: "1", name: "Software Copyright Declaration", type: "Software", status: "registered", year: "2025", protection: "Full" },
  { id: "2", name: "Code Ownership Declaration", type: "Source Code", status: "registered", year: "2025", protection: "Full" },
  { id: "3", name: "Asset Ownership", type: "Digital Assets", status: "registered", year: "2024", protection: "Full" },
  { id: "4", name: "Auto Copyright Notice", type: "Auto-Generated", status: "active", year: "2025", protection: "Auto" },
  { id: "5", name: "Violation Detection System", type: "AI Monitoring", status: "active", year: "2025", protection: "Active" },
  { id: "6", name: "Legal Action Log", type: "Records", status: "maintained", year: "2024-2025", protection: "Documented" },
];

const LMCopyrightManagement = ({ activeSubSection }: LMCopyrightManagementProps) => {
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
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg">
          <Copyright className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Copyright Management</h1>
          <p className="text-muted-foreground">Protect intellectual property and code ownership</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { icon: Code, label: "Software Copyright", onClick: () => handleAction("view", "Software Copyright") },
          { icon: FileText, label: "Code Ownership", onClick: () => handleAction("view", "Code Ownership") },
          { icon: Image, label: "Asset Ownership", onClick: () => handleAction("view", "Asset Ownership") },
          { icon: Copyright, label: "Auto Notice", onClick: () => handleAction("view", "Auto Copyright Notice") },
          { icon: AlertTriangle, label: "Violations", onClick: () => handleAction("view", "Violation Detection") },
          { icon: Gavel, label: "Legal Actions", onClick: () => handleAction("view", "Legal Action Log") },
        ].map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="cursor-pointer hover:scale-105 transition-transform bg-indigo-500/10 border-indigo-500/30"
              onClick={action.onClick}
            >
              <CardContent className="p-4 text-center">
                <action.icon className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">{action.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Copyright Items */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Copyright className="w-5 h-5 text-indigo-400" />
            Copyright Registry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {copyrightItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                    <Copyright className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      <span className="text-xs text-muted-foreground">© {item.year}</span>
                      <Badge className="bg-indigo-500/20 text-indigo-400 text-xs">{item.protection}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/20 text-emerald-400">{item.status}</Badge>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("view", item.name)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("edit", item.name)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("lock", item.name)}>
                      <Lock className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("publish", item.name)}>
                      <CheckCircle className="w-4 h-4" />
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

export default LMCopyrightManagement;
