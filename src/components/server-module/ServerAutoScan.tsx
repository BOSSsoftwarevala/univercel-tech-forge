/**
 * SERVER AUTO SCAN
 * Full infrastructure scan: status, services, disk, CPU, RAM, ports, security
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Server, CheckCircle, AlertTriangle, XCircle,
  HardDrive, Cpu, MemoryStick, Network, Shield, Activity,
  Play, RefreshCw, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface ScanResult {
  category: string;
  icon: React.ElementType;
  status: 'pass' | 'warning' | 'fail';
  detail: string;
  value?: string;
}

interface ServerScan {
  id: string;
  server: string;
  ip: string;
  lastScan: string;
  scanDuration: string;
  results: ScanResult[];
  overallScore: number;
}

const serverScans: ServerScan[] = [
  {
    id: '1', server: 'Production VPS', ip: '185.199.108.153', lastScan: '2 min ago', scanDuration: '12s',
    overallScore: 94,
    results: [
      { category: 'Server Status', icon: Server, status: 'pass', detail: 'Online and responsive', value: 'Healthy' },
      { category: 'Running Services', icon: Activity, status: 'pass', detail: '12 services running', value: '12/12' },
      { category: 'CPU Usage', icon: Cpu, status: 'pass', detail: 'Normal load', value: '38%' },
      { category: 'Memory Usage', icon: MemoryStick, status: 'warning', detail: 'Approaching threshold', value: '72%' },
      { category: 'Disk Usage', icon: HardDrive, status: 'pass', detail: 'Sufficient space', value: '45%' },
      { category: 'Open Ports', icon: Network, status: 'pass', detail: '22, 80, 443, 5432', value: '4 ports' },
      { category: 'Security Risks', icon: Shield, status: 'pass', detail: 'No vulnerabilities', value: '0 issues' },
    ]
  },
  {
    id: '2', server: 'AI Services Node', ip: '185.199.108.155', lastScan: '5 min ago', scanDuration: '18s',
    overallScore: 72,
    results: [
      { category: 'Server Status', icon: Server, status: 'pass', detail: 'Online', value: 'Healthy' },
      { category: 'Running Services', icon: Activity, status: 'warning', detail: '1 service down', value: '7/8' },
      { category: 'CPU Usage', icon: Cpu, status: 'warning', detail: 'High load', value: '82%' },
      { category: 'Memory Usage', icon: MemoryStick, status: 'fail', detail: 'Critical usage', value: '91%' },
      { category: 'Disk Usage', icon: HardDrive, status: 'pass', detail: 'OK', value: '55%' },
      { category: 'Open Ports', icon: Network, status: 'warning', detail: 'Unexpected port 8080', value: '5 ports' },
      { category: 'Security Risks', icon: Shield, status: 'warning', detail: 'Outdated packages', value: '3 issues' },
    ]
  },
];

const statusStyle: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  pass: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle },
  warning: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: AlertTriangle },
  fail: { color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle },
};

export const ServerAutoScan: React.FC = () => {
  const [scanning, setScanning] = useState(false);

  const handleScanAll = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      toast.success('Full infrastructure scan completed');
    }, 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Auto Server Scan</h2>
          <p className="text-sm text-muted-foreground">Full infrastructure health & security scan</p>
        </div>
        <Button onClick={handleScanAll} disabled={scanning} className="bg-blue-600 hover:bg-blue-700">
          {scanning ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Scanning...</> : <><Search className="w-4 h-4 mr-2" /> Scan All Servers</>}
        </Button>
      </div>

      {/* Server Scans */}
      {serverScans.map((scan, si) => (
        <motion.div key={scan.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }}>
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${scan.overallScore >= 90 ? 'bg-emerald-500/10' : scan.overallScore >= 70 ? 'bg-amber-500/10' : 'bg-red-500/10'} flex items-center justify-center`}>
                    <Server className={`w-5 h-5 ${scan.overallScore >= 90 ? 'text-emerald-400' : scan.overallScore >= 70 ? 'text-amber-400' : 'text-red-400'}`} />
                  </div>
                  <div>
                    <CardTitle className="text-base text-foreground">{scan.server}</CardTitle>
                    <p className="text-xs text-muted-foreground">{scan.ip} • Scanned {scan.lastScan} ({scan.scanDuration})</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${scan.overallScore >= 90 ? 'text-emerald-400' : scan.overallScore >= 70 ? 'text-amber-400' : 'text-red-400'}`}>{scan.overallScore}</p>
                    <p className="text-xs text-muted-foreground">Health Score</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {scan.results.map((result, ri) => {
                  const ss = statusStyle[result.status];
                  const SIcon = ss.icon;
                  const RIcon = result.icon;
                  return (
                    <motion.div key={result.category} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: si * 0.1 + ri * 0.03 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-3">
                        <RIcon className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{result.category}</p>
                          <p className="text-xs text-muted-foreground">{result.detail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-semibold ${ss.color}`}>{result.value}</span>
                        <SIcon className={`w-4 h-4 ${ss.color}`} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ServerAutoScan;
