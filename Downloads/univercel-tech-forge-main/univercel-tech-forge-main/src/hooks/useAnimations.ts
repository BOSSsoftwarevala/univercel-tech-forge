import { useState, useCallback } from 'react';

type AnimationType = 'welcome' | 'welcomeBack' | 'paymentSuccess' | 'bookingSuccess' | null;

interface AnimationState {
  type: AnimationType;
  data?: {
    userName?: string;
    userRole?: string;
    maskedId?: string;
    amount?: string;
    transactionId?: string;
    bookingType?: 'demo' | 'subscription' | 'booking';
    bookingId?: string;
  };
}

export const useAnimations = () => {
  const [animation, setAnimation] = useState<AnimationState>({ type: null });

  const showWelcome = useCallback((userName?: string, userRole?: string) => {
    setAnimation({ 
      type: 'welcome', 
      data: { userName, userRole } 
    });
  }, []);

  const showWelcomeBack = useCallback((userName?: string, userRole?: string, maskedId?: string) => {
    setAnimation({ 
      type: 'welcomeBack', 
      data: { userName, userRole, maskedId } 
    });
  }, []);

  const showPaymentSuccess = useCallback((amount?: string, transactionId?: string) => {
    setAnimation({ 
      type: 'paymentSuccess', 
      data: { amount, transactionId } 
    });
  }, []);

  const showBookingSuccess = useCallback((
    bookingType?: 'demo' | 'subscription' | 'booking', 
    bookingId?: string
  ) => {
    setAnimation({ 
      type: 'bookingSuccess', 
      data: { bookingType, bookingId } 
    });
  }, []);

  const hideAnimation = useCallback(() => {
    setAnimation({ type: null });
  }, []);

  return {
    animation,
    showWelcome,
    showWelcomeBack,
    showPaymentSuccess,
    showBookingSuccess,
    hideAnimation,
  };
};

export default useAnimations;
