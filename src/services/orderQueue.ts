// Order Processing Queue Service
// Manages the 10-step automated order processing pipeline
//
// Improvements made:
// - Added missing fields (retry_count, error_message) when initializing steps
// - Defensive checks for supabase responses (check `error` and `data`)
// - Respect a default max retries if DB doesn't provide `max_retries`
// - Better logging and system-request notifications on failures
// - Safer webhook invocation (JSON body) and error handling
// - Stronger TypeScript typing for returned values and null checks

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
  // optional column if you store per-step max retries
  max_retries?: number | null;
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

const DEFAULT_MAX_RETRIES = 3;

class OrderQueueService {
  /**
   * Initialize the processing queue for a new order
   *
   * Inserts one row per pipeline step. Sets the first step (order_created) as completed.
   */
  async initializeQueue(orderId: string): Promise<boolean> {
    try {
      const steps = ORDER_PIPELINE_STEPS.map((step, index) => ({
        order_id: orderId,
        step_name: step,
        step_order: index + 1,
        status: step === 'order_created' ? 'completed' : 'pending',
        started_at: step === 'order_created' ? new Date().toISOString() : null,
        completed_at: step === 'order_created' ? new Date().toISOString() : null,
        retry_count: 0,
        error_message: null,
      }));

      // Use select() to get back inserted rows for debugging if needed
      const { error, data } = await (supabase as any)
        .from('order_processing_queue')
        .insert(steps)
        .select();

      if (error) {
        console.error('[OrderQueue] Init failed (insert):', error);
        await createSystemRequest({
          action_type: 'order_pipeline_init_failed',
          role_type: 'system',
          payload_json: { order_id: orderId, error: error.message || error },
        });
        return false;
      }

      // Notify Boss Panel
      await createSystemRequest({
        action_type: 'order_pipeline_started',
        role_type: 'system',
        payload_json: { order_id: orderId, total_steps: ORDER_PIPELINE_STEPS.length, created_steps: (data || []).length },
      });

      return true;
    } catch (err) {
      console.error('[OrderQueue] initializeQueue unexpected error:', err);
      await createSystemRequest({
        action_type: 'order_pipeline_init_error',
        role_type: 'system',
        payload_json: { order_id: orderId, error: String(err) },
      });
      return false;
    }
  }

  /**
   * Advance to the next step in the queue
   *
   * Marks completedStep as completed and starts the next pending step (if any).
   * Returns the next step name or null if pipeline finished.
   */
  async advanceStep(orderId: string, completedStep: string): Promise<{ nextStep: string | null }> {
    try {
      // Mark current step as completed
      const { error: upErr } = await (supabase as any)
        .from('order_processing_queue')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          error_message: null,
        })
        .eq('order_id', orderId)
        .eq('step_name', completedStep);

      if (upErr) {
        console.error('[OrderQueue] advanceStep: failed to mark step completed:', upErr);
        // continue — we still try to find next step, but notify
        await createSystemRequest({
          action_type: 'order_step_mark_complete_failed',
          role_type: 'system',
          payload_json: { order_id: orderId, step_name: completedStep, error: upErr.message || upErr },
        });
      }

      // Find next pending step
      const { data: nextSteps, error: selErr } = await (supabase as any)
        .from('order_processing_queue')
        .select('*')
        .eq('order_id', orderId)
        .eq('status', 'pending')
        .order('step_order', { ascending: true })
        .limit(1);

      if (selErr) {
        console.error('[OrderQueue] advanceStep: failed to select next step:', selErr);
        return { nextStep: null };
      }

      if (!nextSteps || nextSteps.length === 0) {
        // All steps completed — mark order as completed
        const { error: ordErr } = await (supabase as any)
          .from('marketplace_orders')
          .update({ status: 'completed', completed_at: new Date().toISOString() })
          .eq('id', orderId);

        if (ordErr) {
          console.error('[OrderQueue] advanceStep: failed to mark marketplace_orders completed:', ordErr);
        }

        await createSystemRequest({
          action_type: 'order_pipeline_completed',
          role_type: 'system',
          payload_json: { order_id: orderId },
        });

        return { nextStep: null };
      }

      // Start next step
      const next = nextSteps[0];
      const { error: startErr } = await (supabase as any)
        .from('order_processing_queue')
        .update({ status: 'in_progress', started_at: new Date().toISOString() })
        .eq('id', next.id);

      if (startErr) {
        console.error('[OrderQueue] advanceStep: failed to start next step:', startErr);
        await createSystemRequest({
          action_type: 'order_step_start_failed',
          role_type: 'system',
          payload_json: { order_id: orderId, step_name: next.step_name, error: startErr.message || startErr },
        });
      }

      return { nextStep: next.step_name };
    } catch (err) {
      console.error('[OrderQueue] advanceStep unexpected error:', err);
      await createSystemRequest({
        action_type: 'order_pipeline_advance_error',
        role_type: 'system',
        payload_json: { order_id: orderId, completedStep, error: String(err) },
      });
      return { nextStep: null };
    }
  }

  /**
   * Mark a step as failed with retry logic
   *
   * Returns true if the step was set to retry (or updated), false if it failed permanently.
   */
  async failStep(orderId: string, stepName: string, errorMessage: string): Promise<boolean> {
    try {
      const { data: stepData, error: selErr } = await (supabase as any)
        .from('order_processing_queue')
        .select('*')
        .eq('order_id', orderId)
        .eq('step_name', stepName)
        .limit(1)
        .single();

      if (selErr) {
        console.error('[OrderQueue] failStep: failed to fetch step:', selErr);
        return false;
      }

      const step: QueueStep = stepData;

      const maxRetries = typeof step.max_retries === 'number' && step.max_retries >= 0 ? step.max_retries : DEFAULT_MAX_RETRIES;
      const currentRetries = typeof step.retry_count === 'number' ? step.retry_count : 0;

      if (currentRetries < maxRetries) {
        // Retry: set back to pending, increment retry_count, store error
        const { error: updErr } = await (supabase as any)
          .from('order_processing_queue')
          .update({
            status: 'pending',
            retry_count: currentRetries + 1,
            error_message: errorMessage,
            started_at: null,
            completed_at: null,
          })
          .eq('id', step.id);

        if (updErr) {
          console.error('[OrderQueue] failStep: failed to set retry:', updErr);
          await createSystemRequest({
            action_type: 'order_step_retry_update_failed',
            role_type: 'system',
            payload_json: { order_id: orderId, step_name: stepName, error: updErr.message || updErr },
          });
          // Treat as not retried
          return false;
        }

        await createSystemRequest({
          action_type: 'order_step_retry_scheduled',
          role_type: 'system',
          payload_json: { order_id: orderId, step_name: stepName, retry_count: currentRetries + 1, max_retries: maxRetries },
        });

        return true;
      }

      // Max retries exceeded — fail permanently
      const { error: failErr } = await (supabase as any)
        .from('order_processing_queue')
        .update({
          status: 'failed',
          error_message: errorMessage,
          completed_at: new Date().toISOString(),
        })
        .eq('id', step.id);

      if (failErr) {
        console.error('[OrderQueue] failStep: failed to mark step as failed:', failErr);
      }

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

      // Optionally mark order failed as well (comment/uncomment depending on business logic)
      try {
        const { error: ordFailErr } = await (supabase as any)
          .from('marketplace_orders')
          .update({ status: 'failed', updated_at: new Date().toISOString() })
          .eq('id', orderId);

        if (ordFailErr) {
          console.error('[OrderQueue] failStep: failed to mark order failed:', ordFailErr);
        }
      } catch (e) {
        console.error('[OrderQueue] failStep: error while marking order failed:', e);
      }

      return false;
    } catch (err) {
      console.error('[OrderQueue] failStep unexpected error:', err);
      await createSystemRequest({
        action_type: 'order_pipeline_fail_error',
        role_type: 'system',
        payload_json: { order_id: orderId, step_name: stepName, error: String(err) },
      });
      return false;
    }
  }

  /**
   * Get queue status for an order
   */
  async getQueueStatus(orderId: string): Promise<QueueStep[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('order_processing_queue')
        .select('*')
        .eq('order_id', orderId)
        .order('step_order', { ascending: true });

      if (error) {
        console.error('[OrderQueue] getQueueStatus failed:', error);
        return [];
      }

      return (data || []) as QueueStep[];
    } catch (err) {
      console.error('[OrderQueue] getQueueStatus unexpected error:', err);
      return [];
    }
  }

  /**
   * Dispatch webhook for an order event
   */
  async dispatchWebhook(eventType: string, orderId: string, payload: Record<string, any>): Promise<void> {
    try {
      // supabase.functions.invoke expects a JSON string body in many SDK versions
      await (supabase as any).functions.invoke('marketplace-webhook-dispatch', {
        body: JSON.stringify({ event_type: eventType, order_id: orderId, payload }),
      });
    } catch (err) {
      console.error('[OrderQueue] Webhook dispatch failed:', err);
      // Log a system request for visibility
      await createSystemRequest({
        action_type: 'order_webhook_dispatch_failed',
        role_type: 'system',
        payload_json: { order_id: orderId, event_type: eventType, error: String(err) },
      });
    }
  }
}

export const orderQueue = new OrderQueueService();
