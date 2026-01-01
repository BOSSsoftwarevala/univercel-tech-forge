import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Globe2, Bell, Timer, AlertCircle, Shield, Bot, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SafeAssistTrigger } from "@/components/support/SafeAssistTrigger";
import promiseIcon from "@/assets/promise-icon.jpg";

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
import FinanceManagerDashboard from "./FinanceManagerDashboard";
import DeveloperManagementDashboard from "./DeveloperManagementDashboard";
import MarketingManagementDashboard from "./MarketingManagementDashboard";
import CustomerSupportManagementDashboard from "./CustomerSupportManagementDashboard";
import RoleManagerDashboard from "./RoleManagerDashboard";
import MasterAdminDashboard from "./MasterAdminDashboard";
import SuperAdminHierarchyDashboard from "./SuperAdminHierarchyDashboard";
import CountryHeadDashboard from "./CountryHeadDashboard";
import ProductManagerDashboard from "./ProductManagerDashboard";

const RoleSwitchDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const requestedRole = useMemo(() => {
    const role = new URLSearchParams(location.search).get("role") as ActiveRole | null;
    return role && role in roleConfigs ? role : null;
  }, [location.search]);

  const [activeRole, setActiveRole] = useState<ActiveRole>("continent_super_admin");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [selectedSubItem, setSelectedSubItem] = useState<string | undefined>(undefined);
  const [collapsed, setCollapsed] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [riskLevel] = useState<"low" | "medium" | "high">("low");
  const [liveAlerts] = useState(3);
  const [promiseState, setPromiseState] = useState<'idle' | 'pending' | 'active'>('idle');

  const handlePromiseClick = useCallback(() => {
    if (promiseState === 'idle') {
      setPromiseState('pending');
      toast.success('Promise mode activated');
    } else if (promiseState === 'pending') {
      setPromiseState('active');
      toast.success('Task is now active');
    } else {
      setPromiseState('idle');
      toast.info('Promise mode deactivated');
    }
  }, [promiseState]);

  const handleChatbotClick = useCallback(() => {
    toast.success('AI Assistant Ready', {
      description: 'How can I help you today?'
    });
  }, []);

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
    setActiveNav("dashboard"); // Reset nav when role changes
    toast.success(`Switched to ${roleConfigs[role].label} view`);
  };

  const handleNavChange = (navId: string) => {
    setActiveNav(navId);
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
      case "master_admin":
        return <MasterAdminDashboard />;
      case "super_admin_hierarchy":
        return <SuperAdminHierarchyDashboard />;
      case "continent_super_admin":
        return <ContinentSuperAdminView activeNav={activeNav} selectedSubItem={selectedSubItem} />;
      case "country_head":
        return <CountryHeadDashboard />;
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
      case "finance_manager":
        return <FinanceManagerDashboard />;
      case "developer_management":
        return <DeveloperManagementDashboard />;
      case "marketing_management":
        return <MarketingManagementDashboard />;
      case "customer_support_management":
        return <CustomerSupportManagementDashboard />;
      case "role_manager":
        return <RoleManagerDashboard />;
      case "product_manager":
        return <ProductManagerDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col transition-colors duration-300",
      activeRole === "master_admin" ? "bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-900" :
      activeRole === "super_admin_hierarchy" ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950" :
      activeRole === "country_head" ? "bg-gradient-to-br from-orange-950/20 via-background to-amber-950/20" :
      activeRole === "server_manager" || activeRole === "developer_management" ? "bg-zinc-950" : 
      activeRole === "marketing_management" ? "bg-gradient-to-br from-pink-950/20 via-background to-rose-950/20" :
      activeRole === "customer_support_management" ? "bg-gradient-to-br from-blue-950/20 via-background to-indigo-950/20" :
      activeRole === "role_manager" ? "bg-gradient-to-br from-violet-950/20 via-background to-purple-950/20" :
      activeRole === "product_manager" ? "bg-gradient-to-br from-indigo-950/20 via-background to-violet-950/20" : "bg-background"
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

        {/* Right - Action Buttons & Profile */}
        <div className="flex items-center gap-3">
          {/* Promise Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePromiseClick}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all shadow-md",
              promiseState === 'active'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border border-green-400/50'
                : promiseState === 'pending'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border border-amber-400/50 animate-pulse'
                : 'bg-secondary/80 text-foreground border border-border/50 hover:border-primary/50'
            )}
          >
            <img src={promiseIcon} alt="Promise" className="w-5 h-5 rounded-full object-cover" />
            <span className="hidden lg:inline">
              {promiseState === 'active' ? 'Active' : promiseState === 'pending' ? 'Promise' : 'No Task'}
            </span>
          </motion.button>

          {/* Safe Assist Button */}
          <SafeAssistTrigger variant="compact" />

          {/* AI Chatbot Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleChatbotClick}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium text-sm shadow-lg border border-purple-400/30"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden lg:inline">AI Chat</span>
          </motion.button>

          {/* Alerts Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all shadow-md",
              liveAlerts > 0
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white border border-red-400/50"
                : "bg-secondary/80 text-foreground border border-border/50"
            )}
          >
            <Bell className="w-4 h-4" />
            <span className="hidden lg:inline">Alerts</span>
            {liveAlerts > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-red-600 text-xs rounded-full flex items-center justify-center font-bold shadow-md">
                {liveAlerts}
              </span>
            )}
          </motion.button>

          {/* Internal Chat */}
          <Button variant="ghost" size="icon" onClick={() => navigate('/internal-chat')}>
            <MessageSquare className="w-5 h-5" />
          </Button>

          {/* Profile */}
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">Boss</p>
            <p className="text-xs text-muted-foreground font-mono">BO-XXXX-001</p>
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
          activeNav={activeNav}
          onNavChange={handleNavChange}
          onSubItemClick={(subItemId) => setSelectedSubItem(subItemId)}
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
