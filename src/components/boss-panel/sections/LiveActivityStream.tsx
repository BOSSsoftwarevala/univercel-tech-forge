/**
 * LIVE ACTIVITY STREAM - REAL-TIME DB SYNC
 * Fetches from audit_logs every 3 seconds - NO CACHE
 * Boss Panel sees ALL frontend actions immediately
 */

import React, { useState, useEffect, useCallback } from 'react';
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
  MousePointer,
  Server,
  FileText
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
import { supabase } from '@/integrations/supabase/client';

interface ActivityEvent {
  id: string;
  timestamp: Date;
  actor: string;
  actorRole: string;
  action: string;
  module: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  icon: React.ElementType;
  userId: string | null;
}

// Icon mapping based on module/action
const getIconForAction = (action: string, module: string): React.ElementType => {
  if (action.includes('security') || module === 'authentication') return Shield;
  if (action.includes('finance') || action.includes('payment')) return DollarSign;
  if (action.includes('button_click') || action.includes('click')) return MousePointer;
  if (action.includes('crud') || action.includes('create') || action.includes('update')) return FileText;
  if (action.includes('server') || module === 'server_manager') return Server;
  if (action.includes('alert') || action.includes('error')) return AlertTriangle;
  if (action.includes('product') || action.includes('demo')) return Package;
  return User;
};

// Risk level from severity or action type
const getRiskLevel = (metaJson: any, action: string): 'low' | 'medium' | 'high' | 'critical' => {
  if (metaJson?.severity) return metaJson.severity;
  if (action.includes('delete') || action.includes('critical')) return 'high';
  if (action.includes('update') || action.includes('permission')) return 'medium';
  return 'low';
};

const riskColors = {
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  critical: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export function LiveActivityStream({ streamingOn = true }: { streamingOn?: boolean }) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  // FORCE FETCH from audit_logs - NO CACHE - Every 3 seconds
  const fetchActivityLogs = useCallback(async () => {
    if (!streamingOn) return;
    
    setIsLoading(true);
    try {
      // Direct DB query - no caching, fresh data every time
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('[BOSS PANEL] Failed to fetch audit_logs:', error);
        return;
      }

      if (data) {
        const mappedEvents: ActivityEvent[] = data.map((log: any) => {
          const metaJson = typeof log.meta_json === 'string' 
            ? JSON.parse(log.meta_json) 
            : log.meta_json || {};
          
          return {
            id: log.id,
            timestamp: new Date(log.timestamp),
            actor: metaJson?.actor_name || 'System',
            actorRole: log.role || metaJson?.role || 'system',
            action: log.action,
            module: log.module,
            riskLevel: getRiskLevel(metaJson, log.action),
            icon: getIconForAction(log.action, log.module),
            userId: log.user_id,
          };
        });

        setEvents(mappedEvents);
        setLastFetch(new Date());
      }
    } catch (err) {
      console.error('[BOSS PANEL] Activity fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [streamingOn]);

  // POLLING: Fetch every 3 seconds - MANDATORY for real-time Boss visibility
  useEffect(() => {
    if (!streamingOn) return;

    // Initial fetch
    fetchActivityLogs();

    // Poll every 3 seconds - NO CACHE - Boss must see ALL actions
    const interval = setInterval(fetchActivityLogs, 3000);

    return () => clearInterval(interval);
  }, [streamingOn, fetchActivityLogs]);

  // Manual refresh
  const handleManualRefresh = () => {
    fetchActivityLogs();
  };

  const filteredEvents = events.filter(event => {
    if (filterRole !== 'all' && event.actorRole !== filterRole) return false;
    if (filterModule !== 'all' && event.module !== filterModule) return false;
    if (filterRisk !== 'all' && event.riskLevel !== filterRisk) return false;
    return true;
  });

  // Get unique roles and modules for filter dropdowns
  const uniqueRoles = [...new Set(events.map(e => e.actorRole))].filter(Boolean);
  const uniqueModules = [...new Set(events.map(e => e.module))].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Live Activity Stream</h1>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${streamingOn ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            <Radio className={`w-3 h-3 ${streamingOn ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-medium">{streamingOn ? 'LIVE' : 'PAUSED'}</span>
          </div>
          {isLoading && (
            <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
          )}
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            className="border-white/20 text-white/70 hover:text-white"
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            Refresh Now
          </Button>
          <div className="text-xs text-white/40">
            {events.length} events | Last: {lastFetch?.toLocaleTimeString() || 'Never'}
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-[#12121a] border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="w-4 h-4 text-white/40" />
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10 z-50">
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10 z-50">
                <SelectItem value="all">All Modules</SelectItem>
                {uniqueModules.map(module => (
                  <SelectItem key={module} value={module}>{module}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10">
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10 z-50">
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
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
              className="text-white/50 hover:text-white"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card className="bg-[#12121a] border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            Unified Timeline (Real-time from Database)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No activity recorded yet</p>
                  {!streamingOn && <p className="text-xs mt-2">Streaming is paused</p>}
                  <p className="text-xs mt-2 text-white/30">
                    Actions from all roles will appear here in real-time
                  </p>
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
                      className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${riskColors[event.riskLevel]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{event.actor}</span>
                          <Badge variant="outline" className="text-[10px] border-white/20 text-white/60">
                            {event.actorRole}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/60 truncate">{event.action}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-[10px] border-white/20 text-white/50 mb-1">
                          {event.module}
                        </Badge>
                        <div className="flex items-center gap-1 text-[10px] text-white/40">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
