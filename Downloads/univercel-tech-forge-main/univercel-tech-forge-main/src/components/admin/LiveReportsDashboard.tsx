import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Calendar,
  RefreshCw,
  Download,
  Eye,
  UserCheck,
  UserX,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format, subDays, subWeeks, subMonths } from "date-fns";

interface ReportStats {
  totalUsers: number;
  onlineUsers: number;
  pendingApprovals: number;
  activeToday: number;
  newSignups: number;
  forceLogouts: number;
}

interface ActivityLog {
  id: string;
  user_id: string;
  action_type: string;
  action_description: string;
  page_url: string;
  created_at: string;
  user_role: string;
}

export default function LiveReportsDashboard() {
  const { isBossOwner, isCEO } = useAuth();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [stats, setStats] = useState<ReportStats>({
    totalUsers: 0,
    onlineUsers: 0,
    pendingApprovals: 0,
    activeToday: 0,
    newSignups: 0,
    forceLogouts: 0
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const getDateRange = () => {
    const now = new Date();
    switch (period) {
      case 'daily':
        return subDays(now, 1);
      case 'weekly':
        return subWeeks(now, 1);
      case 'monthly':
        return subMonths(now, 1);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const startDate = getDateRange().toISOString();

      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      // Fetch online users
      const { data: online } = await supabase
        .from('user_online_status')
        .select('*')
        .eq('is_online', true);

      // Fetch pending approvals
      const { count: pendingApprovals } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('approval_status', 'pending');

      // Fetch new signups in period
      const { count: newSignups } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate);

      // Fetch force logouts in period
      const { count: forceLogouts } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .not('force_logged_out_at', 'is', null)
        .gte('force_logged_out_at', startDate);

      // Fetch activity logs
      let logsQuery = supabase
        .from('live_activity_logs')
        .select('*')
        .gte('created_at', startDate)
        .order('created_at', { ascending: false })
        .limit(50);

      // CEO cannot see boss_owner logs
      if (isCEO && !isBossOwner) {
        logsQuery = logsQuery.neq('user_role', 'boss_owner');
      }

      const { data: logs } = await logsQuery;

      setStats({
        totalUsers: totalUsers || 0,
        onlineUsers: online?.length || 0,
        pendingApprovals: pendingApprovals || 0,
        activeToday: online?.length || 0,
        newSignups: newSignups || 0,
        forceLogouts: forceLogouts || 0
      });

      setOnlineUsers(online || []);
      setActivityLogs((logs as ActivityLog[]) || []);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [period]);

  // Real-time subscription for online status
  useEffect(() => {
    const channel = supabase
      .channel('online-status')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_online_status' },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const exportReport = () => {
    const data = {
      period,
      generatedAt: new Date().toISOString(),
      stats,
      activityLogs: activityLogs.slice(0, 100)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${period}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Reports Dashboard</h2>
          <p className="text-muted-foreground">
            Last updated: {format(lastRefresh, 'h:mm:ss a')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchStats} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
        <TabsList>
          <TabsTrigger value="daily">
            <Calendar className="w-4 h-4 mr-2" />
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly">
            <Calendar className="w-4 h-4 mr-2" />
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly">
            <Calendar className="w-4 h-4 mr-2" />
            Monthly
          </TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="mt-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="bg-card/50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-muted-foreground">Total Users</span>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.totalUsers}</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Eye className="w-5 h-5 text-green-400" />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                  <span className="text-sm text-muted-foreground">Online Now</span>
                </div>
                <p className="text-2xl font-bold mt-2 text-green-400">{stats.onlineUsers}</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <p className="text-2xl font-bold mt-2 text-yellow-400">{stats.pendingApprovals}</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-muted-foreground">New Signups</span>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.newSignups}</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <UserX className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-muted-foreground">Force Logouts</span>
                </div>
                <p className="text-2xl font-bold mt-2 text-red-400">{stats.forceLogouts}</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.activeToday}</p>
              </CardContent>
            </Card>
          </div>

          {/* Online Users & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Online Users */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Online Users ({onlineUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {onlineUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm font-medium">{user.user_id?.slice(0, 8)}...</span>
                          <Badge variant="outline" className="text-xs">
                            {user.user_role}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {user.current_page || 'Dashboard'}
                        </span>
                      </div>
                    ))}
                    {onlineUsers.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No users online
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Activity Logs */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Live Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="p-2 rounded-lg bg-background/50 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="text-xs">
                            {log.user_role || 'unknown'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(log.created_at), 'h:mm a')}
                          </span>
                        </div>
                        <p className="text-foreground">{log.action_description || log.action_type}</p>
                        {log.page_url && (
                          <p className="text-xs text-muted-foreground mt-1">{log.page_url}</p>
                        )}
                      </div>
                    ))}
                    {activityLogs.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No activity in this period
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
