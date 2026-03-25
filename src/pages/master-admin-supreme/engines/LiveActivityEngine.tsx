import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Radio, Clock, User, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Types
export interface LiveEvent {
  id: string;
  timestamp: Date;
  type: 'action' | 'alert' | 'system' | 'user';
  message: string;
  actor?: string;
  module: string;
  priority: 'high' | 'medium' | 'low';
}

interface LiveActivityContextType {
  events: LiveEvent[];
  isConnected: boolean;
  latency: number;
}

// Context
const LiveActivityContext = createContext<LiveActivityContextType | null>(null);

export const useLiveActivity = () => {
  const context = useContext(LiveActivityContext);
  if (!context) throw new Error('useLiveActivity must be used within LiveActivityProvider');
  return context;
};

// Generate mock events
const eventTemplates = [
  { type: 'action' as const, messages: ['Withdrawal approved', 'Role upgraded', 'Policy updated', 'Account verified'], modules: ['Finance', 'Roles', 'Rules', 'Users'] },
  { type: 'alert' as const, messages: ['Security scan completed', 'Anomaly detected', 'Rate limit triggered', 'New device login'], modules: ['Security', 'AI Watcher', 'System', 'Auth'] },
  { type: 'system' as const, messages: ['Backup completed', 'Cache cleared', 'Sync finished', 'Health check passed'], modules: ['System', 'Database', 'Storage', 'Monitor'] },
  { type: 'user' as const, messages: ['Session started', 'Profile updated', 'Password changed', 'Settings modified'], modules: ['Auth', 'Profile', 'Security', 'Settings'] },
];

const actors = ['SA-0012', 'SA-0023', 'MA-0001', 'System', 'User-4521', 'SA-0045'];

// Provider
export function LiveActivityProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [latency, setLatency] = useState(12);

  // Simulate WebSocket events
  useEffect(() => {
    const interval = setInterval(() => {
      const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
      const message = template.messages[Math.floor(Math.random() * template.messages.length)];
      const module = template.modules[Math.floor(Math.random() * template.modules.length)];

      const newEvent: LiveEvent = {
        id: `LE-${Date.now()}`,
        timestamp: new Date(),
        type: template.type,
        message,
        actor: actors[Math.floor(Math.random() * actors.length)],
        module,
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 49)]);
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  // Simulate latency fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(10 + Math.random() * 15));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LiveActivityContext.Provider value={{ events, isConnected, latency }}>
      {children}
    </LiveActivityContext.Provider>
  );
}

// Live Activity Ticker (for header)
export function LiveActivityTicker() {
  const { events, isConnected, latency } = useLiveActivity();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (events.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % Math.min(events.length, 5));
    }, 4000);
    return () => clearInterval(interval);
  }, [events.length]);

  const currentEvent = events[currentIndex];

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/30 border border-white/10">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
        <span className="text-[10px] text-white/50 uppercase tracking-wide">Live</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {currentEvent && (
            <motion.div
              key={currentEvent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              <span className="text-xs text-white/70 truncate">{currentEvent.message}</span>
              <Badge className="bg-white/10 text-white/50 text-[9px] border-none shrink-0">
                {currentEvent.module}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-1 text-[10px] text-white/40">
        <Radio className="w-3 h-3" />
        <span>{latency}ms</span>
      </div>
    </div>
  );
}

// Live Activity Feed (for panels)
export function LiveActivityFeed({ maxEvents = 10, filterModule }: { maxEvents?: number; filterModule?: string }) {
  const { events, isConnected } = useLiveActivity();
  const filteredEvents = filterModule 
    ? events.filter(e => e.module === filterModule).slice(0, maxEvents)
    : events.slice(0, maxEvents);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-white">Live Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
          <span className="text-[10px] text-white/50">
            {isConnected ? 'Connected' : 'Reconnecting...'}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <AnimatePresence>
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`p-2 rounded-lg border transition-colors ${
                event.priority === 'high' ? 'bg-red-500/10 border-red-500/20' :
                event.priority === 'medium' ? 'bg-amber-500/10 border-amber-500/20' :
                'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${
                    event.priority === 'high' ? 'text-red-300' :
                    event.priority === 'medium' ? 'text-amber-300' :
                    'text-white/80'
                  }`}>
                    {event.message}
                  </span>
                </div>
                <span className="text-[10px] text-white/40">
                  {event.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-[10px] text-white/40">
                {event.actor && (
                  <span className="flex items-center gap-1">
                    <User className="w-2 h-2" />
                    {event.actor}
                  </span>
                )}
                <Badge className="bg-white/5 text-white/50 text-[9px] border-none">
                  {event.module}
                </Badge>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Permission Engine
export interface Permission {
  id: string;
  feature: string;
  module: string;
  access: 'full' | 'read' | 'write' | 'none';
  scope: 'global' | 'region' | 'user';
  expiresAt?: Date;
}

export function usePermissionEngine() {
  const [permissions] = useState<Permission[]>([
    { id: 'P-001', feature: 'System Lock', module: 'System', access: 'full', scope: 'global' },
    { id: 'P-002', feature: 'Audit Export', module: 'Audit', access: 'read', scope: 'global' },
    { id: 'P-003', feature: 'User Suspension', module: 'Users', access: 'full', scope: 'region' },
    { id: 'P-004', feature: 'Rule Creation', module: 'Rules', access: 'write', scope: 'global' },
  ]);

  const hasPermission = (feature: string, requiredAccess: 'read' | 'write' | 'full'): boolean => {
    const perm = permissions.find(p => p.feature === feature);
    if (!perm) return false;
    if (perm.access === 'full') return true;
    if (perm.access === requiredAccess) return true;
    if (perm.access === 'write' && requiredAccess === 'read') return true;
    return false;
  };

  return { permissions, hasPermission };
}
