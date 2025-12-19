import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, Zap, Menu, X } from 'lucide-react';
import { FranchiseSidebar } from '@/components/franchise/FranchiseSidebar';
import { FranchiseTopBar } from '@/components/franchise/FranchiseTopBar';
import { TerritoryControlCenter } from '@/components/franchise/TerritoryControlCenter';
import { LeadIntakeBoard } from '@/components/franchise/LeadIntakeBoard';
import { DemoDistributionPanel } from '@/components/franchise/DemoDistributionPanel';
import { ResellerManagementHub } from '@/components/franchise/ResellerManagementHub';
import { CommissionWallet } from '@/components/franchise/CommissionWallet';
import { LocalMarketingSuite } from '@/components/franchise/LocalMarketingSuite';
import { EscalationSupport } from '@/components/franchise/EscalationSupport';
import { TerritoryInsights } from '@/components/franchise/TerritoryInsights';
import { ComplianceGuard } from '@/components/franchise/ComplianceGuard';
import { FranchiseAuditLogs } from '@/components/franchise/FranchiseAuditLogs';

// Dashboard Overview Component
const DashboardOverview = () => {
  const metrics = [
    { label: 'Total Leads', value: '347', change: '+18 today', color: 'primary' },
    { label: 'Conversions', value: '89', change: '+12 this week', color: 'neon-green' },
    { label: 'Active Clients', value: '156', change: '98% satisfied', color: 'neon-teal' },
    { label: 'Pending Delivery', value: '7', change: '3 urgent', color: 'neon-orange' },
    { label: 'Monthly Commission', value: '₹4.2L', change: '+23% vs last', color: 'neon-purple' },
    { label: 'Wallet Balance', value: '₹1.8L', change: 'Withdrawable', color: 'primary' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-mono font-bold text-foreground">
          Welcome Back, <span className="text-primary">Partner</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Your franchise is performing well.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-panel p-4 border border-border/30 hover:border-primary/30 transition-all"
          >
            <span className="text-xs text-muted-foreground">{metric.label}</span>
            <p className="text-2xl font-mono font-bold text-foreground">{metric.value}</p>
            <p className="text-xs text-primary">{metric.change}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const FranchiseDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeItem) {
      case 'territory': return <TerritoryControlCenter />;
      case 'leads': return <LeadIntakeBoard />;
      case 'demos': return <DemoDistributionPanel />;
      case 'resellers': return <ResellerManagementHub />;
      case 'wallet': return <CommissionWallet />;
      case 'marketing': return <LocalMarketingSuite />;
      case 'escalation': return <EscalationSupport />;
      case 'insights': return <TerritoryInsights />;
      case 'compliance': return <ComplianceGuard />;
      case 'audit': return <FranchiseAuditLogs />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(222,47%,4%)] via-[hsl(217,50%,8%)] to-[hsl(220,55%,6%)]">
      <FranchiseSidebar
        activeItem={activeItem}
        onItemChange={setActiveItem}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <FranchiseTopBar
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          mobileMenuOpen={mobileMenuOpen}
        />

        <div className="p-4 lg:p-6">
          {renderContent()}
        </div>

        {/* AI Assistant Indicator */}
        <motion.div
          className="fixed bottom-6 right-6 glass-panel px-4 py-3 rounded-full flex items-center gap-3 cursor-pointer hover:border-primary/50 border border-border/30 transition-all"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className="w-3 h-3 rounded-full bg-neon-green"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-sm text-muted-foreground">AI Assistant Active</span>
          <Bot className="w-4 h-4 text-primary" />
        </motion.div>
      </main>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="absolute left-0 top-0 bottom-0 w-64 glass-panel border-r border-border/30 p-4"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-neon-teal flex items-center justify-center">
                  <Zap className="w-5 h-5 text-background" />
                </div>
                <div>
                  <p className="font-mono font-bold text-sm text-foreground">SOFTWARE VALA</p>
                  <p className="text-[10px] text-primary">Franchise Portal</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FranchiseDashboard;
