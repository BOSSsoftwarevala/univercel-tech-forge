/**
 * ESCALATED CHATS
 * AI → Support → Developer → Boss
 * Full trace maintained
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpCircle, Bot, Headphones, Code, Crown, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const escalatedChats = [
  { 
    id: 'ESC-001', 
    user: 'USER-A1B2', 
    subject: 'Complex technical issue',
    currentLevel: 'developer',
    trail: ['ai', 'support', 'developer'],
    escalatedAt: '10 min ago'
  },
  { 
    id: 'ESC-002', 
    user: 'USER-C3D4', 
    subject: 'Refund dispute',
    currentLevel: 'boss',
    trail: ['ai', 'support', 'developer', 'boss'],
    escalatedAt: '25 min ago'
  },
  { 
    id: 'ESC-003', 
    user: 'USER-E5F6', 
    subject: 'API integration failure',
    currentLevel: 'support',
    trail: ['ai', 'support'],
    escalatedAt: '5 min ago'
  },
];

const levelIcons: Record<string, React.ElementType> = {
  ai: Bot,
  support: Headphones,
  developer: Code,
  boss: Crown,
};

const levelColors: Record<string, string> = {
  ai: 'text-purple-500',
  support: 'text-blue-500',
  developer: 'text-amber-500',
  boss: 'text-red-500',
};

export const ICBEscalatedChats: React.FC = () => {
  const handleTakeChat = (id: string) => {
    toast.success(`Taking over chat ${id}`);
  };

  const handleEscalateMore = (id: string) => {
    toast.warning(`Escalating chat ${id} to next level`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Escalated Chats</h1>
        <p className="text-muted-foreground">Chats escalated through support levels</p>
      </div>

      {/* Escalation Flow */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Escalation Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {['ai', 'support', 'developer', 'boss'].map((level, idx) => {
              const Icon = levelIcons[level];
              return (
                <React.Fragment key={level}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-3 rounded-full bg-muted ${levelColors[level]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs capitalize">{level}</span>
                  </div>
                  {idx < 3 && (
                    <ArrowUpCircle className="h-4 w-4 text-muted-foreground rotate-90" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Escalated List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-amber-500" />
            Escalated Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {escalatedChats.map((chat) => {
              const CurrentIcon = levelIcons[chat.currentLevel];
              return (
                <div 
                  key={chat.id}
                  className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm">{chat.id}</span>
                        <Badge className={`${levelColors[chat.currentLevel]} bg-transparent border`}>
                          <CurrentIcon className="h-3 w-3 mr-1" />
                          {chat.currentLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="font-medium">{chat.subject}</p>
                      <p className="text-xs text-muted-foreground">{chat.user} • {chat.escalatedAt}</p>
                    </div>
                  </div>

                  {/* Escalation Trail */}
                  <div className="flex items-center gap-2 mb-3 p-2 bg-background rounded">
                    <span className="text-xs text-muted-foreground">Trail:</span>
                    {chat.trail.map((level, idx) => {
                      const Icon = levelIcons[level];
                      return (
                        <React.Fragment key={level}>
                          <Icon className={`h-4 w-4 ${levelColors[level]}`} />
                          {idx < chat.trail.length - 1 && (
                            <span className="text-muted-foreground">→</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleTakeChat(chat.id)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Take Chat
                    </Button>
                    {chat.currentLevel !== 'boss' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEscalateMore(chat.id)}
                      >
                        <ArrowUpCircle className="h-4 w-4 mr-1" />
                        Escalate More
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ICBEscalatedChats;
