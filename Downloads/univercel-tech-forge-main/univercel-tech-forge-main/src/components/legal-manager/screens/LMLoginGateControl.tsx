import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DoorOpen, FileText, ScrollText, CheckSquare, Play, LogOut, RefreshCw, Eye, Edit, Lock, CheckCircle, History } from "lucide-react";
import { toast } from "sonner";

interface LMLoginGateControlProps {
  activeSubSection: string;
}

const gateSettings = [
  { id: "1", name: "Agreement Review Screen", status: "enabled", type: "Display", enforcement: "Mandatory" },
  { id: "2", name: "Scroll-to-End Enforcement", status: "enabled", type: "UX", enforcement: "Strict" },
  { id: "3", name: "Mandatory Accept Checkbox", status: "enabled", type: "Input", enforcement: "Required" },
  { id: "4", name: "Accept & Continue Flow", status: "enabled", type: "Action", enforcement: "Mandatory" },
  { id: "5", name: "Reject → Logout Flow", status: "enabled", type: "Action", enforcement: "Strict" },
  { id: "6", name: "Re-Accept on Update", status: "enabled", type: "Trigger", enforcement: "Auto" },
];

const LMLoginGateControl = ({ activeSubSection }: LMLoginGateControlProps) => {
  const handleAction = (action: string, item: string) => {
    const toastMap: Record<string, () => void> = {
      view: () => toast.info(`Viewing: ${item}`),
      edit: () => toast.info(`Editing: ${item}`),
      lock: () => toast.warning(`Locking: ${item}`),
      enable: () => toast.success(`Enabled: ${item}`),
      disable: () => toast.error(`Disabled: ${item}`),
      history: () => toast.info(`Viewing history: ${item}`),
    };
    toastMap[action]?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg">
          <DoorOpen className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Login Gate Control</h1>
          <p className="text-muted-foreground">Critical: No Agreement = No Access</p>
        </div>
        <Badge className="bg-red-500/20 text-red-400 border-red-500/50 ml-auto">CRITICAL</Badge>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { icon: FileText, label: "Review Screen", onClick: () => handleAction("view", "Review Screen") },
          { icon: ScrollText, label: "Scroll Enforcement", onClick: () => handleAction("view", "Scroll Enforcement") },
          { icon: CheckSquare, label: "Accept Checkbox", onClick: () => handleAction("view", "Accept Checkbox") },
          { icon: Play, label: "Accept & Continue", onClick: () => handleAction("view", "Accept Flow") },
          { icon: LogOut, label: "Reject → Logout", onClick: () => handleAction("view", "Reject Flow") },
          { icon: RefreshCw, label: "Re-Accept Trigger", onClick: () => handleAction("view", "Re-Accept Trigger") },
        ].map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="cursor-pointer hover:scale-105 transition-transform bg-red-500/10 border-red-500/30"
              onClick={action.onClick}
            >
              <CardContent className="p-4 text-center">
                <action.icon className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">{action.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Gate Settings */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DoorOpen className="w-5 h-5 text-red-400" />
            Gate Control Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gateSettings.map((setting) => (
              <motion.div
                key={setting.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                    <DoorOpen className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{setting.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{setting.type}</Badge>
                      <Badge className="bg-amber-500/20 text-amber-400 text-xs">{setting.enforcement}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500/20 text-emerald-400">{setting.status}</Badge>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("view", setting.name)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("edit", setting.name)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("lock", setting.name)}>
                      <Lock className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("enable", setting.name)}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction("history", setting.name)}>
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

export default LMLoginGateControl;
