import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import RequireRole from "@/components/auth/RequireRole";
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
import AccountSuspension from "./pages/auth/AccountSuspension";
import AccessDenied from "./pages/auth/AccessDenied";

// Super Admin Pages
import SuperAdminDashboard from "./pages/super-admin/Dashboard";
import SuperAdminCommandCenter from "./pages/super-admin/CommandCenter";
import LiveTracking from "./pages/super-admin/LiveTracking";
import RoleManager from "./pages/super-admin/RoleManager";
import UserManager from "./pages/super-admin/UserManager";
import PermissionMatrix from "./pages/super-admin/PermissionMatrix";
import SecurityCenter from "./pages/super-admin/SecurityCenter";
import AuthGateway from "./pages/auth/AuthGateway";

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
import PerformanceManager from "./pages/PerformanceManager";
import FinanceManager from "./pages/FinanceManager";
import ProductDemoManager from "./pages/ProductDemoManager";
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
import { AIBillingDashboard } from "./components/ai-billing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <DomainProtection>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <FloatingAIChatbotWrapper />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/onboard" element={<Homepage />} />
              <Route path="/onboard/:category" element={<CategoryOnboarding />} />
              <Route path="/apply" element={<ApplyPortal />} />

              {/* Global Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/otp-verify" element={<OTPVerify />} />
              <Route path="/device-verify" element={<DeviceVerify />} />
              <Route path="/ip-verify" element={<IPVerify />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/account-suspension" element={<AccountSuspension />} />
              <Route path="/access-denied" element={<AccessDenied />} />

              {/* Super Admin Routes */}
              <Route path="/admin" element={<RequireRole allowed={["super_admin"]}><SuperAdminCommandCenter /></RequireRole>} />
              <Route path="/super-admin" element={<RequireRole allowed={["super_admin"]}><SuperAdminCommandCenter /></RequireRole>} />
              <Route path="/super-admin/dashboard" element={<RequireRole allowed={["super_admin"]}><SuperAdminCommandCenter /></RequireRole>} />
              <Route path="/super-admin/command-center" element={<RequireRole allowed={["super_admin"]}><SuperAdminCommandCenter /></RequireRole>} />
              <Route path="/super-admin/live-tracking" element={<RequireRole allowed={["super_admin"]}><LiveTracking /></RequireRole>} />
              <Route path="/super-admin/role-manager" element={<RequireRole allowed={["super_admin"]}><RoleManager /></RequireRole>} />
              <Route path="/super-admin/user-manager" element={<RequireRole allowed={["super_admin"]}><UserManager /></RequireRole>} />
              <Route path="/super-admin/permission-matrix" element={<RequireRole allowed={["super_admin"]}><PermissionMatrix /></RequireRole>} />
              <Route path="/super-admin/security-center" element={<RequireRole allowed={["super_admin"]}><SecurityCenter /></RequireRole>} />
              <Route path="/super-admin/demo-manager" element={<RequireRole allowed={["super_admin"]}><ProductDemoManager /></RequireRole>} />
              <Route path="/super-admin/system-settings" element={<RequireRole allowed={["super_admin"]}><SystemSettings /></RequireRole>} />
              <Route path="/super-admin/branch-manager" element={<RequireRole allowed={["super_admin"]}><SuperAdminCommandCenter /></RequireRole>} />
              <Route path="/super-admin/lead-engine" element={<RequireRole allowed={["super_admin"]}><SuperAdminCommandCenter /></RequireRole>} />
              <Route path="/super-admin/task-engine" element={<RequireRole allowed={["super_admin"]}><SuperAdminCommandCenter /></RequireRole>} />
              <Route path="/super-admin/developer-manager" element={<RequireRole allowed={["super_admin"]}><SuperAdminCommandCenter /></RequireRole>} />
              <Route path="/super-admin/franchise-manager" element={<RequireRole allowed={["super_admin"]}><FranchiseManagement /></RequireRole>} />
              <Route path="/super-admin/reseller-manager" element={<RequireRole allowed={["super_admin"]}><SuperAdminCommandCenter /></RequireRole>} />
              <Route path="/super-admin/prime-manager" element={<RequireRole allowed={["super_admin"]}><SuperAdminCommandCenter /></RequireRole>} />
              <Route path="/super-admin/influencer-manager" element={<RequireRole allowed={["super_admin"]}><InfluencerManager /></RequireRole>} />
              <Route path="/super-admin/finance-center" element={<RequireRole allowed={["super_admin"]}><FinanceManager /></RequireRole>} />
              <Route path="/super-admin/support-center" element={<RequireRole allowed={["super_admin"]}><SupportDashboard /></RequireRole>} />
              <Route path="/super-admin/ai-billing" element={<RequireRole allowed={["super_admin"]}><AIBillingDashboard /></RequireRole>} />

              {/* Franchise Routes */}
              <Route path="/franchise" element={<FranchiseLayout><FranchiseDashboardPage /></FranchiseLayout>} />
              <Route path="/franchise/dashboard" element={<FranchiseLayout><FranchiseDashboardPage /></FranchiseLayout>} />
              <Route path="/franchise/profile" element={<FranchiseLayout><FranchiseProfile /></FranchiseLayout>} />
              <Route path="/franchise/wallet" element={<FranchiseLayout><FranchiseWalletPage /></FranchiseLayout>} />
              <Route path="/franchise/lead-board" element={<FranchiseLayout><FranchiseLeadBoardPage /></FranchiseLayout>} />
              <Route path="/franchise/assign-lead" element={<FranchiseLayout><FranchiseAssignLead /></FranchiseLayout>} />
              <Route path="/franchise/demo-request" element={<FranchiseLayout><FranchiseDemoRequest /></FranchiseLayout>} />
              <Route path="/franchise/demo-library" element={<FranchiseLayout><FranchiseDemoLibraryPage /></FranchiseLayout>} />
              <Route path="/franchise/sales-center" element={<FranchiseLayout><FranchiseSalesCenter /></FranchiseLayout>} />
              <Route path="/franchise/performance" element={<FranchiseLayout><FranchisePerformancePage /></FranchiseLayout>} />
              <Route path="/franchise/support-ticket" element={<FranchiseLayout><FranchiseSupportTicket /></FranchiseLayout>} />
              <Route path="/franchise/internal-chat" element={<FranchiseLayout><FranchiseInternalChatPage /></FranchiseLayout>} />
              <Route path="/franchise/training-center" element={<FranchiseLayout><FranchiseTrainingCenter /></FranchiseLayout>} />
              <Route path="/franchise/security-panel" element={<FranchiseLayout><FranchiseSecurityPanel /></FranchiseLayout>} />
              <Route path="/franchise/seo-services" element={<FranchiseLayout><FranchiseSEOServices /></FranchiseLayout>} />
              <Route path="/franchise/team-management" element={<FranchiseLayout><FranchiseTeamManagement /></FranchiseLayout>} />
              <Route path="/franchise/crm" element={<FranchiseLayout><FranchiseCRM /></FranchiseLayout>} />
              <Route path="/franchise/hrm" element={<FranchiseLayout><FranchiseHRM /></FranchiseLayout>} />
              <Route path="/franchise/lead-activity" element={<FranchiseLayout><FranchiseLeadActivity /></FranchiseLayout>} />
              <Route path="/franchise-program" element={<FranchiseLanding />} />
              <Route path="/franchise-dashboard" element={<FranchiseDashboard />} />

              {/* Reseller Routes */}
              <Route path="/reseller" element={<ResellerDashboard />} />
              <Route path="/reseller/dashboard" element={<ResellerDashboard />} />
              <Route path="/reseller-program" element={<ResellerLanding />} />
              <Route path="/reseller-dashboard" element={<ResellerDashboard />} />

              {/* Developer Routes */}
              <Route path="/developer" element={<DeveloperDashboard />} />
              <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
              <Route path="/developer-dashboard" element={<DeveloperDashboard />} />

              {/* Influencer Routes */}
              <Route path="/influencer" element={<InfluencerDashboard />} />
              <Route path="/influencer/dashboard" element={<InfluencerDashboard />} />
              <Route path="/influencer-dashboard" element={<InfluencerDashboard />} />
              <Route path="/influencer-manager" element={<InfluencerManager />} />

              {/* Prime User Routes */}
              <Route path="/prime" element={<PrimeUserDashboard />} />
              <Route path="/prime/dashboard" element={<PrimeUserDashboard />} />
              <Route path="/prime-user" element={<PrimeUserDashboard />} />

              {/* Manager Routes */}
              <Route path="/lead-manager" element={<LeadManager />} />
              <Route path="/leads/*" element={<LeadManager />} />
              <Route path="/task-manager" element={<TaskManager />} />
              <Route path="/tasks/*" element={<TaskManager />} />
              <Route path="/demo-manager" element={<ProductDemoManager />} />
              <Route path="/demo" element={<ProductDemoManager />} />
              <Route path="/demos/*" element={<ProductDemoManager />} />
              <Route path="/finance" element={<FinanceManager />} />
              <Route path="/finance/*" element={<FinanceManager />} />
              <Route path="/legal" element={<LegalComplianceManager />} />
              <Route path="/marketing" element={<MarketingManager />} />
              <Route path="/marketing/*" element={<MarketingManager />} />
              <Route path="/enterprise/marketing" element={<MarketingManager />} />
              <Route path="/enterprise/marketing/*" element={<MarketingManager />} />
              <Route path="/performance" element={<PerformanceManager />} />
              <Route path="/performance/*" element={<PerformanceManager />} />
              <Route path="/rnd-dashboard" element={<RnDDashboard />} />
              <Route path="/rnd/*" element={<RnDDashboard />} />
              <Route path="/hr" element={<HRDashboard />} />
              <Route path="/hr/*" element={<HRDashboard />} />
              <Route path="/seo" element={<SEODashboard />} />
              <Route path="/seo/*" element={<SEODashboard />} />
              <Route path="/seo-dashboard" element={<SEODashboard />} />
              <Route path="/support" element={<SupportDashboard />} />
              <Route path="/support/*" element={<SupportDashboard />} />
              <Route path="/support-dashboard" element={<SupportDashboard />} />
              <Route path="/sales-support" element={<SalesSupportDashboard />} />
              <Route path="/sales" element={<SalesSupportDashboard />} />
              <Route path="/sales/*" element={<SalesSupportDashboard />} />
              <Route path="/client-success" element={<ClientSuccessDashboard />} />
              <Route path="/clients/*" element={<ClientSuccessDashboard />} />
              <Route path="/hr-dashboard" element={<HRDashboard />} />
              <Route path="/ai/*" element={<AIOptimizationConsole />} />

              {/* System Routes */}
              <Route path="/system-settings" element={<SystemSettings />} />
              <Route path="/buzzer-console" element={<NotificationBuzzerConsole />} />
              <Route path="/api-integrations" element={<APIIntegrationDashboard />} />
              <Route path="/internal-chat" element={<InternalChat />} />
              <Route path="/personal-chat" element={<PersonalChat />} />
              <Route path="/ai-console" element={<AIOptimizationConsole />} />
              <Route path="/demo-credentials" element={<DemoCredentials />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DomainProtection>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
