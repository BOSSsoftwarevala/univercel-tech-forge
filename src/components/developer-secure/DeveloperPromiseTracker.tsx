import React from 'react';
import { 
  Shield, Clock, CheckCircle, AlertTriangle, XCircle,
  Eye, Lock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Promise {
  id: string;
  promise_code: string;
  task_id: string;
  task_title: string;
  status: 'active' | 'fulfilled' | 'breached' | 'extended';
  deadline: string;
  created_at: string;
  completion_percentage: number;
  sla_remaining: string;
}

interface DeveloperPromiseTrackerProps {
  promises?: Promise[];
  isLoading?: boolean;
}

const mockPromises: Promise[] = [
  {
    id: '1',
    promise_code: 'PRM-2847',
    task_id: 'T-1234',
    task_title: 'API Integration for CRM',
    status: 'active',
    deadline: '2025-01-02',
    created_at: '2 days ago',
    completion_percentage: 65,
    sla_remaining: '4h 30m'
  },
  {
    id: '2',
    promise_code: 'PRM-2845',
    task_id: 'T-1230',
    task_title: 'Bug Fix - Login Module',
    status: 'fulfilled',
    deadline: '2024-12-30',
    created_at: '5 days ago',
    completion_percentage: 100,
    sla_remaining: 'Completed'
  },
  {
    id: '3',
    promise_code: 'PRM-2842',
    task_id: 'T-1228',
    task_title: 'Dashboard Redesign',
    status: 'breached',
    deadline: '2024-12-28',
    created_at: '7 days ago',
    completion_percentage: 45,
    sla_remaining: 'Breached'
  },
];

export function DeveloperPromiseTracker({ 
  promises = mockPromises,
  isLoading 
}: DeveloperPromiseTrackerProps) {
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { 
          bg: 'bg-cyan-500/20', 
          text: 'text-cyan-400', 
          border: 'border-cyan-500/30',
          icon: Clock,
          label: 'Active' 
        };
      case 'fulfilled':
        return { 
          bg: 'bg-emerald-500/20', 
          text: 'text-emerald-400', 
          border: 'border-emerald-500/30',
          icon: CheckCircle,
          label: 'Fulfilled' 
        };
      case 'breached':
        return { 
          bg: 'bg-red-500/20', 
          text: 'text-red-400', 
          border: 'border-red-500/30',
          icon: XCircle,
          label: 'Breached' 
        };
      case 'extended':
        return { 
          bg: 'bg-amber-500/20', 
          text: 'text-amber-400', 
          border: 'border-amber-500/30',
          icon: AlertTriangle,
          label: 'Extended' 
        };
      default:
        return { 
          bg: 'bg-slate-500/20', 
          text: 'text-slate-400', 
          border: 'border-slate-500/30',
          icon: Clock,
          label: status 
        };
    }
  };

  // Calculate summary stats
  const stats = {
    total: promises.length,
    active: promises.filter(p => p.status === 'active').length,
    fulfilled: promises.filter(p => p.status === 'fulfilled').length,
    breached: promises.filter(p => p.status === 'breached').length,
  };

  const fulfillmentRate = stats.total > 0 
    ? Math.round((stats.fulfilled / (stats.fulfilled + stats.breached || 1)) * 100) 
    : 0;

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-8 text-center">
        <div className="animate-spin h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Loading promises...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with READ-ONLY badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-500" />
          <h3 className="font-semibold text-white">Promise Tracker</h3>
        </div>
        <Badge variant="outline" className="text-xs bg-slate-800/50">
          <Lock className="h-3 w-3 mr-1" />
          READ-ONLY
        </Badge>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-center">
          <p className="text-2xl font-bold text-cyan-500">{stats.active}</p>
          <p className="text-xs text-muted-foreground">Active</p>
        </div>
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
          <p className="text-2xl font-bold text-emerald-500">{stats.fulfilled}</p>
          <p className="text-xs text-muted-foreground">Fulfilled</p>
        </div>
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
          <p className="text-2xl font-bold text-red-500">{stats.breached}</p>
          <p className="text-xs text-muted-foreground">Breached</p>
        </div>
      </div>

      {/* Fulfillment Rate */}
      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Fulfillment Rate</span>
          <span className={`font-bold ${fulfillmentRate >= 80 ? 'text-emerald-500' : fulfillmentRate >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
            {fulfillmentRate}%
          </span>
        </div>
        <Progress value={fulfillmentRate} className="h-2" />
      </div>

      {/* Promise List */}
      <div className="space-y-2">
        {promises.map((promise) => {
          const statusConfig = getStatusConfig(promise.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={promise.id}
              className={`p-4 rounded-lg bg-slate-800/50 border ${statusConfig.border} transition-colors`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">{promise.promise_code}</Badge>
                    <Badge className={`text-xs ${statusConfig.bg} ${statusConfig.text}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-white text-sm">{promise.task_title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Task: {promise.task_id} • Created: {promise.created_at}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className={`h-3 w-3 ${statusConfig.text}`} />
                    <span className={`text-sm font-mono ${statusConfig.text}`}>
                      {promise.sla_remaining}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Due: {promise.deadline}</p>
                </div>
              </div>

              {/* Progress */}
              {promise.status === 'active' && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-cyan-500">{promise.completion_percentage}%</span>
                  </div>
                  <Progress value={promise.completion_percentage} className="h-1" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Read-Only Notice */}
      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center gap-2">
        <Eye className="h-4 w-4 text-purple-500" />
        <span className="text-xs text-muted-foreground">
          View-only access. Promise management is handled by Task Manager.
        </span>
      </div>
    </div>
  );
}
