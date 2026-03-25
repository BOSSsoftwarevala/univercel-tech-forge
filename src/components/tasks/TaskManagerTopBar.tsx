import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CheckSquare, Search, Filter, Sparkles, Bell, Settings,
  Clock, Plus, ChevronDown, Timer, Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskManagerTopBarProps {
  onAIClick: () => void;
}

const TaskManagerTopBar = ({ onAIClick }: TaskManagerTopBarProps) => {
  const [hasNotifications] = useState(true);
  const { user } = useAuth();

  const userName = user?.email?.split('@')[0] || 'Task Manager';

  const filters = [
    { id: "all", label: "All Tasks" },
    { id: "my", label: "My Tasks" },
    { id: "urgent", label: "Urgent" },
    { id: "overdue", label: "Overdue" },
  ];

  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-violet-500/20 z-50 flex items-center justify-between px-6"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"
              animate={{ boxShadow: ["0 0 0 0 rgba(139,92,246,0)", "0 0 20px 5px rgba(139,92,246,0.3)", "0 0 0 0 rgba(139,92,246,0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CheckSquare className="w-5 h-5 text-white" />
            </motion.div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">Task Command Center</h1>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px] uppercase">
                Task Manager
              </Badge>
            </div>
            <p className="text-xs text-violet-400">
              Welcome back, <span className="text-purple-300 font-medium">{userName}</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Center - Counters & Filters */}
      <div className="flex items-center gap-4">
        {/* Task Counter */}
        <motion.div
          className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-xl border border-violet-500/30"
          animate={{ boxShadow: ["0 0 0 0 rgba(139,92,246,0)", "0 0 15px 3px rgba(139,92,246,0.2)", "0 0 0 0 rgba(139,92,246,0)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <CheckSquare className="w-5 h-5 text-violet-400" />
          <div>
            <p className="text-xs text-slate-400">Total Tasks</p>
            <p className="text-lg font-bold text-white">248</p>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div>
            <p className="text-xs text-slate-400">In Progress</p>
            <p className="text-lg font-bold text-blue-400">42</p>
          </div>
        </motion.div>

        {/* Active Timer */}
        <motion.div
          className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 rounded-lg border border-blue-500/30"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Timer className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-mono text-blue-400">02:34:15</span>
        </motion.div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === filter.id
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/50"
                  : "bg-slate-800/50 text-slate-400 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-400 h-8">
                <Filter className="w-3 h-3 mr-1" />
                More
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-700">
              <DropdownMenuItem>By Priority</DropdownMenuItem>
              <DropdownMenuItem>By Role</DropdownMenuItem>
              <DropdownMenuItem>By Date</DropdownMenuItem>
              <DropdownMenuItem>By Assignee</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search tasks..." 
            className="w-48 pl-9 bg-slate-800/50 border-slate-600 text-sm h-9"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <Button className="bg-gradient-to-r from-violet-500 to-purple-600 text-sm h-9">
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAIClick}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-lg border border-violet-500/30 hover:border-violet-400/50 transition-colors"
        >
          <Bot className="w-4 h-4 text-violet-400" />
          <span className="text-xs text-violet-300 font-medium">AI Assistant</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-violet-500/30 transition-colors"
        >
          <Bell className="w-5 h-5 text-slate-400" />
          {hasNotifications && (
            <motion.span
              className="absolute -top-1 -right-1 w-3 h-3 bg-violet-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.button>
      </div>
    </motion.header>
  );
};

export default TaskManagerTopBar;
