import React from 'react';
import { TrendingUp, Calendar, Users, IndianRupee } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const dailySales = [
  { date: 'Today', sales: 12, revenue: '₹1.2L', target: 15, achieved: 80 },
  { date: 'Yesterday', sales: 15, revenue: '₹1.5L', target: 15, achieved: 100 },
  { date: '2 days ago', sales: 10, revenue: '₹0.9L', target: 15, achieved: 67 },
];

const staffPerformance = [
  { name: 'Rahul Sharma', sales: 28, revenue: '₹2.8L', target: 30, achieved: 93 },
  { name: 'Priya Patel', sales: 22, revenue: '₹2.2L', target: 25, achieved: 88 },
  { name: 'Amit Kumar', sales: 35, revenue: '₹3.5L', target: 30, achieved: 117 },
  { name: 'Sneha Gupta', sales: 18, revenue: '₹1.8L', target: 20, achieved: 90 },
];

export function FOSalesScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Sales Performance
          </h1>
          <p className="text-muted-foreground">Daily Sales • Monthly Sales • Staff Performance (Read-only)</p>
        </div>
        <Badge variant="outline">Read Only</Badge>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">This Month</span>
            </div>
            <p className="text-2xl font-bold">₹8.5L</p>
            <p className="text-sm text-emerald-500">+12% vs last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">Total Sales</span>
            </div>
            <p className="text-2xl font-bold">85</p>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Active Staff</span>
            </div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Sales team</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <IndianRupee className="h-4 w-4 text-cyan-500" />
              <span className="text-sm text-muted-foreground">Avg Deal Size</span>
            </div>
            <p className="text-2xl font-bold">₹10K</p>
            <p className="text-sm text-muted-foreground">Per sale</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Sales */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Daily Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dailySales.map((day, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{day.date}</p>
                    <p className="text-sm text-muted-foreground">{day.sales} sales</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-medium text-emerald-500">{day.revenue}</span>
                  <div className="w-32">
                    <Progress value={day.achieved} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{day.achieved}% of target</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Staff Performance */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Staff Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {staffPerformance.map((staff, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{staff.name}</p>
                    <p className="text-sm text-muted-foreground">{staff.sales} sales</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-medium text-emerald-500">{staff.revenue}</span>
                  <div className="w-32">
                    <Progress value={Math.min(staff.achieved, 100)} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">{staff.achieved}% of target</p>
                  </div>
                  <Badge variant={staff.achieved >= 100 ? 'default' : 'secondary'}>
                    {staff.achieved >= 100 ? 'Target Met' : 'In Progress'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
