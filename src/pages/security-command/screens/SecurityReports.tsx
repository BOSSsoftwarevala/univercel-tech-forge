import React from 'react';
import { FileText, TrendingUp, Shield, AlertTriangle, Ban, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SecurityReports: React.FC = () => {
  const dailySummary = {
    totalAttempts: 1247,
    blocked: 89,
    allowed: 1158,
    effectiveness: 94,
  };

  const attackTypes = [
    { type: 'Copy/Paste Attempts', count: 234, blocked: 234, rate: 100 },
    { type: 'Screenshot Attempts', count: 45, blocked: 42, rate: 93 },
    { type: 'Export Attempts', count: 67, blocked: 67, rate: 100 },
    { type: 'Brute Force', count: 12, blocked: 12, rate: 100 },
    { type: 'IP Violations', count: 23, blocked: 21, rate: 91 },
    { type: 'Session Hijacking', count: 8, blocked: 8, rate: 100 },
  ];

  const trends = [
    { period: 'Today', attacks: 89, change: '+12%' },
    { period: 'This Week', attacks: 523, change: '-5%' },
    { period: 'This Month', attacks: 2147, change: '+8%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Security Reports</h2>
        <p className="text-slate-400">Daily security summary, attack attempts, and trend analysis</p>
      </div>

      {/* No Export Notice */}
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
        <Ban className="h-5 w-5 text-red-400" />
        <div>
          <span className="font-medium text-red-400">Export Disabled</span>
          <p className="text-sm text-red-300/80">Reports cannot be exported, copied, or printed. View only.</p>
        </div>
      </div>

      {/* Daily Summary */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            Daily Security Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900/50 rounded-lg text-center">
              <Activity className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{dailySummary.totalAttempts}</p>
              <p className="text-sm text-slate-400">Total Attempts</p>
            </div>
            <div className="p-4 bg-red-500/10 rounded-lg text-center border border-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-400">{dailySummary.blocked}</p>
              <p className="text-sm text-slate-400">Blocked</p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-lg text-center border border-green-500/20">
              <Shield className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-400">{dailySummary.allowed}</p>
              <p className="text-sm text-slate-400">Legitimate</p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg text-center border border-purple-500/20">
              <TrendingUp className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-400">{dailySummary.effectiveness}%</p>
              <p className="text-sm text-slate-400">Effectiveness</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attack Types Breakdown */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Attack Types Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Attack Type</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Total</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Blocked</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Block Rate</th>
                </tr>
              </thead>
              <tbody>
                {attackTypes.map((attack, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-white">{attack.type}</td>
                    <td className="py-3 px-4 text-slate-300">{attack.count}</td>
                    <td className="py-3 px-4 text-red-400">{attack.blocked}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant="outline" 
                        className={attack.rate === 100 ? 'border-green-500/50 text-green-400' : 'border-yellow-500/50 text-yellow-400'}
                      >
                        {attack.rate}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trends.map((trend, index) => (
              <div key={index} className="p-4 bg-slate-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400">{trend.period}</span>
                  <Badge 
                    variant="outline" 
                    className={trend.change.startsWith('+') ? 'border-red-500/50 text-red-400' : 'border-green-500/50 text-green-400'}
                  >
                    {trend.change}
                  </Badge>
                </div>
                <p className="text-3xl font-bold text-white">{trend.attacks}</p>
                <p className="text-sm text-slate-400">Attacks Blocked</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Threat Categories */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Threat Categories (Last 24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { category: 'Data Exfiltration', count: 312, color: 'bg-red-500' },
              { category: 'Unauthorized Access', count: 89, color: 'bg-orange-500' },
              { category: 'Session Attacks', count: 45, color: 'bg-yellow-500' },
              { category: 'Policy Violations', count: 156, color: 'bg-blue-500' },
            ].map((cat, index) => (
              <div key={index} className="p-4 bg-slate-900/50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${cat.color} mb-2`} />
                <p className="text-2xl font-bold text-white">{cat.count}</p>
                <p className="text-sm text-slate-400">{cat.category}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityReports;
