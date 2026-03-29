/**
 * marketplaceEnterpriseService
 *
 * Centralized client-side service wrapper for marketplace-related server endpoints.
 * - Uses fetch under the hood with sensible defaults, timeout and retry behavior.
 * - Provides typed method signatures used across the marketplace UI.
 *
 * Environment variables (Vite):
 * - VITE_API_BASE           – API root URL (same-origin if omitted). Preferred over NEXT_PUBLIC_API_BASE.
 * - VITE_ENABLE_MARKETPLACE_MOCKS – Set to "true" to enable mock/sample fallbacks during local dev.
 *   Default (omitted / "false") = fail loudly so missing backend is visible. Never enable in production.
 *
 * Security note:
 * - user_id is NOT included in request bodies/query strings. The server must derive the user
 *   identity from the authenticated session/JWT token.
 *   TODO: Remove any remaining user_id parameters once all backend endpoints derive user from auth.
 */

// Prefer VITE_API_BASE (standard Vite env); fall back to NEXT_PUBLIC_API_BASE for backward compat.
const API_BASE: string =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.NEXT_PUBLIC_API_BASE) ||
  '';

/** True only when explicitly opted-in via VITE_ENABLE_MARKETPLACE_MOCKS=true */
const MOCKS_ENABLED: boolean =
  typeof import.meta !== 'undefined' &&
  (import.meta as any).env?.VITE_ENABLE_MARKETPLACE_MOCKS === 'true';

type FetchOpts = RequestInit & { timeoutMs?: number; retries?: number };

/**
 * Throw a standardized "mock mode not enabled" error so callers fail loudly
 * when the backend is unreachable and VITE_ENABLE_MARKETPLACE_MOCKS is not set.
 */
function rejectWithBackendError(method: string, cause: unknown): never {
  const base = cause instanceof Error ? cause.message : String(cause);
  throw new Error(
    `[marketplaceEnterpriseService] ${method}: backend request failed and mock mode is disabled. ` +
    `Set VITE_ENABLE_MARKETPLACE_MOCKS=true to enable sample data in development. Cause: ${base}`
  );
}

/** Emit a clearly visible warning when mock data is being returned. */
function warnMockMode(method: string) {
  console.warn(
    `%c[MOCK MODE] marketplaceEnterpriseService.${method} – returning simulated data.\n` +
    'This is NOT real data. Set VITE_ENABLE_MARKETPLACE_MOCKS=false (or remove it) to see real errors.',
    'color: orange; font-weight: bold;'
  );
}

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
   * Fetch development orders for the authenticated user.
   * user_id is intentionally omitted – the server derives it from the auth session.
   */
  async getDevelopmentOrders(_userId?: string): Promise<DevOrder[] | { data: DevOrder[] }> {
    try {
      const res = await apiFetch<DevOrder[]>(`/api/marketplace/development/orders`, {
        method: 'GET',
        retries: 2,
      });
      return res;
    } catch (err) {
      if (MOCKS_ENABLED) {
        warnMockMode('getDevelopmentOrders');
        return SAMPLE_DEVORDERS.map((o) => ({ ...o, isMock: true } as any));
      }
      rejectWithBackendError('getDevelopmentOrders', err);
    }
  },

  /**
   * Request an update for an order.
   * user_id is intentionally omitted – server derives identity from auth session.
   */
  async requestOrderUpdate(_userId: string, orderId: string): Promise<{ success: boolean }> {
    try {
      const res = await apiFetch<{ success: boolean }>(`/api/marketplace/development/request-update`, {
        method: 'POST',
        // TODO: Remove _userId param from call sites once all callers are updated.
        body: JSON.stringify({ order_id: orderId }),
        retries: 1,
      });
      return res;
    } catch (err) {
      if (MOCKS_ENABLED) {
        warnMockMode('requestOrderUpdate');
        return { success: true };
      }
      rejectWithBackendError('requestOrderUpdate', err);
    }
  },

  /**
   * Get wallet summary for the authenticated user.
   * user_id is intentionally omitted – server derives identity from auth session.
   */
  async getWallet(_userId?: string): Promise<Wallet | { data: Wallet } | null> {
    try {
      const res = await apiFetch<Wallet>(`/api/marketplace/wallet`, {
        method: 'GET',
        retries: 2,
      });
      return res;
    } catch (err) {
      if (MOCKS_ENABLED) {
        warnMockMode('getWallet');
        return { ...SAMPLE_WALLET, isMock: true } as any;
      }
      rejectWithBackendError('getWallet', err);
    }
  },

  /**
   * Get wallet transactions for the authenticated user.
   * user_id is intentionally omitted – server derives identity from auth session.
   */
  async getWalletTransactions(_userId?: string): Promise<Transaction[] | { data: Transaction[] }> {
    try {
      const res = await apiFetch<Transaction[]>(`/api/marketplace/wallet/transactions`, {
        method: 'GET',
        retries: 2,
      });
      return res;
    } catch (err) {
      if (MOCKS_ENABLED) {
        warnMockMode('getWalletTransactions');
        return SAMPLE_TRANSACTIONS.map((t) => ({ ...t, isMock: true } as any));
      }
      rejectWithBackendError('getWalletTransactions', err);
    }
  },

  /**
   * Initiate top-up. Accepts amount in cents (paise).
   * user_id is intentionally omitted – server derives identity from auth session.
   */
  async topUpWallet(_userId: string, { amount_cents }: { amount_cents: number }) {
    try {
      const res = await apiFetch<{ checkout_url?: string; payment_id?: string }>(`/api/marketplace/wallet/topup`, {
        method: 'POST',
        // TODO: Remove _userId param from call sites once all callers are updated.
        body: JSON.stringify({ amount_cents }),
        retries: 1,
      });
      return res;
    } catch (err) {
      if (MOCKS_ENABLED) {
        warnMockMode('topUpWallet');
        return { checkout_url: undefined, payment_id: 'SIMULATED-' + Date.now(), isMock: true };
      }
      rejectWithBackendError('topUpWallet', err);
    }
  },

  /**
   * Withdraw funds.
   * user_id is intentionally omitted – server derives identity from auth session.
   */
  async withdrawFromWallet(_userId: string) {
    try {
      const res = await apiFetch<{ success: boolean; request_id?: string }>(`/api/marketplace/wallet/withdraw`, {
        method: 'POST',
        // TODO: Remove _userId param from call sites once all callers are updated.
        body: JSON.stringify({}),
        retries: 1,
      });
      return res;
    } catch (err) {
      if (MOCKS_ENABLED) {
        warnMockMode('withdrawFromWallet');
        return { success: true, request_id: 'SIM-' + Date.now(), isMock: true };
      }
      rejectWithBackendError('withdrawFromWallet', err);
    }
  },

  /**
   * Create support ticket.
   * user_id is intentionally omitted from the payload – server derives identity from auth session.
   */
  async createSupportTicket(payload: { user_id?: string; subject: string; message: string }) {
    // Exclude user_id from what we send – server should use the authenticated session.
    const { subject, message } = payload;
    try {
      const res = await apiFetch<{ ticket_id?: string }>(`/api/marketplace/support`, {
        method: 'POST',
        body: JSON.stringify({ subject, message }),
        retries: 1,
      });
      return res;
    } catch (err) {
      if (MOCKS_ENABLED) {
        warnMockMode('createSupportTicket');
        return { ticket_id: 'SIM-' + Date.now(), isMock: true };
      }
      rejectWithBackendError('createSupportTicket', err);
    }
  },

  /**
   * Open order details - client side helper
   */
  openOrderDetails(orderId: string) {
    try {
      const path = `/marketplace/development/orders/${encodeURIComponent(orderId)}`;
      if (typeof window !== 'undefined' && window.location) {
        window.open(path, '_blank');
      }
    } catch (err) {
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
      const contact = (res as any)?.contact;
      if (contact?.email && typeof window !== 'undefined') {
        window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent('Query about order ' + orderId)}`;
      }
      return res;
    } catch (err) {
      if (MOCKS_ENABLED) {
        warnMockMode('contactLead');
        if (typeof window !== 'undefined') {
          window.location.href = `mailto:support@softwarevala.com?subject=${encodeURIComponent('Query about order ' + orderId)}`;
        }
        return { success: true, isMock: true };
      }
      rejectWithBackendError('contactLead', err);
    }
  },
};

export default marketplaceEnterpriseService;
