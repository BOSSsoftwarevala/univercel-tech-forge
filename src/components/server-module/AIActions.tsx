/**
 * AI ACTIONS
 * Shows what AI can/cannot do, recent AI actions
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, CheckCircle, XCircle, Zap, RotateCcw, Shield,
  Scale, AlertTriangle, Ban, Activity, Server, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AIAction {
  id: string;
  action: string;
  server: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

const recentActions: AIAction[] = [
  { id: '1', action: 'Optimized memory allocation', server: 'Production Server 1', timestamp: '2 min ago', status: 'success' },
  { id: '2', action: 'Blocked suspicious IP', server: 'Asia Pacific Node', timestamp: '5 min ago', status: 'success' },
  { id: '3', action: 'Restarted nginx service', server: 'Production Server 1', timestamp: '12 min ago', status: 'success' },
  { id: '4', action: 'Scaled up resources', server: 'EU Gateway', timestamp: '18 min ago', status: 'success' },
  { id: '5', action: 'Predicted failure, alerted Boss', server: 'Asia Pacific Node', timestamp: '25 min ago', status: 'success' },
  { id: '6', action: 'Auto-healed disk issue', server: 'Backup Server', timestamp: '1 hour ago', status: 'success' },
];

const aiCanDo = [
  { action: 'Restart services', icon: RotateCcw },
  { action: 'Optimize load', icon: Scale },
  { action: 'Block suspicious IP', icon: Ban },
  { action: 'Alert Boss', icon: AlertTriangle },
  { action: 'Predict failure', icon: Brain },
  { action: 'Auto-scale resources', icon: Zap },
];

const aiCannotDo = [
  { action: 'Delete server', icon: Server },
  { action: 'Change credentials', icon: Shield },
  { action: 'Disable security', icon: Shield },
];

export const AIActions: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">AI Actions</h2>
          <p className="text-sm text-muted-foreground">Automated server management</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          <Activity className="w-3 h-3 mr-1" />
          AI Active
        </Badge>
      </div>

      {/* AI Capabilities Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* What AI CAN do */}
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              AI Can
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {aiCanDo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.action}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-lg bg-emerald-500/10"
                  >
                    <Icon className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-foreground">{item.action}</span>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* What AI CANNOT do */}
        <Card className="bg-red-500/5 border-red-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-foreground flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              AI Cannot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {aiCannotDo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.action}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-lg bg-red-500/10"
                  >
                    <Icon className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-foreground">{item.action}</span>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              These actions require Boss approval and cannot be automated.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent AI Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Recent AI Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    action.status === 'success' ? 'bg-emerald-500/20' : 
                    action.status === 'pending' ? 'bg-amber-500/20' : 'bg-red-500/20'
                  )}>
                    {action.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : action.status === 'pending' ? (
                      <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{action.action}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Server className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{action.server}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{action.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">AI is Working for You</p>
              <p className="text-sm text-muted-foreground">
                12 automated actions today. All critical actions are logged and visible in real-time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIActions;
