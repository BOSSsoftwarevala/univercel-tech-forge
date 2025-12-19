import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, BellRing, Volume2, VolumeX, Clock,
  User, AlertTriangle, CheckCircle, X, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LeadBuzzerAlert = () => {
  const [buzzerActive, setBuzzerActive] = useState(true);
  const [alerts, setAlerts] = useState([
    {
      id: "1",
      leadName: "Ahmed Hassan",
      software: "POS System",
      priority: "hot",
      waitTime: 14,
      assignedTo: null,
      escalationLevel: 0,
    },
    {
      id: "2",
      leadName: "Priya Sharma",
      software: "School Management",
      priority: "prime",
      waitTime: 45,
      assignedTo: null,
      escalationLevel: 1,
    },
    {
      id: "3",
      leadName: "Mohammed Al-Rashid",
      software: "Hospital ERP",
      priority: "high",
      waitTime: 120,
      assignedTo: null,
      escalationLevel: 2,
    },
  ]);

  // Simulate timer updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prev => prev.map(alert => ({
        ...alert,
        waitTime: alert.waitTime + 1,
        escalationLevel: alert.waitTime > 120 ? 2 : alert.waitTime > 60 ? 1 : 0,
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "prime": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "hot": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    }
  };

  const getEscalationStyle = (level: number) => {
    switch (level) {
      case 2: return "border-red-500 bg-red-500/10";
      case 1: return "border-orange-500 bg-orange-500/10";
      default: return "border-slate-700/50 bg-slate-900/50";
    }
  };

  const handleAccept = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header with Buzzer Control */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BellRing className="w-6 h-6 text-red-400" />
            Lead Buzzer Alerts
          </h2>
          <p className="text-slate-400">Mandatory acknowledgment system</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={buzzerActive ? "default" : "outline"}
            onClick={() => setBuzzerActive(!buzzerActive)}
            className={buzzerActive ? "bg-red-500 hover:bg-red-600" : "border-slate-600"}
          >
            {buzzerActive ? (
              <>
                <Volume2 className="w-4 h-4 mr-2" />
                Buzzer ON
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 mr-2" />
                Buzzer OFF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="space-y-4">
        <AnimatePresence>
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -50, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1,
                boxShadow: alert.escalationLevel > 0 
                  ? ["0 0 0 0 rgba(239,68,68,0)", "0 0 20px 5px rgba(239,68,68,0.3)", "0 0 0 0 rgba(239,68,68,0)"]
                  : "none"
              }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ 
                duration: 0.3,
                boxShadow: { duration: 1, repeat: Infinity }
              }}
              className={`p-4 rounded-xl border-2 ${getEscalationStyle(alert.escalationLevel)}`}
            >
              <div className="flex items-center gap-4">
                {/* Buzzer Animation */}
                <motion.div
                  animate={{ 
                    scale: buzzerActive && alert.escalationLevel > 0 ? [1, 1.2, 1] : 1,
                    rotate: buzzerActive && alert.escalationLevel > 0 ? [-5, 5, -5] : 0
                  }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                  className={`p-3 rounded-xl ${
                    alert.escalationLevel > 0 ? "bg-red-500/20" : "bg-indigo-500/20"
                  }`}
                >
                  {alert.escalationLevel > 0 ? (
                    <BellRing className="w-6 h-6 text-red-400" />
                  ) : (
                    <Bell className="w-6 h-6 text-indigo-400" />
                  )}
                </motion.div>

                {/* Lead Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white">{alert.leadName}</h4>
                    <Badge className={getPriorityStyle(alert.priority)}>
                      {alert.priority.toUpperCase()}
                    </Badge>
                    {alert.escalationLevel > 0 && (
                      <Badge className="bg-red-500/20 text-red-400">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Escalation Level {alert.escalationLevel}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{alert.software}</p>
                </div>

                {/* Wait Time */}
                <div className="text-center px-4">
                  <div className={`text-2xl font-bold ${
                    alert.waitTime > 120 ? "text-red-400" :
                    alert.waitTime > 60 ? "text-orange-400" : "text-green-400"
                  }`}>
                    {formatTime(alert.waitTime)}
                  </div>
                  <p className="text-xs text-slate-400">Waiting</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAccept(alert.id)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    I Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600"
                  >
                    Escalate
                  </Button>
                </div>
              </div>

              {/* Escalation Progress */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-slate-500">Escalation:</span>
                <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((alert.waitTime / 180) * 100, 100)}%` }}
                    className={`h-full rounded-full ${
                      alert.waitTime > 120 ? "bg-red-500" :
                      alert.waitTime > 60 ? "bg-orange-500" : "bg-green-500"
                    }`}
                  />
                </div>
                <span className="text-xs text-slate-500">
                  {alert.waitTime > 120 ? "Super Admin notified" :
                   alert.waitTime > 60 ? "Senior assigned" : "Normal queue"}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {alerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-700/50"
          >
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">All Clear!</h3>
            <p className="text-slate-400">No pending lead alerts at this time</p>
          </motion.div>
        )}
      </div>

      {/* Escalation Rules */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-400" />
          Escalation Rules
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <p className="text-green-400 font-medium">0-60 seconds</p>
            <p className="text-xs text-slate-400">Normal queue - buzzer active</p>
          </div>
          <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <p className="text-orange-400 font-medium">60-120 seconds</p>
            <p className="text-xs text-slate-400">Level 1 - Senior notified</p>
          </div>
          <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <p className="text-red-400 font-medium">120+ seconds</p>
            <p className="text-xs text-slate-400">Level 2 - Super Admin alert</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadBuzzerAlert;
