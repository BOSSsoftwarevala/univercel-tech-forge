/**
 * TASK MANAGER - TASK DEPENDENCY
 * Parent Tasks • Child Tasks • Cross-Module Tasks
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitBranch, Link, Unlink, ShieldCheck, ArrowUp, ArrowDown, Layers } from 'lucide-react';

const dependencies = [
  { id: 'DEP-001', task: 'Server migration', dependencyType: 'Blocking', blockingReason: 'Requires DNS update first', relatedTask: 'DNS-001', type: 'parent' },
  { id: 'DEP-002', task: 'Database backup', dependencyType: 'Sequential', blockingReason: 'Must complete before migration', relatedTask: 'SRV-001', type: 'child' },
  { id: 'DEP-003', task: 'Payment integration', dependencyType: 'Cross-Module', blockingReason: 'Finance + Product sync needed', relatedTask: 'FIN-001', type: 'cross' },
  { id: 'DEP-004', task: 'User notification', dependencyType: 'Optional', blockingReason: 'Can proceed independently', relatedTask: 'NOT-001', type: 'child' },
  { id: 'DEP-005', task: 'Compliance check', dependencyType: 'Mandatory', blockingReason: 'Legal approval required', relatedTask: 'LGL-001', type: 'cross' },
];

export const TMTaskDependency: React.FC = () => {
  const [activeTab, setActiveTab] = useState('parent');

  const filteredDeps = dependencies.filter(d => d.type === activeTab);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'parent': return <ArrowUp className="h-4 w-4 text-blue-400" />;
      case 'child': return <ArrowDown className="h-4 w-4 text-green-400" />;
      case 'cross': return <Layers className="h-4 w-4 text-purple-400" />;
      default: return null;
    }
  };

  const getDepTypeColor = (depType: string) => {
    switch (depType) {
      case 'Blocking': return 'bg-red-500/20 text-red-400';
      case 'Sequential': return 'bg-yellow-500/20 text-yellow-400';
      case 'Cross-Module': return 'bg-purple-500/20 text-purple-400';
      case 'Mandatory': return 'bg-orange-500/20 text-orange-400';
      case 'Optional': return 'bg-green-500/20 text-green-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Dependency</h1>
          <p className="text-muted-foreground">Manage task relationships and blocking conditions</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="parent">Parent Tasks</TabsTrigger>
            <TabsTrigger value="child">Child Tasks</TabsTrigger>
            <TabsTrigger value="cross">Cross-Module</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dependencies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredDeps.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-4">
                        {getTypeIcon(item.type)}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{item.id}</p>
                            <Badge className={getDepTypeColor(item.dependencyType)}>{item.dependencyType}</Badge>
                          </div>
                          <p className="text-sm text-foreground">{item.task}</p>
                          <p className="text-xs text-muted-foreground">{item.blockingReason}</p>
                          <p className="text-xs text-muted-foreground">Related: {item.relatedTask}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="default">
                          <Link className="h-4 w-4 mr-1" />
                          Link
                        </Button>
                        <Button size="sm" variant="outline">
                          <Unlink className="h-4 w-4 mr-1" />
                          Unlink
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ShieldCheck className="h-4 w-4" />
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

export default TMTaskDependency;
