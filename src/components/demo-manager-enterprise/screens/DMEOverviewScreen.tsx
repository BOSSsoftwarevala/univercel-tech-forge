/**
 * DEMO OVERVIEW SCREEN
 * KPI Boxes with inline actions: View, Fix, Pause, Lock
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Monitor,
  AlertTriangle,
  XCircle,
  Zap,
  Bot,
  CheckCircle2,
  Eye,
  Wrench,
  Pause,
  Lock,
  Activity,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface KPIBox {
  id: string;
  label: string;
  value: number;
  icon: any;
  color: string;
  bgColor: string;
}

export const DMEOverviewScreen: React.FC = () => {
  const [kpiData, setKpiData] = useState<KPIBox[]>([
    { id: 'live', label: 'Live Running Software', value: 247, icon: Monitor, color: 'text-neon-green', bgColor: 'bg-neon-green/10' },
    { id: 'incomplete', label: 'Incomplete Software', value: 18, icon: AlertTriangle, color: 'text-neon-orange', bgColor: 'bg-neon-orange/10' },
    { id: 'broken', label: 'Broken Modules', value: 7, icon: XCircle, color: 'text-red-400', bgColor: 'bg-red-400/10' },
    { id: 'button-fail', label: 'Button Failure Count', value: 23, icon: Zap, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
    { id: 'ai-queue', label: 'AI Fix Queue', value: 12, icon: Bot, color: 'text-primary', bgColor: 'bg-primary/10' },
    { id: 'ready-sale', label: 'Ready-for-Sale Software', value: 189, icon: CheckCircle2, color: 'text-emerald-400', bgColor: 'bg-emerald-400/10' },
  ]);

  const handleAction = (kpiId: string, action: string) => {
    toast.success(`${action} action triggered for ${kpiId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demo Overview</h1>
          <p className="text-muted-foreground text-sm">Real-time demo status & actions</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-neon-green/20 text-neon-green border border-neon-green/30 animate-pulse">
            <Activity className="w-3 h-3 mr-1" />
            LIVE MONITORING
          </Badge>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-border/50 hover:border-primary/50 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl ${kpi.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${kpi.color}`} />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  </div>

                  {/* Inline Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-border/30">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 h-8 text-xs gap-1"
                      onClick={() => handleAction(kpi.id, 'View')}
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 h-8 text-xs gap-1 text-neon-teal"
                      onClick={() => handleAction(kpi.id, 'Fix')}
                    >
                      <Wrench className="w-3 h-3" />
                      Fix
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 h-8 text-xs gap-1 text-neon-orange"
                      onClick={() => handleAction(kpi.id, 'Pause')}
                    >
                      <Pause className="w-3 h-3" />
                      Pause
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 h-8 text-xs gap-1 text-red-400"
                      onClick={() => handleAction(kpi.id, 'Lock')}
                    >
                      <Lock className="w-3 h-3" />
                      Lock
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Recent Demo Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'AI Fix Applied', software: 'SchoolERP Pro', time: '2 min ago', status: 'success' },
              { action: 'Button Test Passed', software: 'HospitalCRM', time: '5 min ago', status: 'success' },
              { action: 'Module Broken', software: 'RetailPOS', time: '12 min ago', status: 'error' },
              { action: 'Demo Launched', software: 'BuilderCRM', time: '18 min ago', status: 'success' },
              { action: 'Health Check', software: 'LogisticsERP', time: '25 min ago', status: 'warning' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/30">
                <div className="flex items-center gap-3">
                  {item.status === 'success' && <CheckCircle2 className="w-4 h-4 text-neon-green" />}
                  {item.status === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
                  {item.status === 'warning' && <AlertTriangle className="w-4 h-4 text-neon-orange" />}
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.software}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
