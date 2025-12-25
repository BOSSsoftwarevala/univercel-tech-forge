import React from 'react';
import { BarChart3, FileText, Calendar, Download, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AMReports: React.FC = () => {
  const reports = [
    { name: 'Daily Sales Summary', period: 'Today', status: 'ready', lastGenerated: '10 min ago' },
    { name: 'Weekly Performance Report', period: 'This Week', status: 'ready', lastGenerated: '2 hours ago' },
    { name: 'Lead Conversion Analysis', period: 'This Month', status: 'ready', lastGenerated: '1 day ago' },
    { name: 'SLA Compliance Report', period: 'This Month', status: 'generating', lastGenerated: '-' },
    { name: 'Regional Comparison', period: 'This Quarter', status: 'ready', lastGenerated: '3 days ago' },
  ];

  const quickStats = [
    { label: 'Total Revenue', value: '₹42.5L', period: 'This Month' },
    { label: 'Active Users', value: '1,245', period: 'Current' },
    { label: 'Conversion Rate', value: '23.5%', period: 'This Month' },
    { label: 'Avg Response Time', value: '4.2h', period: 'This Week' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Reports</h2>
        <p className="text-muted-foreground">Regional performance reports and analytics</p>
      </div>

      {/* Export Disabled Notice */}
      <Card className="bg-red-500/10 border-red-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-red-400" />
            <div>
              <p className="font-medium text-red-400">Export Disabled</p>
              <p className="text-sm text-muted-foreground">
                Report export and download features are disabled for security. View-only access.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <Badge variant="outline" className="text-xs mt-1">{stat.period}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Reports */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            Available Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{report.name}</p>
                    <p className="text-sm text-muted-foreground">{report.period}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{report.lastGenerated}</span>
                  <Badge variant={report.status === 'ready' ? 'default' : 'secondary'}>
                    {report.status}
                  </Badge>
                  <span className="text-muted-foreground text-sm flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    View Only
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AMReports;
