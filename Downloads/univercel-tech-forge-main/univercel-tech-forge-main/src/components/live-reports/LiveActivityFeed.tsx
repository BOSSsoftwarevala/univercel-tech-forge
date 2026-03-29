import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  LogIn, LogOut, Navigation, Eye, Copy, Link, 
  UserCheck, Power, CheckSquare, Users, MessageSquare,
  FileText, Settings, AlertTriangle, Clock
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LiveActivityLog, ActivityActionType, ActivityStatus } from '@/hooks/useLiveActivityLogs';
import { LiveStatusIndicator } from './LiveStatusIndicator';

interface LiveActivityFeedProps {
  logs: LiveActivityLog[];
  onSelectLog?: (log: LiveActivityLog) => void;
  maxHeight?: string;
}

const actionIcons: Record<ActivityActionType, React.ReactNode> = {
  login: <LogIn className="w-4 h-4" />,
  logout: <LogOut className="w-4 h-4" />,
  page_navigation: <Navigation className="w-4 h-4" />,
  demo_interaction: <Eye className="w-4 h-4" />,
  copy_attempt: <Copy className="w-4 h-4" />,
  link_edit: <Link className="w-4 h-4" />,
  approval_request: <UserCheck className="w-4 h-4" />,
  force_logout: <Power className="w-4 h-4" />,
  task_update: <CheckSquare className="w-4 h-4" />,
  lead_action: <Users className="w-4 h-4" />,
  chat_message: <MessageSquare className="w-4 h-4" />,
  file_access: <FileText className="w-4 h-4" />,
  settings_change: <Settings className="w-4 h-4" />,
  error: <AlertTriangle className="w-4 h-4" />,
};

const actionColors: Record<ActivityActionType, string> = {
  login: 'text-green-400 bg-green-400/10',
  logout: 'text-gray-400 bg-gray-400/10',
  page_navigation: 'text-blue-400 bg-blue-400/10',
  demo_interaction: 'text-purple-400 bg-purple-400/10',
  copy_attempt: 'text-orange-400 bg-orange-400/10',
  link_edit: 'text-cyan-400 bg-cyan-400/10',
  approval_request: 'text-yellow-400 bg-yellow-400/10',
  force_logout: 'text-red-400 bg-red-400/10',
  task_update: 'text-indigo-400 bg-indigo-400/10',
  lead_action: 'text-pink-400 bg-pink-400/10',
  chat_message: 'text-teal-400 bg-teal-400/10',
  file_access: 'text-amber-400 bg-amber-400/10',
  settings_change: 'text-slate-400 bg-slate-400/10',
  error: 'text-red-500 bg-red-500/10',
};

const statusBadgeStyles: Record<ActivityStatus, string> = {
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  fail: 'bg-red-500/20 text-red-400 border-red-500/30',
  blocked: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const roleColors: Record<string, string> = {
  master: 'bg-purple-500/20 text-purple-400',
  super_admin: 'bg-indigo-500/20 text-indigo-400',
  admin: 'bg-blue-500/20 text-blue-400',
  developer: 'bg-cyan-500/20 text-cyan-400',
  demo_manager: 'bg-teal-500/20 text-teal-400',
  franchise: 'bg-green-500/20 text-green-400',
  reseller: 'bg-emerald-500/20 text-emerald-400',
  influencer: 'bg-pink-500/20 text-pink-400',
  client_success: 'bg-orange-500/20 text-orange-400',
  prime: 'bg-amber-500/20 text-amber-400',
  client: 'bg-slate-500/20 text-slate-400',
};

export function LiveActivityFeed({ logs, onSelectLog, maxHeight = '600px' }: LiveActivityFeedProps) {
  return (
    <ScrollArea className={cn("w-full", `max-h-[${maxHeight}]`)} style={{ maxHeight }}>
      <div className="space-y-2 pr-4">
        <AnimatePresence mode="popLayout">
          {logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              onClick={() => onSelectLog?.(log)}
              className={cn(
                "p-3 rounded-xl border cursor-pointer transition-all duration-200",
                "bg-card/50 border-border/50 hover:bg-card hover:border-border",
                log.is_abnormal && "border-amber-500/50 bg-amber-500/5"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Action Icon */}
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  actionColors[log.action_type]
                )}>
                  {actionIcons[log.action_type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Role Badge */}
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs font-medium border-0",
                        roleColors[log.user_role] || 'bg-gray-500/20 text-gray-400'
                      )}
                    >
                      {log.user_role.replace('_', ' ').toUpperCase()}
                    </Badge>

                    {/* Action Type */}
                    <span className="text-sm font-medium text-foreground capitalize">
                      {log.action_type.replace('_', ' ')}
                    </span>

                    {/* Status Badge */}
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        statusBadgeStyles[log.status]
                      )}
                    >
                      {log.status}
                    </Badge>

                    {/* Warning Flag */}
                    {log.is_abnormal && (
                      <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Alert
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  {log.action_description && (
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {log.action_description}
                    </p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </span>
                    {log.duration_seconds > 0 && (
                      <span>{log.duration_seconds}s</span>
                    )}
                    {log.device_info && (
                      <span className="truncate max-w-[100px]">{log.device_info}</span>
                    )}
                  </div>
                </div>

                {/* Live Indicator */}
                <LiveStatusIndicator status="online" size="sm" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {logs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No activity logs found
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
