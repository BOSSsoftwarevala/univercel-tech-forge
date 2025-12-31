import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, FileText, CheckCircle, AlertTriangle, Clock,
  Layers, ChevronRight, Eye, Zap, History, Box
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { BlackboxPanel, useBlackbox } from '../engines/BlackboxEngine';

interface Rule {
  id: string;
  name: string;
  category: string;
  version: string;
  status: 'active' | 'pending' | 'deprecated';
  impact: 'high' | 'medium' | 'low';
  lastUpdated: string;
  isRental?: boolean;
}

const rules: Rule[] = [
  { id: '1', name: 'Maximum Withdrawal Limit', category: 'Finance', version: 'v2.3.1', status: 'active', impact: 'high', lastUpdated: '2 hrs ago' },
  { id: '2', name: 'Session Timeout Policy', category: 'Security', version: 'v1.8.0', status: 'active', impact: 'medium', lastUpdated: '1 day ago' },
  { id: '3', name: 'Multi-Factor Authentication', category: 'Security', version: 'v3.0.0', status: 'active', impact: 'high', lastUpdated: '5 hrs ago', isRental: true },
  { id: '4', name: 'Commission Rate Cap', category: 'Finance', version: 'v1.5.2', status: 'pending', impact: 'high', lastUpdated: '30 min ago' },
  { id: '5', name: 'Data Retention Policy', category: 'Compliance', version: 'v2.1.0', status: 'active', impact: 'low', lastUpdated: '3 days ago' },
  { id: '6', name: 'Legacy API Access', category: 'Technical', version: 'v0.9.5', status: 'deprecated', impact: 'low', lastUpdated: '1 week ago' },
];

export function GlobalRulesModule() {
  return (
    <div className="space-y-6">
      {/* Rule Stack Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {rules.map((rule, index) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 6, scale: 1.01 }}
            className="group"
          >
            <Card className="relative p-5 bg-gradient-to-br from-slate-900/80 to-cyan-950/50 border-cyan-500/20 backdrop-blur-xl overflow-hidden hover:border-cyan-500/40 transition-all">
              {/* Layered effect */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-cyan-600" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-500/50 via-transparent to-transparent" />

              {/* Rental indicator */}
              {rule.isRental && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span className="text-[10px] text-cyan-300">Rental</span>
                </div>
              )}

              <div className="relative z-10 pl-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{rule.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="bg-slate-500/20 text-slate-300 border-slate-500/30 text-[10px]">
                          {rule.category}
                        </Badge>
                        <span className="text-[10px] text-white/40 font-mono">{rule.version}</span>
                      </div>
                    </div>
                  </div>
                  <Switch checked={rule.status === 'active'} />
                </div>

                {/* Impact & Status */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50">Impact:</span>
                    <Badge className={`text-[10px] ${
                      rule.impact === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      rule.impact === 'medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      'bg-green-500/20 text-green-400 border-green-500/30'
                    }`}>
                      {rule.impact}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50">Status:</span>
                    <Badge className={`text-[10px] ${
                      rule.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      rule.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      'bg-slate-500/20 text-slate-400 border-slate-500/30'
                    }`}>
                      {rule.status}
                    </Badge>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <History className="w-3 h-3" />
                    <span>Updated {rule.lastUpdated}</span>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                    <Eye className="w-3 h-3" />
                    <span>Preview Impact</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Live Execution Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-5 bg-gradient-to-br from-slate-900/80 to-cyan-950/30 border-cyan-500/20 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Live Rule Execution Log
            </h3>
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400">Real-time</span>
            </div>
          </div>
          <div className="space-y-2 max-h-48 overflow-auto">
            {[
              { rule: 'Maximum Withdrawal Limit', action: 'Enforced', user: 'User #4521', time: '10s ago', status: 'blocked' },
              { rule: 'Session Timeout Policy', action: 'Applied', user: 'SA-0012', time: '25s ago', status: 'success' },
              { rule: 'MFA Policy', action: 'Triggered', user: 'User #7892', time: '1m ago', status: 'success' },
              { rule: 'Commission Rate Cap', action: 'Validated', user: 'Franchise #12', time: '2m ago', status: 'success' },
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-sm text-white">{log.rule}</span>
                  <span className="text-xs text-white/40">→ {log.action}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/50">{log.user}</span>
                  <span className="text-xs text-white/30">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Blackbox - Rule Changes Auto-Logged */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="relative">
          <div className="absolute -top-2 left-4 px-3 py-1 bg-cyan-500/20 rounded-full border border-cyan-500/30">
            <div className="flex items-center gap-2">
              <Box className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] text-cyan-300 uppercase tracking-wider font-bold">Rule Changes Auto-Logged to Blackbox</span>
            </div>
          </div>
          <BlackboxPanel maxEvents={8} module="Rules" />
        </div>
      </motion.div>
    </div>
  );
}
