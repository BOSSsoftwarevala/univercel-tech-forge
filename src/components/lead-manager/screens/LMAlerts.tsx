import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, Clock, AlertTriangle, Copy, Target,
  Eye, Check, X
} from 'lucide-react';

const alertTypes = [
  { id: 'new', label: 'New Lead Alert', icon: Bell, count: 12, color: 'bg-blue-500' },
  { id: 'idle', label: 'Idle Lead Alert', icon: Clock, count: 5, color: 'bg-yellow-500' },
  { id: 'sla', label: 'SLA Breach Alert', icon: AlertTriangle, count: 3, color: 'bg-red-500' },
  { id: 'duplicate', label: 'Duplicate Lead Alert', icon: Copy, count: 2, color: 'bg-orange-500' },
  { id: 'high_value', label: 'High-Value Lead Alert', icon: Target, count: 7, color: 'bg-green-500' },
];

const activeAlerts = [
  { 
    id: 1, 
    type: 'new', 
    lead: 'Rahul Sharma', 
    message: 'New lead from Google Ads', 
    time: '2 mins ago',
    priority: 'medium'
  },
  { 
    id: 2, 
    type: 'sla', 
    lead: 'Priya Patel', 
    message: 'SLA breach - No response in 24 hours', 
    time: '15 mins ago',
    priority: 'high'
  },
  { 
    id: 3, 
    type: 'high_value', 
    lead: 'Amit Kumar', 
    message: 'High value lead detected (₹8.5L)', 
    time: '32 mins ago',
    priority: 'high'
  },
  { 
    id: 4, 
    type: 'idle', 
    lead: 'Sneha Gupta', 
    message: 'Lead idle for 3 days', 
    time: '1 hour ago',
    priority: 'medium'
  },
  { 
    id: 5, 
    type: 'duplicate', 
    lead: 'Vikram Singh', 
    message: 'Potential duplicate found', 
    time: '2 hours ago',
    priority: 'low'
  },
];

const LMAlerts = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts & Notifications</h1>
          <p className="text-muted-foreground">Real-time lead alerts and notifications</p>
        </div>
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
          29 Active Alerts
        </Badge>
      </div>

      {/* Alert Type Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {alertTypes.map((alert, index) => {
          const Icon = alert.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card border-border hover:border-primary/30 transition-colors cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 rounded-full mx-auto mb-2 ${alert.color} bg-opacity-20 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${alert.color.replace('bg-', 'text-')}`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{alert.count}</p>
                  <p className="text-xs text-muted-foreground">{alert.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Active Alerts List */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center justify-between">
            <span>Active Alerts</span>
            <Button size="sm" variant="outline" className="text-xs">
              Mark All Read
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {activeAlerts.map((alert, index) => {
              const alertConfig = alertTypes.find(a => a.id === alert.type);
              const Icon = alertConfig?.icon || Bell;
              const color = alertConfig?.color || 'bg-blue-500';
              
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full ${color} bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-foreground">{alert.lead}</p>
                        <Badge 
                          className={`text-xs ${
                            alert.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            alert.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}
                        >
                          {alert.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMAlerts;
