import { motion } from 'framer-motion';
import { 
  X, ListTodo, Bug, Rocket, Wallet, Clock, 
  AlertTriangle, CheckCircle2, Bell
} from 'lucide-react';

interface DeveloperNotificationsProps {
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    type: 'task',
    icon: ListTodo,
    title: 'New Task Assigned',
    message: 'POS System v2.4 - Client: vala(client)***',
    time: '2 min ago',
    read: false,
    color: 'cyan'
  },
  {
    id: 2,
    type: 'bug',
    icon: Bug,
    title: 'Bug Reported — Action Needed',
    message: 'Invoice PDF rendering issue reported',
    time: '15 min ago',
    read: false,
    color: 'red'
  },
  {
    id: 3,
    type: 'deploy',
    icon: Rocket,
    title: 'Deployment Successful',
    message: 'School ERP Dashboard deployed to production',
    time: '1 hour ago',
    read: true,
    color: 'emerald'
  },
  {
    id: 4,
    type: 'payment',
    icon: Wallet,
    title: 'Payment Credited',
    message: '₹5,000 added to your wallet',
    time: '2 hours ago',
    read: true,
    color: 'teal'
  },
  {
    id: 5,
    type: 'deadline',
    icon: Clock,
    title: 'Deadline Approaching',
    message: 'Task TSK-001 due in 24 hours',
    time: '3 hours ago',
    read: true,
    color: 'amber'
  },
];

const DeveloperNotifications = ({ onClose }: DeveloperNotificationsProps) => {
  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      red: 'bg-red-500/20 text-red-400 border-red-500/30',
      emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      teal: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    };
    return colors[color] || colors.cyan;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      className="fixed right-0 top-16 bottom-0 w-96 bg-slate-900/95 backdrop-blur-xl border-l border-cyan-500/20 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-white">Notifications</h3>
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-medium">
            {notifications.filter(n => !n.read).length} new
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="overflow-auto max-h-[calc(100vh-130px)]">
        {notifications.map((notification, index) => {
          const Icon = notification.icon;
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors cursor-pointer ${
                !notification.read ? 'bg-cyan-500/5' : ''
              }`}
            >
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getColorClasses(notification.color)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h4 className={`font-medium ${!notification.read ? 'text-white' : 'text-slate-300'}`}>
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{notification.message}</p>
                  <p className="text-xs text-slate-500 mt-2">{notification.time}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 bg-slate-900/95">
        <button className="w-full py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm hover:border-cyan-500/30 hover:text-cyan-400 transition-all">
          Mark all as read
        </button>
      </div>
    </motion.div>
  );
};

export default DeveloperNotifications;
