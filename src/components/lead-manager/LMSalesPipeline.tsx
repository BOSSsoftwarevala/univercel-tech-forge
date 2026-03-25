import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Inbox, Phone, CheckCircle, Heart, FileText, MessageSquare,
  Trophy, XCircle, Moon, MoreHorizontal, Plus, Eye, UserPlus,
  TrendingUp, IndianRupee
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { pipelineStages, sampleLeads } from './data/leadData';
import { Lead, LeadStatus } from './types/leadTypes';

const iconMap: Record<string, any> = {
  Inbox, Phone, CheckCircle, Heart, FileText, MessageSquare, Trophy, XCircle, Moon
};

const LMSalesPipeline = () => {
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragEnd = () => {
    setDraggedLead(null);
  };

  const handleDrop = async (newStatus: LeadStatus) => {
    if (!draggedLead) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    toast.success(`Lead "${draggedLead.name}" moved to ${newStatus.replace('_', ' ')}`);
    console.log('[PIPELINE] Lead status updated:', {
      leadId: draggedLead.id,
      oldStatus: draggedLead.status,
      newStatus,
      timestamp: new Date().toISOString()
    });
    
    setIsLoading(false);
    setDraggedLead(null);
  };

  const handleAction = (action: string, lead: Lead) => {
    switch (action) {
      case 'view':
        toast.info(`Viewing: ${lead.name}`);
        break;
      case 'assign':
        toast.success(`Assigning: ${lead.name}`);
        break;
      case 'convert':
        toast.success(`Converting: ${lead.name} to Won`);
        break;
      case 'lost':
        toast.error(`Marked as Lost: ${lead.name}`);
        break;
    }
  };

  const getLeadsForStage = (status: LeadStatus): Lead[] => {
    // In real app, filter from actual data
    return sampleLeads.filter(l => l.status === status);
  };

  return (
    <div className="space-y-4">
      {/* Pipeline Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Sales Pipeline</h2>
          <p className="text-sm text-muted-foreground">Drag and drop leads between stages</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <IndianRupee className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">₹18.05L</span>
            <span className="text-muted-foreground">Pipeline Value</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="font-medium text-green-500">+12.5%</span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {pipelineStages.map((stage) => {
          const StageIcon = iconMap[stage.icon] || Inbox;
          const stageLeads = getLeadsForStage(stage.id);

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-shrink-0 w-72"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage.id)}
            >
              <Card className={`bg-card border-border h-full ${
                draggedLead ? 'border-dashed border-primary/50' : ''
              }`}>
                <CardHeader className="pb-2 pt-3 px-3">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md bg-${stage.color}-500/20 flex items-center justify-center`}>
                        <StageIcon className={`w-3.5 h-3.5 text-${stage.color}-500`} />
                      </div>
                      <span className="text-foreground">{stage.name}</span>
                      <Badge variant="secondary" className="text-xs px-1.5">
                        {stage.count}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                  {stage.value > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ₹{(stage.value / 100000).toFixed(1)}L value
                    </p>
                  )}
                </CardHeader>
                <CardContent className="px-2 pb-2">
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2 p-1">
                      {stageLeads.map((lead) => (
                        <motion.div
                          key={lead.id}
                          draggable
                          onDragStart={() => handleDragStart(lead)}
                          onDragEnd={handleDragEnd}
                          whileHover={{ scale: 1.02 }}
                          className={`p-3 rounded-lg bg-accent/50 border border-border hover:border-primary/30 cursor-grab active:cursor-grabbing transition-all ${
                            draggedLead?.id === lead.id ? 'opacity-50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                {lead.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{lead.name}</p>
                                <p className="text-xs text-muted-foreground">{lead.company}</p>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreHorizontal className="w-3 h-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleAction('view', lead)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAction('assign', lead)}>
                                  <UserPlus className="w-4 h-4 mr-2" />
                                  Assign
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAction('convert', lead)}>
                                  <Trophy className="w-4 h-4 mr-2" />
                                  Mark Won
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAction('lost', lead)} className="text-red-500">
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Mark Lost
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <div className="space-y-1.5">
                            <Badge className={`text-xs ${
                              lead.priority === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                              lead.priority === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                              'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            }`}>
                              {lead.priority}
                            </Badge>
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>AI: {lead.aiScore}%</span>
                              <span>{lead.lastActivityTime}</span>
                            </div>
                            
                            <div className="text-xs text-muted-foreground">
                              {lead.city}, {lead.country}
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {stageLeads.length === 0 && (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                          No leads in this stage
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LMSalesPipeline;
