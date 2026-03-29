/**
 * WALLET MANAGEMENT SECTION
 * Master/Franchise/Reseller/User Wallets, Top-up, Deduction, Low Balance
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Wallet,
  Building2,
  Users,
  Landmark,
  UploadCloud,
  DownloadCloud,
  AlertTriangle,
  Search,
  Plus,
  Minus,
  Eye
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';
import { useGlobalActions } from '@/hooks/useGlobalActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface WalletManagementProps {
  activeView: FinanceView;
}

const WalletManagement: React.FC<WalletManagementProps> = ({ activeView }) => {
  const { update, create } = useGlobalActions();
  const [showTopupDialog, setShowTopupDialog] = useState(false);
  const [showDeductDialog, setShowDeductDialog] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [amount, setAmount] = useState('');

  const getTitle = () => {
    switch (activeView) {
      case 'wallet_master': return 'Master Wallet';
      case 'wallet_franchise': return 'Franchise Wallets';
      case 'wallet_reseller': return 'Reseller Wallets';
      case 'wallet_user': return 'User Wallets';
      case 'wallet_topup': return 'Wallet Top-up';
      case 'wallet_deduction': return 'Wallet Deduction';
      case 'wallet_low_balance': return 'Low Balance Alerts';
      default: return 'Wallet Management';
    }
  };

  const wallets = [
    { id: 'WAL001', name: 'Master Wallet', type: 'Master', balance: '₹45,67,890', status: 'Active', lastActivity: '2 min ago' },
    { id: 'WAL002', name: 'Delhi Franchise', type: 'Franchise', balance: '₹12,34,567', status: 'Active', lastActivity: '5 min ago' },
    { id: 'WAL003', name: 'Mumbai Reseller', type: 'Reseller', balance: '₹8,90,123', status: 'Active', lastActivity: '10 min ago' },
    { id: 'WAL004', name: 'Bangalore Franchise', type: 'Franchise', balance: '₹5,67,890', status: 'Low Balance', lastActivity: '15 min ago' },
    { id: 'WAL005', name: 'Chennai Reseller', type: 'Reseller', balance: '₹2,34,567', status: 'Active', lastActivity: '20 min ago' },
  ];

  const lowBalanceAlerts = [
    { id: 'LBA001', wallet: 'Bangalore Franchise', balance: '₹5,000', threshold: '₹10,000', daysRemaining: 3 },
    { id: 'LBA002', wallet: 'Pune Reseller', balance: '₹2,500', threshold: '₹5,000', daysRemaining: 1 },
    { id: 'LBA003', wallet: 'Hyderabad User', balance: '₹500', threshold: '₹1,000', daysRemaining: 0 },
  ];

  const handleTopup = (walletId: string) => {
    setSelectedWallet(walletId);
    setShowTopupDialog(true);
  };

  const handleDeduct = (walletId: string) => {
    setSelectedWallet(walletId);
    setShowDeductDialog(true);
  };

  const handleViewWallet = (walletId: string) => {
    update('user', walletId, { action: 'view_wallet' });
  };

  const confirmTopup = () => {
    if (selectedWallet && amount) {
      create('user', { walletId: selectedWallet, amount, type: 'topup' });
      setShowTopupDialog(false);
      setAmount('');
      setSelectedWallet(null);
    }
  };

  const confirmDeduct = () => {
    if (selectedWallet && amount) {
      create('user', { walletId: selectedWallet, amount, type: 'deduction' });
      setShowDeductDialog(false);
      setAmount('');
      setSelectedWallet(null);
    }
  };

  const handleLowBalanceTopup = (alertId: string) => {
    create('alert', { alertId, action: 'topup_from_alert' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage all wallet operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowTopupDialog(true)}>
            <Plus className="w-4 h-4" />
            Top-up
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowDeductDialog(true)}>
            <Minus className="w-4 h-4" />
            Deduct
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search wallets by ID, name, or type..." className="pl-10" />
      </div>

      {/* Wallet Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Master Wallet</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">₹45.67L</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Franchise Total</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">₹18.02L</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Reseller Total</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">₹11.24L</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Low Balance</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">3 Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallets Table */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">All Wallets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 font-medium">Wallet ID</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Balance</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Last Activity</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {wallets.map((wallet) => (
                  <tr key={wallet.id} className="text-sm">
                    <td className="py-3 font-mono text-slate-600 dark:text-slate-300">{wallet.id}</td>
                    <td className="py-3 font-medium text-slate-900 dark:text-white">{wallet.name}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-xs">{wallet.type}</Badge>
                    </td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">{wallet.balance}</td>
                    <td className="py-3">
                      <Badge 
                        variant={wallet.status === 'Active' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {wallet.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-slate-500">{wallet.lastActivity}</td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleViewWallet(wallet.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleTopup(wallet.id)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleDeduct(wallet.id)}>
                          <Minus className="w-4 h-4" />
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

      {/* Low Balance Alerts */}
      {activeView === 'wallet_low_balance' && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Low Balance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowBalanceAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{alert.wallet}</p>
                    <p className="text-xs text-slate-500">
                      Balance: {alert.balance} | Threshold: {alert.threshold}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={alert.daysRemaining === 0 ? 'destructive' : 'secondary'}>
                      {alert.daysRemaining === 0 ? 'Critical' : `${alert.daysRemaining} days left`}
                    </Badge>
                    <Button size="sm" className="gap-1" onClick={() => handleLowBalanceTopup(alert.id)}>
                      <Plus className="w-3 h-3" />
                      Top-up
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top-up Dialog */}
      <Dialog open={showTopupDialog} onOpenChange={setShowTopupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wallet Top-up</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Amount</label>
              <Input 
                placeholder="Enter amount" 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTopupDialog(false)}>Cancel</Button>
            <Button onClick={confirmTopup}>Confirm Top-up</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deduct Dialog */}
      <Dialog open={showDeductDialog} onOpenChange={setShowDeductDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wallet Deduction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Amount</label>
              <Input 
                placeholder="Enter amount" 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeductDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeduct}>Confirm Deduction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletManagement;
