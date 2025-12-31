import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, CreditCard, Power, AlertTriangle, Shield, Eye, Clock, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp' | 'payment';
  status: 'enabled' | 'disabled' | 'error';
  accessLevel: 'full' | 'read-only';
  lastSync: string;
  requestsToday: number;
  errorsToday: number;
  hasKillSwitch: boolean;
}

const mockIntegrations: Integration[] = [
  { id: '1', name: 'Email Service (SendGrid)', type: 'email', status: 'enabled', accessLevel: 'full', lastSync: '2 min ago', requestsToday: 12500, errorsToday: 3, hasKillSwitch: true },
  { id: '2', name: 'SMS Gateway (Twilio)', type: 'sms', status: 'enabled', accessLevel: 'full', lastSync: '5 min ago', requestsToday: 4500, errorsToday: 12, hasKillSwitch: true },
  { id: '3', name: 'WhatsApp Business', type: 'whatsapp', status: 'enabled', accessLevel: 'full', lastSync: '1 min ago', requestsToday: 8920, errorsToday: 0, hasKillSwitch: true },
  { id: '4', name: 'Payment Gateway (Stripe)', type: 'payment', status: 'enabled', accessLevel: 'read-only', lastSync: '30 sec ago', requestsToday: 3200, errorsToday: 2, hasKillSwitch: true },
  { id: '5', name: 'Payment Gateway (Razorpay)', type: 'payment', status: 'enabled', accessLevel: 'read-only', lastSync: '1 min ago', requestsToday: 1890, errorsToday: 0, hasKillSwitch: true },
];

export function IntegrationControls() {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [showKillSwitch, setShowKillSwitch] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-5 h-5 text-blue-400" />;
      case 'sms': return <Phone className="w-5 h-5 text-emerald-400" />;
      case 'whatsapp': return <MessageSquare className="w-5 h-5 text-green-400" />;
      case 'payment': return <CreditCard className="w-5 h-5 text-amber-400" />;
      default: return <Zap className="w-5 h-5 text-primary" />;
    }
  };

  const handleToggle = (integration: Integration) => {
    if (integration.status === 'enabled') {
      setSelectedIntegration(integration);
      setShowKillSwitch(true);
    } else {
      setIntegrations(prev => prev.map(i => 
        i.id === integration.id ? { ...i, status: 'enabled' as const } : i
      ));
      toast({
        title: "Integration Enabled",
        description: `${integration.name} has been enabled. Action logged.`,
      });
    }
  };

  const handleKillSwitch = () => {
    if (selectedIntegration) {
      setIntegrations(prev => prev.map(i => 
        i.id === selectedIntegration.id ? { ...i, status: 'disabled' as const } : i
      ));
      toast({
        title: "Kill Switch Activated",
        description: `${selectedIntegration.name} has been disabled immediately. All pending requests cancelled.`,
        variant: "destructive",
      });
    }
    setShowKillSwitch(false);
    setSelectedIntegration(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Integration Controls</h2>
          <p className="text-sm text-muted-foreground">Email / SMS / WhatsApp / Payment • Kill switch required</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400">
          <Power className="w-3 h-3" />
          {integrations.filter(i => i.status === 'enabled').length} Active
        </Badge>
      </div>

      {/* Payment Read-Only Notice */}
      <Card className="bg-amber-500/5 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-amber-400" />
            <div>
              <p className="font-semibold text-foreground">Payment Integrations: READ-ONLY</p>
              <p className="text-sm text-muted-foreground">
                Payment gateway access is limited to read-only. Transaction initiation requires Finance role approval.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations List */}
      <div className="space-y-4">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`bg-card/50 border-border/50 ${
              integration.status === 'disabled' ? 'opacity-60' :
              integration.status === 'error' ? 'border-red-500/30' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      {getTypeIcon(integration.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{integration.name}</span>
                        <Badge variant="outline" className={
                          integration.status === 'enabled' ? 'bg-emerald-500/20 text-emerald-400' :
                          integration.status === 'error' ? 'bg-red-500/20 text-red-400' :
                          'bg-muted text-muted-foreground'
                        }>
                          {integration.status.toUpperCase()}
                        </Badge>
                        {integration.accessLevel === 'read-only' && (
                          <Badge variant="outline" className="bg-amber-500/20 text-amber-400">
                            <Eye className="w-3 h-3 mr-1" />
                            READ-ONLY
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Last sync: {integration.lastSync}</span>
                        </div>
                        <span>Requests: {integration.requestsToday.toLocaleString()}</span>
                        <span className={integration.errorsToday > 10 ? 'text-red-400' : ''}>
                          Errors: {integration.errorsToday}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {integration.hasKillSwitch && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {integration.status === 'enabled' ? 'Enabled' : 'Disabled'}
                        </span>
                        <Switch
                          checked={integration.status === 'enabled'}
                          onCheckedChange={() => handleToggle(integration)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Security Tests Blocked Notice */}
      <Card className="bg-destructive/5 border-destructive/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-destructive" />
            <div>
              <p className="font-semibold text-foreground">Security Tests: BLOCKED APIs</p>
              <ul className="text-sm text-muted-foreground mt-1">
                <li>• View raw keys: BLOCKED</li>
                <li>• Pricing/payout APIs: BLOCKED</li>
                <li>• Admin APIs: BLOCKED</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kill Switch Dialog */}
      <Dialog open={showKillSwitch} onOpenChange={setShowKillSwitch}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Power className="w-5 h-5" />
              Activate Kill Switch
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <p className="text-sm text-destructive font-medium">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                This will immediately disable {selectedIntegration?.name} and cancel all pending requests.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              This action is logged and may require approval to re-enable.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowKillSwitch(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleKillSwitch}>
              <Power className="w-4 h-4 mr-1" />
              Activate Kill Switch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
