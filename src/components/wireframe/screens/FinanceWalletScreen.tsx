import React from 'react';
import { 
  Wallet, ArrowDownLeft, ArrowUpRight, Clock, Receipt,
  Download, Filter, Search, Plus, FileText, CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '../components/DataTable';
import { WireframeModal } from '../components/WireframeModal';

export function FinanceWalletScreen() {
  const isDark = true;

  const transactions = [
    { id: 'TXN-001', type: 'credit', amount: 5000, description: 'Commission - Lead L-2845', date: '2 hours ago', status: 'completed' },
    { id: 'TXN-002', type: 'debit', amount: 2500, description: 'Withdrawal to Bank', date: 'Yesterday', status: 'completed' },
    { id: 'TXN-003', type: 'credit', amount: 3500, description: 'Task Payment T-1234', date: '2 days ago', status: 'completed' },
    { id: 'TXN-004', type: 'debit', amount: 500, description: 'Penalty - Late Delivery', date: '3 days ago', status: 'completed' },
    { id: 'TXN-005', type: 'credit', amount: 7500, description: 'Commission - Lead L-2840', date: '4 days ago', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="h-6 w-6 text-emerald-500" />
            Wallet & Finance
          </h1>
          <p className="text-muted-foreground">Manage your earnings and transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500">
            <Plus className="h-4 w-4 mr-2" />
            Request Withdrawal
          </Button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-5 w-5 text-emerald-500" />
            <span className="text-sm text-muted-foreground">Available Balance</span>
          </div>
          <h3 className="text-3xl font-bold text-emerald-500">₹45,230</h3>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
          <h3 className="text-3xl font-bold text-amber-500">₹12,500</h3>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownLeft className="h-5 w-5 text-cyan-500" />
            <span className="text-sm text-muted-foreground">Total Earned</span>
          </div>
          <h3 className="text-3xl font-bold">₹1,25,000</h3>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="h-5 w-5 text-purple-500" />
            <span className="text-sm text-muted-foreground">Total Withdrawn</span>
          </div>
          <h3 className="text-3xl font-bold">₹79,770</h3>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="commissions">Commission Payouts</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-4">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search transactions..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Transaction List */}
          <div className={`rounded-xl border overflow-hidden ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <div className="divide-y divide-slate-700">
              {transactions.map((txn) => (
                <div key={txn.id} className={`p-4 flex items-center justify-between hover:bg-slate-800/50 ${isDark ? '' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      txn.type === 'credit' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}>
                      {txn.type === 'credit' ? (
                        <ArrowDownLeft className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{txn.id}</Badge>
                        <span className="font-medium">{txn.description}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{txn.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${txn.type === 'credit' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                    </p>
                    <Badge variant="outline" className={`text-xs ${
                      txn.status === 'completed' ? 'text-emerald-500 border-emerald-500' : 'text-amber-500 border-amber-500'
                    }`}>
                      {txn.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="commissions" className="mt-4">
          <div className={`p-8 rounded-xl border text-center ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Commission Payout Panel</h3>
            <p className="text-muted-foreground">View and manage commission payouts</p>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <div className={`p-8 rounded-xl border text-center ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Invoice Generator</h3>
            <p className="text-muted-foreground">Create and download invoices</p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
