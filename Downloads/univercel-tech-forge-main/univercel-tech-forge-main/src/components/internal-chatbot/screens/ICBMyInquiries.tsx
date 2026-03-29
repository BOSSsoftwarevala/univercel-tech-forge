/**
 * MY INQUIRIES
 * User's submitted inquiries list
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, MessageCircle } from 'lucide-react';

const inquiries = [
  { id: 'INQ-001', type: 'Support', subject: 'Login issue', status: 'pending', created: '2 hours ago' },
  { id: 'INQ-002', type: 'Dev', subject: 'API error', status: 'approved', created: '1 day ago' },
  { id: 'INQ-003', type: 'Sales', subject: 'Pricing query', status: 'active', created: '2 days ago' },
  { id: 'INQ-004', type: 'Legal', subject: 'Contract review', status: 'closed', created: '3 days ago' },
  { id: 'INQ-005', type: 'Server', subject: 'Downtime report', status: 'rejected', created: '4 days ago' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="text-amber-500 border-amber-500"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    case 'approved':
      return <Badge variant="outline" className="text-blue-500 border-blue-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
    case 'active':
      return <Badge variant="outline" className="text-green-500 border-green-500"><MessageCircle className="h-3 w-3 mr-1" />Active</Badge>;
    case 'closed':
      return <Badge variant="outline" className="text-muted-foreground"><XCircle className="h-3 w-3 mr-1" />Closed</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="text-red-500 border-red-500"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const ICBMyInquiries: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Inquiries</h1>
        <p className="text-muted-foreground">View all your submitted inquiries</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Inquiry History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {inquiries.map((inquiry) => (
              <div 
                key={inquiry.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-medium">{inquiry.id}</span>
                  <div>
                    <p className="font-medium">{inquiry.subject}</p>
                    <p className="text-xs text-muted-foreground">{inquiry.type} • {inquiry.created}</p>
                  </div>
                </div>
                {getStatusBadge(inquiry.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ICBMyInquiries;
