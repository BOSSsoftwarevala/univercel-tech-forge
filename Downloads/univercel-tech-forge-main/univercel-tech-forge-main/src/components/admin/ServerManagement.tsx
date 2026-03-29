import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server, Database, Cloud, Shield, RefreshCw, Plus, Play,
  Pause, Trash2, Settings, HardDrive, Cpu, Activity,
  Download, Upload, Clock, CheckCircle2, AlertTriangle,
  XCircle, Zap, Globe, Lock, Calendar, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ServerInstance {
  id: string;
  server_name: string;
  server_code: string;
  server_type: string;
  status: string;
  region: string;
  cpu_cores: number;
  ram_gb: number;
  storage_gb: number;
  current_cpu_usage: number;
  current_memory_usage: number;
  current_disk_usage: number;
  health_status: string;
  auto_setup_completed: boolean;
  auto_scaling_enabled: boolean;
  uptime_percentage: number;
  last_health_check: string;
}

interface Backup {
  id: string;
  backup_name: string;
  backup_type: string;
  status: string;
  size_gb: number;
  is_auto_backup: boolean;
  created_at: string;
  completed_at: string;
}

interface BackupSchedule {
  id: string;
  schedule_name: string;
  frequency: string;
  backup_type: string;
  is_active: boolean;
  last_run_at: string;
  next_run_at: string;
  success_count: number;
  failure_count: number;
}

const ServerManagement = () => {
  const [servers, setServers] = useState<ServerInstance[]>([]);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [schedules, setSchedules] = useState<BackupSchedule[]>([]);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showProvisionDialog, setShowProvisionDialog] = useState(false);
  const [provisionConfig, setProvisionConfig] = useState({
    name: '',
    type: 'production',
    region: 'us-east-1',
    cpu: 4,
    ram: 8,
    storage: 100,
    autoScale: true,
  });

  // Mock data for demo
  useEffect(() => {
    const mockServers: ServerInstance[] = [
      {
        id: '1',
        server_name: 'Production API Server',
        server_code: 'SRV-PROD-001',
        server_type: 'production',
        status: 'online',
        region: 'us-east-1',
        cpu_cores: 8,
        ram_gb: 32,
        storage_gb: 500,
        current_cpu_usage: 45,
        current_memory_usage: 62,
        current_disk_usage: 38,
        health_status: 'healthy',
        auto_setup_completed: true,
        auto_scaling_enabled: true,
        uptime_percentage: 99.99,
        last_health_check: new Date().toISOString(),
      },
      {
        id: '2',
        server_name: 'Database Cluster Primary',
        server_code: 'SRV-DB-001',
        server_type: 'database',
        status: 'online',
        region: 'us-east-1',
        cpu_cores: 16,
        ram_gb: 64,
        storage_gb: 2000,
        current_cpu_usage: 28,
        current_memory_usage: 71,
        current_disk_usage: 45,
        health_status: 'healthy',
        auto_setup_completed: true,
        auto_scaling_enabled: false,
        uptime_percentage: 99.97,
        last_health_check: new Date().toISOString(),
      },
      {
        id: '3',
        server_name: 'CDN Edge Node - Mumbai',
        server_code: 'SRV-CDN-IN',
        server_type: 'cdn',
        status: 'online',
        region: 'ap-south-1',
        cpu_cores: 4,
        ram_gb: 16,
        storage_gb: 200,
        current_cpu_usage: 32,
        current_memory_usage: 45,
        current_disk_usage: 28,
        health_status: 'healthy',
        auto_setup_completed: true,
        auto_scaling_enabled: true,
        uptime_percentage: 100,
        last_health_check: new Date().toISOString(),
      },
      {
        id: '4',
        server_name: 'Staging Environment',
        server_code: 'SRV-STG-001',
        server_type: 'staging',
        status: 'online',
        region: 'eu-west-1',
        cpu_cores: 4,
        ram_gb: 8,
        storage_gb: 100,
        current_cpu_usage: 15,
        current_memory_usage: 35,
        current_disk_usage: 22,
        health_status: 'healthy',
        auto_setup_completed: true,
        auto_scaling_enabled: false,
        uptime_percentage: 99.5,
        last_health_check: new Date().toISOString(),
      },
    ];

    const mockBackups: Backup[] = [
      { id: '1', backup_name: 'daily-backup-2024-01-15', backup_type: 'full', status: 'completed', size_gb: 125.5, is_auto_backup: true, created_at: new Date().toISOString(), completed_at: new Date().toISOString() },
      { id: '2', backup_name: 'incremental-2024-01-15-06', backup_type: 'incremental', status: 'completed', size_gb: 12.3, is_auto_backup: true, created_at: new Date().toISOString(), completed_at: new Date().toISOString() },
      { id: '3', backup_name: 'manual-pre-deploy', backup_type: 'snapshot', status: 'completed', size_gb: 45.8, is_auto_backup: false, created_at: new Date().toISOString(), completed_at: new Date().toISOString() },
    ];

    const mockSchedules: BackupSchedule[] = [
      { id: '1', schedule_name: 'Daily Full Backup', frequency: 'daily', backup_type: 'full', is_active: true, last_run_at: new Date().toISOString(), next_run_at: new Date(Date.now() + 24*60*60*1000).toISOString(), success_count: 365, failure_count: 2 },
      { id: '2', schedule_name: 'Hourly Incremental', frequency: 'hourly', backup_type: 'incremental', is_active: true, last_run_at: new Date().toISOString(), next_run_at: new Date(Date.now() + 60*60*1000).toISOString(), success_count: 8640, failure_count: 5 },
      { id: '3', schedule_name: 'Weekly Database Snapshot', frequency: 'weekly', backup_type: 'snapshot', is_active: true, last_run_at: new Date().toISOString(), next_run_at: new Date(Date.now() + 7*24*60*60*1000).toISOString(), success_count: 52, failure_count: 0 },
    ];

    setServers(mockServers);
    setBackups(mockBackups);
    setSchedules(mockSchedules);
  }, []);

  const handleProvisionServer = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('server-management', {
        body: { action: 'provision', config: provisionConfig }
      });

      if (error) throw error;

      toast.success('Server provisioning started');
      setShowProvisionDialog(false);
      
      // Auto-trigger setup
      if (data?.server?.id) {
        setTimeout(async () => {
          await supabase.functions.invoke('server-management', {
            body: { action: 'auto_setup', serverId: data.server.id }
          });
          toast.success('Auto setup completed');
        }, 2000);
      }
    } catch (error) {
      toast.error('Failed to provision server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackup = async (serverId: string) => {
    setIsLoading(true);
    try {
      await supabase.functions.invoke('server-management', {
        body: { action: 'backup', serverId, config: { type: 'full' } }
      });
      toast.success('Backup initiated successfully');
    } catch (error) {
      toast.error('Failed to start backup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHealthCheck = async (serverId: string) => {
    setIsLoading(true);
    try {
      await supabase.functions.invoke('server-management', {
        body: { action: 'health_check', serverId }
      });
      toast.success('Health check completed');
    } catch (error) {
      toast.error('Health check failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': case 'completed': case 'healthy': return 'text-neon-green bg-neon-green/20';
      case 'warning': case 'in_progress': return 'text-amber-400 bg-amber-400/20';
      case 'offline': case 'failed': case 'critical': return 'text-red-400 bg-red-400/20';
      case 'provisioning': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-muted-foreground bg-muted/20';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="w-4 h-4 text-neon-green" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'critical': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground flex items-center gap-2">
            <Server className="w-6 h-6 text-primary" />
            Server Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Auto Setup • Auto Backup • AI Monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info('Refreshing...')}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showProvisionDialog} onOpenChange={setShowProvisionDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary">
                <Plus className="w-4 h-4 mr-2" />
                Provision Server
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Provision New Server</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm text-muted-foreground">Server Name</label>
                  <Input
                    value={provisionConfig.name}
                    onChange={(e) => setProvisionConfig({ ...provisionConfig, name: e.target.value })}
                    placeholder="My Server"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Type</label>
                    <Select value={provisionConfig.type} onValueChange={(v) => setProvisionConfig({ ...provisionConfig, type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="database">Database</SelectItem>
                        <SelectItem value="cdn">CDN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Region</label>
                    <Select value={provisionConfig.region} onValueChange={(v) => setProvisionConfig({ ...provisionConfig, region: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East</SelectItem>
                        <SelectItem value="us-west-2">US West</SelectItem>
                        <SelectItem value="eu-west-1">EU West</SelectItem>
                        <SelectItem value="ap-south-1">Asia (Mumbai)</SelectItem>
                        <SelectItem value="ap-southeast-1">Asia (Singapore)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">CPU Cores</label>
                    <Select value={String(provisionConfig.cpu)} onValueChange={(v) => setProvisionConfig({ ...provisionConfig, cpu: Number(v) })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 Cores</SelectItem>
                        <SelectItem value="4">4 Cores</SelectItem>
                        <SelectItem value="8">8 Cores</SelectItem>
                        <SelectItem value="16">16 Cores</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">RAM (GB)</label>
                    <Select value={String(provisionConfig.ram)} onValueChange={(v) => setProvisionConfig({ ...provisionConfig, ram: Number(v) })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 GB</SelectItem>
                        <SelectItem value="8">8 GB</SelectItem>
                        <SelectItem value="16">16 GB</SelectItem>
                        <SelectItem value="32">32 GB</SelectItem>
                        <SelectItem value="64">64 GB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Storage (GB)</label>
                    <Select value={String(provisionConfig.storage)} onValueChange={(v) => setProvisionConfig({ ...provisionConfig, storage: Number(v) })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 GB</SelectItem>
                        <SelectItem value="250">250 GB</SelectItem>
                        <SelectItem value="500">500 GB</SelectItem>
                        <SelectItem value="1000">1 TB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm">Enable Auto Scaling</span>
                  </div>
                  <Switch
                    checked={provisionConfig.autoScale}
                    onCheckedChange={(v) => setProvisionConfig({ ...provisionConfig, autoScale: v })}
                  />
                </div>
                <Button onClick={handleProvisionServer} disabled={isLoading} className="w-full">
                  {isLoading ? 'Provisioning...' : 'Provision & Auto Setup'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Servers', value: servers.filter(s => s.status === 'online').length, icon: Server, color: 'text-neon-green' },
          { label: 'Total Backups', value: backups.length, icon: Database, color: 'text-primary' },
          { label: 'Auto Schedules', value: schedules.filter(s => s.is_active).length, icon: Calendar, color: 'text-purple-400' },
          { label: 'Avg Uptime', value: '99.9%', icon: TrendingUp, color: 'text-neon-cyan' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-panel border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <Badge variant="outline" className="text-xs">Live</Badge>
                </div>
                <p className={`text-2xl font-mono font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="servers" className="space-y-4">
        <TabsList className="bg-secondary/30">
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="schedules">Auto Schedules</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* Servers Tab */}
        <TabsContent value="servers" className="space-y-4">
          <div className="grid gap-4">
            {servers.map((server, idx) => (
              <motion.div
                key={server.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="glass-panel border-border/30 hover:border-primary/30 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary/20">
                          <Server className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{server.server_name}</h3>
                            <Badge className={getStatusColor(server.status)}>{server.status}</Badge>
                            {server.auto_setup_completed && (
                              <Badge variant="outline" className="text-xs">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Auto Setup
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{server.server_code} • {server.region}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Cpu className="w-3 h-3" /> {server.cpu_cores} cores
                            </span>
                            <span className="flex items-center gap-1">
                              <HardDrive className="w-3 h-3" /> {server.ram_gb} GB RAM
                            </span>
                            <span className="flex items-center gap-1">
                              <Database className="w-3 h-3" /> {server.storage_gb} GB
                            </span>
                            <span className="flex items-center gap-1">
                              {getHealthIcon(server.health_status)} {server.health_status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleHealthCheck(server.id)}>
                          <Activity className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleBackup(server.id)}>
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Resource Usage */}
                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/30">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">CPU</span>
                          <span className="text-foreground">{server.current_cpu_usage}%</span>
                        </div>
                        <Progress value={server.current_cpu_usage} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Memory</span>
                          <span className="text-foreground">{server.current_memory_usage}%</span>
                        </div>
                        <Progress value={server.current_memory_usage} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Disk</span>
                          <span className="text-foreground">{server.current_disk_usage}%</span>
                        </div>
                        <Progress value={server.current_disk_usage} className="h-2" />
                      </div>
                    </div>

                    {server.auto_scaling_enabled && (
                      <div className="mt-3 p-2 bg-primary/10 rounded-lg flex items-center gap-2 text-xs">
                        <Zap className="w-3 h-3 text-primary" />
                        <span className="text-primary">Auto Scaling Enabled</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Backups Tab */}
        <TabsContent value="backups" className="space-y-4">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Recent Backups</CardTitle>
                <Button size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Manual Backup
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {backups.map((backup, idx) => (
                <motion.div
                  key={backup.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${backup.is_auto_backup ? 'bg-purple-500/20' : 'bg-primary/20'}`}>
                      {backup.is_auto_backup ? <Clock className="w-4 h-4 text-purple-400" /> : <Download className="w-4 h-4 text-primary" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{backup.backup_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {backup.backup_type} • {backup.size_gb} GB • {new Date(backup.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(backup.status)}>{backup.status}</Badge>
                    <Button variant="ghost" size="sm">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-4">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Auto Backup Schedules</CardTitle>
                  <CardDescription>Automated backup configurations</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Schedule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {schedules.map((schedule, idx) => (
                <motion.div
                  key={schedule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Calendar className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{schedule.schedule_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {schedule.frequency} • {schedule.backup_type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-xs">
                      <p className="text-muted-foreground">Next Run</p>
                      <p className="text-foreground font-mono">{new Date(schedule.next_run_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="text-neon-green">{schedule.success_count} success</p>
                      <p className="text-red-400">{schedule.failure_count} failed</p>
                    </div>
                    <Switch checked={schedule.is_active} />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Auto Setup Info */}
          <Card className="glass-panel border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Auto Setup Feature</h4>
                  <p className="text-sm text-muted-foreground">
                    When provisioning a new server, auto setup automatically configures:
                    OS initialization, dependencies, firewall, SSL, monitoring agent, backup agent, and security hardening.
                    A daily backup schedule is created by default.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring">
          <Card className="glass-panel border-border/30">
            <CardHeader>
              <CardTitle className="text-foreground">Real-time Monitoring</CardTitle>
              <CardDescription>AI-powered health monitoring and alerts</CardDescription>
            </CardHeader>
            <CardContent className="py-12 text-center">
              <Activity className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Advanced monitoring dashboard coming soon</p>
              <p className="text-xs text-muted-foreground mt-2">Real-time metrics, AI anomaly detection, predictive alerts</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServerManagement;