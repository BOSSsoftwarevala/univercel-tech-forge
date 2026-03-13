/**
 * Email Queue Service
 * Handles email queuing, retry logic, and Supabase integration
 */

import { supabase } from '@/integrations/supabase/client';

export interface QueueEmailOptions {
  to: string;
  subject: string;
  bodyHtml: string;
  emailType?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: Record<string, unknown>;
  scheduledAt?: Date;
}

export interface EmailQueueRecord {
  id: string;
  email_to: string;
  subject: string;
  status: string;
  priority: string;
  attempts: number;
  max_attempts: number;
  last_error?: string | null;
  metadata?: Record<string, unknown> | null;
  scheduled_at: string;
  sent_at?: string | null;
  created_at: string;
}

const MAX_ATTEMPTS = 3;

/**
 * Queue an email for sending with automatic retry on failure.
 */
export async function queueEmail(opts: QueueEmailOptions): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from('email_queue')
    .insert({
      email_to: opts.to,
      subject: opts.subject,
      body_html: opts.bodyHtml,
      email_type: opts.emailType ?? 'notification',
      priority: opts.priority ?? 'medium',
      metadata: opts.metadata ?? null,
      scheduled_at: opts.scheduledAt?.toISOString() ?? new Date().toISOString(),
      status: 'pending',
      attempts: 0,
      max_attempts: MAX_ATTEMPTS,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[EmailQueueService] Failed to queue email:', error.message);
    return null;
  }

  return data;
}

/**
 * Process a single pending email: call the api-email edge function and update status.
 */
export async function processEmail(record: EmailQueueRecord): Promise<boolean> {
  // Mark as processing
  await supabase
    .from('email_queue')
    .update({ status: 'processing', updated_at: new Date().toISOString() })
    .eq('id', record.id);

  try {
    const { error: fnError } = await supabase.functions.invoke('api-email', {
      body: {
        type: record.metadata?.emailType ?? 'notification',
        to: record.email_to,
        data: {
          title: record.subject,
          message: record.metadata?.message ?? record.subject,
          ...(record.metadata ?? {}),
        },
      },
    });

    if (fnError) throw new Error(fnError.message);

    // Mark sent
    await supabase
      .from('email_queue')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', record.id);

    return true;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const newAttempts = record.attempts + 1;
    const failed = newAttempts >= record.max_attempts;

    await supabase
      .from('email_queue')
      .update({
        status: failed ? 'failed' : 'retrying',
        attempts: newAttempts,
        last_error: message,
        updated_at: new Date().toISOString(),
      })
      .eq('id', record.id);

    console.error(`[EmailQueueService] Email ${record.id} attempt ${newAttempts} failed:`, message);
    return false;
  }
}

/**
 * Fetch pending/retrying emails and process up to `limit` of them.
 */
export async function flushEmailQueue(limit = 10): Promise<{ sent: number; failed: number }> {
  const { data: records, error } = await supabase
    .from('email_queue')
    .select('*')
    .in('status', ['pending', 'retrying'])
    .lte('scheduled_at', new Date().toISOString())
    .order('priority', { ascending: false })
    .order('scheduled_at', { ascending: true })
    .limit(limit);

  if (error || !records) {
    console.error('[EmailQueueService] Failed to fetch queue:', error?.message);
    return { sent: 0, failed: 0 };
  }

  let sent = 0;
  let failed = 0;

  for (const record of records as EmailQueueRecord[]) {
    const ok = await processEmail(record);
    if (ok) sent++;
    else failed++;
  }

  return { sent, failed };
}

/**
 * Fetch queue stats for display in the UI.
 */
export async function getEmailQueueStats(): Promise<{
  total: number;
  pending: number;
  sent: number;
  failed: number;
  retrying: number;
}> {
  const { data, error } = await supabase
    .from('email_queue')
    .select('status');

  if (error || !data) {
    return { total: 0, pending: 0, sent: 0, failed: 0, retrying: 0 };
  }

  return data.reduce(
    (acc, row) => {
      acc.total++;
      const s = row.status as string;
      if (s === 'pending') acc.pending++;
      else if (s === 'sent') acc.sent++;
      else if (s === 'failed') acc.failed++;
      else if (s === 'retrying') acc.retrying++;
      return acc;
    },
    { total: 0, pending: 0, sent: 0, failed: 0, retrying: 0 },
  );
}
