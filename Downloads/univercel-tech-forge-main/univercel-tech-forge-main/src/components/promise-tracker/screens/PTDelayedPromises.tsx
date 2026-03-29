import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Eye, 
  Edit, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  DollarSign,
  Play
} from 'lucide-react';
import { toast } from 'sonner';

const delayedPromises = [
  { id: 'PRM-002', title: 'Price Lock - Enterprise Client', category: 'Sales', owner: 'Sales Team', originalDeadline: '2024-01-15', newDeadline: '2024-01-18', delayDays: 3, priority: 'critical', reason: 'Client requested additional features' },
  { id: 'PRM-009', title: 'Integration Timeline - Partner ABC', category: 'Partnership', owner: 'Tech Team', originalDeadline: '2024-01-12', newDeadline: '2024-01-20', delayDays: 8, priority: 'high', reason: 'API changes required' },
  { id: 'PRM-010', title: 'Response SLA - Ticket #5621', category: 'SLA', owner: 'Support', originalDeadline: '2024-01-16', newDeadline: '2024-01-17', delayDays: 1, priority: 'medium', reason: 'Holiday weekend' },
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

export default function PTDelayedPromises() {
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
          <div className="p-3 bg-yellow-500/20 rounded-xl">
            <AlertTriangle className="h-8 w-8 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Delayed Promises</h1>
            <p className="text-slate-400">Promises past original deadline</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{delayedPromises.length} Delayed</Badge>
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">ALERT</Badge>
        </div>
      </div>

      {/* Delayed Promise List */}
      <div className="space-y-4">
        {delayedPromises.map((promise) => (
          <Card key={promise.id} className="bg-slate-900/50 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm text-slate-400">{promise.id}</span>
                    <Badge className={getPriorityBadge(promise.priority)}>{promise.priority}</Badge>
                    <Badge variant="outline" className="text-slate-300">{promise.category}</Badge>
                    <Badge className="bg-yellow-500/20 text-yellow-400">+{promise.delayDays} days</Badge>
                  </div>
                  <h3 className="font-medium text-white mb-1">{promise.title}</h3>
                  <p className="text-sm text-slate-400 mb-2">Owner: {promise.owner}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Original: </span>
                      <span className="text-red-400 line-through">{promise.originalDeadline}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">New: </span>
                      <span className="text-yellow-400">{promise.newDeadline}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 p-2 bg-slate-800/50 rounded text-sm text-slate-400">
                    <span className="text-slate-500">Reason: </span>{promise.reason}
                  </div>
                </div>

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
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-yellow-400" onClick={() => logAction('Extend Again', promise.id)}>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
