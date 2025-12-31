import React from 'react';
import { Shield, Clock, AlertTriangle, CheckCircle, XCircle, Code2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DeveloperStatus } from '@/hooks/useDeveloperGuard';

interface DeveloperStatusBannerProps {
  developerId: string;
  status: DeveloperStatus;
  performanceScore: number;
  slaComplianceRate: number;
  activeTasks: number;
  expertiseLevel: string;
  onViewProfile?: () => void;
}

export function DeveloperStatusBanner({
  developerId,
  status,
  performanceScore,
  slaComplianceRate,
  activeTasks,
  expertiseLevel,
  onViewProfile
}: DeveloperStatusBannerProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30',
          icon: CheckCircle,
          iconColor: 'text-emerald-500',
          label: 'Active Developer',
          message: 'You can accept and work on assigned tasks'
        };
      case 'pending':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30',
          icon: Clock,
          iconColor: 'text-amber-500',
          label: 'Pending Verification',
          message: 'Your account is under review. Task access is limited.'
        };
      case 'suspended':
        return {
          bg: 'bg-red-500/10 border-red-500/30',
          icon: XCircle,
          iconColor: 'text-red-500',
          label: 'Account Suspended',
          message: 'Your account is suspended. Contact support.'
        };
      case 'verified':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30',
          icon: Shield,
          iconColor: 'text-cyan-500',
          label: 'Verified Developer',
          message: 'Account verified. Ready to accept tasks.'
        };
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/30',
          icon: AlertTriangle,
          iconColor: 'text-slate-500',
          label: 'Unknown Status',
          message: 'Please contact support'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  const getExpertiseBadge = () => {
    switch (expertiseLevel) {
      case 'senior':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'mid':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'junior':
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className={`rounded-xl border p-4 ${config.bg}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Left - Status Info */}
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-slate-800/50 ${config.iconColor}`}>
            <StatusIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white">{config.label}</h3>
              <Badge variant="outline" className="text-xs bg-slate-800/50">
                {developerId}
              </Badge>
              <Badge variant="outline" className={`text-xs ${getExpertiseBadge()}`}>
                {expertiseLevel.charAt(0).toUpperCase() + expertiseLevel.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{config.message}</p>
          </div>
        </div>

        {/* Right - Stats */}
        <div className="flex items-center gap-6">
          {/* Performance Score */}
          <div className="text-center">
            <div className="flex items-center gap-1">
              <Code2 className="h-4 w-4 text-cyan-500" />
              <span className="text-lg font-bold text-cyan-500">{performanceScore}%</span>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase">Performance</p>
          </div>

          {/* SLA Compliance */}
          <div className="text-center">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span className="text-lg font-bold text-emerald-500">{slaComplianceRate}%</span>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase">SLA Rate</p>
          </div>

          {/* Active Tasks */}
          <div className="text-center">
            <span className="text-lg font-bold text-amber-500">{activeTasks}</span>
            <p className="text-[10px] text-muted-foreground uppercase">Active Tasks</p>
          </div>

          {/* View Profile */}
          {onViewProfile && (
            <Button variant="outline" size="sm" onClick={onViewProfile}>
              View Profile
            </Button>
          )}
        </div>
      </div>

      {/* Restrictions Notice */}
      {status === 'active' && (
        <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>Execution Only Mode • No Admin Access • All Actions Logged</span>
        </div>
      )}
    </div>
  );
}
