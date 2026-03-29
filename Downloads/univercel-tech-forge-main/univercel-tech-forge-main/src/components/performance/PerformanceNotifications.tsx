import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Trophy, 
  AlertTriangle, 
  TrendingUp,
  Zap,
  CheckCircle,
  Clock,
  X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const notifications = [
  {
    id: "1",
    type: "positive",
    title: "New Personal Best!",
    message: "vala(dev)4412 achieved highest weekly score: 98",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "positive",
    title: "Task Streak Achieved!",
    message: "14 consecutive on-time deliveries",
    time: "15 min ago",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Delay Detected",
    message: "Recommend immediate update for task #4521",
    time: "30 min ago",
    read: true,
  },
  {
    id: "4",
    type: "positive",
    title: "Client Satisfaction Boost!",
    message: "Team satisfaction score increased to 92%",
    time: "1 hour ago",
    read: true,
  },
  {
    id: "5",
    type: "warning",
    title: "Rework Frequency Rising",
    message: "Review requirements for vala(dev)8823",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "6",
    type: "positive",
    title: "Incentive Unlocked",
    message: "Consistency Award earned by vala(sales)4771",
    time: "3 hours ago",
    read: true,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "positive": return <Trophy className="w-4 h-4 text-emerald-400" />;
    case "warning": return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    default: return <Bell className="w-4 h-4 text-cyan-400" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "positive": return "border-l-emerald-500 bg-emerald-500/5";
    case "warning": return "border-l-amber-500 bg-amber-500/5";
    default: return "border-l-cyan-500 bg-cyan-500/5";
  }
};

export const PerformanceNotifications = () => {
  const [items, setItems] = useState(notifications);
  const unreadCount = items.filter(n => !n.read).length;

  const dismissNotification = (id: string) => {
    setItems(prev => prev.filter(n => n.id !== id));
  };

  return (
    <Card className="p-4 bg-slate-900/50 backdrop-blur-xl border-cyan-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
          >
            <Bell className="w-5 h-5 text-cyan-400" />
          </motion.div>
          <h3 className="font-semibold text-white">Performance Alerts</h3>
          {unreadCount > 0 && (
            <motion.span
              className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {unreadCount} new
            </motion.span>
          )}
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-white">
          Clear All
        </Button>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {items.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, height: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative p-3 rounded-lg border-l-2 ${getNotificationColor(notification.type)} ${
                !notification.read ? "shadow-lg shadow-cyan-500/5" : ""
              }`}
            >
              {!notification.read && (
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-slate-800/50">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{notification.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notification.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 opacity-50 hover:opacity-100"
                  onClick={() => dismissNotification(notification.id)}
                >
                  <X className="w-3 h-3 text-slate-400" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Live Tracking Status */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <h4 className="text-xs text-slate-400 mb-3">Live Tracking</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-xs text-slate-300">Online Members</span>
            </div>
            <span className="text-xs text-emerald-400 font-semibold">24</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span className="text-xs text-slate-300">Active Tasks</span>
            </div>
            <span className="text-xs text-cyan-400 font-semibold">47</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-amber-400" />
              <span className="text-xs text-slate-300">SLA Countdowns</span>
            </div>
            <span className="text-xs text-amber-400 font-semibold">3</span>
          </div>
        </div>
      </div>

      {/* Sound Settings */}
      <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
        <span>🔊 Performance hum enabled</span>
        <Button variant="ghost" size="sm" className="text-xs h-6">
          Settings
        </Button>
      </div>
    </Card>
  );
};
