import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MousePointer, Target, TrendingUp } from "lucide-react";

const MMPerformance = () => {
  const metrics = [
    { label: "Total Reach", value: "4.2M", icon: Eye, change: "+12%", positive: true },
    { label: "CTR", value: "3.8%", icon: MousePointer, change: "+0.4%", positive: true },
    { label: "Conversions", value: "12,450", icon: Target, change: "+8%", positive: true },
    { label: "ROI", value: "4.2x", icon: TrendingUp, change: "+0.3x", positive: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-white">Performance Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {metric.label}
                </CardTitle>
                <metric.icon className="h-5 w-5 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <p className={`text-xs mt-1 ${metric.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {metric.change} vs last period
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-emerald-400">Reach Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-slate-500">
              Reach trend chart
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-emerald-400">Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-slate-500">
              Conversion funnel visualization
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-emerald-400">Channel Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { channel: "Social Media", reach: "1.8M", ctr: "4.2%", conversions: "5,200", roi: "5.1x" },
              { channel: "Email", reach: "0.9M", ctr: "3.8%", conversions: "3,100", roi: "6.2x" },
              { channel: "Display", reach: "1.2M", ctr: "2.1%", conversions: "2,800", roi: "3.4x" },
              { channel: "PPC", reach: "0.3M", ctr: "5.5%", conversions: "1,350", roi: "4.8x" },
            ].map((row) => (
              <div key={row.channel} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <span className="text-white font-medium w-32">{row.channel}</span>
                <div className="flex gap-8 text-sm">
                  <div className="text-center">
                    <p className="text-slate-400">Reach</p>
                    <p className="text-white font-medium">{row.reach}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400">CTR</p>
                    <p className="text-white font-medium">{row.ctr}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400">Conversions</p>
                    <p className="text-white font-medium">{row.conversions}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400">ROI</p>
                    <p className="text-emerald-400 font-medium">{row.roi}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MMPerformance;
