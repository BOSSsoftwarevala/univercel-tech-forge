import React from 'react';
import { TrendingUp, Calendar, IndianRupee, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const salesData = [
  { id: 1, customer: 'Rajesh Industries', amount: '₹45,000', date: 'Today', product: 'Premium Plan' },
  { id: 2, customer: 'Sharma Traders', amount: '₹28,000', date: 'Yesterday', product: 'Basic Plan' },
  { id: 3, customer: 'Kumar Enterprises', amount: '₹65,000', date: '2 days ago', product: 'Premium Plan' },
  { id: 4, customer: 'Patel Solutions', amount: '₹32,000', date: '3 days ago', product: 'Standard Plan' },
];

export function FUSalesScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            My Sales
          </h1>
          <p className="text-muted-foreground">Track your sales performance easily.</p>
        </div>
      </div>

      {/* Sales Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-3xl font-bold">₹45K</p>
            <p className="text-sm text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
            <p className="text-3xl font-bold">₹2.8L</p>
            <p className="text-sm text-muted-foreground">This Month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <p className="text-3xl font-bold">28</p>
            <p className="text-sm text-muted-foreground">Total Sales</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-6 text-center">
            <IndianRupee className="h-8 w-8 mx-auto mb-2 text-cyan-500" />
            <p className="text-3xl font-bold">₹10K</p>
            <p className="text-sm text-muted-foreground">Avg Sale</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {salesData.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <IndianRupee className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium text-lg">{sale.customer}</p>
                    <p className="text-sm text-muted-foreground">{sale.product}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-emerald-500">{sale.amount}</p>
                  <p className="text-sm text-muted-foreground">{sale.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
