import React from 'react';
import { Activity, Zap, AlertTriangle, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const APIOverview: React.FC = () => {
  const stats = [
    { label: 'Active APIs', value: '24', icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: 'Requests/Min', value: '1,247', icon: Activity, color: 'text-green-400', bg: 'bg-green-500/20' },
    { label: 'Error Rate', value: '0.3%', icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { label: 'AI Jobs Running', value: '8', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  ];

  const recentActivity = [
    { time: '2 min ago', event: 'API key rotated for Payment Gateway', status: 'success' },
    { time: '5 min ago', event: 'AI Model gpt-4 usage spike detected', status: 'warning' },
    { time: '10 min ago', event: 'Integration health check passed', status: 'success' },
    { time: '15 min ago', event: 'Rate limit threshold reached for SMS API', status: 'warning' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Overview</h2>
        <p className="text-muted-foreground">API and AI system health at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Health */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-400" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-400">99.9%</p>
              <p className="text-sm text-muted-foreground">API Uptime</p>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-400">45ms</p>
              <p className="text-sm text-muted-foreground">Avg Latency</p>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-400">2.1M</p>
              <p className="text-sm text-muted-foreground">Daily Requests</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-400' : 'bg-yellow-400'
                  }`} />
                  <span className="text-foreground">{activity.event}</span>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIOverview;
