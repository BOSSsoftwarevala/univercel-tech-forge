import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Link, MessageCircle, Mail, Phone, Plug,
  Eye, Settings, Check, AlertCircle
} from 'lucide-react';

const integrations = [
  { 
    id: 'crm', 
    name: 'CRM Sync', 
    icon: Link, 
    status: 'connected',
    description: 'Sync leads with your CRM system',
    lastSync: '5 mins ago',
    synced: 3412
  },
  { 
    id: 'whatsapp', 
    name: 'WhatsApp API', 
    icon: MessageCircle, 
    status: 'connected',
    description: 'Send WhatsApp messages to leads',
    lastSync: '2 mins ago',
    synced: 1892
  },
  { 
    id: 'email', 
    name: 'Email API', 
    icon: Mail, 
    status: 'connected',
    description: 'Automated email campaigns',
    lastSync: '10 mins ago',
    synced: 4521
  },
  { 
    id: 'call', 
    name: 'Call API', 
    icon: Phone, 
    status: 'connected',
    description: 'Click-to-call functionality',
    lastSync: '1 min ago',
    synced: 2341
  },
  { 
    id: 'form', 
    name: 'Website Form API', 
    icon: Plug, 
    status: 'error',
    description: 'Capture leads from website forms',
    lastSync: '1 hour ago',
    synced: 892
  },
];

const recentSyncs = [
  { id: 1, integration: 'CRM Sync', action: 'Lead exported', lead: 'Rahul Sharma', time: '2 mins ago', status: 'success' },
  { id: 2, integration: 'WhatsApp API', action: 'Message sent', lead: 'Priya Patel', time: '5 mins ago', status: 'success' },
  { id: 3, integration: 'Email API', action: 'Campaign triggered', lead: 'Bulk (45 leads)', time: '15 mins ago', status: 'success' },
  { id: 4, integration: 'Website Form', action: 'Lead captured', lead: 'Amit Kumar', time: '32 mins ago', status: 'error' },
];

const LMIntegrations = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground">Connect and manage third-party services</p>
        </div>
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
          4/5 Connected
        </Badge>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration, index) => {
          const Icon = integration.icon;
          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-card border-border hover:border-primary/30 transition-colors ${
                integration.status === 'error' ? 'border-red-500/30' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        integration.status === 'connected' ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          integration.status === 'connected' ? 'text-green-500' : 'text-red-500'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{integration.name}</h3>
                        <p className="text-xs text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    <Switch checked={integration.status === 'connected'} />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>Last sync: {integration.lastSync}</span>
                    <span>Records: {integration.synced}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <Badge 
                      className={`text-xs ${
                        integration.status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {integration.status === 'connected' ? (
                        <><Check className="w-3 h-3 mr-1" /> Connected</>
                      ) : (
                        <><AlertCircle className="w-3 h-3 mr-1" /> Error</>
                      )}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-7 text-xs">
                        <Eye className="w-3 h-3 mr-1" /> View
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs">
                        <Settings className="w-3 h-3 mr-1" /> Config
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Syncs */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle>Recent Sync Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-accent/50">
              <tr>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Integration</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Action</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Lead</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Time</th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentSyncs.map((sync, index) => (
                <motion.tr
                  key={sync.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border hover:bg-accent/30"
                >
                  <td className="p-3 font-medium text-foreground">{sync.integration}</td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">{sync.action}</Badge>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{sync.lead}</td>
                  <td className="p-3 text-xs text-muted-foreground">{sync.time}</td>
                  <td className="p-3">
                    <Badge 
                      className={`text-xs ${
                        sync.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {sync.status}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMIntegrations;
