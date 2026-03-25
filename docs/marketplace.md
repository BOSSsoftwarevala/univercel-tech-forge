# Marketplace Module – Developer Reference

This document covers the environment variables, API contracts, and security notes for the Marketplace module.

---

## Environment Variables (Vite front-end)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE` | No | `""` (same-origin) | Root URL of the backend API (e.g. `https://your-project.supabase.co/functions/v1`). Preferred over `NEXT_PUBLIC_API_BASE`. |
| `NEXT_PUBLIC_API_BASE` | No | `""` | Legacy fallback for `VITE_API_BASE`. Supported for backward compatibility; prefer `VITE_API_BASE`. |
| `VITE_ENABLE_MARKETPLACE_MOCKS` | No | `false` | Set to `"true"` **only in local development** to enable sample/mock fallback data when the backend is unreachable. **Must never be set in production.** When enabled, all mock responses include `isMock: true` and a visible console warning. |

### `.env.development` example

```env
VITE_API_BASE=http://localhost:54321/functions/v1
# Uncomment to enable mock data while backend is not running:
# VITE_ENABLE_MARKETPLACE_MOCKS=true
```

### `.env.production` example

```env
VITE_API_BASE=https://<project-ref>.supabase.co/functions/v1
# Do NOT set VITE_ENABLE_MARKETPLACE_MOCKS here
```

---

## Marketplace API Endpoints

All endpoints are served by the `api-marketplace` Supabase Edge Function.
Base path: `<VITE_API_BASE>/api-marketplace`

Authentication is required for all endpoints (Bearer JWT in `Authorization` header).

### Catalog & Orders

| Method | Path | Description |
|---|---|---|
| `GET` | `/catalog` | Paginated product catalog |
| `GET` | `/orders` | List authenticated user's marketplace orders |
| `POST` | `/orders` | Create a new marketplace order |
| `GET` | `/favourite/list` | List user's favourited products |
| `POST` | `/favourite/toggle` | Add or remove a product favourite |

### Wallet

| Method | Path | Status | Description |
|---|---|---|---|
| `GET` | `/wallet` | ✅ Implemented | Get authenticated user's wallet balance |
| `GET` | `/wallet/transactions` | ✅ Implemented | List wallet transactions (paginated) |
| `POST` | `/wallet/topup` | ⚠️ 501 Not Implemented | Initiate top-up. Requires payment gateway integration. |
| `POST` | `/wallet/withdraw` | ⚠️ 501 Not Implemented | Request withdrawal. Requires payout integration. |

### Development / Custom Orders

| Method | Path | Status | Description |
|---|---|---|---|
| `GET` | `/development/orders` | ✅ Implemented | List authenticated user's development orders |
| `POST` | `/development/request-update` | ✅ Implemented | Create an update request (opens support ticket) |
| `POST` | `/development/contact-lead` | ⚠️ 501 Not Implemented | Contact lead lookup (secure lookup not yet live) |

### Support

| Method | Path | Status | Description |
|---|---|---|---|
| `POST` | `/support` | ✅ Implemented | Create a marketplace support ticket |

### Other

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Service health check |
| `POST` | `/join-franchise` | Join as franchise partner |
| `POST` | `/join-reseller` | Join as reseller partner |
| `POST` | `/join-influencer` | Join as influencer partner |

---

## Security Notes

### Server-side user identity

**The server must always derive the user identity from the authenticated JWT, not from client-supplied values.**

- The front-end service (`marketplaceEnterpriseService.ts`) does **not** include `user_id` in request bodies or query strings.
- Any `_userId` parameters in client-side method signatures are deprecated and exist only for backward compatibility with call sites. They are intentionally not forwarded to the API.
- The Supabase Edge Functions use `withAuth` middleware which extracts `user.userId` from the verified JWT.

> **TODO**: Once all call sites are updated, remove the `_userId` parameters from the client service methods entirely.

### Mock mode

- Mock fallbacks are gated behind `VITE_ENABLE_MARKETPLACE_MOCKS=true`.
- Without this flag, any backend failure throws a loud error (`rejectWithBackendError`) to surface real issues in development and testing.
- When mock mode is active, all responses include `isMock: true` and a prominent console warning. UIs can optionally show a "Mock Data" banner by checking this flag.

### RLS (Row Level Security)

The following tables used by the marketplace module have RLS enabled:

| Table | Policy summary |
|---|---|
| `unified_wallets` | Owner read; Finance manages |
| `unified_wallet_transactions` | Owner read; Finance manages |
| `marketplace_orders` | Buyer read/insert; Admin update |
| `marketplace_order_events` | Visible via order ownership |
| `marketplace_licenses` | Buyer read; Admin manage |
| `user_support_tickets` | Owner read/insert; Admin all |

> **Action required**: Verify that `offers`, `products`, and `marketplace_order_items` tables also have appropriate RLS policies before exposing them to unauthenticated or low-privilege users via direct Supabase client queries.

---

## Client Service (`marketplaceEnterpriseService.ts`)

Located at: `src/services/marketplaceEnterpriseService.ts`

This is the single entry point for all marketplace API calls from the React front-end.

### Mock mode behavior

```
VITE_ENABLE_MARKETPLACE_MOCKS not set (default)
  → apiFetch fails → rejectWithBackendError throws
  → UI gets a real error (fail loudly)

VITE_ENABLE_MARKETPLACE_MOCKS=true
  → apiFetch fails → warnMockMode logs orange console warning
  → sample data returned with { isMock: true }
  → UI can show "Mock Data" banner
```
