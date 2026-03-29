import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Clock, User, AlertTriangle, Timer, 
  MoreHorizontal, Play, Pause, CheckCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/pages/TaskManager";

interface TaskPipelineProps {
  onSelectTask: (task: Task) => void;
  selectedTask: Task | null;
}

const TaskPipeline = ({ onSelectTask, selectedTask }: TaskPipelineProps) => {
  const columns = [
    { id: "new", label: "NEW", color: "from-blue-500 to-cyan-500", count: 12 },
    { id: "in_progress", label: "IN PROGRESS", color: "from-violet-500 to-purple-500", count: 8 },
    { id: "ai_review", label: "AI REVIEW", color: "from-pink-500 to-rose-500", count: 3 },
    { id: "waiting_client", label: "WAITING CLIENT", color: "from-amber-500 to-orange-500", count: 5 },
    { id: "testing", label: "TESTING", color: "from-teal-500 to-emerald-500", count: 4 },
    { id: "completed", label: "COMPLETED", color: "from-green-500 to-emerald-500", count: 42 },
    { id: "on_hold", label: "ON HOLD", color: "from-slate-500 to-gray-500", count: 6 },
    { id: "cancelled", label: "CANCELLED", color: "from-red-500 to-rose-500", count: 2 },
  ];

  const [tasks] = useState<Task[]>([
    {
      id: "1",
      title: "POS Module Enhancement",
      description: "Add multi-currency support to the POS module for African markets",
      status: "new",
      priority: "high",
      createdBy: "vala(sales)4771",
      createdByRole: "Sales",
      assignedTo: "vala(dev)4412",
      assignedRole: "Developer",
      expectedDelivery: "2024-01-20",
      estimatedHours: 6,
      actualHours: 0,
      timerStarted: false,
      timerStartTime: null,
      promisedDelivery: null,
      notes: [{ sender: "vala(sales)4771", message: "Client needs this urgently", time: "1 hour ago" }],
      attachments: [],
      subtasks: [
        { id: "s1", title: "Database schema update", completed: false },
        { id: "s2", title: "API endpoints", completed: false },
      ],
      billable: true,
      cost: 450,
      createdAt: "2024-01-15",
      progress: 0,
    },
    {
      id: "2",
      title: "Hospital Dashboard Bug Fix",
      description: "Fix chart rendering issue in patient analytics dashboard",
      status: "in_progress",
      priority: "critical",
      createdBy: "vala(support)2341",
      createdByRole: "Support",
      assignedTo: "vala(dev)7823",
      assignedRole: "Developer",
      expectedDelivery: "2024-01-18",
      estimatedHours: 4,
      actualHours: 2.5,
      timerStarted: true,
      timerStartTime: "2024-01-16T10:30:00",
      promisedDelivery: "4 hours",
      notes: [],
      attachments: [{ name: "screenshot.png", type: "image", url: "#" }],
      subtasks: [],
      billable: true,
      cost: 280,
      createdAt: "2024-01-14",
      progress: 65,
    },
    {
      id: "3",
      title: "School ERP API Integration",
      description: "Integrate with government education portal API",
      status: "ai_review",
      priority: "medium",
      createdBy: "vala(franchise)2891",
      createdByRole: "Franchise",
      assignedTo: "vala(dev)4412",
      assignedRole: "Developer",
      expectedDelivery: "2024-01-22",
      estimatedHours: 12,
      actualHours: 10,
      timerStarted: false,
      timerStartTime: null,
      promisedDelivery: "12 hours",
      notes: [],
      attachments: [],
      subtasks: [],
      billable: true,
      cost: 890,
      createdAt: "2024-01-12",
      progress: 85,
    },
    {
      id: "4",
      title: "Client Feedback Review",
      description: "Review and implement feedback from ABC Corp demo",
      status: "waiting_client",
      priority: "medium",
      createdBy: "vala(cs)1234",
      createdByRole: "Client Success",
      assignedTo: "vala(sales)4771",
      assignedRole: "Sales",
      expectedDelivery: "2024-01-19",
      estimatedHours: 2,
      actualHours: 1,
      timerStarted: false,
      timerStartTime: null,
      promisedDelivery: null,
      notes: [],
      attachments: [],
      subtasks: [],
      billable: false,
      cost: 0,
      createdAt: "2024-01-13",
      progress: 50,
    },
    {
      id: "5",
      title: "Mobile App Testing",
      description: "Test POS mobile app on various Android devices",
      status: "testing",
      priority: "high",
      createdBy: "vala(dev)7823",
      createdByRole: "Developer",
      assignedTo: "vala(qa)5678",
      assignedRole: "QA",
      expectedDelivery: "2024-01-17",
      estimatedHours: 8,
      actualHours: 6,
      timerStarted: true,
      timerStartTime: "2024-01-16T08:00:00",
      promisedDelivery: "8 hours",
      notes: [],
      attachments: [],
      subtasks: [],
      billable: true,
      cost: 320,
      createdAt: "2024-01-11",
      progress: 75,
    },
  ]);

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "critical":
        return { badge: "bg-red-500/20 text-red-400 border-red-500/50", glow: "shadow-red-500/20" };
      case "high":
        return { badge: "bg-orange-500/20 text-orange-400 border-orange-500/50", glow: "shadow-orange-500/20" };
      case "medium":
        return { badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50", glow: "shadow-yellow-500/20" };
      default:
        return { badge: "bg-green-500/20 text-green-400 border-green-500/50", glow: "" };
    }
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Task Pipeline</h2>
          <p className="text-slate-400">Drag and drop to update task status</p>
        </div>
      </div>

      {/* Pipeline Columns */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {columns.map((column, colIndex) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: colIndex * 0.05 }}
            className="flex-shrink-0 w-64"
          >
            {/* Column Header */}
            <div className={`p-3 rounded-t-xl bg-gradient-to-r ${column.color} flex items-center justify-between`}>
              <span className="text-xs font-bold text-white tracking-wide">{column.label}</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium text-white">
                {column.count}
              </span>
            </div>

            {/* Column Body */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-b-xl border border-slate-700/50 border-t-0 p-2 min-h-[450px] space-y-2">
              {getTasksByStatus(column.id).map((task, index) => {
                const priorityStyle = getPriorityStyle(task.priority);
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    onClick={() => onSelectTask(task)}
                    className={`p-3 bg-slate-900/70 backdrop-blur-sm rounded-xl border cursor-pointer transition-all ${
                      selectedTask?.id === task.id 
                        ? "border-violet-500 shadow-lg shadow-violet-500/20" 
                        : `border-slate-700/50 hover:border-violet-500/50 ${task.priority === "critical" || task.priority === "high" ? `shadow-lg ${priorityStyle.glow}` : ""}`
                    }`}
                  >
                    {/* Priority & Timer */}
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`text-xs ${priorityStyle.badge}`}>
                        {task.priority}
                      </Badge>
                      {task.timerStarted && (
                        <motion.div
                          className="flex items-center gap-1 text-xs text-blue-400"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Timer className="w-3 h-3" />
                          <span className="font-mono">02:34</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-medium text-white text-sm mb-2 line-clamp-2">{task.title}</h4>

                    {/* Progress */}
                    {task.progress > 0 && (
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${task.progress}%` }}
                            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                          />
                        </div>
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <User className="w-3 h-3" />
                        <span className="truncate">{task.assignedTo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{task.estimatedHours}h estimated</span>
                      </div>
                    </div>

                    {/* Billable Tag */}
                    {task.billable && (
                      <div className="mt-2 pt-2 border-t border-slate-700/50">
                        <span className="text-xs text-emerald-400">${task.cost} billable</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Add Card */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="w-full p-3 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 hover:text-violet-400 hover:border-violet-500/50 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TaskPipeline;
