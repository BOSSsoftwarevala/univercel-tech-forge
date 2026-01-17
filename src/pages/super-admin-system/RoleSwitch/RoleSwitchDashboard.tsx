import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Globe2, Bell, Timer, AlertCircle, Shield, Bot, MessageSquare, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SafeAssistTrigger } from "@/components/support/SafeAssistTrigger";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import promiseIcon from "@/assets/promise-icon.jpg";

import RoleSwitchSidebar, { ActiveRole, roleConfigs } from "@/components/super-admin-wireframe/RoleSwitchSidebar";
import ContinentSuperAdminView from "./ContinentSuperAdminView";
// AreaManagerView removed - merged into CountryHeadDashboard
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
import CountryHeadDashboard from "./CountryHeadDashboard";
import ProductManagerDashboard from "./ProductManagerDashboard";
import CEODashboard from "./CEODashboard";
import BossOwnerDashboard from "./BossOwnerDashboard";
// Admin role deprecated - functionality merged into Boss/Owner and Super Admin

// Define which roles can switch to which views
const ROLE_VIEW_ACCESS: Record<string, ActiveRole[]> = {
  boss_owner: Object.keys(roleConfigs) as ActiveRole[], // Boss Owner can view everything
  master: Object.keys(roleConfigs) as ActiveRole[], // Legacy master role
  ceo: Object.keys(roleConfigs) as ActiveRole[], // CEO can view everything (read-only)
  super_admin: ['continent_super_admin', 'country_head', 'franchise_manager', 'sales_support_manager', 'reseller_manager', 'lead_manager'],
  continent_super_admin: ['continent_super_admin', 'country_head'],
  country_head: ['country_head'],
};

const RoleSwitchDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, isBossOwner, loading } = useAuth();

  const requestedRole = useMemo(() => {
    const role = new URLSearchParams(location.search).get("role") as ActiveRole | null;
    return role && role in roleConfigs ? role : null;
  }, [location.search]);

  // Determine default role based on user's actual role
  const getDefaultRole = useCallback((): ActiveRole => {
    if (isBossOwner) return "boss_owner";
    if (userRole === 'master') return "boss_owner";
    if (userRole === 'super_admin') return "continent_super_admin";
    if (userRole === 'area_manager') return "country_head";
    if (userRole === 'server_manager') return "server_manager";
    if (userRole === 'finance_manager') return "finance_manager";
    if (userRole === 'lead_manager') return "lead_manager";
    if (userRole === 'legal_compliance') return "legal_manager";
    return "continent_super_admin";
  }, [userRole, isBossOwner]);

  // Check if user can access a specific view
  const canAccessView = useCallback((viewRole: ActiveRole): boolean => {
    if (isBossOwner) return true;
    if (userRole === 'ceo') return true; // CEO can view all (read-only)
    const allowedViews = ROLE_VIEW_ACCESS[userRole || ''] || [];
    return allowedViews.includes(viewRole);
  }, [userRole, isBossOwner]);

  const [activeRole, setActiveRole] = useState<ActiveRole>("continent_super_admin");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [selectedSubItem, setSelectedSubItem] = useState<string | undefined>(undefined);
  const [collapsed, setCollapsed] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [riskLevel] = useState<"low" | "medium" | "high">("low");
  const [liveAlerts] = useState(3);
  const [promiseState, setPromiseState] = useState<'idle' | 'pending' | 'active'>('idle');
  const [initialized, setInitialized] = useState(false);
  
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

  // Initialize role based on URL or user's actual role
  const didInitRef = useRef(false);
  const prevRequestedRoleRef = useRef<ActiveRole | null>(null);

  useEffect(() => {
    if (loading) return;

    // 1) If URL requests a role, always sync to it (if access allows)
    if (requestedRole && requestedRole !== prevRequestedRoleRef.current) {
      prevRequestedRoleRef.current = requestedRole;

      if (canAccessView(requestedRole)) {
        setActiveRole(requestedRole);
        setActiveNav("dashboard");
        setSelectedSubItem(undefined);
      } else {
        const defaultRole = getDefaultRole();
        setActiveRole(defaultRole);
        setActiveNav("dashboard");
        setSelectedSubItem(undefined);
        toast.error("Access denied to requested view", {
          description: `Redirecting to ${roleConfigs[defaultRole]?.label || "default"} view`,
        });
      }

      didInitRef.current = true;
      setInitialized(true);
      return;
    }

    // 2) First mount with no requested role -> set default once
    if (!didInitRef.current && !requestedRole) {
      setActiveRole(getDefaultRole());
      didInitRef.current = true;
      setInitialized(true);
    }
  }, [requestedRole, loading, canAccessView, getDefaultRole]);

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
    // Check if user can access this view
    if (!canAccessView(role)) {
      toast.error("Access denied to this view");
      return;
    }
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
      case "boss_owner":
        return <BossOwnerDashboard activeNav={activeNav} />;
      case "ceo":
        return <CEODashboard activeNav={activeNav} />;
      case "continent_super_admin":
        return <ContinentSuperAdminView activeNav={activeNav} selectedSubItem={selectedSubItem} />;
      case "country_head":
        return <CountryHeadDashboard />;
      case "server_manager":
        return <ServerManagerView activeNav={activeNav} />;
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
        // Fallback to prevent blank screen - use proper error UI
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center p-8 bg-card/50 rounded-xl border border-border/50">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Dashboard Unavailable</h2>
              <p className="text-muted-foreground mb-4">This role view is not configured or not available.</p>
              <p className="text-xs text-muted-foreground">Error Code: 404-ROLE-VIEW-NOT-FOUND</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col transition-colors duration-300",
      activeRole === "boss_owner" ? "bg-gradient-to-br from-amber-950/30 via-zinc-950 to-orange-950/20" :
      activeRole === "ceo" ? "bg-gradient-to-br from-emerald-950/20 via-background to-teal-950/20" :
      activeRole === "country_head" ? "bg-gradient-to-br from-orange-950/20 via-background to-amber-950/20" :
      activeRole === "server_manager" || activeRole === "developer_management" ? "bg-zinc-950" : 
      activeRole === "marketing_management" ? "bg-gradient-to-br from-pink-950/20 via-background to-rose-950/20" :
      activeRole === "customer_support_management" ? "bg-gradient-to-br from-blue-950/20 via-background to-indigo-950/20" :
      activeRole === "role_manager" ? "bg-gradient-to-br from-violet-950/20 via-background to-purple-950/20" :
      activeRole === "product_manager" ? "bg-gradient-to-br from-indigo-950/20 via-background to-violet-950/20" : "bg-background"
    )}>
      {/* TOP BAR - Icon-Only Enterprise Header */}
      <header className={cn(
        "h-16 backdrop-blur-xl border-b flex items-center justify-between px-6 z-50 transition-colors duration-300",
        "bg-gradient-to-r from-[#0d0d14] via-[#12121a] to-[#0d0d14] border-amber-500/20"
      )}>
        {/* Left - Current Role Identity */}
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg",
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

        {/* Center - Status Icons (Icon-Only) */}
        <div className="flex items-center gap-3">
          {/* System Status */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center cursor-pointer group"
            title="System Healthy"
          >
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
            {/* Tooltip */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              System Healthy
            </div>
          </motion.div>

          {/* Risk Level */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={cn(
              "relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer group border",
              riskLevel === 'low' ? "bg-emerald-500/10 border-emerald-500/20" :
              riskLevel === 'medium' ? "bg-amber-500/10 border-amber-500/20" :
              "bg-red-500/10 border-red-500/20"
            )}
            title={`Risk: ${riskLevel}`}
          >
            <AlertCircle className={cn(
              "w-5 h-5",
              riskLevel === 'low' ? "text-emerald-400" :
              riskLevel === 'medium' ? "text-amber-400" :
              "text-red-400"
            )} />
            {/* Tooltip */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              Risk: {riskLevel.toUpperCase()}
            </div>
          </motion.div>

          {/* Session Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Timer className={cn("w-4 h-4", currentConfig.accentColor)} />
            <span className="text-sm font-mono text-foreground">{formatTime(sessionTime)}</span>
          </div>
        </div>

        {/* Right - Action Icons (Icon-Only, Same Size) */}
        <div className="flex items-center gap-3">
          {/* Promise/Task Icon */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePromiseClick}
            className={cn(
              "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md group",
              promiseState === 'active'
                ? 'bg-gradient-to-br from-green-600 to-emerald-600 border border-green-400/50'
                : promiseState === 'pending'
                ? 'bg-gradient-to-br from-amber-500 to-orange-500 border border-amber-400/50 animate-pulse'
                : 'bg-secondary/80 border border-border/50 hover:border-primary/50'
            )}
            title={promiseState === 'active' ? 'Task Active' : promiseState === 'pending' ? 'Task Pending' : 'No Tasks'}
          >
            <img src={promiseIcon} alt="Promise" className="w-5 h-5 rounded-full object-cover" />
            {promiseState !== 'idle' && (
              <span className={cn(
                "absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center",
                promiseState === 'active' ? "bg-green-400 text-green-900" : "bg-amber-400 text-amber-900"
              )}>
                1
              </span>
            )}
            {/* Tooltip */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              {promiseState === 'active' ? 'Task Active' : promiseState === 'pending' ? 'Task Pending' : 'Tasks'}
            </div>
          </motion.button>

          {/* Safe Assist Icon */}
          <SafeAssistTrigger variant="compact" />

          {/* AI Assistant Icon */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleChatbotClick}
            className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg border border-purple-400/30 group"
            title="AI Assistant"
          >
            <Bot className="w-5 h-5 text-white" />
            {/* Tooltip */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              AI Assistant
            </div>
          </motion.button>

          {/* Alerts Icon */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md group",
              liveAlerts > 0
                ? "bg-gradient-to-br from-red-600 to-rose-600 border border-red-400/50"
                : "bg-secondary/80 border border-border/50"
            )}
            title={liveAlerts > 0 ? `${liveAlerts} Alerts` : 'No Alerts'}
          >
            <Bell className={cn("w-5 h-5", liveAlerts > 0 ? "text-white" : "text-muted-foreground")} />
            {liveAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-red-600 text-xs rounded-full flex items-center justify-center font-bold shadow-md">
                {liveAlerts}
              </span>
            )}
            {/* Tooltip */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              {liveAlerts > 0 ? `${liveAlerts} Alerts` : 'Alerts'}
            </div>
          </motion.button>

          {/* Internal Chat Icon */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/internal-chat')}
            className="relative w-10 h-10 rounded-xl bg-secondary/80 border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all group"
            title="Internal Chat"
          >
            <MessageSquare className="w-5 h-5 text-muted-foreground" />
            {/* Tooltip */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              Internal Chat
            </div>
          </motion.button>

          {/* Divider */}
          <div className="w-px h-8 bg-border/50" />

          {/* Profile Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br cursor-pointer shadow-lg group",
              currentConfig.themeColor
            )}
            title="Profile"
          >
            <Shield className="w-5 h-5 text-white" />
            {/* Tooltip */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              Profile
            </div>
          </motion.div>
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
              <ErrorBoundary
                onError={(error) => {
                  // Never allow a crash to become a blank screen
                  console.error("Role dashboard crashed", { role: activeRole, error });
                  toast.error("Dashboard failed to load", {
                    description: "Something went wrong while opening this role.",
                  });
                }}
                fallback={
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center p-8 bg-card/50 rounded-xl border border-border/50 max-w-md">
                      <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                      <p className="text-muted-foreground mb-6">This dashboard failed to render. You can retry or switch roles.</p>
                      <div className="flex items-center justify-center gap-3">
                        <Button variant="outline" onClick={() => window.location.reload()}>
                          Reload dashboard
                        </Button>
                        <Button onClick={() => navigate("/super-admin-system/role-switch", { replace: true })}>
                          Back to Role Switch
                        </Button>
                      </div>
                    </div>
                  </div>
                }
              >
                {renderRoleView()}
              </ErrorBoundary>
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
