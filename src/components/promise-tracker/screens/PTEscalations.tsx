import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Eye, 
  Edit, 
  CheckCircle, 
  DollarSign,
  AlertTriangle,
  ArrowUp,
  Scale
} from 'lucide-react';
import { toast } from 'sonner';

const escalatedPromises = [
  { id: 'PRM-002', title: 'Price Lock - Enterprise Client', category: 'Sales', owner: 'Sales Team', level: 3, escalatedAt: '2024-01-17', reason: 'Repeated delays', status: 'pending' },
  { id: 'PRM-016', title: 'Critical Bug Fix - Production', category: 'Delivery', owner: 'Dev Team', level: 4, escalatedAt: '2024-01-16', reason: 'SLA breach', status: 'in_review' },
  { id: 'PRM-017', title: 'Payment Dispute - Client ABC', category: 'Payment', owner: 'Finance', level: 2, escalatedAt: '2024-01-18', reason: 'Client complaint', status: 'pending' },
  { id: 'PRM-018', title: 'Compliance Deadline - GDPR', category: 'Legal', owner: 'Legal Team', level: 4, escalatedAt: '2024-01-15', reason: 'Regulatory requirement', status: 'resolved' },
];

const escalationLevels = [
  { level: 1, label: 'Reminder', icon: AlertTriangle, color: 'bg-blue-500/20 text-blue-400' },
  { level: 2, label: 'Manager Alert', icon: ArrowUp, color: 'bg-yellow-500/20 text-yellow-400' },
  { level: 3, label: 'Admin Alert', icon: TrendingUp, color: 'bg-orange-500/20 text-orange-400' },
  { level: 4, label: 'Legal / Penalty', icon: Scale, color: 'bg-red-500/20 text-red-400' },
];

const getEscalationConfig = (level: number) => {
  return escalationLevels.find(e => e.level === level) || escalationLevels[0];
};

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { color: string; label: string }> = {
    pending: { color: 'bg-yellow-500/20 text-yellow-400', label: 'Pending' },
    in_review: { color: 'bg-blue-500/20 text-blue-400', label: 'In Review' },
    resolved: { color: 'bg-green-500/20 text-green-400', label: 'Resolved' },
  };
  return statusMap[status] || { color: 'bg-slate-500/20 text-slate-400', label: status };
};

export default function PTEscalations() {
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
          <div className="p-3 bg-orange-500/20 rounded-xl">
            <TrendingUp className="h-8 w-8 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Escalations</h1>
            <p className="text-slate-400">Escalated promises requiring attention</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">{escalatedPromises.length} Escalated</Badge>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">PRIORITY</Badge>
        </div>
      </div>

      {/* Escalation Levels Guide */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-slate-400">Escalation Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {escalationLevels.map((level, index) => {
              const Icon = level.icon;
              return (
                <React.Fragment key={level.level}>
                  <div className="flex items-center gap-2">
                    <Badge className={level.color}>
                      <Icon className="w-3 h-3 mr-1" />
                      L{level.level}: {level.label}
                    </Badge>
                  </div>
                  {index < escalationLevels.length - 1 && (
                    <ArrowUp className="w-4 h-4 text-slate-500 rotate-90" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Escalated Promise List */}
      <div className="space-y-4">
        {escalatedPromises.map((promise) => {
          const escConfig = getEscalationConfig(promise.level);
          const statusConfig = getStatusBadge(promise.status);
          const EscIcon = escConfig.icon;
          
          return (
            <Card key={promise.id} className={`bg-slate-900/50 border-l-4 ${promise.level >= 3 ? 'border-l-red-500' : promise.level >= 2 ? 'border-l-orange-500' : 'border-l-yellow-500'}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm text-slate-400">{promise.id}</span>
                      <Badge className={escConfig.color}>
                        <EscIcon className="w-3 h-3 mr-1" />
                        Level {promise.level}
                      </Badge>
                      <Badge variant="outline" className="text-slate-300">{promise.category}</Badge>
                      <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                    </div>
                    <h3 className="font-medium text-white mb-1">{promise.title}</h3>
                    <p className="text-sm text-slate-400 mb-2">Owner: {promise.owner}</p>
                    
                    <div className="flex items-center gap-4 text-sm mb-2">
                      <div>
                        <span className="text-slate-500">Escalated: </span>
                        <span className="text-orange-400">{promise.escalatedAt}</span>
                      </div>
                    </div>
                    
                    <div className="p-2 bg-slate-800/50 rounded text-sm text-slate-400">
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
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-400" onClick={() => logAction('Resolve', promise.id)}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-orange-400" onClick={() => logAction('Escalate Further', promise.id)}>
                      <TrendingUp className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-amber-400" onClick={() => logAction('Apply Fine', promise.id)}>
                      <DollarSign className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
