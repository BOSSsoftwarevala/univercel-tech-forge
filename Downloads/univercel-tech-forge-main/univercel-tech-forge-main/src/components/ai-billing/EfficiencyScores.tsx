import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown,
  Target,
  Zap,
  BarChart3,
  Award
} from "lucide-react";

interface EfficiencyScore {
  module: string;
  icon: string;
  score: number;
  trend: "up" | "down" | "stable";
  avgCostPerRequest: number;
  marketAvg: number;
  totalRequests: number;
  efficiency: "excellent" | "good" | "average" | "poor";
}

const efficiencyScores: EfficiencyScore[] = [
  { 
    module: "SEO", 
    icon: "🔍", 
    score: 92, 
    trend: "up", 
    avgCostPerRequest: 0.081, 
    marketAvg: 0.12,
    totalRequests: 5200,
    efficiency: "excellent"
  },
  { 
    module: "Chatbot", 
    icon: "💬", 
    score: 88, 
    trend: "up", 
    avgCostPerRequest: 0.079, 
    marketAvg: 0.10,
    totalRequests: 4800,
    efficiency: "excellent"
  },
  { 
    module: "Dev Assist", 
    icon: "💻", 
    score: 85, 
    trend: "stable", 
    avgCostPerRequest: 0.119, 
    marketAvg: 0.15,
    totalRequests: 2100,
    efficiency: "good"
  },
  { 
    module: "OCR", 
    icon: "📄", 
    score: 78, 
    trend: "down", 
    avgCostPerRequest: 0.053, 
    marketAvg: 0.06,
    totalRequests: 1800,
    efficiency: "good"
  },
  { 
    module: "Image Gen", 
    icon: "🖼️", 
    score: 72, 
    trend: "stable", 
    avgCostPerRequest: 0.076, 
    marketAvg: 0.08,
    totalRequests: 1020,
    efficiency: "average"
  },
  { 
    module: "Translation", 
    icon: "🌐", 
    score: 95, 
    trend: "up", 
    avgCostPerRequest: 0.052, 
    marketAvg: 0.08,
    totalRequests: 500,
    efficiency: "excellent"
  },
];

const getEfficiencyColor = (efficiency: EfficiencyScore["efficiency"]) => {
  switch (efficiency) {
    case "excellent":
      return "text-green-500";
    case "good":
      return "text-blue-500";
    case "average":
      return "text-amber-500";
    case "poor":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
};

const getScoreColor = (score: number) => {
  if (score >= 90) return "bg-green-500";
  if (score >= 75) return "bg-blue-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
};

export const EfficiencyScores = () => {
  const overallScore = Math.round(efficiencyScores.reduce((sum, s) => sum + s.score, 0) / efficiencyScores.length);
  const totalSavings = efficiencyScores.reduce((sum, s) => 
    sum + ((s.marketAvg - s.avgCostPerRequest) * s.totalRequests), 0
  );

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Overall Efficiency</p>
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold text-primary">{overallScore}%</p>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                Excellent
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Cost Optimization</p>
              <Target className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-500">₹{totalSavings.toFixed(2)}</p>
            <p className="text-xs text-green-400">Saved vs market rates</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Avg Cost/Request</p>
              <Zap className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-500">
              ₹{(efficiencyScores.reduce((sum, s) => sum + s.avgCostPerRequest, 0) / efficiencyScores.length).toFixed(3)}
            </p>
            <p className="text-xs text-blue-400">Per AI request</p>
          </CardContent>
        </Card>
      </div>

      {/* Module Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Module Efficiency Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {efficiencyScores.map((item) => (
              <div key={item.module} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.module}</span>
                        <Badge 
                          variant="outline" 
                          className={`capitalize ${getEfficiencyColor(item.efficiency)}`}
                        >
                          {item.efficiency}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.totalRequests.toLocaleString()} requests
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{item.score}%</span>
                    {item.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {item.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                    {item.trend === "stable" && <span className="text-muted-foreground">—</span>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress 
                    value={item.score} 
                    className="h-2"
                  />
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">
                        Your Cost: <span className="text-foreground font-medium">₹{item.avgCostPerRequest.toFixed(3)}</span>/req
                      </span>
                      <span className="text-muted-foreground">
                        Market Avg: <span className="text-red-400">₹{item.marketAvg.toFixed(3)}</span>/req
                      </span>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      {((1 - item.avgCostPerRequest / item.marketAvg) * 100).toFixed(0)}% cheaper
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-gradient-to-r from-amber-500/5 to-amber-600/10 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-amber-500" />
            Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <span className="text-lg">🖼️</span>
              <div>
                <p className="font-medium text-sm">Image Generation Optimization</p>
                <p className="text-xs text-muted-foreground">
                  Consider implementing batch processing for image generation requests to reduce per-request costs by up to 15%.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <span className="text-lg">📄</span>
              <div>
                <p className="font-medium text-sm">OCR Efficiency Alert</p>
                <p className="text-xs text-muted-foreground">
                  OCR efficiency has dropped 5% this week. Review document quality requirements and preprocessing steps.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
              <span className="text-lg">🌐</span>
              <div>
                <p className="font-medium text-sm">Translation Excellence</p>
                <p className="text-xs text-muted-foreground">
                  Translation module is performing exceptionally well at 95% efficiency. Consider using similar optimization patterns for other modules.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
