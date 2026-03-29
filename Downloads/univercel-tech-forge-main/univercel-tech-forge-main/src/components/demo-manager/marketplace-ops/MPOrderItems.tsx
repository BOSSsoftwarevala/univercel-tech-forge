import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListOrdered, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type OrderItem = {
  id?: string | number;
  order_id?: string | number | null;
  product_id?: string | number | null;
  product_name?: string | null;
  quantity?: number | null;
  total_price?: number | null;
  created_at?: string | null;
  status?: string | null;
};

const MPOrderItems = () => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const load = async () => {
      if (!mounted) return;
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("marketplace_order_items")
          .select("id, order_id, product_id, product_name, quantity, total_price, created_at, status")
          .order("created_at", { ascending: false })
          .limit(200)
          .abortSignal(controller.signal);

        if (fetchError) {
          console.error("[MPOrderItems] failed to load items:", fetchError);
          if (mounted) {
            setError("Unable to load order items");
            setItems([]);
          }
          return;
        }

        if (mounted) setItems((data as OrderItem[]) || []);
      } catch (e) {
        if ((e as any)?.name === "AbortError") {
          // aborted intentionally
        } else {
          console.error("[MPOrderItems] unexpected error:", e);
          if (mounted) {
            setError("Unable to load order items");
            setItems([]);
          }
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

  const handleViewProduct = (item: OrderItem) => {
    const pid = item.product_id ?? item.id;
    if (pid) {
      window.open(`/marketplace/product/${encodeURIComponent(String(pid))}`, "_blank", "noopener,noreferrer");
      return;
    }
    if (item.product_name) {
      try {
        navigator.clipboard?.writeText(String(item.product_name));
      } catch {
        // silent fallback
      }
    }
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
            <ListOrdered className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Order Items</h1>
            <p className="text-sm text-muted-foreground">View individual line items within orders</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : error ? (
          <EmptyState icon={<ListOrdered className="w-12 h-12" />} title="Unable to load items" description={error} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={<ListOrdered className="w-12 h-12" />}
            title="No order items"
            description="Order line items will appear here when orders are placed"
          />
        ) : (
          <Card className="border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it) => (
                  <TableRow key={it.id ?? `${it.order_id}-${it.product_id}`}>
                    <TableCell className="font-mono text-xs">{safeSlice(it.id)}</TableCell>
                    <TableCell className="font-mono text-xs">{safeSlice(it.order_id)}</TableCell>
                    <TableCell>{it.product_name ?? safeSlice(it.product_id)}</TableCell>
                    <TableCell className="text-xs">{it.quantity ?? "-"}</TableCell>
                    <TableCell className="font-mono">₹{formatAmount(it.total_price)}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{formatDate(it.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => handleViewProduct(it)}>
                          View
                        </Button>
                      </div>
                    </TableCell>
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

export default MPOrderItems;
