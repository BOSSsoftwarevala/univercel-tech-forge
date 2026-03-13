/**
 * DOMAIN LOCK SYSTEM
 * Domain protection: lock, DNS change alerts, transfer protection
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Lock, Shield, Globe, AlertTriangle, CheckCircle, Bell,
  Ban, Eye, RefreshCw, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface ProtectedDomain {
  id: string;
  domain: string;
  locked: boolean;
  dnsMonitoring: boolean;
  transferProtection: boolean;
  lastDnsChange: string;
  alerts: number;
}

const domains: ProtectedDomain[] = [
  { id: '1', domain: 'softwarevala.com', locked: true, dnsMonitoring: true, transferProtection: true, lastDnsChange: 'Never', alerts: 0 },
  { id: '2', domain: 'api.softwarevala.com', locked: true, dnsMonitoring: true, transferProtection: true, lastDnsChange: 'Never', alerts: 0 },
  { id: '3', domain: 'staging.softwarevala.com', locked: true, dnsMonitoring: true, transferProtection: false, lastDnsChange: '2026-03-05', alerts: 1 },
];

interface DnsAlert {
  id: string;
  domain: string;
  type: string;
  detail: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  resolved: boolean;
}

const dnsAlerts: DnsAlert[] = [
  { id: '1', domain: 'staging.softwarevala.com', type: 'DNS Record Modified', detail: 'A record changed from 185.199.108.154 to 185.199.108.160', timestamp: '2026-03-05 09:45', severity: 'high', resolved: true },
  { id: '2', domain: 'softwarevala.com', type: 'Transfer Attempt Blocked', detail: 'Unauthorized domain transfer request detected and blocked', timestamp: '2026-02-28 14:20', severity: 'critical', resolved: true },
  { id: '3', domain: 'api.softwarevala.com', type: 'DNS Propagation Check', detail: 'All DNS records verified and consistent across nameservers', timestamp: '2026-03-08 06:00', severity: 'low', resolved: true },
];

const sevColors: Record<string, { color: string; bg: string }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10' },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/10' },
};

export const DomainLockSystem: React.FC = () => {
  const handleToggle = (domain: string, feature: string) => {
    toast.success(`${feature} updated for ${domain}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Domain Lock System</h2>
          <p className="text-sm text-muted-foreground">Protect domains from unauthorized changes & transfers</p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-400 border-none">
          <Shield className="w-3 h-3 mr-1" /> All Domains Protected
        </Badge>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Protected Domains', value: domains.length, color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: Lock },
          { label: 'DNS Monitoring', value: 'Active', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Eye },
          { label: 'Transfer Blocks', value: '1', color: 'text-red-400', bg: 'bg-red-500/10', icon: Ban },
          { label: 'DNS Alerts', value: dnsAlerts.length, color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Bell },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`border-border ${s.bg}`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Protected Domains */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Domain Protection Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {domains.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{d.domain}</p>
                  <p className="text-xs text-muted-foreground">Last DNS change: {d.lastDnsChange}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Lock</span>
                  <Switch checked={d.locked} onCheckedChange={() => handleToggle(d.domain, 'Domain Lock')} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">DNS Monitor</span>
                  <Switch checked={d.dnsMonitoring} onCheckedChange={() => handleToggle(d.domain, 'DNS Monitoring')} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Transfer Lock</span>
                  <Switch checked={d.transferProtection} onCheckedChange={() => handleToggle(d.domain, 'Transfer Protection')} />
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* DNS Alerts */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-muted-foreground" /> DNS Change Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {dnsAlerts.map((alert, i) => {
            const sv = sevColors[alert.severity];
            return (
              <motion.div key={alert.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  {alert.resolved ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.type}</p>
                    <p className="text-xs text-muted-foreground">{alert.domain} — {alert.detail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`${sv.color} ${sv.bg} border-none text-xs`}>{alert.severity}</Badge>
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainLockSystem;
