import React from 'react';
import { KeyRound, Plus, RotateCcw, Ban, Eye, EyeOff, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const APIKeys: React.FC = () => {
  const apiKeys = [
    { id: 'key_***a1b2', scope: 'Payment Gateway', status: 'active', lastUsed: '2 min ago', rateLimit: '1000/min' },
    { id: 'key_***c3d4', scope: 'SMS Service', status: 'active', lastUsed: '5 min ago', rateLimit: '500/min' },
    { id: 'key_***e5f6', scope: 'Email Service', status: 'active', lastUsed: '10 min ago', rateLimit: '200/min' },
    { id: 'key_***g7h8', scope: 'CRM Integration', status: 'inactive', lastUsed: '3 days ago', rateLimit: '100/min' },
    { id: 'key_***i9j0', scope: 'AI Gateway', status: 'active', lastUsed: '1 min ago', rateLimit: '50/min' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">API Keys</h2>
          <p className="text-muted-foreground">Manage API keys and access credentials</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Key (Approval Required)
        </Button>
      </div>

      {/* Security Notice */}
      <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="font-medium text-yellow-400">Keys Masked for Security</p>
              <p className="text-sm text-muted-foreground">
                All key values are masked. Key creation, rotation, and disabling require approval.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keys Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-blue-400" />
            Active API Keys
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 text-muted-foreground font-medium">Key ID</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Scope</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Last Used</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Rate Limit</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => (
                  <tr key={key.id} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-3 font-mono text-foreground">{key.id}</td>
                    <td className="p-3 text-foreground">{key.scope}</td>
                    <td className="p-3">
                      <Badge variant={key.status === 'active' ? 'default' : 'secondary'}>
                        {key.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{key.lastUsed}</td>
                    <td className="p-3 text-muted-foreground font-mono">{key.rateLimit}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-blue-400 border-blue-400/50">
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Rotate
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-400 border-red-400/50">
                          <Ban className="h-3 w-3 mr-1" />
                          Disable
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIKeys;
