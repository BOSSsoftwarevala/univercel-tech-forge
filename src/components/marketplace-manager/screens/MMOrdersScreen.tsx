import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package,
  Eye,
  MessageSquare,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Order {
  id: string;
  orderNumber: string;
  productName: string;
  amount: number;
  status: 'pending' | 'approved' | 'in_development' | 'completed' | 'rejected';
  orderedAt: string;
  estimatedDelivery?: string;
  requirements?: string;
}

const orders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    productName: 'CRM Pro Suite',
    amount: 35000,
    status: 'in_development',
    orderedAt: '2024-01-15',
    estimatedDelivery: '2024-01-30',
    requirements: 'Need custom fields for real estate leads'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    productName: 'E-Shop Builder',
    amount: 28000,
    status: 'pending',
    orderedAt: '2024-01-18',
    requirements: 'Fashion store with size guide'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    productName: 'Marketing Autopilot',
    amount: 24500,
    status: 'completed',
    orderedAt: '2024-01-05',
    estimatedDelivery: '2024-01-15'
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    productName: 'Lead Magnet Pro',
    amount: 17500,
    status: 'approved',
    orderedAt: '2024-01-17',
    estimatedDelivery: '2024-02-01'
  },
];

const statusConfig = {
  pending: { label: 'Pending Approval', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Clock },
  approved: { label: 'Approved', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: CheckCircle },
  in_development: { label: 'In Development', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Package },
  completed: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
};

export function MMOrdersScreen() {
  const [filter, setFilter] = useState<string>('all');

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => o.status === 'in_development' || o.status === 'approved').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-purple-400" />
          My Orders
        </h1>
        <p className="text-slate-400 mt-1">Track and manage your software orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <p className="text-xs text-slate-400">Total Orders</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4">
            <p className="text-xs text-amber-400">Pending</p>
            <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4">
            <p className="text-xs text-purple-400">In Progress</p>
            <p className="text-2xl font-bold text-purple-400">{stats.inProgress}</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4">
            <p className="text-xs text-emerald-400">Completed</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.completed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'in_development', 'completed'].map(status => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
            className={filter === status 
              ? "bg-purple-500 hover:bg-purple-600" 
              : "border-slate-700"
            }
          >
            {status === 'all' ? 'All' : statusConfig[status as keyof typeof statusConfig]?.label || status}
          </Button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => {
          const StatusIcon = statusConfig[order.status].icon;
          
          return (
            <Card key={order.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-slate-700">
                      <Package className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{order.productName}</h3>
                      <p className="text-sm text-slate-400">{order.orderNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lg font-bold">
                        <IndianRupee className="h-4 w-4" />
                        {order.amount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar className="h-3 w-3" />
                        {order.orderedAt}
                      </div>
                    </div>

                    <Badge className={statusConfig[order.status].color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig[order.status].label}
                    </Badge>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="border-slate-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border-slate-700">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-slate-400">Product</p>
                                <p className="font-medium">{order.productName}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400">Amount</p>
                                <p className="font-medium">₹{order.amount.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400">Order Date</p>
                                <p className="font-medium">{order.orderedAt}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400">Est. Delivery</p>
                                <p className="font-medium">{order.estimatedDelivery || 'TBD'}</p>
                              </div>
                            </div>
                            {order.requirements && (
                              <div>
                                <p className="text-xs text-slate-400 mb-1">Requirements</p>
                                <p className="text-sm p-3 rounded-lg bg-slate-800 border border-slate-700">
                                  {order.requirements}
                                </p>
                              </div>
                            )}
                            <div className="flex items-center justify-center p-4">
                              <Badge className={`${statusConfig[order.status].color} text-lg px-4 py-2`}>
                                <StatusIcon className="h-4 w-4 mr-2" />
                                {statusConfig[order.status].label}
                              </Badge>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" className="border-slate-600">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {order.status === 'in_development' && order.estimatedDelivery && (
                  <div className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-400">Development in progress</span>
                      <span>Est. Delivery: {order.estimatedDelivery}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div className="h-full w-3/5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
