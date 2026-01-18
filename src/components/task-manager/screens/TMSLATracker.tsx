/**
 * TASK MANAGER - SLA TRACKER
 * On Time • At Risk • Breached
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Timer, ArrowUpCircle, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const slaItems = [
  { id: 'SLA-001', task: 'Customer response', timer: '45 min remaining', delayReason: null, status: 'on_time' },
  { id: 'SLA-002', task: 'Payment processing', timer: '15 min remaining', delayReason: 'Gateway delay', status: 'at_risk' },
  { id: 'SLA-003', task: 'License activation', timer: '2 hours overdue', delayReason: 'Pending approval', status: 'breached' },
  { id: 'SLA-004', task: 'Support ticket resolution', timer: '3 hours remaining', delayReason: null, status: 'on_time' },
  { id: 'SLA-005', task: 'Data export request', timer: '30 min remaining', delayReason: 'High volume', status: 'at_risk' },
];

export const TMSLATracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState('on_time');

  const filteredSLA = slaItems.filter(s => s.status === activeTab);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_time': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'at_risk': return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'breached': return <XCircle className="h-5 w-5 text-red-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_time': return 'bg-green-500/20 text-green-400';
      case 'at_risk': return 'bg-yellow-500/20 text-yellow-400';
      case 'breached': return 'bg-red-500/20 text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task SLA Tracker</h1>
          <p className="text-muted-foreground">Monitor SLA compliance and deadlines</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="on_time">On Time</TabsTrigger>
            <TabsTrigger value="at_risk">At Risk</TabsTrigger>
            <TabsTrigger value="breached">Breached</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {activeTab.replace('_', ' ').toUpperCase()} Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredSLA.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(item.status)}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{item.id}</p>
                            <Badge className={getStatusColor(item.status)}>{item.status.replace('_', ' ')}</Badge>
                          </div>
                          <p className="text-sm text-foreground">{item.task}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Timer className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{item.timer}</span>
                          </div>
                          {item.delayReason && (
                            <p className="text-xs text-yellow-400">Delay: {item.delayReason}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Clock className="h-4 w-4 mr-1" />
                          Extend SLA
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ArrowUpCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filteredSLA.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No tasks in this category</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default TMSLATracker;
