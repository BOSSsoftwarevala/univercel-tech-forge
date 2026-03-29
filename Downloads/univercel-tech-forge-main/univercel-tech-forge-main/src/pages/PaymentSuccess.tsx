import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const token = searchParams.get('token') || '';
  const orderId = searchParams.get('order_id') || '';

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!token || !orderId) {
          setVerificationError('Missing payment return parameters');
          return;
        }

        const { data, error } = await supabase.functions.invoke('api-verify-payment', {
          body: {
            order_id: orderId,
            token,
          },
        });

        if (error) {
          throw error;
        }

        const payload = data?.data ?? data;
        setOrderDetails(payload);

        if (payload?.order_id) {
          navigate(`/order-success?order_id=${encodeURIComponent(payload.order_id)}`, { replace: true });
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setVerificationError(err instanceof Error ? err.message : 'Payment verification failed');
      } finally {
        setIsVerifying(false);
      }
    };

    void verifyPayment();
  }, [navigate, orderId, token]);

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

            {(orderId || token) && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-left">
                {orderId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Order ID</span>
                    <span className="font-mono font-medium text-foreground">{orderId}</span>
                  </div>
                )}
                {token && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gateway Token</span>
                    <span className="font-mono font-medium text-foreground">{token}</span>
                  </div>
                )}
                {orderDetails?.payment_id && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment ID</span>
                    <span className="font-mono font-medium text-foreground">{orderDetails.payment_id}</span>
                  </div>
                )}
              </div>
            )}

            {isVerifying && (
              <p className="text-sm text-muted-foreground animate-pulse">
                Verifying your payment...
              </p>
            )}

            {verificationError && !isVerifying && (
              <p className="text-sm text-destructive">{verificationError}</p>
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
