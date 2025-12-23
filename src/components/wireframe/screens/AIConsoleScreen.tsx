import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Cpu, 
  Zap, 
  Activity,
  MessageSquare,
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  BarChart3
} from 'lucide-react';

// Mock data
const aiMetrics = {
  totalRequests: '2.4M',
  avgLatency: '145ms',
  successRate: '99.7%',
  monthlySpend: '$8,420',
  activeModels: 6,
  quotaUsed: 72
};

const activeModels = [
  { name: 'GPT-4 Turbo', provider: 'OpenAI', requests: '1.2M', latency: '320ms', cost: '$4,200', status: 'healthy' },
  { name: 'Claude 3 Opus', provider: 'Anthropic', requests: '450K', latency: '280ms', cost: '$1,800', status: 'healthy' },
  { name: 'Gemini Pro', provider: 'Google', requests: '380K', latency: '190ms', cost: '$950', status: 'healthy' },
  { name: 'Llama 3 70B', provider: 'Meta', requests: '220K', latency: '450ms', cost: '$420', status: 'degraded' },
  { name: 'Mistral Large', provider: 'Mistral', requests: '150K', latency: '210ms', cost: '$380', status: 'healthy' },
  { name: 'Whisper v3', provider: 'OpenAI', requests: '80K', latency: '1.2s', cost: '$670', status: 'healthy' }
];

const usageByModule = [
  { module: 'Chat Assistant', requests: '890K', percentage: 37 },
  { module: 'Content Generation', requests: '520K', percentage: 22 },
  { module: 'Code Analysis', requests: '380K', percentage: 16 },
  { module: 'Document Processing', requests: '290K', percentage: 12 },
  { module: 'Image Analysis', requests: '180K', percentage: 8 },
  { module: 'Translation', requests: '140K', percentage: 5 }
];

const recentAlerts = [
  { type: 'warning', message: 'Llama 3 latency increased by 40%', time: '15 min ago' },
  { type: 'info', message: 'GPT-4 quota at 80% usage', time: '1 hour ago' },
  { type: 'success', message: 'Claude 3 rate limit increased', time: '3 hours ago' },
  { type: 'warning', message: 'High error rate on image processing', time: '5 hours ago' },
  { type: 'info', message: 'New model Gemini 1.5 available', time: 'Yesterday' }
];

const recentRequests = [
  { id: 'req-001', model: 'GPT-4 Turbo', tokens: 2450, latency: '312ms', status: 'success', time: '2s ago' },
  { id: 'req-002', model: 'Claude 3 Opus', tokens: 1820, latency: '245ms', status: 'success', time: '5s ago' },
  { id: 'req-003', model: 'Gemini Pro', tokens: 980, latency: '178ms', status: 'success', time: '8s ago' },
  { id: 'req-004', model: 'Llama 3 70B', tokens: 3200, latency: '890ms', status: 'timeout', time: '12s ago' },
  { id: 'req-005', model: 'GPT-4 Turbo', tokens: 1540, latency: '298ms', status: 'success', time: '15s ago' }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'bg-green-500/20 text-green-400';
    case 'degraded': return 'bg-yellow-500/20 text-yellow-400';
    case 'down': return 'bg-red-500/20 text-red-400';
    case 'success': return 'bg-green-500/20 text-green-400';
    case 'timeout': return 'bg-red-500/20 text-red-400';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    case 'success': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
    case 'info': return <Activity className="h-4 w-4 text-blue-400" />;
    default: return <Activity className="h-4 w-4" />;
  }
};

export function AIConsoleScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Console</h1>
          <p className="text-muted-foreground">Monitor AI models & usage</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{aiMetrics.totalRequests}</p>
                <p className="text-sm text-muted-foreground">Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{aiMetrics.avgLatency}</p>
                <p className="text-sm text-muted-foreground">Avg Latency</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{aiMetrics.successRate}</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{aiMetrics.monthlySpend}</p>
                <p className="text-sm text-muted-foreground">Monthly Spend</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Bot className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{aiMetrics.activeModels}</p>
                <p className="text-sm text-muted-foreground">Active Models</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quota Used</span>
                <span className="font-medium">{aiMetrics.quotaUsed}%</span>
              </div>
              <Progress value={aiMetrics.quotaUsed} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Models */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Active Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeModels.map((model, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{model.name}</p>
                        <Badge className={getStatusColor(model.status)}>{model.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{model.provider}</p>
                    </div>
                    <p className="font-bold">{model.cost}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Requests:</span>
                      <span className="font-medium">{model.requests}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Latency:</span>
                      <span className="font-medium">{model.latency}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Usage by Module */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Usage by Module
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {usageByModule.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{item.module}</span>
                      <span className="text-muted-foreground">{item.requests}</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 bg-muted/30 rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-muted-foreground">{req.id}</span>
                  <span className="font-medium">{req.model}</span>
                  <Badge className={getStatusColor(req.status)}>{req.status}</Badge>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-muted-foreground">{req.tokens} tokens</span>
                  <span className="text-muted-foreground">{req.latency}</span>
                  <span className="text-muted-foreground">{req.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
