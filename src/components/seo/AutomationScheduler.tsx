import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, Clock, Play, Pause, RefreshCw, Bell,
  CheckCircle, AlertTriangle, Settings, Zap, Sun, Moon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AutomationScheduler = () => {
  const [activeJobs, setActiveJobs] = useState<string[]>(["sitemap", "rankcheck", "meta"]);

  const scheduledTasks = [
    { 
      id: "sitemap", 
      name: "Sitemap Generation", 
      schedule: "Daily at 6:00 AM",
      lastRun: "6 hours ago",
      nextRun: "In 18 hours",
      status: "active",
      type: "technical"
    },
    { 
      id: "rankcheck", 
      name: "Rank Check", 
      schedule: "Every 6 hours",
      lastRun: "2 hours ago",
      nextRun: "In 4 hours",
      status: "active",
      type: "tracking"
    },
    { 
      id: "meta", 
      name: "Meta Optimization", 
      schedule: "Weekly on Monday",
      lastRun: "3 days ago",
      nextRun: "In 4 days",
      status: "active",
      type: "optimization"
    },
    { 
      id: "backlink", 
      name: "Backlink Scan", 
      schedule: "Weekly on Friday",
      lastRun: "5 days ago",
      nextRun: "In 2 days",
      status: "paused",
      type: "monitoring"
    },
    { 
      id: "competitor", 
      name: "Competitor Analysis", 
      schedule: "Daily at 9:00 AM",
      lastRun: "15 hours ago",
      nextRun: "In 9 hours",
      status: "active",
      type: "intelligence"
    },
  ];

  const seasonalAlerts = [
    { event: "Black Friday", date: "Nov 24, 2024", action: "Update sale keywords", status: "upcoming" },
    { event: "Christmas Season", date: "Dec 1, 2024", action: "Holiday content push", status: "upcoming" },
    { event: "New Year Sale", date: "Dec 28, 2024", action: "Year-end promotions", status: "upcoming" },
  ];

  const recentRuns = [
    { task: "Sitemap Generation", time: "6 hours ago", status: "success", duration: "2.3s" },
    { task: "Rank Check", time: "2 hours ago", status: "success", duration: "45s" },
    { task: "Meta Optimization", time: "3 days ago", status: "success", duration: "12s" },
    { task: "Backlink Scan", time: "5 days ago", status: "warning", duration: "3m 21s" },
  ];

  const toggleJob = (id: string) => {
    setActiveJobs(prev => 
      prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "technical": return "bg-blue-500/20 text-blue-400";
      case "tracking": return "bg-green-500/20 text-green-400";
      case "optimization": return "bg-purple-500/20 text-purple-400";
      case "monitoring": return "bg-orange-500/20 text-orange-400";
      case "intelligence": return "bg-cyan-500/20 text-cyan-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-400" />
            Automation Scheduler
          </h2>
          <p className="text-slate-400">Automated SEO tasks and seasonal alerts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-600">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
            <Zap className="w-4 h-4 mr-2" />
            Run All Now
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Active Jobs", value: activeJobs.length, icon: Play, color: "text-green-400" },
          { label: "Paused", value: scheduledTasks.length - activeJobs.length, icon: Pause, color: "text-yellow-400" },
          { label: "Runs Today", value: 8, icon: RefreshCw, color: "text-cyan-400" },
          { label: "Upcoming Alerts", value: 3, icon: Bell, color: "text-purple-400" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Scheduled Tasks */}
        <div className="col-span-2 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="p-4 border-b border-slate-700/50">
            <h3 className="font-semibold text-white">Scheduled Tasks</h3>
          </div>
          <div className="divide-y divide-slate-700/50">
            {scheduledTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleJob(task.id)}
                    className={activeJobs.includes(task.id) ? "text-green-400" : "text-slate-500"}
                  >
                    {activeJobs.includes(task.id) ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </Button>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">{task.name}</p>
                      <Badge className={getTypeColor(task.type)}>{task.type}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {task.schedule}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Last: {task.lastRun}</p>
                  <p className="text-sm text-cyan-400">Next: {task.nextRun}</p>
                </div>
                <Button size="sm" variant="ghost" className="text-cyan-400">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Runs & Seasonal Alerts */}
        <div className="space-y-6">
          {/* Recent Runs */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
            <h3 className="font-semibold text-white mb-4">Recent Runs</h3>
            <div className="space-y-3">
              {recentRuns.map((run, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {run.status === "success" ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    )}
                    <div>
                      <p className="text-sm text-white">{run.task}</p>
                      <p className="text-xs text-slate-500">{run.time}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{run.duration}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Seasonal Alerts */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <h3 className="font-semibold text-purple-400 mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Seasonal Alerts
            </h3>
            <div className="space-y-3">
              {seasonalAlerts.map((alert, index) => (
                <motion.div
                  key={alert.event}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-slate-900/50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-white">{alert.event}</p>
                    <Badge className="bg-purple-500/20 text-purple-400">{alert.date}</Badge>
                  </div>
                  <p className="text-xs text-slate-400">{alert.action}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationScheduler;
