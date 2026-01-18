import React from 'react';
import { Target, Phone, MessageCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const leads = [
  { id: 1, name: 'Rajesh Kumar', phone: '98***45678', status: 'new', source: 'Website', time: '10 min ago' },
  { id: 2, name: 'Priya Sharma', phone: '87***12345', status: 'followup', source: 'Meta Ad', time: '1 hour ago' },
  { id: 3, name: 'Amit Patel', phone: '99***67890', status: 'new', source: 'Google', time: '2 hours ago' },
  { id: 4, name: 'Sneha Gupta', phone: '91***34567', status: 'converted', source: 'Referral', time: 'Yesterday' },
  { id: 5, name: 'Vikram Singh', phone: '88***23456', status: 'followup', source: 'Website', time: 'Yesterday' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new': return 'bg-blue-500';
    case 'followup': return 'bg-amber-500';
    case 'converted': return 'bg-emerald-500';
    default: return 'bg-gray-500';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'new': return 'New';
    case 'followup': return 'Follow-up';
    case 'converted': return 'Converted';
    default: return status;
  }
};

export function FULeadsScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            My Leads
          </h1>
          <p className="text-muted-foreground">All your leads in one place. Easy to manage.</p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-500">12</p>
            <p className="text-sm">New Leads</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-500">8</p>
            <p className="text-sm">Follow-up</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-500">28</p>
            <p className="text-sm">Converted</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">All Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(lead.status)}`} />
                  <div>
                    <p className="font-medium text-lg">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.phone} • {lead.source}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{lead.time}</span>
                  <Badge className={getStatusColor(lead.status)}>
                    {getStatusLabel(lead.status)}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                      <Phone className="h-5 w-5 mr-2" />
                      Call
                    </Button>
                    <Button size="lg" variant="outline" className="border-green-500 text-green-500">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      WhatsApp
                    </Button>
                    <Button size="lg" variant="outline">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Mark Done
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
