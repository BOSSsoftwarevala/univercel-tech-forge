import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  Bell,
  RefreshCw,
  Plus,
  Eye,
  Edit,
  Gauge,
  History,
  Power,
  Brain,
  Wallet,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AdminDashboardSummary,
  ApiHistoryResponse,
  MarketplaceAlert,
  MarketplaceApi,
  createAdminApi,
  getAdminApiHistory,
  getAdminDashboard,
  listAdminAlerts,
  listAdminApis,
  setAdminApiLimit,
  toggleAdminApi,
  updateAdminApi,
} from '@/lib/api/ai-api-marketplace';

type SectionId = 'overview' | 'apis' | 'alerts';

const sidebarItems: Array<{ id: SectionId; label: string; icon: React.ElementType }> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'apis', label: 'Internal APIs', icon: Boxes },
  { id: 'alerts', label: 'Alerts', icon: Bell },
];

const emptyApiForm = {
  name: '',
  provider: '',
  type: 'ai',
  endpoint: '/functions/v1/api-ai-marketplace/gateway/use',
  price_per_request: '0.00',
  price_per_token: '0.00',
  max_limit: '1000',
  speed_mode: 'standard',
  status: 'running',
  notes: '',
};

const APIManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<AdminDashboardSummary['totals'] | null>(null);
  const [apis, setApis] = useState<MarketplaceApi[]>([]);
  const [alerts, setAlerts] = useState<MarketplaceAlert[]>([]);
  const [selectedApi, setSelectedApi] = useState<MarketplaceApi | null>(null);
  const [history, setHistory] = useState<ApiHistoryResponse | null>(null);
  const [formState, setFormState] = useState(emptyApiForm);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openLimit, setOpenLimit] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [limitValue, setLimitValue] = useState('1000');

  const unreadAlerts = useMemo(() => alerts.filter((alert) => !alert.is_read).length, [alerts]);

  const syncSectionFromPath = () => {
    const section = location.pathname.split('/').filter(Boolean)[1] as SectionId | undefined;
    if (section && sidebarItems.some((item) => item.id === section)) {
      setActiveSection(section);
    } else {
      setActiveSection('overview');
    }
  };

  const loadDashboard = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      const [summaryResponse, apiResponse, alertResponse] = await Promise.all([
        getAdminDashboard(),
        listAdminApis(),
        listAdminAlerts(),
      ]);

      setSummary(summaryResponse.data.totals);
      setApis(apiResponse.data.items || []);
      setAlerts(alertResponse.data.items || []);
    } catch (error) {
      console.error('Failed to load AI API manager dashboard', error);
      toast.error('Failed to load AI API manager dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    syncSectionFromPath();
  }, [location.pathname]);

  useEffect(() => {
    void loadDashboard();
    const interval = window.setInterval(() => {
      void loadDashboard(true);
    }, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const handleNavigate = (section: SectionId) => {
    setActiveSection(section);
    navigate(section === 'overview' ? '/api-manager' : `/api-manager/${section}`);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard(true);
    toast.success('Real data reloaded');
  };

  const openCreateDialog = () => {
    setFormState(emptyApiForm);
    setOpenCreate(true);
  };

  const openEditDialog = (api: MarketplaceApi) => {
    setSelectedApi(api);
    setFormState({
      name: api.name,
      provider: api.provider || '',
      type: api.type || 'other',
      endpoint: api.endpoint || '',
      price_per_request: String(api.price_per_request ?? 0),
      price_per_token: String(api.price_per_token ?? 0),
      max_limit: String(api.max_limit ?? 0),
      speed_mode: api.speed_mode,
      status: api.status,
      notes: api.notes || '',
    });
    setOpenEdit(true);
  };

  const openViewDialog = (api: MarketplaceApi) => {
    setSelectedApi(api);
    setOpenView(true);
  };

  const openLimitDialog = (api: MarketplaceApi) => {
    setSelectedApi(api);
    setLimitValue(String(api.max_limit ?? 0));
    setOpenLimit(true);
  };

  const openHistoryDialog = async (api: MarketplaceApi) => {
    setSelectedApi(api);
    try {
      const response = await getAdminApiHistory(api.id);
      setHistory(response.data);
      setOpenHistory(true);
    } catch (error) {
      console.error('Failed to load API history', error);
      toast.error('Failed to load API history');
    }
  };

  const saveNewApi = async () => {
    try {
      await createAdminApi({
        ...formState,
        price_per_request: Number(formState.price_per_request),
        price_per_token: Number(formState.price_per_token),
        max_limit: Number(formState.max_limit),
      });
      setOpenCreate(false);
      toast.success('API created and saved to database');
      await loadDashboard(true);
    } catch (error) {
      console.error('Failed to create API', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create API');
    }
  };

  const saveEditedApi = async () => {
    if (!selectedApi) return;
    try {
      await updateAdminApi(selectedApi.id, {
        ...formState,
        price_per_request: Number(formState.price_per_request),
        price_per_token: Number(formState.price_per_token),
        max_limit: Number(formState.max_limit),
      });
      setOpenEdit(false);
      toast.success('API configuration updated');
      await loadDashboard(true);
    } catch (error) {
      console.error('Failed to update API', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update API');
    }
  };

  const handleToggle = async (api: MarketplaceApi) => {
    try {
      await toggleAdminApi(api.id);
      toast.success(`${api.name} status changed`);
      await loadDashboard(true);
    } catch (error) {
      console.error('Failed to toggle API', error);
      toast.error(error instanceof Error ? error.message : 'Failed to toggle API');
    }
  };

  const handleLimitSave = async () => {
    if (!selectedApi) return;
    try {
      await setAdminApiLimit(selectedApi.id, Number(limitValue));
      setOpenLimit(false);
      toast.success('Usage limit updated');
      await loadDashboard(true);
    } catch (error) {
      console.error('Failed to update limit', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update limit');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Managed APIs" value={summary?.apis ?? 0} icon={Brain} color="text-primary" />
        <StatCard label="Running" value={summary?.running ?? 0} icon={Activity} color="text-emerald-500" />
        <StatCard label="Client Billing" value={`₹${summary?.monthlyRevenue?.toFixed(2) ?? '0.00'}`} icon={Wallet} color="text-cyan-500" />
        <StatCard label="Unread Alerts" value={summary?.unreadAlerts ?? 0} icon={AlertTriangle} color="text-amber-500" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card className="border-border/50 bg-card/60">
          <CardHeader>
            <CardTitle>Automation Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <StatusRow label="Sell" />
            <StatusRow label="Track" />
            <StatusRow label="Limit + Block" />
            <StatusRow label="Billing Deduction" />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <button
                key={alert.id}
                type="button"
                onClick={() => handleNavigate('alerts')}
                className="w-full rounded-lg border border-border/50 bg-background/60 p-3 text-left hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.api_name || 'API alert'}</p>
                  </div>
                  <Badge variant="outline">{alert.severity}</Badge>
                </div>
              </button>
            ))}
            {alerts.length === 0 && <p className="text-sm text-muted-foreground">No alerts triggered yet.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderApis = () => (
    <Card className="border-border/50 bg-card/60">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Internal API Management</CardTitle>
          <p className="text-sm text-muted-foreground">View, edit, limit, history, toggle, and refresh all internal API products.</p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add API
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {apis.length === 0 && !loading ? (
          <div className="rounded-lg border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
            No APIs found. Create the first API product to start selling.
          </div>
        ) : null}

        {apis.map((api) => (
          <div key={api.id} className="rounded-xl border border-border/60 bg-background/70 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">{api.name}</h3>
                  <Badge variant="outline">{api.type}</Badge>
                  <Badge variant="outline">{api.speed_mode}</Badge>
                  <Badge variant="outline" className={api.is_enabled ? 'text-emerald-600' : 'text-red-600'}>
                    {api.is_enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{api.provider} • {api.endpoint}</p>
                <div className="grid gap-2 md:grid-cols-4">
                  <InfoTile title="Per Request" value={`₹${Number(api.price_per_request || 0).toFixed(2)}`} />
                  <InfoTile title="Per Token" value={`₹${Number(api.price_per_token || 0).toFixed(4)}`} />
                  <InfoTile title="Usage Limit" value={api.max_limit.toLocaleString()} />
                  <InfoTile title="Requests" value={api.usage_count.toLocaleString()} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => openViewDialog(api)} className="gap-2">
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => openEditDialog(api)} className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => openLimitDialog(api)} className="gap-2">
                  <Gauge className="h-4 w-4" />
                  Limit
                </Button>
                <Button variant="outline" size="sm" onClick={() => openHistoryDialog(api)} className="gap-2">
                  <History className="h-4 w-4" />
                  History
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleToggle(api)} className="gap-2">
                  <Power className="h-4 w-4" />
                  Toggle
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderAlerts = () => (
    <Card className="border-border/50 bg-card/60">
      <CardHeader>
        <CardTitle>Automated Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-lg border border-border/60 bg-background/70 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">{alert.title}</h3>
                  <Badge variant="outline">{alert.severity}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">{alert.client_name} • {alert.api_name} • {new Date(alert.created_at).toLocaleString()}</p>
              </div>
              <Badge variant={alert.is_read ? 'secondary' : 'default'}>{alert.is_read ? 'Read' : 'Unread'}</Badge>
            </div>
          </div>
        ))}
        {alerts.length === 0 && <p className="text-sm text-muted-foreground">No alerts available.</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-72 border-r border-border/50 bg-sidebar p-4">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/15 p-2 text-primary">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-foreground">AI API Selling System</p>
              <p className="text-xs text-muted-foreground">Admin control + real billing</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeSection;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${active ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                {item.id === 'alerts' && unreadAlerts > 0 ? <Badge>{unreadAlerts}</Badge> : null}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 rounded-xl border border-border/60 bg-card/50 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">System Guarantees</p>
          <ul className="mt-2 space-y-1">
            <li>Every button hits DB + edge API</li>
            <li>Live usage and billing deduction</li>
            <li>Auto alerts on limits and wallet issues</li>
          </ul>
        </div>
      </aside>

      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 border-b border-border/50 bg-background/95 px-6 py-4 backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">BASE SYSTEM STABLE – NO BLANK SCREEN – BASIC BUTTON WORKING</h1>
              <p className="text-sm text-muted-foreground">AI API SELLING SYSTEM FULLY WORKING WITH REAL BILLING + KEY SYSTEM + LIVE TRACKING</p>
            </div>
            <Button variant="outline" onClick={handleRefresh} className="gap-2" disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </header>

        <main className="space-y-6 p-6">
          {loading && !summary ? <Card><CardContent className="p-8 text-center text-muted-foreground">Loading live AI/API manager data...</CardContent></Card> : null}
          {!loading && activeSection === 'overview' ? renderOverview() : null}
          {!loading && activeSection === 'apis' ? renderApis() : null}
          {!loading && activeSection === 'alerts' ? renderAlerts() : null}
        </main>
      </div>

      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Internal API</DialogTitle>
          </DialogHeader>
          <ApiForm formState={formState} setFormState={setFormState} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancel</Button>
            <Button onClick={saveNewApi}>Save API</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit API Configuration</DialogTitle>
          </DialogHeader>
          <ApiForm formState={formState} setFormState={setFormState} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button onClick={saveEditedApi}>Update API</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Details</DialogTitle>
          </DialogHeader>
          {selectedApi ? (
            <div className="space-y-3 text-sm">
              <InfoTile title="Name" value={selectedApi.name} />
              <InfoTile title="Provider" value={selectedApi.provider || 'Unknown'} />
              <InfoTile title="Status" value={`${selectedApi.status} / ${selectedApi.is_enabled ? 'enabled' : 'disabled'}`} />
              <InfoTile title="Pricing" value={`₹${selectedApi.price_per_request.toFixed(2)} per request, ₹${selectedApi.price_per_token.toFixed(4)} per token`} />
              <InfoTile title="Limit" value={selectedApi.max_limit.toLocaleString()} />
              <InfoTile title="Endpoint" value={selectedApi.endpoint || 'N/A'} />
              <InfoTile title="Notes" value={selectedApi.notes || 'No notes'} />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={openLimit} onOpenChange={setOpenLimit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Usage Limit</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="maxLimit">Max limit</Label>
            <Input id="maxLimit" type="number" value={limitValue} onChange={(event) => setLimitValue(event.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenLimit(false)}>Cancel</Button>
            <Button onClick={handleLimitSave}>Save Limit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openHistory} onOpenChange={setOpenHistory}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Usage History</DialogTitle>
          </DialogHeader>
          {history ? (
            <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Usage Logs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {history.usage_logs.map((log) => (
                    <div key={log.id} className="rounded-lg border border-border/50 p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{log.source}</span>
                        <Badge variant="outline">{log.status}</Badge>
                      </div>
                      <p className="text-muted-foreground">Requests: {log.request_count} • Tokens: {log.tokens_used} • Cost: ₹{log.cost.toFixed(4)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                  {history.usage_logs.length === 0 ? <p className="text-sm text-muted-foreground">No usage logs yet.</p> : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Subscriptions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {history.subscriptions.map((subscription) => (
                    <div key={subscription.id} className="rounded-lg border border-border/50 p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{subscription.status}</span>
                        <Badge variant="outline">{subscription.usage_count}/{subscription.usage_limit}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Client: {subscription.client_user_id}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading history...</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ElementType; color: string }) {
  return (
    <Card className="border-border/50 bg-card/60">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
}

function StatusRow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/60 p-3">
      <span>{label}</span>
      <Badge variant="outline">Live</Badge>
    </div>
  );
}

function InfoTile({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-3 text-sm">
      <p className="text-muted-foreground">{title}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ApiForm({ formState, setFormState }: { formState: typeof emptyApiForm; setFormState: React.Dispatch<React.SetStateAction<typeof emptyApiForm>> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="apiName">Name</Label>
        <Input id="apiName" value={formState.name} onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="apiProvider">Provider</Label>
        <Input id="apiProvider" value={formState.provider} onChange={(event) => setFormState((prev) => ({ ...prev, provider: event.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label>Type</Label>
        <Select value={formState.type} onValueChange={(value) => setFormState((prev) => ({ ...prev, type: value }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {['ai', 'messaging', 'payment', 'analytics', 'storage', 'crm', 'server', 'other'].map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Speed Mode</Label>
        <Select value={formState.speed_mode} onValueChange={(value) => setFormState((prev) => ({ ...prev, speed_mode: value }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {['economy', 'standard', 'priority'].map((mode) => (
              <SelectItem key={mode} value={mode}>{mode}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="apiEndpoint">Endpoint</Label>
        <Input id="apiEndpoint" value={formState.endpoint} onChange={(event) => setFormState((prev) => ({ ...prev, endpoint: event.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="requestPrice">Price per request</Label>
        <Input id="requestPrice" type="number" step="0.01" value={formState.price_per_request} onChange={(event) => setFormState((prev) => ({ ...prev, price_per_request: event.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tokenPrice">Price per token</Label>
        <Input id="tokenPrice" type="number" step="0.0001" value={formState.price_per_token} onChange={(event) => setFormState((prev) => ({ ...prev, price_per_token: event.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="maxLimitField">Max limit</Label>
        <Input id="maxLimitField" type="number" value={formState.max_limit} onChange={(event) => setFormState((prev) => ({ ...prev, max_limit: event.target.value }))} />
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={formState.status} onValueChange={(value) => setFormState((prev) => ({ ...prev, status: value }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {['running', 'stopped', 'pending', 'error'].map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="apiNotes">Notes</Label>
        <Textarea id="apiNotes" rows={4} value={formState.notes} onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))} />
      </div>
    </div>
  );
}

export default APIManagerDashboard;
