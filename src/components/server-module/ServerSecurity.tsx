/**
 * SERVER SECURITY
 * Password masked, AI threat scan, auto block, login monitor
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle,
  Ban, Activity, Clock, Brain, UserX
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface SecurityStatus {
  server: string;
  passwordMasked: boolean;
  threatScan: 'clean' | 'warning' | 'scanning';
  autoBlock: boolean;
  lastScan: string;
  failedLogins: number;
}

const securityData: SecurityStatus[] = [
  { server: 'Production Server 1', passwordMasked: true, threatScan: 'clean', autoBlock: true, lastScan: '5 min ago', failedLogins: 0 },
  { server: 'Production Server 2', passwordMasked: true, threatScan: 'clean', autoBlock: true, lastScan: '8 min ago', failedLogins: 2 },
  { server: 'EU Gateway', passwordMasked: true, threatScan: 'clean', autoBlock: true, lastScan: '3 min ago', failedLogins: 0 },
  { server: 'Asia Pacific Node', passwordMasked: true, threatScan: 'warning', autoBlock: true, lastScan: '1 min ago', failedLogins: 5 },
  { server: 'Backup Server', passwordMasked: true, threatScan: 'clean', autoBlock: true, lastScan: '12 min ago', failedLogins: 0 },
];

export const ServerSecurity: React.FC = () => {
  const totalThreats = securityData.filter(s => s.threatScan === 'warning').length;
  const totalBlockedAttempts = securityData.reduce((a, b) => a + b.failedLogins, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Security Center</h2>
          <p className="text-sm text-muted-foreground">AI-powered threat protection</p>
        </div>
        <Badge className={totalThreats > 0 
          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
          : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
        }>
          {totalThreats > 0 ? `${totalThreats} Alert${totalThreats > 1 ? 's' : ''}` : 'All Secure'}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Threat Status', value: totalThreats > 0 ? 'Warning' : 'Clean', icon: Shield, 
            color: totalThreats > 0 ? 'text-amber-500' : 'text-emerald-500',
            bg: totalThreats > 0 ? 'bg-amber-500/10' : 'bg-emerald-500/10' },
          { label: 'Auto Block', value: 'Active', icon: Ban, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Failed Logins', value: totalBlockedAttempts.toString(), icon: UserX, 
            color: totalBlockedAttempts > 5 ? 'text-amber-500' : 'text-muted-foreground',
            bg: totalBlockedAttempts > 5 ? 'bg-amber-500/10' : 'bg-muted/50' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn("border", stat.bg)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.bg)}>
                      <Icon className={cn("w-5 h-5", stat.color)} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className={cn("font-semibold", stat.color)}>{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Per-Server Security */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Server Security Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityData.map((server, index) => (
              <motion.div
                key={server.server}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className={cn(
                      "w-5 h-5",
                      server.threatScan === 'clean' ? 'text-emerald-500' : 'text-amber-500'
                    )} />
                    <div>
                      <p className="font-medium text-foreground">{server.server}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Last scan: {server.lastScan}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Password Status */}
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs text-muted-foreground">Masked</span>
                    </div>
                    
                    {/* Threat Status */}
                    <Badge className={cn(
                      "text-xs",
                      server.threatScan === 'clean' 
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    )}>
                      {server.threatScan === 'clean' ? 'Clean' : 'Alert'}
                    </Badge>
                    
                    {/* Auto Block */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Auto Block</span>
                      <Switch checked={server.autoBlock} />
                    </div>
                    
                    {/* Failed Logins */}
                    {server.failedLogins > 0 && (
                      <Badge variant="outline" className="text-xs text-amber-500 border-amber-500/30">
                        {server.failedLogins} failed
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Security Notice */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">AI Protection Active</p>
              <p className="text-sm text-muted-foreground">
                AI automatically blocks suspicious IPs and monitors for unusual activity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerSecurity;
