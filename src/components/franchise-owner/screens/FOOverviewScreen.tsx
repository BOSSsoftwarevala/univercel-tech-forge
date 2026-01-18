import React from 'react';
import { 
  Target, Users, TrendingUp, Wallet, Megaphone, Search,
  Clock, HeadphonesIcon, Star, AlertTriangle, Sparkles, LayoutDashboard
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const kpiData = [
  { title: 'Total Leads Today', value: '48', icon: Target, color: 'bg-blue-500' },
  { title: 'Active Sales Staff', value: '12', icon: Users, color: 'bg-emerald-500' },
  { title: 'Conversion Rate', value: '24%', icon: TrendingUp, color: 'bg-purple-500' },
  { title: 'Revenue This Month', value: '₹8.5L', icon: Wallet, color: 'bg-cyan-500' },
  { title: 'Wallet Balance', value: '₹45,230', icon: Wallet, color: 'bg-amber-500' },
  { title: 'Ads Running', value: '5', icon: Megaphone, color: 'bg-pink-500' },
  { title: 'SEO Rank Movement', value: '+12', icon: Search, color: 'bg-indigo-500' },
  { title: 'Pending Follow-ups', value: '18', icon: Clock, color: 'bg-orange-500' },
  { title: 'Support Tickets', value: '3', icon: HeadphonesIcon, color: 'bg-red-500' },
  { title: 'Influencer Referrals', value: '28', icon: Star, color: 'bg-yellow-500' },
  { title: 'AI Suggestions', value: '7', icon: Sparkles, color: 'bg-violet-500' },
  { title: 'Alerts / Warnings', value: '2', icon: AlertTriangle, color: 'bg-rose-500' },
];

export function FOOverviewScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            Franchise Overview
          </h1>
          <p className="text-muted-foreground">FR***015 • Mumbai Region</p>
        </div>
        <Badge className="bg-emerald-500">Active</Badge>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => (
          <Card 
            key={idx} 
            className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/30 transition-all cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${kpi.color}`}>
                  <kpi.icon className="h-4 w-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold">{kpi.value}</h3>
              <p className="text-sm text-muted-foreground">{kpi.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Auto Features Notice */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">AI Auto Features Active</h3>
              <p className="text-sm text-muted-foreground">
                Auto Lead Assignment • Auto Ad Optimization • Auto SEO Improvements • Daily Suggestions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
