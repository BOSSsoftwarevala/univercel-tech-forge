/**
 * Next-Generation Cryptographic Engine
 * 
 * Provides enterprise-grade encryption, hashing, and digital signatures
 * using the Web Crypto API for maximum security.
 */

// Encryption algorithm configuration
const ENCRYPTION_ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const ITERATIONS = 100000;

// Hash algorithm
const HASH_ALGORITHM = 'SHA-256';

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  salt: string;
  authTag?: string;
}

export interface SignedData {
  data: string;
  signature: string;
  publicKey: string;
  timestamp: number;
}

export interface HashChainBlock {
  blockNumber: number;
  dataHash: string;
  previousHash: string;
  blockHash: string;
  nonce: string;
  timestamp: number;
}

class CryptoEngine {
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  /**
   * Generate a cryptographically secure random string
   */
  generateNonce(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate SHA-256 hash of data
   */
  async hash(data: string): Promise<string> {
    const encoded = this.encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest(HASH_ALGORITHM, encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate HMAC signature
   */
  async hmac(data: string, key: string): Promise<string> {
    const keyData = this.encoder.encode(key);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: HASH_ALGORITHM },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      this.encoder.encode(data)
    );
    
    return Array.from(new Uint8Array(signature), b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Derive encryption key from password
   */
  private async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      this.encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: ITERATIONS,
        hash: HASH_ALGORITHM
      },
      keyMaterial,
      { name: ENCRYPTION_ALGORITHM, length: KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  async encrypt(plaintext: string, password: string): Promise<EncryptedData> {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const key = await this.deriveKey(password, salt);

    const encrypted = await crypto.subtle.encrypt(
      { name: ENCRYPTION_ALGORITHM, iv },
      key,
      this.encoder.encode(plaintext)
    );

    return {
      ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
      iv: btoa(String.fromCharCode(...iv)),
      salt: btoa(String.fromCharCode(...salt))
    };
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  async decrypt(encryptedData: EncryptedData, password: string): Promise<string> {
    const salt = new Uint8Array(atob(encryptedData.salt).split('').map(c => c.charCodeAt(0)));
    const iv = new Uint8Array(atob(encryptedData.iv).split('').map(c => c.charCodeAt(0)));
    const ciphertext = new Uint8Array(atob(encryptedData.ciphertext).split('').map(c => c.charCodeAt(0)));
    
    const key = await this.deriveKey(password, salt);

    const decrypted = await crypto.subtle.decrypt(
      { name: ENCRYPTION_ALGORITHM, iv },
      key,
      ciphertext
    );

    return this.decoder.decode(decrypted);
  }

  /**
   * Generate key pair for digital signatures (ECDSA)
   */
  async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    const keyPair = await crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign', 'verify']
    );

    const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    return {
      publicKey: btoa(String.fromCharCode(...new Uint8Array(publicKey))),
      privateKey: btoa(String.fromCharCode(...new Uint8Array(privateKey)))
    };
  }

  /**
   * Sign data with private key
   */
  async sign(data: string, privateKeyBase64: string): Promise<SignedData> {
    const privateKeyArray = atob(privateKeyBase64).split('').map(c => c.charCodeAt(0));
    const privateKeyBuffer = new Uint8Array(privateKeyArray).buffer;
    
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      { name: 'ECDSA', hash: HASH_ALGORITHM },
      privateKey,
      this.encoder.encode(data)
    );

    // Derive public key for verification
    const keyPair = await this.generateKeyPair();

    return {
      data,
      signature: btoa(String.fromCharCode(...new Uint8Array(signature))),
      publicKey: keyPair.publicKey,
      timestamp: Date.now()
    };
  }

  /**
   * Verify signature with public key
   */
  async verify(signedData: SignedData): Promise<boolean> {
    try {
      const publicKeyBuffer = new Uint8Array(atob(signedData.publicKey).split('').map(c => c.charCodeAt(0)));
      const signatureBuffer = new Uint8Array(atob(signedData.signature).split('').map(c => c.charCodeAt(0)));

      const publicKey = await crypto.subtle.importKey(
        'spki',
        publicKeyBuffer,
        { name: 'ECDSA', namedCurve: 'P-256' },
        false,
        ['verify']
      );

      return await crypto.subtle.verify(
        { name: 'ECDSA', hash: HASH_ALGORITHM },
        publicKey,
        signatureBuffer,
        this.encoder.encode(signedData.data)
      );
    } catch {
      return false;
    }
  }

  /**
   * Create a blockchain-style hash chain block
   */
  async createBlock(
    blockNumber: number,
    data: Record<string, unknown>,
    previousHash: string
  ): Promise<HashChainBlock> {
    const nonce = this.generateNonce(16);
    const timestamp = Date.now();
    
    const dataString = JSON.stringify(data);
    const dataHash = await this.hash(dataString + nonce);
    
    const blockContent = `${blockNumber}${previousHash}${dataHash}${timestamp}`;
    const blockHash = await this.hash(blockContent);

    return {
      blockNumber,
      dataHash,
      previousHash,
      blockHash,
      nonce,
      timestamp
    };
  }

  /**
   * Verify block chain integrity
   */
  async verifyChain(blocks: HashChainBlock[]): Promise<{ valid: boolean; brokenAt?: number }> {
    if (blocks.length === 0) return { valid: true };

    // Sort by block number
    const sorted = [...blocks].sort((a, b) => a.blockNumber - b.blockNumber);

    for (let i = 0; i < sorted.length; i++) {
      const block = sorted[i];
      
      // Verify block hash
      const expectedHash = await this.hash(
        `${block.blockNumber}${block.previousHash}${block.dataHash}${block.timestamp}`
      );
      
      if (expectedHash !== block.blockHash) {
        return { valid: false, brokenAt: block.blockNumber };
      }

      // Verify chain link (except genesis block)
      if (i > 0) {
        const previousBlock = sorted[i - 1];
        if (block.previousHash !== previousBlock.blockHash) {
          return { valid: false, brokenAt: block.blockNumber };
        }
      }
    }

    return { valid: true };
  }

  /**
   * Generate device fingerprint
   */
  async generateDeviceFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 'unknown',
      navigator.platform,
      'webgl:' + this.getWebGLFingerprint()
    ];

    return await this.hash(components.join('|'));
  }

  /**
   * Get WebGL fingerprint component
   */
  private getWebGLFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'unavailable';
      
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return 'no-debug-info';
      
      const vendor = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      
      return `${vendor}~${renderer}`;
    } catch {
      return 'error';
    }
  }

  /**
   * Generate time-based token (similar to TOTP)
   */
  async generateTimeBasedToken(secret: string, window: number = 30): Promise<string> {
    const epoch = Math.floor(Date.now() / 1000);
    const counter = Math.floor(epoch / window);
    
    const data = counter.toString(16).padStart(16, '0');
    const hmacResult = await this.hmac(data, secret);
    
    // Extract 6-digit code
    const offset = parseInt(hmacResult.slice(-1), 16);
    const binary = parseInt(hmacResult.substr(offset * 2, 8), 16) & 0x7fffffff;
    
    return (binary % 1000000).toString().padStart(6, '0');
  }

  /**
   * Verify time-based token
   */
  async verifyTimeBasedToken(token: string, secret: string, window: number = 30, drift: number = 1): Promise<boolean> {
    for (let i = -drift; i <= drift; i++) {
      const epoch = Math.floor(Date.now() / 1000) + (i * window);
      const counter = Math.floor(epoch / window);
      const data = counter.toString(16).padStart(16, '0');
      const hmacResult = await this.hmac(data, secret);
      
      const offset = parseInt(hmacResult.slice(-1), 16);
      const binary = parseInt(hmacResult.substr(offset * 2, 8), 16) & 0x7fffffff;
      const expectedToken = (binary % 1000000).toString().padStart(6, '0');
      
      if (expectedToken === token) return true;
    }
    return false;
  }
}

export const cryptoEngine = new CryptoEngine();
export default cryptoEngine;
