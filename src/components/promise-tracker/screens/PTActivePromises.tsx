import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Eye, 
  Edit, 
  CheckCircle, 
  TrendingUp, 
  DollarSign,
  Play,
  Timer
} from 'lucide-react';
import { toast } from 'sonner';

const activePromises = [
  { id: 'PRM-001', title: 'Feature Delivery - CRM Module', category: 'Delivery', owner: 'Dev Team A', deadline: '2024-01-20', priority: 'high', progress: 65, timeLeft: '2d 4h' },
  { id: 'PRM-004', title: 'Refund Promise - Order #8812', category: 'Payment', owner: 'Finance Team', deadline: '2024-01-19', priority: 'high', progress: 40, timeLeft: '1d 8h' },
  { id: 'PRM-006', title: 'SLA Commitment - Premium Plan', category: 'SLA', owner: 'Operations', deadline: '2024-01-22', priority: 'high', progress: 30, timeLeft: '4d 2h' },
  { id: 'PRM-008', title: 'Update Release - v2.5', category: 'Delivery', owner: 'Dev Team B', deadline: '2024-01-25', priority: 'medium', progress: 20, timeLeft: '7d 6h' },
];

const getPriorityBadge = (priority: string) => {
  const priorityMap: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400',
    high: 'bg-orange-500/20 text-orange-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-slate-500/20 text-slate-400',
  };
  return priorityMap[priority] || 'bg-slate-500/20 text-slate-400';
};

export default function PTActivePromises() {
  const logAction = (action: string, target: string) => {
    toast.success(`✓ ${action}`, {
      description: `${target} • ${new Date().toLocaleTimeString()}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Clock className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Active Promises</h1>
            <p className="text-slate-400">Currently tracking promises</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{activePromises.length} Active</Badge>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">LIVE</Badge>
        </div>
      </div>

      {/* Promise Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {activePromises.map((promise) => (
          <Card key={promise.id} className="bg-slate-900/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-slate-400">{promise.id}</span>
                    <Badge className={getPriorityBadge(promise.priority)}>{promise.priority}</Badge>
                  </div>
                  <h3 className="font-medium text-white">{promise.title}</h3>
                </div>
                <Badge variant="outline" className="text-slate-300">{promise.category}</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Owner: {promise.owner}</span>
                  <div className="flex items-center gap-1 text-blue-400">
                    <Timer className="w-4 h-4" />
                    <span>{promise.timeLeft}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-slate-400">{promise.progress}%</span>
                  </div>
                  <Progress value={promise.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-500">Deadline: {promise.deadline}</span>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => logAction('View', promise.id)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => logAction('Edit', promise.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-green-400" onClick={() => logAction('Fulfill', promise.id)}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-yellow-400" onClick={() => logAction('Delay', promise.id)}>
                      <Clock className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-orange-400" onClick={() => logAction('Escalate', promise.id)}>
                      <TrendingUp className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-amber-400" onClick={() => logAction('Apply Fine', promise.id)}>
                      <DollarSign className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-emerald-400" onClick={() => logAction('Add Tip', promise.id)}>
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
