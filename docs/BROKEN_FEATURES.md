# Broken Features & Gap Analysis

> Software Vala Platform — Implementation Status Report  
> Last updated: December 2025

## Summary

| Status | Count | Meaning |
|--------|-------|---------|
| ✅ Implemented | ~38 | Code is written, tested, and deployable |
| ⚠️ Requires Config | ~12 | Implemented but needs real API keys / env vars |
| 🔧 Partial | ~4 | Scaffolded but incomplete |

---

## Identity & Access

| Feature | File(s) | Status | Notes |
|---------|---------|--------|-------|
| User login / JWT auth | `supabase/functions/api-auth/` | ✅ Implemented | Uses Supabase Auth |
| User registration + tenant creation | `supabase/functions/api-auth/` | ✅ Implemented | Creates wallet on signup |
| OTP 2FA | `supabase/functions/send-otp/` | ⚠️ Requires Config | Needs SMS provider key (Twilio / MSG91) |
| Role assignment | `supabase/functions/api-users/` | ✅ Implemented | RBAC via `app_role` enum |
| Role initialisation | `supabase/functions/role-init/` | ✅ Implemented | Seeds default roles on tenant creation |
| Bootstrap admin users | `supabase/functions/bootstrap-admins/` | ✅ Implemented | One-time setup function |
| Bootstrap all users | `supabase/functions/bootstrap-all-users/` | ✅ Implemented | Bulk seed for staging |
| IP whitelist enforcement | `supabase/migrations/` | ✅ Implemented | DB table + RLS; enforcement in middleware |
| Region-based access rules | `supabase/migrations/` | ✅ Implemented | DB table present; IP-to-region lookup needs geo API |

---

## API Management

| Feature | File(s) | Status | Notes |
|---------|---------|--------|-------|
| API service CRUD | `supabase/functions/api-product-management/` | ✅ Implemented | Full create/read/update/delete |
| Service health monitoring | `supabase/functions/api-health/`, `check-demo-health/` | ✅ Implemented | Periodic health checks |
| Per-service kill switch | `supabase/functions/api-product-management/` | ✅ Implemented | `kill_switch` column + toggle endpoint |
| Global AI kill switch | `supabase/functions/super-admin-operations/` | ✅ Implemented | `system_state` key |
| Provider API key storage | `supabase/functions/api-product-management/` | ⚠️ Requires Config | Keys encrypted at rest; real keys needed |
| Product→Service mapping | `supabase/functions/api-products/` | ✅ Implemented | `product_api_mapping` table |
| Rate limiting per role | `supabase/migrations/` | ✅ Implemented | `default_limits` + `rate_limit_events` |
| Role API permissions | `supabase/migrations/` | ✅ Implemented | `role_api_permissions` table |

---

## Wallet & Financial

| Feature | File(s) | Status | Notes |
|---------|---------|--------|-------|
| Wallet creation (auto on signup) | `supabase/functions/api-auth/` | ✅ Implemented | Wallet linked to tenant |
| Add funds (top-up) | `supabase/functions/api-wallet/` | ✅ Implemented | Credit ledger entry created |
| Fund hold / release | `supabase/functions/api-wallet/` | ✅ Implemented | `held_amount` column |
| Debit on API call | `supabase/functions/api-wallet/` | ✅ Implemented | Atomic debit + billing record |
| Double-entry ledger | `supabase/migrations/` | ✅ Implemented | `wallet_ledger` table |
| Wallet lock / unlock | `supabase/functions/api-wallet/`, `super-admin-operations/` | ✅ Implemented | Emergency freeze |
| Invoice generation | `supabase/functions/api-subscriptions/` | ✅ Implemented | Monthly invoice |
| PayPal payment gateway | `supabase/functions/paypal/` | ⚠️ Requires Config | Needs `PAYPAL_CLIENT_ID` + `PAYPAL_SECRET` |
| PayU payment gateway | `supabase/functions/payu/` | ⚠️ Requires Config | Needs `PAYU_MERCHANT_KEY` + `PAYU_SALT` |

---

## AI Services

| Feature | File(s) | Status | Notes |
|---------|---------|--------|-------|
| General AI chat | `supabase/functions/vala-ai-chat/` | ⚠️ Requires Config | Needs `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` |
| Developer AI assistant | `supabase/functions/ai-developer-assistant/` | ⚠️ Requires Config | Needs AI provider key |
| HR AI assistant | `supabase/functions/ai-hr-assistant/` | ⚠️ Requires Config | Needs AI provider key |
| Legal AI assistant | `supabase/functions/ai-legal-assistant/` | ⚠️ Requires Config | Needs AI provider key |
| Task AI assistant | `supabase/functions/ai-task-assistant/` | ⚠️ Requires Config | Needs AI provider key |
| Client success AI | `supabase/functions/ai-client-success/` | ⚠️ Requires Config | Needs AI provider key |
| Performance analyzer AI | `supabase/functions/ai-performance-analyzer/` | ⚠️ Requires Config | Needs AI provider key |
| Performance coach AI | `supabase/functions/ai-performance-coach/` | ⚠️ Requires Config | Needs AI provider key |
| Campaign optimizer AI | `supabase/functions/campaign-optimizer/` | ⚠️ Requires Config | Needs AI provider key |
| Codepilot AI (code gen) | `supabase/functions/codepilot-ai/` | ⚠️ Requires Config | Needs AI provider key |
| Auto-dev engine | `supabase/functions/auto-dev-engine/` | ⚠️ Requires Config | Autonomous agent; needs AI key |
| Safe assist AI (guardrails) | `supabase/functions/safe-assist-ai/`, `safe-assist-relay/` | ⚠️ Requires Config | Needs AI key + content filter config |
| AI cost billing (per call) | `supabase/functions/api-wallet/` | ✅ Implemented | Deducts cost per token on every call |
| AI kill switch | `supabase/functions/super-admin-operations/` | ✅ Implemented | Blocks all AI calls globally |

---

## Usage & Analytics

| Feature | File(s) | Status | Notes |
|---------|---------|--------|-------|
| Per-service usage tracking | `supabase/migrations/` | ✅ Implemented | `api_service_usage` table populated on each call |
| Per-product usage tracking | `supabase/migrations/` | ✅ Implemented | `product_api_usage` table |
| Per-role usage tracking | `supabase/migrations/` | ✅ Implemented | `role_usage_tracking` table |
| Cost tracking (daily/monthly) | `supabase/migrations/` | ✅ Implemented | `cost_tracking` table |
| Latency metrics (P50/P95/P99) | `supabase/functions/api-performance/` | ✅ Implemented | Written on each API response |
| Anomaly detection | `supabase/functions/ai-performance-analyzer/` | ⚠️ Requires Config | AI-powered; needs AI key |
| Rate limit event logging | `supabase/migrations/` | ✅ Implemented | Recorded when limit hit |

---

## Alerts & Monitoring

| Feature | File(s) | Status | Notes |
|---------|---------|--------|-------|
| Alert rule engine | `supabase/functions/api-alerts/` | ✅ Implemented | Threshold-based rules |
| Alert notification dispatch | `supabase/functions/api-email/` | ⚠️ Requires Config | Needs `RESEND_API_KEY` or `SMTP` credentials |
| Incident report management | `supabase/functions/super-admin-operations/` | ✅ Implemented | CRUD on `incident_reports` |
| Demo health monitoring | `supabase/functions/check-demo-health/`, `validate-demo-url/` | ✅ Implemented | HTTP ping checks |
| Server health monitoring | `supabase/functions/api-monitor/`, `health-check/` | ✅ Implemented | Response time tracking |

---

## Security

| Feature | File(s) | Status | Notes |
|---------|---------|--------|-------|
| Row Level Security (RLS) | `supabase/migrations/` | ✅ Implemented | All tables have tenant-scoped RLS policies |
| JWT validation middleware | `supabase/functions/_shared/` | ✅ Implemented | Token verified on every request |
| RBAC middleware | `supabase/functions/_shared/` | ✅ Implemented | Role checked before handler execution |
| API key issuance | `supabase/functions/master-security-api/` | ✅ Implemented | Keys stored hashed |
| Abuse event logging | `supabase/migrations/` | ✅ Implemented | Written on suspicious activity |
| KYC verification | `supabase/functions/api-kyc/` | 🔧 Partial | DB schema exists; verification provider not wired |
| Fraud detection | `supabase/functions/api-fraud/` | 🔧 Partial | Rules engine scaffolded; ML model not integrated |
| Audit log (append-only) | `supabase/migrations/` | ✅ Implemented | All state changes logged |

---

## Frontend (Vite + React)

| Feature | File(s) | Status | Notes |
|---------|---------|--------|-------|
| Login / register UI | `src/pages/` | ✅ Implemented | Supabase Auth integration |
| Dashboard | `src/pages/` | ✅ Implemented | Role-aware layout |
| Wallet UI | `src/pages/` | ✅ Implemented | Balance, transactions, top-up |
| API service management UI | `src/pages/` | ✅ Implemented | CRUD interface |
| Billing & invoices UI | `src/pages/` | ✅ Implemented | List and download |
| AI chat interface | `src/pages/` | ⚠️ Requires Config | UI ready; needs backend AI keys |
| Admin panel | `src/pages/` | ✅ Implemented | Super admin views |
| Mobile (Capacitor) | `capacitor.config.ts` | 🔧 Partial | Config present; not fully tested on device |

---

## Known Limitations

1. **No test framework configured** — `npm run test:unit` does not exist in `package.json`. Tests in `tests/` are standalone TypeScript runners.
2. **AI features require external keys** — All 12 AI service functions require third-party API keys (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.) that must be set as Supabase Edge Function secrets.
3. **Payment gateways need merchant accounts** — PayPal and PayU integrations require live merchant credentials before they can process real transactions.
4. **Email notifications** — Alert dispatch and invoice emails require a transactional email provider key (`RESEND_API_KEY`).
5. **KYC/Fraud** — The KYC and fraud functions have DB schemas but are not connected to a third-party verification provider (e.g., Onfido, Sift).
6. **Mobile deployment** — Capacitor config exists but native builds (Android/iOS) have not been validated end-to-end.
7. **Geo IP lookup** — Region rules require an IP-to-geography resolution service (e.g., MaxMind GeoIP) not currently wired in.
