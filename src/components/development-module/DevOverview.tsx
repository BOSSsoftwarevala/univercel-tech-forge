/**
 * DEVELOPMENT OVERVIEW DASHBOARD
 * Live cards showing action-only metrics
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Code, 
  Clock, 
  AlertTriangle, 
  Factory, 
  Bug, 
  CloudUpload,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OverviewCard {
  id: string;
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  status?: 'good' | 'warning' | 'critical';
}

const overviewCards: OverviewCard[] = [
  { 
    id: 'active-builds', 
    label: 'Active Builds', 
    value: 3, 
    icon: Code, 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-500/20',
    status: 'good'
  },
  { 
    id: 'waiting-approval', 
    label: 'Waiting Approval', 
    value: 2, 
    icon: Clock, 
    color: 'text-amber-400', 
    bgColor: 'bg-amber-500/20',
    status: 'warning'
  },
  { 
    id: 'failed-builds', 
    label: 'Failed Builds', 
    value: 0, 
    icon: AlertTriangle, 
    color: 'text-red-400', 
    bgColor: 'bg-red-500/20',
    status: 'good'
  },
  { 
    id: 'demos-today', 
    label: 'Demos Created Today', 
    value: 5, 
    icon: Factory, 
    color: 'text-purple-400', 
    bgColor: 'bg-purple-500/20',
    status: 'good'
  },
  { 
    id: 'bugs-fixed', 
    label: 'Bugs Auto-Fixed', 
    value: 12, 
    icon: Bug, 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-500/20',
    status: 'good'
  },
  { 
    id: 'deployments', 
    label: 'Deployments Today', 
    value: 4, 
    icon: CloudUpload, 
    color: 'text-cyan-400', 
    bgColor: 'bg-cyan-500/20',
    status: 'good'
  },
];

export const DevOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Development Overview</h1>
          <p className="text-sm text-muted-foreground">AI-powered build & deployment status</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">All Systems Operational</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-3 gap-4">
        {overviewCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-card/80 border-border/50 hover:border-border transition-all cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{card.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{card.value}</p>
                    </div>
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", card.bgColor)}>
                      <Icon className={cn("w-6 h-6", card.color)} />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400">AI optimized</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent AI Actions</h3>
          <div className="space-y-3">
            {[
              { time: '2 min ago', action: 'Auto-fixed button click handler in Demo #42', type: 'fix' },
              { time: '8 min ago', action: 'Deployed CRM-Pro v2.1.3 to production', type: 'deploy' },
              { time: '15 min ago', action: 'Generated 3 new demo variants', type: 'create' },
              { time: '1 hour ago', action: 'Completed full test suite - 847 tests passed', type: 'test' },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0"
              >
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  activity.type === 'fix' ? 'bg-emerald-500' :
                  activity.type === 'deploy' ? 'bg-blue-500' :
                  activity.type === 'create' ? 'bg-purple-500' : 'bg-cyan-500'
                )} />
                <span className="text-xs text-muted-foreground w-20">{activity.time}</span>
                <span className="text-sm text-foreground flex-1">{activity.action}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
