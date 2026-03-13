/**
 * CODE PROTECTION & TAMPER DETECTION
 * Source code security: encryption, access control, integrity checks, tamper alerts
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Code, Lock, Shield, AlertTriangle, CheckCircle, Eye,
  FileCode, GitBranch, Key, Fingerprint, Clock, XCircle, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Repository {
  id: string;
  name: string;
  encryption: 'aes-256' | 'none';
  accessControl: boolean;
  integrity: 'verified' | 'warning' | 'compromised';
  lastVerified: string;
  restrictedCloning: boolean;
}

const repositories: Repository[] = [
  { id: '1', name: 'software-vala-main', encryption: 'aes-256', accessControl: true, integrity: 'verified', lastVerified: '2 min ago', restrictedCloning: true },
  { id: '2', name: 'software-vala-api', encryption: 'aes-256', accessControl: true, integrity: 'verified', lastVerified: '5 min ago', restrictedCloning: true },
  { id: '3', name: 'software-vala-ai', encryption: 'aes-256', accessControl: true, integrity: 'warning', lastVerified: '12 min ago', restrictedCloning: true },
  { id: '4', name: 'software-vala-deploy', encryption: 'aes-256', accessControl: true, integrity: 'verified', lastVerified: '1 min ago', restrictedCloning: false },
];

interface TamperEvent {
  id: string;
  repo: string;
  file: string;
  type: 'unauthorized_edit' | 'hash_mismatch' | 'permission_change' | 'force_push';
  severity: 'critical' | 'high' | 'medium';
  detectedAt: string;
  resolved: boolean;
  detail: string;
}

const tamperEvents: TamperEvent[] = [
  { id: '1', repo: 'software-vala-ai', file: 'src/config/keys.ts', type: 'unauthorized_edit', severity: 'critical', detectedAt: '2026-03-08 13:45', resolved: false, detail: 'File modified without authorized commit. No matching pull request found.' },
  { id: '2', repo: 'software-vala-main', file: '.env.production', type: 'hash_mismatch', severity: 'high', detectedAt: '2026-03-07 22:10', resolved: true, detail: 'SHA-256 hash mismatch detected. Previous version restored from backup.' },
  { id: '3', repo: 'software-vala-api', file: 'package.json', type: 'permission_change', severity: 'medium', detectedAt: '2026-03-06 09:30', resolved: true, detail: 'Repository access permissions changed. Verified as authorized change by admin.' },
  { id: '4', repo: 'software-vala-deploy', file: 'main branch', type: 'force_push', severity: 'critical', detectedAt: '2026-03-05 16:00', resolved: true, detail: 'Force push to main branch detected. Change verified and approved.' },
];

const integrityConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  verified: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle },
  warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: AlertTriangle },
  compromised: { color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle },
};

const sevColors: Record<string, { color: string; bg: string }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10' },
};

export const CodeProtection: React.FC = () => {
  const verifiedCount = repositories.filter(r => r.integrity === 'verified').length;
  const unresolvedTampers = tamperEvents.filter(e => !e.resolved).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Code Protection & Tamper Detection</h2>
          <p className="text-sm text-muted-foreground">Source code encryption, access control & integrity monitoring</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" /> Verify All
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Repositories', value: repositories.length, color: 'text-blue-400', bg: 'bg-blue-500/10', icon: GitBranch },
          { label: 'Integrity Verified', value: `${verifiedCount}/${repositories.length}`, color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: Fingerprint },
          { label: 'Tamper Alerts', value: unresolvedTampers, color: unresolvedTampers > 0 ? 'text-red-400' : 'text-emerald-400', bg: unresolvedTampers > 0 ? 'bg-red-500/10' : 'bg-emerald-500/10', icon: AlertTriangle },
          { label: 'Encryption', value: 'AES-256', color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Lock },
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

      {/* Repositories */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground flex items-center gap-2">
            <Code className="w-5 h-5 text-muted-foreground" /> Protected Repositories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {repositories.map((repo, i) => {
            const ic = integrityConfig[repo.integrity];
            const IIcon = ic.icon;
            return (
              <motion.div key={repo.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <FileCode className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{repo.name}</p>
                    <p className="text-xs text-muted-foreground">Verified: {repo.lastVerified}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-purple-400 bg-purple-500/10 border-none text-xs">
                    <Lock className="w-3 h-3 mr-1" /> {repo.encryption.toUpperCase()}
                  </Badge>
                  {repo.accessControl && (
                    <Badge variant="outline" className="text-blue-400 bg-blue-500/10 border-none text-xs">
                      <Key className="w-3 h-3 mr-1" /> RBAC
                    </Badge>
                  )}
                  {repo.restrictedCloning && (
                    <Badge variant="outline" className="text-amber-400 bg-amber-500/10 border-none text-xs">
                      <Eye className="w-3 h-3 mr-1" /> Restricted
                    </Badge>
                  )}
                  <Badge variant="outline" className={`${ic.color} ${ic.bg} border-none text-xs`}>
                    <IIcon className="w-3 h-3 mr-1" /> {repo.integrity}
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Tamper Events */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" /> Tamper Detection Log
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tamperEvents.map((event, i) => {
            const sv = sevColors[event.severity];
            return (
              <motion.div key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className={`flex items-start justify-between p-3 rounded-lg border ${!event.resolved ? 'bg-red-500/5 border-red-500/20' : 'bg-muted/30 border-border/50'}`}>
                <div className="flex items-start gap-3">
                  {event.resolved ? <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-400 mt-0.5 animate-pulse" />}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{event.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                      <Badge variant="outline" className={`${sv.color} ${sv.bg} border-none text-xs`}>{event.severity}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{event.repo} / {event.file}</p>
                    <p className="text-xs text-muted-foreground mt-1">{event.detail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{event.detectedAt}</span>
                  {!event.resolved && <Button size="sm" className="bg-red-600 hover:bg-red-700 text-xs">Investigate</Button>}
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeProtection;
