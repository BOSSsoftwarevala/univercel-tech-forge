import { motion, AnimatePresence } from "framer-motion";
import { X, Info, CheckCircle, AlertTriangle, Sparkles, Users } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  type: string;
  time: string;
}

interface LeadNotificationsProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const LeadNotifications = ({ notifications, onDismiss }: LeadNotificationsProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "ai":
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case "lead":
        return <Users className="w-5 h-5 text-cyan-400" />;
      default:
        return <Info className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getStyle = (type: string) => {
    switch (type) {
      case "success":
        return "from-green-500/20 to-emerald-500/20 border-green-500/30";
      case "warning":
        return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
      case "ai":
        return "from-purple-500/20 to-pink-500/20 border-purple-500/30";
      case "lead":
        return "from-cyan-500/20 to-blue-500/20 border-cyan-500/30";
      default:
        return "from-indigo-500/20 to-purple-500/20 border-indigo-500/30";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 bg-gradient-to-r ${getStyle(notification.type)} backdrop-blur-xl rounded-xl border shadow-xl`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">{notification.message}</p>
                <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
              </div>
              <button
                onClick={() => onDismiss(notification.id)}
                className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default LeadNotifications;
