import { motion } from 'framer-motion';
import { 
  X, Users, DollarSign, Video, TrendingUp, 
  Bell, Award, Megaphone, Link2
} from 'lucide-react';
import { toast } from 'sonner';

interface InfluencerNotificationsProps {
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    type: 'conversion',
    icon: DollarSign,
    title: 'New Conversion!',
    message: 'POS System sale - ₹2,250 commission earned',
    time: '5 min ago',
    read: false,
    color: 'emerald'
  },
  {
    id: 2,
    type: 'lead',
    icon: Users,
    title: 'New Lead Generated',
    message: 'Green Valley School clicked your link',
    time: '15 min ago',
    read: false,
    color: 'cyan'
  },
  {
    id: 3,
    type: 'video',
    icon: Video,
    title: 'Video Going Viral',
    message: 'POS Demo video reached 10K views',
    time: '1 hour ago',
    read: false,
    color: 'pink'
  },
  {
    id: 4,
    type: 'bonus',
    icon: Award,
    title: 'Bonus Unlocked!',
    message: 'You earned Top Performer badge this week',
    time: '2 hours ago',
    read: true,
    color: 'violet'
  },
  {
    id: 5,
    type: 'campaign',
    icon: Megaphone,
    title: 'Campaign Update',
    message: 'Back to School Promo reached 80% budget',
    time: '3 hours ago',
    read: true,
    color: 'amber'
  },
  {
    id: 6,
    type: 'link',
    icon: Link2,
    title: 'Link Performance',
    message: 'Your School ERP link crossed 500 clicks',
    time: '5 hours ago',
    read: true,
    color: 'blue'
  },
];

const InfluencerNotifications = ({ onClose }: InfluencerNotificationsProps) => {
  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      violet: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
      amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    return colors[color] || colors.violet;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      className="fixed right-0 top-16 bottom-0 w-96 bg-slate-900/95 backdrop-blur-xl border-l border-violet-500/20 z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-violet-400" />
          <h3 className="font-semibold text-white">Notifications</h3>
          <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-400 text-xs font-medium">
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
              onClick={() => toast.info(notification.title, { description: notification.message })}
              className={`p-4 border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors cursor-pointer ${
                !notification.read ? 'bg-violet-500/5' : ''
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
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-violet-400 rounded-full"
                      />
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

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50 bg-slate-900/95">
        <button 
          onClick={() => toast.success("All notifications marked as read")}
          className="w-full py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm hover:border-violet-500/30 hover:text-violet-400 transition-all"
        >
          Mark all as read
        </button>
      </div>
    </motion.div>
  );
};

export default InfluencerNotifications;
