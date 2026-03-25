import React from 'react';
import { Key, Shield, AlertTriangle, RotateCcw, XCircle, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const APIKeyProtection: React.FC = () => {
  const apiKeys = [
    { 
      name: 'Production API Key',
      prefix: 'sk_prod_***',
      scope: 'Full Access',
      rateLimit: '1000/min',
      usage: 45,
      status: 'active',
      lastUsed: '2 min ago'
    },
    { 
      name: 'Development API Key',
      prefix: 'sk_dev_***',
      scope: 'Read Only',
      rateLimit: '100/min',
      usage: 12,
      status: 'active',
      lastUsed: '15 min ago'
    },
    { 
      name: 'Integration Key',
      prefix: 'sk_int_***',
      scope: 'Limited',
      rateLimit: '500/min',
      usage: 78,
      status: 'warning',
      lastUsed: '1 min ago'
    },
  ];

  const abuseAlerts = [
    { time: '5 min ago', key: 'sk_prod_***', type: 'Rate limit exceeded', severity: 'high' },
    { time: '20 min ago', key: 'sk_int_***', type: 'Unusual pattern', severity: 'medium' },
    { time: '1 hour ago', key: 'sk_dev_***', type: 'Multiple failures', severity: 'low' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">API & Key Protection</h2>
        <p className="text-slate-400">Manage API keys, permissions, rate limits, and abuse detection</p>
      </div>

      {/* Active API Keys */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-400" />
            Active API Keys
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((key, index) => (
              <div key={index} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Key className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{key.name}</h4>
                      <p className="text-sm font-mono text-slate-400">{key.prefix}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={
                        key.status === 'active' ? 'border-green-500/50 text-green-400' :
                        key.status === 'warning' ? 'border-yellow-500/50 text-yellow-400' :
                        'border-red-500/50 text-red-400'
                      }
                    >
                      {key.status}
                    </Badge>
                    <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Rotate
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                      <XCircle className="h-3 w-3 mr-1" />
                      Disable
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Scope:</span>
                    <p className="text-white">{key.scope}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Rate Limit:</span>
                    <p className="text-white">{key.rateLimit}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Usage:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={key.usage} className="h-2 flex-1" />
                      <span className="text-white">{key.usage}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Last Used:</span>
                    <p className="text-white">{key.lastUsed}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rate Limit Status */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-400" />
            Rate Limit Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 text-center">
              <p className="text-3xl font-bold text-green-400">847</p>
              <p className="text-sm text-slate-400">Requests / min</p>
              <p className="text-xs text-green-300 mt-1">Under Limit</p>
            </div>
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 text-center">
              <p className="text-3xl font-bold text-yellow-400">23</p>
              <p className="text-sm text-slate-400">Near Limit Warnings</p>
              <p className="text-xs text-yellow-300 mt-1">Today</p>
            </div>
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 text-center">
              <p className="text-3xl font-bold text-red-400">3</p>
              <p className="text-sm text-slate-400">Rate Limit Hits</p>
              <p className="text-xs text-red-300 mt-1">Last Hour</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Abuse Alerts */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            API Abuse Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Time</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">API Key</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Alert Type</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Severity</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {abuseAlerts.map((alert, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-slate-300">{alert.time}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{alert.key}</td>
                    <td className="py-3 px-4 text-white">{alert.type}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant="outline" 
                        className={
                          alert.severity === 'high' ? 'border-red-500/50 text-red-400' :
                          alert.severity === 'medium' ? 'border-yellow-500/50 text-yellow-400' :
                          'border-blue-500/50 text-blue-400'
                        }
                      >
                        {alert.severity}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10">
                          Rotate Key
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                          Disable Key
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Approval Notice */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <div className="flex items-center gap-2 text-amber-400">
          <Shield className="h-5 w-5" />
          <span className="font-medium">Approval Required</span>
        </div>
        <p className="text-sm text-amber-300/80 mt-1">
          Key rotation and disabling require approval workflow. Changes are logged immutably.
        </p>
      </div>
    </div>
  );
};

export default APIKeyProtection;
