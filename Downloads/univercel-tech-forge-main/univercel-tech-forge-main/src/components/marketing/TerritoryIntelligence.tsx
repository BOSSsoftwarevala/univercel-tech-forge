import { motion } from "framer-motion";
import { Globe, TrendingUp, TrendingDown, DollarSign, Users, Target, AlertTriangle, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TerritoryIntelligenceProps {
  fullView?: boolean;
}

const TerritoryIntelligence = ({ fullView = false }: TerritoryIntelligenceProps) => {
  const regions = [
    {
      name: "India - North",
      demand: 92,
      budget: 150000,
      spent: 98000,
      leads: 456,
      roi: 380,
      trend: "up",
      competitors: 3,
    },
    {
      name: "India - South",
      demand: 88,
      budget: 120000,
      spent: 89000,
      leads: 378,
      roi: 320,
      trend: "up",
      competitors: 4,
    },
    {
      name: "Middle East",
      demand: 76,
      budget: 200000,
      spent: 145000,
      leads: 189,
      roi: 245,
      trend: "stable",
      competitors: 2,
    },
    {
      name: "Europe",
      demand: 65,
      budget: 80000,
      spent: 42000,
      leads: 67,
      roi: 180,
      trend: "down",
      competitors: 5,
    },
  ];

  const aiInsights = [
    { region: "India - North", insight: "Festival season approaching - recommend 40% budget increase", priority: "high" },
    { region: "Middle East", insight: "Competitor XYZ launching similar product - preemptive campaign advised", priority: "medium" },
    { region: "Europe", insight: "Low conversion - suggest retargeting with localized content", priority: "low" },
  ];

  return (
    <Card className={`bg-slate-900/50 border-teal-500/20 backdrop-blur-xl ${fullView ? "min-h-[700px]" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-teal-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-400" />
            Territory Intelligence
          </CardTitle>
          <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/40">
            4 Active Regions
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Region Cards */}
        <div className={`grid ${fullView ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
          {regions.slice(0, fullView ? 4 : 2).map((region, index) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-200">{region.name}</h4>
                <div className="flex items-center gap-2">
                  {region.trend === "up" && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                  {region.trend === "down" && <TrendingDown className="w-4 h-4 text-red-400" />}
                  {region.trend === "stable" && <span className="text-xs text-slate-500">—</span>}
                  <Badge className={`${
                    region.demand >= 85 ? "bg-emerald-500/20 text-emerald-400" :
                    region.demand >= 70 ? "bg-amber-500/20 text-amber-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {region.demand}% demand
                  </Badge>
                </div>
              </div>

              {/* Budget */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Budget Utilization</span>
                  <span className="text-teal-400">₹{(region.spent / 1000).toFixed(0)}K / ₹{(region.budget / 1000).toFixed(0)}K</span>
                </div>
                <Progress value={(region.spent / region.budget) * 100} className="h-1.5 bg-slate-700" />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded-lg bg-slate-900/50">
                  <Users className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
                  <p className="text-lg font-bold text-white">{region.leads}</p>
                  <p className="text-xs text-slate-500">Leads</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-900/50">
                  <TrendingUp className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
                  <p className="text-lg font-bold text-white">{region.roi}%</p>
                  <p className="text-xs text-slate-500">ROI</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-slate-900/50">
                  <Target className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                  <p className="text-lg font-bold text-white">{region.competitors}</p>
                  <p className="text-xs text-slate-500">Competitors</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Insights */}
        {fullView && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 space-y-3"
          >
            <h4 className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              AI Territory Insights
            </h4>
            {aiInsights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`p-3 rounded-lg border ${
                  item.priority === "high" 
                    ? "bg-orange-500/10 border-orange-500/20" 
                    : item.priority === "medium"
                    ? "bg-amber-500/10 border-amber-500/20"
                    : "bg-slate-800/50 border-slate-700/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  {item.priority === "high" && <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />}
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{item.region}</p>
                    <p className="text-sm text-slate-200">{item.insight}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default TerritoryIntelligence;
