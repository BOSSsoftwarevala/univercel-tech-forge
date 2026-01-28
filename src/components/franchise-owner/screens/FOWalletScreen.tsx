import React from 'react';
import { Wallet, Coins, History, RefreshCw, Plus, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const usageHistory = [
  { id: 1, service: 'AI Lead Assignment', coins: 50, date: 'Today, 10:30 AM' },
  { id: 2, service: 'SEO Optimization', coins: 120, date: 'Today, 09:15 AM' },
  { id: 3, service: 'Meta Ads AI', coins: 200, date: 'Yesterday, 04:45 PM' },
  { id: 4, service: 'Content Generation', coins: 80, date: 'Yesterday, 02:30 PM' },
  { id: 5, service: 'Google Ads AI', coins: 150, date: '2 days ago' },
];

const rechargeHistory = [
  { id: 1, amount: '₹5,000', coins: 5000, date: 'Jan 15, 2024', status: 'Completed' },
  { id: 2, amount: '₹10,000', coins: 10000, date: 'Jan 01, 2024', status: 'Completed' },
  { id: 3, amount: '₹5,000', coins: 5000, date: 'Dec 15, 2023', status: 'Completed' },
];

export function FOWalletScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            Wallet & Billing
          </h1>
          <p className="text-muted-foreground">Wallet Balance • Usage History • Auto Recharge</p>
        </div>
      </div>

      {/* Wallet Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/20 to-purple-500/20 border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Wallet Balance</span>
            </div>
            <p className="text-3xl font-bold">₹45,230</p>
            <p className="text-sm text-muted-foreground mt-1">≈ 45,230 Coins</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="h-5 w-5 text-amber-500" />
              <span className="text-sm text-muted-foreground">Coins Used (This Month)</span>
            </div>
            <p className="text-3xl font-bold">2,450</p>
            <p className="text-sm text-muted-foreground mt-1">AI Services</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-5 w-5 text-emerald-500" />
              <span className="text-sm text-muted-foreground">Auto Recharge</span>
            </div>
            <p className="text-xl font-bold">Enabled</p>
            <p className="text-sm text-muted-foreground mt-1">When balance &lt; ₹5,000</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage History */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5" />
            Usage History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {usageHistory.map((usage) => (
              <div key={usage.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium">{usage.service}</p>
                    <p className="text-sm text-muted-foreground">{usage.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-amber-500">-{usage.coins} coins</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recharge History */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Recharge History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rechargeHistory.map((recharge) => (
              <div key={recharge.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium">{recharge.amount}</p>
                    <p className="text-sm text-muted-foreground">{recharge.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-500">+{recharge.coins} coins</span>
                  <Badge variant="default">{recharge.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Coins
        </Button>
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          View History
        </Button>
      </div>
    </div>
  );
}
