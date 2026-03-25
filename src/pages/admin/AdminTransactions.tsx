import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DollarSign, Users, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';

interface Transaction {
  id: string;
  commission_amount: number;
  commission_rate: number;
  status: string;
  created_at: string;
  resellers: {
    user: {
      email: string;
    };
  };
  orders: {
    product_name: string;
    amount: number;
    status: string;
    customers: {
      name: string;
    };
  };
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-transactions', {
        body: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;
      setTransactions(data.transactions || []);
    } catch (error) {
      toast.error('Failed to load transactions');
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionStatus = async (transactionId: string, status: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-transactions', {
        body: { id: transactionId, status },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;

      toast.success('Transaction status updated');
      loadTransactions();
    } catch (error) {
      toast.error('Failed to update transaction status');
      console.error('Error updating transaction:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading transactions...</div>;
  }

  const totalCommission = transactions.reduce((sum, t) => sum + (t.commission_amount || 0), 0);
  const completedTransactions = transactions.filter(t => t.status === 'COMPLETED').length;
  const pendingTransactions = transactions.filter(t => t.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transaction Management</h1>
        <p className="text-gray-600">Monitor and manage all reseller commission transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCommission.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTransactions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTransactions}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            View and manage commission transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {transaction.orders?.product_name || 'Order'} - ${transaction.orders?.amount || 0}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{transaction.resellers?.user?.email}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <ShoppingCart className="w-3 h-3" />
                        <span>{transaction.orders?.customers?.name || 'No customer'}</span>
                      </div>
                      <span>•</span>
                      <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium text-green-600">
                      +${transaction.commission_amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {transaction.commission_rate}% rate
                    </div>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                  {transaction.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updateTransactionStatus(transaction.id, 'COMPLETED')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTransactionStatus(transaction.id, 'CANCELLED')}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No transactions found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
