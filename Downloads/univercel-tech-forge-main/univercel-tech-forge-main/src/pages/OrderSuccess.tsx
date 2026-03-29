import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Home, KeyRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [license, setLicense] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const orderId = searchParams.get('order_id') || '';

  useEffect(() => {
    const load = async () => {
      if (!orderId) {
        setError('Missing order ID');
        setIsLoading(false);
        return;
      }

      try {
        const [{ data: orderData, error: orderError }, { data: licenseData, error: licenseError }] = await Promise.all([
          supabase.from('marketplace_orders').select('*').eq('id', orderId).maybeSingle(),
          supabase.from('marketplace_licenses').select('*').eq('order_id', orderId).maybeSingle(),
        ]);

        if (orderError) throw orderError;
        if (licenseError) throw licenseError;
        if (!orderData) throw new Error('Order not found');

        setOrder(orderData);
        setLicense(licenseData || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl">
        <Card className="border-emerald-500/30 bg-card shadow-xl">
          <CardContent className="pt-8 pb-6 text-center space-y-6">
            <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto" />
            <div>
              <h1 className="text-2xl font-bold">Order Completed</h1>
              <p className="text-muted-foreground mt-2">Your purchase is confirmed and your account has been updated.</p>
            </div>

            {isLoading && <p className="text-sm text-muted-foreground animate-pulse">Loading order details...</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}

            {order && !isLoading && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order</span>
                  <span className="font-mono font-medium">{order.order_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium text-emerald-500">{order.order_status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment</span>
                  <span className="font-medium">{order.payment_status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">₹{Number(order.final_amount || 0).toLocaleString('en-IN')}</span>
                </div>
                {license?.license_key && (
                  <div className="flex justify-between items-start gap-4 text-sm">
                    <span className="text-muted-foreground">License</span>
                    <span className="font-mono font-medium text-emerald-500 text-right break-all">{license.license_key}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <Button onClick={() => navigate('/user-dashboard')} className="w-full gap-2">
                <ArrowRight className="w-4 h-4" />
                Open User Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate('/marketplace')} className="w-full gap-2">
                <KeyRound className="w-4 h-4" />
                Back to Marketplace
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}