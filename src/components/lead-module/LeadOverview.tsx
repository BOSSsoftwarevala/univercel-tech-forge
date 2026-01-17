/**
 * LEAD OVERVIEW DASHBOARD
 * Live metrics for leads
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserCheck, Flame, TrendingUp, 
  PhoneCall, Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const metrics = [
  { 
    label: 'New Leads Today', 
    value: '47', 
    icon: Users, 
    trend: '+12 from yesterday',
    color: 'from-emerald-500 to-teal-600' 
  },
  { 
    label: 'Qualified Leads', 
    value: '189', 
    icon: UserCheck, 
    trend: '68% qualification rate',
    color: 'from-blue-500 to-cyan-600' 
  },
  { 
    label: 'Hot Leads', 
    value: '34', 
    icon: Flame, 
    trend: 'Ready for conversion',
    color: 'from-orange-500 to-red-600' 
  },
  { 
    label: 'Converted Leads', 
    value: '156', 
    icon: TrendingUp, 
    trend: 'This month',
    color: 'from-green-500 to-emerald-600' 
  },
  { 
    label: 'Pending Follow-ups', 
    value: '23', 
    icon: PhoneCall, 
    trend: '8 overdue',
    color: 'from-amber-500 to-orange-600' 
  },
  { 
    label: 'Avg Response Time', 
    value: '2.4h', 
    icon: Clock, 
    trend: '15% faster than last week',
    color: 'from-purple-500 to-violet-600' 
  },
];

export const LeadOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Lead Management Overview</h1>
        <p className="text-sm text-muted-foreground">
          Real-time lead pipeline statistics
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="bg-card/80 border-border/50 hover:border-border transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {metric.label}
                      </p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        {metric.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {metric.trend}
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors"
            >
              Add Lead Manually
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors"
            >
              View Hot Leads
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg bg-orange-500/20 text-orange-400 text-sm font-medium hover:bg-orange-500/30 transition-colors"
            >
              Pending Follow-ups
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
