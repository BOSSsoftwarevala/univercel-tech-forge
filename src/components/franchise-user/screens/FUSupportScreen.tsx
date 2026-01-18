import React from 'react';
import { HeadphonesIcon, Plus, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const tickets = [
  { id: 'TKT-001', issue: 'Payment not reflecting', status: 'Open', time: '2 hours ago', reply: 'AI replied' },
  { id: 'TKT-002', issue: 'Lead not assigned', status: 'Resolved', time: '1 day ago', reply: 'Resolved' },
  { id: 'TKT-003', issue: 'Ad not running', status: 'Open', time: '3 days ago', reply: 'Human assigned' },
];

export function FUSupportScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HeadphonesIcon className="h-6 w-6 text-primary" />
            Support
          </h1>
          <p className="text-muted-foreground">Raise issues and track status easily.</p>
        </div>
      </div>

      {/* Raise Issue Button */}
      <Card className="bg-gradient-to-r from-primary/20 to-purple-500/20 border-primary/30">
        <CardContent className="p-8 text-center">
          <HeadphonesIcon className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-bold mb-2">Need Help?</h2>
          <p className="text-muted-foreground mb-6">
            AI will try to solve your issue first. Human support if needed.
          </p>
          <Button size="lg" className="text-lg px-8 py-6">
            <Plus className="h-6 w-6 mr-2" />
            Raise New Issue
          </Button>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <p className="text-3xl font-bold">2</p>
            <p className="text-sm">Open Issues</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
            <p className="text-3xl font-bold">8</p>
            <p className="text-sm">Resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Tickets */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">My Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    ticket.status === 'Open' ? 'bg-amber-500/10' : 'bg-emerald-500/10'
                  }`}>
                    <HeadphonesIcon className={`h-6 w-6 ${
                      ticket.status === 'Open' ? 'text-amber-500' : 'text-emerald-500'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">{ticket.issue}</p>
                    <p className="text-sm text-muted-foreground">{ticket.id} • {ticket.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{ticket.reply}</Badge>
                  <Badge className={ticket.status === 'Open' ? 'bg-amber-500' : 'bg-emerald-500'}>
                    {ticket.status}
                  </Badge>
                  <Button size="lg" variant="outline">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
