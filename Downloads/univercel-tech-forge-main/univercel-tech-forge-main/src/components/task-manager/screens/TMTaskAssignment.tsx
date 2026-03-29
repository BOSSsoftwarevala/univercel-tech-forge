/**
 * TASK MANAGER - TASK ASSIGNMENT
 * AI Assigned • Human Assigned • Hybrid Assigned
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, RefreshCw, Lock, Bot, User, Users } from 'lucide-react';

const assignments = [
  { id: 'ASN-001', task: 'License verification', assignedRole: 'Pro Manager', backupRole: 'Admin', approvalRequired: true, type: 'ai' },
  { id: 'ASN-002', task: 'Payment dispute resolution', assignedRole: 'Finance Manager', backupRole: 'Boss', approvalRequired: true, type: 'human' },
  { id: 'ASN-003', task: 'Server migration task', assignedRole: 'Server Manager + AI', backupRole: 'Developer', approvalRequired: false, type: 'hybrid' },
  { id: 'ASN-004', task: 'Customer callback', assignedRole: 'Support Agent', backupRole: 'Pro Manager', approvalRequired: false, type: 'human' },
  { id: 'ASN-005', task: 'Auto health check', assignedRole: 'AI System', backupRole: 'Server Manager', approvalRequired: false, type: 'ai' },
];

export const TMTaskAssignment: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ai');

  const filteredAssignments = assignments.filter(a => a.type === activeTab);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ai': return <Bot className="h-4 w-4 text-cyan-400" />;
      case 'human': return <User className="h-4 w-4 text-purple-400" />;
      case 'hybrid': return <Users className="h-4 w-4 text-green-400" />;
      default: return null;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Assignment</h1>
          <p className="text-muted-foreground">Assign tasks to AI, Human, or Hybrid execution</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="ai">AI Assigned</TabsTrigger>
            <TabsTrigger value="human">Human Assigned</TabsTrigger>
            <TabsTrigger value="hybrid">Hybrid Assigned</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  {getTypeIcon(activeTab)}
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredAssignments.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-4">
                        {getTypeIcon(item.type)}
                        <div>
                          <p className="font-medium text-foreground">{item.id}</p>
                          <p className="text-sm text-muted-foreground">{item.task}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-foreground">{item.assignedRole}</p>
                          <p className="text-xs text-muted-foreground">Backup: {item.backupRole}</p>
                        </div>
                        {item.approvalRequired && (
                          <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">Approval Required</Badge>
                        )}
                        <div className="flex gap-1">
                          <Button size="sm" variant="default">
                            <UserCheck className="h-4 w-4 mr-1" />
                            Assign
                          </Button>
                          <Button size="sm" variant="outline">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Reassign
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Lock className="h-4 w-4" />
                          </Button>
                        </div>
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

export default TMTaskAssignment;
