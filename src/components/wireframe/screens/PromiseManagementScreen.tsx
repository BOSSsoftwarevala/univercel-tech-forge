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
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const stats = [
  { label: 'Total Promises', value: '2,847', icon: FileCheck, trend: '+12%', color: 'text-primary' },
  { label: 'Fulfilled', value: '2,156', icon: CheckCircle2, trend: '+8%', color: 'text-green-400' },
  { label: 'Pending', value: '456', icon: Clock, trend: '-5%', color: 'text-yellow-400' },
  { label: 'At Risk', value: '235', icon: AlertTriangle, trend: '-15%', color: 'text-red-400' },
];

const recentPromises = [
  { id: 'PRO-001', client: 'TechCorp Ltd', promise: 'Delivery by Dec 25', status: 'on_track', progress: 85 },
  { id: 'PRO-002', client: 'Global Inc', promise: 'Feature launch Q1', status: 'at_risk', progress: 45 },
  { id: 'PRO-003', client: 'StartupXYZ', promise: 'Support SLA 99.9%', status: 'fulfilled', progress: 100 },
  { id: 'PRO-004', client: 'Enterprise Co', promise: 'Integration complete', status: 'on_track', progress: 72 },
  { id: 'PRO-005', client: 'SMB Solutions', promise: 'Training sessions', status: 'pending', progress: 30 },
];

const departments = [
  { name: 'Sales', total: 845, fulfilled: 720, rate: 85 },
  { name: 'Support', total: 623, fulfilled: 590, rate: 95 },
  { name: 'Development', total: 512, fulfilled: 380, rate: 74 },
  { name: 'Operations', total: 456, fulfilled: 420, rate: 92 },
  { name: 'Marketing', total: 411, fulfilled: 350, rate: 85 },
];

export function PromiseManagementScreen() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'fulfilled':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Fulfilled</Badge>;
      case 'on_track':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">On Track</Badge>;
      case 'at_risk':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">At Risk</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

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
                {recentPromises.map((promise) => (
                  <div 
                    key={promise.id}
                    className="p-3 rounded-lg bg-background/50 border border-border/30 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-muted-foreground">{promise.id}</span>
                        <span className="font-medium text-sm">{promise.client}</span>
                      </div>
                      {getStatusBadge(promise.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{promise.promise}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={promise.progress} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground w-10 text-right">{promise.progress}%</span>
                    </div>
                  </div>
                ))}
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
                Department Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map((dept) => (
                  <div key={dept.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span>{dept.name}</span>
                      <span className="text-muted-foreground">{dept.fulfilled}/{dept.total}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={dept.rate} 
                        className={`h-2 flex-1 ${
                          dept.rate >= 90 ? '[&>div]:bg-green-500' : 
                          dept.rate >= 75 ? '[&>div]:bg-yellow-500' : 
                          '[&>div]:bg-red-500'
                        }`}
                      />
                      <span className="text-xs font-medium w-10 text-right">{dept.rate}%</span>
                    </div>
                  </div>
                ))}
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
