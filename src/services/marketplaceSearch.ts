// Marketplace Search Service
// Full-text search with caching and CDN-ready responses

import { supabase } from '@/integrations/supabase/client';

export interface SearchResult {
  product_id: string;
  product_name: string;
  description: string | null;
  category: string | null;
  monthly_price: number | null;
  lifetime_price: number | null;
  tech_stack: string | null;
  rank: number;
}

// Simple in-memory cache
const searchCache = new Map<string, { results: SearchResult[]; timestamp: number }>();
const CACHE_TTL_MS = 60_000; // 1 minute

class MarketplaceSearchService {
  /**
   * Full-text search using PostgreSQL tsvector
   */
  async search(query: string, options?: {
    category?: string;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<SearchResult[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const cacheKey = JSON.stringify({ query: trimmed, ...options });
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.results;
    }

    // Convert user query to tsquery format
    const tsQuery = trimmed
      .split(/\s+/)
      .filter(Boolean)
      .map(word => `${word}:*`)
      .join(' & ');

    const { data, error } = await (supabase as any).rpc('search_products', {
      search_query: tsQuery,
      result_limit: options?.limit || 50,
    });

    if (error) {
      console.error('[Search] FTS error, falling back to ILIKE:', error.message);
      return this.fallbackSearch(trimmed, options);
    }

    const results: SearchResult[] = ((data as any[]) || []).map((row: any) => ({
      product_id: row.product_id,
      product_name: row.product_name,
      description: row.description,
      category: row.category,
      monthly_price: row.monthly_price,
      lifetime_price: row.lifetime_price,
      tech_stack: row.tech_stack,
      rank: row.rank || 0,
    }));

    // Apply client-side filters
    let filtered = results;
    if (options?.category) {
      filtered = filtered.filter(r => r.category?.toLowerCase() === options.category?.toLowerCase());
    }
    if (options?.minPrice !== undefined) {
      filtered = filtered.filter(r => (r.monthly_price || 0) >= (options.minPrice || 0));
    }
    if (options?.maxPrice !== undefined) {
      filtered = filtered.filter(r => (r.monthly_price || Infinity) <= (options.maxPrice || Infinity));
    }

    // Cache results
    searchCache.set(cacheKey, { results: filtered, timestamp: Date.now() });

    return filtered;
  }

  /**
   * Fallback ILIKE search when FTS is unavailable
   */
  private async fallbackSearch(query: string, options?: { category?: string; limit?: number }): Promise<SearchResult[]> {
    let q = supabase
      .from('products')
      .select('product_id, product_name, description, category, monthly_price, lifetime_price, tech_stack')
      .eq('is_active', true)
      .or(`product_name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(options?.limit || 50);

    if (options?.category) {
      q = q.eq('category', options.category);
    }

    const { data } = await q;

    return (data || []).map((row: any) => ({
      ...row,
      rank: 0,
    }));
  }

  /**
   * Get search suggestions / autocomplete
   */
  async getSuggestions(prefix: string): Promise<string[]> {
    if (prefix.length < 2) return [];

    const { data } = await supabase
      .from('products')
      .select('product_name, category')
      .eq('is_active', true)
      .or(`product_name.ilike.${prefix}%,category.ilike.${prefix}%`)
      .limit(10);

    const suggestions = new Set<string>();
    (data || []).forEach((row: any) => {
      if (row.product_name?.toLowerCase().startsWith(prefix.toLowerCase())) {
        suggestions.add(row.product_name);
      }
      if (row.category?.toLowerCase().startsWith(prefix.toLowerCase())) {
        suggestions.add(row.category);
      }
    });

    return Array.from(suggestions).slice(0, 8);
  }

  /**
   * Clear search cache
   */
  clearCache() {
    searchCache.clear();
  }
}

export const marketplaceSearch = new MarketplaceSearchService();
