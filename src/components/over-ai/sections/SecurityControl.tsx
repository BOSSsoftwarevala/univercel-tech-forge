/**
 * OVER AI - Security & Control
 * LOCKED - DO NOT MODIFY
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Lock,
  Eye,
  Ban,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';

const SECURITY_RULES = [
  { icon: Ban, rule: 'No data exposure', status: 'enforced', description: 'All sensitive data masked' },
  { icon: Lock, rule: 'No prompt injection', status: 'enforced', description: 'Input sanitization active' },
  { icon: Shield, rule: 'No external AI override', status: 'enforced', description: 'Internal logic only' },
  { icon: Database, rule: 'Encrypted memory store', status: 'enforced', description: 'AES-256 encryption' },
];

const TRAINING_SOURCES = [
  { source: 'Internal System Logs', status: 'active', records: '2.4M' },
  { source: 'User Flow Patterns', status: 'active', records: '890K' },
  { source: 'Error Pattern Library', status: 'active', records: '156K' },
  { source: 'Performance History', status: 'active', records: '1.2M' },
];

export function SecurityControl() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 via-orange-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-red-500/30">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Security & Control</h1>
            <p className="text-cyan-400/70 text-sm">Zero exposure • Internal logic only</p>
          </div>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50 px-4 py-2">
          <Lock className="w-4 h-4 mr-2" />
          ALL PROTECTIONS ACTIVE
        </Badge>
      </motion.div>

      {/* Security Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECURITY_RULES.map((rule, i) => {
          const Icon = rule.icon;
          return (
            <motion.div
              key={rule.rule}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl hover:border-red-500/30 transition-colors">
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-white">{rule.rule}</p>
                        <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {rule.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-white/50 mt-1">{rule.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* AI Training Sources */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            AI Training Sources (Internal Only)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {TRAINING_SOURCES.map((source, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/30"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <span className="text-white/90">{source.source}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-cyan-400 font-mono">{source.records} records</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    ACTIVE
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critical Warning */}
      <Card className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 border-red-500/30">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-10 h-10 text-amber-400" />
            <div>
              <p className="text-lg font-bold text-white">NO EXTERNAL USER DATA</p>
              <p className="text-sm text-amber-400/70">
                AI training uses internal system logs, user flows, error patterns, and performance history only
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Copy Disabled', icon: Ban },
          { label: 'Screenshot Blocked', icon: Eye },
          { label: 'Export Disabled', icon: Lock },
          { label: 'Right-Click Blocked', icon: Shield },
        ].map((control, i) => {
          const Icon = control.icon;
          return (
            <Card key={i} className="bg-slate-900/50 border-red-500/20">
              <CardContent className="py-4 text-center">
                <Icon className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-xs text-white/70">{control.label}</p>
                <Badge className="bg-emerald-500/20 text-emerald-400 text-xs mt-2">ACTIVE</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default SecurityControl;
