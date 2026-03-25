/**
 * Encrypted Offline Storage
 * Secure local storage with tenant isolation
 * Preserves masking and protects sensitive data
 */

import { indexedDB } from '@/lib/offline/indexed-db';

// Encryption configuration
export interface EncryptionConfig {
  algorithm: 'AES-GCM';
  keyLength: 256;
  saltLength: 16;
  ivLength: 12;
}

const DEFAULT_CONFIG: EncryptionConfig = {
  algorithm: 'AES-GCM',
  keyLength: 256,
  saltLength: 16,
  ivLength: 12
};

// Storage item with encryption metadata
export interface EncryptedItem {
  id: string;
  tenantId: string;
  key: string;
  encryptedData: string;
  iv: string;
  salt: string;
  createdAt: string;
  expiresAt?: string;
  category: 'chat' | 'wallet' | 'demo' | 'logs' | 'general';
}

export class EncryptedStorage {
  private tenantId: string;
  private config: EncryptionConfig;
  private cryptoKey: CryptoKey | null = null;
  private passphrase: string;

  constructor(tenantId: string, passphrase: string, config: Partial<EncryptionConfig> = {}) {
    this.tenantId = tenantId;
    this.passphrase = passphrase;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize encryption key
   */
  async initialize(): Promise<void> {
    const salt = crypto.getRandomValues(new Uint8Array(this.config.saltLength));
    this.cryptoKey = await this.deriveKey(this.passphrase, salt);
  }

  /**
   * Derive encryption key from passphrase
   */
  private async deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(passphrase),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt.buffer as ArrayBuffer,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: this.config.algorithm, length: this.config.keyLength },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt and store data
   */
  async store<T>(
    key: string,
    data: T,
    category: EncryptedItem['category'] = 'general',
    expiresIn?: number // minutes
  ): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(this.config.ivLength));
    const salt = crypto.getRandomValues(new Uint8Array(this.config.saltLength));
    
    // Derive fresh key with new salt
    const cryptoKey = await this.deriveKey(this.passphrase, salt);
    
    // Encrypt data
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: this.config.algorithm, iv: iv as unknown as BufferSource },
      cryptoKey,
      dataBuffer as unknown as BufferSource
    );

    // Store encrypted item
    const item: EncryptedItem = {
      id: crypto.randomUUID(),
      tenantId: this.tenantId,
      key,
      encryptedData: this.bufferToBase64(encryptedBuffer),
      iv: this.bufferToBase64(iv),
      salt: this.bufferToBase64(salt),
      createdAt: new Date().toISOString(),
      expiresAt: expiresIn 
        ? new Date(Date.now() + expiresIn * 60000).toISOString()
        : undefined,
      category
    };

    await indexedDB.set('user_data', item);
    return item.id;
  }

  /**
   * Retrieve and decrypt data
   */
  async retrieve<T>(key: string): Promise<T | null> {
    const items = await indexedDB.getAllByIndex<EncryptedItem>('user_data', 'key', key);
    
    // Find item for this tenant
    const item = items.find(i => i.tenantId === this.tenantId);
    if (!item) return null;

    // Check expiry
    if (item.expiresAt && new Date(item.expiresAt) < new Date()) {
      await this.delete(key);
      return null;
    }

    // Decrypt
    const iv = this.base64ToBuffer(item.iv);
    const salt = this.base64ToBuffer(item.salt);
    const encryptedData = this.base64ToBuffer(item.encryptedData);
    
    const cryptoKey = await this.deriveKey(this.passphrase, new Uint8Array(salt));
    
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: this.config.algorithm, iv: new Uint8Array(iv) },
      cryptoKey,
      encryptedData
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedBuffer));
  }

  /**
   * Delete stored item
   */
  async delete(key: string): Promise<void> {
    const items = await indexedDB.getAllByIndex<EncryptedItem>('user_data', 'key', key);
    const item = items.find(i => i.tenantId === this.tenantId);
    if (item) {
      await indexedDB.delete('user_data', item.id);
    }
  }

  /**
   * Clear all tenant data
   */
  async clearAll(): Promise<void> {
    const all = await indexedDB.getAll<EncryptedItem>('user_data');
    const tenantItems = all.filter(i => i.tenantId === this.tenantId);
    
    for (const item of tenantItems) {
      await indexedDB.delete('user_data', item.id);
    }
  }

  /**
   * Clear expired items
   */
  async clearExpired(): Promise<number> {
    const all = await indexedDB.getAll<EncryptedItem>('user_data');
    const now = new Date();
    let cleared = 0;

    for (const item of all) {
      if (item.tenantId === this.tenantId && item.expiresAt) {
        if (new Date(item.expiresAt) < now) {
          await indexedDB.delete('user_data', item.id);
          cleared++;
        }
      }
    }

    return cleared;
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<{
    itemCount: number;
    categories: Record<string, number>;
    estimatedSize: number;
  }> {
    const all = await indexedDB.getAll<EncryptedItem>('user_data');
    const tenantItems = all.filter(i => i.tenantId === this.tenantId);

    const categories: Record<string, number> = {};
    let estimatedSize = 0;

    for (const item of tenantItems) {
      categories[item.category] = (categories[item.category] || 0) + 1;
      estimatedSize += item.encryptedData.length;
    }

    return {
      itemCount: tenantItems.length,
      categories,
      estimatedSize
    };
  }

  /**
   * Export all tenant data (encrypted)
   */
  async exportData(): Promise<string> {
    const all = await indexedDB.getAll<EncryptedItem>('user_data');
    const tenantItems = all.filter(i => i.tenantId === this.tenantId);
    
    return JSON.stringify({
      tenantId: this.tenantId,
      exportedAt: new Date().toISOString(),
      items: tenantItems
    });
  }

  /**
   * Import encrypted data
   */
  async importData(exportedData: string): Promise<number> {
    const parsed = JSON.parse(exportedData);
    
    if (parsed.tenantId !== this.tenantId) {
      throw new Error('TENANT_MISMATCH: Cannot import data from different tenant');
    }

    let imported = 0;
    for (const item of parsed.items) {
      await indexedDB.set('user_data', item);
      imported++;
    }

    return imported;
  }

  // Utility methods
  private bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

/**
 * Create encrypted storage for tenant
 */
export const createEncryptedStorage = (
  tenantId: string,
  passphrase: string
): EncryptedStorage => {
  const storage = new EncryptedStorage(tenantId, passphrase);
  storage.initialize();
  return storage;
};

export default EncryptedStorage;
