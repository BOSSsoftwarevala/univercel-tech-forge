import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const WISE_PAYMENT_URL = 'https://wise.com/pay/business/manojkumar21';

interface WisePaymentParams {
  amount?: string;
  currency?: string;
  reference?: string;
  description?: string;
}

interface UseWiseReturn {
  isLoading: boolean;
  redirectToWise: (params?: WisePaymentParams) => void;
  getPaymentLink: (params?: WisePaymentParams) => string;
}

export function useWise(): UseWiseReturn {
  const [isLoading, setIsLoading] = useState(false);

  const getPaymentLink = (params?: WisePaymentParams): string => {
    const url = new URL(WISE_PAYMENT_URL);
    
    if (params?.amount) {
      url.searchParams.set('amount', params.amount);
    }
    if (params?.currency) {
      url.searchParams.set('currency', params.currency);
    }
    if (params?.reference) {
      url.searchParams.set('reference', params.reference);
    }
    if (params?.description) {
      url.searchParams.set('description', params.description);
    }
    
    return url.toString();
  };

  const redirectToWise = (params?: WisePaymentParams) => {
    setIsLoading(true);
    
    try {
      const paymentUrl = getPaymentLink(params);
      
      toast({
        title: 'Redirecting to Wise',
        description: 'You will be redirected to complete your payment',
      });

      // Open in new tab for better UX
      window.open(paymentUrl, '_blank', 'noopener,noreferrer');
    } catch (error: any) {
      console.error('Wise redirect error:', error);
      toast({
        title: 'Payment Error',
        description: 'Failed to redirect to Wise payment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    redirectToWise,
    getPaymentLink,
  };
}
