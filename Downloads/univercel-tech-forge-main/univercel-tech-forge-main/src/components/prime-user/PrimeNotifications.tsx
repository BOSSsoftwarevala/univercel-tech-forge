import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  X, 
  CheckCircle2, 
  Clock, 
  MessageCircle, 
  Download,
  Crown,
  Zap
} from "lucide-react";

const PrimeNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "priority",
      title: "Your request is our priority",
      message: "Development team has been assigned to your payment gateway integration.",
      time: "2 min ago",
      read: false
    },
    {
      id: 2,
      type: "update",
      title: "Milestone Update",
      message: "Core Development Phase is now 78% complete.",
      time: "15 min ago",
      read: false
    },
    {
      id: 3,
      type: "message",
      title: "New Message from Manager",
      message: "Sarah: Your assigned developer is live now.",
      time: "30 min ago",
      read: false
    },
    {
      id: 4,
      type: "download",
      title: "Download Ready",
      message: "Enterprise CRM v2.4.1 is ready for download.",
      time: "1 hour ago",
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "priority":
        return <Crown className="w-5 h-5 text-amber-400" />;
      case "update":
        return <Zap className="w-5 h-5 text-blue-400" />;
      case "message":
        return <MessageCircle className="w-5 h-5 text-emerald-400" />;
      case "download":
        return <Download className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-stone-400" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <>
      {/* Floating Notification Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 z-50"
      >
        <Bell className="w-6 h-6 text-stone-900" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-96 bg-gradient-to-b from-stone-900 to-stone-950 border-l border-amber-500/20 z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-amber-500/10 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-amber-100">Notifications</h2>
                  <p className="text-sm text-stone-500">{unreadCount} unread messages</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-xl bg-stone-800/50 flex items-center justify-center text-stone-400 hover:text-amber-400"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      notification.read 
                        ? "bg-stone-800/30 border border-stone-700/30" 
                        : "bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20"
                    } hover:border-amber-500/40`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        notification.type === "priority" ? "bg-amber-500/20" :
                        notification.type === "update" ? "bg-blue-500/20" :
                        notification.type === "message" ? "bg-emerald-500/20" :
                        "bg-purple-500/20"
                      }`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${notification.read ? "text-stone-400" : "text-amber-200"}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                          )}
                        </div>
                        <p className="text-sm text-stone-500 mt-1">{notification.message}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="w-3 h-3 text-stone-600" />
                          <span className="text-xs text-stone-600">{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-amber-500/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                  className="w-full py-3 rounded-xl bg-stone-800/50 border border-stone-700/50 text-stone-400 hover:text-amber-400 hover:border-amber-500/30 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark all as read
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PrimeNotifications;
