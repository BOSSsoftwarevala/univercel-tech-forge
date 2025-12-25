import React from 'react';
import { TrendingUp, Users, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AMPerformance: React.FC = () => {
  const topPerformers = [
    { rank: 1, name: 'Franchise F-001', type: 'Franchise', score: 98, sales: '₹12.5L' },
    { rank: 2, name: 'Reseller R-003', type: 'Reseller', score: 95, sales: '₹8.2L' },
    { rank: 3, name: 'Franchise F-002', type: 'Franchise', score: 92, sales: '₹7.8L' },
    { rank: 4, name: 'Reseller R-001', type: 'Reseller', score: 89, sales: '₹6.5L' },
    { rank: 5, name: 'Franchise F-003', type: 'Franchise', score: 87, sales: '₹5.9L' },
  ];

  const metrics = [
    { label: 'Regional Target', value: '₹50L', achieved: '₹42.5L', percent: 85 },
    { label: 'Lead Conversion', value: '30%', achieved: '23.5%', percent: 78 },
    { label: 'Customer Satisfaction', value: '4.5/5', achieved: '4.2/5', percent: 93 },
    { label: 'SLA Compliance', value: '95%', achieved: '91%', percent: 96 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Performance</h2>
        <p className="text-muted-foreground">Regional performance metrics and rankings</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-foreground">{metric.achieved}</span>
                <span className="text-sm text-muted-foreground">/ {metric.value}</span>
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    metric.percent >= 90 ? 'bg-green-500' :
                    metric.percent >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${metric.percent}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Performers */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-400" />
            Top Performers This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformers.map((performer) => (
              <div key={performer.rank} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    performer.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                    performer.rank === 2 ? 'bg-slate-400/20 text-slate-400' :
                    performer.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    #{performer.rank}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{performer.name}</p>
                    <Badge variant="outline" className="text-xs">{performer.type}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Score</p>
                    <p className="font-bold text-foreground">{performer.score}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Sales</p>
                    <p className="font-bold text-green-400">{performer.sales}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AMPerformance;
