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
import { DollarSign, TrendingUp, Wallet, CreditCard, Calendar, Package } from 'lucide-react';

interface Transaction {
  id: string;
  commission_amount: number;
  commission_rate: number;
  status: string;
  created_at: string;
  orders?: {
    product_name: string;
    amount: number;
  };
}

interface Payout {
  id: string;
  amount: number;
  status: string;
  payment_method?: string;
  requested_at: string;
  processed_at?: string;
}

interface EarningsSummary {
  totalEarned: number;
  pendingEarnings: number;
  completedEarnings: number;
  commissionRate: number;
}

export default function ResellerEarnings() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

  useEffect(() => {
    loadEarnings();
    loadPayouts();
  }, []);

  const loadEarnings = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('reseller-earnings', {
        body: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;
      setTransactions(data.earnings?.transactions || []);
      setSummary(data.earnings?.summary || null);
    } catch (error) {
      toast.error('Failed to load earnings');
      console.error('Error loading earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPayouts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('reseller-earnings', {
        body: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;
      setPayouts(data.payouts?.payouts || []);
    } catch (error) {
      console.error('Error loading payouts:', error);
    }
  };

  const requestPayout = async () => {
    const amount = parseFloat(payoutAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (summary && amount > (summary.totalEarned - (payouts.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0)))) {
      toast.error('Insufficient balance for payout');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('reseller-earnings', {
        body: {
          action: 'request-payout',
          amount,
          payment_method: paymentMethod
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;

      toast.success('Payout request submitted successfully');
      setShowPayoutDialog(false);
      setPayoutAmount('');
      loadPayouts();
    } catch (error) {
      toast.error('Failed to request payout');
      console.error('Error requesting payout:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const availableBalance = summary ? summary.totalEarned - (payouts.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0)) : 0;

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading earnings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Earnings & Payouts</h1>
          <p className="text-gray-600">Track your commissions and manage payouts</p>
        </div>
        <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
          <DialogTrigger asChild>
            <Button disabled={availableBalance <= 0}>
              <Wallet className="w-4 h-4 mr-2" />
              Request Payout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Payout</DialogTitle>
              <DialogDescription>
                Request a payout for your available earnings. Available balance: ${availableBalance.toFixed(2)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="Enter amount"
                  max={availableBalance}
                />
              </div>
              <div>
                <Label htmlFor="payment">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowPayoutDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={requestPayout}>
                  Request Payout
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary?.totalEarned.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              {summary?.commissionRate}% commission rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${availableBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Ready for payout
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary?.pendingEarnings.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting completion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payouts.filter(p => p.status === 'PAID').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Completed payouts
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Commission History</CardTitle>
            <CardDescription>
              Your commission earnings from completed orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{transaction.orders?.product_name || 'Order'}</h4>
                      <p className="text-sm text-gray-600">
                        ${transaction.orders?.amount || 0} order • {transaction.commission_rate}% commission
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">
                      +${transaction.commission_amount.toFixed(2)}
                    </div>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No commission history yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
            <CardDescription>
              Your payout requests and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">${payout.amount.toFixed(2)}</h4>
                      <p className="text-sm text-gray-600">
                        {payout.payment_method || 'Bank Transfer'} • {new Date(payout.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(payout.status)}>
                    {payout.status}
                  </Badge>
                </div>
              ))}
              {payouts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No payout history yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
