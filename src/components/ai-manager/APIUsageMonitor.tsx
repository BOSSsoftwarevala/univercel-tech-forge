import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getApiUsage, getUsageByService, getFailureLogs, getLatencyMetrics } from '@/routes/api-usage';

interface UsageLog {
  id?: string;
  service_id: string;
  tokens_used: number;
  cost: number;
  status: string;
  created_at: string;
  latency_ms?: number;
}

interface ServiceSummary {
  serviceId: string;
  tokens: number;
  cost: number;
  requests: number;
  failures: number;
}

interface Props {
  tenantId: string;
}

export default function APIUsageMonitor({ tenantId }: Props) {
  const [usage, setUsage] = useState<UsageLog[]>([]);
  const [failures, setFailures] = useState<UsageLog[]>([]);
  const [latency, setLatency] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState('7');

  const load = async () => {
    setLoading(true);
    const [u, f, l] = await Promise.all([
      getUsageByService(tenantId),
      getFailureLogs(tenantId),
      getLatencyMetrics(tenantId),
    ]);
    if (u.error) { setError(u.error.message); setLoading(false); return; }
    setUsage((u.data ?? []) as UsageLog[]);
    setFailures((f.data ?? []) as UsageLog[]);
    setLatency((l.data ?? []) as any[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [tenantId, days]);

  const serviceSummaries: ServiceSummary[] = Object.values(
    (usage).reduce((acc: Record<string, ServiceSummary>, row) => {
      const key = row.service_id ?? 'unknown';
      if (!acc[key]) acc[key] = { serviceId: key, tokens: 0, cost: 0, requests: 0, failures: 0 };
      acc[key].tokens += row.tokens_used ?? 0;
      acc[key].cost += row.cost ?? 0;
      acc[key].requests += 1;
      if (row.status === 'error' || row.status === 'failed') acc[key].failures += 1;
      return acc;
    }, {}),
  );

  const chartData = serviceSummaries.map(s => ({
    name: s.serviceId.slice(0, 12),
    tokens: s.tokens,
    cost: parseFloat(s.cost.toFixed(4)),
    requests: s.requests,
  }));

  const latencyData = latency.slice(0, 50).map((r, i) => ({
    i,
    latency: r.latency_ms ?? 0,
    service: r.service_id,
  }));

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );

  if (error) return <Card><CardContent className="p-6 text-red-500">Error: {error}</CardContent></Card>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">API Usage Monitor</h2>
        <Select value={days} onValueChange={setDays}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Requests</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{usage.length.toLocaleString()}</p></CardContent>
        </Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Tokens</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{usage.reduce((s, r) => s + (r.tokens_used ?? 0), 0).toLocaleString()}</p></CardContent>
        </Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Failure Rate</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-red-500">{usage.length ? ((failures.length / usage.length) * 100).toFixed(1) : 0}%</p></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage">
        <TabsList>
          <TabsTrigger value="usage">Usage by Service</TabsTrigger>
          <TabsTrigger value="latency">Latency</TabsTrigger>
          <TabsTrigger value="failures">Failures</TabsTrigger>
        </TabsList>

        <TabsContent value="usage">
          <Card>
            <CardHeader><CardTitle>Token Usage by Service</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tokens" fill="#6366f1" name="Tokens" />
                  <Bar dataKey="requests" fill="#22c55e" name="Requests" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="mt-4"><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Requests</TableHead>
                <TableHead>Tokens Used</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Failure Rate</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {serviceSummaries.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No usage data</TableCell></TableRow>}
                {serviceSummaries.map(s => (
                  <TableRow key={s.serviceId}>
                    <TableCell className="font-mono text-sm">{s.serviceId}</TableCell>
                    <TableCell>{s.requests.toLocaleString()}</TableCell>
                    <TableCell>{s.tokens.toLocaleString()}</TableCell>
                    <TableCell>${s.cost.toFixed(4)}</TableCell>
                    <TableCell>
                      <Badge variant={s.requests > 0 && s.failures / s.requests > 0.1 ? 'destructive' : 'secondary'}>
                        {s.requests > 0 ? ((s.failures / s.requests) * 100).toFixed(1) : 0}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="latency">
          <Card>
            <CardHeader><CardTitle>Latency (ms)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={latencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="i" hide />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="latency" stroke="#f59e0b" dot={false} name="Latency (ms)" />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-muted-foreground mt-2">
                Avg: {latencyData.length ? (latencyData.reduce((s, r) => s + r.latency, 0) / latencyData.length).toFixed(0) : 0} ms
                &nbsp;|&nbsp; P95: {latencyData.length ? [...latencyData].sort((a, b) => a.latency - b.latency)[Math.floor(latencyData.length * 0.95)]?.latency ?? 0 : 0} ms
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failures">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead>Time</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {failures.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No failure logs</TableCell></TableRow>}
                {failures.slice(0, 50).map((f, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-sm">{f.service_id}</TableCell>
                    <TableCell><Badge variant="destructive">{f.status}</Badge></TableCell>
                    <TableCell>{f.tokens_used?.toLocaleString() ?? 0}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(f.created_at).toLocaleString()}</TableCell>
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
