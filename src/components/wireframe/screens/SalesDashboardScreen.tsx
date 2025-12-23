import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  ShoppingCart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart
} from 'lucide-react';

// Mock data
const salesMetrics = {
  totalRevenue: '$1.24M',
  revenueGrowth: '+18.5%',
  newDeals: 47,
  closedDeals: 23,
  avgDealSize: '$12,400',
  conversionRate: '32%',
  quotaProgress: 78
};

const deals = [
  { id: 1, company: 'TechStart Inc', value: '$45,000', stage: 'negotiation', probability: 80, owner: 'Alex M.', closeDate: 'Dec 28' },
  { id: 2, company: 'Global Solutions', value: '$120,000', stage: 'proposal', probability: 60, owner: 'Sarah K.', closeDate: 'Jan 5' },
  { id: 3, company: 'Retail Plus', value: '$28,000', stage: 'qualified', probability: 40, owner: 'Mike D.', closeDate: 'Jan 12' },
  { id: 4, company: 'HealthCare Pro', value: '$85,000', stage: 'negotiation', probability: 75, owner: 'Alex M.', closeDate: 'Dec 30' },
  { id: 5, company: 'EduTech Corp', value: '$32,000', stage: 'discovery', probability: 25, owner: 'Lisa W.', closeDate: 'Jan 20' },
  { id: 6, company: 'Manufacturing Co', value: '$200,000', stage: 'proposal', probability: 55, owner: 'Sarah K.', closeDate: 'Jan 15' }
];

const salesTeam = [
  { name: 'Alex M.', deals: 8, revenue: '$320K', quota: 92, trend: 'up' },
  { name: 'Sarah K.', deals: 12, revenue: '$450K', quota: 108, trend: 'up' },
  { name: 'Mike D.', deals: 5, revenue: '$180K', quota: 65, trend: 'down' },
  { name: 'Lisa W.', deals: 7, revenue: '$290K', quota: 84, trend: 'up' }
];

const pipelineStages = [
  { stage: 'Discovery', count: 24, value: '$580K' },
  { stage: 'Qualified', count: 18, value: '$420K' },
  { stage: 'Proposal', count: 12, value: '$890K' },
  { stage: 'Negotiation', count: 8, value: '$640K' },
  { stage: 'Closed Won', count: 23, value: '$1.24M' }
];

const recentActivities = [
  { action: 'Deal closed', detail: 'TechStart Inc - $45K', time: '2 hours ago' },
  { action: 'New lead qualified', detail: 'DataFlow Systems', time: '4 hours ago' },
  { action: 'Proposal sent', detail: 'HealthCare Pro - $85K', time: '5 hours ago' },
  { action: 'Meeting scheduled', detail: 'Global Solutions', time: '6 hours ago' },
  { action: 'Contract signed', detail: 'Retail Plus - $28K', time: 'Yesterday' }
];

const getStageColor = (stage: string) => {
  switch (stage) {
    case 'discovery': return 'bg-blue-500/20 text-blue-400';
    case 'qualified': return 'bg-purple-500/20 text-purple-400';
    case 'proposal': return 'bg-yellow-500/20 text-yellow-400';
    case 'negotiation': return 'bg-orange-500/20 text-orange-400';
    case 'closed': return 'bg-green-500/20 text-green-400';
    default: return 'bg-muted text-muted-foreground';
  }
};

export function SalesDashboardScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Dashboard</h1>
          <p className="text-muted-foreground">Pipeline & revenue analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button>
            <ShoppingCart className="h-4 w-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{salesMetrics.totalRevenue}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {salesMetrics.revenueGrowth}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{salesMetrics.newDeals}</p>
                <p className="text-sm text-muted-foreground">New Deals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Target className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{salesMetrics.avgDealSize}</p>
                <p className="text-sm text-muted-foreground">Avg Deal Size</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quota Progress</span>
                <span className="font-medium">{salesMetrics.quotaProgress}%</span>
              </div>
              <Progress value={salesMetrics.quotaProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deal Pipeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Active Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deals.map((deal) => (
                <div key={deal.id} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{deal.company}</p>
                      <p className="text-sm text-muted-foreground">{deal.owner}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{deal.value}</p>
                      <Badge className={getStageColor(deal.stage)}>{deal.stage}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Probability:</span>
                      <Progress value={deal.probability} className="w-20 h-2" />
                      <span>{deal.probability}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {deal.closeDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Pipeline Stages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Pipeline Stages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pipelineStages.map((stage, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">{stage.stage}</p>
                      <p className="text-sm text-muted-foreground">{stage.count} deals</p>
                    </div>
                    <p className="font-bold">{stage.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales Team */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {salesTeam.map((member, index) => (
                  <div key={index} className="p-2 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{member.name}</p>
                      <div className="flex items-center gap-1">
                        {member.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4 text-green-400" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-400" />
                        )}
                        <span className={member.quota >= 100 ? 'text-green-400' : 'text-foreground'}>
                          {member.quota}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{member.deals} deals</span>
                      <span className="font-medium text-foreground">{member.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recentActivities.map((activity, index) => (
              <div key={index} className="min-w-[200px] p-3 bg-muted/30 rounded-lg">
                <p className="font-medium text-sm">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.detail}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
