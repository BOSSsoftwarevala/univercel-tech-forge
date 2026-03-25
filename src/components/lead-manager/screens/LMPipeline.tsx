import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, Phone, TrendingUp, Calendar, MessageSquare, UserCheck, XCircle,
  Eye, Edit, MoreHorizontal, GripVertical, Loader2, AlertCircle, CheckCircle
} from 'lucide-react';
import { useLeadPipeline, useUpdateLead, type LeadStatusType } from '@/hooks/useLeadData';
import { toast } from 'sonner';

const pipelineConfig: { id: LeadStatusType; label: string; icon: any; color: string }[] = [
  { id: 'new', label: 'New', icon: Target, color: 'bg-blue-500' },
  { id: 'assigned', label: 'Assigned', icon: UserCheck, color: 'bg-indigo-500' },
  { id: 'contacted', label: 'Contacted', icon: Phone, color: 'bg-purple-500' },
  { id: 'follow_up', label: 'Follow-Up', icon: Calendar, color: 'bg-yellow-500' },
  { id: 'qualified', label: 'Qualified', icon: TrendingUp, color: 'bg-cyan-500' },
  { id: 'negotiation', label: 'Negotiation', icon: MessageSquare, color: 'bg-orange-500' },
  { id: 'closed_won', label: 'Won', icon: CheckCircle, color: 'bg-green-500' },
  { id: 'closed_lost', label: 'Lost', icon: XCircle, color: 'bg-red-500' },
];

const LMPipeline = () => {
  const { data: pipeline, isLoading } = useLeadPipeline();
  const updateLead = useUpdateLead();

  const handleMoveStage = (leadId: string, newStatus: LeadStatusType) => {
    updateLead.mutate({ id: leadId, updates: { status: newStatus } });
    toast.info(`Lead moved to ${newStatus.replace('_', ' ')}`);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Pipeline</h1>
          <p className="text-muted-foreground">Visual pipeline with real-time lead stages</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          {pipelineConfig.length} Stages
        </Badge>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-8 gap-2">
        {pipelineConfig.map((stage, index) => {
          const Icon = stage.icon;
          const count = pipeline?.[stage.id]?.length || 0;
          return (
            <motion.div key={stage.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="bg-card border-border text-center">
                <CardContent className="p-3">
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${stage.color} bg-opacity-20 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${stage.color.replace('bg-', 'text-')}`} />
                  </div>
                  <p className="text-lg font-bold text-foreground">{count}</p>
                  <p className="text-xs text-muted-foreground">{stage.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-8 gap-2 overflow-x-auto">
        {pipelineConfig.map((stage) => {
          const leads = pipeline?.[stage.id] || [];
          return (
            <div key={stage.id} className="min-w-[160px]">
              <div className={`p-2 rounded-t-lg ${stage.color} bg-opacity-20 border-b-2 ${stage.color.replace('bg-', 'border-')}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{stage.label}</span>
                  <Badge variant="secondary" className="text-[10px]">{leads.length}</Badge>
                </div>
              </div>
              <div className="bg-accent/30 rounded-b-lg p-1.5 space-y-1.5 min-h-[250px]">
                {leads.length === 0 ? (
                  <div className="flex items-center justify-center h-20 text-muted-foreground">
                    <p className="text-[10px]">No leads</p>
                  </div>
                ) : leads.slice(0, 5).map((lead: any) => (
                  <motion.div key={lead.id} whileHover={{ scale: 1.02 }} className="bg-card border border-border rounded-lg p-2 cursor-pointer">
                    <p className="font-medium text-xs text-foreground truncate">{lead.name}</p>
                    {lead.company && <p className="text-[10px] text-muted-foreground truncate">{lead.company}</p>}
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant="outline" className="text-[9px] px-1 py-0">{lead.source}</Badge>
                      {lead.ai_score && <span className="text-[10px] text-primary font-semibold">{lead.ai_score}%</span>}
                    </div>
                    <div className="flex items-center gap-0.5 mt-1 pt-1 border-t border-border">
                      <Button size="icon" variant="ghost" className="h-5 w-5"><Eye className="w-2.5 h-2.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-5 w-5"><Edit className="w-2.5 h-2.5" /></Button>
                      <Button size="icon" variant="ghost" className="h-5 w-5"><Phone className="w-2.5 h-2.5" /></Button>
                    </div>
                  </motion.div>
                ))}
                {leads.length > 5 && (
                  <p className="text-[10px] text-center text-muted-foreground">+{leads.length - 5} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LMPipeline;
