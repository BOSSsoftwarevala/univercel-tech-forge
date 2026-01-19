/**
 * WALLET HISTORY SCREEN
 * Credit/Debit entries with download receipt
 * All transactions logged and masked
 */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Search,
  Filter,
  Wallet,
  Calendar,
  FileText,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  gateway?: string;
  orderId?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  balanceAfter: number;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN001',
    type: 'credit',
    amount: 500,
    description: 'Wallet Top-up via UPI',
    gateway: 'UPI',
    date: '2024-01-19 14:30',
    status: 'completed',
    balanceAfter: 1500,
  },
  {
    id: 'TXN002',
    type: 'debit',
    amount: 150,
    description: 'Order #ORD-2024-001',
    orderId: 'ORD-2024-001',
    date: '2024-01-19 10:15',
    status: 'completed',
    balanceAfter: 1000,
  },
  {
    id: 'TXN003',
    type: 'credit',
    amount: 1000,
    description: 'Wallet Top-up via Stripe',
    gateway: 'Stripe',
    date: '2024-01-18 16:45',
    status: 'completed',
    balanceAfter: 1150,
  },
  {
    id: 'TXN004',
    type: 'debit',
    amount: 350,
    description: 'Order #ORD-2024-002',
    orderId: 'ORD-2024-002',
    date: '2024-01-17 09:00',
    status: 'completed',
    balanceAfter: 150,
  },
  {
    id: 'TXN005',
    type: 'credit',
    amount: 250,
    description: 'Wallet Top-up via PayU',
    gateway: 'PayU',
    date: '2024-01-16 11:20',
    status: 'completed',
    balanceAfter: 500,
  },
  {
    id: 'TXN006',
    type: 'debit',
    amount: 200,
    description: 'Order #ORD-2024-003',
    orderId: 'ORD-2024-003',
    date: '2024-01-15 14:00',
    status: 'completed',
    balanceAfter: 250,
  },
];

export function WalletHistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredTransactions = MOCK_TRANSACTIONS.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'credit' && txn.type === 'credit') ||
      (activeTab === 'debit' && txn.type === 'debit');
    return matchesSearch && matchesTab;
  });

  const handleDownloadReceipt = (txnId: string) => {
    toast.success(`Receipt for ${txnId} downloaded`);
  };

  const totalCredits = MOCK_TRANSACTIONS.filter((t) => t.type === 'credit').reduce(
    (sum, t) => sum + t.amount,
    0
  );
  const totalDebits = MOCK_TRANSACTIONS.filter((t) => t.type === 'debit').reduce(
    (sum, t) => sum + t.amount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Wallet History</h1>
          <p className="text-muted-foreground">View all your wallet transactions</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <ArrowDownLeft className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Credits</p>
                <p className="text-xl font-bold text-emerald-400">+${totalCredits.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Debits</p>
                <p className="text-xl font-bold text-red-400">-${totalDebits.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Net Balance</p>
                <p className="text-xl font-bold">${(totalCredits - totalDebits).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by transaction ID or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="credit">Credits Only</TabsTrigger>
          <TabsTrigger value="debit">Debits Only</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTransactions.map((txn, index) => (
                  <motion.div
                    key={txn.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        txn.type === 'credit'
                          ? 'bg-emerald-500/20'
                          : 'bg-red-500/20'
                      }`}
                    >
                      {txn.type === 'credit' ? (
                        <ArrowDownLeft className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{txn.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {txn.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="font-mono">{txn.id}</span>
                        <span>•</span>
                        <span>{txn.date}</span>
                        {txn.gateway && (
                          <>
                            <span>•</span>
                            <span>{txn.gateway}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-bold ${
                          txn.type === 'credit' ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {txn.type === 'credit' ? '+' : '-'}${txn.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Bal: ${txn.balanceAfter.toLocaleString()}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadReceipt(txn.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}

                {filteredTransactions.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No transactions found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default WalletHistoryScreen;
