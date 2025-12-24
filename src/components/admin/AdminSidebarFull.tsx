import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  Megaphone,
  HeadphonesIcon,
  Gauge,
  Zap,
  Store,
  ShoppingBag,
  DollarSign,
  Search,
  TrendingUp,
  Lightbulb,
  Heart,
  Briefcase,
  FileText,
  Star,
  Crown,
  Settings,
  LogOut,
  KeyRound,
  Server,
  Handshake,
  Key,
  UserX
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

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
  | "emergency"
  | "franchise"
  | "reseller"
  | "sales"
  | "support"
  | "seo"
  | "marketing"
  | "rnd"
  | "client-success"
  | "legal"
  | "hr"
  | "demo-product"
  | "influencer"
  | "prime-users"
  | "server-management"
  | "approval-queue"
  | "2fa-settings"
  | "force-logout"
  | "promise-management"
  | "ai-management"
  | "franchise-keys"
  | "settings";

interface AdminSidebarFullProps {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
}

const AdminSidebarFull = ({ activeView, onViewChange }: AdminSidebarFullProps) => {
  const { user, signOut, userRole } = useAuth();
  const navigate = useNavigate();

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Super Admin';
  const maskedId = `SA-${user?.id?.slice(0, 4).toUpperCase() || 'XXXX'}`;

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const menuSections = [
    {
      title: "Control Center",
      items: [
        { id: "live-control", label: "Live Control", icon: Globe },
        { id: "overview", label: "Module Overview", icon: LayoutDashboard },
      ]
    },
    {
      title: "Operations",
      items: [
        { id: "lead-distribution", label: "Lead Manager", icon: UserPlus },
        { id: "dev-orchestration", label: "Developer Panel", icon: Code },
        { id: "promise-management", label: "Promise Tracker", icon: Handshake },
        { id: "franchise", label: "Franchise", icon: Store },
        { id: "franchise-keys", label: "Franchise Keys", icon: Key },
        { id: "reseller", label: "Reseller", icon: ShoppingBag },
        { id: "sales", label: "Sales", icon: TrendingUp },
        { id: "support", label: "Support", icon: HeadphonesIcon },
      ]
    },
    {
      title: "Finance & Performance",
      items: [
        { id: "wallet-finance", label: "Finance", icon: DollarSign },
        { id: "performance-ai", label: "Performance", icon: Gauge },
        { id: "ai-management", label: "AI Management", icon: Brain },
      ]
    },
    {
      title: "Marketing & Growth",
      items: [
        { id: "seo", label: "SEO", icon: Search },
        { id: "marketing", label: "Marketing", icon: Megaphone },
        { id: "influencer", label: "Influencer", icon: Star },
      ]
    },
    {
      title: "Product & Innovation",
      items: [
        { id: "demo-product", label: "Product/Demo", icon: Monitor },
        { id: "rnd", label: "R&D", icon: Lightbulb },
        { id: "server-management", label: "Servers", icon: Server },
      ]
    },
    {
      title: "People & Legal",
      items: [
        { id: "client-success", label: "Client Success", icon: Heart },
        { id: "prime-users", label: "Prime Users", icon: Crown },
        { id: "hr", label: "HR", icon: Briefcase },
        { id: "compliance", label: "Compliance", icon: Scale },
        { id: "legal", label: "Legal", icon: FileText },
      ]
    },
    {
      title: "Security & System",
      items: [
        { id: "approval-queue", label: "Approvals Hub", icon: Shield },
        { id: "force-logout", label: "Force Logout", icon: UserX },
        { id: "2fa-settings", label: "2FA & Security", icon: KeyRound },
        { id: "roles", label: "Role Access", icon: Shield },
        { id: "users", label: "User Mgmt", icon: Users },
        { id: "security", label: "Security", icon: Lock },
        { id: "emergency", label: "Emergency", icon: Bell },
        { id: "health", label: "System Health", icon: Activity },
        { id: "activity", label: "Activity Log", icon: BarChart3 },
        { id: "metrics", label: "Global Metrics", icon: Brain },
        { id: "settings", label: "Settings", icon: Settings },
      ]
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-card/50 backdrop-blur-xl border-r border-white/10 flex flex-col z-40">
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
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
      <ScrollArea className="flex-1">
        <nav className="p-3">
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title} className={sectionIndex > 0 ? "mt-4" : ""}>
              <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeView === item.id;
                  return (
                    <motion.button
                      key={item.id}
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
                          layoutId="activeIndicator"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
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
            onClick={() => onViewChange("settings")}
          >
            <KeyRound className="w-3 h-3" />
            Password
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs gap-1.5 h-8"
            onClick={() => onViewChange("settings")}
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
