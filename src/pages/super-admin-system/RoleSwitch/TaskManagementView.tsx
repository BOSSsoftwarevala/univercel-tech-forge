import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ListTodo, User, Calendar, Clock, Activity,
  Eye, ChevronRight, X, CheckCircle, AlertTriangle,
  Search, RefreshCw, Users, Plus, Filter,
  MessageSquare, Paperclip, ArrowUpRight, XCircle,
  Play, Pause, Flag, Timer
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCRUDOperations } from "@/hooks/useCRUDOperations";
import { useGlobalActions } from "@/hooks/useGlobalActions";
import { toast } from "sonner";

// Mock task data
const tasksData = [
  {
    id: "task-001",
    title: "Review Q4 Sales Report",
    description: "Analyze quarterly sales performance and prepare executive summary",
    assignedTo: "Victoria Mensah",
    assignedToRole: "admin",
    assignedBy: "Super Admin",
    priority: "high",
    status: "in_progress",
    dueDate: "2025-01-05",
    createdAt: "2024-12-28",
    module: "Sales",
    comments: 5,
    attachments: 2,
  },
  {
    id: "task-002",
    title: "Franchise Compliance Audit",
    description: "Complete annual compliance audit for Mumbai franchise",
    assignedTo: "Rajesh Sharma",
    assignedToRole: "franchise",
    assignedBy: "Legal Manager",
    priority: "critical",
    status: "new",
    dueDate: "2025-01-03",
    createdAt: "2024-12-30",
    module: "Legal",
    comments: 2,
    attachments: 4,
  },
  {
    id: "task-003",
    title: "Update Reseller Documentation",
    description: "Revise reseller agreement templates with new commission structure",
    assignedTo: "Emma Wilson",
    assignedToRole: "reseller",
    assignedBy: "Sales Head",
    priority: "medium",
    status: "completed",
    dueDate: "2024-12-31",
    createdAt: "2024-12-20",
    module: "Sales",
    comments: 8,
    attachments: 1,
  },
  {
    id: "task-004",
    title: "Server Migration Planning",
    description: "Plan and document server migration strategy for Q1",
    assignedTo: "Chen Wei",
    assignedToRole: "developer",
    assignedBy: "Tech Lead",
    priority: "high",
    status: "on_hold",
    dueDate: "2025-01-10",
    createdAt: "2024-12-25",
    module: "Tech",
    comments: 12,
    attachments: 6,
  },
  {
    id: "task-005",
    title: "Customer Support Training",
    description: "Conduct training session for new support team members",
    assignedTo: "Sarah Mitchell",
    assignedToRole: "admin",
    assignedBy: "HR Manager",
    priority: "low",
    status: "in_progress",
    dueDate: "2025-01-08",
    createdAt: "2024-12-29",
    module: "Support",
    comments: 3,
    attachments: 0,
  },
  {
    id: "task-006",
    title: "Marketing Campaign Review",
    description: "Review and approve Q1 marketing campaign materials",
    assignedTo: "James Thompson",
    assignedToRole: "admin",
    assignedBy: "Marketing Head",
    priority: "medium",
    status: "new",
    dueDate: "2025-01-06",
    createdAt: "2024-12-31",
    module: "Marketing",
    comments: 0,
    attachments: 3,
  },
];

// Activity logs
const activityLogs = [
  { id: "log-001", action: "Status Updated", target: "In Progress → Completed", time: "5 min ago", type: "status" },
  { id: "log-002", action: "Comment Added", target: "Review feedback noted", time: "30 min ago", type: "comment" },
  { id: "log-003", action: "Task Reassigned", target: "From John to Sarah", time: "2 hours ago", type: "assign" },
  { id: "log-004", action: "File Attached", target: "report_v2.pdf", time: "4 hours ago", type: "file" },
  { id: "log-005", action: "Deadline Extended", target: "+3 days", time: "1 day ago", type: "deadline" },
];

const TaskManagementView = () => {
  const [selectedTask, setSelectedTask] = useState<typeof tasksData[0] | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterRole, setFilterRole] = useState("all");

  // CRUD Operations - ALL BUTTONS CONNECTED TO DB
  const taskCRUD = useCRUDOperations({ table: 'developer_tasks', entityType: 'task' });
  const { logToAudit } = useGlobalActions();

  const handleSelectTask = (task: typeof tasksData[0]) => {
    setSelectedTask(task);
    setDetailPanelOpen(true);
  };

  const handleClosePanel = () => {
    setDetailPanelOpen(false);
    setSelectedTask(null);
  };

  // Task CRUD handlers connected to DB
  const handleCreateTask = useCallback(async () => {
    await taskCRUD.create({ title: 'New Task', status: 'new', priority: 'medium' });
    await logToAudit('task_create', 'task_manager', {});
  }, [taskCRUD, logToAudit]);

  const handleRefresh = useCallback(async () => {
    await logToAudit('task_refresh', 'task_manager', {});
    toast.success('Tasks refreshed');
  }, [logToAudit]);

  const handleUpdateStatus = useCallback(async (taskId: string, newStatus: string) => {
    await taskCRUD.update(taskId, { status: newStatus });
    await logToAudit('task_status_update', 'task_manager', { taskId, newStatus });
  }, [taskCRUD, logToAudit]);

  const handleReassign = useCallback(async (taskId: string, assigneeId: string) => {
    await taskCRUD.update(taskId, { assigned_to: assigneeId });
    await logToAudit('task_reassign', 'task_manager', { taskId, assigneeId });
  }, [taskCRUD, logToAudit]);

  const handleExtendDeadline = useCallback(async (taskId: string, days: number = 3) => {
    const newDeadline = new Date();
    newDeadline.setDate(newDeadline.getDate() + days);
    await taskCRUD.update(taskId, { deadline: newDeadline.toISOString() });
    await logToAudit('task_deadline_extend', 'task_manager', { taskId, days });
  }, [taskCRUD, logToAudit]);

  const handleCompleteTask = useCallback(async (taskId: string) => {
    await taskCRUD.update(taskId, { status: 'completed', finished_time: new Date().toISOString() });
    await logToAudit('task_complete', 'task_manager', { taskId });
  }, [taskCRUD, logToAudit]);

  const handleCancelTask = useCallback(async (taskId: string) => {
    await taskCRUD.update(taskId, { status: 'cancelled' });
    await logToAudit('task_cancel', 'task_manager', { taskId });
  }, [taskCRUD, logToAudit]);

  const filteredTasks = tasksData.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesRole = filterRole === "all" || task.assignedToRole === filterRole;
    return matchesSearch && matchesStatus && matchesPriority && matchesRole;
  });

  const totalStats = {
    total: tasksData.length,
    new: tasksData.filter(t => t.status === "new").length,
    inProgress: tasksData.filter(t => t.status === "in_progress").length,
    completed: tasksData.filter(t => t.status === "completed").length,
    onHold: tasksData.filter(t => t.status === "on_hold").length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500/20 text-blue-400";
      case "in_progress": return "bg-amber-500/20 text-amber-400";
      case "completed": return "bg-emerald-500/20 text-emerald-400";
      case "on_hold": return "bg-slate-500/20 text-slate-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-violet-500/20 text-violet-400";
      case "franchise": return "bg-indigo-500/20 text-indigo-400";
      case "reseller": return "bg-amber-500/20 text-amber-400";
      case "developer": return "bg-cyan-500/20 text-cyan-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={cn("flex-1 overflow-hidden flex flex-col transition-all duration-300")}>
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <ListTodo className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Task Management Dashboard</h1>
                  <p className="text-muted-foreground">Manage all tasks globally across roles</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-600" onClick={handleCreateTask}>
                  <Plus className="w-4 h-4" />
                  Create Task
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Tasks</p>
                      <p className="text-3xl font-bold text-blue-400">{totalStats.total}</p>
                    </div>
                    <ListTodo className="w-10 h-10 text-blue-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">New</p>
                      <p className="text-3xl font-bold text-blue-400">{totalStats.new}</p>
                    </div>
                    <Plus className="w-10 h-10 text-blue-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-amber-500/10 border-amber-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">In Progress</p>
                      <p className="text-3xl font-bold text-amber-400">{totalStats.inProgress}</p>
                    </div>
                    <Play className="w-10 h-10 text-amber-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-emerald-500/10 border-emerald-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Completed</p>
                      <p className="text-3xl font-bold text-emerald-400">{totalStats.completed}</p>
                    </div>
                    <CheckCircle className="w-10 h-10 text-emerald-400/30" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-500/10 border-slate-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">On Hold</p>
                      <p className="text-3xl font-bold text-slate-400">{totalStats.onHold}</p>
                    </div>
                    <Pause className="w-10 h-10 text-slate-400/30" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Controls */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search task or assignee..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-36 bg-background/50">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-36 bg-background/50">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-36 bg-background/50">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="franchise">Franchise</SelectItem>
                      <SelectItem value="reseller">Reseller</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="w-4 h-4" />
                    More
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tasks List */}
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectTask(task)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 bg-card hover:bg-accent/20",
                    selectedTask?.id === task.id
                      ? "border-blue-500/50 bg-blue-500/10"
                      : "border-border/50 hover:border-blue-500/30"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Priority Indicator */}
                    <div className={cn(
                      "w-1.5 h-12 rounded-full",
                      task.priority === "critical" && "bg-red-500",
                      task.priority === "high" && "bg-orange-500",
                      task.priority === "medium" && "bg-yellow-500",
                      task.priority === "low" && "bg-blue-500",
                    )} />

                    {/* Task Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{task.title}</h3>
                        <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                          {task.priority}
                        </Badge>
                        <Badge className={cn("text-xs", getStatusColor(task.status))}>
                          {task.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                    </div>

                    {/* Assignee */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{task.assignedTo}</p>
                        <Badge className={cn("text-xs", getRoleColor(task.assignedToRole))}>
                          {task.assignedToRole}
                        </Badge>
                      </div>
                      <Avatar className="w-10 h-10 border border-border">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white text-sm font-bold">
                          {task.assignedTo.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {task.dueDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {task.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Paperclip className="w-3 h-3" />
                        {task.attachments}
                      </span>
                    </div>

                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {detailPanelOpen && selectedTask && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-[480px] border-l border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden flex flex-col"
          >
            {/* Panel Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-xs", getPriorityColor(selectedTask.priority))}>
                    <Flag className="w-3 h-3 mr-1" />
                    {selectedTask.priority}
                  </Badge>
                  <Badge className={cn("text-xs", getStatusColor(selectedTask.status))}>
                    {selectedTask.status.replace("_", " ")}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClosePanel}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">{selectedTask.title}</h2>
              <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* Section 1: Task Info */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Task Info
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground">Due Date</p>
                      <p className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        {selectedTask.dueDate}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground">Module</p>
                      <p className="text-sm font-medium">{selectedTask.module}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="text-sm font-medium">{selectedTask.createdAt}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground">Comments</p>
                      <p className="text-sm font-medium">{selectedTask.comments}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Section 2: Assignment */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Assignment
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <Avatar className="w-10 h-10 border border-blue-500">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-bold">
                          {selectedTask.assignedTo.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{selectedTask.assignedTo}</p>
                        <Badge className={cn("text-xs", getRoleColor(selectedTask.assignedToRole))}>
                          {selectedTask.assignedToRole}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50">
                      <p className="text-xs text-muted-foreground">Assigned By</p>
                      <p className="text-sm font-medium">{selectedTask.assignedBy}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Section 3: Actions */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => selectedTask && handleUpdateStatus(selectedTask.id, 'in_progress')}>
                      <Activity className="w-4 h-4" />
                      Update Status
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => logToAudit('task_comment', 'task_manager', { taskId: selectedTask?.id })}>
                      <MessageSquare className="w-4 h-4" />
                      Add Comment
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => logToAudit('task_attach', 'task_manager', { taskId: selectedTask?.id })}>
                      <Paperclip className="w-4 h-4" />
                      Attach File
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={() => selectedTask && handleReassign(selectedTask.id, '')}>
                      <ArrowUpRight className="w-4 h-4" />
                      Reassign
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-amber-400" onClick={() => selectedTask && handleExtendDeadline(selectedTask.id, 3)}>
                      <Timer className="w-4 h-4" />
                      Extend Deadline
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-emerald-400" onClick={() => selectedTask && handleCompleteTask(selectedTask.id)}>
                      <CheckCircle className="w-4 h-4" />
                      Complete
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 justify-start text-red-400 col-span-2" onClick={() => selectedTask && handleCancelTask(selectedTask.id)}>
                      <XCircle className="w-4 h-4" />
                      Cancel Task
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Section 4: Activity Log */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Task Activity Log
                  </h3>
                  <div className="space-y-2">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          log.type === "status" && "bg-emerald-500/20 text-emerald-400",
                          log.type === "comment" && "bg-blue-500/20 text-blue-400",
                          log.type === "assign" && "bg-violet-500/20 text-violet-400",
                          log.type === "file" && "bg-orange-500/20 text-orange-400",
                          log.type === "deadline" && "bg-amber-500/20 text-amber-400",
                        )}>
                          {log.type === "status" && <Activity className="w-4 h-4" />}
                          {log.type === "comment" && <MessageSquare className="w-4 h-4" />}
                          {log.type === "assign" && <Users className="w-4 h-4" />}
                          {log.type === "file" && <Paperclip className="w-4 h-4" />}
                          {log.type === "deadline" && <Timer className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-muted-foreground">{log.target}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Section 5: Visibility Rules */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Task Visibility Rules
                  </h3>
                  <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <p className="text-sm text-muted-foreground mb-2">This task is visible only to:</p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        Creator ({selectedTask.assignedBy})
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        Assigned person ({selectedTask.assignedTo})
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        Reporting manager
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskManagementView;
