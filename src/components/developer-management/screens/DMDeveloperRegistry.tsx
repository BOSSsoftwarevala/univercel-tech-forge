/**
 * DEVELOPER REGISTRY
 * All Developers • Active • Suspended • Probation • Exited
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Eye, ListTodo, Ban, AlertTriangle, Loader2 } from 'lucide-react';
import { useActionHandler } from '@/hooks/useActionHandler';

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
  const { view, assign, suspend, escalate, isActionLoading } = useActionHandler();

  const filteredDevs = developers.filter(dev => 
    activeTab === 'all' || dev.status === activeTab
  );

  const handleView = (devId: string) => {
    view('Developer', devId, { action: 'view_profile' });
  };

  const handleAssign = (devId: string) => {
    assign('Developer', devId, { action: 'assign_task' });
  };

  const handleSuspend = (devId: string) => {
    suspend('Developer', devId, { action: 'suspend_access' });
  };

  const handleEscalate = (devId: string) => {
    escalate('Developer Issue', devId, { action: 'escalate_to_manager' });
  };

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
                        onClick={() => handleView(dev.id)}
                        disabled={isActionLoading('view', dev.id)}
                      >
                        {isActionLoading('view', dev.id) ? (
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
                            onClick={() => handleAssign(dev.id)}
                            disabled={isActionLoading('assign', dev.id)}
                          >
                            {isActionLoading('assign', dev.id) ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <ListTodo className="h-4 w-4 mr-1" />
                            )}
                            Assign
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleSuspend(dev.id)}
                            disabled={isActionLoading('suspend', dev.id)}
                          >
                            {isActionLoading('suspend', dev.id) ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Ban className="h-4 w-4 mr-1" />
                            )}
                            Suspend
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEscalate(dev.id)}
                            disabled={isActionLoading('escalate', dev.id)}
                          >
                            {isActionLoading('escalate', dev.id) ? (
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
