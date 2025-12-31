import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Eye, AlertTriangle, ChevronDown, ChevronRight,
  Lock, Unlock, Activity, Flag, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FlaggedItem {
  id: string;
  valaId: string;
  actionType: string;
  riskScore: number;
  behaviorFlags: string[];
  timestamp: string;
  status: 'pending' | 'reviewed' | 'resolved';
  aiNotes: string;
}

interface ValaAdminSummaryProps {
  flaggedItems?: FlaggedItem[];
  totalActions?: number;
  pendingReviews?: number;
  onUnlock?: (itemId: string) => void;
  onOverride?: (itemId: string, action: 'approve' | 'reject') => void;
}

const mockFlaggedItems: FlaggedItem[] = [
  {
    id: 'FLAG-001',
    valaId: 'VALA-8A3F2B1C',
    actionType: 'data_export_attempt',
    riskScore: 87,
    behaviorFlags: ['unusual_timing', 'bulk_access'],
    timestamp: '2024-01-15T14:32:00Z',
    status: 'pending',
    aiNotes: 'Multiple data access requests outside normal hours. Pattern suggests potential data extraction.',
  },
  {
    id: 'FLAG-002',
    valaId: 'VALA-5D9E7F2A',
    actionType: 'permission_escalation',
    riskScore: 65,
    behaviorFlags: ['role_boundary_test'],
    timestamp: '2024-01-15T13:15:00Z',
    status: 'pending',
    aiNotes: 'Attempted access to restricted module. Behavior consistent with role confusion.',
  },
  {
    id: 'FLAG-003',
    valaId: 'VALA-1B4C8E3D',
    actionType: 'session_anomaly',
    riskScore: 42,
    behaviorFlags: ['ip_change'],
    timestamp: '2024-01-15T11:45:00Z',
    status: 'reviewed',
    aiNotes: 'IP address change mid-session. Likely VPN switch, low risk.',
  },
];

const ValaAdminSummary = ({
  flaggedItems = mockFlaggedItems,
  totalActions = 1247,
  pendingReviews = 12,
  onUnlock,
  onOverride,
}: ValaAdminSummaryProps) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const getRiskColor = (score: number) => {
    if (score >= 75) return 'text-red-400 bg-red-500/20 border-red-500/50';
    if (score >= 50) return 'text-amber-400 bg-amber-500/20 border-amber-500/50';
    return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
  };

  const getStatusConfig = (status: FlaggedItem['status']) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-amber-400', label: 'Pending' };
      case 'reviewed':
        return { icon: Eye, color: 'text-blue-400', label: 'Reviewed' };
      case 'resolved':
        return { icon: CheckCircle, color: 'text-emerald-400', label: 'Resolved' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-slate-900/50 border border-slate-800"
        >
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-400">Total Actions</span>
          </div>
          <p className="text-3xl font-bold text-white">{totalActions.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-xl bg-slate-900/50 border border-amber-500/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <Flag className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-amber-400">AI Flags</span>
          </div>
          <p className="text-3xl font-bold text-amber-400">{flaggedItems.filter(i => i.status === 'pending').length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl bg-slate-900/50 border border-slate-800"
        >
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-slate-400">Pending Reviews</span>
          </div>
          <p className="text-3xl font-bold text-white">{pendingReviews}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-xl bg-slate-900/50 border border-emerald-500/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-emerald-400">System Health</span>
          </div>
          <p className="text-3xl font-bold text-emerald-400">98.7%</p>
        </motion.div>
      </div>

      {/* AI Flagged Items - Drill Down */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Flagged Actions</h3>
              <p className="text-xs text-slate-400">Behavior anomalies requiring review</p>
            </div>
          </div>
          <Badge className="bg-slate-800 text-slate-300">
            AI Observation Only
          </Badge>
        </div>

        <div className="space-y-3">
          {flaggedItems.map((item, index) => {
            const isExpanded = expandedItem === item.id;
            const statusConfig = getStatusConfig(item.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg bg-slate-800/50 border border-slate-700 overflow-hidden"
              >
                {/* Header Row */}
                <button
                  onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-800/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                    
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-slate-300">{item.valaId}</span>
                        <Badge className={cn('text-xs', getRiskColor(item.riskScore))}>
                          Risk: {item.riskScore}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{item.actionType.replace(/_/g, ' ')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={cn('w-4 h-4', statusConfig.color)} />
                      <span className={cn('text-xs', statusConfig.color)}>{statusConfig.label}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-700"
                    >
                      <div className="p-4 space-y-4">
                        {/* AI Notes */}
                        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                          <div className="flex items-center gap-2 mb-2">
                            <Eye className="w-4 h-4 text-violet-400" />
                            <span className="text-xs font-medium text-violet-400">AI Observation</span>
                          </div>
                          <p className="text-sm text-slate-300">{item.aiNotes}</p>
                        </div>

                        {/* Behavior Flags */}
                        <div>
                          <span className="text-xs text-slate-400 mb-2 block">Behavior Flags</span>
                          <div className="flex gap-2">
                            {item.behaviorFlags.map((flag, i) => (
                              <Badge key={i} variant="outline" className="text-slate-400 border-slate-600">
                                {flag.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Master Admin Actions */}
                        {item.status === 'pending' && (
                          <div className="flex items-center gap-3 pt-3 border-t border-slate-700">
                            <Button
                              size="sm"
                              onClick={() => onUnlock?.(item.id)}
                              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50"
                            >
                              <Unlock className="w-4 h-4 mr-2" />
                              Unlock
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => onOverride?.(item.id, 'approve')}
                              variant="outline"
                              className="border-slate-600"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => onOverride?.(item.id, 'reject')}
                              variant="outline"
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Block
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* AI Rules Notice */}
      <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-violet-400 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-violet-300 mb-1">AI Observation Protocol</p>
            <p className="text-violet-400/80 text-xs">
              AI observes silently and generates behavior scores and risk flags. 
              AI cannot execute, approve, or edit any actions. All reports are submitted upward only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValaAdminSummary;
