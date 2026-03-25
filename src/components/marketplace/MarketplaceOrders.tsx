import React, { useMemo, useState } from 'react';
import { Calendar, Clock, CreditCard, Eye, KeyRound, Package, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useMarketplace, type MarketplaceOrder } from '@/hooks/useMarketplace';

interface MarketplaceOrdersProps {
  title: string;
  subtitle: string;
}

const orderStatusStyles: Record<string, string> = {
  payment_pending: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  processing: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  completed: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  cancelled: 'border-red-500/30 bg-red-500/10 text-red-300',
};

const paymentStatusStyles: Record<string, string> = {
  verified: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  pending_verification: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  failed: 'border-red-500/30 bg-red-500/10 text-red-300',
};

function OrderSummaryCard({ label, value, tone }: { label: string; value: number; tone: 'default' | 'warning' | 'success'; }) {
  const toneClass = tone === 'warning' ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : tone === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-950/70 text-white';
  return (
    <Card className={toneClass}>
      <CardContent className="p-4">
        <p className="text-xs uppercase tracking-[0.24em] opacity-70">{label}</p>
        <p className="mt-3 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

export function MarketplaceOrders({ title, subtitle }: MarketplaceOrdersProps) {
  const { orders, isOrdersLoading } = useMarketplace();
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<MarketplaceOrder | null>(null);

  const filteredOrders = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) {
      return orders;
    }

    return orders.filter((order) =>
      order.order_number.toLowerCase().includes(needle)
      || order.product_name.toLowerCase().includes(needle)
      || (order.category || '').toLowerCase().includes(needle)
      || order.payment_status.toLowerCase().includes(needle)
      || order.order_status.toLowerCase().includes(needle),
    );
  }, [orders, search]);

  const pendingCount = orders.filter((order) => order.payment_status !== 'verified').length;
  const activeCount = orders.filter((order) => ['processing', 'completed'].includes(order.order_status)).length;
  const licensedCount = orders.filter((order) => Boolean(order.license_key)).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <OrderSummaryCard label="Total orders" value={orders.length} tone="default" />
        <OrderSummaryCard label="Pending verification" value={pendingCount} tone="warning" />
        <OrderSummaryCard label="Licenses issued" value={licensedCount || activeCount} tone="success" />
      </div>

      <div className="relative max-w-lg">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by order, product, payment, status" className="h-11 border-slate-800 bg-slate-950/70 pl-10 text-white" />
      </div>

      <div className="space-y-4">
        {isOrdersLoading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 text-center text-slate-400">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 text-center text-slate-400">No orders found.</div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="border-slate-800 bg-slate-950/70">
              <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-200">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-white">{order.product_name}</p>
                      <Badge variant="outline" className="border-slate-800 bg-slate-900/80 text-slate-300">{order.category || 'General'}</Badge>
                    </div>
                    <p className="mt-1 font-mono text-sm text-cyan-300">{order.order_number}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge className={orderStatusStyles[order.order_status] || orderStatusStyles.processing}>{order.order_status.replace('_', ' ')}</Badge>
                      <Badge className={paymentStatusStyles[order.payment_status] || paymentStatusStyles.pending_verification}>{order.payment_status.replace('_', ' ')}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 lg:items-end">
                  <div className="text-right">
                    <p className="text-xl font-semibold text-white">₹{order.final_amount.toLocaleString()}</p>
                    <p className="text-sm text-slate-500">{order.payment_method.toUpperCase()}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="h-4 w-4" />
                    {new Date(order.created_at).toLocaleString()}
                  </div>
                  <Button type="button" variant="outline" className="border-slate-800 bg-slate-900/80" onClick={() => setSelectedOrder(order)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={Boolean(selectedOrder)} onOpenChange={(open) => {
        if (!open) {
          setSelectedOrder(null);
        }
      }}>
        <DialogContent className="max-w-2xl border-slate-800 bg-slate-950 text-white">
          <DialogHeader>
            <DialogTitle>{selectedOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {selectedOrder ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Product</p>
                  <p className="mt-2 text-lg font-semibold text-white">{selectedOrder.product_name}</p>
                  <p className="text-sm text-slate-400">{selectedOrder.category || 'General'}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Commercials</p>
                  <p className="mt-2 text-lg font-semibold text-white">₹{selectedOrder.final_amount.toLocaleString()}</p>
                  <p className="text-sm text-slate-400">Gross ₹{selectedOrder.gross_amount.toLocaleString()} • Discount {selectedOrder.discount_percent}%</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CreditCard className="h-4 w-4" />
                    <span>{selectedOrder.payment_method.toUpperCase()}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">Payment status: {selectedOrder.payment_status}</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="h-4 w-4" />
                    <span>{selectedOrder.order_status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">Updated {new Date(selectedOrder.updated_at).toLocaleString()}</p>
                </div>
              </div>
              {selectedOrder.license_key ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <KeyRound className="h-4 w-4" />
                    <span>License issued</span>
                  </div>
                  <p className="mt-2 font-mono text-sm text-white">{selectedOrder.license_key}</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
