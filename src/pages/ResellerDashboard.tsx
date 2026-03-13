/**
 * RESELLER DASHBOARD - WHMCS CLIENT AREA CLONE
 * Enterprise standalone module with professional hosting panel aesthetic
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import ResellerWHMCSSidebar, { ResellerView } from '@/components/reseller/ResellerWHMCSSidebar';

// Section components
import ResellerWHMCSDashboard from '@/components/reseller/sections/ResellerWHMCSDashboard';
import ResellerSalesPanel from '@/components/reseller/sections/ResellerSalesPanel';
import ResellerProductsPanel from '@/components/reseller/sections/ResellerProductsPanel';
import ResellerOrdersPanel from '@/components/reseller/sections/ResellerOrdersPanel';
import ResellerCommissionsPanel from '@/components/reseller/sections/ResellerCommissionsPanel';
import ResellerPayoutPanel from '@/components/reseller/sections/ResellerPayoutPanel';
import ResellerClientsPanel from '@/components/reseller/sections/ResellerClientsPanel';
import ResellerSupportPanel from '@/components/reseller/sections/ResellerSupportPanel';
import ResellerReportsPanel from '@/components/reseller/sections/ResellerReportsPanel';
import ResellerProfileSettings from '@/components/reseller/sections/ResellerProfileSettings';

const ResellerDashboard = () => {
  const [activeView, setActiveView] = useState<ResellerView>('dash_overview');
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const renderContent = () => {
    if (activeView.startsWith('dash_')) return <ResellerWHMCSDashboard activeView={activeView} onNavigate={setActiveView} />;
    if (activeView.startsWith('sales_')) return <ResellerSalesPanel activeView={activeView} />;
    if (activeView.startsWith('prod_')) return <ResellerProductsPanel activeView={activeView} />;
    if (activeView.startsWith('ord_')) return <ResellerOrdersPanel activeView={activeView} />;
    if (activeView.startsWith('comm_')) return <ResellerCommissionsPanel activeView={activeView} />;
    if (activeView.startsWith('pay_')) return <ResellerPayoutPanel activeView={activeView} />;
    if (activeView.startsWith('cli_')) return <ResellerClientsPanel activeView={activeView} />;
    if (activeView.startsWith('sup_')) return <ResellerSupportPanel activeView={activeView} />;
    if (activeView.startsWith('rpt_')) return <ResellerReportsPanel activeView={activeView} />;
    if (activeView.startsWith('set_')) return <ResellerProfileSettings activeView={activeView} />;
    return <ResellerWHMCSDashboard activeView="dash_overview" onNavigate={setActiveView} />;
  };

  const viewLabel = activeView
    .replace(/^(dash_|sales_|prod_|ord_|comm_|pay_|cli_|sup_|rpt_|set_)/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="h-screen flex w-full overflow-hidden" style={{ background: '#f4f6f9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <ResellerWHMCSSidebar activeView={activeView} onViewChange={setActiveView} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* WHMCS-style top header */}
        <header className="h-[50px] flex items-center justify-between px-6 flex-shrink-0" style={{ background: '#1a1f36' }}>
          <div className="flex items-center gap-4">
            <h1 className="text-[15px] font-semibold text-white">Reseller Portal</h1>
            <span className="text-[12px] text-white/20">|</span>
            <span className="text-[13px] text-white/60">{viewLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(78,115,223,0.15)' }}>
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-[11px] text-green-400 font-medium">Active</span>
            </div>
            <button
              className="px-3 py-1.5 rounded text-white text-[12px] font-medium transition-colors"
              style={{ background: '#4e73df' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#3d5fc4')}
              onMouseLeave={e => (e.currentTarget.style.background = '#4e73df')}
            >
              + New Order
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ResellerDashboard;
