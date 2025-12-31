import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, User, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Escalation {
  id: string;
  taskId: string;
  reason: string;
  escalatedTo: string;
  escalatedAt: string;
  status: 'pending' | 'acknowledged' | 'resolved' | 'rejected';
  resolvedAt?: string;
  resolution?: string;
}

const mockEscalations: Escalation[] = [
  {
    id: 'ESC-001',
    taskId: 'TSK-4822',
    reason: 'Critical SLA breach - Database migration deadline exceeded',
    escalatedTo: 'AREA-MGR-112',
    escalatedAt: '2024-12-31T14:30:00Z',
    status: 'pending'
  },
  {
    id: 'ESC-002',
    taskId: 'TSK-4823',
    reason: 'Blocked for 36+ hours - External dependency',
    escalatedTo: 'AREA-MGR-112',
    escalatedAt: '2024-12-31T10:00:00Z',
    status: 'acknowledged'
  },
  {
    id: 'ESC-003',
    taskId: 'TSK-4820',
    reason: 'Quality score below threshold',
    escalatedTo: 'AREA-MGR-112',
    escalatedAt: '2024-12-30T16:00:00Z',
    status: 'resolved',
    resolvedAt: '2024-12-31T09:00:00Z',
    resolution: 'Developer assigned additional review cycle'
  },
];

const getStatusConfig = (status: Escalation['status']) => {
  switch (status) {
    case 'pending':
      return { color: 'bg-amber-500/20 text-amber-400', icon: Clock };
    case 'acknowledged':
      return { color: 'bg-blue-500/20 text-blue-400', icon: User };
    case 'resolved':
      return { color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle };
    case 'rejected':
      return { color: 'bg-red-500/20 text-red-400', icon: XCircle };
  }
};

export default function DevManagerEscalations() {
  const pendingCount = mockEscalations.filter(e => e.status === 'pending').length;
  const acknowledgedCount = mockEscalations.filter(e => e.status === 'acknowledged').length;

  return (
    <Card className="bg-zinc-900/50 border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-mono tracking-wider text-zinc-400 flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4" />
            ESCALATIONS
          </CardTitle>
          <div className="flex gap-2">
            {pendingCount > 0 && (
              <Badge className="bg-amber-500/20 text-amber-400">
                {pendingCount} Pending
              </Badge>
            )}
            {acknowledgedCount > 0 && (
              <Badge className="bg-blue-500/20 text-blue-400">
                {acknowledgedCount} In Progress
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockEscalations.map((escalation, idx) => {
          const statusConfig = getStatusConfig(escalation.status);
          const StatusIcon = statusConfig.icon;

          return (
            <motion.div
              key={escalation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-zinc-500">{escalation.id}</span>
                  <span className="text-zinc-600">→</span>
                  <span className="font-mono text-xs">{escalation.taskId}</span>
                </div>
                <Badge className={`text-xs ${statusConfig.color}`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {escalation.status.toUpperCase()}
                </Badge>
              </div>

              <p className="text-sm mb-3">{escalation.reason}</p>

              <div className="flex items-center justify-between text-xs text-zinc-500">
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  <span className="font-mono">{escalation.escalatedTo}</span>
                </div>
                <span>{new Date(escalation.escalatedAt).toLocaleDateString()}</span>
              </div>

              {escalation.resolution && (
                <div className="mt-3 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded">
                  <p className="text-xs text-emerald-400">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    {escalation.resolution}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}

        {mockEscalations.length === 0 && (
          <div className="text-center py-8 text-zinc-500">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No escalations</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
