/**
 * Admin API Routes – AI Service Management
 * These are Supabase-backed service functions that serve as the "route handlers"
 * for AI service CRUD, key rotation, status changes, and audit log access.
 *
 * Usage: import and call these from React components or hooks.
 * All operations require super_admin role (enforced via Supabase RLS).
 */

import {
  createAPIService,
  updateAPIService,
  listAPIServices,
  getAPIService,
  rotateApiKey,
  setServiceStatus,
  getServiceAuditLog,
  APIServiceConfig,
} from '@/lib/ai-orchestration/api-manager';
import { supabase } from '@/integrations/supabase/client';
import AI_GATEWAY, { GatewayRequest, ProviderType } from '@/lib/ai-orchestration/ai-gateway';
import { getMonthlyCostSummary } from '@/lib/ai-orchestration/usage-tracker';

const PROVIDER_KEYWORDS: Record<ProviderType, string[]> = {
  openai: ['openai', 'gpt'],
  elevenlabs: ['elevenlabs', 'eleven'],
  github: ['github'],
  whatsapp: ['whatsapp', 'facebook', 'meta'],
  stripe: ['stripe'],
  firebase_fcm: ['firebase', 'fcm'],
};

function detectProvider(serviceName: string): ProviderType {
  const lower = serviceName.toLowerCase();
  for (const [provider, keywords] of Object.entries(PROVIDER_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return provider as ProviderType;
    }
  }
  return 'openai'; // default fallback
}

// POST /api/v1/admin/ai-services
export async function adminCreateService(config: APIServiceConfig) {
  return createAPIService(config);
}

// GET /api/v1/admin/ai-services
export async function adminListServices() {
  return listAPIServices();
}

// GET /api/v1/admin/ai-services/:id
export async function adminGetService(id: string) {
  return getAPIService(id);
}

// PUT /api/v1/admin/ai-services/:id
export async function adminUpdateService(
  id: string,
  updates: Partial<Omit<APIServiceConfig, 'api_key_plaintext'>>,
  updatedBy?: string
) {
  return updateAPIService(id, updates, updatedBy);
}

// PATCH /api/v1/admin/ai-services/:id/status
export async function adminSetStatus(
  id: string,
  status: 'active' | 'disabled' | 'maintenance',
  updatedBy?: string
) {
  return setServiceStatus(id, status, updatedBy);
}

// POST /api/v1/admin/ai-services/:id/rotate-key
export async function adminRotateKey(id: string, newKey: string, updatedBy?: string) {
  return rotateApiKey(id, newKey, updatedBy);
}

// POST /api/v1/admin/ai-services/:id/test
export async function adminTestService(id: string, userId?: string) {
  const svc = await supabase
    .from('api_services')
    .select('service_name')
    .eq('id', id)
    .single();

  if (svc.error || !svc.data) {
    return { ok: false, error: 'Service not found' };
  }

  const provider = detectProvider(svc.data.service_name);

  const testReq: GatewayRequest = {
    provider,
    endpoint: provider === 'openai' ? '/models' : provider === 'github' ? '/rate_limit' : '/',
    method: 'GET',
    serviceId: id,
    userId,
  };

  const result = await AI_GATEWAY(testReq);
  return { ok: result.ok, status: result.status, error: result.error };
}

// GET /api/v1/admin/ai-services/:id/usage
export async function adminGetServiceUsage(id: string) {
  return getMonthlyCostSummary();
}

// GET /api/v1/admin/ai-services/audit-log
export async function adminGetAuditLog(serviceId?: string) {
  return getServiceAuditLog(serviceId);
}
