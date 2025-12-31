import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, Shield, AlertTriangle, Globe2, Activity, Lock,
  Wifi, Monitor, Clock, Zap, Terminal, MapPin, Box
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BlackboxPanel, useBlackbox } from '../engines/BlackboxEngine';
import { AIWatcherPanel } from '../engines/AIWatcherEngine';
import { LiveActivityFeed } from '../engines/LiveActivityEngine';

interface ThreatEvent {
  id: string;
  type: string;
  ip: string;
  location: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  time: string;
}

const initialThreats: ThreatEvent[] = [
  { id: '1', type: 'Brute Force Attempt', ip: '192.168.1.xxx', location: 'Unknown VPN', severity: 'critical', time: '5s ago' },
  { id: '2', type: 'Suspicious Login', ip: '10.0.0.xxx', location: 'Mumbai, IN', severity: 'high', time: '30s ago' },
  { id: '3', type: 'Rate Limit Exceeded', ip: '172.16.0.xxx', location: 'Delhi, IN', severity: 'medium', time: '1m ago' },
  { id: '4', type: 'Token Reuse Detected', ip: '192.168.2.xxx', location: 'Bangalore, IN', severity: 'high', time: '2m ago' },
];

export function SecurityMonitorModule() {
  const [threats, setThreats] = useState(initialThreats);
  const [securityLevel, setSecurityLevel] = useState(87);
  const [matrixLines, setMatrixLines] = useState<string[]>([]);
  const { logEvent } = useBlackbox();

  // Simulate matrix effect
  useEffect(() => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモ';
    const interval = setInterval(() => {
      const newLine = Array.from({ length: 50 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      setMatrixLines(prev => [newLine, ...prev.slice(0, 5)]);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Simulate security level fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setSecurityLevel(prev => Math.min(100, Math.max(80, prev + (Math.random() - 0.5) * 3)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Matrix Background Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5 z-0">
        {matrixLines.map((line, i) => (
          <div
            key={i}
            className="text-green-400 font-mono text-xs whitespace-nowrap"
            style={{ transform: `translateY(${i * 20}px)` }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Security Status Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="relative p-5 bg-gradient-to-r from-green-950/80 to-emerald-950/80 border-green-500/30 backdrop-blur-xl overflow-hidden">
          {/* Hologram grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(74, 222, 128, 0.05) 25%, rgba(74, 222, 128, 0.05) 26%, transparent 27%, transparent 74%, rgba(74, 222, 128, 0.05) 75%, rgba(74, 222, 128, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(74, 222, 128, 0.05) 25%, rgba(74, 222, 128, 0.05) 26%, transparent 27%, transparent 74%, rgba(74, 222, 128, 0.05) 75%, rgba(74, 222, 128, 0.05) 76%, transparent 77%, transparent)',
              backgroundSize: '30px 30px'
            }} />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-green-500/30 flex items-center justify-center">
                  <motion.div
                    className="absolute inset-2 rounded-full border-2 border-green-400"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  />
                  <Eye className="w-8 h-8 text-green-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 animate-ping" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-300">Security Monitor Active</h2>
                <p className="text-green-200/60">Real-time threat detection • AI-powered analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-green-200/50">Security Level</p>
                <p className="text-3xl font-bold text-green-400">{securityLevel.toFixed(0)}%</p>
              </div>
              <div className="h-16 w-px bg-green-500/30" />
              <div className="text-center">
                <p className="text-xs text-green-200/50">Threats Blocked</p>
                <p className="text-3xl font-bold text-green-400">1,247</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Threat Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-5 bg-gradient-to-br from-green-950/50 to-emerald-950/30 border-green-500/20 backdrop-blur-xl h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-green-400" />
                Live Threat Feed
              </h3>
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">Monitoring</span>
              </div>
            </div>

            <div className="space-y-3">
              {threats.map((threat, index) => (
                <motion.div
                  key={threat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`p-4 rounded-xl border transition-all hover:scale-[1.01] ${
                    threat.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                    threat.severity === 'high' ? 'bg-amber-500/10 border-amber-500/30' :
                    threat.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                    'bg-green-500/10 border-green-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        threat.severity === 'critical' ? 'bg-red-500/20' :
                        threat.severity === 'high' ? 'bg-amber-500/20' :
                        'bg-green-500/20'
                      }`}>
                        <AlertTriangle className={`w-5 h-5 ${
                          threat.severity === 'critical' ? 'text-red-400' :
                          threat.severity === 'high' ? 'text-amber-400' :
                          'text-green-400'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{threat.type}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-white/50 font-mono">{threat.ip}</span>
                          <div className="flex items-center gap-1 text-xs text-white/40">
                            <MapPin className="w-3 h-3" />
                            {threat.location}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`text-[10px] uppercase ${
                        threat.severity === 'critical' ? 'bg-red-500/30 text-red-300 animate-pulse' :
                        threat.severity === 'high' ? 'bg-amber-500/30 text-amber-300' :
                        'bg-green-500/30 text-green-300'
                      }`}>
                        {threat.severity}
                      </Badge>
                      <p className="text-xs text-white/40 mt-1">{threat.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Auto-Lock Triggers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-5 bg-gradient-to-br from-green-950/50 to-emerald-950/30 border-green-500/20 backdrop-blur-xl h-full">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-400" />
              Auto-Lock Triggers
            </h3>

            <div className="space-y-4">
              {[
                { label: '5 Failed Logins', threshold: 5, current: 3, active: true },
                { label: 'Geo Anomaly', threshold: 1, current: 0, active: true },
                { label: 'Token Abuse', threshold: 3, current: 1, active: true },
                { label: 'Rate Limit', threshold: 100, current: 45, active: false },
              ].map((trigger, index) => (
                <div key={trigger.label} className="p-3 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">{trigger.label}</span>
                    <Badge className={trigger.active ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}>
                      {trigger.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={(trigger.current / trigger.threshold) * 100} className="flex-1 h-2" />
                    <span className="text-xs text-white/50 w-12 text-right">{trigger.current}/{trigger.threshold}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* SOC Access Rental */}
            <div className="mt-6 p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-green-300">Live SOC Access</p>
                  <p className="text-xs text-green-200/50">Rental window active</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Blackbox & AI Watcher Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Blackbox */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <BlackboxPanel maxEvents={8} module="Security" />
        </motion.div>

        {/* AI Watcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AIWatcherPanel />
        </motion.div>
      </div>
    </div>
  );
}
