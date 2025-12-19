import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Index";
import FranchiseManagement from "./pages/FranchiseManagement";
import FranchiseLanding from "./pages/FranchiseLanding";
import FranchiseDashboard from "./pages/FranchiseDashboard";
import ResellerLanding from "./pages/ResellerLanding";
import ResellerDashboard from "./pages/ResellerDashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import InfluencerDashboard from "./pages/InfluencerDashboard";
import SupportDashboard from "./pages/SupportDashboard";
import SEODashboard from "./pages/SEODashboard";
import LeadManager from "./pages/LeadManager";
import TaskManager from "./pages/TaskManager";
import RnDDashboard from "./pages/RnDDashboard";
import ClientSuccessDashboard from "./pages/ClientSuccessDashboard";
import PerformanceManager from "./pages/PerformanceManager";
import FinanceManager from "./pages/FinanceManager";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/franchise" element={<FranchiseManagement />} />
          <Route path="/franchise-program" element={<FranchiseLanding />} />
          <Route path="/franchise-dashboard" element={<FranchiseDashboard />} />
          <Route path="/reseller-program" element={<ResellerLanding />} />
          <Route path="/reseller-dashboard" element={<ResellerDashboard />} />
          <Route path="/developer-dashboard" element={<DeveloperDashboard />} />
          <Route path="/influencer-dashboard" element={<InfluencerDashboard />} />
          <Route path="/support-dashboard" element={<SupportDashboard />} />
          <Route path="/seo-dashboard" element={<SEODashboard />} />
          <Route path="/lead-manager" element={<LeadManager />} />
          <Route path="/task-manager" element={<TaskManager />} />
          <Route path="/rnd-dashboard" element={<RnDDashboard />} />
          <Route path="/client-success" element={<ClientSuccessDashboard />} />
          <Route path="/performance" element={<PerformanceManager />} />
          <Route path="/finance" element={<FinanceManager />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
