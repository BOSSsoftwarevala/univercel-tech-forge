import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Box, Power, Activity, Users, CreditCard, MessageSquare,
  BarChart3, FileText, Shield, Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import SuperAdminWireframeLayout from "@/components/super-admin-wireframe/SuperAdminWireframeLayout";

interface Module {
  id: string;
  code: string;
  name: string;
  description: string;
  status: "enabled" | "disabled";
  usagePercent: number;
  activeUsers: number;
  icon: React.ElementType;
  color: string;
}

const modules: Module[] = [
  { id: "M001", code: "AUTH", name: "Authentication", description: "User authentication and security", status: "enabled", usagePercent: 92, activeUsers: 24500, icon: Shield, color: "from-blue-500 to-cyan-500" },
  { id: "M002", code: "PAY", name: "Payments", description: "Payment processing and billing", status: "enabled", usagePercent: 78, activeUsers: 18900, icon: CreditCard, color: "from-green-500 to-emerald-500" },
  { id: "M003", code: "CHAT", name: "Messaging", description: "Real-time chat and notifications", status: "enabled", usagePercent: 65, activeUsers: 15200, icon: MessageSquare, color: "from-purple-500 to-pink-500" },
  { id: "M004", code: "ANALYTICS", name: "Analytics", description: "Data analytics and reporting", status: "enabled", usagePercent: 45, activeUsers: 8900, icon: BarChart3, color: "from-orange-500 to-yellow-500" },
  { id: "M005", code: "DOCS", name: "Documents", description: "Document management system", status: "disabled", usagePercent: 0, activeUsers: 0, icon: FileText, color: "from-indigo-500 to-violet-500" },
  { id: "M006", code: "AI", name: "AI Services", description: "Artificial intelligence features", status: "enabled", usagePercent: 34, activeUsers: 6700, icon: Zap, color: "from-red-500 to-rose-500" },
];

const SuperAdminModules = () => {
  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>(
    Object.fromEntries(modules.map(m => [m.id, m.status === "enabled"]))
  );

  const toggleModule = (id: string) => {
    setModuleStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SuperAdminWireframeLayout activeSection="modules">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Module Control</h1>
            <p className="text-muted-foreground">Enable or disable system modules</p>
          </div>
          <Badge variant="outline" className="bg-neon-green/10 text-neon-green border-neon-green/50">
            <Activity className="w-3 h-3 mr-1 animate-pulse" />
            {modules.filter(m => moduleStates[m.id]).length} Active
          </Badge>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => {
            const Icon = module.icon;
            const isEnabled = moduleStates[module.id];

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`glass-panel transition-all duration-300 ${!isEnabled && "opacity-60"}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${module.color} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={() => toggleModule(module.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{module.name}</h3>
                        <Badge variant="outline" className="text-xs font-mono">{module.code}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Usage</span>
                        <span className="font-medium">{module.usagePercent}%</span>
                      </div>
                      <Progress value={module.usagePercent} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{module.activeUsers.toLocaleString()} active</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={isEnabled 
                          ? "bg-neon-green/10 text-neon-green border-neon-green/50" 
                          : "bg-muted text-muted-foreground"
                        }
                      >
                        {isEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SuperAdminWireframeLayout>
  );
};

export default SuperAdminModules;
