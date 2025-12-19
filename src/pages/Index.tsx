import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopControlBar from '@/components/layout/TopControlBar';
import Sidebar from '@/components/layout/Sidebar';
import MetricCard from '@/components/dashboard/MetricCard';
import StatusPanel from '@/components/dashboard/StatusPanel';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import QuickActions from '@/components/dashboard/QuickActions';
import WalletOverview from '@/components/dashboard/WalletOverview';
import DemoStatus from '@/components/dashboard/DemoStatus';
import AIEnginePanel from '@/components/dashboard/AIEnginePanel';
import TeamPerformance from '@/components/dashboard/TeamPerformance';
import SecurityCompliance from '@/components/dashboard/SecurityCompliance';
import { 
  Building2, 
  Users, 
  Code2, 
  DollarSign,
  HeadphonesIcon,
  PlayCircle,
  Bot,
  TrendingUp,
  Menu,
  X
} from 'lucide-react';

const Index = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const franchiseStats = [
    { label: 'Active Franchises', value: 42, max: 50, color: 'bg-gradient-to-r from-neon-cyan to-neon-teal' },
    { label: 'Pending Approvals', value: 7, max: 10, color: 'bg-gradient-to-r from-neon-orange to-neon-red' },
    { label: 'Territory Coverage', value: 28, max: 35, color: 'bg-gradient-to-r from-neon-green to-neon-teal' },
  ];

  const developerStats = [
    { label: 'Active Tasks', value: 127, max: 150, color: 'bg-gradient-to-r from-neon-purple to-neon-blue' },
    { label: 'Code Reviews', value: 34, max: 40, color: 'bg-gradient-to-r from-neon-cyan to-primary' },
    { label: 'Deployments', value: 12, max: 15, color: 'bg-gradient-to-r from-neon-green to-neon-teal' },
  ];

  return (
    <div className="min-h-screen bg-background grid-lines">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-teal/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Top Control Bar */}
      <TopControlBar />

      {/* Sidebar Toggle for Mobile */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="fixed top-16 left-4 z-50 p-2 glass-panel rounded-lg lg:hidden"
      >
        {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div className={`hidden lg:block`}>
        <Sidebar
          activeItem={activeItem}
          onItemClick={setActiveItem}
          collapsed={sidebarCollapsed}
        />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="lg:hidden fixed inset-0 z-40"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarCollapsed(true)} />
            <Sidebar
              activeItem={activeItem}
              onItemClick={(id) => {
                setActiveItem(id);
                setSidebarCollapsed(true);
              }}
              collapsed={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`transition-all duration-300 pt-14 ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
        <div className="p-4 lg:p-6 space-y-6">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold font-mono text-foreground">
                Command <span className="neon-text">Center</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Software Vala Super Admin • Full System Control
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="command-button">
                Export Report
              </button>
              <button className="command-button-primary">
                System Settings
              </button>
            </div>
          </motion.div>

          {/* Top Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Franchises"
              value="42"
              change={8.2}
              changeLabel="vs last month"
              icon={<Building2 className="w-5 h-5" />}
              trend="up"
              delay={0.1}
            />
            <MetricCard
              title="Total Resellers"
              value="156"
              change={12.4}
              changeLabel="vs last month"
              icon={<Users className="w-5 h-5" />}
              trend="up"
              delay={0.15}
            />
            <MetricCard
              title="Developer Tasks"
              value="127"
              change={-3.2}
              changeLabel="pending"
              icon={<Code2 className="w-5 h-5" />}
              trend="down"
              delay={0.2}
            />
            <MetricCard
              title="Revenue Today"
              value="$84.7K"
              change={15.8}
              changeLabel="+$11.2K vs yesterday"
              icon={<DollarSign className="w-5 h-5" />}
              trend="up"
              delay={0.25}
            />
          </div>

          {/* Second Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Support Tickets"
              value="23"
              change={-45}
              changeLabel="open tickets"
              icon={<HeadphonesIcon className="w-5 h-5" />}
              trend="down"
              delay={0.3}
            />
            <MetricCard
              title="Demo Sessions"
              value="89"
              change={22.1}
              changeLabel="this week"
              icon={<PlayCircle className="w-5 h-5" />}
              trend="up"
              delay={0.35}
            />
            <MetricCard
              title="AI Resolutions"
              value="847"
              change={34.5}
              changeLabel="auto-handled"
              icon={<Bot className="w-5 h-5" />}
              trend="up"
              delay={0.4}
            />
            <MetricCard
              title="Conversion Rate"
              value="24.8%"
              change={4.2}
              changeLabel="from demos"
              icon={<TrendingUp className="w-5 h-5" />}
              trend="up"
              delay={0.45}
            />
          </div>

          {/* Quick Actions */}
          <QuickActions delay={0.5} />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <StatusPanel title="Franchise Overview" items={franchiseStats} delay={0.55} />
              <StatusPanel title="Developer Metrics" items={developerStats} delay={0.6} />
              <SecurityCompliance delay={0.65} />
            </div>

            {/* Center Column */}
            <div className="space-y-6">
              <AIEnginePanel delay={0.7} />
              <DemoStatus delay={0.75} />
              <TeamPerformance delay={0.8} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <WalletOverview delay={0.85} />
              <ActivityFeed delay={0.9} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;