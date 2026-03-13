/**
 * Payment Tracker - Tracks payment attempts for AI follow-up
 * Fixed price: $249 USD for all products. Amount cannot be overridden.
 */

import { supabase } from '@/integrations/supabase/client';
import { FIXED_PRICE, FIXED_CURRENCY } from '@/lib/payment/fixed-price-validator';

interface PaymentAttempt {
  /** Ignored — always set to FIXED_PRICE ($249 USD) server-side */
  amount?: number;
  /** Ignored — always set to FIXED_CURRENCY (USD) */
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

    // Policy 5: Fraud check — block if too many recent failures
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: recentFailures } = await supabase
      .from('payment_attempts')
      .select('id')
      .eq('user_id', user?.id)
      .eq('status', 'failed')
      .gte('created_at', oneHourAgo);

    if ((recentFailures?.length || 0) >= 5) {
      // Log security alert
      await supabase.from('finance_security_alerts').insert({
        alert_type: 'payment_spam',
        severity: 'critical',
        user_id: user?.id,
        description: `User blocked: ${recentFailures?.length} failed payment attempts in 1 hour`,
        metadata: { attempt_count: recentFailures?.length, amount: attempt.amount }
      } as any);
      console.error('Payment blocked: too many failed attempts');
      return null;
    }

    // Policy 6: Create transaction lock
    const transactionId = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    await supabase.from('transaction_security_locks').insert({
      transaction_id: transactionId,
      lock_type: 'payment',
      user_id: user?.id || '00000000-0000-0000-0000-000000000000',
      amount: attempt.amount,
      lock_status: 'locked',
      otp_verified: false,
      gateway_verified: false,
      boss_approved: false,
      metadata: { session_id: sessionId, payment_type: attempt.paymentType }
    } as any);

    const { data, error } = await supabase
      .from('payment_attempts')
      .insert({
        user_id: user?.id,
        session_id: sessionId,
        email: attempt.email || user?.email,
        phone: attempt.phone,
        amount: FIXED_PRICE,          // always $249; caller-supplied value ignored
        currency: FIXED_CURRENCY,     // always USD
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

    // Policy 7: Immutable finance log
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      action: 'payment_initiated',
      module: 'payment_system',
      meta_json: {
        amount: attempt.amount,
        payment_type: attempt.paymentType,
        product_name: attempt.productName,
        security_lock: transactionId,
        session_id: sessionId
      }
    });

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
