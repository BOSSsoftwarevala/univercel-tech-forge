import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, Home, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const txnid = searchParams.get('txnid') || '';
  const amount = searchParams.get('amount') || '';
  const errorMsg = searchParams.get('error_Message') || searchParams.get('error') || 'Payment was not completed';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-destructive/30 bg-card shadow-xl">
          <CardContent className="pt-8 pb-6 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <XCircle className="w-20 h-20 text-destructive mx-auto" />
            </motion.div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Payment Failed</h1>
              <p className="text-muted-foreground">
                {errorMsg}
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
              </div>
            )}

            <div className="bg-muted/30 rounded-lg p-3 text-left">
              <p className="text-sm font-medium text-foreground mb-2">Common solutions:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Try a different payment method or card</li>
                <li>• Ensure sufficient balance in your account</li>
                <li>• Check with your bank for authorization</li>
                <li>• Disable any VPN and try again</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button onClick={() => navigate(-1)} className="w-full gap-2">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full gap-2">
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              No amount has been deducted. If charged, it will be refunded within 5-7 business days.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentFailure;
