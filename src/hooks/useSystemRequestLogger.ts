import { supabase } from '@/integrations/supabase/client';

export type SystemRequestStatus = 'NEW' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface SystemRequestInput {
  action_type: string;
  role_type?: string | null;
  source?: string;
  status?: SystemRequestStatus;
  payload_json?: Record<string, unknown>;
  user_id?: string | null;
}

/**
 * Logic-only: creates a single backend record representing a user/system request.
 * This is the canonical queue the Boss Panel can ingest.
 */
export async function createSystemRequest(input: SystemRequestInput) {
  const {
    action_type,
    role_type = null,
    source = 'frontend',
    status = 'PENDING',
    payload_json = {},
    user_id,
  } = input;

  const finalUserId = typeof user_id === 'string' ? user_id : null;

  const eventBody = {
    event_type: action_type,
    source_role: role_type ?? 'unknown',
    source_user_id: finalUserId,
    status,
    payload: {
      source,
      ...JSON.parse(JSON.stringify(payload_json)),
    },
  };

  console.log('[SYSTEM_EVENT] POST api-system-event', eventBody);

  const { data, error } = await supabase.functions.invoke('api-system-event', {
    body: eventBody,
  });

  if (error) {
    console.error('[SYSTEM_EVENT] Create FAILED:', error);
    return { data: null, error };
  }

  console.log('[SYSTEM_EVENT] Create SUCCESS:', data);
  return { data, error: null };
}

