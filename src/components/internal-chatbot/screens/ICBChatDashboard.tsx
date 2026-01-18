/**
 * CHAT DASHBOARD - TOP STATUS CARDS
 * All cards clickable → filtered view
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PlusCircle, 
  Clock, 
  MessageCircle, 
  AlertTriangle, 
  Bot, 
  ShieldAlert 
} from 'lucide-react';
import { ICBScreen } from '../ICBFullSidebar';

interface ICBChatDashboardProps {
  onNavigate: (screen: ICBScreen) => void;
}

const dashboardCards = [
  { 
    id: 'new_inquiry' as ICBScreen, 
    label: 'New Inquiries', 
    value: 12, 
    icon: PlusCircle, 
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  { 
    id: 'pending_approval' as ICBScreen, 
    label: 'Pending Approval', 
    value: 5, 
    icon: Clock, 
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
  { 
    id: 'active_chats' as ICBScreen, 
    label: 'Active Chats', 
    value: 8, 
    icon: MessageCircle, 
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  { 
    id: 'urgent_requests' as ICBScreen, 
    label: 'Urgent Requests', 
    value: 2, 
    icon: AlertTriangle, 
    color: 'text-red-500',
    bgColor: 'bg-red-500/10'
  },
  { 
    id: 'ai_first_response' as ICBScreen, 
    label: 'AI Handling', 
    value: 15, 
    icon: Bot, 
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  { 
    id: 'blocked_users' as ICBScreen, 
    label: 'Security Alerts', 
    value: 1, 
    icon: ShieldAlert, 
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
];

export const ICBChatDashboard: React.FC<ICBChatDashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Chat Dashboard</h1>
        <p className="text-muted-foreground">Internal secure chat overview</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardCards.map((card) => (
          <Card 
            key={card.id}
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
          <CardTitle className="text-lg text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 'INQ-001', type: 'Support', status: 'Pending', time: '2 min ago' },
              { id: 'INQ-002', type: 'Dev', status: 'Active', time: '5 min ago' },
              { id: 'INQ-003', type: 'Sales', status: 'Urgent', time: '10 min ago' },
              { id: 'INQ-004', type: 'Legal', status: 'AI Handling', time: '15 min ago' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-foreground">{item.id}</span>
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">{item.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.status === 'Urgent' ? 'bg-red-500/20 text-red-500' :
                    item.status === 'Active' ? 'bg-green-500/20 text-green-500' :
                    item.status === 'AI Handling' ? 'bg-purple-500/20 text-purple-500' :
                    'bg-amber-500/20 text-amber-500'
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

export default ICBChatDashboard;
