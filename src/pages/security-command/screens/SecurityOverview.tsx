import React from 'react';
import { Shield, Users, Ban, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SecurityOverview: React.FC = () => {
  const stats = [
    { label: 'Security Status', value: 'Protected', icon: Shield, color: 'text-green-400', bg: 'bg-green-500/20' },
    { label: 'Active Sessions', value: '1,247', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: 'Blocked Today', value: '89', icon: Ban, color: 'text-red-400', bg: 'bg-red-500/20' },
    { label: 'High-Risk Alerts', value: '3', icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  ];

  const recentActivity = [
    { time: '2 min ago', event: 'Copy attempt blocked', severity: 'low' },
    { time: '5 min ago', event: 'Screenshot detection triggered', severity: 'medium' },
    { time: '12 min ago', event: 'Suspicious IP flagged', severity: 'high' },
    { time: '18 min ago', event: 'DevTools access blocked', severity: 'low' },
    { time: '25 min ago', event: 'Session binding verified', severity: 'info' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Security Overview</h2>
        <p className="text-slate-400">Global security status and protection metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-slate-800/50 border-slate-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
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

      {/* Protection Status */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            Active Protection Layers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Copy/Paste Block',
              'Screenshot Prevention',
              'Print Disabled',
              'DevTools Block',
              'Right-Click Block',
              'Export Disabled',
              'Session Binding',
              'IP Verification',
            ].map((protection, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/30"
              >
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-300">{protection}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            Recent Security Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.severity === 'high' ? 'bg-red-400' :
                    activity.severity === 'medium' ? 'bg-yellow-400' :
                    activity.severity === 'low' ? 'bg-blue-400' :
                    'bg-green-400'
                  }`} />
                  <span className="text-white">{activity.event}</span>
                </div>
                <span className="text-sm text-slate-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityOverview;
