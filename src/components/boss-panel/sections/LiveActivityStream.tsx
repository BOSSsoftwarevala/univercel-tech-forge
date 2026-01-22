import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Filter,
  Radio,
  Clock
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
import { Input } from '@/components/ui/input';
import { useBossActivityStream } from '@/hooks/boss-panel/useBossActivityStream';

type PriorityFlag = 'HIGH' | 'NORMAL';

const riskColors: Record<string, string> = {
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
};

function toPriority(riskLevel?: string | null): PriorityFlag {
  const r = (riskLevel || '').toLowerCase();
  return r === 'high' || r === 'critical' ? 'HIGH' : 'NORMAL';
}

function extractStatus(metadata: unknown): string {
  if (!metadata || typeof metadata !== 'object') return 'logged';
  const m = metadata as Record<string, unknown>;
  return (
    (typeof m.status === 'string' && m.status) ||
    (typeof m.approval_status === 'string' && m.approval_status) ||
    (typeof m.action_result === 'string' && m.action_result) ||
    'logged'
  );
}

function startOfDayISO(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDayISO(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function LiveActivityStream({ streamingOn = true }: { streamingOn?: boolean }) {
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStart, setFilterStart] = useState<string>('');
  const [filterEnd, setFilterEnd] = useState<string>('');

  const { activities, isLoading, error, isStreaming } = useBossActivityStream(streamingOn);

  const derived = useMemo(() => {
    const roles = new Set<string>();
    const modules = new Set<string>();
    const statuses = new Set<string>();

    activities.forEach((a) => {
      if (a.actor_role) roles.add(a.actor_role);
      if (a.target) modules.add(a.target);
      statuses.add(extractStatus(a.metadata));
    });

    return {
      roles: Array.from(roles).sort(),
      modules: Array.from(modules).sort(),
      statuses: Array.from(statuses).sort(),
    };
  }, [activities]);

  const filteredActivities = useMemo(() => {
    const startDate = filterStart ? startOfDayISO(new Date(filterStart)) : null;
    const endDate = filterEnd ? endOfDayISO(new Date(filterEnd)) : null;

    return activities.filter((a) => {
      if (filterRole !== 'all' && a.actor_role !== filterRole) return false;
      if (filterModule !== 'all' && a.target !== filterModule) return false;

      const status = extractStatus(a.metadata);
      if (filterStatus !== 'all' && status !== filterStatus) return false;

      const priority = toPriority(a.risk_level);
      if (filterPriority !== 'all' && priority !== filterPriority) return false;

      const ts = a.timestamp ? new Date(a.timestamp) : null;
      if (startDate && ts && ts < startDate) return false;
      if (endDate && ts && ts > endDate) return false;

      return true;
    });
  }, [activities, filterEnd, filterModule, filterPriority, filterRole, filterStart, filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Live Activity Stream</h1>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isStreaming ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            <Radio className={`w-3 h-3 ${streamingOn ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-medium">{isStreaming ? 'LIVE' : 'PAUSED'}</span>
          </div>
        </div>
        <div className="text-xs text-white/40">
          {activities.length} events captured
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-[#12121a] border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <Filter className="w-4 h-4 text-white/40" />
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10">
                <SelectItem value="all">All Roles</SelectItem>
                {derived.roles.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10">
                <SelectItem value="all">All Modules</SelectItem>
                {derived.modules.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10">
                <SelectItem value="all">All Status</SelectItem>
                {derived.statuses.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10">
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="HIGH">HIGH</SelectItem>
                <SelectItem value="NORMAL">NORMAL</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={filterStart}
                onChange={(e) => setFilterStart(e.target.value)}
                className="w-[150px] bg-white/5 border-white/10 text-white"
              />
              <Input
                type="date"
                value={filterEnd}
                onChange={(e) => setFilterEnd(e.target.value)}
                className="w-[150px] bg-white/5 border-white/10 text-white"
              />
            </div>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setFilterRole('all');
                setFilterModule('all');
                setFilterStatus('all');
                setFilterPriority('all');
                setFilterStart('');
                setFilterEnd('');
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
            Unified Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {error ? (
                <div className="text-center py-12 text-white/40">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Failed to load activity feed</p>
                </div>
              ) : isLoading ? (
                <div className="text-center py-12 text-white/40">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Loading activity…</p>
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No activity matches current filters</p>
                </div>
              ) : (
                filteredActivities.map((a) => {
                  const risk = (a.risk_level || 'low').toLowerCase();
                  const status = extractStatus(a.metadata);
                  const priority = toPriority(a.risk_level);

                  return (
                    <motion.div
                      key={a.log_id}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${priority === 'HIGH' ? 'bg-amber-500/10 hover:bg-amber-500/15' : 'bg-white/5 hover:bg-white/10'}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${riskColors[risk] || riskColors.low}`}>
                        <Activity className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-medium truncate">
                            {a.actor_id ? a.actor_id : 'System'}
                          </span>
                          <Badge variant="outline" className="text-[10px] border-white/20 text-white/60">
                            {a.actor_role}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] border-white/20 text-white/60">
                            {status}
                          </Badge>
                          {priority === 'HIGH' && (
                            <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                              PRIORITY: HIGH
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-white/70 truncate">
                          {a.action_type}
                        </p>
                        {(a.target || a.target_id) && (
                          <p className="text-[11px] text-white/45 truncate">
                            {a.target ? `${a.target}` : ''}{a.target_id ? ` • ${a.target_id}` : ''}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <Badge variant="outline" className="text-[10px] border-white/20 text-white/50 mb-1">
                          {a.target || 'system'}
                        </Badge>
                        <div className="flex items-center justify-end gap-1 text-[10px] text-white/40">
                          <Clock className="w-3 h-3" />
                          {a.timestamp ? new Date(a.timestamp).toLocaleString() : ''}
                        </div>
                      </div>

                      <Badge className={`${riskColors[risk] || riskColors.low} border text-[10px]`}>
                        {(a.risk_level || 'low').toString().toUpperCase()}
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
