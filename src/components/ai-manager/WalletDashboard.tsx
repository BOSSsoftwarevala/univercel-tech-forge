import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Plus, DollarSign, TrendingUp } from 'lucide-react';
import {
  getWallet,
  getBalance,
  addMoney,
  getTransactions,
  lockWallet,
  unlockWallet,
} from '@/routes/wallet';

interface Wallet {
  id: string;
  balance: number;
  hold_amount: number;
  currency: string;
  is_locked: boolean;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  created_at: string;
}

interface Props {
  tenantId: string;
}

export default function WalletDashboard({ tenantId }: Props) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDialog, setAddDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: w, error: e1 }, { data: txs, error: e2 }] = await Promise.all([
      getWallet(tenantId),
      getTransactions(tenantId, 50),
    ]);
    if (e1) { setError(e1.message); setLoading(false); return; }
    setWallet(w as Wallet);
    setTransactions((txs ?? []) as Transaction[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [tenantId]);

  const handleAdd = async () => {
    setSaving(true);
    const { error: err } = await addMoney(tenantId, Number(amount), description);
    setSaving(false);
    if (err) { alert(err.message); return; }
    setAddDialog(false);
    setAmount('');
    setDescription('');
    load();
  };

  const handleLock = async () => {
    if (!confirm('Lock this wallet?')) return;
    await lockWallet(tenantId);
    load();
  };

  const handleUnlock = async () => {
    await unlockWallet(tenantId);
    load();
  };

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );

  if (error) return <Card><CardContent className="p-6 text-red-500">Error: {error}</CardContent></Card>;

  const available = (wallet?.balance ?? 0) - (wallet?.hold_amount ?? 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Wallet Dashboard</h2>

      {wallet?.is_locked && (
        <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold">Wallet is locked.</span>
          <Button size="sm" variant="outline" className="ml-auto" onClick={handleUnlock}>Unlock</Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><DollarSign className="w-4 h-4" />Total Balance</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{wallet?.currency ?? 'USD'} {wallet?.balance?.toFixed(2) ?? '0.00'}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><TrendingUp className="w-4 h-4" />Available</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{wallet?.currency ?? 'USD'} {available.toFixed(2)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">On Hold</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{wallet?.currency ?? 'USD'} {wallet?.hold_amount?.toFixed(2) ?? '0.00'}</p></CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => setAddDialog(true)} disabled={wallet?.is_locked}>
          <Plus className="w-4 h-4 mr-2" />Add Money
        </Button>
        {!wallet?.is_locked ? (
          <Button variant="outline" onClick={handleLock}>Lock Wallet</Button>
        ) : (
          <Button variant="outline" onClick={handleUnlock}>Unlock Wallet</Button>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No transactions yet</TableCell></TableRow>
              )}
              {transactions.map(tx => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <Badge variant={tx.type === 'credit' ? 'default' : 'secondary'}>{tx.type}</Badge>
                  </TableCell>
                  <TableCell className={tx.type === 'credit' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {tx.type === 'credit' ? '+' : '-'}{Math.abs(tx.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{tx.description}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{new Date(tx.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Money</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Amount ({wallet?.currency ?? 'USD'})</Label><Input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} /></div>
            <div><Label>Description</Label><Input value={description} onChange={e => setDescription(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={saving || !amount || Number(amount) <= 0}>{saving ? 'Processing…' : 'Add Money'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
