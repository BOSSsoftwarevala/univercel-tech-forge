import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Eye, ArrowUp, Clock, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { securityApi, type SecurityAlertItem } from '@/lib/api/security';
import { toast } from 'sonner';

const AlertsBlocks: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await securityApi.getAlerts(100);
      setAlerts(data.alerts);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load security alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAlerts();
  }, []);

  const formatRelativeTime = (value: string) => {
    const diffMinutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60000));
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    return `${Math.round(diffHours / 24)} day ago`;
  };

  const filteredAlerts = useMemo(() => {
    if (filter === 'All') return alerts;
    const normalized = filter.toLowerCase();
    return alerts.filter((alert) => alert.severity === normalized || alert.status === normalized);
  }, [alerts, filter]);

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
    { label: 'Total Alerts', value: alerts.length.toLocaleString(), icon: AlertTriangle, color: 'text-yellow-400' },
    { label: 'Active', value: alerts.filter((alert) => ['open', 'acknowledged', 'investigating'].includes(alert.status)).length.toLocaleString(), icon: Clock, color: 'text-blue-400' },
    { label: 'Blocked', value: alerts.filter((alert) => alert.status === 'blocked').length.toLocaleString(), icon: XCircle, color: 'text-red-400' },
    { label: 'Resolved', value: alerts.filter((alert) => alert.status === 'resolved').length.toLocaleString(), icon: CheckCircle, color: 'text-green-400' },
  ];

  const respondToAlert = async (alertId: string, status: 'acknowledged' | 'investigating' | 'blocked' | 'resolved') => {
    try {
      setMutatingId(alertId + status);
      await securityApi.respondToAlert(alertId, status);
      toast.success(`Alert moved to ${status}`);
      await loadAlerts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update alert');
    } finally {
      setMutatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-slate-700/50 bg-slate-900/40">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
      </div>
    );
  }

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
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">User</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Severity</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Time</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 font-mono text-slate-300">{alert.id.slice(0, 8)}</td>
                    <td className="py-3 px-4 text-white">{alert.title}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {alert.user_id ? alert.user_id.slice(0, 8) : 'system'}
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
                    <td className="py-3 px-4 text-slate-400">{formatRelativeTime(alert.created_at)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10" onClick={() => void respondToAlert(alert.id, 'acknowledged')} disabled={mutatingId === `${alert.id}acknowledged`}>
                          <Eye className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                        {['open', 'acknowledged', 'investigating'].includes(alert.status) && (
                          <>
                            <Button size="sm" variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10" onClick={() => void respondToAlert(alert.id, 'resolved')} disabled={mutatingId === `${alert.id}resolved`}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Close
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => void respondToAlert(alert.id, 'blocked')} disabled={mutatingId === `${alert.id}blocked`}>
                              <ArrowUp className="h-3 w-3 mr-1" />
                              Block
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredAlerts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-sm text-slate-400">
                      No alerts match the current filter.
                    </td>
                  </tr>
                )}
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
            {['All', 'critical', 'high', 'medium', 'low', 'open', 'blocked', 'investigating', 'resolved'].map((option) => (
              <Button key={option} variant="outline" size="sm" className={`border-slate-600 text-slate-300 hover:bg-slate-700 ${filter === option || (filter === 'All' && option === 'All') ? 'bg-slate-700' : ''}`} onClick={() => setFilter(option === 'All' ? 'All' : option)}>
                {option === 'All' ? 'All' : option.replace(/_/g, ' ')}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsBlocks;
