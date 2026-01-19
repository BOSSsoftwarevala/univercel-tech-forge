/**
 * PERFORMANCE & REPORTS SCREEN
 * Sales Report, Commission Report, Daily/Monthly, Charts, Export
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const salesData = {
  today: 4250,
  yesterday: 3800,
  thisMonth: 45200,
  lastMonth: 42100,
  growth: 7.4,
};

const commissionData = {
  earned: 6780,
  pending: 1200,
  rate: 15,
};

const dailySales = [
  { date: 'Jan 15', amount: 4250 },
  { date: 'Jan 14', amount: 3800 },
  { date: 'Jan 13', amount: 5100 },
  { date: 'Jan 12', amount: 2900 },
  { date: 'Jan 11', amount: 4500 },
];

const monthlySales = [
  { month: 'Jan 2024', sales: 45200, orders: 18, commission: 6780 },
  { month: 'Dec 2023', sales: 42100, orders: 16, commission: 6315 },
  { month: 'Nov 2023', sales: 38500, orders: 14, commission: 5775 },
  { month: 'Oct 2023', sales: 41200, orders: 15, commission: 6180 },
];

export function FOPerformanceReportsScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Performance & Reports</h1>
          <p className="text-muted-foreground">Track your sales and commission performance</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Today's Sales</p>
                <p className="text-2xl font-bold">${salesData.today.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                  <span className="text-xs text-emerald-400">+12% vs yesterday</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">${salesData.thisMonth.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                  <span className="text-xs text-emerald-400">+{salesData.growth}% growth</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Commission Earned</p>
                <p className="text-2xl font-bold">${commissionData.earned.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">@ {commissionData.rate}% rate</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Pending Commission</p>
                <p className="text-2xl font-bold">${commissionData.pending.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Processing</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="commission">Commission Report</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Daily Sales */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Daily Sales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dailySales.map((day, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">{day.date}</span>
                    <span className="font-bold">${day.amount.toLocaleString()}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Monthly Sales */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Monthly Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {monthlySales.map((month, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{month.month}</span>
                      <span className="font-bold text-primary">${month.sales.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{month.orders} orders</span>
                      <span>Commission: ${month.commission}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commission" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Commission Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-sm text-muted-foreground">Total Earned (All Time)</p>
                  <p className="text-2xl font-bold text-emerald-400">$24,850</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-blue-400">${commissionData.earned}</p>
                </div>
                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <p className="text-sm text-muted-foreground">Pending Payout</p>
                  <p className="text-2xl font-bold text-orange-400">${commissionData.pending}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h4 className="font-semibold">Recent Commission History</h4>
                {monthlySales.map((month, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">{month.month}</p>
                      <p className="text-xs text-muted-foreground">From {month.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">${month.commission}</p>
                      <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Paid</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FOPerformanceReportsScreen;
