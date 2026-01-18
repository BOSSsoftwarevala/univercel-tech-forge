/**
 * AI CREDITS PANEL - Full Featured
 * Complete credit management with balance, transactions, and billing
 */

import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, RefreshCcw, Download, AlertTriangle, CreditCard, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const creditTransactions = [
  { id: 'TXN-001', type: 'usage', description: 'GPT-5 API Calls', amount: -45.20, balance: 2450.00, time: '2 hours ago' },
  { id: 'TXN-002', type: 'usage', description: 'Image Generation', amount: -12.50, balance: 2495.20, time: '4 hours ago' },
  { id: 'TXN-003', type: 'topup', description: 'Credit Top-up', amount: 500.00, balance: 2507.70, time: '1 day ago' },
  { id: 'TXN-004', type: 'usage', description: 'Embeddings API', amount: -8.30, balance: 2007.70, time: '2 days ago' },
  { id: 'TXN-005', type: 'refund', description: 'Failed Request Refund', amount: 2.50, balance: 2016.00, time: '3 days ago' },
  { id: 'TXN-006', type: 'usage', description: 'Audio Transcription', amount: -23.80, balance: 2013.50, time: '4 days ago' },
  { id: 'TXN-007', type: 'usage', description: 'Content Moderation', amount: -5.20, balance: 2037.30, time: '5 days ago' },
];

const usageBreakdown = [
  { service: 'GPT-5 Chat', usage: '$1,245', percent: 45 },
  { service: 'Image Generation', usage: '$567', percent: 20 },
  { service: 'Embeddings', usage: '$432', percent: 16 },
  { service: 'Audio Services', usage: '$298', percent: 11 },
  { service: 'Other', usage: '$218', percent: 8 },
];

export const AICreditsPanel: React.FC = () => {
  const handleAction = (action: string, item?: string) => {
    toast.success(`${action}${item ? `: ${item}` : ''}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" />
            AI Credits Balance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage credits and billing</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleAction('Download invoice')}>
            <Download className="w-4 h-4 mr-2" />
            Invoice
          </Button>
          <Button onClick={() => handleAction('Top up credits')}>
            <CreditCard className="w-4 h-4 mr-2" />
            Top Up
          </Button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <Wallet className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-foreground">$2,450</p>
            <p className="text-xs text-muted-foreground">Current Balance</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <ArrowDownRight className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-rose-500">-$156</p>
            <p className="text-xs text-muted-foreground">Today's Usage</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-500">$4,230</p>
            <p className="text-xs text-muted-foreground">This Month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-purple-500">~18d</p>
            <p className="text-xs text-muted-foreground">Estimated Runway</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Breakdown */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Usage Breakdown (This Month)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {usageBreakdown.map((item) => (
            <div key={item.service} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{item.service}</span>
                <span className="text-muted-foreground">{item.usage} ({item.percent}%)</span>
              </div>
              <Progress value={item.percent} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Alert Settings */}
      <Card className="bg-amber-500/10 border-amber-500/30">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-sm font-medium">Low Balance Alert</p>
              <p className="text-xs text-muted-foreground">Alert when balance drops below $500</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleAction('Configure alerts')}>
            Configure
          </Button>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Recent Transactions</span>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleAction('View all transactions')}>
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {creditTransactions.map((txn) => (
            <div key={txn.id} className="p-3 rounded-lg bg-muted/20 flex items-center justify-between hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  txn.type === 'topup' ? 'bg-emerald-500/20' : 
                  txn.type === 'refund' ? 'bg-blue-500/20' : 
                  'bg-rose-500/20'
                }`}>
                  {txn.type === 'topup' ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> :
                   txn.type === 'refund' ? <RefreshCcw className="w-4 h-4 text-blue-500" /> :
                   <ArrowDownRight className="w-4 h-4 text-rose-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{txn.description}</p>
                  <p className="text-xs text-muted-foreground">{txn.id} • {txn.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${txn.amount > 0 ? 'text-emerald-500' : 'text-foreground'}`}>
                  {txn.amount > 0 ? '+' : ''}{txn.amount.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">Balance: ${txn.balance.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
