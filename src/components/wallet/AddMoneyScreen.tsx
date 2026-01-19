/**
 * ADD MONEY SCREEN
 * Step 1: Enter Amount
 * Step 2: Select Gateway
 * Step 3: Redirect to Gateway
 * Step 4: Auto Credit Wallet
 */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Wallet,
  CreditCard,
  Smartphone,
  Globe,
  Coins,
  ArrowRight,
  CheckCircle,
  Shield,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const GATEWAYS = [
  { id: 'upi', name: 'UPI', icon: Smartphone, region: 'India' },
  { id: 'payu', name: 'PayU', icon: Globe, region: 'Asia/Africa' },
  { id: 'flutterwave', name: 'Flutterwave', icon: Globe, region: 'Africa' },
  { id: 'paystack', name: 'Paystack', icon: CreditCard, region: 'Africa' },
  { id: 'stripe', name: 'Stripe', icon: CreditCard, region: 'International' },
  { id: 'crypto', name: 'Crypto', icon: Coins, region: 'Global' },
];

const QUICK_AMOUNTS = [100, 250, 500, 1000, 2500, 5000];

export function AddMoneyScreen() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [selectedGateway, setSelectedGateway] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleProceed = () => {
    if (step === 1 && amount && parseFloat(amount) >= 10) {
      setStep(2);
    } else if (step === 2 && selectedGateway) {
      setStep(3);
      simulatePayment();
    }
  };

  const simulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setTransactionId(`TXN${Date.now().toString(36).toUpperCase()}`);
      setStep(4);
      toast.success('Payment successful! Wallet credited.');
    }, 3000);
  };

  const handleNewTransaction = () => {
    setStep(1);
    setAmount('');
    setSelectedGateway('');
    setTransactionId('');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Add Money to Wallet</h1>
        <p className="text-muted-foreground">Secure and instant wallet top-up</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step >= s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step > s ? <CheckCircle className="h-4 w-4" /> : s}
            </div>
            {s < 4 && (
              <div
                className={`w-12 h-1 rounded ${
                  step > s ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Enter Amount */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Step 1: Enter Amount
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Amount (USD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 text-2xl font-bold h-14"
                      placeholder="0.00"
                      min="10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Minimum: $10</p>
                </div>

                <div className="space-y-2">
                  <Label>Quick Select</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {QUICK_AMOUNTS.map((value) => (
                      <Button
                        key={value}
                        variant={amount === value.toString() ? 'default' : 'outline'}
                        onClick={() => handleQuickAmount(value)}
                        className="h-12"
                      >
                        ${value}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full h-12"
                  onClick={handleProceed}
                  disabled={!amount || parseFloat(amount) < 10}
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Select Gateway */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Step 2: Select Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                  <p className="text-sm font-medium">
                    Amount to add: <span className="text-primary">${parseFloat(amount).toLocaleString()}</span>
                  </p>
                </div>

                <RadioGroup value={selectedGateway} onValueChange={setSelectedGateway}>
                  <div className="grid gap-3">
                    {GATEWAYS.map((gateway) => {
                      const Icon = gateway.icon;
                      return (
                        <div key={gateway.id}>
                          <RadioGroupItem
                            value={gateway.id}
                            id={gateway.id}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={gateway.id}
                            className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted"
                          >
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{gateway.name}</p>
                              <p className="text-xs text-muted-foreground">{gateway.region}</p>
                            </div>
                            {selectedGateway === gateway.id && (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            )}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleProceed}
                    disabled={!selectedGateway}
                  >
                    Pay Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Processing */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardContent className="py-12 text-center space-y-4">
                <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
                <h3 className="text-xl font-bold">Processing Payment</h3>
                <p className="text-muted-foreground">
                  Redirecting to {GATEWAYS.find((g) => g.id === selectedGateway)?.name}...
                </p>
                <p className="text-sm text-muted-foreground">Please do not close this window</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-emerald-500/50">
              <CardContent className="py-12 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-emerald-400">Payment Successful!</h3>
                <p className="text-muted-foreground">
                  ${parseFloat(amount).toLocaleString()} has been added to your wallet
                </p>

                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-mono font-medium">{transactionId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gateway</span>
                    <span>{GATEWAYS.find((g) => g.id === selectedGateway)?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="text-emerald-400 font-medium">${parseFloat(amount).toLocaleString()}</span>
                  </div>
                </div>

                <Button onClick={handleNewTransaction} className="mt-4">
                  Add More Money
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Footer */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>256-bit SSL Encrypted • PCI-DSS Compliant</span>
      </div>
    </div>
  );
}

export default AddMoneyScreen;
