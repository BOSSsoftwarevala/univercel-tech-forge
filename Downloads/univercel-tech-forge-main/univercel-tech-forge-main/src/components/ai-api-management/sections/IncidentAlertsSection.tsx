/**
 * INCIDENT & ALERTS SECTION
 * Downtime alerts, latency spike alerts, auto-failover
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  AlertTriangle, Bell, Clock, Zap, Shield, CheckCircle, XCircle,
  Activity, RefreshCw, Eye, Settings, ArrowRight
} from "lucide-react";
import { toast } from "sonner";

const activeIncidents = [
  { id: '1', type: 'latency', model: 'GPT-4 Turbo', severity: 'warning', message: 'Latency spike: 2.4s avg (threshold: 1.5s)', started: '15 mins ago', status: 'investigating' },
  { id: '2', type: 'error_rate', model: 'Claude 3', severity: 'info', message: 'Error rate: 1.2% (threshold: 1%)', started: '45 mins ago', status: 'monitoring' },
];

const recentAlerts = [
  { type: 'downtime', model: 'Whisper API', message: 'Service restored after 12 min outage', time: '2 hours ago', resolved: true },
  { type: 'latency', model: 'GPT-4', message: 'Latency normalized to 0.8s', time: '4 hours ago', resolved: true },
  { type: 'failover', model: 'DALL-E 3', message: 'Automatic failover to backup endpoint', time: '6 hours ago', resolved: true },
  { type: 'quota', model: 'Gemini Pro', message: 'Approaching 80% of monthly quota', time: '1 day ago', resolved: false },
];

const failoverConfig = [
  { primary: 'GPT-4 Turbo', backup: 'Claude 3 Opus', enabled: true, lastTest: '1 day ago', testStatus: 'passed' },
  { primary: 'DALL-E 3', backup: 'Stable Diffusion XL', enabled: true, lastTest: '2 days ago', testStatus: 'passed' },
  { primary: 'Whisper', backup: 'Deepgram', enabled: false, lastTest: 'Never', testStatus: 'untested' },
];

const alertRules = [
  { name: 'Latency Spike', condition: '> 1.5s avg', window: '5 min', channel: 'Slack + Email', enabled: true },
  { name: 'Error Rate', condition: '> 1%', window: '10 min', channel: 'Slack', enabled: true },
  { name: 'Downtime', condition: '> 30s', window: 'Immediate', channel: 'PagerDuty', enabled: true },
  { name: 'Quota Warning', condition: '> 80%', window: 'Daily', channel: 'Email', enabled: true },
];

export const IncidentAlertsSection = () => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'warning': return 'bg-amber-500/20 text-amber-400';
      case 'info': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">2</p>
            <p className="text-xs text-muted-foreground">Active Incidents</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Bell className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">12</p>
            <p className="text-xs text-muted-foreground">Alerts Today</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Shield className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">99.8%</p>
            <p className="text-xs text-muted-foreground">Uptime (30d)</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Zap className="w-5 h-5 text-violet-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">3</p>
            <p className="text-xs text-muted-foreground">Failovers Active</p>
          </CardContent>
        </Card>
      </div>

      {activeIncidents.length > 0 && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              Active Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeIncidents.map((incident) => (
                <div key={incident.id} className="p-3 rounded-lg bg-slate-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="font-medium text-white text-sm">{incident.model}</p>
                      <p className="text-xs text-muted-foreground">{incident.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{incident.started}</span>
                    <Badge className={getSeverityBadge(incident.severity)}>{incident.severity}</Badge>
                    <Badge variant="outline" className="text-[10px]">{incident.status}</Badge>
                    <Button size="sm" variant="outline" onClick={() => toast.success('Viewing incident details')}>
                      <Eye className="w-3 h-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-6">
        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentAlerts.map((alert, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {alert.resolved ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-400" />
                    )}
                    <div>
                      <p className="font-medium text-white text-sm">{alert.model}</p>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Alert Rules</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => toast.info('Opening alert settings')}>
              <Settings className="w-3 h-3 mr-1" />
              Configure
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alertRules.map((rule, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/20 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white text-sm">{rule.name}</p>
                    <p className="text-xs text-muted-foreground">{rule.condition} • {rule.window}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{rule.channel}</Badge>
                    <Switch defaultChecked={rule.enabled} onCheckedChange={() => toast.success(`${rule.name} toggled`)} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Auto-Failover Configuration</CardTitle>
          <Button size="sm" variant="outline" onClick={() => toast.success('Testing all failovers')}>
            <RefreshCw className="w-3 h-3 mr-2" />
            Test All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {failoverConfig.map((config, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">{config.primary}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="text-blue-400">{config.backup}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={
                      config.testStatus === 'passed' ? 'bg-emerald-500/20 text-emerald-400' :
                      config.testStatus === 'failed' ? 'bg-red-500/20 text-red-400' :
                      'bg-slate-500/20 text-slate-400'
                    }>
                      {config.testStatus}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Last test: {config.lastTest}</span>
                    <Switch checked={config.enabled} onCheckedChange={() => toast.success('Failover toggled')} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
