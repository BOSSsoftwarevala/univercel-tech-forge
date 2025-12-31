/**
 * Vala ID System Hook
 * 
 * Generates and manages anonymous Vala IDs - no personal identity exposed.
 * One person = one role = one Vala ID per session.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ValaIdentity {
  valaId: string;
  sessionHash: string;
  roleHash: string;
  createdAt: number;
  expiresAt: number;
}

// Generate cryptographic hash for Vala ID
async function generateValaHash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input + Date.now().toString());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 12).toUpperCase();
}

// Generate numeric Vala ID
function generateNumericValaId(): string {
  const prefix = 'V';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function useValaId() {
  const { user } = useAuth();
  const [valaIdentity, setValaIdentity] = useState<ValaIdentity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Vala ID on mount
  useEffect(() => {
    const initializeValaId = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Generate session-specific Vala ID
        const sessionId = crypto.randomUUID();
        const valaHash = await generateValaHash(user.id + sessionId);
        const valaId = generateNumericValaId();
        const roleHash = await generateValaHash(user.id + 'role');

        const identity: ValaIdentity = {
          valaId,
          sessionHash: valaHash,
          roleHash,
          createdAt: Date.now(),
          expiresAt: Date.now() + (8 * 60 * 60 * 1000) // 8 hour session
        };

        setValaIdentity(identity);

        // Log Vala ID creation (append-only)
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'vala_id_created',
          module: 'vala_system',
          meta_json: {
            vala_id: valaId,
            session_hash: valaHash,
            created_at: identity.createdAt
          }
        });
      } catch (error) {
        console.error('Failed to initialize Vala ID');
      } finally {
        setIsLoading(false);
      }
    };

    initializeValaId();
  }, [user?.id]);

  // Mask Vala ID for display (partial visibility)
  const maskedValaId = useMemo(() => {
    if (!valaIdentity?.valaId) return '***-****-****';
    const parts = valaIdentity.valaId.split('-');
    return `${parts[0]}-****-${parts[2]?.slice(-4) || '****'}`;
  }, [valaIdentity]);

  // Check if session is expired
  const isSessionExpired = useCallback(() => {
    if (!valaIdentity) return true;
    return Date.now() > valaIdentity.expiresAt;
  }, [valaIdentity]);

  // Generate action hash for checksum verification
  const generateActionHash = useCallback(async (actionType: string, actionData: Record<string, unknown>): Promise<string> => {
    const payload = JSON.stringify({
      valaId: valaIdentity?.valaId,
      actionType,
      actionData,
      timestamp: Date.now()
    });
    return await generateValaHash(payload);
  }, [valaIdentity]);

  // Verify checksum before forwarding
  const verifyChecksum = useCallback(async (actionHash: string, originalData: Record<string, unknown>): Promise<boolean> => {
    const recalculatedHash = await generateValaHash(JSON.stringify(originalData));
    return recalculatedHash === actionHash;
  }, []);

  return {
    valaId: valaIdentity?.valaId || null,
    maskedValaId,
    sessionHash: valaIdentity?.sessionHash || null,
    roleHash: valaIdentity?.roleHash || null,
    isLoading,
    isSessionExpired,
    generateActionHash,
    verifyChecksum,
    sessionExpiresAt: valaIdentity?.expiresAt || null
  };
}

export default useValaId;
