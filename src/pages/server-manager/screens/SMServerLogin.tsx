import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, Key, Lock, Eye, EyeOff, Copy, CheckCircle, Shield,
  Server, Globe, AlertTriangle, Clock, User, Hash, ExternalLink,
  RefreshCw, Download, FileKey, Fingerprint
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const servers = [
  { 
    id: 'srv-001', 
    name: 'US-East-Primary', 
    ip: '52.***.***.124', 
    region: 'Virginia',
    status: 'online',
    os: 'Ubuntu 22.04 LTS',
    lastLogin: '2 hours ago',
    sshPort: 22,
  },
  { 
    id: 'srv-002', 
    name: 'EU-Frankfurt-01', 
    ip: '18.***.***.89', 
    region: 'Frankfurt',
    status: 'online',
    os: 'Debian 11',
    lastLogin: '1 day ago',
    sshPort: 22,
  },
  { 
    id: 'srv-003', 
    name: 'AP-Tokyo-Main', 
    ip: '13.***.***.201', 
    region: 'Tokyo',
    status: 'online',
    os: 'Ubuntu 20.04 LTS',
    lastLogin: '30 min ago',
    sshPort: 2222,
  },
  { 
    id: 'srv-004', 
    name: 'AP-Mumbai-02', 
    ip: '15.***.***.56', 
    region: 'Mumbai',
    status: 'maintenance',
    os: 'CentOS 8',
    lastLogin: '3 days ago',
    sshPort: 22,
  },
];

const sshKeys = [
  { id: 'key-001', name: 'Production Key', fingerprint: 'SHA256:nTh...X2k', addedDate: '2024-01-15', servers: 4 },
  { id: 'key-002', name: 'Backup Key', fingerprint: 'SHA256:aB1...Y9z', addedDate: '2024-02-20', servers: 2 },
  { id: 'key-003', name: 'Emergency Access', fingerprint: 'SHA256:cD3...W5m', addedDate: '2024-03-10', servers: 4 },
];

const loginHistory = [
  { time: '2 hours ago', server: 'US-East-Primary', user: 'admin', method: 'SSH Key', ip: '192.168.1.***', status: 'success' },
  { time: '5 hours ago', server: 'AP-Tokyo-Main', user: 'deploy', method: 'SSH Key', ip: '10.0.0.***', status: 'success' },
  { time: '1 day ago', server: 'EU-Frankfurt-01', user: 'admin', method: 'Password', ip: '172.16.0.***', status: 'failed' },
  { time: '2 days ago', server: 'US-East-Primary', user: 'root', method: 'SSH Key', ip: '192.168.1.***', status: 'success' },
];

const SMServerLogin = () => {
  const [selectedServer, setSelectedServer] = useState<typeof servers[0] | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (server: typeof servers[0]) => {
    setSelectedServer(server);
    setIsConnecting(true);
    toast.info(`Initiating secure connection to ${server.name}...`);
    
    await new Promise(r => setTimeout(r, 2000));
    
    setIsConnecting(false);
    toast.success('Connection established! Opening terminal...');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
            <Terminal className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Server Login</h2>
            <p className="text-slate-400">Secure access to your servers via SSH</p>
          </div>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Key className="w-4 h-4 mr-2" />
          Add SSH Key
        </Button>
      </div>

      <Tabs defaultValue="servers" className="space-y-4">
        <TabsList className="bg-slate-800/50">
          <TabsTrigger value="servers">Server Access</TabsTrigger>
          <TabsTrigger value="keys">SSH Keys</TabsTrigger>
          <TabsTrigger value="history">Login History</TabsTrigger>
        </TabsList>

        {/* Server Access */}
        <TabsContent value="servers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {servers.map((server) => (
              <motion.div
                key={server.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={`bg-slate-900/50 border-slate-700 hover:border-green-500/50 transition-all ${
                  selectedServer?.id === server.id ? 'ring-2 ring-green-500' : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          server.status === 'online' ? 'bg-green-500/20' : 'bg-amber-500/20'
                        }`}>
                          <Server className={`w-5 h-5 ${
                            server.status === 'online' ? 'text-green-400' : 'text-amber-400'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{server.name}</h3>
                          <p className="text-xs text-slate-400">{server.os}</p>
                        </div>
                      </div>
                      <Badge className={`${
                        server.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {server.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 flex items-center gap-2">
                          <Globe className="w-3 h-3" /> Region
                        </span>
                        <span className="text-white">{server.region}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 flex items-center gap-2">
                          <Hash className="w-3 h-3" /> IP Address
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono">{server.ip}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(server.ip, 'IP')}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 flex items-center gap-2">
                          <Terminal className="w-3 h-3" /> SSH Port
                        </span>
                        <span className="text-white font-mono">{server.sshPort}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 flex items-center gap-2">
                          <Clock className="w-3 h-3" /> Last Login
                        </span>
                        <span className="text-white">{server.lastLogin}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleConnect(server)}
                        disabled={server.status !== 'online' || isConnecting}
                      >
                        {isConnecting && selectedServer?.id === server.id ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Terminal className="w-4 h-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="border-slate-600">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick SSH Command */}
          {selectedServer && (
            <Card className="bg-slate-900/50 border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Quick SSH Command
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-950 font-mono text-sm">
                  <code className="flex-1 text-green-400">
                    ssh -p {selectedServer.sshPort} admin@{selectedServer.ip.replace(/\*/g, 'x')}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(`ssh -p ${selectedServer.sshPort} admin@${selectedServer.ip}`, 'SSH command')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* SSH Keys */}
        <TabsContent value="keys" className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <FileKey className="w-5 h-5 text-cyan-400" />
                Registered SSH Keys
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sshKeys.map((key) => (
                  <div key={key.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/20">
                          <Key className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{key.name}</h4>
                          <p className="text-xs text-slate-400 font-mono">{key.fingerprint}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-slate-300">{key.servers} servers</p>
                          <p className="text-xs text-slate-500">Added {key.addedDate}</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-slate-600">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 rounded-xl border-2 border-dashed border-slate-600 text-center">
                <FileKey className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Drag and drop your public key here</p>
                <p className="text-xs text-slate-500 mt-1">or click to browse</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Login History */}
        <TabsContent value="history" className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Recent Login Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-2">
                  {loginHistory.map((log, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-800/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          log.status === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          {log.status === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{log.server}</span>
                            <Badge className="bg-slate-700 text-slate-300 text-xs">{log.method}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <User className="w-3 h-3" />
                            <span>{log.user}</span>
                            <span>•</span>
                            <span>{log.ip}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-slate-400">{log.time}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SMServerLogin;
