import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  AlertTriangle,
  ArrowRight,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface AssignedLead {
  id: string;
  leadId: string;
  customerName: string;
  contactPhone: string;
  contactEmail: string;
  source: string;
  region: string;
  priority: 'high' | 'medium' | 'low';
  assignedAt: string;
  slaDeadline: string;
  assignedTo?: string;
  status: 'new' | 'assigned';
}

const mockLeads: AssignedLead[] = [
  {
    id: '1',
    leadId: 'LD-2024-4521',
    customerName: 'Rajesh Kumar',
    contactPhone: '+91-98XXX-XXXXX',
    contactEmail: 'r***@company.com',
    source: 'Website Inquiry',
    region: 'North',
    priority: 'high',
    assignedAt: '2024-01-15T09:30:00Z',
    slaDeadline: '2024-01-15T13:30:00Z',
    status: 'new'
  },
  {
    id: '2',
    leadId: 'LD-2024-4522',
    customerName: 'Priya Sharma',
    contactPhone: '+91-87XXX-XXXXX',
    contactEmail: 'p***@business.com',
    source: 'Referral',
    region: 'West',
    priority: 'medium',
    assignedAt: '2024-01-15T08:15:00Z',
    slaDeadline: '2024-01-15T16:15:00Z',
    status: 'new'
  },
  {
    id: '3',
    leadId: 'LD-2024-4523',
    customerName: 'Amit Patel',
    contactPhone: '+91-76XXX-XXXXX',
    contactEmail: 'a***@enterprise.com',
    source: 'Campaign',
    region: 'South',
    priority: 'high',
    assignedAt: '2024-01-15T07:00:00Z',
    slaDeadline: '2024-01-15T11:00:00Z',
    status: 'assigned',
    assignedTo: 'VL-SE-001'
  }
];

const salesExecs = [
  { id: 'VL-SE-001', name: 'Sales Exec 1', activeLeads: 5 },
  { id: 'VL-SE-002', name: 'Sales Exec 2', activeLeads: 3 },
  { id: 'VL-SE-003', name: 'Sales Exec 3', activeLeads: 7 },
];

export const SSMAssignedLeads: React.FC = () => {
  const [leads, setLeads] = useState<AssignedLead[]>(mockLeads);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const handleAssignLead = (leadId: string, execId: string) => {
    setLeads(prev => 
      prev.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: 'assigned' as const, assignedTo: execId }
          : lead
      )
    );
    toast.success(`Lead assigned to ${execId}`);
    setSelectedLead(null);
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-500/10 text-red-500 border-red-500/30',
      medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
      low: 'bg-blue-500/10 text-blue-500 border-blue-500/30'
    };
    return <Badge className={colors[priority as keyof typeof colors]}>{priority.toUpperCase()}</Badge>;
  };

  const getSLAStatus = (deadline: string) => {
    const now = new Date();
    const sla = new Date(deadline);
    const hoursLeft = (sla.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursLeft < 0) return { label: 'BREACHED', color: 'text-red-500 bg-red-500/10' };
    if (hoursLeft < 1) return { label: `${Math.round(hoursLeft * 60)}m left`, color: 'text-red-500 bg-red-500/10' };
    if (hoursLeft < 4) return { label: `${hoursLeft.toFixed(1)}h left`, color: 'text-yellow-500 bg-yellow-500/10' };
    return { label: `${hoursLeft.toFixed(1)}h left`, color: 'text-green-500 bg-green-500/10' };
  };

  const newLeads = leads.filter(l => l.status === 'new');

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <UserPlus className="h-5 w-5 text-primary" />
            New Assigned Leads
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
              <Shield className="h-3 w-3 mr-1" />
              Delete BLOCKED
            </Badge>
            <Badge variant="outline">
              {newLeads.length} Pending Assignment
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Leads from Lead Manager • One lead → One Sales Exec • Follow-up SLA mandatory
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {leads.map((lead) => {
            const slaStatus = getSLAStatus(lead.slaDeadline);
            
            return (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-border rounded-lg p-4 bg-background"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-primary">{lead.leadId}</span>
                      {getPriorityBadge(lead.priority)}
                      <Badge variant={lead.status === 'assigned' ? 'default' : 'secondary'}>
                        {lead.status === 'assigned' ? `→ ${lead.assignedTo}` : 'Unassigned'}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-foreground">{lead.customerName}</h4>
                    <p className="text-sm text-muted-foreground">{lead.source}</p>
                  </div>
                  <Badge className={`${slaStatus.color} font-mono`}>
                    <Clock className="h-3 w-3 mr-1" />
                    {slaStatus.label}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{lead.contactPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{lead.contactEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{lead.region} Region</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(lead.assignedAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                {lead.status === 'new' && (
                  selectedLead === lead.id ? (
                    <div className="border-t border-border pt-3">
                      <p className="text-sm font-medium text-foreground mb-2">Assign to Sales Executive:</p>
                      <div className="flex flex-wrap gap-2">
                        {salesExecs.map((exec) => (
                          <Button
                            key={exec.id}
                            size="sm"
                            variant="outline"
                            onClick={() => handleAssignLead(lead.id, exec.id)}
                            className="flex items-center gap-2"
                          >
                            <User className="h-3 w-3" />
                            {exec.id}
                            <Badge variant="secondary" className="text-xs">
                              {exec.activeLeads} leads
                            </Badge>
                          </Button>
                        ))}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedLead(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setSelectedLead(lead.id)}
                    >
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Assign Lead
                    </Button>
                  )
                )}
              </motion.div>
            );
          })}
        </div>

        {leads.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <UserPlus className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>No new leads to assign</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-blue-400 mt-0.5" />
            <p className="text-xs text-blue-400">
              Leads come ONLY from Lead Manager. Each lead must have one owner. 
              No lead can exist without assignment. Delete is permanently blocked.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
