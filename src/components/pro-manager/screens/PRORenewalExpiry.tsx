/**
 * RENEWAL & EXPIRY
 * Upcoming Renewals • Grace Period • Auto Suspend Rules
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, Bell, Clock, Ban } from 'lucide-react';
import { toast } from 'sonner';

const mockRenewals = [
  { id: 'RNW-001', user: 'PRO-***21', product: 'Enterprise Suite', expiry: '2024-02-15', grace: '7 days', status: 'upcoming' },
  { id: 'RNW-002', user: 'PRO-***45', product: 'Business Pro', expiry: '2024-02-10', grace: '3 days', status: 'due' },
  { id: 'RNW-003', user: 'PRO-***78', product: 'Agency Pack', expiry: '2024-02-05', grace: 'Expired', status: 'grace' },
  { id: 'RNW-004', user: 'PRO-***92', product: 'Developer Kit', expiry: '2024-01-28', grace: 'Expired', status: 'suspended' },
];

export const PRORenewalExpiry: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming': return <Badge className="bg-blue-500/20 text-blue-500">Upcoming</Badge>;
      case 'due': return <Badge className="bg-amber-500/20 text-amber-500">Due Now</Badge>;
      case 'grace': return <Badge className="bg-orange-500/20 text-orange-500">Grace Period</Badge>;
      case 'suspended': return <Badge className="bg-red-500/20 text-red-500">Suspended</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Renewal & Expiry</h1>
        <p className="text-muted-foreground">Manage license renewals and expiry</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Renewal Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockRenewals.map((renewal, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <CalendarClock className="h-5 w-5 text-primary" />
                  <span className="font-mono text-sm text-foreground">{renewal.id}</span>
                  <span className="text-sm text-foreground">{renewal.user}</span>
                  <span className="text-sm text-foreground">{renewal.product}</span>
                  <span className="text-xs text-muted-foreground">Expiry: {renewal.expiry}</span>
                  <span className="text-xs text-muted-foreground">Grace: {renewal.grace}</span>
                  {getStatusBadge(renewal.status)}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast.info('Notification sent')}>
                    <Bell className="h-4 w-4 mr-1" />
                    Notify
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success('Grace period extended')}>
                    <Clock className="h-4 w-4 mr-1" />
                    Extend
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => toast.warning('Account suspended')}>
                    <Ban className="h-4 w-4 mr-1" />
                    Suspend
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PRORenewalExpiry;
