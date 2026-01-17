import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  MonitorPlay,
  Globe,
  Building2,
  Users,
  DollarSign,
  Download,
  Calendar,
  Filter,
  ArrowRight,
} from 'lucide-react';

interface AnalyticsData {
  label: string;
  value: number;
  change: number;
  color: string;
}

const productPerformance: AnalyticsData[] = [
  { label: 'CRM Enterprise', value: 245, change: 12.5, color: 'bg-blue-500' },
  { label: 'HR Management Pro', value: 189, change: 8.3, color: 'bg-green-500' },
  { label: 'Inventory Tracker', value: 156, change: -2.1, color: 'bg-amber-500' },
  { label: 'POS System', value: 134, change: 15.8, color: 'bg-purple-500' },
  { label: 'Accounting Suite', value: 98, change: 5.4, color: 'bg-cyan-500' },
];

const demoFunnel = [
  { stage: 'Demo Views', count: 1250, percentage: 100 },
  { stage: 'Started Demo', count: 875, percentage: 70 },
  { stage: 'Completed Demo', count: 438, percentage: 35 },
  { stage: 'Requested Quote', count: 175, percentage: 14 },
  { stage: 'Converted', count: 88, percentage: 7 },
];

const countryData = [
  { country: 'United States', sales: 1245, percentage: 35 },
  { country: 'United Kingdom', sales: 567, percentage: 16 },
  { country: 'Germany', sales: 423, percentage: 12 },
  { country: 'India', sales: 389, percentage: 11 },
  { country: 'Canada', sales: 312, percentage: 9 },
  { country: 'Australia', sales: 287, percentage: 8 },
  { country: 'Others', sales: 320, percentage: 9 },
];

const PMAnalytics: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-pink-500" />
            Product Analytics
          </h1>
          <p className="text-muted-foreground text-sm">Performance metrics, funnels, and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-5 h-5 text-blue-500" />
              <Badge variant="secondary" className="text-green-500">
                <TrendingUp className="w-3 h-3 mr-1" />
                12%
              </Badge>
            </div>
            <p className="text-2xl font-bold">156</p>
            <p className="text-xs text-muted-foreground">Products Sold</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <MonitorPlay className="w-5 h-5 text-purple-500" />
              <Badge variant="secondary" className="text-green-500">
                <TrendingUp className="w-3 h-3 mr-1" />
                8%
              </Badge>
            </div>
            <p className="text-2xl font-bold">1,250</p>
            <p className="text-xs text-muted-foreground">Demo Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-cyan-500" />
              <Badge variant="secondary" className="text-green-500">
                <TrendingUp className="w-3 h-3 mr-1" />
                15%
              </Badge>
            </div>
            <p className="text-2xl font-bold">7.04%</p>
            <p className="text-xs text-muted-foreground">Conversion Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              <Badge variant="secondary" className="text-green-500">
                <TrendingUp className="w-3 h-3 mr-1" />
                22%
              </Badge>
            </div>
            <p className="text-2xl font-bold">$45,678</p>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance">
        <TabsList>
          <TabsTrigger value="performance">Product Performance</TabsTrigger>
          <TabsTrigger value="funnel">Demo → Paid Funnel</TabsTrigger>
          <TabsTrigger value="geography">Country Wise</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>

        {/* Product Performance Tab */}
        <TabsContent value="performance" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {productPerformance.map((product, index) => (
                <div key={product.label} className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-6">{index + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{product.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{product.value}</span>
                        <Badge variant={product.change >= 0 ? 'default' : 'destructive'} className="text-xs">
                          {product.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                          {Math.abs(product.change)}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={(product.value / 250) * 100} className={`h-2 [&>div]:${product.color}`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Demo Funnel Tab */}
        <TabsContent value="funnel" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Demo to Paid Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoFunnel.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div 
                      className="p-4 rounded-lg bg-secondary/50 flex items-center justify-between"
                      style={{ 
                        marginLeft: `${index * 20}px`,
                        marginRight: `${index * 20}px`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{stage.stage}</p>
                          <p className="text-xs text-muted-foreground">{stage.percentage}% of total</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-lg">{stage.count.toLocaleString()}</span>
                    </div>
                    {index < demoFunnel.length - 1 && (
                      <div className="flex justify-center py-1">
                        <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geography Tab */}
        <TabsContent value="geography" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Sales by Country
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {countryData.map((country) => (
                  <div key={country.country} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium">{country.country}</div>
                    <div className="flex-1">
                      <Progress value={country.percentage} className="h-3" />
                    </div>
                    <div className="w-20 text-right">
                      <span className="font-mono font-bold">{country.sales}</span>
                      <span className="text-xs text-muted-foreground ml-1">({country.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Channels Tab */}
        <TabsContent value="channels" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Franchise Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'USA - New York', sales: 245, trend: 12 },
                    { name: 'UK - London', sales: 189, trend: 8 },
                    { name: 'Germany - Berlin', sales: 156, trend: -3 },
                    { name: 'India - Mumbai', sales: 134, trend: 15 },
                  ].map((franchise) => (
                    <div key={franchise.name} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                      <span className="text-sm">{franchise.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{franchise.sales}</span>
                        <Badge variant={franchise.trend >= 0 ? 'default' : 'destructive'} className="text-xs">
                          {franchise.trend >= 0 ? '+' : ''}{franchise.trend}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Reseller Contribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'TechPro Solutions', sales: 89, trend: 22 },
                    { name: 'Digital Partners', sales: 67, trend: 15 },
                    { name: 'CloudFirst Inc', sales: 45, trend: 8 },
                    { name: 'Enterprise Plus', sales: 34, trend: -5 },
                  ].map((reseller) => (
                    <div key={reseller.name} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                      <span className="text-sm">{reseller.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{reseller.sales}</span>
                        <Badge variant={reseller.trend >= 0 ? 'default' : 'destructive'} className="text-xs">
                          {reseller.trend >= 0 ? '+' : ''}{reseller.trend}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PMAnalytics;
