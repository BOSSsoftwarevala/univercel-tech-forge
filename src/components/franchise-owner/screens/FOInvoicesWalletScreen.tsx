/**
 * INVOICES & WALLET SCREEN
 * Wallet Summary, Invoice List, Credits/Debits
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet,
  FileText,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
} from 'lucide-react';

const walletSummary = {
  balance: 45200,
  credits: 62500,
  debits: 17300,
};

const transactions = [
  { id: 'TXN-001', type: 'credit', description: 'Wallet Recharge', amount: 10000, date: '2024-01-15' },
  { id: 'TXN-002', type: 'debit', description: 'Order #ORD-2024-001', amount: 2999, date: '2024-01-15' },
  { id: 'TXN-003', type: 'credit', description: 'Commission Earned', amount: 500, date: '2024-01-14' },
  { id: 'TXN-004', type: 'debit', description: 'Order #ORD-2024-002', amount: 1999, date: '2024-01-12' },
];

const invoices = [
  { id: 'INV-2024-001', order: 'ORD-2024-001', amount: 2999, status: 'paid', date: '2024-01-15' },
  { id: 'INV-2024-002', order: 'ORD-2024-002', amount: 1999, status: 'paid', date: '2024-01-12' },
  { id: 'INV-2023-089', order: 'ORD-2023-089', amount: 4999, status: 'paid', date: '2023-12-20' },
];

export function FOInvoicesWalletScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices & Wallet</h1>
          <p className="text-muted-foreground">Manage your wallet and view invoices</p>
        </div>
        <Button className="gap-2 bg-emerald-500 hover:bg-emerald-600">
          <Plus className="h-4 w-4" />
          Add Money
        </Button>
      </div>

      {/* Wallet Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-3xl font-bold text-emerald-400">${walletSummary.balance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <ArrowDownRight className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Credits</p>
                <p className="text-2xl font-bold">${walletSummary.credits.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Debits</p>
                <p className="text-2xl font-bold">${walletSummary.debits.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="wallet" className="space-y-4">
        <TabsList>
          <TabsTrigger value="wallet">Wallet History</TabsTrigger>
          <TabsTrigger value="invoices">Invoice List</TabsTrigger>
        </TabsList>

        <TabsContent value="wallet" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {transactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        txn.type === 'credit' ? 'bg-emerald-500/10' : 'bg-orange-500/10'
                      }`}
                    >
                      {txn.type === 'credit' ? (
                        <ArrowDownRight className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-orange-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{txn.description}</p>
                      <p className="text-xs text-muted-foreground">{txn.id} • {txn.date}</p>
                    </div>
                  </div>
                  <span
                    className={`font-bold ${
                      txn.type === 'credit' ? 'text-emerald-400' : 'text-orange-400'
                    }`}
                  >
                    {txn.type === 'credit' ? '+' : '-'}${txn.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">All Invoices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{inv.id}</p>
                      <p className="text-xs text-muted-foreground">Order: {inv.order} • {inv.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-emerald-500/20 text-emerald-400">Paid</Badge>
                    <span className="font-bold">${inv.amount.toLocaleString()}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FOInvoicesWalletScreen;
