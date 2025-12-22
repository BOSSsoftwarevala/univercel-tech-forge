import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Filter, RefreshCw, Radio, 
  LayoutDashboard, Users, FileText, 
  BarChart3, Bell, Settings, LogOut,
  Monitor, Clock, TrendingUp
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
  { value: 'influencer', label: 'Influencer' },
  { value: 'prime', label: 'Prime' },
  { value: 'client', label: 'Client' },
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
    <div className="flex rounded-2xl overflow-hidden bg-[#0f0f17]" style={{ minHeight: '680px' }}>
      
      {/* Left Sidebar */}
      <div className="w-48 bg-[#0a0a10] flex flex-col border-r border-gray-800/30">
        {/* Logo */}
        <div className="p-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Radio className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">Live Panel</span>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveMenuItem(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                activeMenuItem === item.label
                  ? "bg-[#1e3a5f] text-blue-300"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">Live Reports</h1>
                <Badge className="bg-lime-400/20 text-lime-400 border-0 text-[10px] px-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 mr-1 animate-pulse" />
                  LIVE
                </Badge>
              </div>
              <p className="text-xs text-gray-500">Real-time activity monitoring dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tabs value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
              <TabsList className="bg-[#1a1a24] h-8 p-0.5">
                <TabsTrigger value="live" className="text-xs h-7 px-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white">Live</TabsTrigger>
                <TabsTrigger value="daily" className="text-xs h-7 px-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white">Daily</TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs h-7 px-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs h-7 px-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={roleFilter || 'all'} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-28 h-8 bg-[#1a1a24] border-0 text-gray-300 text-xs">
                <Filter className="w-3 h-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a24] border-gray-800">
                {roleOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs text-gray-300">{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isLoading} className="h-8 w-8 bg-[#1a1a24]">
              <RefreshCw className={`w-3.5 h-3.5 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="p-5 space-y-5">
            {/* Stats Cards Row - Matching reference colors */}
            <div className="grid grid-cols-4 gap-4">
              <StatCard title="Online Now" value={stats.onlineCount} gradient="from-amber-600 to-amber-800" />
              <StatCard title="Total Activities" value={stats.totalLogs} gradient="from-violet-500 to-purple-700" />
              <StatCard title="Successful" value={stats.successCount} gradient="from-lime-400 to-green-500" />
              <StatCard title="Warnings" value={stats.warningCount} gradient="from-rose-400 to-pink-600" />
            </div>

            {/* Chart Section */}
            <div className="bg-[#12121a] rounded-2xl p-4 border border-gray-800/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">Activity Overview</h3>
                  <p className="text-xs text-gray-500">Live activity tracking</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-violet-400" />
                    <span className="text-gray-400">Success</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-gray-400">Warnings</span>
                  </div>
                </div>
              </div>
              <LiveStatsGraph logs={logs} />
            </div>

            {/* Bottom Row - Two Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Activity Feed */}
              <div className="bg-[#12121a] rounded-2xl p-4 border border-gray-800/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-sm">Recent Activity</h3>
                  <Badge className="bg-violet-500/20 text-violet-400 border-0 text-[10px]">{logs.length} events</Badge>
                </div>
                <LiveActivityFeed logs={logs.slice(0, 5)} onSelectLog={setSelectedLog} maxHeight="200px" />
              </div>

              {/* Quick Stats */}
              <div className="bg-[#12121a] rounded-2xl p-4 border border-gray-800/30">
                <h3 className="text-white font-semibold text-sm mb-3">Status Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  <MiniStatCard label="Failed" value={stats.failCount} color="text-red-400" bg="bg-red-500/10" />
                  <MiniStatCard label="Blocked" value={stats.blockedCount} color="text-orange-400" bg="bg-orange-500/10" />
                  <MiniStatCard label="Pending" value={stats.pendingCount} color="text-yellow-400" bg="bg-yellow-500/10" />
                  <MiniStatCard label="Force Logout" value={stats.forceLoggedOutCount} color="text-slate-400" bg="bg-slate-500/10" />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Right Sidebar - Live Users */}
      <div className="w-72 bg-[#0a0a10] flex flex-col border-l border-gray-800/30">
        {/* Header */}
        <div className="p-4 border-b border-gray-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-white text-sm">Live Users</span>
            </div>
            <Badge className="bg-lime-500 text-white border-0 text-[10px] px-2">
              {onlineCount} Online
            </Badge>
          </div>
        </div>

        {/* Users List */}
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {onlineUsers.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No users found</p>
              </div>
            ) : (
              onlineUsers.map((user) => (
                <UserStatusCard key={user.user_id} user={user} />
              ))
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-gray-800/30">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-green-500/10">
              <p className="text-sm font-bold text-green-400">{onlineCount}</p>
              <p className="text-[10px] text-gray-500">Online</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-gray-500/10">
              <p className="text-sm font-bold text-gray-400">{onlineUsers.filter(u => !u.is_online).length}</p>
              <p className="text-[10px] text-gray-500">Offline</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-red-500/10">
              <p className="text-sm font-bold text-red-400">{stats.forceLoggedOutCount}</p>
              <p className="text-[10px] text-gray-500">Forced</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <LiveReportCard log={selectedLog} isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}

// Stat Card Component - Matching reference style
function StatCard({ title, value, gradient }: { title: string; value: number; gradient: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br", gradient)}>
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <p className="text-xs text-white/70 mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

// Mini Stat Card
function MiniStatCard({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className={cn("rounded-xl p-3", bg)}>
      <p className={cn("text-xl font-bold", color)}>{value}</p>
      <p className="text-[10px] text-gray-500">{label}</p>
    </div>
  );
}

// User Status Card
function UserStatusCard({ user }: { user: any }) {
  const status = getStatusFromUserData({
    is_online: user.is_online,
    force_logged_out: user.force_logged_out,
    pending_approval: user.pending_approval,
  });

  return (
    <div className="p-3 rounded-xl bg-[#15151f] border border-gray-800/30">
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
          <p className="text-xs text-white truncate">{user.user_id.slice(0, 12)}...</p>
          <p className="text-[10px] text-gray-500 capitalize">{user.user_role?.replace('_', ' ') || 'User'}</p>
        </div>
        <div className="text-right">
          <p className={cn(
            "text-[10px] font-medium",
            status === 'online' ? 'text-lime-400' :
            status === 'force_logout' ? 'text-red-400' :
            status === 'pending' ? 'text-yellow-400' : 'text-gray-500'
          )}>
            {getStatusLabel(status)}
          </p>
          {user.session_started_at && user.is_online && (
            <p className="text-[9px] text-gray-600 flex items-center justify-end gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              {formatDistanceToNow(new Date(user.session_started_at), { addSuffix: false })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
