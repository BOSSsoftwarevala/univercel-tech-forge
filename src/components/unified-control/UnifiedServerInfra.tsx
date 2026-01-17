import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Server, Globe, Shield, Lock, Activity, HardDrive,
  Plus, Trash2, Play, Square, CreditCard, Wifi, MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ServerInstance {
  id: string;
  name: string;
  ip: string;
  domain: string;
  region: string;
  status: 'running' | 'stopped';
  payment: 'paid' | 'unpaid';
  cpu: number;
  ram: number;
  storage: number;
  ssl: boolean;
  autoInstall: boolean;
}

const SERVERS: ServerInstance[] = [
  { id: 'srv-1', name: 'Production Server', ip: '203.0.113.50', domain: 'app.example.com', region: 'India', status: 'running', payment: 'paid', cpu: 45, ram: 62, storage: 38, ssl: true, autoInstall: true },
  { id: 'srv-2', name: 'API Gateway', ip: '198.51.100.25', domain: 'api.example.com', region: 'Asia', status: 'running', payment: 'paid', cpu: 78, ram: 55, storage: 25, ssl: true, autoInstall: true },
  { id: 'srv-3', name: 'Database Server', ip: '192.0.2.100', domain: 'db.internal', region: 'India', status: 'running', payment: 'paid', cpu: 35, ram: 80, storage: 72, ssl: true, autoInstall: true },
  { id: 'srv-4', name: 'CDN Edge - Dubai', ip: '203.0.113.75', domain: 'cdn-me.example.com', region: 'Middle East', status: 'running', payment: 'paid', cpu: 22, ram: 30, storage: 15, ssl: true, autoInstall: true },
  { id: 'srv-5', name: 'CDN Edge - EU', ip: '198.51.100.80', domain: 'cdn-eu.example.com', region: 'Europe', status: 'running', payment: 'paid', cpu: 28, ram: 35, storage: 18, ssl: true, autoInstall: true },
  { id: 'srv-6', name: 'Backup Server', ip: '192.0.2.200', domain: 'backup.internal', region: 'USA', status: 'stopped', payment: 'unpaid', cpu: 0, ram: 0, storage: 85, ssl: false, autoInstall: false },
  { id: 'srv-7', name: 'Dev Server', ip: '203.0.113.100', domain: 'dev.example.com', region: 'India', status: 'running', payment: 'paid', cpu: 55, ram: 48, storage: 42, ssl: true, autoInstall: true },
  { id: 'srv-8', name: 'CDN Edge - Africa', ip: '198.51.100.120', domain: 'cdn-af.example.com', region: 'Africa', status: 'stopped', payment: 'unpaid', cpu: 0, ram: 0, storage: 10, ssl: false, autoInstall: false },
];

const REGIONS = ['All', 'India', 'Asia', 'Middle East', 'Africa', 'Europe', 'USA'];

export const UnifiedServerInfra = () => {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [servers, setServers] = useState(SERVERS);

  const filteredServers = selectedRegion === 'All' 
    ? servers 
    : servers.filter(s => s.region === selectedRegion);

  const toggleStatus = (id: string) => {
    setServers(servers.map(s => 
      s.id === id ? { ...s, status: s.status === 'running' ? 'stopped' : 'running' } : s
    ));
  };

  const togglePayment = (id: string) => {
    setServers(servers.map(s => 
      s.id === id ? { ...s, payment: s.payment === 'paid' ? 'unpaid' : 'paid' } : s
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-red-400" />
            Server & Infrastructure
          </h1>
          <p className="text-muted-foreground">Add server via IP → Auto install → Auto SSL → Auto monitor</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-1" /> Add Server
          </Button>
        </div>
      </div>

      {/* Region Tabs */}
      <div className="flex gap-2 flex-wrap">
        {REGIONS.map(region => (
          <Button
            key={region}
            size="sm"
            variant={selectedRegion === region ? "default" : "outline"}
            onClick={() => setSelectedRegion(region)}
            className={selectedRegion === region ? "bg-red-600" : ""}
          >
            <MapPin className="w-3 h-3 mr-1" />
            {region}
          </Button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="bg-slate-900/50 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{servers.filter(s => s.status === 'running').length}</p>
            <p className="text-xs text-muted-foreground">Running</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-400">{servers.filter(s => s.status === 'stopped').length}</p>
            <p className="text-xs text-muted-foreground">Stopped</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{servers.filter(s => s.ssl).length}</p>
            <p className="text-xs text-muted-foreground">SSL Active</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-violet-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-violet-400">{servers.filter(s => s.autoInstall).length}</p>
            <p className="text-xs text-muted-foreground">Auto-Managed</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{servers.filter(s => s.payment === 'unpaid').length}</p>
            <p className="text-xs text-muted-foreground">Unpaid</p>
          </CardContent>
        </Card>
      </div>

      {/* Servers Table */}
      <Card className="bg-slate-900/50 border-border/50">
        <CardContent className="p-0">
          <div className="rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Server</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">IP / Domain</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Region</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Payment</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">CPU</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">RAM</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">Storage</th>
                  <th className="text-left text-xs font-medium text-muted-foreground p-3">SSL</th>
                  <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredServers.map((server) => (
                  <motion.tr 
                    key={server.id} 
                    className="hover:bg-slate-800/30 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-medium text-white">{server.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-xs">
                        <p className="text-muted-foreground font-mono">{server.ip}</p>
                        <p className="text-blue-400">{server.domain}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        {server.region}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={server.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}>
                        {server.status === 'running' ? '● RUN' : '○ STOP'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={server.payment === 'paid' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}>
                        {server.payment.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3 w-20">
                      <div className="flex items-center gap-1">
                        <Progress value={server.cpu} className="h-2 w-12" />
                        <span className="text-xs text-muted-foreground">{server.cpu}%</span>
                      </div>
                    </td>
                    <td className="p-3 w-20">
                      <div className="flex items-center gap-1">
                        <Progress value={server.ram} className="h-2 w-12" />
                        <span className="text-xs text-muted-foreground">{server.ram}%</span>
                      </div>
                    </td>
                    <td className="p-3 w-20">
                      <div className="flex items-center gap-1">
                        <Progress value={server.storage} className="h-2 w-12" />
                        <span className="text-xs text-muted-foreground">{server.storage}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={server.ssl ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>
                        <Lock className="w-3 h-3 mr-1" />
                        {server.ssl ? 'Active' : 'None'}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2 text-xs"
                          onClick={() => toggleStatus(server.id)}
                        >
                          {server.status === 'running' ? <Square className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                          {server.status === 'running' ? 'Stop' : 'Run'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 px-2 text-xs"
                          onClick={() => togglePayment(server.id)}
                        >
                          <CreditCard className="w-3 h-3 mr-1" />
                          {server.payment === 'paid' ? 'Unpay' : 'Pay'}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-400">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
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
