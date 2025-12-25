import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Eye, ArrowUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AlertsBlocks: React.FC = () => {
  const alerts = [
    { 
      id: 'ALT-001',
      type: 'Copy Attempt',
      role: 'Developer',
      severity: 'low',
      status: 'active',
      time: '2 min ago'
    },
    { 
      id: 'ALT-002',
      type: 'Screenshot Detected',
      role: 'Franchise',
      severity: 'medium',
      status: 'active',
      time: '5 min ago'
    },
    { 
      id: 'ALT-003',
      type: 'IP Mismatch',
      role: 'Reseller',
      severity: 'high',
      status: 'escalated',
      time: '10 min ago'
    },
    { 
      id: 'ALT-004',
      type: 'Brute Force',
      role: 'Unknown',
      severity: 'critical',
      status: 'blocked',
      time: '15 min ago'
    },
    { 
      id: 'ALT-005',
      type: 'VPN Detected',
      role: 'Developer',
      severity: 'medium',
      status: 'reviewing',
      time: '20 min ago'
    },
    { 
      id: 'ALT-006',
      type: 'Export Attempt',
      role: 'Finance',
      severity: 'high',
      status: 'closed',
      time: '25 min ago'
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-600/50 text-red-500 bg-red-500/10';
      case 'high': return 'border-red-500/50 text-red-400';
      case 'medium': return 'border-yellow-500/50 text-yellow-400';
      case 'low': return 'border-blue-500/50 text-blue-400';
      default: return 'border-slate-500/50 text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-yellow-500/50 text-yellow-400';
      case 'escalated': return 'border-red-500/50 text-red-400';
      case 'blocked': return 'border-red-600/50 text-red-500';
      case 'reviewing': return 'border-blue-500/50 text-blue-400';
      case 'closed': return 'border-green-500/50 text-green-400';
      default: return 'border-slate-500/50 text-slate-400';
    }
  };

  const stats = [
    { label: 'Total Alerts', value: '156', icon: AlertTriangle, color: 'text-yellow-400' },
    { label: 'Active', value: '23', icon: Clock, color: 'text-blue-400' },
    { label: 'Blocked', value: '89', icon: XCircle, color: 'text-red-400' },
    { label: 'Resolved', value: '44', icon: CheckCircle, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Alerts & Blocks</h2>
        <p className="text-slate-400">Security alerts, blocked attempts, and threat management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <Icon className={`h-8 w-8 ${stat.color} opacity-50`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alerts Table */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            Security Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Alert ID</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Severity</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Time</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 font-mono text-slate-300">{alert.id}</td>
                    <td className="py-3 px-4 text-white">{alert.type}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {alert.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={getStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{alert.time}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                          <Eye className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                        {alert.status === 'active' && (
                          <>
                            <Button size="sm" variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Close
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                              <ArrowUp className="h-3 w-3 mr-1" />
                              Escalate
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Filters */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">Quick Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['All', 'Critical', 'High', 'Medium', 'Low', 'Active', 'Blocked', 'Escalated', 'Closed'].map((filter) => (
              <Button key={filter} variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                {filter}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsBlocks;
