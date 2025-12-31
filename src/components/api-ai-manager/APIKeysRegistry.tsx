import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Eye, EyeOff, RefreshCw, Trash2, Plus, Shield, Clock, Lock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface APIKey {
  id: string;
  name: string;
  maskedKey: string;
  environment: 'dev' | 'staging' | 'prod';
  scope: string[];
  createdAt: string;
  expiresAt: string;
  lastUsed: string;
  status: 'active' | 'expiring' | 'expired' | 'revoked';
  usageCount: number;
}

const mockKeys: APIKey[] = [
  { id: '1', name: 'Payment Gateway Key', maskedKey: '****9a4f', environment: 'prod', scope: ['payments:read', 'payments:write'], createdAt: '2024-01-01', expiresAt: '2024-06-01', lastUsed: '2 min ago', status: 'active', usageCount: 45230 },
  { id: '2', name: 'Analytics API Key', maskedKey: '****b7c2', environment: 'prod', scope: ['analytics:read'], createdAt: '2024-01-15', expiresAt: '2024-07-15', lastUsed: '5 min ago', status: 'active', usageCount: 128940 },
  { id: '3', name: 'Notification Service Key', maskedKey: '****d8e1', environment: 'prod', scope: ['notifications:send'], createdAt: '2023-12-01', expiresAt: '2024-02-01', lastUsed: '1 hour ago', status: 'expiring', usageCount: 67890 },
  { id: '4', name: 'Dev Testing Key', maskedKey: '****f3a9', environment: 'dev', scope: ['*:read'], createdAt: '2024-01-10', expiresAt: '2024-04-10', lastUsed: '1 day ago', status: 'active', usageCount: 1234 },
  { id: '5', name: 'Legacy Integration Key', maskedKey: '****c5d7', environment: 'staging', scope: ['legacy:access'], createdAt: '2023-06-01', expiresAt: '2024-01-01', lastUsed: '30 days ago', status: 'expired', usageCount: 89 },
];

export function APIKeysRegistry() {
  const { toast } = useToast();
  const [keys, setKeys] = useState<APIKey[]>(mockKeys);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null);
  const [revokeConfirmation, setRevokeConfirmation] = useState('');
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyEnv, setNewKeyEnv] = useState<'dev' | 'staging' | 'prod'>('dev');

  const handleRevoke = () => {
    if (revokeConfirmation !== 'REVOKE') {
      toast({
        title: "Confirmation Required",
        description: "Type REVOKE to confirm key revocation.",
        variant: "destructive",
      });
      return;
    }

    if (selectedKey) {
      setKeys(prev => prev.map(k => 
        k.id === selectedKey.id ? { ...k, status: 'revoked' as const } : k
      ));
      toast({
        title: "Key Revoked",
        description: `API key ${selectedKey.maskedKey} has been revoked. Action logged.`,
      });
    }
    setShowRevokeDialog(false);
    setRevokeConfirmation('');
    setSelectedKey(null);
  };

  const handleRotate = (key: APIKey) => {
    toast({
      title: "Key Rotation Initiated",
      description: `New key will be generated for ${key.name}. Old key will expire in 24h.`,
    });
  };

  const handleCreate = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Name Required",
        description: "Please provide a name for the new API key.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Key Created",
      description: `New ${newKeyEnv.toUpperCase()} API key created. Check secure delivery channel.`,
    });
    setShowCreateDialog(false);
    setNewKeyName('');
    setNewKeyEnv('dev');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'expiring': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'revoked': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEnvBadge = (env: string) => {
    switch (env) {
      case 'prod': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'staging': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">API Keys Registry</h2>
          <p className="text-sm text-muted-foreground">Masked keys • Env-based • Rotation & expiry</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Plaintext View BLOCKED
          </Badge>
          <Button size="sm" onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Create Key
          </Button>
        </div>
      </div>

      {/* Security Notice */}
      <Card className="bg-destructive/5 border-destructive/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-destructive" />
            <div>
              <p className="font-semibold text-foreground">Zero Trust Key Management</p>
              <p className="text-sm text-muted-foreground">
                No hardcoded keys • Plaintext view blocked • All key operations logged • Wildcard (*) scopes blocked in production
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keys List */}
      <div className="space-y-3">
        {keys.map((key, index) => (
          <motion.div
            key={key.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`bg-card/50 border-border/50 ${
              key.status === 'expiring' ? 'border-amber-500/30' :
              key.status === 'expired' || key.status === 'revoked' ? 'border-red-500/30' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Key className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{key.name}</p>
                        <Badge variant="outline" className={getEnvBadge(key.environment)}>
                          {key.environment.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getStatusBadge(key.status)}>
                          {key.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {key.maskedKey}
                        </code>
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {key.scope.map((s, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Created: {key.createdAt}</span>
                        <span>Expires: {key.expiresAt}</span>
                        <span>Last used: {key.lastUsed}</span>
                        <span>Usage: {key.usageCount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {key.status !== 'revoked' && key.status !== 'expired' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRotate(key)}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Rotate
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedKey(key);
                          setShowRevokeDialog(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Revoke
                      </Button>
                    </div>
                  )}
                </div>

                {key.status === 'expiring' && (
                  <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-amber-300">Key expires soon. Consider rotating before expiry.</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revoke Dialog */}
      <Dialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
              <p className="text-sm text-destructive">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                This action cannot be undone. All services using this key will immediately lose access.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Revoking key: <code className="font-mono">{selectedKey?.maskedKey}</code> ({selectedKey?.name})
            </p>
            <div>
              <label className="text-sm font-medium">Type REVOKE to confirm</label>
              <Input
                placeholder="REVOKE"
                value={revokeConfirmation}
                onChange={(e) => setRevokeConfirmation(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRevokeDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRevoke}>Confirm Revocation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Key Name</label>
              <Input
                placeholder="e.g., Analytics Integration"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Environment</label>
              <Select value={newKeyEnv} onValueChange={(v: 'dev' | 'staging' | 'prod') => setNewKeyEnv(v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dev">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="prod">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground">
              <p>• Key will be delivered through secure channel</p>
              <p>• Plaintext visible only once during creation</p>
              <p>• Default expiry: 90 days (configurable)</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
