// Security Hardening Library for SOFTWARE VALA
// Comprehensive protection against OWASP Top 10 and common attack vectors

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================================================
// SQL INJECTION PREVENTION
// ============================================================================

/**
 * SQL Injection Protection
 * Validates and sanitizes inputs to prevent SQL injection attacks
 */
export const SQLInjectionGuard = {
  // Dangerous SQL patterns to block
  DANGEROUS_PATTERNS: [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|ALTER|CREATE|UNION|INTO|LOAD_FILE|OUTFILE)\b)/gi,
    /(--|#|\/\*|\*\/|;)/g,
    /(\bOR\b|\bAND\b)\s*[\d'"]+=[\d'"]/gi,
    /(['"])\s*\1/g,
    /EXEC(\s|\+)+(S|X)P\w+/gi,
    /WAITFOR\s+DELAY/gi,
    /BENCHMARK\s*\(/gi,
    /SLEEP\s*\(/gi,
  ],

  /**
   * Check if input contains SQL injection patterns
   */
  containsInjection(input: string): boolean {
    if (typeof input !== 'string') return false;
    return this.DANGEROUS_PATTERNS.some(pattern => pattern.test(input));
  },

  /**
   * Sanitize input for safe SQL usage (parameterized queries recommended)
   */
  sanitize(input: string): string {
    if (typeof input !== 'string') return '';
    return input
      .replace(/'/g, "''")
      .replace(/\\/g, '\\\\')
      .replace(/\x00/g, '')
      .replace(/\x1a/g, '')
      .trim();
  },

  /**
   * Validate and return safe input or null
   */
  validate(input: string, maxLength = 1000): string | null {
    if (typeof input !== 'string') return null;
    if (input.length > maxLength) return null;
    if (this.containsInjection(input)) return null;
    return this.sanitize(input);
  }
};

// ============================================================================
// XSS PREVENTION
// ============================================================================

/**
 * XSS Attack Prevention
 * Comprehensive protection against cross-site scripting
 */
export const XSSGuard = {
  // HTML entities for encoding
  ENTITIES: {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  } as Record<string, string>,

  // XSS patterns to detect
  XSS_PATTERNS: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:/gi,
    /on\w+\s*=/gi,
    /expression\s*\(/gi,
    /<\s*img[^>]+\bonerror\s*=/gi,
    /<\s*svg[^>]+\bonload\s*=/gi,
    /document\.(cookie|domain|write)/gi,
    /window\.(location|open)/gi,
    /eval\s*\(/gi,
    /setTimeout\s*\(/gi,
    /setInterval\s*\(/gi,
    /Function\s*\(/gi,
  ],

  /**
   * Detect XSS patterns in input
   */
  containsXSS(input: string): boolean {
    if (typeof input !== 'string') return false;
    return this.XSS_PATTERNS.some(pattern => pattern.test(input));
  },

  /**
   * Encode HTML entities to prevent XSS
   */
  encodeHTML(input: string): string {
    if (typeof input !== 'string') return '';
    return input.replace(/[&<>"'`=/]/g, char => this.ENTITIES[char] || char);
  },

  /**
   * Strip all HTML tags from input
   */
  stripHTML(input: string): string {
    if (typeof input !== 'string') return '';
    return input
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  },

  /**
   * Sanitize for safe display (HTML encode + strip dangerous patterns)
   */
  sanitize(input: string): string {
    if (typeof input !== 'string') return '';
    let result = this.stripHTML(input);
    result = this.encodeHTML(result);
    return result.slice(0, 10000);
  }
};

// ============================================================================
// CSRF PROTECTION
// ============================================================================

/**
 * CSRF Token Management
 * Generate and validate CSRF tokens
 */
export const CSRFGuard = {
  TOKEN_HEADER: 'x-csrf-token',
  TOKEN_COOKIE: 'csrf_token',
  TOKEN_EXPIRY_MS: 3600000, // 1 hour

  /**
   * Generate a cryptographically secure CSRF token
   */
  async generateToken(): Promise<string> {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    return token;
  },

  /**
   * Create a signed token with timestamp
   */
  async createSignedToken(secret: string): Promise<string> {
    const token = await this.generateToken();
    const timestamp = Date.now();
    const data = `${token}:${timestamp}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
    const signatureHex = Array.from(new Uint8Array(signature), b => b.toString(16).padStart(2, '0')).join('');
    return `${data}:${signatureHex}`;
  },

  /**
   * Validate a signed CSRF token
   */
  async validateSignedToken(token: string, secret: string): Promise<boolean> {
    try {
      const parts = token.split(':');
      if (parts.length !== 3) return false;
      
      const [tokenPart, timestampStr, signature] = parts;
      const timestamp = parseInt(timestampStr, 10);
      
      // Check expiry
      if (Date.now() - timestamp > this.TOKEN_EXPIRY_MS) return false;
      
      // Verify signature
      const data = `${tokenPart}:${timestampStr}`;
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
      const expectedSig = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
      const expectedHex = Array.from(new Uint8Array(expectedSig), b => b.toString(16).padStart(2, '0')).join('');
      
      return signature === expectedHex;
    } catch {
      return false;
    }
  }
};

// ============================================================================
// AUTHENTICATION BYPASS PREVENTION
// ============================================================================

/**
 * Authentication Security
 * Prevent authentication bypass attacks
 */
export const AuthGuard = {
  // Minimum password requirements
  PASSWORD_MIN_LENGTH: 12,
  PASSWORD_REQUIREMENTS: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{12,}$/,

  /**
   * Validate token format (JWT structure)
   */
  isValidTokenFormat(token: string): boolean {
    if (typeof token !== 'string') return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
      // Validate each part is valid base64url
      parts.forEach(part => {
        const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
        atob(base64);
      });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Check for token manipulation attempts
   */
  detectTokenManipulation(token: string, originalToken?: string): boolean {
    if (!token || typeof token !== 'string') return true;
    
    // Check for alg: none attack
    try {
      const header = JSON.parse(atob(token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')));
      if (header.alg === 'none' || header.alg === 'None' || header.alg === 'NONE') {
        return true; // Manipulation detected
      }
    } catch {
      return true;
    }
    
    return false;
  },

  /**
   * Validate password strength
   */
  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < this.PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${this.PASSWORD_MIN_LENGTH} characters`);
    }
    if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letters');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letters');
    if (!/\d/.test(password)) errors.push('Password must contain numbers');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Password must contain special characters');
    
    return { valid: errors.length === 0, errors };
  },

  /**
   * Detect common password attack patterns
   */
  isCommonPassword(password: string): boolean {
    const common = [
      'password', '123456', 'qwerty', 'admin', 'letmein', 'welcome',
      'monkey', 'dragon', 'master', 'login', 'princess', 'solo'
    ];
    return common.some(p => password.toLowerCase().includes(p));
  }
};

// ============================================================================
// PRIVILEGE ESCALATION PREVENTION
// ============================================================================

/**
 * Role-Based Access Control Guard
 * Prevent privilege escalation attacks
 */
export const RBACGuard = {
  // Role hierarchy (higher number = more privileges)
  ROLE_HIERARCHY: {
    master: 110,
    super_admin: 100,
    admin: 90,
    finance_manager: 85,
    legal_compliance: 80,
    hr_manager: 75,
    performance_manager: 70,
    rnd_manager: 65,
    r_and_d: 65,
    marketing_manager: 60,
    demo_manager: 55,
    task_manager: 50,
    lead_manager: 45,
    seo_manager: 40,
    client_success: 35,
    ai_manager: 30,
    api_security: 28,
    support: 25,
    franchise: 20,
    reseller: 15,
    developer: 12,
    influencer: 10,
    prime: 8,
    client: 5,
  } as Record<string, number>,

  // Roles that can only be assigned by master or super_admin
  PROTECTED_ROLES: ['master', 'super_admin', 'admin', 'finance_manager', 'legal_compliance'],

  /**
   * Check if actor can assign a role to target
   */
  canAssignRole(actorRole: string, targetRole: string): boolean {
    const actorLevel = this.ROLE_HIERARCHY[actorRole] || 0;
    const targetLevel = this.ROLE_HIERARCHY[targetRole] || 0;
    
    // Can't assign roles equal or higher than own
    if (targetLevel >= actorLevel) return false;
    
    // Only super_admin can assign protected roles
    if (this.PROTECTED_ROLES.includes(targetRole) && actorRole !== 'super_admin') {
      return false;
    }
    
    return true;
  },

  /**
   * Check if role change is a privilege escalation
   */
  isPrivilegeEscalation(currentRole: string, newRole: string): boolean {
    const currentLevel = this.ROLE_HIERARCHY[currentRole] || 0;
    const newLevel = this.ROLE_HIERARCHY[newRole] || 0;
    return newLevel > currentLevel;
  },

  /**
   * Validate role-based action
   */
  validateAction(userRole: string, requiredRoles: string[]): boolean {
    const userLevel = this.ROLE_HIERARCHY[userRole] || 0;
    return requiredRoles.some(role => {
      const requiredLevel = this.ROLE_HIERARCHY[role] || 0;
      return userLevel >= requiredLevel || userRole === role;
    });
  }
};

// ============================================================================
// SESSION/TOKEN HIJACKING PREVENTION
// ============================================================================

/**
 * Session Security
 * Prevent session hijacking and token theft
 */
export const SessionGuard = {
  /**
   * Generate a secure session fingerprint
   */
  async generateFingerprint(userAgent: string, ip: string, additionalData?: string): Promise<string> {
    const data = `${userAgent}|${ip}|${additionalData || ''}`;
    const encoder = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Validate session fingerprint matches
   */
  async validateFingerprint(
    storedFingerprint: string,
    currentUserAgent: string,
    currentIP: string,
    additionalData?: string
  ): Promise<boolean> {
    const currentFingerprint = await this.generateFingerprint(currentUserAgent, currentIP, additionalData);
    return storedFingerprint === currentFingerprint;
  },

  /**
   * Check for suspicious session activity
   */
  detectSuspiciousActivity(
    lastIP: string,
    currentIP: string,
    lastActivity: number,
    loginTime: number
  ): { suspicious: boolean; reason?: string } {
    // IP changed within session
    if (lastIP !== currentIP) {
      return { suspicious: true, reason: 'IP address changed during session' };
    }
    
    // Session reused after long inactivity
    const hoursSinceActivity = (Date.now() - lastActivity) / (1000 * 60 * 60);
    if (hoursSinceActivity > 24) {
      return { suspicious: true, reason: 'Session reactivated after long inactivity' };
    }
    
    return { suspicious: false };
  }
};

// ============================================================================
// API REPLAY ATTACK PREVENTION
// ============================================================================

/**
 * Replay Attack Prevention
 * Using nonce and timestamp validation
 */
export const ReplayGuard = {
  NONCE_EXPIRY_MS: 300000, // 5 minutes
  REQUEST_WINDOW_MS: 60000, // 1 minute

  // In-memory nonce store (should use Redis/DB in production)
  usedNonces: new Map<string, number>(),

  /**
   * Generate a unique nonce
   */
  async generateNonce(): Promise<string> {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Validate request timestamp and nonce
   */
  validateRequest(nonce: string, timestamp: number): { valid: boolean; error?: string } {
    const now = Date.now();
    
    // Check timestamp is within acceptable window
    if (Math.abs(now - timestamp) > this.REQUEST_WINDOW_MS) {
      return { valid: false, error: 'Request timestamp outside acceptable window' };
    }
    
    // Check nonce hasn't been used
    if (this.usedNonces.has(nonce)) {
      return { valid: false, error: 'Request nonce already used (replay detected)' };
    }
    
    // Store nonce
    this.usedNonces.set(nonce, now);
    
    // Cleanup old nonces
    this.cleanupNonces();
    
    return { valid: true };
  },

  /**
   * Cleanup expired nonces
   */
  cleanupNonces(): void {
    const now = Date.now();
    for (const [nonce, time] of this.usedNonces.entries()) {
      if (now - time > this.NONCE_EXPIRY_MS) {
        this.usedNonces.delete(nonce);
      }
    }
  },

  /**
   * Create a signed request payload
   */
  async signRequest(payload: object, secret: string): Promise<{ signature: string; timestamp: number; nonce: string }> {
    const timestamp = Date.now();
    const nonce = await this.generateNonce();
    const data = JSON.stringify({ ...payload, timestamp, nonce });
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
    
    return {
      signature: Array.from(new Uint8Array(signature), b => b.toString(16).padStart(2, '0')).join(''),
      timestamp,
      nonce
    };
  }
};

// ============================================================================
// HEADER MANIPULATION PREVENTION
// ============================================================================

/**
 * Header Security
 * Validate and sanitize HTTP headers
 */
export const HeaderGuard = {
  // Required security headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  } as Record<string, string>,

  /**
   * Validate header value for injection
   */
  isValidHeaderValue(value: string): boolean {
    if (typeof value !== 'string') return false;
    // Check for CRLF injection
    if (/[\r\n]/.test(value)) return false;
    // Check for null bytes
    if (/\x00/.test(value)) return false;
    return true;
  },

  /**
   * Sanitize header value
   */
  sanitizeHeaderValue(value: string): string {
    if (typeof value !== 'string') return '';
    return value
      .replace(/[\r\n]/g, '')
      .replace(/\x00/g, '')
      .trim();
  },

  /**
   * Get all security headers
   */
  getSecurityHeaders(): Record<string, string> {
    return { ...this.SECURITY_HEADERS };
  },

  /**
   * Validate Host header to prevent host header injection
   */
  validateHostHeader(hostHeader: string, allowedHosts: string[]): boolean {
    if (!hostHeader) return false;
    const host = hostHeader.split(':')[0].toLowerCase();
    return allowedHosts.some(allowed => host === allowed.toLowerCase());
  }
};

// ============================================================================
// BRUTE FORCE PROTECTION
// ============================================================================

/**
 * Brute Force Attack Prevention
 * Progressive lockout and monitoring
 */
export const BruteForceGuard = {
  // Lockout configuration
  MAX_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 900000, // 15 minutes
  PROGRESSIVE_LOCKOUT: [60000, 300000, 900000, 3600000], // 1min, 5min, 15min, 1hr

  // In-memory attempt tracking
  attempts: new Map<string, { count: number; lastAttempt: number; lockouts: number }>(),

  /**
   * Record a failed attempt
   */
  recordFailedAttempt(identifier: string): { locked: boolean; lockDuration?: number; attemptsRemaining?: number } {
    const now = Date.now();
    let record = this.attempts.get(identifier);
    
    if (!record) {
      record = { count: 0, lastAttempt: now, lockouts: 0 };
    }
    
    // Reset if last attempt was long ago
    if (now - record.lastAttempt > this.LOCKOUT_DURATION_MS) {
      record.count = 0;
    }
    
    record.count++;
    record.lastAttempt = now;
    
    if (record.count >= this.MAX_ATTEMPTS) {
      record.lockouts++;
      const lockDuration = this.PROGRESSIVE_LOCKOUT[
        Math.min(record.lockouts - 1, this.PROGRESSIVE_LOCKOUT.length - 1)
      ];
      this.attempts.set(identifier, record);
      return { locked: true, lockDuration };
    }
    
    this.attempts.set(identifier, record);
    return { locked: false, attemptsRemaining: this.MAX_ATTEMPTS - record.count };
  },

  /**
   * Check if identifier is currently locked
   */
  isLocked(identifier: string): { locked: boolean; unlockIn?: number } {
    const record = this.attempts.get(identifier);
    if (!record || record.count < this.MAX_ATTEMPTS) {
      return { locked: false };
    }
    
    const lockDuration = this.PROGRESSIVE_LOCKOUT[
      Math.min(record.lockouts - 1, this.PROGRESSIVE_LOCKOUT.length - 1)
    ];
    const unlockTime = record.lastAttempt + lockDuration;
    
    if (Date.now() >= unlockTime) {
      // Reset after lockout
      record.count = 0;
      this.attempts.set(identifier, record);
      return { locked: false };
    }
    
    return { locked: true, unlockIn: unlockTime - Date.now() };
  },

  /**
   * Record a successful attempt (reset counter)
   */
  recordSuccess(identifier: string): void {
    const record = this.attempts.get(identifier);
    if (record) {
      record.count = 0;
      this.attempts.set(identifier, record);
    }
  },

  /**
   * Clear all records for an identifier
   */
  clearRecords(identifier: string): void {
    this.attempts.delete(identifier);
  }
};

// ============================================================================
// WEBSOCKET SECURITY
// ============================================================================

/**
 * WebSocket Security
 * Validate and sanitize WebSocket messages
 */
export const WebSocketGuard = {
  // Maximum message sizes
  MAX_MESSAGE_SIZE: 65536, // 64KB
  MAX_MESSAGES_PER_MINUTE: 120,

  // Message tracking
  messageRates: new Map<string, { count: number; windowStart: number }>(),

  /**
   * Validate WebSocket message
   */
  validateMessage(message: string): { valid: boolean; error?: string } {
    if (typeof message !== 'string') {
      return { valid: false, error: 'Message must be a string' };
    }
    
    if (message.length > this.MAX_MESSAGE_SIZE) {
      return { valid: false, error: 'Message exceeds maximum size' };
    }
    
    // Check for injection attempts
    if (SQLInjectionGuard.containsInjection(message)) {
      return { valid: false, error: 'Suspicious content detected' };
    }
    
    if (XSSGuard.containsXSS(message)) {
      return { valid: false, error: 'Potentially malicious content detected' };
    }
    
    return { valid: true };
  },

  /**
   * Parse and validate JSON message
   */
  parseMessage(message: string): { valid: boolean; data?: any; error?: string } {
    const validation = this.validateMessage(message);
    if (!validation.valid) {
      return { valid: false, error: validation.error };
    }
    
    try {
      const data = JSON.parse(message);
      return { valid: true, data };
    } catch {
      return { valid: false, error: 'Invalid JSON' };
    }
  },

  /**
   * Check message rate limit
   */
  checkRateLimit(connectionId: string): { allowed: boolean; remaining?: number } {
    const now = Date.now();
    let record = this.messageRates.get(connectionId);
    
    if (!record || now - record.windowStart > 60000) {
      record = { count: 0, windowStart: now };
    }
    
    record.count++;
    this.messageRates.set(connectionId, record);
    
    if (record.count > this.MAX_MESSAGES_PER_MINUTE) {
      return { allowed: false };
    }
    
    return { allowed: true, remaining: this.MAX_MESSAGES_PER_MINUTE - record.count };
  },

  /**
   * Sanitize message content for safe broadcast
   */
  sanitizeForBroadcast(message: any): any {
    if (typeof message === 'string') {
      return XSSGuard.sanitize(message);
    }
    
    if (typeof message === 'object' && message !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(message)) {
        if (typeof value === 'string') {
          sanitized[XSSGuard.stripHTML(key)] = XSSGuard.sanitize(value);
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = this.sanitizeForBroadcast(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    }
    
    return message;
  }
};

// ============================================================================
// FILE UPLOAD SECURITY
// ============================================================================

/**
 * File Upload Security
 * Validate and sanitize file uploads
 */
export const FileUploadGuard = {
  // Allowed file types by category
  ALLOWED_TYPES: {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    spreadsheet: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  } as Record<string, string[]>,

  // Dangerous file extensions
  DANGEROUS_EXTENSIONS: [
    '.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.js', '.jar', '.msi',
    '.dll', '.scr', '.com', '.pif', '.application', '.gadget', '.hta',
    '.cpl', '.msc', '.wsf', '.lnk', '.reg', '.php', '.asp', '.aspx',
    '.jsp', '.cgi', '.pl', '.py', '.rb', '.htaccess', '.svg'
  ],

  // Max file sizes by category (in bytes)
  MAX_SIZES: {
    image: 5 * 1024 * 1024, // 5MB
    document: 10 * 1024 * 1024, // 10MB
    spreadsheet: 10 * 1024 * 1024, // 10MB
  } as Record<string, number>,

  /**
   * Validate file upload
   */
  validate(
    filename: string,
    mimeType: string,
    size: number,
    category: string
  ): { valid: boolean; error?: string } {
    // Check file extension
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    if (this.DANGEROUS_EXTENSIONS.includes(ext)) {
      return { valid: false, error: 'File type not allowed' };
    }
    
    // Check MIME type
    const allowedTypes = this.ALLOWED_TYPES[category];
    if (!allowedTypes || !allowedTypes.includes(mimeType)) {
      return { valid: false, error: 'File type not allowed for this category' };
    }
    
    // Check size
    const maxSize = this.MAX_SIZES[category];
    if (maxSize && size > maxSize) {
      return { valid: false, error: `File exceeds maximum size of ${maxSize / 1024 / 1024}MB` };
    }
    
    return { valid: true };
  },

  /**
   * Sanitize filename
   */
  sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\.+/g, '.')
      .substring(0, 255);
  },

  /**
   * Generate a safe storage path
   */
  generateSafePath(filename: string, userId: string): string {
    const sanitized = this.sanitizeFilename(filename);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${userId}/${timestamp}_${random}_${sanitized}`;
  }
};

// ============================================================================
// COMPREHENSIVE SECURITY VALIDATOR
// ============================================================================

/**
 * Main Security Validator
 * Combine all security checks for comprehensive validation
 */
export const SecurityValidator = {
  /**
   * Validate all input parameters
   */
  validateInput(input: string, options: {
    checkSQL?: boolean;
    checkXSS?: boolean;
    maxLength?: number;
    allowHTML?: boolean;
  } = {}): { valid: boolean; sanitized: string; errors: string[] } {
    const errors: string[] = [];
    let sanitized = input;
    
    if (typeof input !== 'string') {
      return { valid: false, sanitized: '', errors: ['Input must be a string'] };
    }
    
    // Length check
    if (options.maxLength && input.length > options.maxLength) {
      errors.push(`Input exceeds maximum length of ${options.maxLength}`);
      sanitized = input.slice(0, options.maxLength);
    }
    
    // SQL injection check
    if (options.checkSQL !== false && SQLInjectionGuard.containsInjection(input)) {
      errors.push('Potential SQL injection detected');
      sanitized = SQLInjectionGuard.sanitize(sanitized);
    }
    
    // XSS check
    if (options.checkXSS !== false && XSSGuard.containsXSS(input)) {
      errors.push('Potential XSS attack detected');
      sanitized = options.allowHTML ? XSSGuard.encodeHTML(sanitized) : XSSGuard.stripHTML(sanitized);
    }
    
    return {
      valid: errors.length === 0,
      sanitized,
      errors
    };
  },

  /**
   * Validate API request
   */
  async validateAPIRequest(req: Request, options: {
    requireAuth?: boolean;
    checkCSRF?: boolean;
    checkReplay?: boolean;
    csrfSecret?: string;
  } = {}): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    // Validate headers
    const host = req.headers.get('host');
    if (host && !HeaderGuard.isValidHeaderValue(host)) {
      errors.push('Invalid host header');
    }
    
    // Check CSRF token if required
    if (options.checkCSRF && options.csrfSecret) {
      const csrfToken = req.headers.get(CSRFGuard.TOKEN_HEADER);
      if (!csrfToken) {
        errors.push('Missing CSRF token');
      } else if (!(await CSRFGuard.validateSignedToken(csrfToken, options.csrfSecret))) {
        errors.push('Invalid CSRF token');
      }
    }
    
    // Check for replay attacks
    if (options.checkReplay) {
      const nonce = req.headers.get('x-request-nonce');
      const timestampStr = req.headers.get('x-request-timestamp');
      
      if (nonce && timestampStr) {
        const timestamp = parseInt(timestampStr, 10);
        const replayCheck = ReplayGuard.validateRequest(nonce, timestamp);
        if (!replayCheck.valid) {
          errors.push(replayCheck.error || 'Replay attack detected');
        }
      }
    }
    
    return { valid: errors.length === 0, errors };
  },

  /**
   * Get comprehensive security headers
   */
  getSecurityHeaders(): Record<string, string> {
    return HeaderGuard.getSecurityHeaders();
  }
};
