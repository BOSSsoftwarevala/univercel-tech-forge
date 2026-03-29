import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { HardDrive, CheckCircle, Clock, AlertTriangle, RotateCcw, Shield, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { serverManagerAPI } from '@/hooks/useServerManagerAPI';

interface Backup {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential' | 'snapshot';
  environment: 'production' | 'staging';
  status: 'completed' | 'in_progress' | 'failed' | 'scheduled' | 'pending';
  size: string;
  createdAt: string;
  expiresAt: string | null;
  integrityStatus: 'verified' | 'pending' | 'failed';
  encryptionStatus: 'encrypted' | 'not_encrypted';
}

interface BackupSchedule {
  id: string;
  name: string;
  frequency: string;
  nextRun: string | null;
  lastRun: string | null;
  isActive: boolean;
}

interface BackupOverviewResponse {
  backups: Backup[];
  schedules: BackupSchedule[];
}

export function SMBackups() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [schedules, setSchedules] = useState<BackupSchedule[]>([]);
  const [restoringBackup, setRestoringBackup] = useState<string | null>(null);
  const [verifyingBackup, setVerifyingBackup] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadBackups = async () => {
      try {
        const data = await serverManagerAPI.getBackupOverview() as BackupOverviewResponse;
        if (!cancelled) {
          setBackups(data.backups || []);
          setSchedules(data.schedules || []);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load backup overview');
      }
    };

    void loadBackups();

    return () => {
      cancelled = true;
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'scheduled':
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleRestore = async (backupId: string, environment: string) => {
    try {
      setRestoringBackup(backupId);
      const response = await serverManagerAPI.restoreBackup(backupId) as { message?: string };
      toast.success(response.message || (environment === 'production' ? 'Restore request submitted' : 'Restore workflow executed'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to run restore');
    } finally {
      setRestoringBackup(null);
    }
  };

  const handleVerifyIntegrity = async (backupId: string) => {
    try {
      setVerifyingBackup(backupId);
      await serverManagerAPI.verifyBackup(backupId);
      setBackups((current) => current.map((backup) => (backup.id === backupId ? { ...backup, integrityStatus: 'verified' } : backup)));
      toast.success('Integrity verification completed');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to verify backup integrity');
    } finally {
      setVerifyingBackup(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Backup Schedules
          </h2>
          <Badge variant="outline" className="font-mono text-xs">
            Automated
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {schedules.map((schedule) => (
            <Card key={schedule.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{schedule.name}</span>
                  <Badge className={schedule.isActive ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}>
                    {schedule.isActive ? 'Active' : 'Paused'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Frequency: {schedule.frequency}</p>
                  <p>Next run: {schedule.nextRun || 'Not scheduled'}</p>
                  <p>Last run: {schedule.lastRun || 'Never'}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            Backups
          </h2>
        </div>

        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm text-yellow-400">
              <AlertTriangle className="h-4 w-4" />
              <span>Production restore creates an approval-gated restore action. Non-production restore executes immediately.</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {backups.map((backup) => (
            <Card key={backup.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {backup.type.toUpperCase()}
                    </Badge>
                    <span className="font-medium">{backup.name}</span>
                    <Badge className={backup.environment === 'production' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}>
                      {backup.environment}
                    </Badge>
                  </div>
                  <Badge className={getStatusColor(backup.status)}>
                    {backup.status === 'in_progress' && <Clock className="h-3 w-3 mr-1 animate-pulse" />}
                    {backup.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {backup.status.toUpperCase().replace('_', ' ')}
                  </Badge>
                </div>

                {backup.status === 'in_progress' && (
                  <div className="mb-3">
                    <Progress value={65} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <span className="ml-2 font-mono">{backup.size}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <span className="ml-2">{backup.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="ml-2">{backup.expiresAt || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-green-400" />
                    <span className="text-green-400 text-xs">{backup.encryptionStatus}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {backup.integrityStatus === 'verified' ? <CheckCircle className="h-3 w-3 text-green-400" /> : <AlertTriangle className="h-3 w-3 text-yellow-400" />}
                    <span className={backup.integrityStatus === 'verified' ? 'text-green-400 text-xs' : 'text-yellow-400 text-xs'}>
                      {backup.integrityStatus}
                    </span>
                  </div>
                </div>

                {backup.status === 'completed' && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                    <Button size="sm" variant="outline" onClick={() => handleRestore(backup.id, backup.environment)} disabled={restoringBackup === backup.id} className="text-xs">
                      <RotateCcw className={`h-3 w-3 mr-1 ${restoringBackup === backup.id ? 'animate-spin' : ''}`} />
                      {backup.environment === 'production' ? 'Request Restore' : 'Restore'}
                    </Button>
                    {backup.integrityStatus !== 'verified' && (
                      <Button size="sm" variant="outline" onClick={() => handleVerifyIntegrity(backup.id)} disabled={verifyingBackup === backup.id} className="text-xs">
                        <Shield className={`h-3 w-3 mr-1 ${verifyingBackup === backup.id ? 'animate-spin' : ''}`} />
                        Verify Integrity
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {!backups.length && (
            <Card className="bg-card border-border">
              <CardContent className="py-8 text-sm text-center text-muted-foreground">
                No backup records found.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}