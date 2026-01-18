/**
 * TASK MANAGER - DASHBOARD
 * KPI Overview - All Boxes Clickable
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ListTodo,
  AlertTriangle,
  Clock,
  CheckCircle,
  Bot,
  UserCheck,
  ArrowUpCircle,
  XCircle,
  Sparkles,
  Layers,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { TMScreen } from '../TMFullSidebar';

interface TMDashboardProps {
  onNavigate: (screen: TMScreen) => void;
}

const kpiData = [
  { label: 'Total Active Tasks', value: '847', icon: ListTodo, color: 'text-blue-400', screen: 'task_inbox' as TMScreen },
  { label: 'Overdue Tasks', value: '23', icon: AlertTriangle, color: 'text-red-400', screen: 'task_sla_tracker' as TMScreen },
  { label: 'SLA At Risk', value: '45', icon: Clock, color: 'text-orange-400', screen: 'task_sla_tracker' as TMScreen },
  { label: 'Pending Approvals', value: '67', icon: CheckCircle, color: 'text-yellow-400', screen: 'task_approval' as TMScreen },
  { label: 'AI Tasks Running', value: '312', icon: Bot, color: 'text-cyan-400', screen: 'task_execution' as TMScreen },
  { label: 'Human Intervention', value: '8', icon: UserCheck, color: 'text-purple-400', screen: 'task_assignment' as TMScreen },
  { label: 'Escalated Tasks', value: '12', icon: ArrowUpCircle, color: 'text-pink-400', screen: 'task_escalation' as TMScreen },
  { label: 'Failed Tasks', value: '5', icon: XCircle, color: 'text-red-500', screen: 'task_history' as TMScreen },
  { label: 'Auto-Resolved', value: '1,247', icon: Sparkles, color: 'text-green-400', screen: 'task_history' as TMScreen },
  { label: 'Cross-Module Tasks', value: '89', icon: Layers, color: 'text-indigo-400', screen: 'task_dependency' as TMScreen },
  { label: 'High Priority', value: '34', icon: Flame, color: 'text-orange-500', screen: 'task_inbox' as TMScreen },
  { label: 'Compliance Risk', value: '7', icon: ShieldAlert, color: 'text-amber-400', screen: 'task_review' as TMScreen },
];

export const TMDashboard: React.FC<TMDashboardProps> = ({ onNavigate }) => {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Dashboard</h1>
          <p className="text-muted-foreground">Enterprise Operation Control • AI-First Execution</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => onNavigate(kpi.screen)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
                  <span className="text-2xl font-bold text-foreground">{kpi.value}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Recent Task Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: 'AI Auto-Resolved', task: 'Payment sync verification', time: '2 min ago', status: 'success' },
                { action: 'Escalated', task: 'License binding issue', time: '5 min ago', status: 'warning' },
                { action: 'Approved', task: 'Feature rollout task', time: '8 min ago', status: 'success' },
                { action: 'SLA Breached', task: 'Customer callback pending', time: '12 min ago', status: 'error' },
                { action: 'AI Assigned', task: 'Server health check', time: '15 min ago', status: 'info' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-foreground">{item.action}</p>
                    <p className="text-sm text-muted-foreground">{item.task}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default TMDashboard;
