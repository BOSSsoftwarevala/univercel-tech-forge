/**
 * PAYMENT GATEWAY SCREEN
 * 6 Gateways: UPI, PayU, Flutterwave, Paystack, Stripe, Crypto
 * User selects gateway → User adds own details → No bank details shown
 */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CreditCard,
  Smartphone,
  Globe,
  Coins,
  CheckCircle,
  Settings,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Gateway {
  id: string;
  name: string;
  icon: React.ElementType;
  region: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  color: string;
}

const GATEWAYS: Gateway[] = [
  {
    id: 'upi',
    name: 'UPI',
    icon: Smartphone,
    region: 'India',
    description: 'Unified Payments Interface - India',
    status: 'active',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'payu',
    name: 'PayU',
    icon: Globe,
    region: 'Asia / Africa',
    description: 'PayU Payment Gateway',
    status: 'active',
    color: 'from-green-500 to-emerald-600',
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave',
    icon: Globe,
    region: 'Africa',
    description: 'Flutterwave Africa Gateway',
    status: 'active',
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 'paystack',
    name: 'Paystack',
    icon: CreditCard,
    region: 'Africa',
    description: 'Paystack Payment Gateway',
    status: 'active',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: CreditCard,
    region: 'International',
    description: 'International Cards via Stripe',
    status: 'active',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'crypto',
    name: 'Crypto',
    icon: Coins,
    region: 'Global',
    description: 'USDT / BTC / BNB',
    status: 'active',
    color: 'from-yellow-500 to-orange-600',
  },
];

export function PaymentGatewayScreen() {
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState(false);

  const handleConfigure = (gatewayId: string) => {
    setSelectedGateway(gatewayId);
    toast.info('Configuration panel opened');
  };

  const handleSaveConfig = () => {
    toast.success('Gateway configuration saved');
    setSelectedGateway(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payment Gateways</h1>
          <p className="text-muted-foreground">Configure your payment methods</p>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
          <Shield className="h-3 w-3 mr-1" />
          Secure
        </Badge>
      </div>

      {/* Gateway Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GATEWAYS.map((gateway, index) => {
          const Icon = gateway.icon;
          const isSelected = selectedGateway === gateway.id;

          return (
            <motion.div
              key={gateway.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gateway.color} flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{gateway.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{gateway.region}</p>
                      </div>
                    </div>
                    <Badge
                      variant={gateway.status === 'active' ? 'default' : 'secondary'}
                      className={
                        gateway.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : ''
                      }
                    >
                      {gateway.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {gateway.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{gateway.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch checked={gateway.status === 'active'} />
                      <span className="text-xs text-muted-foreground">Enabled</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleConfigure(gateway.id)}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Configuration Panel */}
      {selectedGateway && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configure {GATEWAYS.find((g) => g.id === selectedGateway)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="relative">
                    <Input
                      type={showKeys ? 'text' : 'password'}
                      placeholder="Enter your API key"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                      onClick={() => setShowKeys(!showKeys)}
                    >
                      {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <div className="relative">
                    <Input
                      type={showKeys ? 'text' : 'password'}
                      placeholder="Enter your secret key"
                      className="pr-10"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-xs text-amber-400 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Your payment credentials are encrypted and never shared. Software Vala bank details are not exposed.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setSelectedGateway(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveConfig}>Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Security Notice */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-emerald-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Security Rules Applied</h4>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                <li>• No card data stored locally</li>
                <li>• No bank details visible to users</li>
                <li>• All transactions logged and masked</li>
                <li>• PCI-DSS compliant processing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentGatewayScreen;
