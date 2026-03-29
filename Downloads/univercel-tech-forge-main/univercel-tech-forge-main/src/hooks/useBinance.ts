import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

// Binance Pay account details (masked for security)
const BINANCE_ACCOUNT = {
  name: 'software vala',
  uid: '984324781',
  email: 'sc****625@gmail.com', // Masked email
  maskedUid: '984***781',
};

interface BinancePaymentDetails {
  name: string;
  uid: string;
  maskedUid: string;
  email: string;
}

interface UseBinanceReturn {
  isLoading: boolean;
  getPaymentDetails: () => BinancePaymentDetails;
  getMaskedDetails: () => BinancePaymentDetails;
  copyUidToClipboard: () => Promise<void>;
  openBinanceApp: () => void;
}

export function useBinance(): UseBinanceReturn {
  const [isLoading, setIsLoading] = useState(false);

  const getPaymentDetails = (): BinancePaymentDetails => {
    return {
      name: BINANCE_ACCOUNT.name,
      uid: BINANCE_ACCOUNT.uid,
      maskedUid: BINANCE_ACCOUNT.maskedUid,
      email: BINANCE_ACCOUNT.email,
    };
  };

  const getMaskedDetails = (): BinancePaymentDetails => {
    return {
      name: BINANCE_ACCOUNT.name,
      uid: BINANCE_ACCOUNT.maskedUid,
      maskedUid: BINANCE_ACCOUNT.maskedUid,
      email: BINANCE_ACCOUNT.email,
    };
  };

  const copyUidToClipboard = async () => {
    setIsLoading(true);
    try {
      await navigator.clipboard.writeText(BINANCE_ACCOUNT.uid);
      toast({
        title: 'Copied!',
        description: 'Binance UID copied to clipboard',
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

  const openBinanceApp = () => {
    // Deep link to Binance app pay section
    const binancePayUrl = `https://app.binance.com/en/pay`;
    
    toast({
      title: 'Opening Binance',
      description: `Pay to UID: ${BINANCE_ACCOUNT.uid}`,
    });

    window.open(binancePayUrl, '_blank', 'noopener,noreferrer');
  };

  return {
    isLoading,
    getPaymentDetails,
    getMaskedDetails,
    copyUidToClipboard,
    openBinanceApp,
  };
}
