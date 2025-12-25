import React from 'react';
import { Target, ArrowRight, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AMLeads: React.FC = () => {
  const leads = [
    { id: 'L-001', source: 'Website', status: 'new', assignedTo: 'Unassigned', priority: 'high', time: '5 min ago' },
    { id: 'L-002', source: 'Referral', status: 'qualified', assignedTo: 'Franchise F-001', priority: 'medium', time: '15 min ago' },
    { id: 'L-003', source: 'Campaign', status: 'contacted', assignedTo: 'Reseller R-003', priority: 'low', time: '30 min ago' },
    { id: 'L-004', source: 'Direct', status: 'new', assignedTo: 'Unassigned', priority: 'high', time: '45 min ago' },
    { id: 'L-005', source: 'Partner', status: 'qualified', assignedTo: 'Franchise F-002', priority: 'medium', time: '1 hour ago' },
  ];

  const routingRules = [
    { rule: 'High Priority → Franchise First', active: true },
    { rule: 'Campaign Leads → Reseller Pool', active: true },
    { rule: 'Direct Leads → Round Robin', active: true },
    { rule: 'Referrals → Source Franchise', active: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Leads & Routing</h2>
        <p className="text-muted-foreground">Lead management and assignment rules</p>
      </div>

      {/* Lead Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">35</p>
            <p className="text-sm text-muted-foreground">Total Today</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400">8</p>
            <p className="text-sm text-muted-foreground">Unassigned</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-400">22</p>
            <p className="text-sm text-muted-foreground">Qualified</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-400">5</p>
            <p className="text-sm text-muted-foreground">Converted</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-400" />
            Lead Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 text-muted-foreground font-medium">Lead ID</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Source</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Assigned To</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Priority</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-3 text-foreground font-mono">{lead.id}</td>
                    <td className="p-3 text-foreground">{lead.source}</td>
                    <td className="p-3">
                      <Badge variant={lead.status === 'new' ? 'secondary' : 'default'}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-foreground">{lead.assignedTo}</td>
                    <td className="p-3">
                      <Badge variant={
                        lead.priority === 'high' ? 'destructive' :
                        lead.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {lead.priority}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{lead.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Routing Rules */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-green-400" />
            Active Routing Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {routingRules.map((rule, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-foreground">{rule.rule}</span>
                <Badge variant={rule.active ? 'default' : 'secondary'}>
                  {rule.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AMLeads;
