import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Users, DollarSign, Banknote, Calendar, Brain,
  Trash2, Check, AlertTriangle, Info, Siren, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import type { NotificationType } from '@/components/shared/GlobalNotificationHeader';

type SummaryType = 'lead' | 'commission' | 'payout' | 'followup' | 'ai';

const ResellerNotifications = () => {
  const { notifications, markAsRead, clearAll, dismissNotification } = useNotifications();

  const markAllAsRead = async () => {
    await Promise.all(notifications.map((notification) => markAsRead(notification.id)));
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    return date.toLocaleDateString();
  };

  const resolveSummaryType = (eventType: string, type: NotificationType): SummaryType => {
    const value = eventType.toLowerCase();
    if (value.includes('lead')) return 'lead';
    if (value.includes('commission')) return 'commission';
    if (value.includes('payout') || value.includes('withdraw')) return 'payout';
    if (value.includes('follow')) return 'followup';
    if (value.includes('ai') || value.includes('score')) return 'ai';
    return type === 'success' ? 'commission' : 'lead';
  };

  const hydratedNotifications = useMemo(() => notifications.map((notification) => ({
    ...notification,
    summaryType: resolveSummaryType(notification.eventType, notification.type),
    title: notification.actionLabel || notification.eventType.replace(/[_-]/g, ' ') || 'Notification',
    time: formatTime(notification.timestamp),
    urgent: notification.type === 'priority' || notification.type === 'danger' || notification.isBuzzer,
    read: false,
  })), [notifications]);

  const getTypeIcon = (type: string) => {
    const icons: Record<string, { icon: any; color: string; bg: string }> = {
      lead: { icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
      commission: { icon: DollarSign, color: 'text-teal-400', bg: 'bg-teal-500/20' },
      payout: { icon: Banknote, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
      followup: { icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/20' },
      ai: { icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    };
    return icons[type] || icons.lead;
  };

  const unreadCount = hydratedNotifications.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">{unreadCount} new</Badge>
            )}
          </h1>
          <p className="text-slate-400">Stay updated with your sales activity</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
            disabled={unreadCount === 0}
          >
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearAll}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            disabled={hydratedNotifications.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Notification Types Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { type: 'lead', label: 'Leads' },
          { type: 'commission', label: 'Commission' },
          { type: 'payout', label: 'Payouts' },
          { type: 'followup', label: 'Follow-ups' },
          { type: 'ai', label: 'AI Alerts' },
        ].map((item) => {
          const typeInfo = getTypeIcon(item.type);
          const Icon = typeInfo.icon;
          const count = hydratedNotifications.filter(n => n.summaryType === item.type).length;
          return (
            <Card key={item.type} className="bg-slate-900/50 border-emerald-500/20">
              <CardContent className="p-3 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${typeInfo.bg}`}>
                  <Icon className={`w-4 h-4 ${typeInfo.color}`} />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{item.label}</p>
                  {count > 0 && (
                    <p className="text-xs text-slate-400">{count} unread</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Notifications List */}
      <Card className="bg-slate-900/50 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            All Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hydratedNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">No notifications</p>
              <p className="text-slate-500 text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {hydratedNotifications.map((notification, index) => {
                  const typeInfo = getTypeIcon(notification.summaryType);
                  const Icon = typeInfo.icon;
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.03 }}
                      className={`flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer bg-slate-800/50 border-emerald-500/30 hover:border-emerald-500/50 ${notification.urgent ? 'border-l-4 border-l-red-500' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className={`p-2 rounded-lg ${typeInfo.bg} flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${typeInfo.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">
                            {notification.title}
                          </p>
                          {notification.urgent && (
                            <Badge className="bg-red-500/20 text-red-400 text-xs">Urgent</Badge>
                          )}
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        </div>
                        <p className="text-slate-400 text-sm mt-1">{notification.message}</p>
                        <p className="text-slate-500 text-xs mt-2">{notification.time}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-500 hover:text-red-400 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotification(notification.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerNotifications;
