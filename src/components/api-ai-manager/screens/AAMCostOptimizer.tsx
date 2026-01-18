import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  TrendingDown,
  DollarSign,
  Cpu,
  Gauge,
  Lightbulb,
  Check,
  ArrowRight,
  Zap,
  Settings,
  Eye
} from "lucide-react";

interface AAMCostOptimizerProps {
  activeSubSection: string;
}

const AAMCostOptimizer = ({ activeSubSection }: AAMCostOptimizerProps) => {
  const handleAction = (action: string) => {
    toast.success(`${action} executed successfully`);
  };

  const highCostApis = [
    { name: "OpenAI GPT-4", monthCost: "₹12,450", avgCost: "₹0.27/req", savingPotential: "₹2,400", alternative: "GPT-3.5 Turbo" },
    { name: "Vision AI", monthCost: "₹4,300", avgCost: "₹0.28/req", savingPotential: "₹1,100", alternative: "Open Source Model" },
    { name: "Video AI", monthCost: "₹3,800", avgCost: "₹2.00/req", savingPotential: "₹950", alternative: "Batch Processing" },
    { name: "Google Maps", monthCost: "₹6,250", avgCost: "₹0.25/req", savingPotential: "₹1,500", alternative: "OSM/Mapbox" },
  ];

  const recommendations = [
    {
      title: "Switch OpenAI to GPT-3.5 for simple queries",
      description: "Route simple queries to GPT-3.5 Turbo instead of GPT-4",
      savings: "₹2,400/month",
      impact: "Low",
      status: "suggested"
    },
    {
      title: "Enable token optimization",
      description: "Automatically reduce token usage by 20% using smart truncation",
      savings: "₹1,800/month",
      impact: "None",
      status: "suggested"
    },
    {
      title: "Batch Vision AI requests",
      description: "Process images in batches during off-peak hours",
      savings: "₹1,100/month",
      impact: "Medium",
      status: "applied"
    },
    {
      title: "Cache frequent API responses",
      description: "Enable response caching for repetitive queries",
      savings: "₹3,200/month",
      impact: "None",
      status: "suggested"
    },
    {
      title: "Downgrade Maps to Mapbox",
      description: "Switch from Google Maps to Mapbox for non-critical uses",
      savings: "₹1,500/month",
      impact: "Low",
      status: "rejected"
    },
  ];

  const autoOptimizations = [
    { name: "Auto Reduce Token Usage", enabled: true, savings: "₹1,200/month" },
    { name: "Auto Downgrade Speed Mode", enabled: false, savings: "₹800/month" },
    { name: "Cache API Responses", enabled: true, savings: "₹2,100/month" },
    { name: "Batch Processing", enabled: true, savings: "₹950/month" },
    { name: "Smart Routing", enabled: false, savings: "₹1,500/month" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Cost Optimizer</h1>
          <p className="text-slate-400 text-sm mt-1">Detect high costs and optimize API spending</p>
        </div>
        <Button
          size="sm"
          onClick={() => handleAction("Run Full Analysis")}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Zap className="w-4 h-4 mr-2" />
          Run Analysis
        </Button>
      </div>

      {/* Savings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">₹4,250</p>
                <p className="text-xs text-green-400">Monthly Savings Applied</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <TrendingDown className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">₹8,700</p>
                <p className="text-xs text-purple-400">Potential Additional Savings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Lightbulb className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">5</p>
                <p className="text-xs text-blue-400">Active Recommendations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Cost APIs */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-red-400" />
              High-Cost APIs Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highCostApis.map((api) => (
                <div
                  key={api.name}
                  className="p-3 rounded-lg bg-slate-800/50 border border-white/5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-white">{api.name}</p>
                    <p className="text-sm font-bold text-red-400">{api.monthCost}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Avg: {api.avgCost}</span>
                    <span className="text-green-400">Save: {api.savingPotential}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Alternative: {api.alternative}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs text-purple-400 hover:text-purple-300"
                      onClick={() => handleAction(`Optimize ${api.name}`)}
                    >
                      Optimize
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Auto Optimizations */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              Auto Optimizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {autoOptimizations.map((opt) => (
                <div
                  key={opt.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={opt.enabled}
                      onCheckedChange={() => handleAction(`Toggle ${opt.name}`)}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{opt.name}</p>
                      <p className="text-xs text-green-400">Saves {opt.savings}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-white"
                    onClick={() => handleAction(`View ${opt.name}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Cost Saving Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <motion.div
                key={rec.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border ${
                  rec.status === 'applied'
                    ? 'bg-green-500/10 border-green-500/30'
                    : rec.status === 'rejected'
                    ? 'bg-slate-800/30 border-slate-700/50 opacity-60'
                    : 'bg-slate-800/50 border-white/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-white">{rec.title}</p>
                      <Badge
                        variant="outline"
                        className={
                          rec.status === 'applied'
                            ? 'text-green-400 border-green-400/30'
                            : rec.status === 'rejected'
                            ? 'text-slate-400 border-slate-400/30'
                            : 'text-yellow-400 border-yellow-400/30'
                        }
                      >
                        {rec.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">{rec.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className="text-green-400">Saves: {rec.savings}</span>
                      <span className="text-slate-400">Impact: {rec.impact}</span>
                    </div>
                  </div>
                  {rec.status === 'suggested' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleAction(`Apply: ${rec.title}`)}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Apply
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AAMCostOptimizer;
