/**
 * OVER AI - Self-Healing System
 * LOCKED - DO NOT MODIFY
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  HeartPulse,
  RefreshCw,
  GitBranch,
  Database,
  Play,
  FileText,
  CheckCircle2,
  Clock,
  Shield,
  Eye,
} from 'lucide-react';

const HEALING_ACTIONS = [
  { id: 'restart', name: 'Restart Micro-Service', icon: RefreshCw, count: 12 },
  { id: 'switch', name: 'Switch to Backup Server', icon: GitBranch, count: 5 },
  { id: 'rebuild', name: 'Rebuild Cache', icon: Database, count: 28 },
  { id: 'rerun', name: 'Re-run Failed Job', icon: Play, count: 17 },
  { id: 'log', name: 'Log Silently', icon: FileText, count: 89 },
];

const HEALING_EVENTS = [
  { id: 1, type: 'restart', target: 'Payment Gateway', timestamp: '2 mins ago', status: 'resolved', silent: true },
  { id: 2, type: 'rebuild', target: 'User Cache', timestamp: '5 mins ago', status: 'resolved', silent: true },
  { id: 3, type: 'switch', target: 'EU-West Server', timestamp: '12 mins ago', status: 'resolved', silent: true },
  { id: 4, type: 'rerun', target: 'Report Generator', timestamp: '18 mins ago', status: 'resolved', silent: true },
  { id: 5, type: 'restart', target: 'Notification Service', timestamp: '25 mins ago', status: 'resolved', silent: true },
  { id: 6, type: 'rebuild', target: 'Session Store', timestamp: '32 mins ago', status: 'resolved', silent: true },
  { id: 7, type: 'log', target: 'API Rate Limit', timestamp: '45 mins ago', status: 'resolved', silent: true },
  { id: 8, type: 'switch', target: 'AP-South Backup', timestamp: '1 hour ago', status: 'resolved', silent: true },
];

export function SelfHealingSystem() {
  const [events, setEvents] = useState(HEALING_EVENTS);
  const [healingActive, setHealingActive] = useState(true);
  const [totalHealed, setTotalHealed] = useState(151);

  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['restart', 'switch', 'rebuild', 'rerun', 'log'];
      const targets = ['API Gateway', 'Cache Layer', 'DB Connection', 'Auth Service', 'Queue Worker'];
      const newEvent = {
        id: Date.now(),
        type: types[Math.floor(Math.random() * types.length)],
        target: targets[Math.floor(Math.random() * targets.length)],
        timestamp: 'Just now',
        status: 'resolved',
        silent: true,
      };
      setEvents((prev) => [newEvent, ...prev.slice(0, 9)]);
      setTotalHealed((prev) => prev + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'restart':
        return RefreshCw;
      case 'switch':
        return GitBranch;
      case 'rebuild':
        return Database;
      case 'rerun':
        return Play;
      case 'log':
        return FileText;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <HeartPulse className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Self-Healing System</h1>
            <p className="text-cyan-400/70 text-sm">User never sees error • Silent resolution</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 px-4 py-2">
            <HeartPulse className="w-4 h-4 mr-2 animate-pulse" />
            HEALING ACTIVE
          </Badge>
          <div className="text-right">
            <p className="text-xs text-white/50">Total Healed Today</p>
            <p className="text-2xl font-bold text-emerald-400 font-mono">{totalHealed}</p>
          </div>
        </div>
      </motion.div>

      {/* Healing Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {HEALING_ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl hover:border-emerald-500/30 transition-colors">
                <CardContent className="py-4 text-center">
                  <Icon className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs text-white/70 mb-1">{action.name}</p>
                  <p className="text-2xl font-bold text-white font-mono">{action.count}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Live Healing Events */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              Live Healing Events
            </CardTitle>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
              <Eye className="w-3 h-3 mr-1" />
              USER SEES NOTHING
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {events.map((event) => {
                const Icon = getTypeIcon(event.type);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 text-xs capitalize">
                        {event.type}
                      </Badge>
                      <span className="text-white/90">{event.target}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {event.silent && (
                        <Badge className="bg-slate-700/50 text-white/50 text-xs">SILENT</Badge>
                      )}
                      <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        RESOLVED
                      </Badge>
                      <span className="text-xs text-white/50">{event.timestamp}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Rule Card */}
      <Card className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-emerald-500/30">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <Shield className="w-10 h-10 text-emerald-400" />
            <div>
              <p className="text-lg font-bold text-white">USER NEVER SEES ERROR</p>
              <p className="text-sm text-emerald-400/70">All issues resolved silently • Zero user impact</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SelfHealingSystem;
