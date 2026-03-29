import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, Brain, AlertTriangle, Shield, Activity,
  Users, Zap, Clock, CheckCircle2, XCircle,
  TrendingUp, Lock, Radio, Radar, Scan,
  UserX, DollarSign, FileWarning, AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

// Types for AI Surveillance
interface SurveillanceAlert {
  id: string;
  timestamp: Date;
  actor: string;
  actorRole: string;
  action: string;
  module: string;
  riskScore: number;
  aiVerdict: 'suspicious' | 'warning' | 'critical' | 'info';
  aiSuggestion: string;
  status: 'pending' | 'reviewed' | 'actioned' | 'dismissed';
}

// Mock real-time surveillance data
const generateAlerts = (): SurveillanceAlert[] => [
  {
    id: 'SURV-001',
    timestamp: new Date(Date.now() - 120000),
    actor: 'SA-Mumbai-007',
    actorRole: 'super_admin',
    action: 'Attempted to modify payout limits',
    module: 'Finance',
    riskScore: 87,
    aiVerdict: 'critical',
    aiSuggestion: 'Block action and require dual approval. Pattern matches unauthorized access.',
    status: 'pending'
  },
  {
    id: 'SURV-002',
    timestamp: new Date(Date.now() - 300000),
    actor: 'DEV-1234',
    actorRole: 'developer',
    action: 'Accessed admin API without permission',
    module: 'API Gateway',
    riskScore: 72,
    aiVerdict: 'suspicious',
    aiSuggestion: 'Revoke API access temporarily. Schedule review with team lead.',
    status: 'pending'
  },
  {
    id: 'SURV-003',
    timestamp: new Date(Date.now() - 600000),
    actor: 'FRAN-Delhi-012',
    actorRole: 'franchise',
    action: 'Unusual lead assignment pattern detected',
    module: 'Lead Manager',
    riskScore: 58,
    aiVerdict: 'warning',
    aiSuggestion: 'Monitor for next 24 hours. Flag for performance review if continues.',
    status: 'reviewed'
  },
  {
    id: 'SURV-004',
    timestamp: new Date(Date.now() - 900000),
    actor: 'RES-2456',
    actorRole: 'reseller',
    action: 'Multiple failed login attempts',
    module: 'Authentication',
    riskScore: 45,
    aiVerdict: 'info',
    aiSuggestion: 'Send password reset link. No malicious intent detected.',
    status: 'actioned'
  },
  {
    id: 'SURV-005',
    timestamp: new Date(Date.now() - 1200000),
    actor: 'SA-Europe-003',
    actorRole: 'super_admin',
    action: 'Bulk user deletion request',
    module: 'User Management',
    riskScore: 94,
    aiVerdict: 'critical',
    aiSuggestion: 'BLOCK IMMEDIATELY. This action violates deletion policy. Escalate to Master.',
    status: 'pending'
  },
];

const systemMetrics = {
  activeMonitoring: 347,
  alertsToday: 23,
  actionsBlocked: 5,
  aiAccuracy: 97.3,
};

export function AISurveillanceModule() {
  const [alerts, setAlerts] = useState<SurveillanceAlert[]>(generateAlerts);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(true);
  const { toast } = useToast();

  // Simulate continuous scanning
  useEffect(() => {
    const interval = setInterval(() => {
      setScanningProgress(prev => {
        if (prev >= 100) {
          return 0;
        }
        return prev + Math.random() * 5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleAction = (alertId: string, action: 'approve' | 'dismiss' | 'escalate') => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId 
        ? { ...a, status: action === 'dismiss' ? 'dismissed' : 'actioned' } 
        : a
    ));
    
    toast({
      title: action === 'escalate' ? '🚨 Escalated to Master' : 
             action === 'approve' ? '✅ Action Approved' : '❌ Alert Dismissed',
      description: `Alert ${alertId} has been ${action}ed.`,
    });
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'suspicious': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'suspicious': return <UserX className="w-4 h-4 text-amber-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <Eye className="w-4 h-4 text-blue-400" />;
    }
  };

  const pendingAlerts = alerts.filter(a => a.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header with Scanning Animation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Eye className="w-7 h-7 text-white" />
            </div>
            {isScanning && (
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-cyan-400"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Surveillance Center</h2>
            <p className="text-sm text-cyan-300/70">Real-time Activity Monitoring & Threat Detection</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <Radar className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-sm text-cyan-300">SCANNING</span>
          </div>
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-sm px-4 py-2">
            <Brain className="w-4 h-4 mr-2" />
            AI WATCHING
          </Badge>
        </div>
      </div>

      {/* Scanning Progress */}
      <Card className="p-4 bg-black/40 border-cyan-500/20 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Scan className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-300">Active Scan Progress</span>
          </div>
          <span className="text-xs text-white/50">{Math.round(scanningProgress)}%</span>
        </div>
        <Progress value={scanningProgress} className="h-1 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500" />
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Monitoring', value: systemMetrics.activeMonitoring, icon: Eye, color: 'cyan' },
          { label: 'Alerts Today', value: systemMetrics.alertsToday, icon: AlertTriangle, color: 'amber' },
          { label: 'Actions Blocked', value: systemMetrics.actionsBlocked, icon: Shield, color: 'red' },
          { label: 'AI Accuracy', value: `${systemMetrics.aiAccuracy}%`, icon: Brain, color: 'green' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`p-4 bg-gradient-to-br from-${stat.color}-950/50 to-${stat.color}-900/30 border-${stat.color}-500/20`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/50">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Alert Stream */}
      <Card className="p-4 bg-black/40 border-cyan-500/20 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-cyan-300 flex items-center gap-2">
            <Radio className="w-4 h-4 animate-pulse" />
            Live Alert Stream
          </h3>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500/20 text-red-300">
              {pendingAlerts.length} Pending Review
            </Badge>
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            <AnimatePresence>
              {alerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-xl border ${getVerdictColor(alert.aiVerdict)} ${
                    alert.status === 'pending' ? '' : 'opacity-60'
                  }`}
                >
                  {/* Alert Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getVerdictIcon(alert.aiVerdict)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{alert.actor}</span>
                          <Badge className="text-[9px] bg-white/10">{alert.actorRole}</Badge>
                        </div>
                        <p className="text-xs text-white/50">{alert.module} • {alert.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getVerdictColor(alert.aiVerdict)}>
                        {alert.aiVerdict.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/5">
                        <TrendingUp className="w-3 h-3 text-white/50" />
                        <span className="text-xs text-white/70">Risk: {alert.riskScore}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Description */}
                  <div className="p-3 rounded-lg bg-black/30 mb-3">
                    <p className="text-sm text-white/90">{alert.action}</p>
                  </div>

                  {/* AI Suggestion */}
                  <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-medium text-purple-300">AI SUGGESTION</span>
                    </div>
                    <p className="text-sm text-white/80">{alert.aiSuggestion}</p>
                  </div>

                  {/* Action Buttons */}
                  {alert.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300"
                        onClick={() => handleAction(alert.id, 'approve')}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Approve AI Action
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300"
                        onClick={() => handleAction(alert.id, 'escalate')}
                      >
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Escalate to Boss
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-white/50"
                        onClick={() => handleAction(alert.id, 'dismiss')}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {alert.status !== 'pending' && (
                    <Badge className={alert.status === 'actioned' ? 'bg-green-500/20 text-green-300' : 'bg-slate-500/20 text-slate-300'}>
                      {alert.status.toUpperCase()}
                    </Badge>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}