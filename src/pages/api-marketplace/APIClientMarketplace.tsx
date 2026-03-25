import { useEffect, useState } from 'react';
import {
  RefreshCw,
  Wallet,
  ShoppingCart,
  KeyRound,
  Bell,
  Play,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ClientSubscription,
  MarketplaceAlert,
  MarketplaceApi,
  WalletInfo,
  addClientMoney,
  buyClientApi,
  getClientAlertDetail,
  getClientAlerts,
  getClientCatalog,
  getClientSubscriptions,
  markClientAlertRead,
  testClientSubscription,
} from '@/lib/api/ai-api-marketplace';

const APIClientMarketplace = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [catalog, setCatalog] = useState<MarketplaceApi[]>([]);
  const [subscriptions, setSubscriptions] = useState<ClientSubscription[]>([]);
  const [alerts, setAlerts] = useState<MarketplaceAlert[]>([]);
  const [selectedApi, setSelectedApi] = useState<MarketplaceApi | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<MarketplaceAlert | null>(null);
  const [planType, setPlanType] = useState<'daily' | 'monthly' | 'per_use'>('daily');
  const [usageLimit, setUsageLimit] = useState('100');
  const [addMoneyAmount, setAddMoneyAmount] = useState('1000');
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [latestKey, setLatestKey] = useState<string | null>(null);

  const loadData = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    try {
      const [catalogResponse, subscriptionsResponse, alertsResponse] = await Promise.all([
        getClientCatalog(),
        getClientSubscriptions(),
        getClientAlerts(),
      ]);

      setWallet(catalogResponse.data.wallet);
      setCatalog(catalogResponse.data.items || []);
      setSubscriptions(subscriptionsResponse.data.items || []);
      setAlerts(alertsResponse.data.items || []);
    } catch (error) {
      console.error('Failed to load client API marketplace', error);
      toast.error('Failed to load API marketplace');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadData();
    const interval = window.setInterval(() => {
      void loadData(true);
    }, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    await loadData(true);
    toast.success('Marketplace refreshed');
  };

  const openBuy = (api: MarketplaceApi) => {
    setSelectedApi(api);
    setPlanType('daily');
    setUsageLimit(String(Math.min(api.max_limit || 100, 1000)));
    setBuyDialogOpen(true);
  };

  const confirmBuy = async () => {
    if (!selectedApi) return;
    try {
      const response = await buyClientApi({
        api_id: selectedApi.id,
        plan_type: planType,
        usage_limit: Number(usageLimit),
      });
      setLatestKey(response.data.api_key);
      setBuyDialogOpen(false);
      toast.success(`API key generated for ${selectedApi.name}`);
      await loadData(true);
    } catch (error) {
      console.error('Failed to buy API', error);
      toast.error(error instanceof Error ? error.message : 'Failed to buy API');
    }
  };

  const addMoney = async () => {
    try {
      await addClientMoney(Number(addMoneyAmount));
      setWalletDialogOpen(false);
      toast.success('Wallet updated');
      await loadData(true);
    } catch (error) {
      console.error('Failed to add money', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add money');
    }
  };

  const testUsage = async (subscription: ClientSubscription) => {
    try {
      const response = await testClientSubscription(subscription.id, {
        request_count: 1,
        tokens_used: subscription.service.type === 'ai' ? 150 : 0,
        source: 'client-dashboard',
      });
      toast.success(`${response.data.service_name} billed ₹${response.data.cost.toFixed(4)} and updated usage`);
      await loadData(true);
    } catch (error) {
      console.error('Failed to test API usage', error);
      toast.error(error instanceof Error ? error.message : 'Failed to test API usage');
    }
  };

  const openAlert = async (alert: MarketplaceAlert) => {
    try {
      const response = await getClientAlertDetail(alert.id);
      setSelectedAlert(response.data.item);
      setAlertDialogOpen(true);
      if (!alert.is_read) {
        await markClientAlertRead(alert.id);
        await loadData(true);
      }
    } catch (error) {
      console.error('Failed to open alert details', error);
      toast.error(error instanceof Error ? error.message : 'Failed to open alert details');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/95 px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">API Marketplace</h1>
            <p className="text-sm text-muted-foreground">Buy API access, receive keys, track usage, and auto-bill from wallet.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setWalletDialogOpen(true)} className="gap-2">
              <Wallet className="h-4 w-4" />
              Add Money
            </Button>
            <Button variant="outline" onClick={refresh} className="gap-2" disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50 bg-card/60">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Wallet Balance</p>
                  <p className="text-3xl font-bold text-foreground">₹{wallet?.available_balance?.toFixed(2) ?? '0.00'}</p>
                </div>
                <Wallet className="h-8 w-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/60">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Keys</p>
                  <p className="text-3xl font-bold text-foreground">{subscriptions.filter((item) => item.status === 'active').length}</p>
                </div>
                <KeyRound className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/60">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread Alerts</p>
                  <p className="text-3xl font-bold text-foreground">{alerts.filter((item) => !item.is_read).length}</p>
                </div>
                <Bell className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {latestKey ? (
          <Card className="border-emerald-500/30 bg-emerald-500/10">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-foreground">Latest generated API key</p>
              <p className="mt-1 break-all font-mono text-sm text-emerald-700 dark:text-emerald-300">{latestKey}</p>
            </CardContent>
          </Card>
        ) : null}

        <Tabs defaultValue="catalog">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="catalog">Buy API</TabsTrigger>
            <TabsTrigger value="subscriptions">My Keys</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-4 pt-4">
            {loading ? <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">Loading catalog...</CardContent></Card> : null}
            <div className="grid gap-4 lg:grid-cols-2">
              {catalog.map((api) => (
                <Card key={api.id} className="border-border/50 bg-card/60">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-lg">{api.name}</CardTitle>
                      <Badge variant="outline">{api.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{api.provider} • {api.speed_mode} speed • Limit {api.max_limit.toLocaleString()}</p>
                    <div className="grid gap-3 md:grid-cols-3">
                      <InfoTile title="Per Request" value={`₹${api.price_per_request.toFixed(2)}`} />
                      <InfoTile title="Per Token" value={`₹${api.price_per_token.toFixed(4)}`} />
                      <InfoTile title="Status" value={api.is_enabled ? 'Enabled' : 'Disabled'} />
                    </div>
                    <Button onClick={() => openBuy(api)} className="w-full gap-2" disabled={!api.is_enabled}>
                      <ShoppingCart className="h-4 w-4" />
                      Buy API
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-4 pt-4">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} className="border-border/50 bg-card/60">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">{subscription.service.name}</h3>
                        <Badge variant="outline">{subscription.plan_type}</Badge>
                        <Badge variant="outline">{subscription.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Key: {subscription.api_key?.masked_key || 'Not generated'}</p>
                      <div className="grid gap-2 md:grid-cols-4">
                        <InfoTile title="Usage" value={`${subscription.usage_count}/${subscription.usage_limit}`} />
                        <InfoTile title="Balance Impact" value={`₹${subscription.service.price_per_request.toFixed(2)} / req`} />
                        <InfoTile title="Expiry" value={subscription.expiry_at ? new Date(subscription.expiry_at).toLocaleDateString() : 'No expiry'} />
                        <InfoTile title="Last Used" value={subscription.last_used_at ? new Date(subscription.last_used_at).toLocaleString() : 'Never'} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => testUsage(subscription)} className="gap-2">
                        <Play className="h-4 w-4" />
                        Use API
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!loading && subscriptions.length === 0 ? <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">No API subscriptions yet.</CardContent></Card> : null}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4 pt-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className="border-border/50 bg-card/60">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{alert.title}</h3>
                        <Badge variant="outline">{alert.severity}</Badge>
                        <Badge variant={alert.is_read ? 'secondary' : 'default'}>{alert.is_read ? 'Read' : 'Unread'}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{alert.api_name} • {new Date(alert.created_at).toLocaleString()}</p>
                    </div>
                    <Button variant="outline" onClick={() => openAlert(alert)} className="gap-2">
                      <Eye className="h-4 w-4" />
                      Open
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!loading && alerts.length === 0 ? <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">No alerts available.</CardContent></Card> : null}
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy {selectedApi?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={planType} onValueChange={(value) => setPlanType(value as 'daily' | 'monthly' | 'per_use')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="per_use">Per Use</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage limit</Label>
              <Input id="usageLimit" type="number" value={usageLimit} onChange={(event) => setUsageLimit(event.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBuyDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmBuy}>Confirm Purchase</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={walletDialogOpen} onOpenChange={setWalletDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Money</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="walletAmount">Amount</Label>
            <Input id="walletAmount" type="number" value={addMoneyAmount} onChange={(event) => setAddMoneyAmount(event.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWalletDialogOpen(false)}>Cancel</Button>
            <Button onClick={addMoney}>Update Wallet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAlert?.title || 'Alert detail'}</DialogTitle>
          </DialogHeader>
          {selectedAlert ? (
            <div className="space-y-3 text-sm">
              <p className="text-foreground">{selectedAlert.message}</p>
              <InfoTile title="Severity" value={selectedAlert.severity} />
              <InfoTile title="Type" value={selectedAlert.alert_type} />
              <InfoTile title="API" value={selectedAlert.api_name || 'Unknown API'} />
              <InfoTile title="Created" value={new Date(selectedAlert.created_at).toLocaleString()} />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

function InfoTile({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-background/70 p-3">
      <p className="text-xs uppercase text-muted-foreground">{title}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export default APIClientMarketplace;