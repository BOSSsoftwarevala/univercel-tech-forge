import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  TrendingUp, 
  Lightbulb, 
  Blocks, 
  TestTube, 
  Map, 
  Search,
  Sparkles,
  Activity,
  Zap,
  Bot,
  Target,
  Radar,
  Rocket
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RnDTopBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const RnDTopBar = ({ activeTab, onTabChange }: RnDTopBarProps) => {
  const [isAIActive, setIsAIActive] = useState(true);

  const tabs = [
    { id: "future-lab", label: "Future Lab", icon: Lightbulb, count: 24 },
    { id: "ai-assistant", label: "AI Assistant", icon: Bot, count: 0, isAI: true },
    { id: "idea-scorer", label: "Idea Scorer", icon: Target, count: 0, isAI: true },
    { id: "tech-radar", label: "Tech Radar", icon: Radar, count: 0, isAI: true },
    { id: "pipeline", label: "Pipeline", icon: Rocket, count: 5 },
    { id: "prototype", label: "Prototype", icon: Blocks, count: 8 },
    { id: "trends", label: "Trends", icon: TrendingUp, count: 5 },
    { id: "decisions", label: "Decisions", icon: Map, count: 6 },
  ];

  return (
    <div className="border-b border-violet-500/20 bg-slate-900/50 backdrop-blur-xl">
      {/* Main Top Bar */}
      <div className="px-6 py-4 flex items-center justify-between">
        {/* AI Research Panel Indicator */}
        <div className="flex items-center gap-4">
          <motion.div 
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border border-violet-500/30"
            animate={{ boxShadow: isAIActive ? "0 0 20px rgba(139, 92, 246, 0.3)" : "none" }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Brain className="w-6 h-6 text-violet-400" />
            </motion.div>
            <div>
              <p className="text-xs text-violet-300/70">AI Research Panel</p>
              <p className="text-sm font-semibold text-violet-100">Active & Learning</p>
            </div>
            <motion.div
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">156</p>
              <p className="text-xs text-slate-400">Ideas in Pipeline</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">23</p>
              <p className="text-xs text-slate-400">Active Prototypes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">7</p>
              <p className="text-xs text-slate-400">Pending Decisions</p>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search ideas, prototypes..."
              className="pl-10 w-64 bg-slate-800/50 border-violet-500/30 focus:border-violet-400 text-slate-200"
            />
          </div>

          <Button 
            className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Analysis
          </Button>

          <motion.div
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
            animate={{ borderColor: ["rgba(16, 185, 129, 0.3)", "rgba(16, 185, 129, 0.6)", "rgba(16, 185, 129, 0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300">3 New Trends</span>
          </motion.div>
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
                  ? "bg-gradient-to-r from-violet-600/30 to-cyan-600/30 text-white border border-violet-500/50" 
                  : tab.isAI
                  ? "text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 border border-violet-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={`w-4 h-4 ${tab.isAI ? "text-violet-400" : ""}`} />
              <span className="text-sm font-medium">{tab.label}</span>
              {tab.isAI && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-violet-400"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              {tab.count > 0 && (
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${isActive ? "bg-violet-500/30 text-violet-200" : "bg-slate-700 text-slate-300"}`}
                >
                  {tab.count}
                </Badge>
              )}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500"
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
