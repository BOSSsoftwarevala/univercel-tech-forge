import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, User, DollarSign, Package, Shield, AlertTriangle,
  Filter, Radio, Clock, RefreshCw, Database, Zap, MousePointer, Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
  status: string;
  severity: string;
  source: 'system_events' | 'activity_log';
}

const riskColors = {
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const getIconForAction = (action: string): React.ElementType => {
  if (action.includes('franchise') || action.includes('reseller')) return Package;
  if (action.includes('purchase') || action.includes('checkout') || action.includes('payment') || action.includes('commission') || action.includes('balance') || action.includes('refund') || action.includes('buy')) return DollarSign;
  if (action.includes('security') || action.includes('suspicious') || action.includes('margin_violation')) return Shield;
  if (action.includes('login') || action.includes('signup') || action.includes('user') || action.includes('influencer') || action.includes('job_apply')) return User;
  if (action.includes('alert') || action.includes('error') || action.includes('emergency')) return AlertTriangle;
  if (action.includes('button_click')) return MousePointer;
  if (action.includes('product') || action.includes('license') || action.includes('demo')) return Package;
  if (action.includes('server') || action.includes('deploy')) return Zap;
  if (action.includes('enquiry') || action.includes('support') || action.includes('developer_request')) return Bell;
  return Activity;
};

const getRiskLevel = (action: string, severity?: string): 'low' | 'medium' | 'high' => {
  if (severity === 'critical' || severity === 'emergency') return 'high';
  if (severity === 'warning') return 'medium';
  if (action.includes('delete') || action.includes('violation') || action.includes('suspicious') || action.includes('failed_payment') || action.includes('security')) return 'high';
  if (action.includes('refund') || action.includes('margin') || action.includes('update') || action.includes('purchase') || action.includes('franchise_request') || action.includes('reseller_request')) return 'medium';
  return 'low';
};

export function LiveActivityStream({ streamingOn = true }: { streamingOn?: boolean }) {
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const queryClient = useQueryClient();

  // PRIMARY: Fetch PENDING system_events
  const { data: systemEvents, isLoading: loadingSE, isFetching: fetchingSE } = useQuery({
    queryKey: ['boss-live-system-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_events')
        .select('*')
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      setLastRefresh(new Date());
      return data || [];
    },
    refetchInterval: streamingOn ? 3000 : false,
    staleTime: 1000,
  });

  // SECONDARY: Fetch activity_log for real-time critical actions
  const { data: activityLogs, isLoading: loadingAL } = useQuery({
    queryKey: ['boss-activity-log'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
    refetchInterval: streamingOn ? 3000 : false,
    staleTime: 1000,
  });

  const isLoading = loadingSE || loadingAL;
  const isFetching = fetchingSE;

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['boss-live-system-events'] });
    queryClient.invalidateQueries({ queryKey: ['boss-activity-log'] });
  }, [queryClient]);

  // Merge both sources into unified events
  const events: ActivityEvent[] = React.useMemo(() => {
    const merged: ActivityEvent[] = [];

    // System events
    (systemEvents || []).forEach((ev: any) => {
      const payload = (typeof ev.payload === 'object' && ev.payload !== null && !Array.isArray(ev.payload))
        ? (ev.payload as Record<string, any>) : {};
      const action = String(ev.event_type);
      merged.push({
        id: ev.id,
        timestamp: new Date(ev.created_at),
        actor: ev.source_user_id ? String(ev.source_user_id).slice(0, 8) : 'Public',
        actorRole: String(ev.source_role || 'unknown'),
        action,
        module: String(payload.audit_module || payload.module || 'system'),
        region: String(payload.region || 'Global'),
        riskLevel: getRiskLevel(action, payload?.severity),
        icon: getIconForAction(action),
        status: String(ev.status || 'PENDING'),
        severity: String(payload?.severity || 'info'),
        source: 'system_events',
      });
    });

    // Activity logs
    (activityLogs || []).forEach((log: any) => {
      const meta = (typeof log.metadata === 'object' && log.metadata) ? log.metadata : {};
      merged.push({
        id: log.id,
        timestamp: new Date(log.created_at),
        actor: log.user_id ? String(log.user_id).slice(0, 8) : 'System',
        actorRole: String(log.role || 'unknown'),
        action: String(log.action_type),
        module: String(log.entity_type || meta.module || 'activity'),
        region: String(meta.region || 'Global'),
        riskLevel: getRiskLevel(log.action_type, log.severity_level),
        icon: getIconForAction(log.action_type),
        status: 'LOGGED',
        severity: String(log.severity_level || 'info'),
        source: 'activity_log',
      });
    });

    // Deduplicate and sort
    return merged
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 200);
  }, [systemEvents, activityLogs]);

  const updateEventStatus = useCallback(async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const baseUrl = import.meta.env.VITE_SUPABASE_URL;
      const res = await fetch(`${baseUrl}/functions/v1/api-system-event/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(await res.text());
      queryClient.invalidateQueries({ queryKey: ['boss-live-system-events'] });
    } catch (e) {
      console.error('[LiveActivityStream] Status update failed', e);
    }
  }, [queryClient]);

  const filteredEvents = events.filter(event => {
    if (filterRole !== 'all' && event.actorRole !== filterRole) return false;
    if (filterModule !== 'all' && event.module !== filterModule) return false;
    if (filterRisk !== 'all' && event.riskLevel !== filterRisk) return false;
    return true;
  });

  const uniqueModules = React.useMemo(() => {
    return Array.from(new Set(events.map(e => e.module)));
  }, [events]);

  const criticalCount = events.filter(e => e.riskLevel === 'high').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold" style={{ color: '#1E293B' }}>Live Activity Stream</h1>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${streamingOn ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
            <Radio className={`w-3 h-3 ${streamingOn ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-medium">{streamingOn ? 'LIVE' : 'PAUSED'}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-600">
            <Database className="w-3 h-3" />
            <span className="text-xs font-medium">REAL DB</span>
          </div>
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-600">
              <Bell className="w-3 h-3 animate-pulse" />
              <span className="text-xs font-bold">{criticalCount} CRITICAL</span>
            </div>
          )}
          {isFetching && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span className="text-xs font-medium">SYNCING</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isFetching} className="text-slate-600 hover:text-slate-900">
            <RefreshCw className={`w-4 h-4 mr-1 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="text-xs text-slate-500">
            {events.length} events • Last: {lastRefresh.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="w-4 h-4 text-slate-500" />
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40 bg-slate-50 border-slate-200"><SelectValue placeholder="Role" /></SelectTrigger>
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
              <SelectTrigger className="w-40 bg-slate-50 border-slate-200"><SelectValue placeholder="Module" /></SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="all">All Modules</SelectItem>
                {uniqueModules.map(mod => (<SelectItem key={mod} value={mod}>{mod}</SelectItem>))}
              </SelectContent>
            </Select>
            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-40 bg-slate-50 border-slate-200"><SelectValue placeholder="Risk" /></SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={() => { setFilterRole('all'); setFilterModule('all'); setFilterRisk('all'); }} className="text-slate-500 hover:text-slate-900">
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
            Live Timeline (system_events + activity_log)
            <Badge variant="outline" className="ml-2 text-xs">{filteredEvents.length} / {events.length}</Badge>
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
                    <p>No activities yet - actions will appear here in real time</p>
                  </div>
                ) : (
                  filteredEvents.map((event) => {
                    const Icon = event.icon;
                    return (
                      <motion.div
                        key={`${event.source}-${event.id}`}
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
                            <Badge variant="outline" className="text-[10px] border-slate-300 text-slate-600">{event.actorRole}</Badge>
                            {event.source === 'activity_log' && (
                              <Badge variant="outline" className="text-[10px] border-blue-300 text-blue-600">TRACKED</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 truncate">{event.action}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-[10px] border-slate-300 text-slate-500 mb-1">{event.module}</Badge>
                          {event.source === 'system_events' && event.status === 'PENDING' && (
                            <div className="flex items-center justify-end gap-2 mb-1">
                              <Button variant="ghost" size="sm" onClick={() => updateEventStatus(event.id, 'APPROVED')} className="h-6 px-2 text-[10px]">Approve</Button>
                              <Button variant="ghost" size="sm" onClick={() => updateEventStatus(event.id, 'REJECTED')} className="h-6 px-2 text-[10px]">Reject</Button>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Clock className="w-3 h-3" />
                            {event.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                        <Badge className={`${riskColors[event.riskLevel]} border text-[10px]`}>{event.riskLevel.toUpperCase()}</Badge>
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
