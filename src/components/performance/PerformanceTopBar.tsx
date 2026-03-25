import { motion } from "framer-motion";
import { 
  Activity, 
  Clock, 
  TrendingUp, 
  HeadphonesIcon, 
  Users, 
  Heart,
  Search,
  Sparkles,
  Gauge
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PerformanceTopBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const PerformanceTopBar = ({ activeTab, onTabChange }: PerformanceTopBarProps) => {
  const tabs = [
    { id: "upi", label: "UPI 2035", icon: Gauge },
    { id: "roles", label: "Role KPIs", icon: Users },
    { id: "heatmap", label: "Heatmap", icon: Activity },
    { id: "risk", label: "Risk Detector", icon: TrendingUp },
    { id: "incentives", label: "Incentives", icon: Sparkles },
    { id: "compare", label: "Compare", icon: Clock },
    { id: "ai-coach", label: "AI Coach", icon: Sparkles },
  ];

  const liveMetrics = [
    { label: "Performance Index", value: "87.4", trend: "+2.3", color: "cyan" },
    { label: "Delivery vs SLA", value: "94%", trend: "+5%", color: "emerald" },
    { label: "Conversion Rate", value: "32%", trend: "+3%", color: "cyan" },
    { label: "Support Score", value: "4.8", trend: "+0.2", color: "emerald" },
  ];

  return (
    <div className="border-b border-cyan-500/20 bg-slate-900/80 backdrop-blur-xl">
      {/* Main Top Bar */}
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Live Metrics */}
        <div className="flex items-center gap-6">
          {liveMetrics.map((metric, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-center">
                <motion.p 
                  className={`text-2xl font-bold text-${metric.color}-400`}
                  animate={{ opacity: [1, 0.8, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  {metric.value}
                </motion.p>
                <p className="text-xs text-slate-500">{metric.label}</p>
              </div>
              <motion.span
                className="text-xs text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {metric.trend}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search team, metrics..."
              className="pl-10 w-64 bg-slate-800/50 border-cyan-500/30 focus:border-cyan-400 text-slate-200"
            />
          </div>

          <Button 
            onClick={() => onTabChange('ai-coach')}
            className="bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white gap-2"
          >
            <Sparkles className="w-4 h-4" />
            AI Coach
          </Button>

          <motion.div
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
            animate={{ borderColor: ["rgba(16, 185, 129, 0.3)", "rgba(16, 185, 129, 0.6)", "rgba(16, 185, 129, 0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-300">Live</span>
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
              onClick={() => {
                onTabChange(tab.id);
                toast.success(`Switched to ${tab.label}`);
              }}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive 
                  ? "bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-white border border-cyan-500/50" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500"
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
