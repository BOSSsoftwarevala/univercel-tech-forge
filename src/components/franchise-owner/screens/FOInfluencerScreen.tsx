import React from 'react';
import { Star, Users, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const influencers = [
  { id: 1, name: 'Tech Reviewer Pro', leads: 45, converted: 12, rate: 27, status: 'Active' },
  { id: 2, name: 'Business Coach India', leads: 38, converted: 8, rate: 21, status: 'Active' },
  { id: 3, name: 'Startup Mentor', leads: 28, converted: 6, rate: 21, status: 'Active' },
  { id: 4, name: 'Finance Expert', leads: 22, converted: 5, rate: 23, status: 'Paused' },
];

export function FOInfluencerScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            Influencer Leads
          </h1>
          <p className="text-muted-foreground">Active Influencers • Leads Generated • Conversion (Read-only)</p>
        </div>
        <Badge variant="outline">Read Only</Badge>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Active Influencers</span>
            </div>
            <p className="text-2xl font-bold">8</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Leads</span>
            </div>
            <p className="text-2xl font-bold">133</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">Converted</span>
            </div>
            <p className="text-2xl font-bold">31</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Conversion Rate</span>
            </div>
            <p className="text-2xl font-bold">23%</p>
          </CardContent>
        </Card>
      </div>

      {/* Influencer List */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Influencer Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {influencers.map((influencer) => (
              <div key={influencer.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium">{influencer.name}</p>
                    <p className="text-sm text-muted-foreground">{influencer.leads} leads generated</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium text-emerald-500">{influencer.converted} converted</p>
                    <p className="text-xs text-muted-foreground">{influencer.rate}% rate</p>
                  </div>
                  <div className="w-24">
                    <Progress value={influencer.rate} className="h-2" />
                  </div>
                  <Badge variant={influencer.status === 'Active' ? 'default' : 'secondary'}>
                    {influencer.status}
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
