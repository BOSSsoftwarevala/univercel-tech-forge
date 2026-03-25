import { motion } from 'framer-motion';
import { ArrowUpRight, AlertTriangle, Clock, CheckCircle, Scale, Shield, User, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Escalation {
  id: string;
  valaId: string;
  type: 'fraud' | 'compliance' | 'legal' | 'performance';
  description: string;
  escalatedTo: string;
  escalatedAt: string;
  status: 'pending' | 'in_review' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  escalatedBy: string;
  resolution?: string;
}

const mockEscalations: Escalation[] = [
  { id: '1', valaId: 'VL-4827163', type: 'fraud', description: 'Confirmed bot traffic exceeding 60% of total clicks', escalatedTo: 'Admin Team', escalatedAt: '2024-01-15 15:30', status: 'in_review', priority: 'high', escalatedBy: 'IM-7829' },
  { id: '2', valaId: 'VL-9173628', type: 'compliance', description: 'Promoting in restricted region - multiple violations', escalatedTo: 'Legal Team', escalatedAt: '2024-01-15 10:22', status: 'pending', priority: 'high', escalatedBy: 'IM-7829' },
  { id: '3', valaId: 'VL-2918374', type: 'legal', description: 'Trademark infringement in promotional content', escalatedTo: 'Legal Team', escalatedAt: '2024-01-14 16:45', status: 'in_review', priority: 'medium', escalatedBy: 'IM-7829' },
  { id: '4', valaId: 'VL-7382916', type: 'performance', description: 'Refund-linked traffic pattern detected', escalatedTo: 'Finance Review', escalatedAt: '2024-01-14 09:12', status: 'resolved', priority: 'medium', escalatedBy: 'IM-7829', resolution: 'Fraud confirmed. Commission clawback processed.' },
];

export function IMEscalations() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fraud': return <Shield className="w-5 h-5 text-red-400" />;
      case 'compliance': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'legal': return <Scale className="w-5 h-5 text-blue-400" />;
      default: return <ArrowUpRight className="w-5 h-5 text-primary" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'in_review': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'resolved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const pendingCount = mockEscalations.filter(e => e.status === 'pending').length;
  const inReviewCount = mockEscalations.filter(e => e.status === 'in_review').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Escalations</h2>
          <p className="text-sm text-muted-foreground">Issues escalated to Admin, Legal, or Finance teams</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400">
            {pendingCount} Pending
          </Badge>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
            {inReviewCount} In Review
          </Badge>
        </div>
      </div>

      {/* Escalation Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Shield className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">
              {mockEscalations.filter(e => e.type === 'fraud').length}
            </div>
            <div className="text-xs text-muted-foreground">Fraud Escalations</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">
              {mockEscalations.filter(e => e.type === 'compliance').length}
            </div>
            <div className="text-xs text-muted-foreground">Compliance Issues</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Scale className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">
              {mockEscalations.filter(e => e.type === 'legal').length}
            </div>
            <div className="text-xs text-muted-foreground">Legal Issues</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">
              {mockEscalations.filter(e => e.status === 'resolved').length}
            </div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </CardContent>
        </Card>
      </div>

      {/* Escalations List */}
      <div className="space-y-4">
        {mockEscalations.map((escalation, index) => (
          <motion.div
            key={escalation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-card/50 ${
              escalation.priority === 'high' ? 'border-red-500/30' : 'border-border/50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    {getTypeIcon(escalation.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-semibold text-foreground">{escalation.valaId}</span>
                      <Badge variant="outline" className={getStatusBadge(escalation.status)}>
                        {escalation.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getPriorityBadge(escalation.priority)}>
                        {escalation.priority.toUpperCase()} PRIORITY
                      </Badge>
                      <Badge variant="outline">
                        {escalation.type.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-2">{escalation.description}</p>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        <span>Escalated to: <span className="text-foreground">{escalation.escalatedTo}</span></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>By: <span className="font-mono">{escalation.escalatedBy}</span></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{escalation.escalatedAt}</span>
                      </div>
                    </div>

                    {escalation.resolution && (
                      <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                        <div className="flex items-center gap-2 text-emerald-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Resolution:</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{escalation.resolution}</p>
                      </div>
                    )}
                  </div>

                  {escalation.status !== 'resolved' && (
                    <div>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Follow Up
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Note about upward-only flow */}
      <Card className="bg-muted/30 border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowUpRight className="w-4 h-4" />
            <span>Escalations flow upward only. Resolution decisions come from Admin/Legal/Finance teams.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
