import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Clock, ShoppingBag, AlertCircle } from 'lucide-react';

const W = { dark: '#1a1f36', gray: '#858796', border: '#e3e6f0' };

export default function ResellerOrdersPanel({ activeView }: { activeView: string }) {
  const titles: Record<string, string> = {
    ord_all: 'All Orders', ord_pending: 'Pending Orders',
    ord_completed: 'Completed Orders', ord_cancelled: 'Cancelled Orders',
  };
  const icons: Record<string, React.ElementType> = {
    ord_all: ShoppingCart, ord_pending: Clock, ord_completed: ShoppingBag, ord_cancelled: AlertCircle,
  };
  const Icon = icons[activeView] || ShoppingCart;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold" style={{ color: W.dark }}>{titles[activeView] || 'Orders'}</h2>
        <button className="px-3 py-1.5 rounded text-[12px] font-medium text-white" style={{ background: '#4e73df' }}>+ New Order</button>
      </div>
      <Card className="border" style={{ borderColor: W.border }}>
        <CardContent className="p-0">
          {/* Table header */}
          <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b text-[11px] font-semibold uppercase tracking-wider" style={{ borderColor: W.border, color: W.gray, background: '#f8f9fc' }}>
            <span>Order ID</span><span>Client</span><span>Amount</span><span>Status</span><span>Date</span>
          </div>
          <div className="flex flex-col items-center justify-center py-16">
            <Icon className="w-10 h-10 mb-3 opacity-20" style={{ color: W.gray }} />
            <p className="text-[13px]" style={{ color: W.gray }}>No orders found</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
