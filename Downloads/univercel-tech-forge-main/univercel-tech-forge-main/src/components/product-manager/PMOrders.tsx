import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Search,
  RefreshCw,
  MoreVertical,
  Eye,
  FileText,
  RotateCcw,
  XCircle,
  Key,
  DollarSign,
  Clock,
  CheckCircle,
  Package,
  TrendingUp,
} from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  product_name: string;
  customer_name: string;
  customer_email: string;
  quantity: number;
  total: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  license_key?: string;
  created_at: string;
}

const mockOrders: Order[] = [
  { id: '1', order_number: 'ORD-2024-001', product_name: 'CRM Enterprise', customer_name: 'John Smith', customer_email: 'john@company.com', quantity: 5, total: 495, currency: 'USD', status: 'completed', payment_status: 'paid', license_key: 'LIC-XXXXX-XXXXX', created_at: '2024-01-15' },
  { id: '2', order_number: 'ORD-2024-002', product_name: 'HR Management Pro', customer_name: 'Sarah Johnson', customer_email: 'sarah@corp.io', quantity: 2, total: 198, currency: 'USD', status: 'processing', payment_status: 'paid', created_at: '2024-01-16' },
  { id: '3', order_number: 'ORD-2024-003', product_name: 'Inventory Tracker', customer_name: 'Mike Brown', customer_email: 'mike@startup.co', quantity: 1, total: 49, currency: 'USD', status: 'pending', payment_status: 'pending', created_at: '2024-01-17' },
  { id: '4', order_number: 'ORD-2024-004', product_name: 'POS System', customer_name: 'Emma Wilson', customer_email: 'emma@retail.com', quantity: 3, total: 297, currency: 'USD', status: 'cancelled', payment_status: 'refunded', created_at: '2024-01-14' },
];

const PMOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    pending: orders.filter(o => o.status === 'pending' || o.status === 'processing').length,
    totalRevenue: orders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + o.total, 0),
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowViewDialog(true);
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: 'cancelled' as const, payment_status: 'refunded' as const } : o
    ));
    toast.success('Order cancelled and refunded');
  };

  const handleRefund = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: 'refunded' as const, payment_status: 'refunded' as const } : o
    ));
    toast.success('Refund processed');
  };

  const handleGenerateInvoice = (order: Order) => {
    toast.success(`Invoice generated for ${order.order_number}`);
  };

  const handleDeliverLicense = (order: Order) => {
    setOrders(orders.map(o => 
      o.id === order.id ? { ...o, license_key: `LIC-${Date.now().toString(36).toUpperCase()}`, status: 'completed' as const } : o
    ));
    toast.success('License delivered to customer');
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
      pending: { variant: 'outline', color: 'text-amber-500' },
      confirmed: { variant: 'secondary', color: 'text-blue-500' },
      processing: { variant: 'secondary', color: 'text-purple-500' },
      completed: { variant: 'default', color: 'text-green-500' },
      cancelled: { variant: 'destructive', color: 'text-red-500' },
      refunded: { variant: 'destructive', color: 'text-red-500' },
    };
    const { variant, color } = config[status] || config.pending;
    return <Badge variant={variant} className={color}>{status}</Badge>;
  };

  const getPaymentBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { variant: 'outline' },
      paid: { variant: 'default' },
      failed: { variant: 'destructive' },
      refunded: { variant: 'secondary' },
    };
    return <Badge variant={config[status]?.variant || 'outline'}>{status}</Badge>;
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.order_number.toLowerCase().includes(search.toLowerCase()) ||
                          o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
                          o.product_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-blue-500" />
            Orders
          </h1>
          <p className="text-muted-foreground text-sm">View and manage product orders</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">${stats.totalRevenue}</p>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium font-mono">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">{order.created_at}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span>{order.product_name}</span>
                      <Badge variant="outline" className="text-xs">x{order.quantity}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-bold">{order.currency} {order.total}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPaymentBadge(order.payment_status)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleGenerateInvoice(order)}>
                            <FileText className="w-4 h-4 mr-2" />
                            Generate Invoice
                          </DropdownMenuItem>
                          {order.status === 'processing' && (
                            <DropdownMenuItem onClick={() => handleDeliverLicense(order)}>
                              <Key className="w-4 h-4 mr-2" />
                              Deliver License
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {order.status !== 'cancelled' && order.status !== 'refunded' && (
                            <>
                              <DropdownMenuItem onClick={() => handleRefund(order.id)}>
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Refund
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel Order
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-mono font-bold">{selectedOrder.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p>{selectedOrder.created_at}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-medium">{selectedOrder.product_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p>{selectedOrder.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-mono font-bold text-lg">{selectedOrder.currency} {selectedOrder.total}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment</p>
                  {getPaymentBadge(selectedOrder.payment_status)}
                </div>
                {selectedOrder.license_key && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">License Key</p>
                    <p className="font-mono bg-secondary p-2 rounded">{selectedOrder.license_key}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PMOrders;
