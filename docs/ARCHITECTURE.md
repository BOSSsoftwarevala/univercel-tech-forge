# System Architecture Guide

> Software Vala Platform — Technical Architecture Reference

---

## Overview

Software Vala is a **multi-tenant API marketplace and billing platform** built on a modern serverless stack. It enables organisations (tenants) to:

- Subscribe to and consume third-party AI/API services
- Track usage and costs with a double-entry wallet ledger
- Manage access via fine-grained RBAC
- Monitor service health and trigger alerts
- Interact with AI assistants scoped to their role

The architecture follows a **layered, serverless-first** approach: a React SPA communicates exclusively with Supabase Edge Functions (Deno), which in turn read/write a PostgreSQL database secured by Row Level Security (RLS).

---

## Component Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  Vite + React SPA (TypeScript)                           │  │
│   │  ├─ Pages (Dashboard, Wallet, Billing, AI Chat, Admin)   │  │
│   │  ├─ Stores (Zustand state management)                    │  │
│   │  ├─ Hooks (useSWR / React Query for data fetching)       │  │
│   │  └─ Supabase JS Client (auth + realtime subscriptions)   │  │
│   └──────────────────────────────────────────────────────────┘  │
│                          ▲  HTTPS / WSS                          │
└─────────────────────────────────────────────────────────────────-┘
                           │
┌──────────────────────────────────────────────────────────────────┐
│                       GATEWAY LAYER                              │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  Supabase Edge Functions (Deno / TypeScript)             │  │
│   │  ├─ api-auth          — Authentication & sessions        │  │
│   │  ├─ api-wallet        — Ledger, holds, debits            │  │
│   │  ├─ api-product-management — Service catalogue           │  │
│   │  ├─ api-alerts        — Threshold rules & alerts         │  │
│   │  ├─ master-security-api — Keys, access logs, abuse       │  │
│   │  ├─ super-admin-*     — Emergency controls               │  │
│   │  ├─ ai-*              — AI assistant proxies             │  │
│   │  └─ _shared/          — JWT middleware, RBAC, helpers    │  │
│   └──────────────────────────────────────────────────────────┘  │
│                          ▲  Postgres Wire Protocol               │
└──────────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  Supabase PostgreSQL 15                                  │  │
│   │  ├─ 36+ tables across 7 domains                          │  │
│   │  ├─ Row Level Security (RLS) on all tenant tables        │  │
│   │  ├─ Realtime subscriptions (alerts, wallet updates)      │  │
│   │  └─ pgcrypto for key hashing                             │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  Supabase Storage                                        │  │
│   │  └─ Attachments, exports, avatars                        │  │
│   └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                            │
│                                                                  │
│   OpenAI / Anthropic  — AI completions                           │
│   PayPal / PayU       — Payment processing                       │
│   Resend / SMTP       — Transactional email                      │
│   Twilio / MSG91      — SMS OTP                                  │
│   MaxMind GeoIP       — IP-to-region resolution                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Standard API Call (authenticated)

```
Browser → SPA → Supabase JS Client
  └─ Attaches JWT from Supabase Auth session

Edge Function receives request
  ├─ 1. JWT Middleware: verifies token, extracts user_id + tenant_id
  ├─ 2. RBAC Middleware: checks role permission for this endpoint
  ├─ 3. Rate Limit Check: compares against default_limits table
  ├─ 4. Business Logic: reads/writes DB (always tenant_id filtered)
  ├─ 5. Audit Log: appends entry to audit_logs
  └─ 6. Returns JSON response

DB operations use Supabase service-role client
  └─ RLS policies provide secondary defence-in-depth
```

### Billable AI API Call

```
SPA → Edge Function (e.g., vala-ai-chat)
  ├─ 1. Auth + RBAC check
  ├─ 2. Kill switch check (system_state table)
  ├─ 3. Wallet check (available balance ≥ estimated_cost)
  ├─ 4. Place hold on wallet (held_amount += estimated_cost)
  ├─ 5. Call external AI provider (OpenAI / Anthropic)
  ├─ 6. Calculate actual cost from tokens used
  ├─ 7. Debit wallet (balance -= actual_cost)
  ├─ 8. Release hold remainder
  ├─ 9. Create billing_record + wallet_ledger entries
  └─ 10. Return response to SPA
```

### Alert Trigger Flow

```
Scheduled Edge Function (api-monitor / api-health)
  ├─ Polls api_service_health or latency_metrics
  ├─ Compares against alert_thresholds
  ├─ If threshold breached:
  │     ├─ Insert into alerts table
  │     ├─ Insert into anomaly_logs (if AI-detected)
  │     └─ Dispatch notification via email/webhook
  └─ Realtime subscription pushes alert to SPA
```

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend | Vite + React | 18.x | SPA framework |
| Language | TypeScript | 5.x | Type safety across all layers |
| UI Components | shadcn/ui + Radix UI | latest | Accessible component primitives |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| State Management | Zustand | 4.x | Client-side store |
| Forms | React Hook Form + Zod | latest | Validation |
| Backend | Supabase Edge Functions | Deno 1.x | Serverless API handlers |
| Database | PostgreSQL 15 | via Supabase | Primary data store |
| Auth | Supabase Auth | latest | JWT-based auth |
| Realtime | Supabase Realtime | latest | WebSocket subscriptions |
| Mobile | Capacitor | 8.x | iOS/Android wrapper |
| AI Providers | OpenAI / Anthropic | latest | LLM completions |
| Payments | PayPal, PayU | latest | Gateway integrations |
| CI/CD | Vercel | latest | Frontend deployment |
| Container | Docker | latest | Local development |
| Orchestration | Kubernetes (k8s/) | latest | Production deployment |

---

## Security Model

### Defence in Depth (4 layers)

```
Layer 1: Network
  └─ HTTPS enforced; Supabase edge handles TLS termination

Layer 2: Authentication
  └─ Supabase JWT; all requests must carry valid token
  └─ Tokens expire; refresh rotation enforced

Layer 3: Authorisation (RBAC)
  └─ Edge Function middleware checks AppRole permission
  └─ 9 roles × 14 permission types = granular access matrix

Layer 4: Data Isolation (RLS)
  └─ PostgreSQL Row Level Security on every tenant table
  └─ Policies enforce: WHERE tenant_id = auth.uid()::tenant_id
  └─ Even if RBAC is bypassed, DB denies cross-tenant reads
```

### Kill Switch Architecture

```
Global kill switch:   system_state WHERE key = 'ai_kill_switch_active'
Per-service switch:   api_services.kill_switch = true

Both checked BEFORE any wallet hold or external API call.
Only super_admin can toggle global switch.
tenant_admin can toggle their own services.
```

### Wallet Security

- Funds held atomically before any external call (prevents double-spend)
- Wallet lock (`is_locked = true`) prevents all debits/holds instantly
- All transactions append-only in `wallet_ledger` (no updates/deletes)
- Insufficient funds checked against `balance - held_amount` (available balance)

---

## Deployment Considerations

### Environment Variables Required

```bash
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Providers (at least one)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Payments
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
PAYU_MERCHANT_KEY=
PAYU_SALT=

# Email
RESEND_API_KEY=

# SMS
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

### Infrastructure Options

| Environment | Approach |
|-------------|----------|
| Development | `vite dev` + Supabase local via `supabase start` |
| Staging | Vercel (frontend) + Supabase hosted project |
| Production | Docker container (see `Dockerfile`) or Kubernetes (`k8s/`) |

### Scaling Notes

- Edge Functions scale to zero; no idle cost
- PostgreSQL connection pooling via Supabase PgBouncer
- Realtime channels auto-scale per Supabase plan
- AI calls are externally rate-limited by provider; monitor `rate_limit_events`
- Large tenants should be placed on dedicated Supabase projects (data isolation + performance)
