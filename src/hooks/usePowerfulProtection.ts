import { useEffect, useCallback, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SecurityThreat {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  timestamp: Date;
}

interface ProtectionState {
  isActive: boolean;
  threatsBlocked: number;
  lastThreat: SecurityThreat | null;
  sessionIntegrity: boolean;
  deviceTrusted: boolean;
}

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;
const SUSPICIOUS_PATTERNS = [
  /eval\s*\(/gi,
  /javascript:/gi,
  /<script/gi,
  /document\.cookie/gi,
  /window\.location/gi,
  /\.innerHTML\s*=/gi,
  /fromCharCode/gi,
  /atob\s*\(/gi,
  /btoa\s*\(/gi,
];

export function usePowerfulProtection() {
  const [protection, setProtection] = useState<ProtectionState>({
    isActive: true,
    threatsBlocked: 0,
    lastThreat: null,
    sessionIntegrity: true,
    deviceTrusted: true,
  });
  
  const requestCountRef = useRef<number>(0);
  const windowStartRef = useRef<number>(Date.now());
  const fingerprintRef = useRef<string>('');
  
  // Generate device fingerprint
  const generateFingerprint = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0,
      canvas.toDataURL(),
    ].join('|');
    
    return btoa(fingerprint).slice(0, 32);
  }, []);

  // Rate limiting check
  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    
    if (now - windowStartRef.current > RATE_LIMIT_WINDOW) {
      windowStartRef.current = now;
      requestCountRef.current = 0;
    }
    
    requestCountRef.current++;
    
    if (requestCountRef.current > MAX_REQUESTS_PER_WINDOW) {
      logThreat({
        type: 'rate_limit_exceeded',
        severity: 'high',
        details: { requests: requestCountRef.current, window: RATE_LIMIT_WINDOW },
        timestamp: new Date(),
      });
      return false;
    }
    
    return true;
  }, []);

  // Input sanitization
  const sanitizeInput = useCallback((input: string): string => {
    if (typeof input !== 'string') return '';
    
    // Check for suspicious patterns
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(input)) {
        logThreat({
          type: 'xss_attempt',
          severity: 'critical',
          details: { pattern: pattern.toString(), input: input.slice(0, 100) },
          timestamp: new Date(),
        });
        return '';
      }
    }
    
    // HTML encode
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .slice(0, 10000);
  }, []);

  // Log security threat
  const logThreat = useCallback(async (threat: SecurityThreat) => {
    setProtection(prev => ({
      ...prev,
      threatsBlocked: prev.threatsBlocked + 1,
      lastThreat: threat,
    }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        module: 'security_protection',
        action: `threat_blocked_${threat.type}`,
        meta_json: {
          severity: threat.severity,
          details: threat.details,
          device_fingerprint: fingerprintRef.current,
          timestamp: threat.timestamp.toISOString(),
        }
      });

      if (threat.severity === 'critical') {
        toast.error('Security Alert', {
          description: 'A potential security threat was blocked.',
        });
      }
    } catch (err) {
      console.error('Failed to log threat:', err);
    }
  }, []);

  // Verify session integrity
  const verifySession = useCallback(async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setProtection(prev => ({ ...prev, sessionIntegrity: false }));
        return false;
      }

      // Check if session token is valid (use expires_at instead of created_at)
      const expiresAt = session.expires_at ? session.expires_at * 1000 : Date.now() + 86400000;
      
      if (Date.now() > expiresAt) {
        logThreat({
          type: 'session_expired',
          severity: 'medium',
          details: { expiresAt },
          timestamp: new Date(),
        });
        return false;
      }

      // Verify device fingerprint consistency
      const currentFingerprint = generateFingerprint();
      const storedFingerprint = sessionStorage.getItem('device_fingerprint');
      
      if (storedFingerprint && storedFingerprint !== currentFingerprint) {
        logThreat({
          type: 'device_fingerprint_mismatch',
          severity: 'high',
          details: { stored: storedFingerprint.slice(0, 8), current: currentFingerprint.slice(0, 8) },
          timestamp: new Date(),
        });
        setProtection(prev => ({ ...prev, deviceTrusted: false }));
        return false;
      }

      setProtection(prev => ({ ...prev, sessionIntegrity: true }));
      return true;
    } catch (err) {
      console.error('Session verification failed:', err);
      return false;
    }
  }, [generateFingerprint, logThreat]);

  // Block copy/paste of sensitive data
  const blockSensitiveCopy = useCallback((e: ClipboardEvent) => {
    const selection = window.getSelection()?.toString() || '';
    
    // Block copying of sensitive patterns (like tokens, keys)
    const sensitivePatterns = [
      /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, // JWT
      /sk_live_[A-Za-z0-9]+/g, // Stripe keys
      /[A-Za-z0-9]{40}/g, // API keys
    ];
    
    for (const pattern of sensitivePatterns) {
      if (pattern.test(selection)) {
        e.preventDefault();
        logThreat({
          type: 'sensitive_data_copy_blocked',
          severity: 'medium',
          details: { pattern: pattern.toString() },
          timestamp: new Date(),
        });
        toast.warning('Copy blocked', {
          description: 'Copying sensitive data is not allowed.',
        });
        return;
      }
    }
  }, [logThreat]);

  // Detect automation/bot behavior
  const detectBotBehavior = useCallback(() => {
    const indicators: string[] = [];
    
    // Check for webdriver
    if ((navigator as any).webdriver) {
      indicators.push('webdriver_detected');
    }
    
    // Check for automation frameworks
    if ((window as any).callPhantom || (window as any)._phantom) {
      indicators.push('phantom_detected');
    }
    
    if ((window as any).__nightmare) {
      indicators.push('nightmare_detected');
    }
    
    // Check for missing features that real browsers have
    const windowWithChrome = window as Window & { chrome?: unknown };
    if (!windowWithChrome.chrome && navigator.userAgent.includes('Chrome')) {
      indicators.push('fake_chrome_detected');
    }
    
    if (indicators.length > 0) {
      logThreat({
        type: 'bot_detected',
        severity: 'critical',
        details: { indicators },
        timestamp: new Date(),
      });
      return true;
    }
    
    return false;
  }, [logThreat]);

  // Initialize protection
  useEffect(() => {
    fingerprintRef.current = generateFingerprint();
    
    // Store fingerprint for session
    const existingFingerprint = sessionStorage.getItem('device_fingerprint');
    if (!existingFingerprint) {
      sessionStorage.setItem('device_fingerprint', fingerprintRef.current);
    }
    
    // Setup copy protection
    document.addEventListener('copy', blockSensitiveCopy);
    
    // Detect bot on load
    detectBotBehavior();
    
    // Periodic session verification
    const interval = setInterval(() => {
      verifySession();
    }, 60000); // Every minute
    
    // Initial verification
    verifySession();
    
    return () => {
      document.removeEventListener('copy', blockSensitiveCopy);
      clearInterval(interval);
    };
  }, [generateFingerprint, blockSensitiveCopy, detectBotBehavior, verifySession]);

  // Secure action wrapper
  const executeSecurely = useCallback(async <T,>(
    action: () => Promise<T>,
    options: { requireRateLimit?: boolean; requireSession?: boolean } = {}
  ): Promise<T | null> => {
    const { requireRateLimit = true, requireSession = true } = options;
    
    if (requireRateLimit && !checkRateLimit()) {
      toast.error('Too many requests', {
        description: 'Please wait before trying again.',
      });
      return null;
    }
    
    if (requireSession) {
      const sessionValid = await verifySession();
      if (!sessionValid) {
        toast.error('Session invalid', {
          description: 'Please log in again.',
        });
        return null;
      }
    }
    
    try {
      return await action();
    } catch (err) {
      console.error('Secure action failed:', err);
      throw err;
    }
  }, [checkRateLimit, verifySession]);

  return {
    protection,
    sanitizeInput,
    checkRateLimit,
    verifySession,
    executeSecurely,
    logThreat,
    isProtected: protection.isActive && protection.sessionIntegrity,
  };
}
