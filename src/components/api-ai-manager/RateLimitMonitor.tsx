import { motion } from 'framer-motion';
import { Activity, AlertTriangle, Ban, Shield, TrendingUp, Clock, Users, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface RateLimitConfig {
  id: string;
  name: string;
  scope: 'global' | 'role' | 'ip' | 'user';
  limit: number;
  used: number;
  period: string;
  status: 'normal' | 'warning' | 'blocked';
}

interface AbuseAlert {
  id: string;
  type: 'rate_exceeded' | 'suspicious_pattern' | 'ip_block' | 'brute_force';
  source: string;
  description: string;
  action: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const mockLimits: RateLimitConfig[] = [
  { id: '1', name: 'Public API', scope: 'global', limit: 10000, used: 6500, period: 'per minute', status: 'normal' },
  { id: '2', name: 'Admin API', scope: 'role', limit: 5000, used: 890, period: 'per minute', status: 'normal' },
  { id: '3', name: 'Auth Endpoints', scope: 'ip', limit: 100, used: 95, period: 'per minute', status: 'warning' },
  { id: '4', name: 'File Upload', scope: 'user', limit: 50, used: 48, period: 'per hour', status: 'warning' },
  { id: '5', name: 'Payment API', scope: 'global', limit: 1000, used: 320, period: 'per minute', status: 'normal' },
];

const mockAlerts: AbuseAlert[] = [
  { id: '1', type: 'rate_exceeded', source: '45.33.xxx.xxx', description: 'Rate limit exceeded on Auth API', action: 'Auto-blocked for 15 min', timestamp: '2 min ago', severity: 'high' },
  { id: '2', type: 'brute_force', source: '192.168.xxx.xxx', description: 'Brute force attempt detected on login endpoint', action: 'IP blacklisted', timestamp: '15 min ago', severity: 'critical' },
  { id: '3', type: 'suspicious_pattern', source: 'User: VL-7382916', description: 'Unusual request pattern detected', action: 'Flagged for review', timestamp: '1 hour ago', severity: 'medium' },
  { id: '4', type: 'ip_block', source: '103.45.xxx.xxx', description: 'Multiple failed auth attempts from datacenter IP', action: 'Auto-blocked', timestamp: '2 hours ago', severity: 'high' },
];

export function RateLimitMonitor() {
  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case 'global': return <Globe className="w-4 h-4 text-blue-400" />;
      case 'role': return <Users className="w-4 h-4 text-primary" />;
      case 'ip': return <Shield className="w-4 h-4 text-amber-400" />;
      default: return <Activity className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getUsageColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 70) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const blockedCount = mockAlerts.filter(a => a.action.includes('blocked') || a.action.includes('blacklist')).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Rate Limit & Usage Monitor</h2>
          <p className="text-sm text-muted-foreground">Auto-block on abuse • Alerts to Security/Admin</p>
        </div>
        <Badge variant="outline" className="bg-red-500/10 text-red-400">
          <Ban className="w-3 h-3 mr-1" />
          {blockedCount} Blocked Today
        </Badge>
      </div>

      {/* Rate Limit Status */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Active Rate Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockLimits.map((limit, index) => (
            <motion.div
              key={limit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getScopeIcon(limit.scope)}
                  <span className="font-medium text-foreground">{limit.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {limit.scope.toUpperCase()}
                  </Badge>
                  {limit.status !== 'normal' && (
                    <Badge variant="outline" className={
                      limit.status === 'blocked' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }>
                      {limit.status.toUpperCase()}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono ${getUsageColor(limit.used, limit.limit)}`}>
                    {limit.used.toLocaleString()} / {limit.limit.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">{limit.period}</span>
                </div>
              </div>
              <Progress value={(limit.used / limit.limit) * 100} className="h-2" />
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Wildcard Scope Warning */}
      <Card className="bg-amber-500/5 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <p className="font-semibold text-foreground">Wildcard (*) Scopes BLOCKED</p>
              <p className="text-sm text-muted-foreground">
                Rate limits must be defined per specific scope. Wildcard scopes are not permitted for security.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Abuse Alerts */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Abuse Detection Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg ${
                alert.severity === 'critical' ? 'bg-red-500/10 border border-red-500/30' :
                alert.severity === 'high' ? 'bg-orange-500/10 border border-orange-500/30' :
                'bg-muted/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {alert.severity === 'critical' || alert.severity === 'high' ? (
                    <Ban className="w-5 h-5 text-red-400 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {alert.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <Badge variant="outline" className={getSeverityBadge(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Source: {alert.source}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400">
                    {alert.action}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
