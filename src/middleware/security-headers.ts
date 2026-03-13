// ==============================================
// Security Headers Middleware
// ==============================================
// Provides utilities for adding CSP, HSTS, and
// other protective headers.  In a Vite/React SPA
// these are applied via meta tags at render time
// (server-side headers are configured in the
// Nginx / Vercel / Supabase Edge layers).

// ---------- Types ----------

export interface SecurityHeadersConfig {
  /** Content Security Policy directives */
  csp?: Partial<CSPDirectives>;
  /** Enable Strict-Transport-Security meta hint */
  hsts?: boolean;
  /** Suppress referrer information */
  noReferrer?: boolean;
  /** Prevent MIME sniffing */
  noSniff?: boolean;
  /** Prevent framing (clickjacking) */
  frameOptions?: 'DENY' | 'SAMEORIGIN';
}

export interface CSPDirectives {
  defaultSrc: string[];
  scriptSrc: string[];
  styleSrc: string[];
  imgSrc: string[];
  connectSrc: string[];
  fontSrc: string[];
  objectSrc: string[];
  mediaSrc: string[];
  frameSrc: string[];
  workerSrc: string[];
  formAction: string[];
  baseUri: string[];
  upgradeInsecureRequests: boolean;
}

// ---------- Default production-grade CSP ----------

const SUPABASE_URL: string = (typeof import.meta !== 'undefined'
  ? (import.meta as Record<string, unknown>)?.env?.['VITE_SUPABASE_URL']
  : undefined) as string ?? '';

export const DEFAULT_CSP: CSPDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'"], // Required by Tailwind inline styles
  imgSrc: ["'self'", 'data:', 'blob:', 'https://*.supabase.co', 'https://api.qrserver.com'],
  connectSrc: [
    "'self'",
    SUPABASE_URL,
    'https://*.supabase.co',
    'wss://*.supabase.co',
    'https://ipapi.co',
  ].filter(Boolean),
  fontSrc: ["'self'", 'data:'],
  objectSrc: ["'none'"],
  mediaSrc: ["'self'"],
  frameSrc: ["'none'"],
  workerSrc: ["'self'", 'blob:'],
  formAction: ["'self'"],
  baseUri: ["'self'"],
  upgradeInsecureRequests: true,
};

// ---------- CSP string builder ----------

export function buildCSPString(directives: Partial<CSPDirectives> = {}): string {
  const merged = { ...DEFAULT_CSP, ...directives };
  const parts: string[] = [];

  const addDirective = (name: string, values: string[]) => {
    if (values.length > 0) parts.push(`${name} ${values.join(' ')}`);
  };

  addDirective('default-src', merged.defaultSrc);
  addDirective('script-src', merged.scriptSrc);
  addDirective('style-src', merged.styleSrc);
  addDirective('img-src', merged.imgSrc);
  addDirective('connect-src', merged.connectSrc);
  addDirective('font-src', merged.fontSrc);
  addDirective('object-src', merged.objectSrc);
  addDirective('media-src', merged.mediaSrc);
  addDirective('frame-src', merged.frameSrc);
  addDirective('worker-src', merged.workerSrc);
  addDirective('form-action', merged.formAction);
  addDirective('base-uri', merged.baseUri);

  if (merged.upgradeInsecureRequests) {
    parts.push('upgrade-insecure-requests');
  }

  return parts.join('; ');
}

// ---------- Apply security meta tags ----------

/**
 * Inject security-related <meta> tags into the document <head>.
 * Call once on application mount.
 */
export function applySecurityHeaders(config: SecurityHeadersConfig = {}): void {
  if (typeof document === 'undefined') return;

  const {
    csp = {},
    noReferrer = true,
    noSniff = true,
    frameOptions = 'DENY',
  } = config;

  // Content-Security-Policy
  setMetaTag('http-equiv', 'Content-Security-Policy', buildCSPString(csp));

  // Referrer Policy
  if (noReferrer) {
    setMetaTag('name', 'referrer', 'no-referrer');
  }

  // X-Content-Type-Options (informational – enforced by server)
  if (noSniff) {
    setMetaTag('http-equiv', 'X-Content-Type-Options', 'nosniff');
  }

  // X-Frame-Options (informational – enforced by server)
  setMetaTag('http-equiv', 'X-Frame-Options', frameOptions);

  // Permissions-Policy: restrict powerful features
  setMetaTag(
    'http-equiv',
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()',
  );
}

function setMetaTag(
  attrName: 'name' | 'http-equiv',
  attrValue: string,
  content: string,
): void {
  let el = document.querySelector<HTMLMetaElement>(
    `meta[${attrName}="${attrValue}"]`,
  );
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// ---------- CORS helpers ----------

/** Allowed origins for client-side CORS pre-flight checks */
export const ALLOWED_ORIGINS = [
  'https://softwarevala.net',
  'https://www.softwarevala.net',
  'https://app.softwarevala.net',
  ...(typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? ['http://localhost:8080', 'http://localhost:5173']
    : []),
];

export function isAllowedOrigin(origin: string): boolean {
  return ALLOWED_ORIGINS.includes(origin);
}
