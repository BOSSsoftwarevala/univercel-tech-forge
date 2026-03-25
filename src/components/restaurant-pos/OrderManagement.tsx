import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Eye,
  Printer,
  Filter,
  Users,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  table: string;
  orderType: 'dine-in' | 'takeaway';
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  time: string;
  paymentStatus: 'pending' | 'paid';
  customerName?: string;
}

const sampleOrders: Order[] = [
  {
    id: 'ORD-1001',
    table: 'T3',
    orderType: 'dine-in',
    items: [
      { name: 'Butter Chicken', quantity: 2, price: 380 },
      { name: 'Garlic Naan', quantity: 4, price: 70 },
      { name: 'Jeera Rice', quantity: 2, price: 150 },
    ],
    total: 1340,
    status: 'preparing',
    time: '12:45 PM',
    paymentStatus: 'pending',
  },
  {
    id: 'ORD-1002',
    table: 'Takeaway',
    orderType: 'takeaway',
    items: [
      { name: 'Chicken Biryani', quantity: 2, price: 350 },
      { name: 'Raita', quantity: 2, price: 50 },
    ],
    total: 800,
    status: 'ready',
    time: '12:42 PM',
    paymentStatus: 'paid',
    customerName: 'Rahul S.',
  },
  {
    id: 'ORD-1003',
    table: 'T1',
    orderType: 'dine-in',
    items: [
      { name: 'Paneer Tikka', quantity: 1, price: 280 },
      { name: 'Veg Biryani', quantity: 2, price: 280 },
    ],
    total: 840,
    status: 'pending',
    time: '12:50 PM',
    paymentStatus: 'pending',
  },
  {
    id: 'ORD-1004',
    table: 'T5',
    orderType: 'dine-in',
    items: [
      { name: 'Mutton Rogan Josh', quantity: 1, price: 450 },
      { name: 'Butter Naan', quantity: 3, price: 60 },
    ],
    total: 630,
    status: 'served',
    time: '12:30 PM',
    paymentStatus: 'pending',
  },
  {
    id: 'ORD-1005',
    table: 'T2',
    orderType: 'dine-in',
    items: [
      { name: 'Dal Makhani', quantity: 1, price: 280 },
      { name: 'Tandoori Roti', quantity: 4, price: 40 },
    ],
    total: 440,
    status: 'completed',
    time: '12:15 PM',
    paymentStatus: 'paid',
  },
];

export const OrderManagement: React.FC = () => {
  const [orders] = useState<Order[]>(sampleOrders);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    preparing: 'bg-orange-500',
    ready: 'bg-blue-500',
    served: 'bg-purple-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500',
  };

  const filteredOrders = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (searchQuery && !o.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="h-full flex bg-zinc-950">
      {/* Orders List */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">Orders</h1>
            <div className="flex gap-2">
              <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-xl">
                <Printer className="w-4 h-4 mr-2" />
                Print Report
              </Button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-700 text-white rounded-xl"
              />
            </div>
            <div className="flex gap-1 bg-zinc-900 rounded-xl p-1">
              {['all', 'pending', 'preparing', 'ready', 'served', 'completed'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                    filter === f 
                      ? "bg-orange-500 text-white" 
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="p-4 grid grid-cols-5 gap-3">
          {[
            { label: 'Pending', count: orders.filter(o => o.status === 'pending').length, color: 'yellow' },
            { label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length, color: 'orange' },
            { label: 'Ready', count: orders.filter(o => o.status === 'ready').length, color: 'blue' },
            { label: 'Served', count: orders.filter(o => o.status === 'served').length, color: 'purple' },
            { label: 'Completed', count: orders.filter(o => o.status === 'completed').length, color: 'green' },
          ].map(stat => (
            <div key={stat.label} className={`bg-${stat.color}-500/10 rounded-xl p-4 border border-${stat.color}-500/20`}>
              <p className={`text-${stat.color}-400 text-sm mb-1`}>{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={cn(
                  "bg-zinc-900 rounded-xl p-4 cursor-pointer transition-all hover:bg-zinc-800 border",
                  selectedOrder?.id === order.id ? "border-orange-500" : "border-zinc-800"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white">{order.id}</span>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium capitalize",
                      statusColors[order.status],
                      "text-white"
                    )}>
                      {order.status}
                    </span>
                    {order.orderType === 'takeaway' && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                        Takeaway
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {order.time}
                    </span>
                    <span className="flex items-center gap-1">
                      {order.orderType === 'dine-in' ? (
                        <>
                          <Users className="w-4 h-4" />
                          Table {order.table.replace('T', '')}
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          {order.customerName}
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-sm">
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="px-2 py-1 bg-zinc-800 text-zinc-500 rounded text-sm">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-400">₹{order.total}</p>
                    <p className={cn(
                      "text-xs",
                      order.paymentStatus === 'paid' ? "text-green-400" : "text-yellow-400"
                    )}>
                      {order.paymentStatus === 'paid' ? '✓ Paid' : 'Payment Pending'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Details Panel */}
      {selectedOrder && (
        <div className="w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white">{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-zinc-500 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium capitalize text-white",
                statusColors[selectedOrder.status]
              )}>
                {selectedOrder.status}
              </span>
              <span className="text-zinc-500 text-sm">{selectedOrder.time}</span>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-zinc-500 mb-2">Order Details</h3>
              <div className="bg-zinc-800 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Type</span>
                  <span className="text-white capitalize">{selectedOrder.orderType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Table/Customer</span>
                  <span className="text-white">
                    {selectedOrder.orderType === 'dine-in' 
                      ? `Table ${selectedOrder.table.replace('T', '')}` 
                      : selectedOrder.customerName}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-zinc-500 mb-2">Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-orange-500/20 text-orange-400 rounded flex items-center justify-center text-sm font-bold">
                        {item.quantity}
                      </span>
                      <span className="text-white">{item.name}</span>
                    </div>
                    <span className="text-zinc-400">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-white">₹{selectedOrder.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Tax (5%)</span>
                <span className="text-white">₹{(selectedOrder.total * 0.05).toFixed(0)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-zinc-700">
                <span className="text-white">Total</span>
                <span className="text-orange-400">₹{(selectedOrder.total * 1.05).toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-zinc-800 space-y-2">
            <Button className="w-full bg-green-600 hover:bg-green-700 rounded-xl">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark as Served
            </Button>
            <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 rounded-xl">
              <Printer className="w-4 h-4 mr-2" />
              Print Bill
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
