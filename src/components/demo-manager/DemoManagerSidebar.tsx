import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  LayoutGrid, 
  Activity, 
  BarChart3, 
  Package,
  PlusCircle,
  Zap,
  Monitor,
  Globe,
  FileSpreadsheet,
  Users,
  Link2,
  LogOut,
  KeyRound,
  Settings,
  ArrowLeft,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

interface DemoManagerSidebarProps {
  activeView: string;
  onViewChange: (view: any) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid, badge: "LIVE" },
  { id: "software-catalog", label: "Software Catalog", icon: Package, badge: "5K+" },
  { id: "url-collect", label: "URL Collection", icon: Link2, badge: "NEW" },
  { id: "bulk-create", label: "Bulk Create", icon: FileSpreadsheet, badge: null },
  { id: "logins", label: "Login Manager", icon: Users, badge: null },
  { id: "uptime", label: "Uptime Monitor", icon: Activity, badge: "99.9%" },
  { id: "manage", label: "Manage Demos", icon: PlusCircle, badge: null },
  { id: "analytics", label: "Analytics", icon: BarChart3, badge: null },
  { id: "rentals", label: "Rentals", icon: Package, badge: null },
];

const DemoManagerSidebar = ({ activeView, onViewChange }: DemoManagerSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Demo Manager';
  const maskedId = `DM-${user?.id?.slice(0, 4).toUpperCase() || 'XXXX'}`;

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 bottom-0 w-64 glass-panel border-r border-border/30 z-50 flex flex-col"
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-teal via-primary to-neon-green flex items-center justify-center relative">
            <Monitor className="w-6 h-6 text-primary-foreground" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-teal/50 to-transparent animate-pulse" />
          </div>
          <div>
            <div className="font-mono font-bold text-sm text-foreground">SOFTWARE VALA</div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-[10px] text-neon-green uppercase tracking-widest font-mono">Demo Manager</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b border-border/30">
        <div className="glass-panel-glow p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-neon-teal" />
            <span className="text-xs font-mono text-neon-teal">GLOBAL STATUS</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <div className="text-lg font-mono font-bold text-neon-green">47</div>
              <div className="text-[9px] text-muted-foreground">ACTIVE</div>
            </div>
            <div>
              <div className="text-lg font-mono font-bold text-neon-orange">2</div>
              <div className="text-[9px] text-muted-foreground">PENDING</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
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
                  ? "bg-neon-teal/10 text-neon-teal border-l-2 border-neon-teal"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
              style={isActive ? { boxShadow: "inset 0 0 20px hsl(174 100% 45% / 0.1)" } : {}}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate">{item.label}</span>
              {item.badge && (
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  item.badge === "LIVE" || item.badge === "NEW"
                    ? "bg-neon-green/20 text-neon-green animate-pulse"
                    : "bg-neon-teal/20 text-neon-teal"
                }`}>
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* User Info & Actions */}
      <div className="p-3 border-t border-border/30 space-y-3">
        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2 bg-secondary/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-teal to-neon-green flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-neon-teal/10 text-neon-teal border-neon-teal/30">
                DEMO MANAGER
              </Badge>
              <span className="text-[9px] text-muted-foreground font-mono">{maskedId}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="w-full text-xs gap-1.5 h-8 border-border/50 mb-2"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Dashboard
        </Button>
        <div className="flex gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/change-password')}
            className="flex-1 text-xs gap-1.5 h-8 border-border/50"
          >
            <Lock className="w-3 h-3" />
            Password
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/settings')}
            className="flex-1 text-xs gap-1.5 h-8 border-border/50"
          >
            <Settings className="w-3 h-3" />
            Settings
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/forgot-password')}
          className="w-full text-xs gap-1.5 h-8 border-border/50 mb-2"
        >
          <KeyRound className="w-3 h-3" />
          Forgot Password
        </Button>

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full text-xs gap-2 h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="w-3 h-3" />
          Sign Out
        </Button>
      </div>
    </motion.aside>
  );
};

export default DemoManagerSidebar;
