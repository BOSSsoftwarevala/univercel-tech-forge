import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Shield, 
  Users, 
  Activity, 
  BarChart3, 
  Lock,
  Server,
  Zap,
  Crown
} from "lucide-react";

interface AdminSidebarProps {
  activeView: string;
  onViewChange: (view: any) => void;
}

const menuItems = [
  { id: "overview", label: "Module Overview", icon: LayoutDashboard, badge: "LIVE" },
  { id: "roles", label: "Access Control", icon: Shield, badge: null },
  { id: "users", label: "User Management", icon: Users, badge: "248" },
  { id: "health", label: "System Health", icon: Server, badge: null },
  { id: "activity", label: "Activity Monitor", icon: Activity, badge: "LIVE" },
  { id: "metrics", label: "Global Metrics", icon: BarChart3, badge: null },
  { id: "security", label: "Security Center", icon: Lock, badge: "2" },
];

const AdminSidebar = ({ activeView, onViewChange }: AdminSidebarProps) => {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 bottom-0 w-64 glass-panel border-r border-border/30 z-50"
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-neon-purple to-neon-teal flex items-center justify-center relative">
            <Crown className="w-6 h-6 text-primary-foreground" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/50 to-transparent animate-pulse" />
          </div>
          <div>
            <div className="font-mono font-bold text-sm text-foreground">SOFTWARE VALA</div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-[10px] text-neon-green uppercase tracking-widest font-mono">Super Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Badge */}
      <div className="p-4 border-b border-border/30">
        <div className="glass-panel-glow p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-primary">MASTER CONTROL</span>
          </div>
          <div className="text-[10px] text-muted-foreground">
            Full access to all modules and system controls
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="overflow-y-auto h-[calc(100%-180px)] py-3 px-2 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
              style={isActive ? { boxShadow: "inset 0 0 20px hsl(var(--neon-cyan) / 0.1)" } : {}}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate">{item.label}</span>
              {item.badge && (
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  item.badge === "LIVE"
                    ? "bg-neon-green/20 text-neon-green animate-pulse"
                    : "bg-primary/20 text-primary"
                }`}>
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* System Status */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/30 bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground font-mono">SYSTEM STATUS</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-neon-green font-mono">ALL SYSTEMS ONLINE</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
