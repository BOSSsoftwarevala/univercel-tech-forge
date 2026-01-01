import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Globe2, Bell, Timer, AlertCircle, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import RoleSwitchSidebar, { ActiveRole, roleConfigs } from "@/components/super-admin-wireframe/RoleSwitchSidebar";
import ContinentSuperAdminView from "./ContinentSuperAdminView";
import AreaManagerView from "./AreaManagerView";
import ServerManagerView from "./ServerManagerView";
import FranchiseManagerView from "./FranchiseManagerView";
import SalesSupportManagerView from "./SalesSupportManagerView";
import ResellerManagerView from "./ResellerManagerView";
import LeadManagerView from "./LeadManagerView";
import ProManagerView from "./ProManagerView";
import LegalManagerView from "./LegalManagerView";
import TaskManagementView from "./TaskManagementView";

const RoleSwitchDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const requestedRole = useMemo(() => {
    const role = new URLSearchParams(location.search).get("role") as ActiveRole | null;
    return role && role in roleConfigs ? role : null;
  }, [location.search]);

  const [activeRole, setActiveRole] = useState<ActiveRole>("continent_super_admin");
  const [collapsed, setCollapsed] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [riskLevel] = useState<"low" | "medium" | "high">("low");
  const [liveAlerts] = useState(3);

  // Apply role from URL (prevents accidental switching to legacy pages)
  useEffect(() => {
    if (requestedRole) setActiveRole(requestedRole);
  }, [requestedRole]);

  // Session timer (must never trigger navigation)
  useEffect(() => {
    const interval = window.setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(interval);
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

  const handleRoleChange = (role: ActiveRole) => {
    // NO REDIRECT - just switch the view in place
    setActiveRole(role);
    // Reset any role-specific state if needed
    toast.success(`Switched to ${roleConfigs[role].label} view`);
  };

  const currentConfig = roleConfigs[activeRole];

  const riskColors = {
    low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    high: "bg-red-500/20 text-red-400 border-red-500/50",
  };

  // Render the appropriate view based on active role
  const renderRoleView = () => {
    switch (activeRole) {
      case "continent_super_admin":
        return <ContinentSuperAdminView />;
      case "area_manager":
        return <AreaManagerView />;
      case "server_manager":
        return <ServerManagerView />;
      case "franchise_manager":
        return <FranchiseManagerView />;
      case "sales_support_manager":
        return <SalesSupportManagerView />;
      case "reseller_manager":
        return <ResellerManagerView />;
      case "lead_manager":
        return <LeadManagerView />;
      case "pro_manager":
        return <ProManagerView />;
      case "legal_manager":
        return <LegalManagerView />;
      case "task_management":
        return <TaskManagementView />;
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col transition-colors duration-300",
      activeRole === "server_manager" ? "bg-zinc-950" : "bg-background"
    )}>
      {/* TOP BAR */}
      <header className={cn(
        "h-16 backdrop-blur-xl border-b flex items-center justify-between px-6 z-50 transition-colors duration-300",
        activeRole === "server_manager" 
          ? "bg-zinc-900/80 border-zinc-700" 
          : "bg-card/80 border-border/50"
      )}>
        {/* Left - Current Role Badge */}
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br",
            currentConfig.themeColor
          )}>
            <currentConfig.icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">{currentConfig.label}</h1>
            <p className="text-xs text-muted-foreground">{currentConfig.description}</p>
          </div>
          <Badge variant="outline" className={cn("ml-4", currentConfig.accentColor, currentConfig.borderAccent)}>
            <Globe2 className="w-3 h-3 mr-1" />
            GLOBAL SCOPE
          </Badge>
        </div>

        {/* Center - Status */}
        <div className="flex items-center gap-6">
          {/* Live Alerts */}
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="text-sm font-mono text-orange-400">{liveAlerts} Live Alerts</span>
          </div>

          {/* Risk Indicator */}
          <Badge className={cn("font-mono uppercase", riskColors[riskLevel])}>
            <AlertCircle className="w-3 h-3 mr-1" />
            Risk: {riskLevel}
          </Badge>

          {/* Session Timer */}
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg",
            activeRole === "server_manager" ? "bg-zinc-800" : "bg-secondary/50"
          )}>
            <Timer className={cn("w-4 h-4", currentConfig.accentColor)} />
            <span className="text-sm font-mono text-foreground">{formatTime(sessionTime)}</span>
          </div>
        </div>

        {/* Right - Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">Super Admin</p>
            <p className="text-xs text-muted-foreground font-mono">SA-XXXX-001</p>
          </div>
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br",
            currentConfig.themeColor
          )}>
            <Shield className="w-5 h-5 text-white" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Role Switch Sidebar */}
        <RoleSwitchSidebar
          activeRole={activeRole}
          onRoleChange={handleRoleChange}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          onLogout={handleLogout}
        />

        {/* Dynamic Role View */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderRoleView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* FOOTER */}
      <footer className={cn(
        "h-12 backdrop-blur-xl border-t flex items-center justify-between px-6 transition-colors duration-300",
        activeRole === "server_manager" 
          ? "bg-zinc-900/80 border-zinc-700" 
          : "bg-card/80 border-border/50"
      )}>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground font-mono">
            View: <span className={currentConfig.accentColor}>{currentConfig.label}</span>
          </span>
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-xs text-muted-foreground font-mono">
            Scope: Global
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">
            Session ID: <span className="font-mono text-foreground">SES-{Date.now().toString(36).toUpperCase()}</span>
          </span>
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/50 text-xs">
            Secure Connection
          </Badge>
        </div>
      </footer>
    </div>
  );
};

export default RoleSwitchDashboard;
