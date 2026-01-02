import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Users, UserCog, Shield, Globe, Box, 
  Key, FileText, CheckCircle, AlertTriangle, Lock, Activity,
  Eye, LogOut, ChevronLeft, ChevronRight, Bell, Timer,
  AlertCircle, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SuperAdminWireframeLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  activeSection?: string;
  rightPanelContent?: React.ReactNode;
  rightPanelOpen?: boolean;
  onRightPanelClose?: () => void;
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/super-admin-system/dashboard" },
  { id: "users", label: "Users", icon: Users, path: "/super-admin-system/users" },
  { id: "admins", label: "Admins", icon: UserCog, path: "/super-admin-system/admins" },
  { id: "roles", label: "Roles & Permissions", icon: Shield, path: "/super-admin-system/roles" },
  { id: "geography", label: "Geography", icon: Globe, path: "/super-admin-system/geography" },
  { id: "modules", label: "Modules", icon: Box, path: "/super-admin-system/modules" },
  { id: "rentals", label: "Rentals", icon: Key, path: "/super-admin-system/rentals" },
  { id: "rules", label: "Rules", icon: FileText, path: "/super-admin-system/rules" },
  { id: "approvals", label: "Approvals", icon: CheckCircle, path: "/super-admin-system/approvals" },
  { id: "security", label: "Security", icon: AlertTriangle, path: "/super-admin-system/security" },
  { id: "system-lock", label: "System Lock", icon: Lock, path: "/super-admin-system/locks" },
  { id: "activity-log", label: "Activity Log", icon: Activity, path: "/super-admin-system/activity-log" },
  { id: "audit", label: "Audit (Read Only)", icon: Eye, path: "/super-admin-system/audit" },
];

const SuperAdminWireframeLayout = ({
  children,
  title,
  subtitle,
  activeSection,
  rightPanelContent,
  rightPanelOpen = false,
  onRightPanelClose,
}: SuperAdminWireframeLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("low");
  const [liveAlerts, setLiveAlerts] = useState(3);

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Session ended securely");
      navigate("/super-admin-system/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const getCurrentSection = () => {
    const path = location.pathname;
    const item = sidebarItems.find(i => i.path === path);
    return item?.id || "dashboard";
  };

  const riskColors = {
    low: "bg-neon-green/20 text-neon-green border-neon-green/50",
    medium: "bg-neon-orange/20 text-neon-orange border-neon-orange/50",
    high: "bg-neon-red/20 text-neon-red border-neon-red/50",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* TOP BAR */}
      <header className="h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-6 z-50">
        {/* Left - Scope */}
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-sapphire/20 border-sapphire text-foreground font-mono">
            <Globe className="w-3 h-3 mr-1" />
            GLOBAL SCOPE
          </Badge>
          <Badge variant="outline" className="text-muted-foreground">
            Africa / Nigeria
          </Badge>
        </div>

        {/* Center - Status */}
        <div className="flex items-center gap-6">
          {/* Live Alerts */}
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-neon-orange animate-pulse" />
            <span className="text-sm font-mono text-neon-orange">{liveAlerts} Live Alerts</span>
          </div>

          {/* Risk Indicator */}
          <Badge className={cn("font-mono uppercase", riskColors[riskLevel])}>
            <AlertCircle className="w-3 h-3 mr-1" />
            Risk: {riskLevel}
          </Badge>

          {/* Session Timer */}
          <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg">
            <Timer className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-foreground">{formatTime(sessionTime)}</span>
          </div>
        </div>

        {/* Right - Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">Super Admin</p>
            <p className="text-xs text-muted-foreground font-mono">SA-XXXX-001</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR */}
        <motion.aside
          initial={false}
          animate={{ width: collapsed ? 72 : 260 }}
          className="bg-sidebar border-r border-sidebar-border flex flex-col"
        >
          {/* Collapse Toggle */}
          <div className="p-3 border-b border-sidebar-border flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="hover:bg-sidebar-accent"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {sidebarItems.map((item) => {
                const isActive = getCurrentSection() === item.id;
                const Icon = item.icon;

                return (
                  <Tooltip key={item.id} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => navigate(item.path)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-sidebar-primary/10 text-sidebar-primary border-l-2 border-sidebar-primary"
                            : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-sm font-medium truncate"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" sideOffset={10}>
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Logout */}
          <div className="p-3 border-t border-sidebar-border">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className={cn(
                    "w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10",
                    collapsed && "justify-center px-0"
                  )}
                >
                  <LogOut className="w-5 h-5" />
                  {!collapsed && <span>Logout</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" sideOffset={10}>
                  Logout
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </motion.aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {(title || subtitle) && (
              <div className="mb-6">
                {title && <h1 className="text-2xl font-bold">{title}</h1>}
                {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
              </div>
            )}
            {children}
          </div>
        </main>

        {/* RIGHT SLIDE PANEL */}
        <AnimatePresence>
          {rightPanelOpen && rightPanelContent && (
            <motion.aside
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-[400px] bg-card border-l border-border flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold">Details Panel</h3>
                <Button variant="ghost" size="icon" onClick={onRightPanelClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4">
                {rightPanelContent}
              </ScrollArea>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <footer className="h-12 bg-card/80 backdrop-blur-xl border-t border-border/50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground font-mono">
            Scope: Global → Africa → Nigeria
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">
            Session ID: <span className="font-mono text-foreground">SES-{Date.now().toString(36).toUpperCase()}</span>
          </span>
          <Badge variant="outline" className="text-neon-green border-neon-green/50 text-xs">
            Secure Connection
          </Badge>
        </div>
      </footer>
    </div>
  );
};

export default SuperAdminWireframeLayout;
