/**
 * AI REQUESTS PANEL
 * Shows all AI request activity
 */

import React from 'react';
import { Brain, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const requests = [
  { id: 'REQ-001', type: 'Text Generation', model: 'gpt-5', status: 'completed', tokens: 1250, time: '2s' },
  { id: 'REQ-002', type: 'Image Analysis', model: 'gemini-2.5-pro', status: 'completed', tokens: 890, time: '3s' },
  { id: 'REQ-003', type: 'Code Review', model: 'gpt-5', status: 'processing', tokens: 2100, time: '...' },
  { id: 'REQ-004', type: 'Translation', model: 'gemini-2.5-flash', status: 'completed', tokens: 450, time: '1s' },
  { id: 'REQ-005', type: 'Summarization', model: 'gpt-5-mini', status: 'completed', tokens: 780, time: '2s' },
];

export const AIRequestsPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          AI Requests
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor and manage AI request activity</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">12,847</p>
            <p className="text-xs text-muted-foreground">Total Today</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">1.8s</p>
            <p className="text-xs text-muted-foreground">Avg Response</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">99.2%</p>
            <p className="text-xs text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Recent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {requests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">{req.id}</Badge>
                  <div>
                    <p className="text-sm font-medium">{req.type}</p>
                    <p className="text-xs text-muted-foreground">{req.model} • {req.tokens} tokens</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{req.time}</span>
                  <Badge className={req.status === 'completed' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}>
                    {req.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
