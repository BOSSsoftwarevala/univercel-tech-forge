import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Save, Settings2 } from 'lucide-react';
import {
  getLimits,
  updateLimits,
  getThresholds,
  updateThresholds,
  getNotificationPrefs,
  updateNotificationPrefs,
  getConfigHistory,
} from '@/routes/settings';

interface ServiceLimit {
  id?: string;
  service_id: string;
  daily_token_limit?: number;
  monthly_token_limit?: number;
  rate_limit_rpm?: number;
}

interface Threshold {
  id?: string;
  metric: string;
  warning_threshold: number;
  critical_threshold: number;
}

interface NotifPrefs {
  email_enabled?: boolean;
  sms_enabled?: boolean;
  slack_enabled?: boolean;
  email?: string;
  phone?: string;
}

interface ConfigEntry {
  id: string;
  action: string;
  user_id: string;
  created_at: string;
}

interface Props {
  tenantId: string;
  userId: string;
}

export default function SettingsPanel({ tenantId, userId }: Props) {
  const [limits, setLimits] = useState<ServiceLimit[]>([]);
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>({});
  const [history, setHistory] = useState<ConfigEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');

  const [newThreshold, setNewThreshold] = useState({ metric: '', warning: '', critical: '' });

  const load = async () => {
    setLoading(true);
    const [l, t, n, h] = await Promise.all([
      getLimits(tenantId),
      getThresholds(tenantId),
      getNotificationPrefs(tenantId, userId),
      getConfigHistory(tenantId),
    ]);
    if (l.error) { setError(l.error.message); setLoading(false); return; }
    setLimits((l.data ?? []) as ServiceLimit[]);
    setThresholds((t.data ?? []) as Threshold[]);
    setNotifPrefs((n.data as NotifPrefs) ?? {});
    setHistory((h.data ?? []) as ConfigEntry[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [tenantId, userId]);

  const saveLimits = async (lim: ServiceLimit) => {
    setSaving(true);
    await updateLimits(tenantId, lim.service_id, {
      daily_token_limit: lim.daily_token_limit,
      monthly_token_limit: lim.monthly_token_limit,
      rate_limit_rpm: lim.rate_limit_rpm,
    });
    setSaving(false);
    setSaved('limits');
    setTimeout(() => setSaved(''), 2000);
  };

  const saveThreshold = async () => {
    if (!newThreshold.metric) return;
    setSaving(true);
    await updateThresholds(tenantId, newThreshold.metric, Number(newThreshold.warning), Number(newThreshold.critical));
    setSaving(false);
    setNewThreshold({ metric: '', warning: '', critical: '' });
    load();
  };

  const saveNotifPrefs = async () => {
    setSaving(true);
    await updateNotificationPrefs(tenantId, userId, notifPrefs);
    setSaving(false);
    setSaved('notif');
    setTimeout(() => setSaved(''), 2000);
  };

  if (loading) return (
    <Card><CardContent className="p-6 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</CardContent></Card>
  );
  if (error) return <Card><CardContent className="p-6 text-red-500">Error: {error}</CardContent></Card>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings2 className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      <Tabs defaultValue="limits">
        <TabsList>
          <TabsTrigger value="limits">API Limits</TabsTrigger>
          <TabsTrigger value="thresholds">Alert Thresholds</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="history">Config History</TabsTrigger>
        </TabsList>

        <TabsContent value="limits">
          <Card>
            <CardHeader><CardTitle>API Limits per Service</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Service ID</TableHead>
                  <TableHead>Daily Token Limit</TableHead>
                  <TableHead>Monthly Token Limit</TableHead>
                  <TableHead>Rate Limit (RPM)</TableHead>
                  <TableHead>Save</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {limits.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No service limits configured</TableCell></TableRow>}
                  {limits.map((lim, idx) => (
                    <TableRow key={lim.id ?? idx}>
                      <TableCell className="font-mono text-sm">{lim.service_id}</TableCell>
                      <TableCell>
                        <Input type="number" className="w-32 h-7 text-sm" defaultValue={lim.daily_token_limit}
                          onBlur={e => { lim.daily_token_limit = Number(e.target.value); }} />
                      </TableCell>
                      <TableCell>
                        <Input type="number" className="w-32 h-7 text-sm" defaultValue={lim.monthly_token_limit}
                          onBlur={e => { lim.monthly_token_limit = Number(e.target.value); }} />
                      </TableCell>
                      <TableCell>
                        <Input type="number" className="w-24 h-7 text-sm" defaultValue={lim.rate_limit_rpm}
                          onBlur={e => { lim.rate_limit_rpm = Number(e.target.value); }} />
                      </TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => saveLimits(lim)} disabled={saving}>
                          <Save className="w-3 h-3 mr-1" />{saved === 'limits' ? 'Saved!' : 'Save'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds">
          <Card>
            <CardHeader><CardTitle>Alert Thresholds</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Warning</TableHead>
                  <TableHead>Critical</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {thresholds.map((t, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{t.metric}</TableCell>
                      <TableCell><Badge variant="secondary">{t.warning_threshold}</Badge></TableCell>
                      <TableCell><Badge variant="destructive">{t.critical_threshold}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 border-t pt-4">
                <p className="font-semibold mb-3">Add / Update Threshold</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <div><Label>Metric</Label><Input value={newThreshold.metric} onChange={e => setNewThreshold(t => ({ ...t, metric: e.target.value }))} placeholder="e.g. error_rate" /></div>
                  <div><Label>Warning</Label><Input type="number" value={newThreshold.warning} onChange={e => setNewThreshold(t => ({ ...t, warning: e.target.value }))} /></div>
                  <div><Label>Critical</Label><Input type="number" value={newThreshold.critical} onChange={e => setNewThreshold(t => ({ ...t, critical: e.target.value }))} /></div>
                  <Button onClick={saveThreshold} disabled={saving || !newThreshold.metric}><Save className="w-4 h-4 mr-2" />Save</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                  </div>
                  <Switch checked={notifPrefs.email_enabled ?? false} onCheckedChange={v => setNotifPrefs(p => ({ ...p, email_enabled: v }))} />
                </div>
                {notifPrefs.email_enabled && (
                  <div><Label>Email Address</Label><Input type="email" value={notifPrefs.email ?? ''} onChange={e => setNotifPrefs(p => ({ ...p, email: e.target.value }))} /></div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive alerts via SMS</p>
                  </div>
                  <Switch checked={notifPrefs.sms_enabled ?? false} onCheckedChange={v => setNotifPrefs(p => ({ ...p, sms_enabled: v }))} />
                </div>
                {notifPrefs.sms_enabled && (
                  <div><Label>Phone Number</Label><Input type="tel" value={notifPrefs.phone ?? ''} onChange={e => setNotifPrefs(p => ({ ...p, phone: e.target.value }))} /></div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Slack Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive alerts in Slack</p>
                  </div>
                  <Switch checked={notifPrefs.slack_enabled ?? false} onCheckedChange={v => setNotifPrefs(p => ({ ...p, slack_enabled: v }))} />
                </div>
              </div>

              <Button onClick={saveNotifPrefs} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />{saved === 'notif' ? 'Saved!' : 'Save Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {history.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No configuration changes</TableCell></TableRow>}
                {history.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.action}</TableCell>
                    <TableCell className="font-mono text-xs">{entry.user_id}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(entry.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
