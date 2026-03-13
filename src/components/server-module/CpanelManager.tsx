/**
 * CPANEL / WHM MANAGER
 * Connect cPanel/WHM servers, create accounts, manage hosting packages
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server, Plus, CheckCircle, AlertTriangle, Loader2,
  Globe, Key, Lock, Eye, EyeOff, Users, HardDrive,
  Cpu, Database, RefreshCw, Settings, ExternalLink,
  Trash2, Power, BarChart3, Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface CpanelServer {
  id: string;
  name: string;
  hostname: string;
  ip: string;
  type: 'whm' | 'cpanel';
  status: 'connected' | 'error' | 'syncing';
  accounts: number;
  maxAccounts: number;
  cpu: number;
  ram: number;
  disk: number;
  lastSync: string;
}

interface CpanelAccount {
  id: string;
  username: string;
  domain: string;
  plan: string;
  diskUsed: string;
  diskLimit: string;
  bandwidth: string;
  status: 'active' | 'suspended' | 'terminated';
  created: string;
}

const mockServers: CpanelServer[] = [
  { id: '1', name: 'Main WHM Server', hostname: 'whm.softwarevala.com', ip: '185.199.108.153', type: 'whm', status: 'connected', accounts: 42, maxAccounts: 100, cpu: 38, ram: 55, disk: 42, lastSync: '2 min ago' },
  { id: '2', name: 'Client Hosting', hostname: 'hosting.softwarevala.com', ip: '185.199.108.154', type: 'whm', status: 'connected', accounts: 28, maxAccounts: 50, cpu: 52, ram: 68, disk: 61, lastSync: '5 min ago' },
];

const mockAccounts: CpanelAccount[] = [
  { id: '1', username: 'client01', domain: 'clientbusiness.com', plan: 'Business Pro', diskUsed: '2.4 GB', diskLimit: '10 GB', bandwidth: '45 GB', status: 'active', created: '2026-01-15' },
  { id: '2', username: 'client02', domain: 'shopzone.in', plan: 'Starter', diskUsed: '850 MB', diskLimit: '5 GB', bandwidth: '22 GB', status: 'active', created: '2026-02-01' },
  { id: '3', username: 'client03', domain: 'edulearn.com', plan: 'Business Pro', diskUsed: '4.1 GB', diskLimit: '10 GB', bandwidth: '78 GB', status: 'active', created: '2025-11-20' },
  { id: '4', username: 'demo_user', domain: 'testsite.softwarevala.com', plan: 'Free Trial', diskUsed: '120 MB', diskLimit: '1 GB', bandwidth: '5 GB', status: 'suspended', created: '2026-03-01' },
];

export const CpanelManager: React.FC = () => {
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'servers' | 'accounts' | 'create'>('servers');
  const [form, setForm] = useState({ hostname: '', ip: '', username: '', password: '', port: '2087', type: 'whm' });
  const [newAccount, setNewAccount] = useState({ domain: '', username: '', password: '', plan: '', email: '' });

  const handleConnect = () => {
    if (!form.hostname || !form.username || !form.password) {
      toast.error('Fill all required fields');
      return;
    }
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setShowConnectForm(false);
      toast.success('WHM/cPanel server connected successfully!');
    }, 2500);
  };

  const handleCreateAccount = () => {
    if (!newAccount.domain || !newAccount.username || !newAccount.password || !newAccount.plan) {
      toast.error('Fill all required fields');
      return;
    }
    toast.success(`cPanel account "${newAccount.username}" created for ${newAccount.domain}`);
    setNewAccount({ domain: '', username: '', password: '', plan: '', email: '' });
  };

  const statusBadge = (status: string) => {
    const configs: Record<string, { color: string; bg: string }> = {
      connected: { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
      active: { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
      syncing: { color: 'text-blue-400', bg: 'bg-blue-500/10' },
      suspended: { color: 'text-amber-400', bg: 'bg-amber-500/10' },
      error: { color: 'text-red-400', bg: 'bg-red-500/10' },
      terminated: { color: 'text-red-400', bg: 'bg-red-500/10' },
    };
    const c = configs[status] || configs.error;
    return <Badge variant="outline" className={`${c.color} ${c.bg} border-none text-[10px] capitalize`}>{status}</Badge>;
  };

  const getBarColor = (v: number) => v > 80 ? 'text-red-500' : v > 60 ? 'text-amber-500' : 'text-emerald-500';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">cPanel / WHM Manager</h2>
          <p className="text-sm text-muted-foreground">Connect WHM servers, manage cPanel accounts & hosting packages</p>
        </div>
        <Button onClick={() => setShowConnectForm(!showConnectForm)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Connect WHM Server
        </Button>
      </div>

      {/* Connect Form */}
      <AnimatePresence>
        {showConnectForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Card className="bg-card border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Key className="w-5 h-5 text-blue-400" /> Connect WHM/cPanel Server</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">WHM Hostname *</Label>
                    <Input placeholder="whm.yourdomain.com" value={form.hostname} onChange={e => setForm({...form, hostname: e.target.value})} className="bg-background border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Server IP</Label>
                    <Input placeholder="185.x.x.x" value={form.ip} onChange={e => setForm({...form, ip: e.target.value})} className="bg-background border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Root Username *</Label>
                    <Input placeholder="root" value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="bg-background border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Password *</Label>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="bg-background border-border pr-10" />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Port</Label>
                    <Input placeholder="2087" value={form.port} onChange={e => setForm({...form, port: e.target.value})} className="bg-background border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Type</Label>
                    <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                      <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whm">WHM (Root)</SelectItem>
                        <SelectItem value="cpanel">cPanel (Reseller)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowConnectForm(false)}>Cancel</Button>
                  <Button onClick={handleConnect} disabled={connecting} className="bg-blue-600 hover:bg-blue-700">
                    {connecting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting...</> : <><Server className="w-4 h-4 mr-2" /> Connect & Sync</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'servers', label: 'WHM Servers', count: mockServers.length },
          { id: 'accounts', label: 'cPanel Accounts', count: mockAccounts.length },
          { id: 'create', label: 'Create Account' },
        ].map(tab => (
          <Button key={tab.id} variant={activeTab === tab.id ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab(tab.id as any)}
            className={activeTab === tab.id ? 'bg-blue-600' : ''}>
            {tab.label} {tab.count !== undefined && <Badge variant="secondary" className="ml-1 text-[10px]">{tab.count}</Badge>}
          </Button>
        ))}
      </div>

      {/* WHM Servers List */}
      {activeTab === 'servers' && (
        <div className="space-y-3">
          {mockServers.map((srv, i) => (
            <motion.div key={srv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-card border-border hover:border-blue-500/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Server className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{srv.name}</p>
                          {statusBadge(srv.status)}
                          <Badge variant="outline" className="text-[10px] uppercase">{srv.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{srv.hostname} • {srv.ip}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline"><ExternalLink className="w-3 h-3 mr-1" /> Open WHM</Button>
                      <Button size="sm" variant="outline"><RefreshCw className="w-3 h-3 mr-1" /> Sync</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Accounts</p>
                      <p className="text-sm font-semibold text-foreground">{srv.accounts}/{srv.maxAccounts}</p>
                      <Progress value={(srv.accounts / srv.maxAccounts) * 100} className="h-1 mt-1" />
                    </div>
                    {['CPU', 'RAM', 'Disk'].map(metric => {
                      const val = metric === 'CPU' ? srv.cpu : metric === 'RAM' ? srv.ram : srv.disk;
                      return (
                        <div key={metric}>
                          <p className="text-xs text-muted-foreground mb-1">{metric}</p>
                          <p className={`text-sm font-semibold ${getBarColor(val)}`}>{val}%</p>
                          <Progress value={val} className="h-1 mt-1" />
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">Last sync: {srv.lastSync}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* cPanel Accounts List */}
      {activeTab === 'accounts' && (
        <div className="space-y-2">
          {mockAccounts.map((acc, i) => (
            <motion.div key={acc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-card border-border hover:border-blue-500/20 transition-colors">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{acc.domain}</p>
                          {statusBadge(acc.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">@{acc.username} • {acc.plan}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Disk</p>
                        <p className="text-xs font-medium text-foreground">{acc.diskUsed}/{acc.diskLimit}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Bandwidth</p>
                        <p className="text-xs font-medium text-foreground">{acc.bandwidth}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Settings className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Power className="w-3.5 h-3.5 text-amber-400" /></Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Account Form */}
      {activeTab === 'create' && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Plus className="w-5 h-5 text-emerald-400" /> Create cPanel Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Domain *</Label>
                <Input placeholder="clientdomain.com" value={newAccount.domain} onChange={e => setNewAccount({...newAccount, domain: e.target.value})} className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label>Username *</Label>
                <Input placeholder="clientuser" value={newAccount.username} onChange={e => setNewAccount({...newAccount, username: e.target.value})} className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label>Password *</Label>
                <Input type="password" placeholder="••••••••" value={newAccount.password} onChange={e => setNewAccount({...newAccount, password: e.target.value})} className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label>Hosting Plan *</Label>
                <Select value={newAccount.plan} onValueChange={v => setNewAccount({...newAccount, plan: v})}>
                  <SelectTrigger className="bg-background border-border"><SelectValue placeholder="Select plan" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter (5GB / 50GB BW)</SelectItem>
                    <SelectItem value="business">Business Pro (10GB / 100GB BW)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (Unlimited)</SelectItem>
                    <SelectItem value="reseller">Reseller Package</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Contact Email</Label>
                <Input type="email" placeholder="client@email.com" value={newAccount.email} onChange={e => setNewAccount({...newAccount, email: e.target.value})} className="bg-background border-border" />
              </div>
            </div>
            <Button onClick={handleCreateAccount} className="bg-emerald-600 hover:bg-emerald-700 w-full">
              <Plus className="w-4 h-4 mr-2" /> Create cPanel Account
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CpanelManager;
