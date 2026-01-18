import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bot, Clock, Brain, AlertTriangle, TrendingUp,
  Eye, Settings, Lock, Check
} from 'lucide-react';

const aiFeatures = [
  { 
    id: 'followup', 
    label: 'Auto Follow-Up Suggestions', 
    icon: Bot, 
    status: 'active',
    description: 'AI suggests optimal follow-up actions',
    suggestions: 12,
    accuracy: '94%'
  },
  { 
    id: 'best_time', 
    label: 'Best Time to Call', 
    icon: Clock, 
    status: 'active',
    description: 'Predicts best contact times',
    suggestions: 47,
    accuracy: '89%'
  },
  { 
    id: 'response', 
    label: 'Response Prediction', 
    icon: Brain, 
    status: 'active',
    description: 'Predicts lead response probability',
    suggestions: 156,
    accuracy: '87%'
  },
  { 
    id: 'dropoff', 
    label: 'Drop-Off Alert', 
    icon: AlertTriangle, 
    status: 'active',
    description: 'Alerts when leads are going cold',
    suggestions: 8,
    accuracy: '92%'
  },
  { 
    id: 'conversion', 
    label: 'Conversion Probability', 
    icon: TrendingUp, 
    status: 'active',
    description: 'Calculates conversion likelihood',
    suggestions: 234,
    accuracy: '91%'
  },
];

const pendingApprovals = [
  { id: 1, lead: 'Rahul Sharma', action: 'Schedule call at 10 AM tomorrow', confidence: 94 },
  { id: 2, lead: 'Priya Patel', action: 'Send discount offer email', confidence: 87 },
  { id: 3, lead: 'Amit Kumar', action: 'WhatsApp follow-up with brochure', confidence: 91 },
  { id: 4, lead: 'Sneha Gupta', action: 'Reassign to premium team', confidence: 78 },
];

const LMAutomation = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Automation & AI</h1>
          <p className="text-muted-foreground">VALA AI - Controlled (No Auto Execution)</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
            <Lock className="w-3 h-3 mr-1" />
            Approval Required
          </Badge>
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
            AI Active
          </Badge>
        </div>
      </div>

      {/* Warning Banner */}
      <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardContent className="p-4 flex items-center gap-3">
          <Lock className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="font-semibold text-yellow-400">No Auto Execution Without Approval</p>
            <p className="text-xs text-muted-foreground">All AI suggestions require manual approval before execution</p>
          </div>
        </CardContent>
      </Card>

      {/* AI Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
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
                  
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-muted-foreground">
                      Suggestions: <span className="text-primary font-semibold">{feature.suggestions}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Accuracy: <span className="text-green-500 font-semibold">{feature.accuracy}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 pt-2 border-t border-border">
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <Eye className="w-3 h-3 mr-1" /> View
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <Settings className="w-3 h-3 mr-1" /> Config
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Pending Approvals */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center justify-between">
            <span>Pending AI Suggestions (Require Approval)</span>
            <Badge className="bg-yellow-500/20 text-yellow-400">{pendingApprovals.length} pending</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-accent/50">
              <tr>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Lead</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Suggested Action</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Confidence</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border hover:bg-accent/30"
                >
                  <td className="p-3 font-medium text-foreground">{item.lead}</td>
                  <td className="p-3 text-sm text-muted-foreground">{item.action}</td>
                  <td className="p-3">
                    <Badge className={`text-xs ${
                      item.confidence >= 90 ? 'bg-green-500/20 text-green-400' :
                      item.confidence >= 80 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {item.confidence}%
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="h-7 text-xs bg-green-500 hover:bg-green-600">
                        <Check className="w-3 h-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs text-red-500 border-red-500/30">
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
    </div>
  );
};

export default LMAutomation;
