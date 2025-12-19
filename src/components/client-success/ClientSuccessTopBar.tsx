import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  FileText, 
  Search,
  Sparkles,
  Users,
  Activity
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ClientSuccessTopBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ClientSuccessTopBar = ({ activeTab, onTabChange }: ClientSuccessTopBarProps) => {
  const tabs = [
    { id: "health", label: "Client Health", icon: Heart },
    { id: "onboarding", label: "Onboarding", icon: Users },
    { id: "sentiment", label: "Sentiment", icon: Activity },
    { id: "escalation", label: "Escalation", icon: AlertTriangle },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "playbook", label: "Playbook", icon: FileText },
    { id: "churn", label: "Churn Prevention", icon: TrendingUp },
    { id: "nps", label: "NPS Score", icon: Sparkles },
  ];

  return (
    <div className="border-b border-teal-200/50 bg-white/70 backdrop-blur-xl">
      {/* Main Top Bar */}
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Sentiment Monitor */}
        <div className="flex items-center gap-4">
          <motion.div 
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-50 to-amber-50 border border-teal-200/50 shadow-sm"
            animate={{ boxShadow: ["0 0 0 rgba(20, 184, 166, 0)", "0 0 20px rgba(20, 184, 166, 0.1)", "0 0 0 rgba(20, 184, 166, 0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-6 h-6 text-teal-600" />
            </motion.div>
            <div>
              <p className="text-xs text-teal-600/70">Sentiment Monitor</p>
              <p className="text-sm font-semibold text-teal-800">87% Positive</p>
            </div>
            <motion.div
              className="w-2 h-2 rounded-full bg-emerald-500"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-700">94%</p>
              <p className="text-xs text-slate-500">Onboarding Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">$2.4M</p>
              <p className="text-xs text-slate-500">Client LTV</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-rose-500">3</p>
              <p className="text-xs text-slate-500">At-Risk Clients</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/50">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-amber-700 font-medium">SLA: 2h 15m avg</span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search clients, feedback..."
              className="pl-10 w-64 bg-white border-teal-200/50 focus:border-teal-400 text-slate-700 shadow-sm"
            />
          </div>

          <Button 
            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white gap-2 shadow-lg shadow-teal-500/20"
          >
            <Sparkles className="w-4 h-4" />
            AI Empathy Engine
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 flex items-center gap-2 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive 
                  ? "bg-gradient-to-r from-teal-500/10 to-amber-500/10 text-teal-700 border border-teal-300/50" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-amber-500"
                  layoutId="activeTab"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
