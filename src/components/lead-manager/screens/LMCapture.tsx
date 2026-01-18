import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  GitBranch, Filter, Globe, Layers, Activity, AlertCircle,
  Eye, Edit, Settings, Check, X
} from 'lucide-react';

const routingRules = [
  { 
    id: 1, 
    name: 'Auto Lead Assignment', 
    icon: GitBranch, 
    status: 'active',
    description: 'Automatically assign new leads to available agents',
    assignedTo: 'Round Robin',
    lastTriggered: '2 mins ago'
  },
  { 
    id: 2, 
    name: 'Rule-Based Distribution', 
    icon: Filter, 
    status: 'active',
    description: 'Distribute leads based on predefined rules',
    assignedTo: 'Priority Score',
    lastTriggered: '5 mins ago'
  },
  { 
    id: 3, 
    name: 'Country / State / City Routing', 
    icon: Globe, 
    status: 'active',
    description: 'Route leads based on geographic location',
    assignedTo: 'Geo Teams',
    lastTriggered: '12 mins ago'
  },
  { 
    id: 4, 
    name: 'Product-Based Routing', 
    icon: Layers, 
    status: 'active',
    description: 'Route leads to product specialists',
    assignedTo: 'Product Teams',
    lastTriggered: '18 mins ago'
  },
  { 
    id: 5, 
    name: 'Load Balancing (Team Wise)', 
    icon: Activity, 
    status: 'active',
    description: 'Balance lead load across team members',
    assignedTo: 'All Teams',
    lastTriggered: '3 mins ago'
  },
  { 
    id: 6, 
    name: 'Failover Assignment', 
    icon: AlertCircle, 
    status: 'standby',
    description: 'Backup assignment when primary agent unavailable',
    assignedTo: 'Backup Pool',
    lastTriggered: '1 hour ago'
  },
];

const recentAssignments = [
  { id: 1, lead: 'Rahul Sharma', rule: 'Geo Routing', assignedTo: 'Team Delhi', time: '2 mins ago' },
  { id: 2, lead: 'Priya Patel', rule: 'Product Routing', assignedTo: 'Software Team', time: '5 mins ago' },
  { id: 3, lead: 'Amit Kumar', rule: 'Round Robin', assignedTo: 'Vikram Singh', time: '8 mins ago' },
  { id: 4, lead: 'Sneha Gupta', rule: 'Priority Score', assignedTo: 'Premium Team', time: '12 mins ago' },
];

const LMCapture = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lead Capture & Auto Routing</h1>
          <p className="text-muted-foreground">Configure automatic lead distribution rules</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
          Auto-Routing Active
        </Badge>
      </div>

      {/* Routing Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routingRules.map((rule, index) => {
          const Icon = rule.icon;
          return (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        rule.status === 'active' ? 'bg-green-500/10' : 'bg-yellow-500/10'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          rule.status === 'active' ? 'text-green-500' : 'text-yellow-500'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{rule.name}</h3>
                        <p className="text-xs text-muted-foreground">{rule.description}</p>
                      </div>
                    </div>
                    <Switch checked={rule.status === 'active'} />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>Assigned: <span className="text-foreground">{rule.assignedTo}</span></span>
                    <span>Last: {rule.lastTriggered}</span>
                  </div>

                  <div className="flex items-center gap-1 pt-2 border-t border-border">
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <Eye className="w-3 h-3 mr-1" /> View
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      <Edit className="w-3 h-3 mr-1" /> Edit
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

      {/* Recent Assignments */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle>Recent Auto-Assignments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-accent/50">
              <tr>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Lead</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Rule Applied</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Assigned To</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Time</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAssignments.map((assignment) => (
                <tr key={assignment.id} className="border-b border-border hover:bg-accent/30">
                  <td className="p-3 font-medium text-foreground">{assignment.lead}</td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">{assignment.rule}</Badge>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{assignment.assignedTo}</td>
                  <td className="p-3 text-xs text-muted-foreground">{assignment.time}</td>
                  <td className="p-3">
                    <Badge className="bg-green-500/20 text-green-400 text-xs">
                      <Check className="w-3 h-3 mr-1" /> Assigned
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMCapture;
