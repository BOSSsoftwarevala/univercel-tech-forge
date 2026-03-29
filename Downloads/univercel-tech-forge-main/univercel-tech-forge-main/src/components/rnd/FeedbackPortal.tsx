import { motion } from "framer-motion";
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  AlertTriangle,
  TrendingUp,
  Filter,
  Inbox,
  FileText,
  BarChart3
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const feedbackItems = [
  {
    id: "1",
    content: "The deployment process takes too long. Need faster CI/CD.",
    source: "support_ticket",
    sentiment: "negative",
    sentimentScore: -0.78,
    category: "pain_point",
    votes: 34,
    created: "2 hours ago",
    status: "actionable",
  },
  {
    id: "2",
    content: "Would love to have dark mode for the entire dashboard.",
    source: "survey",
    sentiment: "positive",
    sentimentScore: 0.65,
    category: "feature_request",
    votes: 89,
    created: "1 day ago",
    status: "in_review",
  },
  {
    id: "3",
    content: "Mobile responsiveness needs improvement on lead manager.",
    source: "chat_log",
    sentiment: "negative",
    sentimentScore: -0.45,
    category: "pain_point",
    votes: 23,
    created: "3 days ago",
    status: "actionable",
  },
  {
    id: "4",
    content: "AI suggestions for task assignments are incredibly helpful!",
    source: "survey",
    sentiment: "positive",
    sentimentScore: 0.92,
    category: "praise",
    votes: 56,
    created: "5 hours ago",
    status: "noted",
  },
  {
    id: "5",
    content: "Need bulk actions for lead management - very time consuming currently.",
    source: "support_ticket",
    sentiment: "negative",
    sentimentScore: -0.62,
    category: "feature_request",
    votes: 67,
    created: "12 hours ago",
    status: "in_review",
  },
];

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case "positive": return "text-emerald-400 bg-emerald-500/20";
    case "negative": return "text-red-400 bg-red-500/20";
    case "neutral": return "text-slate-400 bg-slate-500/20";
    default: return "text-slate-400 bg-slate-500/20";
  }
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case "support_ticket": return <Inbox className="w-3 h-3" />;
    case "chat_log": return <MessageSquare className="w-3 h-3" />;
    case "survey": return <FileText className="w-3 h-3" />;
    default: return <MessageSquare className="w-3 h-3" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "pain_point": return "bg-red-500/20 text-red-400 border-red-500/50";
    case "feature_request": return "bg-violet-500/20 text-violet-400 border-violet-500/50";
    case "praise": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
    default: return "bg-slate-500/20 text-slate-400 border-slate-500/50";
  }
};

export const FeedbackPortal = () => {
  const painPoints = feedbackItems.filter(f => f.category === "pain_point");
  const featureRequests = feedbackItems.filter(f => f.category === "feature_request");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
            User Feedback Portal
          </h2>
          <p className="text-slate-400 text-sm mt-1">Aggregated feedback from support, chat, and surveys</p>
        </div>
        <Button variant="outline" className="gap-2 border-slate-700">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Feedback", value: "1,247", change: "+12%", icon: MessageSquare, color: "violet" },
          { label: "Pain Points", value: "342", change: "+5%", icon: AlertTriangle, color: "red" },
          { label: "Feature Requests", value: "528", change: "+23%", icon: TrendingUp, color: "cyan" },
          { label: "Avg Sentiment", value: "0.42", change: "+0.08", icon: BarChart3, color: "emerald" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-4 bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                <span className="text-xs text-emerald-400">{stat.change}</span>
              </div>
              <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Feedback Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="all" className="data-[state=active]:bg-violet-600/30">
            All Feedback
          </TabsTrigger>
          <TabsTrigger value="pain_points" className="data-[state=active]:bg-red-600/30">
            Pain Points ({painPoints.length})
          </TabsTrigger>
          <TabsTrigger value="feature_requests" className="data-[state=active]:bg-cyan-600/30">
            Feature Requests ({featureRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {feedbackItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-violet-500/30 transition-all">
                <div className="flex items-start gap-4">
                  {/* Sentiment Indicator */}
                  <div className={`p-2 rounded-lg ${getSentimentColor(item.sentiment)}`}>
                    {item.sentiment === "positive" ? (
                      <ThumbsUp className="w-4 h-4" />
                    ) : item.sentiment === "negative" ? (
                      <ThumbsDown className="w-4 h-4" />
                    ) : (
                      <MessageSquare className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-white mb-2">"{item.content}"</p>
                    <div className="flex items-center gap-3 text-xs">
                      <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                        {getSourceIcon(item.source)}
                        <span className="ml-1">{item.source.replace("_", " ")}</span>
                      </Badge>
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category.replace("_", " ")}
                      </Badge>
                      <span className="text-slate-500">{item.created}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-400 mb-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span className="text-sm font-semibold">{item.votes}</span>
                    </div>
                    <p className={`text-xs ${
                      item.sentimentScore > 0 ? "text-emerald-400" : "text-red-400"
                    }`}>
                      Score: {item.sentimentScore.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="pain_points" className="space-y-3">
          {painPoints.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 bg-slate-900/50 backdrop-blur-xl border-red-500/30 hover:border-red-500/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white mb-2">"{item.content}"</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{item.votes} users affected</span>
                      <span>•</span>
                      <span>{item.created}</span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/50">
                    Create Task
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="feature_requests" className="space-y-3">
          {featureRequests.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 bg-slate-900/50 backdrop-blur-xl border-cyan-500/30 hover:border-cyan-500/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white mb-2">"{item.content}"</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{item.votes} votes</span>
                      <span>•</span>
                      <span>{item.created}</span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 border border-cyan-500/50">
                    Add to Lab
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
