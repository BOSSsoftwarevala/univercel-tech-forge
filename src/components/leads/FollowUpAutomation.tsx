import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Clock, Mail, MessageSquare, Bell, Calendar,
  Send, AlertTriangle, CheckCircle, Sparkles, Timer
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const FollowUpAutomation = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "overdue" | "today" | "scheduled">("all");

  const followUps = [
    {
      id: "1",
      leadName: "Ahmed Hassan",
      software: "POS System",
      type: "email",
      scheduledFor: "Overdue - 2 hours",
      status: "overdue",
      aiSuggestion: "Send pricing follow-up with 10% discount offer",
      lastContact: "3 days ago",
    },
    {
      id: "2",
      leadName: "Priya Sharma",
      software: "School Management",
      type: "call",
      scheduledFor: "Today at 3:00 PM",
      status: "today",
      aiSuggestion: "Demo confirmation call - prepare case studies",
      lastContact: "Yesterday",
    },
    {
      id: "3",
      leadName: "Mohammed Al-Rashid",
      software: "Hospital ERP",
      type: "sms",
      scheduledFor: "Tomorrow at 10:00 AM",
      status: "scheduled",
      aiSuggestion: "Send integration documentation link",
      lastContact: "4 days ago",
    },
    {
      id: "4",
      leadName: "Sarah Chen",
      software: "Inventory System",
      type: "email",
      scheduledFor: "In 2 days",
      status: "scheduled",
      aiSuggestion: "Proposal follow-up with testimonials",
      lastContact: "1 week ago",
    },
  ];

  const automationStats = [
    { label: "Scheduled Follow-ups", value: 47, icon: Calendar },
    { label: "Overdue Actions", value: 8, icon: AlertTriangle },
    { label: "Completed Today", value: 23, icon: CheckCircle },
    { label: "AI Generated", value: 34, icon: Sparkles },
  ];

  const filteredFollowUps = followUps.filter(f => 
    activeFilter === "all" || f.status === activeFilter
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email": return Mail;
      case "call": return Bell;
      case "sms": return MessageSquare;
      default: return Send;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "overdue": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "today": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "scheduled": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Timer className="w-6 h-6 text-indigo-400" />
            Follow-up Automation
          </h2>
          <p className="text-slate-400">AI-powered reminders and automated outreach</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule New
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {automationStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border ${
              stat.label === "Overdue Actions" && stat.value > 0
                ? "border-red-500/50"
                : "border-slate-700/50"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${
                stat.label === "Overdue Actions" ? "text-red-400" : "text-indigo-400"
              }`} />
            </div>
            <p className={`text-2xl font-bold ${
              stat.label === "Overdue Actions" && stat.value > 0 ? "text-red-400" : "text-white"
            }`}>
              {stat.value}
            </p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { id: "all", label: "All" },
          { id: "overdue", label: "Overdue" },
          { id: "today", label: "Today" },
          { id: "scheduled", label: "Scheduled" },
        ].map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveFilter(filter.id as any)}
            className={activeFilter === filter.id ? "bg-indigo-500" : ""}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Follow-up List */}
      <div className="space-y-4">
        {filteredFollowUps.map((followUp, index) => {
          const TypeIcon = getTypeIcon(followUp.type);
          
          return (
            <motion.div
              key={followUp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-slate-900/50 backdrop-blur-sm rounded-xl border p-4 ${
                followUp.status === "overdue" ? "border-red-500/50" : "border-slate-700/50"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Type Icon */}
                <div className={`p-3 rounded-xl ${
                  followUp.status === "overdue" ? "bg-red-500/20" : "bg-indigo-500/20"
                }`}>
                  <TypeIcon className={`w-5 h-5 ${
                    followUp.status === "overdue" ? "text-red-400" : "text-indigo-400"
                  }`} />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white">{followUp.leadName}</h4>
                    <Badge className={getStatusStyle(followUp.status)}>
                      <Clock className="w-3 h-3 mr-1" />
                      {followUp.scheduledFor}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{followUp.software}</p>
                  
                  {/* AI Suggestion */}
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5" />
                    <div>
                      <span className="text-xs text-indigo-400 font-medium">AI Suggestion:</span>
                      <p className="text-sm text-white">{followUp.aiSuggestion}</p>
                    </div>
                  </div>
                </div>

                {/* Last Contact */}
                <div className="text-right text-sm">
                  <p className="text-slate-500">Last contact:</p>
                  <p className="text-white">{followUp.lastContact}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button 
                    size="sm" 
                    className={followUp.status === "overdue" 
                      ? "bg-red-500 hover:bg-red-600" 
                      : "bg-indigo-500 hover:bg-indigo-600"
                    }
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Send Now
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600">
                    Reschedule
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Automation Rules */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
        <h4 className="font-semibold text-white mb-3">Active Automation Rules</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-white font-medium">No Response (48h)</p>
            <p className="text-xs text-slate-400">Auto-send reminder email</p>
            <Badge className="mt-2 bg-green-500/20 text-green-400">Active</Badge>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-white font-medium">Demo Scheduled</p>
            <p className="text-xs text-slate-400">Send confirmation + reminder</p>
            <Badge className="mt-2 bg-green-500/20 text-green-400">Active</Badge>
          </div>
          <div className="p-3 bg-slate-800/50 rounded-lg">
            <p className="text-white font-medium">Quote Sent (72h)</p>
            <p className="text-xs text-slate-400">Follow-up call trigger</p>
            <Badge className="mt-2 bg-green-500/20 text-green-400">Active</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpAutomation;
