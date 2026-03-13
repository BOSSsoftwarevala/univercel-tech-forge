import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Plus, Trash2, RotateCcw, UserX } from 'lucide-react';
import {
  getAccessLogs,
  getAbuseEvents,
  blockUser,
  getIpWhitelist,
  addIpRule,
  removeIpRule,
  getApiKeys,
  rotateApiKey,
  getRateLimitEvents,
} from '@/routes/security';

interface Props {
  tenantId: string;
  adminId: string;
}

export default function SecurityPanel({ tenantId, adminId }: Props) {
  const [accessLogs, setAccessLogs] = useState<any[]>([]);
  const [abuseEvents, setAbuseEvents] = useState<any[]>([]);
  const [ipWhitelist, setIpWhitelist] = useState<any[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [rateLimitEvents, setRateLimitEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [blockDialog, setBlockDialog] = useState(false);
  const [blockForm, setBlockForm] = useState({ userId: '', reason: '' });

  const [ipDialog, setIpDialog] = useState(false);
  const [ipForm, setIpForm] = useState({ ip: '', description: '' });

  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [al, ae, ip, ak, rl] = await Promise.all([
      getAccessLogs(tenantId, 50),
      getAbuseEvents(tenantId),
      getIpWhitelist(tenantId),
      getApiKeys(tenantId),
      getRateLimitEvents(tenantId),
    ]);
    if (al.error) { setError(al.error.message); setLoading(false); return; }
    setAccessLogs(al.data ?? []);
    setAbuseEvents(ae.data ?? []);
    setIpWhitelist(ip.data ?? []);
    setApiKeys(ak.data ?? []);
    setRateLimitEvents(rl.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [tenantId]);

  const handleBlock = async () => {
    setSaving(true);
    await blockUser(tenantId, blockForm.userId, blockForm.reason, adminId);
    setSaving(false);
    setBlockDialog(false);
    setBlockForm({ userId: '', reason: '' });
  };

  const handleAddIp = async () => {
    setSaving(true);
    await addIpRule(tenantId, ipForm.ip, ipForm.description);
    setSaving(false);
    setIpDialog(false);
    setIpForm({ ip: '', description: '' });
    load();
  };

  const handleRemoveIp = async (id: string) => {
    if (!confirm('Remove this IP rule?')) return;
    await removeIpRule(id, tenantId);
    load();
  };

  const handleRotateKey = async (id: string) => {
    if (!confirm('Rotate this API key?')) return;
    await rotateApiKey(id, tenantId);
    load();
  };

  if (loading) return (
    <Card><CardContent className="p-6 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</CardContent></Card>
  );
  if (error) return <Card><CardContent className="p-6 text-red-500">Error: {error}</CardContent></Card>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Shield className="w-6 h-6" />Security Panel</h2>
        <Button variant="destructive" onClick={() => setBlockDialog(true)}><UserX className="w-4 h-4 mr-2" />Block User</Button>
      </div>

      <Tabs defaultValue="logs">
        <TabsList>
          <TabsTrigger value="logs">Access Logs</TabsTrigger>
          <TabsTrigger value="abuse">Abuse Events</TabsTrigger>
          <TabsTrigger value="ip">IP Whitelist</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="ratelimit">Rate Limit Events</TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Time</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {accessLogs.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No access logs</TableCell></TableRow>}
                {accessLogs.map((log, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs">{log.user_id ?? '—'}</TableCell>
                    <TableCell className="font-mono text-sm">{log.ip_address ?? '—'}</TableCell>
                    <TableCell>{log.action ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(log.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="abuse">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Time</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {abuseEvents.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No abuse events</TableCell></TableRow>}
                {abuseEvents.map((ev, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs">{ev.user_id ?? '—'}</TableCell>
                    <TableCell><Badge variant="destructive">{ev.event_type ?? '—'}</Badge></TableCell>
                    <TableCell className="text-sm">{ev.description ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(ev.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="ip">
          <div className="flex justify-end mb-3">
            <Button onClick={() => setIpDialog(true)}><Plus className="w-4 h-4 mr-2" />Add IP Rule</Button>
          </div>
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {ipWhitelist.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No IP rules</TableCell></TableRow>}
                {ipWhitelist.map(rule => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-mono">{rule.ip_address}</TableCell>
                    <TableCell>{rule.description}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(rule.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="destructive" onClick={() => handleRemoveIp(rule.id)}><Trash2 className="w-3 h-3" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="keys">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key Prefix</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {apiKeys.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No API keys</TableCell></TableRow>}
                {apiKeys.map(key => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell className="font-mono text-sm">{key.api_key_prefix}***</TableCell>
                    <TableCell className="text-muted-foreground text-sm">—</TableCell>
                    <TableCell><Badge variant={key.status === 'active' ? 'default' : 'secondary'}>{key.status ?? 'active'}</Badge></TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleRotateKey(key.id)}>
                        <RotateCcw className="w-3 h-3 mr-1" />Rotate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="ratelimit">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>User/IP</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Time</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {rateLimitEvents.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No rate limit events</TableCell></TableRow>}
                {rateLimitEvents.map((ev, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-sm">{ev.identifier ?? '—'}</TableCell>
                    <TableCell>{ev.endpoint ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(ev.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      {/* Block User Dialog */}
      <Dialog open={blockDialog} onOpenChange={setBlockDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Block User</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>User ID</Label><Input value={blockForm.userId} onChange={e => setBlockForm(f => ({ ...f, userId: e.target.value }))} /></div>
            <div><Label>Reason</Label><Input value={blockForm.reason} onChange={e => setBlockForm(f => ({ ...f, reason: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleBlock} disabled={saving || !blockForm.userId || !blockForm.reason}>{saving ? 'Blocking…' : 'Block User'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add IP Dialog */}
      <Dialog open={ipDialog} onOpenChange={setIpDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add IP Rule</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>IP Address</Label><Input value={ipForm.ip} onChange={e => setIpForm(f => ({ ...f, ip: e.target.value }))} placeholder="192.168.1.1" /></div>
            <div><Label>Description</Label><Input value={ipForm.description} onChange={e => setIpForm(f => ({ ...f, description: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIpDialog(false)}>Cancel</Button>
            <Button onClick={handleAddIp} disabled={saving || !ipForm.ip}>{saving ? 'Adding…' : 'Add Rule'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
