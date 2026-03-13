/**
 * DEPLOY SECURITY
 * Pre-deployment integrity checks: code validation, dependency scan, security scan
 * Auto backup system for code, database, and server configs
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket, Shield, CheckCircle, AlertTriangle, XCircle, Package,
  Code, Database, Server, Clock, RefreshCw, Play, FileArchive, Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface DeployCheck {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'warning' | 'fail' | 'pending';
  icon: React.ElementType;
}

interface BackupEntry {
  id: string;
  type: 'code' | 'database' | 'config';
  name: string;
  size: string;
  createdAt: string;
  status: 'completed' | 'in_progress' | 'failed';
  retention: string;
}

const deployChecks: DeployCheck[] = [
  { id: '1', name: 'Code Validation', description: 'TypeScript compilation, lint checks, formatting', status: 'pass', icon: Code },
  { id: '2', name: 'Dependency Scan', description: 'Check for vulnerable or outdated packages', status: 'warning', icon: Package },
  { id: '3', name: 'Security Scan', description: 'SAST analysis, secret detection, injection checks', status: 'pass', icon: Shield },
  { id: '4', name: 'Build Integrity', description: 'Verify build output hash matches expected', status: 'pass', icon: Lock },
  { id: '5', name: 'Test Suite', description: 'Unit tests, integration tests, E2E tests', status: 'pass', icon: CheckCircle },
  { id: '6', name: 'Environment Check', description: 'Verify environment variables and secrets', status: 'pass', icon: Server },
];

const backups: BackupEntry[] = [
  { id: '1', type: 'code', name: 'Daily Code Backup', size: '245 MB', createdAt: '2026-03-08 03:00', status: 'completed', retention: '30 days' },
  { id: '2', type: 'database', name: 'Database Backup', size: '1.2 GB', createdAt: '2026-03-08 02:00', status: 'completed', retention: '30 days' },
  { id: '3', type: 'config', name: 'Server Config Backup', size: '12 MB', createdAt: '2026-03-08 02:30', status: 'completed', retention: '90 days' },
  { id: '4', type: 'code', name: 'Pre-Deploy Snapshot', size: '248 MB', createdAt: '2026-03-08 14:00', status: 'completed', retention: '7 days' },
  { id: '5', type: 'database', name: 'Weekly Full Backup', size: '3.8 GB', createdAt: '2026-03-07 01:00', status: 'completed', retention: '90 days' },
];

const checkStatusConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  pass: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle },
  warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: AlertTriangle },
  fail: { color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle },
  pending: { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: RefreshCw },
};

const backupTypeConfig: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  code: { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Code },
  database: { color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Database },
  config: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Server },
};

export const DeploySecurity: React.FC = () => {
  const [running, setRunning] = useState(false);

  const handleRunChecks = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      toast.success('All pre-deployment checks completed');
    }, 3000);
  };

  const handleBackupNow = () => {
    toast.success('Manual backup initiated for all systems');
  };

  const passedChecks = deployChecks.filter(c => c.status === 'pass').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Deploy Security & Auto Backup</h2>
          <p className="text-sm text-muted-foreground">Pre-deployment integrity checks & automated backup system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleBackupNow}>
            <FileArchive className="w-4 h-4 mr-2" /> Backup Now
          </Button>
          <Button size="sm" onClick={handleRunChecks} disabled={running} className="bg-blue-600 hover:bg-blue-700">
            {running ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Running...</> : <><Play className="w-4 h-4 mr-2" /> Run Checks</>}
          </Button>
        </div>
      </div>

      {/* Deploy Check Score */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Rocket className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-foreground">Deployment Readiness</span>
            </div>
            <span className="text-sm font-bold text-emerald-400">{passedChecks}/{deployChecks.length} Passed</span>
          </div>
          <Progress value={(passedChecks / deployChecks.length) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Pre-Deploy Checks */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-muted-foreground" /> Pre-Deployment Checks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {deployChecks.map((check, i) => {
            const sc = checkStatusConfig[check.status];
            const SIcon = sc.icon;
            const CIcon = check.icon;
            return (
              <motion.div key={check.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <CIcon className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{check.name}</p>
                    <p className="text-xs text-muted-foreground">{check.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`${sc.color} ${sc.bg} border-none text-xs`}>
                  <SIcon className="w-3 h-3 mr-1" /> {check.status}
                </Badge>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Auto Backup System */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground flex items-center gap-2">
            <FileArchive className="w-5 h-5 text-muted-foreground" /> Auto Backup History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {backups.map((backup, i) => {
            const bt = backupTypeConfig[backup.type];
            const BIcon = bt.icon;
            return (
              <motion.div key={backup.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${bt.bg} flex items-center justify-center`}>
                    <BIcon className={`w-4 h-4 ${bt.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{backup.name}</p>
                    <p className="text-xs text-muted-foreground">{backup.createdAt} • {backup.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Retain: {backup.retention}</span>
                  <Badge variant="outline" className="text-emerald-400 bg-emerald-500/10 border-none text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" /> {backup.status}
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeploySecurity;
