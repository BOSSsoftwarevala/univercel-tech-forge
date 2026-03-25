import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Shield, Plus, Trash2, Check, X,
  AlertTriangle, Lock, Unlock, Search, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface IPRule {
  id: string;
  ip: string;
  type: 'whitelist' | 'blacklist';
  reason: string;
  addedBy: string;
  addedAt: Date;
  expiresAt: Date | null;
  hitCount: number;
  isActive: boolean;
  role?: string;
}

const mockIPRules: IPRule[] = [
  {
    id: '1',
    ip: '192.168.1.0/24',
    type: 'whitelist',
    reason: 'Office Network - Mumbai HQ',
    addedBy: 'Super Admin',
    addedAt: new Date('2024-01-10'),
    expiresAt: null,
    hitCount: 15234,
    isActive: true,
  },
  {
    id: '2',
    ip: '10.0.0.0/8',
    type: 'whitelist',
    reason: 'Internal VPN Range',
    addedBy: 'System',
    addedAt: new Date('2024-02-15'),
    expiresAt: null,
    hitCount: 8921,
    isActive: true,
  },
  {
    id: '3',
    ip: '203.45.67.89',
    type: 'blacklist',
    reason: 'Multiple failed login attempts - Brute force detected',
    addedBy: 'Auto-Security',
    addedAt: new Date('2024-12-18'),
    expiresAt: new Date('2025-01-18'),
    hitCount: 127,
    isActive: true,
  },
  {
    id: '4',
    ip: '178.32.45.0/24',
    type: 'blacklist',
    reason: 'Known malicious range',
    addedBy: 'Threat Intelligence',
    addedAt: new Date('2024-11-05'),
    expiresAt: null,
    hitCount: 456,
    isActive: true,
  },
  {
    id: '5',
    ip: '45.33.32.156',
    type: 'whitelist',
    reason: 'External API Partner - Analytics',
    addedBy: 'Super Admin',
    addedAt: new Date('2024-08-20'),
    expiresAt: new Date('2025-08-20'),
    hitCount: 23456,
    isActive: true,
    role: 'developer',
  },
];

export function IPRestrictionPanel() {
  const [rules, setRules] = useState<IPRule[]>(mockIPRules);
  const [filterType, setFilterType] = useState<'all' | 'whitelist' | 'blacklist'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newIP, setNewIP] = useState('');
  const [newType, setNewType] = useState<'whitelist' | 'blacklist'>('whitelist');
  const [newReason, setNewReason] = useState('');

  const filteredRules = rules.filter(rule => {
    const matchesType = filterType === 'all' || rule.type === filterType;
    const matchesSearch = rule.ip.includes(searchTerm) || rule.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const whitelistCount = rules.filter(r => r.type === 'whitelist' && r.isActive).length;
  const blacklistCount = rules.filter(r => r.type === 'blacklist' && r.isActive).length;

  const addRule = () => {
    if (!newIP.trim() || !newReason.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter both IP address and reason.",
        variant: "destructive",
      });
      return;
    }

    const newRule: IPRule = {
      id: Date.now().toString(),
      ip: newIP,
      type: newType,
      reason: newReason,
      addedBy: 'Super Admin',
      addedAt: new Date(),
      expiresAt: null,
      hitCount: 0,
      isActive: true,
    };

    setRules([newRule, ...rules]);
    setNewIP('');
    setNewReason('');
    
    toast({
      title: `IP ${newType === 'whitelist' ? 'Whitelisted' : 'Blacklisted'}`,
      description: `${newIP} has been added to the ${newType}.`,
    });
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(rule =>
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    toast({
      title: "Rule Deleted",
      description: "The IP rule has been removed.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-mono font-bold text-foreground flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            IP Restriction Panel
          </h2>
          <p className="text-sm text-muted-foreground">Manage IP whitelists and blacklists</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm font-mono text-green-500">{whitelistCount} Whitelisted</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30">
            <X className="w-4 h-4 text-red-500" />
            <span className="text-sm font-mono text-red-500">{blacklistCount} Blacklisted</span>
          </div>
        </div>
      </div>

      {/* Add New Rule */}
      <div className="glass-panel p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Add New IP Rule</h3>
        <div className="flex gap-3">
          <Input
            value={newIP}
            onChange={(e) => setNewIP(e.target.value)}
            placeholder="IP Address or CIDR (e.g., 192.168.1.0/24)"
            className="flex-1"
          />
          <Select value={newType} onValueChange={(v: 'whitelist' | 'blacklist') => setNewType(v)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="whitelist">Whitelist</SelectItem>
              <SelectItem value="blacklist">Blacklist</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            placeholder="Reason"
            className="flex-1"
          />
          <Button onClick={addRule} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Rule
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search IP or reason..."
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rules</SelectItem>
              <SelectItem value="whitelist">Whitelist</SelectItem>
              <SelectItem value="blacklist">Blacklist</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rules List */}
      <div className="space-y-2">
        {filteredRules.map((rule, index) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className={`glass-panel p-4 ${!rule.isActive && 'opacity-50'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  rule.type === 'whitelist' 
                    ? 'bg-green-500/20 text-green-500' 
                    : 'bg-red-500/20 text-red-500'
                }`}>
                  {rule.type === 'whitelist' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-foreground font-medium">{rule.ip}</code>
                    <Badge variant="outline" className={
                      rule.type === 'whitelist'
                        ? 'bg-green-500/10 text-green-500 border-green-500/50'
                        : 'bg-red-500/10 text-red-500 border-red-500/50'
                    }>
                      {rule.type}
                    </Badge>
                    {rule.role && (
                      <Badge variant="outline" className="text-xs">
                        {rule.role} only
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{rule.reason}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>Added by {rule.addedBy}</span>
                    <span>{rule.addedAt.toLocaleDateString()}</span>
                    <span className="font-mono">{rule.hitCount.toLocaleString()} hits</span>
                    {rule.expiresAt && (
                      <span className="text-orange-500">
                        Expires: {rule.expiresAt.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={rule.isActive}
                  onCheckedChange={() => toggleRule(rule.id)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteRule(rule.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default IPRestrictionPanel;
