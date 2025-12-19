import { motion } from "framer-motion";
import { 
  Bell, TrendingDown, TrendingUp, AlertTriangle, 
  CheckCircle, Info, Clock, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SEOAlerts = () => {
  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "Keyword Ranking Drop Detected",
      message: "\"best pos software africa\" dropped from #8 to #15. AI suggests improving internal linking.",
      time: "2 hours ago",
      icon: TrendingDown,
      action: "Fix Ranking Drop"
    },
    {
      id: 2,
      type: "success",
      title: "Ranking Spike!",
      message: "\"hospital software dubai\" jumped to #3. Great momentum, keep optimizing!",
      time: "4 hours ago",
      icon: TrendingUp,
      action: null
    },
    {
      id: 3,
      type: "error",
      title: "Indexing Failure",
      message: "5 new blog pages failed to index. Sitemap might need regeneration.",
      time: "6 hours ago",
      icon: AlertTriangle,
      action: "Fix Sitemap"
    },
    {
      id: 4,
      type: "info",
      title: "Traffic Prediction Update",
      message: "AI predicts 23% traffic increase next month based on current keyword performance.",
      time: "8 hours ago",
      icon: Info,
      action: null
    },
    {
      id: 5,
      type: "warning",
      title: "Backlink Quality Alert",
      message: "3 new backlinks detected with low domain authority. Review recommended.",
      time: "12 hours ago",
      icon: AlertTriangle,
      action: "Review Links"
    },
    {
      id: 6,
      type: "success",
      title: "Content Published",
      message: "\"School Management System Kenya\" blog successfully indexed by Google.",
      time: "1 day ago",
      icon: CheckCircle,
      action: null
    },
  ];

  const triggers = [
    { name: "Keyword Drops", enabled: true, threshold: "> 5 positions" },
    { name: "Traffic Drop", enabled: true, threshold: "> 10% daily" },
    { name: "Ranking Spike", enabled: true, threshold: "> 10 positions" },
    { name: "Indexing Failure", enabled: true, threshold: "Any page" },
    { name: "Sitemap Errors", enabled: true, threshold: "Any error" },
    { name: "New Backlinks", enabled: false, threshold: "Any new" },
  ];

  const getAlertStyle = (type: string) => {
    switch (type) {
      case "success":
        return { bg: "bg-green-500/10", border: "border-green-500/30", icon: "text-green-400" };
      case "warning":
        return { bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: "text-yellow-400" };
      case "error":
        return { bg: "bg-red-500/10", border: "border-red-500/30", icon: "text-red-400" };
      default:
        return { bg: "bg-blue-500/10", border: "border-blue-500/30", icon: "text-blue-400" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Live Tracking & Alerts</h2>
          <p className="text-slate-400">Real-time SEO monitoring with calm notifications</p>
        </div>
        <Button variant="outline" className="border-slate-600 text-slate-300">
          <Bell className="w-4 h-4 mr-2" />
          Configure Alerts
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Alerts List */}
        <div className="col-span-2 space-y-4">
          {alerts.map((alert, index) => {
            const style = getAlertStyle(alert.type);
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 ${style.bg} backdrop-blur-sm rounded-xl border ${style.border}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${style.bg}`}>
                    <alert.icon className={`w-5 h-5 ${style.icon}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white">{alert.title}</h4>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.time}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{alert.message}</p>
                    {alert.action && (
                      <Button 
                        size="sm" 
                        className="mt-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-xs"
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        {alert.action}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Alert Triggers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            Alert Triggers
          </h3>
          <div className="space-y-3">
            {triggers.map((trigger, index) => (
              <motion.div
                key={trigger.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-white">{trigger.name}</p>
                  <p className="text-xs text-slate-400">{trigger.threshold}</p>
                </div>
                <Badge className={trigger.enabled ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"}>
                  {trigger.enabled ? "ON" : "OFF"}
                </Badge>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
            <p className="text-xs text-slate-400 mb-2">Notification Style</p>
            <p className="text-sm text-cyan-300">🔔 Subtle tech ping — polite & calm</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SEOAlerts;
