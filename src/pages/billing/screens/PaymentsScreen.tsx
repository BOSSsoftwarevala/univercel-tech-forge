import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, Search, Filter, CheckCircle, XCircle, Clock,
  RefreshCw, Undo2, DollarSign, Smartphone, Building2, Wallet,
  ArrowUpRight, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Payment {
  id: string;
  invoiceId: string;
  client: string;
  amount: number;
  method: string;
  methodDetails: string;
  status: string;
  date: string;
  failReason?: string;
}

const PaymentsScreen = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        const formattedPayments: Payment[] = (data ?? []).map((order) => ({
          id: order.id,
          invoiceId: order.order_number,
          client: order.buyer_name,
          amount: Number(order.amount),
          method: order.payment_method || 'card',
          methodDetails: `${order.payment_gateway ?? 'payu'} - ${order.payment_id ?? ''}`,
          status: order.payment_status === 'verified' ? 'success' : (order.payment_status ?? 'pending'),
          date: new Date(order.created_at).toLocaleString(),
        }));

        setPayments(formattedPayments);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();

    const subscription = supabase
      .channel('orders-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchPayments()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-amber-500/20 text-amber-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      case 'refunded': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return CreditCard;
      case 'upi': return Smartphone;
      case 'bank': return Building2;
      case 'wallet': return Wallet;
      default: return CreditCard;
    }
  };

  const filteredPayments = payments.filter(p => {
    const matchesMethod = filterMethod === 'all' || p.method === filterMethod;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesSearch = p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.invoiceId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMethod && matchesStatus && matchesSearch;
  });

  const handleAction = (action: string, payment: Payment) => {
    switch (action) {
      case 'verify':
        toast.success(`Payment ${payment.id} verified`);
        break;
      case 'retry':
        toast.info(`Retrying payment for ${payment.invoiceId}`);
        break;
      case 'refund':
        toast.success(`Refund initiated for ${payment.id}`);
        break;
    }
  };

  const stats = {
    total: payments.reduce((acc, p) => p.status === 'success' ? acc + p.amount : acc, 0),
    success: payments.filter(p => p.status === 'success').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-slate-400">Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-emerald-400" />
          Payments
        </h2>
        <p className="text-slate-400">Track all payment transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-emerald-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-white">${stats.total.toFixed(0)}</p>
                <p className="text-xs text-slate-400">Total Collected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.success}</p>
                <p className="text-xs text-slate-400">Successful</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
                <p className="text-xs text-slate-400">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.failed}</p>
                <p className="text-xs text-slate-400">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payments..."
            className="pl-10 bg-slate-800 border-slate-600"
          />
        </div>
        <Select value={filterMethod} onValueChange={setFilterMethod}>
          <SelectTrigger className="w-36 bg-slate-800 border-slate-600">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="bank">Bank Transfer</SelectItem>
            <SelectItem value="wallet">Wallet</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 bg-slate-800 border-slate-600">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments List */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-4">
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {filteredPayments.map((payment) => {
                const MethodIcon = getMethodIcon(payment.method);
                return (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          payment.status === 'success' ? 'bg-green-500/20' :
                          payment.status === 'pending' ? 'bg-amber-500/20' : 'bg-red-500/20'
                        }`}>
                          <MethodIcon className={`w-5 h-5 ${
                            payment.status === 'success' ? 'text-green-400' :
                            payment.status === 'pending' ? 'text-amber-400' : 'text-red-400'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{payment.id}</span>
                            <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                          </div>
                          <p className="text-sm text-slate-400">{payment.client}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span>Invoice: {payment.invoiceId}</span>
                            <span>•</span>
                            <span>{payment.methodDetails}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">${payment.amount.toFixed(2)}</p>
                          <p className="text-xs text-slate-500">{payment.date}</p>
                        </div>
                        <div className="flex gap-1">
                          {payment.status === 'pending' && (
                            <Button size="sm" variant="outline" className="border-green-500/50 text-green-400" onClick={() => handleAction('verify', payment)}>
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                          )}
                          {payment.status === 'failed' && (
                            <Button size="sm" variant="outline" className="border-blue-500/50 text-blue-400" onClick={() => handleAction('retry', payment)}>
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                          )}
                          {payment.status === 'success' && (
                            <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-400" onClick={() => handleAction('refund', payment)}>
                              <Undo2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    {payment.failReason && (
                      <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-400">{payment.failReason}</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsScreen;
