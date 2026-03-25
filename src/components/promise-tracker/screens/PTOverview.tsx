import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  CheckCircle, 
  TrendingUp,
  Eye,
  Edit,
  Play,
  Ban,
  FileText,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

const stats = [
  { label: 'Total Promises', value: 156, icon: Target, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { label: 'Active Promises', value: 42, icon: Clock, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { label: 'Pending / Upcoming', value: 28, icon: TrendingUp, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { label: 'Delayed', value: 8, icon: AlertTriangle, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { label: 'Broken', value: 3, icon: XCircle, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { label: 'Escalated', value: 5, icon: TrendingUp, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
];

const recentPromises = [
  { id: 'PRM-001', title: 'Feature Delivery - CRM Module', category: 'Delivery', owner: 'Dev Team A', deadline: '2024-01-20', priority: 'high', status: 'active' },
  { id: 'PRM-002', title: 'Price Lock - Enterprise Client', category: 'Sales', owner: 'Sales Team', deadline: '2024-01-18', priority: 'critical', status: 'delayed' },
  { id: 'PRM-003', title: 'Response Time - Ticket #4521', category: 'Support', owner: 'Support Lead', deadline: '2024-01-17', priority: 'medium', status: 'fulfilled' },
  { id: 'PRM-004', title: 'Refund Promise - Order #8812', category: 'Payment', owner: 'Finance Team', deadline: '2024-01-19', priority: 'high', status: 'active' },
  { id: 'PRM-005', title: 'NDA Delivery - Partner XYZ', category: 'Legal', owner: 'Legal Team', deadline: '2024-01-21', priority: 'medium', status: 'pending' },
];

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { color: string; label: string }> = {
    active: { color: 'bg-blue-500/20 text-blue-400', label: 'Active' },
    pending: { color: 'bg-yellow-500/20 text-yellow-400', label: 'Pending' },
    delayed: { color: 'bg-orange-500/20 text-orange-400', label: 'Delayed' },
    fulfilled: { color: 'bg-green-500/20 text-green-400', label: 'Fulfilled' },
    broken: { color: 'bg-red-500/20 text-red-400', label: 'Broken' },
  };
  return statusMap[status] || { color: 'bg-slate-500/20 text-slate-400', label: status };
};

const getPriorityBadge = (priority: string) => {
  const priorityMap: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400',
    high: 'bg-orange-500/20 text-orange-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-slate-500/20 text-slate-400',
  };
  return priorityMap[priority] || 'bg-slate-500/20 text-slate-400';
};

export default function PTOverview() {
  const logAction = (action: string, target: string) => {
    const timestamp = new Date().toISOString();
    console.log(`[AUDIT] ${timestamp} - ${action}: ${target}`);
    toast.success(`✓ ${action}`, {
      description: `${target} • ${new Date().toLocaleTimeString()}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/20 rounded-xl">
            <Target className="h-8 w-8 text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Promise Overview</h1>
            <p className="text-slate-400">Complete promise tracking dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">RUNNING</Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">AI ACTIVE</Badge>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">HEALTHY</Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className={`${stat.color} cursor-pointer hover:scale-105 transition-transform`}>
              <CardContent className="p-4 text-center">
                <Icon className="h-6 w-6 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs opacity-80">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Promise List */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5" />
            Recent Promises
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => logAction('Refreshed', 'Promise List')}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 text-slate-400 text-sm">
                  <th className="text-left py-3 px-4">Promise ID</th>
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Owner</th>
                  <th className="text-left py-3 px-4">Deadline</th>
                  <th className="text-left py-3 px-4">Priority</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentPromises.map((promise) => {
                  const statusConfig = getStatusBadge(promise.status);
                  return (
                    <tr key={promise.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-mono text-sm text-slate-300">{promise.id}</td>
                      <td className="py-3 px-4 text-white">{promise.title}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-slate-300">{promise.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{promise.owner}</td>
                      <td className="py-3 px-4 text-slate-400">{promise.deadline}</td>
                      <td className="py-3 px-4">
                        <Badge className={getPriorityBadge(promise.priority)}>{promise.priority}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => logAction('View', promise.id)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => logAction('Edit', promise.id)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-400" onClick={() => logAction('Fulfill', promise.id)}>
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-yellow-400" onClick={() => logAction('Delay', promise.id)}>
                            <Clock className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-orange-400" onClick={() => logAction('Escalate', promise.id)}>
                            <TrendingUp className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-amber-400" onClick={() => logAction('Apply Fine', promise.id)}>
                            <DollarSign className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-emerald-400" onClick={() => logAction('Add Tip', promise.id)}>
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
