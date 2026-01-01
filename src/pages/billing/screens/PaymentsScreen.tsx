import { useState } from 'react';
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

const payments = [
  {
    id: 'PAY-2024-001',
    invoiceId: 'INV-2024-155',
    client: 'TechStart Inc',
    amount: 2891,
    method: 'card',
    methodDetails: 'Visa ****4242',
    status: 'success',
    date: '2024-12-24 14:32',
  },
  {
    id: 'PAY-2024-002',
    invoiceId: 'INV-2024-152',
    client: 'StartupXYZ',
    amount: 1050.2,
    method: 'upi',
    methodDetails: 'UPI - success@upi',
    status: 'success',
    date: '2024-12-23 10:15',
  },
  {
    id: 'PAY-2024-003',
    invoiceId: 'INV-2024-148',
    client: 'DataFlow Ltd',
    amount: 5200,
    method: 'bank',
    methodDetails: 'NEFT Transfer',
    status: 'pending',
    date: '2024-12-22 16:45',
  },
  {
    id: 'PAY-2024-004',
    invoiceId: 'INV-2024-145',
    client: 'CloudBase Pro',
    amount: 890,
    method: 'card',
    methodDetails: 'Mastercard ****8888',
    status: 'failed',
    date: '2024-12-21 09:20',
    failReason: 'Card declined',
  },
  {
    id: 'PAY-2024-005',
    invoiceId: 'INV-2024-140',
    client: 'Acme Corp',
    amount: 3500,
    method: 'wallet',
    methodDetails: 'Wallet Balance',
    status: 'success',
    date: '2024-12-20 11:55',
  },
  {
    id: 'PAY-2024-006',
    invoiceId: 'INV-2024-138',
    client: 'MegaCorp Industries',
    amount: 12500,
    method: 'bank',
    methodDetails: 'Wire Transfer',
    status: 'success',
    date: '2024-12-19 15:30',
  },
];

const PaymentsScreen = () => {
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleAction = (action: string, payment: typeof payments[0]) => {
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
