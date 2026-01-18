/**
 * TASK MANAGER - TASK HISTORY
 * Completed • Failed • Cancelled (Read-only)
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, CheckCircle, XCircle, Ban, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const historyItems = [
  { id: 'HST-001', task: 'Monthly report generation', completedAt: '2024-01-15 14:30', duration: '2h 15m', status: 'completed' },
  { id: 'HST-002', task: 'API integration test', completedAt: '2024-01-15 12:00', duration: '45m', status: 'failed' },
  { id: 'HST-003', task: 'User onboarding batch', completedAt: '2024-01-14 18:00', duration: '3h 30m', status: 'completed' },
  { id: 'HST-004', task: 'Server migration (cancelled)', completedAt: '2024-01-14 10:00', duration: 'N/A', status: 'cancelled' },
  { id: 'HST-005', task: 'Payment reconciliation', completedAt: '2024-01-13 16:45', duration: '1h 20m', status: 'completed' },
];

export const TMTaskHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('completed');

  const filteredHistory = historyItems.filter(h => h.status === activeTab);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-400" />;
      case 'cancelled': return <Ban className="h-5 w-5 text-gray-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task History</h1>
          <p className="text-muted-foreground">Historical task records • Read-only</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <History className="h-5 w-5" />
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(item.status)}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{item.id}</p>
                            <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                          </div>
                          <p className="text-sm text-foreground">{item.task}</p>
                          <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                            <span>Completed: {item.completedAt}</span>
                            <span>Duration: {item.duration}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {filteredHistory.length === 0 && (
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

export default TMTaskHistory;
