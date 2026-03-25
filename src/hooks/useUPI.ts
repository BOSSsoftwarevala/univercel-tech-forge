import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

// UPI account details
const UPI_ACCOUNT = {
  name: 'Manoj Kumar',
  upiId: '8348838383@ptaxis',
  maskedUpiId: '83488***83@ptaxis',
  bank: 'UCO Bank',
};

interface UPIPaymentParams {
  amount?: string;
  note?: string;
  transactionRef?: string;
}

interface UPIPaymentDetails {
  name: string;
  upiId: string;
  maskedUpiId: string;
  bank: string;
}

interface UseUPIReturn {
  isLoading: boolean;
  getPaymentDetails: () => UPIPaymentDetails;
  getMaskedDetails: () => UPIPaymentDetails;
  copyUpiIdToClipboard: () => Promise<void>;
  generateUPILink: (params?: UPIPaymentParams) => string;
  openUPIApp: (params?: UPIPaymentParams) => void;
}

export function useUPI(): UseUPIReturn {
  const [isLoading, setIsLoading] = useState(false);

  const getPaymentDetails = (): UPIPaymentDetails => {
    return {
      name: UPI_ACCOUNT.name,
      upiId: UPI_ACCOUNT.upiId,
      maskedUpiId: UPI_ACCOUNT.maskedUpiId,
      bank: UPI_ACCOUNT.bank,
    };
  };

  const getMaskedDetails = (): UPIPaymentDetails => {
    return {
      name: UPI_ACCOUNT.name,
      upiId: UPI_ACCOUNT.maskedUpiId,
      maskedUpiId: UPI_ACCOUNT.maskedUpiId,
      bank: UPI_ACCOUNT.bank,
    };
  };

  const copyUpiIdToClipboard = async () => {
    setIsLoading(true);
    try {
      await navigator.clipboard.writeText(UPI_ACCOUNT.upiId);
      toast({
        title: 'Copied!',
        description: 'UPI ID copied to clipboard',
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: 'Copy Failed',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateUPILink = (params?: UPIPaymentParams): string => {
    // UPI deep link format: upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&tn=<NOTE>&tr=<REF>
    const upiParams = new URLSearchParams();
    upiParams.set('pa', UPI_ACCOUNT.upiId);
    upiParams.set('pn', UPI_ACCOUNT.name);
    upiParams.set('cu', 'INR');
    
    if (params?.amount) {
      upiParams.set('am', params.amount);
    }
    if (params?.note) {
      upiParams.set('tn', params.note);
    }
    if (params?.transactionRef) {
      upiParams.set('tr', params.transactionRef);
    }

    return `upi://pay?${upiParams.toString()}`;
  };

  const openUPIApp = (params?: UPIPaymentParams) => {
    setIsLoading(true);
    try {
      const upiLink = generateUPILink(params);
      
      toast({
        title: 'Opening UPI App',
        description: `Pay to: ${UPI_ACCOUNT.name}`,
      });

      // Try to open UPI app via deep link
      window.location.href = upiLink;
    } catch (error) {
      console.error('UPI open error:', error);
      toast({
        title: 'UPI Error',
        description: 'Could not open UPI app. Please copy UPI ID manually.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getPaymentDetails,
    getMaskedDetails,
    copyUpiIdToClipboard,
    generateUPILink,
    openUPIApp,
  };
}
