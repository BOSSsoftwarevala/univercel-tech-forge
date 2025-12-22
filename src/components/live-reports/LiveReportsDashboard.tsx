import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Filter, RefreshCw, Radio } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLiveActivityLogs, DateFilter, ActivityActionType, LiveActivityLog } from '@/hooks/useLiveActivityLogs';
import { LiveActivityFeed } from './LiveActivityFeed';
import { LiveStatsCards } from './LiveStatsCards';
import { LiveStatsGraph } from './LiveStatsGraph';
import { LiveOnlineUsers } from './LiveOnlineUsers';
import { LiveReportCard } from './LiveReportCard';
import { LiveStatusIndicator } from './LiveStatusIndicator';

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

export function LiveReportsDashboard() {
  const [dateFilter, setDateFilter] = useState<DateFilter>('live');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<LiveActivityLog | null>(null);

  const { logs, onlineUsers, stats, isLoading, refetch } = useLiveActivityLogs({
    dateFilter,
    roleFilter: roleFilter === 'all' ? null : roleFilter,
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] rounded-2xl p-6 space-y-6">
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

      {/* Stats Cards - Colorful like reference */}
      <LiveStatsCards stats={stats} />

      {/* Graphs */}
      <LiveStatsGraph logs={logs} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
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
              <LiveActivityFeed logs={logs} onSelectLog={setSelectedLog} maxHeight="500px" />
            </CardContent>
          </Card>
        </div>

        {/* Online Users */}
        <div>
          <LiveOnlineUsers users={onlineUsers} maxHeight="500px" />
        </div>
      </div>

      {/* Detail Modal */}
      <LiveReportCard 
        log={selectedLog} 
        isOpen={!!selectedLog} 
        onClose={() => setSelectedLog(null)} 
      />
    </div>
  );
}
