import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Loader2, Package } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('marketplace_orders').select('*').order('created_at', { ascending: false }).limit(50);
      setOrders(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const getStatusColor = (s: string) => {
    if (s === 'completed') return 'bg-emerald-500/20 text-emerald-400';
    if (s === 'pending') return 'bg-amber-500/20 text-amber-400';
    if (s === 'cancelled') return 'bg-destructive/20 text-destructive';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Orders & Transactions</h1>
            <p className="text-sm text-muted-foreground">{orders.length} orders found</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : orders.length === 0 ? (
          <EmptyState icon={<ShoppingBag className="w-12 h-12" />} title="No orders yet" description="Orders will appear here when customers make purchases" />
        ) : (
          <Card className="border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(o => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id?.slice(0, 8)}</TableCell>
                    <TableCell>{o.product_id?.slice(0, 8) || '—'}</TableCell>
                    <TableCell className="font-mono">₹{o.total_amount || 0}</TableCell>
                    <TableCell><Badge className={getStatusColor(o.status)}>{o.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-xs">{new Date(o.created_at).toLocaleDateString()}</TableCell>
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

export default MPOrders;
