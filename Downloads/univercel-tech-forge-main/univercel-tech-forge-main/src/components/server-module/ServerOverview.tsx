/**
 * SERVER OVERVIEW
 * Dashboard with live cards showing server status
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Server, CheckCircle, AlertTriangle, WifiOff, 
  Database, Shield, TrendingUp, Activity 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface OverviewCard {
  id: string;
  label: string;
  value: string | number;
  icon: React.ElementType;
  status: 'success' | 'warning' | 'danger' | 'neutral';
  subtext: string;
}

const overviewCards: OverviewCard[] = [
  { id: 'total', label: 'Total Servers', value: 6, icon: Server, status: 'neutral', subtext: 'All registered' },
  { id: 'healthy', label: 'Healthy Servers', value: 5, icon: CheckCircle, status: 'success', subtext: 'Running optimally' },
  { id: 'at-risk', label: 'At Risk Servers', value: 1, icon: AlertTriangle, status: 'warning', subtext: 'Needs attention' },
  { id: 'offline', label: 'Offline Servers', value: 0, icon: WifiOff, status: 'success', subtext: 'All good' },
  { id: 'backup', label: 'Backup Status', value: '100%', icon: Database, status: 'success', subtext: 'Last: 2h ago' },
  { id: 'security', label: 'Security Status', value: 'Secure', icon: Shield, status: 'success', subtext: 'No threats' },
];

const getStatusStyles = (status: OverviewCard['status']) => {
  switch (status) {
    case 'success':
      return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-500', text: 'text-emerald-400' };
    case 'warning':
      return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'text-amber-500', text: 'text-amber-400' };
    case 'danger':
      return { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'text-red-500', text: 'text-red-400' };
    default:
      return { bg: 'bg-primary/10', border: 'border-primary/20', icon: 'text-primary', text: 'text-muted-foreground' };
  }
};

export const ServerOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Server Overview</h2>
          <p className="text-sm text-muted-foreground">Real-time infrastructure status</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      {/* Status Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {overviewCards.map((card, index) => {
          const styles = getStatusStyles(card.status);
          const Icon = card.icon;
          
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn("border", styles.border, styles.bg)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                      <p className="text-2xl font-bold text-foreground">{card.value}</p>
                      <p className={cn("text-xs mt-1", styles.text)}>{card.subtext}</p>
                    </div>
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", styles.bg)}>
                      <Icon className={cn("w-5 h-5", styles.icon)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Avg CPU', value: '42%', trend: 'stable' },
          { label: 'Avg RAM', value: '58%', trend: 'stable' },
          { label: 'Avg Disk', value: '35%', trend: 'stable' },
          { label: 'Uptime', value: '99.9%', trend: 'up' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            <Card className="bg-card/60 border-border/50">
              <CardContent className="p-3 text-center">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-semibold text-foreground flex items-center justify-center gap-1">
                  {stat.value}
                  {stat.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">All Systems Operational</p>
              <p className="text-sm text-muted-foreground">AI is monitoring all servers. No action required.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerOverview;
