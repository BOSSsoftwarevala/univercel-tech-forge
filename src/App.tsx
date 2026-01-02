import { Toaster } from "@/components/ui/toaster";
import InfluencerCommandCenter from "@/pages/InfluencerCommandCenter";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AdminQuickAccess from "@/components/admin/AdminQuickAccess";
import Homepage from "./pages/Homepage";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CategoryOnboarding from "./pages/CategoryOnboarding";
import NotFound from "./pages/NotFound";

// Auth Pages
import { Navigate } from "react-router-dom";
import Logout from "./pages/auth/Logout";
import OTPVerify from "./pages/auth/OTPVerify";
import DeviceVerify from "./pages/auth/DeviceVerify";
import IPVerify from "./pages/auth/IPVerify";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import AccountSuspension from "./pages/auth/AccountSuspension";
import AccessDenied from "./pages/auth/AccessDenied";
import PendingApproval from "./pages/auth/PendingApproval";
import BossFortressAuth from "./pages/auth/BossFortressAuth";
import BossRegister from "./pages/auth/BossRegister";
import EasyAuth from "./pages/auth/EasyAuth";
import SessionExpiredPage from "./pages/error/SessionExpiredPage";

// Public Pages
import PublicDemos from "./pages/demos/PublicDemos";
import SimpleDemoList from "./pages/SimpleDemoList";
import SimpleDemoView from "./pages/SimpleDemoView";
import SimpleCheckout from "./pages/SimpleCheckout";
import SimpleUserDashboard from "./pages/SimpleUserDashboard";
import DemoAccess from "./pages/DemoAccess";
import DemoDirectory from "./pages/DemoDirectory";
import DemoLogin from "./pages/DemoLogin";
import DemoShowcase from "./pages/DemoShowcase";
import PremiumDemoShowcase from "./pages/PremiumDemoShowcase";
import PremiumDemoShowcaseNew from "./pages/showcase/PremiumDemoShowcase";
import ServerManagementPortal from "./pages/server/ServerManagementPortal";
import ClientPortal from "./pages/ClientPortal";

// Demo Product Pages - One-click access, no login
import RestaurantPOSDemo from "./pages/demos/RestaurantPOSDemo";
import SaaSPOSDemo from "./pages/saas-pos/SaaSPOSDemo";
import RestaurantSmallDemo from "./pages/demos/restaurant/RestaurantSmallDemo";
import RestaurantMediumDemo from "./pages/demos/restaurant/RestaurantMediumDemo";
import RestaurantLargeDemo from "./pages/demos/restaurant/RestaurantLargeDemo";
import SchoolERPDemo from "./pages/demos/SchoolERPDemo";
import SchoolSmallDemo from "./pages/demos/school/SchoolSmallDemo";
import SchoolMediumDemo from "./pages/demos/school/SchoolMediumDemo";
import SchoolLargeDemo from "./pages/demos/school/SchoolLargeDemo";
import HospitalHMSDemo from "./pages/demos/HospitalHMSDemo";
import EcommerceStoreDemo from "./pages/demos/EcommerceStoreDemo";
import HotelBookingDemo from "./pages/demos/HotelBookingDemo";
import RealEstateDemo from "./pages/demos/RealEstateDemo";
import AutomotiveDemo from "./pages/demos/AutomotiveDemo";
import TravelDemo from "./pages/demos/TravelDemo";
import FinanceDemo from "./pages/demos/FinanceDemo";
import ManufacturingDemo from "./pages/demos/ManufacturingDemo";
import GymDemo from "./pages/demos/GymDemo";
import SalonDemo from "./pages/demos/SalonDemo";
import LegalDemo from "./pages/demos/LegalDemo";
import SecurityDemo from "./pages/demos/SecurityDemo";
import TelecomDemo from "./pages/demos/TelecomDemo";
import ChildcareDemo from "./pages/demos/ChildcareDemo";
import PetCareDemo from "./pages/demos/PetCareDemo";
import EventDemo from "./pages/demos/EventDemo";
import CRMDemo from "./pages/demos/CRMDemo";
import LogisticsDemo from "./pages/demos/LogisticsDemo";
import SalesCRMDemo from "./pages/sales-crm/SalesCRMDemo";
import SalesCRMAuthPage from "./pages/sales-crm/SalesCRMAuthPage";
import SimpleHRMDemo from "./pages/simple-hrm/SimpleHRMDemo";
import CorporateHRMDemo from "./pages/corporate-hrm/CorporateHRMDemo";
import SaasHRMDemo from "./pages/saas-hrm/SaasHRMDemo";
import RetailPOSDemo from "./pages/retail-pos/RetailPOSDemo";
import RestaurantPOSNewDemo from "./pages/restaurant-pos-new/RestaurantPOSNewDemo";
import AccountingDemo from "./pages/accounting/AccountingDemo";
import ProAccountingDemo from "./pages/pro-accounting/ProAccountingDemo";

import SettingsPage from "./pages/Settings";

// Super Admin Pages
import SuperAdminCommandCenter from "./pages/super-admin/CommandCenter";
import LiveTracking from "./pages/super-admin/LiveTracking";
import RoleManager from "./pages/super-admin/RoleManager";
import UserManager from "./pages/super-admin/UserManager";
import PermissionMatrix from "./pages/super-admin/PermissionMatrix";
import SecurityCenter from "./pages/super-admin/SecurityCenter";
import ProductManagerPage from "./pages/super-admin/ProductManagerPage";
import SystemAudit from "./pages/super-admin/SystemAudit";
import PrimeManager from "./pages/super-admin/PrimeManager";
import ServerManagerDashboard from "./pages/server-manager/ServerManagerDashboard";
import SecurityCommandCenter from "./pages/security-command/SecurityCommandCenter";
import APIManagerDashboard from "./pages/api-manager/APIManagerDashboard";
import MarketingManagerDashboard from "./pages/marketing-manager/MarketingManagerDashboard";
import SEOManagerDashboard from "./pages/seo-manager/SEOManagerDashboard";
import LegalManagerDashboard from "./pages/legal-manager/LegalManagerDashboard";

import ComplianceCenter from "./pages/super-admin/ComplianceCenter";

// Boss Owner Admin Pages
import MasterAdminDashboard from "./pages/master-admin/MasterAdminDashboard";
import MasterControlCenter from "./pages/master-control/MasterControlCenter";
import MasterAdminSupreme from "./pages/master-admin-supreme/MasterAdminSupreme";
import SoftwareWalaOwnerDashboard from "./pages/owner/SoftwareWalaOwnerDashboard";
import BootstrapAdmins from "./pages/admin/BootstrapAdmins";
import RoleManagerPage from "./pages/admin/RoleManagerPage";

// Vala Control System Pages
import ValaControlHub from "./pages/vala-control/ValaControlHub";
import ValaOperationWorkspace from "./pages/vala-control/ValaOperationWorkspace";
import ValaRegionalWorkspace from "./pages/vala-control/ValaRegionalWorkspace";
import ValaAIHeadWorkspace from "./pages/vala-control/ValaAIHeadWorkspace";
import ValaMasterWorkspace from "./pages/vala-control/ValaMasterWorkspace";

// Dev Manager Pages
import SecureDevManagerDashboard from "./pages/dev-manager/SecureDevManagerDashboard";

// HR Manager Pages
import SecureHRManagerDashboard from "./pages/hr-manager/SecureHRManagerDashboard";

// Task Manager Pages
import SecureTaskManagerDashboard from "./pages/task-manager/SecureTaskManagerDashboard";

// Legal Manager Pages
import SecureLegalManagerDashboard from "./pages/legal-manager/SecureLegalManagerDashboard";

// Pro Manager Pages
import SecureProManagerDashboard from "./pages/pro-manager/SecureProManagerDashboard";

// Lead Manager Pages
import SecureLeadManagerDashboard from "./pages/lead-manager/SecureLeadManagerDashboard";

// Marketing Manager Pages
import SecureMarketingManagerDashboard from "./pages/marketing-manager/SecureMarketingManagerDashboard";

// Influencer Manager Pages
import SecureInfluencerManagerDashboard from "./pages/influencer-manager/SecureInfluencerManagerDashboard";

// SEO Manager Pages
import SecureSEOManagerDashboard from "./pages/seo-manager/SecureSEOManagerDashboard";

// API/AI Manager Pages
import SecureAPIAIManagerDashboard from "./pages/api-ai-manager/SecureAPIAIManagerDashboard";

// Reseller Manager Pages
import SecureResellerManagerDashboard from "./pages/reseller-manager/SecureResellerManagerDashboard";

// Sales & Support Manager Pages
import SecureSalesSupportManagerDashboard from "./pages/sales-support-manager/SecureSalesSupportManagerDashboard";

// Secure Control System Pages
import SecureControlSystem from "./pages/control-system/SecureControlSystem";
import MasterAdminControl from "./pages/control-system/MasterAdminControl";

// Enterprise Control System
import EnterpriseControlHub from "./pages/enterprise-control/EnterpriseControlHub";

import BulkUserCreation from "./pages/admin/BulkUserCreation";
import BulkActionsReference from "./pages/admin/BulkActionsReference";
import ContinentSuperAdminDashboard from "./pages/continent-super-admin/ContinentSuperAdminDashboard";

// Product Demo Manager
import ProductDemoManagerPage from "./pages/product-demo-manager";
// Franchise Layout & Pages
import FranchiseLayout from "./components/layouts/FranchiseLayout";
import FranchiseDashboardPage from "./pages/franchise/Dashboard";
import FranchiseProfile from "./pages/franchise/Profile";
import FranchiseWalletPage from "./pages/franchise/Wallet";
import FranchiseLeadBoardPage from "./pages/franchise/LeadBoard";
import FranchiseAssignLead from "./pages/franchise/AssignLead";
import FranchiseDemoRequest from "./pages/franchise/DemoRequest";
import FranchiseDemoLibraryPage from "./pages/franchise/DemoLibrary";
import FranchiseSalesCenter from "./pages/franchise/SalesCenter";
import FranchisePerformancePage from "./pages/franchise/Performance";
import FranchiseSupportTicket from "./pages/franchise/SupportTicket";
import FranchiseInternalChatPage from "./pages/franchise/InternalChat";
import FranchiseTrainingCenter from "./pages/franchise/TrainingCenter";
import FranchiseSecurityPanel from "./pages/franchise/SecurityPanel";
import FranchiseSEOServices from "./pages/franchise/SEOServices";
import FranchiseTeamManagement from "./pages/franchise/TeamManagement";
import FranchiseCRM from "./pages/franchise/CRM";
import FranchiseHRM from "./pages/franchise/HRM";
import FranchiseLeadActivity from "./pages/franchise/LeadActivity";

// Existing Pages
import FranchiseManagement from "./pages/FranchiseManagement";
import FranchiseLanding from "./pages/FranchiseLanding";
import FranchiseDashboard from "./pages/FranchiseDashboard";
import ResellerLanding from "./pages/ResellerLanding";
import ResellerDashboard from "./pages/ResellerDashboard";
import ResellerPortal from "./pages/ResellerPortal";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import DevCommandCenter from "./pages/DevCommandCenter";
import DeveloperRegistration from "./pages/developer/DeveloperRegistration";
import InfluencerDashboard from "./pages/InfluencerDashboard";
import InfluencerManager from "./pages/InfluencerManager";
import SupportDashboard from "./pages/SupportDashboard";
import SEODashboard from "./pages/SEODashboard";
import LeadManager from "./pages/LeadManager";
import TaskManager from "./pages/TaskManager";
import RnDDashboard from "./pages/RnDDashboard";
import ClientSuccessDashboard from "./pages/ClientSuccessDashboard";
import IncidentCrisisDashboard from "./pages/IncidentCrisisDashboard";
import PerformanceManager from "./pages/PerformanceManager";
import FinanceManager from "./pages/FinanceManager";
import ProductDemoManager from "./pages/ProductDemoManager";
import DemoManagerDashboard from "./pages/DemoManagerDashboard";
import PrimeUserDashboard from "./pages/PrimeUserDashboard";
import LegalComplianceManager from "./pages/LegalComplianceManager";
import MarketingManager from "./pages/MarketingManager";
import SalesSupportDashboard from "./pages/SalesSupportDashboard";
import HRDashboard from "./pages/HRDashboard";
import SystemSettings from "./pages/SystemSettings";
import NotificationBuzzerConsole from "./pages/NotificationBuzzerConsole";
import APIIntegrationDashboard from "./pages/APIIntegrationDashboard";
import ApplyPortal from "./pages/ApplyPortal";
import CareerPortal from "./pages/CareerPortal";
import InternalChat from "./pages/InternalChat";
import PersonalChat from "./pages/PersonalChat";
import DomainProtection from "./components/security/DomainProtection";
import { SourceCodeProtection } from "./components/security/SourceCodeProtection";
import FloatingAIChatbotWrapper from "./components/shared/FloatingAIChatbotWrapper";
import QuickSupport from "./components/support/QuickSupport";
import AIOptimizationConsole from "./pages/ai-console/AIOptimizationConsole";
import DemoCredentials from "./pages/DemoCredentials";
import DemoOrderSystem from "./pages/demo-system/DemoOrderSystem";
import SectorsBrowse from "./pages/SectorsBrowse";
import SubCategoryDemos from "./pages/SubCategoryDemos";
// Business Management Software
import { BusinessLayout } from "./components/business/BusinessLayout";
import BusinessDashboard from "./pages/business/BusinessDashboard";
import CustomersPage from "./pages/business/CustomersPage";
import BillingPage from "./pages/business/BillingPage";
import ExpensesPage from "./pages/business/ExpensesPage";
import ReportsPage from "./pages/business/ReportsPage";
import BusinessSettings from "./pages/business/BusinessSettings";
import { AIBillingDashboard } from "./components/ai-billing";
// New Role Pages (25-28)
import SafeAssistDashboard from "./pages/safe-assist/SafeAssistDashboard";
import AssistManagerDashboard from "./pages/assist-manager/AssistManagerDashboard";
import PromiseTrackerDashboard from "./pages/promise-tracker/PromiseTrackerDashboard";
import PromiseManagementDashboard from "./pages/promise-management/PromiseManagementDashboard";
// Wireframe Routes
import { WireframeRoutes } from "./components/wireframe/WireframeRoutes";
// Vala Control System
import ValaControlCenter from "./pages/vala-control/ValaControlCenter";
// Super Admin System
import {
  RoleSwitchDashboard,
  SuperAdminLogin,
  SuperAdminDashboard as SuperAdminSystemDashboard,
  SuperAdminUsers,
  SuperAdminAdmins,
  SuperAdminRoles,
  SuperAdminGeography,
  SuperAdminModules,
  SuperAdminRentals,
  SuperAdminRules,
  SuperAdminApprovals,
  SuperAdminSecurity,
  SuperAdminSystemLock,
  SuperAdminActivityLog,
  SuperAdminAudit
} from "./pages/super-admin-system";

// Leader Security Assessment
import LeaderSecurityAssessment from "./pages/leader-security/LeaderSecurityAssessment";

// Optimized QueryClient with caching for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false, // Reduce unnecessary refetches
      refetchOnReconnect: true,
    },
  },
});

const App = () => (
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
                          <SystemNotificationsInitializer />
                          <GlobalOfferPopup />
                          <FloatingAIChatbotWrapper />
                          <Routes>
                          {/* Public Routes - No login required */}
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
              {/* Bootstrap is Master-only after initial setup */}
              <Route path="/bootstrap-admins" element={<RequireRole allowed={["master"]} masterOnly><BootstrapAdmins /></RequireRole>} />
              <Route path="/sectors" element={<SectorsBrowse />} />
              <Route path="/sectors/:sectorId/:subCategoryId" element={<SubCategoryDemos />} />
              
              {/* Product Demo Pages - MUST come BEFORE dynamic routes */}
<Route path="/demo/restaurant-pos" element={<RestaurantPOSDemo />} />
              <Route path="/demo/restaurant-small" element={<RestaurantSmallDemo />} />
              <Route path="/demo/restaurant-medium" element={<RestaurantMediumDemo />} />
              <Route path="/demo/restaurant-large" element={<RestaurantLargeDemo />} />
              <Route path="/demo/school-erp" element={<SchoolERPDemo />} />
              <Route path="/demo/school-small" element={<SchoolSmallDemo />} />
              <Route path="/demo/school-medium" element={<SchoolMediumDemo />} />
              <Route path="/demo/school-large" element={<SchoolLargeDemo />} />
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
              
              {/* Sales CRM Demo */}
              <Route path="/sales-crm" element={<SalesCRMDemo />} />
              <Route path="/sales-crm/auth" element={<SalesCRMAuthPage />} />
              <Route path="/retail-pos" element={<RetailPOSDemo />} />
              {/* Dynamic Demo Routes - MUST come AFTER specific routes */}
              <Route path="/demo-directory" element={<DemoDirectory />} />
              <Route path="/demo/:demoId" element={<SimpleDemoView />} />
              <Route path="/checkout/:demoId" element={<SimpleCheckout />} />
              <Route path="/user-dashboard" element={<SimpleUserDashboard />} />
              <Route path="/demo-login" element={<DemoLogin />} />
              <Route path="/showcase" element={<Index />} />
              <Route path="/premium-demos" element={<PremiumDemoShowcase />} />
              
              {/* Client Portal - Public Route */}
              <Route path="/client-portal" element={<ClientPortal />} />
              <Route path="/get-started" element={<ClientPortal />} />

              {/* Global Auth Routes - Redirects to unified /auth */}
              <Route path="/login" element={<Navigate to="/auth" replace />} />
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

              {/* Boss Fortress Auth - Ultra Secure */}
              <Route path="/boss-fortress" element={<BossFortressAuth />} />
              <Route path="/boss-register" element={<BossRegister />} />
              <Route path="/boss/login" element={<SuperAdminLogin />} />

              {/* Owner Dashboard - SoftwareWala Business Control */}
              <Route path="/owner" element={<RequireRole allowed={["boss_owner"]}><SoftwareWalaOwnerDashboard /></RequireRole>} />
              <Route path="/owner/*" element={<RequireRole allowed={["boss_owner"]}><SoftwareWalaOwnerDashboard /></RequireRole>} />
              <Route path="/softwarewala" element={<RequireRole allowed={["boss_owner"]}><SoftwareWalaOwnerDashboard /></RequireRole>} />

              {/* Boss Admin Routes - BOSS_OWNER ONLY */}
              <Route path="/master-admin" element={<RequireRole allowed={["boss_owner"]}><MasterControlCenter /></RequireRole>} />
              <Route path="/master-admin/*" element={<RequireRole allowed={["boss_owner"]}><MasterControlCenter /></RequireRole>} />
              <Route path="/master-admin-supreme" element={<RequireRole allowed={["boss_owner"]}><MasterAdminSupreme /></RequireRole>} />
              
              {/* Admin Utilities - Boss Owner */}
              <Route path="/admin/bulk-users" element={<RequireRole allowed={["boss_owner"]}><BulkUserCreation /></RequireRole>} />
              <Route path="/admin/role-manager" element={<RequireRole allowed={["boss_owner"]}><RoleManagerPage /></RequireRole>} />


              {/* Area Manager now redirects to Country Head - merged roles */}
              <Route path="/area-manager" element={<Navigate to="/super-admin-system/role-switch?role=country_head" replace />} />
              <Route path="/area-manager/*" element={<Navigate to="/super-admin-system/role-switch?role=country_head" replace />} />

              {/* Server Manager Routes */}
              <Route path="/server-manager" element={<RequireRole allowed={["boss_owner", "server_manager"]}><ServerManagerDashboard /></RequireRole>} />
              <Route path="/server-manager/*" element={<RequireRole allowed={["boss_owner", "server_manager"]}><ServerManagerDashboard /></RequireRole>} />

              {/* Security Command Center Routes */}
              <Route path="/security-command" element={<RequireRole allowed={["boss_owner"]}><SecurityCommandCenter /></RequireRole>} />
              <Route path="/security-command/*" element={<RequireRole allowed={["boss_owner"]}><SecurityCommandCenter /></RequireRole>} />

              {/* API / AI Manager Routes */}
              <Route path="/api-manager" element={<RequireRole allowed={["boss_owner", "ai_manager"]}><APIManagerDashboard /></RequireRole>} />
              <Route path="/api-manager/*" element={<RequireRole allowed={["boss_owner", "ai_manager"]}><APIManagerDashboard /></RequireRole>} />

              {/* Marketing Manager Routes */}
              <Route path="/marketing-manager" element={<RequireRole allowed={["boss_owner", "marketing_manager"]}><MarketingManagerDashboard /></RequireRole>} />
              <Route path="/marketing-manager/*" element={<RequireRole allowed={["boss_owner", "marketing_manager"]}><MarketingManagerDashboard /></RequireRole>} />


              {/* SEO Manager Routes */}
              <Route path="/seo-manager" element={<RequireRole allowed={["boss_owner", "seo_manager"]}><SEOManagerDashboard /></RequireRole>} />
              <Route path="/seo-manager/*" element={<RequireRole allowed={["boss_owner", "seo_manager"]}><SEOManagerDashboard /></RequireRole>} />

              {/* Legal Manager Routes */}
              <Route path="/legal-manager" element={<RequireRole allowed={["boss_owner", "legal_manager"]}><LegalManagerDashboard /></RequireRole>} />
              <Route path="/legal-manager/*" element={<RequireRole allowed={["boss_owner", "legal_manager"]}><LegalManagerDashboard /></RequireRole>} />

              {/* Continent Super Admin Routes */}
              <Route path="/continent-super-admin" element={<RequireRole allowed={["boss_owner"]}><ContinentSuperAdminDashboard /></RequireRole>} />
              <Route path="/continent-super-admin/*" element={<RequireRole allowed={["boss_owner"]}><ContinentSuperAdminDashboard /></RequireRole>} />

              {/* Super Admin Routes - Privileged roles can access */}
              <Route path="/admin" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><SuperAdminCommandCenter /></RequireRole>} />
              <Route path="/super-admin" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><SuperAdminCommandCenter /></RequireRole>} />
              <Route path="/super-admin/dashboard" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><SuperAdminCommandCenter /></RequireRole>} />
              <Route path="/super-admin/command-center" element={<RequireRole allowed={["boss_owner", "master", "ceo"]}><SuperAdminCommandCenter /></RequireRole>} />
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
              <Route path="/franchise" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseDashboardPage /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/dashboard" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseDashboardPage /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/profile" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseProfile /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/wallet" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseWalletPage /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/lead-board" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseLeadBoardPage /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/assign-lead" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseAssignLead /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/demo-request" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseDemoRequest /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/demo-library" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseDemoLibraryPage /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/sales-center" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseSalesCenter /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/performance" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchisePerformancePage /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/support-ticket" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseSupportTicket /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/internal-chat" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseInternalChatPage /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/training-center" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseTrainingCenter /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/security-panel" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseSecurityPanel /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/seo-services" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseSEOServices /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/team-management" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseTeamManagement /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/crm" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseCRM /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/hrm" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseHRM /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise/lead-activity" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseLayout><FranchiseLeadActivity /></FranchiseLayout></RequireRole>} />
              <Route path="/franchise-program" element={<FranchiseLanding />} />
              <Route path="/franchise-landing" element={<FranchiseLanding />} />
              <Route path="/franchise-dashboard" element={<RequireRole allowed={["franchise", "super_admin"]}><FranchiseDashboard /></RequireRole>} />

              {/* Reseller Routes */}
              <Route path="/reseller" element={<RequireRole allowed={["reseller", "super_admin"]}><ResellerDashboard /></RequireRole>} />
              <Route path="/reseller/dashboard" element={<RequireRole allowed={["reseller", "super_admin"]}><ResellerDashboard /></RequireRole>} />
              <Route path="/reseller/portal" element={<RequireRole allowed={["reseller", "super_admin"]}><ResellerPortal /></RequireRole>} />
              <Route path="/reseller-portal" element={<RequireRole allowed={["reseller", "super_admin"]}><ResellerPortal /></RequireRole>} />
              <Route path="/reseller-program" element={<ResellerLanding />} />
              <Route path="/reseller-landing" element={<ResellerLanding />} />
              <Route path="/reseller-dashboard" element={<RequireRole allowed={["reseller", "super_admin"]}><ResellerDashboard /></RequireRole>} />

              {/* Developer Routes */}
              <Route path="/developer/register" element={<RequireAuth><DeveloperRegistration /></RequireAuth>} />
              <Route path="/developer/registration" element={<RequireAuth><DeveloperRegistration /></RequireAuth>} />
              <Route path="/developer" element={<RequireRole allowed={["developer", "super_admin"]}><DevCommandCenter /></RequireRole>} />
              <Route path="/developer/dashboard" element={<RequireRole allowed={["developer", "super_admin"]}><DevCommandCenter /></RequireRole>} />
              <Route path="/developer-dashboard" element={<RequireRole allowed={["developer", "super_admin"]}><DevCommandCenter /></RequireRole>} />
              <Route path="/dev-command-center" element={<RequireRole allowed={["developer", "super_admin"]}><DevCommandCenter /></RequireRole>} />

              {/* Influencer Routes */}
              <Route path="/influencer" element={<RequireRole allowed={["influencer", "super_admin"]}><InfluencerDashboard /></RequireRole>} />
              <Route path="/influencer/dashboard" element={<RequireRole allowed={["influencer", "super_admin"]}><InfluencerDashboard /></RequireRole>} />
              <Route path="/influencer/command-center" element={<RequireRole allowed={["influencer", "super_admin"]}><InfluencerCommandCenter /></RequireRole>} />
              <Route path="/influencer-command-center" element={<RequireRole allowed={["influencer", "super_admin"]}><InfluencerCommandCenter /></RequireRole>} />
              <Route path="/influencer-dashboard" element={<RequireRole allowed={["influencer", "super_admin"]}><InfluencerDashboard /></RequireRole>} />
              <Route path="/influencer-manager" element={<RequireRole allowed={["super_admin"]}><InfluencerManager /></RequireRole>} />
              <Route path="/influencer-manager-secure" element={<RequireRole allowed={["influencer_manager", "super_admin"]}><SecureInfluencerManagerDashboard /></RequireRole>} />
              
              {/* Product Demo Manager Routes */}
              <Route path="/product-demo-manager" element={<RequireRole allowed={["product_demo_manager", "demo_manager", "super_admin"]}><ProductDemoManagerPage /></RequireRole>} />
              <Route path="/product-demo-manager/*" element={<RequireRole allowed={["product_demo_manager", "demo_manager", "super_admin"]}><ProductDemoManagerPage /></RequireRole>} />

              {/* Reseller Manager Routes */}
              <Route path="/reseller-manager" element={<RequireRole allowed={["reseller_manager", "super_admin"]}><SecureResellerManagerDashboard /></RequireRole>} />
              <Route path="/reseller-manager-secure" element={<RequireRole allowed={["reseller_manager", "super_admin"]}><SecureResellerManagerDashboard /></RequireRole>} />
              
              {/* Sales & Support Manager Routes */}
              <Route path="/sales-support-manager" element={<RequireRole allowed={["sales_support_manager", "super_admin"]}><SecureSalesSupportManagerDashboard /></RequireRole>} />
              <Route path="/sales-support-manager-secure" element={<RequireRole allowed={["sales_support_manager", "super_admin"]}><SecureSalesSupportManagerDashboard /></RequireRole>} />
              
              {/* Public demo route for Influencer Command Center */}
              <Route path="/demo/influencer-command-center" element={<InfluencerCommandCenter />} />
              {/* Prime User Routes */}
              <Route path="/prime" element={<RequireRole allowed={["prime", "super_admin"]}><PrimeUserDashboard /></RequireRole>} />
              <Route path="/prime/dashboard" element={<RequireRole allowed={["prime", "super_admin"]}><PrimeUserDashboard /></RequireRole>} />
              <Route path="/prime-user" element={<RequireRole allowed={["prime", "super_admin"]}><PrimeUserDashboard /></RequireRole>} />

              {/* Manager Routes - PROTECTED BY ROLE */}
              <Route path="/lead-manager" element={<RequireRole allowed={["lead_manager", "super_admin", "boss_owner", "master", "ceo"]}><LeadManager /></RequireRole>} />
              <Route path="/leads/*" element={<RequireRole allowed={["lead_manager", "super_admin", "boss_owner", "master", "ceo"]}><LeadManager /></RequireRole>} />
              <Route path="/task-manager" element={<RequireRole allowed={["task_manager", "super_admin"]}><TaskManager /></RequireRole>} />
              <Route path="/tasks/*" element={<RequireRole allowed={["task_manager", "super_admin"]}><TaskManager /></RequireRole>} />
              <Route path="/demo-manager" element={<RequireRole allowed={["demo_manager", "super_admin", "master"]}><DemoManagerDashboard /></RequireRole>} />
              <Route path="/demo-manager/*" element={<RequireRole allowed={["demo_manager", "super_admin", "master"]}><DemoManagerDashboard /></RequireRole>} />
              <Route path="/demo" element={<RequireRole allowed={["demo_manager", "franchise", "reseller", "super_admin"]}><ProductDemoManager /></RequireRole>} />
              <Route path="/demos/*" element={<RequireRole allowed={["demo_manager", "franchise", "reseller", "super_admin"]}><ProductDemoManager /></RequireRole>} />
              <Route path="/finance" element={<RequireRole allowed={["finance_manager", "super_admin"]}><FinanceManager /></RequireRole>} />
              <Route path="/finance/*" element={<RequireRole allowed={["finance_manager", "super_admin"]}><FinanceManager /></RequireRole>} />
              <Route path="/legal" element={<RequireRole allowed={["legal_compliance", "super_admin"]}><LegalComplianceManager /></RequireRole>} />
              <Route path="/marketing" element={<RequireRole allowed={["marketing_manager", "super_admin"]}><MarketingManager /></RequireRole>} />
              <Route path="/marketing/*" element={<RequireRole allowed={["marketing_manager", "super_admin"]}><MarketingManager /></RequireRole>} />
              <Route path="/enterprise/marketing" element={<RequireRole allowed={["marketing_manager", "super_admin"]}><MarketingManager /></RequireRole>} />
              <Route path="/enterprise/marketing/*" element={<RequireRole allowed={["marketing_manager", "super_admin"]}><MarketingManager /></RequireRole>} />
              <Route path="/performance" element={<RequireRole allowed={["performance_manager", "super_admin"]}><PerformanceManager /></RequireRole>} />
              <Route path="/performance/*" element={<RequireRole allowed={["performance_manager", "super_admin"]}><PerformanceManager /></RequireRole>} />
              <Route path="/rnd-dashboard" element={<RequireRole allowed={["rnd_manager", "super_admin"]}><RnDDashboard /></RequireRole>} />
              <Route path="/rnd/*" element={<RequireRole allowed={["rnd_manager", "super_admin"]}><RnDDashboard /></RequireRole>} />
              <Route path="/hr" element={<RequireRole allowed={["hr_manager", "super_admin"]}><HRDashboard /></RequireRole>} />
              <Route path="/hr/*" element={<RequireRole allowed={["hr_manager", "super_admin"]}><HRDashboard /></RequireRole>} />
              
              {/* Secure Task Manager Dashboard */}
              <Route path="/task-manager-secure" element={<RequireRole allowed={["task_manager", "super_admin"]}><SecureTaskManagerDashboard /></RequireRole>} />
              
              {/* Secure Legal Manager Dashboard */}
              <Route path="/legal-manager-secure" element={<RequireRole allowed={["legal_manager", "super_admin"]}><SecureLegalManagerDashboard /></RequireRole>} />
              <Route path="/seo" element={<RequireRole allowed={["seo_manager", "super_admin"]}><SEODashboard /></RequireRole>} />
              <Route path="/seo/*" element={<RequireRole allowed={["seo_manager", "super_admin"]}><SEODashboard /></RequireRole>} />
              <Route path="/seo-dashboard" element={<RequireRole allowed={["seo_manager", "super_admin"]}><SEODashboard /></RequireRole>} />
              <Route path="/seo-manager" element={<RequireRole allowed={["seo_manager", "super_admin"]}><SEODashboard /></RequireRole>} />
              <Route path="/support" element={<RequireRole allowed={["support", "client_success", "super_admin"]}><SupportDashboard /></RequireRole>} />
              <Route path="/support/*" element={<RequireRole allowed={["support", "client_success", "super_admin"]}><SupportDashboard /></RequireRole>} />
              <Route path="/support-dashboard" element={<RequireRole allowed={["support", "client_success", "super_admin"]}><SupportDashboard /></RequireRole>} />
              <Route path="/sales-support" element={<RequireRole allowed={["support", "super_admin"]}><SalesSupportDashboard /></RequireRole>} />
              <Route path="/sales" element={<RequireRole allowed={["support", "super_admin"]}><SalesSupportDashboard /></RequireRole>} />
              <Route path="/sales/*" element={<RequireRole allowed={["support", "super_admin"]}><SalesSupportDashboard /></RequireRole>} />
              <Route path="/client-success" element={<RequireRole allowed={["client_success", "super_admin"]}><ClientSuccessDashboard /></RequireRole>} />
              <Route path="/clients/*" element={<RequireRole allowed={["client_success", "super_admin"]}><ClientSuccessDashboard /></RequireRole>} />
              <Route path="/incident-crisis" element={<RequireRole allowed={["incident_crisis", "super_admin"]}><IncidentCrisisDashboard /></RequireRole>} />
              <Route path="/crisis/*" element={<RequireRole allowed={["incident_crisis", "super_admin"]}><IncidentCrisisDashboard /></RequireRole>} />
              <Route path="/hr-dashboard" element={<RequireRole allowed={["hr_manager", "super_admin"]}><HRDashboard /></RequireRole>} />
              <Route path="/ai/*" element={<RequireRole allowed={["ai_manager", "super_admin"]}><AIOptimizationConsole /></RequireRole>} />

              {/* NEW ROLES (25-28) Routes */}
              <Route path="/safe-assist" element={<RequireRole allowed={["safe_assist", "super_admin", "master"]}><SafeAssistDashboard /></RequireRole>} />
              <Route path="/safe-assist/*" element={<RequireRole allowed={["safe_assist", "super_admin", "master"]}><SafeAssistDashboard /></RequireRole>} />
              <Route path="/assist-manager" element={<RequireRole allowed={["assist_manager", "super_admin", "master"]}><AssistManagerDashboard /></RequireRole>} />
              <Route path="/assist-manager/*" element={<RequireRole allowed={["assist_manager", "super_admin", "master"]}><AssistManagerDashboard /></RequireRole>} />
              <Route path="/promise-tracker" element={<RequireRole allowed={["promise_tracker", "super_admin", "master"]}><PromiseTrackerDashboard /></RequireRole>} />
              <Route path="/promise-tracker/*" element={<RequireRole allowed={["promise_tracker", "super_admin", "master"]}><PromiseTrackerDashboard /></RequireRole>} />
              <Route path="/promise-management" element={<RequireRole allowed={["promise_management", "super_admin", "master"]}><PromiseManagementDashboard /></RequireRole>} />
              <Route path="/promise-management/*" element={<RequireRole allowed={["promise_management", "super_admin", "master"]}><PromiseManagementDashboard /></RequireRole>} />

              {/* System Routes - SUPER ADMIN ONLY */}
              <Route path="/system-settings" element={<RequireRole allowed={["super_admin"]}><SystemSettings /></RequireRole>} />
              <Route path="/buzzer-console" element={<RequireRole allowed={["super_admin"]}><NotificationBuzzerConsole /></RequireRole>} />
              <Route path="/api-integrations" element={<RequireRole allowed={["super_admin"]}><APIIntegrationDashboard /></RequireRole>} />
              <Route path="/internal-chat" element={<RequireAuth><InternalChat /></RequireAuth>} />
              <Route path="/personal-chat" element={<RequireAuth><PersonalChat /></RequireAuth>} />
              <Route path="/ai-console" element={<RequireRole allowed={["ai_manager", "super_admin"]}><AIOptimizationConsole /></RequireRole>} />
              <Route path="/demo-credentials" element={<RequireRole allowed={["super_admin"]}><DemoCredentials /></RequireRole>} />
              <Route path="/demo-order-system" element={<RequireRole allowed={["master", "super_admin", "demo_manager"]}><DemoOrderSystem /></RequireRole>} />

              {/* Vala Control Center - Secure Isolated System */}
              <Route path="/vala-control" element={<RequireAuth><ValaControlCenter roleView="operations" /></RequireAuth>} />
              <Route path="/vala-control/operations" element={<RequireAuth><ValaControlCenter roleView="operations" /></RequireAuth>} />
              <Route path="/vala-control/regional" element={<RequireAuth><ValaControlCenter roleView="regional" /></RequireAuth>} />
              <Route path="/vala-control/ai-head" element={<RequireAuth><ValaControlCenter roleView="ai_head" /></RequireAuth>} />
              <Route path="/vala-control/master" element={<RequireRole allowed={["master"]} masterOnly><ValaControlCenter roleView="master" /></RequireRole>} />

              {/* Enterprise Control System - Isolated Workspaces */}
              <Route path="/enterprise-control" element={<EnterpriseControlHub />} />

              {/* New Vala Control System - Isolated Workspaces */}
              <Route path="/vala" element={<RequireAuth><ValaControlHub /></RequireAuth>} />
              <Route path="/vala/operation" element={<RequireAuth><ValaOperationWorkspace /></RequireAuth>} />
              <Route path="/vala/regional" element={<RequireAuth><ValaRegionalWorkspace /></RequireAuth>} />
              <Route path="/vala/ai-head" element={<RequireAuth><ValaAIHeadWorkspace /></RequireAuth>} />
              <Route path="/vala/master" element={<RequireRole allowed={["master"]} masterOnly><ValaMasterWorkspace /></RequireRole>} />

              {/* Dev Manager Dashboard */}
              <Route path="/dev-manager" element={<RequireAuth><SecureDevManagerDashboard /></RequireAuth>} />

              {/* HR Manager Dashboard */}
              <Route path="/hr-manager" element={<RequireAuth><SecureHRManagerDashboard /></RequireAuth>} />

              {/* Wireframe Routes - Design Sandbox */}
              <Route path="/wireframe/*" element={<WireframeRoutes />} />

              {/* Super Admin System Routes */}
              {/* Explicit dashboard aliases (never allow route-not-found -> blank screen) */}
              <Route path="/boss/dashboard" element={<Navigate to="/super-admin-system/role-switch?role=boss_owner" replace />} />
              <Route path="/ceo/dashboard" element={<Navigate to="/super-admin-system/role-switch?role=ceo" replace />} />
              <Route path="/admin/dashboard" element={<Navigate to="/super-admin-system/role-switch?role=admin" replace />} />
              <Route path="/continent/dashboard" element={<Navigate to="/super-admin-system/role-switch?role=continent_super_admin" replace />} />
              <Route path="/country/dashboard" element={<Navigate to="/super-admin-system/role-switch?role=country_head" replace />} />

              <Route path="/super-admin-system" element={<Navigate to="/super-admin-system/dashboard" replace />} />
              <Route path="/super-admin-system/login" element={<SuperAdminLogin />} />
              {/* Role switcher - Protected for privileged roles */}
              <Route path="/super-admin-system/role-switch" element={<RequireRole allowed={['boss_owner', 'ceo', 'admin', 'super_admin', 'master', 'continent_super_admin', 'country_head']}><RoleSwitchDashboard /></RequireRole>} />
              <Route path="/super-admin-system/role-switch/*" element={<RequireRole allowed={['boss_owner', 'ceo', 'admin', 'super_admin', 'master', 'continent_super_admin', 'country_head']}><RoleSwitchDashboard /></RequireRole>} />
              <Route path="/super-admin-system/dashboard" element={<SuperAdminSystemDashboard />} />
              <Route path="/super-admin-system/users" element={<SuperAdminUsers />} />
              <Route path="/super-admin-system/admins" element={<SuperAdminAdmins />} />
              <Route path="/super-admin-system/roles" element={<SuperAdminRoles />} />
              <Route path="/super-admin-system/geography" element={<SuperAdminGeography />} />
              <Route path="/super-admin-system/modules" element={<SuperAdminModules />} />
              <Route path="/super-admin-system/rentals" element={<SuperAdminRentals />} />
              <Route path="/super-admin-system/rules" element={<SuperAdminRules />} />
              <Route path="/super-admin-system/approvals" element={<SuperAdminApprovals />} />
              <Route path="/super-admin-system/security" element={<SuperAdminSecurity />} />
              <Route path="/super-admin-system/locks" element={<SuperAdminSystemLock />} />
              <Route path="/super-admin-system/activity-log" element={<SuperAdminActivityLog />} />
              <Route path="/super-admin-system/audit" element={<SuperAdminAudit />} />

              {/* Leader Security Assessment */}
              <Route path="/leader-security" element={<LeaderSecurityAssessment />} />

              {/* Bulk Actions Reference */}
              <Route path="/bulk-actions" element={<BulkActionsReference />} />

                          {/* Catch-all */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                        <AdminQuickAccess />
                        <QuickSupport />
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
);

export default App;
