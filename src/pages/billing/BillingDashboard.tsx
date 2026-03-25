import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt, FileText, RefreshCw, CreditCard, Wallet, Percent,
  Tag, Undo2, BarChart3, Settings, ArrowLeft, Clock, DollarSign,
  TrendingUp, AlertTriangle, CheckCircle, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Screens
import BillingOverview from './screens/BillingOverview';
import InvoicesScreen from './screens/InvoicesScreen';
import SubscriptionsScreen from './screens/SubscriptionsScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import WalletScreen from './screens/WalletScreen';
import TaxesScreen from './screens/TaxesScreen';
import DiscountsScreen from './screens/DiscountsScreen';
import RefundsScreen from './screens/RefundsScreen';
import BillingReports from './screens/BillingReports';
import BillingSettings from './screens/BillingSettings';

type ViewType = 'dashboard' | 'invoices' | 'subscriptions' | 'payments' | 
                'wallet' | 'taxes' | 'discounts' | 'refunds' | 'reports' | 'settings';

const sidebarItems: { id: ViewType; label: string; icon: any; badge?: string }[] = [
  { id: 'dashboard', label: 'Billing Dashboard', icon: Receipt },
  { id: 'invoices', label: 'Invoices', icon: FileText, badge: '12' },
  { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCw },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'wallet', label: 'Wallet & Credits', icon: Wallet },
  { id: 'taxes', label: 'Taxes & Compliance', icon: Percent },
  { id: 'discounts', label: 'Discounts & Coupons', icon: Tag },
  { id: 'refunds', label: 'Refunds & Adjustments', icon: Undo2 },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const BillingDashboard = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const navigate = useNavigate();

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <BillingOverview />;
      case 'invoices': return <InvoicesScreen />;
      case 'subscriptions': return <SubscriptionsScreen />;
      case 'payments': return <PaymentsScreen />;
      case 'wallet': return <WalletScreen />;
      case 'taxes': return <TaxesScreen />;
      case 'discounts': return <DiscountsScreen />;
      case 'refunds': return <RefundsScreen />;
      case 'reports': return <BillingReports />;
      case 'settings': return <BillingSettings />;
      default: return <BillingOverview />;
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* TOP HEADER */}
      <header className="h-14 bg-slate-900/95 backdrop-blur-xl flex items-center justify-between px-6 flex-shrink-0 border-b border-emerald-500/20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Receipt className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <span className="font-semibold text-white">Invoice & Billing</span>
              <span className="text-emerald-400 text-sm ml-2">Management</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="border-slate-600 bg-transparent text-slate-300">
            <Bell className="h-4 w-4 mr-2" />
            3 Alerts
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <FileText className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="w-60 bg-slate-900/80 backdrop-blur-xl flex-shrink-0 border-r border-emerald-500/20 flex flex-col">
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {sidebarItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-400 rounded-r-full" />
                    )}
                    <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-400' : ''}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Finance Notice */}
          <div className="p-4 border-t border-emerald-500/10">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle className="h-3 w-3" />
                <span>Audit Compliant</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">All transactions logged</p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto bg-slate-950 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default BillingDashboard;
