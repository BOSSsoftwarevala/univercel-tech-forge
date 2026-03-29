/**
 * TASK MANAGER - TASK AUTOMATION
 * Rule-Based • AI Workflow • Retry Automation
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Power, PowerOff, Play, Settings, Bot, RefreshCw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const automations = [
  { id: 'AUT-001', name: 'Auto-assign support tickets', trigger: 'New ticket created', condition: 'Priority = High', action: 'Assign to available agent', enabled: true, type: 'rule' },
  { id: 'AUT-002', name: 'AI license renewal', trigger: 'License expires in 7 days', condition: 'User is Pro', action: 'Send renewal reminder', enabled: true, type: 'ai' },
  { id: 'AUT-003', name: 'Payment retry automation', trigger: 'Payment failed', condition: 'Retry count < 3', action: 'Retry after 1 hour', enabled: false, type: 'retry' },
  { id: 'AUT-004', name: 'SLA breach alert', trigger: 'SLA 80% consumed', condition: 'Task not resolved', action: 'Notify manager', enabled: true, type: 'rule' },
  { id: 'AUT-005', name: 'AI task optimization', trigger: 'Task queue > 100', condition: 'AI available', action: 'Redistribute tasks', enabled: true, type: 'ai' },
];

export const TMTaskAutomation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('rule');

  const filteredAutomations = automations.filter(a => a.type === activeTab);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rule': return <Settings className="h-5 w-5 text-blue-400" />;
      case 'ai': return <Bot className="h-5 w-5 text-cyan-400" />;
      case 'retry': return <RefreshCw className="h-5 w-5 text-orange-400" />;
      default: return null;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Automation</h1>
          <p className="text-muted-foreground">Configure automated task workflows</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="rule">Rule-Based</TabsTrigger>
            <TabsTrigger value="ai">AI Workflow</TabsTrigger>
            <TabsTrigger value="retry">Retry Automation</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  {activeTab === 'rule' ? 'Rule-Based' : activeTab === 'ai' ? 'AI Workflow' : 'Retry'} Automation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredAutomations.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-4">
                        {getTypeIcon(item.type)}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{item.id}</p>
                            <Badge className={item.enabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                              {item.enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground">{item.name}</p>
                          <div className="text-xs text-muted-foreground space-y-1 mt-1">
                            <p>Trigger: {item.trigger}</p>
                            <p>Condition: {item.condition}</p>
                            <p>Action: {item.action}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch checked={item.enabled} />
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4 mr-1" />
                          Test
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

export default TMTaskAutomation;
