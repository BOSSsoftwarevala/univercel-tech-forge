/**
 * Payment Tracker - Tracks payment attempts for AI follow-up
 */

import { supabase } from '@/integrations/supabase/client';

interface PaymentAttempt {
  amount: number;
  currency?: string;
  paymentType: 'subscription' | 'one-time' | 'deposit' | 'balance';
  productId?: string;
  productName?: string;
  email?: string;
  phone?: string;
}

/**
 * Track when a payment is initiated
 */
export const trackPaymentInitiated = async (attempt: PaymentAttempt) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const { data, error } = await supabase
      .from('payment_attempts')
      .insert({
        user_id: user?.id,
        session_id: sessionId,
        email: attempt.email || user?.email,
        phone: attempt.phone,
        amount: attempt.amount,
        currency: attempt.currency || 'INR',
        payment_type: attempt.paymentType,
        product_id: attempt.productId,
        product_name: attempt.productName,
        status: 'initiated'
      } as any)
      .select()
      .single();

    if (error) {
      console.error('Error tracking payment:', error);
      return null;
    }

    return data?.id;
  } catch (error) {
    console.error('Payment tracking error:', error);
    return null;
  }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (
  paymentId: string,
  status: 'pending' | 'completed' | 'failed' | 'abandoned',
  failureReason?: string
) => {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    if (failureReason) {
      updateData.failure_reason = failureReason;
    }

    await supabase
      .from('payment_attempts')
      .update(updateData)
      .eq('id', paymentId);

  } catch (error) {
    console.error('Error updating payment status:', error);
  }
};

/**
 * Report payment issue from user
 */
export const reportPaymentIssue = async (paymentId: string, issue: string) => {
  try {
    await supabase
      .from('payment_attempts')
      .update({
        user_issue_reported: issue,
        updated_at: new Date().toISOString()
      } as any)
      .eq('id', paymentId);

  } catch (error) {
    console.error('Error reporting payment issue:', error);
  }
};
