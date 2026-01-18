import React from 'react';
import { Target, Globe, Facebook, Search, Star, PenLine, MapPin, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const leadSources = [
  { id: 1, source: 'Website Leads', icon: Globe, count: 45, color: 'bg-blue-500' },
  { id: 2, source: 'Meta Leads', icon: Facebook, count: 38, color: 'bg-indigo-500' },
  { id: 3, source: 'Google Leads', icon: Search, count: 32, color: 'bg-red-500' },
  { id: 4, source: 'Influencer Leads', icon: Star, count: 28, color: 'bg-yellow-500' },
  { id: 5, source: 'Manual Leads', icon: PenLine, count: 15, color: 'bg-purple-500' },
];

const recentLeads = [
  { id: 1, name: 'Vikram Sharma', source: 'Website', city: 'Mumbai', time: '5 min ago', status: 'New' },
  { id: 2, name: 'Anjali Patel', source: 'Meta', city: 'Pune', time: '15 min ago', status: 'Assigned' },
  { id: 3, name: 'Rohit Kumar', source: 'Google', city: 'Delhi', time: '1 hour ago', status: 'Qualified' },
  { id: 4, name: 'Neha Gupta', source: 'Influencer', city: 'Bangalore', time: '2 hours ago', status: 'Converted' },
];

export function FOLeadScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Lead Management
          </h1>
          <p className="text-muted-foreground">Auto-Assign • Website • Meta • Google • Influencer • Manual</p>
        </div>
      </div>

      {/* Lead Sources */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {leadSources.map((source) => (
          <Card key={source.id} className="bg-card/50 hover:border-primary/30 transition-all cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-2 rounded-lg ${source.color}`}>
                  <source.icon className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold">{source.count}</p>
              <p className="text-sm text-muted-foreground">{source.source}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-card/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Country: India</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">City: All</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Source: All</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Time: Today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Leads */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.source} • {lead.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{lead.time}</span>
                  <Badge variant={
                    lead.status === 'Converted' ? 'default' :
                    lead.status === 'Qualified' ? 'secondary' : 'outline'
                  }>
                    {lead.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Auto Assign
                    </Button>
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Qualified
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
