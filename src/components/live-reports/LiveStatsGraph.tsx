import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LiveActivityLog } from '@/hooks/useLiveActivityLogs';

interface LiveStatsGraphProps {
  logs: LiveActivityLog[];
}

export function LiveStatsGraph({ logs }: LiveStatsGraphProps) {
  // Process logs into hourly data
  const processLogsForChart = () => {
    const hourlyData: Record<string, { hour: string; success: number; warning: number }> = {};
    
    // Initialize with some hours for better display
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const hour = new Date(now);
      hour.setHours(hour.getHours() - i);
      const hourKey = hour.toLocaleString('default', { month: 'short' });
      const dayKey = `${hourKey} ${hour.getDate()}`;
      if (!hourlyData[dayKey]) {
        hourlyData[dayKey] = { hour: dayKey, success: 0, warning: 0 };
      }
    }
    
    logs.forEach(log => {
      const date = new Date(log.created_at);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      const dayKey = `${monthKey} ${date.getDate()}`;
      
      if (!hourlyData[dayKey]) {
        hourlyData[dayKey] = { hour: dayKey, success: 0, warning: 0 };
      }
      
      if (log.status === 'success') hourlyData[dayKey].success++;
      if (log.status === 'warning' || log.is_abnormal) hourlyData[dayKey].warning++;
    });

    return Object.values(hourlyData);
  };

  const chartData = processLogsForChart();

  return (
    <div className="h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="warningGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
          <XAxis 
            dataKey="hour" 
            stroke="#444" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#444" 
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v / 1000}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1a1a2e',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="success" 
            stroke="#a78bfa" 
            fill="url(#successGradient)" 
            strokeWidth={2}
            dot={{ fill: '#a78bfa', strokeWidth: 0, r: 3 }}
          />
          <Area 
            type="monotone" 
            dataKey="warning" 
            stroke="#fbbf24" 
            fill="url(#warningGradient)" 
            strokeWidth={2}
            dot={{ fill: '#fbbf24', strokeWidth: 0, r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
