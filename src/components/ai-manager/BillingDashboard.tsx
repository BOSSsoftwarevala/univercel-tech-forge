import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, FileText, DollarSign } from 'lucide-react';
import {
  getBillingRecords,
  getInvoices,
  getBillingByApi,
  getBillingByProduct,
  getBillingByRole,
  generateBillingSnapshot,
} from '@/routes/billing';

interface BillingRecord {
  id: string;
  period_start: string;
  period_end: string;
  total_amount: number;
  status: string;
  service_id?: string;
  product_id?: string;
  role_name?: string;
}

interface Invoice {
  id: string;
  billing_record_id: string;
  status: string;
  created_at: string;
}

interface Props {
  tenantId: string;
}

const statusVariant = (s: string): 'default' | 'secondary' | 'destructive' =>
  s === 'paid' ? 'default' : s === 'pending' ? 'secondary' : 'destructive';

export default function BillingDashboard({ tenantId }: Props) {
  const [records, setRecords] = useState<BillingRecord[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [byApi, setByApi] = useState<BillingRecord[]>([]);
  const [byProduct, setByProduct] = useState<BillingRecord[]>([]);
  const [byRole, setByRole] = useState<BillingRecord[]>([]);
  const [snapshot, setSnapshot] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [r, inv, snap] = await Promise.all([
      getBillingRecords(tenantId),
      getInvoices(tenantId),
      generateBillingSnapshot(tenantId),
    ]);
    if (r.error) { setError(r.error.message); setLoading(false); return; }
    setRecords((r.data ?? []) as BillingRecord[]);
    setInvoices((inv.data ?? []) as Invoice[]);
    setSnapshot(snap.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [tenantId]);

  const loadTab = async (tab: string) => {
    if (tab === 'api') {
      const { data } = await getBillingByApi(tenantId, '');
      setByApi((data ?? []) as BillingRecord[]);
    } else if (tab === 'product') {
      const { data } = await getBillingByProduct(tenantId, '');
      setByProduct((data ?? []) as BillingRecord[]);
    } else if (tab === 'role') {
      const { data } = await getBillingByRole(tenantId, '');
      setByRole((data ?? []) as BillingRecord[]);
    }
  };

  const totalBilled = records.reduce((s, r) => s + (r.total_amount ?? 0), 0);
  const pendingAmount = records.filter(r => r.status === 'pending').reduce((s, r) => s + (r.total_amount ?? 0), 0);

  if (loading) return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
      <Skeleton className="h-64 w-full" />
    </div>
  );

  if (error) return <Card><CardContent className="p-6 text-red-500">Error: {error}</CardContent></Card>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Billing Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><DollarSign className="w-4 h-4" />Total Billed</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">${totalBilled.toFixed(2)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pending</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Invoices</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{invoices.length}</p></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="records" onValueChange={loadTab}>
        <TabsList>
          <TabsTrigger value="records">Billing Records</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="api">By API</TabsTrigger>
          <TabsTrigger value="product">By Product</TabsTrigger>
          <TabsTrigger value="role">By Role</TabsTrigger>
        </TabsList>

        <TabsContent value="records">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Period Start</TableHead>
                <TableHead>Period End</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {records.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No billing records</TableCell></TableRow>}
                {records.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{r.period_start ? new Date(r.period_start).toLocaleDateString() : '—'}</TableCell>
                    <TableCell>{r.period_end ? new Date(r.period_end).toLocaleDateString() : '—'}</TableCell>
                    <TableCell className="font-semibold">${r.total_amount?.toFixed(2) ?? '0.00'}</TableCell>
                    <TableCell><Badge variant={statusVariant(r.status)}>{r.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {invoices.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No invoices</TableCell></TableRow>}
                {invoices.map(inv => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                    <TableCell><Badge variant={statusVariant(inv.status)}>{inv.status}</Badge></TableCell>
                    <TableCell>{new Date(inv.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => alert(JSON.stringify(inv, null, 2))}>
                        <Download className="w-3 h-3 mr-1" />View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        {[{ key: 'api', data: byApi, col: 'service_id' }, { key: 'product', data: byProduct, col: 'product_id' }, { key: 'role', data: byRole, col: 'role_name' }].map(({ key, data, col }) => (
          <TabsContent key={key} value={key}>
            <Card><CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>{col.replace('_', ' ').toUpperCase()}</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {data.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No data</TableCell></TableRow>}
                  {data.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{(r as any)[col] ?? '—'}</TableCell>
                      <TableCell className="font-semibold">${r.total_amount?.toFixed(2) ?? '0.00'}</TableCell>
                      <TableCell><Badge variant={statusVariant(r.status)}>{r.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent></Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
