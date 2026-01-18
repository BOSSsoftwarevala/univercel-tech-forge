/**
 * AI HELP DESK
 * AI Chat (Human-like Delay) • Context-Aware Replies • Auto Language Translate • No AI Disclosure
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Sparkles, Ticket, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const mockAIChats = [
  { id: 'AI-001', user: 'PRO-***21', topic: 'API Integration', language: 'English', status: 'active', resolution: 'In Progress' },
  { id: 'AI-002', user: 'PRO-***45', topic: 'Billing Query', language: 'Spanish', status: 'active', resolution: 'Suggested' },
  { id: 'AI-003', user: 'PRO-***78', topic: 'Feature Request', language: 'German', status: 'resolved', resolution: 'Auto-Resolved' },
  { id: 'AI-004', user: 'PRO-***92', topic: 'Bug Report', language: 'French', status: 'escalated', resolution: 'Ticket Created' },
];

export const PROAIHelpdesk: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Helpdesk</h1>
        <p className="text-muted-foreground">AI-powered support with human-like interaction</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-500/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">94%</p>
            <p className="text-xs text-muted-foreground">Auto-Resolution Rate</p>
          </CardContent>
        </Card>
        <Card className="border-blue-500/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground">Active Conversations</p>
          </CardContent>
        </Card>
        <Card className="border-purple-500/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">8</p>
            <p className="text-xs text-muted-foreground">Languages Supported</p>
          </CardContent>
        </Card>
        <Card className="border-amber-500/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">2.3s</p>
            <p className="text-xs text-muted-foreground">Avg Response Time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Active AI Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAIChats.map((chat, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="font-mono text-sm text-foreground">{chat.id}</span>
                  <span className="text-sm text-foreground">{chat.user}</span>
                  <span className="text-sm text-foreground">{chat.topic}</span>
                  <Badge variant="outline">{chat.language}</Badge>
                  <Badge className={
                    chat.status === 'active' ? 'bg-green-500/20 text-green-500' :
                    chat.status === 'resolved' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-amber-500/20 text-amber-500'
                  }>
                    {chat.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.info('AI suggestion sent')}>
                    <Sparkles className="h-4 w-4 mr-1" />
                    Suggest Fix
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.info('Ticket created')}>
                    <Ticket className="h-4 w-4 mr-1" />
                    Create Ticket
                  </Button>
                  <Button size="sm" onClick={() => toast.success('Auto-resolved')}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Auto Resolve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PROAIHelpdesk;
