import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  Calendar, 
  BarChart3, 
  AlertTriangle,
  Target,
  Activity,
  Shield,
  BellRing
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LeadSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "incoming", label: "Incoming Leads", icon: BellRing, badge: 4 },
  { id: "assignment", label: "Assignment", icon: UserPlus },
  { id: "followup", label: "Follow-ups", icon: Calendar, badge: 3 },
  { id: "analytics", label: "Analytics & AI", icon: BarChart3 },
  { id: "escalations", label: "Escalations", icon: AlertTriangle, badge: 2 },
];

const LeadSidebar = ({ activeView, onViewChange }: LeadSidebarProps) => {
  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-screen w-64 bg-[#0a1628] border-r border-border/30 flex flex-col z-50"
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-neon-green flex items-center justify-center">
            <Target className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Lead Manager</h1>
            <p className="text-xs text-muted-foreground">Control Center</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b border-border/30">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg bg-neon-green/10 border border-neon-green/20">
            <p className="text-lg font-bold text-neon-green">1,247</p>
            <p className="text-xs text-muted-foreground">Total Leads</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-lg font-bold text-primary">24.8%</p>
            <p className="text-xs text-muted-foreground">Conversion</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-primary/20 text-primary border border-primary/30' 
                  : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <Badge className={`ml-auto ${
                  item.id === 'escalations' 
                    ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                    : item.id === 'incoming'
                    ? 'bg-neon-green/20 text-neon-green border-neon-green/30 animate-pulse'
                    : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                }`}>
                  {item.badge}
                </Badge>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-border/30">
        <div className="p-3 rounded-lg bg-background/30 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-neon-green animate-pulse" />
            <span className="text-sm font-medium text-foreground">System Status</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">AI Scoring</span>
              <span className="text-neon-green">Active</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Auto-Routing</span>
              <span className="text-neon-green">Enabled</span>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs font-medium text-foreground">Contact Masking</p>
              <p className="text-xs text-muted-foreground">All data protected</p>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default LeadSidebar;
