import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, AlertTriangle, AlertCircle, Bell, 
  CheckCircle, Server, Zap, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CrisisNotificationsProps {
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    type: 'critical',
    title: 'Production Database Down',
    message: 'Primary database cluster is not responding. Failover initiated.',
    time: '2 mins ago',
    icon: Server,
  },
  {
    id: 2,
    type: 'warning',
    title: 'High Memory Usage',
    message: 'Server memory usage exceeded 90% threshold.',
    time: '5 mins ago',
    icon: AlertTriangle,
  },
  {
    id: 3,
    type: 'info',
    title: 'Escalation Acknowledged',
    message: 'Incident #1234 escalated to engineering team.',
    time: '12 mins ago',
    icon: Zap,
  },
  {
    id: 4,
    type: 'success',
    title: 'Incident Resolved',
    message: 'API latency issue has been resolved.',
    time: '25 mins ago',
    icon: CheckCircle,
  },
];

const CrisisNotifications = ({ onClose }: CrisisNotificationsProps) => {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' };
      case 'warning':
        return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' };
      case 'info':
        return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' };
      case 'success':
        return { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' };
      default:
        return { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed right-4 top-20 w-96 bg-slate-900/95 backdrop-blur-xl border border-red-500/20 rounded-2xl shadow-2xl shadow-red-500/10 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-red-500/20 bg-gradient-to-r from-red-500/10 to-orange-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-white">Crisis Notifications</h3>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              {notifications.length}
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto p-2">
        <AnimatePresence>
          {notifications.map((notification, index) => {
            const styles = getTypeStyles(notification.type);
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 mb-2 rounded-xl ${styles.bg} border ${styles.border} hover:scale-[1.02] transition-transform cursor-pointer`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${styles.bg}`}>
                    <notification.icon className={`w-4 h-4 ${styles.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-white truncate">
                        {notification.title}
                      </h4>
                      <Badge className={`${styles.bg} ${styles.text} border-none text-[10px]`}>
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] text-slate-500">{notification.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-red-500/20">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-red-400 hover:bg-red-500/10"
        >
          View All Notifications
        </Button>
      </div>
    </motion.div>
  );
};

export default CrisisNotifications;
