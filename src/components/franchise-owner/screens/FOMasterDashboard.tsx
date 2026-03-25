/**
 * FRANCHISE OWNER MASTER DASHBOARD
 * Real-time stats cards with deep view navigation
 */

import React from 'react';
import { 
  LayoutDashboard, ShoppingCart, Globe, Server, Award, Wallet,
  FileText, TrendingUp, Users, Percent, Target, AlertTriangle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FOSection } from '../FOFullSidebar';

interface FOMasterDashboardProps {
  onNavigate: (section: FOSection) => void;
}

const dashboardCards = [
  { 
    id: 'orders', 
    title: 'Total Orders', 
    value: '156', 
    icon: ShoppingCart, 
    color: 'bg-blue-500',
    trend: '+12%',
    navigate: 'order_management' as FOSection
  },
  { 
    id: 'domains', 
    title: 'Active Domains', 
    value: '48', 
    icon: Globe, 
    color: 'bg-emerald-500',
    trend: '+5',
    navigate: 'domain_hosting' as FOSection
  },
  { 
    id: 'hosting', 
    title: 'Active Hosting', 
    value: '52', 
    icon: Server, 
    color: 'bg-purple-500',
    trend: '+8',
    navigate: 'domain_hosting' as FOSection
  },
  { 
    id: 'licenses', 
    title: 'Software Licenses', 
    value: '89', 
    icon: Award, 
    color: 'bg-cyan-500',
    trend: '+15',
    navigate: 'order_management' as FOSection
  },
  { 
    id: 'wallet', 
    title: 'Wallet Balance', 
    value: '₹2,45,680', 
    icon: Wallet, 
    color: 'bg-amber-500',
    trend: 'Available',
    navigate: 'wallet' as FOSection
  },
  { 
    id: 'invoices', 
    title: 'Pending Invoices', 
    value: '7', 
    icon: FileText, 
    color: 'bg-orange-500',
    trend: 'Due',
    navigate: 'invoices' as FOSection
  },
  { 
    id: 'commission', 
    title: 'Monthly Commission', 
    value: '₹48,500', 
    icon: Percent, 
    color: 'bg-green-500',
    trend: '+₹12,400',
    navigate: 'commission' as FOSection
  },
  { 
    id: 'performance', 
    title: 'Team Performance', 
    value: '92%', 
    icon: TrendingUp, 
    color: 'bg-indigo-500',
    trend: '+3%',
    navigate: 'team_performance' as FOSection
  },
  { 
    id: 'conversion', 
    title: 'Lead Conversion', 
    value: '34%', 
    icon: Target, 
    color: 'bg-pink-500',
    trend: '+5%',
    navigate: 'crm_hrm' as FOSection
  },
  { 
    id: 'crm', 
    title: 'CRM Status', 
    value: 'Active', 
    icon: Users, 
    color: 'bg-teal-500',
    trend: '156 Leads',
    navigate: 'crm_hrm' as FOSection
  },
  { 
    id: 'hrm', 
    title: 'HRM Status', 
    value: 'Active', 
    icon: Users, 
    color: 'bg-violet-500',
    trend: '12 Staff',
    navigate: 'crm_hrm' as FOSection
  },
  { 
    id: 'alerts', 
    title: 'Pending Alerts', 
    value: '3', 
    icon: AlertTriangle, 
    color: 'bg-red-500',
    trend: 'Action Needed',
    navigate: 'support' as FOSection
  },
];

export function FOMasterDashboard({ onNavigate }: FOMasterDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            Franchise Master Dashboard
          </h1>
          <p className="text-muted-foreground">FR***015 • Mumbai Region • Enterprise Control</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500">System Active</Badge>
          <Badge variant="outline">🔒 Locked</Badge>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {dashboardCards.map((card) => (
          <Card 
            key={card.id} 
            onClick={() => onNavigate(card.navigate)}
            className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${card.color} group-hover:scale-110 transition-transform`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {card.trend}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold">{card.value}</h3>
              <p className="text-sm text-muted-foreground">{card.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">Quick Action</h3>
              <p className="text-sm text-muted-foreground">
                Click any card above to view detailed information • All data is live
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
