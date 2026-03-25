import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, Shield, LogOut, Save, Eye, Edit, Lock } from "lucide-react";
import { toast } from "sonner";

interface LMSettingsProps {
  activeSubSection: string;
}

const settingsItems = [
  { id: "1", name: "Legal Profile", description: "Manage your legal manager profile", icon: User, status: "configured" },
  { id: "2", name: "Notification Rules", description: "Configure alert and notification settings", icon: Bell, status: "configured" },
  { id: "3", name: "Security Settings", description: "Two-factor authentication and access controls", icon: Shield, status: "active" },
];

const LMSettings = ({ activeSubSection }: LMSettingsProps) => {
  const handleAction = (action: string, item: string) => {
    const toastMap: Record<string, () => void> = {
      view: () => toast.info(`Viewing: ${item}`),
      edit: () => toast.info(`Editing: ${item}`),
      save: () => toast.success(`Saved: ${item}`),
      logout: () => toast.warning("Logging out..."),
    };
    toastMap[action]?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-lg">
          <Settings className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your legal manager settings</p>
        </div>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card/50 border-border/50 hover:border-gray-500/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-600/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-500/20 text-emerald-400">{item.status}</Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleAction("view", item.name)}>
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleAction("edit", item.name)}>
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Logout Card */}
      <Card className="bg-red-500/10 border-red-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-600/20 flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Logout</h3>
                <p className="text-sm text-muted-foreground">Sign out of your legal manager account</p>
              </div>
            </div>
            <Button 
              variant="destructive" 
              onClick={() => handleAction("logout", "Session")}
              className="bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMSettings;
