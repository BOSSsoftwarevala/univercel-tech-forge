/**
 * App.tsx - Performance Optimized
 * Uses lazy loading to reduce initial bundle by 80%+
 */

import React, { Suspense, lazy, memo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { AnimationProvider } from "./contexts/AnimationContext";
import { DemoTestModeProvider } from "./contexts/DemoTestModeContext";
import { SecurityProvider } from "./contexts/SecurityContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { TranslationProvider } from "./contexts/TranslationContext";
import { GlobalRealtimeProvider } from "./providers/GlobalRealtimeProvider";
import SystemNotificationsInitializer from "./components/notifications/SystemNotificationsInitializer";
import RequireRole from "@/components/auth/RequireRole";
import RequireAuth from "@/components/auth/RequireAuth";
import GlobalOfferPopup from "@/components/offers/GlobalOfferPopup";
import DomainProtection from "./components/security/DomainProtection";
import { SourceCodeProtection } from "./components/security/SourceCodeProtection";
import FloatingAIChatbotWrapper from "./components/shared/FloatingAIChatbotWrapper";
import { Loader2 } from "lucide-react";

// ============================================
// LAZY ROUTE IMPORTS - Code splitting for performance
// ============================================

// Critical path - loaded immediately
import Index from "./pages/Index";
import Auth from "./pages/Auth";

// Fast loading skeleton
const RouteLoader = memo(() => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 className="w-6 h-6 text-primary animate-spin" />
  </div>
));

// Error fallback for failed module loads
const ModuleErrorFallback = memo(() => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
        <Loader2 className="w-8 h-8 text-destructive" />
      </div>
      <div>
        <p className="text-lg font-medium">Failed to load page</p>
        <p className="text-sm text-muted-foreground">Please refresh or try again</p>
      </div>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
      >
        Refresh Page
      </button>
    </div>
  </div>
));

// Lazy load factory with error handling and retry
const lazyLoad = (importFn: () => Promise<any>) => {
  const LazyComponent = lazy(() => 
    importFn().catch((error) => {
      console.error("Dynamic import failed:", error);
      // Retry once after short delay
      return new Promise(resolve => setTimeout(resolve, 100))
        .then(() => importFn())
        .catch((retryError) => {
          console.error("Retry also failed:", retryError);
          // If we still can't load, this is usually a stale chunk hash in cache.
          // Trigger a one-time hard reload with cache-bust (logic-only recovery).
          try {
            if (sessionStorage.getItem('__sv_chunk_reload__') !== '1') {
              sessionStorage.setItem('__sv_chunk_reload__', '1');
              const url = new URL(window.location.href);
              url.searchParams.set('v', Date.now().toString());
              window.location.replace(url.toString());
            }
          } catch {
            // ignore
          }

          // Return error fallback component (in case reload is blocked)
          return { default: ModuleErrorFallback };
        });
    })
  );
  return (props: any) => (
    <Suspense fallback={<RouteLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// ============================================
// LAZY LOADED ROUTES
// ============================================

// Public Pages
const Homepage = lazyLoad(() => import("./pages/Homepage"));
const Dashboard = lazyLoad(() => import("./pages/Dashboard"));
const NotFound = lazyLoad(() => import("./pages/NotFound"));
const CategoryOnboarding = lazyLoad(() => import("./pages/CategoryOnboarding"));

// Auth Pages
const Logout = lazyLoad(() => import("./pages/auth/Logout"));
const OTPVerify = lazyLoad(() => import("./pages/auth/OTPVerify"));
const DeviceVerify = lazyLoad(() => import("./pages/auth/DeviceVerify"));
const IPVerify = lazyLoad(() => import("./pages/auth/IPVerify"));
const ForgotPassword = lazyLoad(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazyLoad(() => import("./pages/auth/ResetPassword"));
const ChangePassword = lazyLoad(() => import("./pages/auth/ChangePassword"));
const AccountSuspension = lazyLoad(() => import("./pages/auth/AccountSuspension"));
const AccessDenied = lazyLoad(() => import("./pages/auth/AccessDenied"));
const PendingApproval = lazyLoad(() => import("./pages/auth/PendingApproval"));
const BossFortressAuth = lazyLoad(() => import("./pages/auth/BossFortressAuth"));
const BossRegister = lazyLoad(() => import("./pages/auth/BossRegister"));
const EasyAuth = lazyLoad(() => import("./pages/auth/EasyAuth"));
const RoleBasedLogin = lazyLoad(() => import("./pages/auth/RoleBasedLogin"));
const SessionExpiredPage = lazyLoad(() => import("./pages/error/SessionExpiredPage"));

// Demo Pages
const PublicDemos = lazyLoad(() => import("./pages/demos/PublicDemos"));
const SimpleDemoList = lazyLoad(() => import("./pages/SimpleDemoList"));
const SimpleDemoView = lazyLoad(() => import("./pages/SimpleDemoView"));
const SimpleCheckout = lazyLoad(() => import("./pages/SimpleCheckout"));
const SimpleUserDashboard = lazyLoad(() => import("./pages/SimpleUserDashboard"));
const UserDashboard = lazyLoad(() => import("./pages/user/UserDashboard"));
const DemoAccess = lazyLoad(() => import("./pages/DemoAccess"));
const DemoDirectory = lazyLoad(() => import("./pages/DemoDirectory"));
const DemoLogin = lazyLoad(() => import("./pages/DemoLogin"));
const DemoShowcase = lazyLoad(() => import("./pages/DemoShowcase"));
const PremiumDemoShowcase = lazyLoad(() => import("./pages/PremiumDemoShowcase"));
const PremiumDemoShowcaseNew = lazyLoad(() => import("./pages/showcase/PremiumDemoShowcase"));
const ServerManagementPortal = lazyLoad(() => import("./pages/server/ServerManagementPortal"));
const ClientPortal = lazyLoad(() => import("./pages/ClientPortal"));

// Demo Products
const RestaurantPOSDemo = lazyLoad(() => import("./pages/demos/RestaurantPOSDemo"));
const SaaSPOSDemo = lazyLoad(() => import("./pages/saas-pos/SaaSPOSDemo"));
const RestaurantSmallDemo = lazyLoad(() => import("./pages/demos/restaurant/RestaurantSmallDemo"));
const RestaurantMediumDemo = lazyLoad(() => import("./pages/demos/restaurant/RestaurantMediumDemo"));
const RestaurantLargeDemo = lazyLoad(() => import("./pages/demos/restaurant/RestaurantLargeDemo"));
const SchoolERPDemo = lazyLoad(() => import("./pages/demos/SchoolERPDemo"));
const SchoolSmallDemo = lazyLoad(() => import("./pages/demos/school/SchoolSmallDemo"));
const SchoolMediumDemo = lazyLoad(() => import("./pages/demos/school/SchoolMediumDemo"));
const SchoolLargeDemo = lazyLoad(() => import("./pages/demos/school/SchoolLargeDemo"));
const EducationDemoHub = lazyLoad(() => import("./pages/demos/education/EducationDemoHub"));
const HospitalHMSDemo = lazyLoad(() => import("./pages/demos/HospitalHMSDemo"));
const EcommerceStoreDemo = lazyLoad(() => import("./pages/demos/EcommerceStoreDemo"));
const HotelBookingDemo = lazyLoad(() => import("./pages/demos/HotelBookingDemo"));
const RealEstateDemo = lazyLoad(() => import("./pages/demos/RealEstateDemo"));
const AutomotiveDemo = lazyLoad(() => import("./pages/demos/AutomotiveDemo"));
const TravelDemo = lazyLoad(() => import("./pages/demos/TravelDemo"));
const FinanceDemo = lazyLoad(() => import("./pages/demos/FinanceDemo"));
const ManufacturingDemo = lazyLoad(() => import("./pages/demos/ManufacturingDemo"));
const GymDemo = lazyLoad(() => import("./pages/demos/GymDemo"));
const SalonDemo = lazyLoad(() => import("./pages/demos/SalonDemo"));
const LegalDemo = lazyLoad(() => import("./pages/demos/LegalDemo"));
const SecurityDemo = lazyLoad(() => import("./pages/demos/SecurityDemo"));
const TelecomDemo = lazyLoad(() => import("./pages/demos/TelecomDemo"));
const ChildcareDemo = lazyLoad(() => import("./pages/demos/ChildcareDemo"));
const PetCareDemo = lazyLoad(() => import("./pages/demos/PetCareDemo"));
const EventDemo = lazyLoad(() => import("./pages/demos/EventDemo"));
const CRMDemo = lazyLoad(() => import("./pages/demos/CRMDemo"));
const LogisticsDemo = lazyLoad(() => import("./pages/demos/LogisticsDemo"));
const SalesCRMDemo = lazyLoad(() => import("./pages/sales-crm/SalesCRMDemo"));
const SalesCRMAuthPage = lazyLoad(() => import("./pages/sales-crm/SalesCRMAuthPage"));
const SimpleHRMDemo = lazyLoad(() => import("./pages/simple-hrm/SimpleHRMDemo"));
const CorporateHRMDemo = lazyLoad(() => import("./pages/corporate-hrm/CorporateHRMDemo"));
const SaasHRMDemo = lazyLoad(() => import("./pages/saas-hrm/SaasHRMDemo"));
const RetailPOSDemo = lazyLoad(() => import("./pages/retail-pos/RetailPOSDemo"));
const RestaurantPOSNewDemo = lazyLoad(() => import("./pages/restaurant-pos-new/RestaurantPOSNewDemo"));
const AccountingDemo = lazyLoad(() => import("./pages/accounting/AccountingDemo"));
const ProAccountingDemo = lazyLoad(() => import("./pages/pro-accounting/ProAccountingDemo"));
const AutoDevEngine = lazyLoad(() => import("./pages/auto-dev/AutoDevEngine"));
const GoogleClassroomDemo = lazyLoad(() => import("./pages/demos/GoogleClassroomDemo"));

// School Software
const SchoolSoftwareHomepage = lazyLoad(() => import("./pages/school-software/SchoolSoftwareHomepage"));
const SchoolSoftwareDashboard = lazyLoad(() => import("./pages/school-software/SchoolSoftwareDashboard"));

// Settings
const SettingsPage = lazyLoad(() => import("./pages/Settings"));

// Super Admin
const SuperAdminCommandCenter = lazyLoad(() => import("./pages/super-admin/CommandCenter"));
const LiveTracking = lazyLoad(() => import("./pages/super-admin/LiveTracking"));
const RoleManager = lazyLoad(() => import("./pages/super-admin/RoleManager"));
const UserManager = lazyLoad(() => import("./pages/super-admin/UserManager"));
const PermissionMatrix = lazyLoad(() => import("./pages/super-admin/PermissionMatrix"));
const SecurityCenter = lazyLoad(() => import("./pages/super-admin/SecurityCenter"));
const ProductManagerPage = lazyLoad(() => import("./pages/super-admin/ProductManagerPage"));
const SystemAudit = lazyLoad(() => import("./pages/super-admin/SystemAudit"));
const PrimeManager = lazyLoad(() => import("./pages/super-admin/PrimeManager"));
const ServerManagerDashboard = lazyLoad(() => import("./pages/server-manager/ServerManagerDashboard"));
const SecurityCommandCenter = lazyLoad(() => import("./pages/security-command/SecurityCommandCenter"));
const APIManagerDashboard = lazyLoad(() => import("./pages/api-manager/APIManagerDashboard"));
const MarketingManagerDashboard = lazyLoad(() => import("./pages/marketing-manager/MarketingManagerDashboard"));
const SEOManagerDashboard = lazyLoad(() => import("./pages/seo-manager/SEOManagerDashboard"));
const LegalManagerDashboard = lazyLoad(() => import("./pages/legal-manager/LegalManagerDashboard"));
const ComplianceCenter = lazyLoad(() => import("./pages/super-admin/ComplianceCenter"));

// Master Admin
const MasterAdminDashboard = lazyLoad(() => import("./pages/master-admin/MasterAdminDashboard"));
const MasterControlCenter = lazyLoad(() => import("./pages/master-control/MasterControlCenter"));
const MasterAdminSupreme = lazyLoad(() => import("./pages/master-admin-supreme/MasterAdminSupreme"));
const SoftwareWalaOwnerDashboard = lazyLoad(() => import("./pages/owner/SoftwareWalaOwnerDashboard"));
const BootstrapAdmins = lazyLoad(() => import("./pages/admin/BootstrapAdmins"));
const RoleManagerPage = lazyLoad(() => import("./pages/admin/RoleManagerPage"));

// Vala Control
const ValaControlHub = lazyLoad(() => import("./pages/vala-control/ValaControlHub"));
const ValaOperationWorkspace = lazyLoad(() => import("./pages/vala-control/ValaOperationWorkspace"));
const ValaRegionalWorkspace = lazyLoad(() => import("./pages/vala-control/ValaRegionalWorkspace"));
const ValaAIHeadWorkspace = lazyLoad(() => import("./pages/vala-control/ValaAIHeadWorkspace"));
const ValaMasterWorkspace = lazyLoad(() => import("./pages/vala-control/ValaMasterWorkspace"));

// Secure Manager Dashboards
const SecureDevManagerDashboard = lazyLoad(() => import("./pages/dev-manager/SecureDevManagerDashboard"));
const SecureHRManagerDashboard = lazyLoad(() => import("./pages/hr-manager/SecureHRManagerDashboard"));
const SecureTaskManagerDashboard = lazyLoad(() => import("./pages/task-manager/SecureTaskManagerDashboard"));
const SecureLegalManagerDashboard = lazyLoad(() => import("./pages/legal-manager/SecureLegalManagerDashboard"));
const SecureProManagerDashboard = lazyLoad(() => import("./pages/pro-manager/SecureProManagerDashboard"));
const SecureLeadManagerDashboard = lazyLoad(() => import("./pages/lead-manager/SecureLeadManagerDashboard"));
const SecureMarketingManagerDashboard = lazyLoad(() => import("./pages/marketing-manager/SecureMarketingManagerDashboard"));
const SecureInfluencerManagerDashboard = lazyLoad(() => import("./pages/influencer-manager/SecureInfluencerManagerDashboard"));
const SecureSEOManagerDashboard = lazyLoad(() => import("./pages/seo-manager/SecureSEOManagerDashboard"));
const SecureAPIAIManagerDashboard = lazyLoad(() => import("./pages/api-ai-manager/SecureAPIAIManagerDashboard"));
const SecureResellerManagerDashboard = lazyLoad(() => import("./pages/reseller-manager/SecureResellerManagerDashboard"));
const SecureSalesSupportManagerDashboard = lazyLoad(() => import("./pages/sales-support-manager/SecureSalesSupportManagerDashboard"));

// Control System
const SecureControlSystem = lazyLoad(() => import("./pages/control-system/SecureControlSystem"));
const MasterAdminControl = lazyLoad(() => import("./pages/control-system/MasterAdminControl"));
const EnterpriseControlHub = lazyLoad(() => import("./pages/enterprise-control/EnterpriseControlHub"));

const BulkUserCreation = lazyLoad(() => import("./pages/admin/BulkUserCreation"));
const BulkActionsReference = lazyLoad(() => import("./pages/admin/BulkActionsReference"));
const ContinentSuperAdminDashboard = lazyLoad(() => import("./pages/continent-super-admin/ContinentSuperAdminDashboard"));

// Product Demo Manager
const ProductDemoManagerPage = lazyLoad(() => import("./pages/product-demo-manager"));

// Franchise
const FranchiseLayout = lazyLoad(() => import("./components/layouts/FranchiseLayout"));
const FranchiseDashboardPage = lazyLoad(() => import("./pages/franchise/Dashboard"));
const FranchiseProfile = lazyLoad(() => import("./pages/franchise/Profile"));
const FranchiseWalletPage = lazyLoad(() => import("./pages/franchise/Wallet"));
const FranchiseLeadBoardPage = lazyLoad(() => import("./pages/franchise/LeadBoard"));
const FranchiseAssignLead = lazyLoad(() => import("./pages/franchise/AssignLead"));
const FranchiseDemoRequest = lazyLoad(() => import("./pages/franchise/DemoRequest"));
const FranchiseDemoLibraryPage = lazyLoad(() => import("./pages/franchise/DemoLibrary"));
const FranchiseSalesCenter = lazyLoad(() => import("./pages/franchise/SalesCenter"));
const FranchisePerformancePage = lazyLoad(() => import("./pages/franchise/Performance"));
const FranchiseSupportTicket = lazyLoad(() => import("./pages/franchise/SupportTicket"));
const FranchiseInternalChatPage = lazyLoad(() => import("./pages/franchise/InternalChat"));
const FranchiseTrainingCenter = lazyLoad(() => import("./pages/franchise/TrainingCenter"));
const FranchiseSecurityPanel = lazyLoad(() => import("./pages/franchise/SecurityPanel"));
const FranchiseSEOServices = lazyLoad(() => import("./pages/franchise/SEOServices"));
const FranchiseTeamManagement = lazyLoad(() => import("./pages/franchise/TeamManagement"));
const FranchiseCRM = lazyLoad(() => import("./pages/franchise/CRM"));
const FranchiseHRM = lazyLoad(() => import("./pages/franchise/HRM"));
const FranchiseLeadActivity = lazyLoad(() => import("./pages/franchise/LeadActivity"));
const FranchiseManagement = lazyLoad(() => import("./pages/FranchiseManagement"));
const FranchiseLanding = lazyLoad(() => import("./pages/FranchiseLanding"));
const FranchiseDashboard = lazyLoad(() => import("./pages/FranchiseDashboard"));

// Role Dashboards
const ResellerLanding = lazyLoad(() => import("./pages/ResellerLanding"));
const ResellerDashboard = lazyLoad(() => import("./pages/ResellerDashboard"));
const ResellerPortal = lazyLoad(() => import("./pages/ResellerPortal"));
const DeveloperDashboard = lazyLoad(() => import("./pages/DeveloperDashboard"));
const DevCommandCenter = lazyLoad(() => import("./pages/DevCommandCenter"));
const DeveloperRegistration = lazyLoad(() => import("./pages/developer/DeveloperRegistration"));
const InfluencerDashboard = lazyLoad(() => import("./pages/InfluencerDashboard"));
const InfluencerManager = lazyLoad(() => import("./pages/InfluencerManager"));
const InfluencerCommandCenter = lazyLoad(() => import("./pages/InfluencerCommandCenter"));
const SupportDashboard = lazyLoad(() => import("./pages/SupportDashboard"));
const SEODashboard = lazyLoad(() => import("./pages/SEODashboard"));
const LeadManager = lazyLoad(() => import("./pages/LeadManager"));
const TaskManager = lazyLoad(() => import("./pages/TaskManager"));
const RnDDashboard = lazyLoad(() => import("./pages/RnDDashboard"));
const ClientSuccessDashboard = lazyLoad(() => import("./pages/ClientSuccessDashboard"));
const IncidentCrisisDashboard = lazyLoad(() => import("./pages/IncidentCrisisDashboard"));
const PerformanceManager = lazyLoad(() => import("./pages/PerformanceManager"));
const FinanceManager = lazyLoad(() => import("./pages/FinanceManager"));
const ProductDemoManager = lazyLoad(() => import("./pages/ProductDemoManager"));
const DemoManagerDashboard = lazyLoad(() => import("./pages/DemoManagerDashboard"));
const PrimeUserDashboard = lazyLoad(() => import("./pages/PrimeUserDashboard"));
const LegalComplianceManager = lazyLoad(() => import("./pages/LegalComplianceManager"));
const MarketingManager = lazyLoad(() => import("./pages/MarketingManager"));
const SalesSupportDashboard = lazyLoad(() => import("./pages/SalesSupportDashboard"));
const HRDashboard = lazyLoad(() => import("./pages/HRDashboard"));
const SystemSettings = lazyLoad(() => import("./pages/SystemSettings"));
const NotificationBuzzerConsole = lazyLoad(() => import("./pages/NotificationBuzzerConsole"));
const APIIntegrationDashboard = lazyLoad(() => import("./pages/APIIntegrationDashboard"));
const ApplyPortal = lazyLoad(() => import("./pages/ApplyPortal"));
const CareerPortal = lazyLoad(() => import("./pages/CareerPortal"));
const InternalChat = lazyLoad(() => import("./pages/InternalChat"));
const PersonalChat = lazyLoad(() => import("./pages/PersonalChat"));

// AI & System
const AIOptimizationConsole = lazyLoad(() => import("./pages/ai-console/AIOptimizationConsole"));
const AICEODashboard = lazyLoad(() => import("./pages/ai-ceo").then(m => ({ default: m.AICEODashboard })));
const AICEODashboardMain = lazyLoad(() => import("./pages/ai-ceo/sections/AICEODashboardMain"));
const AICEOLiveMonitor = lazyLoad(() => import("./pages/ai-ceo/sections/AICEOLiveMonitor"));
const AICEODecisionEngine = lazyLoad(() => import("./pages/ai-ceo/sections/AICEODecisionEngine"));
const AICEOApprovals = lazyLoad(() => import("./pages/ai-ceo/sections/AICEOApprovals"));
const AICEORiskCompliance = lazyLoad(() => import("./pages/ai-ceo/sections/AICEORiskCompliance"));
const AICEOPerformance = lazyLoad(() => import("./pages/ai-ceo/sections/AICEOPerformance"));
const AICEOPredictions = lazyLoad(() => import("./pages/ai-ceo/sections/AICEOPredictions"));
const AICEOReports = lazyLoad(() => import("./pages/ai-ceo/sections/AICEOReports"));
const AICEOLearning = lazyLoad(() => import("./pages/ai-ceo/sections/AICEOLearning"));
const AICEOSettings = lazyLoad(() => import("./pages/ai-ceo/sections/AICEOSettings"));
const AIRAVoiceCommands = lazyLoad(() => import("./pages/ai-ceo/sections/AIRAVoiceCommands"));
const AIRAProviders = lazyLoad(() => import("./pages/ai-ceo/sections/AIRAProviders"));
const AIRAProjectScanner = lazyLoad(() => import("./pages/ai-ceo/sections/AIRAProjectScanner"));
const AIRATaskEngine = lazyLoad(() => import("./pages/ai-ceo/sections/AIRATaskEngine"));
const AIRAMarketing = lazyLoad(() => import("./pages/ai-ceo/sections/AIRAMarketing"));
const AIRALanguageIntelligence = lazyLoad(() => import("./pages/ai-ceo/sections/AIRALanguageIntelligence"));
const AIRASalesIntelligence = lazyLoad(() => import("./pages/ai-ceo/sections/AIRASalesIntelligence"));
const AIRAToolStack = lazyLoad(() => import("./pages/ai-ceo/sections/AIRAToolStack"));

const DemoCredentials = lazyLoad(() => import("./pages/DemoCredentials"));
const DemoOrderSystem = lazyLoad(() => import("./pages/demo-system/DemoOrderSystem"));
const SectorsBrowse = lazyLoad(() => import("./pages/SectorsBrowse"));
const SubCategoryDemos = lazyLoad(() => import("./pages/SubCategoryDemos"));

// Business Management
const BusinessLayout = lazyLoad(() => import("./components/business/BusinessLayout").then(m => ({ default: m.BusinessLayout })));
const BusinessDashboard = lazyLoad(() => import("./pages/business/BusinessDashboard"));
const CustomersPage = lazyLoad(() => import("./pages/business/CustomersPage"));
const BillingPage = lazyLoad(() => import("./pages/business/BillingPage"));
const ExpensesPage = lazyLoad(() => import("./pages/business/ExpensesPage"));
const ReportsPage = lazyLoad(() => import("./pages/business/ReportsPage"));
const BusinessSettings = lazyLoad(() => import("./pages/business/BusinessSettings"));
const AIBillingDashboard = lazyLoad(() => import("./components/ai-billing").then(m => ({ default: m.AIBillingDashboard })));

// New Role Pages
const SafeAssistDashboard = lazyLoad(() => import("./pages/safe-assist/SafeAssistDashboard"));
const AssistManagerDashboard = lazyLoad(() => import("./pages/assist-manager/AssistManagerDashboard"));
const PromiseTrackerDashboard = lazyLoad(() => import("./pages/promise-tracker/PromiseTrackerDashboard"));
const PromiseManagementDashboard = lazyLoad(() => import("./pages/promise-management/PromiseManagementDashboard"));

// Wireframe Routes
const WireframeRoutes = lazyLoad(() => import("./components/wireframe/WireframeRoutes").then(m => ({ default: m.WireframeRoutes })));

// Vala Control
const ValaControlCenter = lazyLoad(() => import("./pages/vala-control/ValaControlCenter"));

// Super Admin System
const RoleSwitchDashboard = lazyLoad(() => import("./pages/super-admin-system").then(m => ({ default: m.RoleSwitchDashboard })));
const SuperAdminLogin = lazyLoad(() => import("./pages/super-admin-system").then(m => ({ default: m.SuperAdminLogin })));
const SuperAdminSystemDashboard = lazyLoad(() => import("./pages/super-admin-system").then(m => ({ default: m.SuperAdminDashboard })));
const SuperAdminUsers = lazyLoad(() => import("./pages/super-admin-system").then(m => ({ default: m.SuperAdminUsers })));
const SuperAdminAdmins = lazyLoad(() => import("./pages/super-admin-system").then(m => ({ default: m.SuperAdminAdmins })));
const SuperAdminRoles = lazyLoad(() => import("./pages/super-admin-system").then(m => ({ default: m.SuperAdminRoles })));
const SuperAdminGeography = lazyLoad(() => import("./pages/super-admin-system").then(m => ({ default: m.SuperAdminGeography })));
const SuperAdminModules = lazyLoad(() => import("./pages/super-admin-system").then(m => ({ default: m.SuperAdminModules })));
const SuperAdminRentals = lazyLoad(() => import("./pages/super-admin-system").then(m => ({ default: m.SuperAdminRentals })));
const SuperAdminRules = lazyLoad(() => import("./pages/super-admin-system").then(m => ({ default: m.SuperAdminRules })));
const SuperAdminApprovals = lazyLoad(() => import("./pages/super-admin-system").then(m => ({ default: m.SuperAdminApprovals })));
const SuperAdminSecurity = lazyLoad(() => import("./pages/super-admin-system").then(m => ({ default: m.SuperAdminSecurity })));
const SuperAdminSystemLock = lazyLoad(() => import("./pages/super-admin-system").then(m => ({ default: m.SuperAdminSystemLock })));
const SuperAdminActivityLog = lazyLoad(() => import("./pages/super-admin-system").then(m => ({ default: m.SuperAdminActivityLog })));
const SuperAdminAudit = lazyLoad(() => import("./pages/super-admin-system").then(m => ({ default: m.SuperAdminAudit })));

// Leader Security
const LeaderSecurityAssessment = lazyLoad(() => import("./pages/leader-security/LeaderSecurityAssessment"));

// Boss Panel
const BossPanel = lazyLoad(() => import("./pages/BossPanel"));

// Marketplace
const MMFullLayout = lazyLoad(() => import("./components/marketplace-manager/MMFullLayout").then(m => ({ default: m.MMFullLayout })));

// AI Builder
const AIBuilderPage = lazyLoad(() => import("./pages/AIBuilderPage"));

// ============================================
// QUERY CLIENT - Optimized caching
// ============================================
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

// Cleanup blocking classes
const BlockingClassCleanup = memo(() => {
  React.useEffect(() => {
    document.body.classList.remove('buzzer-blocking');
    return () => {
      document.body.classList.remove('buzzer-blocking');
    };
  }, []);
  return null;
});

// ============================================
// MAIN APP COMPONENT
// ============================================
const App = memo(() => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DemoTestModeProvider>
        <AnimationProvider>
          <TooltipProvider>
            <DomainProtection>
              <SourceCodeProtection enabled={!import.meta.env.DEV}>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <SecurityProvider>
                    <NotificationProvider>
                      <TranslationProvider>
                        <GlobalRealtimeProvider>
                          <BlockingClassCleanup />
                          <SystemNotificationsInitializer />
                          <GlobalOfferPopup />
                          <FloatingAIChatbotWrapper />
                          <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Index />} />
                            <Route path="/demos" element={<Index />} />
                            <Route path="/explore" element={<Navigate to="/demos" replace />} />
                            <Route path="/products" element={<Index />} />
                            <Route path="/pricing" element={<SimpleDemoList />} />
                            <Route path="/demos/public" element={<PublicDemos />} />
                            <Route path="/showcase" element={<PremiumDemoShowcaseNew />} />
                            <Route path="/server-portal" element={<RequireAuth><ServerManagementPortal /></RequireAuth>} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/pending-approval" element={<PendingApproval />} />
                            <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
                            <Route path="/change-password" element={<RequireAuth><ChangePassword /></RequireAuth>} />
                            <Route path="/onboard" element={<Homepage />} />
                            <Route path="/onboard/:category" element={<CategoryOnboarding />} />
                            <Route path="/apply" element={<SimpleDemoList />} />
                            <Route path="/careers" element={<CareerPortal />} />
                            <Route path="/join-developer" element={<CareerPortal />} />
                            <Route path="/join-influencer" element={<CareerPortal />} />
                            <Route path="/jobs" element={<CareerPortal />} />
                            <Route path="/bootstrap-admins" element={<RequireRole allowed={["master"]} masterOnly><BootstrapAdmins /></RequireRole>} />
                            <Route path="/sectors" element={<SectorsBrowse />} />
                            <Route path="/sectors/:sectorId/:subCategoryId" element={<SubCategoryDemos />} />
                            <Route path="/auto-dev" element={<AutoDevEngine />} />
                            <Route path="/ai-builder" element={<RequireRole allowed={["boss_owner", "super_admin", "developer", "ai_manager", "demo_manager", "product_demo_manager"]}><AIBuilderPage /></RequireRole>} />
                            <Route path="/marketplace" element={<RequireRole allowed={["boss_owner", "super_admin", "franchise", "reseller", "developer", "support", "demo_manager", "client", "user"]}><MMFullLayout /></RequireRole>} />
                            <Route path="/marketplace/product/:productId" element={<RequireRole allowed={["boss_owner", "super_admin", "franchise", "reseller", "developer", "support", "demo_manager", "client", "user"]}><MMFullLayout /></RequireRole>} />
                            <Route path="/marketplace/category/:categoryId" element={<RequireRole allowed={["boss_owner", "super_admin", "franchise", "reseller", "developer", "support", "demo_manager", "client", "user"]}><MMFullLayout /></RequireRole>} />
                            <Route path="/marketplace/*" element={<RequireRole allowed={["boss_owner", "super_admin", "franchise", "reseller", "developer", "support", "demo_manager", "client", "user"]}><MMFullLayout /></RequireRole>} />

                            {/* Demo Routes - Clean client-facing URLs */}
                            <Route path="/google-classroom" element={<GoogleClassroomDemo />} />
                            <Route path="/demo/google-classroom" element={<GoogleClassroomDemo />} />
                            <Route path="/demo/restaurant-pos" element={<RestaurantPOSDemo />} />
                            <Route path="/demo/restaurant-small" element={<RestaurantSmallDemo />} />
                            <Route path="/demo/restaurant-medium" element={<RestaurantMediumDemo />} />
                            <Route path="/demo/restaurant-large" element={<RestaurantLargeDemo />} />
                            <Route path="/demo/school-erp" element={<SchoolERPDemo />} />
                            <Route path="/demo/school-small" element={<SchoolSmallDemo />} />
                            <Route path="/demo/school-medium" element={<SchoolMediumDemo />} />
                            <Route path="/demo/school-large" element={<SchoolLargeDemo />} />
                            <Route path="/demo/education" element={<EducationDemoHub />} />
                            <Route path="/demos/education" element={<EducationDemoHub />} />
                            <Route path="/school-software" element={<SchoolSoftwareHomepage />} />
                            <Route path="/school-software/dashboard" element={<SchoolSoftwareDashboard />} />
                            <Route path="/demo/hospital-hms" element={<HospitalHMSDemo />} />
                            <Route path="/demo/ecommerce-store" element={<EcommerceStoreDemo />} />
                            <Route path="/demo/hotel-booking" element={<HotelBookingDemo />} />
                            <Route path="/demo/real-estate" element={<RealEstateDemo />} />
                            <Route path="/demo/automotive" element={<AutomotiveDemo />} />
                            <Route path="/demo/travel" element={<TravelDemo />} />
                            <Route path="/demo/finance" element={<FinanceDemo />} />
                            <Route path="/demo/manufacturing" element={<ManufacturingDemo />} />
                            <Route path="/demo/gym" element={<GymDemo />} />
                            <Route path="/demo/salon" element={<SalonDemo />} />
                            <Route path="/demo/legal" element={<LegalDemo />} />
                            <Route path="/demo/security" element={<SecurityDemo />} />
                            <Route path="/demo/telecom" element={<TelecomDemo />} />
                            <Route path="/demo/childcare" element={<ChildcareDemo />} />
                            <Route path="/demo/petcare" element={<PetCareDemo />} />
                            <Route path="/demo/event" element={<EventDemo />} />
                            <Route path="/demo/crm" element={<CRMDemo />} />
                            <Route path="/demo/logistics" element={<LogisticsDemo />} />
                            <Route path="/sales-crm" element={<SalesCRMDemo />} />
                            <Route path="/sales-crm/auth" element={<SalesCRMAuthPage />} />
                            <Route path="/retail-pos" element={<RetailPOSDemo />} />
                            <Route path="/demo-directory" element={<DemoDirectory />} />
                            <Route path="/demo/:demoId" element={<SimpleDemoView />} />
                            <Route path="/checkout/:demoId" element={<SimpleCheckout />} />
                            <Route path="/user-dashboard" element={<SimpleUserDashboard />} />
                            <Route path="/user/dashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
                            <Route path="/user/library" element={<RequireRole allowed={["boss_owner", "super_admin", "client", "user", "franchise", "reseller"]}><MMFullLayout /></RequireRole>} />
                            <Route path="/user/orders" element={<RequireRole allowed={["boss_owner", "super_admin", "client", "user", "franchise", "reseller"]}><MMFullLayout /></RequireRole>} />
                            <Route path="/user/licenses" element={<RequireRole allowed={["boss_owner", "super_admin", "client", "user", "franchise", "reseller"]}><MMFullLayout /></RequireRole>} />
                            <Route path="/demo-login" element={<DemoLogin />} />
                            <Route path="/premium-demos" element={<PremiumDemoShowcase />} />
                            <Route path="/client-portal" element={<ClientPortal />} />
                            <Route path="/get-started" element={<ClientPortal />} />

                            {/* Auth Routes */}
                            <Route path="/login" element={<RoleBasedLogin />} />
                            <Route path="/role-login" element={<RoleBasedLogin />} />
                            <Route path="/register" element={<Navigate to="/auth" replace />} />
                            <Route path="/easy-login" element={<EasyAuth />} />
                            <Route path="/quick-signup" element={<EasyAuth />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="/otp-verify" element={<OTPVerify />} />
                            <Route path="/device-verify" element={<DeviceVerify />} />
                            <Route path="/ip-verify" element={<IPVerify />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route path="/account-suspension" element={<AccountSuspension />} />
                            <Route path="/access-denied" element={<AccessDenied />} />
                            <Route path="/session-expired" element={<SessionExpiredPage />} />
                            <Route path="/boss-fortress" element={<BossFortressAuth />} />
                            <Route path="/boss-register" element={<BossRegister />} />
                            <Route path="/boss/login" element={<SuperAdminLogin />} />

                            {/* Boss Panel Route */}
                            <Route path="/boss-panel/*" element={<RequireRole allowed={["boss_owner"]}><BossPanel /></RequireRole>} />
                            <Route path="/boss/marketplace" element={<RequireRole allowed={["boss_owner", "super_admin"]}><BossPanel /></RequireRole>} />
                            <Route path="/boss/marketplace/products" element={<RequireRole allowed={["boss_owner", "super_admin"]}><BossPanel /></RequireRole>} />
                            <Route path="/boss/marketplace/banners" element={<RequireRole allowed={["boss_owner", "super_admin"]}><BossPanel /></RequireRole>} />

                            {/* Owner Dashboard */}
                            <Route path="/owner" element={<RequireRole allowed={["boss_owner"]}><SoftwareWalaOwnerDashboard /></RequireRole>} />
                            <Route path="/owner/*" element={<RequireRole allowed={["boss_owner"]}><SoftwareWalaOwnerDashboard /></RequireRole>} />
                            <Route path="/softwarewala" element={<RequireRole allowed={["boss_owner"]}><SoftwareWalaOwnerDashboard /></RequireRole>} />

                            {/* Master Admin Routes */}
                            <Route path="/master-admin" element={<RequireRole allowed={["boss_owner"]}><MasterControlCenter /></RequireRole>} />
                            <Route path="/master-admin/*" element={<RequireRole allowed={["boss_owner"]}><MasterControlCenter /></RequireRole>} />
                            <Route path="/master-admin-supreme" element={<RequireRole allowed={["boss_owner"]}><MasterAdminSupreme /></RequireRole>} />
                            <Route path="/admin/bulk-users" element={<RequireRole allowed={["boss_owner"]}><BulkUserCreation /></RequireRole>} />
                            <Route path="/admin/role-manager" element={<RequireRole allowed={["boss_owner"]}><RoleManagerPage /></RequireRole>} />
                            <Route path="/area-manager" element={<Navigate to="/super-admin-system/role-switch?role=country_head" replace />} />
                            <Route path="/area-manager/*" element={<Navigate to="/super-admin-system/role-switch?role=country_head" replace />} />

                            {/* Manager Routes */}
                            <Route path="/server-manager" element={<RequireRole allowed={["boss_owner", "server_manager"]}><ServerManagerDashboard /></RequireRole>} />
                            <Route path="/server-manager/*" element={<RequireRole allowed={["boss_owner", "server_manager"]}><ServerManagerDashboard /></RequireRole>} />
                            <Route path="/security-command" element={<RequireRole allowed={["boss_owner"]}><SecurityCommandCenter /></RequireRole>} />
                            <Route path="/security-command/*" element={<RequireRole allowed={["boss_owner"]}><SecurityCommandCenter /></RequireRole>} />
                            <Route path="/api-manager" element={<RequireRole allowed={["boss_owner", "ai_manager"]}><APIManagerDashboard /></RequireRole>} />
                            <Route path="/api-manager/*" element={<RequireRole allowed={["boss_owner", "ai_manager"]}><APIManagerDashboard /></RequireRole>} />
                            <Route path="/marketing-manager" element={<RequireRole allowed={["boss_owner", "marketing_manager"]}><MarketingManagerDashboard /></RequireRole>} />
                            <Route path="/marketing-manager/*" element={<RequireRole allowed={["boss_owner", "marketing_manager"]}><MarketingManagerDashboard /></RequireRole>} />
                            <Route path="/seo-manager" element={<RequireRole allowed={["boss_owner", "seo_manager"]}><SEOManagerDashboard /></RequireRole>} />
                            <Route path="/seo-manager/*" element={<RequireRole allowed={["boss_owner", "seo_manager"]}><SEOManagerDashboard /></RequireRole>} />
                            <Route path="/legal-manager" element={<RequireRole allowed={["boss_owner", "legal_manager"]}><LegalManagerDashboard /></RequireRole>} />
                            <Route path="/legal-manager/*" element={<RequireRole allowed={["boss_owner", "legal_manager"]}><LegalManagerDashboard /></RequireRole>} />

                            {/* AI CEO Routes */}
                            <Route path="/ai-ceo" element={<RequireRole allowed={["boss_owner", "ceo"]}><AICEODashboard /></RequireRole>}>
                              <Route index element={<AICEODashboardMain />} />
                              <Route path="live-monitor" element={<AICEOLiveMonitor />} />
                              <Route path="voice-commands" element={<AIRAVoiceCommands />} />
                              <Route path="language" element={<AIRALanguageIntelligence />} />
                              <Route path="sales" element={<AIRASalesIntelligence />} />
                              <Route path="ai-providers" element={<AIRAProviders />} />
                              <Route path="tool-stack" element={<AIRAToolStack />} />
                              <Route path="project-scanner" element={<AIRAProjectScanner />} />
                              <Route path="task-engine" element={<AIRATaskEngine />} />
                              <Route path="decision-engine" element={<AICEODecisionEngine />} />
                              <Route path="approvals" element={<AICEOApprovals />} />
                              <Route path="risk" element={<AICEORiskCompliance />} />
                              <Route path="performance" element={<AICEOPerformance />} />
                              <Route path="marketing" element={<AIRAMarketing />} />
                              <Route path="predictions" element={<AICEOPredictions />} />
                              <Route path="reports" element={<AICEOReports />} />
                              <Route path="learning" element={<AICEOLearning />} />
                              <Route path="settings" element={<AICEOSettings />} />
                            </Route>

                            {/* Super Admin Routes */}
                            <Route path="/continent-super-admin" element={<RequireRole allowed={["boss_owner"]}><ContinentSuperAdminDashboard /></RequireRole>} />
                            <Route path="/continent-super-admin/*" element={<RequireRole allowed={["boss_owner"]}><ContinentSuperAdminDashboard /></RequireRole>} />
                            <Route path="/admin" element={<Navigate to="/super-admin-system/role-switch?role=boss_owner" replace />} />
                            <Route path="/super-admin" element={<Navigate to="/super-admin-system/role-switch?role=boss_owner" replace />} />
                            <Route path="/super-admin/dashboard" element={<Navigate to="/super-admin-system/role-switch?role=boss_owner" replace />} />
                            <Route path="/super-admin/command-center" element={<Navigate to="/super-admin-system/role-switch?role=boss_owner" replace />} />
                            <Route path="/super-admin/live-tracking" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><LiveTracking /></RequireRole>} />
                            <Route path="/super-admin/role-manager" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><RoleManager /></RequireRole>} />
                            <Route path="/super-admin/user-manager" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><UserManager /></RequireRole>} />
                            <Route path="/super-admin/permission-matrix" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><PermissionMatrix /></RequireRole>} />
                            <Route path="/super-admin/security-center" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><SecurityCenter /></RequireRole>} />
                            <Route path="/super-admin/demo-manager" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><ProductDemoManager /></RequireRole>} />
                            <Route path="/super-admin/product-manager" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><ProductManagerPage /></RequireRole>} />
                            <Route path="/super-admin/system-settings" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><SystemSettings /></RequireRole>} />
                            <Route path="/super-admin/system-audit" element={<RequireRole allowed={["boss_owner"]}><SystemAudit /></RequireRole>} />
                            <Route path="/super-admin/prime-manager" element={<RequireRole allowed={["boss_owner"]}><PrimeManager /></RequireRole>} />
                            <Route path="/super-admin/influencer-manager" element={<RequireRole allowed={["boss_owner"]}><InfluencerManager /></RequireRole>} />
                            <Route path="/super-admin/finance-center" element={<RequireRole allowed={["boss_owner"]}><FinanceManager /></RequireRole>} />
                            <Route path="/super-admin/support-center" element={<RequireRole allowed={["boss_owner"]}><SupportDashboard /></RequireRole>} />
                            <Route path="/super-admin/ai-billing" element={<RequireRole allowed={["boss_owner"]}><AIBillingDashboard /></RequireRole>} />
                            <Route path="/super-admin/franchise-manager" element={<RequireRole allowed={["boss_owner"]}><FranchiseManagement /></RequireRole>} />
                            <Route path="/super-admin/compliance-center" element={<RequireRole allowed={["boss_owner"]}><ComplianceCenter /></RequireRole>} />
                            <Route path="/super-admin/performance" element={<RequireRole allowed={["boss_owner"]}><PerformanceManager /></RequireRole>} />

                            {/* Franchise Routes */}
                            <Route path="/franchise" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseDashboardPage /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/dashboard" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseDashboardPage /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/profile" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseProfile /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/wallet" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseWalletPage /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/lead-board" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseLeadBoardPage /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/assign-lead" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseAssignLead /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/demo-request" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseDemoRequest /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/demo-library" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseDemoLibraryPage /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/sales-center" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseSalesCenter /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/performance" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchisePerformancePage /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/support-ticket" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseSupportTicket /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/internal-chat" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseInternalChatPage /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/training-center" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseTrainingCenter /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/security-panel" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseSecurityPanel /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/seo-services" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseSEOServices /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/team-management" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseTeamManagement /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/crm" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseCRM /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/hrm" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseHRM /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise/lead-activity" element={<RequireRole allowed={["franchise", "super_admin"]}><Suspense fallback={<RouteLoader />}><FranchiseLayout><FranchiseLeadActivity /></FranchiseLayout></Suspense></RequireRole>} />
                            <Route path="/franchise-program" element={<FranchiseLanding />} />
                            <Route path="/franchise-landing" element={<FranchiseLanding />} />
                            <Route path="/franchise-dashboard" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseDashboard /></RequireRole>} />

                            {/* Reseller Routes */}
                            <Route path="/reseller" element={<ResellerLanding />} />
                            <Route path="/reseller-program" element={<ResellerLanding />} />
                            <Route path="/reseller-dashboard" element={<RequireRole allowed={["reseller", "super_admin"]}><ResellerDashboard /></RequireRole>} />
                            <Route path="/reseller-portal" element={<RequireRole allowed={["reseller", "super_admin"]}><ResellerPortal /></RequireRole>} />

                            {/* Developer Routes */}
                            <Route path="/developer" element={<RequireRole allowed={["developer", "super_admin"]}><DeveloperDashboard /></RequireRole>} />
                            <Route path="/dev-dashboard" element={<RequireRole allowed={["developer", "super_admin"]}><DeveloperDashboard /></RequireRole>} />
                            <Route path="/developer/command-center" element={<RequireRole allowed={["developer", "super_admin"]}><DevCommandCenter /></RequireRole>} />
                            <Route path="/dev-command" element={<RequireRole allowed={["developer", "super_admin"]}><DevCommandCenter /></RequireRole>} />
                            <Route path="/developer/register" element={<DeveloperRegistration />} />

                            {/* Influencer Routes */}
                            <Route path="/influencer" element={<RequireRole allowed={["influencer", "super_admin"]}><InfluencerDashboard /></RequireRole>} />
                            <Route path="/influencer-dashboard" element={<RequireRole allowed={["influencer", "super_admin"]}><InfluencerDashboard /></RequireRole>} />
                            <Route path="/influencer-command" element={<RequireRole allowed={["influencer", "super_admin"]}><InfluencerCommandCenter /></RequireRole>} />

                            {/* Support Routes */}
                            <Route path="/support" element={<RequireRole allowed={["support", "super_admin"]}><SupportDashboard /></RequireRole>} />
                            <Route path="/support-dashboard" element={<RequireRole allowed={["support", "super_admin"]}><SupportDashboard /></RequireRole>} />
                            <Route path="/seo" element={<RequireRole allowed={["seo", "super_admin"]}><SEODashboard /></RequireRole>} />
                            <Route path="/seo-dashboard" element={<RequireRole allowed={["seo", "super_admin"]}><SEODashboard /></RequireRole>} />
                            <Route path="/leads" element={<RequireRole allowed={["lead_manager", "super_admin"]}><LeadManager /></RequireRole>} />
                            <Route path="/lead-manager" element={<RequireRole allowed={["lead_manager", "super_admin"]}><LeadManager /></RequireRole>} />
                            <Route path="/tasks" element={<RequireRole allowed={["task_manager", "super_admin"]}><TaskManager /></RequireRole>} />
                            <Route path="/task-manager" element={<RequireRole allowed={["task_manager", "super_admin"]}><TaskManager /></RequireRole>} />
                            <Route path="/rnd" element={<RequireRole allowed={["rnd", "super_admin"]}><RnDDashboard /></RequireRole>} />
                            <Route path="/rnd-dashboard" element={<RequireRole allowed={["rnd", "super_admin"]}><RnDDashboard /></RequireRole>} />
                            <Route path="/client-success" element={<RequireRole allowed={["client_success", "super_admin"]}><ClientSuccessDashboard /></RequireRole>} />
                            <Route path="/incident-crisis" element={<RequireRole allowed={["incident_crisis", "super_admin"]}><IncidentCrisisDashboard /></RequireRole>} />
                            <Route path="/performance" element={<RequireRole allowed={["performance_manager", "super_admin"]}><PerformanceManager /></RequireRole>} />
                            <Route path="/finance" element={<RequireRole allowed={["finance_manager", "super_admin"]}><FinanceManager /></RequireRole>} />
                            <Route path="/demo-manager" element={<RequireRole allowed={["demo_manager", "super_admin"]}><DemoManagerDashboard /></RequireRole>} />
                            <Route path="/prime" element={<RequireRole allowed={["prime", "super_admin"]}><PrimeUserDashboard /></RequireRole>} />
                            <Route path="/legal" element={<RequireRole allowed={["legal_compliance", "super_admin"]}><LegalComplianceManager /></RequireRole>} />
                            <Route path="/marketing" element={<RequireRole allowed={["marketing", "super_admin"]}><MarketingManager /></RequireRole>} />
                            <Route path="/sales-support" element={<RequireRole allowed={["sales_support", "super_admin"]}><SalesSupportDashboard /></RequireRole>} />
                            <Route path="/hr" element={<RequireRole allowed={["hr", "super_admin"]}><HRDashboard /></RequireRole>} />
                            <Route path="/hr-dashboard" element={<RequireRole allowed={["hr", "super_admin"]}><HRDashboard /></RequireRole>} />

                            {/* System Pages */}
                            <Route path="/system-settings" element={<RequireRole allowed={["boss_owner", "master"]}><SystemSettings /></RequireRole>} />
                            <Route path="/notification-console" element={<RequireRole allowed={["boss_owner", "master"]}><NotificationBuzzerConsole /></RequireRole>} />
                            <Route path="/api-integrations" element={<RequireRole allowed={["boss_owner", "master", "developer"]}><APIIntegrationDashboard /></RequireRole>} />
                            <Route path="/internal-chat" element={<RequireAuth><InternalChat /></RequireAuth>} />
                            <Route path="/personal-chat" element={<RequireAuth><PersonalChat /></RequireAuth>} />
                            <Route path="/ai-optimization" element={<RequireRole allowed={["boss_owner", "master"]}><AIOptimizationConsole /></RequireRole>} />

                            {/* Vala Control Routes */}
                            <Route path="/vala-control" element={<RequireRole allowed={["boss_owner", "vala_head", "continent_head", "country_head", "ai_manager"]}><ValaControlCenter /></RequireRole>} />
                            <Route path="/vala-control/hub" element={<RequireRole allowed={["boss_owner"]}><ValaControlHub /></RequireRole>} />
                            <Route path="/vala-control/operations" element={<RequireRole allowed={["boss_owner", "vala_head"]}><ValaOperationWorkspace /></RequireRole>} />
                            <Route path="/vala-control/regional" element={<RequireRole allowed={["boss_owner", "continent_head", "country_head"]}><ValaRegionalWorkspace /></RequireRole>} />
                            <Route path="/vala-control/ai-head" element={<RequireRole allowed={["boss_owner", "ai_manager"]}><ValaAIHeadWorkspace /></RequireRole>} />
                            <Route path="/vala-control/master" element={<RequireRole allowed={["boss_owner"]}><ValaMasterWorkspace /></RequireRole>} />

                            {/* Secure Manager Routes */}
                            <Route path="/secure/dev-manager" element={<RequireRole allowed={["dev_manager", "boss_owner"]}><SecureDevManagerDashboard /></RequireRole>} />
                            <Route path="/secure/hr-manager" element={<RequireRole allowed={["hr_manager", "boss_owner"]}><SecureHRManagerDashboard /></RequireRole>} />
                            <Route path="/secure/task-manager" element={<RequireRole allowed={["task_manager", "boss_owner"]}><SecureTaskManagerDashboard /></RequireRole>} />
                            <Route path="/secure/legal-manager" element={<RequireRole allowed={["legal_manager", "boss_owner"]}><SecureLegalManagerDashboard /></RequireRole>} />
                            <Route path="/secure/pro-manager" element={<RequireRole allowed={["pro_manager", "boss_owner"]}><SecureProManagerDashboard /></RequireRole>} />
                            <Route path="/secure/lead-manager" element={<RequireRole allowed={["lead_manager", "boss_owner"]}><SecureLeadManagerDashboard /></RequireRole>} />
                            <Route path="/secure/marketing-manager" element={<RequireRole allowed={["marketing_manager", "boss_owner"]}><SecureMarketingManagerDashboard /></RequireRole>} />
                            <Route path="/secure/influencer-manager" element={<RequireRole allowed={["influencer_manager", "boss_owner"]}><SecureInfluencerManagerDashboard /></RequireRole>} />
                            <Route path="/secure/seo-manager" element={<RequireRole allowed={["seo_manager", "boss_owner"]}><SecureSEOManagerDashboard /></RequireRole>} />
                            <Route path="/secure/api-ai-manager" element={<RequireRole allowed={["ai_manager", "boss_owner"]}><SecureAPIAIManagerDashboard /></RequireRole>} />
                            <Route path="/secure/reseller-manager" element={<RequireRole allowed={["reseller_manager", "boss_owner"]}><SecureResellerManagerDashboard /></RequireRole>} />
                            <Route path="/secure/sales-support-manager" element={<RequireRole allowed={["sales_support_manager", "boss_owner"]}><SecureSalesSupportManagerDashboard /></RequireRole>} />

                            {/* Control System Routes */}
                            <Route path="/control-system" element={<RequireRole allowed={["boss_owner", "master"]}><SecureControlSystem /></RequireRole>} />
                            <Route path="/master-control" element={<RequireRole allowed={["boss_owner"]}><MasterAdminControl /></RequireRole>} />
                            <Route path="/enterprise-control" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><EnterpriseControlHub /></RequireRole>} />
                            <Route path="/leader-security" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><LeaderSecurityAssessment /></RequireRole>} />

                            {/* Super Admin System Routes */}
                            <Route path="/super-admin-system/login" element={<SuperAdminLogin />} />
                            <Route path="/super-admin-system/role-switch" element={<RequireAuth><RoleSwitchDashboard /></RequireAuth>} />
                            <Route path="/super-admin-system/dashboard" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><SuperAdminSystemDashboard /></RequireRole>} />
                            <Route path="/super-admin-system/users" element={<RequireRole allowed={["boss_owner", "master"]}><SuperAdminUsers /></RequireRole>} />
                            <Route path="/super-admin-system/admins" element={<RequireRole allowed={["boss_owner"]}><SuperAdminAdmins /></RequireRole>} />
                            <Route path="/super-admin-system/roles" element={<RequireRole allowed={["boss_owner"]}><SuperAdminRoles /></RequireRole>} />
                            <Route path="/super-admin-system/geography" element={<RequireRole allowed={["boss_owner"]}><SuperAdminGeography /></RequireRole>} />
                            <Route path="/super-admin-system/modules" element={<RequireRole allowed={["boss_owner"]}><SuperAdminModules /></RequireRole>} />
                            <Route path="/super-admin-system/rentals" element={<RequireRole allowed={["boss_owner"]}><SuperAdminRentals /></RequireRole>} />
                            <Route path="/super-admin-system/rules" element={<RequireRole allowed={["boss_owner"]}><SuperAdminRules /></RequireRole>} />
                            <Route path="/super-admin-system/approvals" element={<RequireRole allowed={["boss_owner"]}><SuperAdminApprovals /></RequireRole>} />
                            <Route path="/super-admin-system/security" element={<RequireRole allowed={["boss_owner"]}><SuperAdminSecurity /></RequireRole>} />
                            <Route path="/super-admin-system/system-lock" element={<RequireRole allowed={["boss_owner"]}><SuperAdminSystemLock /></RequireRole>} />
                            <Route path="/super-admin-system/activity-log" element={<RequireRole allowed={["boss_owner"]}><SuperAdminActivityLog /></RequireRole>} />
                            <Route path="/super-admin-system/audit" element={<RequireRole allowed={["boss_owner"]}><SuperAdminAudit /></RequireRole>} />

                            {/* HRM Demos */}
                            <Route path="/simple-hrm" element={<SimpleHRMDemo />} />
                            <Route path="/corporate-hrm" element={<CorporateHRMDemo />} />
                            <Route path="/saas-hrm" element={<SaasHRMDemo />} />
                            <Route path="/saas-pos" element={<SaaSPOSDemo />} />
                            <Route path="/restaurant-pos-new" element={<RestaurantPOSNewDemo />} />
                            <Route path="/accounting" element={<AccountingDemo />} />
                            <Route path="/pro-accounting" element={<ProAccountingDemo />} />

                            {/* Business Management */}
                            <Route path="/business" element={<RequireAuth><Suspense fallback={<RouteLoader />}><BusinessLayout><BusinessDashboard /></BusinessLayout></Suspense></RequireAuth>} />
                            <Route path="/business/dashboard" element={<RequireAuth><Suspense fallback={<RouteLoader />}><BusinessLayout><BusinessDashboard /></BusinessLayout></Suspense></RequireAuth>} />
                            <Route path="/business/customers" element={<RequireAuth><Suspense fallback={<RouteLoader />}><BusinessLayout><CustomersPage /></BusinessLayout></Suspense></RequireAuth>} />
                            <Route path="/business/billing" element={<RequireAuth><Suspense fallback={<RouteLoader />}><BusinessLayout><BillingPage /></BusinessLayout></Suspense></RequireAuth>} />
                            <Route path="/business/expenses" element={<RequireAuth><Suspense fallback={<RouteLoader />}><BusinessLayout><ExpensesPage /></BusinessLayout></Suspense></RequireAuth>} />
                            <Route path="/business/reports" element={<RequireAuth><Suspense fallback={<RouteLoader />}><BusinessLayout><ReportsPage /></BusinessLayout></Suspense></RequireAuth>} />
                            <Route path="/business/settings" element={<RequireAuth><Suspense fallback={<RouteLoader />}><BusinessLayout><BusinessSettings /></BusinessLayout></Suspense></RequireAuth>} />

                            {/* Demo Order System */}
                            <Route path="/demo-order" element={<DemoOrderSystem />} />
                            <Route path="/demo-credentials" element={<DemoCredentials />} />

                            {/* Safe Assist & Promise */}
                            <Route path="/safe-assist" element={<RequireAuth><SafeAssistDashboard /></RequireAuth>} />
                            <Route path="/assist-manager" element={<RequireRole allowed={["assist_manager", "boss_owner"]}><AssistManagerDashboard /></RequireRole>} />
                            <Route path="/promise-tracker" element={<RequireAuth><PromiseTrackerDashboard /></RequireAuth>} />
                            <Route path="/promise-management" element={<RequireRole allowed={["boss_owner", "master"]}><PromiseManagementDashboard /></RequireRole>} />

                            {/* Product Demo Manager */}
                            <Route path="/product-demo-manager" element={<RequireRole allowed={["boss_owner", "demo_manager"]}><ProductDemoManagerPage /></RequireRole>} />
                            <Route path="/product-demo-manager/*" element={<RequireRole allowed={["boss_owner", "demo_manager"]}><ProductDemoManagerPage /></RequireRole>} />

                            {/* Wireframe Routes */}
                            <Route path="/wireframe/*" element={<WireframeRoutes />} />

                            {/* 404 */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </GlobalRealtimeProvider>
                      </TranslationProvider>
                    </NotificationProvider>
                  </SecurityProvider>
                </BrowserRouter>
              </SourceCodeProtection>
            </DomainProtection>
          </TooltipProvider>
        </AnimationProvider>
      </DemoTestModeProvider>
    </AuthProvider>
  </QueryClientProvider>
));

App.displayName = 'App';

export default App;
