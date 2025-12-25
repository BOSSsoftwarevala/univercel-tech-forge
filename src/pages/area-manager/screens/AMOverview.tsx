import React from 'react';
import { LayoutDashboard, Users, Shield, Bell, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AMOverviewProps {
  regionName: string;
}

const AMOverview: React.FC<AMOverviewProps> = ({ regionName }) => {
  const stats = [
    { label: 'Total Users', value: '1,245', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: 'Active Now', value: '89', icon: Activity, color: 'text-green-400', bg: 'bg-green-500/20' },
    { label: 'Pending Approvals', value: '12', icon: Shield, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { label: 'Open Alerts', value: '3', icon: Bell, color: 'text-red-400', bg: 'bg-red-500/20' },
  ];

  const kpis = [
    { label: 'Sales This Month', value: '₹42.5L', change: '+12%' },
    { label: 'Leads Converted', value: '156', change: '+8%' },
    { label: 'Conversion Rate', value: '23.5%', change: '+2.1%' },
    { label: 'Avg Response Time', value: '4.2h', change: '-15%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Overview</h2>
        <p className="text-muted-foreground">{regionName} Region - Country Level Control</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* KPIs */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Key Performance Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((kpi, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-xl font-bold text-foreground">{kpi.value}</p>
                <p className={`text-sm ${kpi.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {kpi.change}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AMOverview;
