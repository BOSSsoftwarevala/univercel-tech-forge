# API Route Map

> Software Vala Platform — Complete Endpoint Reference  
> Format: `METHOD /function/path → Handler → Primary DB Tables`

All endpoints are Supabase Edge Functions deployed under:  
`https://<project>.supabase.co/functions/v1/<function-name>`

---

## 1. Authentication (`api-auth`)

| Method | Path | Handler | DB Tables | Notes |
|--------|------|---------|-----------|-------|
| POST | `/api-auth/login` | `handleLogin` | `users`, `audit_logs` | Email + password; returns JWT |
| POST | `/api-auth/register` | `handleRegister` | `users`, `tenants`, `wallets` | Creates tenant + wallet |
| POST | `/api-auth/logout` | `handleLogout` | `audit_logs` | Invalidates session |
| POST | `/api-auth/refresh` | `handleRefresh` | `users` | Rotates access token |
| POST | `/api-auth/forgot-password` | `handleForgotPassword` | `users` | Sends reset email |
| POST | `/api-auth/reset-password` | `handleResetPassword` | `users`, `audit_logs` | Applies new password |
| POST | `/api-auth/verify-otp` | `handleVerifyOtp` | `users` | OTP 2FA verification |
| GET | `/api-auth/me` | `handleGetCurrentUser` | `users`, `roles` | Current user profile |
| PUT | `/api-auth/me` | `handleUpdateProfile` | `users`, `audit_logs` | Update own profile |

---

## 2. Users (`api-users`)

| Method | Path | Handler | DB Tables | Notes |
|--------|------|---------|-----------|-------|
| GET | `/api-users` | `listUsers` | `users`, `roles` | Tenant-scoped user list |
| POST | `/api-users` | `createUser` | `users`, `audit_logs` | Create user in tenant |
| GET | `/api-users/:id` | `getUser` | `users`, `roles` | User details + role |
| PUT | `/api-users/:id` | `updateUser` | `users`, `audit_logs` | Update user fields |
| DELETE | `/api-users/:id` | `deleteUser` | `users`, `audit_logs` | Soft delete |
| POST | `/api-users/:id/assign-role` | `assignRole` | `users`, `roles`, `audit_logs` | RBAC role assignment |
| GET | `/api-users/:id/permissions` | `getUserPermissions` | `roles`, `permissions` | Effective permissions |

---

## 3. API Services (`api-product-management`)

| Method | Path | Handler | DB Tables | Notes |
|--------|------|---------|-----------|-------|
| GET | `/api-product-management/services` | `listServices` | `api_services` | All services for tenant |
| POST | `/api-product-management/services` | `createService` | `api_services`, `audit_logs` | Register new API service |
| GET | `/api-product-management/services/:id` | `getService` | `api_services`, `api_service_health` | Service + health status |
| PUT | `/api-product-management/services/:id` | `updateService` | `api_services`, `audit_logs` | Update config |
| DELETE | `/api-product-management/services/:id` | `deleteService` | `api_services`, `audit_logs` | Deactivate service |
| POST | `/api-product-management/services/:id/kill` | `killService` | `api_services`, `audit_logs` | Toggle kill switch |
| GET | `/api-product-management/services/:id/usage` | `getServiceUsage` | `api_service_usage`, `cost_tracking` | Usage stats |
| POST | `/api-product-management/provider-keys` | `saveProviderKey` | `provider_integrations` | Store API key (encrypted) |
| GET | `/api-product-management/provider-keys` | `listProviderKeys` | `provider_integrations` | List (masked keys) |

---

## 4. Products (`api-products`)

| Method | Path | Handler | DB Tables | Notes |
|--------|------|---------|-----------|-------|
| GET | `/api-products` | `listProducts` | `product_api_mapping`, `api_services` | Product catalogue |
| POST | `/api-products` | `createProduct` | `product_api_mapping`, `audit_logs` | New product |
| GET | `/api-products/:id` | `getProduct` | `product_api_mapping`, `api_services` | Product details |
| PUT | `/api-products/:id` | `updateProduct` | `product_api_mapping`, `audit_logs` | Update mapping |
| DELETE | `/api-products/:id` | `deleteProduct` | `product_api_mapping` | Remove product |
| GET | `/api-products/:id/usage` | `getProductUsage` | `product_api_usage` | Usage by product |
| POST | `/api-products/:id/execute` | `executeProductCall` | `wallet_ledger`, `billing_records` | Billable API call |

---

## 5. Wallet (`api-wallet`)

| Method | Path | Handler | DB Tables | Notes |
|--------|------|---------|-----------|-------|
| GET | `/api-wallet` | `getWallet` | `wallets` | Tenant wallet balance |
| POST | `/api-wallet/fund` | `addFunds` | `wallets`, `wallet_transactions`, `wallet_ledger` | Top-up balance |
| POST | `/api-wallet/hold` | `placeHold` | `wallets`, `wallet_ledger` | Reserve funds |
| POST | `/api-wallet/release` | `releaseHold` | `wallets`, `wallet_ledger` | Release hold |
| POST | `/api-wallet/debit` | `debitWallet` | `wallets`, `wallet_transactions`, `wallet_ledger`, `billing_records` | Charge for service |
| GET | `/api-wallet/transactions` | `listTransactions` | `wallet_transactions` | Transaction history |
| GET | `/api-wallet/ledger` | `getLedger` | `wallet_ledger` | Double-entry ledger |
| POST | `/api-wallet/lock` | `lockWallet` | `wallets`, `audit_logs` | Emergency lock |
| POST | `/api-wallet/unlock` | `unlockWallet` | `wallets`, `audit_logs` | Restore access |
| GET | `/api-wallet/balance-history` | `getBalanceHistory` | `wallet_ledger` | Time-series balance |

---

## 6. Billing (`api-subscriptions`)

| Method | Path | Handler | DB Tables | Notes |
|--------|------|---------|-----------|-------|
| GET | `/api-subscriptions/billing` | `listBillingRecords` | `billing_records` | All charges |
| GET | `/api-subscriptions/invoices` | `listInvoices` | `invoices` | All invoices |
| GET | `/api-subscriptions/invoices/:id` | `getInvoice` | `invoices`, `billing_records` | Invoice detail |
| POST | `/api-subscriptions/invoices/generate` | `generateInvoice` | `invoices`, `billing_records` | Create invoice |
| POST | `/api-subscriptions/invoices/:id/pay` | `markInvoicePaid` | `invoices`, `wallet_transactions` | Record payment |
| GET | `/api-subscriptions/cost-summary` | `getCostSummary` | `cost_tracking` | Monthly cost breakdown |
| GET | `/api-subscriptions/plan` | `getCurrentPlan` | `tenants` | Tenant plan info |

---

## 7. Usage & Analytics (`api-performance`)

| Method | Path | Handler | DB Tables | Notes |
|--------|------|---------|-----------|-------|
| GET | `/api-performance/usage` | `getUsageStats` | `api_service_usage` | Aggregated usage |
| GET | `/api-performance/usage/by-service` | `getUsageByService` | `api_service_usage`, `api_services` | Per-service breakdown |
| GET | `/api-performance/usage/by-role` | `getUsageByRole` | `role_usage_tracking` | Per-role breakdown |
| GET | `/api-performance/latency` | `getLatencyMetrics` | `latency_metrics` | P50/P95/P99 latency |
| GET | `/api-performance/costs` | `getCostTracking` | `cost_tracking` | Cost over time |
| GET | `/api-performance/anomalies` | `getAnomalies` | `anomaly_logs` | Detected anomalies |
| GET | `/api-performance/rate-limits` | `getRateLimitEvents` | `rate_limit_events` | Throttle history |

---

## 8. Alerts (`api-alerts`)

| Method | Path | Handler | DB Tables | Notes |
|--------|------|---------|-----------|-------|
| GET | `/api-alerts` | `listAlerts` | `alerts` | Active/past alerts |
| POST | `/api-alerts` | `createAlert` | `alerts` | Manual alert |
| GET | `/api-alerts/:id` | `getAlert` | `alerts`, `incident_reports` | Alert details |
| PUT | `/api-alerts/:id/resolve` | `resolveAlert` | `alerts`, `audit_logs` | Mark resolved |
| GET | `/api-alerts/rules` | `listAlertRules` | `alert_rules` | All threshold rules |
| POST | `/api-alerts/rules` | `createAlertRule` | `alert_rules` | New rule |
| PUT | `/api-alerts/rules/:id` | `updateAlertRule` | `alert_rules` | Update threshold |
| DELETE | `/api-alerts/rules/:id` | `deleteAlertRule` | `alert_rules` | Remove rule |
| GET | `/api-alerts/thresholds` | `getThresholds` | `alert_thresholds` | Per-metric thresholds |
| PUT | `/api-alerts/thresholds` | `updateThresholds` | `alert_thresholds`, `audit_logs` | Update thresholds |

---

## 9. Security (`master-security-api`)

| Method | Path | Handler | DB Tables | Notes |
|--------|------|---------|-----------|-------|
| GET | `/master-security-api/api-keys` | `listApiKeys` | `api_keys` | Tenant API keys (masked) |
| POST | `/master-security-api/api-keys` | `createApiKey` | `api_keys`, `audit_logs` | Issue new key |
| DELETE | `/master-security-api/api-keys/:id` | `revokeApiKey` | `api_keys`, `audit_logs` | Revoke key |
| GET | `/master-security-api/access-logs` | `getAccessLogs` | `api_access_logs` | API access history |
| GET | `/master-security-api/abuse-events` | `getAbuseEvents` | `abuse_events` | Flagged abuse |
| POST | `/master-security-api/ip-whitelist` | `addIpToWhitelist` | `ip_whitelist`, `audit_logs` | Add trusted IP |
| DELETE | `/master-security-api/ip-whitelist/:id` | `removeIpFromWhitelist` | `ip_whitelist`, `audit_logs` | Remove IP |
| GET | `/master-security-api/ip-whitelist` | `listWhitelistedIps` | `ip_whitelist` | All allowed IPs |
| POST | `/master-security-api/region-rules` | `upsertRegionRule` | `region_rules`, `audit_logs` | Block/allow region |
| GET | `/master-security-api/region-rules` | `listRegionRules` | `region_rules` | All region rules |

---

## 10. Audit (`audit-logs` via `master-admin-api`)

| Method | Path | Handler | DB Tables | Notes |
|--------|------|---------|-----------|-------|
| GET | `/master-admin-api/audit-logs` | `listAuditLogs` | `audit_logs` | Tenant audit trail |
| GET | `/master-admin-api/audit-logs/:id` | `getAuditEntry` | `audit_logs` | Single entry detail |
| GET | `/master-admin-api/admin-actions` | `listAdminActions` | `admin_action_logs` | Admin activity log |
| GET | `/master-admin-api/config-changes` | `listConfigChanges` | `config_change_logs` | Config change history |

---

## 11. Emergency & Kill Switch (`super-admin-operations`)

| Method | Path | Handler | DB Tables | Notes |
|--------|------|---------|-----------|-------|
| POST | `/super-admin-operations/kill-switch/global` | `toggleGlobalKillSwitch` | `system_state`, `admin_action_logs` | Disable all AI APIs |
| POST | `/super-admin-operations/kill-switch/service/:id` | `toggleServiceKillSwitch` | `api_services`, `admin_action_logs` | Disable single service |
| GET | `/super-admin-operations/kill-switch/status` | `getKillSwitchStatus` | `system_state`, `api_services` | Current switch states |
| POST | `/super-admin-operations/wallet/lock/:tenant_id` | `lockTenantWallet` | `wallets`, `admin_action_logs` | Emergency wallet lock |
| POST | `/super-admin-operations/wallet/unlock/:tenant_id` | `unlockTenantWallet` | `wallets`, `admin_action_logs` | Restore wallet |
| POST | `/super-admin-operations/incident` | `createIncident` | `incident_reports`, `alerts` | File incident report |
| PUT | `/super-admin-operations/incident/:id` | `updateIncident` | `incident_reports` | Update incident status |
| GET | `/super-admin-operations/system-health` | `getSystemHealth` | `system_state`, `api_service_health` | Platform-wide health |

---

## 12. Settings & Config (`api-system-event`)

| Method | Path | Handler | DB Tables | Notes |
|--------|------|---------|-----------|-------|
| GET | `/api-system-event/settings` | `getSettings` | `system_state` | Platform settings |
| PUT | `/api-system-event/settings` | `updateSettings` | `system_state`, `config_change_logs` | Update setting |
| GET | `/api-system-event/defaults` | `getDefaultLimits` | `default_limits` | Role-based defaults |
| PUT | `/api-system-event/defaults/:role` | `updateDefaultLimits` | `default_limits`, `config_change_logs` | Update role limits |
| GET | `/api-system-event/notifications` | `getNotificationPrefs` | `notification_preferences` | Notification config |
| PUT | `/api-system-event/notifications` | `updateNotificationPrefs` | `notification_preferences` | Update preferences |

---

## 13. AI Services

| Method | Path | Handler | DB Tables | Notes |
|--------|------|---------|-----------|-------|
| POST | `/vala-ai-chat/message` | `handleChat` | `wallet_ledger`, `billing_records`, `audit_logs` | General AI chat |
| POST | `/ai-developer-assistant/ask` | `handleDevQuery` | `billing_records` | Developer AI helper |
| POST | `/ai-hr-assistant/ask` | `handleHrQuery` | `billing_records` | HR AI helper |
| POST | `/ai-legal-assistant/ask` | `handleLegalQuery` | `billing_records` | Legal AI helper |
| POST | `/ai-task-assistant/ask` | `handleTaskQuery` | `billing_records` | Task AI helper |
| POST | `/ai-client-success/ask` | `handleClientQuery` | `billing_records` | Client success AI |
| POST | `/ai-performance-analyzer/analyze` | `analyzePerformance` | `api_service_usage`, `latency_metrics` | AI perf analysis |
| POST | `/ai-performance-coach/coach` | `coachUser` | `role_usage_tracking` | Usage coaching |
| POST | `/codepilot-ai/generate` | `generateCode` | `billing_records`, `audit_logs` | Code generation |
| POST | `/safe-assist-ai/query` | `handleSafeQuery` | `audit_logs` | Guardrailed AI chat |
| POST | `/campaign-optimizer/optimize` | `optimizeCampaign` | `billing_records` | Marketing optimizer |
| POST | `/auto-dev-engine/run` | `runAutodev` | `billing_records`, `audit_logs` | Autonomous dev agent |

---

## 14. Demos (`api-demos`)

| Method | Path | Handler | DB Tables | Notes |
|--------|------|---------|-----------|-------|
| GET | `/api-demos` | `listDemos` | `demos` | All active demos |
| POST | `/api-demos` | `createDemo` | `demos`, `audit_logs` | Register demo |
| GET | `/api-demos/:id` | `getDemo` | `demos`, `demo_health` | Demo details |
| PUT | `/api-demos/:id` | `updateDemo` | `demos`, `audit_logs` | Update demo |
| DELETE | `/api-demos/:id` | `deleteDemo` | `demos` | Remove demo |
| POST | `/api-demos/:id/click` | `trackClick` | `demo_clicks` | Record click |
| GET | `/api-demos/:id/health` | `getDemoHealth` | `demo_health` | Health status |

---

## Request / Response Conventions

**All protected endpoints require:**
```
Authorization: Bearer <supabase_jwt>
Content-Type: application/json
```

**Standard success response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 100 }
}
```

**Standard error response:**
```json
{
  "success": false,
  "error": "Human-readable message",
  "code": "ERROR_CODE",
  "details": { ... }
}
```

**Common HTTP status codes:**

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Forbidden (RBAC) |
| 404 | Not found |
| 429 | Rate limited |
| 500 | Internal error |

---

## Endpoint Count Summary

| Group | Count |
|-------|-------|
| Authentication | 9 |
| Users | 7 |
| API Services | 9 |
| Products | 7 |
| Wallet | 10 |
| Billing | 7 |
| Usage & Analytics | 7 |
| Alerts | 10 |
| Security | 10 |
| Audit | 4 |
| Emergency / Kill Switch | 8 |
| Settings & Config | 6 |
| AI Services | 12 |
| Demos | 7 |
| **Total** | **113** |
