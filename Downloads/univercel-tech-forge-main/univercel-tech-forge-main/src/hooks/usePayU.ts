import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PayUPaymentParams {
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone?: string;
  successUrl?: string;
  failureUrl?: string;
}

interface PayUPaymentResponse {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  hash: string;
  surl: string;
  furl: string;
  payuBaseUrl: string;
}

interface PayUVerifyResponse {
  isValid: boolean;
  status: string;
  txnid: string;
}

interface UsePayUReturn {
  isLoading: boolean;
  initiatePayment: (params: PayUPaymentParams) => Promise<PayUPaymentResponse | null>;
  verifyPayment: (params: any) => Promise<PayUVerifyResponse | null>;
  redirectToPayU: (paymentData: PayUPaymentResponse) => void;
}

export function usePayU(): UsePayUReturn {
  const [isLoading, setIsLoading] = useState(false);

  const initiatePayment = async (params: PayUPaymentParams): Promise<PayUPaymentResponse | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('payu', {
        body: {
          action: 'create-payment',
          ...params,
        },
      });

      if (error) throw error;

      toast({
        title: 'Payment Initiated',
        description: `Transaction ID: ${data.txnid}`,
      });

      return data;
    } catch (error: any) {
      console.error('PayU initiate payment error:', error);
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to initiate PayU payment',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (params: any): Promise<PayUVerifyResponse | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('payu', {
        body: {
          action: 'verify-payment',
          ...params,
        },
      });

      if (error) throw error;

      if (data.isValid && data.status === 'success') {
        toast({
          title: 'Payment Verified',
          description: 'Your payment has been successfully verified',
        });
      } else if (!data.isValid) {
        toast({
          title: 'Verification Failed',
          description: 'Payment verification failed. Please contact support.',
          variant: 'destructive',
        });
      }

      return data;
    } catch (error: any) {
      console.error('PayU verify payment error:', error);
      toast({
        title: 'Verification Error',
        description: error.message || 'Failed to verify PayU payment',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToPayU = (paymentData: PayUPaymentResponse) => {
    // Create a form and submit to PayU
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${paymentData.payuBaseUrl}/_payment`;

    const fields = {
      key: paymentData.key,
      txnid: paymentData.txnid,
      amount: paymentData.amount,
      productinfo: paymentData.productinfo,
      firstname: paymentData.firstname,
      email: paymentData.email,
      hash: paymentData.hash,
      surl: paymentData.surl || window.location.origin + '/payment-success',
      furl: paymentData.furl || window.location.origin + '/payment-failure',
    };

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return {
    isLoading,
    initiatePayment,
    verifyPayment,
    redirectToPayU,
  };
}
