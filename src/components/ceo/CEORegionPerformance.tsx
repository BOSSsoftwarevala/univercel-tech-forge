import { motion } from "framer-motion";
import { Globe2, Users, Building2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface RegionPerf {
  region_name: string;
  total_users: number;
  active_franchises: number;
  risk_level: string;
}

interface CEORegionPerformanceProps {
  regions: RegionPerf[];
}

const COLORS = [
  'hsl(270, 80%, 60%)', 'hsl(200, 80%, 55%)', 'hsl(160, 70%, 50%)',
  'hsl(40, 90%, 55%)', 'hsl(340, 75%, 55%)', 'hsl(180, 60%, 50%)',
  'hsl(30, 85%, 55%)', 'hsl(280, 60%, 55%)',
];

const tooltipStyle = {
  contentStyle: {
    background: 'hsl(222, 47%, 11%)',
    border: '1px solid hsl(217, 33%, 25%)',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#fff',
  },
};

const riskBadge = (level: string) => {
  switch (level) {
    case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
    case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
    default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
  }
};

const CEORegionPerformance = ({ regions }: CEORegionPerformanceProps) => {
  const pieData = regions.map((r) => ({ name: r.region_name, value: r.total_users + r.active_franchises }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Region Distribution Pie */}
        <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-violet-400" />
              Regional Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-500 text-sm">No regional data</div>
            )}
          </CardContent>
        </Card>

        {/* Risk Overview */}
        <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Regional Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-lg font-bold text-emerald-400">{regions.filter((r) => r.risk_level === 'low').length}</p>
                <p className="text-[10px] text-emerald-500/70">LOW RISK</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                <p className="text-lg font-bold text-amber-400">{regions.filter((r) => r.risk_level === 'medium').length}</p>
                <p className="text-[10px] text-amber-500/70">MEDIUM</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                <p className="text-lg font-bold text-red-400">{regions.filter((r) => r.risk_level === 'high').length}</p>
                <p className="text-[10px] text-red-500/70">HIGH RISK</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Region Table */}
      <Card className="bg-slate-900/60 border-slate-700/40 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            All Regions
            <Badge className="text-[9px] bg-slate-700/50 text-slate-400">{regions.length} regions</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {regions.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
                  <div className="flex items-center gap-3">
                    <Globe2 className="w-4 h-4 text-violet-400" />
                    <div>
                      <p className="text-sm font-medium text-white">{r.region_name}</p>
                      <p className="text-[10px] text-slate-500">{r.active_franchises} franchises</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-300">{r.total_users}</span>
                    </div>
                    <Badge className={`text-[9px] ${riskBadge(r.risk_level)}`}>{r.risk_level.toUpperCase()}</Badge>
                  </div>
                </div>
              ))}
              {regions.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm">No regional data available</div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CEORegionPerformance;
