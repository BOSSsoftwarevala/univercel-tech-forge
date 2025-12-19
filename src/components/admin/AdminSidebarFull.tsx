import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Shield,
  Users,
  Activity,
  BarChart3,
  Lock,
  Globe,
  Wallet,
  UserPlus,
  Code,
  Brain,
  Scale,
  Bell,
  Monitor,
  Rocket,
  Megaphone,
  HeadphonesIcon,
  MapPin,
  HelpCircle,
  Gauge,
  Database,
  Zap
} from "lucide-react";

type AdminView =
  | "overview"
  | "roles"
  | "users"
  | "health"
  | "activity"
  | "metrics"
  | "security"
  | "live-control"
  | "wallet-finance"
  | "lead-distribution"
  | "dev-orchestration"
  | "performance-ai"
  | "compliance"
  | "emergency";

interface AdminSidebarFullProps {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
}

const AdminSidebarFull = ({ activeView, onViewChange }: AdminSidebarFullProps) => {
  const menuItems = [
    { id: "live-control", label: "Live Control Center", icon: Globe },
    { id: "overview", label: "Module Overview", icon: LayoutDashboard },
    { id: "lead-distribution", label: "Lead Distribution", icon: UserPlus },
    { id: "dev-orchestration", label: "Dev Orchestration", icon: Code },
    { id: "wallet-finance", label: "Wallet & Finance", icon: Wallet },
    { id: "performance-ai", label: "Performance AI", icon: Brain },
    { id: "roles", label: "Role Access Control", icon: Shield },
    { id: "users", label: "User Management", icon: Users },
    { id: "compliance", label: "Compliance & Legal", icon: Scale },
    { id: "security", label: "Security Center", icon: Lock },
    { id: "emergency", label: "Emergency Controls", icon: Bell },
    { id: "health", label: "System Health", icon: Activity },
    { id: "activity", label: "Activity Monitor", icon: Gauge },
    { id: "metrics", label: "Global Metrics", icon: BarChart3 },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-card/50 backdrop-blur-xl border-r border-white/10 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-neon-purple flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Super Admin</h1>
            <p className="text-xs text-muted-foreground">Master Console</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onViewChange(item.id as AdminView)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-neon-teal flex items-center justify-center">
            <span className="text-xs font-bold">SA</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Super Admin</p>
            <p className="text-xs text-muted-foreground">Full Access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebarFull;
