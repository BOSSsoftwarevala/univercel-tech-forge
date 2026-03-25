import { motion } from "framer-motion";
import { Activity, Shield, Server, Zap, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface HealthMetric {
  metric_name: string;
  score: number;
  benchmark: number;
  status: string;
}

interface CEOSystemHealthPanelProps {
  health: HealthMetric[];
  onRunScan?: () => void;
  scanLoading?: boolean;
}

const statusColor = (status: string, score: number) => {
  if (score >= 95) return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' };
  if (score >= 85) return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' };
  return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' };
};

const CEOSystemHealthPanel = ({ health, onRunScan, scanLoading }: CEOSystemHealthPanelProps) => {
  const avgScore = health.length > 0 ? Math.round(health.reduce((s, h) => s + h.score, 0) / health.length) : 0;
  const radarData = health.map((h) => ({ metric: h.metric_name, score: h.score, benchmark: h.benchmark }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Overall Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur col-span-1">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${avgScore >= 90 ? 'border-emerald-500/50' : avgScore >= 75 ? 'border-amber-500/50' : 'border-red-500/50'}`}>
              <span className="text-3xl font-bold text-white">{avgScore}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Overall Health Score</p>
            <Badge className={`mt-2 text-[10px] ${avgScore >= 90 ? 'bg-emerald-500/20 text-emerald-400' : avgScore >= 75 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
              {avgScore >= 90 ? 'HEALTHY' : avgScore >= 75 ? 'WARNING' : 'CRITICAL'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-400" />
              Health Radar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(217, 33%, 20%)" />
                  <PolarAngleAxis dataKey="metric" stroke="#64748b" fontSize={10} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} />
                  <Radar name="Score" dataKey="score" stroke="hsl(270, 80%, 60%)" fill="hsl(270, 80%, 60%)" fillOpacity={0.3} />
                  <Radar name="Benchmark" dataKey="benchmark" stroke="hsl(160, 70%, 50%)" fill="none" strokeDasharray="5 5" />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-500 text-sm">No health data</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Individual Metrics */}
      <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            System Metrics Detail
          </CardTitle>
          {onRunScan && (
            <button
              onClick={onRunScan}
              disabled={scanLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 transition disabled:opacity-50"
            >
              <Zap className="w-3 h-3" />
              {scanLoading ? 'Scanning...' : 'Run Scan'}
            </button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {health.map((h, i) => {
              const colors = statusColor(h.status, h.score);
              return (
                <div key={i} className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-white">{h.metric_name}</span>
                    {h.score >= h.benchmark ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <div className="flex items-end justify-between">
                    <span className={`text-2xl font-bold ${colors.text}`}>{h.score}</span>
                    <span className="text-[10px] text-slate-500">Benchmark: {h.benchmark}</span>
                  </div>
                  <Progress value={h.score} className="mt-2 h-1.5" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CEOSystemHealthPanel;
