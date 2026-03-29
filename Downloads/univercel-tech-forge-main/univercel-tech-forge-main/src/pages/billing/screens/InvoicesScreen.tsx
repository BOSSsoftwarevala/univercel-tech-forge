import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Filter, Plus, Eye, Edit, Send, Download,
  CheckCircle, X, MoreVertical, Calendar, DollarSign, User,
  Building, Package, Server, Tag, Percent, CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const invoices = [
  { 
    id: 'INV-2024-156', 
    client: 'Acme Corp', 
    clientType: 'business',
    product: 'Enterprise Server Plan',
    productType: 'server',
    amount: 3200, 
    tax: 576,
    total: 3776,
    status: 'sent', 
    dueDate: '2024-12-30',
    createdAt: '2024-12-25',
  },
  { 
    id: 'INV-2024-155', 
    client: 'TechStart Inc', 
    clientType: 'startup',
    product: 'Pro Demo License',
    productType: 'demo',
    amount: 2450, 
    tax: 441,
    total: 2891,
    status: 'paid', 
    dueDate: '2024-12-28',
    createdAt: '2024-12-24',
  },
  { 
    id: 'INV-2024-154', 
    client: 'DataFlow Ltd', 
    clientType: 'business',
    product: 'Custom Integration',
    productType: 'service',
    amount: 5800, 
    tax: 1044,
    total: 6844,
    status: 'pending', 
    dueDate: '2024-12-27',
    createdAt: '2024-12-23',
  },
  { 
    id: 'INV-2024-153', 
    client: 'CloudBase Pro', 
    clientType: 'enterprise',
    product: 'Annual Subscription',
    productType: 'subscription',
    amount: 12000, 
    tax: 2160,
    total: 14160,
    status: 'overdue', 
    dueDate: '2024-12-15',
    createdAt: '2024-12-10',
  },
  { 
    id: 'INV-2024-152', 
    client: 'StartupXYZ', 
    clientType: 'startup',
    product: 'Basic Server',
    productType: 'server',
    amount: 890, 
    tax: 160.2,
    total: 1050.2,
    status: 'paid', 
    dueDate: '2024-12-20',
    createdAt: '2024-12-18',
  },
  { 
    id: 'INV-2024-151', 
    client: 'MegaCorp Industries', 
    clientType: 'enterprise',
    product: 'Influencer Campaign',
    productType: 'influencer',
    amount: 8500, 
    tax: 1530,
    total: 10030,
    status: 'draft', 
    dueDate: '2025-01-05',
    createdAt: '2024-12-22',
  },
];

const InvoicesScreen = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'sent': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'draft': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'server': return Server;
      case 'demo': return Package;
      case 'subscription': return Tag;
      case 'influencer': return User;
      default: return Package;
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    const matchesSearch = inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAction = (action: string, invoice: typeof invoices[0]) => {
    switch (action) {
      case 'send':
        toast.success(`Invoice ${invoice.id} sent to ${invoice.client}`);
        break;
      case 'download':
        toast.success(`Downloading ${invoice.id}.pdf`);
        break;
      case 'markPaid':
        toast.success(`Invoice ${invoice.id} marked as paid`);
        break;
      case 'cancel':
        toast.success(`Invoice ${invoice.id} cancelled`);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="w-6 h-6 text-emerald-400" />
            Invoices
          </h2>
          <p className="text-slate-400">Manage all invoices and billing documents</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoices..."
            className="pl-10 bg-slate-800 border-slate-600"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 bg-slate-800 border-slate-600">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice List */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-400">
                {filteredInvoices.length} invoices found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredInvoices.map((invoice) => {
                    const ProductIcon = getProductIcon(invoice.productType);
                    return (
                      <motion.div
                        key={invoice.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setSelectedInvoice(invoice)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedInvoice?.id === invoice.id
                            ? 'bg-emerald-500/10 border-emerald-500/50'
                            : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-700/50">
                              <ProductIcon className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">{invoice.id}</p>
                              <p className="text-xs text-slate-400">{invoice.client}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">{invoice.product}</span>
                          <span className="font-semibold text-white">${invoice.total.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                          <span>Due: {invoice.dueDate}</span>
                          <span>Created: {invoice.createdAt}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Detail Panel */}
        <div>
          <AnimatePresence mode="wait">
            {selectedInvoice ? (
              <motion.div
                key={selectedInvoice.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">{selectedInvoice.id}</CardTitle>
                      <Badge className={getStatusColor(selectedInvoice.status)}>
                        {selectedInvoice.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Client Details */}
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <p className="text-xs text-slate-500 mb-1">CLIENT</p>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-400" />
                        <span className="text-white font-medium">{selectedInvoice.client}</span>
                      </div>
                    </div>

                    {/* Line Items */}
                    <div>
                      <p className="text-xs text-slate-500 mb-2">LINE ITEMS</p>
                      <div className="p-3 rounded-lg bg-slate-800/50 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-300">{selectedInvoice.product}</span>
                          <span className="text-white">${selectedInvoice.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-slate-700" />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Subtotal</span>
                        <span className="text-white">${selectedInvoice.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Tax (18%)</span>
                        <span className="text-white">${selectedInvoice.tax.toFixed(2)}</span>
                      </div>
                      <Separator className="bg-slate-700" />
                      <div className="flex justify-between font-semibold">
                        <span className="text-white">Total</span>
                        <span className="text-emerald-400 text-lg">${selectedInvoice.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-4">
                      {selectedInvoice.status === 'draft' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-slate-600"
                          onClick={() => handleAction('send', selectedInvoice)}
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Send
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-slate-600"
                        onClick={() => handleAction('download', selectedInvoice)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        PDF
                      </Button>
                      {selectedInvoice.status !== 'paid' && selectedInvoice.status !== 'cancelled' && (
                        <Button 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAction('markPaid', selectedInvoice)}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Mark Paid
                        </Button>
                      )}
                      {selectedInvoice.status !== 'cancelled' && selectedInvoice.status !== 'paid' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          onClick={() => handleAction('cancel', selectedInvoice)}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                  <FileText className="w-12 h-12 text-slate-600 mb-3" />
                  <p className="text-slate-400">Select an invoice to view details</p>
                </CardContent>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default InvoicesScreen;
