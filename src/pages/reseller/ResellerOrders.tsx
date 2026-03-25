import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Package, DollarSign, Calendar, User } from 'lucide-react';

interface Order {
  id: string;
  product_name: string;
  amount: number;
  currency: string;
  status: string;
  order_date: string;
  customers?: {
    name: string;
    email: string;
  };
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

export default function ResellerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer_id: '',
    product_name: '',
    amount: '',
    currency: 'USD'
  });

  useEffect(() => {
    loadOrders();
    loadCustomers();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('reseller-orders', {
        body: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;
      setOrders(data.orders || []);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('reseller-customers', {
        body: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const createOrder = async () => {
    if (!newOrder.product_name || !newOrder.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('reseller-orders', {
        body: {
          action: 'create',
          customer_id: newOrder.customer_id || null,
          product_name: newOrder.product_name,
          amount: parseFloat(newOrder.amount),
          currency: newOrder.currency
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;

      toast.success('Order created successfully');
      setShowCreateDialog(false);
      setNewOrder({ customer_id: '', product_name: '', amount: '', currency: 'USD' });
      loadOrders();
    } catch (error) {
      toast.error('Failed to create order');
      console.error('Error creating order:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('reseller-orders', {
        body: { id: orderId, status },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;

      toast.success('Order status updated');
      loadOrders();
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'REFUNDED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-600">Manage your sales orders and track revenue</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>
                Add a new sales order to track your revenue and commissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer">Customer (Optional)</Label>
                <Select value={newOrder.customer_id} onValueChange={(value) => setNewOrder({...newOrder, customer_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No customer</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} ({customer.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="product">Product Name</Label>
                <Input
                  id="product"
                  value={newOrder.product_name}
                  onChange={(e) => setNewOrder({...newOrder, product_name: e.target.value})}
                  placeholder="Enter product name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newOrder.amount}
                    onChange={(e) => setNewOrder({...newOrder, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={newOrder.currency} onValueChange={(value) => setNewOrder({...newOrder, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createOrder}>
                  Create Order
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${orders.reduce((sum, order) => sum + (order.amount || 0), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(order => order.status === 'COMPLETED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            View and manage all your sales orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-medium">{order.product_name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="w-3 h-3" />
                      <span>{order.customers?.name || 'No customer'}</span>
                      <span>•</span>
                      <span>{new Date(order.order_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">${order.amount.toFixed(2)} {order.currency}</div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  {order.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No orders yet. Create your first order to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
