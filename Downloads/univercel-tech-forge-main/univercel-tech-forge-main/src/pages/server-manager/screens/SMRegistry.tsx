import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, List, Globe, Activity, Cpu, HardDrive, Network, 
  Clock, CheckCircle2, AlertTriangle, XCircle, Eye, 
  RefreshCw, Power, PowerOff, Scale, Trash2, MoreVertical, Search, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const servers = [
  { 
    id: 'srv-001', name: 'prod-api-01', region: 'IN', regionName: 'Mumbai', 
    cluster: 'api-cluster', status: 'online', cpu: 42, ram: 68, disk: 55, 
    network: 125, lastHeartbeat: '2s ago', health: 'healthy'
  },
  { 
    id: 'srv-002', name: 'prod-api-02', region: 'IN', regionName: 'Mumbai', 
    cluster: 'api-cluster', status: 'online', cpu: 38, ram: 72, disk: 48, 
    network: 98, lastHeartbeat: '1s ago', health: 'healthy'
  },
  { 
    id: 'srv-003', name: 'prod-db-01', region: 'SG', regionName: 'Singapore', 
    cluster: 'db-cluster', status: 'warning', cpu: 85, ram: 91, disk: 72, 
    network: 45, lastHeartbeat: '5s ago', health: 'warning'
  },
  { 
    id: 'srv-004', name: 'prod-cache-01', region: 'US', regionName: 'Virginia', 
    cluster: 'cache-cluster', status: 'online', cpu: 22, ram: 45, disk: 30, 
    network: 210, lastHeartbeat: '1s ago', health: 'healthy'
  },
  { 
    id: 'srv-005', name: 'backup-01', region: 'EU', regionName: 'Frankfurt', 
    cluster: 'backup-cluster', status: 'offline', cpu: 0, ram: 0, disk: 88, 
    network: 0, lastHeartbeat: '2h ago', health: 'critical'
  },
];

const SMRegistry = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'offline': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const getHealthBadge = (health: string) => {
    const styles: Record<string, string> = {
      healthy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return styles[health] || styles.healthy;
  };

  const getUsageColor = (value: number) => {
    if (value >= 90) return 'text-red-400';
    if (value >= 70) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const handleAction = (action: string, serverName: string) => {
    toast.success(`${action} initiated for ${serverName}`);
  };

  const filteredServers = servers.filter(server =>
    server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.cluster.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Server Registry</h1>
          <p className="text-slate-400">Manage all registered servers across clusters</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search servers..."
              className="pl-9 bg-slate-800/50 border-slate-700 text-white w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-cyan-500/30 text-cyan-400">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="border-cyan-500/30 text-cyan-400">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Servers', value: servers.length, icon: Server, color: 'cyan' },
          { label: 'Online', value: servers.filter(s => s.status === 'online').length, icon: CheckCircle2, color: 'emerald' },
          { label: 'Warning', value: servers.filter(s => s.status === 'warning').length, icon: AlertTriangle, color: 'amber' },
          { label: 'Offline', value: servers.filter(s => s.status === 'offline').length, icon: XCircle, color: 'red' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-slate-900/50 border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                    <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Server Table */}
      <Card className="bg-slate-900/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <List className="w-5 h-5 text-cyan-400" />
            All Servers ({filteredServers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Server</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Region</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Cluster</th>
                  <th className="text-center py-3 px-4 text-slate-400 text-sm font-medium">Status</th>
                  <th className="text-center py-3 px-4 text-slate-400 text-sm font-medium">CPU</th>
                  <th className="text-center py-3 px-4 text-slate-400 text-sm font-medium">RAM</th>
                  <th className="text-center py-3 px-4 text-slate-400 text-sm font-medium">Disk</th>
                  <th className="text-center py-3 px-4 text-slate-400 text-sm font-medium">Network</th>
                  <th className="text-center py-3 px-4 text-slate-400 text-sm font-medium">Heartbeat</th>
                  <th className="text-center py-3 px-4 text-slate-400 text-sm font-medium">Health</th>
                  <th className="text-right py-3 px-4 text-slate-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServers.map((server, index) => (
                  <motion.tr
                    key={server.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-800 hover:bg-slate-800/30"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-medium">{server.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-300">{server.regionName}</span>
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                          {server.region}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{server.cluster}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getStatusIcon(server.status)}
                        <span className="capitalize text-sm">{server.status}</span>
                      </div>
                    </td>
                    <td className={`py-3 px-4 text-center font-mono ${getUsageColor(server.cpu)}`}>
                      {server.cpu}%
                    </td>
                    <td className={`py-3 px-4 text-center font-mono ${getUsageColor(server.ram)}`}>
                      {server.ram}%
                    </td>
                    <td className={`py-3 px-4 text-center font-mono ${getUsageColor(server.disk)}`}>
                      {server.disk}%
                    </td>
                    <td className="py-3 px-4 text-center text-slate-300 font-mono">
                      {server.network} Mb/s
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-400 text-sm">
                        <Clock className="w-3 h-3" />
                        {server.lastHeartbeat}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="outline" className={getHealthBadge(server.health)}>
                        {server.health}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-slate-400">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                          <DropdownMenuItem onClick={() => handleAction('View Details', server.name)}>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('Restart', server.name)}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Restart
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('Scale', server.name)}>
                            <Scale className="w-4 h-4 mr-2" /> Scale Resources
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('Shutdown', server.name)}>
                            <PowerOff className="w-4 h-4 mr-2" /> Shutdown
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400" onClick={() => handleAction('Decommission', server.name)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Decommission
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SMRegistry;
