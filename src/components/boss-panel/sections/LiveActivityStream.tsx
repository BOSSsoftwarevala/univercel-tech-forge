import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  User, 
  DollarSign, 
  Package, 
  Shield, 
  AlertTriangle,
  Filter,
  Radio,
  Clock,
  RefreshCw,
  Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBossActivityStream } from '@/hooks/boss-panel/useBossActivityStream';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface ActivityEvent {
  id: string;
  timestamp: Date;
  actor: string;
  actorRole: string;
  action: string;
  module: string;
  region: string;
  riskLevel: 'low' | 'medium' | 'high';
  icon: React.ElementType;
}

const riskColors = {
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const getIconForAction = (action: string): React.ElementType => {
  if (action.includes('security') || action.includes('devtools') || action.includes('visibility')) return Shield;
  if (action.includes('lead') || action.includes('user')) return User;
  if (action.includes('payment') || action.includes('wallet')) return DollarSign;
  if (action.includes('product') || action.includes('demo')) return Package;
  if (action.includes('alert') || action.includes('error')) return AlertTriangle;
  return Activity;
};

const getRiskLevel = (riskLevel: string | null): 'low' | 'medium' | 'high' => {
  if (riskLevel === 'high' || riskLevel === 'critical') return 'high';
  if (riskLevel === 'medium') return 'medium';
  return 'low';
};

export function LiveActivityStream({ streamingOn = true }: { streamingOn?: boolean }) {
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  // Use the real hook for system_activity_log
  const { activities: systemActivities, isLoading: systemLoading, isStreaming } = useBossActivityStream(streamingOn);

  // Also fetch from audit_logs table for comprehensive view
  const { data: auditLogs, isLoading: auditLoading, refetch } = useQuery({
    queryKey: ['boss-audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: streamingOn ? 3000 : false // Poll every 3 seconds when streaming
  });

  // Combine and transform activities from both sources
  const events: ActivityEvent[] = React.useMemo(() => {
    const combined: ActivityEvent[] = [];

    // Add system_activity_log entries
    systemActivities.forEach(activity => {
      combined.push({
        id: activity.log_id,
        timestamp: new Date(activity.timestamp),
        actor: activity.actor_id?.slice(0, 8) || 'System',
        actorRole: activity.actor_role || 'unknown',
        action: activity.action_type,
        module: activity.target || 'System',
        region: 'Global',
        riskLevel: getRiskLevel(activity.risk_level),
        icon: getIconForAction(activity.action_type),
      });
    });

    // Add audit_logs entries
    auditLogs?.forEach(log => {
      combined.push({
        id: log.id,
        timestamp: new Date(log.timestamp),
        actor: log.user_id?.slice(0, 8) || 'System',
        actorRole: log.role || 'unknown',
        action: log.action,
        module: log.module,
        region: 'Global',
        riskLevel: 'low',
        icon: getIconForAction(log.action),
      });
    });

    // Remove duplicates and sort by timestamp
    const uniqueEvents = combined.filter((event, index, self) =>
      index === self.findIndex(e => e.id === event.id)
    ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return uniqueEvents.slice(0, 100);
  }, [systemActivities, auditLogs]);

  const filteredEvents = events.filter(event => {
    if (filterRole !== 'all' && event.actorRole !== filterRole) return false;
    if (filterModule !== 'all' && event.module !== filterModule) return false;
    if (filterRisk !== 'all' && event.riskLevel !== filterRisk) return false;
    return true;
  });

  const isLoading = systemLoading || auditLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold" style={{ color: '#1E293B' }}>Live Activity Stream</h1>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${streamingOn && isStreaming ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
            <Radio className={`w-3 h-3 ${streamingOn && isStreaming ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-medium">{streamingOn && isStreaming ? 'LIVE' : 'PAUSED'}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-600">
            <Database className="w-3 h-3" />
            <span className="text-xs font-medium">REAL DATA</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="text-slate-600 hover:text-slate-900"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
          <div className="text-xs text-slate-500">
            {events.length} events captured
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="w-4 h-4 text-slate-500" />
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="boss_owner">Boss/Owner</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="franchise">Franchise</SelectItem>
                <SelectItem value="reseller">Reseller</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger className="w-40 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="source_protection">Security</SelectItem>
                <SelectItem value="leads">Leads</SelectItem>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="demos">Demos</SelectItem>
                <SelectItem value="System">System</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-40 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setFilterRole('all');
                setFilterModule('all');
                setFilterRisk('all');
              }}
              className="text-slate-500 hover:text-slate-900"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-900 text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" />
            Unified Timeline (Real-time from Database)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-12 text-slate-500">
                <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-50 animate-spin" />
                <p>Loading activities from database...</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No activities yet - frontend actions will appear here</p>
                    {!streamingOn && <p className="text-xs mt-2">Streaming is paused</p>}
                  </div>
                ) : (
                  filteredEvents.map((event) => {
                    const Icon = event.icon;
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${riskColors[event.riskLevel]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-900 font-medium">{event.actor}</span>
                            <Badge variant="outline" className="text-[10px] border-slate-300 text-slate-600">
                              {event.actorRole}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 truncate">{event.action}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-[10px] border-slate-300 text-slate-500 mb-1">
                            {event.module}
                          </Badge>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Clock className="w-3 h-3" />
                            {event.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                        <Badge className={`${riskColors[event.riskLevel]} border text-[10px]`}>
                          {event.riskLevel.toUpperCase()}
                        </Badge>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
