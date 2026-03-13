/**
 * AI TOOL MONITOR
 * Monitor AI services running on connected servers
 * Track availability, latency, errors, token usage
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Activity, Clock, AlertTriangle, CheckCircle, XCircle,
  Zap, BarChart3, RefreshCw, TrendingUp, TrendingDown, Wifi
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface AIService {
  id: string;
  name: string;
  provider: string;
  status: 'online' | 'degraded' | 'offline';
  latency: number;
  errorRate: number;
  tokenUsage: number;
  tokenLimit: number;
  requests24h: number;
  uptime: string;
  lastCheck: string;
}

const aiServices: AIService[] = [
  { id: '1', name: 'GPT-5 API', provider: 'OpenAI', status: 'online', latency: 145, errorRate: 0.02, tokenUsage: 847200, tokenLimit: 2000000, requests24h: 12450, uptime: '99.99%', lastCheck: '12s ago' },
  { id: '2', name: 'Claude Sonnet 4', provider: 'Anthropic', status: 'online', latency: 178, errorRate: 0.01, tokenUsage: 523100, tokenLimit: 1500000, requests24h: 8920, uptime: '99.97%', lastCheck: '8s ago' },
  { id: '3', name: 'Gemini 3 Pro', provider: 'Google', status: 'degraded', latency: 892, errorRate: 2.4, tokenUsage: 1180000, tokenLimit: 1500000, requests24h: 6340, uptime: '98.42%', lastCheck: '5s ago' },
  { id: '4', name: 'Lovable AI', provider: 'Lovable', status: 'online', latency: 89, errorRate: 0.0, tokenUsage: 234500, tokenLimit: 1000000, requests24h: 4200, uptime: '100%', lastCheck: '3s ago' },
  { id: '5', name: 'ElevenLabs Voice', provider: 'ElevenLabs', status: 'online', latency: 210, errorRate: 0.05, tokenUsage: 89000, tokenLimit: 500000, requests24h: 1890, uptime: '99.95%', lastCheck: '15s ago' },
  { id: '6', name: 'Stability SDXL', provider: 'Stability AI', status: 'offline', latency: 0, errorRate: 100, tokenUsage: 0, tokenLimit: 500000, requests24h: 0, uptime: '0%', lastCheck: '2m ago' },
];

const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType; border: string }> = {
  online: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle, border: 'border-emerald-500/20' },
  degraded: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: AlertTriangle, border: 'border-amber-500/20' },
  offline: { color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle, border: 'border-red-500/20' },
};

export const AIToolMonitor: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const totalOnline = aiServices.filter(s => s.status === 'online').length;
  const totalDegraded = aiServices.filter(s => s.status === 'degraded').length;
  const totalOffline = aiServices.filter(s => s.status === 'offline').length;
  const avgLatency = Math.round(aiServices.filter(s => s.status !== 'offline').reduce((a, s) => a + s.latency, 0) / aiServices.filter(s => s.status !== 'offline').length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">AI Tool Monitor</h2>
          <p className="text-sm text-muted-foreground">Real-time monitoring of AI services on your servers</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Online', value: totalOnline, color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle },
          { label: 'Degraded', value: totalDegraded, color: 'text-amber-400', bg: 'bg-amber-500/10', icon: AlertTriangle },
          { label: 'Offline', value: totalOffline, color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle },
          { label: 'Avg Latency', value: `${avgLatency}ms`, color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Clock },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`border-border ${stat.bg}`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Services List */}
      <div className="space-y-3">
        {aiServices.map((service, i) => {
          const sc = statusConfig[service.status];
          const StatusIcon = sc.icon;
          const usagePercent = Math.round((service.tokenUsage / service.tokenLimit) * 100);

          return (
            <motion.div key={service.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`bg-card border ${sc.border} hover:border-blue-500/30 transition-colors`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${sc.bg} flex items-center justify-center`}>
                        <Brain className={`w-5 h-5 ${sc.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{service.name}</p>
                          <Badge variant="outline" className={`${sc.color} ${sc.bg} border-none text-xs`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {service.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{service.provider} • Last check: {service.lastCheck}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className={service.latency > 500 ? 'text-amber-400' : 'text-foreground'}>{service.latency}ms</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Latency</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-muted-foreground" />
                          <span className={service.errorRate > 1 ? 'text-red-400' : 'text-foreground'}>{service.errorRate}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Errors</p>
                      </div>
                      <div className="text-center">
                        <span className="text-foreground">{service.requests24h.toLocaleString()}</span>
                        <p className="text-xs text-muted-foreground">Req/24h</p>
                      </div>
                      <div className="text-center">
                        <span className="text-emerald-400">{service.uptime}</span>
                        <p className="text-xs text-muted-foreground">Uptime</p>
                      </div>
                    </div>
                  </div>
                  {/* Token Usage Bar */}
                  <div className="flex items-center gap-3">
                    <Zap className="w-3 h-3 text-muted-foreground" />
                    <div className="flex-1">
                      <Progress value={usagePercent} className="h-1.5" />
                    </div>
                    <span className="text-xs text-muted-foreground w-32 text-right">
                      {(service.tokenUsage / 1000).toFixed(0)}K / {(service.tokenLimit / 1000).toFixed(0)}K tokens
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AIToolMonitor;
