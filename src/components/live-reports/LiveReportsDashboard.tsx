import React, { useState } from 'react';
import { 
  Activity, Filter, RefreshCw, Radio, 
  LayoutDashboard, Users, FileText, 
  BarChart3, Bell, Settings, LogOut,
  Monitor, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useLiveActivityLogs, DateFilter, LiveActivityLog } from '@/hooks/useLiveActivityLogs';
import { LiveActivityFeed } from './LiveActivityFeed';
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
];

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Activity, label: 'Activity' },
  { icon: Users, label: 'Users' },
  { icon: FileText, label: 'Reports' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Bell, label: 'Alerts' },
];

export function LiveReportsDashboard() {
  const [dateFilter, setDateFilter] = useState<DateFilter>('live');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<LiveActivityLog | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');

  const { logs, onlineUsers, stats, isLoading, refetch } = useLiveActivityLogs({
    dateFilter,
    roleFilter: roleFilter === 'all' ? null : roleFilter,
  });

  const onlineCount = onlineUsers.filter(u => u.is_online).length;

  return (
    <div className="flex rounded-xl overflow-hidden bg-[#0c0c12] border border-gray-800/40" style={{ height: '600px' }}>
      
      {/* Left Sidebar - Compact */}
      <div className="w-44 bg-[#08080c] flex flex-col border-r border-gray-800/40">
        <div className="p-3 flex items-center gap-2 border-b border-gray-800/40">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Radio className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-white text-sm">Live Panel</span>
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveMenuItem(item.label)}
              className={cn(
                "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-all",
                activeMenuItem === item.label
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-gray-800/40 space-y-0.5">
          <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-gray-500 hover:text-white hover:bg-white/5">
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-gray-500 hover:text-white hover:bg-white/5">
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Compact */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Radio className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white">Live Reports</h1>
                <Badge className="bg-lime-500/20 text-lime-400 border-0 text-[9px] px-1.5 py-0">
                  <span className="w-1 h-1 rounded-full bg-lime-400 mr-1 animate-pulse" />
                  LIVE
                </Badge>
              </div>
              <p className="text-[10px] text-gray-500">Real-time activity monitoring</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tabs value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
              <TabsList className="bg-[#16161e] h-7 p-0.5">
                <TabsTrigger value="live" className="text-[10px] h-6 px-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">Live</TabsTrigger>
                <TabsTrigger value="daily" className="text-[10px] h-6 px-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">Daily</TabsTrigger>
                <TabsTrigger value="weekly" className="text-[10px] h-6 px-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" className="text-[10px] h-6 px-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={roleFilter || 'all'} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-24 h-7 bg-[#16161e] border-0 text-gray-400 text-[10px]">
                <Filter className="w-3 h-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#16161e] border-gray-800">
                {roleOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="text-[10px] text-gray-300">{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isLoading} className="h-7 w-7 bg-[#16161e]">
              <RefreshCw className={`w-3 h-3 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {/* Stats Cards - 4 columns matching reference */}
            <div className="grid grid-cols-4 gap-3">
              <StatCard title="Online Now" value={stats.onlineCount} gradient="from-amber-500 to-amber-700" />
              <StatCard title="Total Activities" value={stats.totalLogs} gradient="from-violet-500 to-purple-700" />
              <StatCard title="Successful" value={stats.successCount} gradient="from-lime-400 to-green-600" />
              <StatCard title="Warnings" value={stats.warningCount} gradient="from-rose-400 to-pink-600" />
            </div>

            {/* Chart */}
            <div className="bg-[#101018] rounded-xl p-3 border border-gray-800/40">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white text-sm font-medium">Activity Overview</h3>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-400" />Success</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />Warning</span>
                </div>
              </div>
              <LiveStatsGraph logs={logs} />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#101018] rounded-xl p-3 border border-gray-800/40">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white text-xs font-medium">Recent Activity</h3>
                  <Badge className="bg-violet-500/20 text-violet-400 border-0 text-[9px]">{logs.length}</Badge>
                </div>
                <LiveActivityFeed logs={logs.slice(0, 4)} onSelectLog={setSelectedLog} maxHeight="140px" />
              </div>

              <div className="bg-[#101018] rounded-xl p-3 border border-gray-800/40">
                <h3 className="text-white text-xs font-medium mb-2">Status Summary</h3>
                <div className="grid grid-cols-2 gap-2">
                  <MiniStatCard label="Failed" value={stats.failCount} color="text-red-400" bg="bg-red-500/10" />
                  <MiniStatCard label="Blocked" value={stats.blockedCount} color="text-orange-400" bg="bg-orange-500/10" />
                  <MiniStatCard label="Pending" value={stats.pendingCount} color="text-yellow-400" bg="bg-yellow-500/10" />
                  <MiniStatCard label="Force Out" value={stats.forceLoggedOutCount} color="text-gray-400" bg="bg-gray-500/10" />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Right Sidebar - Live Users */}
      <div className="w-56 bg-[#08080c] flex flex-col border-l border-gray-800/40">
        <div className="p-3 border-b border-gray-800/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-medium text-white text-xs">Live Users</span>
          </div>
          <Badge className="bg-lime-500 text-white border-0 text-[9px] px-1.5">{onlineCount} Online</Badge>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1.5">
            {onlineUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <Users className="w-6 h-6 mx-auto mb-1 opacity-30" />
                <p className="text-[10px]">No users</p>
              </div>
            ) : (
              onlineUsers.map((user) => <UserCard key={user.user_id} user={user} />)
            )}
          </div>
        </ScrollArea>

        <div className="p-2 border-t border-gray-800/40">
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="p-1.5 rounded bg-green-500/10">
              <p className="text-xs font-bold text-green-400">{onlineCount}</p>
              <p className="text-[8px] text-gray-500">On</p>
            </div>
            <div className="p-1.5 rounded bg-gray-500/10">
              <p className="text-xs font-bold text-gray-400">{onlineUsers.filter(u => !u.is_online).length}</p>
              <p className="text-[8px] text-gray-500">Off</p>
            </div>
            <div className="p-1.5 rounded bg-red-500/10">
              <p className="text-xs font-bold text-red-400">{stats.forceLoggedOutCount}</p>
              <p className="text-[8px] text-gray-500">Out</p>
            </div>
          </div>
        </div>
      </div>

      <LiveReportCard log={selectedLog} isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}

function StatCard({ title, value, gradient }: { title: string; value: number; gradient: string }) {
  return (
    <div className={cn("rounded-xl p-3 bg-gradient-to-br", gradient)}>
      <p className="text-[10px] text-white/70">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function MiniStatCard({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className={cn("rounded-lg p-2", bg)}>
      <p className={cn("text-base font-bold", color)}>{value}</p>
      <p className="text-[9px] text-gray-500">{label}</p>
    </div>
  );
}

function UserCard({ user }: { user: any }) {
  const status = getStatusFromUserData({
    is_online: user.is_online,
    force_logged_out: user.force_logged_out,
    pending_approval: user.pending_approval,
  });

  return (
    <div className="p-2 rounded-lg bg-[#12121a] border border-gray-800/40">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-medium">
            {user.user_id.slice(0, 2).toUpperCase()}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5">
            <LiveStatusIndicator status={status} size="sm" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-white truncate">{user.user_id.slice(0, 10)}...</p>
          <p className="text-[9px] text-gray-500 capitalize">{user.user_role?.replace('_', ' ')}</p>
        </div>
        <span className={cn(
          "text-[9px]",
          status === 'online' ? 'text-lime-400' : status === 'force_logout' ? 'text-red-400' : 'text-gray-500'
        )}>
          {status === 'online' ? 'Active' : status === 'force_logout' ? 'Out' : 'Off'}
        </span>
      </div>
    </div>
  );
}
