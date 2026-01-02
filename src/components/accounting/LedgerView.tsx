import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter,
  Users,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Mail,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const customers = [
  { id: 1, name: 'ABC Electronics', phone: '+91 98765 43210', email: 'abc@electronics.com', balance: 45000, type: 'receivable' },
  { id: 2, name: 'Tech Solutions Pvt Ltd', phone: '+91 87654 32109', email: 'info@techsolutions.com', balance: 32000, type: 'receivable' },
  { id: 3, name: 'Global Traders', phone: '+91 76543 21098', email: 'contact@globaltraders.com', balance: -15000, type: 'payable' },
  { id: 4, name: 'Smart Systems', phone: '+91 65432 10987', email: 'hello@smartsystems.com', balance: 28500, type: 'receivable' },
  { id: 5, name: 'Digital World', phone: '+91 54321 09876', email: 'sales@digitalworld.com', balance: 18000, type: 'receivable' },
];

const suppliers = [
  { id: 1, name: 'XYZ Suppliers', phone: '+91 98765 11111', email: 'xyz@suppliers.com', balance: -55000, type: 'payable' },
  { id: 2, name: 'Prime Materials', phone: '+91 87654 22222', email: 'prime@materials.com', balance: -32000, type: 'payable' },
  { id: 3, name: 'Quick Parts Ltd', phone: '+91 76543 33333', email: 'quick@parts.com', balance: 8000, type: 'receivable' },
  { id: 4, name: 'Industrial Components', phone: '+91 65432 44444', email: 'industrial@comp.com', balance: -42000, type: 'payable' },
];

const transactions = [
  { id: 1, date: '2024-01-15', type: 'Invoice', ref: 'INV-156', debit: 15000, credit: 0, balance: 45000 },
  { id: 2, date: '2024-01-12', type: 'Payment', ref: 'PAY-089', debit: 0, credit: 20000, balance: 30000 },
  { id: 3, date: '2024-01-10', type: 'Invoice', ref: 'INV-152', debit: 25000, credit: 0, balance: 50000 },
  { id: 4, date: '2024-01-08', type: 'Payment', ref: 'PAY-085', debit: 0, credit: 15000, balance: 25000 },
  { id: 5, date: '2024-01-05', type: 'Invoice', ref: 'INV-148', debit: 18000, credit: 0, balance: 40000 },
];

const LedgerView: React.FC = () => {
  const [selectedParty, setSelectedParty] = useState<typeof customers[0] | null>(null);
  const [activeTab, setActiveTab] = useState('customers');

  const totalReceivable = customers.filter(c => c.balance > 0).reduce((sum, c) => sum + c.balance, 0);
  const totalPayable = Math.abs(suppliers.filter(s => s.balance < 0).reduce((sum, s) => sum + s.balance, 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Ledger</h3>
          <p className="text-sm text-slate-500">View customer and supplier account statements</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <ArrowDownRight className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Receivable</p>
                  <p className="text-2xl font-bold text-emerald-600">₹{totalReceivable.toLocaleString()}</p>
                </div>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700">{customers.filter(c => c.balance > 0).length} Customers</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Payable</p>
                  <p className="text-2xl font-bold text-red-600">₹{totalPayable.toLocaleString()}</p>
                </div>
              </div>
              <Badge className="bg-red-100 text-red-700">{suppliers.filter(s => s.balance < 0).length} Suppliers</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Party List */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="customers" className="flex-1 gap-2">
                  <Users className="w-4 h-4" />
                  Customers
                </TabsTrigger>
                <TabsTrigger value="suppliers" className="flex-1 gap-2">
                  <Truck className="w-4 h-4" />
                  Suppliers
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search..." className="pl-9" />
            </div>
            
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {(activeTab === 'customers' ? customers : suppliers).map((party) => (
                <motion.div
                  key={party.id}
                  onClick={() => setSelectedParty(party)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedParty?.id === party.id 
                      ? 'bg-emerald-50 border border-emerald-200' 
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{party.name}</p>
                      <p className="text-xs text-slate-500">{party.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        party.balance > 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {party.balance > 0 ? '+' : ''}₹{Math.abs(party.balance).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">
                        {party.balance > 0 ? 'Receivable' : 'Payable'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ledger Details */}
        <Card className="lg:col-span-2 bg-white border-slate-200">
          {selectedParty ? (
            <>
              <CardHeader className="pb-3 border-b border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      {selectedParty.name}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {selectedParty.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {selectedParty.email}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Current Balance</p>
                    <p className={`text-2xl font-bold ${
                      selectedParty.balance > 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {selectedParty.balance > 0 ? '+' : ''}₹{Math.abs(selectedParty.balance).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-slate-900">Transaction History</h4>
                  <div className="flex gap-2">
                    <Input type="date" className="w-36" />
                    <span className="text-slate-400 self-center">to</span>
                    <Input type="date" className="w-36" />
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Reference</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Debit (₹)</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Credit (₹)</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Balance (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 text-slate-600">{tx.date}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className={
                              tx.type === 'Invoice' 
                                ? 'border-emerald-200 text-emerald-700' 
                                : 'border-blue-200 text-blue-700'
                            }>
                              {tx.type}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-900">{tx.ref}</td>
                          <td className="py-3 px-4 text-right text-emerald-600">
                            {tx.debit > 0 ? tx.debit.toLocaleString() : '-'}
                          </td>
                          <td className="py-3 px-4 text-right text-red-600">
                            {tx.credit > 0 ? tx.credit.toLocaleString() : '-'}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-slate-900">
                            {tx.balance.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>Select a customer or supplier to view ledger</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LedgerView;
