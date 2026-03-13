# Implementation Sequence & Rollout Plan

> Software Vala Platform — Phased Deployment Guide  
> Total estimated timeline: ~10 weeks for production-ready state

---

## Phase 0: Prerequisites (Before Any Deployment)

**Duration:** 1–2 days  
**Owner:** DevOps / Project Lead

| Step | Action | Dependency |
|------|--------|------------|
| 0.1 | Create Supabase project (hosted or self-hosted) | — |
| 0.2 | Set all required environment variables (see `ARCHITECTURE.md`) | Supabase project |
| 0.3 | Configure Supabase Auth (email templates, JWT expiry) | Step 0.1 |
| 0.4 | Register PayPal / PayU merchant accounts | Business entity |
| 0.5 | Obtain AI provider API keys (OpenAI / Anthropic) | Budget approval |
| 0.6 | Configure transactional email provider (Resend) | Domain DNS |

---

## Phase 1: P0 — Critical Foundation

**Duration:** Week 1–2  
**Goal:** Platform is runnable with auth, multi-tenancy, and wallet

### 1.1 Database Migrations

Run in order:

```bash
supabase db push
# Applies all files in supabase/migrations/ sequentially
```

Key migrations applied:
- `20251219123420_*` — Core tables (tenants, users, roles)
- `20251219124053_*` — Wallet + ledger tables
- `20251219124642_*` — API service tables
- `20251219125229_*` — Billing tables
- `20251219130025_*` — RLS policies

**Verification:** Run `supabase db diff` — should show no pending migrations.

### 1.2 Deploy Core Edge Functions

```bash
supabase functions deploy api-auth
supabase functions deploy api-users
supabase functions deploy api-wallet
supabase functions deploy role-init
supabase functions deploy bootstrap-admins
```

**Files involved:**
- `supabase/functions/api-auth/index.ts`
- `supabase/functions/api-users/index.ts`
- `supabase/functions/api-wallet/index.ts`
- `supabase/functions/_shared/` (middleware — deployed automatically)

### 1.3 Bootstrap Super Admin

```bash
curl -X POST https://<project>.supabase.co/functions/v1/bootstrap-admins \
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>"
```

**Verification:** Super admin can log in at `/login`.

### 1.4 Frontend Deployment

```bash
npm install
npm run build
# Deploy dist/ to Vercel or any static host
```

**Verification:** Login page renders; auth flow works end-to-end.

### 1.5 Acceptance Criteria — Phase 1

- [ ] Super admin can register and log in
- [ ] Tenant creation auto-creates wallet with zero balance
- [ ] Role assignment works for all 9 roles
- [ ] Wallet top-up creates ledger entry
- [ ] RLS confirmed: tenant A cannot read tenant B data

---

## Phase 2: P1 — Core Business Features

**Duration:** Week 3–5  
**Goal:** API marketplace, billing, and RBAC fully operational

### 2.1 Deploy API Management Functions

```bash
supabase functions deploy api-product-management
supabase functions deploy api-products
supabase functions deploy api-subscriptions
supabase functions deploy master-security-api
supabase functions deploy super-admin-operations
supabase functions deploy super-admin-auth
supabase functions deploy super-admin-users
```

**Files involved:**
- `supabase/functions/api-product-management/index.ts`
- `supabase/functions/api-products/index.ts`
- `supabase/functions/api-subscriptions/index.ts`
- `supabase/functions/master-security-api/index.ts`
- `supabase/functions/super-admin-*/index.ts`

### 2.2 Deploy Kill Switch Controls

```bash
supabase functions deploy super-admin-locks
supabase functions deploy super-admin-operations
```

**Test kill switch:**
```bash
# Activate global kill switch
curl -X POST .../super-admin-operations/kill-switch/global \
  -H "Authorization: Bearer <SUPER_ADMIN_JWT>" \
  -d '{"active": true, "reason": "Maintenance"}'

# Verify AI calls are blocked
# Deactivate
curl -X POST .../super-admin-operations/kill-switch/global \
  -d '{"active": false}'
```

### 2.3 Deploy Security Functions

```bash
supabase functions deploy master-admin-api
supabase functions deploy master-admin-realtime
supabase functions deploy api-fraud
supabase functions deploy api-kyc
```

### 2.4 Deploy Demo / Health Management

```bash
supabase functions deploy api-demos
supabase functions deploy check-demo-health
supabase functions deploy validate-demo-url
supabase functions deploy fetch-demo-url
supabase functions deploy bulk-verify-demos
supabase functions deploy api-health
supabase functions deploy health-check
```

### 2.5 Payment Gateways

```bash
supabase functions deploy paypal
supabase functions deploy payu

# Set secrets
supabase secrets set PAYPAL_CLIENT_ID=<value>
supabase secrets set PAYPAL_SECRET=<value>
supabase secrets set PAYU_MERCHANT_KEY=<value>
supabase secrets set PAYU_SALT=<value>
```

### 2.6 Acceptance Criteria — Phase 2

- [ ] Tenant admin can create and configure API services
- [ ] API call executes, deducts wallet balance, creates billing record
- [ ] Invoice generated and downloadable
- [ ] Kill switch blocks all AI calls when active
- [ ] PayPal/PayU sandbox payment flow completes
- [ ] API keys can be issued and revoked
- [ ] Audit log records all admin actions

---

## Phase 3: P2 — AI Services & Optimization

**Duration:** Week 6–8  
**Goal:** All AI assistants operational; performance monitoring live

### 3.1 Configure AI Provider Secrets

```bash
supabase secrets set OPENAI_API_KEY=<value>
supabase secrets set ANTHROPIC_API_KEY=<value>
```

### 3.2 Deploy AI Functions (in priority order)

```bash
# Core chat
supabase functions deploy vala-ai-chat
supabase functions deploy safe-assist-ai
supabase functions deploy safe-assist-relay

# Role-specific assistants
supabase functions deploy ai-developer-assistant
supabase functions deploy ai-hr-assistant
supabase functions deploy ai-legal-assistant
supabase functions deploy ai-task-assistant
supabase functions deploy ai-client-success

# Performance & analytics AI
supabase functions deploy ai-performance-analyzer
supabase functions deploy ai-performance-coach
supabase functions deploy ai-crisis-analyzer
supabase functions deploy ai-empathy-engine

# Automation
supabase functions deploy codepilot-ai
supabase functions deploy auto-dev-engine
supabase functions deploy campaign-optimizer
supabase functions deploy ai-seo-automation
supabase functions deploy ai-reseller-assistant
supabase functions deploy ai-rnd-assistant
supabase functions deploy ai-payment-followup
supabase functions deploy ai-server-analyzer
supabase functions deploy ai-auto-heal
```

### 3.3 Deploy Monitoring & Alerts

```bash
supabase functions deploy api-alerts
supabase functions deploy api-performance
supabase functions deploy api-monitor
supabase functions deploy ws-realtime
supabase functions deploy server-manager
supabase functions deploy server-management
supabase functions deploy server-websocket
supabase functions deploy server-worker

# Email notifications
supabase secrets set RESEND_API_KEY=<value>
supabase functions deploy api-email
```

### 3.4 Configure Alert Rules

Via API or admin UI — create threshold rules for:
- Wallet balance < 20% of top-up amount → warning alert
- API error rate > 5% over 5 min → high alert
- Latency P95 > 2000ms → medium alert
- Cost spike > 150% of 7-day average → anomaly alert

### 3.5 Acceptance Criteria — Phase 3

- [ ] All 12 AI assistants respond correctly
- [ ] AI cost is deducted per call from wallet
- [ ] Kill switch immediately blocks AI calls
- [ ] Alerts fire within 60 seconds of threshold breach
- [ ] Realtime wallet balance updates in SPA without refresh
- [ ] Anomaly detection flags unexpected cost spikes

---

## Phase 4: P3 — Testing, Hardening & Production Deployment

**Duration:** Week 9–10  
**Goal:** Full test coverage, security audit passed, production live

### 4.1 Run Test Suites

```bash
# Unit tests (standalone TypeScript runners)
npx ts-node tests/unit/wallet-ledger.test.ts
npx ts-node tests/unit/ai-gateway.test.ts

# Integration tests
npx ts-node tests/integration/end-to-end.test.ts

# Security tests
npx ts-node tests/security/isolation.test.ts
npx ts-node tests/security/rbac.test.ts
npx ts-node tests/security/security-tests.ts  # requires running server
```

**Files involved:**
- `tests/unit/wallet-ledger.test.ts`
- `tests/unit/ai-gateway.test.ts`
- `tests/integration/end-to-end.test.ts`
- `tests/security/isolation.test.ts`
- `tests/security/rbac.test.ts`
- `tests/security/security-tests.ts`

### 4.2 Load Testing

```bash
# k6 load test (requires k6 installed)
k6 run tests/load/k6-load-test.js
k6 run tests/load/k6-extreme-stress.js
```

### 4.3 E2E Browser Tests

```bash
npx cypress run --spec tests/e2e/specs/
```

### 4.4 Security Hardening Checklist

- [ ] All RLS policies reviewed against OWASP guidelines
- [ ] SQL injection tested (see `tests/security/security-tests.ts`)
- [ ] XSS payloads rejected by all input fields
- [ ] JWT tampering tests pass (tampered tokens rejected with 401)
- [ ] Brute force protection active (429 after 10 failed logins)
- [ ] IDOR tests pass (cross-tenant resource access denied)
- [ ] API keys stored as bcrypt hashes only

### 4.5 Production Deployment

#### Vercel (Frontend)

```bash
vercel --prod
```

#### Docker (Full Stack)

```bash
docker build -t softwarevala:latest .
docker run -p 80:80 \
  -e VITE_SUPABASE_URL=<url> \
  -e VITE_SUPABASE_ANON_KEY=<key> \
  softwarevala:latest
```

#### Kubernetes

```bash
kubectl apply -f k8s/
kubectl rollout status deployment/softwarevala
```

### 4.6 Post-Deployment Smoke Tests

```bash
# Health check
curl https://your-domain.com/health

# Auth flow
curl -X POST https://<supabase>/functions/v1/api-auth/login \
  -d '{"email":"admin@test.com","password":"..."}'

# Wallet balance
curl https://<supabase>/functions/v1/api-wallet \
  -H "Authorization: Bearer <JWT>"
```

### 4.7 Acceptance Criteria — Phase 4

- [ ] All unit, integration, and security tests pass
- [ ] Load test: platform handles 500 concurrent users without errors
- [ ] No critical CodeQL findings
- [ ] Zero cross-tenant data leakage confirmed
- [ ] Monitoring dashboard shows all services green
- [ ] Rollback plan documented and tested

---

## Dependency Map

```
Phase 0 ──► Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4
(Secrets)   (Auth+DB)   (APIs+Pay)  (AI+Alerts) (Test+Deploy)
    │            │           │
    │            └──────────►└── Kill Switch must work before AI deploy
    │                            Wallet must work before billing deploy
    └─────────────────────────── All env vars needed before any deploy
```

---

## Rollback Procedures

| Component | Rollback Method |
|-----------|----------------|
| Frontend | Vercel: `vercel rollback` |
| Edge Functions | `supabase functions deploy <name>@<previous-version>` |
| Database migrations | Restore from Supabase point-in-time backup |
| Kill switch emergency | `POST /super-admin-operations/kill-switch/global {"active": true}` |
| Wallet lock emergency | `POST /super-admin-operations/wallet/lock/:tenant_id` |
