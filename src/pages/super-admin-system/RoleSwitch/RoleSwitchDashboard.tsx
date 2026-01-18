import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Globe2, Timer, AlertCircle, Shield, Home, ArrowLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { RouteNotFoundScreen, LoadingSkeleton } from "@/components/shared/RouteLoadingFallback";
import GlobalHeaderActions from "@/components/shared/GlobalHeaderActions";
import ModuleBreadcrumb from "@/components/shared/ModuleBreadcrumb";
// Sidebar visibility store for single-sidebar enforcement
import { useSidebarStore } from "@/stores/sidebarStore";

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
import ValaAIDashboard from "./ValaAIDashboard";
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
  const [initialized, setInitialized] = useState(false);
  const [navHistory, setNavHistory] = useState<string[]>(['dashboard']);

  // STEP 8: Derive user role for header actions
  const getHeaderRole = useCallback((): 'boss' | 'employee' | 'client' | 'super_admin' | 'manager' => {
    if (isBossOwner || activeRole === 'boss_owner') return 'boss';
    if (activeRole === 'ceo' || activeRole === 'continent_super_admin') return 'super_admin';
    if (activeRole === 'server_manager' || activeRole === 'developer_management') return 'manager';
    return 'employee';
  }, [isBossOwner, activeRole]);

  // STEP 9: Module view detection - determines if we're inside a full-screen module
  const moduleViewIds = useMemo(() => ['server-control', 'dev-control', 'product-demo', 'leads', 'marketing'], []);
  const isInModuleView = activeRole === 'boss_owner' && moduleViewIds.includes(activeNav);
  
  // SINGLE SIDEBAR ENFORCEMENT: Use sidebar store for visibility control
  const { showGlobalSidebar, enterCategory, activeSidebar, exitToGlobal } = useSidebarStore();
  
  // Sync sidebar visibility with module view state
  useEffect(() => {
    if (isInModuleView) {
      // Map activeNav to category sidebar ID
      const categoryMap: Record<string, 'server-manager' | 'dev-control' | 'product-demo' | 'lead-manager' | 'marketing'> = {
        'server-control': 'server-manager',
        'dev-control': 'dev-control',
        'product-demo': 'product-demo',
        'leads': 'lead-manager',
        'marketing': 'marketing',
      };
      const categoryId = categoryMap[activeNav];
      if (categoryId) {
        enterCategory(categoryId);
      }
    } else {
      showGlobalSidebar();
    }
  }, [isInModuleView, activeNav, showGlobalSidebar, enterCategory]);
  
  // Check if global sidebar should be visible (from store)
  const shouldShowGlobalSidebar = activeSidebar === 'global' && !isInModuleView;

  // STEP 9: Navigation labels for breadcrumb
  const navLabels: Record<string, string> = useMemo(() => ({
    'dashboard': 'Dashboard',
    'server-control': 'Server Control',
    'dev-control': 'Development',
    'product-demo': 'Product Demo',
    'leads': 'Lead Management',
    'marketing': 'Marketing',
    'approvals': 'Approvals',
    'franchise-control': 'Franchise Control',
    'reseller-control': 'Reseller Control',
    'finance': 'Finance',
    'support-overview': 'Support',
    'security': 'Security',
    'settings': 'Settings',
  }), []);

  // STEP 9: Build breadcrumb items
  const breadcrumbItems = useMemo(() => {
    const items: { label: string; onClick?: () => void; isActive?: boolean }[] = [];
    
    // Add role as first item if not boss_owner
    if (activeRole !== 'boss_owner') {
      items.push({
        label: roleConfigs[activeRole]?.label || activeRole,
        isActive: activeNav === 'dashboard',
        onClick: activeNav !== 'dashboard' ? () => {
          setActiveNav('dashboard');
          setSelectedSubItem(undefined);
        } : undefined
      });
    } else {
      items.push({
        label: 'Boss Dashboard',
        isActive: activeNav === 'dashboard' && !isInModuleView,
        onClick: activeNav !== 'dashboard' ? () => {
          setActiveNav('dashboard');
          setSelectedSubItem(undefined);
          setNavHistory(['dashboard']);
        } : undefined
      });
    }
    
    // Add current nav if not dashboard
    if (activeNav !== 'dashboard') {
      items.push({
        label: navLabels[activeNav] || activeNav.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        isActive: !selectedSubItem,
        onClick: selectedSubItem ? () => setSelectedSubItem(undefined) : undefined
      });
    }
    
    // Add sub-item if exists
    if (selectedSubItem) {
      items.push({
        label: selectedSubItem.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        isActive: true
      });
    }
    
    return items;
  }, [activeRole, activeNav, selectedSubItem, isInModuleView, navLabels]);

  // STEP 9: Handle back navigation
  const handleBack = useCallback(() => {
    if (selectedSubItem) {
      setSelectedSubItem(undefined);
    } else if (activeNav !== 'dashboard') {
      setActiveNav('dashboard');
      setSelectedSubItem(undefined);
    }
  }, [selectedSubItem, activeNav]);

  // STEP 9: Handle home navigation - always returns to Boss Dashboard
  const handleHome = useCallback(() => {
    if (activeRole !== 'boss_owner') {
      setActiveRole('boss_owner');
    }
    setActiveNav('dashboard');
    setSelectedSubItem(undefined);
    setNavHistory(['dashboard']);
    toast.success('Returned to Boss Dashboard');
  }, [activeRole]);

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

  // STEP 6: Enhanced role change with full state reset
  const handleRoleChange = useCallback((role: ActiveRole) => {
    // Check if user can access this view
    if (!canAccessView(role)) {
      toast.error("Access denied to this view");
      return;
    }
    // Full state reset on role switch to prevent data bleed
    setActiveRole(role);
    setActiveNav("dashboard");
    setSelectedSubItem(undefined);
    
    // Clear URL nav param if any
    const url = new URL(window.location.href);
    if (url.searchParams.has('nav')) {
      url.searchParams.delete('nav');
      window.history.replaceState({}, '', url.toString());
    }
    
    toast.success(`Switched to ${roleConfigs[role].label} view`);
  }, [canAccessView]);

  const handleNavChange = useCallback((navId: string) => {
    setActiveNav(navId);
    setSelectedSubItem(undefined); // Reset sub-item on nav change
  }, []);
  
  // Listen for popstate events to handle back navigation from modules
  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href);
      const navParam = url.searchParams.get('nav');
      if (!navParam) {
        // No nav param means we're back to dashboard
        setActiveNav('dashboard');
        setSelectedSubItem(undefined);
      } else {
        setActiveNav(navParam);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const currentConfig = roleConfigs[activeRole];

  // STEP 6: Show loading screen while initializing to prevent blank page
  if (loading || !initialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSkeleton message="Initializing dashboard..." />
      </div>
    );
  }

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
      case "vala_ai_management":
        return <ValaAIDashboard />;
      case "marketing_management":
        return <MarketingManagementDashboard />;
      case "customer_support_management":
        return <CustomerSupportManagementDashboard />;
      case "role_manager":
        return <RoleManagerDashboard />;
      case "product_manager":
        return <ProductManagerDashboard />;
      default:
        // STEP 6: Use shared fallback component to prevent blank screens
        return (
          <RouteNotFoundScreen 
            attemptedRoute={`Role: ${activeRole}`}
            onGoBack={() => {
              setActiveRole('boss_owner');
              setActiveNav('dashboard');
            }}
          />
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
        {/* Left - Role Identity + Breadcrumb */}
        <div className="flex items-center gap-4">
          {/* Home Button - STEP 9: Always returns to Boss Dashboard */}
          {(activeNav !== 'dashboard' || activeRole !== 'boss_owner') && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHome}
              className="w-9 h-9 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all group"
              title="Return to Boss Dashboard"
            >
              <Home className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </motion.button>
          )}
          
          {/* Back Button - STEP 9: Returns to previous view */}
          {(activeNav !== 'dashboard' || selectedSubItem) && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBack}
              className="w-9 h-9 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all group"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </motion.button>
          )}
          
          {/* Divider */}
          {(activeNav !== 'dashboard' || activeRole !== 'boss_owner') && (
            <div className="w-px h-8 bg-border/30" />
          )}
          
          {/* Role Icon */}
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg",
            currentConfig.themeColor
          )}>
            <currentConfig.icon className="w-5 h-5 text-white" />
          </div>
          
          {/* Breadcrumb Trail - STEP 9: Shows navigation path */}
          <nav className="flex items-center gap-1">
            {breadcrumbItems.map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                )}
                <motion.button
                  whileHover={!item.isActive ? { scale: 1.02 } : undefined}
                  onClick={item.onClick}
                  disabled={item.isActive || !item.onClick}
                  className={cn(
                    "px-2 py-1 rounded-md text-sm transition-all",
                    item.isActive
                      ? "font-semibold text-foreground cursor-default"
                      : item.onClick
                      ? "text-muted-foreground hover:text-foreground hover:bg-secondary/50 cursor-pointer"
                      : "text-muted-foreground cursor-default"
                  )}
                >
                  {item.label}
                </motion.button>
              </div>
            ))}
          </nav>
          
          {/* Scope Badge */}
          <Badge variant="outline" className={cn("ml-2", currentConfig.accentColor, currentConfig.borderAccent)}>
            <Globe2 className="w-3 h-3 mr-1" />
            {isInModuleView ? navLabels[activeNav]?.toUpperCase() || 'MODULE' : 'GLOBAL SCOPE'}
          </Badge>
        </div>

        {/* Center - Status Icons (Icon-Only) */}
        <div className="flex items-center gap-3">
          {/* System Status */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              toast.success('System Status: Healthy', {
                description: 'All services operational. Last check: 1 minute ago',
              });
            }}
            className="relative w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center cursor-pointer group"
            title="System Healthy"
          >
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
            {/* Tooltip */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              System Healthy
            </div>
          </motion.button>

          {/* Risk Level */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              toast.info(`Risk Level: ${riskLevel.toUpperCase()}`, {
                description: riskLevel === 'low' 
                  ? 'No immediate threats detected' 
                  : riskLevel === 'medium' 
                    ? 'Some activities require attention' 
                    : 'Critical issues need immediate attention',
              });
            }}
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
          </motion.button>

          {/* Session Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Timer className={cn("w-4 h-4", currentConfig.accentColor)} />
            <span className="text-sm font-mono text-foreground">{formatTime(sessionTime)}</span>
          </div>
        </div>

        {/* Right - STEP 8: Global Header Actions with role-based visibility */}
        <GlobalHeaderActions
          userRole={getHeaderRole()}
          onLogout={handleLogout}
          profileGradient={currentConfig.themeColor}
          taskCount={2}
          alertCount={liveAlerts}
          chatUnread={5}
        />
      </header>
      
      {/* STEP 9: Main Content Area - Single Active View Only */}
      <div className="flex-1 flex overflow-hidden">
        {/* Role Switch Sidebar - SINGLE SIDEBAR ENFORCEMENT: Only show when not in module view */}
        <AnimatePresence mode="wait">
          {shouldShowGlobalSidebar && (
            <motion.div
              key="global-sidebar"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Role View - STEP 9: Content area = 100% width of active module */}
        <main className={cn(
          "flex-1 overflow-auto transition-all duration-300",
          isInModuleView ? "w-full" : ""
        )} style={{ minHeight: 0, height: '100%' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeRole}-${activeNav}-${selectedSubItem || 'main'}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full min-h-full"
              style={{ height: '100%', minHeight: '100%' }}
            >
              <ErrorBoundary
                onError={(error) => {
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
                        <Button onClick={handleHome}>
                          Back to Boss Dashboard
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
