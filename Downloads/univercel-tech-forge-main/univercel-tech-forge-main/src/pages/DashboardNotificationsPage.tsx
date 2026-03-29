import { Bell, ExternalLink, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';

const DashboardNotificationsPage = () => {
  const navigate = useNavigate();
  const { notifications, clearAll, dismissNotification, markAsRead } = useNotifications();

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold">
              <Bell className="h-8 w-8 text-cyan-400" />
              Notifications Dashboard
            </h1>
            <p className="mt-2 text-slate-400">Live alerts from applications, purchases, and marketplace actions.</p>
          </div>
          <Button variant="outline" onClick={() => void clearAll()} className="border-red-500/30 text-red-300 hover:bg-red-500/10">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-cyan-500/20 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-sm text-slate-400">Total notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{notifications.length}</div>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/20 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-sm text-slate-400">Actionable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{notifications.filter((item) => item.actionUrl).length}</div>
            </CardContent>
          </Card>
          <Card className="border-amber-500/20 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-sm text-slate-400">Priority buzzers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{notifications.filter((item) => item.isBuzzer).length}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-700 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-white">Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 p-12 text-center text-slate-400">
                No notifications yet.
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="rounded-xl border border-slate-700 bg-slate-950/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className="bg-cyan-500/10 text-cyan-300">{notification.eventType || 'notification'}</Badge>
                          {notification.isBuzzer && <Badge className="bg-red-500/10 text-red-300">Buzzer</Badge>}
                          <span className="text-xs text-slate-500">{formatTime(notification.timestamp)}</span>
                        </div>
                        <p className="text-base text-white">{notification.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => void markAsRead(notification.id)} className="text-slate-300 hover:text-white">
                          Mark read
                        </Button>
                        {notification.actionUrl && (
                          <Button
                            size="sm"
                            onClick={() => {
                              void markAsRead(notification.id);
                              navigate(notification.actionUrl!);
                            }}
                            className="bg-cyan-600 hover:bg-cyan-500"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => void dismissNotification(notification.id)} className="text-red-300 hover:text-red-200">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardNotificationsPage;