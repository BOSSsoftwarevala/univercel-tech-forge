import { motion } from "framer-motion";
import { 
  Trophy, 
  Award, 
  Star, 
  Zap,
  Target,
  Clock,
  Shield,
  Crown,
  Sparkles,
  Gift
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const achievements = [
  {
    id: "1",
    member: "vala(dev)4412",
    role: "Developer",
    badge: "Top Performer of the Week",
    type: "excellence",
    icon: Trophy,
    color: "amber",
    description: "Completed 14 tasks with zero rework",
    bonus: "+$250",
    multiplier: "1.2x",
    date: "Today",
  },
  {
    id: "2",
    member: "vala(sales)4771",
    role: "Sales",
    badge: "Consistency Award",
    type: "consistency",
    icon: Star,
    color: "cyan",
    description: "30-day streak of meeting targets",
    bonus: "+$180",
    multiplier: "1.15x",
    date: "2 days ago",
  },
  {
    id: "3",
    member: "vala(support)8891",
    role: "Support",
    badge: "Zero Complaint Badge",
    type: "quality",
    icon: Shield,
    color: "emerald",
    description: "Perfect satisfaction score this month",
    bonus: "+$120",
    multiplier: "1.1x",
    date: "5 days ago",
  },
];

const leaderboard = [
  { rank: 1, member: "vala(dev)4412", role: "Developer", score: 98, change: "+3" },
  { rank: 2, member: "vala(sales)4771", role: "Sales", score: 94, change: "+5" },
  { rank: 3, member: "vala(support)8891", role: "Support", score: 92, change: "-1" },
  { rank: 4, member: "vala(reseller)2341", role: "Reseller", score: 89, change: "+2" },
  { rank: 5, member: "vala(seo)7712", role: "SEO", score: 87, change: "0" },
];

const aiSuggestions = [
  {
    member: "vala(dev)8823",
    suggestion: "Consider 'Quick Learner' bonus for completing training ahead of schedule.",
    type: "bonus",
  },
  {
    member: "vala(sales)2234",
    suggestion: "Eligible for 'Client Champion' badge based on sentiment scores.",
    type: "badge",
  },
];

export const IncentiveEngine = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          Incentive Engine
        </h2>
        <p className="text-slate-400 text-sm mt-1">Automated rewards, badges, and commission multipliers</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Recent Achievements
          </h3>
          
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-4 bg-slate-900/50 backdrop-blur-xl border-${achievement.color}-500/30 hover:border-${achievement.color}-500/50 transition-all`}>
                  <div className="flex items-start gap-4">
                    <motion.div
                      className={`p-3 rounded-xl bg-${achievement.color}-500/20`}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Icon className={`w-6 h-6 text-${achievement.color}-400`} />
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">{achievement.badge}</span>
                        <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                          {achievement.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{achievement.member}</p>
                      <p className="text-xs text-slate-500 mb-3">{achievement.description}</p>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-semibold text-sm">{achievement.bonus}</span>
                        <span className="text-cyan-400 text-sm">Multiplier: {achievement.multiplier}</span>
                        <span className="text-slate-500 text-xs">{achievement.date}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            Performance Leaderboard
          </h3>
          
          <Card className="p-4 bg-slate-900/50 backdrop-blur-xl border-cyan-500/30">
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.rank}
                  className={`flex items-center gap-4 p-3 rounded-xl ${
                    entry.rank === 1 ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30" :
                    entry.rank === 2 ? "bg-gradient-to-r from-slate-400/10 to-slate-300/10 border border-slate-400/30" :
                    entry.rank === 3 ? "bg-gradient-to-r from-amber-700/20 to-orange-700/20 border border-amber-700/30" :
                    "bg-slate-800/30"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    entry.rank === 1 ? "bg-amber-500 text-black" :
                    entry.rank === 2 ? "bg-slate-400 text-black" :
                    entry.rank === 3 ? "bg-amber-700 text-white" :
                    "bg-slate-700 text-slate-300"
                  }`}>
                    {entry.rank}
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm">{entry.member}</p>
                    <p className="text-xs text-slate-500">{entry.role}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-cyan-400">{entry.score}</p>
                    <p className={`text-xs ${
                      entry.change.startsWith("+") ? "text-emerald-400" :
                      entry.change.startsWith("-") ? "text-rose-400" : "text-slate-500"
                    }`}>
                      {entry.change}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* AI Bonus Suggestions */}
      <Card className="p-5 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border-cyan-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-white">AI Bonus Suggestions</h3>
        </div>
        
        <div className="space-y-3">
          {aiSuggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <Gift className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-sm text-slate-300">{suggestion.suggestion}</p>
                  <p className="text-xs text-slate-500">{suggestion.member}</p>
                </div>
              </div>
              <Button size="sm" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/50">
                Apply
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};
