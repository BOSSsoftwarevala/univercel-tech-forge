import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, Globe2, Users, Shield, AlertTriangle, 
  Eye, FileText, Lock, Activity, Zap, TrendingUp,
  Clock, Bell
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Module imports
import { OverviewModule } from './modules/OverviewModule';
import { ContinentsModule } from './modules/ContinentsModule';
import { SuperAdminsModule } from './modules/SuperAdminsModule';
import { GlobalRulesModule } from './modules/GlobalRulesModule';
import { ApprovalsModule } from './modules/ApprovalsModule';
import { SecurityMonitorModule } from './modules/SecurityMonitorModule';
import { AuditModule } from './modules/AuditModule';
import { SystemLockModule } from './modules/SystemLockModule';

type ModuleId = 'overview' | 'continents' | 'super-admins' | 'global-rules' | 'approvals' | 'security' | 'audit' | 'system-lock';

interface SidebarModule {
  id: ModuleId;
  label: string;
  icon: React.ElementType;
  theme: string;
  glow: string;
}

const modules: SidebarModule[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid, theme: 'from-slate-900 to-blue-950', glow: 'shadow-blue-500/20' },
  { id: 'continents', label: 'Continents', icon: Globe2, theme: 'from-emerald-950 to-teal-950', glow: 'shadow-emerald-500/20' },
  { id: 'super-admins', label: 'Super Admins', icon: Users, theme: 'from-indigo-950 to-blue-950', glow: 'shadow-amber-500/20' },
  { id: 'global-rules', label: 'Global Rules', icon: Shield, theme: 'from-slate-900 to-cyan-950', glow: 'shadow-cyan-500/20' },
  { id: 'approvals', label: 'Approvals (High Risk)', icon: AlertTriangle, theme: 'from-red-950 to-orange-950', glow: 'shadow-red-500/20' },
  { id: 'security', label: 'Security Monitor', icon: Eye, theme: 'from-green-950 to-emerald-950', glow: 'shadow-green-500/20' },
  { id: 'audit', label: 'Audit (Read-Only)', icon: FileText, theme: 'from-slate-900 to-blue-950', glow: 'shadow-blue-400/20' },
  { id: 'system-lock', label: 'System Lock', icon: Lock, theme: 'from-black to-red-950', glow: 'shadow-red-600/30' },
];

export default function MasterAdminSupreme() {
  const [activeModule, setActiveModule] = useState<ModuleId>('overview');
  const [systemPulse, setSystemPulse] = useState(98.7);
  const [liveActivities, setLiveActivities] = useState<string[]>([]);

  // Simulate live system pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemPulse(prev => {
        const delta = (Math.random() - 0.5) * 0.4;
        return Math.min(100, Math.max(95, prev + delta));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Simulate live activity feed
  useEffect(() => {
    const activities = [
      'Super Admin SA-0012 approved withdrawal ₹45,000',
      'Security alert: Unusual login from Mumbai',
      'Global rule #47 updated by Master Admin',
      'Continent Africa: 12 new leads assigned',
      'High-risk approval pending: User suspension',
      'Audit log exported by Compliance Team',
      'System health check completed',
      'New Super Admin onboarded: SA-0089',
    ];
    
    const interval = setInterval(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setLiveActivities(prev => [randomActivity, ...prev.slice(0, 4)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentModule = modules.find(m => m.id === activeModule)!;

  const renderModule = () => {
    switch (activeModule) {
      case 'overview': return <OverviewModule />;
      case 'continents': return <ContinentsModule />;
      case 'super-admins': return <SuperAdminsModule />;
      case 'global-rules': return <GlobalRulesModule />;
      case 'approvals': return <ApprovalsModule />;
      case 'security': return <SecurityMonitorModule />;
      case 'audit': return <AuditModule />;
      case 'system-lock': return <SystemLockModule />;
      default: return <OverviewModule />;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentModule.theme} transition-all duration-700`}>
      {/* Background grid pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Ambient glow */}
      <div className={`fixed top-0 left-1/3 w-96 h-96 rounded-full blur-[150px] opacity-20 pointer-events-none transition-colors duration-700 ${currentModule.glow.replace('shadow-', 'bg-').replace('/20', '').replace('/30', '')}`} />

      <div className="flex min-h-screen relative z-10">
        {/* 3D Glass Sidebar */}
        <aside className="fixed left-0 top-0 bottom-0 w-72 z-50">
          <div className="h-full m-3 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-slate-900 animate-pulse" />
                </div>
                <div>
                  <h1 className="font-bold text-white text-lg">Supreme Control</h1>
                  <p className="text-xs text-white/50">Master Admin Console</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="h-[calc(100vh-200px)]">
              <nav className="p-3 space-y-1">
                {modules.map((module, index) => {
                  const isActive = activeModule === module.id;
                  return (
                    <motion.button
                      key={module.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: isActive ? 0 : 6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveModule(module.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left relative overflow-hidden group ${
                        isActive
                          ? 'bg-white/10 text-white shadow-lg'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                      style={{
                        transform: isActive ? 'translateZ(20px)' : 'translateZ(0)',
                      }}
                    >
                      {/* Active glow effect */}
                      {isActive && (
                        <motion.div
                          layoutId="activeGlow"
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl"
                        />
                      )}
                      
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeBar"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full"
                        />
                      )}

                      <div className={`relative z-10 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                        isActive 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30' 
                          : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        <module.icon className="w-4 h-4" />
                      </div>
                      <span className="relative z-10 font-medium text-sm">{module.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </ScrollArea>

            {/* Bottom status */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/60">All systems operational</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-72">
          {/* Top Command Bar */}
          <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/20 border-b border-white/10">
            <div className="px-6 py-4 flex items-center justify-between">
              {/* Left: Module title */}
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                  activeModule === 'overview' ? 'from-blue-500 to-blue-600' :
                  activeModule === 'continents' ? 'from-emerald-500 to-teal-600' :
                  activeModule === 'super-admins' ? 'from-amber-500 to-orange-600' :
                  activeModule === 'global-rules' ? 'from-cyan-500 to-blue-600' :
                  activeModule === 'approvals' ? 'from-red-500 to-orange-600' :
                  activeModule === 'security' ? 'from-green-500 to-emerald-600' :
                  activeModule === 'audit' ? 'from-blue-400 to-indigo-600' :
                  'from-red-600 to-red-800'
                } flex items-center justify-center shadow-lg`}>
                  {React.createElement(currentModule.icon, { className: 'w-5 h-5 text-white' })}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{currentModule.label}</h2>
                  <p className="text-xs text-white/50">Real-time data • Auto-refresh enabled</p>
                </div>
              </div>

              {/* Center: System Pulse */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <Activity className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-xs text-white/50">System Pulse</p>
                    <p className="text-sm font-bold text-green-400">{systemPulse.toFixed(1)}%</p>
                  </div>
                  <div className="w-16 h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                      animate={{ width: `${systemPulse}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-xs text-white/50">Session</p>
                    <p className="text-sm font-bold text-white">Active</p>
                  </div>
                </div>
              </div>

              {/* Right: Notifications */}
              <div className="flex items-center gap-3">
                <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <Bell className="w-5 h-5 text-white/70" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">3</span>
                </button>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-medium text-amber-300">Rental Active</span>
                </div>
              </div>
            </div>

            {/* Live Activity Ticker */}
            <div className="px-6 py-2 border-t border-white/5 bg-black/10 overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-blue-500/20 border border-blue-500/30">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-[10px] font-medium text-blue-300 uppercase tracking-wide">Live</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={liveActivities[0]}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs text-white/60 truncate"
                    >
                      {liveActivities[0] || 'Monitoring system activity...'}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </header>

          {/* Module Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                {renderModule()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
