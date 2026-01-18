/**
 * AI MODELS PANEL
 * Shows active AI models
 */

import React from 'react';
import { Cpu, Activity, Zap, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const models = [
  { name: 'gpt-5', provider: 'OpenAI', status: 'active', requests: '4.2K', latency: '1.2s', load: 78 },
  { name: 'gemini-2.5-pro', provider: 'Google', status: 'active', requests: '3.8K', latency: '0.9s', load: 65 },
  { name: 'gemini-2.5-flash', provider: 'Google', status: 'active', requests: '2.1K', latency: '0.4s', load: 45 },
  { name: 'gpt-5-mini', provider: 'OpenAI', status: 'active', requests: '1.9K', latency: '0.6s', load: 52 },
  { name: 'gemini-3-pro-image', provider: 'Google', status: 'idle', requests: '890', latency: '2.1s', load: 12 },
];

export const AIModelsPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Cpu className="w-6 h-6 text-primary" />
          AI Models Active
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor AI model performance and status</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">12</p>
            <p className="text-xs text-muted-foreground">Total Models</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-500">10</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-500">2</p>
            <p className="text-xs text-muted-foreground">Idle</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-500">0.8s</p>
            <p className="text-xs text-muted-foreground">Avg Latency</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Model Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {models.map((model) => (
            <div key={model.name} className="p-4 rounded-lg bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">{model.name}</p>
                    <p className="text-xs text-muted-foreground">{model.provider}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Activity className="w-4 h-4" />
                    {model.requests}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {model.latency}
                  </div>
                  <Badge className={model.status === 'active' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-500/20 text-zinc-400'}>
                    {model.status}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Load</span>
                  <span>{model.load}%</span>
                </div>
                <Progress value={model.load} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
