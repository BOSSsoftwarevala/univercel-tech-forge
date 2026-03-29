import React from 'react';
import { Zap, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const APIIntegrations: React.FC = () => {
  const integrations = [
    { name: 'Stripe', type: 'Payment', status: 'connected', health: 'healthy', lastCheck: '1 min ago' },
    { name: 'Twilio', type: 'SMS', status: 'connected', health: 'healthy', lastCheck: '2 min ago' },
    { name: 'SendGrid', type: 'Email', status: 'connected', health: 'warning', lastCheck: '5 min ago' },
    { name: 'Salesforce', type: 'CRM', status: 'connected', health: 'healthy', lastCheck: '3 min ago' },
    { name: 'WhatsApp Business', type: 'Messaging', status: 'disconnected', health: 'error', lastCheck: '1 hour ago' },
    { name: 'AWS S3', type: 'Storage', status: 'connected', health: 'healthy', lastCheck: '1 min ago' },
  ];

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Integrations</h2>
        <p className="text-muted-foreground">Third-party service connections and health status</p>
      </div>

      {/* Integration Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-400">5</p>
            <p className="text-sm text-muted-foreground">Connected</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-400">1</p>
            <p className="text-sm text-muted-foreground">Disconnected</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400">1</p>
            <p className="text-sm text-muted-foreground">Warning</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">4</p>
            <p className="text-sm text-muted-foreground">Types</p>
          </CardContent>
        </Card>
      </div>

      {/* Integrations Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-400" />
            Service Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 text-muted-foreground font-medium">Service Name</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Type</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Health</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Last Check</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {integrations.map((integration, index) => (
                  <tr key={index} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="p-3 font-medium text-foreground">{integration.name}</td>
                    <td className="p-3">
                      <Badge variant="outline">{integration.type}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={integration.status === 'connected' ? 'default' : 'destructive'}>
                        {integration.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getHealthIcon(integration.health)}
                        <span className={`text-sm ${
                          integration.health === 'healthy' ? 'text-green-400' :
                          integration.health === 'warning' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {integration.health}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{integration.lastCheck}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="text-blue-400 border-blue-400/50">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Test
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

export default APIIntegrations;
