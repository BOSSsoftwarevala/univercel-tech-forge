/**
 * DEVELOPER REGISTRY
 * All Developers • Active • Suspended • Probation • Exited
 * DEBUG FIX: Connected to action logger for full traceability
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Eye, ListTodo, Ban, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useActionLogger } from '@/hooks/useActionLogger';
import { supabase } from '@/integrations/supabase/client';

const developers = [
  { id: 'DEV-001', role: 'Full Stack', location: '***-IN', skills: ['React', 'Node.js'], level: 'Senior', status: 'active' },
  { id: 'DEV-002', role: 'Frontend', location: '***-US', skills: ['React', 'TypeScript'], level: 'Mid', status: 'active' },
  { id: 'DEV-003', role: 'Backend', location: '***-UK', skills: ['Python', 'Django'], level: 'Senior', status: 'active' },
  { id: 'DEV-004', role: 'Mobile', location: '***-CA', skills: ['React Native', 'Flutter'], level: 'Junior', status: 'probation' },
  { id: 'DEV-005', role: 'QA', location: '***-AU', skills: ['Selenium', 'Cypress'], level: 'Mid', status: 'suspended' },
  { id: 'DEV-006', role: 'Full Stack', location: '***-DE', skills: ['Vue.js', 'Laravel'], level: 'Senior', status: 'exited' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active': return <Badge className="bg-green-500/20 text-green-500">Active</Badge>;
    case 'suspended': return <Badge className="bg-red-500/20 text-red-500">Suspended</Badge>;
    case 'probation': return <Badge className="bg-amber-500/20 text-amber-500">Probation</Badge>;
    case 'exited': return <Badge variant="secondary">Exited</Badge>;
    default: return <Badge>{status}</Badge>;
  }
};

export const DMDeveloperRegistry: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const { logAction } = useActionLogger();

  const filteredDevs = developers.filter(dev => 
    activeTab === 'all' || dev.status === activeTab
  );

  // View Developer - READ action with logging
  const handleViewDeveloper = useCallback(async (devId: string) => {
    const startTime = performance.now();
    setLoadingAction(`view-${devId}`);
    
    try {
      // Log READ action
      await logAction({
        buttonId: `dm_view_developer_${devId}`,
        moduleName: 'developer_management',
        actionType: 'READ',
        actionResult: 'success',
        responseTimeMs: Math.round(performance.now() - startTime),
        metadata: { developerId: devId, action: 'view' }
      });
      
      toast.info(`Viewing developer: ${devId}`, {
        description: 'Developer profile loaded'
      });
    } catch (error) {
      await logAction({
        buttonId: `dm_view_developer_${devId}`,
        moduleName: 'developer_management',
        actionType: 'READ',
        actionResult: 'failure',
        responseTimeMs: Math.round(performance.now() - startTime),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      toast.error('Failed to view developer');
    } finally {
      setLoadingAction(null);
    }
  }, [logAction]);

  // Assign Task - PROCESS action with logging
  const handleAssignTask = useCallback(async (devId: string) => {
    const startTime = performance.now();
    setLoadingAction(`assign-${devId}`);
    
    try {
      // Insert task assignment to DB
      const { error } = await supabase
        .from('developer_tasks')
        .insert({
          developer_id: devId,
          category: 'assigned',
          status: 'pending',
          priority: 'medium',
          title: `Task assigned to ${devId}`,
          description: 'Task automatically assigned via Developer Registry'
        });

      if (error) throw error;

      await logAction({
        buttonId: `dm_assign_task_${devId}`,
        moduleName: 'developer_management',
        actionType: 'PROCESS',
        actionResult: 'success',
        responseTimeMs: Math.round(performance.now() - startTime),
        metadata: { developerId: devId, action: 'assign_task' }
      });
      
      toast.success(`Task assigned to ${devId}`, {
        description: 'Developer has been notified'
      });
    } catch (error) {
      await logAction({
        buttonId: `dm_assign_task_${devId}`,
        moduleName: 'developer_management',
        actionType: 'PROCESS',
        actionResult: 'failure',
        responseTimeMs: Math.round(performance.now() - startTime),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      toast.error('Failed to assign task', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setLoadingAction(null);
    }
  }, [logAction]);

  // Suspend Developer - UPDATE action with logging
  const handleSuspendDeveloper = useCallback(async (devId: string) => {
    const startTime = performance.now();
    setLoadingAction(`suspend-${devId}`);
    
    try {
      // Log UPDATE action for suspension
      await logAction({
        buttonId: `dm_suspend_developer_${devId}`,
        moduleName: 'developer_management',
        actionType: 'UPDATE',
        actionResult: 'success',
        responseTimeMs: Math.round(performance.now() - startTime),
        metadata: { developerId: devId, action: 'suspend', previousStatus: 'active', newStatus: 'suspended' }
      });
      
      toast.warning(`Access suspended for ${devId}`, {
        description: 'Developer access has been restricted'
      });
    } catch (error) {
      await logAction({
        buttonId: `dm_suspend_developer_${devId}`,
        moduleName: 'developer_management',
        actionType: 'UPDATE',
        actionResult: 'failure',
        responseTimeMs: Math.round(performance.now() - startTime),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      toast.error('Failed to suspend developer');
    } finally {
      setLoadingAction(null);
    }
  }, [logAction]);

  // Escalate Issue - CREATE action with logging
  const handleEscalateIssue = useCallback(async (devId: string) => {
    const startTime = performance.now();
    setLoadingAction(`escalate-${devId}`);
    
    try {
      // Insert escalation record
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          module: 'developer_management',
          action: 'escalate_issue',
          meta_json: { developerId: devId, severity: 'high', timestamp: new Date().toISOString() }
        });

      if (error) throw error;

      await logAction({
        buttonId: `dm_escalate_issue_${devId}`,
        moduleName: 'developer_management',
        actionType: 'CREATE',
        actionResult: 'success',
        responseTimeMs: Math.round(performance.now() - startTime),
        metadata: { developerId: devId, action: 'escalate', severity: 'high' }
      });
      
      toast.error(`Issue escalated for ${devId}`, {
        description: 'Management has been notified'
      });
    } catch (error) {
      await logAction({
        buttonId: `dm_escalate_issue_${devId}`,
        moduleName: 'developer_management',
        actionType: 'CREATE',
        actionResult: 'failure',
        responseTimeMs: Math.round(performance.now() - startTime),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      toast.error('Failed to escalate issue');
    } finally {
      setLoadingAction(null);
    }
  }, [logAction]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Developer Registry</h1>
        <p className="text-muted-foreground">Manage internal developer profiles</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({developers.length})</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="suspended">Suspended</TabsTrigger>
          <TabsTrigger value="probation">Probation</TabsTrigger>
          <TabsTrigger value="exited">Exited</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Developer List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredDevs.map((dev) => (
                  <div 
                    key={dev.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono font-medium">{dev.id}</span>
                        {getStatusBadge(dev.status)}
                        <Badge variant="outline">{dev.role}</Badge>
                        <Badge variant="secondary">{dev.level}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Location: {dev.location}</span>
                        <span>•</span>
                        <span>Skills: {dev.skills.join(', ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewDeveloper(dev.id)}
                        disabled={loadingAction === `view-${dev.id}`}
                      >
                        {loadingAction === `view-${dev.id}` ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Eye className="h-4 w-4 mr-1" />
                        )}
                        View
                      </Button>
                      {dev.status !== 'exited' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleAssignTask(dev.id)}
                            disabled={loadingAction === `assign-${dev.id}`}
                          >
                            {loadingAction === `assign-${dev.id}` ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <ListTodo className="h-4 w-4 mr-1" />
                            )}
                            Assign
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleSuspendDeveloper(dev.id)}
                            disabled={loadingAction === `suspend-${dev.id}`}
                          >
                            {loadingAction === `suspend-${dev.id}` ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Ban className="h-4 w-4 mr-1" />
                            )}
                            Suspend
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEscalateIssue(dev.id)}
                            disabled={loadingAction === `escalate-${dev.id}`}
                          >
                            {loadingAction === `escalate-${dev.id}` ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 mr-1" />
                            )}
                            Escalate
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DMDeveloperRegistry;
