import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WireframeLayout } from './WireframeLayout';
import { SuperAdminDashboard } from './screens/SuperAdminDashboard';
import { RoleSelectScreen } from './screens/RoleSelectScreen';
import { LeadManagerScreen } from './screens/LeadManagerScreen';
import { DeveloperScreen } from './screens/DeveloperScreen';
import { FranchiseScreen } from './screens/FranchiseScreen';
import { ResellerScreen } from './screens/ResellerScreen';
import { PrimeUserScreen } from './screens/PrimeUserScreen';
import { DemoManagerScreen } from './screens/DemoManagerScreen';
import { FinanceWalletScreen } from './screens/FinanceWalletScreen';
import { SEOManagerScreen } from './screens/SEOManagerScreen';
import { TaskManagerScreen } from './screens/TaskManagerScreen';
import { RnDScreen } from './screens/RnDScreen';
import { ClientSuccessScreen } from './screens/ClientSuccessScreen';
import { PerformanceManagerScreen } from './screens/PerformanceManagerScreen';
import { LegalComplianceScreen } from './screens/LegalComplianceScreen';
import { HRHiringScreen } from './screens/HRHiringScreen';
import { InfluencerScreen } from './screens/InfluencerScreen';
import { MarketingManagerScreen } from './screens/MarketingManagerScreen';
import { ProductLibraryScreen } from './screens/ProductLibraryScreen';
import { SupportDashboardScreen } from './screens/SupportDashboardScreen';
import { SalesDashboardScreen } from './screens/SalesDashboardScreen';

// Placeholder for remaining screens
function PlaceholderScreen({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">Screen wireframe in development</p>
      </div>
    </div>
  );
}

export function WireframeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WireframeLayout />}>
        <Route index element={<Navigate to="roles" replace />} />
        <Route path="roles" element={<RoleSelectScreen />} />
        <Route path="super-admin" element={<SuperAdminDashboard />} />
        <Route path="admin" element={<PlaceholderScreen title="Admin Dashboard" />} />
        <Route path="lead-manager" element={<LeadManagerScreen />} />
        <Route path="developer" element={<DeveloperScreen />} />
        <Route path="franchise" element={<FranchiseScreen />} />
        <Route path="reseller" element={<ResellerScreen />} />
        <Route path="prime-user" element={<PrimeUserScreen />} />
        <Route path="demo-manager" element={<DemoManagerScreen />} />
        <Route path="finance" element={<FinanceWalletScreen />} />
        <Route path="seo-manager" element={<SEOManagerScreen />} />
        <Route path="task-manager" element={<TaskManagerScreen />} />
        <Route path="rnd" element={<RnDScreen />} />
        <Route path="client-success" element={<ClientSuccessScreen />} />
        <Route path="performance" element={<PerformanceManagerScreen />} />
        <Route path="legal" element={<LegalComplianceScreen />} />
        <Route path="hr" element={<HRHiringScreen />} />
        <Route path="influencer" element={<InfluencerScreen />} />
        <Route path="marketing" element={<MarketingManagerScreen />} />
        <Route path="products" element={<ProductLibraryScreen />} />
        <Route path="support" element={<SupportDashboardScreen />} />
        <Route path="sales" element={<SalesDashboardScreen />} />
        <Route path="ai-console" element={<PlaceholderScreen title="AI Console" />} />
        <Route path="settings" element={<PlaceholderScreen title="Settings" />} />
      </Route>
    </Routes>
  );
}
