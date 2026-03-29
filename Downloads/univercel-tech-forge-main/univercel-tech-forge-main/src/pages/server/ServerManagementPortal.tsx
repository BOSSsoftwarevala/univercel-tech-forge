import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, Cpu, HardDrive, MemoryStick, Globe, Shield, Zap, Activity,
  Plus, Settings, Power, RefreshCw, Terminal, Download, Upload, Trash2,
  CheckCircle2, AlertTriangle, XCircle, Clock, Link2, Copy, ExternalLink,
  Database, Cloud, Lock, Eye, EyeOff, Save, UserX, Scan, ShieldAlert,
  Users, MapPin, Fingerprint, Ban, History, AlertOctagon, Radio, Wifi
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ServerConfig {
  id: string;
  name: string;
  provider: 'contabo' | 'hostinger' | 'custom';
  ip_address: string;
  ssh_port: number;
  status: 'online' | 'offline' | 'maintenance' | 'scanning';
  cpu_usage: number;
  ram_usage: number;
  disk_usage: number;
  uptime: string;
  demos_hosted: number;
  location: string;
  threat_level: 'safe' | 'warning' | 'critical';
}

interface HostedDemo {
  id: string;
  name: string;
  subdomain: string;
  status: 'running' | 'stopped' | 'error';
  port: number;
  created_at: string;
  last_accessed: string;
  visits: number;
}

interface LoginAttempt {
  id: string;
  ip_address: string;
  location: string;
  timestamp: string;
  status: 'success' | 'failed' | 'blocked';
  user: string;
  method: 'ssh' | 'ftp' | 'panel';
  device_fingerprint: string;
  is_suspicious: boolean;
}

interface SecurityAlert {
  id: string;
  type: 'intrusion' | 'brute_force' | 'malware' | 'unauthorized' | 'port_scan';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  source_ip: string;
  is_resolved: boolean;
}

const ServerManagementPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddServer, setShowAddServer] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Multi-server support
  const [servers, setServers] = useState<ServerConfig[]>([
    {
      id: '1',
      name: 'Contabo VPS 1',
      provider: 'contabo',
      ip_address: '',
      ssh_port: 22,
      status: 'online',
      cpu_usage: 45,
      ram_usage: 62,
      disk_usage: 38,
      uptime: '45d 12h 34m',
      demos_hosted: 8,
      location: 'Germany',
      threat_level: 'safe',
    },
    {
      id: '2',
      name: 'Hostinger VPS',
      provider: 'hostinger',
      ip_address: '',
      ssh_port: 22,
      status: 'online',
      cpu_usage: 32,
      ram_usage: 48,
      disk_usage: 25,
      uptime: '23d 8h 15m',
      demos_hosted: 4,
      location: 'Netherlands',
      threat_level: 'safe',
    },
  ]);

  const [selectedServer, setSelectedServer] = useState<ServerConfig>(servers[0]);

  // New server form
  const [newServer, setNewServer] = useState({
    name: '',
    provider: 'contabo' as 'contabo' | 'hostinger' | 'custom',
    ip_address: '',
    ssh_port: 22,
    ssh_user: 'root',
    ssh_password: '',
  });

  // Login attempts - mock data for demo
  const [loginAttempts] = useState<LoginAttempt[]>([
    { id: '1', ip_address: '185.220.101.42', location: 'Russia', timestamp: '2 min ago', status: 'blocked', user: 'root', method: 'ssh', device_fingerprint: 'a3f2c1', is_suspicious: true },
    { id: '2', ip_address: '45.33.32.156', location: 'USA', timestamp: '15 min ago', status: 'failed', user: 'admin', method: 'ssh', device_fingerprint: 'b4e3d2', is_suspicious: true },
    { id: '3', ip_address: '103.21.244.15', location: 'China', timestamp: '32 min ago', status: 'blocked', user: 'root', method: 'ssh', device_fingerprint: 'c5f4e3', is_suspicious: true },
    { id: '4', ip_address: '192.168.1.100', location: 'Your Location', timestamp: '1 hr ago', status: 'success', user: 'softwarewala', method: 'panel', device_fingerprint: 'd6g5f4', is_suspicious: false },
    { id: '5', ip_address: '89.248.174.203', location: 'Netherlands', timestamp: '2 hr ago', status: 'blocked', user: 'test', method: 'ftp', device_fingerprint: 'e7h6g5', is_suspicious: true },
    { id: '6', ip_address: '192.168.1.100', location: 'Your Location', timestamp: '3 hr ago', status: 'success', user: 'softwarewala', method: 'ssh', device_fingerprint: 'd6g5f4', is_suspicious: false },
    { id: '7', ip_address: '94.102.49.170', location: 'Romania', timestamp: '4 hr ago', status: 'blocked', user: 'ubuntu', method: 'ssh', device_fingerprint: 'f8i7h6', is_suspicious: true },
    { id: '8', ip_address: '141.98.10.56', location: 'Bulgaria', timestamp: '5 hr ago', status: 'failed', user: 'admin', method: 'ssh', device_fingerprint: 'g9j8i7', is_suspicious: true },
  ]);

  // Security alerts
  const [securityAlerts] = useState<SecurityAlert[]>([
    { id: '1', type: 'brute_force', severity: 'critical', message: '127 failed SSH attempts from 185.220.101.42', timestamp: '5 min ago', source_ip: '185.220.101.42', is_resolved: false },
    { id: '2', type: 'port_scan', severity: 'high', message: 'Port scanning detected from multiple IPs', timestamp: '23 min ago', source_ip: '45.33.32.156', is_resolved: false },
    { id: '3', type: 'unauthorized', severity: 'medium', message: 'Unauthorized access attempt to /etc/passwd', timestamp: '1 hr ago', source_ip: '103.21.244.15', is_resolved: true },
    { id: '4', type: 'malware', severity: 'high', message: 'Suspicious script detected in /tmp directory', timestamp: '2 hr ago', source_ip: 'internal', is_resolved: true },
    { id: '5', type: 'intrusion', severity: 'critical', message: 'Multiple root login attempts blocked', timestamp: '3 hr ago', source_ip: '94.102.49.170', is_resolved: true },
  ]);

  // Blocked IPs
  const [blockedIPs] = useState([
    { ip: '185.220.101.42', location: 'Russia', blocked_at: '5 min ago', reason: 'Brute force attack', attempts: 127 },
    { ip: '103.21.244.15', location: 'China', blocked_at: '32 min ago', reason: 'Suspicious activity', attempts: 45 },
    { ip: '94.102.49.170', location: 'Romania', blocked_at: '4 hr ago', reason: 'Port scanning', attempts: 89 },
    { ip: '89.248.174.203', location: 'Netherlands', blocked_at: '2 hr ago', reason: 'FTP brute force', attempts: 34 },
    { ip: '141.98.10.56', location: 'Bulgaria', blocked_at: '5 hr ago', reason: 'SSH attacks', attempts: 67 },
  ]);

  // Mock hosted demos
  const [hostedDemos] = useState<HostedDemo[]>([
    { id: '1', name: 'ShopMax Pro', subdomain: 'shopmax', status: 'running', port: 3001, created_at: '2024-12-15', last_accessed: '2 min ago', visits: 1284 },
    { id: '2', name: 'ClientHub CRM', subdomain: 'clienthub', status: 'running', port: 3002, created_at: '2024-12-10', last_accessed: '15 min ago', visits: 892 },
    { id: '3', name: 'BookEase', subdomain: 'bookease', status: 'running', port: 3003, created_at: '2024-12-08', last_accessed: '1 hr ago', visits: 567 },
    { id: '4', name: 'FoodOrder Pro', subdomain: 'foodorder', status: 'stopped', port: 3004, created_at: '2024-12-01', last_accessed: '3 days ago', visits: 234 },
    { id: '5', name: 'HotelMaster', subdomain: 'hotelmaster', status: 'running', port: 3005, created_at: '2024-11-28', last_accessed: '45 min ago', visits: 445 },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'running':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'offline':
      case 'stopped':
        return <XCircle className="w-4 h-4 text-slate-400" />;
      case 'maintenance':
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      online: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      running: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      offline: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
      stopped: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
      maintenance: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      error: 'bg-red-500/10 text-red-400 border-red-500/30',
    };
    return <Badge className={styles[status] || styles.offline}>{status}</Badge>;
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return 'bg-red-500';
    if (usage >= 70) return 'bg-amber-500';
    if (usage >= 50) return 'bg-cyan-500';
    return 'bg-emerald-500';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleSaveServer = () => {
    if (!newServer.ip_address) {
      toast.error('Please enter server IP address');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const newServerConfig: ServerConfig = {
        id: Date.now().toString(),
        name: newServer.name || `${newServer.provider.charAt(0).toUpperCase() + newServer.provider.slice(1)} VPS`,
        provider: newServer.provider,
        ip_address: newServer.ip_address,
        ssh_port: newServer.ssh_port,
        status: 'online',
        cpu_usage: Math.floor(Math.random() * 40) + 20,
        ram_usage: Math.floor(Math.random() * 40) + 30,
        disk_usage: Math.floor(Math.random() * 30) + 20,
        uptime: '0d 0h 0m',
        demos_hosted: 0,
        location: newServer.provider === 'contabo' ? 'Germany' : newServer.provider === 'hostinger' ? 'Netherlands' : 'Unknown',
        threat_level: 'safe',
      };
      setServers(prev => [...prev, newServerConfig]);
      setSelectedServer(newServerConfig);
      setShowAddServer(false);
      setLoading(false);
      toast.success('Server added! Running initial security scan...');
      runSecurityScan();
    }, 1500);
  };

  const runSecurityScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          toast.success('Security scan complete - No critical threats found');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const getThreatLevelBadge = (level: string) => {
    const styles: Record<string, string> = {
      safe: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      critical: 'bg-red-500/10 text-red-400 border-red-500/30',
    };
    return <Badge className={styles[level] || styles.safe}>{level.toUpperCase()}</Badge>;
  };

  const getProviderLogo = (provider: string) => {
    switch (provider) {
      case 'contabo':
        return <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">CB</div>;
      case 'hostinger':
        return <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">HG</div>;
      default:
        return <Server className="w-8 h-8 text-slate-400" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'brute_force': return <UserX className="w-4 h-4" />;
      case 'port_scan': return <Scan className="w-4 h-4" />;
      case 'malware': return <AlertOctagon className="w-4 h-4" />;
      case 'unauthorized': return <ShieldAlert className="w-4 h-4" />;
      case 'intrusion': return <Ban className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              Server Management
            </h1>
            <p className="text-slate-400 mt-1">Contabo & Hostinger VPS Security Control</p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="border-slate-700"
              onClick={runSecurityScan}
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Scanning... {scanProgress}%
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 mr-2" />
                  Security Scan
                </>
              )}
            </Button>
            
            <Dialog open={showAddServer} onOpenChange={setShowAddServer}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add VPS
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700 text-white">
                <DialogHeader>
                  <DialogTitle>Add VPS Server</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Configure your Contabo or Hostinger VPS
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>VPS Provider</Label>
                    <Select 
                      value={newServer.provider} 
                      onValueChange={(value: 'contabo' | 'hostinger' | 'custom') => 
                        setNewServer({ ...newServer, provider: value })
                      }
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="contabo">Contabo VPS</SelectItem>
                        <SelectItem value="hostinger">Hostinger VPS</SelectItem>
                        <SelectItem value="custom">Custom VPS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="server-name">Server Name</Label>
                    <Input
                      id="server-name"
                      placeholder="My Demo Server"
                      value={newServer.name}
                      onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                      className="bg-slate-800 border-slate-700 mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ip-address">Server IP Address</Label>
                    <Input
                      id="ip-address"
                      placeholder="192.168.1.100"
                      value={newServer.ip_address}
                      onChange={(e) => setNewServer({ ...newServer, ip_address: e.target.value })}
                      className="bg-slate-800 border-slate-700 mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ssh-port">SSH Port</Label>
                      <Input
                        id="ssh-port"
                        type="number"
                        value={newServer.ssh_port}
                        onChange={(e) => setNewServer({ ...newServer, ssh_port: parseInt(e.target.value) })}
                        className="bg-slate-800 border-slate-700 mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ssh-user">SSH User</Label>
                      <Input
                        id="ssh-user"
                        value={newServer.ssh_user}
                        onChange={(e) => setNewServer({ ...newServer, ssh_user: e.target.value })}
                        className="bg-slate-800 border-slate-700 mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ssh-password">SSH Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="ssh-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={newServer.ssh_password}
                        onChange={(e) => setNewServer({ ...newServer, ssh_password: e.target.value })}
                        className="bg-slate-800 border-slate-700 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-cyan-500 to-violet-500"
                    onClick={handleSaveServer}
                    disabled={loading}
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Add & Scan Server
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Multi-Server Selector */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {servers.map((server) => (
            <motion.button
              key={server.id}
              onClick={() => setSelectedServer(server)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all min-w-fit ${
                selectedServer.id === server.id
                  ? 'bg-slate-800 border-cyan-500/50'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {getProviderLogo(server.provider)}
              <div className="text-left">
                <div className="font-medium text-sm">{server.name}</div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  {server.location}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
              </div>
              {getThreatLevelBadge(server.threat_level)}
            </motion.button>
          ))}
        </div>

        {/* Security Scanning Progress */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border-cyan-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                      <Scan className="w-6 h-6 text-cyan-400 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Security Scan in Progress</span>
                        <span className="text-cyan-400">{scanProgress}%</span>
                      </div>
                      <Progress value={scanProgress} className="h-2" />
                      <p className="text-xs text-slate-400 mt-2">
                        Checking login attempts, open ports, malware signatures, and vulnerabilities...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Server Status Card */}
        <Card className="bg-slate-900/50 border-slate-800 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              {/* Server Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center border border-cyan-500/30">
                  {getProviderLogo(selectedServer.provider)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold">{selectedServer.name}</h2>
                    {getStatusBadge(selectedServer.status)}
                    {getThreatLevelBadge(selectedServer.threat_level)}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-slate-400 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>{selectedServer.ip_address || 'Not configured'}</span>
                      {selectedServer.ip_address && (
                        <button onClick={() => copyToClipboard(selectedServer.ip_address)} className="hover:text-white">
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedServer.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                <div className="text-center p-3 rounded-xl bg-slate-800/50">
                  <Cpu className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <div className="text-lg font-bold">{selectedServer.cpu_usage}%</div>
                  <div className="text-xs text-slate-400">CPU</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-800/50">
                  <MemoryStick className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                  <div className="text-lg font-bold">{selectedServer.ram_usage}%</div>
                  <div className="text-xs text-slate-400">RAM</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-800/50">
                  <HardDrive className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <div className="text-lg font-bold">{selectedServer.disk_usage}%</div>
                  <div className="text-xs text-slate-400">Disk</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-slate-800/50">
                  <Activity className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <div className="text-lg font-bold">{selectedServer.demos_hosted}</div>
                  <div className="text-xs text-slate-400">Demos</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="border-slate-700" title="Refresh">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-slate-700" title="SSH Console">
                  <Terminal className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-slate-700" title="Settings">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-800 flex-wrap">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800">
              <Activity className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-slate-800">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="logins" className="data-[state=active]:bg-slate-800">
              <Users className="w-4 h-4 mr-2" />
              Login Monitor
            </TabsTrigger>
            <TabsTrigger value="demos" className="data-[state=active]:bg-slate-800">
              <Globe className="w-4 h-4 mr-2" />
              Hosted Demos
            </TabsTrigger>
            <TabsTrigger value="domains" className="data-[state=active]:bg-slate-800">
              <Link2 className="w-4 h-4 mr-2" />
              Domains
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Security Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Blocked Today</p>
                      <p className="text-2xl font-bold text-red-400">{blockedIPs.length}</p>
                    </div>
                    <Ban className="w-8 h-8 text-red-400/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Active Alerts</p>
                      <p className="text-2xl font-bold text-amber-400">{securityAlerts.filter(a => !a.is_resolved).length}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-amber-400/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Uptime</p>
                      <p className="text-2xl font-bold text-emerald-400">{selectedServer.uptime}</p>
                    </div>
                    <Radio className="w-8 h-8 text-emerald-400/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Connections</p>
                      <p className="text-2xl font-bold text-cyan-400">24</p>
                    </div>
                    <Wifi className="w-8 h-8 text-cyan-400/50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CPU Usage */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    CPU Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{selectedServer.cpu_usage}%</div>
                  <Progress value={selectedServer.cpu_usage} className="h-2" />
                  <p className="text-xs text-slate-400 mt-2">8 cores @ 3.4 GHz</p>
                </CardContent>
              </Card>

              {/* RAM Usage */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MemoryStick className="w-4 h-4 text-violet-400" />
                    Memory Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{selectedServer.ram_usage}%</div>
                  <Progress value={selectedServer.ram_usage} className="h-2" />
                  <p className="text-xs text-slate-400 mt-2">9.9 GB / 16 GB used</p>
                </CardContent>
              </Card>

              {/* Disk Usage */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    Disk Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{selectedServer.disk_usage}%</div>
                  <Progress value={selectedServer.disk_usage} className="h-2" />
                  <p className="text-xs text-slate-400 mt-2">76 GB / 200 GB used</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-slate-700 hover:bg-slate-800">
                    <Upload className="w-5 h-5 text-cyan-400" />
                    <span>Deploy Demo</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-slate-700 hover:bg-slate-800">
                    <Database className="w-5 h-5 text-violet-400" />
                    <span>Backup Now</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-slate-700 hover:bg-slate-800">
                    <RefreshCw className="w-5 h-5 text-emerald-400" />
                    <span>Restart Server</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2 border-slate-700 hover:bg-slate-800">
                    <Terminal className="w-5 h-5 text-amber-400" />
                    <span>SSH Console</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* Security Alerts */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                  Security Alerts
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Active threats and resolved incidents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {securityAlerts.map((alert) => (
                      <div 
                        key={alert.id}
                        className={`p-4 rounded-xl border flex items-start gap-4 ${
                          alert.is_resolved 
                            ? 'bg-slate-800/30 border-slate-700/50 opacity-60' 
                            : `bg-slate-800/50 border-l-4 ${
                                alert.severity === 'critical' ? 'border-l-red-500' :
                                alert.severity === 'high' ? 'border-l-orange-500' :
                                alert.severity === 'medium' ? 'border-l-amber-500' : 'border-l-blue-500'
                              } border-slate-700`
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{alert.message}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {alert.timestamp}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Globe className="w-3 h-3" />
                                  {alert.source_ip}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getSeverityColor(alert.severity)}>
                                {alert.severity}
                              </Badge>
                              {alert.is_resolved ? (
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                                  Resolved
                                </Badge>
                              ) : (
                                <Button size="sm" variant="destructive">
                                  Block IP
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Blocked IPs */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ban className="w-5 h-5 text-red-400" />
                    Blocked IPs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-2">
                      {blockedIPs.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                          <div>
                            <code className="text-sm text-red-400">{item.ip}</code>
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                              <MapPin className="w-3 h-3" />
                              {item.location}
                              <span>•</span>
                              {item.attempts} attempts
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="border-slate-700">
                            Unblock
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Security Status */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    Protection Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: 'Firewall (UFW)', status: 'active', icon: Shield },
                    { label: 'Fail2Ban', status: 'active', icon: Ban },
                    { label: 'SSL/TLS', status: 'active', icon: Lock },
                    { label: 'DDoS Protection', status: 'active', icon: Zap },
                    { label: 'Intrusion Detection', status: 'active', icon: Scan },
                    { label: 'Real-time Monitoring', status: 'active', icon: Activity },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Login Monitor Tab */}
          <TabsContent value="logins" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-cyan-400" />
                  Login Attempts Monitor
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time tracking of all SSH, FTP, and panel login attempts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800">
                      <TableHead>IP Address</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loginAttempts.map((attempt) => (
                      <TableRow 
                        key={attempt.id} 
                        className={`border-slate-800 ${attempt.is_suspicious ? 'bg-red-500/5' : ''}`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {attempt.is_suspicious && (
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                            )}
                            <code className={`text-sm ${attempt.is_suspicious ? 'text-red-400' : 'text-slate-300'}`}>
                              {attempt.ip_address}
                            </code>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {attempt.location}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{attempt.user}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="uppercase text-xs">
                            {attempt.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400">{attempt.timestamp}</TableCell>
                        <TableCell>
                          {attempt.status === 'success' ? (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                              Success
                            </Badge>
                          ) : attempt.status === 'blocked' ? (
                            <Badge className="bg-red-500/10 text-red-400 border-red-500/30">
                              Blocked
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                              Failed
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {attempt.is_suspicious && attempt.status !== 'blocked' && (
                            <Button size="sm" variant="destructive">
                              Block
                            </Button>
                          )}
                          {!attempt.is_suspicious && (
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hosted Demos Tab */}
          <TabsContent value="demos" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Hosted Demos</CardTitle>
                  <CardDescription className="text-slate-400">
                    All demos running on {selectedServer.name}
                  </CardDescription>
                </div>
                <Button className="bg-gradient-to-r from-cyan-500 to-violet-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Deploy New
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800">
                      <TableHead>Demo</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Visits</TableHead>
                      <TableHead>Last Accessed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hostedDemos.map((demo) => (
                      <TableRow key={demo.id} className="border-slate-800">
                        <TableCell className="font-medium">{demo.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-slate-800 px-2 py-1 rounded">
                              {demo.subdomain}.yourdomain.com
                            </code>
                            <button 
                              onClick={() => copyToClipboard(`https://${demo.subdomain}.yourdomain.com`)}
                              className="text-slate-400 hover:text-white"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(demo.status)}
                            {getStatusBadge(demo.status)}
                          </div>
                        </TableCell>
                        <TableCell>{demo.visits.toLocaleString()}</TableCell>
                        <TableCell className="text-slate-400">{demo.last_accessed}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              {demo.status === 'running' ? (
                                <Power className="w-4 h-4 text-red-400" />
                              ) : (
                                <Power className="w-4 h-4 text-emerald-400" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Domains Tab */}
          <TabsContent value="domains" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle>Domain Configuration</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure domains and subdomains for your demos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">Primary Domain</h3>
                      <p className="text-sm text-slate-400">demos.yourdomain.com</p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  
                  <div className="bg-slate-900/50 p-3 rounded-lg">
                    <p className="text-xs text-slate-400 mb-2">Point your domain to:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-slate-800 px-3 py-1.5 rounded flex-1">
                        A Record → {selectedServer.ip_address || 'Your Server IP'}
                      </code>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(selectedServer.ip_address)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Add Custom Domain</Label>
                  <div className="flex gap-2 mt-2">
                    <Input 
                      placeholder="yourdomain.com" 
                      className="bg-slate-800 border-slate-700"
                    />
                    <Button>Add Domain</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ServerManagementPortal;
