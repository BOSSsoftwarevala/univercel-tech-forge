/**
 * TASK MANAGER - TASK CREATION
 * Manual • System • Incident • Compliance Tasks
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PlusCircle, Save, Send } from 'lucide-react';

export const TMTaskCreation: React.FC = () => {
  const [taskType, setTaskType] = useState('manual');

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Creation</h1>
          <p className="text-muted-foreground">Create new tasks • Manual, System, Incident, Compliance</p>
        </div>

        <Tabs value={taskType} onValueChange={setTaskType}>
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="manual">Manual Task</TabsTrigger>
            <TabsTrigger value="system">System Task</TabsTrigger>
            <TabsTrigger value="incident">Incident Task</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Task</TabsTrigger>
          </TabsList>

          <TabsContent value={taskType} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Create {taskType.charAt(0).toUpperCase() + taskType.slice(1)} Task
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Task Title</Label>
                      <Input placeholder="Enter task title..." className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Related Module</Label>
                      <Select>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select module" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pro_manager">Pro Manager</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="product">Product Manager</SelectItem>
                          <SelectItem value="server">Server Manager</SelectItem>
                          <SelectItem value="legal">Legal Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Description</Label>
                    <Textarea placeholder="Enter task description..." className="bg-background min-h-[100px]" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Priority</Label>
                      <Select>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">SLA (Hours)</Label>
                      <Input type="number" placeholder="Enter SLA hours..." className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Deadline</Label>
                      <Input type="date" className="bg-background" />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button variant="secondary" className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Submit for Approval
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default TMTaskCreation;
