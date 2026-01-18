/**
 * ASSIST DASHBOARD
 * Top Status Cards - All Clickable
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Radio,
  Clock,
  CheckCircle,
  XCircle,
  Brain,
  AlertTriangle,
  MonitorPlay,
  Users,
} from 'lucide-react';
import type { AMSection } from '../AMFullSidebar';

interface AMAssistDashboardProps {
  onNavigate: (section: AMSection) => void;
}

const DASHBOARD_CARDS = [
  { id: 'active_sessions', label: 'Live Sessions', value: '8', icon: Radio, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'session_requests', label: 'Pending Requests', value: '12', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'pending_approval', label: 'Approved Sessions', value: '45', icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'active_sessions', label: 'Blocked Sessions', value: '3', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'ai_assist_layer', label: 'AI Assisted', value: '28', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'emergency_stop', label: 'Security Alerts', value: '2', icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
];

const RECENT_SESSIONS = [
  { id: 'SVL-A8K2M9', user: 'USR-****42', agent: 'AGT-****15', status: 'active', type: 'Support', duration: '12:34' },
  { id: 'SVL-B3N7P1', user: 'USR-****67', agent: 'AGT-****22', status: 'pending', type: 'Dev', duration: '--:--' },
  { id: 'SVL-C9X4L6', user: 'USR-****89', agent: 'AGT-****08', status: 'active', type: 'Franchise', duration: '05:21' },
  { id: 'SVL-D5M2K8', user: 'USR-****34', agent: 'AGT-****31', status: 'ended', type: 'Sales', duration: '23:45' },
];

export function AMAssistDashboard({ onNavigate }: AMAssistDashboardProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Assist Dashboard</h1>
            <p className="text-muted-foreground">VALA Connect - Remote Session Management</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">System Online</span>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {DASHBOARD_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.label}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => onNavigate(card.id as AMSection)}
              >
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Sessions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MonitorPlay className="h-5 w-5" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Session ID</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">User (Masked)</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Agent (Masked)</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_SESSIONS.map((session) => (
                    <tr key={session.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-xs">{session.id}</td>
                      <td className="py-3 px-4 font-mono text-xs">{session.user}</td>
                      <td className="py-3 px-4 font-mono text-xs">{session.agent}</td>
                      <td className="py-3 px-4">{session.type}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            session.status === 'active' ? 'default' :
                            session.status === 'pending' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {session.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">{session.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Live Agents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Online Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['AGT-****15', 'AGT-****22', 'AGT-****08', 'AGT-****31'].map((agent, i) => (
                <div key={agent} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-mono text-xs">{agent}</p>
                    <p className="text-xs text-muted-foreground">{i < 2 ? 'In Session' : 'Available'}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ml-auto ${i < 2 ? 'bg-amber-500' : 'bg-green-500'}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}

export default AMAssistDashboard;
