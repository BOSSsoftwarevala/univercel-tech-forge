/**
 * FRANCHISE OWNER - AUTO CRM + HRM
 * Lead Assignment, Status Pipeline, Team Management
 */

import React, { useState } from 'react';
import { 
  Users, UserCheck, Target, Clock, CheckCircle, XCircle,
  Phone, TrendingUp, RefreshCw, UserPlus, ClipboardList, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const crmLeads = [
  { id: 1, name: 'Rajesh ***', status: 'New', source: 'Website', assignee: 'Rahul S.', followUp: 'Today', priority: 'High' },
  { id: 2, name: 'Sharma ***', status: 'Contacted', source: 'Meta Ads', assignee: 'Priya P.', followUp: 'Tomorrow', priority: 'Medium' },
  { id: 3, name: 'Kumar ***', status: 'Qualified', source: 'Google', assignee: 'Amit K.', followUp: 'Jan 20', priority: 'High' },
  { id: 4, name: 'Patel ***', status: 'Proposal', source: 'Referral', assignee: 'Sneha G.', followUp: 'Jan 22', priority: 'Low' },
  { id: 5, name: 'Singh ***', status: 'Negotiation', source: 'Influencer', assignee: 'Rahul S.', followUp: 'Jan 21', priority: 'High' },
];

const hrmTeam = [
  { id: 1, name: 'Rahul Sharma', role: 'Sales Lead', status: 'Active', tasks: 8, leads: 15, conversion: 28, performance: 92 },
  { id: 2, name: 'Priya Patel', role: 'Sales Executive', status: 'Active', tasks: 5, leads: 12, conversion: 33, performance: 88 },
  { id: 3, name: 'Amit Kumar', role: 'Field Agent', status: 'Active', tasks: 12, leads: 20, conversion: 35, performance: 95 },
  { id: 4, name: 'Sneha Gupta', role: 'Support Specialist', status: 'Active', tasks: 6, leads: 8, conversion: 25, performance: 85 },
];

const pipelineStats = [
  { stage: 'New Leads', count: 45, color: 'bg-blue-500' },
  { stage: 'Contacted', count: 32, color: 'bg-cyan-500' },
  { stage: 'Qualified', count: 24, color: 'bg-purple-500' },
  { stage: 'Proposal', count: 18, color: 'bg-amber-500' },
  { stage: 'Negotiation', count: 12, color: 'bg-pink-500' },
  { stage: 'Closed Won', count: 42, color: 'bg-emerald-500' },
];

export function FOCRMHRMScreen() {
  const { toast } = useToast();

  const handleReassign = (leadName: string) => {
    toast({
      title: "Lead Reassigned",
      description: `${leadName} has been reassigned successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            CRM + HRM Management
          </h1>
          <p className="text-muted-foreground">Auto Lead Assignment • Team Management • Performance Tracking</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-emerald-500 gap-1">
            <CheckCircle className="h-3 w-3" />
            CRM Active
          </Badge>
          <Badge className="bg-blue-500 gap-1">
            <CheckCircle className="h-3 w-3" />
            HRM Active
          </Badge>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {pipelineStats.map((stat, idx) => (
          <Card key={idx} className="bg-card/50">
            <CardContent className="p-3 text-center">
              <div className={`w-8 h-8 mx-auto mb-2 rounded-lg ${stat.color} flex items-center justify-center`}>
                <span className="text-white text-sm font-bold">{stat.count}</span>
              </div>
              <p className="text-xs text-muted-foreground">{stat.stage}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="crm" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="crm" className="gap-2">
            <Target className="h-4 w-4" />
            CRM - Leads
          </TabsTrigger>
          <TabsTrigger value="hrm" className="gap-2">
            <Users className="h-4 w-4" />
            HRM - Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="crm" className="space-y-4">
          {/* CRM Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Total Leads</span>
                </div>
                <p className="text-2xl font-bold">156</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-muted-foreground">Follow-ups Today</span>
                </div>
                <p className="text-2xl font-bold">18</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-muted-foreground">Converted</span>
                </div>
                <p className="text-2xl font-bold">42</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-muted-foreground">Conversion Rate</span>
                </div>
                <p className="text-2xl font-bold">34%</p>
              </CardContent>
            </Card>
          </div>

          {/* Leads List */}
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Lead Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {crmLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.source} • {lead.assignee}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        lead.status === 'Qualified' || lead.status === 'Proposal' ? 'default' :
                        lead.status === 'Negotiation' ? 'secondary' : 'outline'
                      }>
                        {lead.status}
                      </Badge>
                      <Badge variant={
                        lead.priority === 'High' ? 'destructive' :
                        lead.priority === 'Medium' ? 'secondary' : 'outline'
                      }>
                        {lead.priority}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{lead.followUp}</span>
                      <Button size="sm" variant="outline" onClick={() => handleReassign(lead.name)}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Reassign
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hrm" className="space-y-4">
          {/* HRM Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Total Staff</span>
                </div>
                <p className="text-2xl font-bold">12</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-muted-foreground">Present Today</span>
                </div>
                <p className="text-2xl font-bold">10</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardList className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-muted-foreground">Active Tasks</span>
                </div>
                <p className="text-2xl font-bold">31</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-cyan-500" />
                  <span className="text-sm text-muted-foreground">Avg Performance</span>
                </div>
                <p className="text-2xl font-bold">90%</p>
              </CardContent>
            </Card>
          </div>

          {/* Team List */}
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hrmTeam.map((member) => (
                  <div key={member.id} className="p-4 bg-background/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>
                        {member.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Tasks</p>
                        <p className="font-medium">{member.tasks}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Leads</p>
                        <p className="font-medium">{member.leads}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conversion</p>
                        <p className="font-medium text-emerald-500">{member.conversion}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Performance</p>
                        <div className="flex items-center gap-2">
                          <Progress value={member.performance} className="h-2 flex-1" />
                          <span className="font-medium">{member.performance}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
            <Button variant="outline">
              <ClipboardList className="h-4 w-4 mr-2" />
              Assign Tasks
            </Button>
            <Button variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              View Activity Logs
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Auto-enabled Notice */}
      <Card className="bg-gradient-to-r from-primary/10 to-emerald-500/10 border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-emerald-500" />
            <div>
              <h3 className="font-semibold">Auto-Enabled on First Order</h3>
              <p className="text-sm text-muted-foreground">
                CRM + HRM modules are automatically activated when you place your first order.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
