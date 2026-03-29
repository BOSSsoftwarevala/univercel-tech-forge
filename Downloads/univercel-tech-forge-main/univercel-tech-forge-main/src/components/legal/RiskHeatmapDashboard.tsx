import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  AlertTriangle, 
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Building2,
  User,
  Code,
  Users
} from "lucide-react";

const RiskHeatmapDashboard = () => {
  const riskZones = [
    { id: "mumbai", name: "Mumbai", type: "Franchise", risk: "low", score: 92, trend: "up" },
    { id: "delhi", name: "Delhi NCR", type: "Franchise", risk: "low", score: 88, trend: "stable" },
    { id: "bangalore", name: "Bangalore", type: "Franchise", risk: "medium", score: 75, trend: "down" },
    { id: "chennai", name: "Chennai", type: "Franchise", risk: "high", score: 62, trend: "down" },
    { id: "dubai", name: "Dubai", type: "Reseller", risk: "low", score: 91, trend: "up" },
    { id: "london", name: "London", type: "Reseller", risk: "low", score: 95, trend: "up" },
  ];

  const trustScores = [
    { category: "Franchise Partners", score: 85, count: 24, icon: Building2, trend: "+3%" },
    { category: "Developer Trust", score: 78, count: 156, icon: Code, trend: "-2%" },
    { category: "Reseller Network", score: 91, count: 89, icon: Users, trend: "+5%" },
    { category: "Lead Quality", score: 72, count: 1234, icon: User, trend: "+1%" },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return { bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-400" };
      case "medium": return { bg: "bg-amber-500/20", border: "border-amber-500/40", text: "text-amber-400" };
      case "high": return { bg: "bg-red-500/20", border: "border-red-500/40", text: "text-red-400" };
      default: return { bg: "bg-stone-500/20", border: "border-stone-500/40", text: "text-stone-400" };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Risk Heatmap Dashboard</h2>
          <p className="text-stone-500">Color-coded risk zones & vulnerability scoring</p>
        </div>
        <Badge className="bg-stone-800/50 text-stone-400 border-stone-700/50">
          <MapPin className="w-3 h-3 mr-1" />
          6 Regions Monitored
        </Badge>
      </div>

      {/* Trust Score Cards */}
      <div className="grid grid-cols-4 gap-4">
        {trustScores.map((item, index) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-stone-900/80 border-stone-800/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <item.icon className="w-5 h-5 text-amber-400" />
                  <div className={`flex items-center gap-1 text-xs ${
                    item.trend.startsWith("+") ? "text-emerald-400" : item.trend.startsWith("-") ? "text-red-400" : "text-stone-400"
                  }`}>
                    {item.trend.startsWith("+") ? <TrendingUp className="w-3 h-3" /> : 
                     item.trend.startsWith("-") ? <TrendingDown className="w-3 h-3" /> : null}
                    {item.trend}
                  </div>
                </div>
                <p className={`text-3xl font-bold ${
                  item.score >= 80 ? "text-emerald-400" :
                  item.score >= 70 ? "text-amber-400" :
                  "text-red-400"
                }`}>{item.score}%</p>
                <p className="text-sm text-stone-500 mt-1">{item.category}</p>
                <p className="text-xs text-stone-600">{item.count} entities</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Risk Heatmap Grid */}
      <Card className="bg-stone-900/80 border-stone-800/50">
        <CardHeader className="border-b border-stone-800/50">
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            Regional Risk Zones
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {riskZones.map((zone, index) => {
              const colors = getRiskColor(zone.risk);
              return (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl ${colors.bg} border ${colors.border} relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">{zone.name}</h4>
                      <Badge className="bg-stone-800/50 text-stone-400 border-stone-700/50 text-xs mt-1">
                        {zone.type}
                      </Badge>
                    </div>
                    <div className={`flex items-center gap-1 ${colors.text}`}>
                      {zone.trend === "up" && <TrendingUp className="w-4 h-4" />}
                      {zone.trend === "down" && <TrendingDown className="w-4 h-4" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-stone-500">Risk Score</p>
                      <p className={`text-2xl font-bold ${colors.text}`}>{zone.score}%</p>
                    </div>
                    <Badge className={`${colors.bg} ${colors.text} ${colors.border} uppercase`}>
                      {zone.risk === "low" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {zone.risk === "high" && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {zone.risk}
                    </Badge>
                  </div>

                  {/* Background Indicator */}
                  <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full ${
                    zone.risk === "low" ? "bg-emerald-500/10" :
                    zone.risk === "medium" ? "bg-amber-500/10" :
                    "bg-red-500/10"
                  }`} />
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm text-stone-400">Low Risk (80-100)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-500" />
              <span className="text-sm text-stone-400">Medium Risk (60-79)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <span className="text-sm text-stone-400">High Risk (0-59)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskHeatmapDashboard;
