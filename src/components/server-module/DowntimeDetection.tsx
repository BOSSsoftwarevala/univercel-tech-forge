/**
 * DOWNTIME DETECTION
 * Auto-detect service failures, track incidents, trigger repair
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, CheckCircle, XCircle, Clock, Wifi, WifiOff,
  Activity, ArrowRight, Shield, Zap, Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Incident {
  id: string;
  service: string;
  server: string;
  type: 'downtime' | 'degraded' | 'latency' | 'error_spike';
  severity: 'critical' | 'high' | 'medium' | 'low';
  detectedAt: string;
  resolvedAt?: string;
  status: 'active' | 'repairing' | 'resolved';
  autoRepair: boolean;
  description: string;
}

const incidents: Incident[] = [
  { id: '1', service: 'Stability SDXL', server: 'AI Services Node', type: 'downtime', severity: 'critical', detectedAt: '2026-03-08 14:22', status: 'repairing', autoRepair: true, description: 'Service unresponsive. Docker container crashed. Auto-restart initiated.' },
  { id: '2', service: 'Gemini 3 Pro', server: 'Production VPS', type: 'degraded', severity: 'high', detectedAt: '2026-03-08 13:45', status: 'active', autoRepair: false, description: 'Response latency exceeded 800ms threshold. API rate limit suspected.' },
  { id: '3', service: 'Nginx Proxy', server: 'Production VPS', type: 'error_spike', severity: 'medium', detectedAt: '2026-03-08 10:15', resolvedAt: '2026-03-08 10:18', status: 'resolved', autoRepair: true, description: '502 error spike detected. Upstream service restarted automatically.' },
  { id: '4', service: 'PostgreSQL', server: 'Staging Server', type: 'latency', severity: 'low', detectedAt: '2026-03-07 22:30', resolvedAt: '2026-03-07 22:35', status: 'resolved', autoRepair: true, description: 'Query latency spike. Connection pool rebalanced.' },
  { id: '5', service: 'Redis Cache', server: 'Production VPS', type: 'downtime', severity: 'critical', detectedAt: '2026-03-07 08:12', resolvedAt: '2026-03-07 08:14', status: 'resolved', autoRepair: true, description: 'OOM kill detected. Memory limit increased and service restarted.' },
];

const sevConfig: Record<string, { color: string; bg: string }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10' },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/10' },
};

const statusIcons: Record<string, { icon: React.ElementType; color: string }> = {
  active: { icon: XCircle, color: 'text-red-400' },
  repairing: { icon: Activity, color: 'text-amber-400' },
  resolved: { icon: CheckCircle, color: 'text-emerald-400' },
};

export const DowntimeDetection: React.FC = () => {
  const activeIncidents = incidents.filter(i => i.status !== 'resolved').length;
  const autoRepaired = incidents.filter(i => i.status === 'resolved' && i.autoRepair).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Downtime Detection</h2>
          <p className="text-sm text-muted-foreground">Automatic failure detection & incident tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-none">
            <Activity className="w-3 h-3 mr-1 animate-pulse" /> Live Monitoring
          </Badge>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Incidents', value: activeIncidents, color: 'text-red-400', bg: 'bg-red-500/10', icon: AlertTriangle },
          { label: 'Auto-Repaired', value: autoRepaired, color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: Zap },
          { label: 'Avg Detection', value: '< 8s', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Clock },
          { label: 'Avg Recovery', value: '< 2m', color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Shield },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`border-border ${stat.bg}`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detection Flow */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-foreground">Auto-Detection Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-2">
            {['Service Check', 'Anomaly Detected', 'Alert Triggered', 'Repair Initiated', 'Service Verified'].map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-400">{i + 1}</span>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-[80px]">{step}</p>
                </div>
                {i < 4 && <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Incidents List */}
      <div className="space-y-3">
        {incidents.map((incident, i) => {
          const sev = sevConfig[incident.severity];
          const st = statusIcons[incident.status];
          const StIcon = st.icon;

          return (
            <motion.div key={incident.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${sev.bg} flex items-center justify-center mt-0.5`}>
                        <StIcon className={`w-5 h-5 ${st.color} ${incident.status === 'repairing' ? 'animate-pulse' : ''}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{incident.service}</p>
                          <Badge variant="outline" className={`${sev.color} ${sev.bg} border-none text-xs`}>{incident.severity}</Badge>
                          {incident.autoRepair && <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-none text-xs"><Zap className="w-3 h-3 mr-1" />Auto-Repair</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Detected: {incident.detectedAt}
                          {incident.resolvedAt && ` • Resolved: ${incident.resolvedAt}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${st.color === 'text-red-400' ? 'bg-red-500/10 text-red-400' : st.color === 'text-amber-400' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'} border-none`}>
                        {incident.status}
                      </Badge>
                      {incident.status === 'active' && <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs">Repair Now</Button>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DowntimeDetection;
