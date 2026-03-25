import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Globe, Link2, Search, Users, Shield,
  BarChart3, Target, Zap, ArrowUpRight, ArrowDownRight,
  FileText, Wand2, ExternalLink, ChevronDown
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface SEOMetricsProps {
  activeRegion: string;
}

const SEOMetrics = ({ activeRegion }: SEOMetricsProps) => {
  const [selectedCountry, setSelectedCountry] = useState("All Countries");

  const countries = [
    "All Countries",
    "India", "UAE", "Saudi Arabia", "Kenya", "Nigeria", 
    "South Africa", "Egypt", "Singapore", "Malaysia", "Indonesia"
  ];

  const metrics = [
    { 
      label: "Global Ranking", 
      value: "#12", 
      change: "+5", 
      trend: "up",
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-500"
    },
    { 
      label: "Keyword Health", 
      value: "94%", 
      change: "+2.3%", 
      trend: "up",
      icon: Search,
      color: "from-emerald-500 to-teal-500"
    },
    { 
      label: "Traffic Prediction", 
      value: "45.2K", 
      change: "+18%", 
      trend: "up",
      icon: Users,
      color: "from-purple-500 to-pink-500"
    },
    { 
      label: "Backlink Authority", 
      value: "72", 
      change: "+8", 
      trend: "up",
      icon: Link2,
      color: "from-orange-500 to-amber-500"
    },
    { 
      label: "Content Score", 
      value: "89%", 
      change: "+5.2%", 
      trend: "up",
      icon: FileText,
      color: "from-blue-500 to-indigo-500"
    },
    { 
      label: "Spam Shield", 
      value: "Active", 
      change: "Clean", 
      trend: "up",
      icon: Shield,
      color: "from-green-500 to-emerald-500"
    },
  ];

  const topPages = [
    { url: "/pos-software", traffic: "12.5K", position: 3, change: "+2" },
    { url: "/hospital-management", traffic: "8.2K", position: 5, change: "+1" },
    { url: "/school-erp", traffic: "6.8K", position: 7, change: "-1" },
    { url: "/real-estate-crm", traffic: "5.4K", position: 9, change: "+3" },
    { url: "/restaurant-pos", traffic: "4.1K", position: 12, change: "+5" },
  ];

  const trafficData = [
    { name: "Jan", organic: 4000, paid: 2400 },
    { name: "Feb", organic: 5000, paid: 2800 },
    { name: "Mar", organic: 6200, paid: 3200 },
    { name: "Apr", organic: 7800, paid: 3600 },
    { name: "May", organic: 9500, paid: 4000 },
    { name: "Jun", organic: 12000, paid: 4200 },
  ];

  const regionData = [
    { name: "Africa", value: 35, color: "#06b6d4" },
    { name: "Asia", value: 40, color: "#8b5cf6" },
    { name: "Middle East", value: 25, color: "#f59e0b" },
  ];

  const handleAutoAction = (action: string) => {
    toast.success(`${action} started! AI is processing...`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">SEO Command Center</h2>
          <p className="text-slate-400">Real-time search domination metrics</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Country Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700">
                <Globe className="w-4 h-4 mr-2" />
                {selectedCountry}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-900 border-slate-700">
              {countries.map((country) => (
                <DropdownMenuItem 
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className="text-white hover:bg-slate-800 cursor-pointer"
                >
                  {country}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAutoAction("Full SEO Optimization")}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-sm font-semibold flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Run Full Optimization
          </motion.button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-4 gap-4">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAutoAction("Auto Keyword Research")}
          className="p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg group-hover:bg-cyan-500/30 transition-colors">
              <Search className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Auto Keyword Research</p>
              <p className="text-xs text-slate-400">AI-powered discovery</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAutoAction("Auto SEO Page Creation")}
          className="p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Auto SEO Page</p>
              <p className="text-xs text-slate-400">Generate optimized pages</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAutoAction("Auto Internal Linking")}
          className="p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-emerald-500/30 hover:border-emerald-400/50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
              <Link2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Auto Internal Linking</p>
              <p className="text-xs text-slate-400">Smart link structure</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAutoAction("Auto Meta Generation")}
          className="p-4 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-amber-500/30 hover:border-amber-400/50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg group-hover:bg-amber-500/30 transition-colors">
              <Wand2 className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">Auto Meta Tags</p>
              <p className="text-xs text-slate-400">Title & description</p>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-cyan-500/30 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color} bg-opacity-20`}>
                <metric.icon className="w-5 h-5 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                metric.trend === "up" ? "text-green-400" : "text-red-400"
              }`}>
                {metric.trend === "up" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {metric.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-white">{metric.value}</p>
              <p className="text-sm text-slate-400">{metric.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts & Top Pages Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-1 p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Traffic Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1e293b", 
                  border: "1px solid #334155",
                  borderRadius: "8px"
                }}
              />
              <Area type="monotone" dataKey="organic" stroke="#06b6d4" fillOpacity={1} fill="url(#colorOrganic)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Pages Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Top Pages Performance</h3>
          <div className="space-y-3">
            {topPages.map((page, index) => (
              <div key={page.url} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-4">#{index + 1}</span>
                  <div>
                    <p className="text-sm text-white">{page.url}</p>
                    <p className="text-xs text-slate-400">{page.traffic} visits</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-cyan-400">#{page.position}</span>
                  <span className={`text-xs ${page.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {page.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Region Heatmap */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-1 p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Market Heatmap</h3>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              {regionData.map((region) => (
                <div key={region.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: region.color }} />
                  <span className="text-xs text-slate-400">{region.name} {region.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Backlinks Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Backlinks Overview</h3>
          <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700 text-white">
            <ExternalLink className="w-4 h-4 mr-2" />
            View All Backlinks
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-cyan-400">2,847</p>
            <p className="text-sm text-slate-400">Total Backlinks</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-emerald-400">156</p>
            <p className="text-sm text-slate-400">Referring Domains</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-400">89</p>
            <p className="text-sm text-slate-400">High Authority</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-amber-400">+24</p>
            <p className="text-sm text-slate-400">New This Week</p>
          </div>
        </div>
      </motion.div>

      {/* AI Insight Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl border border-cyan-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Target className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">AI Insight — Today's Priority Actions</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { text: "Add 2 blogs for Real-Estate category", priority: "high" },
            { text: "Optimize meta tags for Hospital Software", priority: "medium" },
            { text: "Build 5 backlinks for POS industry", priority: "medium" },
            { text: "Update schema for School Management pages", priority: "low" },
          ].map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg group hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  suggestion.priority === "high" ? "bg-red-400" :
                  suggestion.priority === "medium" ? "bg-yellow-400" : "bg-green-400"
                }`} />
                <span className="text-sm text-slate-300">{suggestion.text}</span>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400 hover:text-cyan-300"
                onClick={() => handleAutoAction(suggestion.text)}
              >
                <Zap className="w-3 h-3 mr-1" />
                Run
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SEOMetrics;
