import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Phone,
  Mail,
  Video,
  User,
  Bell,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tasks = [
  {
    id: 1,
    title: "Call Rajesh Mehta - Follow up on proposal",
    type: "call",
    priority: "high",
    dueDate: "Today, 2:00 PM",
    customer: "Tech Solutions Pvt Ltd",
    completed: false,
    overdue: false
  },
  {
    id: 2,
    title: "Send revised quotation to Anita",
    type: "email",
    priority: "high",
    dueDate: "Today, 4:00 PM",
    customer: "Digital Dreams Agency",
    completed: false,
    overdue: false
  },
  {
    id: 3,
    title: "Product demo with StartUp Hub",
    type: "meeting",
    priority: "medium",
    dueDate: "Tomorrow, 11:00 AM",
    customer: "StartUp Hub India",
    completed: false,
    overdue: false
  },
  {
    id: 4,
    title: "Contract review call",
    type: "call",
    priority: "low",
    dueDate: "Jan 18, 10:00 AM",
    customer: "Green Energy Corp",
    completed: false,
    overdue: false
  },
  {
    id: 5,
    title: "Send payment reminder",
    type: "email",
    priority: "high",
    dueDate: "Yesterday",
    customer: "Metro Industries",
    completed: false,
    overdue: true
  },
  {
    id: 6,
    title: "Initial discovery call completed",
    type: "call",
    priority: "medium",
    dueDate: "Jan 12",
    customer: "Alpha Corp",
    completed: true,
    overdue: false
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "call": return Phone;
    case "email": return Mail;
    case "meeting": return Video;
    default: return Circle;
  }
};

const TasksFollowups = () => {
  const [filter, setFilter] = useState("all");
  const [taskList, setTaskList] = useState(tasks);

  const toggleTask = (taskId: number) => {
    setTaskList(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = taskList.filter(task => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    if (filter === "overdue") return task.overdue && !task.completed;
    return true;
  });

  const todayTasks = filteredTasks.filter(t => t.dueDate.includes("Today") && !t.completed);
  const overdueTasks = filteredTasks.filter(t => t.overdue && !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tasks & Follow-ups</h1>
          <p className="text-slate-500 mt-1">Stay on top of your activities</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-500 hover:bg-blue-600" size="lg">
              <Plus className="w-5 h-5" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Task Title</Label>
                <Input placeholder="Enter task description" className="mt-1" />
              </div>
              <div>
                <Label>Type</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Phone Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="task">General Task</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Customer</Label>
                <Input placeholder="Select customer" className="mt-1" />
              </div>
              <div>
                <Label>Due Date & Time</Label>
                <Input type="datetime-local" className="mt-1" />
              </div>
              <div>
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-blue-500 hover:bg-blue-600" size="lg">
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 cursor-pointer hover:shadow-md" onClick={() => setFilter("all")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Circle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{taskList.length}</p>
                <p className="text-sm text-slate-500">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 cursor-pointer hover:shadow-md" onClick={() => setFilter("pending")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{todayTasks.length}</p>
                <p className="text-sm text-slate-500">Due Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 cursor-pointer hover:shadow-md" onClick={() => setFilter("overdue")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{overdueTasks.length}</p>
                <p className="text-sm text-slate-500">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 cursor-pointer hover:shadow-md" onClick={() => setFilter("completed")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{completedTasks.length}</p>
                <p className="text-sm text-slate-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reminder Alert */}
      {todayTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
        >
          <div className="p-3 rounded-full bg-blue-500">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-800">You have {todayTasks.length} tasks due today</p>
            <p className="text-sm text-slate-600">Don't forget to complete your pending follow-ups</p>
          </div>
          <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
            View All
          </Button>
        </motion.div>
      )}

      {/* Task List */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-800">
              {filter === "all" ? "All Tasks" : 
               filter === "pending" ? "Pending Tasks" :
               filter === "completed" ? "Completed Tasks" : "Overdue Tasks"}
            </CardTitle>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTasks.map((task, index) => {
              const TypeIcon = getTypeIcon(task.type);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    task.completed 
                      ? 'bg-slate-50 opacity-60' 
                      : task.overdue 
                      ? 'bg-red-50 border border-red-200' 
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <Checkbox 
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="w-5 h-5"
                  />

                  <div className={`p-2 rounded-lg ${
                    task.type === 'call' ? 'bg-green-100' :
                    task.type === 'email' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    <TypeIcon className={`w-4 h-4 ${
                      task.type === 'call' ? 'text-green-600' :
                      task.type === 'email' ? 'text-blue-600' : 'text-purple-600'
                    }`} />
                  </div>

                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {task.customer}
                      </span>
                    </div>
                  </div>

                  <Badge className={`${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {task.priority}
                  </Badge>

                  <div className={`flex items-center gap-2 text-sm ${
                    task.overdue && !task.completed ? 'text-red-600 font-medium' : 'text-slate-500'
                  }`}>
                    <Calendar className="w-4 h-4" />
                    {task.dueDate}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksFollowups;
