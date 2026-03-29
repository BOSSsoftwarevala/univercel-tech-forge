import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PayPalOrder {
  id: string;
  status: string;
  links?: Array<{ href: string; rel: string }>;
}

interface UsePayPalReturn {
  isLoading: boolean;
  createOrder: (amount: string, currency?: string, description?: string) => Promise<PayPalOrder | null>;
  captureOrder: (orderId: string) => Promise<PayPalOrder | null>;
  getOrderDetails: (orderId: string) => Promise<PayPalOrder | null>;
}

export function usePayPal(): UsePayPalReturn {
  const [isLoading, setIsLoading] = useState(false);

  const createOrder = async (
    amount: string,
    currency: string = 'USD',
    description: string = 'Payment'
  ): Promise<PayPalOrder | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('paypal', {
        body: {
          action: 'create-order',
          amount,
          currency,
          description,
        },
      });

      if (error) throw error;

      toast({
        title: 'Order Created',
        description: `PayPal order ${data.id} created successfully`,
      });

      return data;
    } catch (error: any) {
      console.error('PayPal create order error:', error);
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to create PayPal order',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const captureOrder = async (orderId: string): Promise<PayPalOrder | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('paypal', {
        body: {
          action: 'capture-order',
          orderId,
        },
      });

      if (error) throw error;

      if (data.status === 'COMPLETED') {
        toast({
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully',
        });
      }

      return data;
    } catch (error: any) {
      console.error('PayPal capture order error:', error);
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to capture PayPal payment',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderDetails = async (orderId: string): Promise<PayPalOrder | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('paypal', {
        body: {
          action: 'get-order',
          orderId,
        },
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('PayPal get order error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to get order details',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createOrder,
    captureOrder,
    getOrderDetails,
  };
}
