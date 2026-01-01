/**
 * Encrypted Vault Hook
 * 
 * Provides end-to-end encryption for sensitive data storage.
 * Data is encrypted client-side before being sent to the server.
 */

import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cryptoEngine, EncryptedData } from '@/lib/crypto/CryptoEngine';

interface VaultEntry {
  id: string;
  dataType: string;
  accessLevel: 'owner_only' | 'role_based' | 'shared';
  createdAt: string;
  accessCount: number;
  lastAccessedAt: string | null;
}

interface DecryptedVaultEntry extends VaultEntry {
  decryptedData: unknown;
}

export function useEncryptedVault() {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [entries, setEntries] = useState<VaultEntry[]>([]);

  /**
   * Derive encryption key from user-specific data
   * In production, this should be a proper key derivation
   */
  const deriveUserKey = useCallback(async (): Promise<string> => {
    if (!user?.id) throw new Error('User not authenticated');
    
    const fingerprint = await cryptoEngine.generateDeviceFingerprint();
    return await cryptoEngine.hash(user.id + fingerprint);
  }, [user?.id]);

  /**
   * Store encrypted data in vault
   */
  const storeSecure = useCallback(async (
    dataType: string,
    data: unknown,
    accessLevel: 'owner_only' | 'role_based' | 'shared' = 'owner_only',
    allowedRoles?: string[]
  ): Promise<string | null> => {
    if (!user?.id) return null;
    setIsProcessing(true);

    try {
      // Derive encryption key
      const encryptionKey = await deriveUserKey();
      
      // Encrypt data client-side
      const plaintext = JSON.stringify(data);
      const encrypted = await cryptoEngine.encrypt(plaintext, encryptionKey);
      
      // Store in database
      const { data: result, error } = await supabase
        .from('encrypted_vault')
        .insert({
          owner_id: user.id,
          data_type: dataType,
          encrypted_data: encrypted.ciphertext,
          encryption_key_hash: await cryptoEngine.hash(encryptionKey),
          iv: encrypted.iv,
          auth_tag: encrypted.salt, // Using salt as auth tag placeholder
          access_level: accessLevel,
          allowed_roles: allowedRoles || []
        })
        .select('id')
        .single();

      if (error) throw error;

      // Log to audit chain
      await supabase.rpc('add_to_audit_chain', {
        p_user_id: user.id,
        p_action_type: 'vault_store',
        p_module: 'encrypted_vault',
        p_data: {
          entry_id: result.id,
          data_type: dataType,
          access_level: accessLevel
        }
      });

      return result.id;
    } catch (error) {
      console.error('Failed to store in vault:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [user?.id, deriveUserKey]);

  /**
   * Retrieve and decrypt data from vault
   */
  const retrieveSecure = useCallback(async (
    entryId: string
  ): Promise<unknown | null> => {
    if (!user?.id) return null;
    setIsProcessing(true);

    try {
      // Fetch encrypted data
      const { data, error } = await supabase
        .from('encrypted_vault')
        .select('*')
        .eq('id', entryId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Entry not found');

      // Derive decryption key
      const decryptionKey = await deriveUserKey();
      
      // Verify key hash matches
      const keyHash = await cryptoEngine.hash(decryptionKey);
      if (keyHash !== data.encryption_key_hash) {
        throw new Error('Decryption key mismatch');
      }

      // Decrypt data
      const encryptedData: EncryptedData = {
        ciphertext: data.encrypted_data,
        iv: data.iv,
        salt: data.auth_tag || ''
      };
      
      const decrypted = await cryptoEngine.decrypt(encryptedData, decryptionKey);
      const parsedData = JSON.parse(decrypted);

      // Update access tracking
      await supabase
        .from('encrypted_vault')
        .update({
          access_count: (data.access_count || 0) + 1,
          last_accessed_at: new Date().toISOString(),
          last_accessed_by: user.id
        })
        .eq('id', entryId);

      // Log access to audit chain
      await supabase.rpc('add_to_audit_chain', {
        p_user_id: user.id,
        p_action_type: 'vault_access',
        p_module: 'encrypted_vault',
        p_data: {
          entry_id: entryId,
          data_type: data.data_type
        }
      });

      return parsedData;
    } catch (error) {
      console.error('Failed to retrieve from vault:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [user?.id, deriveUserKey]);

  /**
   * List user's vault entries (without decrypting)
   */
  const listEntries = useCallback(async (
    dataType?: string
  ): Promise<VaultEntry[]> => {
    if (!user?.id) return [];

    try {
      let query = supabase
        .from('encrypted_vault')
        .select('id, data_type, access_level, created_at, access_count, last_accessed_at')
        .eq('owner_id', user.id)
        .eq('is_archived', false);

      if (dataType) {
        query = query.eq('data_type', dataType);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const entries: VaultEntry[] = (data || []).map(row => ({
        id: row.id,
        dataType: row.data_type,
        accessLevel: row.access_level as 'owner_only' | 'role_based' | 'shared',
        createdAt: row.created_at,
        accessCount: row.access_count || 0,
        lastAccessedAt: row.last_accessed_at
      }));

      setEntries(entries);
      return entries;
    } catch (error) {
      console.error('Failed to list vault entries:', error);
      return [];
    }
  }, [user?.id]);

  /**
   * Archive (soft delete) vault entry
   */
  const archiveEntry = useCallback(async (entryId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('encrypted_vault')
        .update({ is_archived: true })
        .eq('id', entryId)
        .eq('owner_id', user.id);

      if (error) throw error;

      // Log to audit chain
      await supabase.rpc('add_to_audit_chain', {
        p_user_id: user.id,
        p_action_type: 'vault_archive',
        p_module: 'encrypted_vault',
        p_data: { entry_id: entryId }
      });

      // Update local state
      setEntries(prev => prev.filter(e => e.id !== entryId));

      return true;
    } catch (error) {
      console.error('Failed to archive vault entry:', error);
      return false;
    }
  }, [user?.id]);

  /**
   * Rotate encryption key for an entry
   */
  const rotateKey = useCallback(async (entryId: string): Promise<boolean> => {
    if (!user?.id) return false;
    setIsProcessing(true);

    try {
      // Retrieve and decrypt with old key
      const decryptedData = await retrieveSecure(entryId);
      if (!decryptedData) throw new Error('Failed to decrypt with current key');

      // Get entry details
      const { data: entry, error: fetchError } = await supabase
        .from('encrypted_vault')
        .select('data_type, access_level, allowed_roles')
        .eq('id', entryId)
        .single();

      if (fetchError) throw fetchError;

      // Archive old entry
      await archiveEntry(entryId);

      // Store with new encryption
      const accessLevel = entry.access_level as 'owner_only' | 'role_based' | 'shared';
      const newEntryId = await storeSecure(
        entry.data_type,
        decryptedData,
        accessLevel,
        entry.allowed_roles
      );

      // Log key rotation
      await supabase.rpc('add_to_audit_chain', {
        p_user_id: user.id,
        p_action_type: 'vault_key_rotation',
        p_module: 'encrypted_vault',
        p_data: {
          old_entry_id: entryId,
          new_entry_id: newEntryId
        }
      });

      return true;
    } catch (error) {
      console.error('Key rotation failed:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [user?.id, retrieveSecure, archiveEntry, storeSecure]);

  return {
    // State
    isProcessing,
    entries,
    
    // Actions
    storeSecure,
    retrieveSecure,
    listEntries,
    archiveEntry,
    rotateKey
  };
}

export default useEncryptedVault;
