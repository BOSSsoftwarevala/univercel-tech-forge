import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Target, TrendingUp, TrendingDown, Link2, Search,
  Eye, Sparkles, RefreshCw, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CompetitorIntelligence = () => {
  const [isScanning, setIsScanning] = useState(false);

  const competitors = [
    { 
      name: "CompetitorA.com", 
      da: 68, 
      traffic: "45K", 
      keywords: 1245, 
      backlinks: 3420,
      trend: "up",
      change: "+12%"
    },
    { 
      name: "RivalSoft.io", 
      da: 72, 
      traffic: "62K", 
      keywords: 1890, 
      backlinks: 4100,
      trend: "up",
      change: "+8%"
    },
    { 
      name: "TechPOS.net", 
      da: 54, 
      traffic: "28K", 
      keywords: 780, 
      backlinks: 1200,
      trend: "down",
      change: "-5%"
    },
  ];

  const keywordGaps = [
    { keyword: "pos software free trial", competitor: "RivalSoft.io", position: 3, ourPosition: 12, volume: 8900 },
    { keyword: "cloud inventory system", competitor: "CompetitorA.com", position: 5, ourPosition: 18, volume: 6700 },
    { keyword: "retail management africa", competitor: "TechPOS.net", position: 2, ourPosition: 8, volume: 4500 },
    { keyword: "hospital billing software", competitor: "RivalSoft.io", position: 4, ourPosition: 15, volume: 5200 },
  ];

  const newBacklinks = [
    { competitor: "RivalSoft.io", domain: "forbes.com", da: 94, date: "2 days ago" },
    { competitor: "CompetitorA.com", domain: "techcrunch.com", da: 91, date: "3 days ago" },
    { competitor: "RivalSoft.io", domain: "entrepreneur.com", da: 88, date: "5 days ago" },
  ];

  const rankingData = [
    { date: "Week 1", us: 15, competitorA: 12, rivalSoft: 8 },
    { date: "Week 2", us: 14, competitorA: 11, rivalSoft: 9 },
    { date: "Week 3", us: 12, competitorA: 10, rivalSoft: 10 },
    { date: "Week 4", us: 10, competitorA: 11, rivalSoft: 11 },
    { date: "Week 5", us: 8, competitorA: 12, rivalSoft: 12 },
    { date: "Week 6", us: 6, competitorA: 13, rivalSoft: 11 },
  ];

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Competitor Intelligence</h2>
          <p className="text-slate-400">Track, analyze, and outrank your competition</p>
        </div>
        <Button 
          onClick={handleScan}
          disabled={isScanning}
          className="bg-gradient-to-r from-cyan-500 to-blue-500"
        >
          {isScanning ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Eye className="w-4 h-4 mr-2" />
          )}
          {isScanning ? "Scanning..." : "Deep Scan"}
        </Button>
      </div>

      {/* Competitor Cards */}
      <div className="grid grid-cols-3 gap-4">
        {competitors.map((competitor, index) => (
          <motion.div
            key={competitor.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">{competitor.name}</h3>
              <div className={`flex items-center gap-1 text-sm ${
                competitor.trend === "up" ? "text-green-400" : "text-red-400"
              }`}>
                {competitor.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {competitor.change}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">Domain Authority</p>
                <p className="text-xl font-bold text-cyan-400">{competitor.da}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Est. Traffic</p>
                <p className="text-xl font-bold text-emerald-400">{competitor.traffic}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Keywords</p>
                <p className="text-lg font-semibold text-white">{competitor.keywords.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Backlinks</p>
                <p className="text-lg font-semibold text-white">{competitor.backlinks.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Ranking Comparison */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Ranking Comparison
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={rankingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" reversed />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1e293b", 
                  border: "1px solid #334155",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="us" stroke="#06b6d4" name="Software Vala" strokeWidth={2} />
              <Line type="monotone" dataKey="competitorA" stroke="#8b5cf6" name="CompetitorA" strokeWidth={2} />
              <Line type="monotone" dataKey="rivalSoft" stroke="#f59e0b" name="RivalSoft" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Keyword Gaps */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            Keyword Gaps to Target
          </h3>
          <div className="space-y-3">
            {keywordGaps.map((gap, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">{gap.keyword}</span>
                  <span className="text-xs text-slate-400">{gap.volume.toLocaleString()} vol</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Them:</span>
                    <Badge className="bg-red-500/20 text-red-400">#{gap.position}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Us:</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400">#{gap.ourPosition}</Badge>
                  </div>
                  <Button size="sm" variant="ghost" className="ml-auto text-xs text-cyan-400">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Counter Strategy
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* New Competitor Backlinks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-cyan-400" />
          New Competitor Backlinks
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {newBacklinks.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{link.domain}</span>
                <Badge className="bg-emerald-500/20 text-emerald-400">DA {link.da}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Acquired by {link.competitor}</span>
                <span>{link.date}</span>
              </div>
              <Button size="sm" className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-xs">
                Target This Source
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CompetitorIntelligence;
