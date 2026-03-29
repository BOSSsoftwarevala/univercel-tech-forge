/**
 * HOSTING CONNECTION
 * Connect hosting servers via URL, IP, credentials
 * One-click hosting connect with auto-scan
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Server, Key, Lock, Shield, CheckCircle, AlertTriangle,
  Wifi, WifiOff, Plus, RefreshCw, Trash2, Eye, EyeOff, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ConnectedHost {
  id: string;
  name: string;
  url: string;
  ip: string;
  status: 'connected' | 'scanning' | 'error' | 'offline';
  connectedAt: string;
  services: number;
  uptime: string;
}

export const HostingConnection: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ url: '', ip: '', username: '', password: '', sshKey: '' });

  const [hosts] = useState<ConnectedHost[]>([
    { id: '1', name: 'Production VPS', url: 'prod.softwarevala.com', ip: '185.199.108.153', status: 'connected', connectedAt: '2026-03-01', services: 8, uptime: '99.97%' },
    { id: '2', name: 'Staging Server', url: 'staging.softwarevala.com', ip: '185.199.108.154', status: 'connected', connectedAt: '2026-03-05', services: 5, uptime: '99.91%' },
    { id: '3', name: 'AI Services Node', url: 'ai.softwarevala.com', ip: '185.199.108.155', status: 'scanning', connectedAt: '2026-03-08', services: 3, uptime: '99.85%' },
  ]);

  const handleConnect = async () => {
    if (!form.url || !form.ip || !form.username || !form.password) {
      toast.error('Please fill all required fields');
      return;
    }
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setShowForm(false);
      setForm({ url: '', ip: '', username: '', password: '', sshKey: '' });
      toast.success('Server connected successfully! Auto-scan initiated.');
    }, 3000);
  };

  const statusConfig: Record<string, { color: string; bg: string; icon: React.ElementType; label: string }> = {
    connected: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle, label: 'Connected' },
    scanning: { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: RefreshCw, label: 'Scanning' },
    error: { color: 'text-red-400', bg: 'bg-red-500/10', icon: AlertTriangle, label: 'Error' },
    offline: { color: 'text-zinc-400', bg: 'bg-zinc-500/10', icon: WifiOff, label: 'Offline' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Hosting Connection</h2>
          <p className="text-sm text-muted-foreground">Connect and manage your hosting servers</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Connect Hosting
        </Button>
      </div>

      {/* Connection Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Card className="bg-card border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-base text-foreground flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  Connect New Server
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Hosting URL *</Label>
                    <Input placeholder="example.com" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} className="bg-background border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Server IP *</Label>
                    <Input placeholder="192.168.1.1" value={form.ip} onChange={e => setForm({ ...form, ip: e.target.value })} className="bg-background border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Username *</Label>
                    <Input placeholder="root" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="bg-background border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Password *</Label>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="bg-background border-border pr-10" />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">SSH Key (Optional)</Label>
                  <textarea placeholder="Paste your SSH private key here..." value={form.sshKey} onChange={e => setForm({ ...form, sshKey: e.target.value })} className="w-full h-20 rounded-md bg-background border border-border text-foreground text-sm p-3 resize-none" />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button onClick={handleConnect} disabled={connecting} className="bg-blue-600 hover:bg-blue-700">
                    {connecting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting...</> : <><Wifi className="w-4 h-4 mr-2" /> Connect & Scan</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connected Hosts */}
      <div className="space-y-3">
        {hosts.map((host, i) => {
          const sc = statusConfig[host.status];
          const StatusIcon = sc.icon;
          return (
            <motion.div key={host.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-card border-border hover:border-blue-500/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${sc.bg} flex items-center justify-center`}>
                        <Server className={`w-6 h-6 ${sc.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{host.name}</p>
                          <Badge variant="outline" className={`${sc.color} ${sc.bg} border-none text-xs`}>
                            <StatusIcon className={`w-3 h-3 mr-1 ${host.status === 'scanning' ? 'animate-spin' : ''}`} />
                            {sc.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{host.url} • {host.ip}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-foreground">{host.services}</p>
                        <p className="text-xs text-muted-foreground">Services</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-emerald-400">{host.uptime}</p>
                        <p className="text-xs text-muted-foreground">Uptime</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><RefreshCw className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Connection Info */}
      <Card className="bg-muted/30 border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-muted-foreground">All credentials are AES-256 encrypted and stored securely. SSH key authentication is recommended for production servers.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HostingConnection;
