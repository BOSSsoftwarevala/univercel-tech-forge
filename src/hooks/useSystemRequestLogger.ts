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
    status = 'NEW',
    payload_json = {},
    user_id,
  } = input;

  const finalUserId = typeof user_id === 'string' ? user_id : null;

  return supabase.from('system_requests').insert([
    {
      action_type,
      role_type,
      user_id: finalUserId,
      source,
      status,
      payload_json: JSON.parse(JSON.stringify(payload_json)),
    },
  ]);
}
