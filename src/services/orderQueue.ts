// Order Processing Queue Service
// Manages the 10-step automated order processing pipeline

import { supabase } from '@/integrations/supabase/client';
import { createSystemRequest } from '@/hooks/useSystemRequestLogger';

export interface QueueStep {
  id: string;
  order_id: string;
  step_name: string;
  step_order: number;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  retry_count: number;
}

const ORDER_PIPELINE_STEPS = [
  'order_created',
  'payment_confirmed',
  'product_scan',
  'license_generated',
  'product_provisioning',
  'server_allocation',
  'deployment_setup',
  'deployment_execution',
  'notification_sent',
  'order_completed',
] as const;

class OrderQueueService {
  /**
   * Initialize the processing queue for a new order
   */
  async initializeQueue(orderId: string): Promise<boolean> {
    const steps = ORDER_PIPELINE_STEPS.map((step, index) => ({
      order_id: orderId,
      step_name: step,
      step_order: index + 1,
      status: index === 0 ? 'completed' : 'pending',
      started_at: index === 0 ? new Date().toISOString() : null,
      completed_at: index === 0 ? new Date().toISOString() : null,
    }));

    const { error } = await (supabase as any)
      .from('order_processing_queue')
      .insert(steps);

    if (error) {
      console.error('[OrderQueue] Init failed:', error.message);
      return false;
    }

    // Notify Boss Panel
    await createSystemRequest({
      action_type: 'order_pipeline_started',
      role_type: 'system',
      payload_json: { order_id: orderId, total_steps: ORDER_PIPELINE_STEPS.length },
    });

    return true;
  }

  /**
   * Advance to the next step in the queue
   */
  async advanceStep(orderId: string, completedStep: string): Promise<{ nextStep: string | null }> {
    // Mark current step as completed
    await (supabase as any)
      .from('order_processing_queue')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('order_id', orderId)
      .eq('step_name', completedStep);

    // Find next pending step
    const { data: nextSteps } = await (supabase as any)
      .from('order_processing_queue')
      .select('*')
      .eq('order_id', orderId)
      .eq('status', 'pending')
      .order('step_order', { ascending: true })
      .limit(1);

    if (!nextSteps?.length) {
      // All steps completed — mark order as completed
      await (supabase as any)
        .from('marketplace_orders')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', orderId);

      await createSystemRequest({
        action_type: 'order_pipeline_completed',
        role_type: 'system',
        payload_json: { order_id: orderId },
      });

      return { nextStep: null };
    }

    // Start next step
    const next = nextSteps[0];
    await (supabase as any)
      .from('order_processing_queue')
      .update({ status: 'in_progress', started_at: new Date().toISOString() })
      .eq('id', next.id);

    return { nextStep: next.step_name };
  }

  /**
   * Mark a step as failed with retry logic
   */
  async failStep(orderId: string, stepName: string, errorMessage: string): Promise<boolean> {
    const { data: step } = await (supabase as any)
      .from('order_processing_queue')
      .select('*')
      .eq('order_id', orderId)
      .eq('step_name', stepName)
      .single();

    if (!step) return false;

    if (step.retry_count < step.max_retries) {
      // Retry
      await (supabase as any)
        .from('order_processing_queue')
        .update({
          status: 'pending',
          retry_count: step.retry_count + 1,
          error_message: errorMessage,
        })
        .eq('id', step.id);
      return true;
    }

    // Max retries exceeded — fail permanently
    await (supabase as any)
      .from('order_processing_queue')
      .update({
        status: 'failed',
        error_message: errorMessage,
        completed_at: new Date().toISOString(),
      })
      .eq('id', step.id);

    // Alert Boss Panel
    await createSystemRequest({
      action_type: 'order_step_failed',
      role_type: 'system',
      payload_json: {
        order_id: orderId,
        step_name: stepName,
        error: errorMessage,
        severity: 'critical',
      },
    });

    return false;
  }

  /**
   * Get queue status for an order
   */
  async getQueueStatus(orderId: string): Promise<QueueStep[]> {
    const { data } = await (supabase as any)
      .from('order_processing_queue')
      .select('*')
      .eq('order_id', orderId)
      .order('step_order', { ascending: true });

    return data || [];
  }

  /**
   * Dispatch webhook for an order event
   */
  async dispatchWebhook(eventType: string, orderId: string, payload: Record<string, any>): Promise<void> {
    try {
      await supabase.functions.invoke('marketplace-webhook-dispatch', {
        body: { event_type: eventType, order_id: orderId, payload },
      });
    } catch (err) {
      console.error('[OrderQueue] Webhook dispatch failed:', err);
    }
  }
}

export const orderQueue = new OrderQueueService();
