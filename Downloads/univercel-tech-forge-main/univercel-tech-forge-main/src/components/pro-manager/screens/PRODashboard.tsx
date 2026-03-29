/**
 * PRO DASHBOARD - TOP KPI BOXES
 * All boxes clickable → filtered view
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  HeadphonesIcon, 
  AlertTriangle, 
  ArrowUpCircle, 
  CalendarClock, 
  Key,
  Handshake,
  Bot,
  ArrowUp,
  Wallet,
  Star,
  Shield
} from 'lucide-react';
import { PROScreen } from '../PROFullSidebar';

interface PRODashboardProps {
  onNavigate: (screen: PROScreen) => void;
}

const dashboardCards = [
  { 
    id: 'pro_user_registry' as PROScreen, 
    label: 'Active Pro Users', 
    value: 2847, 
    icon: Users, 
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  { 
    id: 'support_requests' as PROScreen, 
    label: 'Open Support Tickets', 
    value: 156, 
    icon: HeadphonesIcon, 
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
  { 
    id: 'promise_sla_tracker' as PROScreen, 
    label: 'SLA At Risk', 
    value: 12, 
    icon: AlertTriangle, 
    color: 'text-red-500',
    bgColor: 'bg-red-500/10'
  },
  { 
    id: 'upgrade_addons' as PROScreen, 
    label: 'Pending Upgrades', 
    value: 34, 
    icon: ArrowUpCircle, 
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  { 
    id: 'renewal_expiry' as PROScreen, 
    label: 'Renewal Due', 
    value: 89, 
    icon: CalendarClock, 
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  { 
    id: 'license_domain' as PROScreen, 
    label: 'License Issues', 
    value: 7, 
    icon: Key, 
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  { 
    id: 'premium_assist' as PROScreen, 
    label: 'Assist Sessions Running', 
    value: 5, 
    icon: Handshake, 
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10'
  },
  { 
    id: 'ai_helpdesk' as PROScreen, 
    label: 'AI Auto-Fix Success', 
    value: '94%', 
    icon: Bot, 
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10'
  },
  { 
    id: 'alerts_escalation' as PROScreen, 
    label: 'Escalated Issues', 
    value: 8, 
    icon: ArrowUp, 
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10'
  },
  { 
    id: 'renewal_expiry' as PROScreen, 
    label: 'Payment Hold', 
    value: 3, 
    icon: Wallet, 
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  },
  { 
    id: 'satisfaction_rating' as PROScreen, 
    label: 'Low Satisfaction Score', 
    value: 15, 
    icon: Star, 
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10'
  },
  { 
    id: 'compliance_policy' as PROScreen, 
    label: 'Compliance Flags', 
    value: 2, 
    icon: Shield, 
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10'
  },
];

export const PRODashboard: React.FC<PRODashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pro Dashboard</h1>
        <p className="text-muted-foreground">Premium user management overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {dashboardCards.map((card, idx) => (
          <Card 
            key={idx}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate(card.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Recent Pro Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 'PRO-4521', user: 'Enterprise Corp', action: 'Support Ticket', status: 'Open', time: '5 min ago' },
              { id: 'PRO-4520', user: 'Tech Solutions', action: 'Upgrade Request', status: 'Pending', time: '15 min ago' },
              { id: 'PRO-4519', user: 'Global Inc', action: 'License Renewal', status: 'Completed', time: '1 hour ago' },
              { id: 'PRO-4518', user: 'StartUp Ltd', action: 'Assist Session', status: 'Active', time: '2 hours ago' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-foreground">{item.id}</span>
                  <span className="text-sm text-foreground">{item.user}</span>
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">{item.action}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.status === 'Open' ? 'bg-amber-500/20 text-amber-500' :
                    item.status === 'Active' ? 'bg-green-500/20 text-green-500' :
                    item.status === 'Completed' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-purple-500/20 text-purple-500'
                  }`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PRODashboard;
