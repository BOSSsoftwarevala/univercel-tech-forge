import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Search, 
  FileText, 
  Printer, 
  Save,
  Send,
  Download,
  RotateCcw,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface InvoiceItem {
  id: number;
  hsn: string;
  description: string;
  qty: number;
  unit: string;
  rate: number;
  taxRate: number;
  cess: number;
  amount: number;
}

const hsnCodes = [
  { code: '8471', description: 'Computers & Parts', rate: 18 },
  { code: '8528', description: 'Monitors & Projectors', rate: 18 },
  { code: '9983', description: 'IT Services', rate: 18 },
  { code: '9984', description: 'Telecom Services', rate: 18 },
  { code: '9987', description: 'Support Services', rate: 18 },
];

const AdvancedInvoicing: React.FC = () => {
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, hsn: '8471', description: 'Laptop Computer - Dell Latitude', qty: 5, unit: 'Nos', rate: 65000, taxRate: 18, cess: 0, amount: 325000 },
    { id: 2, hsn: '9983', description: 'Software Installation & Configuration', qty: 1, unit: 'Service', rate: 25000, taxRate: 18, cess: 0, amount: 25000 },
  ]);
  const [reverseCharge, setReverseCharge] = useState(false);
  const [isB2B, setIsB2B] = useState(true);

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const cgst = items.reduce((sum, item) => sum + (item.amount * item.taxRate / 200), 0);
  const sgst = cgst;
  const igst = 0;
  const cessTotal = items.reduce((sum, item) => sum + (item.amount * item.cess / 100), 0);
  const total = subtotal + cgst + sgst + cessTotal;

  const addItem = () => {
    const newId = Math.max(...items.map(i => i.id), 0) + 1;
    setItems([...items, { id: newId, hsn: '', description: '', qty: 1, unit: 'Nos', rate: 0, taxRate: 18, cess: 0, amount: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Advanced Invoice</h2>
          <p className="text-slate-500">Create GST compliant tax invoice</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download Draft
          </Button>
          <Button variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            Print Preview
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Send className="w-4 h-4" />
            Generate & Send
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Invoice Header */}
          <Card className="bg-white border-slate-200">
            <CardContent className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-600 text-xs uppercase font-medium">Invoice Type</Label>
                  <Select defaultValue="tax-invoice">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tax-invoice">Tax Invoice</SelectItem>
                      <SelectItem value="bill-of-supply">Bill of Supply</SelectItem>
                      <SelectItem value="credit-note">Credit Note</SelectItem>
                      <SelectItem value="debit-note">Debit Note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 text-xs uppercase font-medium">Invoice Number</Label>
                  <Input value="INV/2024-25/00156" readOnly className="bg-slate-50 font-mono" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 text-xs uppercase font-medium">Invoice Date</Label>
                  <Input type="date" defaultValue="2025-01-02" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-600 text-xs uppercase font-medium">Due Date</Label>
                  <Input type="date" defaultValue="2025-01-17" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buyer Details */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Bill To (Buyer Details)</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch checked={isB2B} onCheckedChange={setIsB2B} id="b2b" />
                    <Label htmlFor="b2b" className="text-sm">B2B Invoice</Label>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Party Name</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search or add party..." className="pl-9" />
                  </div>
                </div>
                {isB2B && (
                  <div className="space-y-2">
                    <Label>GSTIN</Label>
                    <Input placeholder="Enter GSTIN" className="font-mono uppercase" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Place of Supply</Label>
                  <Select defaultValue="29">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="29">Karnataka (29)</SelectItem>
                      <SelectItem value="27">Maharashtra (27)</SelectItem>
                      <SelectItem value="33">Tamil Nadu (33)</SelectItem>
                      <SelectItem value="07">Delhi (07)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items Table */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Invoice Items</CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  {items.length} Items
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="w-[100px]">HSN/SAC</TableHead>
                      <TableHead className="min-w-[200px]">Description</TableHead>
                      <TableHead className="text-center w-[80px]">Qty</TableHead>
                      <TableHead className="w-[80px]">Unit</TableHead>
                      <TableHead className="text-right w-[100px]">Rate</TableHead>
                      <TableHead className="text-center w-[80px]">Tax %</TableHead>
                      <TableHead className="text-center w-[70px]">Cess %</TableHead>
                      <TableHead className="text-right w-[120px]">Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Select defaultValue={item.hsn}>
                            <SelectTrigger className="h-9 font-mono text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {hsnCodes.map((hsn) => (
                                <SelectItem key={hsn.code} value={hsn.code}>
                                  {hsn.code} - {hsn.description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.description}
                            className="h-9 text-sm"
                            placeholder="Item description"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.qty}
                            className="h-9 w-16 text-center text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Select defaultValue={item.unit}>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Nos">Nos</SelectItem>
                              <SelectItem value="Pcs">Pcs</SelectItem>
                              <SelectItem value="Kgs">Kgs</SelectItem>
                              <SelectItem value="Ltrs">Ltrs</SelectItem>
                              <SelectItem value="Service">Service</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.rate}
                            className="h-9 w-24 text-right text-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Select defaultValue={item.taxRate.toString()}>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="5">5%</SelectItem>
                              <SelectItem value="12">12%</SelectItem>
                              <SelectItem value="18">18%</SelectItem>
                              <SelectItem value="28">28%</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.cess}
                            className="h-9 w-16 text-center text-sm"
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium text-slate-900">
                          ₹{item.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-500"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button
                variant="ghost"
                className="mt-4 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                onClick={addItem}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </CardContent>
          </Card>

          {/* Additional Options */}
          <Card className="bg-white border-slate-200">
            <CardContent className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <Checkbox id="reverse-charge" checked={reverseCharge} onCheckedChange={(c) => setReverseCharge(!!c)} />
                    <div>
                      <Label htmlFor="reverse-charge" className="font-medium text-amber-800">Reverse Charge Mechanism</Label>
                      <p className="text-xs text-amber-600">Applicable for RCM supplies under GST</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                    <Checkbox id="e-invoice" defaultChecked />
                    <div>
                      <Label htmlFor="e-invoice" className="font-medium">Generate E-Invoice</Label>
                      <p className="text-xs text-slate-500">Get IRN from GST Portal</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes / Terms</Label>
                  <Textarea 
                    placeholder="Add invoice notes or terms..." 
                    className="min-h-[100px]"
                    defaultValue="1. Payment due within 15 days from invoice date.&#10;2. Interest @18% p.a. will be charged on delayed payments."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Tax Breakdown */}
          <Card className="bg-white border-slate-200 sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Tax Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Taxable Value</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">CGST (9%)</span>
                  <span>₹{cgst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">SGST (9%)</span>
                  <span>₹{sgst.toLocaleString()}</span>
                </div>
                {igst > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">IGST (18%)</span>
                    <span>₹{igst.toLocaleString()}</span>
                  </div>
                )}
                {cessTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Cess</span>
                    <span>₹{cessTotal.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900">Grand Total</span>
                  <span className="text-xl font-bold text-indigo-600">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {reverseCharge && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-amber-800">Reverse Charge Applicable</p>
                      <p className="text-xs text-amber-600">Buyer to pay GST directly</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* E-Invoice Status */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900 uppercase tracking-wide">E-Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">E-Invoice will be generated after saving</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvancedInvoicing;
