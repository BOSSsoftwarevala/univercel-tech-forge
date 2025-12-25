import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, DollarSign, Target } from "lucide-react";

const MMOverview = () => {
  const stats = [
    { label: "Active Campaigns", value: "12", icon: Target, trend: "+2 this week" },
    { label: "Upcoming Schedules", value: "8", icon: Calendar, trend: "Next 7 days" },
    { label: "Spend vs Reach", value: "₹2.4L / 1.2M", icon: DollarSign, trend: "0.20 per reach" },
    { label: "Conversion Trend", value: "4.8%", icon: TrendingUp, trend: "+0.6% vs last week" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-700/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-slate-500 mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-emerald-400">Campaign Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-slate-500">
            Conversion trend visualization
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MMOverview;
