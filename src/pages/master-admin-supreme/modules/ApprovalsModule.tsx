import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, Shield, Clock, CheckCircle, XCircle,
  User, DollarSign, Gauge, Zap, Eye, Box
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BlackboxPanel, useBlackbox } from '../engines/BlackboxEngine';
import { RiskPanel } from '../engines/AIWatcherEngine';

interface Approval {
  id: string;
  type: string;
  amount?: string;
  user: string;
  riskScore: number;
  reason: string;
  time: string;
  priority: 'critical' | 'high' | 'medium';
}

const pendingApprovals: Approval[] = [
  { id: '1', type: 'Withdrawal', amount: '₹2,50,000', user: 'User #4521', riskScore: 92, reason: 'Amount exceeds daily limit', time: '2 min ago', priority: 'critical' },
  { id: '2', type: 'Account Suspension', user: 'Franchise #12', riskScore: 78, reason: 'Multiple policy violations', time: '5 min ago', priority: 'high' },
  { id: '3', type: 'Role Upgrade', user: 'SA-0089', riskScore: 45, reason: 'Elevation to Super Admin Level 3', time: '12 min ago', priority: 'medium' },
  { id: '4', type: 'Withdrawal', amount: '₹1,80,000', user: 'User #7832', riskScore: 85, reason: 'First large withdrawal', time: '18 min ago', priority: 'high' },
];

export function ApprovalsModule() {
  const [processing, setProcessing] = useState<string | null>(null);
  const { logEvent } = useBlackbox();

  const handleApproval = (approval: Approval, action: 'approve' | 'reject') => {
    logEvent({
      action: action === 'approve' ? 'HIGH-RISK APPROVAL GRANTED' : 'HIGH-RISK APPROVAL REJECTED',
      actor: 'MA-0001',
      actorRole: 'Master Admin',
      target: `${approval.type} - ${approval.user}`,
      module: 'Approvals',
      ip: '192.168.1.xxx',
      geo: 'Mumbai, IN',
      device: 'Chrome/Windows',
      riskScore: approval.riskScore,
    });
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden"
      >
        <Card className="p-4 bg-gradient-to-r from-red-950/80 to-orange-950/80 border-red-500/30 backdrop-blur-xl">
          <div className="absolute inset-0 animate-pulse opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-red-300">High-Risk Approvals Pending</h3>
                <p className="text-sm text-red-200/60">4 items require immediate attention • Multi-step verification required</p>
              </div>
            </div>
            <Badge className="bg-red-500/30 text-red-300 border-red-500/50 text-lg px-4 py-2">
              4 Pending
            </Badge>
          </div>
        </Card>
      </motion.div>

      {/* Approval Queue */}
      <div className="space-y-4">
        {pendingApprovals.map((approval, index) => (
          <motion.div
            key={approval.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ scale: 1.01 }}
          >
            <Card className={`relative p-5 backdrop-blur-xl overflow-hidden ${
              approval.priority === 'critical' 
                ? 'bg-gradient-to-r from-red-950/80 to-red-900/50 border-red-500/40' 
                : approval.priority === 'high'
                ? 'bg-gradient-to-r from-amber-950/80 to-orange-950/50 border-amber-500/30'
                : 'bg-gradient-to-r from-slate-900/80 to-slate-800/50 border-white/10'
            }`}>
              {/* Pulsing warning for critical */}
              {approval.priority === 'critical' && (
                <div className="absolute inset-0 animate-pulse opacity-5">
                  <div className="absolute inset-0 bg-red-500" />
                </div>
              )}

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      approval.priority === 'critical' ? 'bg-red-500/20 border border-red-500/30' :
                      approval.priority === 'high' ? 'bg-amber-500/20 border border-amber-500/30' :
                      'bg-white/10 border border-white/20'
                    }`}>
                      {approval.type === 'Withdrawal' ? <DollarSign className="w-6 h-6 text-white" /> :
                       approval.type === 'Account Suspension' ? <Shield className="w-6 h-6 text-white" /> :
                       <User className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white">{approval.type}</h3>
                        {approval.amount && (
                          <Badge className="bg-white/10 text-white border-white/20">{approval.amount}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/50">{approval.user}</p>
                    </div>
                  </div>
                  <Badge className={`text-xs uppercase ${
                    approval.priority === 'critical' ? 'bg-red-500/30 text-red-300 border-red-500/50 animate-pulse' :
                    approval.priority === 'high' ? 'bg-amber-500/30 text-amber-300 border-amber-500/50' :
                    'bg-slate-500/30 text-slate-300 border-slate-500/50'
                  }`}>
                    {approval.priority}
                  </Badge>
                </div>

                {/* Risk Score Meter */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-white/50" />
                      <span className="text-sm text-white/50">Risk Score</span>
                    </div>
                    <span className={`text-lg font-bold ${
                      approval.riskScore >= 80 ? 'text-red-400' :
                      approval.riskScore >= 50 ? 'text-amber-400' :
                      'text-green-400'
                    }`}>{approval.riskScore}/100</span>
                  </div>
                  <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className={`absolute left-0 top-0 bottom-0 rounded-full ${
                        approval.riskScore >= 80 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                        approval.riskScore >= 50 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                        'bg-gradient-to-r from-green-500 to-green-400'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${approval.riskScore}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    />
                  </div>
                </div>

                {/* Reason */}
                <div className="p-3 rounded-xl bg-white/5 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-white/50">Flagged Reason</span>
                  </div>
                  <p className="text-sm text-white/80">{approval.reason}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <Clock className="w-3 h-3" />
                    <span>{approval.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/5 border-white/20 hover:bg-white/10 text-white gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      Review
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-500/20 border-red-500/30 hover:bg-red-500/30 text-red-300 gap-1"
                      onClick={() => handleApproval(approval, 'reject')}
                    >
                      <XCircle className="w-3 h-3" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white gap-1"
                      onClick={() => handleApproval(approval, 'approve')}
                    >
                      <CheckCircle className="w-3 h-3" />
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Blackbox & Risk Engine Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="relative">
            <div className="absolute -top-2 left-4 px-3 py-1 bg-red-500/30 rounded-full border border-red-500/50">
              <div className="flex items-center gap-2">
                <Box className="w-3 h-3 text-red-400" />
                <span className="text-[10px] text-red-300 uppercase tracking-wider font-bold">Forced Logging - Cannot Bypass</span>
              </div>
            </div>
            <BlackboxPanel maxEvents={6} module="Approvals" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          <RiskPanel />
        </motion.div>
      </div>

      {/* Fast-Track Rental */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-300">Fast-Track Approval Rental</h4>
                <p className="text-xs text-amber-200/60">Skip verification steps • Priority processing • Risk analysis add-ons</p>
              </div>
            </div>
            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
              Activate
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
