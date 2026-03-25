import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, RotateCcw, Clock, Shield, AlertTriangle, CheckCircle, Lock, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { serverManagerAPI } from '@/hooks/useServerManagerAPI';

interface Secret {
  id: string;
  name: string;
  type: 'api_key' | 'database' | 'certificate' | 'oauth' | 'encryption';
  environment: 'production' | 'staging' | 'all';
  maskedValue: string;
  lastRotated: string | null;
  expiresAt: string | null;
  rotationPolicy: string;
  status: 'active' | 'expiring_soon' | 'expired' | 'rotating';
}

interface SecretsResponse {
  secrets: Secret[];
}

export function SMSecrets() {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [rotatingSecret, setRotatingSecret] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadSecrets = async () => {
      try {
        const data = await serverManagerAPI.getSecretsOverview() as SecretsResponse;
        if (!cancelled) {
          setSecrets(data.secrets || []);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load secret inventory');
      }
    };

    void loadSecrets();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredSecrets = useMemo(
    () =>
      secrets.filter(
        (secret) =>
          secret.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          secret.type.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm, secrets],
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'expiring_soon':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'expired':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'rotating':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database':
        return 'DB';
      case 'api_key':
        return 'API';
      case 'certificate':
        return 'TLS';
      case 'oauth':
        return 'OIDC';
      case 'encryption':
        return 'KMS';
      default:
        return 'KEY';
    }
  };

  const handleRotate = async (secretId: string, secretName: string) => {
    try {
      setRotatingSecret(secretId);
      await serverManagerAPI.rotateSecret(secretId);
      setSecrets((current) =>
        current.map((secret) =>
          secret.id === secretId
            ? {
                ...secret,
                status: 'active',
                lastRotated: new Date().toISOString(),
              }
            : secret,
        ),
      );
      toast.success(`${secretName} rotation recorded`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to rotate secret');
    } finally {
      setRotatingSecret(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          Secrets Management
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-400">
            <Shield className="h-3 w-3 mr-1" />
            Encrypted at Rest
          </Badge>
        </div>
      </div>

      <Card className="bg-red-500/10 border-red-500/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm text-red-400">
            <Lock className="h-4 w-4" />
            <span>Secrets stay masked. Rotation updates inventory metadata and audit trail without exposing plaintext values.</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Input placeholder="Search secrets..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="max-w-xs" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">
            {secrets.filter((secret) => secret.status === 'expiring_soon').length} Expiring
          </Badge>
          <Badge variant="outline" className="bg-red-500/10 text-red-400">
            {secrets.filter((secret) => secret.status === 'expired').length} Expired
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        {filteredSecrets.map((secret) => (
          <Card key={secret.id} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-2 py-1 rounded bg-muted">{getTypeIcon(secret.type)}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{secret.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {secret.type.replace('_', ' ')}
                      </Badge>
                      <Badge className={secret.environment === 'production' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}>
                        {secret.environment}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(rotatingSecret === secret.id ? 'rotating' : secret.status)}>
                  {rotatingSecret === secret.id && <RotateCcw className="h-3 w-3 mr-1 animate-spin" />}
                  {rotatingSecret !== secret.id && secret.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {rotatingSecret !== secret.id && secret.status === 'expiring_soon' && <Clock className="h-3 w-3 mr-1" />}
                  {rotatingSecret !== secret.id && secret.status === 'expired' && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {(rotatingSecret === secret.id ? 'rotating' : secret.status).toUpperCase().replace('_', ' ')}
                </Badge>
              </div>

              <div className="bg-muted/50 p-2 rounded font-mono text-sm mb-3">{secret.maskedValue}</div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">Last Rotated:</span>
                  <span className="ml-2">{secret.lastRotated || 'Never'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Expires:</span>
                  <span className={`ml-2 ${secret.status === 'expired' ? 'text-red-400' : secret.status === 'expiring_soon' ? 'text-yellow-400' : ''}`}>
                    {secret.expiresAt || 'Manual'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Policy:</span>
                  <span className="ml-2">{secret.rotationPolicy}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <Button size="sm" variant="outline" onClick={() => handleRotate(secret.id, secret.name)} disabled={rotatingSecret === secret.id} className="text-xs">
                  <RotateCcw className={`h-3 w-3 mr-1 ${rotatingSecret === secret.id ? 'animate-spin' : ''}`} />
                  Rotate
                </Button>
                <Button size="sm" variant="outline" className="text-xs text-muted-foreground" disabled>
                  <EyeOff className="h-3 w-3 mr-1" />
                  View (Masked)
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {!filteredSecrets.length && (
          <Card className="bg-card border-border">
            <CardContent className="py-8 text-sm text-center text-muted-foreground">
              No secret inventory records found.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}