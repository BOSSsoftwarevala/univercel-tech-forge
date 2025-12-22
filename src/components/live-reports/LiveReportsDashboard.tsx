import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Filter, RefreshCw, Radio, 
  LayoutDashboard, Users, FileText, Settings, 
  BarChart3, Bell, Shield, Zap, MessageSquare,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useLiveActivityLogs, DateFilter, ActivityActionType, LiveActivityLog } from '@/hooks/useLiveActivityLogs';
import { LiveActivityFeed } from './LiveActivityFeed';
import { LiveStatsCards } from './LiveStatsCards';
import { LiveStatsGraph } from './LiveStatsGraph';
import { LiveOnlineUsers } from './LiveOnlineUsers';
import { LiveReportCard } from './LiveReportCard';
import { LiveStatusIndicator } from './LiveStatusIndicator';
import { cn } from '@/lib/utils';

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

// Left sidebar menu items matching the reference image
const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', color: 'from-violet-400 to-purple-500', active: true },
  { icon: Activity, label: 'Activity', color: 'from-blue-400 to-cyan-500' },
  { icon: Users, label: 'Users', color: 'from-green-400 to-emerald-500' },
  { icon: FileText, label: 'Reports', color: 'from-orange-400 to-amber-500' },
  { icon: BarChart3, label: 'Analytics', color: 'from-pink-400 to-rose-500' },
  { icon: Bell, label: 'Alerts', color: 'from-yellow-400 to-orange-500' },
  { icon: MessageSquare, label: 'Messages', color: 'from-teal-400 to-cyan-500' },
  { icon: Shield, label: 'Security', color: 'from-red-400 to-rose-500' },
  { icon: Settings, label: 'Settings', color: 'from-slate-400 to-gray-500' },
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

  return (
    <TooltipProvider>
      <div className="flex min-h-[calc(100vh-300px)] bg-[#0a0a0f] rounded-2xl overflow-hidden">
        {/* Left Sidebar */}
        <aside 
          className={cn(
            "bg-[#0d0d14] border-r border-gray-800/50 flex flex-col transition-all duration-300",
            sidebarCollapsed ? "w-16" : "w-56"
          )}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-800/50 flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                  <Radio className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">Live Panel</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>

          {/* Sidebar Menu */}
          <ScrollArea className="flex-1 py-4">
            <div className="space-y-1 px-2">
              {sidebarItems.map((item) => (
                <Tooltip key={item.label} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActiveMenuItem(item.label)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                        activeMenuItem === item.label
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                      )}
                    >
                      <div className={cn(
                        "p-1.5 rounded-lg",
                        activeMenuItem === item.label 
                          ? "bg-white/20" 
                          : "bg-gray-800"
                      )}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      {!sidebarCollapsed && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                    </button>
                  </TooltipTrigger>
                  {sidebarCollapsed && (
                    <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
          </ScrollArea>

          {/* Sidebar Footer - Live Indicator */}
          <div className="p-4 border-t border-gray-800/50">
            <div className={cn(
              "flex items-center gap-2",
              sidebarCollapsed && "justify-center"
            )}>
              <motion.span 
                className="w-2 h-2 rounded-full bg-lime-400"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {!sidebarCollapsed && (
                <span className="text-xs text-lime-400 font-medium">System Active</span>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  Live Reports
                  <motion.span 
                    className="inline-flex items-center gap-1 text-sm font-normal text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded-full"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="w-2 h-2 rounded-full bg-lime-400" />
                    LIVE
                  </motion.span>
                </h1>
                <p className="text-sm text-gray-400">Real-time activity monitoring dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Tabs value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
                <TabsList className="bg-[#1a1a2e] border border-gray-800">
                  <TabsTrigger 
                    value="live" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                  >
                    Live
                  </TabsTrigger>
                  <TabsTrigger value="daily" className="data-[state=active]:bg-violet-500 data-[state=active]:text-white">
                    Daily
                  </TabsTrigger>
                  <TabsTrigger value="weekly" className="data-[state=active]:bg-violet-500 data-[state=active]:text-white">
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger value="monthly" className="data-[state=active]:bg-violet-500 data-[state=active]:text-white">
                    Monthly
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Select value={roleFilter || 'all'} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px] bg-[#1a1a2e] border-gray-800 text-gray-300">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter Role" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-gray-800">
                  {roleOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className="text-gray-300 hover:bg-gray-800">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => refetch()} 
                disabled={isLoading}
                className="bg-[#1a1a2e] border-gray-800 hover:bg-gray-800"
              >
                <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <LiveStatsCards stats={stats} />

          {/* Graphs */}
          <LiveStatsGraph logs={logs} />

          {/* Activity Feed */}
          <Card className="bg-[#12121a] border-gray-800/50 shadow-xl">
            <CardHeader className="pb-3 border-b border-gray-800/50">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <Activity className="w-5 h-5 text-violet-400" />
                Live Activity Feed
                {dateFilter === 'live' && (
                  <motion.span 
                    className="w-2 h-2 rounded-full bg-lime-400"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <LiveActivityFeed logs={logs} onSelectLog={setSelectedLog} maxHeight="400px" />
            </CardContent>
          </Card>
        </main>

        {/* Right Sidebar - Live Active Users */}
        <aside className="w-80 bg-[#0d0d14] border-l border-gray-800/50 flex flex-col">
          <LiveOnlineUsers users={onlineUsers} maxHeight="100%" />
        </aside>

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
