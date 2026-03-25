/**
 * ROLE MANAGER - APPROVALS & ALERTS SCREEN
 */

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Clock,
  AlertTriangle,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  Zap,
} from "lucide-react";

const PENDING_APPROVALS = [
  { id: 1, type: 'Role Request', user: 'John Smith', role: 'Manager', time: '2 hours ago', priority: 'high' },
  { id: 2, type: 'Permission Change', user: 'Sarah Johnson', role: 'Sales Lead', time: '4 hours ago', priority: 'medium' },
  { id: 3, type: 'Role Request', user: 'Mike Chen', role: 'Admin', time: '1 day ago', priority: 'high' },
  { id: 4, type: 'Temporary Access', user: 'Lisa Brown', role: 'Finance View', time: '2 days ago', priority: 'low' },
  { id: 5, type: 'Emergency Access', user: 'David Wilson', role: 'Super Admin', time: '30 min ago', priority: 'critical' },
];

const ALERTS = [
  { id: 1, type: 'red', icon: AlertTriangle, message: 'Over-permission detected for Finance Team', count: 3 },
  { id: 2, type: 'yellow', icon: Clock, message: 'Pending approval - 5 requests waiting', count: 5 },
  { id: 3, type: 'blue', icon: Zap, message: 'AI suggestion available for Sales role', count: 2 },
  { id: 4, type: 'gray', icon: Shield, message: 'System-locked role modification attempted', count: 1 },
];

interface RMApprovalsProps {
  activeItem: string;
}

export const RMApprovals = memo<RMApprovalsProps>(({ activeItem }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'red': return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' };
      case 'yellow': return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' };
      case 'blue': return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' };
      default: return { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400' };
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Approvals & Alerts</h1>
          <p className="text-sm text-slate-400">
            {activeItem === 'pending-approvals' && 'Pending role approval requests'}
            {activeItem === 'permission-requests' && 'Permission change requests'}
            {activeItem === 'emergency-requests' && 'Emergency access requests'}
            {activeItem === 'auto-expire' && 'Auto-expiring role alerts'}
            {activeItem === 'high-risk-alerts' && 'High-risk permission alerts'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-green-500/30 text-green-400">
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve All
          </Button>
          <Button variant="outline" className="border-red-500/30 text-red-400">
            <XCircle className="w-4 h-4 mr-2" />
            Reject All
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-4 gap-4">
        {ALERTS.map((alert) => {
          const style = getAlertStyle(alert.type);
          const Icon = alert.icon;
          return (
            <Card key={alert.id} className={`${style.bg} border ${style.border}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${style.text}`} />
                  <div className="flex-1">
                    <p className="text-sm text-white">{alert.message}</p>
                  </div>
                  <Badge variant="outline" className={style.text}>
                    {alert.count}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending Approvals */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-400" />
            Pending Approvals
            <Badge variant="destructive" className="ml-2">
              {PENDING_APPROVALS.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {PENDING_APPROVALS.map((approval) => (
              <div
                key={approval.id}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-slate-700"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 font-medium">
                      {approval.user.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">{approval.user}</p>
                      <Badge variant="outline" className={getPriorityColor(approval.priority)}>
                        {approval.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">
                      {approval.type} → {approval.role} • {approval.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Eye className="w-4 h-4 text-slate-400" />
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 h-8">
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

RMApprovals.displayName = 'RMApprovals';
