import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LiveActivityLog } from '@/hooks/useLiveActivityLogs';
import { EmptyState } from '@/components/ui/empty-state';

interface LiveStatsGraphProps {
  logs: LiveActivityLog[];
}

export function LiveStatsGraph({ logs }: LiveStatsGraphProps) {
  // Process real logs into monthly data
  const processLogsForChart = () => {
    if (logs.length === 0) return [];

    const monthlyData: Record<string, { month: string; success: number; warning: number }> = {};
    
    logs.forEach(log => {
      const date = new Date(log.created_at);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, success: 0, warning: 0 };
      }
      
      if (log.status === 'success') monthlyData[monthKey].success++;
      if (log.status === 'warning' || log.is_abnormal) monthlyData[monthKey].warning++;
    });

    return Object.values(monthlyData);
  };

  const chartData = processLogsForChart();

  if (chartData.length === 0) {
    return (
      <div className="h-[220px] flex items-center justify-center">
        <EmptyState title="No activity data" description="Activity trends will appear when logs are recorded" />
      </div>
    );
  }

  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="warningGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" vertical={false} />
          <XAxis dataKey="month" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: '12px', color: '#fff', fontSize: '12px', padding: '12px' }}
            labelStyle={{ color: '#888', marginBottom: '4px' }}
          />
          <Area type="monotone" dataKey="success" stroke="#a78bfa" fill="url(#successGradient)" strokeWidth={2.5}
            dot={{ fill: '#a78bfa', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#a78bfa', stroke: '#fff', strokeWidth: 2 }} />
          <Area type="monotone" dataKey="warning" stroke="#fbbf24" fill="url(#warningGradient)" strokeWidth={2.5}
            dot={{ fill: '#fbbf24', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#fbbf24', stroke: '#fff', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
