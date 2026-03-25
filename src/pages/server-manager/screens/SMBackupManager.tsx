import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, Clock, CheckCircle, XCircle, Play, Pause, RefreshCw,
  Calendar, HardDrive, Download, Upload, Trash2, Settings, Plus,
  AlertTriangle, Shield, History, Timer, Server
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const backupJobs = [
  { 
    id: 'bk-001', 
    name: 'Database Full Backup', 
    server: 'US-East-Primary',
    type: 'full',
    schedule: 'Daily at 2:00 AM',
    lastRun: '2024-12-25 02:00',
    nextRun: '2024-12-26 02:00',
    status: 'success',
    size: '245 GB',
    retention: '30 days',
    enabled: true,
  },
  { 
    id: 'bk-002', 
    name: 'Incremental Backup', 
    server: 'US-East-Primary',
    type: 'incremental',
    schedule: 'Every 6 hours',
    lastRun: '2024-12-25 14:00',
    nextRun: '2024-12-25 20:00',
    status: 'success',
    size: '12 GB',
    retention: '7 days',
    enabled: true,
  },
  { 
    id: 'bk-003', 
    name: 'Config Snapshot', 
    server: 'EU-Frankfurt-01',
    type: 'snapshot',
    schedule: 'Daily at 1:00 AM',
    lastRun: '2024-12-25 01:00',
    nextRun: '2024-12-26 01:00',
    status: 'failed',
    size: '-',
    retention: '14 days',
    enabled: true,
  },
  { 
    id: 'bk-004', 
    name: 'Media Files', 
    server: 'AP-Tokyo-Main',
    type: 'full',
    schedule: 'Weekly Sunday 3:00 AM',
    lastRun: '2024-12-22 03:00',
    nextRun: '2024-12-29 03:00',
    status: 'success',
    size: '890 GB',
    retention: '60 days',
    enabled: true,
  },
];

const restorePoints = [
  { id: 'rp-001', name: 'Full Backup', date: '2024-12-25 02:00', size: '245 GB', server: 'US-East-Primary', verified: true },
  { id: 'rp-002', name: 'Full Backup', date: '2024-12-24 02:00', size: '243 GB', server: 'US-East-Primary', verified: true },
  { id: 'rp-003', name: 'Full Backup', date: '2024-12-23 02:00', size: '241 GB', server: 'US-East-Primary', verified: true },
  { id: 'rp-004', name: 'Incremental', date: '2024-12-25 14:00', size: '12 GB', server: 'US-East-Primary', verified: false },
  { id: 'rp-005', name: 'Config Snapshot', date: '2024-12-24 01:00', size: '2.5 GB', server: 'EU-Frankfurt-01', verified: true },
];

const SMBackupManager = () => {
  const [jobs, setJobs] = useState(backupJobs);
  const [runningBackup, setRunningBackup] = useState<string | null>(null);
  const [backupProgress, setBackupProgress] = useState(0);

  const handleRunBackup = async (jobId: string) => {
    setRunningBackup(jobId);
    setBackupProgress(0);
    toast.info('Starting backup...');

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 500));
      setBackupProgress(i);
    }

    setRunningBackup(null);
    toast.success('Backup completed successfully!');
  };

  const toggleJob = (jobId: string) => {
    setJobs(jobs.map(j => j.id === jobId ? { ...j, enabled: !j.enabled } : j));
    toast.success('Backup schedule updated');
  };

  const totalStorage = '1.4 TB';
  const usedStorage = '892 GB';
  const storagePercent = 64;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
            <Database className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Backup Manager</h2>
            <p className="text-slate-400">Automated backup schedules & restore points</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-600">
            <History className="w-4 h-4 mr-2" />
            View History
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Backup Job
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Database className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Jobs</p>
                <p className="text-2xl font-bold text-white">{jobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Successful</p>
                <p className="text-2xl font-bold text-green-400">{jobs.filter(j => j.status === 'success').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Failed</p>
                <p className="text-2xl font-bold text-red-400">{jobs.filter(j => j.status === 'failed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <HardDrive className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Storage Used</p>
                <p className="text-2xl font-bold text-purple-400">{usedStorage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage Bar */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">Backup Storage</span>
            <span className="text-white font-mono">{usedStorage} / {totalStorage}</span>
          </div>
          <Progress value={storagePercent} className="h-3" />
          <p className="text-xs text-slate-500 mt-2">Using {storagePercent}% of allocated backup storage</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup Jobs */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Scheduled Backup Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {jobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 rounded-xl border ${
                      job.status === 'failed' ? 'bg-red-500/5 border-red-500/30' : 'bg-slate-800/50 border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white">{job.name}</h4>
                          <Badge className={`text-xs ${
                            job.type === 'full' ? 'bg-blue-500/20 text-blue-400' :
                            job.type === 'incremental' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-cyan-500/20 text-cyan-400'
                          }`}>
                            {job.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Server className="w-3 h-3" /> {job.server}
                        </p>
                      </div>
                      <Switch checked={job.enabled} onCheckedChange={() => toggleJob(job.id)} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <span className="text-slate-500">Schedule:</span>
                        <p className="text-slate-300">{job.schedule}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Retention:</span>
                        <p className="text-slate-300">{job.retention}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Last Run:</span>
                        <p className="text-slate-300">{job.lastRun}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Next Run:</span>
                        <p className="text-slate-300">{job.nextRun}</p>
                      </div>
                    </div>

                    {runningBackup === job.id ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-blue-400">Backup in progress...</span>
                          <span className="text-white">{backupProgress}%</span>
                        </div>
                        <Progress value={backupProgress} className="h-2" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <Badge className={`${
                          job.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {job.status === 'success' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                          {job.status} • {job.size}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-slate-600"
                          onClick={() => handleRunBackup(job.id)}
                          disabled={runningBackup !== null}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Run Now
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Restore Points */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <History className="w-5 h-5 text-green-400" />
              Available Restore Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {restorePoints.map((point) => (
                  <div key={point.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-green-500/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${point.verified ? 'bg-green-500/20' : 'bg-amber-500/20'}`}>
                          {point.verified ? (
                            <Shield className="w-4 h-4 text-green-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{point.name}</span>
                            {point.verified && (
                              <Badge className="bg-green-500/20 text-green-400 text-xs">Verified</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{point.date}</span>
                            <span>•</span>
                            <span>{point.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-green-400 hover:text-green-300">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-2 text-amber-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Restoring will overwrite current data. Proceed with caution.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SMBackupManager;
