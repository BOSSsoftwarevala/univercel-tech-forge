import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Globe2, Timer, AlertCircle, Shield, Home, ArrowLeft, ChevronRight, Crown } from "lucide-react";
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
import { ControlPanelSidebar } from "@/components/super-admin-wireframe/ControlPanelSidebar";
import { ControlPanelDashboard } from "@/components/super-admin-wireframe/ControlPanelDashboard";
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
import DemoManagerDashboard from "./DemoManagerDashboard";
import CEODashboard from "./CEODashboard";
import BossOwnerDashboard from "./BossOwnerDashboard";
import DeveloperManagementDashboard from "./DeveloperManagementDashboard";
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

const SessionTimerDisplay = ({ accentColor }: { accentColor: string }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
      <Timer className={cn("w-4 h-4", accentColor)} />
      <span className="text-sm font-mono text-foreground">{formatTime(seconds)}</span>
    </div>
  );
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

  const [activeRole, setActiveRole] = useState<ActiveRole | null>(null);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [selectedSubItem, setSelectedSubItem] = useState<string | undefined>(undefined);
  const [collapsed, setCollapsed] = useState(false);
  const [riskLevel] = useState<"low" | "medium" | "high">("low");
  const [liveAlerts] = useState(3);
  const [initialized, setInitialized] = useState(false);
  const [navHistory, setNavHistory] = useState<string[]>(['dashboard']);
  
  // NEW: Track if we're in Control Panel view (no role selected) vs Role Dashboard view
  const isInControlPanelView = activeRole === null;

  // STEP 8: Derive user role for header actions
  const getHeaderRole = useCallback((): 'boss' | 'employee' | 'client' | 'super_admin' | 'manager' => {
    if (isBossOwner || activeRole === 'boss_owner') return 'boss';
    if (activeRole === 'ceo' || activeRole === 'continent_super_admin') return 'super_admin';
    if (activeRole === 'server_manager' || activeRole === 'vala_ai_management') return 'manager';
    return 'employee';
  }, [isBossOwner, activeRole]);

  // STEP 9: Module view detection - determines if we're inside a full-screen module
  // GOLDEN RULE: Only ONE context active at a time (Boss OR Module, never both)
  // Extended module list for complete single-context enforcement
  const moduleViewIds = useMemo(() => [
    'server-control', 'vala-ai', 'product-demo', 'leads', 'marketing',
    'finance', 'franchise-control', 'reseller-control', 'sales-support',
    'legal', 'task-management', 'hr-manager'
  ], []);
  const isInModuleView = activeRole === 'boss_owner' && moduleViewIds.includes(activeNav);
  
  // SINGLE-CONTEXT ENFORCEMENT: Use sidebar store for context control
  const {
    showGlobalSidebar,
    enterCategory,
    exitToGlobal,
    categoryCollapsed,
    canTransition,
  } = useSidebarStore();
  
  // Category mapping for module navigation - ALL modules must be mapped
  const categoryMap: Record<string, 'server-manager' | 'vala-ai' | 'product-demo' | 'lead-manager' | 'marketing' | 'finance-manager' | 'franchise-manager' | 'reseller-manager' | 'sales-support' | 'legal' | 'task-management' | 'hr-manager'> = useMemo(() => ({
    'server-control': 'server-manager',
    'vala-ai': 'vala-ai',
    'product-demo': 'product-demo',
    'leads': 'lead-manager',
    'marketing': 'marketing',
    'finance': 'finance-manager',
    'franchise-control': 'franchise-manager',
    'reseller-control': 'reseller-manager',
    'sales-support': 'sales-support',
    'legal': 'legal',
    'task-management': 'task-management',
    'hr-manager': 'hr-manager',
  }), []);
  
  // CONTEXT SYNCHRONIZATION: Sync store state with module view state
  // This ensures the sidebar store always reflects the current view
  useEffect(() => {
    if (!canTransition()) return; // Prevent race conditions
    
    if (isInModuleView) {
      const categoryId = categoryMap[activeNav];
      if (categoryId) {
        // ENTER MODULE CONTEXT: Hide Boss sidebar, show Module sidebar
        enterCategory(categoryId);
      }
    } else {
      // EXIT TO BOSS CONTEXT: Hide Module sidebar, show Boss sidebar
      showGlobalSidebar();
    }
  }, [isInModuleView, activeNav, showGlobalSidebar, enterCategory, categoryMap, canTransition]);
  
  // VISIBILITY RULE: Global sidebar visible for ALL roles
  // UPDATED: Sidebar is always shown regardless of role for consistent UX
  // Sidebar is hidden only when in module view
  const shouldShowGlobalSidebar = !isInModuleView;

  // STEP 9: Navigation labels for breadcrumb
  const navLabels: Record<string, string> = useMemo(() => ({
    'dashboard': 'Dashboard',
    'server-control': 'Server Control',
    'vala-ai': 'VALA AI',
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

  // STEP 9: Handle home navigation - returns to Control Panel
  const handleHome = useCallback(() => {
    setActiveRole(null);
    setActiveNav('dashboard');
    setSelectedSubItem(undefined);
    setNavHistory(['dashboard']);
    toast.success('Returned to Control Panel');
  }, []);
  
  // Handle back to Control Panel from role dashboard
  const handleBackToControlPanel = useCallback(() => {
    setActiveRole(null);
    setActiveNav('dashboard');
    setSelectedSubItem(undefined);
    toast.info('Returned to Control Panel');
  }, []);

  // Initialize role based on URL or user's actual role
  const didInitRef = useRef(false);
  const prevRequestedRoleRef = useRef<ActiveRole | null>(null);

  useEffect(() => {
    if (loading) return;

    // 1) If URL requests a role, always sync to it (if access allows)
    // OVERRIDE (BOSS RULE): boss_owner & ceo should land on the Control Panel grid by default.
    // They can still open their role dashboard by clicking from the Control Panel sidebar.
    if (requestedRole && requestedRole !== prevRequestedRoleRef.current) {
      prevRequestedRoleRef.current = requestedRole;

      const shouldStartInControlPanel = requestedRole === 'boss_owner' || requestedRole === 'ceo';

      if (shouldStartInControlPanel) {
        setActiveRole(null);
        setActiveNav("dashboard");
        setSelectedSubItem(undefined);
      } else if (canAccessView(requestedRole)) {
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

    // 2) First mount with no requested role -> start at Control Panel (null)
    if (!didInitRef.current && !requestedRole) {
      setActiveRole(null); // Start at Control Panel
      didInitRef.current = true;
      setInitialized(true);
    }
  }, [requestedRole, loading, canAccessView, getDefaultRole]);




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

  // Get config for current role (null-safe for Control Panel view)
  const currentConfig = activeRole ? roleConfigs[activeRole] : {
    id: 'control_panel',
    label: 'Control Panel',
    shortLabel: 'CP',
    icon: Crown,
    themeColor: 'from-blue-600 via-blue-500 to-cyan-500',
    accentColor: 'text-blue-300',
    bgAccent: 'bg-blue-500/10',
    borderAccent: 'border-blue-500/50',
    description: 'System Control Center',
  };

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
      case "demo_manager":
        return <DemoManagerDashboard />;
      case "developer_management":
        return <DeveloperManagementDashboard />;
      case null:
        // Control Panel view - render 2×7 grid dashboard
        return <ControlPanelDashboard />;
      default:
        // STEP 6: Use shared fallback component to prevent blank screens
        return (
          <RouteNotFoundScreen 
            attemptedRoute={`Role: ${activeRole}`}
            onGoBack={() => {
              setActiveRole(null);
              setActiveNav('dashboard');
            }}
          />
        );
    }
  };

  return (
    <div className={cn(
      "dark min-h-screen flex flex-col transition-colors duration-300",
      // ALL dashboards use the same dark background for consistency
      "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    )}>
      {/* TOP HEADER - Software Vala Enterprise Header */}
      <header className={cn(
        "h-16 backdrop-blur-xl border-b flex items-center justify-between px-6 z-50 transition-colors duration-300",
        "bg-gradient-to-r from-[#0a1628] via-[#0d1b2a] to-[#0a1628] border-[#1e3a5f]",
        // When in Control Panel view, offset header for fixed sidebar
        isInControlPanelView && "ml-[320px]"
      )}>
        {/* LEFT: Back Button (when in module) OR Logo + Brand */}
        <div className="flex items-center gap-4">
          {/* Back Button - Only visible in module view */}
          {!isInControlPanelView && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackToControlPanel}
              className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center transition-all group"
              title="← Back to Control Panel"
            >
              <ArrowLeft className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
            </motion.button>
          )}
          
          {/* SV Logo + Brand Text */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-lg">SV</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Software Vala</h1>
              <p className="text-xs text-white/60 font-medium">
                {isInControlPanelView ? 'Super Admin' : (currentConfig.label || 'Module')}
              </p>
            </div>
          </div>
        </div>

        {/* CENTER: Module Name (only in module view) */}
        {!isInControlPanelView && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-lg font-semibold text-white">{currentConfig.label}</span>
          </div>
        )}

        {/* RIGHT: Status Icons + Notifications + Profile */}
        <div className="flex items-center gap-3">
          {/* System Status Icon */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
            title="System Healthy"
          >
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
          </motion.button>

          {/* Risk Level Icon */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
            title="Low Risk"
          >
            <AlertCircle className="w-5 h-5 text-emerald-400" />
          </motion.button>

          {/* Notification Badge */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"
            title="Notifications"
          >
            <AlertCircle className="w-5 h-5 text-amber-400" />
            {liveAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {liveAlerts}
              </span>
            )}
          </motion.button>

          {/* Profile Icon */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg"
            title="Profile"
          >
            <Crown className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </header>
      
      {/* STEP 9: SINGLE-CONTEXT LAYOUT - Exactly ONE sidebar visible at all times */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* CONTEXT A: Control Panel Sidebar - visible when no role selected */}
        {isInControlPanelView && (
          <>
            <ControlPanelSidebar
              activeRole={undefined}
              onRoleSelect={(roleId) => {
                handleRoleChange(roleId as ActiveRole);
              }}
              onLogout={handleLogout}
            />
            {/* Spacer to offset fixed Control Panel sidebar */}
            <div className="w-[320px] flex-shrink-0" />
          </>
        )}

        {/* CONTEXT B: Role Sidebar (for ALL role dashboards except full-screen modules) */}
        {!isInControlPanelView && !isInModuleView && activeRole && (
          <>
            <RoleSwitchSidebar
              activeRole={activeRole}
              onRoleChange={handleRoleChange}
              collapsed={collapsed}
              onToggleCollapse={() => setCollapsed((prev) => !prev)}
              onLogout={handleLogout}
              activeNav={activeNav}
              onNavChange={handleNavChange}
              onSubItemClick={(subItemId) => setSelectedSubItem(subItemId)}
            />
            {/* Spacer to offset fixed RoleSwitchSidebar (matches its internal widths) */}
            <div className="flex-shrink-0" style={{ width: collapsed ? 70 : 280 }} />
          </>
        )}

        {/* CONTEXT C: Module Sidebar (rendered inside module containers). */}
        {/* Spacer ensures module sidebar never overlaps content even when fixed. */}
        {isInModuleView && (
          <div className="flex-shrink-0" style={{ width: categoryCollapsed ? 80 : 260 }} />
        )}

        <main
          className="flex-1 overflow-auto"
          style={{
            minHeight: 0,
            height: '100%',
          }}
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
                  <p className="text-muted-foreground mb-6">
                    This dashboard failed to render. You can retry or switch roles.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Button variant="outline" onClick={() => window.location.reload()}>
                      Reload dashboard
                    </Button>
                    <Button onClick={handleHome}>Back to Boss Dashboard</Button>
                  </div>
                </div>
              </div>
            }
          >
            {renderRoleView()}
          </ErrorBoundary>
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
