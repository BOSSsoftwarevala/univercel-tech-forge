import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bell, 
  Clock,
  ArrowUpRight,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Shield,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface EscalationItem {
  id: string;
  type: 'escalation' | 'followup';
  leadId: string;
  subject: string;
  description: string;
  dueAt: string;
  priority: 'critical' | 'high' | 'medium';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  createdBy: string;
}

const mockItems: EscalationItem[] = [
  {
    id: 'ESC-001',
    type: 'escalation',
    leadId: 'LD-045',
    subject: 'Stalled Lead - No Response',
    description: 'Lead assigned 7 days ago with no follow-up logged. Requires immediate attention.',
    dueAt: '2035-01-15 12:00',
    priority: 'critical',
    status: 'pending',
    assignedTo: 'SM-7823',
    createdBy: 'SYSTEM'
  },
  {
    id: 'FUP-001',
    type: 'followup',
    leadId: 'LD-067',
    subject: 'Demo Scheduled Follow-up',
    description: 'Demo completed yesterday. Follow-up call required to close deal.',
    dueAt: '2035-01-15 14:00',
    priority: 'high',
    status: 'pending',
    assignedTo: 'SM-3421',
    createdBy: 'SM-3421'
  },
  {
    id: 'ESC-002',
    type: 'escalation',
    leadId: 'LD-089',
    subject: 'Quality Dispute',
    description: 'Franchise FRC-1234 disputing lead quality. Requires investigation.',
    dueAt: '2035-01-15 16:00',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'LM-CURRENT',
    createdBy: 'FRC-1234'
  },
  {
    id: 'FUP-002',
    type: 'followup',
    leadId: 'LD-112',
    subject: 'Pricing Negotiation',
    description: 'Enterprise lead requested custom pricing. Awaiting finance response.',
    dueAt: '2035-01-16 10:00',
    priority: 'medium',
    status: 'pending',
    assignedTo: 'SM-7823',
    createdBy: 'SM-7823'
  }
];

const getTypeBadge = (type: string) => {
  return type === 'escalation' 
    ? <Badge variant="destructive">Escalation</Badge>
    : <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Follow-up</Badge>;
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'critical':
      return <Badge variant="destructive" className="text-xs">Critical</Badge>;
    case 'high':
      return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">High</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">Medium</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">Pending</Badge>;
    case 'in_progress':
      return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">In Progress</Badge>;
    case 'completed':
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export const LMEscalationsFollowups: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [responseNote, setResponseNote] = useState('');

  const handleResolve = (item: EscalationItem) => {
    if (!responseNote.trim()) {
      toast.error('Resolution note is mandatory');
      return;
    }
    toast.success(`${item.type === 'escalation' ? 'Escalation' : 'Follow-up'} ${item.id} resolved`, {
      description: 'Action logged and parties notified'
    });
    console.log('[LEAD-MANAGER] Item resolved:', item.id, 'Note:', responseNote);
    setSelectedItem(null);
    setResponseNote('');
  };

  const handleEscalateUp = (item: EscalationItem) => {
    toast.warning(`${item.id} escalated to Pro Manager`, {
      description: 'Forwarded with full context'
    });
    console.log('[LEAD-MANAGER] Escalated up:', item.id);
  };

  const pendingCount = mockItems.filter(i => i.status === 'pending').length;
  const escalationCount = mockItems.filter(i => i.type === 'escalation').length;

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-primary" />
            Escalations / Follow-ups
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingCount}</Badge>
            )}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {escalationCount} Escalations
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-[350px] overflow-y-auto">
          {mockItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border rounded-lg p-3 ${
                item.type === 'escalation'
                  ? 'bg-red-500/5 border-red-500/30'
                  : 'bg-blue-500/5 border-blue-500/30'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-sm">{item.id}</span>
                    {getTypeBadge(item.type)}
                    {getPriorityBadge(item.priority)}
                  </div>
                  <p className="font-medium text-sm">{item.subject}</p>
                  <p className="text-xs text-muted-foreground">Lead: {item.leadId}</p>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <p className="text-xs text-muted-foreground mb-2">{item.description}</p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Due: {item.dueAt}
                </span>
                <span className="flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  To: {item.assignedTo}
                </span>
              </div>

              {/* Action Panel */}
              {selectedItem === item.id ? (
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Textarea
                    placeholder="Enter resolution note (MANDATORY)..."
                    value={responseNote}
                    onChange={(e) => setResponseNote(e.target.value)}
                    className="text-sm min-h-[60px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleResolve(item)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleEscalateUp(item)}
                    >
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      Escalate Up
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedItem(null);
                        setResponseNote('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedItem(item.id)}
                  disabled={item.status === 'completed'}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Take Action
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            <Shield className="h-3 w-3 inline mr-1" />
            All actions logged • Resolution note mandatory
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
