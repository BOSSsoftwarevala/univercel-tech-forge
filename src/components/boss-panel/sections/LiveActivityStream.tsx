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

const mockEvents: Omit<ActivityEvent, 'id' | 'timestamp'>[] = [
  { actor: 'John Smith', actorRole: 'Franchise', action: 'Lead created', module: 'Leads', region: 'North America', riskLevel: 'low', icon: User },
  { actor: 'Sarah Chen', actorRole: 'Reseller', action: 'Deal closed - $15,000', module: 'Sales', region: 'Asia Pacific', riskLevel: 'low', icon: DollarSign },
  { actor: 'Mike Johnson', actorRole: 'Super Admin', action: 'Role permissions updated', module: 'Security', region: 'Europe', riskLevel: 'medium', icon: Shield },
  { actor: 'Emily Davis', actorRole: 'Lead Manager', action: 'Demo converted', module: 'Demos', region: 'North America', riskLevel: 'low', icon: Package },
  { actor: 'System', actorRole: 'AI Engine', action: 'Security alert triggered', module: 'Security', region: 'Global', riskLevel: 'high', icon: AlertTriangle },
  { actor: 'David Wilson', actorRole: 'Country Admin', action: 'New product added', module: 'Products', region: 'Europe', riskLevel: 'low', icon: Package },
];

const riskColors = {
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function LiveActivityStream({ streamingOn = true }: { streamingOn?: boolean }) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterModule, setFilterModule] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  // Simulate live events
  useEffect(() => {
    if (!streamingOn) return;

    const interval = setInterval(() => {
      const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      const newEvent: ActivityEvent = {
        ...randomEvent,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
      };
      
      setEvents(prev => [newEvent, ...prev].slice(0, 50));
    }, 3000);

    return () => clearInterval(interval);
  }, [streamingOn]);

  const filteredEvents = events.filter(event => {
    if (filterRole !== 'all' && event.actorRole !== filterRole) return false;
    if (filterModule !== 'all' && event.module !== filterModule) return false;
    if (filterRisk !== 'all' && event.riskLevel !== filterRisk) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Live Activity Stream</h1>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${streamingOn ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            <Radio className={`w-3 h-3 ${streamingOn ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-medium">{streamingOn ? 'LIVE' : 'PAUSED'}</span>
          </div>
        </div>
        <div className="text-xs text-white/40">
          {events.length} events captured
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-[#12121a] border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-4 h-4 text-white/40" />
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
                <SelectItem value="Franchise">Franchise</SelectItem>
                <SelectItem value="Reseller">Reseller</SelectItem>
                <SelectItem value="Lead Manager">Lead Manager</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10">
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="Leads">Leads</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Products">Products</SelectItem>
                <SelectItem value="Demos">Demos</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10">
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10">
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
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Waiting for activity...</p>
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
