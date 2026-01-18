/**
 * PROMISE & SLA TRACKER
 * Promised Action • Deadline • Owner • SLA Status
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, CheckCircle, Clock, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';

const mockPromises = [
  { id: 'SLA-001', action: 'Bug fix delivery', deadline: '2024-02-10', owner: 'Dev Team', status: 'on_track' },
  { id: 'SLA-002', action: 'Feature implementation', deadline: '2024-02-08', owner: 'Product', status: 'at_risk' },
  { id: 'SLA-003', action: 'Account migration', deadline: '2024-02-15', owner: 'Support', status: 'on_track' },
  { id: 'SLA-004', action: 'License upgrade', deadline: '2024-02-05', owner: 'Billing', status: 'breached' },
  { id: 'SLA-005', action: 'Custom integration', deadline: '2024-02-20', owner: 'Dev Team', status: 'fulfilled' },
];

export const PROPromiseSLATracker: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_track': return <Badge className="bg-green-500/20 text-green-500">On Track</Badge>;
      case 'at_risk': return <Badge className="bg-amber-500/20 text-amber-500">At Risk</Badge>;
      case 'breached': return <Badge className="bg-red-500/20 text-red-500">Breached</Badge>;
      case 'fulfilled': return <Badge className="bg-blue-500/20 text-blue-500">Fulfilled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Promise & SLA Tracker</h1>
        <p className="text-muted-foreground">Track commitments and SLA compliance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Active Promises</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockPromises.map((promise, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Timer className="h-5 w-5 text-primary" />
                  <span className="font-mono text-sm text-foreground">{promise.id}</span>
                  <span className="text-sm text-foreground">{promise.action}</span>
                  <Badge variant="outline">{promise.owner}</Badge>
                  <span className="text-xs text-muted-foreground">Due: {promise.deadline}</span>
                  {getStatusBadge(promise.status)}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => toast.success('Promise fulfilled')}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Fulfill
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.warning('Extension requires approval')}>
                    <Clock className="h-4 w-4 mr-1" />
                    Extend
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.warning('Escalated')}>
                    <ArrowUp className="h-4 w-4 mr-1" />
                    Escalate
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

export default PROPromiseSLATracker;
