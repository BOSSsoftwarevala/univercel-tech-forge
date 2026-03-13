import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import {
  getAlerts,
  getAlertRules,
  createAlertRule,
  deleteAlertRule,
  resolveAlert,
  getAnomalyLogs,
} from '@/routes/alerts';

interface Alert {
  id: string;
  severity: string;
  message: string;
  status: string;
  created_at: string;
}

interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: string;
  threshold: number;
  is_active: boolean;
}

interface AnomalyLog {
  id: string;
  description: string;
  created_at: string;
}

interface Props {
  tenantId: string;
}

const severityIcon = (s: string) => {
  if (s === 'critical') return <AlertTriangle className="w-4 h-4 text-red-500" />;
  if (s === 'warning') return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
  return <Info className="w-4 h-4 text-blue-500" />;
};

const severityVariant = (s: string): 'destructive' | 'secondary' | 'default' =>
  s === 'critical' ? 'destructive' : s === 'warning' ? 'secondary' : 'default';

export default function AlertPanel({ tenantId }: Props) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ruleDialog, setRuleDialog] = useState(false);
  const [ruleForm, setRuleForm] = useState({ name: '', metric: '', condition: 'gt', threshold: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [a, r, an] = await Promise.all([
      getAlerts(tenantId, 'open'),
      getAlertRules(tenantId),
      getAnomalyLogs(tenantId),
    ]);
    if (a.error) { setError(a.error.message); setLoading(false); return; }
    setAlerts((a.data ?? []) as Alert[]);
    setRules((r.data ?? []) as AlertRule[]);
    setAnomalies((an.data ?? []) as AnomalyLog[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [tenantId]);

  const handleResolve = async (alert: Alert) => {
    await resolveAlert(alert.id, tenantId);
    load();
  };

  const handleDeleteRule = async (rule: AlertRule) => {
    if (!confirm(`Delete rule "${rule.name}"?`)) return;
    await deleteAlertRule(rule.id, tenantId);
    load();
  };

  const handleSaveRule = async () => {
    setSaving(true);
    await createAlertRule({
      name: ruleForm.name,
      metric: ruleForm.metric,
      condition: ruleForm.condition,
      threshold: Number(ruleForm.threshold),
      is_active: true,
    }, tenantId);
    setSaving(false);
    setRuleDialog(false);
    setRuleForm({ name: '', metric: '', condition: 'gt', threshold: '' });
    load();
  };

  if (loading) return (
    <Card><CardContent className="p-6 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</CardContent></Card>
  );
  if (error) return <Card><CardContent className="p-6 text-red-500">Error: {error}</CardContent></Card>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Alert Panel</h2>

      <div className="grid grid-cols-3 gap-4">
        {(['critical', 'warning', 'info'] as const).map(sev => (
          <Card key={sev}>
            <CardContent className="flex items-center gap-3 p-4">
              {severityIcon(sev)}
              <div>
                <p className="text-2xl font-bold">{alerts.filter(a => a.severity === sev).length}</p>
                <p className="text-sm text-muted-foreground capitalize">{sev}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Action</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {alerts.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No active alerts 🎉</TableCell></TableRow>}
                {alerts.map(a => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {severityIcon(a.severity)}
                        <Badge variant={severityVariant(a.severity)}>{a.severity}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>{a.message}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(a.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleResolve(a)}>
                        <CheckCircle className="w-3 h-3 mr-1" />Resolve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="rules">
          <div className="flex justify-end mb-3">
            <Button onClick={() => setRuleDialog(true)}><Plus className="w-4 h-4 mr-2" />Add Rule</Button>
          </div>
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Metric</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {rules.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No rules configured</TableCell></TableRow>}
                {rules.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.metric}</TableCell>
                    <TableCell>{r.condition}</TableCell>
                    <TableCell>{r.threshold}</TableCell>
                    <TableCell><Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Yes' : 'No'}</Badge></TableCell>
                    <TableCell>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteRule(r)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="anomalies">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Time</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {anomalies.length === 0 && <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-8">No anomalies detected</TableCell></TableRow>}
                {anomalies.map(an => (
                  <TableRow key={an.id}>
                    <TableCell>{an.description}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(an.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      <Dialog open={ruleDialog} onOpenChange={setRuleDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Alert Rule</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Rule Name</Label><Input value={ruleForm.name} onChange={e => setRuleForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Metric</Label><Input value={ruleForm.metric} onChange={e => setRuleForm(f => ({ ...f, metric: e.target.value }))} placeholder="e.g. error_rate, cost, latency_ms" /></div>
            <div>
              <Label>Condition</Label>
              <Select value={ruleForm.condition} onValueChange={v => setRuleForm(f => ({ ...f, condition: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gt">Greater than</SelectItem>
                  <SelectItem value="lt">Less than</SelectItem>
                  <SelectItem value="eq">Equals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Threshold</Label><Input type="number" value={ruleForm.threshold} onChange={e => setRuleForm(f => ({ ...f, threshold: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRuleDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveRule} disabled={saving || !ruleForm.name || !ruleForm.metric}>{saving ? 'Saving…' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
