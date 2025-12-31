import { motion } from 'framer-motion';
import { Bot, Brain, Shield, Eye, Lock, Activity, Cpu, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AIModel {
  id: string;
  name: string;
  purpose: string;
  type: 'classification' | 'generation' | 'analysis' | 'detection';
  status: 'active' | 'paused' | 'training';
  inputLimit: string;
  outputLimit: string;
  mode: 'suggestion' | 'warning' | 'insight';
  accuracy: number;
  usageToday: number;
  lastUsed: string;
}

const mockModels: AIModel[] = [
  { id: '1', name: 'Fraud Detection AI', purpose: 'Detect fraudulent transactions and click patterns', type: 'detection', status: 'active', inputLimit: '1MB per request', outputLimit: 'Risk score + flags only', mode: 'warning', accuracy: 94.5, usageToday: 45230, lastUsed: '1 min ago' },
  { id: '2', name: 'Lead Scoring AI', purpose: 'Score and prioritize leads based on conversion probability', type: 'analysis', status: 'active', inputLimit: '500KB per request', outputLimit: 'Score + factors only', mode: 'insight', accuracy: 87.2, usageToday: 12890, lastUsed: '2 min ago' },
  { id: '3', name: 'Content Moderation AI', purpose: 'Detect policy violations in user content', type: 'classification', status: 'active', inputLimit: '2MB per request', outputLimit: 'Classification + confidence', mode: 'suggestion', accuracy: 91.8, usageToday: 8920, lastUsed: '5 min ago' },
  { id: '4', name: 'SEO Optimizer AI', purpose: 'Generate SEO recommendations and keyword suggestions', type: 'generation', status: 'active', inputLimit: '100KB per request', outputLimit: 'Suggestions only', mode: 'suggestion', accuracy: 82.5, usageToday: 3450, lastUsed: '15 min ago' },
  { id: '5', name: 'Behavior Analysis AI', purpose: 'Analyze user behavior patterns for anomalies', type: 'analysis', status: 'paused', inputLimit: '5MB per request', outputLimit: 'Pattern report only', mode: 'warning', accuracy: 89.3, usageToday: 0, lastUsed: '2 hours ago' },
];

export function AIModelsAgents() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'detection': return <Shield className="w-5 h-5 text-red-400" />;
      case 'analysis': return <Brain className="w-5 h-5 text-blue-400" />;
      case 'generation': return <Cpu className="w-5 h-5 text-primary" />;
      default: return <Bot className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getModeBadge = (mode: string) => {
    switch (mode) {
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'insight': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  const activeModels = mockModels.filter(m => m.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">AI Models & Agents</h2>
          <p className="text-sm text-muted-foreground">Defined purpose • Input/output limits • Suggestion-only outputs</p>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400">
          {activeModels} Active Models
        </Badge>
      </div>

      {/* AI Governance Rules */}
      <Card className="bg-primary/5 border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">AI Governance Rules</p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-destructive" /> Auto-enforcement BLOCKED - Human approval required
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="w-3 h-3" /> All AI outputs are suggestions, warnings, or insights only
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-3 h-3" /> PII masked before AI processing
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="w-3 h-3" /> No passwords or wallet data sent to AI
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Models List */}
      <div className="space-y-4">
        {mockModels.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`bg-card/50 border-border/50 ${
              model.status === 'paused' ? 'opacity-60' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    {getTypeIcon(model.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{model.name}</span>
                      <Badge variant="outline" className={
                        model.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                        model.status === 'paused' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      }>
                        {model.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {model.type.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getModeBadge(model.mode)}>
                        {model.mode.toUpperCase()} ONLY
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">{model.purpose}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground">Input Limit</p>
                        <p className="text-sm font-medium text-foreground">{model.inputLimit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Output Limit</p>
                        <p className="text-sm font-medium text-foreground">{model.outputLimit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                        <p className="text-sm font-medium text-foreground">{model.accuracy}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Usage Today</p>
                        <p className="text-sm font-medium text-foreground">{model.usageToday.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Model Accuracy</span>
                        <span>{model.accuracy}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Human-in-Loop Notice */}
      <Card className="bg-amber-500/5 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-amber-400" />
            <div>
              <p className="font-semibold text-foreground">Human-in-the-Loop Required</p>
              <p className="text-sm text-muted-foreground">
                AI provides suggestions, warnings, and insights only. Human approval is required for: Enforcement, Escalation, Blocking
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
