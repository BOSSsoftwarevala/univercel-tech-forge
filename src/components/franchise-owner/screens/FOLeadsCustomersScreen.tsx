/**
 * LEADS & CUSTOMERS SCREEN
 * My Leads, Assigned Leads, Source, Status, Convert
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  Globe,
  Target,
  TrendingUp,
  ShoppingCart,
  Eye,
} from 'lucide-react';

const leads = [
  {
    id: 'L-001',
    name: 'Jo** D**',
    email: 'j***@***.com',
    phone: '+1 ***-***-1234',
    source: 'SEO',
    status: 'hot',
    interest: 'School Management',
  },
  {
    id: 'L-002',
    name: 'Sa** W**',
    email: 's***@***.com',
    phone: '+1 ***-***-5678',
    source: 'Meta Ads',
    status: 'warm',
    interest: 'CRM Software',
  },
  {
    id: 'L-003',
    name: 'Mi** J**',
    email: 'm***@***.com',
    phone: '+1 ***-***-9012',
    source: 'Website',
    status: 'new',
    interest: 'ERP Suite',
  },
];

const assignedLeads = [
  {
    id: 'L-010',
    name: 'Al** B**',
    email: 'a***@***.com',
    phone: '+1 ***-***-3456',
    source: 'Referral',
    status: 'qualified',
    interest: 'Healthcare System',
    assignedBy: 'HQ',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'hot':
      return 'bg-red-500/20 text-red-400';
    case 'warm':
      return 'bg-orange-500/20 text-orange-400';
    case 'new':
      return 'bg-blue-500/20 text-blue-400';
    case 'qualified':
      return 'bg-emerald-500/20 text-emerald-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'SEO':
      return Target;
    case 'Meta Ads':
      return TrendingUp;
    case 'Website':
      return Globe;
    default:
      return Users;
  }
};

export function FOLeadsCustomersScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads & Customers</h1>
          <p className="text-muted-foreground">Manage your leads and convert to orders</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Leads</p>
              <p className="text-xl font-bold">24</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hot Leads</p>
              <p className="text-xl font-bold">5</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Warm Leads</p>
              <p className="text-xl font-bold">12</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Converted</p>
              <p className="text-xl font-bold">8</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="my" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my">My Leads</TabsTrigger>
          <TabsTrigger value="assigned">Assigned Leads</TabsTrigger>
        </TabsList>

        <TabsContent value="my" className="space-y-4">
          {leads.map((lead) => {
            const SourceIcon = getSourceIcon(lead.source);
            return (
              <Card key={lead.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{lead.name}</span>
                          <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <SourceIcon className="h-3 w-3 mr-1" />
                            {lead.source}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Interested in: {lead.interest}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button size="sm" className="gap-1">
                        <ShoppingCart className="h-3 w-3" />
                        Convert
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="assigned" className="space-y-4">
          {assignedLeads.map((lead) => {
            const SourceIcon = getSourceIcon(lead.source);
            return (
              <Card key={lead.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{lead.name}</span>
                          <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                          <Badge variant="secondary">Assigned by: {lead.assignedBy}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">Interested in: {lead.interest}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button size="sm" className="gap-1">
                        <ShoppingCart className="h-3 w-3" />
                        Convert
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FOLeadsCustomersScreen;
