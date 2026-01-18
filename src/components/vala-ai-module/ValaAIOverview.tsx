/**
 * VALA AI OVERVIEW
 * Main dashboard for VALA AI module - matches SEO/Marketing/Lead Manager style
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, ListTodo, Cpu, AlertTriangle, BarChart3, 
  Wallet, Webhook, Cog, TrendingUp, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const aiStats = [
  { label: 'AI Requests', value: '12,847', change: '+23%', icon: Brain, color: 'text-primary' },
  { label: 'Tasks Running', value: '156', change: '+8', icon: ListTodo, color: 'text-emerald-500' },
  { label: 'Models Active', value: '12', change: '0', icon: Cpu, color: 'text-blue-500' },
  { label: 'Alerts', value: '3', change: '-2', icon: AlertTriangle, color: 'text-amber-500' },
  { label: 'Usage Today', value: '89%', change: '+5%', icon: BarChart3, color: 'text-purple-500' },
  { label: 'Credits Balance', value: '$2,450', change: '-$150', icon: Wallet, color: 'text-cyan-500' },
  { label: 'API Calls', value: '45.2K', change: '+12%', icon: Webhook, color: 'text-rose-500' },
  { label: 'Automation Jobs', value: '28', change: '+3', icon: Cog, color: 'text-orange-500' },
];

const recentActivity = [
  { action: 'Model gemini-2.5-pro processed 1.2K requests', time: '2 mins ago', type: 'success' },
  { action: 'Automation job "Content Analysis" completed', time: '5 mins ago', type: 'success' },
  { action: 'High latency detected on image generation', time: '12 mins ago', type: 'warning' },
  { action: 'New AI model deployment: gpt-5-mini', time: '1 hour ago', type: 'info' },
  { action: 'Credit threshold alert triggered', time: '2 hours ago', type: 'warning' },
];

export const ValaAIOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            VALA AI Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI operations, models, and automation management
          </p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/50">
          <Activity className="w-3 h-3 mr-1" />
          All Systems Online
        </Badge>
      </div>

      {/* Stats Grid - Same style as SEO/Marketing Manager */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {aiStats.map((stat, idx) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith('+');
          const isNegative = stat.change.startsWith('-');
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-all cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg bg-primary/10 ${stat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        isPositive ? 'text-emerald-500 border-emerald-500/30' : 
                        isNegative ? 'text-rose-500 border-rose-500/30' : 
                        'text-muted-foreground'
                      }`}
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Performance and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Performance */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              AI Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Model Accuracy</span>
                <span className="text-foreground">98.5%</span>
              </div>
              <Progress value={98.5} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Response Latency</span>
                <span className="text-foreground">124ms avg</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="text-foreground">99.2%</span>
              </div>
              <Progress value={99.2} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">GPU Utilization</span>
                <span className="text-foreground">67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    item.type === 'success' ? 'bg-emerald-500' :
                    item.type === 'warning' ? 'bg-amber-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
