import { motion } from "framer-motion";
import { 
  Smile, 
  Meh, 
  Frown, 
  AlertTriangle,
  ThumbsUp,
  HelpCircle,
  MessageSquare,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const chatLogs = [
  {
    id: "1",
    client: "TechCorp Solutions",
    message: "The new feature is exactly what we needed! Great work by the team.",
    tone: "happy",
    timestamp: "10 min ago",
    suggestedResponse: "Thank you for the positive feedback! We're glad the feature meets your needs. Is there anything else we can help optimize?",
  },
  {
    id: "2",
    client: "StartupX",
    message: "I've been waiting for 3 days now. When will my project be ready?",
    tone: "frustrated",
    timestamp: "25 min ago",
    suggestedResponse: "I sincerely apologize for the delay. Let me personally check the status and provide you with an immediate update. Your patience is appreciated.",
  },
  {
    id: "3",
    client: "GlobalRetail Inc",
    message: "How do I configure the dashboard settings? I'm a bit lost.",
    tone: "confused",
    timestamp: "1 hour ago",
    suggestedResponse: "I'd be happy to help you with the dashboard configuration! Let me share a quick walkthrough video, or we can schedule a brief call if you prefer.",
  },
  {
    id: "4",
    client: "Enterprise Plus",
    message: "This is the third time I'm reporting the same issue!",
    tone: "angry",
    timestamp: "2 hours ago",
    suggestedResponse: "I completely understand your frustration, and I apologize for the recurring issue. I'm escalating this to our senior team immediately for priority resolution.",
  },
  {
    id: "5",
    client: "Innovate Labs",
    message: "The update looks good. Just a few minor tweaks needed.",
    tone: "polite",
    timestamp: "3 hours ago",
    suggestedResponse: "Thank you for reviewing! Please share the specific tweaks you have in mind, and we'll implement them right away.",
  },
];

const getToneIcon = (tone: string) => {
  switch (tone) {
    case "happy": return <Smile className="w-5 h-5 text-emerald-500" />;
    case "polite": return <ThumbsUp className="w-5 h-5 text-teal-500" />;
    case "confused": return <HelpCircle className="w-5 h-5 text-amber-500" />;
    case "frustrated": return <Meh className="w-5 h-5 text-orange-500" />;
    case "angry": return <Frown className="w-5 h-5 text-rose-500" />;
    default: return <MessageSquare className="w-5 h-5 text-slate-500" />;
  }
};

const getToneColor = (tone: string) => {
  switch (tone) {
    case "happy": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "polite": return "bg-teal-100 text-teal-700 border-teal-200";
    case "confused": return "bg-amber-100 text-amber-700 border-amber-200";
    case "frustrated": return "bg-orange-100 text-orange-700 border-orange-200";
    case "angry": return "bg-rose-100 text-rose-700 border-rose-200";
    default: return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const getToneBg = (tone: string) => {
  switch (tone) {
    case "happy": return "from-emerald-50 to-teal-50";
    case "polite": return "from-teal-50 to-cyan-50";
    case "confused": return "from-amber-50 to-yellow-50";
    case "frustrated": return "from-orange-50 to-amber-50";
    case "angry": return "from-rose-50 to-red-50";
    default: return "from-slate-50 to-gray-50";
  }
};

export const SentimentAnalyzer = () => {
  const sentimentStats = [
    { tone: "happy", count: 45, percentage: 35 },
    { tone: "polite", count: 38, percentage: 29 },
    { tone: "confused", count: 25, percentage: 19 },
    { tone: "frustrated", count: 15, percentage: 12 },
    { tone: "angry", count: 7, percentage: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Sentiment & Language Analyzer</h2>
        <p className="text-slate-500 text-sm mt-1">AI-powered emotion detection with empathetic response suggestions</p>
      </div>

      {/* Sentiment Distribution */}
      <Card className="p-5 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
        <h3 className="font-semibold text-slate-700 mb-4">Sentiment Distribution (Last 24h)</h3>
        <div className="flex items-center gap-4">
          {sentimentStats.map((stat, index) => (
            <motion.div
              key={stat.tone}
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                {getToneIcon(stat.tone)}
                <span className="text-sm text-slate-600 capitalize">{stat.tone}</span>
              </div>
              <div className="h-24 bg-slate-100 rounded-lg relative overflow-hidden">
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getToneBg(stat.tone)}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${stat.percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
              <p className="text-center text-xs text-slate-500 mt-2">
                {stat.count} ({stat.percentage}%)
              </p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Chat Logs with AI Suggestions */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-700">Recent Interactions</h3>
        {chatLogs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-5 bg-gradient-to-r ${getToneBg(log.tone)} border-slate-200/50 shadow-lg`}>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-white/80 shadow-sm">
                  {getToneIcon(log.tone)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-slate-800">{log.client}</span>
                    <Badge className={getToneColor(log.tone)}>
                      {log.tone}
                    </Badge>
                    <span className="text-xs text-slate-500">{log.timestamp}</span>
                  </div>
                  
                  <p className="text-slate-700 mb-4 p-3 bg-white/60 rounded-lg border border-slate-200/50">
                    "{log.message}"
                  </p>

                  {/* AI Suggested Response */}
                  <div className="p-4 rounded-lg bg-white/80 border border-teal-200/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span className="text-xs text-teal-700 font-semibold">AI Empathy Suggestion</span>
                    </div>
                    <p className="text-sm text-slate-600 italic">"{log.suggestedResponse}"</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white text-xs">
                        Use Response
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs border-teal-300 text-teal-700">
                        Edit & Send
                      </Button>
                    </div>
                  </div>
                </div>

                {log.tone === "angry" || log.tone === "frustrated" ? (
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-rose-100 text-rose-600 text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    Priority
                  </div>
                ) : null}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
