import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Eye, Filter, Search, Calendar,
  CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const invoices = [
  { 
    id: 'INV-2024-001', 
    client: '[MASKED] - Tech Corp',
    product: 'E-Commerce Platform',
    amount: 50000,
    commission: 10000,
    date: '2024-01-15',
    dueDate: '2024-02-15',
    status: 'paid'
  },
  { 
    id: 'INV-2024-002', 
    client: '[MASKED] - Global Enterprises',
    product: 'Hospital Management',
    amount: 125000,
    commission: 25000,
    date: '2024-01-14',
    dueDate: '2024-02-14',
    status: 'pending'
  },
  { 
    id: 'INV-2024-003', 
    client: '[MASKED] - StartUp India',
    product: 'School ERP',
    amount: 75000,
    commission: 15000,
    date: '2024-01-12',
    dueDate: '2024-02-12',
    status: 'paid'
  },
  { 
    id: 'INV-2024-004', 
    client: '[MASKED] - Digital First',
    product: 'POS System',
    amount: 40000,
    commission: 8000,
    date: '2024-01-10',
    dueDate: '2024-02-10',
    status: 'overdue'
  },
];

const invoiceStats = [
  { label: 'Total Invoices', value: '48', icon: FileText, color: 'emerald' },
  { label: 'Paid', value: '42', icon: CheckCircle2, color: 'teal' },
  { label: 'Pending', value: '4', icon: Clock, color: 'amber' },
  { label: 'Overdue', value: '2', icon: AlertCircle, color: 'red' },
];

const ResellerInvoices = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      overdue: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return styles[status] || styles.pending;
  };

  const handleDownload = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}...`);
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoices</h1>
          <p className="text-slate-400">View and download your sales invoices</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {invoiceStats.map((stat, index) => {
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

      {/* Invoices List */}
      <Card className="bg-slate-900/50 border-emerald-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              All Invoices
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search invoices..."
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
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">No invoices found</p>
              </div>
            ) : (
              filteredInvoices.map((invoice, index) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{invoice.id}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>{invoice.product}</span>
                        <span>•</span>
                        <span>{invoice.client}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-white font-bold">₹{invoice.amount.toLocaleString()}</p>
                      <p className="text-emerald-400 text-sm">+₹{invoice.commission.toLocaleString()} comm.</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <Calendar className="w-3 h-3" />
                        {invoice.date}
                      </div>
                      <p className="text-slate-500 text-xs">Due: {invoice.dueDate}</p>
                    </div>
                    <Badge variant="outline" className={getStatusBadge(invoice.status)}>
                      {invoice.status}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-400 hover:text-emerald-400"
                        onClick={() => handleDownload(invoice.id)}
                      >
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

export default ResellerInvoices;
