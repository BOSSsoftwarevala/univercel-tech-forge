import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lightbulb, 
  Brain, 
  Palette, 
  Code, 
  Users, 
  Zap,
  Plus,
  Star,
  Link,
  Clock,
  User,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface FutureLabProps {
  onSelectIdea: (id: string | null) => void;
}

const categories = [
  { id: "ai", label: "AI", icon: Brain, color: "violet" },
  { id: "uiux", label: "UI/UX", icon: Palette, color: "cyan" },
  { id: "devtools", label: "Developer Tools", icon: Code, color: "emerald" },
  { id: "client", label: "Client Experience", icon: Users, color: "amber" },
  { id: "automation", label: "Automation", icon: Zap, color: "rose" },
];

const ideas = [
  {
    id: "1",
    title: "AI-Powered Code Review Assistant",
    category: "ai",
    priority: "high",
    feasibility: 87,
    author: "vala(rnd)2341",
    created: "2 hours ago",
    votes: 24,
    status: "evaluating",
    description: "Automated code review with AI suggestions for optimization and security.",
    researchLinks: 3,
  },
  {
    id: "2",
    title: "Holographic Dashboard Widgets",
    category: "uiux",
    priority: "medium",
    feasibility: 72,
    author: "vala(design)8892",
    created: "5 hours ago",
    votes: 18,
    status: "approved",
    description: "3D holographic-style widgets with depth perception and parallax effects.",
    researchLinks: 5,
  },
  {
    id: "3",
    title: "One-Click Deployment Pipeline",
    category: "devtools",
    priority: "high",
    feasibility: 94,
    author: "vala(dev)4412",
    created: "1 day ago",
    votes: 31,
    status: "in_prototype",
    description: "Simplified deployment with automated testing, staging, and production rollout.",
    researchLinks: 2,
  },
  {
    id: "4",
    title: "Predictive Client Needs Engine",
    category: "client",
    priority: "medium",
    feasibility: 68,
    author: "vala(cs)7723",
    created: "3 days ago",
    votes: 15,
    status: "evaluating",
    description: "AI predicts client needs before they ask, enabling proactive support.",
    researchLinks: 4,
  },
  {
    id: "5",
    title: "Auto-Scaling Task Automation",
    category: "automation",
    priority: "critical",
    feasibility: 81,
    author: "vala(rnd)2341",
    created: "4 hours ago",
    votes: 27,
    status: "approved",
    description: "Intelligent task distribution that scales based on team capacity.",
    researchLinks: 6,
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical": return "bg-red-500/20 text-red-400 border-red-500/50";
    case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
    case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
    case "low": return "bg-slate-500/20 text-slate-400 border-slate-500/50";
    default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved": return "bg-emerald-500/20 text-emerald-400";
    case "in_prototype": return "bg-cyan-500/20 text-cyan-400";
    case "evaluating": return "bg-violet-500/20 text-violet-400";
    case "rejected": return "bg-red-500/20 text-red-400";
    default: return "bg-slate-500/20 text-slate-400";
  }
};

const getCategoryColor = (category: string) => {
  const cat = categories.find(c => c.id === category);
  switch (cat?.color) {
    case "violet": return "from-violet-600 to-violet-400";
    case "cyan": return "from-cyan-600 to-cyan-400";
    case "emerald": return "from-emerald-600 to-emerald-400";
    case "amber": return "from-amber-600 to-amber-400";
    case "rose": return "from-rose-600 to-rose-400";
    default: return "from-slate-600 to-slate-400";
  }
};

export const FutureLab = ({ onSelectIdea }: FutureLabProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredIdea, setHoveredIdea] = useState<string | null>(null);

  const filteredIdeas = selectedCategory 
    ? ideas.filter(idea => idea.category === selectedCategory)
    : ideas;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Future Lab – Idea Sandbox
          </h2>
          <p className="text-slate-400 text-sm mt-1">Create and evaluate innovative ideas for SOFTWARE VALA</p>
        </div>
        <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 gap-2">
          <Plus className="w-4 h-4" />
          New Idea
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            !selectedCategory 
              ? "bg-gradient-to-r from-violet-600/30 to-cyan-600/30 text-white border border-violet-500/50" 
              : "bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-slate-700/50"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          All Ideas
        </motion.button>
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <motion.button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat.id 
                  ? `bg-gradient-to-r ${getCategoryColor(cat.id)} text-white` 
                  : "bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-slate-700/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </motion.button>
          );
        })}
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredIdeas.map((idea, index) => {
            const CategoryIcon = categories.find(c => c.id === idea.category)?.icon || Lightbulb;
            
            return (
              <motion.div
                key={idea.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredIdea(idea.id)}
                onMouseLeave={() => setHoveredIdea(null)}
              >
                <Card className={`relative p-5 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-violet-500/50 transition-all cursor-pointer group overflow-hidden ${
                  hoveredIdea === idea.id ? "shadow-lg shadow-violet-500/20" : ""
                }`}>
                  {/* Glow effect for high priority */}
                  {(idea.priority === "critical" || idea.priority === "high") && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-cyan-600/5"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(idea.category)}`}>
                        <CategoryIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(idea.priority)}>
                          {idea.priority}
                        </Badge>
                        <Badge className={getStatusColor(idea.status)}>
                          {idea.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">
                      {idea.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                      {idea.description}
                    </p>

                    {/* AI Feasibility Score */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-violet-400" />
                          AI Feasibility Score
                        </span>
                        <span className={`font-semibold ${
                          idea.feasibility >= 80 ? "text-emerald-400" : 
                          idea.feasibility >= 60 ? "text-amber-400" : "text-red-400"
                        }`}>
                          {idea.feasibility}%
                        </span>
                      </div>
                      <Progress 
                        value={idea.feasibility} 
                        className="h-1.5 bg-slate-700"
                      />
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {idea.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {idea.created}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400" />
                          {idea.votes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Link className="w-3 h-3" />
                          {idea.researchLinks}
                        </span>
                      </div>
                    </div>

                    {/* Hover Action */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-violet-600/20 to-transparent flex items-end justify-center pb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: hoveredIdea === idea.id ? 1 : 0, y: hoveredIdea === idea.id ? 0 : 10 }}
                    >
                      <span className="text-xs text-violet-300 flex items-center gap-1">
                        View Details <ArrowRight className="w-3 h-3" />
                      </span>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
