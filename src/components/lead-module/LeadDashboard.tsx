/**
 * LEAD DASHBOARD (Step 9)
 * Live metrics with action buttons
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, CheckCircle, Flame, TrendingUp, 
  Clock, Plus, Upload, UserCheck, Filter
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const metrics = [
  { label: 'Total Leads', value: '2,847', icon: Users, color: 'from-emerald-500 to-teal-600' },
  { label: 'New Today', value: '127', icon: UserPlus, color: 'from-blue-500 to-cyan-600' },
  { label: 'Qualified', value: '892', icon: CheckCircle, color: 'from-violet-500 to-purple-600' },
  { label: 'Hot Leads', value: '156', icon: Flame, color: 'from-red-500 to-orange-600' },
  { label: 'Converted', value: '423', icon: TrendingUp, color: 'from-amber-500 to-yellow-600' },
  { label: 'Pending Follow-ups', value: '89', icon: Clock, color: 'from-pink-500 to-rose-600' },
];

export const LeadDashboard: React.FC = () => {
  const handleAddLead = () => toast.info('Opening Add Lead form...');
  const handleImportLeads = () => toast.info('Opening Import dialog...');
  const handleAssignLeads = () => toast.info('Opening Assignment panel...');
  const handleViewFunnel = () => toast.info('Navigating to Funnel view...');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Lead Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time lead pipeline metrics</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Pipeline Healthy</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <Card className="bg-card/80 border-border/50 hover:border-border transition-all">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={handleAddLead} className="w-full h-20 flex-col gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30" variant="outline">
                <Plus className="w-6 h-6" />
                <span className="text-sm font-medium">Add Lead</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={handleImportLeads} className="w-full h-20 flex-col gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30" variant="outline">
                <Upload className="w-6 h-6" />
                <span className="text-sm font-medium">Import Leads</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={handleAssignLeads} className="w-full h-20 flex-col gap-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 border border-violet-500/30" variant="outline">
                <UserCheck className="w-6 h-6" />
                <span className="text-sm font-medium">Assign Leads</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={handleViewFunnel} className="w-full h-20 flex-col gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30" variant="outline">
                <Filter className="w-6 h-6" />
                <span className="text-sm font-medium">View Funnel</span>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New lead captured', source: 'Google Ads', country: 'India', time: '2 min ago', icon: UserPlus, color: 'blue' },
              { action: 'Lead converted', source: 'Website Form', country: 'USA', time: '15 min ago', icon: TrendingUp, color: 'emerald' },
              { action: 'Follow-up scheduled', source: 'WhatsApp', country: 'UAE', time: '30 min ago', icon: Clock, color: 'amber' },
              { action: 'Hot lead identified', source: 'Facebook', country: 'UK', time: '1 hour ago', icon: Flame, color: 'red' },
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
                      <p className="text-xs text-muted-foreground">{activity.source} • {activity.country}</p>
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
