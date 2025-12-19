import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  ThumbsUp, 
  ThumbsDown,
  Minus,
  MapPin,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const npsData = {
  overall: 72,
  promoters: 156,
  passives: 89,
  detractors: 34,
  trend: "+8",
};

const regionData = [
  { region: "North America", nps: 78, promoters: 45, passives: 22, detractors: 8 },
  { region: "Europe", nps: 71, promoters: 38, passives: 25, detractors: 12 },
  { region: "Asia Pacific", nps: 68, promoters: 42, passives: 28, detractors: 10 },
  { region: "Middle East", nps: 75, promoters: 31, passives: 14, detractors: 4 },
];

const recentFeedback = [
  { client: "TechCorp", score: 10, type: "promoter", comment: "Excellent service!" },
  { client: "StartupX", score: 5, type: "detractor", comment: "Slow response times" },
  { client: "GlobalRetail", score: 8, type: "passive", comment: "Good overall" },
  { client: "Enterprise", score: 9, type: "promoter", comment: "Great support team" },
];

export const NPSScoreboard = () => {
  const promoterPercentage = (npsData.promoters / (npsData.promoters + npsData.passives + npsData.detractors)) * 100;
  const detractorPercentage = (npsData.detractors / (npsData.promoters + npsData.passives + npsData.detractors)) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">NPS Scoreboard 2035</h2>
        <p className="text-slate-500 text-sm mt-1">Real-time Net Promoter Score tracking</p>
      </div>

      {/* Main NPS Display */}
      <Card className="p-8 bg-gradient-to-r from-teal-50 via-white to-amber-50 border-teal-200/50 shadow-xl">
        <div className="flex items-center justify-center gap-16">
          {/* NPS Score */}
          <div className="text-center">
            <motion.div
              className="relative w-48 h-48"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="url(#npsGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(npsData.overall + 100) / 200 * 502} 502`}
                  initial={{ strokeDasharray: "0 502" }}
                  animate={{ strokeDasharray: `${(npsData.overall + 100) / 200 * 502} 502` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="npsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#d4a574" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  className="text-5xl font-bold text-teal-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {npsData.overall}
                </motion.span>
                <span className="text-sm text-slate-500">NPS Score</span>
                <span className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" />
                  {npsData.trend} this month
                </span>
              </div>
            </motion.div>
          </div>

          {/* Breakdown */}
          <div className="space-y-6">
            <motion.div 
              className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-3 rounded-lg bg-emerald-100">
                <ThumbsUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">{npsData.promoters}</p>
                <p className="text-sm text-emerald-600">Promoters (9-10)</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 ml-auto">
                {promoterPercentage.toFixed(0)}%
              </Badge>
            </motion.div>

            <motion.div 
              className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="p-3 rounded-lg bg-amber-100">
                <Minus className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">{npsData.passives}</p>
                <p className="text-sm text-amber-600">Passives (7-8)</p>
              </div>
              <Badge className="bg-amber-100 text-amber-700 ml-auto">
                {((npsData.passives / (npsData.promoters + npsData.passives + npsData.detractors)) * 100).toFixed(0)}%
              </Badge>
            </motion.div>

            <motion.div 
              className="flex items-center gap-4 p-4 rounded-xl bg-rose-50 border border-rose-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="p-3 rounded-lg bg-rose-100">
                <ThumbsDown className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-700">{npsData.detractors}</p>
                <p className="text-sm text-rose-600">Detractors (0-6)</p>
              </div>
              <Badge className="bg-rose-100 text-rose-700 ml-auto">
                {detractorPercentage.toFixed(0)}%
              </Badge>
            </motion.div>
          </div>
        </div>
      </Card>

      {/* Region-wise Segmentation */}
      <Card className="p-5 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-teal-600" />
          <h3 className="font-semibold text-slate-700">Region-wise NPS</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {regionData.map((region, index) => (
            <motion.div
              key={region.region}
              className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-teal-50/30 border border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700">{region.region}</span>
                <span className={`text-xl font-bold ${region.nps >= 70 ? "text-emerald-600" : region.nps >= 50 ? "text-amber-600" : "text-rose-600"}`}>
                  {region.nps}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-600">{region.promoters} 👍</span>
                <span className="text-amber-600">{region.passives} —</span>
                <span className="text-rose-600">{region.detractors} 👎</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Recent NPS Responses */}
      <Card className="p-5 bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <h3 className="font-semibold text-slate-700">Latest NPS Responses</h3>
        </div>
        
        <div className="space-y-3">
          {recentFeedback.map((feedback, index) => (
            <motion.div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                feedback.type === "promoter" ? "bg-emerald-50 border-emerald-200" :
                feedback.type === "detractor" ? "bg-rose-50 border-rose-200" :
                "bg-amber-50 border-amber-200"
              } border`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  feedback.type === "promoter" ? "bg-emerald-100 text-emerald-700" :
                  feedback.type === "detractor" ? "bg-rose-100 text-rose-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {feedback.score}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{feedback.client}</p>
                  <p className="text-xs text-slate-500">{feedback.comment}</p>
                </div>
              </div>
              <Badge className={
                feedback.type === "promoter" ? "bg-emerald-100 text-emerald-700" :
                feedback.type === "detractor" ? "bg-rose-100 text-rose-700" :
                "bg-amber-100 text-amber-700"
              }>
                {feedback.type}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};
