// ================================================================
// API Endpoint Validator - Validates API endpoint structure
// Part of Enterprise Integrity Hard Check
// ================================================================

export interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  version: string;
  isVersioned: boolean;
  hasAuthGuard: boolean;
  hasRateLimit: boolean;
  responseFormat: 'standard' | 'non-standard' | 'unknown';
  errorCodes: number[];
  documentation: boolean;
  status: 'active' | 'deprecated' | 'broken';
  issues: string[];
}

export interface APIValidationReport {
  totalEndpoints: number;
  versionedEndpoints: number;
  unprotectedEndpoints: number;
  rateLimitedEndpoints: number;
  documentedEndpoints: number;
  deprecatedEndpoints: number;
  endpoints: APIEndpoint[];
  missingVersionEndpoints: string[];
  inconsistentResponseFormats: string[];
  unprotectedEndpointReport: APIEndpoint[];
  timestamp: string;
}

const API_BASE = '/functions/v1';

// Complete API endpoint registry
export const API_ENDPOINTS: APIEndpoint[] = [
  // Auth endpoints
  {
    path: `${API_BASE}/api-auth/login`,
    method: 'POST',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: false,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [400, 401, 422, 429, 500],
    documentation: true,
    status: 'active',
    issues: [],
  },
  {
    path: `${API_BASE}/api-auth/logout`,
    method: 'POST',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: false,
    responseFormat: 'standard',
    errorCodes: [401, 500],
    documentation: true,
    status: 'active',
    issues: ['Missing rate limit on logout (DoS risk)'],
  },
  {
    path: `${API_BASE}/api-auth/register`,
    method: 'POST',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: false,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [400, 409, 422, 429, 500],
    documentation: true,
    status: 'active',
    issues: [],
  },
  {
    path: `${API_BASE}/api-auth/refresh`,
    method: 'POST',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: false,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [401, 429, 500],
    documentation: true,
    status: 'active',
    issues: [],
  },

  // Lead management
  {
    path: `${API_BASE}/api-leads`,
    method: 'GET',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [401, 403, 429, 500],
    documentation: true,
    status: 'active',
    issues: [],
  },
  {
    path: `${API_BASE}/api-leads/create`,
    method: 'POST',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [400, 401, 403, 422, 429, 500],
    documentation: true,
    status: 'active',
    issues: [],
  },
  {
    path: `${API_BASE}/api-leads/export`,
    method: 'GET',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [401, 403, 429, 500],
    documentation: false,
    status: 'active',
    issues: ['Missing API documentation'],
  },

  // Wallet / Finance
  {
    path: `${API_BASE}/api-wallet/ledger`,
    method: 'GET',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [401, 403, 429, 500],
    documentation: true,
    status: 'active',
    issues: [],
  },
  {
    path: `${API_BASE}/api-wallet/payout`,
    method: 'POST',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [400, 401, 403, 422, 429, 500],
    documentation: true,
    status: 'active',
    issues: [],
  },
  {
    path: `${API_BASE}/api-wallet/user/:id`,
    method: 'GET',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: false,
    responseFormat: 'standard',
    errorCodes: [401, 403, 404, 500],
    documentation: false,
    status: 'active',
    issues: ['Missing rate limit', 'Missing documentation'],
  },

  // Demo management
  {
    path: `${API_BASE}/api-demo`,
    method: 'GET',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [401, 429, 500],
    documentation: true,
    status: 'active',
    issues: [],
  },
  {
    path: `${API_BASE}/api-demo/create`,
    method: 'POST',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [400, 401, 403, 422, 429, 500],
    documentation: true,
    status: 'active',
    issues: [],
  },

  // R&D
  {
    path: `${API_BASE}/api-rnd/approve`,
    method: 'POST',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [401, 403, 404, 422, 500],
    documentation: false,
    status: 'active',
    issues: ['Missing documentation'],
  },
  {
    path: `${API_BASE}/api-rnd/suggest`,
    method: 'POST',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [400, 401, 422, 500],
    documentation: false,
    status: 'active',
    issues: ['Missing documentation'],
  },

  // Settings & User
  {
    path: `${API_BASE}/api-settings/update`,
    method: 'PUT',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [400, 401, 422, 500],
    documentation: false,
    status: 'active',
    issues: ['Missing documentation'],
  },
  {
    path: `${API_BASE}/api-user/profile`,
    method: 'PATCH',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [400, 401, 422, 500],
    documentation: true,
    status: 'active',
    issues: [],
  },

  // Admin
  {
    path: `${API_BASE}/api-admin/users`,
    method: 'GET',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [401, 403, 429, 500],
    documentation: true,
    status: 'active',
    issues: [],
  },
  {
    path: `${API_BASE}/api-admin/roles`,
    method: 'POST',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [400, 401, 403, 422, 500],
    documentation: true,
    status: 'active',
    issues: [],
  },

  // Support
  {
    path: `${API_BASE}/api-support/ticket`,
    method: 'POST',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [400, 401, 422, 429, 500],
    documentation: true,
    status: 'active',
    issues: [],
  },
  {
    path: `${API_BASE}/api-support/tickets`,
    method: 'GET',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [401, 429, 500],
    documentation: true,
    status: 'active',
    issues: [],
  },

  // Other modules
  {
    path: `${API_BASE}/api-legal/case`,
    method: 'POST',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [400, 401, 403, 422, 500],
    documentation: false,
    status: 'active',
    issues: ['Missing documentation'],
  },
  {
    path: `${API_BASE}/api-hr/job`,
    method: 'POST',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [400, 401, 403, 422, 500],
    documentation: false,
    status: 'active',
    issues: ['Missing documentation'],
  },
  {
    path: `${API_BASE}/api-seo/keyword`,
    method: 'POST',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [400, 401, 403, 422, 500],
    documentation: false,
    status: 'active',
    issues: ['Missing documentation'],
  },
  {
    path: `${API_BASE}/api-resellers`,
    method: 'GET',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [401, 403, 429, 500],
    documentation: false,
    status: 'active',
    issues: ['Missing documentation'],
  },
  {
    path: `${API_BASE}/api-performance/escalate`,
    method: 'POST',
    version: 'v1',
    isVersioned: true,
    hasAuthGuard: true,
    hasRateLimit: true,
    responseFormat: 'standard',
    errorCodes: [400, 401, 403, 422, 500],
    documentation: false,
    status: 'active',
    issues: ['Missing documentation'],
  },
];

export function validateAPIEndpoints(): APIValidationReport {
  const unprotectedEndpoints = API_ENDPOINTS.filter(
    e => !e.hasAuthGuard && e.status === 'active'
  );
  const missingVersionEndpoints = API_ENDPOINTS
    .filter(e => !e.isVersioned)
    .map(e => e.path);
  const inconsistentResponseFormats = API_ENDPOINTS
    .filter(e => e.responseFormat !== 'standard')
    .map(e => `${e.method} ${e.path}: ${e.responseFormat}`);

  return {
    totalEndpoints: API_ENDPOINTS.length,
    versionedEndpoints: API_ENDPOINTS.filter(e => e.isVersioned).length,
    unprotectedEndpoints: unprotectedEndpoints.length,
    rateLimitedEndpoints: API_ENDPOINTS.filter(e => e.hasRateLimit).length,
    documentedEndpoints: API_ENDPOINTS.filter(e => e.documentation).length,
    deprecatedEndpoints: API_ENDPOINTS.filter(e => e.status === 'deprecated').length,
    endpoints: API_ENDPOINTS,
    missingVersionEndpoints,
    inconsistentResponseFormats,
    unprotectedEndpointReport: unprotectedEndpoints,
    timestamp: new Date().toISOString(),
  };
}
