/**
 * TASK MANAGER - TASK APPROVAL
 * Pending • Approved • Rejected • Returned
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, RotateCcw, Clock, User } from 'lucide-react';

const approvals = [
  { id: 'APR-001', task: 'High-value payout request', approverRole: 'Finance Manager', reason: 'Amount exceeds limit', timestamp: '10 min ago', status: 'pending' },
  { id: 'APR-002', task: 'License domain transfer', approverRole: 'Pro Manager', reason: 'Customer request verified', timestamp: '1 hour ago', status: 'approved' },
  { id: 'APR-003', task: 'Refund request', approverRole: 'Boss', reason: 'Policy violation', timestamp: '2 hours ago', status: 'rejected' },
  { id: 'APR-004', task: 'Feature access upgrade', approverRole: 'Product Manager', reason: 'Needs more documentation', timestamp: '3 hours ago', status: 'returned' },
  { id: 'APR-005', task: 'Server access request', approverRole: 'Server Manager', reason: 'Pending security review', timestamp: '15 min ago', status: 'pending' },
];

export const TMTaskApproval: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const filteredApprovals = approvals.filter(a => a.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      case 'returned': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Approval</h1>
          <p className="text-muted-foreground">Review and approve pending tasks</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="returned">Returned</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Approvals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredApprovals.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-4">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{item.id}</p>
                            <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                          </div>
                          <p className="text-sm text-foreground">{item.task}</p>
                          <p className="text-xs text-muted-foreground">Approver: {item.approverRole}</p>
                          <p className="text-xs text-muted-foreground">Reason: {item.reason}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {item.timestamp}
                        </div>
                        {activeTab === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="default">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button size="sm" variant="ghost">
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredApprovals.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No approvals in this category</p>
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

export default TMTaskApproval;
