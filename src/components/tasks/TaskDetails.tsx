import { useState } from "react";
import { motion } from "framer-motion";
import { 
  X, Clock, User, Calendar, Play, Pause, Check,
  FileText, Link2, MessageSquare, AlertTriangle,
  Timer, Target, Send, CheckCircle, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Task } from "@/pages/TaskManager";

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
}

const TaskDetails = ({ task, onClose }: TaskDetailsProps) => {
  const [newNote, setNewNote] = useState("");
  const [timerActive, setTimerActive] = useState(task.timerStarted);
  const [promiseHours, setPromiseHours] = useState("");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-400 bg-red-500/20";
      case "high": return "text-orange-400 bg-orange-500/20";
      case "medium": return "text-yellow-400 bg-yellow-500/20";
      default: return "text-green-400 bg-green-500/20";
    }
  };

  const quickActions = [
    { icon: Link2, label: "Send Demo Link", color: "from-blue-500 to-cyan-500" },
    { icon: FileText, label: "Send Quote", color: "from-purple-500 to-pink-500" },
    { icon: Calendar, label: "Schedule Call", color: "from-green-500 to-emerald-500" },
    { icon: AlertTriangle, label: "Escalate", color: "from-orange-500 to-amber-500" },
    { icon: Clock, label: "Mark Follow-up", color: "from-violet-500 to-purple-500" },
  ];

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-[500px] bg-slate-900/95 backdrop-blur-xl border-l border-violet-500/20 z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl ${getPriorityColor(task.priority)} flex items-center justify-center`}>
            <Target className="w-6 h-6" />
          </div>
          <div>
            <Badge className={`mb-1 ${getPriorityColor(task.priority)}`}>
              {task.priority} priority
            </Badge>
            <h3 className="font-semibold text-white">{task.title}</h3>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5 text-slate-400" />
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Timer & Promise Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            timerActive 
              ? "bg-blue-500/10 border-blue-500/30" 
              : "bg-slate-800/50 border-slate-700/50"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Timer className={`w-5 h-5 ${timerActive ? "text-blue-400" : "text-slate-400"}`} />
              <span className="font-medium text-white">Task Timer</span>
            </div>
            {timerActive && (
              <motion.span
                className="text-2xl font-mono text-blue-400"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                02:34:15
              </motion.span>
            )}
          </div>

          {!timerActive && !task.promisedDelivery && (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">Promise delivery time to start timer:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promiseHours}
                  onChange={(e) => setPromiseHours(e.target.value)}
                  placeholder="e.g., 6 hours"
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white"
                />
                <Button 
                  onClick={() => setTimerActive(true)}
                  className="bg-gradient-to-r from-violet-500 to-purple-600"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Accept & Start
                </Button>
              </div>
            </div>
          )}

          {task.promisedDelivery && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Promised: {task.promisedDelivery}</span>
              <span className="text-emerald-400">On track</span>
            </div>
          )}

          {timerActive && (
            <div className="mt-3 p-2 bg-slate-800/50 rounded-lg">
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Timer cannot be stopped manually. Contact supervisor for pause.
              </p>
            </div>
          )}
        </motion.div>

        {/* Description */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-white mb-2">Description</h4>
          <p className="text-sm text-slate-300">{task.description}</p>
        </div>

        {/* Task Info */}
        <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
          <h4 className="text-sm font-semibold text-white mb-3">Task Information</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400">Created By</p>
              <p className="text-sm text-white">{task.createdBy}</p>
              <Badge variant="outline" className="text-xs mt-1">{task.createdByRole}</Badge>
            </div>
            <div>
              <p className="text-xs text-slate-400">Assigned To</p>
              <p className="text-sm text-white">{task.assignedTo}</p>
              <Badge variant="outline" className="text-xs mt-1">{task.assignedRole}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400">Expected Delivery</p>
              <p className="text-sm text-white">{task.expectedDelivery}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Estimated Time</p>
              <p className="text-sm text-white">{task.estimatedHours} hours</p>
            </div>
          </div>

          {task.billable && (
            <div className="pt-3 border-t border-slate-700/50">
              <p className="text-xs text-slate-400">Billable Amount</p>
              <p className="text-lg font-bold text-emerald-400">${task.cost}</p>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-white">Progress</h4>
            <span className="text-sm font-bold text-violet-400">{task.progress}%</span>
          </div>
          <Progress value={task.progress} className="h-2" />
        </div>

        {/* Subtasks */}
        {task.subtasks.length > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-white mb-3">Subtasks</h4>
            <div className="space-y-2">
              {task.subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    subtask.completed ? "bg-green-500/10" : "bg-slate-900/50"
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                    subtask.completed 
                      ? "bg-green-500 border-green-500" 
                      : "border-slate-600"
                  }`}>
                    {subtask.completed && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm ${subtask.completed ? "text-slate-400 line-through" : "text-white"}`}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 bg-gradient-to-r ${action.color} bg-opacity-10 rounded-xl border border-white/10 flex items-center gap-2 text-white text-sm font-medium hover:border-white/20 transition-all`}
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Notes Thread */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-violet-400" />
            Internal Notes
          </h4>
          <div className="space-y-3 mb-3">
            {task.notes.map((note, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-slate-900/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-violet-400">{note.sender}</span>
                  <span className="text-xs text-slate-500">{note.time}</span>
                </div>
                <p className="text-sm text-slate-300">{note.message}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex gap-2">
            <Textarea 
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              className="bg-slate-900/50 border-slate-600 resize-none text-sm"
              rows={2}
            />
            <Button size="sm" className="bg-violet-500 hover:bg-violet-600 px-3">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50 flex gap-2">
        <Button className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600">
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark Complete
        </Button>
        <Button variant="outline" className="flex-1 border-slate-600">
          Update Progress
        </Button>
      </div>
    </motion.div>
  );
};

export default TaskDetails;
