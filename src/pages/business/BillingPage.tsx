import React, { useState } from 'react';
import { 
  Plus, 
  FileText, 
  Download, 
  Printer,
  Search,
  X,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InvoiceItem {
  id: number;
  name: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  items: number;
}

const recentInvoices: Invoice[] = [
  { id: 'INV-001', customer: 'Sharma Electronics', date: 'Dec 30, 2025', amount: 15000, status: 'paid', items: 3 },
  { id: 'INV-002', customer: 'Gupta Traders', date: 'Dec 28, 2025', amount: 8500, status: 'pending', items: 2 },
  { id: 'INV-003', customer: 'Singh & Sons', date: 'Dec 25, 2025', amount: 22000, status: 'paid', items: 5 },
  { id: 'INV-004', customer: 'Patel Enterprises', date: 'Dec 20, 2025', amount: 12500, status: 'overdue', items: 4 },
  { id: 'INV-005', customer: 'Kumar Industries', date: 'Dec 15, 2025', amount: 35000, status: 'paid', items: 8 },
];

const customers = [
  'Sharma Electronics',
  'Gupta Traders',
  'Singh & Sons',
  'Patel Enterprises',
  'Kumar Industries',
  'Verma Supplies',
];

export default function BillingPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [enableGST, setEnableGST] = useState(true);
  const [gstRate, setGstRate] = useState(18);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, name: '', quantity: 1, rate: 0, amount: 0 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { id: items.length + 1, name: '', quantity: 1, rate: 0, amount: 0 },
    ]);
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = Number(updated.quantity) * Number(updated.rate);
        }
        return updated;
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const gstAmount = enableGST ? (subtotal * gstRate) / 100 : 0;
  const total = subtotal + gstAmount;

  const filteredInvoices = recentInvoices.filter(invoice =>
    invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 text-green-700';
      case 'pending':
        return 'bg-amber-50 text-amber-700';
      case 'overdue':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Total Invoiced (Month)</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">₹4,85,000</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Paid</p>
            <p className="text-2xl font-bold text-green-600 mt-1">₹3,60,000</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">₹85,000</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Overdue</p>
            <p className="text-2xl font-bold text-red-600 mt-1">₹40,000</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Create */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-slate-200 h-11"
          />
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-11">
              <Plus className="w-5 h-5 mr-2" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-slate-800">Create New Invoice</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              {/* Customer Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-700">Customer *</Label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger className="mt-1.5 bg-white border-slate-200">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {customers.map(customer => (
                        <SelectItem key={customer} value={customer}>{customer}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-700">Invoice Date</Label>
                  <Input type="date" className="mt-1.5 bg-white border-slate-200" />
                </div>
              </div>

              {/* Items */}
              <div>
                <Label className="text-slate-700 mb-3 block">Items</Label>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <Input
                          placeholder="Item name"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          className="bg-white border-slate-200"
                        />
                      </div>
                      <div className="w-20">
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity || ''}
                          onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                          className="bg-white border-slate-200"
                        />
                      </div>
                      <div className="w-28">
                        <Input
                          type="number"
                          placeholder="Rate"
                          value={item.rate || ''}
                          onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                          className="bg-white border-slate-200"
                        />
                      </div>
                      <div className="w-28">
                        <Input
                          value={`₹${item.amount.toLocaleString()}`}
                          disabled
                          className="bg-slate-50 border-slate-200"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={addItem} className="mt-3">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {/* GST Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Switch checked={enableGST} onCheckedChange={setEnableGST} />
                  <Label className="text-slate-700">Enable GST/Tax</Label>
                </div>
                {enableGST && (
                  <div className="flex items-center gap-2">
                    <Label className="text-slate-600">Rate:</Label>
                    <Select value={gstRate.toString()} onValueChange={(v) => setGstRate(Number(v))}>
                      <SelectTrigger className="w-24 bg-white border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="5">5%</SelectItem>
                        <SelectItem value="12">12%</SelectItem>
                        <SelectItem value="18">18%</SelectItem>
                        <SelectItem value="28">28%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                {enableGST && (
                  <div className="flex justify-between text-slate-600">
                    <span>GST ({gstRate}%)</span>
                    <span>₹{gstAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invoice List */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left py-4 px-5 text-sm font-medium text-slate-500">Invoice #</th>
                  <th className="text-left py-4 px-5 text-sm font-medium text-slate-500">Customer</th>
                  <th className="text-left py-4 px-5 text-sm font-medium text-slate-500">Date</th>
                  <th className="text-center py-4 px-5 text-sm font-medium text-slate-500">Items</th>
                  <th className="text-right py-4 px-5 text-sm font-medium text-slate-500">Amount</th>
                  <th className="text-center py-4 px-5 text-sm font-medium text-slate-500">Status</th>
                  <th className="text-center py-4 px-5 text-sm font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-5 font-medium text-blue-600">{invoice.id}</td>
                    <td className="py-4 px-5 text-slate-800">{invoice.customer}</td>
                    <td className="py-4 px-5 text-slate-500">{invoice.date}</td>
                    <td className="py-4 px-5 text-center text-slate-600">{invoice.items}</td>
                    <td className="py-4 px-5 text-right font-semibold text-slate-800">
                      ₹{invoice.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600">
                          <Printer className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
