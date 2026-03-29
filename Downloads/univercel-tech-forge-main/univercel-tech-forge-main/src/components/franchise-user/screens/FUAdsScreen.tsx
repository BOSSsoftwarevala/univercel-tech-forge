import React from 'react';
import { Sparkles, Target, IndianRupee, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const runningAds = [
  { id: 1, name: 'Local Business Ad', platform: 'Meta', leads: 18, spent: '₹2,500', status: 'Running' },
  { id: 2, name: 'Google Search Ad', platform: 'Google', leads: 12, spent: '₹3,200', status: 'Running' },
  { id: 3, name: 'Instagram Story', platform: 'Meta', leads: 8, spent: '₹1,800', status: 'Running' },
];

export function FUAdsScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Ads (Auto AI)
          </h1>
          <p className="text-muted-foreground">AI creates and manages all your ads automatically.</p>
        </div>
        <Badge className="bg-emerald-500 text-lg px-4 py-2">
          <Sparkles className="h-4 w-4 mr-2" />
          AI Managing
        </Badge>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <Target className="h-10 w-10 mx-auto mb-2 text-blue-500" />
            <p className="text-3xl font-bold">38</p>
            <p className="text-sm">Total Leads</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-6 text-center">
            <IndianRupee className="h-10 w-10 mx-auto mb-2 text-amber-500" />
            <p className="text-3xl font-bold">₹7,500</p>
            <p className="text-sm">Total Spent</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-10 w-10 mx-auto mb-2 text-emerald-500" />
            <p className="text-3xl font-bold">₹198</p>
            <p className="text-sm">Cost per Lead</p>
          </CardContent>
        </Card>
      </div>

      {/* Running Ads */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Running Ads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {runningAds.map((ad) => (
              <div key={ad.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-lg">{ad.name}</p>
                    <p className="text-sm text-muted-foreground">{ad.platform}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xl font-bold text-blue-500">{ad.leads}</p>
                    <p className="text-xs text-muted-foreground">Leads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-amber-500">{ad.spent}</p>
                    <p className="text-xs text-muted-foreground">Spent</p>
                  </div>
                  <Badge className="bg-emerald-500">{ad.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Notice */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium">AI is Managing Your Ads</p>
              <p className="text-sm text-muted-foreground">
                Targeting, budgets, and optimization are handled automatically.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
