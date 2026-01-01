import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, Package, Clock, CheckCircle2, XCircle, 
  Download, Eye, Filter, Search, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const orders = [
  { 
    id: 'ORD-2024-001', 
    product: 'E-Commerce Platform', 
    client: '[MASKED]', 
    amount: 50000, 
    commission: 10000,
    date: '2024-01-15', 
    status: 'completed',
    paymentStatus: 'paid'
  },
  { 
    id: 'ORD-2024-002', 
    product: 'Hospital Management System', 
    client: '[MASKED]', 
    amount: 125000, 
    commission: 25000,
    date: '2024-01-14', 
    status: 'processing',
    paymentStatus: 'pending'
  },
  { 
    id: 'ORD-2024-003', 
    product: 'School ERP', 
    client: '[MASKED]', 
    amount: 75000, 
    commission: 15000,
    date: '2024-01-12', 
    status: 'completed',
    paymentStatus: 'paid'
  },
  { 
    id: 'ORD-2024-004', 
    product: 'POS System', 
    client: '[MASKED]', 
    amount: 40000, 
    commission: 8000,
    date: '2024-01-10', 
    status: 'pending',
    paymentStatus: 'pending'
  },
  { 
    id: 'ORD-2024-005', 
    product: 'Inventory Management', 
    client: '[MASKED]', 
    amount: 65000, 
    commission: 13000,
    date: '2024-01-08', 
    status: 'cancelled',
    paymentStatus: 'refunded'
  },
];

const orderStats = [
  { label: 'Total Orders', value: '48', icon: ShoppingCart, color: 'emerald' },
  { label: 'This Month', value: '12', icon: Package, color: 'teal' },
  { label: 'Pending', value: '3', icon: Clock, color: 'amber' },
  { label: 'Total Revenue', value: '₹4.2L', icon: TrendingUp, color: 'cyan' },
];

const ResellerOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return styles[status] || styles.pending;
  };

  const getPaymentBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-emerald-500/20 text-emerald-400',
      pending: 'bg-amber-500/20 text-amber-400',
      refunded: 'bg-red-500/20 text-red-400',
    };
    return styles[status] || styles.pending;
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders / Sales</h1>
          <p className="text-slate-400">Track all your sales and order history</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {orderStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-900/50 border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${stat.color}-500/20`}>
                      <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-slate-400">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Orders List */}
      <Card className="bg-slate-900/50 border-emerald-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              Order History
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search orders..."
                  className="pl-9 bg-slate-800/50 border-slate-700 text-white w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">No orders found</p>
              </div>
            ) : (
              filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Package className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{order.product}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>{order.id}</span>
                        <span>•</span>
                        <span>{order.client}</span>
                        <span>•</span>
                        <span>{order.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-white font-bold">₹{order.amount.toLocaleString()}</p>
                      <p className="text-emerald-400 text-sm">+₹{order.commission.toLocaleString()} comm.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusBadge(order.status)}>
                        {order.status}
                      </Badge>
                      <Badge className={getPaymentBadge(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerOrders;
