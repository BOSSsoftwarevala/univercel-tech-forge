import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Heart, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  TrendingUp,
  MessageSquare,
  X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const notifications = [
  {
    id: "1",
    type: "milestone",
    title: "Satisfaction Milestone",
    message: "Client satisfaction increased to 92%. Keep it up!",
    time: "5 min ago",
    read: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Delivery Delay Risk",
    message: "Warning: delivery delay detected for StartupX. Suggest proactive communication.",
    time: "20 min ago",
    read: false,
  },
  {
    id: "3",
    type: "complete",
    title: "Onboarding Complete",
    message: "TechCorp Solutions has completed onboarding successfully!",
    time: "1 hour ago",
    read: true,
  },
  {
    id: "4",
    type: "risk",
    title: "At-Risk Flag",
    message: "StartupX flagged as at-risk. Immediate attention required.",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "resolved",
    title: "Complaint Resolved",
    message: "Billing concern for Enterprise Plus has been resolved.",
    time: "3 hours ago",
    read: true,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "milestone": return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    case "warning": return <Clock className="w-4 h-4 text-amber-500" />;
    case "complete": return <CheckCircle className="w-4 h-4 text-teal-500" />;
    case "risk": return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    case "resolved": return <Heart className="w-4 h-4 text-violet-500" />;
    default: return <Bell className="w-4 h-4 text-slate-500" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "milestone": return "border-l-emerald-500 bg-emerald-50/50";
    case "warning": return "border-l-amber-500 bg-amber-50/50";
    case "complete": return "border-l-teal-500 bg-teal-50/50";
    case "risk": return "border-l-rose-500 bg-rose-50/50";
    case "resolved": return "border-l-violet-500 bg-violet-50/50";
    default: return "border-l-slate-500 bg-slate-50/50";
  }
};

export const ClientSuccessNotifications = () => {
  const [items, setItems] = useState(notifications);
  const unreadCount = items.filter(n => !n.read).length;

  const dismissNotification = (id: string) => {
    setItems(prev => prev.filter(n => n.id !== id));
  };

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
          >
            <Bell className="w-5 h-5 text-teal-600" />
          </motion.div>
          <h3 className="font-semibold text-slate-700">Alerts & Updates</h3>
          {unreadCount > 0 && (
            <motion.span
              className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-600 text-xs font-medium"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {unreadCount} new
            </motion.span>
          )}
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-slate-700">
          Clear All
        </Button>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {items.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, height: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative p-3 rounded-lg border-l-2 ${getNotificationColor(notification.type)} ${
                !notification.read ? "shadow-sm" : ""
              }`}
            >
              {!notification.read && (
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-white shadow-sm">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700">{notification.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notification.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
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

      {/* Sound Settings */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>🔔 Subtle chimes enabled</span>
        <Button variant="ghost" size="sm" className="text-xs h-6 text-slate-500">
          Settings
        </Button>
      </div>
    </Card>
  );
};
