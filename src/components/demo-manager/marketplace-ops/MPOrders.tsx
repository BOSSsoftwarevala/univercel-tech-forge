import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const load = async () => {
      if (!mounted) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("marketplace_orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50)
          .abortSignal(controller.signal);

        if (error) {
          console.error("[MPOrders] failed to load orders:", error);
          if (mounted) setOrders([]);
        } else {
          if (mounted) setOrders(data || []);
        }
      } catch (err) {
        if ((err as any)?.name === "AbortError") {
          // request aborted intentionally
        } else {
          console.error("[MPOrders] unexpected error loading orders:", err);
          if (mounted) setOrders([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const getStatusColor = (s: string) => {
    if (s === "completed") return "bg-emerald-500/20 text-emerald-400";
    if (s === "pending") return "bg-amber-500/20 text-amber-400";
    if (s === "cancelled") return "bg-destructive/20 text-destructive";
    return "bg-muted text-muted-foreground";
  };

  const safeSlice = (v: any, len = 8) => (v !== null && v !== undefined ? String(v).slice(0, len) : "—");

  const formatAmount = (v: any) => {
    const n = Number(v ?? 0);
    if (Number.isNaN(n)) return "0";
    return n.toLocaleString();
  };

  const formatDate = (d: any) => {
    if (!d) return "-";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "-";
    return dt.toLocaleDateString();
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
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="w-12 h-12" />}
            title="No orders yet"
            description="Orders will appear here when customers make purchases"
          />
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
                {orders.map((o) => (
                  <TableRow key={o.id ?? o.order_number ?? `${o.product_id ?? "row"}`}>
                    <TableCell className="font-mono text-xs">{safeSlice(o.id)}</TableCell>
                    <TableCell>{o.product_id ? safeSlice(o.product_id) : "—"}</TableCell>
                    <TableCell className="font-mono">₹{formatAmount(o.total_amount)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(o.status)}>{o.status ?? "unknown"}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{formatDate(o.created_at)}</TableCell>
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
