/**
 * marketplaceService
 *
 * Lightweight client-side wrapper for marketplace endpoints.
 * - Provides product/catalog/order related methods used by marketplace UI.
 * - Uses fetch with sensible defaults (timeout, retries).
 * - Falls back to sample data during local development when endpoints are unavailable.
 *
 * Configure NEXT_PUBLIC_API_BASE in env for API root if required.
 */

const API_BASE =
  (typeof process !== 'undefined' && (process.env as any)?.NEXT_PUBLIC_API_BASE) || '';

type FetchOpts = RequestInit & { timeoutMs?: number; retries?: number };

async function apiFetch<T = any>(path: string, opts: FetchOpts = {}): Promise<T> {
  const { timeoutMs = 12_000, retries = 1, ...init } = opts;
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  for (let attempt = 0; attempt < Math.max(1, retries); attempt++) {
    const controller =
      typeof AbortController !== 'undefined' ? new AbortController() : undefined;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : undefined;

    try {
      const res = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(init.headers || {}),
        },
        signal: controller?.signal,
        ...init,
      });

      if (timer) clearTimeout(timer);

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok) {
        const body = contentType.includes('application/json')
          ? await res.json().catch(() => null)
          : await res.text().catch(() => null);
        const err: any = new Error(`Request failed: ${res.status} ${res.statusText}`);
        err.status = res.status;
        err.body = body;
        throw err;
      }

      if (contentType.includes('application/json')) {
        return (await res.json()) as T;
      } else {
        // @ts-ignore
        return (await res.text()) as T;
      }
    } catch (err) {
      const isAbort = (err as any)?.name === 'AbortError';
      if (attempt === Math.max(0, retries - 1)) {
        throw err;
      }
      // backoff before retry
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  throw new Error('apiFetch: exhausted retries');
}

/* ---- Types ---- */

export type Product = {
  id: string;
  slug?: string;
  name: string;
  short_description?: string;
  description?: string;
  price_cents: number;
  currency?: string;
  images?: string[];
  category?: string;
  available?: boolean;
  featured?: boolean;
  vendor?: { id: string; name: string };
  metadata?: Record<string, any>;
};

export type MarketplaceOrder = {
  id: string;
  product_id: string;
  user_id?: string;
  amount_cents: number;
  currency?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  updated_at?: string;
  meta?: any;
};

export type Category = {
  id: string;
  name: string;
  slug?: string;
  description?: string;
};

/* ---- Sample fallback data (dev) ---- */

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'p_crm_pro',
    slug: 'crm-pro-suite',
    name: 'CRM Pro Suite',
    short_description: 'Powerful CRM with automation and analytics',
    description: 'Full-featured CRM for sales & support, with integrations.',
    price_cents: 499000,
    currency: 'INR',
    images: ['/images/products/crm-pro.png'],
    category: 'crm',
    featured: true,
    available: true,
    vendor: { id: 'vala', name: 'Software Vala' },
  },
  {
    id: 'p_site_builder',
    slug: 'website-builder',
    name: 'Website Builder Pro',
    short_description: 'Drag and drop website builder',
    description: 'Create landing pages and sites quickly.',
    price_cents: 199000,
    currency: 'INR',
    images: ['/images/products/site-builder.png'],
    category: 'website',
    featured: false,
    available: true,
    vendor: { id: 'vala', name: 'Software Vala' },
  },
];

const SAMPLE_CATEGORIES: Category[] = [
  { id: 'crm', name: 'CRM' },
  { id: 'website', name: 'Website Builder' },
];

/* ---- Service methods ---- */

export const marketplaceService = {
  /* Products / Catalog */

  async getProducts(params?: { page?: number; pageSize?: number; q?: string; category?: string }) {
    try {
      const qs = new URLSearchParams();
      if (typeof params?.page !== 'undefined') qs.set('page', String(params.page));
      if (typeof params?.pageSize !== 'undefined') qs.set('page_size', String(params.pageSize));
      if (params?.q) qs.set('q', params.q);
      if (params?.category) qs.set('category', params.category);

      const res = await apiFetch<Product[]>(
        `/api/marketplace/products${qs.toString() ? `?${qs.toString()}` : ''}`,
        { method: 'GET', retries: 2 }
      );
      return res;
    } catch (err) {
      if ((process.env as any)?.NODE_ENV !== 'production') {
        console.warn('[marketplaceService] getProducts fallback to sample', err);
        return SAMPLE_PRODUCTS;
      }
      throw err;
    }
  },

  async getProductById(productId: string) {
    try {
      const res = await apiFetch<Product>(`/api/marketplace/products/${encodeURIComponent(productId)}`, {
        method: 'GET',
        retries: 2,
      });
      return res;
    } catch (err) {
      if ((process.env as any)?.NODE_ENV !== 'production') {
        console.warn('[marketplaceService] getProductById fallback to sample', err);
        return SAMPLE_PRODUCTS.find((p) => p.id === productId) ?? null;
      }
      throw err;
    }
  },

  async searchProducts(query: string, opts?: { limit?: number }) {
    try {
      const qs = new URLSearchParams();
      qs.set('q', query);
      if (opts?.limit) qs.set('limit', String(opts.limit));
      const res = await apiFetch<Product[]>(`/api/marketplace/products/search?${qs.toString()}`, {
        method: 'GET',
        retries: 2,
      });
      return res;
    } catch (err) {
      if ((process.env as any)?.NODE_ENV !== 'production') {
        console.warn('[marketplaceService] searchProducts fallback', err);
        return SAMPLE_PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            (p.short_description || '').toLowerCase().includes(query.toLowerCase())
        );
      }
      throw err;
    }
  },

  async getCategories() {
    try {
      const res = await apiFetch<Category[]>(`/api/marketplace/categories`, { method: 'GET', retries: 2 });
      return res;
    } catch (err) {
      if ((process.env as any)?.NODE_ENV !== 'production') {
        console.warn('[marketplaceService] getCategories fallback', err);
        return SAMPLE_CATEGORIES;
      }
      throw err;
    }
  },

  /* Orders / Checkout */

  async createOrder(payload: {
    user_id?: string;
    product_id: string;
    quantity?: number;
    metadata?: any;
  }): Promise<{ order?: MarketplaceOrder; checkout_url?: string; payment_id?: string }> {
    try {
      const res = await apiFetch(`/api/marketplace/orders`, {
        method: 'POST',
        body: JSON.stringify(payload),
        retries: 1,
      });
      return res;
    } catch (err) {
      if ((process.env as any)?.NODE_ENV !== 'production') {
        console.warn('[marketplaceService] createOrder simulated fallback', err);
        const simulated: MarketplaceOrder = {
          id: 'SIM-ORD-' + Date.now(),
          product_id: payload.product_id,
          user_id: payload.user_id,
          amount_cents: SAMPLE_PRODUCTS.find((p) => p.id === payload.product_id)?.price_cents ?? 0,
          currency: 'INR',
          status: 'pending',
          created_at: new Date().toISOString(),
        };
        return { order: simulated, checkout_url: undefined, payment_id: 'SIM-' + Date.now() };
      }
      throw err;
    }
  },

  async getOrder(orderId: string) {
    try {
      const res = await apiFetch<MarketplaceOrder>(`/api/marketplace/orders/${encodeURIComponent(orderId)}`, {
        method: 'GET',
        retries: 2,
      });
      return res;
    } catch (err) {
      if ((process.env as any)?.NODE_ENV !== 'production') {
        console.warn('[marketplaceService] getOrder fallback', err);
        return null;
      }
      throw err;
    }
  },

  async getUserOrders(userId?: string) {
    if (!userId) return [];
    try {
      const res = await apiFetch<MarketplaceOrder[]>(`/api/marketplace/orders?user_id=${encodeURIComponent(userId)}`, {
        method: 'GET',
        retries: 2,
      });
      return res;
    } catch (err) {
      if ((process.env as any)?.NODE_ENV !== 'production') {
        console.warn('[marketplaceService] getUserOrders fallback', err);
        return [];
      }
      throw err;
    }
  },

  /* Favorites / Wishlist */

  async toggleFavorite(userId: string, productId: string) {
    try {
      const res = await apiFetch<{ favorited: boolean }>(`/api/marketplace/favorites/toggle`, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, product_id: productId }),
        retries: 1,
      });
      return res;
    } catch (err) {
      if ((process.env as any)?.NODE_ENV !== 'production') {
        console.warn('[marketplaceService] toggleFavorite simulated', err);
        return { favorited: true };
      }
      throw err;
    }
  },

  async getFavorites(userId: string) {
    if (!userId) return [];
    try {
      const res = await apiFetch<Product[]>(`/api/marketplace/favorites?user_id=${encodeURIComponent(userId)}`, {
        method: 'GET',
        retries: 2,
      });
      return res;
    } catch (err) {
      if ((process.env as any)?.NODE_ENV !== 'production') {
        console.warn('[marketplaceService] getFavorites fallback', err);
        return [];
      }
      throw err;
    }
  },

  /* Cart */

  async addToCart(payload: { user_id?: string; session_id?: string; product_id: string; quantity?: number }) {
    try {
      const res = await apiFetch(`/api/marketplace/cart/add`, {
        method: 'POST',
        body: JSON.stringify(payload),
        retries: 1,
      });
      return res;
    } catch (err) {
      if ((process.env as any)?.NODE_ENV !== 'production') {
        console.warn('[marketplaceService] addToCart simulated', err);
        return { success: true };
      }
      throw err;
    }
  },

  async getCart(userId?: string, sessionId?: string) {
    try {
      const qs = new URLSearchParams();
      if (userId) qs.set('user_id', userId);
      if (sessionId) qs.set('session_id', sessionId);
      const res = await apiFetch<any>(`/api/marketplace/cart${qs.toString() ? `?${qs.toString()}` : ''}`, {
        method: 'GET',
        retries: 2,
      });
      return res;
    } catch (err) {
      if ((process.env as any)?.NODE_ENV !== 'production') {
        console.warn('[marketplaceService] getCart fallback', err);
        return { items: [] };
      }
      throw err;
    }
  },

  async removeFromCart(payload: { user_id?: string; session_id?: string; product_id?: string; cart_item_id?: string }) {
    try {
      const res = await apiFetch(`/api/marketplace/cart/remove`, {
        method: 'POST',
        body: JSON.stringify(payload),
        retries: 1,
      });
      return res;
    } catch (err) {
      if ((process.env as any)?.NODE_ENV !== 'production') {
        console.warn('[marketplaceService] removeFromCart simulated', err);
        return { success: true };
      }
      throw err;
    }
  },
};

export default marketplaceService;
