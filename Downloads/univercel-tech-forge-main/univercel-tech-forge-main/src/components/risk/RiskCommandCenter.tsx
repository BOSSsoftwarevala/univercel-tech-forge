import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  Shield, 
  Users, 
  Activity, 
  Eye, 
  Ban,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  RefreshCw,
  Zap,
  Target
} from 'lucide-react';
import { useRiskEngine, getRiskLevelColor, getRiskLevelBgColor, getSeverityColor } from '@/hooks/useRiskEngine';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function RiskCommandCenter() {
  const {
    commandCenterData,
    alerts,
    isLoading,
    fetchCommandCenterData,
    fetchAlerts,
    acknowledgeAlert,
    addToWatchlist,
    triggerEscalation,
  } = useRiskEngine();

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCommandCenterData();
    fetchAlerts();
  }, [fetchCommandCenterData, fetchAlerts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchCommandCenterData(), fetchAlerts()]);
    setRefreshing(false);
    toast.success('Data refreshed');
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    const success = await acknowledgeAlert(alertId);
    if (success) {
      toast.success('Alert acknowledged');
    }
  };

  const handleAddToWatchlist = async (userId: string, type: 'monitor' | 'restrict') => {
    const result = await addToWatchlist(userId, type, 'Added from Command Center');
    if (result?.success) {
      toast.success(`User added to ${type} list`);
    }
  };

  const handleEscalate = async (userId: string, level: 1 | 2 | 3 | 4) => {
    const result = await triggerEscalation(userId, level, 'Manual escalation from Command Center');
    if (result?.success) {
      toast.success(`Escalation level ${level} triggered`);
      fetchCommandCenterData();
    }
  };

  const distribution = commandCenterData?.risk_distribution || {
    normal: 0,
    caution: 0,
    watch: 0,
    high: 0,
    critical: 0,
  };

  const totalUsers = Object.values(distribution).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Command Center</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and risk management dashboard
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
          <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              High Risk Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {commandCenterData?.summary.total_high_risk || 0}
            </div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-500" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {commandCenterData?.summary.active_alerts || 0}
            </div>
            <p className="text-xs text-muted-foreground">Unacknowledged alerts</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Pending Escalations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {commandCenterData?.summary.pending_escalations || 0}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-500" />
              Watchlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {commandCenterData?.watchlist_count || 0}
            </div>
            <p className="text-xs text-muted-foreground">Users under observation</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Risk Distribution
          </CardTitle>
          <CardDescription>Overview of user risk levels across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(distribution).map(([level, count]) => (
              <div key={level} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={cn("font-medium capitalize", getRiskLevelColor(level))}>
                    {level}
                  </span>
                  <span className="text-muted-foreground">
                    {count} users ({totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <Progress 
                  value={totalUsers > 0 ? (count / totalUsers) * 100 : 0} 
                  className={cn("h-2", getRiskLevelBgColor(level))}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="high-risk" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="high-risk">High Risk Users</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="escalations">Escalations</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="high-risk">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-red-500" />
                High Risk Users
              </CardTitle>
              <CardDescription>Users with risk scores above 60</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {commandCenterData?.high_risk_users.map((user) => (
                    <div
                      key={user.user_id}
                      className={cn(
                        "p-4 rounded-lg border transition-colors cursor-pointer",
                        selectedUser === user.user_id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      )}
                      onClick={() => setSelectedUser(user.user_id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{user.user_id.slice(0, 8)}...</span>
                            <Badge className={cn(getRiskLevelBgColor(user.risk_level), "capitalize")}>
                              {user.risk_level}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Score: {user.current_score}</span>
                            <span>Escalation: Level {user.escalation_level}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right mr-4">
                            <div className="text-2xl font-bold">{user.current_score}</div>
                            <div className="text-xs text-muted-foreground">Risk Score</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToWatchlist(user.user_id, 'monitor');
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEscalate(user.user_id, (user.escalation_level + 1) as 1 | 2 | 3 | 4);
                            }}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Score Breakdown */}
                      <div className="mt-4 grid grid-cols-6 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium">{user.login_pattern_score}</div>
                          <div className="text-muted-foreground">Login</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{user.device_score}</div>
                          <div className="text-muted-foreground">Device</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{user.transaction_score}</div>
                          <div className="text-muted-foreground">Transaction</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{user.behavior_score}</div>
                          <div className="text-muted-foreground">Behavior</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{user.commission_score}</div>
                          <div className="text-muted-foreground">Commission</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{user.lead_score}</div>
                          <div className="text-muted-foreground">Lead</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!commandCenterData?.high_risk_users || commandCenterData.high_risk_users.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No high risk users detected</p>
                      <p className="text-sm">All users are within normal risk parameters</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Active Alerts
              </CardTitle>
              <CardDescription>Real-time risk alerts requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {alerts.filter(a => a.is_active && !a.acknowledged).map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "p-4 rounded-lg border",
                        alert.severity === 'critical' ? "border-red-500/50 bg-red-500/5" :
                        alert.severity === 'danger' ? "border-orange-500/50 bg-orange-500/5" :
                        "border-yellow-500/50 bg-yellow-500/5"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <span className="font-medium">{alert.title}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(alert.created_at).toLocaleString()}
                            </span>
                            {alert.risk_score && (
                              <span>Risk Score: {alert.risk_score}</span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Acknowledge
                        </Button>
                      </div>
                      {alert.recommended_action && (
                        <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                          <strong>Recommended:</strong> {alert.recommended_action}
                        </div>
                      )}
                    </div>
                  ))}

                  {alerts.filter(a => a.is_active && !a.acknowledged).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-500" />
                      <p>All clear!</p>
                      <p className="text-sm">No active alerts at this time</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-500" />
                Recent Escalations
              </CardTitle>
              <CardDescription>Automated and manual escalation history</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {commandCenterData?.recent_escalations.map((escalation) => (
                    <div
                      key={escalation.id}
                      className="p-4 rounded-lg border"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={escalation.reversed ? "secondary" : "destructive"}>
                              Level {escalation.escalation_level}
                            </Badge>
                            <span className="font-medium">{escalation.action_taken}</span>
                            {escalation.auto_triggered && (
                              <Badge variant="outline" className="text-xs">Auto</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{escalation.trigger_reason}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                            <span>User: {escalation.user_id.slice(0, 8)}...</span>
                            <span>Score at time: {escalation.risk_score_at_time}</span>
                          </div>
                        </div>
                        {escalation.reversed ? (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            Reversed
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}

                  {(!commandCenterData?.recent_escalations || commandCenterData.recent_escalations.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent escalations</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest risk events and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Activity feed coming soon</p>
                <p className="text-sm">Real-time event streaming will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}