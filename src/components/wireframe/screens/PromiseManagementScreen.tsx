import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  Target,
  BarChart3,
  FileText,
  Shield,
  Zap,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useActivePromises, usePromiseMetrics, useTopPerformers } from '@/hooks/usePromiseData';

export function PromiseManagementScreen() {
  const { data: promises, isLoading: promisesLoading } = useActivePromises();
  const { data: metrics, isLoading: metricsLoading } = usePromiseMetrics();
  const { data: topPerformers, isLoading: performersLoading } = useTopPerformers();

  const isLoading = promisesLoading || metricsLoading || performersLoading;

  const stats = [
    { label: 'Active Promises', value: metrics?.activePromises || 0, icon: FileCheck, trend: '+12%', color: 'text-primary' },
    { label: 'Completed Today', value: metrics?.completedToday || 0, icon: CheckCircle2, trend: '+8%', color: 'text-green-400' },
    { label: 'At Risk', value: metrics?.atRisk || 0, icon: Clock, trend: '-5%', color: 'text-yellow-400' },
    { label: 'Breached Today', value: metrics?.breachedToday || 0, icon: AlertTriangle, trend: '-15%', color: 'text-red-400' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>;
      case 'in_progress':
      case 'assigned':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">In Progress</Badge>;
      case 'breached':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Breached</Badge>;
      case 'promised':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgressFromPromise = (promise: any) => {
    if (promise.status === 'completed') return 100;
    if (promise.status === 'breached') return 100;
    const now = new Date();
    const start = new Date(promise.promise_time);
    const end = new Date(promise.deadline);
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.min(Math.max(Math.round((elapsed / total) * 100), 0), 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            Promise Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track and manage all organizational commitments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10">
            <Zap className="w-3 h-3 mr-1" />
            Live Tracking
          </Badge>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <span className={`text-xs ${stat.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.trend}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Promises */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Recent Promises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(!promises || promises.length === 0) ? (
                  <p className="text-muted-foreground text-center py-8">No active promises</p>
                ) : (
                  promises.map((promise) => (
                    <div 
                      key={promise.id}
                      className="p-3 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-muted-foreground">{promise.id.slice(0, 8)}</span>
                          <span className="font-medium text-sm">Task: {promise.task_id.slice(0, 8)}</span>
                        </div>
                        {getStatusBadge(promise.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Deadline: {new Date(promise.deadline).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <Progress value={getProgressFromPromise(promise)} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground w-10 text-right">
                          {getProgressFromPromise(promise)}%
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Department Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(!topPerformers || topPerformers.length === 0) ? (
                  <p className="text-muted-foreground text-center py-4">No performance data</p>
                ) : (
                  topPerformers.map((performer) => (
                    <div key={performer.developer_id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span>Dev {performer.developer_id.slice(0, 6)}</span>
                        <span className="text-muted-foreground">{performer.completed}/{performer.total}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={performer.rate} 
                          className={`h-2 flex-1 ${
                            performer.rate >= 90 ? '[&>div]:bg-green-500' : 
                            performer.rate >= 75 ? '[&>div]:bg-yellow-500' : 
                            '[&>div]:bg-red-500'
                          }`}
                        />
                        <span className="text-xs font-medium w-10 text-right">{performer.rate}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: FileCheck, label: 'New Promise', color: 'text-primary' },
                { icon: Users, label: 'Assign Team', color: 'text-blue-400' },
                { icon: Calendar, label: 'Set Deadline', color: 'text-green-400' },
                { icon: Target, label: 'Track Goals', color: 'text-purple-400' },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                  <span className="text-sm">{action.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
