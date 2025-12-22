import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, TrendingUp } from 'lucide-react';
import { LiveActivityLog } from '@/hooks/useLiveActivityLogs';

interface LiveStatsGraphProps {
  logs: LiveActivityLog[];
  title?: string;
}

export function LiveStatsGraph({ logs, title = "Activity Timeline" }: LiveStatsGraphProps) {
  // Process logs into hourly data
  const processLogsForChart = () => {
    const hourlyData: Record<string, { hour: string; total: number; success: number; fail: number; warning: number }> = {};
    
    logs.forEach(log => {
      const date = new Date(log.created_at);
      const hourKey = `${date.getHours().toString().padStart(2, '0')}:00`;
      
      if (!hourlyData[hourKey]) {
        hourlyData[hourKey] = { hour: hourKey, total: 0, success: 0, fail: 0, warning: 0 };
      }
      
      hourlyData[hourKey].total++;
      if (log.status === 'success') hourlyData[hourKey].success++;
      if (log.status === 'fail') hourlyData[hourKey].fail++;
      if (log.status === 'warning' || log.is_abnormal) hourlyData[hourKey].warning++;
    });

    return Object.values(hourlyData).sort((a, b) => a.hour.localeCompare(b.hour));
  };

  // Process logs by action type
  const processLogsByAction = () => {
    const actionData: Record<string, number> = {};
    
    logs.forEach(log => {
      const action = log.action_type.replace('_', ' ');
      actionData[action] = (actionData[action] || 0) + 1;
    });

    return Object.entries(actionData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  };

  const timelineData = processLogsForChart();
  const actionData = processLogsByAction();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-[#12121a] border-gray-800/50 shadow-xl">
          <CardHeader className="pb-2 border-b border-gray-800/50">
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a3e635" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#a3e635" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#666" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#666" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a2e',
                      border: '1px solid #333',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#f59e0b" 
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="success" 
                    stroke="#a3e635" 
                    fillOpacity={1} 
                    fill="url(#colorSuccess)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity by Action Type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-[#12121a] border-gray-800/50 shadow-xl">
          <CardHeader className="pb-2 border-b border-gray-800/50">
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Activity className="w-5 h-5 text-violet-400" />
              Activities by Type
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={actionData} layout="vertical">
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6"/>
                      <stop offset="100%" stopColor="#a78bfa"/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                  <XAxis type="number" stroke="#666" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#666" 
                    fontSize={10}
                    width={80}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a2e',
                      border: '1px solid #333',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#barGradient)" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
