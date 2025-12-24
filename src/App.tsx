import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { AnimationProvider } from "./contexts/AnimationContext";
import { DemoTestModeProvider } from "./contexts/DemoTestModeContext";
import { SecurityProvider } from "./contexts/SecurityContext";
import RequireRole from "@/components/auth/RequireRole";
import RequireAuth from "@/components/auth/RequireAuth";
import GlobalOfferPopup from "@/components/offers/GlobalOfferPopup";
import Homepage from "./pages/Homepage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CategoryOnboarding from "./pages/CategoryOnboarding";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
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

// Public Pages
import PublicDemos from "./pages/demos/PublicDemos";
import SimpleDemoList from "./pages/SimpleDemoList";
import SimpleDemoView from "./pages/SimpleDemoView";
import SimpleCheckout from "./pages/SimpleCheckout";
import SimpleUserDashboard from "./pages/SimpleUserDashboard";
import DemoAccess from "./pages/DemoAccess";
import DemoDirectory from "./pages/DemoDirectory";

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
import AuthGateway from "./pages/auth/AuthGateway";
import ComplianceCenter from "./pages/super-admin/ComplianceCenter";

// Master Admin Pages
import MasterAdminDashboard from "./pages/master-admin/MasterAdminDashboard";
import BootstrapAdmins from "./pages/admin/BootstrapAdmins";

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
import DeveloperDashboard from "./pages/DeveloperDashboard";
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
import InternalChat from "./pages/InternalChat";
import PersonalChat from "./pages/PersonalChat";
import DomainProtection from "./components/security/DomainProtection";
import FloatingAIChatbotWrapper from "./components/shared/FloatingAIChatbotWrapper";
import AIOptimizationConsole from "./pages/ai-console/AIOptimizationConsole";
import DemoCredentials from "./pages/DemoCredentials";
import SectorsBrowse from "./pages/SectorsBrowse";
import SubCategoryDemos from "./pages/SubCategoryDemos";
import { AIBillingDashboard } from "./components/ai-billing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DemoTestModeProvider>
        <AnimationProvider>
          <TooltipProvider>
            <DomainProtection>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <SecurityProvider>
                  <GlobalOfferPopup />
                  <FloatingAIChatbotWrapper />
              <Routes>
              {/* Public Routes - No login required */}
              <Route path="/" element={<Homepage />} />
              <Route path="/demos" element={<SimpleDemoList />} />
              <Route path="/demo/:demoId" element={<SimpleDemoView />} />
              <Route path="/checkout/:demoId" element={<SimpleCheckout />} />
              <Route path="/user-dashboard" element={<SimpleUserDashboard />} />
              <Route path="/pricing" element={<SimpleDemoList />} />
              <Route path="/demos/public" element={<PublicDemos />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pending-approval" element={<PendingApproval />} />
              <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
              <Route path="/change-password" element={<RequireAuth><ChangePassword /></RequireAuth>} />
              <Route path="/onboard" element={<Homepage />} />
              <Route path="/onboard/:category" element={<CategoryOnboarding />} />
              <Route path="/apply" element={<SimpleDemoList />} />
              {/* Bootstrap is Master-only after initial setup */}
              <Route path="/bootstrap-admins" element={<RequireRole allowed={["master"]} masterOnly><BootstrapAdmins /></RequireRole>} />
              <Route path="/sectors" element={<SectorsBrowse />} />
              <Route path="/sectors/:sectorId/:subCategoryId" element={<SubCategoryDemos />} />
              
              {/* One-Click Demo Access - No Login Required */}
              <Route path="/demo-directory" element={<DemoDirectory />} />
              <Route path="/demo/:role" element={<DemoAccess />} />

              {/* Global Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/otp-verify" element={<OTPVerify />} />
              <Route path="/device-verify" element={<DeviceVerify />} />
              <Route path="/ip-verify" element={<IPVerify />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/account-suspension" element={<AccountSuspension />} />
              <Route path="/access-denied" element={<AccessDenied />} />

              {/* Master Admin Routes - MASTER ONLY */}
              <Route path="/master-admin" element={<RequireRole allowed={["master"]} masterOnly><MasterAdminDashboard /></RequireRole>} />
              <Route path="/master-admin/*" element={<RequireRole allowed={["master"]} masterOnly><MasterAdminDashboard /></RequireRole>} />

              {/* Super Admin Routes - Super Admin and Master can access */}
              <Route path="/admin" element={<RequireRole allowed={["master", "super_admin"]}><SuperAdminCommandCenter /></RequireRole>} />
              <Route path="/super-admin" element={<RequireRole allowed={["master", "super_admin"]}><SuperAdminCommandCenter /></RequireRole>} />
              <Route path="/super-admin/dashboard" element={<RequireRole allowed={["master", "super_admin"]}><SuperAdminCommandCenter /></RequireRole>} />
              <Route path="/super-admin/command-center" element={<RequireRole allowed={["master", "super_admin"]}><SuperAdminCommandCenter /></RequireRole>} />
              <Route path="/super-admin/live-tracking" element={<RequireRole allowed={["master", "super_admin"]}><LiveTracking /></RequireRole>} />
              <Route path="/super-admin/role-manager" element={<RequireRole allowed={["master", "super_admin"]}><RoleManager /></RequireRole>} />
              <Route path="/super-admin/user-manager" element={<RequireRole allowed={["master", "super_admin"]}><UserManager /></RequireRole>} />
              <Route path="/super-admin/permission-matrix" element={<RequireRole allowed={["master", "super_admin"]}><PermissionMatrix /></RequireRole>} />
              <Route path="/super-admin/security-center" element={<RequireRole allowed={["master", "super_admin"]}><SecurityCenter /></RequireRole>} />
              <Route path="/super-admin/demo-manager" element={<RequireRole allowed={["master", "super_admin"]}><ProductDemoManager /></RequireRole>} />
              <Route path="/super-admin/product-manager" element={<RequireRole allowed={["master", "super_admin"]}><ProductManagerPage /></RequireRole>} />
              <Route path="/super-admin/system-settings" element={<RequireRole allowed={["master", "super_admin"]}><SystemSettings /></RequireRole>} />
              <Route path="/super-admin/system-audit" element={<RequireRole allowed={["master", "super_admin"]}><SystemAudit /></RequireRole>} />
              <Route path="/super-admin/prime-manager" element={<RequireRole allowed={["super_admin"]}><PrimeManager /></RequireRole>} />
              <Route path="/super-admin/influencer-manager" element={<RequireRole allowed={["super_admin"]}><InfluencerManager /></RequireRole>} />
              <Route path="/super-admin/finance-center" element={<RequireRole allowed={["super_admin"]}><FinanceManager /></RequireRole>} />
              <Route path="/super-admin/support-center" element={<RequireRole allowed={["super_admin"]}><SupportDashboard /></RequireRole>} />
              <Route path="/super-admin/ai-billing" element={<RequireRole allowed={["super_admin"]}><AIBillingDashboard /></RequireRole>} />
              <Route path="/super-admin/franchise-manager" element={<RequireRole allowed={["super_admin"]}><FranchiseManagement /></RequireRole>} />
              <Route path="/super-admin/compliance-center" element={<RequireRole allowed={["master", "super_admin"]}><ComplianceCenter /></RequireRole>} />

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
              <Route path="/reseller-program" element={<ResellerLanding />} />
              <Route path="/reseller-landing" element={<ResellerLanding />} />
              <Route path="/reseller-dashboard" element={<RequireRole allowed={["reseller", "super_admin"]}><ResellerDashboard /></RequireRole>} />

              {/* Developer Routes */}
              <Route path="/developer" element={<RequireRole allowed={["developer", "super_admin"]}><DeveloperDashboard /></RequireRole>} />
              <Route path="/developer/dashboard" element={<RequireRole allowed={["developer", "super_admin"]}><DeveloperDashboard /></RequireRole>} />
              <Route path="/developer-dashboard" element={<RequireRole allowed={["developer", "super_admin"]}><DeveloperDashboard /></RequireRole>} />

              {/* Influencer Routes */}
              <Route path="/influencer" element={<RequireRole allowed={["influencer", "super_admin"]}><InfluencerDashboard /></RequireRole>} />
              <Route path="/influencer/dashboard" element={<RequireRole allowed={["influencer", "super_admin"]}><InfluencerDashboard /></RequireRole>} />
              <Route path="/influencer-dashboard" element={<RequireRole allowed={["influencer", "super_admin"]}><InfluencerDashboard /></RequireRole>} />
              <Route path="/influencer-manager" element={<RequireRole allowed={["super_admin"]}><InfluencerManager /></RequireRole>} />

              {/* Prime User Routes */}
              <Route path="/prime" element={<RequireRole allowed={["prime", "super_admin"]}><PrimeUserDashboard /></RequireRole>} />
              <Route path="/prime/dashboard" element={<RequireRole allowed={["prime", "super_admin"]}><PrimeUserDashboard /></RequireRole>} />
              <Route path="/prime-user" element={<RequireRole allowed={["prime", "super_admin"]}><PrimeUserDashboard /></RequireRole>} />

              {/* Manager Routes - PROTECTED BY ROLE */}
              <Route path="/lead-manager" element={<RequireRole allowed={["lead_manager", "super_admin"]}><LeadManager /></RequireRole>} />
              <Route path="/leads/*" element={<RequireRole allowed={["lead_manager", "super_admin"]}><LeadManager /></RequireRole>} />
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

              {/* System Routes - SUPER ADMIN ONLY */}
              <Route path="/system-settings" element={<RequireRole allowed={["super_admin"]}><SystemSettings /></RequireRole>} />
              <Route path="/buzzer-console" element={<RequireRole allowed={["super_admin"]}><NotificationBuzzerConsole /></RequireRole>} />
              <Route path="/api-integrations" element={<RequireRole allowed={["super_admin"]}><APIIntegrationDashboard /></RequireRole>} />
              <Route path="/internal-chat" element={<RequireAuth><InternalChat /></RequireAuth>} />
              <Route path="/personal-chat" element={<RequireAuth><PersonalChat /></RequireAuth>} />
              <Route path="/ai-console" element={<RequireRole allowed={["ai_manager", "super_admin"]}><AIOptimizationConsole /></RequireRole>} />
              <Route path="/demo-credentials" element={<RequireRole allowed={["super_admin"]}><DemoCredentials /></RequireRole>} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
                </SecurityProvider>
            </BrowserRouter>
          </DomainProtection>
        </TooltipProvider>
      </AnimationProvider>
    </DemoTestModeProvider>
  </AuthProvider>
</QueryClientProvider>
);

export default App;
