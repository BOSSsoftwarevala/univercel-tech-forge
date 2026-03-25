import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Shield, Image, FileCheck, AlertTriangle, FileText, Eye, Edit, Lock, CheckCircle, History } from "lucide-react";
import { toast } from "sonner";

interface LMTrademarkManagementProps {
  activeSubSection: string;
}

const trademarks = [
  { id: "1", name: "Brand Name Protection", type: "Trademark", status: "registered", region: "Global", expiry: "2035" },
  { id: "2", name: "Logo Usage Policy", type: "Policy", status: "active", region: "Global", expiry: "N/A" },
  { id: "3", name: "Trademark Registration Status", type: "Registry", status: "registered", region: "Multi-Region", expiry: "2030" },
  { id: "4", name: "Unauthorized Usage Alerts", type: "Monitoring", status: "active", region: "Global", expiry: "Ongoing" },
  { id: "5", name: "Auto Legal Notice Generator", type: "AI Tool", status: "active", region: "Global", expiry: "N/A" },
];

const LMTrademarkManagement = ({ activeSubSection }: LMTrademarkManagementProps) => {
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
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-600 to-yellow-800 flex items-center justify-center shadow-lg">
          <Award className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trademark Management</h1>
          <p className="text-muted-foreground">Brand protection and trademark registry</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: Shield, label: "Brand Protection", onClick: () => handleAction("view", "Brand Protection") },
          { icon: Image, label: "Logo Policy", onClick: () => handleAction("view", "Logo Usage Policy") },
          { icon: FileCheck, label: "Registration", onClick: () => handleAction("view", "Trademark Registration") },
          { icon: AlertTriangle, label: "Usage Alerts", onClick: () => handleAction("view", "Unauthorized Usage Alerts") },
          { icon: FileText, label: "Notice Generator", onClick: () => handleAction("view", "Legal Notice Generator") },
        ].map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="cursor-pointer hover:scale-105 transition-transform bg-yellow-500/10 border-yellow-500/30"
              onClick={action.onClick}
            >
              <CardContent className="p-4 text-center">
                <action.icon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">{action.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Trademark Registry */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Trademark Registry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trademarks.map((tm) => (
              <motion.div
                key={tm.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-yellow-600/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{tm.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{tm.type}</Badge>
                      <span className="text-xs text-muted-foreground">{tm.region}</span>
                      <span className="text-xs text-muted-foreground">Expires: {tm.expiry}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/20 text-emerald-400">{tm.status}</Badge>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("view", tm.name)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("edit", tm.name)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("lock", tm.name)}>
                      <Lock className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("publish", tm.name)}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("history", tm.name)}>
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

export default LMTrademarkManagement;
