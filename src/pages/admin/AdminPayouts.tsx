import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DollarSign, Users, CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Payout {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  requested_at: string;
  processed_at?: string;
  resellers: {
    user: {
      email: string;
    };
  };
}

export default function AdminPayouts() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-payouts', {
        body: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;
      setPayouts(data.payouts || []);
    } catch (error) {
      toast.error('Failed to load payouts');
      console.error('Error loading payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePayoutStatus = async (payoutId: string, status: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-payouts', {
        body: { id: payoutId, status },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;

      toast.success('Payout status updated');
      loadPayouts();
    } catch (error) {
      toast.error('Failed to update payout status');
      console.error('Error updating payout:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle className="w-4 h-4" />;
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'FAILED': return <XCircle className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading payouts...</div>;
  }

  const totalPaid = payouts.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayouts = payouts.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);
  const totalPayouts = payouts.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payout Management</h1>
        <p className="text-gray-600">Process and manage reseller payout requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPayouts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingPayouts.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPayouts > 0 ? Math.round((payouts.filter(p => p.status === 'PAID').length / totalPayouts) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Payout Requests</CardTitle>
          <CardDescription>
            Review and process payout requests from resellers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {getStatusIcon(payout.status)}
                  </div>
                  <div>
                    <h3 className="font-medium">${payout.amount.toFixed(2)} payout</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{payout.resellers?.user?.email}</span>
                      </div>
                      <span>•</span>
                      <span>{payout.payment_method || 'Bank Transfer'}</span>
                      <span>•</span>
                      <span>Requested: {new Date(payout.requested_at).toLocaleDateString()}</span>
                      {payout.processed_at && (
                        <>
                          <span>•</span>
                          <span>Processed: {new Date(payout.processed_at).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(payout.status)}>
                    {payout.status}
                  </Badge>
                  {payout.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updatePayoutStatus(payout.id, 'APPROVED')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updatePayoutStatus(payout.id, 'PAID')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark Paid
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updatePayoutStatus(payout.id, 'CANCELLED')}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  {payout.status === 'APPROVED' && (
                    <Button
                      size="sm"
                      onClick={() => updatePayoutStatus(payout.id, 'PAID')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark Paid
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {payouts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No payout requests found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
