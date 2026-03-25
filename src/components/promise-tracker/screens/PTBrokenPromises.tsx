import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  XCircle, 
  Eye, 
  Edit, 
  TrendingUp, 
  DollarSign,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

const brokenPromises = [
  { id: 'PRM-007', title: 'Demo Timeline - Prospect ABC', category: 'Sales', owner: 'Sales Rep', deadline: '2024-01-16', priority: 'critical', brokenAt: '2024-01-17', reason: 'Resource unavailability', fineApplied: true, fineAmount: '₹5,000' },
  { id: 'PRM-011', title: 'Callback Promise - Ticket #3321', category: 'Support', owner: 'Support Agent', deadline: '2024-01-14', priority: 'high', brokenAt: '2024-01-15', reason: 'Missed follow-up', fineApplied: false, fineAmount: null },
  { id: 'PRM-012', title: 'Invoice Clearance - Vendor XYZ', category: 'Payment', owner: 'Finance', deadline: '2024-01-10', priority: 'medium', brokenAt: '2024-01-12', reason: 'Approval delay', fineApplied: true, fineAmount: '₹2,500' },
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

export default function PTBrokenPromises() {
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
          <div className="p-3 bg-red-500/20 rounded-xl">
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Broken Promises</h1>
            <p className="text-slate-400">Failed to fulfill commitments</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{brokenPromises.length} Broken</Badge>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">CRITICAL</Badge>
        </div>
      </div>

      {/* Alert Banner */}
      <Card className="bg-red-500/10 border-red-500/30">
        <CardContent className="p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <p className="text-red-400">
            <strong>{brokenPromises.length} promises</strong> have been marked as broken. Review and take corrective action.
          </p>
        </CardContent>
      </Card>

      {/* Broken Promise List */}
      <div className="space-y-4">
        {brokenPromises.map((promise) => (
          <Card key={promise.id} className="bg-slate-900/50 border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm text-slate-400">{promise.id}</span>
                    <Badge className={getPriorityBadge(promise.priority)}>{promise.priority}</Badge>
                    <Badge variant="outline" className="text-slate-300">{promise.category}</Badge>
                    <Badge className="bg-red-500/20 text-red-400">BROKEN</Badge>
                  </div>
                  <h3 className="font-medium text-white mb-1">{promise.title}</h3>
                  <p className="text-sm text-slate-400 mb-2">Owner: {promise.owner}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <span className="text-slate-500">Deadline: </span>
                      <span className="text-slate-300">{promise.deadline}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Broken At: </span>
                      <span className="text-red-400">{promise.brokenAt}</span>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-slate-800/50 rounded text-sm text-slate-400 mb-2">
                    <span className="text-slate-500">Reason: </span>{promise.reason}
                  </div>

                  {promise.fineApplied ? (
                    <Badge className="bg-amber-500/20 text-amber-400">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Fine Applied: {promise.fineAmount}
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-500/20 text-slate-400">No Fine Applied</Badge>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => logAction('View', promise.id)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => logAction('Edit', promise.id)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-orange-400" onClick={() => logAction('Escalate', promise.id)}>
                    <TrendingUp className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-amber-400" onClick={() => logAction('Apply Fine', promise.id)}>
                    <DollarSign className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => logAction('Audit', promise.id)}>
                    <FileText className="w-4 h-4" />
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
