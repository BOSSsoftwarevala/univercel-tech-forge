/**
 * OVER AI - Fail-Safe Mode
 * LOCKED - DO NOT MODIFY
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  AlertTriangle,
  Shield,
  Power,
  RefreshCw,
  Bell,
  CheckCircle2,
  XCircle,
  Zap,
} from 'lucide-react';

const FAILSAFE_TRIGGERS = [
  { condition: 'AI Response Timeout > 5s', action: 'Switch to Safe Logic', status: 'ready' },
  { condition: 'Error Rate > 5%', action: 'Activate Backup Mode', status: 'ready' },
  { condition: 'Memory Usage > 90%', action: 'Clear Cache & Restart', status: 'ready' },
  { condition: 'API Gateway Down', action: 'Use Cached Responses', status: 'ready' },
  { condition: 'Database Connection Lost', action: 'Queue Operations', status: 'ready' },
];

const SAFE_LOGIC_FEATURES = [
  'Basic routing continues',
  'Static responses enabled',
  'Cache-only mode active',
  'No new AI decisions',
  'CEO notification triggered',
  'Auto-recovery monitoring',
];

export function FailSafeMode() {
  const [failSafeEnabled, setFailSafeEnabled] = useState(true);
  const [safeLogicActive, setSafeLogicActive] = useState(false);
  const [aiStatus, setAiStatus] = useState<'operational' | 'degraded' | 'failed'>('operational');

  const testFailSafe = () => {
    setSafeLogicActive(true);
    setAiStatus('degraded');
    setTimeout(() => {
      setSafeLogicActive(false);
      setAiStatus('operational');
    }, 3000);
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
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl shadow-amber-500/30">
            <AlertTriangle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Fail-Safe Mode</h1>
            <p className="text-cyan-400/70 text-sm">System continuity • CEO notification only</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">Fail-Safe</span>
            <Switch checked={failSafeEnabled} onCheckedChange={setFailSafeEnabled} />
          </div>
          <Badge className={failSafeEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
            {failSafeEnabled ? 'ARMED' : 'DISABLED'}
          </Badge>
        </div>
      </motion.div>

      {/* Current Status */}
      <Card
        className={`border-2 transition-colors ${
          aiStatus === 'operational'
            ? 'bg-emerald-500/5 border-emerald-500/30'
            : aiStatus === 'degraded'
            ? 'bg-amber-500/5 border-amber-500/30'
            : 'bg-red-500/5 border-red-500/30'
        }`}
      >
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {aiStatus === 'operational' ? (
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              ) : aiStatus === 'degraded' ? (
                <AlertTriangle className="w-12 h-12 text-amber-400 animate-pulse" />
              ) : (
                <XCircle className="w-12 h-12 text-red-400 animate-pulse" />
              )}
              <div>
                <p className="text-lg font-bold text-white">
                  {aiStatus === 'operational'
                    ? 'AI OPERATIONAL'
                    : aiStatus === 'degraded'
                    ? 'SAFE LOGIC MODE ACTIVE'
                    : 'AI FAILED - FAILSAFE ACTIVE'}
                </p>
                <p className="text-sm text-white/70">
                  {aiStatus === 'operational'
                    ? 'All systems running normally'
                    : 'System running on backup logic'}
                </p>
              </div>
            </div>
            <button
              onClick={testFailSafe}
              disabled={safeLogicActive}
              className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 inline mr-2 ${safeLogicActive ? 'animate-spin' : ''}`} />
              Test Fail-Safe
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Fail-Safe Triggers */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Power className="w-5 h-5 text-amber-400" />
            Fail-Safe Triggers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {FAILSAFE_TRIGGERS.map((trigger, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/30"
              >
                <div className="flex items-center gap-4">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-sm text-white/90">{trigger.condition}</p>
                    <p className="text-xs text-amber-400/70">→ {trigger.action}</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  READY
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safe Logic Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              Safe Logic Mode Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {SAFE_LOGIC_FEATURES.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-white/70">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              Notification Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
                <p className="text-sm font-bold text-violet-400">CEO Notification</p>
                <p className="text-xs text-white/50 mt-1">Immediate alert when fail-safe activates</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30">
                <p className="text-sm font-bold text-white/70">Server Manager</p>
                <p className="text-xs text-white/50 mt-1">Detailed logs and recovery status</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/30">
                <p className="text-sm font-bold text-white/70">Core AI Admin</p>
                <p className="text-xs text-white/50 mt-1">Full diagnostic report</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final Rule */}
      <Card className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border-amber-500/30">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <Zap className="w-10 h-10 text-amber-400" />
            <div>
              <p className="text-lg font-bold text-white">IF AI FAILS → KEEP SYSTEM RUNNING</p>
              <p className="text-sm text-amber-400/70">Switch to SAFE LOGIC MODE • Notify CEO only • Auto-recovery enabled</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FailSafeMode;
