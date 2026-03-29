import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Link, MessageCircle, Mail, Phone, Plug,
  Eye, Settings, Check, AlertCircle, Loader2
} from 'lucide-react';
import { useLeadIntegrations, useUpdateLeadIntegration } from '@/hooks/useLeadData';
import { formatDistanceToNow } from 'date-fns';

const integrationIcons: Record<string, any> = {
  crm: Link, whatsapp: MessageCircle, email: Mail, call: Phone, form: Plug, webhook: Plug,
};

const LMIntegrations = () => {
  const { data: integrations, isLoading } = useLeadIntegrations();
  const updateIntegration = useUpdateLeadIntegration();

  const handleToggle = (id: string, current: boolean) => {
    updateIntegration.mutate({ id, updates: { is_active: !current, status: !current ? 'connected' : 'disconnected' } });
  };

  const connected = (integrations || []).filter((i: any) => i.status === 'connected').length;
  const total = (integrations || []).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground">Connect and manage third-party services</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
          {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : `${connected}/${total} Connected`}
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : total === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center text-muted-foreground">
            <Plug className="w-8 h-8 mx-auto mb-2" />
            <p>No integrations configured yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(integrations || []).map((integration: any, index: number) => {
            const Icon = integrationIcons[integration.integration_type] || Plug;
            const isConnected = integration.status === 'connected';
            return (
              <motion.div key={integration.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className={`bg-card border-border hover:border-primary/30 transition-colors ${integration.status === 'error' ? 'border-red-500/30' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isConnected ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                          <Icon className={`w-5 h-5 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{integration.name}</h3>
                          <p className="text-xs text-muted-foreground">{integration.integration_type}</p>
                        </div>
                      </div>
                      <Switch checked={integration.is_active} onCheckedChange={() => handleToggle(integration.id, integration.is_active)} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>{integration.last_sync_at ? `Last sync: ${formatDistanceToNow(new Date(integration.last_sync_at), { addSuffix: true })}` : 'Never synced'}</span>
                      <span>Records: {integration.sync_count || 0}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <Badge className={`text-xs ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {isConnected ? <><Check className="w-3 h-3 mr-1" /> Connected</> : <><AlertCircle className="w-3 h-3 mr-1" /> Disconnected</>}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="h-7 text-xs"><Eye className="w-3 h-3 mr-1" /> View</Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs"><Settings className="w-3 h-3 mr-1" /> Config</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LMIntegrations;
