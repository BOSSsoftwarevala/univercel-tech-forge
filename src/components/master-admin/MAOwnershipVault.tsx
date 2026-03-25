import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KeyRound, Eye, EyeOff, RefreshCw, Ban, Lock, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface VaultKey {
  id: string;
  name: string;
  type: 'master' | 'encryption' | 'recovery';
  lastRotated: Date;
  masked: string;
}

interface MAOwnershipVaultProps {
  onExportAttempt: () => boolean;
}

const MAOwnershipVault = ({ onExportAttempt }: MAOwnershipVaultProps) => {
  const [keys] = useState<VaultKey[]>([
    {
      id: 'key-001',
      name: 'Master API Key',
      type: 'master',
      lastRotated: new Date(Date.now() - 86400000 * 30),
      masked: '••••••••••••••••',
    },
    {
      id: 'key-002',
      name: 'Encryption Root Key',
      type: 'encryption',
      lastRotated: new Date(Date.now() - 86400000 * 7),
      masked: '••••••••••••••••',
    },
    {
      id: 'key-003',
      name: 'Recovery Secret',
      type: 'recovery',
      lastRotated: new Date(Date.now() - 86400000 * 90),
      masked: '••••••••••••••••',
    },
  ]);

  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const toggleKeyVisibility = (keyId: string) => {
    // In production, this would require additional MFA verification
    toast.warning('Key visibility is restricted to masked values only');
  };

  const handleExportAttempt = () => {
    const blocked = onExportAttempt();
    if (!blocked) {
      toast.error('BLOCKED: Vault keys cannot be exported');
    }
  };

  const handleRotateKey = (keyId: string) => {
    toast.success('Key rotation initiated - requires dual authorization');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'master': return 'bg-purple-500/20 text-purple-400';
      case 'encryption': return 'bg-blue-500/20 text-blue-400';
      case 'recovery': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" />
            Ownership Vault
          </CardTitle>
          <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
            <Lock className="w-3 h-3 mr-1" />
            Master Only
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {keys.map((key) => (
            <div
              key={key.id}
              className="p-4 rounded-lg bg-background/50 border border-border/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className={`w-5 h-5 ${
                    key.type === 'master' ? 'text-purple-400' :
                    key.type === 'encryption' ? 'text-blue-400' :
                    'text-amber-400'
                  }`} />
                  <div>
                    <p className="font-medium">{key.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={getTypeColor(key.type)}>
                        {key.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Rotated {key.lastRotated.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <code className="font-mono text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded">
                    {key.masked}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleKeyVisibility(key.id)}
                  >
                    {visibleKeys.has(key.id) ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRotateKey(key.id)}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              variant="outline"
              className="opacity-50 cursor-not-allowed"
              onClick={handleExportAttempt}
            >
              <Ban className="w-4 h-4 mr-2" />
              Export Keys (Blocked)
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Rotate All Keys
            </Button>
          </div>

          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
            <Lock className="w-4 h-4 inline mr-2" />
            Keys are displayed masked only. No plaintext access. No export allowed.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MAOwnershipVault;
