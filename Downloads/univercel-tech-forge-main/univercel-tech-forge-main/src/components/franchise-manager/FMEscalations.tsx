import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpRight, AlertTriangle, Scale, Shield, Clock, CheckCircle, XCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

type EscalationStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';
type EscalationTarget = 'legal' | 'pro_manager' | 'super_admin' | 'admin';

interface Escalation {
  id: string;
  franchiseId: string;
  franchiseName: string;
  issueType: string;
  description: string;
  escalatedTo: EscalationTarget;
  status: EscalationStatus;
  escalatedAt: string;
  escalatedBy: string;
  resolution?: string;
  resolvedAt?: string;
}

const mockEscalations: Escalation[] = [
  {
    id: 'ESC-001',
    franchiseId: 'FR-003',
    franchiseName: 'SaaS Solutions Bangalore',
    issueType: 'Repeated Policy Breach',
    description: 'Multiple territory violations despite warnings',
    escalatedTo: 'super_admin',
    status: 'pending',
    escalatedAt: '2024-01-15',
    escalatedBy: 'Franchise Manager'
  },
  {
    id: 'ESC-002',
    franchiseId: 'FR-002',
    franchiseName: 'Digital Dynamics Delhi',
    issueType: 'Brand Misuse',
    description: 'Unauthorized use of trademarked materials',
    escalatedTo: 'legal',
    status: 'in_progress',
    escalatedAt: '2024-01-12',
    escalatedBy: 'Franchise Manager'
  },
  {
    id: 'ESC-003',
    franchiseId: 'FR-001',
    franchiseName: 'TechVentures Mumbai',
    issueType: 'Performance Issue',
    description: 'Consistent underperformance requiring professional intervention',
    escalatedTo: 'pro_manager',
    status: 'resolved',
    escalatedAt: '2024-01-08',
    escalatedBy: 'Franchise Manager',
    resolution: 'Performance improvement plan implemented',
    resolvedAt: '2024-01-14'
  }
];

export function FMEscalations() {
  const [escalations] = useState<Escalation[]>(mockEscalations);

  const getTargetBadge = (target: EscalationTarget) => {
    const configs = {
      legal: { icon: Scale, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      pro_manager: { icon: Shield, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      super_admin: { icon: AlertTriangle, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
      admin: { icon: Shield, color: 'bg-primary/20 text-primary border-primary/30' }
    };
    const config = configs[target];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {target.replace('_', ' ')}
      </Badge>
    );
  };

  const getStatusBadge = (status: EscalationStatus) => {
    const configs = {
      pending: { icon: Clock, color: 'bg-yellow-500/20 text-yellow-400' },
      in_progress: { icon: ArrowUpRight, color: 'bg-blue-500/20 text-blue-400' },
      resolved: { icon: CheckCircle, color: 'bg-green-500/20 text-green-400' },
      rejected: { icon: XCircle, color: 'bg-destructive/20 text-destructive' }
    };
    const config = configs[status];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const pendingCount = escalations.filter(e => e.status === 'pending').length;
  const inProgressCount = escalations.filter(e => e.status === 'in_progress').length;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5 text-primary" />
            Escalations
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">
              {pendingCount} Pending
            </Badge>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
              {inProgressCount} In Progress
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Finance Escalation Block Notice */}
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Finance Escalations BLOCKED</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Franchise Manager cannot escalate financial matters. Use Legal or Pro Manager channels.
          </p>
        </div>

        <ScrollArea className="h-[350px]">
          <div className="space-y-3">
            {escalations.map((esc, index) => (
              <motion.div
                key={esc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${
                  esc.status === 'resolved'
                    ? 'border-green-500/20 bg-green-500/5'
                    : esc.status === 'pending'
                    ? 'border-yellow-500/20 bg-yellow-500/5'
                    : 'border-border/50 bg-background/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{esc.issueType}</span>
                      <Badge variant="outline" className="text-xs">{esc.id}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{esc.franchiseName}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTargetBadge(esc.escalatedTo)}
                    {getStatusBadge(esc.status)}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{esc.description}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span>Escalated: {esc.escalatedAt}</span>
                    <span>By: {esc.escalatedBy}</span>
                  </div>
                  {esc.resolvedAt && (
                    <span className="text-green-400">Resolved: {esc.resolvedAt}</span>
                  )}
                </div>

                {esc.resolution && (
                  <div className="mt-3 p-2 rounded bg-green-500/10 border border-green-500/20">
                    <p className="text-xs text-green-400">
                      <CheckCircle className="h-3 w-3 inline mr-1" />
                      Resolution: {esc.resolution}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
