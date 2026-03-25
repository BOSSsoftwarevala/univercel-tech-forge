import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, Play, Pause, ArrowUp, ArrowDown, Calendar, Clock,
  CheckCircle, AlertTriangle, XCircle, DollarSign, User, Server,
  Package, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const subscriptions = [
  {
    id: 'SUB-001',
    client: 'Acme Corp',
    product: 'Enterprise Server Plan',
    type: 'server',
    cycle: 'monthly',
    amount: 299,
    nextBilling: '2025-01-01',
    status: 'active',
    autoRenew: true,
    startDate: '2024-01-01',
  },
  {
    id: 'SUB-002',
    client: 'TechStart Inc',
    product: 'Pro Demo License',
    type: 'demo',
    cycle: 'yearly',
    amount: 1999,
    nextBilling: '2025-06-15',
    status: 'active',
    autoRenew: true,
    startDate: '2024-06-15',
  },
  {
    id: 'SUB-003',
    client: 'DataFlow Ltd',
    product: 'Business Plan',
    type: 'product',
    cycle: 'monthly',
    amount: 149,
    nextBilling: '2025-01-05',
    status: 'trial',
    autoRenew: false,
    startDate: '2024-12-05',
    trialEnds: '2025-01-05',
  },
  {
    id: 'SUB-004',
    client: 'CloudBase Pro',
    product: 'API Access',
    type: 'api',
    cycle: 'monthly',
    amount: 99,
    nextBilling: '2024-12-28',
    status: 'expiring',
    autoRenew: false,
    startDate: '2024-01-28',
  },
  {
    id: 'SUB-005',
    client: 'StartupXYZ',
    product: 'Starter Server',
    type: 'server',
    cycle: 'monthly',
    amount: 49,
    nextBilling: '2024-12-20',
    status: 'paused',
    autoRenew: true,
    startDate: '2024-06-20',
    pausedAt: '2024-12-01',
  },
];

const SubscriptionsScreen = () => {
  const [subs, setSubs] = useState(subscriptions);
  const [activeTab, setActiveTab] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'trial': return 'bg-blue-500/20 text-blue-400';
      case 'expiring': return 'bg-amber-500/20 text-amber-400';
      case 'paused': return 'bg-slate-500/20 text-slate-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'server': return Server;
      case 'demo': return Package;
      case 'api': return Zap;
      default: return Package;
    }
  };

  const toggleAutoRenew = (subId: string) => {
    setSubs(subs.map(s => s.id === subId ? { ...s, autoRenew: !s.autoRenew } : s));
    toast.success('Auto-renew setting updated');
  };

  const handleAction = (action: string, sub: typeof subscriptions[0]) => {
    switch (action) {
      case 'pause':
        toast.success(`Subscription ${sub.id} paused`);
        break;
      case 'resume':
        toast.success(`Subscription ${sub.id} resumed`);
        break;
      case 'upgrade':
        toast.info(`Opening upgrade options for ${sub.product}`);
        break;
      case 'cancel':
        toast.success(`Subscription ${sub.id} cancelled`);
        break;
      case 'extend':
        toast.success(`Trial extended for ${sub.client}`);
        break;
    }
  };

  const filteredSubs = activeTab === 'all' 
    ? subs 
    : subs.filter(s => s.status === activeTab);

  const stats = {
    active: subs.filter(s => s.status === 'active').length,
    trial: subs.filter(s => s.status === 'trial').length,
    expiring: subs.filter(s => s.status === 'expiring').length,
    mrr: subs.filter(s => s.status === 'active' && s.cycle === 'monthly').reduce((acc, s) => acc + s.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <RefreshCw className="w-6 h-6 text-emerald-400" />
          Subscriptions
        </h2>
        <p className="text-slate-400">Manage recurring billing and subscriptions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
                <p className="text-xs text-slate-400">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.trial}</p>
                <p className="text-xs text-slate-400">On Trial</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.expiring}</p>
                <p className="text-xs text-slate-400">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-emerald-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-white">${stats.mrr}</p>
                <p className="text-xs text-slate-400">Monthly MRR</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800/50">
          <TabsTrigger value="all">All ({subs.length})</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="trial">Trial</TabsTrigger>
          <TabsTrigger value="expiring">Expiring</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {filteredSubs.map((sub) => {
                    const TypeIcon = getTypeIcon(sub.type);
                    return (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 rounded-xl bg-slate-800/50 border border-slate-700"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/20">
                              <TypeIcon className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-white">{sub.product}</h4>
                                <Badge className={getStatusColor(sub.status)}>{sub.status}</Badge>
                              </div>
                              <p className="text-sm text-slate-400">{sub.client}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Next: {sub.nextBilling}
                                </span>
                                <span className="capitalize">{sub.cycle}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-bold text-white">${sub.amount}</p>
                            <p className="text-xs text-slate-400">/{sub.cycle === 'monthly' ? 'mo' : 'yr'}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-slate-400">Auto-renew</span>
                              <Switch 
                                checked={sub.autoRenew} 
                                onCheckedChange={() => toggleAutoRenew(sub.id)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-700">
                          {sub.status === 'active' && (
                            <>
                              <Button size="sm" variant="outline" className="border-slate-600" onClick={() => handleAction('upgrade', sub)}>
                                <ArrowUp className="w-3 h-3 mr-1" />
                                Upgrade
                              </Button>
                              <Button size="sm" variant="outline" className="border-slate-600" onClick={() => handleAction('pause', sub)}>
                                <Pause className="w-3 h-3 mr-1" />
                                Pause
                              </Button>
                            </>
                          )}
                          {sub.status === 'paused' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleAction('resume', sub)}>
                              <Play className="w-3 h-3 mr-1" />
                              Resume
                            </Button>
                          )}
                          {sub.status === 'trial' && (
                            <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-400" onClick={() => handleAction('extend', sub)}>
                              <Clock className="w-3 h-3 mr-1" />
                              Extend Trial
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => handleAction('cancel', sub)}>
                            <XCircle className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionsScreen;
