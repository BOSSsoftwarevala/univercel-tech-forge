import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Target, Lightbulb, AlertTriangle, Copy,
  Eye, Edit, Check, X, Flag
} from 'lucide-react';

const qualificationMetrics = [
  { label: 'AI Scored Leads', value: 2847, icon: Brain, color: 'text-purple-500' },
  { label: 'High Budget Detected', value: 234, icon: Target, color: 'text-green-500' },
  { label: 'High Intent', value: 567, icon: Lightbulb, color: 'text-blue-500' },
  { label: 'Priority Flagged', value: 89, icon: AlertTriangle, color: 'text-orange-500' },
  { label: 'Duplicates Found', value: 23, icon: Copy, color: 'text-red-500' },
];

const pendingQualification = [
  { 
    id: 1, 
    name: 'Rahul Sharma', 
    source: 'Google Ads',
    aiScore: 85,
    budgetScore: 78,
    intentScore: 92,
    priority: 'high',
    duplicate: false
  },
  { 
    id: 2, 
    name: 'Priya Patel', 
    source: 'Website',
    aiScore: 72,
    budgetScore: 65,
    intentScore: 78,
    priority: 'medium',
    duplicate: false
  },
  { 
    id: 3, 
    name: 'Amit Kumar', 
    source: 'Facebook',
    aiScore: 91,
    budgetScore: 88,
    intentScore: 95,
    priority: 'high',
    duplicate: true
  },
  { 
    id: 4, 
    name: 'Sneha Gupta', 
    source: 'Referral',
    aiScore: 68,
    budgetScore: 55,
    intentScore: 72,
    priority: 'low',
    duplicate: false
  },
];

const LMQualification = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Qualification</h1>
          <p className="text-muted-foreground">AI + Manual scoring and qualification</p>
        </div>
        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/30">
          AI Engine Active
        </Badge>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {qualificationMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${metric.color}`} />
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Qualification Table */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center justify-between">
            <span>Leads Pending Qualification</span>
            <Badge variant="secondary">{pendingQualification.length} leads</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-accent/50">
              <tr>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Lead</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Source</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">AI Score</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Budget</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Intent</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Priority</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Duplicate</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingQualification.map((lead, index) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border hover:bg-accent/30"
                >
                  <td className="p-3 font-medium text-foreground">{lead.name}</td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">{lead.source}</Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Progress value={lead.aiScore} className="w-16 h-2" />
                      <span className="text-xs">{lead.aiScore}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Progress value={lead.budgetScore} className="w-16 h-2" />
                      <span className="text-xs">{lead.budgetScore}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Progress value={lead.intentScore} className="w-16 h-2" />
                      <span className="text-xs">{lead.intentScore}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge 
                      className={`text-xs ${
                        lead.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        lead.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}
                    >
                      <Flag className="w-3 h-3 mr-1" />
                      {lead.priority}
                    </Badge>
                  </td>
                  <td className="p-3">
                    {lead.duplicate ? (
                      <Badge className="bg-red-500/20 text-red-400 text-xs">
                        <Copy className="w-3 h-3 mr-1" /> Yes
                      </Badge>
                    ) : (
                      <Badge className="bg-green-500/20 text-green-400 text-xs">
                        <Check className="w-3 h-3 mr-1" /> No
                      </Badge>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-green-500">
                        <Check className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500">
                        <X className="w-3.5 h-3.5" />
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

export default LMQualification;
