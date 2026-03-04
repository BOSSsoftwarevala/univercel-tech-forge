import { useEffect, useMemo, useState, useCallback, useRef, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Globe2, Timer, AlertCircle, Shield, Home, ArrowLeft, ChevronRight, Crown, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { RouteNotFoundScreen, LoadingSkeleton } from "@/components/shared/RouteLoadingFallback";
import GlobalHeaderActions from "@/components/shared/GlobalHeaderActions";
import ModuleBreadcrumb from "@/components/shared/ModuleBreadcrumb";
import { useSidebarStore } from "@/stores/sidebarStore";

import RoleSwitchSidebarNew, { ActiveRole, roleConfigs } from "@/components/super-admin-wireframe/RoleSwitchSidebarNew";
import { ControlPanelSidebar } from "@/components/super-admin-wireframe/ControlPanelSidebar";
import { ControlPanelDashboard } from "@/components/super-admin-wireframe/ControlPanelDashboard";

// ============================================
// LAZY LOADED ROLE VIEWS - Prevents bundle bloat
// ============================================

const ModuleLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <div className="text-center space-y-3">
      <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
      <p className="text-sm text-muted-foreground">Loading module...</p>
    </div>
  </div>
);

// Helper to create lazy components with error handling
const lazyWithRetry = (importFn: () => Promise<any>) => {
  return lazy(() => 
    importFn().catch((error) => {
      console.error("Module load failed, retrying...", error);
      // Retry once after a short delay
      return new Promise(resolve => setTimeout(resolve, 100))
        .then(() => importFn())
        .catch(() => ({
          default: () => (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
                <div>
                  <p className="text-lg font-medium">Failed to load module</p>
                  <p className="text-sm text-muted-foreground">Please refresh the page</p>
                </div>
                <Button onClick={() => window.location.reload()}>Refresh</Button>
              </div>
            </div>
          )
        }));
    })
  );
};

// Lazy load all heavy role views
const ContinentSuperAdminView = lazyWithRetry(() => import("./ContinentSuperAdminView"));
const ServerManagerView = lazyWithRetry(() => import("./ServerManagerView"));
const FranchiseManagerView = lazyWithRetry(() => import("./FranchiseManagerView"));
const SalesSupportManagerView = lazyWithRetry(() => import("./SalesSupportManagerView"));
const ResellerManagerFullView = lazyWithRetry(() => import("./ResellerManagerFullView"));
const LeadManagerView = lazyWithRetry(() => import("./LeadManagerView"));
const LMFullLayout = lazyWithRetry(() => import("@/components/lead-manager/LMFullLayout"));
const PTFullLayout = lazyWithRetry(() => import("@/components/promise-tracker/PTFullLayout"));
const AMFullLayout = lazyWithRetry(() => import("@/components/assist-manager/AMFullLayout"));
const ICBFullLayout = lazyWithRetry(() => import("@/components/internal-chatbot/ICBFullLayout"));
const DMFullLayout = lazyWithRetry(() => import("@/components/developer-management/DMFullLayout"));
const PROFullLayout = lazyWithRetry(() => import("@/components/pro-manager/PROFullLayout"));
const LegalManagerView = lazyWithRetry(() => import("./LegalManagerView"));
const TMFullLayout = lazyWithRetry(() => import("@/components/task-manager/TMFullLayout"));
const IMFullLayout = lazyWithRetry(() => import("@/components/influencer-manager/IMFullLayout"));
const MMFullLayout = lazyWithRetry(() => import("@/components/marketplace-manager/MMFullLayout").then(m => ({ default: m.MMFullLayout })));
const FinanceManagerDashboard = lazyWithRetry(() => import("./FinanceManagerDashboard"));
const ValaAIDashboard = lazyWithRetry(() => import("./ValaAIDashboard"));
const MarketingManagementDashboard = lazyWithRetry(() => import("./MarketingManagementDashboard"));
const MarketingManager = lazyWithRetry(() => import("@/pages/MarketingManager"));
const FinanceManager = lazyWithRetry(() => import("@/pages/FinanceManager"));
const CustomerSupportManagementDashboard = lazyWithRetry(() => import("./CustomerSupportManagementDashboard"));
const RoleManagerDashboard = lazyWithRetry(() => import("./RoleManagerDashboard"));
const RMEnterpriseLayout = lazyWithRetry(() => import("@/components/role-manager/RMEnterpriseLayout"));
const CountryHeadDashboard = lazyWithRetry(() => import("@/components/country-dashboard/CountryHeadDashboard"));
const PMEnterpriseLayout = lazyWithRetry(() => import("@/components/product-manager/PMEnterpriseLayout"));
const LMEnterpriseLayout = lazyWithRetry(() => import("@/components/legal-manager/LMEnterpriseLayout"));
const AAMEnterpriseLayout = lazyWithRetry(() => import("@/components/api-ai-manager/AAMEnterpriseLayout"));
const SecurityDashboard = lazyWithRetry(() => import("@/components/control-panel/SecurityDashboard"));
const SettingsDashboard = lazyWithRetry(() => import("@/components/control-panel/SettingsDashboard"));
const HomeDashboard = lazyWithRetry(() => import("@/components/control-panel/HomeDashboard"));
const DemoManagerFullLayout = lazyWithRetry(() => import("@/components/demo-manager/DemoManagerFullLayout"));
const CEODashboard = lazyWithRetry(() => import("./CEODashboard"));
const CEOSidebar = lazyWithRetry(() => import("@/components/ceo/CEOSidebar"));
const BossOwnerDashboard = lazyWithRetry(() => import("./BossOwnerDashboard"));
const DeveloperManagementDashboard = lazyWithRetry(() => import("./DeveloperManagementDashboard"));
const FranchiseDashboardEmbed = lazyWithRetry(() => import("@/pages/franchise/Dashboard"));
const ResellerDashboardEmbed = lazyWithRetry(() => import("@/pages/ResellerDashboard"));

// Define which roles can switch to which views
const ROLE_VIEW_ACCESS: Record<string, ActiveRole[]> = {
  boss_owner: Object.keys(roleConfigs) as ActiveRole[],
  master: Object.keys(roleConfigs) as ActiveRole[],
  ceo: Object.keys(roleConfigs) as ActiveRole[],
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

  // Invisible debug logging (enable by setting localStorage.__sv_debug = '1')
  const debug = useCallback((...args: unknown[]) => {
    try {
      if (localStorage.getItem('__sv_debug') === '1') {
        // eslint-disable-next-line no-console
        console.debug('[RoleSwitchDashboard]', ...args);
      }
    } catch {
      // ignore
    }
  }, []);

  const requestedRole = useMemo(() => {
    const role = new URLSearchParams(location.search).get("role") as ActiveRole | null;
    return role && role in roleConfigs ? role : null;
  }, [location.search]);

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

  const canAccessView = useCallback((viewRole: ActiveRole): boolean => {
    if (isBossOwner) return true;
    if (userRole === 'ceo') return true;
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
  
  const isInControlPanelView = activeRole === null;

  const getHeaderRole = useCallback((): 'boss' | 'employee' | 'client' | 'super_admin' | 'manager' => {
    if (isBossOwner || activeRole === 'boss_owner') return 'boss';
    if (activeRole === 'ceo' || activeRole === 'continent_super_admin') return 'super_admin';
    if (activeRole === 'server_manager' || activeRole === 'vala_ai_management') return 'manager';
    return 'employee';
  }, [isBossOwner, activeRole]);

  const moduleViewIds = useMemo(() => [
    'server-control', 'vala-ai', 'product-demo', 'leads', 'marketing',
    'finance', 'franchise-control', 'reseller-control', 'sales-support',
    'legal', 'task-management', 'hr-manager'
  ], []);

  const isInModuleView = useMemo(() => {
    if (moduleViewIds.includes(activeNav)) return true;
    if (activeRole !== null && activeRole !== 'boss_owner') return true;
    return false;
  }, [activeRole, activeNav, moduleViewIds]);
  
  const {
    showGlobalSidebar,
    enterCategory,
    exitToGlobal,
    categoryCollapsed,
    canTransition,
  } = useSidebarStore();
  
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
  
  const rolesWithInternalSidebars = useMemo(() => [
    'ceo', 'vala_ai_management', 'developer_management', 'demo_manager',
    'continent_super_admin', 'reseller_manager', 'finance_manager'
  ], []);
  
  useEffect(() => {
    if (!canTransition()) return;
    
    if (activeRole && rolesWithInternalSidebars.includes(activeRole)) {
      showGlobalSidebar();
      return;
    }

    if (isInModuleView) {
      const categoryId = categoryMap[activeNav];
      if (categoryId) {
        enterCategory(categoryId);
      } else {
        showGlobalSidebar();
      }
    } else {
      showGlobalSidebar();
    }
  }, [isInModuleView, activeNav, activeRole, showGlobalSidebar, enterCategory, categoryMap, canTransition, rolesWithInternalSidebars]);
  
  const shouldShowGlobalSidebar = !isInModuleView;

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

  const breadcrumbItems = useMemo(() => {
    const items: { label: string; onClick?: () => void; isActive?: boolean }[] = [];
    
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
    
    if (activeNav !== 'dashboard') {
      items.push({
        label: navLabels[activeNav] || activeNav.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        isActive: !selectedSubItem,
        onClick: selectedSubItem ? () => setSelectedSubItem(undefined) : undefined
      });
    }
    
    if (selectedSubItem) {
      items.push({
        label: selectedSubItem.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        isActive: true
      });
    }
    
    return items;
  }, [activeRole, activeNav, selectedSubItem, isInModuleView, navLabels]);

  const handleBack = useCallback(() => {
    if (selectedSubItem) {
      setSelectedSubItem(undefined);
    } else if (activeNav !== 'dashboard') {
      setActiveNav('dashboard');
      setSelectedSubItem(undefined);
    }
  }, [selectedSubItem, activeNav]);

  const handleHome = useCallback(() => {
    setActiveRole(null);
    setActiveNav('dashboard');
    setSelectedSubItem(undefined);
    setNavHistory(['dashboard']);
    toast.success('Returned to Control Panel');
  }, []);
  
  const handleBackToControlPanel = useCallback(() => {
    setActiveRole(null);
    setActiveNav('dashboard');
    setSelectedSubItem(undefined);
    toast.info('Returned to Control Panel');
  }, []);

  const didInitRef = useRef(false);
  const prevRequestedRoleRef = useRef<ActiveRole | null>(null);

  useEffect(() => {
    if (loading) return;

    if (requestedRole && requestedRole !== prevRequestedRoleRef.current) {
      debug('requestedRole change', { requestedRole, userRole, isBossOwner, url: window.location.href });
      prevRequestedRoleRef.current = requestedRole;

      const shouldStartInControlPanel = requestedRole === 'boss_owner';

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

    if (!didInitRef.current && !requestedRole) {
      debug('no requestedRole, start in control panel', { userRole, isBossOwner });
      setActiveRole(null);
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

  const handleRoleChange = useCallback((role: ActiveRole) => {
    if (!canAccessView(role)) {
      toast.error("Access denied to this view");
      return;
    }

    const nextUrl = `/super-admin-system/role-switch?role=${encodeURIComponent(role)}`;
    debug('role select', { role, nextUrl });
    window.location.assign(nextUrl);
  }, [canAccessView, debug]);

  const handleNavChange = useCallback((navId: string) => {
    setActiveNav(navId);
    setSelectedSubItem(undefined);
  }, []);
  
  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href);
      const navParam = url.searchParams.get('nav');
      if (!navParam) {
        setActiveNav('dashboard');
        setSelectedSubItem(undefined);
      } else {
        setActiveNav(navParam);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const currentConfig = activeRole ? roleConfigs[activeRole] : {
    id: 'control_panel',
    label: 'Control Panel',
    shortLabel: 'CP',
    icon: Crown,
    description: 'System Control Center',
  };
  
  // Default accent color for timer
  const timerAccentColor = 'text-primary';

  if (loading || !initialized) {
    return (
      <div className={cn(
        "dark min-h-screen flex items-center justify-center",
        "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      )}>
        <LoadingSkeleton message="System is preparing this section" />
      </div>
    );
  }

  const riskColors = {
    low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    high: "bg-red-500/20 text-red-400 border-red-500/50",
  };

  // Render the appropriate view based on active role - wrapped in Suspense
  const renderRoleView = () => {
    const content = (() => {
      switch (activeRole) {
        case "boss_owner":
          return <BossOwnerDashboard activeNav={activeNav} />;
        case "ceo":
          return <CEODashboard activeNav={activeNav} />;
        case "continent_super_admin":
          return <ContinentSuperAdminView activeNav={activeNav} selectedSubItem={selectedSubItem} />;
        case "country_head":
          return (
            <CountryHeadDashboard 
              countryCode="IN" 
              onBack={() => handleRoleChange("continent_super_admin")} 
            />
          );
        case "server_manager":
          return <ServerManagerView activeNav={activeNav} />;
        case "franchise_manager":
          return <FranchiseManagerView />;
        case "franchise_dashboard":
          return <FranchiseDashboardEmbed />;
        case "sales_support_manager":
          return <SalesSupportManagerView />;
        case "reseller_manager":
          return <ResellerManagerFullView onBack={() => setActiveRole("boss_owner")} />;
        case "reseller_dashboard":
          return <ResellerDashboardEmbed />;
        case "lead_manager":
          return <LMFullLayout />;
        case "pro_manager":
          return <PROFullLayout />;
        case "legal_manager":
          return <LMEnterpriseLayout />;
        case "task_management":
          return <TMFullLayout />;
        case "finance_manager":
          return <FinanceManager />;
        case "vala_ai_management":
          return <ValaAIDashboard />;
        case "marketing_management":
          return <MarketingManager />;
        case "customer_support_management":
          return <CustomerSupportManagementDashboard />;
        case "role_manager":
          return <RMEnterpriseLayout />;
        case "product_manager":
          return <PMEnterpriseLayout />;
        case "demo_manager":
          return <DemoManagerFullLayout />;
        case "developer_management":
          return <DMFullLayout />;
        case "api_ai_manager":
          return <AAMEnterpriseLayout />;
        case "promise_tracker_manager":
          return <PTFullLayout />;
        case "assist_manager":
          return <AMFullLayout />;
        case "internal_chatbot":
          return <ICBFullLayout />;
        case "influencer_manager":
          return <IMFullLayout />;
        case "marketplace_manager":
          return <MMFullLayout />;
        case "seo_manager":
          return <MarketingManager />;
        case "influencer_dashboard":
          return <IMFullLayout />;
        case "developer_dashboard":
          return <DMFullLayout />;
        case "pro_user_dashboard":
          return <PROFullLayout />;
        case "basic_user_dashboard":
          return <ControlPanelDashboard />;
        case "home":
          return <HomeDashboard />;
        case "security":
          return <SecurityDashboard />;
        case "settings":
          return <SettingsDashboard />;
        case null:
          return <ControlPanelDashboard />;
        default:
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
    })();

    return (
      <Suspense fallback={<ModuleLoader />}>
        {content}
      </Suspense>
    );
  };

  return (
    <div className={cn(
      "dark min-h-screen flex flex-col transition-colors duration-300",
      "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    )}>
      {/* TOP HEADER */}
      <header className={cn(
        "h-16 backdrop-blur-xl border-b flex items-center justify-between px-6 z-50 transition-colors duration-300",
        "bg-gradient-to-r from-[#0a1628] via-[#0d1b2a] to-[#0a1628] border-[#1e3a5f]",
        isInControlPanelView && !isInModuleView && "ml-[320px]"
      )}>
        <div className="flex items-center gap-4">
          {(!isInControlPanelView || isInModuleView) && (
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

        {(!isInControlPanelView || isInModuleView) && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-lg font-semibold text-white">{currentConfig.label}</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <Badge className={cn("px-3 py-1 border font-medium", riskColors[riskLevel])}>
            <Shield className="w-3 h-3 mr-1.5" />
            {riskLevel.toUpperCase()} RISK
          </Badge>
          
          <SessionTimerDisplay accentColor={timerAccentColor} />
          
          <GlobalHeaderActions 
            userRole={getHeaderRole()} 
            alertCount={liveAlerts} 
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR: Only Control Panel sidebar when in Control Panel */}
        {shouldShowGlobalSidebar && (
          <ControlPanelSidebar
            activeRole={activeRole as any}
            onRoleSelect={(role) => handleRoleChange(role as ActiveRole)}
            onLogout={handleLogout}
          />
        )}

        {/* MAIN CONTENT */}
        <main className={cn(
          "flex-1 overflow-auto transition-all duration-300",
          shouldShowGlobalSidebar && !collapsed && "ml-0"
        )}>
          <ErrorBoundary>
            {renderRoleView()}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default RoleSwitchDashboard;
