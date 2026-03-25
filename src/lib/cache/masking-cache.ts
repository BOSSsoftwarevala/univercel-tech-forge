/**
 * Masking Cache
 * Memoizes expensive masking operations to improve performance
 */

interface CachedMaskedId {
  maskedId: string;
  role: string;
  color: string;
  country: string;
  countryFlag: string;
  timestamp: number;
}

// LRU Cache for masked IDs
class MaskingCache {
  private cache = new Map<string, CachedMaskedId>();
  private maxSize = 500;
  private ttl = 5 * 60 * 1000; // 5 minutes TTL

  private generateKey(role: string, userId: string, countryCode?: string): string {
    return `${role}:${userId}:${countryCode || 'auto'}`;
  }

  get(role: string, userId: string, countryCode?: string): CachedMaskedId | null {
    const key = this.generateKey(role, userId, countryCode);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Check TTL
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    // Move to end (LRU)
    this.cache.delete(key);
    this.cache.set(key, cached);
    
    return cached;
  }

  set(role: string, userId: string, countryCode: string | undefined, value: Omit<CachedMaskedId, 'timestamp'>): void {
    const key = this.generateKey(role, userId, countryCode);
    
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, {
      ...value,
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Singleton instance
export const maskingCache = new MaskingCache();

// Email masking cache
const emailMaskCache = new Map<string, string>();

export function cachedMaskEmail(email: string): string {
  if (!email) return '';
  
  const cached = emailMaskCache.get(email);
  if (cached) return cached;
  
  const [local, domain] = email.split('@');
  if (!domain) {
    const result = '***@***';
    emailMaskCache.set(email, result);
    return result;
  }
  
  const maskedLocal = local.slice(0, 2) + '***';
  const result = `${maskedLocal}@${domain}`;
  
  // Limit cache size
  if (emailMaskCache.size > 1000) {
    const firstKey = emailMaskCache.keys().next().value;
    if (firstKey) emailMaskCache.delete(firstKey);
  }
  
  emailMaskCache.set(email, result);
  return result;
}

// Phone masking cache
const phoneMaskCache = new Map<string, string>();

export function cachedMaskPhone(phone: string): string {
  if (!phone || phone.length < 6) return '***';
  
  const cached = phoneMaskCache.get(phone);
  if (cached) return cached;
  
  const result = phone.slice(0, 3) + '***' + phone.slice(-4);
  
  // Limit cache size
  if (phoneMaskCache.size > 1000) {
    const firstKey = phoneMaskCache.keys().next().value;
    if (firstKey) phoneMaskCache.delete(firstKey);
  }
  
  phoneMaskCache.set(phone, result);
  return result;
}

// Name masking cache
const nameMaskCache = new Map<string, string>();

export function cachedMaskName(name: string): string {
  if (!name) return '***';
  
  const cached = nameMaskCache.get(name);
  if (cached) return cached;
  
  const parts = name.split(' ');
  const result = parts.length === 1 
    ? name.slice(0, 3) + '***'
    : parts[0] + ' ' + parts.slice(1).map(p => p[0] + '***').join(' ');
  
  // Limit cache size
  if (nameMaskCache.size > 1000) {
    const firstKey = nameMaskCache.keys().next().value;
    if (firstKey) nameMaskCache.delete(firstKey);
  }
  
  nameMaskCache.set(name, result);
  return result;
}

// Batch mask text for chat messages (caches regex results)
const textMaskCache = new Map<string, string>();

export function cachedMaskText(text: string): string {
  if (!text) return '';
  
  // Check cache
  const cached = textMaskCache.get(text);
  if (cached) return cached;
  
  let result = text;
  
  // Mask emails
  result = result.replace(
    /([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    (match, local, domain) => local.slice(0, 3) + '***@' + domain
  );
  
  // Mask phone numbers
  result = result.replace(
    /(\+?\d{1,4}[-.\s]?)(\d{3})[-.\s]?(\d{3,4})[-.\s]?(\d{3,4})/g,
    (match, country, first, middle, last) => 
      `${country || ''}${first}****${last?.slice(-2) || '**'}`
  );
  
  // Limit cache size
  if (textMaskCache.size > 500) {
    const firstKey = textMaskCache.keys().next().value;
    if (firstKey) textMaskCache.delete(firstKey);
  }
  
  textMaskCache.set(text, result);
  return result;
}

// Clear all caches (useful for logout)
export function clearAllMaskingCaches(): void {
  maskingCache.clear();
  emailMaskCache.clear();
  phoneMaskCache.clear();
  nameMaskCache.clear();
  textMaskCache.clear();
}
