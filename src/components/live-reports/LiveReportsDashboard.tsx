import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Filter, RefreshCw, Radio, 
  LayoutDashboard, Users, FileText, Settings, 
  BarChart3, Bell, Shield, MessageSquare,
  ChevronLeft, ChevronRight, Monitor
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useLiveActivityLogs, DateFilter, LiveActivityLog } from '@/hooks/useLiveActivityLogs';
import { LiveActivityFeed } from './LiveActivityFeed';
import { LiveStatsCards } from './LiveStatsCards';
import { LiveStatsGraph } from './LiveStatsGraph';
import { LiveReportCard } from './LiveReportCard';
import { LiveStatusIndicator, getStatusFromUserData, getStatusLabel } from './LiveStatusIndicator';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'developer', label: 'Developer' },
  { value: 'demo_manager', label: 'Demo Manager' },
  { value: 'franchise', label: 'Franchise' },
  { value: 'reseller', label: 'Reseller' },
  { value: 'client_success', label: 'Support' },
  { value: 'influencer', label: 'Influencer' },
  { value: 'prime', label: 'Prime' },
  { value: 'client', label: 'Client' },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Activity, label: 'Activity' },
  { icon: Users, label: 'Users' },
  { icon: FileText, label: 'Reports' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Bell, label: 'Alerts' },
  { icon: MessageSquare, label: 'Messages' },
  { icon: Shield, label: 'Security' },
  { icon: Settings, label: 'Settings' },
];

export function LiveReportsDashboard() {
  const [dateFilter, setDateFilter] = useState<DateFilter>('live');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<LiveActivityLog | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');

  const { logs, onlineUsers, stats, isLoading, refetch } = useLiveActivityLogs({
    dateFilter,
    roleFilter: roleFilter === 'all' ? null : roleFilter,
  });

  const onlineCount = onlineUsers.filter(u => u.is_online).length;

  return (
    <TooltipProvider>
      <div className="flex bg-[#0d0d14] rounded-2xl overflow-hidden border border-gray-800/50" style={{ minHeight: '700px' }}>
        
        {/* Left Sidebar */}
        <div className={cn(
          "bg-[#0a0a0f] border-r border-gray-800/50 flex flex-col shrink-0 transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-52"
        )}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-800/50">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Radio className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-white text-sm">Live Panel</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-gray-400 hover:text-white hover:bg-gray-800 h-8 w-8"
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Sidebar Menu */}
          <ScrollArea className="flex-1 py-3">
            <div className="space-y-1 px-2">
              {sidebarItems.map((item) => (
                <Tooltip key={item.label} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActiveMenuItem(item.label)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm",
                        activeMenuItem === item.label
                          ? "bg-blue-500/20 text-blue-400"
                          : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                  </TooltipTrigger>
                  {sidebarCollapsed && (
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
          </ScrollArea>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-gray-800/50">
            <div className={cn("flex items-center gap-2", sidebarCollapsed && "justify-center")}>
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              {!sidebarCollapsed && <span className="text-xs text-lime-400">System Active</span>}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-800/50">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Radio className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-white">Live Reports</h1>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Real-time activity monitoring dashboard</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Tabs value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
                  <TabsList className="bg-[#1a1a2e] h-8">
                    <TabsTrigger value="live" className="text-xs h-7 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      Live
                    </TabsTrigger>
                    <TabsTrigger value="daily" className="text-xs h-7 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      Daily
                    </TabsTrigger>
                    <TabsTrigger value="weekly" className="text-xs h-7 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      Weekly
                    </TabsTrigger>
                    <TabsTrigger value="monthly" className="text-xs h-7 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      Monthly
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <Select value={roleFilter || 'all'} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-32 h-8 bg-[#1a1a2e] border-gray-800 text-gray-300 text-xs">
                    <Filter className="w-3 h-3 mr-1" />
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-gray-800">
                    {roleOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="text-gray-300 text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => refetch()} 
                  disabled={isLoading}
                  className="h-8 w-8 bg-[#1a1a2e] hover:bg-gray-800"
                >
                  <RefreshCw className={`w-3 h-3 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <LiveStatsCards stats={stats} />
              <LiveStatsGraph logs={logs} />
              
              <Card className="bg-[#12121a] border-gray-800/50">
                <CardHeader className="py-3 border-b border-gray-800/50">
                  <CardTitle className="text-sm flex items-center gap-2 text-white">
                    <Activity className="w-4 h-4 text-violet-400" />
                    Live Activity Feed
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <LiveActivityFeed logs={logs} onSelectLog={setSelectedLog} maxHeight="300px" />
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>

        {/* Right Sidebar - Live User Status */}
        <div className="w-64 bg-[#0a0a0f] border-l border-gray-800/50 flex flex-col shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-white text-sm">Live User Status</span>
              </div>
              <Badge className="bg-lime-400/20 text-lime-400 border-0 text-xs px-2 py-0.5">
                {onlineCount} Online
              </Badge>
            </div>
          </div>

          {/* Users List */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-2">
              {onlineUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">No users found</p>
                </div>
              ) : (
                onlineUsers.map((user) => {
                  const status = getStatusFromUserData({
                    is_online: user.is_online,
                    force_logged_out: user.force_logged_out,
                    pending_approval: user.pending_approval,
                  });
                  
                  return (
                    <div 
                      key={user.user_id}
                      className="p-2 rounded-lg bg-[#1a1a2e] border border-gray-800/50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                            {user.user_id.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5">
                            <LiveStatusIndicator status={status} size="sm" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate">{user.user_id.slice(0, 8)}...</p>
                          <p className="text-[10px] text-gray-500 capitalize">{user.user_role.replace('_', ' ')}</p>
                        </div>
                        <span className={cn(
                          "text-[10px]",
                          status === 'online' ? 'text-lime-400' :
                          status === 'force_logout' ? 'text-red-400' :
                          status === 'pending' ? 'text-yellow-400' : 'text-gray-500'
                        )}>
                          {getStatusLabel(status)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>

          {/* Footer Stats */}
          <div className="p-3 border-t border-gray-800/50">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-1.5 rounded bg-green-500/10">
                <p className="text-sm font-bold text-green-400">{onlineCount}</p>
                <p className="text-[10px] text-gray-500">Online</p>
              </div>
              <div className="p-1.5 rounded bg-gray-500/10">
                <p className="text-sm font-bold text-gray-400">{onlineUsers.filter(u => !u.is_online).length}</p>
                <p className="text-[10px] text-gray-500">Offline</p>
              </div>
              <div className="p-1.5 rounded bg-red-500/10">
                <p className="text-sm font-bold text-red-400">{onlineUsers.filter(u => u.force_logged_out).length}</p>
                <p className="text-[10px] text-gray-500">Forced</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        <LiveReportCard 
          log={selectedLog} 
          isOpen={!!selectedLog} 
          onClose={() => setSelectedLog(null)} 
        />
      </div>
    </TooltipProvider>
  );
}
