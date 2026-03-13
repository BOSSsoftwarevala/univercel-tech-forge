import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Target, Lightbulb, AlertTriangle, Copy,
  Eye, Edit, Check, X, Flag, Loader2, Sparkles
} from 'lucide-react';
import { useLeads, useAILeadAction, useLeadStats } from '@/hooks/useLeadData';
import { toast } from 'sonner';

const LMQualification = () => {
  const { data: stats, isLoading: statsLoading } = useLeadStats();
  const { data: leads, isLoading: leadsLoading } = useLeads({ status: 'new' });
  const aiAction = useAILeadAction();
  const [scoring, setScoring] = useState<string | null>(null);

  const handleAIScore = async (leadId: string) => {
    setScoring(leadId);
    try {
      await aiAction.mutateAsync({ action: 'score', leadId });
      toast.success('AI scoring complete');
    } catch {
      toast.error('AI scoring failed');
    }
    setScoring(null);
  };

  const handleBulkQualify = async () => {
    toast.info('Running AI bulk qualification...');
    try {
      const result = await aiAction.mutateAsync({ action: 'qualify' });
      toast.success(`Qualified ${result?.qualified || 0} leads`);
    } catch {
      toast.error('Bulk qualification failed');
    }
  };

  const qualificationMetrics = [
    { label: 'Total Leads', value: stats?.total || 0, icon: Brain, color: 'text-purple-500' },
    { label: 'Hot Priority', value: stats?.byPriority?.hot || 0, icon: Target, color: 'text-red-500' },
    { label: 'Warm Priority', value: stats?.byPriority?.warm || 0, icon: Lightbulb, color: 'text-yellow-500' },
    { label: 'Cold Priority', value: stats?.byPriority?.cold || 0, icon: AlertTriangle, color: 'text-blue-500' },
    { label: 'New (Unscored)', value: stats?.byStatus?.new || 0, icon: Copy, color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Qualification</h1>
          <p className="text-muted-foreground">AI + Manual scoring and qualification</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleBulkQualify} disabled={aiAction.isPending} size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            AI Bulk Qualify
          </Button>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/30">
            AI Engine Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {qualificationMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div key={metric.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${metric.color}`} />
                  <p className="text-2xl font-bold text-foreground">{statsLoading ? '...' : metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center justify-between">
            <span>New Leads - Pending Qualification</span>
            <Badge variant="secondary">{leads?.length || 0} leads</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {leadsLoading ? (
            <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : !leads?.length ? (
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
              <Check className="w-8 h-8 mb-2 text-green-500" />
              <p className="text-sm">All leads qualified</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-accent/50">
                <tr>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Lead</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Source</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">AI Score</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Conversion %</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Priority</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 10).map((lead, index) => (
                  <motion.tr key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="border-b border-border hover:bg-accent/30">
                    <td className="p-3">
                      <span className="font-medium text-foreground">{lead.name}</span>
                      {lead.company && <p className="text-xs text-muted-foreground">{lead.company}</p>}
                    </td>
                    <td className="p-3"><Badge variant="outline" className="text-xs">{lead.source}</Badge></td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Progress value={lead.ai_score || 0} className="w-16 h-2" />
                        <span className="text-xs">{lead.ai_score || '—'}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Progress value={lead.conversion_probability || 0} className="w-16 h-2" />
                        <span className="text-xs">{lead.conversion_probability || '—'}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      {lead.priority ? (
                        <Badge className={`text-xs ${
                          lead.priority === 'hot' ? 'bg-red-500/20 text-red-400' :
                          lead.priority === 'warm' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          <Flag className="w-3 h-3 mr-1" />{lead.priority}
                        </Badge>
                      ) : <span className="text-xs text-muted-foreground">Unscored</span>}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => handleAIScore(lead.id)} disabled={scoring === lead.id}>
                          {scoring === lead.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                          Score
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7"><Eye className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LMQualification;
