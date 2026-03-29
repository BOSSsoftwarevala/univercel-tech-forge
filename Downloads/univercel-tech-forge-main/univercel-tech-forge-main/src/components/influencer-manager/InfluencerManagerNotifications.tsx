import { motion } from 'framer-motion';
import { 
  X, Bell, UserPlus, AlertTriangle, CheckCircle, 
  DollarSign, ShieldAlert, FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InfluencerManagerNotificationsProps {
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    type: 'application',
    title: 'New Application',
    message: 'Priya Sharma has applied to join the influencer program',
    time: '5 min ago',
    icon: UserPlus,
    color: 'purple'
  },
  {
    id: 2,
    type: 'fraud',
    title: 'Fraud Alert',
    message: 'Suspicious traffic detected from user_789 - 3,200 bot clicks blocked',
    time: '23 min ago',
    icon: ShieldAlert,
    color: 'red'
  },
  {
    id: 3,
    type: 'content',
    title: 'Content Pending',
    message: '5 new content submissions awaiting approval',
    time: '1 hour ago',
    icon: FileCheck,
    color: 'yellow'
  },
  {
    id: 4,
    type: 'payout',
    title: 'Payout Processed',
    message: 'Bulk payout of ₹4.5L completed for 45 influencers',
    time: '2 hours ago',
    icon: DollarSign,
    color: 'emerald'
  },
  {
    id: 5,
    type: 'milestone',
    title: 'Tier Upgrade',
    message: 'Rahul Verma has been promoted to Gold tier',
    time: '3 hours ago',
    icon: CheckCircle,
    color: 'yellow'
  },
];

const InfluencerManagerNotifications = ({ onClose }: InfluencerManagerNotificationsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        className="absolute right-0 top-0 bottom-0 w-96 bg-slate-900 border-l border-purple-500/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Notifications</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Notifications List */}
        <div className="p-4 space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl bg-slate-800/50 border border-${notification.color}-500/20 hover:bg-slate-800/70 transition-colors cursor-pointer`}
            >
              <div className="flex gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${notification.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                  <notification.icon className={`w-5 h-5 text-${notification.color}-400`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-white text-sm">{notification.title}</h3>
                    <span className="text-xs text-slate-400">{notification.time}</span>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-2">{notification.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-700/50">
          <Button variant="outline" className="w-full">
            View All Notifications
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InfluencerManagerNotifications;
