/**
 * CUSTOMER SUPPORT DASHBOARD CONTENT
 * Main content area with clickable KPI cards and section views
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Headphones, Ticket, Clock, AlertTriangle, Bot, Users,
  CheckCircle, TrendingUp, ArrowUpCircle, ClipboardCheck,
  Smile, Timer, Activity, Gauge, Eye, Send, RefreshCw,
  XCircle, Shield, Zap, BarChart3, Bell, Settings,
  MessageSquare, User, FileText, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useEnterpriseAudit } from '@/hooks/useEnterpriseAudit';

interface CustomerSupportDashboardContentProps {
  activeSection: string;
}

// Mock data for dashboard
const dashboardStats = {
  openTickets: 190,
  openTicketsDelta: '+12',
  slaBreaches: 11,
  slaBreachesDelta: '-3',
  avgResponseTime: '12m',
  avgResponseDelta: '-2m',
  satisfaction: 94.2,
  satisfactionDelta: '+1.5%',
  aiHandled: 67,
  humanHandled: 33,
  escalationsToday: 8,
  pendingApprovals: 14,
};

const recentTickets = [
  { id: 'TKT-4521', subject: 'Login authentication failure', priority: 'critical', status: 'open', customer: 'Tech Corp', agent: 'Sarah M.', sla: 'at-risk' },
  { id: 'TKT-4520', subject: 'Billing discrepancy query', priority: 'high', status: 'in-progress', customer: 'Global Inc', agent: 'Mike R.', sla: 'met' },
  { id: 'TKT-4519', subject: 'Feature request: Dark mode', priority: 'low', status: 'waiting', customer: 'StartUp Ltd', agent: 'Priya P.', sla: 'met' },
  { id: 'TKT-4518', subject: 'API integration issues', priority: 'high', status: 'open', customer: 'Dev Studio', agent: 'Unassigned', sla: 'breached' },
  { id: 'TKT-4517', subject: 'Refund request - duplicate charge', priority: 'medium', status: 'pending-approval', customer: 'User #8291', agent: 'Emma W.', sla: 'met' },
];

const activeAgents = [
  { id: 1, name: 'Sarah Miller', status: 'active', tickets: 8, avgTime: '8m', satisfaction: 96 },
  { id: 2, name: 'Mike Rodriguez', status: 'active', tickets: 6, avgTime: '11m', satisfaction: 92 },
  { id: 3, name: 'Priya Patel', status: 'busy', tickets: 12, avgTime: '15m', satisfaction: 89 },
  { id: 4, name: 'Emma Williams', status: 'idle', tickets: 0, avgTime: '-', satisfaction: 94 },
];

const escalations = [
  { id: 'ESC-101', ticket: 'TKT-4518', reason: 'SLA Breach', level: 'L3', time: '15 min ago' },
  { id: 'ESC-100', ticket: 'TKT-4512', reason: 'Customer Request', level: 'L2', time: '1 hour ago' },
  { id: 'ESC-099', ticket: 'TKT-4501', reason: 'Legal Query', level: 'L4', time: '2 hours ago' },
];

const CustomerSupportDashboardContent = ({ activeSection }: CustomerSupportDashboardContentProps) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const { logButtonClick } = useEnterpriseAudit();

  const handleAction = async (action: string, target?: string, data?: any) => {
    const actionKey = `${action}-${target || 'general'}`;
    setLoadingAction(actionKey);
    
    try {
      // Log the action
      await logButtonClick(
        `support_${action.toLowerCase().replace(/\s+/g, '_')}`,
        `${action}${target ? ` - ${target}` : ''}`,
        'system',
        { target, ...data }
      );
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Different success messages based on action type
      const successMessages: Record<string, { title: string; desc: string }> = {
        'View': { title: 'Loaded', desc: `Viewing ${target || 'details'}` },
        'View All': { title: 'List Loaded', desc: `Showing all ${target || 'items'}` },
        'Assign': { title: 'Assignment Sent', desc: `Assignment request for ${target}` },
        'Reassign': { title: 'Reassignment Queued', desc: `Reassigning ${target}` },
        'Escalate': { title: 'Escalated', desc: `${target} escalated to next level` },
        'Approve': { title: 'Approved', desc: `${target} has been approved` },
        'Reject': { title: 'Rejected', desc: `${target} has been rejected` },
        'Close': { title: 'Closed', desc: `${target} has been closed` },
        'Reopen': { title: 'Reopened', desc: `${target} has been reopened` },
        'Lock': { title: 'Locked', desc: `${target} is now locked` },
        'Unlock': { title: 'Unlocked', desc: `${target} is now unlocked` },
        'Retry': { title: 'Retrying', desc: `Retrying ${target}` },
        'Restart': { title: 'Restarted', desc: `${target} has been restarted` },
        'Refresh': { title: 'Refreshed', desc: `${target} data updated` },
        'Resolve': { title: 'Resolved', desc: `${target} marked as resolved` },
        'Edit': { title: 'Edit Mode', desc: `Editing ${target}` },
        'Navigate': { title: 'Navigating', desc: `Opening ${target}` },
        'Reply': { title: 'Reply Sent', desc: `Reply sent for ${target}` },
      };
      
      const msg = successMessages[action] || { title: `${action} completed`, desc: target ? `Action on ${target}` : 'Success' };
      toast.success(msg.title, { description: msg.desc });
      
    } catch (error) {
      console.error(`Action ${action} failed:`, error);
      toast.error(`${action} failed`, {
        description: 'Please try again or contact support',
        action: {
          label: 'Retry',
          onClick: () => handleAction(action, target, data),
        },
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const ActionButton = ({ 
    action, 
    target, 
    variant = 'outline', 
    size = 'sm',
    icon: Icon,
    className,
    children 
  }: { 
    action: string; 
    target?: string; 
    variant?: 'outline' | 'default' | 'ghost' | 'destructive';
    size?: 'sm' | 'default' | 'lg';
    icon?: React.ElementType;
    className?: string;
    children: React.ReactNode;
  }) => {
    const actionKey = `${action}-${target || 'general'}`;
    const isLoading = loadingAction === actionKey;
    
    return (
      <Button
        variant={variant}
        size={size}
        onClick={() => handleAction(action, target)}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : Icon ? (
          <Icon className="w-4 h-4 mr-2" />
        ) : null}
        {children}
      </Button>
    );
  };

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards - All Clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card 
          className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30 cursor-pointer hover:bg-cyan-500/20 transition-all"
          onClick={() => handleAction('Navigate', 'Open Tickets')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">OPEN TICKETS</p>
                <p className="text-2xl font-bold text-cyan-400">{dashboardStats.openTickets}</p>
                <p className="text-xs text-emerald-400">{dashboardStats.openTicketsDelta}</p>
              </div>
              <Ticket className="w-8 h-8 text-cyan-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/30 cursor-pointer hover:bg-red-500/20 transition-all"
          onClick={() => handleAction('Navigate', 'SLA Breaches')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">SLA BREACHES</p>
                <p className="text-2xl font-bold text-red-400">{dashboardStats.slaBreaches}</p>
                <p className="text-xs text-emerald-400">{dashboardStats.slaBreachesDelta}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/30 cursor-pointer hover:bg-purple-500/20 transition-all"
          onClick={() => handleAction('Navigate', 'Response Time')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">AVG RESPONSE</p>
                <p className="text-2xl font-bold text-purple-400">{dashboardStats.avgResponseTime}</p>
                <p className="text-xs text-emerald-400">{dashboardStats.avgResponseDelta}</p>
              </div>
              <Timer className="w-8 h-8 text-purple-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/30 cursor-pointer hover:bg-emerald-500/20 transition-all"
          onClick={() => handleAction('Navigate', 'Satisfaction')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">SATISFACTION</p>
                <p className="text-2xl font-bold text-emerald-400">{dashboardStats.satisfaction}%</p>
                <p className="text-xs text-emerald-400">{dashboardStats.satisfactionDelta}</p>
              </div>
              <Smile className="w-8 h-8 text-emerald-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/30 cursor-pointer hover:bg-blue-500/20 transition-all"
          onClick={() => handleAction('Navigate', 'AI Stats')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">AI HANDLED</p>
                <p className="text-2xl font-bold text-blue-400">{dashboardStats.aiHandled}%</p>
              </div>
              <Bot className="w-8 h-8 text-blue-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-teal-500/30 cursor-pointer hover:bg-teal-500/20 transition-all"
          onClick={() => handleAction('Navigate', 'Human Stats')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">HUMAN HANDLED</p>
                <p className="text-2xl font-bold text-teal-400">{dashboardStats.humanHandled}%</p>
              </div>
              <Users className="w-8 h-8 text-teal-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 cursor-pointer hover:bg-amber-500/20 transition-all"
          onClick={() => handleAction('Navigate', 'Escalations')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">ESCALATIONS TODAY</p>
                <p className="text-2xl font-bold text-amber-400">{dashboardStats.escalationsToday}</p>
              </div>
              <ArrowUpCircle className="w-8 h-8 text-amber-400/30" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-500/30 cursor-pointer hover:bg-rose-500/20 transition-all"
          onClick={() => handleAction('Navigate', 'Pending Approvals')}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">PENDING APPROVALS</p>
                <p className="text-2xl font-bold text-rose-400">{dashboardStats.pendingApprovals}</p>
              </div>
              <ClipboardCheck className="w-8 h-8 text-rose-400/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets & Active Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ticket className="w-5 h-5 text-cyan-400" />
              Recent Tickets
              <Badge className="ml-auto bg-cyan-500/20 text-cyan-400">{recentTickets.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{ticket.id}</span>
                    <Badge 
                      className={cn(
                        "text-[10px]",
                        ticket.priority === 'critical' && "bg-red-500/20 text-red-400",
                        ticket.priority === 'high' && "bg-amber-500/20 text-amber-400",
                        ticket.priority === 'medium' && "bg-blue-500/20 text-blue-400",
                        ticket.priority === 'low' && "bg-slate-500/20 text-slate-400",
                      )}
                    >
                      {ticket.priority}
                    </Badge>
                    <Badge
                      className={cn(
                        "text-[10px]",
                        ticket.sla === 'met' && "bg-emerald-500/20 text-emerald-400",
                        ticket.sla === 'at-risk' && "bg-amber-500/20 text-amber-400",
                        ticket.sla === 'breached' && "bg-red-500/20 text-red-400",
                      )}
                    >
                      SLA: {ticket.sla}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-1">{ticket.subject}</p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <ActionButton action="View" target={ticket.id} icon={Eye}>
                    View
                  </ActionButton>
                  <ActionButton action="Assign" target={ticket.id} icon={Users}>
                    Assign
                  </ActionButton>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Agents */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-teal-400" />
              Active Agents
              <Badge className="ml-auto bg-emerald-500/20 text-emerald-400">{activeAgents.filter(a => a.status !== 'idle').length} online</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <span className="text-teal-400 font-semibold">{agent.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.tickets} tickets • {agent.avgTime} avg</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      "text-xs",
                      agent.status === 'active' && "bg-emerald-500/20 text-emerald-400",
                      agent.status === 'busy' && "bg-amber-500/20 text-amber-400",
                      agent.status === 'idle' && "bg-slate-500/20 text-slate-400",
                    )}
                  >
                    {agent.status}
                  </Badge>
                  <ActionButton action="View" target={agent.name} icon={Eye}>
                    View
                  </ActionButton>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Escalations */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ArrowUpCircle className="w-5 h-5 text-amber-400" />
            Recent Escalations
            <Badge className="ml-auto bg-amber-500/20 text-amber-400">{escalations.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {escalations.map((esc) => (
              <div
                key={esc.id}
                className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/30"
              >
                <div className="flex items-center gap-4">
                  <Badge className="bg-amber-500/20 text-amber-400">{esc.level}</Badge>
                  <div>
                    <p className="text-sm font-medium text-foreground">{esc.id} → {esc.ticket}</p>
                    <p className="text-xs text-muted-foreground">{esc.reason} • {esc.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ActionButton action="View" target={esc.id} icon={Eye}>
                    View
                  </ActionButton>
                  <ActionButton action="Resolve" target={esc.id} icon={CheckCircle} className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
                    Resolve
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSectionContent = (
    title: string,
    icon: React.ReactNode,
    description: string,
    actions: { label: string; action: string; icon?: React.ElementType }[] = [
      { label: 'View All', action: 'View All', icon: Eye },
      { label: 'Refresh', action: 'Refresh', icon: RefreshCw },
    ]
  ) => (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {icon}
            <div>
              <h2 className="text-xl font-bold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground font-normal">{description}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-6">
            {actions.map((act) => (
              <ActionButton key={act.action} action={act.action} target={title} icon={act.icon}>
                {act.label}
              </ActionButton>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-4 bg-background/50 rounded-xl border border-border/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-cyan-500/20 text-cyan-400">Item {i}</Badge>
                  <span className="text-xs text-muted-foreground">Just now</span>
                </div>
                <div className="h-16 flex items-center justify-center text-muted-foreground text-sm">
                  Content placeholder
                </div>
                <div className="flex gap-2 mt-3">
                  <ActionButton action="View" target={`${title}-${i}`} className="flex-1" icon={Eye}>
                    View
                  </ActionButton>
                  <ActionButton action="Edit" target={`${title}-${i}`} className="flex-1">
                    Edit
                  </ActionButton>
                  <ActionButton action="Assign" target={`${title}-${i}`} icon={Users}>
                    Assign
                  </ActionButton>
                  <ActionButton action="Escalate" target={`${title}-${i}`} icon={ArrowUpCircle} variant="destructive">
                    Escalate
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const getSectionConfig = (section: string): { title: string; icon: React.ReactNode; description: string } => {
    const configs: Record<string, { title: string; icon: React.ReactNode; description: string }> = {
      // Dashboard
      'dashboard-overview': { title: 'Dashboard Overview', icon: <Activity className="w-6 h-6 text-cyan-400" />, description: 'Complete support overview' },
      'dashboard-live-status': { title: 'Live Support Status', icon: <Activity className="w-6 h-6 text-emerald-400" />, description: 'Real-time support metrics' },
      'dashboard-sla-health': { title: 'SLA Health Meter', icon: <Gauge className="w-6 h-6 text-blue-400" />, description: 'SLA compliance status' },
      'dashboard-ai-human': { title: 'AI vs Human Load', icon: <Bot className="w-6 h-6 text-purple-400" />, description: 'Workload distribution' },
      'dashboard-urgent': { title: 'Urgent Alerts', icon: <AlertTriangle className="w-6 h-6 text-red-400" />, description: 'Critical issues requiring attention' },
      
      // Tickets
      'tickets-all': { title: 'All Tickets', icon: <Ticket className="w-6 h-6 text-cyan-400" />, description: 'Complete ticket list' },
      'tickets-open': { title: 'Open Tickets', icon: <Ticket className="w-6 h-6 text-blue-400" />, description: 'Tickets awaiting action' },
      'tickets-in-progress': { title: 'In-Progress Tickets', icon: <Activity className="w-6 h-6 text-amber-400" />, description: 'Currently being worked on' },
      'tickets-resolved': { title: 'Resolved Tickets', icon: <CheckCircle className="w-6 h-6 text-emerald-400" />, description: 'Successfully resolved' },
      'tickets-closed': { title: 'Closed Tickets', icon: <XCircle className="w-6 h-6 text-slate-400" />, description: 'Completed and archived' },
      
      // AI Support
      'ai-auto-reply': { title: 'AI Auto-Reply Engine', icon: <Send className="w-6 h-6 text-blue-400" />, description: 'Automated response system' },
      'ai-classification': { title: 'AI Ticket Classification', icon: <Bot className="w-6 h-6 text-purple-400" />, description: 'Smart categorization' },
      'ai-sentiment': { title: 'AI Sentiment Analysis', icon: <Smile className="w-6 h-6 text-emerald-400" />, description: 'Customer mood detection' },
      
      // Human Support
      'agents-active': { title: 'Active Agents', icon: <Users className="w-6 h-6 text-emerald-400" />, description: 'Currently online agents' },
      'workload': { title: 'Workload Distribution', icon: <BarChart3 className="w-6 h-6 text-blue-400" />, description: 'Agent workload balance' },
      
      // Escalations
      'esc-auto': { title: 'Auto Escalations', icon: <Zap className="w-6 h-6 text-amber-400" />, description: 'System-triggered escalations' },
      'esc-manual': { title: 'Manual Escalations', icon: <User className="w-6 h-6 text-blue-400" />, description: 'Agent-initiated escalations' },
      
      // Approvals
      'approve-refund': { title: 'Refund Approvals', icon: <RefreshCw className="w-6 h-6 text-emerald-400" />, description: 'Pending refund requests' },
      
      // Reports
      'report-volume': { title: 'Ticket Volume Report', icon: <BarChart3 className="w-6 h-6 text-blue-400" />, description: 'Ticket analytics' },
      'report-satisfaction': { title: 'Customer Satisfaction', icon: <Smile className="w-6 h-6 text-emerald-400" />, description: 'CSAT metrics' },
      
      // Alerts
      'alert-sla': { title: 'SLA Breach Alerts', icon: <AlertTriangle className="w-6 h-6 text-red-400" />, description: 'SLA violation warnings' },
      'alert-critical': { title: 'Critical Ticket Alerts', icon: <Bell className="w-6 h-6 text-amber-400" />, description: 'High-priority notifications' },
      
      // System Controls
      'ctrl-ticket-rules': { title: 'Ticket Rules', icon: <FileText className="w-6 h-6 text-blue-400" />, description: 'Ticket routing configuration' },
      'ctrl-auto-assign': { title: 'Auto-Assignment Rules', icon: <Zap className="w-6 h-6 text-amber-400" />, description: 'Automatic ticket assignment' },
      'ctrl-sla-timers': { title: 'SLA Timers', icon: <Timer className="w-6 h-6 text-purple-400" />, description: 'SLA configuration' },
      'ctrl-emergency': { title: 'Emergency Mode', icon: <Shield className="w-6 h-6 text-red-400" />, description: 'Crisis management settings' },
    };

    return configs[section] || { 
      title: section.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
      icon: <Settings className="w-6 h-6 text-slate-400" />, 
      description: 'Section content' 
    };
  };

  const renderContent = () => {
    // Dashboard overview
    if (activeSection === 'dashboard-overview' || activeSection === 'dashboard') {
      return renderDashboardOverview();
    }

    // All other sections
    const config = getSectionConfig(activeSection);
    return renderSectionContent(config.title, config.icon, config.description);
  };

  return (
    <ScrollArea className="flex-1">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Headphones className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Support Manager Dashboard</h1>
              <p className="text-muted-foreground">Customer Support & Helpdesk Operations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
              SUPPORT THEME ACTIVE
            </Badge>
          </div>
        </div>

        {renderContent()}
      </div>
    </ScrollArea>
  );
};

export default CustomerSupportDashboardContent;
