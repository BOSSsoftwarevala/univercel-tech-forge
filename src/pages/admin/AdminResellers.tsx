import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, DollarSign, ShoppingCart, TrendingUp, Edit } from 'lucide-react';

interface Reseller {
  id: string;
  user: {
    email: string;
  };
  commission_rate: number;
  status: string;
  joined_at: string;
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalCommission: number;
  };
}

export default function AdminResellers() {
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReseller, setEditingReseller] = useState<Reseller | null>(null);
  const [editForm, setEditForm] = useState({
    status: '',
    commission_rate: ''
  });

  useEffect(() => {
    loadResellers();
  }, []);

  const loadResellers = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-resellers', {
        body: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;
      setResellers(data.resellers || []);
    } catch (error) {
      toast.error('Failed to load resellers');
      console.error('Error loading resellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReseller = async () => {
    if (!editingReseller) return;

    const updates: any = {};
    if (editForm.status) updates.status = editForm.status;
    if (editForm.commission_rate) updates.commission_rate = parseFloat(editForm.commission_rate);

    try {
      const { data, error } = await supabase.functions.invoke('admin-resellers', {
        body: {
          id: editingReseller.id,
          ...updates
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;

      toast.success('Reseller updated successfully');
      setEditingReseller(null);
      setEditForm({ status: '', commission_rate: '' });
      loadResellers();
    } catch (error) {
      toast.error('Failed to update reseller');
      console.error('Error updating reseller:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'BLOCKED': return 'bg-red-100 text-red-800';
      case 'SUSPENDED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading resellers...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reseller Management</h1>
        <p className="text-gray-600">Manage all resellers and their accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resellers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Resellers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resellers.filter(r => r.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resellers.reduce((sum, r) => sum + (r.stats?.totalOrders || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${resellers.reduce((sum, r) => sum + (r.stats?.totalCommission || 0), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Resellers</CardTitle>
          <CardDescription>
            View and manage reseller accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resellers.map((reseller) => (
              <div key={reseller.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{reseller.user.email}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Joined: {new Date(reseller.joined_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{reseller.stats?.totalOrders || 0} orders</span>
                      <span>•</span>
                      <span>${reseller.stats?.totalRevenue?.toFixed(2) || '0.00'} revenue</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">{reseller.commission_rate}% commission</div>
                    <Badge className={getStatusColor(reseller.status)}>
                      {reseller.status}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingReseller(reseller);
                      setEditForm({
                        status: reseller.status,
                        commission_rate: reseller.commission_rate.toString()
                      });
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {resellers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No resellers found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Reseller Dialog */}
      {editingReseller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Reseller</CardTitle>
              <CardDescription>
                Update reseller settings for {editingReseller.user.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="BLOCKED">Blocked</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="commission">Commission Rate (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  value={editForm.commission_rate}
                  onChange={(e) => setEditForm({...editForm, commission_rate: e.target.value})}
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingReseller(null)}>
                  Cancel
                </Button>
                <Button onClick={updateReseller}>
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
