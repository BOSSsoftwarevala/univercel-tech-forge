import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle2, 
  UserPlus,
  Clock,
  Star,
  Shield,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface QualifiedLead {
  id: string;
  email: string;
  source: string;
  qualifiedAt: string;
  aiScore: number;
  priority: 'high' | 'medium' | 'low';
  suggestedOwner: string;
  interest: string;
  country: string;
  status: 'qualified' | 'assigned';
  assignedTo?: string;
}

const mockQualified: QualifiedLead[] = [
  {
    id: 'LD-001',
    email: 'j***@example.com',
    source: 'frontend',
    qualifiedAt: '2035-01-15 10:35',
    aiScore: 92,
    priority: 'high',
    suggestedOwner: 'SM-7823',
    interest: 'Enterprise Plan',
    country: 'India',
    status: 'qualified'
  },
  {
    id: 'LD-002',
    email: 's***@company.com',
    source: 'reseller',
    qualifiedAt: '2035-01-15 10:20',
    aiScore: 88,
    priority: 'high',
    suggestedOwner: 'FRC-1234',
    interest: 'Pro Plan',
    country: 'USA',
    status: 'assigned',
    assignedTo: 'SM-3421'
  },
  {
    id: 'LD-004',
    email: 'm***@biz.com',
    source: 'franchise',
    qualifiedAt: '2035-01-15 09:35',
    aiScore: 95,
    priority: 'high',
    suggestedOwner: 'FRC-1234',
    interest: 'Enterprise Plan',
    country: 'India',
    status: 'qualified'
  },
  {
    id: 'LD-007',
    email: 'k***@startup.io',
    source: 'api',
    qualifiedAt: '2035-01-15 08:45',
    aiScore: 72,
    priority: 'medium',
    suggestedOwner: 'SM-7823',
    interest: 'Basic Plan',
    country: 'Singapore',
    status: 'qualified'
  }
];

const assignOptions = [
  { value: 'SM-7823', label: 'Sales Manager - SM-7823' },
  { value: 'SM-3421', label: 'Sales Manager - SM-3421' },
  { value: 'FRC-1234', label: 'Franchise - FRC-1234' },
  { value: 'FRC-5678', label: 'Franchise - FRC-5678' },
  { value: 'RSL-9012', label: 'Reseller - RSL-9012' }
];

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge variant="destructive">High Priority</Badge>;
    case 'medium':
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Medium</Badge>;
    default:
      return <Badge variant="outline">Low</Badge>;
  }
};

export const LMQualifiedLeads: React.FC = () => {
  const [selectedAssignee, setSelectedAssignee] = useState<Record<string, string>>({});

  const handleAssign = (lead: QualifiedLead) => {
    const assignee = selectedAssignee[lead.id];
    if (!assignee) {
      toast.error('Please select an owner');
      return;
    }
    toast.success(`Lead ${lead.id} assigned to ${assignee}`, {
      description: 'One owner only - assignment logged'
    });
    console.log('[LEAD-MANAGER] Lead assigned:', lead.id, 'to', assignee);
  };

  const unassignedCount = mockQualified.filter(l => l.status === 'qualified').length;

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Qualified Leads
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-2">
              {unassignedCount} Unassigned
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-[350px] overflow-y-auto">
          {mockQualified.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border rounded-lg p-3 ${
                lead.status === 'assigned'
                  ? 'bg-muted/20 border-border/30'
                  : 'bg-green-500/5 border-green-500/30'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-sm">{lead.id}</span>
                    {getPriorityBadge(lead.priority)}
                    {lead.status === 'assigned' && (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                        Assigned
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {lead.email} • {lead.country}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 text-yellow-500" />
                    AI Score: <span className="font-mono text-foreground">{lead.aiScore}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <span>Interest: {lead.interest}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {lead.qualifiedAt}
                </span>
              </div>

              {lead.status === 'qualified' ? (
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <div className="flex-1">
                    <Select
                      value={selectedAssignee[lead.id] || ''}
                      onValueChange={(v) => setSelectedAssignee(prev => ({ ...prev, [lead.id]: v }))}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder={`AI suggests: ${lead.suggestedOwner}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {assignOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value} className="text-xs">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleAssign(lead)}
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Assign
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                  <ArrowRight className="h-3 w-3" />
                  Assigned to: <span className="font-mono text-foreground">{lead.assignedTo}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            <Shield className="h-3 w-3 inline mr-1" />
            One lead = one owner • Reassign requires reason + log
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
