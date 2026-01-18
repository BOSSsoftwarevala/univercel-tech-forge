/**
 * TASK MANAGER - AI TASK GENERATOR
 * Auto Detection • Predictive • Failure-Based • Optimization
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, CheckCircle, Pencil, XCircle, Sparkles, AlertTriangle, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const aiGeneratedTasks = [
  { id: 'AI-001', title: 'Predicted license expiry notification', trigger: 'Pattern detected: 45 licenses expiring in 7 days', confidence: 94, impact: 'High', type: 'predictive' },
  { id: 'AI-002', title: 'Auto-retry failed payment sync', trigger: 'Failure detected: Payment gateway timeout', confidence: 87, impact: 'Critical', type: 'failure' },
  { id: 'AI-003', title: 'Server capacity optimization', trigger: 'Analysis: CPU usage trending 85%+', confidence: 91, impact: 'Medium', type: 'optimization' },
  { id: 'AI-004', title: 'Customer support ticket routing', trigger: 'Auto-detection: 12 new support requests', confidence: 96, impact: 'High', type: 'auto' },
  { id: 'AI-005', title: 'Database index optimization', trigger: 'Performance analysis: Query latency increased', confidence: 82, impact: 'Medium', type: 'optimization' },
];

export const TMAITaskGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('auto');

  const filteredTasks = mockFilterTasks(activeTab);

  function mockFilterTasks(type: string) {
    if (type === 'all') return aiGeneratedTasks;
    return aiGeneratedTasks.filter(t => t.type === type);
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'auto': return <Sparkles className="h-4 w-4 text-cyan-400" />;
      case 'predictive': return <TrendingUp className="h-4 w-4 text-blue-400" />;
      case 'failure': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'optimization': return <Bot className="h-4 w-4 text-green-400" />;
      default: return null;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Task Generator</h1>
          <p className="text-muted-foreground">Automated task creation • AI-driven detection</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="auto">Auto Detection</TabsTrigger>
            <TabsTrigger value="predictive">Predictive</TabsTrigger>
            <TabsTrigger value="failure">Failure-Based</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getTypeIcon(task.type)}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{task.id}</span>
                            <Badge variant="outline" className="text-xs">{task.type}</Badge>
                          </div>
                          <p className="font-semibold text-foreground">{task.title}</p>
                          <p className="text-sm text-muted-foreground">{task.trigger}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">AI Confidence:</span>
                              <Progress value={task.confidence} className="w-24 h-2" />
                              <span className="text-xs text-foreground">{task.confidence}%</span>
                            </div>
                            <Badge className={task.impact === 'Critical' ? 'bg-red-500/20 text-red-400' : task.impact === 'High' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}>
                              {task.impact}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="default">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button size="sm" variant="outline">
                          <Pencil className="h-4 w-4 mr-1" />
                          Modify
                        </Button>
                        <Button size="sm" variant="ghost">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default TMAITaskGenerator;
