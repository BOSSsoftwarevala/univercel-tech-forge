import React from 'react';
import { Activity, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const APIMonitoring: React.FC = () => {
  const latencyData = [
    { time: '00:00', value: 45 },
    { time: '04:00', value: 42 },
    { time: '08:00', value: 65 },
    { time: '12:00', value: 78 },
    { time: '16:00', value: 85 },
    { time: '20:00', value: 52 },
    { time: 'Now', value: 48 },
  ];

  const errorSpikes = [
    { time: '08:15', count: 23, type: 'Timeout', resolved: true },
    { time: '12:45', count: 8, type: '429 Rate Limit', resolved: true },
    { time: '16:30', count: 45, type: '503 Service Unavailable', resolved: true },
    { time: '18:00', count: 5, type: 'Connection Refused', resolved: false },
  ];

  const throughputMetrics = [
    { name: 'Payment API', current: '2,450/min', peak: '3,200/min', status: 'normal' },
    { name: 'SMS Gateway', current: '890/min', peak: '1,500/min', status: 'normal' },
    { name: 'AI Gateway', current: '45/min', peak: '50/min', status: 'high' },
    { name: 'Email Service', current: '320/min', peak: '500/min', status: 'normal' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Monitoring</h2>
        <p className="text-muted-foreground">Real-time API performance and health metrics</p>
      </div>

      {/* Latency Chart */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            Latency (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between gap-2">
            {latencyData.map((point, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-blue-500/50 rounded-t"
                  style={{ height: `${(point.value / 100) * 150}px` }}
                />
                <span className="text-xs text-muted-foreground">{point.time}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm">
            <span className="text-muted-foreground">Average: <span className="text-blue-400 font-mono">52ms</span></span>
            <span className="text-muted-foreground">Peak: <span className="text-yellow-400 font-mono">85ms</span></span>
            <span className="text-muted-foreground">P99: <span className="text-green-400 font-mono">120ms</span></span>
          </div>
        </CardContent>
      </Card>

      {/* Error Spikes */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Error Spikes (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {errorSpikes.map((spike, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                spike.resolved ? 'bg-muted/30 border-border/30' : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-muted-foreground">{spike.time}</span>
                  <span className="text-foreground">{spike.type}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-mono ${spike.count > 20 ? 'text-red-400' : 'text-yellow-400'}`}>
                    {spike.count} errors
                  </span>
                  <span className={`text-sm ${spike.resolved ? 'text-green-400' : 'text-red-400'}`}>
                    {spike.resolved ? 'Resolved' : 'Active'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Throughput */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-400" />
            Throughput
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {throughputMetrics.map((metric, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">{metric.name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    metric.status === 'high' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {metric.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current: <span className="text-blue-400 font-mono">{metric.current}</span></span>
                  <span className="text-muted-foreground">Peak: <span className="text-purple-400 font-mono">{metric.peak}</span></span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIMonitoring;
