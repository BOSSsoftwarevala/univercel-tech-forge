import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Activity,
  Cloud,
  Shield,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Globe,
  Zap
} from "lucide-react";

interface ServerInstance {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'maintenance' | 'warning';
  region: string;
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  lastCheck: string;
}

const ServerManagementHub = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock server data
  const [servers] = useState<ServerInstance[]>([
    {
      id: '1',
      name: 'Production API',
      type: 'Application',
      status: 'online',
      region: 'Asia Pacific (Mumbai)',
      cpu: 45,
      memory: 62,
      disk: 38,
      uptime: '99.99%',
      lastCheck: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Database Primary',
      type: 'Database',
      status: 'online',
      region: 'Asia Pacific (Mumbai)',
      cpu: 32,
      memory: 78,
      disk: 55,
      uptime: '99.97%',
      lastCheck: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Edge CDN',
      type: 'CDN',
      status: 'online',
      region: 'Global',
      cpu: 15,
      memory: 28,
      disk: 42,
      uptime: '100%',
      lastCheck: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Backup Server',
      type: 'Storage',
      status: 'maintenance',
      region: 'Asia Pacific (Singapore)',
      cpu: 5,
      memory: 12,
      disk: 85,
      uptime: '99.95%',
      lastCheck: new Date().toISOString()
    },
    {
      id: '5',
      name: 'ML Processing',
      type: 'Compute',
      status: 'warning',
      region: 'US East',
      cpu: 92,
      memory: 88,
      disk: 45,
      uptime: '99.90%',
      lastCheck: new Date().toISOString()
    }
  ]);

  // Fetch server instances from DB
  const { data: dbServers } = useQuery({
    queryKey: ['server-instances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('server_instances')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch backup schedules
  const { data: backups } = useQuery({
    queryKey: ['backup-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('backup_schedules')
        .select('*')
        .order('next_run_at', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Online</Badge>;
      case 'offline':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Offline</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Maintenance</Badge>;
      case 'warning':
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Warning</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return 'text-red-400';
    if (usage >= 70) return 'text-orange-400';
    if (usage >= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  const onlineServers = servers.filter(s => s.status === 'online').length;
  const totalCpu = Math.round(servers.reduce((sum, s) => sum + s.cpu, 0) / servers.length);
  const totalMemory = Math.round(servers.reduce((sum, s) => sum + s.memory, 0) / servers.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Server className="w-6 h-6 text-primary" />
            Server Management Hub
          </h2>
          <p className="text-muted-foreground">Monitor and manage all server infrastructure</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Play className="w-4 h-4 mr-2" />
            Deploy
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Servers</p>
                  <p className="text-2xl font-bold">{servers.length}</p>
                </div>
                <Server className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Online</p>
                  <p className="text-2xl font-bold text-green-400">{onlineServers}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg CPU</p>
                  <p className={`text-2xl font-bold ${getUsageColor(totalCpu)}`}>{totalCpu}%</p>
                </div>
                <Cpu className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Memory</p>
                  <p className={`text-2xl font-bold ${getUsageColor(totalMemory)}`}>{totalMemory}%</p>
                </div>
                <Activity className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card className="bg-card/50 border-cyan-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <p className="text-2xl font-bold text-cyan-400">99.9%</p>
                </div>
                <Zap className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/30">
          <TabsTrigger value="overview" className="gap-2">
            <Server className="w-4 h-4" />
            Servers
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-2">
            <Activity className="w-4 h-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="backups" className="gap-2">
            <Database className="w-4 h-4" />
            Backups
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card className="bg-card/50 border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Server</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>CPU</TableHead>
                    <TableHead>Memory</TableHead>
                    <TableHead>Disk</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servers.map((server) => (
                    <TableRow key={server.id}>
                      <TableCell className="font-medium">{server.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{server.type}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(server.status)}</TableCell>
                      <TableCell className="text-xs">{server.region}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={server.cpu} className="w-16 h-2" />
                          <span className={`text-xs ${getUsageColor(server.cpu)}`}>{server.cpu}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={server.memory} className="w-16 h-2" />
                          <span className={`text-xs ${getUsageColor(server.memory)}`}>{server.memory}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={server.disk} className="w-16 h-2" />
                          <span className={`text-xs ${getUsageColor(server.disk)}`}>{server.disk}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-green-400">{server.uptime}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7">
                            <RotateCcw className="w-3 h-3" />
                          </Button>
                          {server.status === 'online' ? (
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-yellow-400">
                              <Pause className="w-3 h-3" />
                            </Button>
                          ) : (
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-green-400">
                              <Play className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servers.map((server) => (
              <Card key={server.id} className="bg-card/50 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-primary" />
                      {server.name}
                    </span>
                    {getStatusBadge(server.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Cpu className="w-4 h-4" /> CPU
                      </span>
                      <span className={getUsageColor(server.cpu)}>{server.cpu}%</span>
                    </div>
                    <Progress value={server.cpu} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Memory
                      </span>
                      <span className={getUsageColor(server.memory)}>{server.memory}%</span>
                    </div>
                    <Progress value={server.memory} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4" /> Disk
                      </span>
                      <span className={getUsageColor(server.disk)}>{server.disk}%</span>
                    </div>
                    <Progress value={server.disk} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="backups" className="mt-4">
          <Card className="bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Backup Schedules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backups?.length === 0 || !backups ? (
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No backup schedules configured</p>
                    <Button className="mt-4" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Schedule
                    </Button>
                  </div>
                ) : (
                  backups.map((backup: any) => (
                    <div key={backup.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div>
                        <p className="font-medium">{backup.schedule_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {backup.frequency} • Next: {backup.next_run_at ? new Date(backup.next_run_at).toLocaleString() : 'Not scheduled'}
                        </p>
                      </div>
                      <Badge variant={backup.is_active ? 'default' : 'secondary'}>
                        {backup.is_active ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Firewall', status: 'active' },
                  { label: 'SSL/TLS', status: 'active' },
                  { label: 'DDoS Protection', status: 'active' },
                  { label: 'Intrusion Detection', status: 'active' },
                  { label: 'Data Encryption', status: 'active' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  Network Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Latency (Mumbai)', value: '12ms', status: 'good' },
                  { label: 'Latency (Singapore)', value: '45ms', status: 'good' },
                  { label: 'Latency (US East)', value: '180ms', status: 'ok' },
                  { label: 'Bandwidth Used', value: '2.4 TB', status: 'good' },
                  { label: 'Active Connections', value: '12,458', status: 'good' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span>{item.label}</span>
                    <span className={item.status === 'good' ? 'text-green-400' : 'text-yellow-400'}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Add missing Plus import
import { Plus } from "lucide-react";

export default ServerManagementHub;
