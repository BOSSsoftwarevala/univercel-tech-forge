/**
 * PAYMENT GATEWAYS SECTION
 * UPI, Bank Transfer, PayU, Stripe, PayPal, Crypto
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Smartphone,
  Landmark,
  CreditCard,
  DollarSign,
  Bitcoin,
  Settings,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { FinanceView } from '../FinanceSidebar';
import { useGlobalActions } from '@/hooks/useGlobalActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface PaymentGatewaysProps {
  activeView: FinanceView;
}

const PaymentGateways: React.FC<PaymentGatewaysProps> = ({ activeView }) => {
  const { toggle, update } = useGlobalActions();
  const [gatewayStatus, setGatewayStatus] = useState<Record<string, boolean>>({
    upi: true,
    bank: true,
    payu: true,
    stripe: true,
    paypal: false,
    crypto: true,
  });
  const [showLogsDialog, setShowLogsDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);

  const getTitle = () => {
    switch (activeView) {
      case 'gateway_upi': return 'UPI Gateway';
      case 'gateway_bank': return 'Bank Transfer';
      case 'gateway_payu': return 'PayU Gateway';
      case 'gateway_stripe': return 'Stripe Gateway';
      case 'gateway_paypal': return 'PayPal Gateway';
      case 'gateway_crypto': return 'Crypto (Binance/USDT)';
      default: return 'Payment Gateways';
    }
  };

  const gateways = [
    { 
      id: 'upi', 
      name: 'UPI', 
      icon: Smartphone, 
      status: 'Active', 
      txnToday: 156, 
      volumeToday: '₹12.5L',
      successRate: '98.5%',
      avgTime: '2s'
    },
    { 
      id: 'bank', 
      name: 'Bank Transfer', 
      icon: Landmark, 
      status: 'Active', 
      txnToday: 45, 
      volumeToday: '₹25.8L',
      successRate: '99.2%',
      avgTime: '1-2 days'
    },
    { 
      id: 'payu', 
      name: 'PayU', 
      icon: CreditCard, 
      status: 'Active', 
      txnToday: 89, 
      volumeToday: '₹8.3L',
      successRate: '97.8%',
      avgTime: '5s'
    },
    { 
      id: 'stripe', 
      name: 'Stripe', 
      icon: CreditCard, 
      status: 'Active', 
      txnToday: 234, 
      volumeToday: '₹45.2L',
      successRate: '99.5%',
      avgTime: '3s'
    },
    { 
      id: 'paypal', 
      name: 'PayPal', 
      icon: DollarSign, 
      status: 'Maintenance', 
      txnToday: 0, 
      volumeToday: '₹0',
      successRate: 'N/A',
      avgTime: 'N/A'
    },
    { 
      id: 'crypto', 
      name: 'Crypto (Binance/USDT)', 
      icon: Bitcoin, 
      status: 'Active', 
      txnToday: 12, 
      volumeToday: '₹5.6L',
      successRate: '100%',
      avgTime: '10min'
    },
  ];

  const selectedGatewayData = gateways.find(g => `gateway_${g.id}` === activeView);

  const handleToggleGateway = (gatewayId: string, currentStatus: boolean) => {
    toggle('setting', gatewayId, 'status', currentStatus);
    setGatewayStatus(prev => ({ ...prev, [gatewayId]: !currentStatus }));
  };

  const handleViewLogs = (gatewayId: string) => {
    setSelectedGateway(gatewayId);
    setShowLogsDialog(true);
    update('log', gatewayId, { action: 'view_logs' });
  };

  const handleConfig = (gatewayId: string) => {
    setSelectedGateway(gatewayId);
    setShowConfigDialog(true);
    update('setting', gatewayId, { action: 'view_config' });
  };

  const handleGatewaySettings = () => {
    update('setting', 'gateways', { action: 'open_settings' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{getTitle()}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configure and monitor payment gateways</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleGatewaySettings}>
          <Settings className="w-4 h-4" />
          Gateway Settings
        </Button>
      </div>

      {/* Gateway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gateways.map((gateway) => {
          const Icon = gateway.icon;
          const isSelected = `gateway_${gateway.id}` === activeView;
          const isActive = gatewayStatus[gateway.id];
          
          return (
            <Card 
              key={gateway.id} 
              className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        isActive ? 'text-emerald-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{gateway.name}</p>
                      <Badge 
                        variant={isActive ? 'default' : 'secondary'}
                        className="text-[10px] mt-1"
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <Switch 
                    checked={isActive} 
                    onCheckedChange={() => handleToggleGateway(gateway.id, isActive)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Today's Txn</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{gateway.txnToday}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Volume</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{gateway.volumeToday}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Success Rate</p>
                    <p className="font-semibold text-emerald-600">{gateway.successRate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Avg Time</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{gateway.avgTime}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleViewLogs(gateway.id)}>
                    <Activity className="w-3 h-3 mr-1" />
                    Logs
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleConfig(gateway.id)}>
                    <Settings className="w-3 h-3 mr-1" />
                    Config
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Gateway Details */}
      {selectedGatewayData && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <selectedGatewayData.icon className="w-5 h-5 text-blue-500" />
              {selectedGatewayData.name} - Detailed View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">API Key</span>
                    <span className="font-mono text-slate-900 dark:text-white">****-****-****</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Merchant ID</span>
                    <span className="font-mono text-slate-900 dark:text-white">MERCH-***</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mode</span>
                    <Badge variant="outline">Production</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Limits</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Min Amount</span>
                    <span className="text-slate-900 dark:text-white">₹100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max Amount</span>
                    <span className="text-slate-900 dark:text-white">₹10,00,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Daily Limit</span>
                    <span className="text-slate-900 dark:text-white">₹50,00,000</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Health Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">API Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Webhook Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">SSL Valid</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logs Dialog */}
      <Dialog open={showLogsDialog} onOpenChange={setShowLogsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gateway Logs - {selectedGateway?.toUpperCase()}</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-slate-500">
            Recent transaction logs will be displayed here.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Config Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gateway Configuration - {selectedGateway?.toUpperCase()}</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-slate-500">
            Gateway configuration options will be displayed here.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfigDialog(false)}>Cancel</Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentGateways;
