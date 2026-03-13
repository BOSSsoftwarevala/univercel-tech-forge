// MarketplaceService.js
// Simple marketplace CRUD service using Supabase client
//
// Usage:
//   const svc = new MarketplaceService(supabaseClient);
//   await svc.createMarketplace({ name: 'My App', slug: 'my-app', category: 'Tools', price_usd: 9.99 });
//
// If you do not provide a supabaseClient, the service will attempt to create one from
// environment variables SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (server-side) or
// SUPABASE_ANON_KEY (client-side). For server operations prefer SERVICE_ROLE_KEY.

import { createClient } from '@supabase/supabase-js';

export default class MarketplaceService {
  /**
   * @param {object} [supabaseClient] - Optional pre-configured supabase client.
   * @param {object} [opts]
   * @param {string} [opts.table='marketplace_applications'] - Canonical table to use.
   * @param {number} [opts.pageSize=24]
   */
  constructor(supabaseClient = null, opts = {}) {
    this.table = opts.table || 'marketplace_applications';
    this.pageSize = opts.pageSize || 24;

    if (supabaseClient) {
      this.supabase = supabaseClient;
    } else {
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
      if (!url || !key) {
        throw new Error('No supabase client provided and SUPABASE_URL/SUPABASE_KEY env not set');
      }
      this.supabase = createClient(url, key);
    }
  }

  // Internal helper to throw on supabase errors
  _ensureNoError(result) {
    if (!result) throw new Error('Empty supabase result');
    if (result.error) {
      const e = new Error(result.error.message || 'Supabase error');
      e.details = result.error;
      throw e;
    }
    return result.data;
  }

  /**
   * Create a new marketplace application / product.
   * @param {object} data - fields to insert (name, slug, category, price_usd, metadata, created_by, ...)
   * @returns {Promise<object>} inserted record
   */
  async createMarketplace(data = {}) {
    if (!data || typeof data !== 'object') throw new Error('Invalid data');
    // Basic validation
    if (!data.name) throw new Error('name is required');
    if (!data.slug) {
      // create a safe slug if not provided
      data.slug = String(data.name).toLowerCase().replace(/[^\w\-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 200);
    }
    // Ensure sensible defaults
    data.is_active = data.is_active ?? true;
    data.metadata = data.metadata ?? {};

    const res = await this.supabase.from(this.table).insert(data).select().single();
    return this._ensureNoError(res);
  }

  /**
   * Update marketplace record by id.
   * @param {string} id - uuid of the record
   * @param {object} data - fields to update
   * @returns {Promise<object>} updated record
   */
  async updateMarketplace(id, data = {}) {
    if (!id) throw new Error('id is required');
    if (!data || typeof data !== 'object') throw new Error('data is required');
    const res = await this.supabase.from(this.table).update(data).eq('id', id).select().single();
    return this._ensureNoError(res);
  }

  /**
   * Delete marketplace record. By default performs a soft-delete (is_active = false).
   * Pass { hard: true } to physically delete the row.
   * @param {string} id
   * @param {object} [opts]
   * @param {boolean} [opts.hard=false]
   */
  async deleteMarketplace(id, opts = {}) {
    if (!id) throw new Error('id is required');
    const hard = !!opts.hard;
    if (hard) {
      const res = await this.supabase.from(this.table).delete().eq('id', id).select().single();
      return this._ensureNoError(res);
    } else {
      // soft delete
      const res = await this.supabase.from(this.table).update({ is_active: false }).eq('id', id).select().single();
      return this._ensureNoError(res);
    }
  }

  /**
   * Find a marketplace record by id or slug.
   * @param {object|string} identifier - uuid string or { id } or { slug }
   * @returns {Promise<object|null>}
   */
  async findMarketplace(identifier) {
    if (!identifier) throw new Error('identifier required');
    let res;
    if (typeof identifier === 'string') {
      // try by id first then slug
      res = await this.supabase.from(this.table).select('*').eq('id', identifier).maybeSingle();
      if (res.error) throw res.error;
      if (res.data) return res.data;
      // try slug
      res = await this.supabase.from(this.table).select('*').eq('slug', identifier).maybeSingle();
      if (res.error) throw res.error;
      return res.data || null;
    } else if (identifier.id) {
      res = await this.supabase.from(this.table).select('*').eq('id', identifier.id).maybeSingle();
      return this._ensureNoError(res);
    } else if (identifier.slug) {
      res = await this.supabase.from(this.table).select('*').eq('slug', identifier.slug).maybeSingle();
      return this._ensureNoError(res);
    } else {
      throw new Error('Unsupported identifier shape');
    }
  }

  /**
   * List marketplaces with pagination, optional search and category filtering.
   * Uses cursor-based (created_at) pagination when cursor provided, otherwise uses offset range.
   *
   * @param {object} [opts]
   * @param {number} [opts.limit] - page size
   * @param {object} [opts.cursor] - { created_at: '2026-03-13T..', id: 'uuid' } - returns items before this cursor
   * @param {string} [opts.category]
   * @param {string} [opts.q] - search text
   * @param {boolean} [opts.active] - filter is_active (default true)
   * @returns {Promise<{data: object[], nextCursor: object|null}>}
   */
  async listMarketplaces(opts = {}) {
    const limit = Math.max(1, Math.min(200, opts.limit ?? this.pageSize));
    const category = opts.category;
    const q = opts.q ? String(opts.q).trim() : null;
    const active = opts.active === undefined ? true : !!opts.active;
    const cursor = opts.cursor || null;

    let query = this.supabase.from(this.table).select('*');

    // filters
    if (active) query = query.eq('is_active', true);
    if (category) query = query.eq('category', category);

    // search: prefer full-text if available, otherwise ilike
    if (q) {
      // best-effort: try textSearch (search_tsv) else fallback to ilike
      try {
        // note: supabase .textSearch may not be available in all clients; handle gracefully
        query = query.textSearch('search_tsv', q, { config: 'simple' });
      } catch (e) {
        // fallback
        query = query.ilike('name', `%${q}%`).or(`description.ilike.%${q}%`);
      }
    }

    // pagination: cursor (keyset) or range
    if (cursor && cursor.created_at) {
      // keyset: get items with created_at < cursor.created_at (descending order)
      query = query
        .order('created_at', { ascending: false, nullsFirst: false })
        .order('id', { ascending: false })
        .lt('created_at', cursor.created_at)
        .limit(limit);
    } else {
      // simple range paging first page
      query = query.order('created_at', { ascending: false, nullsFirst: false }).limit(limit);
    }

    const res = await query;
    if (res.error) throw res.error;

    const rows = res.data || [];

    // compute next cursor (last item's created_at + id) if full page returned
    let nextCursor = null;
    if (rows.length === limit) {
      const last = rows[rows.length - 1];
      nextCursor = { created_at: last.created_at, id: last.id };
    }

    return { data: rows, nextCursor };
  }
}
