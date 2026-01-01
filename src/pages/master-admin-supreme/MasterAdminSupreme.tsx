import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, Globe2, Users, Shield, AlertTriangle, 
  Eye, FileText, Lock, Activity, Zap, TrendingUp,
  Clock, Bell, Box, Brain, Radio, Lightbulb, HeartHandshake, Radar
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

// Engines
import { BlackboxProvider, BlackboxMini } from './engines/BlackboxEngine';
import { AIWatcherProvider } from './engines/AIWatcherEngine';
import { LiveActivityProvider, LiveActivityTicker } from './engines/LiveActivityEngine';

// Module imports
import { OverviewModule } from './modules/OverviewModule';
import { ContinentsModule } from './modules/ContinentsModule';
import { SuperAdminsModule } from './modules/SuperAdminsModule';
import { GlobalRulesModule } from './modules/GlobalRulesModule';
import { ApprovalsModule } from './modules/ApprovalsModule';
import { SecurityMonitorModule } from './modules/SecurityMonitorModule';
import { AuditModule } from './modules/AuditModule';
import { SystemLockModule } from './modules/SystemLockModule';
import { RnDControlModule } from './modules/RnDControlModule';
import { ClientSuccessControlModule } from './modules/ClientSuccessControlModule';
import { AISurveillanceModule } from './modules/AISurveillanceModule';

type ModuleId = 'overview' | 'continents' | 'super-admins' | 'global-rules' | 'approvals' | 'security' | 'audit' | 'system-lock' | 'rnd' | 'client-success' | 'ai-surveillance';

interface SidebarModule {
  id: ModuleId;
  label: string;
  icon: React.ElementType;
  theme: string;
  glow: string;
  accentColor: string;
  isAIOperated?: boolean;
}

const modules: SidebarModule[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid, theme: 'from-black via-slate-950 to-blue-950', glow: 'shadow-blue-500/20', accentColor: 'blue' },
  { id: 'ai-surveillance', label: 'AI Surveillance', icon: Radar, theme: 'from-black via-cyan-950 to-blue-950', glow: 'shadow-cyan-500/20', accentColor: 'cyan', isAIOperated: true },
  { id: 'continents', label: 'Continents', icon: Globe2, theme: 'from-black via-emerald-950 to-teal-950', glow: 'shadow-emerald-500/20', accentColor: 'emerald' },
  { id: 'super-admins', label: 'Super Admins', icon: Users, theme: 'from-black via-indigo-950 to-blue-950', glow: 'shadow-amber-500/20', accentColor: 'amber' },
  { id: 'global-rules', label: 'Global Rules', icon: Shield, theme: 'from-black via-slate-950 to-cyan-950', glow: 'shadow-cyan-500/20', accentColor: 'cyan' },
  { id: 'approvals', label: 'Approvals', icon: AlertTriangle, theme: 'from-black via-red-950 to-orange-950', glow: 'shadow-red-500/20', accentColor: 'red' },
  { id: 'security', label: 'Security Monitor', icon: Eye, theme: 'from-black via-green-950 to-emerald-950', glow: 'shadow-green-500/20', accentColor: 'green' },
  { id: 'rnd', label: 'R&D Control', icon: Lightbulb, theme: 'from-black via-violet-950 to-purple-950', glow: 'shadow-violet-500/20', accentColor: 'violet', isAIOperated: true },
  { id: 'client-success', label: 'Client Success', icon: HeartHandshake, theme: 'from-black via-rose-950 to-pink-950', glow: 'shadow-rose-500/20', accentColor: 'rose', isAIOperated: true },
  { id: 'audit', label: 'Audit', icon: FileText, theme: 'from-black via-slate-950 to-blue-950', glow: 'shadow-blue-400/20', accentColor: 'blue' },
  { id: 'system-lock', label: 'System Lock', icon: Lock, theme: 'from-black to-red-950', glow: 'shadow-red-600/30', accentColor: 'red' },
];

function MasterAdminContent() {
  const [activeModule, setActiveModule] = useState<ModuleId>('overview');
  const [systemPulse, setSystemPulse] = useState(98.7);

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

  const currentModule = modules.find(m => m.id === activeModule)!;

  const renderModule = () => {
    switch (activeModule) {
      case 'overview': return <OverviewModule />;
      case 'ai-surveillance': return <AISurveillanceModule />;
      case 'continents': return <ContinentsModule />;
      case 'super-admins': return <SuperAdminsModule />;
      case 'global-rules': return <GlobalRulesModule />;
      case 'approvals': return <ApprovalsModule />;
      case 'security': return <SecurityMonitorModule />;
      case 'rnd': return <RnDControlModule />;
      case 'client-success': return <ClientSuccessControlModule />;
      case 'audit': return <AuditModule />;
      case 'system-lock': return <SystemLockModule />;
      default: return <OverviewModule />;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentModule.theme} transition-all duration-700`}>
      {/* Deep background layers */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        {/* Radial glow */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full blur-[200px] opacity-10 bg-blue-500" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[150px] opacity-10 bg-purple-500" />
      </div>

      <div className="flex min-h-screen relative z-10">
        {/* 3D Glass Sidebar */}
        <aside className="fixed left-0 top-0 bottom-0 w-72 z-50">
          <div className="h-full m-3 rounded-2xl backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
            {/* Neon edge */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/30 via-transparent to-purple-500/30" />
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/30 via-transparent to-purple-500/30" />

            {/* Logo */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-black animate-pulse" />
                </div>
                <div>
                  <h1 className="font-bold text-white text-lg tracking-tight">Supreme Control</h1>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Master Admin</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="h-[calc(100vh-280px)]">
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
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {/* Active glow */}
                      {isActive && (
                        <motion.div
                          layoutId="activeGlow"
                          className={`absolute inset-0 bg-gradient-to-r from-${module.accentColor}-500/20 to-transparent rounded-xl`}
                        />
                      )}
                      
                      {/* Active bar */}
                      {isActive && (
                        <motion.div
                          layoutId="activeBar"
                          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-${module.accentColor}-400 to-${module.accentColor}-600 rounded-r-full`}
                        />
                      )}

                      <div className={`relative z-10 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                        isActive 
                          ? `bg-gradient-to-br from-${module.accentColor}-500 to-${module.accentColor}-700 shadow-lg` 
                          : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        <module.icon className="w-4 h-4" />
                      </div>
                      <span className="relative z-10 font-medium text-sm">{module.label}</span>

                      {/* Alert badge for specific modules */}
                      {module.id === 'approvals' && (
                        <Badge className="absolute right-3 bg-red-500 text-white text-[9px] px-1.5 py-0">4</Badge>
                      )}
                      {module.id === 'security' && (
                        <Badge className="absolute right-3 bg-amber-500 text-black text-[9px] px-1.5 py-0">2</Badge>
                      )}
                    </motion.button>
                  );
                })}
              </nav>
            </ScrollArea>

            {/* Blackbox Mini */}
            <div className="p-3 border-t border-white/10">
              <BlackboxMini />
            </div>

            {/* System Status */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-white/50">All systems operational</span>
                </div>
                <Badge className="bg-green-500/20 text-green-400 text-[9px] border-none">
                  {systemPulse.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-72">
          {/* Top Command Bar */}
          <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/40 border-b border-white/10">
            <div className="px-6 py-4 flex items-center justify-between">
              {/* Left: Module title */}
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${currentModule.accentColor}-500 to-${currentModule.accentColor}-700 flex items-center justify-center shadow-lg shadow-${currentModule.accentColor}-500/30`}>
                  {React.createElement(currentModule.icon, { className: 'w-5 h-5 text-white' })}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{currentModule.label}</h2>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Real-time • Encrypted • Logged</p>
                </div>
              </div>

              {/* Center: Live Activity Ticker */}
              <LiveActivityTicker />

              {/* Right: System indicators */}
              <div className="flex items-center gap-3">
                {/* Blackbox indicator */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-950/50 border border-red-900/30">
                  <Box className="w-4 h-4 text-red-400" />
                  <div className="text-right">
                    <p className="text-[9px] text-red-400/60 uppercase">Blackbox</p>
                    <p className="text-xs font-bold text-red-300">Active</p>
                  </div>
                </div>

                {/* AI Watcher */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/50 border border-purple-900/30">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <div className="text-right">
                    <p className="text-[9px] text-purple-400/60 uppercase">AI Watch</p>
                    <p className="text-xs font-bold text-purple-300">92%</p>
                  </div>
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <Bell className="w-5 h-5 text-white/70" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">3</span>
                </button>

                {/* Rental status */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-medium text-amber-300">4 Rentals</span>
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

// Main export with all providers
export default function MasterAdminSupreme() {
  return (
    <BlackboxProvider>
      <AIWatcherProvider>
        <LiveActivityProvider>
          <MasterAdminContent />
        </LiveActivityProvider>
      </AIWatcherProvider>
    </BlackboxProvider>
  );
}
