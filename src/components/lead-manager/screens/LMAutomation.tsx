import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bot, Clock, Brain, AlertTriangle, TrendingUp,
  Eye, Settings, Lock, Check, Loader2, Sparkles
} from 'lucide-react';
import { useAILeadAction } from '@/hooks/useLeadData';
import { toast } from 'sonner';

const aiFeatures = [
  { id: 'followup', label: 'Auto Follow-Up Suggestions', icon: Bot, description: 'AI suggests optimal follow-up actions' },
  { id: 'best_time', label: 'Best Time to Call', icon: Clock, description: 'Predicts best contact times' },
  { id: 'response', label: 'Response Prediction', icon: Brain, description: 'Predicts lead response probability' },
  { id: 'dropoff', label: 'Drop-Off Alert', icon: AlertTriangle, description: 'Alerts when leads are going cold' },
  { id: 'conversion', label: 'Conversion Probability', icon: TrendingUp, description: 'Calculates conversion likelihood' },
];

const LMAutomation = () => {
  const aiAction = useAILeadAction();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetSuggestions = async () => {
    setLoading(true);
    try {
      const result = await aiAction.mutateAsync({ action: 'suggest_followup' });
      setSuggestions(result?.suggestions || []);
      toast.success(`Got ${result?.suggestions?.length || 0} AI suggestions`);
    } catch {
      toast.error('Failed to get suggestions');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Automation & AI</h1>
          <p className="text-muted-foreground">VALA AI - Controlled (No Auto Execution)</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleGetSuggestions} disabled={loading} size="sm" className="bg-primary hover:bg-primary/90">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Sparkles className="w-3.5 h-3.5 mr-1" />}
            Get AI Suggestions
          </Button>
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
            <Lock className="w-3 h-3 mr-1" /> Approval Required
          </Badge>
        </div>
      </div>

      <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardContent className="p-4 flex items-center gap-3">
          <Lock className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="font-semibold text-yellow-400">No Auto Execution Without Approval</p>
            <p className="text-xs text-muted-foreground">All AI suggestions require manual approval before execution</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div key={feature.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{feature.label}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 text-xs">Active</Badge>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center justify-between">
              <span>AI Follow-Up Suggestions</span>
              <Badge className="bg-purple-500/20 text-purple-400">{suggestions.length} suggestions</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-accent/50">
                <tr>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Lead</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Suggested Action</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Best Time</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Confidence</th>
                  <th className="text-left p-3 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((item: any, index: number) => (
                  <motion.tr key={item.id || index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="border-b border-border hover:bg-accent/30">
                    <td className="p-3 font-medium text-foreground">{item.id?.slice(0, 8) || `Lead ${index + 1}`}</td>
                    <td className="p-3 text-sm text-muted-foreground">{item.suggested_action || 'Follow up'}</td>
                    <td className="p-3 text-sm text-muted-foreground">{item.best_time || 'N/A'}</td>
                    <td className="p-3">
                      <Badge className={`text-xs ${
                        (item.confidence || 0) >= 90 ? 'bg-green-500/20 text-green-400' :
                        (item.confidence || 0) >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>{item.confidence || 0}%</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button size="sm" className="h-7 text-xs bg-green-500 hover:bg-green-600" onClick={() => toast.success('Action approved')}>
                          <Check className="w-3 h-3 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-red-500 border-red-500/30" onClick={() => toast.info('Action rejected')}>
                          Reject
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LMAutomation;
