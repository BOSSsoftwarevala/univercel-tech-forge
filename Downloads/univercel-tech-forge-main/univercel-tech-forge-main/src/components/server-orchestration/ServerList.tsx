/**
 * Server List - Simple controls only: Run, Stop, Pay/Renew
 * No tech details, no configuration
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, CreditCard, Server, CheckCircle, AlertTriangle } from 'lucide-react';
import { useEnterpriseAudit } from '@/hooks/useEnterpriseAudit';
import { toast } from '@/hooks/use-toast';

interface ServerItem {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'starting' | 'stopping';
  project: string;
  costPerDay: number;
  paymentStatus: 'paid' | 'due_soon' | 'overdue';
  daysRemaining: number;
}

const ServerList: React.FC = () => {
  const { logAction } = useEnterpriseAudit();
  
  const [servers, setServers] = useState<ServerItem[]>([
    { id: 'srv-001', name: 'Demo Server Alpha', status: 'running', project: 'Product Demo v2.1', costPerDay: 4.20, paymentStatus: 'paid', daysRemaining: 28 },
    { id: 'srv-002', name: 'Build Server Beta', status: 'running', project: 'Franchise Builder', costPerDay: 6.50, paymentStatus: 'paid', daysRemaining: 15 },
    { id: 'srv-003', name: 'Test Server Gamma', status: 'stopped', project: 'AI Testing Suite', costPerDay: 3.80, paymentStatus: 'due_soon', daysRemaining: 5 },
    { id: 'srv-004', name: 'Production Delta', status: 'running', project: 'Main Platform', costPerDay: 12.00, paymentStatus: 'paid', daysRemaining: 30 },
    { id: 'srv-005', name: 'Staging Epsilon', status: 'stopped', project: 'Staging Environment', costPerDay: 5.00, paymentStatus: 'overdue', daysRemaining: 0 },
  ]);

  const handleRunServer = async (serverId: string) => {
    setServers(prev => prev.map(s => 
      s.id === serverId ? { ...s, status: 'starting' as const } : s
    ));

    await logAction({
      action: 'server_start',
      module: 'server_orchestration',
      severity: 'medium',
      target_id: serverId,
      target_type: 'server',
    });

    // Simulate auto-start
    setTimeout(() => {
      setServers(prev => prev.map(s => 
        s.id === serverId ? { ...s, status: 'running' as const } : s
      ));
      toast({
        title: "Server Running",
        description: "AI has started and configured your server automatically.",
      });
    }, 2000);
  };

  const handleStopServer = async (serverId: string) => {
    setServers(prev => prev.map(s => 
      s.id === serverId ? { ...s, status: 'stopping' as const } : s
    ));

    await logAction({
      action: 'server_stop',
      module: 'server_orchestration',
      severity: 'medium',
      target_id: serverId,
      target_type: 'server',
    });

    setTimeout(() => {
      setServers(prev => prev.map(s => 
        s.id === serverId ? { ...s, status: 'stopped' as const } : s
      ));
      toast({
        title: "Server Stopped",
        description: "Server has been safely stopped. Data preserved.",
      });
    }, 1500);
  };

  const handlePayRenew = async (serverId: string) => {
    await logAction({
      action: 'server_payment_initiated',
      module: 'server_orchestration',
      severity: 'high',
      target_id: serverId,
      target_type: 'server',
    });

    toast({
      title: "Payment Portal",
      description: "Redirecting to payment...",
    });

    // Simulate payment success
    setTimeout(() => {
      setServers(prev => prev.map(s => 
        s.id === serverId ? { ...s, paymentStatus: 'paid' as const, daysRemaining: 30 } : s
      ));
      toast({
        title: "Payment Successful",
        description: "Server renewed for 30 days.",
      });
    }, 2000);
  };

  const getStatusBadge = (status: ServerItem['status']) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">Running</Badge>;
      case 'stopped':
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Stopped</Badge>;
      case 'starting':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse">Starting...</Badge>;
      case 'stopping':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse">Stopping...</Badge>;
    }
  };

  const getPaymentBadge = (status: ServerItem['paymentStatus'], days: number) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">{days} days left</Badge>;
      case 'due_soon':
        return <Badge variant="outline" className="text-amber-500 border-amber-500/30">{days} days left</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="text-destructive border-destructive/30">Payment Overdue</Badge>;
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Server className="h-5 w-5 text-primary" />
          Your Servers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {servers.map((server) => (
          <div
            key={server.id}
            className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${server.status === 'running' ? 'bg-emerald-500/20' : 'bg-muted'}`}>
                <Server className={`h-5 w-5 ${server.status === 'running' ? 'text-emerald-500' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <div className="font-medium text-foreground">{server.name}</div>
                <div className="text-sm text-muted-foreground">{server.project}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {getStatusBadge(server.status)}
              {getPaymentBadge(server.paymentStatus, server.daysRemaining)}
              
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">${server.costPerDay}/day</div>
              </div>

              <div className="flex gap-2">
                {server.status === 'stopped' && (
                  <Button
                    size="sm"
                    onClick={() => handleRunServer(server.id)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={server.paymentStatus === 'overdue'}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Run
                  </Button>
                )}
                
                {server.status === 'running' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStopServer(server.id)}
                    className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                  >
                    <Square className="h-4 w-4 mr-1" />
                    Stop
                  </Button>
                )}

                {(server.status === 'starting' || server.status === 'stopping') && (
                  <Button size="sm" disabled className="opacity-50">
                    Processing...
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePayRenew(server.id)}
                  className={server.paymentStatus === 'overdue' 
                    ? 'border-destructive text-destructive hover:bg-destructive/10' 
                    : 'border-primary/50 text-primary hover:bg-primary/10'
                  }
                >
                  <CreditCard className="h-4 w-4 mr-1" />
                  {server.paymentStatus === 'overdue' ? 'Pay Now' : 'Renew'}
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Info Banner */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <CheckCircle className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">
            AI automatically manages server configuration, scaling, and optimization. You only control Run, Stop, and Payment.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServerList;
