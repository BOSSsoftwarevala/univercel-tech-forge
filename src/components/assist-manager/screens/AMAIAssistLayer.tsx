/**
 * AI ASSIST LAYER - All buttons functional
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Brain, Lightbulb, Search, MessageSquare, Languages, FileText, ShieldX, Hand, Lock, CheckCircle2, XCircle } from 'lucide-react';

interface Suggestion {
  id: string;
  type: string;
  message: string;
  confidence: number;
  status: 'pending' | 'accepted' | 'dismissed';
}

export function AMAIAssistLayer() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    { id: 'SUG-001', type: 'fix', message: 'User appears to have incorrect permissions. Suggest checking role settings.', confidence: 94, status: 'pending' },
    { id: 'SUG-002', type: 'issue', message: 'Detected unusual login pattern from user device.', confidence: 78, status: 'pending' },
    { id: 'SUG-003', type: 'guide', message: 'User needs help with file upload. Recommend walking through the process step by step.', confidence: 89, status: 'pending' },
  ]);

  const handleAccept = (id: string) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'accepted' } : s));
    toast.success(`Suggestion ${id} accepted`, { description: 'Action will be performed by human operator' });
  };

  const handleDismiss = (id: string) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'dismissed' } : s));
    toast('Suggestion dismissed', { description: `${id} marked as not applicable` });
  };

  const AI_CAPABILITIES = [
    { id: 'suggest', label: 'Suggest Fix', icon: Lightbulb, description: 'Recommend solutions based on detected issues' },
    { id: 'detect', label: 'Detect Issue', icon: Search, description: 'Identify problems and anomalies' },
    { id: 'guide', label: 'Guide Human', icon: MessageSquare, description: 'Provide step-by-step assistance' },
    { id: 'translate', label: 'Translate Chat', icon: Languages, description: 'Real-time language translation' },
    { id: 'summarize', label: 'Summarize Session', icon: FileText, description: 'Generate session summary report' },
  ];

  const AI_RESTRICTIONS = [
    { id: 'control', label: 'Take Control', icon: Hand, description: 'AI cannot take control of session' },
    { id: 'execute', label: 'Execute Actions', icon: ShieldX, description: 'AI cannot execute any actions' },
    { id: 'bypass', label: 'Bypass Approval', icon: Lock, description: 'AI cannot bypass approval flow' },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Assist Layer</h1>
            <p className="text-muted-foreground">AI-powered assistance - Suggest only, never execute</p>
          </div>
          <Badge variant="secondary" className="gap-1"><Brain className="h-4 w-4" /> Assist Only Mode</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-green-500"><CheckCircle2 className="h-5 w-5" /> AI Can</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {AI_CAPABILITIES.map((cap) => {
                const Icon = cap.icon;
                return (
                  <div key={cap.id} className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10">
                    <Icon className="h-5 w-5 text-green-500" />
                    <div className="flex-1"><p className="font-medium text-sm">{cap.label}</p><p className="text-xs text-muted-foreground">{cap.description}</p></div>
                    <Badge variant="default" className="bg-green-600">Allowed</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-destructive"><XCircle className="h-5 w-5" /> AI Cannot</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {AI_RESTRICTIONS.map((res) => {
                const Icon = res.icon;
                return (
                  <div key={res.id} className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10">
                    <Icon className="h-5 w-5 text-destructive" />
                    <div className="flex-1"><p className="font-medium text-sm">{res.label}</p><p className="text-xs text-muted-foreground">{res.description}</p></div>
                    <Badge variant="destructive">Blocked</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" /> Live AI Suggestions</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className={`flex items-start gap-4 p-4 rounded-lg border ${
                suggestion.status === 'accepted' ? 'bg-green-500/10 border-green-500/30' :
                suggestion.status === 'dismissed' ? 'bg-muted/30 border-muted opacity-50' :
                'bg-purple-500/10 border-purple-500/30'
              }`}>
                <Brain className="h-5 w-5 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">{suggestion.type}</Badge>
                    <span className="text-xs text-muted-foreground">{suggestion.id}</span>
                    {suggestion.status !== 'pending' && <Badge variant={suggestion.status === 'accepted' ? 'default' : 'secondary'} className="text-xs">{suggestion.status}</Badge>}
                    <span className="text-xs text-purple-500 ml-auto">{suggestion.confidence}% confidence</span>
                  </div>
                  <p className="text-sm">{suggestion.message}</p>
                </div>
                {suggestion.status === 'pending' && (
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleAccept(suggestion.id)}>Accept</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDismiss(suggestion.id)}>Dismiss</Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-purple-500/50 bg-purple-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-purple-500">AI Assist Principle</p>
                <p className="text-xs text-muted-foreground mt-1">AI is a helper, not a controller. All suggestions require human approval. AI cannot execute commands, take control, or bypass security measures.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

export default AMAIAssistLayer;
