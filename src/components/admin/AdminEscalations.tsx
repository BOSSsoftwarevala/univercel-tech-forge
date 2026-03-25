// ==============================================
// Admin Escalations
// Manager Escalations - Cannot Close Critical Alone
// ==============================================

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowUpRight, AlertTriangle, Clock, MessageSquare,
  CheckCircle, XCircle, User, Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface Escalation {
  id: string;
  title: string;
  description: string;
  source: string;
  sourceRole: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'resolved' | 'escalated_up';
  createdAt: string;
  category: string;
}

export function AdminEscalations() {
  const [escalations, setEscalations] = useState<Escalation[]>([
    {
      id: 'esc-001',
      title: 'Franchise Territory Dispute',
      description: 'Two franchises claiming overlapping territory in US-East region',
      source: 'FM-****42',
      sourceRole: 'Franchise Manager',
      severity: 'high',
      status: 'pending',
      createdAt: '2024-01-30 14:00',
      category: 'Territory',
    },
    {
      id: 'esc-002',
      title: 'Support Ticket SLA Breach',
      description: 'Multiple P1 tickets breached SLA in last 24 hours',
      source: 'SM-****18',
      sourceRole: 'Sales Support Manager',
      severity: 'medium',
      status: 'in_progress',
      createdAt: '2024-01-30 12:30',
      category: 'SLA',
    },
    {
      id: 'esc-003',
      title: 'Suspected Fraud Activity',
      description: 'AI flagged unusual transaction pattern from reseller account',
      source: 'SYSTEM',
      sourceRole: 'AI Detection',
      severity: 'critical',
      status: 'pending',
      createdAt: '2024-01-30 11:00',
      category: 'Fraud',
    },
    {
      id: 'esc-004',
      title: 'Partner Compliance Issue',
      description: 'Partner using unauthorized marketing materials',
      source: 'RM-****99',
      sourceRole: 'Reseller Manager',
      severity: 'low',
      status: 'pending',
      createdAt: '2024-01-30 09:15',
      category: 'Compliance',
    },
  ]);

  const [responseText, setResponseText] = useState('');
  const [selectedEscalation, setSelectedEscalation] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400';
      case 'resolved': return 'bg-green-500/20 text-green-400';
      case 'escalated_up': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleResolve = (escalation: Escalation) => {
    if (escalation.severity === 'critical') {
      toast.error('BLOCKED: Critical escalations cannot be closed by Admin alone. Must escalate to Super Admin.');
      return;
    }

    if (!responseText.trim()) {
      toast.error('Resolution notes are required');
      return;
    }

    setEscalations(prev => prev.map(e => 
      e.id === escalation.id ? { ...e, status: 'resolved' as const } : e
    ));
    setResponseText('');
    setSelectedEscalation(null);
    toast.success('Escalation resolved');
  };

  const handleEscalateUp = (escalationId: string) => {
    setEscalations(prev => prev.map(e => 
      e.id === escalationId ? { ...e, status: 'escalated_up' as const } : e
    ));
    toast.info('Escalated to Super Admin');
  };

  const handleTakeOwnership = (escalationId: string) => {
    setEscalations(prev => prev.map(e => 
      e.id === escalationId ? { ...e, status: 'in_progress' as const } : e
    ));
    toast.success('Escalation assigned to you');
  };

  const activeEscalations = escalations.filter(e => e.status !== 'resolved');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ArrowUpRight className="h-5 w-5 text-primary" />
          Manager Escalations
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-red-500/10 text-red-400">
            {escalations.filter(e => e.severity === 'critical' && e.status === 'pending').length} Critical
          </Badge>
          <Badge variant="outline">
            {activeEscalations.length} Active
          </Badge>
        </div>
      </div>

      {/* Critical Warning */}
      <Card className="bg-red-500/10 border-red-500/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <span>Critical escalations cannot be closed by Admin alone. They must be escalated to Super Admin.</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {activeEscalations.map(escalation => (
          <Card key={escalation.id} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{escalation.title}</span>
                    <Badge className={getSeverityColor(escalation.severity)}>
                      {escalation.severity.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(escalation.status)}>
                      {escalation.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {escalation.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{escalation.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  From: {escalation.source} ({escalation.sourceRole})
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {escalation.createdAt}
                </span>
              </div>

              {selectedEscalation === escalation.id && (
                <div className="mb-3">
                  <Textarea
                    placeholder="Enter resolution notes..."
                    value={responseText}
                    onChange={e => setResponseText(e.target.value)}
                    className="mb-2"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                {escalation.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTakeOwnership(escalation.id)}
                    className="text-xs"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Take Ownership
                  </Button>
                )}

                {escalation.status === 'in_progress' && (
                  <>
                    {escalation.severity === 'critical' ? (
                      <Button
                        size="sm"
                        onClick={() => handleEscalateUp(escalation.id)}
                        className="text-xs"
                      >
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        Escalate to Super Admin
                      </Button>
                    ) : (
                      <>
                        {selectedEscalation === escalation.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleResolve(escalation)}
                              className="text-xs bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Confirm Resolve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedEscalation(null)}
                              className="text-xs"
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => setSelectedEscalation(escalation.id)}
                            className="text-xs bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </>
                    )}
                  </>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEscalateUp(escalation.id)}
                  className="text-xs ml-auto"
                >
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Escalate Up
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {activeEscalations.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active escalations</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
