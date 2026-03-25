import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const generateHeatmapData = () => {
  const data = [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);
  
  for (let d = 0; d < days.length; d++) {
    for (let h = 0; h < hours.length; h++) {
      data.push({
        day: days[d],
        hour: hours[h],
        value: Math.floor(Math.random() * 100),
        trend: Math.random() > 0.5 ? "up" : "down",
      });
    }
  }
  return data;
};

const weeklyData = [
  { week: "Week 1", scores: [78, 82, 85, 88, 92, 94, 89] },
  { week: "Week 2", scores: [82, 84, 87, 85, 90, 93, 91] },
  { week: "Week 3", scores: [85, 88, 90, 92, 95, 94, 96] },
  { week: "Week 4", scores: [88, 90, 92, 94, 97, 96, 98] },
];

const getCellColor = (value: number) => {
  if (value >= 90) return "bg-emerald-500";
  if (value >= 80) return "bg-emerald-400";
  if (value >= 70) return "bg-cyan-500";
  if (value >= 60) return "bg-cyan-400";
  if (value >= 50) return "bg-amber-500";
  if (value >= 40) return "bg-amber-400";
  return "bg-rose-500";
};

const getCellOpacity = (value: number) => {
  return 0.3 + (value / 100) * 0.7;
};

export const PerformanceHeatmap = () => {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");
  const heatmapData = generateHeatmapData();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Live Performance Heatmap
          </h2>
          <p className="text-slate-400 text-sm mt-1">Visual performance distribution — Green strong, Red weak</p>
        </div>
        
        <div className="flex items-center gap-2">
          {["daily", "weekly", "monthly"].map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p as any)}
              className={period === p 
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50" 
                : "border-slate-700 text-slate-400"
              }
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Weekly Performance Grid */}
      <Card className="p-6 bg-slate-900/50 backdrop-blur-xl border-cyan-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-white">Weekly Trend Analysis</h3>
        </div>
        
        <div className="space-y-4">
          {weeklyData.map((week, weekIndex) => (
            <motion.div
              key={week.week}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: weekIndex * 0.1 }}
            >
              <span className="w-20 text-sm text-slate-400">{week.week}</span>
              <div className="flex-1 flex gap-2">
                {week.scores.map((score, dayIndex) => (
                  <motion.div
                    key={dayIndex}
                    className={`flex-1 h-12 rounded-lg ${getCellColor(score)} flex items-center justify-center relative overflow-hidden`}
                    style={{ opacity: getCellOpacity(score) }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: weekIndex * 0.1 + dayIndex * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-white font-semibold text-sm z-10">{score}</span>
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      animate={{ opacity: [0, 0.2, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: (weekIndex + dayIndex) * 0.2 }}
                    />
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-1 w-16">
                {week.scores[6] > week.scores[0] ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                )}
                <span className={`text-sm ${week.scores[6] > week.scores[0] ? "text-emerald-400" : "text-rose-400"}`}>
                  {week.scores[6] > week.scores[0] ? "+" : ""}{week.scores[6] - week.scores[0]}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Day Labels */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700/50">
          <span className="w-20"></span>
          <div className="flex-1 flex gap-2">
            {days.map((day) => (
              <div key={day} className="flex-1 text-center text-xs text-slate-500">
                {day}
              </div>
            ))}
          </div>
          <div className="w-16"></div>
        </div>
      </Card>

      {/* Hourly Heatmap */}
      <Card className="p-6 bg-slate-900/50 backdrop-blur-xl border-cyan-500/30">
        <h3 className="font-semibold text-white mb-4">Hourly Activity Heatmap</h3>
        
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Hour Headers */}
            <div className="flex mb-2">
              <div className="w-16"></div>
              {hours.map((hour) => (
                <div key={hour} className="flex-1 text-center text-xs text-slate-500">
                  {hour}
                </div>
              ))}
            </div>

            {/* Day Rows */}
            {days.map((day, dayIndex) => (
              <div key={day} className="flex items-center mb-1">
                <div className="w-16 text-sm text-slate-400">{day}</div>
                <div className="flex-1 flex gap-1">
                  {hours.map((hour, hourIndex) => {
                    const cellData = heatmapData.find(d => d.day === day && d.hour === hour);
                    const value = cellData?.value || 0;
                    
                    return (
                      <motion.div
                        key={hour}
                        className={`flex-1 h-8 rounded ${getCellColor(value)} cursor-pointer relative group`}
                        style={{ opacity: getCellOpacity(value) }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: (dayIndex * hours.length + hourIndex) * 0.01 }}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-slate-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                          {day} {hour}: {value}%
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-slate-700/50">
          <span className="text-xs text-slate-500">Low</span>
          <div className="flex gap-1">
            {[20, 40, 60, 80, 100].map((val) => (
              <div
                key={val}
                className={`w-8 h-4 rounded ${getCellColor(val)}`}
                style={{ opacity: getCellOpacity(val) }}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">High</span>
        </div>
      </Card>
    </div>
  );
};
