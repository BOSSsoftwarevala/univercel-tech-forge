# RBAC Permission Matrix

> Software Vala Platform — Role-Based Access Control  
> ✅ Allowed | ❌ Denied | ⚠️ Own data only | 🔒 Super Admin only

## Roles

| Abbreviation | Full Role Name |
|---|---|
| **SA** | Super Admin |
| **TA** | Tenant Admin |
| **PM** | Product Manager |
| **DEV** | Developer |
| **RES** | Reseller |
| **FRA** | Franchise |
| **USR** | User |
| **SUP** | Support |
| **FIN** | Finance |

---

## Identity & Access Management

| Feature | SA | TA | PM | DEV | RES | FRA | USR | SUP | FIN |
|---------|----|----|-----|-----|-----|-----|-----|-----|-----|
| View own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Update own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| List all users (tenant) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Create user | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update any user | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ | ❌ |
| Delete user | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Assign role to user | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View user permissions | ✅ | ✅ | ❌ | ⚠️ | ❌ | ❌ | ⚠️ | ✅ | ❌ |
| Manage roles (CRUD) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create tenant | 🔒 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update tenant settings | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## API Services

| Feature | SA | TA | PM | DEV | RES | FRA | USR | SUP | FIN |
|---------|----|----|-----|-----|-----|-----|-----|-----|-----|
| List API services | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create API service | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update API service config | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete API service | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Toggle service kill switch | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View service health | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage provider API keys | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Execute API call | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Set rate limits | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage IP whitelist | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage region rules | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Wallet & Finance

| Feature | SA | TA | PM | DEV | RES | FRA | USR | SUP | FIN |
|---------|----|----|-----|-----|-----|-----|-----|-----|-----|
| View wallet balance | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Add funds (top-up) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Place fund hold | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Release hold | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Debit wallet | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View transaction history | ✅ | ✅ | ❌ | ❌ | ⚠️ | ⚠️ | ❌ | ❌ | ✅ |
| View ledger entries | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Lock wallet (emergency) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Unlock wallet | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Billing & Invoicing

| Feature | SA | TA | PM | DEV | RES | FRA | USR | SUP | FIN |
|---------|----|----|-----|-----|-----|-----|-----|-----|-----|
| View billing records | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Create billing record | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View invoices | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Generate invoice | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Mark invoice paid | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View cost summary | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Export financial reports | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |

---

## Usage & Analytics

| Feature | SA | TA | PM | DEV | RES | FRA | USR | SUP | FIN |
|---------|----|----|-----|-----|-----|-----|-----|-----|-----|
| View own usage stats | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| View tenant-wide usage | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| View usage by service | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View latency metrics | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View cost tracking | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| View anomaly reports | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View rate limit events | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Alerts & Monitoring

| Feature | SA | TA | PM | DEV | RES | FRA | USR | SUP | FIN |
|---------|----|----|-----|-----|-----|-----|-----|-----|-----|
| View alerts | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Create manual alert | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Resolve alert | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Manage alert rules | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Set alert thresholds | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Configure notifications | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View incident reports | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Create incident report | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |

---

## Security & API Keys

| Feature | SA | TA | PM | DEV | RES | FRA | USR | SUP | FIN |
|---------|----|----|-----|-----|-----|-----|-----|-----|-----|
| View own API keys | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create API key | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Revoke any API key (tenant) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View access logs | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| View abuse events | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |

---

## Audit & Compliance

| Feature | SA | TA | PM | DEV | RES | FRA | USR | SUP | FIN |
|---------|----|----|-----|-----|-----|-----|-----|-----|-----|
| View audit logs (own tenant) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| View admin action logs | 🔒 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View config change logs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Export audit trail | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Emergency / Kill Switch

| Feature | SA | TA | PM | DEV | RES | FRA | USR | SUP | FIN |
|---------|----|----|-----|-----|-----|-----|-----|-----|-----|
| Activate global kill switch | 🔒 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Activate per-service kill switch | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View kill switch status | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Deactivate kill switch | 🔒 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## System Configuration

| Feature | SA | TA | PM | DEV | RES | FRA | USR | SUP | FIN |
|---------|----|----|-----|-----|-----|-----|-----|-----|-----|
| View system settings | 🔒 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update system settings | 🔒 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View default limits | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update default limits | 🔒 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## AI Services

| Feature | SA | TA | PM | DEV | RES | FRA | USR | SUP | FIN |
|---------|----|----|-----|-----|-----|-----|-----|-----|-----|
| Access AI chat (general) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Access Developer AI | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Access HR AI | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Access Legal AI | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Access Finance AI | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Access Codepilot AI | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Access Campaign Optimizer | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Fully allowed for this role |
| ❌ | Denied — 403 Forbidden returned |
| ⚠️ | Allowed for own data only (RLS filter applied) |
| 🔒 | Super Admin only — hardcoded in middleware |
