import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, Search, Filter, Sparkles, Bell, Settings,
  Activity, Globe, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LeadManagerTopBarProps {
  onAIClick: () => void;
}

const LeadManagerTopBar = ({ onAIClick }: LeadManagerTopBarProps) => {
  const [hasNotifications] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Leads" },
    { id: "new", label: "New" },
    { id: "contacted", label: "Contacted" },
    { id: "demo", label: "Demo Shown" },
    { id: "negotiation", label: "Negotiation" },
  ];

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-indigo-500/20 z-50 flex items-center justify-between px-6"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
              animate={{ boxShadow: ["0 0 0 0 rgba(99,102,241,0)", "0 0 20px 5px rgba(99,102,241,0.3)", "0 0 0 0 rgba(99,102,241,0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Users className="w-5 h-5 text-white" />
            </motion.div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Lead Manager</h1>
            <p className="text-xs text-indigo-400">Pipeline Control Center</p>
          </div>
        </motion.div>
      </div>

      {/* Center - Live Counters & Filters */}
      <div className="flex items-center gap-4">
        {/* Live Lead Counter */}
        <motion.div
          className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-xl border border-indigo-500/30"
          animate={{ boxShadow: ["0 0 0 0 rgba(99,102,241,0)", "0 0 15px 3px rgba(99,102,241,0.2)", "0 0 0 0 rgba(99,102,241,0)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Activity className="w-5 h-5 text-indigo-400" />
          <div>
            <p className="text-xs text-slate-400">Total Leads</p>
            <p className="text-lg font-bold text-white">2,847</p>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div>
            <p className="text-xs text-slate-400">Active</p>
            <p className="text-lg font-bold text-green-400">342</p>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {filters.slice(0, 3).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === filter.id
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50"
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
              <DropdownMenuItem>By Region</DropdownMenuItem>
              <DropdownMenuItem>By Source</DropdownMenuItem>
              <DropdownMenuItem>By Product</DropdownMenuItem>
              <DropdownMenuItem>By Assignee</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search leads..." 
            className="w-48 pl-9 bg-slate-800/50 border-slate-600 text-sm h-9"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <div className="text-right mr-2">
          <p className="text-sm font-medium text-white">vala(admin)***</p>
          <p className="text-xs text-indigo-400">Super Admin</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAIClick}
          className="p-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-500/30 hover:border-indigo-400/50 transition-colors"
        >
          <Sparkles className="w-5 h-5 text-indigo-400" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-indigo-500/30 transition-colors"
        >
          <Bell className="w-5 h-5 text-slate-400" />
          {hasNotifications && (
            <motion.span
              className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-indigo-500/30 transition-colors"
        >
          <Settings className="w-5 h-5 text-slate-400" />
        </motion.button>
      </div>
    </motion.header>
  );
};

export default LeadManagerTopBar;
