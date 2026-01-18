import React from 'react';
import { UserCheck, Users, Phone, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const customers = [
  { id: 1, name: 'Rajesh Industries', status: 'Follow-up', interest: 'High', staff: 'Rahul S.', callStatus: 'Pending' },
  { id: 2, name: 'Sharma Enterprises', status: 'Closed', interest: 'High', staff: 'Priya P.', callStatus: 'Completed' },
  { id: 3, name: 'Kumar Trading Co.', status: 'Follow-up', interest: 'Medium', staff: 'Amit K.', callStatus: 'Scheduled' },
  { id: 4, name: 'Patel Solutions', status: 'Lost', interest: 'Low', staff: 'Sneha G.', callStatus: 'No Answer' },
];

export function FOCRMScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-primary" />
            CRM Management
          </h1>
          <p className="text-muted-foreground">All Customers • Follow-ups • Closed Deals • Lost Deals</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">All Customers</span>
            </div>
            <p className="text-2xl font-bold">156</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Follow-ups</span>
            </div>
            <p className="text-2xl font-bold">28</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">Closed Deals</span>
            </div>
            <p className="text-2xl font-bold">42</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Lost Deals</span>
            </div>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {customers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">Assigned: {customer.staff}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={
                    customer.status === 'Closed' ? 'default' : 
                    customer.status === 'Lost' ? 'destructive' : 'secondary'
                  }>
                    {customer.status}
                  </Badge>
                  <Badge variant="outline">{customer.interest} Interest</Badge>
                  <span className="text-sm text-muted-foreground">{customer.callStatus}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View Profile</Button>
                    <Button size="sm" variant="outline">Update Status</Button>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Reassign
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
