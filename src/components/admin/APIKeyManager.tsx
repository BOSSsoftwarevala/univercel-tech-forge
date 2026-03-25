import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Key, Copy, Eye, EyeOff, Plus, Trash2, 
  RefreshCw, Calendar, Shield, AlertTriangle,
  Check, Clock, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed: Date | null;
  expiresAt: Date | null;
  permissions: string[];
  status: 'active' | 'expired' | 'revoked';
  rateLimit: number;
  usageCount: number;
}

const mockApiKeys: APIKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'sv_prod_4f3a7b2c9d1e8f5a6b7c8d9e0f1a2b3c',
    createdAt: new Date('2024-01-15'),
    lastUsed: new Date('2024-12-20'),
    expiresAt: new Date('2025-01-15'),
    permissions: ['read', 'write', 'delete'],
    status: 'active',
    rateLimit: 10000,
    usageCount: 45672,
  },
  {
    id: '2',
    name: 'Development Key',
    key: 'sv_dev_1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    createdAt: new Date('2024-06-01'),
    lastUsed: new Date('2024-12-19'),
    expiresAt: null,
    permissions: ['read', 'write'],
    status: 'active',
    rateLimit: 5000,
    usageCount: 12345,
  },
  {
    id: '3',
    name: 'Analytics Integration',
    key: 'sv_analytics_9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f',
    createdAt: new Date('2024-03-10'),
    lastUsed: new Date('2024-11-15'),
    expiresAt: new Date('2024-12-01'),
    permissions: ['read'],
    status: 'expired',
    rateLimit: 1000,
    usageCount: 89234,
  },
];

export function APIKeyManager() {
  const [keys, setKeys] = useState<APIKey[]>(mockApiKeys);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['read']);

  const toggleKeyVisibility = (id: string) => {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "API Key Copied",
      description: "The API key has been copied to your clipboard.",
    });
  };

  const revokeKey = (id: string) => {
    setKeys(keys.map(k => 
      k.id === id ? { ...k, status: 'revoked' as const } : k
    ));
    toast({
      title: "API Key Revoked",
      description: "The API key has been revoked and can no longer be used.",
      variant: "destructive",
    });
  };

  const regenerateKey = (id: string) => {
    const newKey = `sv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
    setKeys(keys.map(k => 
      k.id === id ? { ...k, key: newKey, lastUsed: null } : k
    ));
    toast({
      title: "API Key Regenerated",
      description: "A new API key has been generated. Update your applications.",
    });
  };

  const createNewKey = () => {
    if (!newKeyName.trim()) return;
    
    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`,
      createdAt: new Date(),
      lastUsed: null,
      expiresAt: null,
      permissions: newKeyPermissions,
      status: 'active',
      rateLimit: 5000,
      usageCount: 0,
    };
    
    setKeys([newKey, ...keys]);
    setNewKeyName('');
    setIsCreating(false);
    toast({
      title: "API Key Created",
      description: "Your new API key has been created successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'expired': return 'bg-orange-500/20 text-orange-500 border-orange-500/50';
      case 'revoked': return 'bg-red-500/20 text-red-500 border-red-500/50';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-mono font-bold text-foreground flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            API Key Manager
          </h2>
          <p className="text-sm text-muted-foreground">Manage API keys for external integrations</p>
        </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create New Key
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-panel border-border/50">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm text-muted-foreground">Key Name</label>
                <Input
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API Key"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Permissions</label>
                <div className="flex gap-2 mt-2">
                  {['read', 'write', 'delete'].map(perm => (
                    <Button
                      key={perm}
                      variant={newKeyPermissions.includes(perm) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setNewKeyPermissions(prev =>
                          prev.includes(perm)
                            ? prev.filter(p => p !== perm)
                            : [...prev, perm]
                        );
                      }}
                    >
                      {perm}
                    </Button>
                  ))}
                </div>
              </div>
              <Button onClick={createNewKey} className="w-full">
                Generate API Key
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys List */}
      <div className="space-y-3">
        {keys.map((apiKey, index) => (
          <motion.div
            key={apiKey.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`glass-panel p-4 ${apiKey.status === 'revoked' && 'opacity-50'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-foreground">{apiKey.name}</h3>
                  <Badge variant="outline" className={getStatusColor(apiKey.status)}>
                    {apiKey.status}
                  </Badge>
                </div>
                
                {/* Key Display */}
                <div className="flex items-center gap-2 mb-3">
                  <code className="flex-1 px-3 py-2 rounded-lg bg-background/50 font-mono text-sm text-muted-foreground overflow-hidden">
                    {showKey[apiKey.id] ? apiKey.key : '•'.repeat(32)}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                  >
                    {showKey[apiKey.id] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyKey(apiKey.key)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Created: {apiKey.createdAt.toLocaleDateString()}
                  </div>
                  {apiKey.lastUsed && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last used: {apiKey.lastUsed.toLocaleDateString()}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {apiKey.permissions.join(', ')}
                  </div>
                  <div className="font-mono">
                    {apiKey.usageCount.toLocaleString()} requests
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {apiKey.status === 'active' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => regenerateKey(apiKey.id)}
                      className="gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Regenerate
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => revokeKey(apiKey.id)}
                      className="gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Revoke
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default APIKeyManager;
