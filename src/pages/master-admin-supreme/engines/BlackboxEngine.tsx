import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, Lock, AlertTriangle, Eye, Clock, MapPin, 
  User, Activity, Fingerprint, Shield
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

// Types
export interface BlackboxEvent {
  id: string;
  timestamp: Date;
  action: string;
  actor: string;
  actorRole: string;
  target: string;
  module: string;
  ip: string;
  geo: string;
  device: string;
  riskScore: number;
  sealed: boolean;
}

interface BlackboxContextType {
  events: BlackboxEvent[];
  logEvent: (event: Omit<BlackboxEvent, 'id' | 'timestamp' | 'sealed'>) => void;
  getRecentEvents: (count: number) => BlackboxEvent[];
  getEventsByModule: (module: string) => BlackboxEvent[];
}

// Context
const BlackboxContext = createContext<BlackboxContextType | null>(null);

export const useBlackbox = () => {
  const context = useContext(BlackboxContext);
  if (!context) throw new Error('useBlackbox must be used within BlackboxProvider');
  return context;
};

// Generate mock events
const generateMockEvents = (): BlackboxEvent[] => {
  const actions = [
    'Withdrawal Approved', 'Login Attempt', 'Role Changed', 'Policy Updated',
    'Security Alert', 'Access Granted', 'Account Suspended', 'Rule Activated',
    'Data Exported', 'Session Started', 'Permission Modified', 'Audit Triggered'
  ];
  const actors = ['SA-0012', 'SA-0023', 'MA-0001', 'SA-0045', 'System', 'SA-0067'];
  const roles = ['Super Admin', 'Master Admin', 'System', 'Area Manager'];
  const modules = ['Finance', 'Security', 'Approvals', 'Rules', 'Audit', 'Users'];
  const locations = ['Mumbai, IN', 'Delhi, IN', 'Bangalore, IN', 'Chennai, IN', 'Unknown'];
  const devices = ['Chrome/Windows', 'Safari/MacOS', 'Firefox/Linux', 'Mobile/Android'];

  return Array.from({ length: 50 }, (_, i) => ({
    id: `BX-${String(i + 1).padStart(6, '0')}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000),
    action: actions[Math.floor(Math.random() * actions.length)],
    actor: actors[Math.floor(Math.random() * actors.length)],
    actorRole: roles[Math.floor(Math.random() * roles.length)],
    target: `Target-${Math.floor(Math.random() * 1000)}`,
    module: modules[Math.floor(Math.random() * modules.length)],
    ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.xxx.xxx`,
    geo: locations[Math.floor(Math.random() * locations.length)],
    device: devices[Math.floor(Math.random() * devices.length)],
    riskScore: Math.floor(Math.random() * 100),
    sealed: true,
  })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Provider
export function BlackboxProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<BlackboxEvent[]>(generateMockEvents);

  const logEvent = useCallback((event: Omit<BlackboxEvent, 'id' | 'timestamp' | 'sealed'>) => {
    const newEvent: BlackboxEvent = {
      ...event,
      id: `BX-${String(Date.now()).slice(-6)}`,
      timestamp: new Date(),
      sealed: true,
    };
    setEvents(prev => [newEvent, ...prev]);
  }, []);

  const getRecentEvents = useCallback((count: number) => events.slice(0, count), [events]);
  const getEventsByModule = useCallback((module: string) => events.filter(e => e.module === module), [events]);

  return (
    <BlackboxContext.Provider value={{ events, logEvent, getRecentEvents, getEventsByModule }}>
      {children}
    </BlackboxContext.Provider>
  );
}

// Blackbox Panel Component
export function BlackboxPanel({ maxEvents = 10, module }: { maxEvents?: number; module?: string }) {
  const { events, getRecentEvents, getEventsByModule } = useBlackbox();
  const displayEvents = module ? getEventsByModule(module).slice(0, maxEvents) : getRecentEvents(maxEvents);

  return (
    <Card className="relative bg-black/90 border-red-900/50 backdrop-blur-xl overflow-hidden">
      {/* Vault depth effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/10 to-red-950/20 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

      {/* Header */}
      <div className="p-4 border-b border-red-900/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center">
              <Box className="w-5 h-5 text-red-200" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-red-300 flex items-center gap-2">
              BLACKBOX
              <Lock className="w-3 h-3" />
            </h3>
            <p className="text-[10px] text-red-400/60">Immutable • Sealed • Forensic</p>
          </div>
        </div>
        <Badge className="bg-red-900/50 text-red-300 border-red-700/50 font-mono text-[10px]">
          {events.length} RECORDS
        </Badge>
      </div>

      {/* Events */}
      <ScrollArea className="h-64">
        <div className="p-2 space-y-1">
          {displayEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-2 rounded bg-red-950/30 border border-red-900/20 hover:border-red-700/40 transition-colors group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-red-500/60 font-mono">{event.id}</span>
                  <span className="text-xs text-red-300">{event.action}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Lock className="w-2 h-2 text-red-600" />
                  <span className="text-[9px] text-red-600">SEALED</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-red-400/50">
                <span className="flex items-center gap-1">
                  <User className="w-2 h-2" />
                  {event.actor}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-2 h-2" />
                  {event.geo}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-2 h-2" />
                  {event.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

// Mini Blackbox Widget
export function BlackboxMini() {
  const { events } = useBlackbox();
  const recent = events.slice(0, 3);

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/50 border border-red-900/30">
      <div className="w-6 h-6 rounded bg-red-900/50 flex items-center justify-center">
        <Box className="w-3 h-3 text-red-400" />
      </div>
      <div className="flex-1">
        <div className="text-[10px] text-red-400/60">BLACKBOX</div>
        <div className="text-xs text-red-300 truncate">
          {recent[0]?.action || 'Monitoring...'}
        </div>
      </div>
      <Badge className="bg-red-900/30 text-red-400 text-[9px] border-none">
        LIVE
      </Badge>
    </div>
  );
}
