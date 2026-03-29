/**
 * SERVER BACKUPS
 * Backup ON/OFF, last backup time, restore button
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, Clock, Download, RotateCcw, CheckCircle,
  AlertTriangle, Calendar, HardDrive, Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface BackupData {
  server: string;
  enabled: boolean;
  lastBackup: string;
  size: string;
  status: 'success' | 'pending' | 'failed';
  nextScheduled: string;
}

const backupData: BackupData[] = [
  { server: 'Production Server 1', enabled: true, lastBackup: '2 hours ago', size: '12.4 GB', status: 'success', nextScheduled: 'In 10 hours' },
  { server: 'Production Server 2', enabled: true, lastBackup: '3 hours ago', size: '8.2 GB', status: 'success', nextScheduled: 'In 9 hours' },
  { server: 'EU Gateway', enabled: true, lastBackup: '1 hour ago', size: '15.1 GB', status: 'success', nextScheduled: 'In 11 hours' },
  { server: 'Asia Pacific Node', enabled: true, lastBackup: '4 hours ago', size: '6.8 GB', status: 'success', nextScheduled: 'In 8 hours' },
  { server: 'Backup Server', enabled: true, lastBackup: '30 min ago', size: '45.2 GB', status: 'success', nextScheduled: 'In 11.5 hours' },
];

export const ServerBackups: React.FC = () => {
  const [backups, setBackups] = useState(backupData);

  const handleToggleBackup = (serverName: string) => {
    setBackups(prev => prev.map(b => 
      b.server === serverName ? { ...b, enabled: !b.enabled } : b
    ));
    toast.success('Backup settings updated');
  };

  const handleRestore = (serverName: string) => {
    toast.info(`Restore requested for ${serverName}. Awaiting approval...`);
  };

  const handleBackupNow = (serverName: string) => {
    toast.success(`Backup started for ${serverName}`);
  };

  const totalBackups = backups.filter(b => b.enabled).length;
  const successfulBackups = backups.filter(b => b.status === 'success').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Backups</h2>
          <p className="text-sm text-muted-foreground">Automated backup management</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          {successfulBackups}/{totalBackups} Success
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Backups', value: totalBackups.toString(), icon: Database, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Last Backup', value: '30 min ago', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Total Size', value: '87.7 GB', icon: HardDrive, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.bg)}>
                      <Icon className={cn("w-5 h-5", stat.color)} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className={cn("font-semibold text-foreground")}>{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Per-Server Backups */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Server Backup Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backups.map((backup, index) => (
              <motion.div
                key={backup.server}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className={cn(
                      "w-5 h-5",
                      backup.enabled ? 'text-emerald-500' : 'text-muted-foreground'
                    )} />
                    <div>
                      <p className="font-medium text-foreground">{backup.server}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Last: {backup.lastBackup}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{backup.size}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Next: {backup.nextScheduled}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Status Badge */}
                    <Badge className={cn(
                      "text-xs",
                      backup.status === 'success' 
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : backup.status === 'pending'
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    )}>
                      {backup.status === 'success' ? 'Success' : backup.status === 'pending' ? 'Pending' : 'Failed'}
                    </Badge>
                    
                    {/* Toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Auto</span>
                      <Switch 
                        checked={backup.enabled} 
                        onCheckedChange={() => handleToggleBackup(backup.server)}
                      />
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleBackupNow(backup.server)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Backup Now
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRestore(backup.server)}
                      >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Restore
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Notice */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Restore Requires Approval</p>
              <p className="text-sm text-muted-foreground">
                All restore operations require Boss approval for security.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerBackups;
