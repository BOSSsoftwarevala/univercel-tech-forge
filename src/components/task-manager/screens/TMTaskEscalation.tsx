/**
 * TASK MANAGER - TASK ESCALATION
 * Role Escalation • AI Escalation • Boss Escalation
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpCircle, ArrowDownCircle, User, Bot, Crown } from 'lucide-react';

const escalations = [
  { id: 'ESC-001', task: 'Complex refund case', level: 3, justification: 'Multiple policy exceptions needed', type: 'role' },
  { id: 'ESC-002', task: 'AI decision override', level: 2, justification: 'AI confidence below threshold', type: 'ai' },
  { id: 'ESC-003', task: 'High-value contract approval', level: 5, justification: 'Amount exceeds all limits', type: 'boss' },
  { id: 'ESC-004', task: 'Security incident response', level: 4, justification: 'Potential data breach', type: 'role' },
  { id: 'ESC-005', task: 'AI task failure recovery', level: 1, justification: 'Retry limit exceeded', type: 'ai' },
];

export const TMTaskEscalation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('role');

  const filteredEscalations = escalations.filter(e => e.type === activeTab);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'role': return <User className="h-5 w-5 text-blue-400" />;
      case 'ai': return <Bot className="h-5 w-5 text-cyan-400" />;
      case 'boss': return <Crown className="h-5 w-5 text-yellow-400" />;
      default: return null;
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 4) return 'bg-red-500/20 text-red-400';
    if (level >= 3) return 'bg-orange-500/20 text-orange-400';
    if (level >= 2) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-green-500/20 text-green-400';
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Escalation</h1>
          <p className="text-muted-foreground">Manage escalation levels and workflows</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="role">Role Escalation</TabsTrigger>
            <TabsTrigger value="ai">AI Escalation</TabsTrigger>
            <TabsTrigger value="boss">Boss Escalation</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <ArrowUpCircle className="h-5 w-5" />
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Escalations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredEscalations.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-4">
                        {getTypeIcon(item.type)}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{item.id}</p>
                            <Badge className={getLevelColor(item.level)}>Level {item.level}</Badge>
                          </div>
                          <p className="text-sm text-foreground">{item.task}</p>
                          <p className="text-xs text-muted-foreground">{item.justification}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="default">
                          <ArrowUpCircle className="h-4 w-4 mr-1" />
                          Escalate
                        </Button>
                        <Button size="sm" variant="outline">
                          <ArrowDownCircle className="h-4 w-4 mr-1" />
                          De-escalate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default TMTaskEscalation;
