import { motion } from "framer-motion";
import { 
  Star, 
  MessageSquare, 
  Clock, 
  ThumbsUp, 
  ThumbsDown,
  BarChart3,
  TrendingUp,
  FileText
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const feedbackItems = [
  {
    id: "1",
    client: "TechCorp Solutions",
    type: "post-task",
    rating: 5,
    comment: "Excellent work on the dashboard implementation. Very responsive team!",
    timestamp: "2 hours ago",
    responseTime: "2.5 hours",
  },
  {
    id: "2",
    client: "GlobalRetail Inc",
    type: "onboarding",
    rating: 4,
    comment: "Setup was smooth, but training could be more detailed.",
    timestamp: "5 hours ago",
    responseTime: "4.2 hours",
  },
  {
    id: "3",
    client: "StartupX",
    type: "satisfaction",
    rating: 2,
    comment: "Delays in delivery affected our launch. Need improvement.",
    timestamp: "1 day ago",
    responseTime: "8.5 hours",
  },
  {
    id: "4",
    client: "Enterprise Plus",
    type: "micro",
    rating: 5,
    comment: "Quick response to my query. Great support!",
    timestamp: "2 days ago",
    responseTime: "0.5 hours",
  },
];

const getFeedbackTypeColor = (type: string) => {
  switch (type) {
    case "post-task": return "bg-teal-100 text-teal-700";
    case "onboarding": return "bg-violet-100 text-violet-700";
    case "satisfaction": return "bg-amber-100 text-amber-700";
    case "micro": return "bg-emerald-100 text-emerald-700";
    default: return "bg-slate-100 text-slate-700";
  }
};

const renderStars = (rating: number) => {
  return [...Array(5)].map((_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`}
    />
  ));
};

export const FeedbackCollector = () => {
  const avgRating = 4.2;
  const totalFeedback = 234;
  const responseRating = 4.5;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Feedback Collector</h2>
        <p className="text-slate-500 text-sm mt-1">Gather and analyze client feedback across all touchpoints</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Avg Satisfaction", value: avgRating, suffix: "/5", icon: Star, color: "amber" },
          { label: "Total Feedback", value: totalFeedback, suffix: "", icon: MessageSquare, color: "teal" },
          { label: "Response Rating", value: responseRating, suffix: "/5", icon: Clock, color: "emerald" },
          { label: "Trend", value: "+12%", suffix: "", icon: TrendingUp, color: "violet" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-4 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
              </div>
              <p className={`text-2xl font-bold text-${stat.color}-600`}>
                {stat.value}{stat.suffix}
              </p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Rating Distribution */}
      <Card className="p-5 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
        <h3 className="font-semibold text-slate-700 mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const percentage = rating === 5 ? 45 : rating === 4 ? 30 : rating === 3 ? 15 : rating === 2 ? 7 : 3;
            return (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-24">
                  {renderStars(rating)}
                </div>
                <div className="flex-1">
                  <Progress value={percentage} className="h-3" />
                </div>
                <span className="text-sm text-slate-600 w-12 text-right">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Feedback Types */}
      <Card className="p-5 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
        <h3 className="font-semibold text-slate-700 mb-4">Feedback Categories</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { type: "Micro Surveys", count: 89, trend: "+5" },
            { type: "Post-Task", count: 67, trend: "+12" },
            { type: "Onboarding", count: 45, trend: "+3" },
            { type: "Satisfaction", count: 33, trend: "-2" },
          ].map((cat, i) => (
            <motion.div
              key={i}
              className="p-4 rounded-xl bg-gradient-to-r from-teal-50 to-amber-50 border border-teal-100"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <span className={`text-xs ${cat.trend.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}>
                  {cat.trend}
                </span>
              </div>
              <p className="text-xl font-bold text-slate-800">{cat.count}</p>
              <p className="text-xs text-slate-500">{cat.type}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Recent Feedback */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-700">Recent Feedback</h3>
        {feedbackItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-800">{item.client}</span>
                  <Badge className={getFeedbackTypeColor(item.type)}>
                    {item.type}
                  </Badge>
                  <div className="flex items-center">
                    {renderStars(item.rating)}
                  </div>
                </div>
                <span className="text-xs text-slate-500">{item.timestamp}</span>
              </div>
              
              <p className="text-sm text-slate-600 mb-3 p-3 bg-slate-50 rounded-lg">
                "{item.comment}"
              </p>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Response Time: {item.responseTime}
                </span>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700">
                    <ThumbsUp className="w-3 h-3" />
                    Helpful
                  </button>
                  <button className="flex items-center gap-1 text-slate-400 hover:text-slate-600">
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
