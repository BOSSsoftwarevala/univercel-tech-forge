/**
 * FRANCHISE OWNER - REPORTS & ANALYTICS
 * Sales, Commission, Order, Team, Wallet Reports with Export
 */

import React from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, ShoppingCart, Users,
  Wallet, Download, FileText, FileSpreadsheet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const reportTypes = [
  { 
    id: 'sales',
    title: 'Sales Report',
    icon: TrendingUp,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    description: 'Revenue, conversions, trends',
    data: [
      { period: 'This Month', value: '₹8,56,000', change: '+12%' },
      { period: 'Last Month', value: '₹7,64,000', change: '+8%' },
      { period: 'This Quarter', value: '₹24,85,000', change: '+15%' },
    ]
  },
  { 
    id: 'commission',
    title: 'Commission Report',
    icon: DollarSign,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    description: 'Earned, pending, paid commissions',
    data: [
      { period: 'This Month', value: '₹48,500', change: '+18%' },
      { period: 'Last Month', value: '₹42,300', change: '+10%' },
      { period: 'This Quarter', value: '₹1,38,600', change: '+22%' },
    ]
  },
  { 
    id: 'orders',
    title: 'Order Report',
    icon: ShoppingCart,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    description: 'Orders, status, delivery stats',
    data: [
      { period: 'This Month', value: '42 Orders', change: '+8' },
      { period: 'Last Month', value: '38 Orders', change: '+5' },
      { period: 'This Quarter', value: '128 Orders', change: '+32' },
    ]
  },
  { 
    id: 'team',
    title: 'Team Report',
    icon: Users,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    description: 'Performance, sales contribution',
    data: [
      { period: 'Avg Performance', value: '92%', change: '+3%' },
      { period: 'Top Performer', value: 'Amit K.', change: '98%' },
      { period: 'Active Staff', value: '12', change: '10 Present' },
    ]
  },
  { 
    id: 'wallet',
    title: 'Wallet Report',
    icon: Wallet,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    description: 'Transactions, balance history',
    data: [
      { period: 'Current Balance', value: '₹2,45,680', change: 'Available' },
      { period: 'Monthly Spend', value: '₹3,85,000', change: 'Debits' },
      { period: 'Monthly Credits', value: '₹4,50,000', change: 'Credits' },
    ]
  },
];

const detailedMetrics = [
  { label: 'Website Leads', value: 45, target: 50 },
  { label: 'Meta Ads Leads', value: 38, target: 40 },
  { label: 'Google Ads Leads', value: 32, target: 35 },
  { label: 'Influencer Leads', value: 28, target: 30 },
  { label: 'Direct Referrals', value: 15, target: 15 },
];

export function FOReportsAnalytics() {
  const { toast } = useToast();

  const handleExport = (reportType: string, format: 'pdf' | 'csv') => {
    toast({
      title: `Exporting ${format.toUpperCase()}`,
      description: `${reportType} report is being prepared for download...`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">Sales • Commission • Orders • Team • Wallet Reports</p>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => (
          <Card key={report.id} className="bg-card/50 hover:border-primary/30 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${report.bgColor}`}>
                    <report.icon className={`h-5 w-5 ${report.color}`} />
                  </div>
                  <span>{report.title}</span>
                </div>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{report.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {report.data.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.period}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.value}</span>
                      <Badge variant="outline" className="text-xs">{item.change}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleExport(report.title, 'pdf')}>
                  <FileText className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleExport(report.title, 'csv')}>
                  <FileSpreadsheet className="h-4 w-4 mr-1" />
                  CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Lead Source Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {detailedMetrics.map((metric, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{metric.label}</span>
                  <span className="text-muted-foreground">
                    {metric.value} / {metric.target} ({Math.round((metric.value / metric.target) * 100)}%)
                  </span>
                </div>
                <Progress value={(metric.value / metric.target) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 hover:border-primary/30 transition-all cursor-pointer">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
            <p className="font-medium">Revenue Trends</p>
            <p className="text-sm text-muted-foreground">Monthly analysis</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 hover:border-primary/30 transition-all cursor-pointer">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="font-medium">Team Analytics</p>
            <p className="text-sm text-muted-foreground">Performance breakdown</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 hover:border-primary/30 transition-all cursor-pointer">
          <CardContent className="p-4 text-center">
            <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <p className="font-medium">Order History</p>
            <p className="text-sm text-muted-foreground">Complete records</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 hover:border-primary/30 transition-all cursor-pointer">
          <CardContent className="p-4 text-center">
            <Wallet className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <p className="font-medium">Financial Summary</p>
            <p className="text-sm text-muted-foreground">Balance & transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Export All */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Export All Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Download comprehensive report package
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExport('All Reports', 'pdf')}>
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => handleExport('All Reports', 'csv')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
