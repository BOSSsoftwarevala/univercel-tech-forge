import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Users, Mail, Phone, MapPin, Edit, Trash2 } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
}

export default function ResellerCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    loadCustomers();
  }, []);

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
      toast.error('Failed to load customers');
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCustomerForm({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setShowCreateDialog(true);
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setCustomerForm({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || ''
    });
    setShowEditDialog(true);
  };

  const createCustomer = async () => {
    if (!customerForm.name) {
      toast.error('Customer name is required');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('reseller-customers', {
        body: {
          action: 'create',
          name: customerForm.name,
          email: customerForm.email || null,
          phone: customerForm.phone || null,
          address: customerForm.address || null
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;

      toast.success('Customer created successfully');
      setShowCreateDialog(false);
      resetForm();
      loadCustomers();
    } catch (error) {
      toast.error('Failed to create customer');
      console.error('Error creating customer:', error);
    }
  };

  const updateCustomer = async () => {
    if (!editingCustomer || !customerForm.name) {
      toast.error('Customer name is required');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('reseller-customers', {
        body: {
          action: 'update',
          id: editingCustomer.id,
          name: customerForm.name,
          email: customerForm.email || null,
          phone: customerForm.phone || null,
          address: customerForm.address || null
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;

      toast.success('Customer updated successfully');
      setShowEditDialog(false);
      setEditingCustomer(null);
      resetForm();
      loadCustomers();
    } catch (error) {
      toast.error('Failed to update customer');
      console.error('Error updating customer:', error);
    }
  };

  const deleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer? This will also delete all associated orders.')) {
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('reseller-customers', {
        body: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;

      toast.success('Customer deleted successfully');
      loadCustomers();
    } catch (error) {
      toast.error('Failed to delete customer');
      console.error('Error deleting customer:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading customers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-gray-600">Manage your customer database and relationships</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Create a new customer record to track their orders and information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                  placeholder="customer@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm({...customerForm, address: e.target.value})}
                  placeholder="Enter customer address"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createCustomer}>
                  Create Customer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            View and manage all your customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{customer.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {customer.email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{customer.email}</span>
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </div>
                    {customer.address && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{customer.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(customer)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteCustomer(customer.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {customers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No customers yet. Add your first customer to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Customer Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={customerForm.name}
                onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={customerForm.email}
                onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                placeholder="customer@example.com"
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={customerForm.phone}
                onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                value={customerForm.address}
                onChange={(e) => setCustomerForm({...customerForm, address: e.target.value})}
                placeholder="Enter customer address"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={updateCustomer}>
                Update Customer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
