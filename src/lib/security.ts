// ==============================================
// Security Utilities
// ==============================================
// This module handles IP lock, device binding,
// session security, and fraud detection.

import { supabase } from '@/integrations/supabase/client';

export interface DeviceInfo {
  fingerprint: string;
  userAgent: string;
  platform: string;
  language: string;
  timezone: string;
  screenResolution: string;
  colorDepth: number;
  hardwareConcurrency: number;
}

export interface GeoLocation {
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  timezone: string;
}

export interface SecurityCheckResult {
  allowed: boolean;
  reason?: string;
  requiresVerification?: boolean;
  riskScore?: number;
}

// Generate device fingerprint
export async function generateDeviceFingerprint(): Promise<string> {
  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset().toString(),
    `${screen.width}x${screen.height}`,
    screen.colorDepth.toString(),
    navigator.hardwareConcurrency?.toString() || 'unknown',
    navigator.platform,
    getCanvasFingerprint(),
  ];

  const data = components.join('|');
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Canvas fingerprint for additional uniqueness
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('fingerprint', 2, 2);
      return canvas.toDataURL().slice(-50);
    }
  } catch {
    return 'canvas-not-available';
  }
  return 'canvas-error';
}

// Get device info
export function getDeviceInfo(): Partial<DeviceInfo> {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
  };
}

// Get geo location from IP
export async function getGeoLocation(): Promise<GeoLocation | null> {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      ip: data.ip,
      country: data.country_name,
      countryCode: data.country_code,
      city: data.city,
      region: data.region,
      timezone: data.timezone,
    };
  } catch {
    return null;
  }
}

// Check IP lock status
export async function checkIPLock(userId: string, ipAddress: string, deviceId: string): Promise<SecurityCheckResult> {
  try {
    const { data, error } = await supabase
      .from('ip_locks')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      console.error('IP lock check error:', error);
      return { allowed: true }; // Allow on error to prevent lockout
    }

    if (!data) {
      // No lock exists - create one (first login)
      return { allowed: true };
    }

    // Check if IP and device match
    const ipMatch = data.ip === ipAddress;
    const deviceMatch = data.device === deviceId;

    if (!ipMatch && !deviceMatch) {
      return {
        allowed: false,
        reason: 'Access from unrecognized device and IP. Please contact support.',
        requiresVerification: true,
        riskScore: 80,
      };
    }

    if (!ipMatch) {
      return {
        allowed: false,
        reason: 'Access from new IP address. Verification required.',
        requiresVerification: true,
        riskScore: 60,
      };
    }

    if (!deviceMatch) {
      return {
        allowed: false,
        reason: 'Access from new device. Verification required.',
        requiresVerification: true,
        riskScore: 50,
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('IP lock check failed:', error);
    return { allowed: true }; // Allow on error
  }
}

// Create or update IP lock
export async function createIPLock(userId: string, ipAddress: string, deviceId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('ip_locks')
      .upsert({
        user_id: userId,
        ip: ipAddress,
        device: deviceId,
        status: 'active',
      }, {
        onConflict: 'user_id',
      });

    return !error;
  } catch {
    return false;
  }
}

// Log security event
export async function logSecurityEvent(
  userId: string | null,
  eventType: string,
  metadata: Record<string, any>
): Promise<void> {
  try {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      module: 'security',
      action: eventType,
      meta_json: metadata,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

// Screenshot prevention
export function preventScreenshots(): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Block PrintScreen
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      return false;
    }
    // Block Cmd+Shift+3/4 (Mac screenshots)
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === '3' || e.key === '4')) {
      e.preventDefault();
      return false;
    }
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      // User switched tabs/apps - potential screenshot attempt
      logSecurityEvent(null, 'visibility_change', {
        hidden: true,
        timestamp: new Date().toISOString(),
      });
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('contextmenu', handleContextMenu);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}

// Block dev tools inspection
export function blockDevTools(): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Block F12
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    // Block Ctrl+Shift+I (Inspect)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }
    // Block Ctrl+Shift+J (Console)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      return false;
    }
    // Block Ctrl+U (View Source)
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault();
      return false;
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}

// Generate OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP securely in session
export function storeOTP(otp: string, expiryMs = 300000): void {
  sessionStorage.setItem('pending_otp', otp);
  sessionStorage.setItem('otp_expires', (Date.now() + expiryMs).toString());
}

// Verify OTP
export function verifyOTP(input: string): boolean {
  const stored = sessionStorage.getItem('pending_otp');
  const expires = sessionStorage.getItem('otp_expires');
  
  if (!stored || !expires) return false;
  if (Date.now() > parseInt(expires, 10)) {
    sessionStorage.removeItem('pending_otp');
    sessionStorage.removeItem('otp_expires');
    return false;
  }
  
  const valid = input === stored;
  if (valid) {
    sessionStorage.removeItem('pending_otp');
    sessionStorage.removeItem('otp_expires');
  }
  return valid;
}

// Calculate risk score based on multiple factors
export function calculateRiskScore(factors: {
  newDevice?: boolean;
  newIP?: boolean;
  vpnDetected?: boolean;
  unusualTime?: boolean;
  failedAttempts?: number;
  suspiciousPattern?: boolean;
}): number {
  let score = 0;
  
  if (factors.newDevice) score += 25;
  if (factors.newIP) score += 20;
  if (factors.vpnDetected) score += 15;
  if (factors.unusualTime) score += 10;
  if (factors.failedAttempts) score += Math.min(factors.failedAttempts * 5, 30);
  if (factors.suspiciousPattern) score += 20;
  
  return Math.min(score, 100);
}
