/**
 * AI FIRST RESPONSE LAYER
 * AI CAN: Read, Suggest, Ask, Route
 * AI CANNOT: Finalize, Close without human
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, MessageCircle, ArrowRight, CheckCircle, User } from 'lucide-react';
import { toast } from 'sonner';

const aiHandledChats = [
  { 
    id: 'AI-001', 
    user: 'USER-A1B2', 
    query: 'How to reset password?', 
    aiSuggestion: 'Password reset guide sent',
    status: 'awaiting_human',
    confidence: 95 
  },
  { 
    id: 'AI-002', 
    user: 'USER-C3D4', 
    query: 'Billing inquiry', 
    aiSuggestion: 'Routed to Finance department',
    status: 'routed',
    confidence: 88 
  },
  { 
    id: 'AI-003', 
    user: 'USER-E5F6', 
    query: 'Technical issue with API', 
    aiSuggestion: 'Needs developer attention - complex issue',
    status: 'needs_escalation',
    confidence: 72 
  },
];

export const ICBAIFirstResponse: React.FC = () => {
  const handleApproveAI = (id: string) => {
    toast.success(`AI response for ${id} approved`);
  };

  const handleTakeOver = (id: string) => {
    toast.info(`Taking over chat ${id} from AI`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI First Response</h1>
        <p className="text-muted-foreground">AI-handled inquiries awaiting human review</p>
      </div>

      {/* AI Capabilities */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-green-500/5 border-green-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-500">AI CAN</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• Read inquiry</li>
              <li>• Suggest solution</li>
              <li>• Ask clarification</li>
              <li>• Route to department</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-red-500/5 border-red-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-500">AI CANNOT</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• Finalize decision</li>
              <li>• Close chat without human</li>
              <li>• Access sensitive data</li>
              <li>• Override approvals</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* AI Handled List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-500" />
            AI Handled Inquiries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiHandledChats.map((chat) => (
              <div 
                key={chat.id}
                className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm">{chat.id}</span>
                      <Badge variant="outline" className="text-purple-500 border-purple-500">
                        <Bot className="h-3 w-3 mr-1" />
                        AI Handled
                      </Badge>
                      <Badge variant="secondary">
                        {chat.confidence}% Confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{chat.user}</p>
                  </div>
                </div>

                <div className="mb-3 p-3 bg-background rounded">
                  <p className="text-sm font-medium mb-1">Query:</p>
                  <p className="text-sm text-muted-foreground">{chat.query}</p>
                </div>

                <div className="mb-3 p-3 bg-purple-500/10 rounded">
                  <p className="text-sm font-medium mb-1 flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    AI Suggestion:
                  </p>
                  <p className="text-sm">{chat.aiSuggestion}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApproveAI(chat.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve AI Response
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleTakeOver(chat.id)}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Take Over
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

export default ICBAIFirstResponse;
