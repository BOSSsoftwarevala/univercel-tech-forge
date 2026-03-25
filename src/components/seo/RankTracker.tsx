import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, TrendingDown, Search, Globe, Eye,
  MousePointer, BarChart3, Calendar, Filter, RefreshCw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RankTrackerProps {
  activeRegion: string;
}

const RankTracker = ({ activeRegion }: RankTrackerProps) => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  const trackedKeywords = [
    { keyword: "POS software Nigeria", position: 3, change: 2, volume: 2400, ctr: 12.4, impressions: 18500, region: "Nigeria" },
    { keyword: "school management system India", position: 5, change: -1, volume: 8900, ctr: 8.2, impressions: 45000, region: "India" },
    { keyword: "hospital ERP UAE", position: 2, change: 1, volume: 1200, ctr: 15.8, impressions: 8900, region: "UAE" },
    { keyword: "inventory software Kenya", position: 7, change: 3, volume: 890, ctr: 5.6, impressions: 4500, region: "Kenya" },
    { keyword: "retail POS system", position: 12, change: -2, volume: 12500, ctr: 3.2, impressions: 32000, region: "Global" },
    { keyword: "best school software 2024", position: 4, change: 5, volume: 6700, ctr: 10.1, impressions: 28000, region: "Global" },
  ];

  const overallMetrics = [
    { label: "Avg. Position", value: 5.5, change: "+0.8", trend: "up" },
    { label: "Total Impressions", value: "137K", change: "+12%", trend: "up" },
    { label: "Avg. CTR", value: "9.2%", change: "+1.4%", trend: "up" },
    { label: "Tracked Keywords", value: 156, change: "+8", trend: "up" },
  ];

  const positionDistribution = [
    { range: "Top 3", count: 23, percentage: 15 },
    { range: "4-10", count: 45, percentage: 29 },
    { range: "11-20", count: 52, percentage: 33 },
    { range: "21-50", count: 36, percentage: 23 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            Rank Tracker
          </h2>
          <p className="text-slate-400">Monitor keyword positions and search visibility</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800/50 rounded-lg p-1">
            {["7d", "30d", "90d"].map((range) => (
              <Button
                key={range}
                size="sm"
                variant={timeRange === range ? "default" : "ghost"}
                onClick={() => setTimeRange(range as any)}
                className={timeRange === range ? "bg-cyan-500" : ""}
              >
                {range}
              </Button>
            ))}
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
            <RefreshCw className="w-4 h-4 mr-2" />
            Update Rankings
          </Button>
        </div>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {overallMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-2">
              {metric.trend === "up" ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              <span className={`text-xs ${metric.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
            <p className="text-xs text-slate-400">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Position Distribution */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
          <h3 className="font-semibold text-white mb-4">Position Distribution</h3>
          <div className="space-y-3">
            {positionDistribution.map((item, index) => (
              <div key={item.range}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">{item.range}</span>
                  <span className="text-white">{item.count} keywords</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`h-full rounded-full ${
                      item.range === "Top 3" ? "bg-green-500" :
                      item.range === "4-10" ? "bg-cyan-500" :
                      item.range === "11-20" ? "bg-yellow-500" : "bg-orange-500"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keyword Rankings Table */}
        <div className="col-span-2 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
            <h3 className="font-semibold text-white">Tracked Keywords</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search keywords..." className="pl-10 bg-slate-800/50 border-slate-600 w-48" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left p-3 text-xs text-slate-400">Keyword</th>
                  <th className="text-center p-3 text-xs text-slate-400">Position</th>
                  <th className="text-center p-3 text-xs text-slate-400">Change</th>
                  <th className="text-center p-3 text-xs text-slate-400">Volume</th>
                  <th className="text-center p-3 text-xs text-slate-400">CTR</th>
                  <th className="text-center p-3 text-xs text-slate-400">Impressions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {trackedKeywords.map((kw, index) => (
                  <motion.tr
                    key={kw.keyword}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-3">
                      <div>
                        <p className="text-sm text-white">{kw.keyword}</p>
                        <p className="text-xs text-slate-500">{kw.region}</p>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-lg font-bold ${
                        kw.position <= 3 ? "text-green-400" :
                        kw.position <= 10 ? "text-cyan-400" : "text-yellow-400"
                      }`}>
                        #{kw.position}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className={`flex items-center justify-center gap-1 ${
                        kw.change > 0 ? "text-green-400" : kw.change < 0 ? "text-red-400" : "text-slate-400"
                      }`}>
                        {kw.change > 0 ? <TrendingUp className="w-4 h-4" /> : kw.change < 0 ? <TrendingDown className="w-4 h-4" /> : null}
                        {kw.change !== 0 && <span className="text-sm">{Math.abs(kw.change)}</span>}
                      </div>
                    </td>
                    <td className="p-3 text-center text-sm text-slate-300">{kw.volume.toLocaleString()}</td>
                    <td className="p-3 text-center text-sm text-cyan-400">{kw.ctr}%</td>
                    <td className="p-3 text-center text-sm text-slate-300">{kw.impressions.toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SERP Features */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
        <h4 className="font-semibold text-white mb-4">SERP Features Won</h4>
        <div className="grid grid-cols-5 gap-3">
          {[
            { feature: "Featured Snippet", count: 8, icon: "📋" },
            { feature: "People Also Ask", count: 12, icon: "❓" },
            { feature: "Local Pack", count: 5, icon: "📍" },
            { feature: "Image Pack", count: 3, icon: "🖼️" },
            { feature: "Video Results", count: 2, icon: "🎬" },
          ].map((item) => (
            <div key={item.feature} className="p-3 bg-slate-800/50 rounded-lg text-center">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-lg font-bold text-white mt-1">{item.count}</p>
              <p className="text-xs text-slate-400">{item.feature}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankTracker;
