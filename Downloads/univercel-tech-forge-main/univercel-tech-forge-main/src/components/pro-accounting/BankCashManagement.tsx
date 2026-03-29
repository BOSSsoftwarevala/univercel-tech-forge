import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Download, 
  Check, 
  X, 
  Link2, 
  AlertCircle,
  Landmark,
  Wallet,
  RefreshCw,
  FileSpreadsheet,
  ArrowUpDown,
  Filter,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const bankAccounts = [
  { id: 1, bank: 'HDFC Bank', accountNo: 'XXXX5678', type: 'Current', balance: 1256780, lastSync: '2 hours ago' },
  { id: 2, bank: 'ICICI Bank', accountNo: 'XXXX9012', type: 'Current', balance: 845230, lastSync: '1 day ago' },
  { id: 3, bank: 'SBI', accountNo: 'XXXX3456', type: 'Savings', balance: 125000, lastSync: 'Never' },
];

const bankStatements = [
  { id: 1, date: '2025-01-02', description: 'NEFT - Tech Solutions Pvt Ltd', reference: 'NEFT/123456', debit: 0, credit: 125000, balance: 1256780, status: 'matched' },
  { id: 2, date: '2025-01-02', description: 'RTGS - Global Suppliers', reference: 'RTGS/789012', debit: 85000, credit: 0, balance: 1131780, status: 'matched' },
  { id: 3, date: '2025-01-01', description: 'UPI - Office Rent', reference: 'UPI/345678', debit: 50000, credit: 0, balance: 1216780, status: 'pending' },
  { id: 4, date: '2025-01-01', description: 'IMPS - ABC Industries', reference: 'IMPS/901234', debit: 0, credit: 95000, balance: 1266780, status: 'matched' },
  { id: 5, date: '2024-12-31', description: 'Bank Charges', reference: 'CHG/567890', debit: 1250, credit: 0, balance: 1171780, status: 'unmatched' },
  { id: 6, date: '2024-12-31', description: 'Interest Credit', reference: 'INT/234567', debit: 0, credit: 3500, balance: 1173030, status: 'unmatched' },
];

const cashTransactions = [
  { id: 1, date: '2025-01-02', description: 'Petty Cash - Courier', type: 'expense', amount: 500, balance: 45500 },
  { id: 2, date: '2025-01-01', description: 'Cash Sale - Walk-in Customer', type: 'receipt', amount: 12000, balance: 46000 },
  { id: 3, date: '2024-12-31', description: 'Petty Cash - Stationery', type: 'expense', amount: 2500, balance: 34000 },
  { id: 4, date: '2024-12-30', description: 'Cash Withdrawal from Bank', type: 'receipt', amount: 50000, balance: 36500 },
];

const BankCashManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reconciliation');
  const [selectedBank, setSelectedBank] = useState(bankAccounts[0]);

  const matchedCount = bankStatements.filter(s => s.status === 'matched').length;
  const totalCount = bankStatements.length;
  const reconciliationProgress = (matchedCount / totalCount) * 100;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'matched':
        return <Badge className="bg-emerald-100 text-emerald-700"><Check className="w-3 h-3 mr-1" />Matched</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-700"><X className="w-3 h-3 mr-1" />Unmatched</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Bank & Cash Management</h2>
          <p className="text-slate-500">Reconcile bank statements and manage cash transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Import Statement
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            <RefreshCw className="w-4 h-4" />
            Auto Reconcile
          </Button>
        </div>
      </div>

      {/* Bank Accounts Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bankAccounts.map((account) => (
          <motion.div
            key={account.id}
            whileHover={{ y: -2 }}
            onClick={() => setSelectedBank(account)}
            className={`cursor-pointer ${selectedBank.id === account.id ? 'ring-2 ring-indigo-500' : ''}`}
          >
            <Card className="bg-white border-slate-200 hover:shadow-lg transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Landmark className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{account.bank}</p>
                      <p className="text-sm text-slate-500">A/c {account.accountNo}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{account.type}</Badge>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-slate-900">₹{account.balance.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-1">Last synced: {account.lastSync}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="reconciliation" className="gap-2">
            <Link2 className="w-4 h-4" />
            Bank Reconciliation
          </TabsTrigger>
          <TabsTrigger value="statements" className="gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Statement Import
          </TabsTrigger>
          <TabsTrigger value="cash" className="gap-2">
            <Wallet className="w-4 h-4" />
            Cash Book
          </TabsTrigger>
        </TabsList>

        {/* Bank Reconciliation */}
        <TabsContent value="reconciliation" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">
                    {selectedBank.bank} - Reconciliation
                  </CardTitle>
                  <CardDescription>Match bank transactions with your books</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Reconciliation Progress</p>
                    <p className="text-lg font-bold text-indigo-600">{matchedCount}/{totalCount} Matched</p>
                  </div>
                  <div className="w-32">
                    <Progress value={reconciliationProgress} className="h-2" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="matched">Matched</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="unmatched">Unmatched</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Search transactions..." className="max-w-xs" />
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankStatements.map((stmt) => (
                    <TableRow key={stmt.id} className={stmt.status === 'unmatched' ? 'bg-red-50/50' : ''}>
                      <TableCell className="font-mono text-sm">{stmt.date}</TableCell>
                      <TableCell className="font-medium text-slate-900">{stmt.description}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-500">{stmt.reference}</TableCell>
                      <TableCell className="text-right text-red-600 font-medium">
                        {stmt.debit > 0 ? `₹${stmt.debit.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="text-right text-emerald-600 font-medium">
                        {stmt.credit > 0 ? `₹${stmt.credit.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">₹{stmt.balance.toLocaleString()}</TableCell>
                      <TableCell className="text-center">{getStatusBadge(stmt.status)}</TableCell>
                      <TableCell className="text-right">
                        {stmt.status !== 'matched' && (
                          <Button size="sm" variant="ghost" className="text-indigo-600">
                            <Link2 className="w-4 h-4 mr-1" />
                            Match
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statement Import */}
        <TabsContent value="statements" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">Import Bank Statement</CardTitle>
              <CardDescription>Upload bank statements in CSV, XLS, or PDF format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="font-medium text-slate-900 mb-2">Drop your bank statement here</p>
                <p className="text-sm text-slate-500 mb-4">Supports CSV, XLS, XLSX, PDF formats</p>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Browse Files
                </Button>
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <p className="font-medium text-slate-900 mb-3">Supported Banks</p>
                <div className="flex flex-wrap gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Mahindra', 'Yes Bank', 'IndusInd Bank'].map((bank) => (
                    <Badge key={bank} variant="outline" className="bg-white">{bank}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Book */}
        <TabsContent value="cash" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <CardContent className="p-5">
                <Wallet className="w-8 h-8 mb-3 opacity-80" />
                <p className="text-emerald-100 text-sm">Cash in Hand</p>
                <p className="text-3xl font-bold mt-1">₹45,500</p>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 bg-white border-slate-200">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold text-slate-900">Cash Transactions</CardTitle>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Entry
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono text-sm">{tx.date}</TableCell>
                        <TableCell className="font-medium text-slate-900">{tx.description}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={
                            tx.type === 'receipt' 
                              ? 'border-emerald-200 text-emerald-700 bg-emerald-50' 
                              : 'border-red-200 text-red-700 bg-red-50'
                          }>
                            {tx.type === 'receipt' ? 'Receipt' : 'Payment'}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${
                          tx.type === 'receipt' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {tx.type === 'receipt' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium">₹{tx.balance.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default BankCashManagement;
