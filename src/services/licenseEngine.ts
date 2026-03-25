// License Engine Service
// Handles license validation, device binding, and activation

import { supabase } from '@/integrations/supabase/client';

export interface LicenseInfo {
  id: string;
  license_key: string;
  license_type: string;
  status: string;
  max_installations: number;
  current_installations: number;
  expires_at: string | null;
  activated_at: string | null;
  product_id: string;
}

export interface DeviceBinding {
  id: string;
  license_id: string;
  device_fingerprint: string;
  device_name: string | null;
  device_type: string;
  is_active: boolean;
  bound_at: string;
  last_seen_at: string;
}

class LicenseEngine {
  /**
   * Generate a device fingerprint from browser info
   */
  generateDeviceFingerprint(): string {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 'unknown',
    ];
    
    // Simple hash
    let hash = 0;
    const str = components.join('|');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'DEV-' + Math.abs(hash).toString(36).toUpperCase();
  }

  /**
   * Validate a license key
   */
  async validateLicense(licenseKey: string): Promise<{ valid: boolean; license?: LicenseInfo; error?: string }> {
    const { data, error } = await (supabase as any)
      .from('user_licenses')
      .select('*')
      .eq('license_key', licenseKey)
      .single();

    if (error || !data) {
      return { valid: false, error: 'License key not found' };
    }

    if (data.status !== 'active') {
      return { valid: false, error: `License is ${data.status}` };
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { valid: false, error: 'License has expired' };
    }

    return { valid: true, license: data };
  }

  /**
   * Bind a device to a license
   */
  async bindDevice(licenseId: string, deviceName?: string): Promise<{ success: boolean; error?: string }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const fingerprint = this.generateDeviceFingerprint();

    // Check if already bound
    const { data: existing } = await (supabase as any)
      .from('device_bindings')
      .select('id')
      .eq('license_id', licenseId)
      .eq('device_fingerprint', fingerprint)
      .eq('is_active', true)
      .maybeSingle();

    if (existing) {
      // Update last_seen
      await (supabase as any)
        .from('device_bindings')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', existing.id);
      return { success: true };
    }

    // Check installation limit
    const { data: license } = await (supabase as any)
      .from('user_licenses')
      .select('max_installations, current_installations')
      .eq('id', licenseId)
      .single();

    if (license && license.current_installations >= license.max_installations) {
      return { success: false, error: `Maximum ${license.max_installations} devices allowed` };
    }

    // Bind device
    const { error } = await (supabase as any)
      .from('device_bindings')
      .insert({
        license_id: licenseId,
        user_id: user.id,
        device_fingerprint: fingerprint,
        device_name: deviceName || `${navigator.platform} Device`,
        device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        os_info: navigator.platform,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Increment installation count
    await (supabase as any)
      .from('user_licenses')
      .update({ current_installations: (license?.current_installations || 0) + 1 })
      .eq('id', licenseId);

    return { success: true };
  }

  /**
   * Unbind a device from a license
   */
  async unbindDevice(bindingId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await (supabase as any)
      .from('device_bindings')
      .update({ is_active: false, unbound_at: new Date().toISOString() })
      .eq('id', bindingId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  /**
   * Get all devices for a license
   */
  async getDeviceBindings(licenseId: string): Promise<DeviceBinding[]> {
    const { data } = await (supabase as any)
      .from('device_bindings')
      .select('*')
      .eq('license_id', licenseId)
      .eq('is_active', true)
      .order('bound_at', { ascending: false });

    return data || [];
  }

  /**
   * Get all licenses for current user
   */
  async getUserLicenses(): Promise<LicenseInfo[]> {
    const { data } = await (supabase as any)
      .from('user_licenses')
      .select('*')
      .order('created_at', { ascending: false });

    return data || [];
  }
}

export const licenseEngine = new LicenseEngine();
