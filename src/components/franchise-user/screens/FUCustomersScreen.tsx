import React from 'react';
import { Users, Phone, MessageCircle, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const customers = [
  { id: 1, name: 'Rajesh Industries', phone: '98***45678', plan: 'Premium', since: 'Jan 2024', status: 'Active' },
  { id: 2, name: 'Sharma Traders', phone: '87***12345', plan: 'Basic', since: 'Dec 2023', status: 'Active' },
  { id: 3, name: 'Kumar Enterprises', phone: '99***67890', plan: 'Premium', since: 'Nov 2023', status: 'Active' },
  { id: 4, name: 'Patel Solutions', phone: '91***34567', plan: 'Standard', since: 'Oct 2023', status: 'Renewal Due' },
];

export function FUCustomersScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            My Customers
          </h1>
          <p className="text-muted-foreground">All your customers in one place.</p>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-emerald-500">32</p>
            <p className="text-sm">Active Customers</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-amber-500">5</p>
            <p className="text-sm">Renewal Due</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-blue-500">₹4.2L</p>
            <p className="text-sm">Total Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {customers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-lg">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone} • Since {customer.since}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{customer.plan}</Badge>
                  <Badge className={customer.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}>
                    {customer.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="lg" variant="outline">
                      <Phone className="h-5 w-5 mr-2" />
                      Call
                    </Button>
                    <Button size="lg" variant="outline">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      WhatsApp
                    </Button>
                    <Button size="lg" variant="outline">
                      <Eye className="h-5 w-5 mr-2" />
                      View
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
