/**
 * SECURITY DASHBOARD
 * Unified security monitoring: SSL, domains, code integrity, threats, server security
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Lock, Globe, Code, Server, AlertTriangle, CheckCircle,
  XCircle, Eye, Activity, Fingerprint, Bug, Clock, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SecurityMetric {
  id: string;
  category: string;
  icon: React.ElementType;
  score: number;
  status: 'secure' | 'warning' | 'critical';
  details: string;
  lastCheck: string;
}

const securityMetrics: SecurityMetric[] = [
  { id: '1', category: 'SSL Certificates', icon: Lock, score: 100, status: 'secure', details: '4/4 domains with valid SSL, TLS 1.3 enforced', lastCheck: '2 min ago' },
  { id: '2', category: 'Domain Protection', icon: Globe, score: 95, status: 'secure', details: '3/3 domains locked, DNS monitoring active', lastCheck: '5 min ago' },
  { id: '3', category: 'Code Integrity', icon: Code, score: 85, status: 'warning', details: '3/4 repos verified, 1 unresolved tamper alert', lastCheck: '12 min ago' },
  { id: '4', category: 'Server Security', icon: Server, score: 92, status: 'secure', details: 'Firewalls active, no unauthorized access detected', lastCheck: '1 min ago' },
  { id: '5', category: 'Vulnerability Scan', icon: Bug, score: 88, status: 'warning', details: '2 medium vulnerabilities in dependencies', lastCheck: '30 min ago' },
  { id: '6', category: 'Access Control', icon: Fingerprint, score: 100, status: 'secure', details: 'RBAC enforced, all tokens valid, no anomalies', lastCheck: '3 min ago' },
];

interface ThreatAlert {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  detail: string;
  timestamp: string;
  resolved: boolean;
}

const threatAlerts: ThreatAlert[] = [
  { id: '1', type: 'Unauthorized Code Modification', severity: 'critical', source: 'Code Integrity', detail: 'Unverified change in src/config/keys.ts', timestamp: '2026-03-08 13:45', resolved: false },
  { id: '2', type: 'Dependency Vulnerability', severity: 'medium', source: 'Vulnerability Scan', detail: 'CVE-2026-1234 in lodash@4.17.20', timestamp: '2026-03-08 10:30', resolved: false },
  { id: '3', type: 'Brute Force Attempt', severity: 'high', source: 'Server Security', detail: '142 failed SSH attempts from 45.33.12.89', timestamp: '2026-03-08 08:15', resolved: true },
  { id: '4', type: 'SSL Expiring', severity: 'medium', source: 'SSL Certificates', detail: 'staging.softwarevala.com expires in 2 days', timestamp: '2026-03-08 06:00', resolved: false },
  { id: '5', type: 'Domain Transfer Blocked', severity: 'high', source: 'Domain Protection', detail: 'Unauthorized transfer attempt for softwarevala.com', timestamp: '2026-02-28 14:20', resolved: true },
];

const scoreColor = (score: number) => score >= 90 ? 'text-emerald-400' : score >= 70 ? 'text-amber-400' : 'text-red-400';
const scoreBg = (score: number) => score >= 90 ? 'bg-emerald-500/10' : score >= 70 ? 'bg-amber-500/10' : 'bg-red-500/10';

const sevColors: Record<string, { color: string; bg: string }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10' },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/10' },
};

export const SecurityDashboard: React.FC = () => {
  const overallScore = Math.round(securityMetrics.reduce((a, m) => a + m.score, 0) / securityMetrics.length);
  const unresolvedThreats = threatAlerts.filter(t => !t.resolved).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Security Dashboard</h2>
          <p className="text-sm text-muted-foreground">Unified security monitoring & threat intelligence</p>
        </div>
        <Badge className={`${scoreBg(overallScore)} ${scoreColor(overallScore)} border-none`}>
          <Shield className="w-3 h-3 mr-1" /> Security Score: {overallScore}/100
        </Badge>
      </div>

      {/* Overall Score */}
      <Card className={`border ${scoreBg(overallScore)} border-emerald-500/20`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl ${scoreBg(overallScore)} flex items-center justify-center`}>
                <Shield className={`w-8 h-8 ${scoreColor(overallScore)}`} />
              </div>
              <div>
                <p className={`text-4xl font-bold ${scoreColor(overallScore)}`}>{overallScore}</p>
                <p className="text-sm text-muted-foreground">Overall Security Score</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{securityMetrics.filter(m => m.status === 'secure').length}</p>
                <p className="text-xs text-muted-foreground">Secure</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-400">{securityMetrics.filter(m => m.status === 'warning').length}</p>
                <p className="text-xs text-muted-foreground">Warnings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">{unresolvedThreats}</p>
                <p className="text-xs text-muted-foreground">Active Threats</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {securityMetrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div key={metric.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-card border-border hover:border-blue-500/20 transition-colors">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-lg ${scoreBg(metric.score)} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${scoreColor(metric.score)}`} />
                    </div>
                    <span className={`text-2xl font-bold ${scoreColor(metric.score)}`}>{metric.score}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{metric.category}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{metric.details}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Progress value={metric.score} className="h-1.5 flex-1 mr-3" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{metric.lastCheck}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Threat Alerts */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" /> Threat Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {threatAlerts.map((alert, i) => {
            const sv = sevColors[alert.severity];
            return (
              <motion.div key={alert.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className={`flex items-start justify-between p-3 rounded-lg border ${!alert.resolved ? 'bg-red-500/5 border-red-500/20' : 'bg-muted/30 border-border/50'}`}>
                <div className="flex items-start gap-3">
                  {alert.resolved ? <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-400 mt-0.5 animate-pulse" />}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{alert.type}</p>
                      <Badge variant="outline" className={`${sv.color} ${sv.bg} border-none text-xs`}>{alert.severity}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.source} — {alert.detail}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.timestamp}</span>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
