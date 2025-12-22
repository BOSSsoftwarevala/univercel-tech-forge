import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';
import { Monitor, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { UserOnlineStatus } from '@/hooks/useLiveActivityLogs';
import { LiveStatusIndicator, getStatusFromUserData, getStatusLabel } from './LiveStatusIndicator';

interface LiveOnlineUsersProps {
  users: UserOnlineStatus[];
  maxHeight?: string;
}

const roleColors: Record<string, string> = {
  master: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0',
  super_admin: 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white border-0',
  admin: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0',
  developer: 'bg-gradient-to-r from-cyan-400 to-teal-500 text-white border-0',
  demo_manager: 'bg-gradient-to-r from-teal-400 to-green-500 text-white border-0',
  franchise: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0',
  reseller: 'bg-gradient-to-r from-lime-400 to-green-500 text-white border-0',
  influencer: 'bg-gradient-to-r from-pink-400 to-rose-500 text-white border-0',
  client_success: 'bg-gradient-to-r from-orange-400 to-amber-500 text-white border-0',
  prime: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0',
  client: 'bg-gradient-to-r from-slate-400 to-gray-500 text-white border-0',
};

export function LiveOnlineUsers({ users, maxHeight = '400px' }: LiveOnlineUsersProps) {
  const sortedUsers = [...users].sort((a, b) => {
    // Online users first
    if (a.is_online !== b.is_online) return a.is_online ? -1 : 1;
    // Then by last seen
    return new Date(b.last_seen_at).getTime() - new Date(a.last_seen_at).getTime();
  });

  const getSessionDuration = (user: UserOnlineStatus) => {
    if (!user.session_started_at || !user.is_online) return null;
    const minutes = differenceInMinutes(new Date(), new Date(user.session_started_at));
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <Card className="bg-[#12121a] border-gray-800/50 shadow-xl h-full">
      <CardHeader className="pb-3 border-b border-gray-800/50">
        <CardTitle className="text-lg flex items-center gap-2 text-white">
          <Monitor className="w-5 h-5 text-lime-400" />
          Live User Status
          <Badge className="ml-auto bg-gradient-to-r from-lime-400 to-green-500 text-white border-0">
            {users.filter(u => u.is_online).length} Online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ScrollArea className="w-full" style={{ maxHeight }}>
          <div className="space-y-2 pr-4">
            {sortedUsers.map((user, index) => {
              const status = getStatusFromUserData(user);
              const sessionDuration = getSessionDuration(user);

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl",
                    "bg-[#1a1a2e] border border-gray-800/50",
                    "hover:border-gray-700 transition-all duration-200"
                  )}
                >
                  {/* Status Indicator */}
                  <LiveStatusIndicator status={status} size="md" />

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={cn(
                          "text-xs",
                          roleColors[user.user_role] || 'bg-gray-500/20 text-gray-400'
                        )}
                      >
                        {user.user_role.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {getStatusLabel(status)}
                      </span>
                    </div>

                    {user.current_page && (
                      <p className="text-xs text-gray-500 mt-1 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {user.current_page}
                      </p>
                    )}
                  </div>

                  {/* Session Duration / Last Seen */}
                  <div className="text-right shrink-0">
                    {sessionDuration ? (
                      <div className="flex items-center gap-1 text-sm font-medium text-lime-400">
                        <Clock className="w-3 h-3" />
                        {sessionDuration}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(user.last_seen_at), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
