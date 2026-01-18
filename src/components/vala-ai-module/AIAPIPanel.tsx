/**
 * AI API PANEL - Full Featured
 * Complete API monitoring with endpoints, latency, and error tracking
 */

import React from 'react';
import { Webhook, Activity, Clock, AlertTriangle, CheckCircle, ChevronRight, ArrowUpRight, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const apiEndpoints = [
  { endpoint: '/v1/chat/completions', requests: '23.4K', avgLatency: '890ms', errorRate: '0.2%', status: 'healthy', successRate: 99.8 },
  { endpoint: '/v1/images/generate', requests: '8.9K', avgLatency: '2.1s', errorRate: '1.1%', status: 'degraded', successRate: 98.9 },
  { endpoint: '/v1/embeddings', requests: '12.1K', avgLatency: '145ms', errorRate: '0.1%', status: 'healthy', successRate: 99.9 },
  { endpoint: '/v1/audio/transcribe', requests: '2.3K', avgLatency: '3.2s', errorRate: '0.3%', status: 'healthy', successRate: 99.7 },
  { endpoint: '/v1/moderations', requests: '5.6K', avgLatency: '234ms', errorRate: '0.0%', status: 'healthy', successRate: 100 },
  { endpoint: '/v1/translations', requests: '4.1K', avgLatency: '567ms', errorRate: '0.4%', status: 'healthy', successRate: 99.6 },
];

const recentCalls = [
  { id: 'REQ-001', endpoint: '/v1/chat/completions', status: 'success', latency: '892ms', time: '2 mins ago' },
  { id: 'REQ-002', endpoint: '/v1/images/generate', status: 'success', latency: '2.3s', time: '5 mins ago' },
  { id: 'REQ-003', endpoint: '/v1/embeddings', status: 'success', latency: '134ms', time: '8 mins ago' },
  { id: 'REQ-004', endpoint: '/v1/chat/completions', status: 'error', latency: '-', time: '12 mins ago' },
  { id: 'REQ-005', endpoint: '/v1/moderations', status: 'success', latency: '245ms', time: '15 mins ago' },
];

export const AIAPIPanel: React.FC = () => {
  const handleAction = (action: string, item?: string) => {
    toast.success(`${action}${item ? `: ${item}` : ''}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Webhook className="w-6 h-6 text-primary" />
            AI API Calls
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor API endpoints and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleAction('Filter applied')}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleAction('Export API logs')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={() => handleAction('View API documentation')}>
            <ArrowUpRight className="w-4 h-4 mr-2" />
            API Docs
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">45.2K</p>
            <p className="text-xs text-muted-foreground">Total Requests</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-500">890ms</p>
            <p className="text-xs text-muted-foreground">Avg Latency</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-500">0.3%</p>
            <p className="text-xs text-muted-foreground">Error Rate</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-500">6</p>
            <p className="text-xs text-muted-foreground">Active Endpoints</p>
          </CardContent>
        </Card>
      </div>

      {/* Endpoints Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">API Endpoints</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {apiEndpoints.map((api) => (
            <div key={api.endpoint} className="p-4 rounded-lg bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Webhook className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-mono text-sm font-medium">{api.endpoint}</p>
                    <p className="text-xs text-muted-foreground">{api.requests} requests • {api.avgLatency} avg</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Error: {api.errorRate}</span>
                  <Badge className={api.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}>
                    {api.status}
                  </Badge>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleAction('View endpoint', api.endpoint)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span>{api.successRate}%</span>
                </div>
                <Progress value={api.successRate} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Calls */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Recent API Calls</span>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleAction('View all calls')}>
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentCalls.map((call) => (
            <div key={call.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                {call.status === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                )}
                <div>
                  <p className="text-sm font-mono">{call.endpoint}</p>
                  <p className="text-xs text-muted-foreground">{call.id} • {call.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{call.latency}</span>
                <Badge className={call.status === 'success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}>
                  {call.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
