import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Rocket, TrendingUp, AlertTriangle, Users, Zap, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MarketingNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    {
      type: "campaign",
      title: "Campaign Goal Reached",
      message: "Summer Launch exceeded 400 leads target",
      time: "5 min ago",
      icon: Rocket,
      color: "emerald",
    },
    {
      type: "alert",
      title: "Budget Alert",
      message: "Enterprise Push campaign at 85% budget",
      time: "30 min ago",
      icon: AlertTriangle,
      color: "amber",
    },
    {
      type: "influencer",
      title: "Fraud Detection",
      message: "Suspicious click pattern from INF-004",
      time: "1h ago",
      icon: Users,
      color: "red",
    },
    {
      type: "automation",
      title: "Automation Triggered",
      message: "1,247 welcome emails sent today",
      time: "2h ago",
      icon: Zap,
      color: "cyan",
    },
    {
      type: "performance",
      title: "ROI Milestone",
      message: "Overall marketing ROI crossed 300%",
      time: "4h ago",
      icon: TrendingUp,
      color: "teal",
    },
  ];

  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-500/20 text-emerald-400",
    amber: "bg-amber-500/20 text-amber-400",
    red: "bg-red-500/20 text-red-400",
    cyan: "bg-cyan-500/20 text-cyan-400",
    teal: "bg-teal-500/20 text-teal-400",
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/30 z-50"
      >
        <Bell className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
          {notifications.length}
        </span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-96 bg-slate-900/95 backdrop-blur-xl border-l border-teal-500/20 z-40 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-teal-500/20 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-teal-100">Marketing Alerts</h3>
                <p className="text-xs text-slate-500">Campaign & performance updates</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notifications */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {notifications.map((notification, index) => {
                const Icon = notification.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-teal-500/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[notification.color]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-200">{notification.title}</p>
                          <span className="text-xs text-slate-600">{notification.time}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{notification.message}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-teal-500/20">
              <button className="w-full py-2 rounded-lg bg-teal-500/20 text-teal-300 text-sm font-medium hover:bg-teal-500/30 transition-colors">
                View All Alerts
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MarketingNotifications;
