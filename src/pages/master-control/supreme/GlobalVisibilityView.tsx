import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, Users, Activity, Play, Pause, Clock, Monitor, 
  ArrowRight, Search, Filter, RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LiveSession {
  id: string;
  user_id: string;
  role: string;
  current_page: string;
  last_action: string;
  is_online: boolean;
  session_started_at: string;
}

interface ActivityLog {
  id: string;
  user_id: string;
  user_role: string;
  action_type: string;
  action_description: string;
  timestamp: string;
  page_url: string;
}

const GlobalVisibilityView = () => {
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    fetchLiveSessions();
    fetchActivityLogs();
    
    if (isLive) {
      const interval = setInterval(() => {
        fetchLiveSessions();
        fetchActivityLogs();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLive, roleFilter]);

  const fetchLiveSessions = async () => {
    let query = supabase
      .from('user_online_status')
      .select('*')
      .eq('is_online', true)
      .order('last_seen_at', { ascending: false });
    
    const { data } = await query;
    setLiveSessions(data?.map(s => ({
      id: s.id,
      user_id: s.user_id,
      role: s.user_role || 'unknown',
      current_page: s.current_page || 'Dashboard',
      last_action: 'Active',
      is_online: s.is_online,
      session_started_at: s.session_started_at || new Date().toISOString()
    })) || []);
  };

  const fetchActivityLogs = async () => {
    const { data } = await supabase
      .from('live_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    setActivityLogs(data?.map(log => ({
      id: log.id,
      user_id: log.user_id,
      user_role: log.user_role || 'unknown',
      action_type: log.action_type,
      action_description: log.action_description || '',
      timestamp: log.created_at,
      page_url: log.page_url || ''
    })) || []);
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      super_admin: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
      admin: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
      developer: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
      franchise: 'bg-green-500/15 text-green-400 border-green-500/25',
      reseller: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
      support: 'bg-pink-500/15 text-pink-400 border-pink-500/25',
    };
    return colors[role] || 'bg-gray-500/15 text-gray-400 border-gray-500/25';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const filteredLogs = activityLogs.filter(log => 
    searchTerm === '' || 
    log.action_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Eye className="w-7 h-7 text-cyan-400" />
            Global Absolute Visibility
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Live shadow view of every role's screen and actions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className={`gap-2 ${isLive ? 'border-green-500/50 text-green-400' : 'border-gray-700 text-gray-400'}`}
          >
            {isLive ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {isLive ? 'LIVE' : 'PAUSED'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { fetchLiveSessions(); fetchActivityLogs(); }}
            className="gap-2 border-gray-700 text-gray-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{liveSessions.length}</p>
              <p className="text-xs text-gray-500">Live Sessions</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{activityLogs.length}</p>
              <p className="text-xs text-gray-500">Actions Today</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {new Set(liveSessions.map(s => s.role)).size}
              </p>
              <p className="text-xs text-gray-500">Active Roles</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-xs text-gray-500">Visibility</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Live Sessions Panel */}
        <div className="col-span-4">
          <Card className="p-4 bg-[#0a0a12] border-gray-800/50 h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Sessions
              </h3>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32 h-8 bg-gray-800/50 border-gray-700 text-xs">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="franchise">Franchise</SelectItem>
                  <SelectItem value="reseller">Reseller</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ScrollArea className="h-[420px]">
              <div className="space-y-2">
                {liveSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(session.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedSession === session.id
                        ? 'bg-cyan-500/10 border-cyan-500/30'
                        : 'bg-gray-800/20 border-gray-800/50 hover:bg-gray-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={`text-[10px] ${getRoleColor(session.role)}`}>
                        {session.role}
                      </Badge>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(session.session_started_at)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{session.current_page}</p>
                    <p className="text-[10px] text-gray-600 font-mono mt-1">
                      ID: {session.user_id.slice(0, 8)}...
                    </p>
                  </div>
                ))}
                {liveSessions.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No active sessions
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Activity Timeline */}
        <div className="col-span-8">
          <Card className="p-4 bg-[#0a0a12] border-gray-800/50 h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Cross-Role Activity Timeline</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search actions..."
                    className="pl-9 h-8 w-48 bg-gray-800/50 border-gray-700 text-xs"
                  />
                </div>
              </div>
            </div>
            <ScrollArea className="h-[420px]">
              <div className="space-y-2">
                {filteredLogs.map((log, index) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/20 hover:bg-gray-800/40 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-cyan-500" />
                      {index < filteredLogs.length - 1 && (
                        <div className="w-px h-8 bg-gray-700 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`text-[10px] ${getRoleColor(log.user_role)}`}>
                          {log.user_role}
                        </Badge>
                        <span className="text-xs text-cyan-400">{log.action_type}</span>
                        <ArrowRight className="w-3 h-3 text-gray-600" />
                        <span className="text-xs text-gray-400 truncate">{log.page_url || 'System'}</span>
                      </div>
                      <p className="text-sm text-gray-300">{log.action_description || log.action_type}</p>
                      <span className="text-[10px] text-gray-600 mt-1 block">
                        {formatTime(log.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredLogs.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No activity logs found
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GlobalVisibilityView;
