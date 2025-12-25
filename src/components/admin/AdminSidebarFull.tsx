import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  Server,
  Store,
  HeadphonesIcon,
  ShoppingBag,
  Brain,
  Star,
  Search,
  Megaphone,
  UserPlus,
  Crown,
  Scale,
  ListTodo,
  Briefcase,
  Code,
  Building,
  Terminal,
  Percent,
  Sparkles,
  User,
  Layout,
  Headphones,
  UserCheck,
  Clock,
  FileCheck,
  LayoutDashboard,
  Settings,
  LogOut,
  KeyRound,
  Zap
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

// Flat 28 categories - NO GROUPING
export type AdminView =
  | "super-admin"
  | "admin"
  | "server-manager"
  | "franchise-manager"
  | "sales-support-manager"
  | "reseller-manager"
  | "api-ai-manager"
  | "influencer-manager"
  | "seo-manager"
  | "marketing-manager"
  | "lead-manager"
  | "pro-manager"
  | "legal-manager"
  | "task-manager"
  | "hr-manager"
  | "developer-manager"
  | "franchise"
  | "developer"
  | "reseller"
  | "influencer"
  | "prime-user"
  | "user"
  | "frontend"
  | "safe-assist"
  | "assist-manager"
  | "promise-tracker"
  | "promise-management"
  | "dashboard-management";

interface AdminSidebarFullProps {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
}

// Flat list of all 28 categories - EXACT ORDER as specified
const sidebarItems = [
  { id: "super-admin", label: "Super Admin", icon: Shield },
  { id: "admin", label: "Admin", icon: Users },
  { id: "server-manager", label: "Server Manager", icon: Server },
  { id: "franchise-manager", label: "Franchise Manager", icon: Store },
  { id: "sales-support-manager", label: "Sales & Support Manager", icon: HeadphonesIcon },
  { id: "reseller-manager", label: "Reseller Manager", icon: ShoppingBag },
  { id: "api-ai-manager", label: "API / AI Manager", icon: Brain },
  { id: "influencer-manager", label: "Influencer Manager", icon: Star },
  { id: "seo-manager", label: "SEO Manager", icon: Search },
  { id: "marketing-manager", label: "Marketing Manager", icon: Megaphone },
  { id: "lead-manager", label: "Lead Manager", icon: UserPlus },
  { id: "pro-manager", label: "Pro Manager", icon: Crown },
  { id: "legal-manager", label: "Legal Manager", icon: Scale },
  { id: "task-manager", label: "Task Manager", icon: ListTodo },
  { id: "hr-manager", label: "HR Manager", icon: Briefcase },
  { id: "developer-manager", label: "Developer Manager", icon: Code },
  { id: "franchise", label: "Franchise", icon: Building },
  { id: "developer", label: "Developer", icon: Terminal },
  { id: "reseller", label: "Reseller", icon: Percent },
  { id: "influencer", label: "Influencer", icon: Sparkles },
  { id: "prime-user", label: "Prime User", icon: Crown },
  { id: "user", label: "User", icon: User },
  { id: "frontend", label: "Frontend", icon: Layout },
  { id: "safe-assist", label: "Safe Assist", icon: Headphones },
  { id: "assist-manager", label: "Assist Manager", icon: UserCheck },
  { id: "promise-tracker", label: "Promise Tracker", icon: Clock },
  { id: "promise-management", label: "Promise Management", icon: FileCheck },
  { id: "dashboard-management", label: "Dashboard Management", icon: LayoutDashboard },
];

const AdminSidebarFull = ({ activeView, onViewChange }: AdminSidebarFullProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Super Admin';
  const maskedId = `SA-${user?.id?.slice(0, 4).toUpperCase() || 'XXXX'}`;

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-card/50 backdrop-blur-xl border-r border-white/10 flex flex-col z-40">
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-neon-purple flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Command Center</h1>
            <p className="text-xs text-muted-foreground">Master Console</p>
          </div>
        </div>
      </div>

      {/* Flat Navigation - No Groups */}
      <ScrollArea className="flex-1">
        <nav className="p-3 space-y-0.5">
          {sidebarItems.map((item, index) => {
            const isActive = activeView === item.id;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onViewChange(item.id as AdminView)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left text-sm ${
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
                <span className="font-medium truncate">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer with User Info & Actions */}
      <div className="p-3 border-t border-white/10 space-y-3">
        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2 bg-secondary/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-neon-teal flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary border-primary/30">
                SUPER ADMIN
              </Badge>
              <span className="text-[9px] text-muted-foreground font-mono">{maskedId}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs gap-1.5 h-8"
            onClick={() => onViewChange("super-admin")}
          >
            <KeyRound className="w-3 h-3" />
            Password
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs gap-1.5 h-8"
            onClick={() => onViewChange("super-admin")}
          >
            <Settings className="w-3 h-3" />
            Settings
          </Button>
        </div>

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
    </div>
  );
};

export default AdminSidebarFull;
