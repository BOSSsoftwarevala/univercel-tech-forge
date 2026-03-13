# Software Vala – Security Deployment Checklist

Use this checklist before deploying to production.
Check each item and record who verified it and when.

---

## 1. Environment & Secrets

- [ ] `.env.production` created from `.env.production.example`
- [ ] All `VITE_` vars are non-secret (anon keys only)
- [ ] Service-role key is **not** in any frontend bundle
- [ ] Secrets scanned with `trufflehog` or similar – no leaks found
- [ ] Key rotation schedule set (90-day reminder configured)

---

## 2. Authentication & 2FA

- [ ] 2FA (TOTP) required for `boss_owner`, `master`, `super_admin`, `ceo` roles
- [ ] Backup codes generated and securely stored by admin
- [ ] OTP rate limiting active (max 5 attempts / 5 min)
- [ ] Session timeout configured (`VITE_SESSION_TIMEOUT_MINUTES`)
- [ ] Concurrent session limit enforced (`VITE_MAX_CONCURRENT_SESSIONS`)
- [ ] Device fingerprinting active for privileged roles
- [ ] Force-logout mechanism tested and working

---

## 3. Database & RLS

- [ ] RLS enabled on ALL public schema tables
- [ ] `supabase/policies/rls-policies.sql` applied to production DB
- [ ] Policies reviewed by a second engineer
- [ ] No `SECURITY DEFINER` functions grant unexpected privilege escalation
- [ ] Service-role key usage audited – only used by server-side functions

---

## 4. API Security

- [ ] Rate limiting active on all endpoints (Supabase Edge or middleware)
- [ ] JWT validation enforced (no `alg=none` accepted)
- [ ] CORS configured to `ALLOWED_ORIGINS` only
- [ ] No sensitive data returned in error messages
- [ ] Input validation / sanitisation in place for all user-supplied data

---

## 5. Transport Security

- [ ] HTTPS enforced (HSTS header with `max-age ≥ 1 year`)
- [ ] TLS 1.2+ only (TLS 1.0/1.1 disabled)
- [ ] Valid, non-expired TLS certificate
- [ ] Certificate chain complete

---

## 6. Security Headers

- [ ] `Content-Security-Policy` header set (verify via `curl -I`)
- [ ] `X-Frame-Options: DENY` set
- [ ] `X-Content-Type-Options: nosniff` set
- [ ] `Referrer-Policy: no-referrer` set
- [ ] `Permissions-Policy` restricts camera/mic/geo/payment

---

## 7. Audit Logging

- [ ] Audit log table enabled in Supabase
- [ ] RLS on `audit_logs` – no UPDATE/DELETE for regular users
- [ ] Sensitive data masking verified in log entries
- [ ] Checksums written with each audit log entry
- [ ] Log retention policy configured (≥ 90 days)

---

## 8. Container / Infrastructure

- [ ] Docker image built from hardened `Dockerfile`
- [ ] Container runs as non-root user
- [ ] Read-only root filesystem enabled
- [ ] All unnecessary Linux capabilities dropped
- [ ] Image scanned with Trivy – no CRITICAL CVEs
- [ ] Network isolation: backend services not reachable from internet directly

---

## 9. Monitoring & Alerting

- [ ] Real-time alerts configured for `critical` audit events
- [ ] Uptime monitoring active
- [ ] Error rate alerting configured
- [ ] Security alert channel notified for failed 2FA, brute force, etc.

---

## 10. Compliance (GDPR / SOC2)

- [ ] Privacy policy up to date
- [ ] Data retention policies documented and automated
- [ ] Data export endpoint tested (GDPR right of access)
- [ ] Consent management implemented for marketing communications
- [ ] Data Processing Agreement signed with Supabase / other processors

---

## 11. Penetration Testing

- [ ] Pre-deployment pentest completed (see `security/penetration-test-guide.md`)
- [ ] All CRITICAL and HIGH findings remediated
- [ ] Pentest report stored securely (not in this repository)
- [ ] Next pentest scheduled (recommend annually or after major releases)

---

## Sign-Off

| Role | Name | Date | Signature |
|---|---|---|---|
| Lead Developer | | | |
| Security Reviewer | | | |
| Product Owner | | | |
