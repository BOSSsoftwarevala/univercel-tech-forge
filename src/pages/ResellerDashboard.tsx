import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Zap, 
  Menu, 
  X,
  Users,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  Activity,
  Target,
  Link2,
  MessageSquare
} from 'lucide-react';
import { ResellerSidebar } from '@/components/reseller/ResellerSidebar';
import { ResellerTopBar } from '@/components/reseller/ResellerTopBar';
import { LeadInboxReseller } from '@/components/reseller/LeadInboxReseller';
import { DemoSharingHub } from '@/components/reseller/DemoSharingHub';
import { SalesScriptAI } from '@/components/reseller/SalesScriptAI';
import { ResellerWallet } from '@/components/reseller/ResellerWallet';
import { CustomerChatMasked } from '@/components/reseller/CustomerChatMasked';
import { MarketingToolkit } from '@/components/reseller/MarketingToolkit';
import { ResellerPerformanceBoard } from '@/components/reseller/ResellerPerformanceBoard';
import { MicroTrainingLessons } from '@/components/reseller/MicroTrainingLessons';
import ResellerEscalations from '@/components/reseller/ResellerEscalations';
import ResellerTargets from '@/components/reseller/ResellerTargets';
import { Badge } from '@/components/ui/badge';

// Command Overview Dashboard
const CommandOverview = () => {
  const metrics = [
    { 
      label: 'Total Leads', 
      value: '234', 
      change: '+18 this week', 
      icon: Users,
      iconColor: 'from-[hsl(200,80%,45%)] to-[hsl(200,80%,55%)]',
      borderColor: 'border-[hsl(200,80%,50%)]'
    },
    { 
      label: 'Pending Follow-ups', 
      value: '15', 
      change: '3 urgent', 
      icon: Clock,
      iconColor: 'from-[hsl(35,90%,50%)] to-[hsl(35,90%,60%)]',
      borderColor: 'border-[hsl(35,90%,55%)]'
    },
    { 
      label: 'Conversions', 
      value: '42', 
      change: '+8 this month', 
      icon: CheckCircle,
      iconColor: 'from-[hsl(160,70%,40%)] to-[hsl(160,70%,50%)]',
      borderColor: 'border-[hsl(160,70%,45%)]'
    },
    { 
      label: 'Conversion Rate', 
      value: '18%', 
      change: '+2.5% vs last month', 
      icon: Activity,
      iconColor: 'from-[hsl(280,70%,50%)] to-[hsl(280,70%,60%)]',
      borderColor: 'border-[hsl(280,70%,55%)]'
    },
    { 
      label: 'Commission', 
      value: '₹1.26L', 
      change: '₹15K pending', 
      icon: Wallet,
      iconColor: 'from-[hsl(45,90%,50%)] to-[hsl(45,90%,60%)]',
      borderColor: 'border-[hsl(45,90%,55%)]'
    },
    { 
      label: 'Monthly Target', 
      value: '78%', 
      change: '₹22K to goal', 
      icon: Target,
      iconColor: 'from-[hsl(340,70%,50%)] to-[hsl(340,70%,60%)]',
      borderColor: 'border-[hsl(340,70%,55%)]'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Command Overview
          </h1>
          <p className="text-sm text-[hsl(220,20%,60%)] mt-1">Real-time sales metrics</p>
        </div>
        <Badge className="bg-[hsl(160,70%,45%)]/20 text-[hsl(160,70%,55%)] border border-[hsl(160,70%,45%)]/30 px-3 py-1">
          <Activity className="w-3 h-3 mr-1.5" />
          All systems operational
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`relative p-5 rounded-2xl bg-[hsl(220,50%,12%)]/80 border ${metric.borderColor}/30 hover:border-opacity-60 transition-all group overflow-hidden`}
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.iconColor} flex items-center justify-center mb-4 shadow-lg`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>

              {/* Label */}
              <p className="text-sm text-[hsl(220,20%,60%)] mb-1">{metric.label}</p>
              
              {/* Value */}
              <p className="text-3xl font-bold text-white mb-2">{metric.value}</p>
              
              {/* Change */}
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[hsl(160,70%,55%)]" />
                <span className="text-xs text-[hsl(160,70%,55%)]">{metric.change}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'View Leads', icon: Users, color: 'hsl(200,80%,50%)' },
          { label: 'Share Demo', icon: Link2, color: 'hsl(45,90%,55%)' },
          { label: 'Customer Chat', icon: MessageSquare, color: 'hsl(160,70%,50%)' },
          { label: 'AI Scripts', icon: Bot, color: 'hsl(280,70%,55%)' },
        ].map((action, index) => {
          const IconComponent = action.icon;
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="p-4 rounded-xl bg-[hsl(220,50%,12%)]/60 border border-[hsl(200,80%,40%)]/20 hover:border-[hsl(200,80%,50%)]/40 transition-all group"
              whileHover={{ y: -2 }}
            >
              <IconComponent 
                className="w-5 h-5 mb-2 transition-colors" 
                style={{ color: action.color }}
              />
              <p className="text-sm text-[hsl(220,20%,70%)] group-hover:text-white transition-colors">
                {action.label}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

const ResellerDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeItem) {
      case 'leads': return <LeadInboxReseller />;
      case 'demos': return <DemoSharingHub />;
      case 'scripts': return <SalesScriptAI />;
      case 'wallet': return <ResellerWallet />;
      case 'chat': return <CustomerChatMasked />;
      case 'marketing': return <MarketingToolkit />;
      case 'performance': return <ResellerPerformanceBoard />;
      case 'training': return <MicroTrainingLessons />;
      default: return <CommandOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(220,55%,6%)]">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, hsl(200,80%,50%)/0.08 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, hsl(260,70%,55%)/0.05 0%, transparent 40%),
            radial-gradient(circle at 40% 80%, hsl(160,70%,50%)/0.05 0%, transparent 40%)
          `
        }} />
      </div>

      <ResellerSidebar
        activeItem={activeItem}
        onItemChange={setActiveItem}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      <main className={`relative transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <ResellerTopBar
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          mobileMenuOpen={mobileMenuOpen}
        />

        <div className="p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* AI Assistant */}
        <motion.div
          className="fixed bottom-6 right-6 bg-[hsl(220,50%,12%)]/90 backdrop-blur-xl px-4 py-3 rounded-full flex items-center gap-3 cursor-pointer border border-[hsl(200,80%,40%)]/30 hover:border-[hsl(200,80%,50%)]/50 transition-all shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-[hsl(160,70%,50%)]"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-sm text-[hsl(220,20%,70%)]">AI Replying to 3 leads</span>
          <Bot className="w-4 h-4 text-[hsl(200,80%,60%)]" />
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
            <div className="absolute inset-0 bg-[hsl(220,55%,4%)]/90 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="absolute left-0 top-0 bottom-0 w-64 bg-[hsl(220,60%,8%)] border-r border-[hsl(200,80%,40%)]/20 p-4"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(200,80%,50%)] to-[hsl(260,70%,55%)] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">SOFTWARE VALA</p>
                  <p className="text-[10px] text-[hsl(200,80%,60%)]">Reseller Portal</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResellerDashboard;
