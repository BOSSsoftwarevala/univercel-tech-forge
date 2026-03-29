import { motion } from "framer-motion";
import { 
  Brain, Flame, Target, TrendingUp, AlertTriangle,
  CheckCircle, Clock, Sparkles, BarChart3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LeadQualificationEngine = () => {
  const qualificationQueue = [
    {
      id: "1",
      name: "Ahmed Hassan",
      message: "Looking for POS system for 5 retail stores, need integration with existing inventory",
      aiAnalysis: {
        temperature: "hot",
        score: 92,
        industry: "Retail - POS",
        urgency: "high",
        budget: "$2000-5000",
        timeline: "2 weeks",
        isPrime: false,
      },
      processing: false,
    },
    {
      id: "2",
      name: "Priya Sharma",
      message: "Government school chain interested in full management system for 500+ students",
      aiAnalysis: {
        temperature: "hot",
        score: 95,
        industry: "Education - School",
        urgency: "high",
        budget: "$10000+",
        timeline: "1 month",
        isPrime: true,
      },
      processing: false,
    },
    {
      id: "3",
      name: "New Inquiry",
      message: "Just browsing pricing options for small business...",
      aiAnalysis: {
        temperature: "cold",
        score: 35,
        industry: "Unknown",
        urgency: "low",
        budget: "Not specified",
        timeline: "Not specified",
        isPrime: false,
      },
      processing: true,
    },
  ];

  const aiMetrics = [
    { label: "Leads Qualified Today", value: 47, change: "+12%", icon: CheckCircle },
    { label: "Hot Leads Detected", value: 18, change: "+8%", icon: Flame },
    { label: "Avg. Qualification Time", value: "2.3s", change: "-15%", icon: Clock },
    { label: "Prime Interest Flags", value: 5, change: "+2", icon: Target },
  ];

  const getTemperatureStyle = (temp: string) => {
    switch (temp) {
      case "hot": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "warm": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "cold": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-400" />
            AI Qualification Engine
          </h2>
          <p className="text-slate-400">Automatic lead scoring and categorization</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
          <Sparkles className="w-4 h-4 mr-2" />
          Run Batch Analysis
        </Button>
      </div>

      {/* AI Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {aiMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-2">
              <metric.icon className="w-5 h-5 text-indigo-400" />
              <span className="text-xs text-green-400">{metric.change}</span>
            </div>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
            <p className="text-xs text-slate-400">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Qualification Queue */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
          <h3 className="font-semibold text-white">Qualification Queue</h3>
          <Badge className="bg-indigo-500/20 text-indigo-400">
            {qualificationQueue.length} pending
          </Badge>
        </div>

        <div className="divide-y divide-slate-700/50">
          {qualificationQueue.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4"
            >
              <div className="flex items-start gap-4">
                {/* Lead Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-white">{lead.name}</h4>
                    {lead.aiAnalysis.isPrime && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        PRIME
                      </Badge>
                    )}
                    {lead.processing && (
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="flex items-center gap-1 text-indigo-400"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs">Analyzing...</span>
                      </motion.div>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{lead.message}</p>

                  {/* AI Analysis Tags */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getTemperatureStyle(lead.aiAnalysis.temperature)}>
                      <Flame className="w-3 h-3 mr-1" />
                      {lead.aiAnalysis.temperature.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-slate-400">
                      {lead.aiAnalysis.industry}
                    </Badge>
                    <Badge variant="outline" className="text-slate-400">
                      Urgency: {lead.aiAnalysis.urgency}
                    </Badge>
                    <Badge variant="outline" className="text-slate-400">
                      Budget: {lead.aiAnalysis.budget}
                    </Badge>
                    <Badge variant="outline" className="text-slate-400">
                      Timeline: {lead.aiAnalysis.timeline}
                    </Badge>
                  </div>
                </div>

                {/* Score */}
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                    lead.aiAnalysis.score >= 80 ? "bg-green-500/20 border border-green-500/30" :
                    lead.aiAnalysis.score >= 50 ? "bg-orange-500/20 border border-orange-500/30" :
                    "bg-red-500/20 border border-red-500/30"
                  }`}>
                    <span className={`text-2xl font-bold ${
                      lead.aiAnalysis.score >= 80 ? "text-green-400" :
                      lead.aiAnalysis.score >= 50 ? "text-orange-400" :
                      "text-red-400"
                    }`}>
                      {lead.aiAnalysis.score}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">AI Score</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button size="sm" className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600">
                    Override
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Industry Categories */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { name: "POS / Retail", count: 34, color: "from-blue-500 to-cyan-500" },
          { name: "Education", count: 28, color: "from-purple-500 to-pink-500" },
          { name: "Healthcare", count: 19, color: "from-green-500 to-emerald-500" },
          { name: "Real Estate", count: 15, color: "from-orange-500 to-amber-500" },
          { name: "Hospitality", count: 12, color: "from-red-500 to-rose-500" },
          { name: "Custom/Other", count: 8, color: "from-indigo-500 to-purple-500" },
        ].map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 bg-gradient-to-r ${category.color} bg-opacity-10 rounded-xl border border-white/10`}
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">{category.name}</span>
              <span className="text-2xl font-bold text-white">{category.count}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(category.count / 34) * 100}%` }}
                className="h-full bg-white/30 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LeadQualificationEngine;
