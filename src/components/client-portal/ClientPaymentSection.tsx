import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Building2, Bitcoin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUPI } from '@/hooks/useUPI';
import { useBinance } from '@/hooks/useBinance';
import { usePayU } from '@/hooks/usePayU';
import { useWise } from '@/hooks/useWise';
import { toast } from '@/hooks/use-toast';

interface ProjectData {
  id: string;
  client_email?: string;
  deposit_amount: number | null;
  balance_amount: number | null;
  currency?: string | null;
}

interface ClientPaymentSectionProps {
  project: ProjectData;
  paymentType: 'deposit' | 'balance';
}

const ClientPaymentSection: React.FC<ClientPaymentSectionProps> = ({ project, paymentType }) => {
  const [isIndian, setIsIndian] = useState(false);
  const { getMaskedDetails, copyUpiIdToClipboard, openUPIApp } = useUPI();
  const { getMaskedDetails: getBinanceMasked, copyUidToClipboard } = useBinance();
  const { initiatePayment, redirectToPayU, isLoading: payuLoading } = usePayU();
  const { redirectToWise } = useWise();

  const amount = paymentType === 'deposit' ? project.deposit_amount : project.balance_amount;
  const currency = project.currency || 'INR';

  // Detect if user is in India
  useEffect(() => {
    const detectRegion = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setIsIndian(data.country_code === 'IN');
      } catch {
        // Default to checking currency
        setIsIndian(currency === 'INR');
      }
    };
    detectRegion();
  }, [currency]);

  const upiDetails = getMaskedDetails();
  const binanceDetails = getBinanceMasked();

  const handleUPIPayment = () => {
    openUPIApp({
      amount: amount?.toString(),
      note: `${paymentType === 'deposit' ? 'Deposit' : 'Balance'} - Project`,
      transactionRef: project.id,
    });
  };

  const handleWisePayment = () => {
    redirectToWise({
      amount: amount?.toString(),
      currency: currency === 'INR' ? 'INR' : 'USD',
      reference: project.id,
      description: `${paymentType === 'deposit' ? 'Project Deposit' : 'Project Balance'}`,
    });
  };

  const handleBinancePayment = () => {
    copyUidToClipboard();
    toast({
      title: 'Binance Pay',
      description: `Send ${amount} USDT to the copied UID`,
    });
  };

  const handlePayUPayment = async () => {
    if (!amount) return;
    
    const paymentData = await initiatePayment({
      amount: amount.toString(),
      productinfo: `${paymentType === 'deposit' ? 'Deposit' : 'Balance'} - ${project.id}`,
      firstname: 'Client',
      email: project.client_email,
    });

    if (paymentData) {
      redirectToPayU(paymentData);
    }
  };

  const formatAmount = (amt: number) => {
    if (currency === 'INR') return `₹${amt.toLocaleString('en-IN')}`;
    return `$${amt.toLocaleString('en-US')}`;
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Pay {paymentType === 'deposit' ? 'Deposit' : 'Balance'}: {amount ? formatAmount(amount) : '-'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isIndian ? (
          // Indian Payment Flow: UPI → Bank (PayU) → PayU Card
          <>
            {/* UPI - Primary for India */}
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Smartphone className="w-4 h-4 text-primary" />
                UPI Payment (Recommended)
              </div>
              <div className="text-center py-2">
                <code className="text-sm bg-background px-2 py-1 rounded">{upiDetails.maskedUpiId}</code>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={copyUpiIdToClipboard}>
                  Copy UPI ID
                </Button>
                <Button size="sm" className="flex-1" onClick={handleUPIPayment}>
                  Pay Now
                </Button>
              </div>
            </div>

            {/* PayU - Secondary for India */}
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CreditCard className="w-4 h-4" />
                Card / Net Banking
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full" 
                onClick={handlePayUPayment}
                disabled={payuLoading}
              >
                {payuLoading ? 'Processing...' : 'Pay with Card/Bank'}
              </Button>
            </div>
          </>
        ) : (
          // International Payment Flow: Wise → Crypto → PayPal
          <>
            {/* Wise - Primary for International */}
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Building2 className="w-4 h-4 text-primary" />
                Bank Transfer via Wise (Recommended)
              </div>
              <p className="text-xs text-muted-foreground">
                Software Vala • Low fees, fast transfer
              </p>
              <Button size="sm" className="w-full" onClick={handleWisePayment}>
                <Globe className="w-3 h-3 mr-1" />
                Pay with Wise
              </Button>
            </div>

            {/* Crypto - Secondary */}
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Bitcoin className="w-4 h-4" />
                Crypto (Binance Pay)
              </div>
              <div className="text-center py-1">
                <code className="text-xs bg-background px-2 py-1 rounded">{binanceDetails.uid}</code>
              </div>
              <Button variant="secondary" size="sm" className="w-full" onClick={handleBinancePayment}>
                Copy UID & Pay
              </Button>
            </div>

            {/* PayU for International Cards */}
            <div className="p-3 bg-muted/30 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CreditCard className="w-4 h-4" />
                Credit/Debit Card
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={handlePayUPayment}
                disabled={payuLoading}
              >
                {payuLoading ? 'Processing...' : 'Pay with Card'}
              </Button>
            </div>
          </>
        )}

        <p className="text-[10px] text-muted-foreground text-center pt-2">
          Share transaction ID/screenshot after payment for faster processing
        </p>
      </CardContent>
    </Card>
  );
};

export default ClientPaymentSection;
