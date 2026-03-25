import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  ArrowRight,
  Phone,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  FileText,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

type PipelineStage = 'assigned' | 'contacted' | 'qualified' | 'converted' | 'lost';

interface PipelineLead {
  id: string;
  leadId: string;
  customerName: string;
  assignedTo: string;
  stage: PipelineStage;
  lastActivity: string;
  daysInStage: number;
  expectedValue: number;
  nextAction: string;
  hasPaymentProof?: boolean;
}

const mockPipeline: PipelineLead[] = [
  {
    id: '1',
    leadId: 'LD-2024-4501',
    customerName: 'Tech Solutions Ltd',
    assignedTo: 'VL-SE-001',
    stage: 'qualified',
    lastActivity: '2 hours ago',
    daysInStage: 3,
    expectedValue: 150000,
    nextAction: 'Send proposal'
  },
  {
    id: '2',
    leadId: 'LD-2024-4502',
    customerName: 'Global Traders',
    assignedTo: 'VL-SE-002',
    stage: 'contacted',
    lastActivity: '1 day ago',
    daysInStage: 5,
    expectedValue: 75000,
    nextAction: 'Schedule demo'
  },
  {
    id: '3',
    leadId: 'LD-2024-4503',
    customerName: 'Metro Industries',
    assignedTo: 'VL-SE-001',
    stage: 'assigned',
    lastActivity: '3 hours ago',
    daysInStage: 1,
    expectedValue: 200000,
    nextAction: 'Initial call'
  },
  {
    id: '4',
    leadId: 'LD-2024-4504',
    customerName: 'Eastern Corp',
    assignedTo: 'VL-SE-003',
    stage: 'converted',
    lastActivity: '1 day ago',
    daysInStage: 0,
    expectedValue: 120000,
    nextAction: 'Onboarding',
    hasPaymentProof: true
  }
];

const stageConfig: Record<PipelineStage, { label: string; color: string; next?: PipelineStage }> = {
  assigned: { label: 'Assigned', color: 'bg-blue-500/10 text-blue-500', next: 'contacted' },
  contacted: { label: 'Contacted', color: 'bg-purple-500/10 text-purple-500', next: 'qualified' },
  qualified: { label: 'Qualified', color: 'bg-yellow-500/10 text-yellow-500', next: 'converted' },
  converted: { label: 'Converted', color: 'bg-green-500/10 text-green-500' },
  lost: { label: 'Lost', color: 'bg-red-500/10 text-red-500' }
};

export const SSMSalesPipeline: React.FC = () => {
  const [pipeline, setPipeline] = useState<PipelineLead[]>(mockPipeline);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const handleMoveStage = (id: string, hasProof: boolean = false) => {
    setPipeline(prev => 
      prev.map(lead => {
        if (lead.id !== id) return lead;
        
        const currentStage = lead.stage;
        const nextStage = stageConfig[currentStage].next;
        
        if (!nextStage) {
          toast.error('Lead is already at final stage');
          return lead;
        }
        
        if (nextStage === 'converted' && !hasProof) {
          toast.error('Payment proof required for conversion');
          return lead;
        }
        
        toast.success(`Lead moved to ${stageConfig[nextStage].label}`);
        return { ...lead, stage: nextStage, daysInStage: 0, hasPaymentProof: hasProof };
      })
    );
    setSelectedLead(null);
  };

  const handleMarkLost = (id: string) => {
    setPipeline(prev => 
      prev.map(lead => 
        lead.id === id ? { ...lead, stage: 'lost' as PipelineStage, daysInStage: 0 } : lead
      )
    );
    toast.success('Lead marked as lost');
    setSelectedLead(null);
  };

  const stages: PipelineStage[] = ['assigned', 'contacted', 'qualified', 'converted'];
  
  const pipelineStats = stages.reduce((acc, stage) => {
    acc[stage] = pipeline.filter(l => l.stage === stage).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            Active Sales Pipeline
          </CardTitle>
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
            <Shield className="h-3 w-3 mr-1" />
            Skip Steps BLOCKED
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Pipeline Funnel */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {stages.map((stage, idx) => (
            <div key={stage} className="relative">
              <div className={`p-3 rounded-lg ${stageConfig[stage].color} text-center`}>
                <span className="text-2xl font-bold">{pipelineStats[stage]}</span>
                <p className="text-xs mt-1">{stageConfig[stage].label}</p>
              </div>
              {idx < stages.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              )}
            </div>
          ))}
        </div>

        {/* Pipeline Flow Notice */}
        <div className="mb-4 p-2 bg-muted/30 rounded-lg text-center">
          <p className="text-xs text-muted-foreground">
            <strong>Flow:</strong> Assigned → Contacted → Qualified → Converted / Lost
            <span className="mx-2">|</span>
            <strong>Converted requires payment proof</strong>
          </p>
        </div>

        {/* Lead List */}
        <div className="space-y-3">
          {pipeline.filter(l => l.stage !== 'converted' && l.stage !== 'lost').map((lead) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-border rounded-lg p-4 bg-background"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-primary">{lead.leadId}</span>
                    <Badge className={stageConfig[lead.stage].color}>
                      {stageConfig[lead.stage].label}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {lead.assignedTo}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-foreground">{lead.customerName}</h4>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">₹{lead.expectedValue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{lead.daysInStage} days in stage</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {lead.lastActivity}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {lead.nextAction}
                  </span>
                </div>
              </div>

              {selectedLead === lead.id ? (
                <div className="border-t border-border pt-3 flex gap-2">
                  {stageConfig[lead.stage].next === 'converted' ? (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleMoveStage(lead.id, true)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Confirm with Payment Proof
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleMoveStage(lead.id)}
                    >
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Move to {stageConfig[stageConfig[lead.stage].next!].label}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleMarkLost(lead.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Mark Lost
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedLead(null)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedLead(lead.id)}
                >
                  Update Stage
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Converted Leads */}
        {pipeline.filter(l => l.stage === 'converted').length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Recently Converted
            </h4>
            <div className="space-y-2">
              {pipeline.filter(l => l.stage === 'converted').map(lead => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-primary">{lead.leadId}</span>
                    <span className="text-foreground">{lead.customerName}</span>
                    {lead.hasPaymentProof && (
                      <Badge className="bg-green-500/10 text-green-500">
                        <FileText className="h-3 w-3 mr-1" />
                        Payment Verified
                      </Badge>
                    )}
                  </div>
                  <span className="font-bold text-green-500">₹{lead.expectedValue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
            <p className="text-xs text-yellow-500">
              Pipeline stages cannot be skipped. Conversion requires verified payment proof. 
              All stage changes are logged immutably.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
