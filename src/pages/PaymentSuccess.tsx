import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Download, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  const txnid = searchParams.get('txnid') || searchParams.get('mihpayid') || '';
  const amount = searchParams.get('amount') || '';
  const status = searchParams.get('status') || 'success';

  useEffect(() => {
    const verifyAndCreateOrder = async () => {
      try {
        // Call verify-payu-payment if we have transaction params
        if (txnid) {
          const params = Object.fromEntries(searchParams.entries());
          const { data, error } = await supabase.functions.invoke('verify-payu-payment', {
            body: params,
          });

          if (!error && data?.success) {
            setOrderDetails(data);
          }
        }
      } catch (err) {
        console.error('Payment verification error:', err);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAndCreateOrder();
  }, [txnid, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-green-500/30 bg-card shadow-xl">
          <CardContent className="pt-8 pb-6 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
            </motion.div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Payment Successful!</h1>
              <p className="text-muted-foreground">
                Your transaction has been processed successfully.
              </p>
            </div>

            {(txnid || amount) && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-left">
                {txnid && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-mono font-medium text-foreground">{txnid}</span>
                  </div>
                )}
                {amount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium text-foreground">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {orderDetails?.order?.order_number && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Order Number</span>
                    <span className="font-mono font-medium text-foreground">{orderDetails.order.order_number}</span>
                  </div>
                )}
                {orderDetails?.license?.license_key && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">License Key</span>
                    <span className="font-mono font-medium text-green-500 text-xs">{orderDetails.license.license_key}</span>
                  </div>
                )}
              </div>
            )}

            {isVerifying && (
              <p className="text-sm text-muted-foreground animate-pulse">
                Verifying your payment...
              </p>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <Button onClick={() => navigate('/marketplace')} className="w-full gap-2">
                <ArrowRight className="w-4 h-4" />
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full gap-2">
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              A confirmation has been logged to your account. Contact support for any issues.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
