import React, { useState } from 'react';
import { 
  Activity, Filter, RefreshCw, Radio, 
  LayoutDashboard, Users, FileText, 
  BarChart3, Bell, Settings, LogOut,
  Monitor, TrendingUp, Clock, Shield
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

const roleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'developer', label: 'Developer' },
  { value: 'demo_manager', label: 'Demo Manager' },
  { value: 'franchise', label: 'Franchise' },
  { value: 'reseller', label: 'Reseller' },
  { value: 'client_success', label: 'Support' },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
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
    <div className="flex rounded-2xl overflow-hidden bg-[#0d0d14] border border-gray-800/30" style={{ minHeight: '600px' }}>
      
      {/* Left Sidebar */}
      <div className="w-48 bg-[#09090e] flex flex-col border-r border-gray-800/30">
        <div className="p-4 flex items-center gap-3 border-b border-gray-800/30">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Radio className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm">Live Panel</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveMenuItem(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                activeMenuItem === item.label
                  ? "bg-violet-500/20 text-violet-400"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Promo Card */}
        <div className="mx-3 mb-3 p-4 rounded-xl bg-gradient-to-br from-violet-600/20 to-purple-800/20 border border-violet-500/20">
          <div className="w-12 h-12 rounded-full bg-violet-500/30 flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-violet-400" />
          </div>
          <p className="text-xs text-gray-400 mb-2">Monitor all live activities in real-time</p>
          <Button size="sm" className="w-full bg-violet-500 hover:bg-violet-600 text-white text-xs h-8">
            View All
          </Button>
        </div>

        <div className="p-3 border-t border-gray-800/30 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-white/5">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-white/5">
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
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">Hello, Admin</h1>
                <Badge className="bg-lime-500/20 text-lime-400 border-0 text-[10px] px-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 mr-1 animate-pulse" />
                  LIVE
                </Badge>
              </div>
              <p className="text-xs text-gray-500">Monitor and manage live activities</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tabs value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
              <TabsList className="bg-[#16161e] h-8 p-0.5">
                <TabsTrigger value="live" className="text-xs h-7 px-3 data-[state=active]:bg-violet-500 data-[state=active]:text-white">Live</TabsTrigger>
                <TabsTrigger value="daily" className="text-xs h-7 px-3 data-[state=active]:bg-violet-500 data-[state=active]:text-white">Daily</TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs h-7 px-3 data-[state=active]:bg-violet-500 data-[state=active]:text-white">Weekly</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select value={roleFilter || 'all'} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-28 h-8 bg-[#16161e] border-0 text-gray-400 text-xs">
                <Filter className="w-3 h-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#16161e] border-gray-800">
                {roleOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs text-gray-300">{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isLoading} className="h-8 w-8 bg-[#16161e]">
              <RefreshCw className={`w-3.5 h-3.5 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="px-5 py-4">
          <div className="grid grid-cols-3 gap-4">
            <StatCard 
              title="Online Now" 
              value={onlineCount} 
              subtitle="Active users"
              gradient="from-amber-500 to-orange-600"
              icon={<Monitor className="w-5 h-5 text-white" />}
            />
            <StatCard 
              title="Total Activities" 
              value={stats.totalLogs} 
              subtitle="Today's logs"
              gradient="from-violet-500 to-purple-600"
              icon={<Activity className="w-5 h-5 text-white" />}
            />
            <StatCard 
              title="Success Rate" 
              value={stats.totalLogs > 0 ? Math.round((stats.successCount / stats.totalLogs) * 100) : 100} 
              subtitle="% successful"
              gradient="from-lime-400 to-green-500"
              icon={<TrendingUp className="w-5 h-5 text-white" />}
            />
          </div>
        </div>

        {/* Chart Section */}
        <div className="px-5 flex-1">
          <div className="bg-[#101018] rounded-xl p-5 border border-gray-800/30 h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">Activity Overview</h3>
                <p className="text-xs text-gray-500">June 14 – July 14, 2024</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-violet-400" />
                  <span className="text-gray-400">Success</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="text-gray-400">Warning</span>
                </span>
              </div>
            </div>
            <LiveStatsGraph logs={logs} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="px-5 py-4 grid grid-cols-2 gap-4">
          <div className="bg-[#101018] rounded-xl p-4 border border-gray-800/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium text-sm">Recent Activity</h3>
              <Badge className="bg-violet-500/20 text-violet-400 border-0 text-xs">{logs.length}</Badge>
            </div>
            <LiveActivityFeed logs={logs.slice(0, 4)} onSelectLog={setSelectedLog} maxHeight="140px" />
          </div>

          <div className="bg-[#101018] rounded-xl p-4 border border-gray-800/30">
            <h3 className="text-white font-medium text-sm mb-3">Status Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              <MiniStatCard label="Failed" value={stats.failCount} color="text-red-400" bg="bg-red-500/10" />
              <MiniStatCard label="Blocked" value={stats.blockedCount} color="text-orange-400" bg="bg-orange-500/10" />
              <MiniStatCard label="Pending" value={stats.pendingCount} color="text-yellow-400" bg="bg-yellow-500/10" />
              <MiniStatCard label="Force Out" value={stats.forceLoggedOutCount} color="text-gray-400" bg="bg-gray-500/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Live Users */}
      <div className="w-56 bg-[#09090e] flex flex-col border-l border-gray-800/30">
        <div className="p-4 border-b border-gray-800/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-white text-sm">Live Users</span>
          </div>
          <Badge className="bg-lime-500 text-white border-0 text-xs px-2">{onlineCount}</Badge>
        </div>

        <ScrollArea className="flex-1 p-3">
          <div className="space-y-2">
            {onlineUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No users online</p>
              </div>
            ) : (
              onlineUsers.map((user) => <UserCard key={user.user_id} user={user} />)
            )}
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-gray-800/30">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-green-500/10">
              <p className="text-sm font-bold text-green-400">{onlineCount}</p>
              <p className="text-[10px] text-gray-500">Online</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-500/10">
              <p className="text-sm font-bold text-gray-400">{onlineUsers.filter(u => !u.is_online).length}</p>
              <p className="text-[10px] text-gray-500">Offline</p>
            </div>
            <div className="p-2 rounded-lg bg-red-500/10">
              <p className="text-sm font-bold text-red-400">{stats.forceLoggedOutCount}</p>
              <p className="text-[10px] text-gray-500">Forced</p>
            </div>
          </div>
        </div>
      </div>

      <LiveReportCard log={selectedLog} isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}

function StatCard({ title, value, subtitle, gradient, icon }: { 
  title: string; 
  value: number; 
  subtitle: string;
  gradient: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl p-4 bg-gradient-to-br", gradient)}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs text-white/80 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-[10px] text-white/60 mt-0.5">{subtitle}</p>
        </div>
        <div className="p-2 rounded-lg bg-white/20">
          {icon}
        </div>
      </div>
    </div>
  );
}

function MiniStatCard({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className={cn("rounded-lg p-3", bg)}>
      <p className={cn("text-lg font-bold", color)}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
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
    <div className="p-3 rounded-lg bg-[#12121a] border border-gray-800/30">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
            {user.user_id.slice(0, 2).toUpperCase()}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5">
            <LiveStatusIndicator status={status} size="sm" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white font-medium truncate">{user.user_id.slice(0, 8)}...</p>
          <p className="text-[10px] text-gray-500 capitalize">{user.user_role?.replace('_', ' ')}</p>
        </div>
        <Badge className={cn(
          "text-[10px] border-0",
          status === 'online' ? 'bg-lime-500/20 text-lime-400' : 
          status === 'force_logout' ? 'bg-red-500/20 text-red-400' : 
          'bg-gray-500/20 text-gray-400'
        )}>
          {getStatusLabel(status)}
        </Badge>
      </div>
    </div>
  );
}
