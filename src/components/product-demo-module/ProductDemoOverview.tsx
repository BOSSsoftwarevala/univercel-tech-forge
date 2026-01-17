/**
 * PRODUCT & DEMO OVERVIEW
 * Live metrics dashboard
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, Monitor, Factory, TrendingUp, 
  AlertCircle, CheckCircle 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const metrics = [
  { 
    label: 'Total Products', 
    value: '156', 
    icon: Package, 
    trend: '+12 this month',
    color: 'from-violet-500 to-purple-600' 
  },
  { 
    label: 'Active Demos', 
    value: '89', 
    icon: Monitor, 
    trend: '94% uptime',
    color: 'from-emerald-500 to-teal-600' 
  },
  { 
    label: 'Demos Created Today', 
    value: '23', 
    icon: Factory, 
    trend: '+8 from yesterday',
    color: 'from-blue-500 to-cyan-600' 
  },
  { 
    label: 'Top Selling Products', 
    value: '12', 
    icon: TrendingUp, 
    trend: 'School ERP leads',
    color: 'from-amber-500 to-orange-600' 
  },
  { 
    label: 'Products Needing Update', 
    value: '5', 
    icon: AlertCircle, 
    trend: '3 critical',
    color: 'from-red-500 to-rose-600' 
  },
  { 
    label: 'All Good Status', 
    value: 'OK', 
    icon: CheckCircle, 
    trend: 'System healthy',
    color: 'from-green-500 to-emerald-600' 
  },
];

export const ProductDemoOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Product & Demo Overview</h1>
        <p className="text-sm text-muted-foreground">
          Real-time catalog and demo statistics
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
              className="px-4 py-2 rounded-lg bg-violet-500/20 text-violet-400 text-sm font-medium hover:bg-violet-500/30 transition-colors"
            >
              Create Product
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-colors"
            >
              Generate Demo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors"
            >
              View Reports
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
