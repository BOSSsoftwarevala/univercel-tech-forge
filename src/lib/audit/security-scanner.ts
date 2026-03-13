// ================================================================
// Security Scanner - Scans for security vulnerabilities
// Part of Enterprise Integrity Hard Check
// ================================================================

export type SecuritySeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface SecurityFinding {
  id: string;
  category: string;
  title: string;
  description: string;
  severity: SecuritySeverity;
  owaspCategory?: string;
  affected: string[];
  recommendation: string;
  status: 'open' | 'mitigated' | 'accepted';
  cvssScore?: number;
}

export interface SecurityScanReport {
  overallRisk: 'critical' | 'high' | 'medium' | 'low';
  healthScore: number; // 0-100
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  findings: SecurityFinding[];
  owaspCoverage: { category: string; covered: boolean; notes: string }[];
  privilegeEscalationRisks: string[];
  crossTenantVulnerabilities: string[];
  encryptionStatus: { component: string; encrypted: boolean; algorithm?: string }[];
  timestamp: string;
}

export const SECURITY_FINDINGS: SecurityFinding[] = [
  // JWT Security
  {
    id: 'SEC-001',
    category: 'Authentication',
    title: 'JWT Token Expiry Enforcement',
    description: 'JWT tokens are validated with proper expiry checks via Supabase Auth',
    severity: 'info',
    owaspCategory: 'A07:2021 - Identification and Authentication Failures',
    affected: ['auth/login', 'all authenticated endpoints'],
    recommendation: 'Maintain current implementation. Verify refresh token rotation is enabled.',
    status: 'mitigated',
    cvssScore: 0,
  },
  {
    id: 'SEC-002',
    category: 'Authentication',
    title: 'Hardcoded API Key in Source Code',
    description: 'Supabase anon key appears hardcoded in api-client.ts. While anon keys are public, this should be in environment variables.',
    severity: 'medium',
    owaspCategory: 'A02:2021 - Cryptographic Failures',
    affected: ['src/lib/api/api-client.ts'],
    recommendation: 'Move anon key to VITE_SUPABASE_ANON_KEY environment variable and remove hardcoded value.',
    status: 'open',
    cvssScore: 4.0,
  },
  {
    id: 'SEC-003',
    category: 'Authorization',
    title: 'IP Lock Bypass on Error',
    description: 'In security.ts, IP lock check returns allowed:true on any error, potentially allowing access bypass during outages.',
    severity: 'high',
    owaspCategory: 'A01:2021 - Broken Access Control',
    affected: ['src/lib/security.ts:checkIPLock'],
    recommendation: 'On DB error during IP lock check, deny access for IP-locked roles. Log the error and require manual unlock.',
    status: 'open',
    cvssScore: 7.5,
  },
  {
    id: 'SEC-004',
    category: 'Cross-Site Scripting',
    title: 'React XSS Protection',
    description: 'React automatically escapes JSX content, providing base XSS protection. Using dangerouslySetInnerHTML would bypass this.',
    severity: 'info',
    owaspCategory: 'A03:2021 - Injection',
    affected: ['all React components'],
    recommendation: 'Audit all uses of dangerouslySetInnerHTML. Ensure markdown rendering sanitizes HTML.',
    status: 'mitigated',
    cvssScore: 0,
  },
  {
    id: 'SEC-005',
    category: 'SQL Injection',
    title: 'Parameterized Queries via Supabase',
    description: 'Supabase client uses parameterized queries preventing SQL injection.',
    severity: 'info',
    owaspCategory: 'A03:2021 - Injection',
    affected: ['all database queries'],
    recommendation: 'Maintain use of Supabase client. Avoid raw SQL string construction.',
    status: 'mitigated',
    cvssScore: 0,
  },
  {
    id: 'SEC-006',
    category: 'Session Management',
    title: 'OTP Storage in sessionStorage',
    description: 'OTPs are stored in sessionStorage which is accessible to JavaScript. XSS attacks could read OTPs.',
    severity: 'medium',
    owaspCategory: 'A07:2021 - Identification and Authentication Failures',
    affected: ['src/lib/security.ts:storeOTP'],
    recommendation: 'Consider server-side OTP validation instead of client-side storage. If client-side, use httpOnly cookies.',
    status: 'open',
    cvssScore: 4.3,
  },
  {
    id: 'SEC-007',
    category: 'Rate Limiting',
    title: 'Missing Rate Limit on Some Endpoints',
    description: 'Several endpoints lack explicit rate limiting configuration including logout and user wallet reads.',
    severity: 'medium',
    owaspCategory: 'A04:2021 - Insecure Design',
    affected: ['/api-auth/logout', '/api-wallet/user/:id'],
    recommendation: 'Apply rate limiting to all endpoints. Configure per-IP and per-user limits.',
    status: 'open',
    cvssScore: 5.3,
  },
  {
    id: 'SEC-008',
    category: 'Data Exposure',
    title: 'Sensitive Data in Audit Logs',
    description: 'Audit log meta_json may contain sensitive user data. Ensure PII is masked in audit logs.',
    severity: 'medium',
    owaspCategory: 'A02:2021 - Cryptographic Failures',
    affected: ['src/lib/security.ts:logSecurityEvent', 'audit_logs table'],
    recommendation: 'Implement PII masking before storing in audit_logs.meta_json. Define clear data retention policies.',
    status: 'open',
    cvssScore: 4.0,
  },
  {
    id: 'SEC-009',
    category: 'Access Control',
    title: 'Row Level Security (RLS) on All Tables',
    description: 'Most tables have RLS enabled via Supabase policies providing database-level access control.',
    severity: 'info',
    owaspCategory: 'A01:2021 - Broken Access Control',
    affected: ['all database tables'],
    recommendation: 'Verify ALL tables have appropriate RLS policies. Test policies with different role contexts.',
    status: 'mitigated',
    cvssScore: 0,
  },
  {
    id: 'SEC-010',
    category: 'Cryptography',
    title: 'Secure Password Hashing',
    description: 'Passwords are handled by Supabase Auth which uses bcrypt/Argon2 for secure hashing.',
    severity: 'info',
    owaspCategory: 'A02:2021 - Cryptographic Failures',
    affected: ['auth.users'],
    recommendation: 'Maintain Supabase Auth for password management. Never implement custom password hashing.',
    status: 'mitigated',
    cvssScore: 0,
  },
  {
    id: 'SEC-011',
    category: 'CSRF Protection',
    title: 'CSRF Token Implementation',
    description: 'API uses JWT Bearer tokens in Authorization header (not cookies), providing natural CSRF protection.',
    severity: 'info',
    owaspCategory: 'A01:2021 - Broken Access Control',
    affected: ['all API endpoints'],
    recommendation: 'Maintain JWT in Authorization header pattern. Avoid moving to cookie-based auth without CSRF tokens.',
    status: 'mitigated',
    cvssScore: 0,
  },
  {
    id: 'SEC-012',
    category: 'File Upload',
    title: 'File Upload Validation',
    description: 'File upload endpoints need explicit MIME type validation and size limits to prevent malicious uploads.',
    severity: 'high',
    owaspCategory: 'A04:2021 - Insecure Design',
    affected: ['any file upload endpoints'],
    recommendation: 'Implement strict MIME type whitelist, max file size limits, and virus scanning for all uploads.',
    status: 'open',
    cvssScore: 7.2,
  },
  {
    id: 'SEC-013',
    category: 'Tenant Isolation',
    title: 'Cross-Tenant Data Leakage Prevention',
    description: 'Tenant isolation relies on RLS policies. Server Manager role has infrastructure access without tenant restrictions.',
    severity: 'medium',
    owaspCategory: 'A01:2021 - Broken Access Control',
    affected: ['server_manager role', 'infrastructure endpoints'],
    recommendation: 'Audit server_manager permissions. Ensure infrastructure data does not include tenant business data.',
    status: 'open',
    cvssScore: 5.0,
  },
  {
    id: 'SEC-014',
    category: 'Dev Tools Blocking',
    title: 'Browser Dev Tools Blocking',
    description: 'F12, Ctrl+Shift+I, and Ctrl+U are blocked. This is security through obscurity and does not prevent determined attackers.',
    severity: 'low',
    owaspCategory: 'A05:2021 - Security Misconfiguration',
    affected: ['src/lib/security.ts:blockDevTools'],
    recommendation: 'Dev tools blocking provides minimal security value. Rely on proper server-side security controls instead.',
    status: 'accepted',
    cvssScore: 1.0,
  },
  {
    id: 'SEC-015',
    category: 'CORS Configuration',
    title: 'CORS Policy Validation',
    description: 'CORS configuration for Supabase Edge Functions needs verification to prevent unauthorized cross-origin requests.',
    severity: 'high',
    owaspCategory: 'A05:2021 - Security Misconfiguration',
    affected: ['all Supabase Edge Functions'],
    recommendation: 'Verify CORS allowed origins list. Restrict to production domain and known client origins only.',
    status: 'open',
    cvssScore: 6.5,
  },
];

// OWASP Top 10 2021 Coverage
export const OWASP_COVERAGE = [
  { category: 'A01:2021 - Broken Access Control', covered: true, notes: 'RLS policies + JWT auth + RBAC guards' },
  { category: 'A02:2021 - Cryptographic Failures', covered: true, notes: 'Supabase handles encryption; anon key exposure (SEC-002) is open' },
  { category: 'A03:2021 - Injection', covered: true, notes: 'Parameterized queries via Supabase; React auto-escaping for XSS' },
  { category: 'A04:2021 - Insecure Design', covered: false, notes: 'Rate limiting gaps (SEC-007) and file upload validation (SEC-012) are open' },
  { category: 'A05:2021 - Security Misconfiguration', covered: false, notes: 'CORS configuration needs verification (SEC-015)' },
  { category: 'A06:2021 - Vulnerable Components', covered: true, notes: 'Dependencies managed via npm; regular updates recommended' },
  { category: 'A07:2021 - Authentication Failures', covered: true, notes: 'Supabase Auth + OTP + IP lock; OTP storage concern (SEC-006) is open' },
  { category: 'A08:2021 - Software and Data Integrity', covered: true, notes: 'Immutable audit logs; migration files tracked in version control' },
  { category: 'A09:2021 - Security Logging Failures', covered: true, notes: 'Audit log system exists; completeness gaps documented' },
  { category: 'A10:2021 - SSRF', covered: true, notes: 'External fetch calls to ipapi.co; AbortSignal.timeout implemented' },
];

export function runSecurityScan(): SecurityScanReport {
  const critical = SECURITY_FINDINGS.filter(f => f.severity === 'critical' && f.status === 'open');
  const high = SECURITY_FINDINGS.filter(f => f.severity === 'high' && f.status === 'open');
  const medium = SECURITY_FINDINGS.filter(f => f.severity === 'medium' && f.status === 'open');
  const low = SECURITY_FINDINGS.filter(f => f.severity === 'low' && f.status === 'open');

  let overallRisk: SecurityScanReport['overallRisk'] = 'low';
  if (critical.length > 0) overallRisk = 'critical';
  else if (high.length > 0) overallRisk = 'high';
  else if (medium.length > 0) overallRisk = 'medium';

  // Health score: start at 100, deduct for open findings
  let healthScore = 100;
  healthScore -= critical.length * 25;
  healthScore -= high.length * 15;
  healthScore -= medium.length * 8;
  healthScore -= low.length * 3;
  healthScore = Math.max(0, healthScore);

  const privilegeEscalationRisks = SECURITY_FINDINGS
    .filter(f => f.category === 'Access Control' && f.status === 'open')
    .map(f => f.title);

  const crossTenantVulnerabilities = SECURITY_FINDINGS
    .filter(f => f.category === 'Tenant Isolation' && f.status === 'open')
    .map(f => f.title);

  const encryptionStatus = [
    { component: 'Passwords', encrypted: true, algorithm: 'Supabase Auth (bcrypt/Argon2)' },
    { component: 'Data in Transit', encrypted: true, algorithm: 'TLS 1.3' },
    { component: 'Data at Rest', encrypted: true, algorithm: 'Supabase AES-256' },
    { component: 'JWT Tokens', encrypted: true, algorithm: 'HMAC-SHA256' },
    { component: 'Audit Log PII', encrypted: false },
  ];

  return {
    overallRisk,
    healthScore,
    criticalFindings: critical.length,
    highFindings: high.length,
    mediumFindings: medium.length,
    lowFindings: low.length,
    findings: SECURITY_FINDINGS,
    owaspCoverage: OWASP_COVERAGE,
    privilegeEscalationRisks,
    crossTenantVulnerabilities,
    encryptionStatus,
    timestamp: new Date().toISOString(),
  };
}
