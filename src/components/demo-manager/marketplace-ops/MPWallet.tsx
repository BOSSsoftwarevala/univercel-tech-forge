import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wallet, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPWallet = () => {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('wallets').select('*').order('updated_at', { ascending: false }).limit(50);
      setWallets(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Wallet & Payments</h1>
            <p className="text-sm text-muted-foreground">View wallet balances and transactions</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : wallets.length === 0 ? (
          <EmptyState icon={<Wallet className="w-12 h-12" />} title="No wallets" description="Wallets are created when users register" />
        ) : (
          <Card className="border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wallet ID</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wallets.map(w => (
                  <TableRow key={w.id}>
                    <TableCell className="font-mono text-xs">{w.id?.slice(0, 8)}</TableCell>
                    <TableCell className="font-mono font-bold">₹{Number(w.balance || 0).toLocaleString()}</TableCell>
                    <TableCell>{w.currency || 'INR'}</TableCell>
                    <TableCell><Badge variant="outline">{w.is_frozen ? 'Frozen' : 'Active'}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-xs">{new Date(w.updated_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
};

export default MPWallet;
