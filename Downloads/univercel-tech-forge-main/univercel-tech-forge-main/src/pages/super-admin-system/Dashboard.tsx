import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Users, UserCog, Clock, Key, FileText, AlertTriangle,
  TrendingUp, TrendingDown, Activity, ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import SuperAdminWireframeLayout from "@/components/super-admin-wireframe/SuperAdminWireframeLayout";
import { useAuth } from "@/hooks/useAuth";

interface DashboardWidget {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: React.ElementType;
  color: string;
  path: string;
}

interface LiveActivity {
  id: string;
  action: string;
  target: string;
  time: string;
  type: "info" | "warning" | "critical";
}

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { loading, isBossOwner } = useAuth();

  // Boss Owner should always land on the Crown (Supreme) panel
  useEffect(() => {
    if (loading) return;
    if (isBossOwner) {
      navigate("/super-admin", { replace: true });
    }
  }, [loading, isBossOwner, navigate]);

  const [activities, setActivities] = useState<LiveActivity[]>([
    { id: "1", action: "User suspended", target: "USR-1234", time: "2 min ago", type: "warning" },
    { id: "2", action: "New admin created", target: "ADM-5678", time: "5 min ago", type: "info" },
    { id: "3", action: "Security alert resolved", target: "SEC-9012", time: "8 min ago", type: "info" },
    { id: "4", action: "Rule activated", target: "RUL-3456", time: "12 min ago", type: "info" },
    { id: "5", action: "High-risk approval pending", target: "APR-7890", time: "15 min ago", type: "critical" },
    { id: "6", action: "Module disabled", target: "MOD-2345", time: "20 min ago", type: "warning" },
  ]);

  const widgets: DashboardWidget[] = [
    { id: "users", label: "Total Users", value: "24,891", change: 12.5, trend: "up", icon: Users, color: "from-blue-500 to-cyan-500", path: "/super-admin-system/users" },
    { id: "admins", label: "Total Admins", value: "147", change: 3.2, trend: "up", icon: UserCog, color: "from-purple-500 to-pink-500", path: "/super-admin-system/admins" },
    { id: "approvals", label: "Pending Approvals", value: "23", change: -8.1, trend: "down", icon: Clock, color: "from-orange-500 to-yellow-500", path: "/super-admin-system/approvals" },
    { id: "rentals", label: "Active Rentals", value: "1,892", change: 5.7, trend: "up", icon: Key, color: "from-green-500 to-emerald-500", path: "/super-admin-system/rentals" },
    { id: "rules", label: "Active Rules", value: "342", change: 2.1, trend: "up", icon: FileText, color: "from-indigo-500 to-violet-500", path: "/super-admin-system/rules" },
    { id: "security", label: "Security Alerts", value: "7", change: 15.4, trend: "up", icon: AlertTriangle, color: "from-red-500 to-rose-500", path: "/super-admin-system/security" },
  ];

  const activityColors = {
    info: "border-l-primary",
    warning: "border-l-neon-orange",
    critical: "border-l-destructive",
  };

  return (
    <SuperAdminWireframeLayout activeSection="dashboard">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Real-time system overview</p>
          </div>
          <Badge variant="outline" className="bg-neon-green/10 text-neon-green border-neon-green/50">
            <Activity className="w-3 h-3 mr-1 animate-pulse" />
            Live
          </Badge>
        </div>

        {/* Widget Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {widgets.map((widget, index) => {
            const Icon = widget.icon;
            const TrendIcon = widget.trend === "up" ? TrendingUp : TrendingDown;
            const trendColor = widget.trend === "up" ? "text-neon-green" : "text-neon-red";

            return (
              <motion.div
                key={widget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="glass-panel cursor-pointer hover:border-primary/50 transition-all duration-300 group"
                  onClick={() => navigate(widget.path)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${widget.color} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">{widget.label}</p>
                      <div className="flex items-end gap-2 mt-1">
                        <h3 className="text-3xl font-bold">{widget.value}</h3>
                        <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
                          <TrendIcon className="w-4 h-4" />
                          <span>{Math.abs(widget.change)}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Live Activity Feed */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Live Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 bg-secondary/30 rounded-lg border-l-4 ${activityColors[activity.type]}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground font-mono">{activity.target}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </SuperAdminWireframeLayout>
  );
};

export default SuperAdminDashboard;
