import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Download,
  TrendingUp,
  Clock,
  DollarSign
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const TransactionHeatmap = () => {
  const [viewMode, setViewMode] = useState("daily");
  
  // Generate heatmap data for 7 weeks (days of week x weeks)
  const generateHeatmapData = () => {
    const weeks = 7;
    const days = 7;
    const data: { week: number; day: number; value: number; date: string }[] = [];
    
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    
    for (let w = weeks - 1; w >= 0; w--) {
      for (let d = 0; d < days; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (w * 7 + (6 - d)));
        
        // Generate realistic transaction values
        const baseValue = d === 0 || d === 6 ? 5 : 15; // Lower on weekends
        const randomVariation = Math.floor(Math.random() * 25);
        const value = baseValue + randomVariation;
        
        data.push({
          week: weeks - 1 - w,
          day: d,
          value,
          date: date.toISOString().split('T')[0],
        });
      }
    }
    return data;
  };

  const heatmapData = generateHeatmapData();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getHeatColor = (value: number) => {
    if (value < 10) return "bg-cyan-100 dark:bg-cyan-900/30";
    if (value < 20) return "bg-cyan-300 dark:bg-cyan-800/50";
    if (value < 30) return "bg-cyan-500 dark:bg-cyan-700";
    return "bg-cyan-700 dark:bg-cyan-600";
  };

  const hourlyData = [
    { hour: "00:00", transactions: 2, volume: 498 },
    { hour: "02:00", transactions: 1, volume: 249 },
    { hour: "04:00", transactions: 0, volume: 0 },
    { hour: "06:00", transactions: 3, volume: 747 },
    { hour: "08:00", transactions: 8, volume: 2234 },
    { hour: "10:00", transactions: 15, volume: 4890 },
    { hour: "12:00", transactions: 12, volume: 3540 },
    { hour: "14:00", transactions: 18, volume: 5670 },
    { hour: "16:00", transactions: 22, volume: 7120 },
    { hour: "18:00", transactions: 14, volume: 4180 },
    { hour: "20:00", transactions: 9, volume: 2670 },
    { hour: "22:00", transactions: 5, volume: 1245 },
  ];

  const peakMetrics = [
    { label: "Peak Hour", value: "4:00 PM", subtext: "22 transactions", icon: Clock },
    { label: "Peak Day", value: "Thursday", subtext: "156 transactions", icon: Calendar },
    { label: "Avg Daily Volume", value: "$12,450", subtext: "+8.3% vs last week", icon: DollarSign },
    { label: "Weekly Trend", value: "+15.2%", subtext: "Growing steadily", icon: TrendingUp },
  ];

  const currencyBreakdown = [
    { currency: "USD", symbol: "$", transactions: 847, volume: 156420, percentage: 68 },
    { currency: "INR", symbol: "₹", transactions: 234, volume: 2845000, percentage: 22 },
    { currency: "EUR", symbol: "€", transactions: 89, volume: 18540, percentage: 8 },
    { currency: "GBP", symbol: "£", transactions: 23, volume: 4120, percentage: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transaction Heatmap</h1>
          <p className="text-slate-500 text-sm">Visualize transaction patterns and peak activity periods</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Peak Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {peakMetrics.map((metric, index) => (
          <Card key={index} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{metric.label}</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{metric.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{metric.subtext}</p>
                </div>
                <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                  <metric.icon className="w-5 h-5 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Heatmap Grid */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Weekly Transaction Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-2">
              {dayNames.map((day, i) => (
                <div key={i} className="h-8 flex items-center text-xs text-slate-500 w-8">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            <div className="flex-1">
              <div className="grid grid-cols-7 gap-1">
                {heatmapData.map((cell, index) => (
                  <div
                    key={index}
                    className={`h-8 rounded-sm ${getHeatColor(cell.value)} hover:ring-2 hover:ring-cyan-400 cursor-pointer transition-all group relative`}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {cell.date}: {cell.value} transactions
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-end gap-2 mt-4">
                <span className="text-xs text-slate-500">Less</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-sm bg-cyan-100 dark:bg-cyan-900/30" />
                  <div className="w-4 h-4 rounded-sm bg-cyan-300 dark:bg-cyan-800/50" />
                  <div className="w-4 h-4 rounded-sm bg-cyan-500 dark:bg-cyan-700" />
                  <div className="w-4 h-4 rounded-sm bg-cyan-700 dark:bg-cyan-600" />
                </div>
                <span className="text-xs text-slate-500">More</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Distribution & Currency Breakdown */}
      <div className="grid grid-cols-2 gap-6">
        {/* Hourly Distribution */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Hourly Distribution (Today)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {hourlyData.map((hour, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-12">{hour.hour}</span>
                  <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all"
                      style={{ width: `${(hour.transactions / 22) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 w-16 text-right">
                    {hour.transactions} txns
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Currency Breakdown */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Currency Distribution</CardTitle>
              <Badge variant="outline" className="text-xs">Multi-currency enabled</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currencyBreakdown.map((curr, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg">{curr.symbol}</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{curr.currency}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {curr.symbol}{curr.volume.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 ml-2">({curr.transactions} txns)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${curr.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionHeatmap;
