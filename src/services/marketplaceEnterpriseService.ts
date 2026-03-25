/**
 * marketplaceEnterpriseService
 *
 * Centralized client-side service wrapper for marketplace-related server endpoints.
 * - Uses fetch under the hood with sensible defaults, timeout and retry behavior.
 * - Provides typed method signatures used across the marketplace UI.
 * - Falls back to sample/mock data when server endpoints are not available (useful during local dev).
 *
 * NOTE:
 * - Adjust NEXT_PUBLIC_API_BASE in your env to point to API root if needed.
 * - All endpoints used here are conventions — update paths to match your backend.
 */

const API_BASE = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_BASE) || '';

type FetchOpts = RequestInit & { timeoutMs?: number; retries?: number };

async function apiFetch<T = any>(path: string, opts: FetchOpts = {}): Promise<T> {
  const { timeoutMs = 12_000, retries = 1, ...init } = opts;

  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  for (let attempt = 0; attempt < Math.max(1, retries); attempt++) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : undefined;
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

      // non-JSON responses can be returned as text
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok) {
        const body = contentType.includes('application/json') ? await res.json().catch(() => null) : await res.text().catch(() => null);
        const err = new Error(`Request failed: ${res.status} ${res.statusText}`);
        (err as any).status = res.status;
        (err as any).body = body;
        throw err;
      }

      if (contentType.includes('application/json')) {
        return (await res.json()) as T;
      } else {
        // @ts-ignore
        return (await res.text()) as T;
      }
    } catch (err) {
      // If last attempt, rethrow
      const isAbort = (err as any)?.name === 'AbortError';
      if (attempt === Math.max(0, retries - 1)) {
        throw err;
      }
      // otherwise small backoff
      await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
    } finally {
      // nothing
    }
  }

  // should not reach here
  throw new Error('apiFetch: exhausted retries');
}

/* ---- Types ---- */

export type DevOrder = {
  id: string;
  product_name: string;
  order_ref?: string;
  progress_percent: number;
  started_at?: string;
  eta?: string;
  status?: string;
  lead?: string;
  notes?: string;
};

export type Wallet = {
  balance_cents: number;
  currency?: string;
  reserved_cents?: number;
  upi_id?: string;
  account_number?: string;
  ifsc?: string;
};

export type Transaction = {
  id: string;
  type: 'credit' | 'debit';
  amount_cents: number;
  description?: string;
  created_at: string;
  status?: string;
};

/* ---- Sample fallback data (used when API not reachable) ---- */

const SAMPLE_DEVORDERS: DevOrder[] = [
  {
    id: 'ORD-2024-001',
    product_name: 'CRM Pro Suite - Custom',
    order_ref: 'ORD-2024-001',
    progress_percent: 65,
    started_at: '2024-12-01T09:00:00.000Z',
    eta: '2025-01-30T18:00:00.000Z',
    status: 'in_progress',
    lead: 'Dev Team A',
    notes: 'Working on custom fields and integrations',
  },
];

const SAMPLE_WALLET: Wallet = {
  balance_cents: 4523000,
  currency: 'INR',
  reserved_cents: 500000,
  upi_id: 'test@upi',
  account_number: 'XXXXXXXXXXXX1234',
  ifsc: 'SBIN0000000',
};

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-1',
    type: 'credit',
    amount_cents: 500000,
    description: 'Top-up via UPI',
    created_at: new Date().toISOString(),
    status: 'completed',
  },
];

/* ---- Service methods ---- */

export const marketplaceEnterpriseService = {
  /**
   * Fetch development orders for a user
   */
  async getDevelopmentOrders(userId?: string): Promise<DevOrder[] | { data: DevOrder[] }> {
    if (!userId) {
      // return empty to allow UI to handle unauthenticated case
      return [];
    }

    try {
      const res = await apiFetch<DevOrder[]>(`/api/marketplace/development/orders?user_id=${encodeURIComponent(userId)}`, {
        method: 'GET',
        retries: 2,
      });
      return res;
    } catch (err) {
      // fallback to sample data in dev
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[marketplaceEnterpriseService] getDevelopmentOrders fallback to sample', err);
        return SAMPLE_DEVORDERS;
      }
      throw err;
    }
  },

  /**
   * Request an update for an order
   */
  async requestOrderUpdate(userId: string, orderId: string): Promise<{ success: boolean }> {
    if (!userId) throw new Error('userId required');
    try {
      const res = await apiFetch<{ success: boolean }>(`/api/marketplace/development/request-update`, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, order_id: orderId }),
        retries: 1,
      });
      return res;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[marketplaceEnterpriseService] requestOrderUpdate fallback simulated', err);
        return { success: true };
      }
      throw err;
    }
  },

  /**
   * Get wallet summary
   */
  async getWallet(userId?: string): Promise<Wallet | { data: Wallet } | null> {
    if (!userId) return null;
    try {
      const res = await apiFetch<Wallet>(`/api/marketplace/wallet?user_id=${encodeURIComponent(userId)}`, {
        method: 'GET',
        retries: 2,
      });
      return res;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[marketplaceEnterpriseService] getWallet fallback sample', err);
        return SAMPLE_WALLET;
      }
      throw err;
    }
  },

  /**
   * Get wallet transactions
   */
  async getWalletTransactions(userId?: string): Promise<Transaction[] | { data: Transaction[] }> {
    if (!userId) return [];
    try {
      const res = await apiFetch<Transaction[]>(`/api/marketplace/wallet/transactions?user_id=${encodeURIComponent(userId)}`, {
        method: 'GET',
        retries: 2,
      });
      return res;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[marketplaceEnterpriseService] getWalletTransactions fallback', err);
        return SAMPLE_TRANSACTIONS;
      }
      throw err;
    }
  },

  /**
   * Initiate top-up. Accepts amount in cents (paise)
   */
  async topUpWallet(userId: string, { amount_cents }: { amount_cents: number }) {
    if (!userId) throw new Error('userId required');
    try {
      const res = await apiFetch<{ checkout_url?: string; payment_id?: string }>(`/api/marketplace/wallet/topup`, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, amount_cents }),
        retries: 1,
      });
      return res;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[marketplaceEnterpriseService] topUpWallet simulated', err);
        return { checkout_url: undefined, payment_id: 'SIMULATED-' + Date.now() };
      }
      throw err;
    }
  },

  /**
   * Withdraw funds
   */
  async withdrawFromWallet(userId: string) {
    if (!userId) throw new Error('userId required');
    try {
      const res = await apiFetch<{ success: boolean; request_id?: string }>(`/api/marketplace/wallet/withdraw`, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId }),
        retries: 1,
      });
      return res;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[marketplaceEnterpriseService] withdrawFromWallet simulated', err);
        return { success: true, request_id: 'SIM-' + Date.now() };
      }
      throw err;
    }
  },

  /**
   * Create support ticket
   */
  async createSupportTicket(payload: { user_id: string; subject: string; message: string }) {
    try {
      const res = await apiFetch<{ ticket_id?: string }>(`/api/marketplace/support`, {
        method: 'POST',
        body: JSON.stringify(payload),
        retries: 1,
      });
      return res;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[marketplaceEnterpriseService] createSupportTicket simulated', err);
        return { ticket_id: 'SIM-' + Date.now() };
      }
      throw err;
    }
  },

  /**
   * Open order details - client side helper
   */
  openOrderDetails(orderId: string) {
    try {
      // try to open internal SPA route
      const path = `/marketplace/development/orders/${encodeURIComponent(orderId)}`;
      if (typeof window !== 'undefined' && window.location) {
        // If SPA supports routing library, it will handle - navigation fallback to new tab
        window.open(path, '_blank');
      }
    } catch (err) {
      // swallow
      console.error('[marketplaceEnterpriseService] openOrderDetails', err);
    }
  },

  /**
   * Contact lead - triggers server action or opens mailto when server not available
   */
  async contactLead(orderId: string) {
    try {
      const res = await apiFetch<{ success?: boolean; contact?: { email?: string } }>(`/api/marketplace/development/contact-lead`, {
        method: 'POST',
        body: JSON.stringify({ order_id: orderId }),
        retries: 1,
      });
      // if server returns contact email, open mailto
      const contact = (res as any)?.contact;
      if (contact?.email && typeof window !== 'undefined') {
        window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent('Query about order ' + orderId)}`;
      }
      return res;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[marketplaceEnterpriseService] contactLead simulated', err);
        // fallback mailto
        if (typeof window !== 'undefined') {
          window.location.href = `mailto:support@softwarevala.com?subject=${encodeURIComponent('Query about order ' + orderId)}`;
        }
        return { success: true };
      }
      throw err;
    }
  },
};

export default marketplaceEnterpriseService;
