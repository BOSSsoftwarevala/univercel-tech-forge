import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  X, Clock, User, Activity, Monitor, Globe, 
  AlertTriangle, CheckCircle, XCircle, Timer
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LiveActivityLog, ActivityStatus } from '@/hooks/useLiveActivityLogs';

interface LiveReportCardProps {
  log: LiveActivityLog | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig: Record<ActivityStatus, { icon: React.ReactNode; color: string; label: string }> = {
  success: { icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-400', label: 'Success' },
  fail: { icon: <XCircle className="w-5 h-5" />, color: 'text-red-400', label: 'Failed' },
  blocked: { icon: <XCircle className="w-5 h-5" />, color: 'text-orange-400', label: 'Blocked' },
  pending: { icon: <Clock className="w-5 h-5" />, color: 'text-yellow-400', label: 'Pending' },
  warning: { icon: <AlertTriangle className="w-5 h-5" />, color: 'text-amber-400', label: 'Warning' },
};

export function LiveReportCard({ log, isOpen, onClose }: LiveReportCardProps) {
  if (!log) return null;

  const status = statusConfig[log.status];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Activity className="w-5 h-5 text-primary" />
            Activity Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-center justify-between p-4 rounded-xl",
              "bg-gradient-to-r from-card to-muted/30 border border-border"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg bg-background/50", status.color)}>
                {status.icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className={cn("font-semibold", status.color)}>{status.label}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold flex items-center gap-1">
                <Timer className="w-4 h-4" />
                {log.duration_seconds}s
              </p>
            </div>
          </motion.div>

          {/* Warning Alert */}
          {log.is_abnormal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30"
            >
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-400">Abnormal Behavior Detected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {log.abnormal_reason || 'This activity has been flagged for review'}
                </p>
              </div>
            </motion.div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <DetailItem 
              icon={<Clock className="w-4 h-4" />}
              label="Timestamp"
              value={format(new Date(log.created_at), 'PPpp')}
            />
            <DetailItem 
              icon={<User className="w-4 h-4" />}
              label="Role"
              value={log.user_role.replace('_', ' ').toUpperCase()}
            />
            <DetailItem 
              icon={<Activity className="w-4 h-4" />}
              label="Action"
              value={log.action_type.replace('_', ' ')}
            />
            <DetailItem 
              icon={<Monitor className="w-4 h-4" />}
              label="Device"
              value={log.device_info || 'Unknown'}
            />
            <DetailItem 
              icon={<Globe className="w-4 h-4" />}
              label="IP Address"
              value={log.ip_address || 'Unknown'}
              className="col-span-2"
            />
          </div>

          <Separator className="bg-border/50" />

          {/* Description */}
          {log.action_description && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="text-sm bg-muted/30 p-3 rounded-lg">
                {log.action_description}
              </p>
            </div>
          )}

          {/* Page URL */}
          {log.page_url && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Page URL</p>
              <p className="text-sm font-mono bg-muted/30 p-3 rounded-lg truncate">
                {log.page_url}
              </p>
            </div>
          )}

          {/* Metadata */}
          {Object.keys(log.metadata || {}).length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Additional Data</p>
              <pre className="text-xs bg-muted/30 p-3 rounded-lg overflow-auto max-h-32">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}

function DetailItem({ icon, label, value, className }: DetailItemProps) {
  return (
    <div className={cn("p-3 rounded-lg bg-muted/20 border border-border/50", className)}>
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-medium truncate capitalize">{value}</p>
    </div>
  );
}
