import React, { useState } from 'react';
import { CreditCard, Smartphone, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUPI } from '@/hooks/useUPI';
import { useBinance } from '@/hooks/useBinance';
import { usePayU } from '@/hooks/usePayU';
import { toast } from '@/hooks/use-toast';

interface ProjectData {
  id: string;
  deposit_amount: number | null;
  balance_amount: number | null;
}

interface ClientPaymentSectionProps {
  project: ProjectData;
  paymentType: 'deposit' | 'balance';
}

const ClientPaymentSection: React.FC<ClientPaymentSectionProps> = ({ project, paymentType }) => {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const { getPaymentDetails, copyUpiIdToClipboard, generateUPILink } = useUPI();
  const { getPaymentDetails: getBinanceDetails, copyUidToClipboard } = useBinance();
  const { initiatePayment, redirectToPayU, isLoading: payuLoading } = usePayU();

  const amount = paymentType === 'deposit' ? project.deposit_amount : project.balance_amount;
  const upiDetails = getPaymentDetails();
  const binanceDetails = getBinanceDetails();

  const handlePayUPayment = async () => {
    if (!amount) return;
    
    const paymentData = await initiatePayment({
      amount: amount.toString(),
      productinfo: `${paymentType === 'deposit' ? 'Project Deposit' : 'Project Balance'} - ${project.id}`,
      firstname: 'Client',
      email: 'client@example.com', // Would come from project data
    });

    if (paymentData) {
      redirectToPayU(paymentData);
    }
  };

  const handleUPIPayment = () => {
    const upiLink = generateUPILink({
      amount: amount?.toString(),
      note: `${paymentType === 'deposit' ? 'Project Deposit' : 'Project Balance'}`,
      transactionRef: project.id,
    });
    
    window.open(upiLink, '_blank');
    toast({
      title: 'UPI Payment',
      description: 'Complete the payment in your UPI app and share the screenshot with us.',
    });
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Pay {paymentType === 'deposit' ? 'Deposit' : 'Balance'}: ₹{amount?.toLocaleString()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="upi">UPI</TabsTrigger>
            <TabsTrigger value="binance">Crypto</TabsTrigger>
            <TabsTrigger value="payu">Card/NetBanking</TabsTrigger>
          </TabsList>

          <TabsContent value="upi" className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm font-medium mb-2">UPI ID</p>
              <code className="text-lg font-mono">{upiDetails.upiId}</code>
              <p className="text-xs text-muted-foreground mt-1">{upiDetails.name}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={copyUpiIdToClipboard}>
                Copy UPI ID
              </Button>
              <Button className="flex-1" onClick={handleUPIPayment}>
                <Smartphone className="w-4 h-4 mr-2" />
                Pay with UPI App
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="binance" className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm font-medium mb-2">Binance Pay UID</p>
              <code className="text-lg font-mono">{binanceDetails.uid}</code>
              <p className="text-xs text-muted-foreground mt-1">{binanceDetails.name}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={copyUidToClipboard}>
                Copy UID
              </Button>
              <Button className="flex-1" onClick={() => window.open('https://app.binance.com/en/pay', '_blank')}>
                <QrCode className="w-4 h-4 mr-2" />
                Open Binance Pay
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Pay in USDT, BUSD, or any supported cryptocurrency
            </p>
          </TabsContent>

          <TabsContent value="payu" className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm mb-2">Pay securely with Credit/Debit Card or Net Banking</p>
            </div>
            <Button 
              className="w-full" 
              onClick={handlePayUPayment}
              disabled={payuLoading}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {payuLoading ? 'Processing...' : `Pay ₹${amount?.toLocaleString()}`}
            </Button>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground text-center mt-4">
          After payment, please share the transaction ID or screenshot with our team for faster processing.
        </p>
      </CardContent>
    </Card>
  );
};

export default ClientPaymentSection;
