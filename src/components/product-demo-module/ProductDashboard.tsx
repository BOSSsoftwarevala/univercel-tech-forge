/**
 * PRODUCT DASHBOARD
 * Enhanced overview with action buttons (Step 8 spec)
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, Monitor, AlertTriangle, Clock, Rocket,
  Plus, Wrench, Eye, CheckCircle 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const metrics = [
  { 
    label: 'Total Products', 
    value: '156', 
    icon: Package, 
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-500/20'
  },
  { 
    label: 'Active Demos', 
    value: '89', 
    icon: Monitor, 
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-500/20'
  },
  { 
    label: 'Failed Demos', 
    value: '3', 
    icon: AlertTriangle, 
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-500/20'
  },
  { 
    label: 'Pending Approvals', 
    value: '7', 
    icon: Clock, 
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/20'
  },
  { 
    label: 'This Week Launched', 
    value: '12', 
    icon: Rocket, 
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/20'
  },
];

export const ProductDashboard: React.FC = () => {
  const handleAddProduct = () => {
    toast.info('Opening Add Product form...');
  };

  const handleCreateDemo = () => {
    toast.info('Opening Demo Factory...');
  };

  const handleFixDemo = () => {
    toast.info('Opening Demo Repair tool...');
  };

  const handleViewIssues = () => {
    toast.info('Navigating to Issues...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Product & Demo Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time catalog and demo management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">System Healthy</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
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
          <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={handleAddProduct}
                className="w-full h-20 flex-col gap-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 border border-violet-500/30"
                variant="outline"
              >
                <Plus className="w-6 h-6" />
                <span className="text-sm font-medium">Add Product</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={handleCreateDemo}
                className="w-full h-20 flex-col gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30"
                variant="outline"
              >
                <Monitor className="w-6 h-6" />
                <span className="text-sm font-medium">Create Demo</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={handleFixDemo}
                className="w-full h-20 flex-col gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30"
                variant="outline"
              >
                <Wrench className="w-6 h-6" />
                <span className="text-sm font-medium">Fix Demo</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={handleViewIssues}
                className="w-full h-20 flex-col gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                variant="outline"
              >
                <Eye className="w-6 h-6" />
                <span className="text-sm font-medium">View Issues</span>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'Demo created', target: 'School ERP Pro #89', time: '2 min ago', icon: Monitor, color: 'emerald' },
              { action: 'Product updated', target: 'Hospital Management v2.5', time: '15 min ago', icon: Package, color: 'blue' },
              { action: 'Issue resolved', target: 'Payment gateway timeout', time: '1 hour ago', icon: CheckCircle, color: 'green' },
              { action: 'Demo failed', target: 'Gym Management #12', time: '2 hours ago', icon: AlertTriangle, color: 'red' },
            ].map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 text-${activity.color}-400`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.target}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
