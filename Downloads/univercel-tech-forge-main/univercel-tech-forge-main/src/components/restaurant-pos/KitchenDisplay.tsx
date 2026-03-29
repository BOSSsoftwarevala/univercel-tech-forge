import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  ChefHat,
  AlertTriangle,
  Bell,
  Timer,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface KitchenOrder {
  id: string;
  table: string;
  orderType: 'dine-in' | 'takeaway';
  items: {
    name: string;
    quantity: number;
    notes?: string;
    status: 'pending' | 'preparing' | 'ready';
  }[];
  time: string;
  elapsedMinutes: number;
  status: 'new' | 'preparing' | 'ready';
  priority: 'normal' | 'urgent';
}

const sampleOrders: KitchenOrder[] = [
  {
    id: 'KOT-001',
    table: 'T3',
    orderType: 'dine-in',
    items: [
      { name: 'Butter Chicken', quantity: 2, status: 'preparing' },
      { name: 'Garlic Naan', quantity: 4, status: 'ready' },
      { name: 'Dal Makhani', quantity: 1, notes: 'Less spicy', status: 'pending' },
    ],
    time: '12:45 PM',
    elapsedMinutes: 8,
    status: 'preparing',
    priority: 'normal',
  },
  {
    id: 'KOT-002',
    table: 'Takeaway',
    orderType: 'takeaway',
    items: [
      { name: 'Chicken Biryani', quantity: 2, status: 'preparing' },
      { name: 'Raita', quantity: 2, status: 'ready' },
    ],
    time: '12:42 PM',
    elapsedMinutes: 11,
    status: 'preparing',
    priority: 'urgent',
  },
  {
    id: 'KOT-003',
    table: 'T1',
    orderType: 'dine-in',
    items: [
      { name: 'Paneer Tikka', quantity: 1, status: 'pending' },
      { name: 'Veg Biryani', quantity: 1, notes: 'Extra raita', status: 'pending' },
    ],
    time: '12:50 PM',
    elapsedMinutes: 3,
    status: 'new',
    priority: 'normal',
  },
  {
    id: 'KOT-004',
    table: 'T5',
    orderType: 'dine-in',
    items: [
      { name: 'Mutton Rogan Josh', quantity: 1, status: 'ready' },
      { name: 'Jeera Rice', quantity: 2, status: 'ready' },
      { name: 'Butter Naan', quantity: 3, status: 'ready' },
    ],
    time: '12:35 PM',
    elapsedMinutes: 18,
    status: 'ready',
    priority: 'normal',
  },
];

export const KitchenDisplay: React.FC = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>(sampleOrders);
  const [filter, setFilter] = useState<'all' | 'new' | 'preparing' | 'ready'>('all');

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

  const updateItemStatus = (orderId: string, itemIndex: number, newStatus: 'pending' | 'preparing' | 'ready') => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const newItems = [...order.items];
        newItems[itemIndex] = { ...newItems[itemIndex], status: newStatus };
        
        // Update order status based on items
        const allReady = newItems.every(i => i.status === 'ready');
        const anyPreparing = newItems.some(i => i.status === 'preparing');
        const newOrderStatus = allReady ? 'ready' : anyPreparing ? 'preparing' : 'new';
        
        return { ...order, items: newItems, status: newOrderStatus };
      }
      return order;
    }));
  };

  const markOrderReady = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'ready', items: order.items.map(i => ({ ...i, status: 'ready' as const })) }
        : order
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      default: return 'bg-zinc-500';
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-bold text-white">Kitchen Display</h1>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <Clock className="w-4 h-4" />
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(['all', 'new', 'preparing', 'ready'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium capitalize transition-all",
                filter === f 
                  ? "bg-orange-500 text-white" 
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg">
            <span className="text-blue-400 font-bold">{orders.filter(o => o.status === 'new').length}</span>
            <span className="text-blue-400 text-sm">New</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-lg">
            <span className="text-orange-400 font-bold">{orders.filter(o => o.status === 'preparing').length}</span>
            <span className="text-orange-400 text-sm">Preparing</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg">
            <span className="text-green-400 font-bold">{orders.filter(o => o.status === 'ready').length}</span>
            <span className="text-green-400 text-sm">Ready</span>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-4 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={cn(
                "bg-zinc-900 rounded-xl border overflow-hidden",
                order.priority === 'urgent' ? "border-red-500 animate-pulse" : "border-zinc-800",
                order.status === 'ready' && "border-green-500"
              )}
            >
              {/* Order Header */}
              <div className={cn(
                "p-3 flex items-center justify-between",
                order.status === 'new' && "bg-blue-500/20",
                order.status === 'preparing' && "bg-orange-500/20",
                order.status === 'ready' && "bg-green-500/20"
              )}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{order.id}</span>
                    {order.priority === 'urgent' && (
                      <Flame className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-zinc-400">
                    {order.orderType === 'dine-in' ? `Table ${order.table.replace('T', '')}` : '📦 Takeaway'}
                  </p>
                </div>
                <div className="text-right">
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    order.elapsedMinutes > 15 ? "text-red-400" : order.elapsedMinutes > 10 ? "text-yellow-400" : "text-zinc-400"
                  )}>
                    <Timer className="w-4 h-4" />
                    {order.elapsedMinutes}m
                  </div>
                  <p className="text-xs text-zinc-500">{order.time}</p>
                </div>
              </div>

              {/* Items */}
              <div className="p-3 space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      const nextStatus = item.status === 'pending' ? 'preparing' : item.status === 'preparing' ? 'ready' : 'pending';
                      updateItemStatus(order.id, idx, nextStatus);
                    }}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-all",
                      item.status === 'pending' && "bg-zinc-800 hover:bg-zinc-700",
                      item.status === 'preparing' && "bg-orange-500/20 border border-orange-500/50",
                      item.status === 'ready' && "bg-green-500/20 border border-green-500/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center text-sm font-bold text-white">
                          {item.quantity}
                        </span>
                        <span className="font-medium text-white">{item.name}</span>
                      </div>
                      <div className={cn("w-3 h-3 rounded-full", getStatusColor(item.status))} />
                    </div>
                    {item.notes && (
                      <p className="text-xs text-orange-400 mt-1 ml-8">⚠️ {item.notes}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="p-3 border-t border-zinc-800">
                {order.status === 'ready' ? (
                  <Button className="w-full bg-green-600 hover:bg-green-700 rounded-lg">
                    <Bell className="w-4 h-4 mr-2" />
                    Call Waiter
                  </Button>
                ) : (
                  <Button 
                    onClick={() => markOrderReady(order.id)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark Ready
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
