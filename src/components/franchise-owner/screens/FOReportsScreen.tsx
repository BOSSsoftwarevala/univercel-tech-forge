import React from 'react';
import { BarChart3, TrendingUp, Target, Search, Megaphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const reports = [
  { id: 1, name: 'Revenue Report', value: '₹8.5L', change: '+12%', status: 'positive' },
  { id: 2, name: 'Lead Source Report', value: '158 leads', change: '+24%', status: 'positive' },
  { id: 3, name: 'Ad ROI', value: '340%', change: '+18%', status: 'positive' },
  { id: 4, name: 'SEO Progress', value: 'Rank #5', change: '+3 positions', status: 'positive' },
];

const detailedMetrics = [
  { metric: 'Website Leads', current: 45, target: 50, percentage: 90 },
  { metric: 'Meta Leads', current: 38, target: 40, percentage: 95 },
  { metric: 'Google Leads', current: 32, target: 35, percentage: 91 },
  { metric: 'Influencer Leads', current: 28, target: 30, percentage: 93 },
  { metric: 'Conversion Rate', current: 24, target: 25, percentage: 96 },
];

export function FOReportsScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">Revenue • Lead Source • Ad ROI • SEO Progress (Read-only)</p>
        </div>
        <Badge variant="outline">Read Only</Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="bg-card/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-1">{report.name}</p>
              <p className="text-2xl font-bold">{report.value}</p>
              <Badge variant="default" className="mt-2 bg-emerald-500/20 text-emerald-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                {report.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Metrics */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {detailedMetrics.map((metric, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{metric.metric}</span>
                  <span className="text-sm text-muted-foreground">
                    {metric.current} / {metric.target} ({metric.percentage}%)
                  </span>
                </div>
                <Progress value={metric.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 hover:border-primary/30 transition-all cursor-pointer">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
            <p className="font-medium">Revenue Report</p>
            <p className="text-sm text-muted-foreground">View detailed breakdown</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 hover:border-primary/30 transition-all cursor-pointer">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="font-medium">Lead Source</p>
            <p className="text-sm text-muted-foreground">Channel performance</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 hover:border-primary/30 transition-all cursor-pointer">
          <CardContent className="p-4 text-center">
            <Megaphone className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <p className="font-medium">Ad ROI</p>
            <p className="text-sm text-muted-foreground">Campaign returns</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 hover:border-primary/30 transition-all cursor-pointer">
          <CardContent className="p-4 text-center">
            <Search className="h-8 w-8 mx-auto mb-2 text-cyan-500" />
            <p className="font-medium">SEO Progress</p>
            <p className="text-sm text-muted-foreground">Ranking trends</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
