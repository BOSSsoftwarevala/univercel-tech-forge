import { motion } from "framer-motion";
import { 
  Eye, MousePointer, ArrowDown, Timer, Target,
  TrendingUp, BarChart3, Map
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const HeatmapBehavior = () => {
  const pageMetrics = [
    { page: "POS Product Page", avgScroll: 72, clickRate: 8.4, ctaSuccess: 12.3, exitRate: 34, sessions: 2340 },
    { page: "School Management", avgScroll: 68, clickRate: 7.2, ctaSuccess: 10.8, exitRate: 38, sessions: 1890 },
    { page: "Demo Request", avgScroll: 85, clickRate: 12.1, ctaSuccess: 18.5, exitRate: 22, sessions: 1456 },
    { page: "Pricing Page", avgScroll: 91, clickRate: 15.3, ctaSuccess: 8.2, exitRate: 45, sessions: 3210 },
  ];

  const clickPatterns = [
    { element: "Request Demo Button", clicks: 1234, position: "Hero Section", conversion: 18.5 },
    { element: "Pricing Tab", clicks: 987, position: "Navigation", conversion: 12.3 },
    { element: "Feature Card - Inventory", clicks: 756, position: "Features Grid", conversion: 8.7 },
    { element: "Contact Form Submit", clicks: 543, position: "Footer", conversion: 22.1 },
    { element: "Video Play Button", clicks: 432, position: "How It Works", conversion: 6.2 },
  ];

  const exitPoints = [
    { page: "Pricing Page", exitRate: 45, reason: "No clear CTA after pricing", suggestion: "Add comparison table" },
    { page: "Features Page", exitRate: 38, reason: "Too much content", suggestion: "Add quick navigation" },
    { page: "Blog Post", exitRate: 52, reason: "No internal linking", suggestion: "Add related products" },
  ];

  const scrollDepthData = [
    { depth: "25%", retention: 92 },
    { depth: "50%", retention: 76 },
    { depth: "75%", retention: 58 },
    { depth: "100%", retention: 34 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Map className="w-6 h-6 text-cyan-400" />
            Heatmap & Behavior Tracking
          </h2>
          <p className="text-slate-400">User engagement patterns and conversion insights</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500">
          <Eye className="w-4 h-4 mr-2" />
          View Live Heatmap
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Avg. Scroll Depth", value: "72%", icon: ArrowDown, change: "+5%" },
          { label: "Avg. Click Rate", value: "10.8%", icon: MousePointer, change: "+2.3%" },
          { label: "CTA Success Rate", value: "12.4%", icon: Target, change: "+1.8%" },
          { label: "Avg. Session Time", value: "3m 42s", icon: Timer, change: "+18s" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-cyan-400" />
              <span className="text-xs text-green-400">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Scroll Depth Visualization */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <ArrowDown className="w-4 h-4 text-cyan-400" />
            Scroll Depth Analysis
          </h3>
          <div className="space-y-4">
            {scrollDepthData.map((item, index) => (
              <div key={item.depth}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">{item.depth}</span>
                  <span className="text-white">{item.retention}% retention</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.retention}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`h-full rounded-full ${
                      item.retention >= 80 ? "bg-green-500" :
                      item.retention >= 60 ? "bg-cyan-500" :
                      item.retention >= 40 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Visual Page Representation */}
          <div className="mt-6 relative h-48 bg-slate-800/50 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-green-500/30 via-cyan-500/20 via-yellow-500/10 to-red-500/5" />
            <div className="absolute inset-x-0 top-[25%] border-t border-dashed border-green-500/50">
              <span className="absolute right-2 -top-3 text-xs text-green-400">25%</span>
            </div>
            <div className="absolute inset-x-0 top-[50%] border-t border-dashed border-cyan-500/50">
              <span className="absolute right-2 -top-3 text-xs text-cyan-400">50%</span>
            </div>
            <div className="absolute inset-x-0 top-[75%] border-t border-dashed border-yellow-500/50">
              <span className="absolute right-2 -top-3 text-xs text-yellow-400">75%</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
              Page Scroll Visualization
            </div>
          </div>
        </div>

        {/* Click Patterns */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-cyan-400" />
            Top Click Patterns
          </h3>
          <div className="space-y-3">
            {clickPatterns.map((pattern, index) => (
              <motion.div
                key={pattern.element}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white">{pattern.element}</p>
                  <span className="text-cyan-400 font-bold">{pattern.clicks.toLocaleString()} clicks</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs text-slate-400">{pattern.position}</Badge>
                  <span className="text-xs text-green-400">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    {pattern.conversion}% conversion
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Page Metrics Table */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <h3 className="font-semibold text-white">Page Performance Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="text-left p-4 text-xs text-slate-400">Page</th>
                <th className="text-center p-4 text-xs text-slate-400">Sessions</th>
                <th className="text-center p-4 text-xs text-slate-400">Avg. Scroll</th>
                <th className="text-center p-4 text-xs text-slate-400">Click Rate</th>
                <th className="text-center p-4 text-xs text-slate-400">CTA Success</th>
                <th className="text-center p-4 text-xs text-slate-400">Exit Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {pageMetrics.map((page, index) => (
                <motion.tr
                  key={page.page}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4 text-sm text-white">{page.page}</td>
                  <td className="p-4 text-center text-sm text-slate-300">{page.sessions.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className={`text-sm font-medium ${
                      page.avgScroll >= 80 ? "text-green-400" :
                      page.avgScroll >= 60 ? "text-cyan-400" : "text-yellow-400"
                    }`}>
                      {page.avgScroll}%
                    </span>
                  </td>
                  <td className="p-4 text-center text-sm text-cyan-400">{page.clickRate}%</td>
                  <td className="p-4 text-center text-sm text-green-400">{page.ctaSuccess}%</td>
                  <td className="p-4 text-center">
                    <span className={`text-sm ${
                      page.exitRate <= 30 ? "text-green-400" :
                      page.exitRate <= 40 ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {page.exitRate}%
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exit Point Analysis */}
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
        <h4 className="font-semibold text-orange-400 mb-4">High Exit Point Analysis</h4>
        <div className="grid grid-cols-3 gap-4">
          {exitPoints.map((point, index) => (
            <motion.div
              key={point.page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-slate-900/50 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-white">{point.page}</p>
                <Badge className="bg-red-500/20 text-red-400">{point.exitRate}% exit</Badge>
              </div>
              <p className="text-xs text-slate-400 mb-2">{point.reason}</p>
              <p className="text-xs text-cyan-400">💡 {point.suggestion}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeatmapBehavior;
