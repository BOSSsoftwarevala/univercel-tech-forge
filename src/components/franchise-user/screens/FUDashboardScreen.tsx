import React from 'react';
import { 
  MapPin, Target, Clock, TrendingUp, Wallet, HeadphonesIcon, 
  Search, Megaphone, AlertTriangle, LayoutDashboard
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const dashboardBoxes = [
  { title: 'My Location', value: 'Mumbai West', icon: MapPin, color: 'bg-blue-500', subtitle: 'View Map' },
  { title: 'Active Leads', value: '48', icon: Target, color: 'bg-emerald-500', subtitle: 'New leads today' },
  { title: 'Today Follow-ups', value: '12', icon: Clock, color: 'bg-amber-500', subtitle: 'Pending calls' },
  { title: 'Sales This Month', value: '₹2.8L', icon: TrendingUp, color: 'bg-purple-500', subtitle: '+15% growth' },
  { title: 'Wallet Balance', value: '₹15,230', icon: Wallet, color: 'bg-cyan-500', subtitle: 'Add money' },
  { title: 'Support Requests', value: '2', icon: HeadphonesIcon, color: 'bg-pink-500', subtitle: 'Open tickets' },
  { title: 'SEO Status', value: 'Active', icon: Search, color: 'bg-indigo-500', subtitle: 'Running well' },
  { title: 'Ads Running', value: '3', icon: Megaphone, color: 'bg-orange-500', subtitle: 'AI managed' },
  { title: 'Alerts', value: '1', icon: AlertTriangle, color: 'bg-red-500', subtitle: 'Action needed' },
];

export function FUDashboardScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            My Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
        </div>
        <Badge className="bg-emerald-500 text-lg px-4 py-2">Plan: Premium</Badge>
      </div>

      {/* Big Clear Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardBoxes.map((box, idx) => (
          <Card 
            key={idx} 
            className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/30 transition-all cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-4 rounded-xl ${box.color}`}>
                  <box.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{box.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{box.value}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{box.subtitle}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* My Location Map */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">My Area Map</h3>
          </div>
          <div className="h-64 bg-muted rounded-xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-primary/50 mb-2" />
              <p className="text-muted-foreground">Mumbai West Region</p>
              <p className="text-sm text-primary mt-1">48 Leads • 32 Customers • 5 Sales Points</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
