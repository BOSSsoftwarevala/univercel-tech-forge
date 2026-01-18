import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Eye, 
  FileText,
  Gift,
  Clock,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

const fulfilledPromises = [
  { id: 'PRM-003', title: 'Response Time - Ticket #4521', category: 'Support', owner: 'Support Lead', completedAt: '2024-01-17', deadline: '2024-01-17', priority: 'medium', onTime: true, tipApplied: true, tipAmount: '₹1,000' },
  { id: 'PRM-013', title: 'Feature Launch - Dashboard v2', category: 'Delivery', owner: 'Dev Team A', completedAt: '2024-01-15', deadline: '2024-01-16', priority: 'high', onTime: true, tipApplied: true, tipAmount: '₹5,000' },
  { id: 'PRM-014', title: 'NDA Signed - Partner DEF', category: 'Legal', owner: 'Legal Team', completedAt: '2024-01-14', deadline: '2024-01-14', priority: 'medium', onTime: true, tipApplied: false, tipAmount: null },
  { id: 'PRM-015', title: 'Refund Processed - Order #7721', category: 'Payment', owner: 'Finance', completedAt: '2024-01-13', deadline: '2024-01-12', priority: 'high', onTime: false, tipApplied: false, tipAmount: null },
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

export default function PTFulfilledPromises() {
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
          <div className="p-3 bg-green-500/20 rounded-xl">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Fulfilled Promises</h1>
            <p className="text-slate-400">Successfully completed commitments</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{fulfilledPromises.length} Fulfilled</Badge>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">SUCCESS</Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4 text-center">
            <Award className="h-6 w-6 mx-auto text-green-400 mb-2" />
            <p className="text-2xl font-bold text-green-400">{fulfilledPromises.filter(p => p.onTime).length}</p>
            <p className="text-xs text-slate-400">On Time</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto text-yellow-400 mb-2" />
            <p className="text-2xl font-bold text-yellow-400">{fulfilledPromises.filter(p => !p.onTime).length}</p>
            <p className="text-xs text-slate-400">Late</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <Gift className="h-6 w-6 mx-auto text-emerald-400 mb-2" />
            <p className="text-2xl font-bold text-emerald-400">{fulfilledPromises.filter(p => p.tipApplied).length}</p>
            <p className="text-xs text-slate-400">Tips Given</p>
          </CardContent>
        </Card>
      </div>

      {/* Fulfilled Promise List */}
      <div className="space-y-4">
        {fulfilledPromises.map((promise) => (
          <Card key={promise.id} className="bg-slate-900/50 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm text-slate-400">{promise.id}</span>
                    <Badge className={getPriorityBadge(promise.priority)}>{promise.priority}</Badge>
                    <Badge variant="outline" className="text-slate-300">{promise.category}</Badge>
                    <Badge className="bg-green-500/20 text-green-400">FULFILLED</Badge>
                    {promise.onTime && (
                      <Badge className="bg-emerald-500/20 text-emerald-400">
                        <Award className="w-3 h-3 mr-1" />
                        On Time
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium text-white mb-1">{promise.title}</h3>
                  <p className="text-sm text-slate-400 mb-2">Owner: {promise.owner}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <span className="text-slate-500">Deadline: </span>
                      <span className="text-slate-300">{promise.deadline}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Completed: </span>
                      <span className="text-green-400">{promise.completedAt}</span>
                    </div>
                  </div>

                  {promise.tipApplied && (
                    <Badge className="bg-emerald-500/20 text-emerald-400">
                      <Gift className="w-3 h-3 mr-1" />
                      Tip: {promise.tipAmount}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => logAction('View', promise.id)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => logAction('Audit', promise.id)}>
                    <FileText className="w-4 h-4" />
                  </Button>
                  {!promise.tipApplied && (
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-emerald-400" onClick={() => logAction('Add Tip', promise.id)}>
                      <Gift className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
