import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Homepage from "./pages/Homepage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Index";
import CategoryOnboarding from "./pages/CategoryOnboarding";
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
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
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
import UnifiedSecurityCenter from "./components/security/UnifiedSecurityCenter";
import DomainProtection from "./components/security/DomainProtection";
import PendingItemsSuggestion from "./components/shared/PendingItemsSuggestion";
import FloatingAIChatbotWrapper from "./components/shared/FloatingAIChatbotWrapper";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <DomainProtection>
          <Toaster />
          <Sonner />
          <PendingItemsSuggestion />
          <BrowserRouter>
            <FloatingAIChatbotWrapper />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/onboard/:category" element={<CategoryOnboarding />} />
              <Route path="/franchise" element={<FranchiseManagement />} />
              <Route path="/franchise-program" element={<FranchiseLanding />} />
              <Route path="/franchise-dashboard" element={<FranchiseDashboard />} />
              <Route path="/reseller-program" element={<ResellerLanding />} />
              <Route path="/reseller-dashboard" element={<ResellerDashboard />} />
              <Route path="/reseller" element={<ResellerDashboard />} />
              <Route path="/developer-dashboard" element={<DeveloperDashboard />} />
              <Route path="/developer" element={<DeveloperDashboard />} />
              <Route path="/influencer-dashboard" element={<InfluencerDashboard />} />
              <Route path="/influencer" element={<InfluencerDashboard />} />
              <Route path="/influencer-manager" element={<InfluencerManager />} />
              <Route path="/support-dashboard" element={<SupportDashboard />} />
              <Route path="/seo-dashboard" element={<SEODashboard />} />
              <Route path="/lead-manager" element={<LeadManager />} />
              <Route path="/task-manager" element={<TaskManager />} />
              <Route path="/rnd-dashboard" element={<RnDDashboard />} />
              <Route path="/client-success" element={<ClientSuccessDashboard />} />
              <Route path="/performance" element={<PerformanceManager />} />
              <Route path="/finance" element={<FinanceManager />} />
              <Route path="/super-admin" element={<SuperAdminDashboard />} />
              <Route path="/demo-manager" element={<ProductDemoManager />} />
              <Route path="/prime-user" element={<PrimeUserDashboard />} />
              <Route path="/legal" element={<LegalComplianceManager />} />
              <Route path="/marketing" element={<MarketingManager />} />
              <Route path="/sales-support" element={<SalesSupportDashboard />} />
              <Route path="/hr-dashboard" element={<HRDashboard />} />
              <Route path="/system-settings" element={<SystemSettings />} />
              <Route path="/buzzer-console" element={<NotificationBuzzerConsole />} />
              <Route path="/api-integrations" element={<APIIntegrationDashboard />} />
              <Route path="/apply" element={<ApplyPortal />} />
              <Route path="/internal-chat" element={<InternalChat />} />
              <Route path="/personal-chat" element={<PersonalChat />} />
              <Route path="/security-center" element={<UnifiedSecurityCenter />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DomainProtection>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
