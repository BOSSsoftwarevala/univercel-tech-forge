/**
 * OVER AI - Support Integration
 * LOCKED - DO NOT MODIFY
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  HeadphonesIcon,
  Brain,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';

const SUPPORT_TICKETS = [
  { id: 'TKT-001', issueType: 'Login Failure', confidence: 96, resolution: 'Password reset triggered', status: 'auto-fixed', timestamp: '2 mins ago' },
  { id: 'TKT-002', issueType: 'Payment Error', confidence: 91, resolution: 'Gateway reconnected', status: 'auto-fixed', timestamp: '5 mins ago' },
  { id: 'TKT-003', issueType: 'Slow Dashboard', confidence: 88, resolution: 'Cache rebuilt', status: 'auto-fixed', timestamp: '8 mins ago' },
  { id: 'TKT-004', issueType: 'Custom Request', confidence: 45, resolution: 'Pending human review', status: 'escalated', timestamp: '12 mins ago' },
  { id: 'TKT-005', issueType: 'API Timeout', confidence: 94, resolution: 'Retry mechanism activated', status: 'auto-fixed', timestamp: '15 mins ago' },
  { id: 'TKT-006', issueType: 'Complex Query', confidence: 62, resolution: 'Needs clarification', status: 'escalated', timestamp: '20 mins ago' },
];

const STATS = [
  { label: 'Auto-Fixed Today', value: 89, icon: CheckCircle2, color: 'emerald' },
  { label: 'Escalated', value: 7, icon: AlertCircle, color: 'amber' },
  { label: 'Avg Resolution', value: '< 30s', icon: Clock, color: 'cyan' },
  { label: 'AI Accuracy', value: '94.2%', icon: Brain, color: 'violet' },
];

export function SupportIntegration() {
  const [tickets, setTickets] = useState(SUPPORT_TICKETS);
  const [autoFixRate, setAutoFixRate] = useState(92.7);

  useEffect(() => {
    const interval = setInterval(() => {
      setAutoFixRate((prev) => Math.max(85, Math.min(98, prev + (Math.random() - 0.5) * 2)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'auto-fixed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'escalated':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'pending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400';
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
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <HeadphonesIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI + Support Integration</h1>
            <p className="text-cyan-400/70 text-sm">AI first always • No manual chat first</p>
          </div>
        </div>
        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 px-4 py-2">
          <Zap className="w-4 h-4 mr-2" />
          AUTO-FIX: {autoFixRate.toFixed(1)}%
        </Badge>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                <CardContent className="py-4 text-center">
                  <Icon className={`w-8 h-8 text-${stat.color}-400 mx-auto mb-2`} />
                  <p className="text-xs text-white/50 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white font-mono">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* AI Processing Flow */}
      <Card className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-teal-500/10 border-cyan-500/30">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: 'Auto-Read Ticket', icon: MessageSquare },
              { step: 2, label: 'Identify Issue', icon: Brain },
              { step: 3, label: 'Match Resolution', icon: TrendingUp },
              { step: 4, label: 'Auto-Fix (>90%)', icon: CheckCircle2 },
              { step: 5, label: 'Escalate (if needed)', icon: AlertCircle },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <React.Fragment key={item.step}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <p className="text-xs text-white/70 text-center">{item.label}</p>
                  </div>
                  {i < 4 && <div className="flex-1 h-0.5 bg-cyan-500/30 mx-2" />}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Live Tickets */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            Live Support Tickets (AI Processing)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/30"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-white/70 border-white/20 font-mono">
                      {ticket.id}
                    </Badge>
                    <div>
                      <p className="text-sm text-white/90">{ticket.issueType}</p>
                      <p className="text-xs text-white/50">{ticket.resolution}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-white/50">Confidence</p>
                      <p className={`text-sm font-bold ${ticket.confidence >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {ticket.confidence}%
                      </p>
                    </div>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status === 'auto-fixed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {ticket.status === 'escalated' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {ticket.status.toUpperCase().replace('-', ' ')}
                    </Badge>
                    <span className="text-xs text-white/50">{ticket.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Rule Card */}
      <Card className="bg-slate-900/50 border-amber-500/30">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-amber-400" />
            <div>
              <p className="text-sm font-bold text-white">RULE: AI FIRST ALWAYS</p>
              <p className="text-xs text-amber-400/70">Auto-fix if confidence &gt;90% • Escalate only if required</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SupportIntegration;
