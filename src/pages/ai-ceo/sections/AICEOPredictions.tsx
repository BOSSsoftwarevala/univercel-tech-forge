import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  AlertTriangle,
  DollarSign,
  Users,
  Server,
  Zap
} from "lucide-react";

// Mock prediction data
const predictions = [
  {
    id: 1,
    title: "Revenue Growth Expected",
    type: "positive",
    timeline: "Next 7 days",
    confidence: 89,
    detail: "Based on current lead pipeline and conversion rates, expect 15% revenue increase",
    icon: DollarSign
  },
  {
    id: 2,
    title: "System Overload Risk",
    type: "warning",
    timeline: "Next 30 days",
    confidence: 72,
    detail: "Traffic patterns suggest server capacity may reach 85% during peak hours",
    icon: Server
  },
  {
    id: 3,
    title: "Staff Burnout Detected",
    type: "negative",
    timeline: "Next quarter",
    confidence: 68,
    detail: "Support team overtime hours trending 40% above healthy threshold",
    icon: Users
  },
  {
    id: 4,
    title: "High-Risk Deal Identified",
    type: "warning",
    timeline: "Next 7 days",
    confidence: 81,
    detail: "Client #456 showing payment delay patterns similar to past defaults",
    icon: AlertTriangle
  },
  {
    id: 5,
    title: "Feature Adoption Surge",
    type: "positive",
    timeline: "Next 30 days",
    confidence: 85,
    detail: "New reporting module adoption trending 3x higher than projected",
    icon: Zap
  },
];

const timelineData = {
  sevenDays: [
    { label: "Revenue", prediction: "+12%", confidence: 89 },
    { label: "New Leads", prediction: "+45", confidence: 78 },
    { label: "Support Load", prediction: "Normal", confidence: 92 },
  ],
  thirtyDays: [
    { label: "Churn Risk", prediction: "2 clients", confidence: 71 },
    { label: "Expansion", prediction: "3 regions", confidence: 65 },
    { label: "Hiring Need", prediction: "+5 support", confidence: 82 },
  ],
  quarter: [
    { label: "Market Share", prediction: "+2.3%", confidence: 58 },
    { label: "Infrastructure", prediction: "Upgrade needed", confidence: 76 },
    { label: "Compliance", prediction: "Audit due", confidence: 95 },
  ],
};

const getTypeStyle = (type: string) => {
  switch (type) {
    case 'positive': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'negative': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' };
    case 'warning': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' };
    default: return { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' };
  }
};

const AICEOPredictions = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 flex items-center justify-center shadow-xl shadow-yellow-500/20">
            <Lightbulb className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Predictive Insights</h1>
            <p className="text-cyan-400/80">AI-powered future state predictions</p>
          </div>
        </div>
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <Lightbulb className="w-3 h-3 mr-1" />
          ML-Powered Forecasting
        </Badge>
      </div>

      {/* Timeline Predictions */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(timelineData).map(([key, items], i) => {
          const titles = { sevenDays: "Next 7 Days", thirtyDays: "Next 30 Days", quarter: "Next Quarter" };
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    {titles[key as keyof typeof titles]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item, j) => (
                    <div key={j} className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{item.prediction}</span>
                        <Badge variant="outline" className="text-xs">{item.confidence}%</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Predictions */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Active Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {predictions.map((prediction, i) => {
                const style = getTypeStyle(prediction.type);
                return (
                  <motion.div
                    key={prediction.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-5 rounded-xl bg-slate-800/50 border ${style.border} hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center`}>
                          <prediction.icon className={`w-6 h-6 ${style.text}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{prediction.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-sm text-slate-400">{prediction.timeline}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={`${style.bg} ${style.text}`}>
                        {prediction.type === 'positive' ? <TrendingUp className="w-3 h-3 mr-1" /> : 
                         prediction.type === 'negative' ? <TrendingDown className="w-3 h-3 mr-1" /> :
                         <AlertTriangle className="w-3 h-3 mr-1" />}
                        {prediction.type}
                      </Badge>
                    </div>

                    <p className="text-sm text-slate-400 mb-3">{prediction.detail}</p>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-500">AI Confidence:</span>
                      <Progress value={prediction.confidence} className="h-1.5 flex-1" />
                      <span className={`text-sm font-medium ${style.text}`}>{prediction.confidence}%</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* AI Notice */}
      <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
          <p className="text-sm text-yellow-400/80">
            <strong>Predictive Notice:</strong> These are AI-generated forecasts based on historical patterns. Actual outcomes may vary.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICEOPredictions;
