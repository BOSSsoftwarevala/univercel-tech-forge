import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowUpRight, 
  Clock,
  Shield,
  Scale,
  AlertTriangle,
  User,
  CheckCircle,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface Escalation {
  id: string;
  entityType: 'lead' | 'ticket';
  entityId: string;
  entityName: string;
  owner: string;
  escalatedTo: 'pro_manager' | 'legal' | 'super_admin';
  reason: string;
  priority: 'critical' | 'high' | 'medium';
  escalatedAt: string;
  status: 'pending' | 'in_progress' | 'resolved';
  evidence?: string;
}

const mockEscalations: Escalation[] = [
  {
    id: '1',
    entityType: 'ticket',
    entityId: 'TKT-2024-8901',
    entityName: 'Payment gateway integration failing',
    owner: 'VL-SA-001',
    escalatedTo: 'pro_manager',
    reason: 'SLA breached - requires technical expertise',
    priority: 'critical',
    escalatedAt: '2024-01-15T10:30:00Z',
    status: 'in_progress',
    evidence: 'Error logs attached'
  },
  {
    id: '2',
    entityType: 'lead',
    entityId: 'LD-2024-4515',
    entityName: 'Enterprise deal - Metro Industries',
    owner: 'VL-SE-001',
    escalatedTo: 'pro_manager',
    reason: 'Complex pricing negotiation required',
    priority: 'high',
    escalatedAt: '2024-01-15T09:00:00Z',
    status: 'pending'
  },
  {
    id: '3',
    entityType: 'ticket',
    entityId: 'TKT-2024-8890',
    entityName: 'Formal complaint - service quality',
    owner: 'VL-SA-002',
    escalatedTo: 'legal',
    reason: 'Customer threatening legal action',
    priority: 'critical',
    escalatedAt: '2024-01-14T16:00:00Z',
    status: 'in_progress',
    evidence: 'Customer correspondence attached'
  }
];

export const SSMEscalations: React.FC = () => {
  const [escalations] = useState<Escalation[]>(mockEscalations);
  const [selectedEscalation, setSelectedEscalation] = useState<string | null>(null);
  const [escalationEvidence, setEscalationEvidence] = useState('');

  const handleNewEscalation = (target: 'pro_manager' | 'legal' | 'super_admin') => {
    if (!escalationEvidence.trim()) {
      toast.error('Evidence is mandatory for escalation');
      return;
    }
    toast.success(`Escalated to ${target.replace('_', ' ')}`);
    setEscalationEvidence('');
    setSelectedEscalation(null);
  };

  const getTargetIcon = (target: string) => {
    switch (target) {
      case 'pro_manager':
        return <User className="h-4 w-4" />;
      case 'legal':
        return <Scale className="h-4 w-4" />;
      case 'super_admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <ArrowUpRight className="h-4 w-4" />;
    }
  };

  const getTargetColor = (target: string) => {
    switch (target) {
      case 'pro_manager':
        return 'bg-blue-500/10 text-blue-500';
      case 'legal':
        return 'bg-purple-500/10 text-purple-500';
      case 'super_admin':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      critical: 'bg-red-500 text-white',
      high: 'bg-orange-500/10 text-orange-500',
      medium: 'bg-yellow-500/10 text-yellow-500'
    };
    return <Badge className={colors[priority as keyof typeof colors]}>{priority.toUpperCase()}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { color: 'bg-yellow-500/10 text-yellow-500', icon: Clock },
      in_progress: { color: 'bg-blue-500/10 text-blue-500', icon: ArrowUpRight },
      resolved: { color: 'bg-green-500/10 text-green-500', icon: CheckCircle }
    };
    const cfg = config[status as keyof typeof config] || config.pending;
    const Icon = cfg.icon;
    return (
      <Badge className={cfg.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const pendingCount = escalations.filter(e => e.status === 'pending').length;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <ArrowUpRight className="h-5 w-5 text-primary" />
            Escalations
          </CardTitle>
          <Badge variant="outline" className={pendingCount > 0 ? 'bg-yellow-500/10 text-yellow-500' : ''}>
            {pendingCount} Pending
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Pro Manager • Legal (complaints) • Super Admin (critical) • Evidence mandatory
        </p>
      </CardHeader>
      <CardContent className="p-4">
        {/* Quick Escalation Panel */}
        <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="font-medium text-foreground mb-3">Quick Escalate</h4>
          <div>
            <Textarea
              value={escalationEvidence}
              onChange={(e) => setEscalationEvidence(e.target.value)}
              placeholder="Provide evidence and context (mandatory)..."
              className="bg-background border-border mb-3"
              rows={2}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-blue-500/50 text-blue-500 hover:bg-blue-500/10"
                onClick={() => handleNewEscalation('pro_manager')}
              >
                <User className="h-4 w-4 mr-1" />
                Pro Manager
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-purple-500/50 text-purple-500 hover:bg-purple-500/10"
                onClick={() => handleNewEscalation('legal')}
              >
                <Scale className="h-4 w-4 mr-1" />
                Legal
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                onClick={() => handleNewEscalation('super_admin')}
              >
                <Shield className="h-4 w-4 mr-1" />
                Super Admin
              </Button>
            </div>
          </div>
        </div>

        {/* Escalation List */}
        <div className="space-y-4">
          {escalations.map((escalation) => (
            <motion.div
              key={escalation.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-border rounded-lg p-4 bg-background"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getTargetColor(escalation.escalatedTo)}`}>
                    {getTargetIcon(escalation.escalatedTo)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-primary">{escalation.entityId}</span>
                      <Badge variant="outline" className="text-xs">
                        {escalation.entityType}
                      </Badge>
                      {getPriorityBadge(escalation.priority)}
                    </div>
                    <h4 className="font-medium text-foreground">{escalation.entityName}</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      → {escalation.escalatedTo.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                {getStatusBadge(escalation.status)}
              </div>

              <p className="text-sm text-foreground mb-2">{escalation.reason}</p>
              
              {escalation.evidence && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <FileText className="h-3 w-3" />
                  {escalation.evidence}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Owner: {escalation.owner}</span>
                <span>Escalated: {new Date(escalation.escalatedAt).toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {escalations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500 opacity-50" />
            <p>No active escalations</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
            <p className="text-xs text-orange-500">
              All escalations require evidence. Financial escalations are blocked - 
              commission edit and payout/refund approvals are not available to this role.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
