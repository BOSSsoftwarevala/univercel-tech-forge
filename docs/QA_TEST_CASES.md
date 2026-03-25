# Software Vala - Comprehensive QA Test Cases

## Overview
This document contains 500+ test cases covering all modules, security rules, and workflows for the Software Vala ecosystem.

---

## Section 1: Authentication & Role Access (TC-001 to TC-050)

### Login/Logout

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-001 | Auth | Valid login with email/password | User account exists | 1. Navigate to login 2. Enter valid credentials 3. Click login | User logged in, redirected to dashboard | Critical |
| TC-002 | Auth | Invalid email format | None | 1. Enter invalid email format 2. Click login | Error: "Please enter a valid email" | High |
| TC-003 | Auth | Invalid password | User exists | 1. Enter valid email 2. Enter wrong password 3. Click login | Error: "Invalid credentials" | Critical |
| TC-004 | Auth | Empty email field | None | 1. Leave email empty 2. Click login | Error: "Email is required" | High |
| TC-005 | Auth | Empty password field | None | 1. Enter email 2. Leave password empty 3. Click login | Error: "Password is required" | High |
| TC-006 | Auth | Successful logout | User logged in | 1. Click profile dropdown 2. Click logout | User logged out, redirected to login | Critical |
| TC-007 | Auth | Session persistence | User logged in | 1. Close browser 2. Reopen and navigate to app | Session restored if not expired | Medium |
| TC-008 | Auth | Session expiry | User logged in, session expired | 1. Wait for session timeout 2. Try any action | Redirected to login with message | High |
| TC-009 | Auth | Multiple login attempts - rate limit | None | 1. Attempt 5+ failed logins | Account temporarily locked, rate limit message | Critical |
| TC-010 | Auth | Password complexity validation | None | 1. Register with weak password | Error: Password requirements not met | High |

### IP Restriction

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-011 | Auth/IP | Franchise login from authorized IP | IP whitelisted | 1. Login from whitelisted IP | Login successful | Critical |
| TC-012 | Auth/IP | Franchise login from unauthorized IP | IP not whitelisted | 1. Login from non-whitelisted IP | Error: "Login not allowed from this location" | Critical |
| TC-013 | Auth/IP | Reseller login from authorized IP | IP whitelisted | 1. Login from whitelisted IP | Login successful | Critical |
| TC-014 | Auth/IP | Reseller login from unauthorized IP | IP not whitelisted | 1. Login from non-whitelisted IP | Error: "Login not allowed from this location" | Critical |
| TC-015 | Auth/IP | Prime user login from authorized IP | IP whitelisted | 1. Login from whitelisted IP | Login successful | Critical |
| TC-016 | Auth/IP | Prime user login from unauthorized IP | IP not whitelisted | 1. Login from non-whitelisted IP | Error: "Login not allowed from this location" | Critical |
| TC-017 | Auth/IP | VPN detection and block | VPN detected | 1. Connect via VPN 2. Attempt login | Error: "VPN connections are not allowed" | Critical |
| TC-018 | Auth/IP | IP whitelist update by admin | Admin logged in | 1. Add new IP to whitelist | IP added successfully | High |
| TC-019 | Auth/IP | Multi-IP login attempt (same user) | User logged in from IP1 | 1. Attempt login from IP2 | Previous session terminated, warning logged | Critical |
| TC-020 | Auth/IP | Device lock enforcement | Device registered | 1. Login from new device | Error: "Device not registered" | Critical |

### Role-Based Access

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-021 | RBAC | Super admin access to all modules | Super admin logged in | 1. Navigate to each module | All modules accessible | Critical |
| TC-022 | RBAC | Franchise access limited modules | Franchise logged in | 1. Try accessing developer panel | Access denied | Critical |
| TC-023 | RBAC | Reseller cannot access finance | Reseller logged in | 1. Navigate to /finance | Access denied, redirected | Critical |
| TC-024 | RBAC | Developer cannot access admin | Developer logged in | 1. Navigate to /admin | Access denied | Critical |
| TC-025 | RBAC | Influencer limited to clicks panel | Influencer logged in | 1. Try accessing lead management | Access denied | Critical |
| TC-026 | RBAC | Prime user priority indicators | Prime logged in | 1. View dashboard | Priority badge visible | High |
| TC-027 | RBAC | Sidebar shows role-specific modules | Any role | 1. Login 2. Check sidebar | Only permitted modules shown | High |
| TC-028 | RBAC | Hidden modules not accessible via URL | Developer | 1. Directly enter /admin URL | Access denied | Critical |
| TC-029 | RBAC | API endpoint role validation | Developer | 1. Call admin-only API | 403 Forbidden | Critical |
| TC-030 | RBAC | Super admin can override all | Super admin | 1. Access any restricted feature | Access granted | Critical |

### Masked Identity

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-031 | Masking | Email masking on display | User with email | 1. View user profile | Email shows as j***@e***.com | Critical |
| TC-032 | Masking | Phone masking on display | User with phone | 1. View user profile | Phone shows as +91-98***XXX12 | Critical |
| TC-033 | Masking | Developer cannot see client identity | Developer viewing task | 1. Open assigned task | Client info masked | Critical |
| TC-034 | Masking | Masking persists in exports | Any export | 1. Export data | Masked data in export | Critical |
| TC-035 | Masking | Masking in API responses | API call | 1. Fetch user data | Response contains masked values | Critical |
| TC-036 | Masking | Admin can view unmasked (privilege) | Super admin | 1. View any user | Option to reveal real data | High |
| TC-037 | Masking | Masking in internal chat | Chat active | 1. Send message | Sender name masked for non-admin | Critical |
| TC-038 | Masking | Masking indicator in header | Any user | 1. Check header | Masking indicator visible | Medium |
| TC-039 | Masking | Social media ID masking | User with social | 1. View profile | Social IDs masked | High |
| TC-040 | Masking | Masking audit log | Admin | 1. Check audit logs | Masking actions logged | High |

### Session & Security

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-041 | Session | Concurrent session limit | User logged in | 1. Login from second device | First session terminated | High |
| TC-042 | Session | Force logout by admin | Admin logged in | 1. Force logout any user | User session terminated | High |
| TC-043 | Session | Device list visible | User logged in | 1. View session/devices | All active devices shown | Medium |
| TC-044 | Session | Terminate specific device | User logged in | 1. Terminate one device | Only that session ended | High |
| TC-045 | Security | SQL injection attempt | None | 1. Enter SQL in login fields | Input sanitized, no effect | Critical |
| TC-046 | Security | XSS attack attempt | None | 1. Enter script tags | Script escaped, not executed | Critical |
| TC-047 | Security | CSRF token validation | Any form | 1. Submit form | CSRF token validated | Critical |
| TC-048 | Security | JWT token tampering | Valid JWT | 1. Modify JWT payload | Token rejected | Critical |
| TC-049 | Security | Brute force protection | None | 1. 10+ failed login attempts | Account locked 15 mins | Critical |
| TC-050 | Security | Password reset flow | Valid email | 1. Request reset 2. Use link | Password updated securely | High |

---

## Section 2: Role Dashboards (TC-051 to TC-120)

### Super Admin Dashboard

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-051 | Dashboard | All 21 KPI cards display | Super admin | 1. View dashboard | All KPIs visible with live data | High |
| TC-052 | Dashboard | Live world map loads | Super admin | 1. View dashboard | Map renders with branch points | Medium |
| TC-053 | Dashboard | Activity timeline updates | Super admin | 1. Create new lead | Timeline shows new entry | High |
| TC-054 | Dashboard | AI insights panel | Super admin | 1. View AI panel | Suggestions/risks displayed | Medium |
| TC-055 | Dashboard | Total leads count accurate | Super admin | 1. Compare with DB | Count matches database | High |
| TC-056 | Dashboard | Demo up/down status | Super admin | 1. View demo status | Shows accurate up/down count | High |
| TC-057 | Dashboard | Buzzer unresolved count | Super admin | 1. Create unresolved buzzer | Count increments | High |
| TC-058 | Dashboard | Region heatmap hover | Super admin | 1. Hover region on map | Popup with branch details | Medium |
| TC-059 | Dashboard | Fraud alerts visible | Super admin | 1. Trigger fraud alert | Shows in dashboard | High |
| TC-060 | Dashboard | Prime user load metric | Super admin | 1. Add prime users | Load metric updates | Medium |

### Franchise Dashboard

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-061 | Franchise | Region map shows own territory | Franchise logged in | 1. View dashboard | Only assigned territory shown | High |
| TC-062 | Franchise | Commission dashboard accurate | Franchise | 1. Complete sale | Commission calculated correctly | Critical |
| TC-063 | Franchise | Cannot access other territories | Franchise | 1. Try accessing other region | Access denied | Critical |
| TC-064 | Franchise | Lead distribution grid | Franchise | 1. View leads | Only territory leads shown | High |
| TC-065 | Franchise | Wallet earnings display | Franchise | 1. Earn commission | Balance updates | High |
| TC-066 | Franchise | Request demo access | Franchise | 1. Request demo | Request created for approval | High |
| TC-067 | Franchise | Escalation button works | Franchise | 1. Click escalate | Escalation created | High |
| TC-068 | Franchise | View agreement | Franchise | 1. Click agreement | Agreement PDF opens | Medium |
| TC-069 | Franchise | Territory exclusivity | Franchise | 1. Check territory | Exclusive flag correct | High |
| TC-070 | Franchise | Cannot modify pricing | Franchise | 1. Try changing price | Option not available | Critical |

### Developer Dashboard

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-071 | Developer | Task list visible | Developer | 1. View dashboard | Assigned tasks shown | High |
| TC-072 | Developer | Timer panel works | Developer | 1. Start timer | Timer starts counting | Critical |
| TC-073 | Developer | Promise button visible | Developer | 1. View pending task | Promise button shown | Critical |
| TC-074 | Developer | Client identity hidden | Developer | 1. View task | Client masked | Critical |
| TC-075 | Developer | Performance graphs | Developer | 1. View performance | Graphs render correctly | Medium |
| TC-076 | Developer | Cannot access finance | Developer | 1. Try /finance | Access denied | Critical |
| TC-077 | Developer | Code delivery panel | Developer | 1. Submit code | Delivery recorded | High |
| TC-078 | Developer | Late penalty visible | Developer | 1. Miss deadline | Penalty shown | High |
| TC-079 | Developer | Skill tags display | Developer | 1. View profile | Skills listed | Medium |
| TC-080 | Developer | Chat button (masked) | Developer | 1. Click chat | Chat opens with masked names | High |

### Reseller Dashboard

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-081 | Reseller | AI demo scripts | Reseller | 1. Request script | Script generated | High |
| TC-082 | Reseller | Tracking link panel | Reseller | 1. Generate link | Unique link created | High |
| TC-083 | Reseller | Commission analytics | Reseller | 1. View analytics | Commission data shown | High |
| TC-084 | Reseller | Cannot change pricing | Reseller | 1. Try price change | Option disabled | Critical |
| TC-085 | Reseller | Wallet payout button | Reseller | 1. Request payout | Payout requested | High |
| TC-086 | Reseller | Lead sharing history | Reseller | 1. View history | All shares listed | Medium |
| TC-087 | Reseller | Restricted pricing view | Reseller | 1. View pricing | Only authorized prices shown | Critical |
| TC-088 | Reseller | Demo access restrictions | Reseller | 1. Access demo | Only approved demos shown | High |
| TC-089 | Reseller | Performance metrics | Reseller | 1. View metrics | Sales/conversion shown | High |
| TC-090 | Reseller | Cannot access admin | Reseller | 1. Try /admin | Access denied | Critical |

### Influencer Dashboard

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-091 | Influencer | Click heatmap displays | Influencer | 1. View heatmap | Click distribution shown | Medium |
| TC-092 | Influencer | Conversion tracking | Influencer | 1. Track conversion | Conversions counted | High |
| TC-093 | Influencer | Earnings panel | Influencer | 1. View earnings | Accurate earnings displayed | High |
| TC-094 | Influencer | Anti-fraud alerts | Influencer | 1. Trigger suspicious clicks | Alert shown | Critical |
| TC-095 | Influencer | Link generator | Influencer | 1. Generate link | Unique tracking link created | High |
| TC-096 | Influencer | Fake click detection | Influencer | 1. Simulate bot clicks | Clicks not counted | Critical |
| TC-097 | Influencer | Payout request | Influencer | 1. Request payout | Request submitted | High |
| TC-098 | Influencer | Conversion rate visible | Influencer | 1. Check metrics | Rate calculated correctly | High |
| TC-099 | Influencer | Cannot access leads | Influencer | 1. Try /leads | Access denied | Critical |
| TC-100 | Influencer | Click validation | Influencer | 1. Click from same IP multiple times | Duplicates filtered | Critical |

### Prime User Dashboard

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-101 | Prime | Priority support timeline | Prime | 1. View support | Priority indicator shown | High |
| TC-102 | Prime | Developer connect modal | Prime | 1. Connect to dev | Connection established | High |
| TC-103 | Prime | Fast track delivery icon | Prime | 1. Create task | Fast track option available | High |
| TC-104 | Prime | SLA timer view | Prime | 1. View task | SLA countdown shown | High |
| TC-105 | Prime | Wallet invoice history | Prime | 1. View invoices | All invoices listed | Medium |
| TC-106 | Prime | Priority development | Prime | 1. Submit task | Task prioritized in queue | Critical |
| TC-107 | Prime | Dedicated support | Prime (Gold+) | 1. Request support | Dedicated agent assigned | High |
| TC-108 | Prime | Tier benefits display | Prime | 1. View benefits | Tier-specific benefits shown | Medium |
| TC-109 | Prime | Upgrade option | Prime (Silver) | 1. Click upgrade | Upgrade modal opens | High |
| TC-110 | Prime | SLA breach notification | Prime | 1. SLA breached | Notification received | High |

### Other Role Dashboards

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-111 | Lead Mgr | Lead pipeline visible | Lead Manager | 1. View pipeline | All stages shown | High |
| TC-112 | Task Mgr | Kanban board loads | Task Manager | 1. View board | All columns render | High |
| TC-113 | Demo Mgr | Demo list table | Demo Manager | 1. View demos | All demos listed | High |
| TC-114 | Finance | Wallet reconciliation | Finance | 1. View wallets | Reconciliation data shown | High |
| TC-115 | Marketing | Campaign builder | Marketing | 1. Create campaign | Campaign created | High |
| TC-116 | SEO | Keyword builder | SEO Manager | 1. Research keywords | Results returned | High |
| TC-117 | Client Success | Satisfaction index | CS Manager | 1. View index | Score calculated | Medium |
| TC-118 | Performance | Developer scorecards | Performance Mgr | 1. View scorecards | All developers listed | High |
| TC-119 | Legal | Case registry | Legal | 1. View cases | All cases listed | High |
| TC-120 | HR | Application inbox | HR | 1. View applications | Candidates listed | High |

---

## Section 3: Buzzer & Alert Behavior (TC-121 to TC-160)

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-121 | Buzzer | New lead triggers buzzer | Lead created | 1. Create lead 2. Check buzzer | Buzzer alert active | Critical |
| TC-122 | Buzzer | Unassigned lead 120s buzzer | Lead unassigned | 1. Wait 120 seconds | Buzzer escalates | Critical |
| TC-123 | Buzzer | Task assigned buzzer | Task assigned | 1. Assign task to dev | Developer sees buzzer | High |
| TC-124 | Buzzer | Task overdue buzzer | Task past deadline | 1. Let deadline pass | Overdue buzzer triggers | Critical |
| TC-125 | Buzzer | Demo failure alert | Demo down | 1. Demo health fails | Alert triggers immediately | Critical |
| TC-126 | Buzzer | Wallet low balance | Balance < threshold | 1. Reduce balance | Low balance buzzer | High |
| TC-127 | Buzzer | Promise not accepted | Promise pending 5min | 1. Don't accept promise | Escalation buzzer | Critical |
| TC-128 | Buzzer | Buzzer appears in header | Any buzzer trigger | 1. Trigger any buzzer | Red pulse in header | High |
| TC-129 | Buzzer | Buzzer acknowledgement | Buzzer active | 1. Click acknowledge | Buzzer stops | High |
| TC-130 | Buzzer | Buzzer escalation chain | Buzzer ignored | 1. Ignore buzzer 5min | Escalates to next level | Critical |
| TC-131 | Buzzer | Buzzer reaches super admin | All levels ignored | 1. Ignore all escalations | Super admin notified | Critical |
| TC-132 | Buzzer | Buzzer continues until acknowledged | Any buzzer | 1. Don't acknowledge | Buzzer persists | Critical |
| TC-133 | Buzzer | Multiple buzzers queue | Multiple triggers | 1. Trigger 3 buzzers | All shown in queue | High |
| TC-134 | Buzzer | Buzzer priority levels | High priority event | 1. Trigger urgent buzzer | Urgent shown first | High |
| TC-135 | Buzzer | Buzzer sound notification | Buzzer trigger | 1. Trigger buzzer | Sound plays (if enabled) | Medium |
| TC-136 | Alert | Demo down auto-alert | Demo fails check | 1. Demo becomes unreachable | Alert created | Critical |
| TC-137 | Alert | Demo reroute on failure | Primary demo down | 1. Check demo access | Backup URL used | Critical |
| TC-138 | Alert | Task reassign on failure | Dev unavailable | 1. Dev goes offline | Task reassigned | High |
| TC-139 | Alert | Duplicate login alert | Second login attempt | 1. Login from new device | Alert + session terminate | Critical |
| TC-140 | Alert | Fraud detection alert | Suspicious activity | 1. Trigger fraud signal | Fraud alert created | Critical |
| TC-141 | Alert | SLA breach alert | SLA timer expires | 1. Let SLA expire | Breach alert triggers | High |
| TC-142 | Alert | Payment failure alert | Payment fails | 1. Payment declined | Alert to finance | High |
| TC-143 | Alert | Security breach alert | Unauthorized access | 1. Attempt unauthorized access | Security alert | Critical |
| TC-144 | Alert | System error alert | System error occurs | 1. Trigger error | Admin alert created | High |
| TC-145 | Alert | Escalation to legal | Legal issue detected | 1. Flag legal issue | Legal team alerted | High |
| TC-146 | Notification | Header notification only | Any notification | 1. Trigger notification | Shows only in header | High |
| TC-147 | Notification | No intrusive popups | During work | 1. Working on task | No modal interrupts | High |
| TC-148 | Notification | Notification count badge | Multiple notifs | 1. Trigger 5 notifications | Badge shows 5 | Medium |
| TC-149 | Notification | Click notification clears | Notification exists | 1. Click notification | Notification marked read | Medium |
| TC-150 | Notification | Notification history | Past notifications | 1. View all notifications | History accessible | Medium |
| TC-151 | Buzzer | Regional buzzer routing | Lead in region | 1. Create regional lead | Regional team buzzed | High |
| TC-152 | Buzzer | Role-specific buzzer | Developer task | 1. Create dev task | Only developers buzzed | High |
| TC-153 | Buzzer | Buzzer timeout config | Admin setting | 1. Configure timeout | Timeout applies | Medium |
| TC-154 | Buzzer | Buzzer mute option | User preference | 1. Mute buzzers | Buzzers silent (visual only) | Low |
| TC-155 | Buzzer | Buzzer log/audit | Any buzzer | 1. Check audit log | Buzzer logged | High |
| TC-156 | Alert | Auto-suspend on fraud | Fraud confirmed | 1. Confirm fraud | Account suspended | Critical |
| TC-157 | Alert | Alert email notification | Critical alert | 1. Critical event | Email sent to admin | High |
| TC-158 | Alert | Alert SMS notification | Urgent alert | 1. Urgent event | SMS to on-call | High |
| TC-159 | Alert | Alert webhook | Integration active | 1. Alert triggers | Webhook fired | Medium |
| TC-160 | Alert | Alert resolution tracking | Alert created | 1. Resolve alert | Resolution logged | High |

---

## Section 4: Timer & Promise Workflow (TC-161 to TC-200)

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-161 | Timer | Developer sees promise prompt | Task assigned | 1. Task assigned | Promise modal appears | Critical |
| TC-162 | Timer | Promise acceptance required | Task pending | 1. Try starting without promise | Cannot start timer | Critical |
| TC-163 | Timer | Timer starts after acceptance | Promise accepted | 1. Accept promise 2. Start timer | Timer begins | Critical |
| TC-164 | Timer | Timer pause with reason | Timer running | 1. Pause timer 2. Enter reason | Timer paused, reason saved | High |
| TC-165 | Timer | Limited pause count | Timer paused 3x | 1. Try 4th pause | Pause denied | High |
| TC-166 | Timer | Total pause time tracked | Multiple pauses | 1. Pause multiple times | Total pause time calculated | High |
| TC-167 | Timer | Late penalty calculation | Deadline passed | 1. Complete after deadline | Penalty calculated | Critical |
| TC-168 | Timer | Penalty deducted from wallet | Penalty applied | 1. Check wallet | Penalty amount deducted | Critical |
| TC-169 | Timer | Escalation on overdue | Task overdue | 1. Timer exceeds limit | Escalation triggers | Critical |
| TC-170 | Timer | Escalation chain L1 | Task 30min overdue | 1. Wait 30min | Escalates to team lead | High |
| TC-171 | Timer | Escalation chain L2 | Task 1hr overdue | 1. Wait 1hr | Escalates to manager | High |
| TC-172 | Timer | Escalation chain L3 | Task 2hr overdue | 1. Wait 2hr | Escalates to super admin | Critical |
| TC-173 | Timer | Promise time estimation | Developer accepting | 1. Enter time estimate | Estimate recorded | High |
| TC-174 | Timer | Promise time validation | Invalid time | 1. Enter 0 hours | Error: minimum time required | Medium |
| TC-175 | Timer | Promise time maximum | Unrealistic time | 1. Enter 100 hours | Warning/review required | Medium |
| TC-176 | Timer | Timer stop on completion | Task complete | 1. Mark complete | Timer stops automatically | High |
| TC-177 | Timer | Cannot stop without delivery | Timer running | 1. Try stopping | Must submit code first | High |
| TC-178 | Timer | Timer visible to admin | Timer running | 1. Admin checks | Timer status visible | High |
| TC-179 | Timer | Historical timer logs | Past tasks | 1. View timer history | All logs accessible | Medium |
| TC-180 | Timer | Timer accuracy | 1 hour elapsed | 1. Check timer | Shows ~60 minutes | Medium |
| TC-181 | Promise | Promise button in header | Task pending | 1. Check header | Promise button visible | High |
| TC-182 | Promise | Promise notification to client | Promise made | 1. Accept promise | Client notified | High |
| TC-183 | Promise | Promise breach tracking | Promise missed | 1. Miss promised time | Breach recorded | Critical |
| TC-184 | Promise | Breach count impacts score | Multiple breaches | 1. Breach 3 promises | Performance score drops | High |
| TC-185 | Promise | Promise extension request | Running out of time | 1. Request extension | Extension request created | High |
| TC-186 | Promise | Extension approval | Extension requested | 1. Approve extension | New deadline set | High |
| TC-187 | Promise | Extension denial | Extension requested | 1. Deny extension | Denial logged | High |
| TC-188 | Promise | No promise = no task start | Task assigned | 1. Ignore promise | Timer cannot start | Critical |
| TC-189 | Promise | Promise auto-decline after 30min | Promise pending | 1. Wait 30min | Task auto-escalates | Critical |
| TC-190 | Promise | Multiple task promise queue | Multiple tasks | 1. Assign 3 tasks | Promise each in order | High |
| TC-191 | Timer | Checkpoint submissions | Timer running | 1. Submit checkpoint | Checkpoint logged | High |
| TC-192 | Timer | 25% checkpoint | Timer at 25% | 1. Check progress | 25% checkpoint prompt | Medium |
| TC-193 | Timer | 50% checkpoint | Timer at 50% | 1. Check progress | 50% checkpoint prompt | Medium |
| TC-194 | Timer | 75% checkpoint | Timer at 75% | 1. Check progress | 75% checkpoint prompt | Medium |
| TC-195 | Timer | Missing checkpoint penalty | Checkpoint missed | 1. Skip checkpoint | Minor penalty applied | Medium |
| TC-196 | Timer | Admin pause override | Timer running | 1. Admin pauses | Timer paused (no reason needed) | High |
| TC-197 | Timer | Client visibility (masked) | Timer running | 1. Client views task | Progress % shown, no timer | High |
| TC-198 | Timer | Weekend/holiday handling | Timer during weekend | 1. Timer spans weekend | Business hours calculation | Medium |
| TC-199 | Timer | Concurrent task timers | Multiple active | 1. Start second task | First pauses automatically | High |
| TC-200 | Timer | Timer data export | Admin request | 1. Export timer data | CSV/Excel generated | Low |

---

## Section 5: Wallet & Finance (TC-201 to TC-250)

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-201 | Wallet | Add balance | Admin logged in | 1. Credit user wallet | Balance increases | Critical |
| TC-202 | Wallet | Debit balance | Sufficient balance | 1. Debit wallet | Balance decreases | Critical |
| TC-203 | Wallet | Insufficient balance block | Low balance | 1. Try large debit | Transaction blocked | Critical |
| TC-204 | Wallet | Commission credit | Sale completed | 1. Complete sale | Commission added | Critical |
| TC-205 | Wallet | Developer payout | Balance available | 1. Request payout | Payout processed | Critical |
| TC-206 | Wallet | Refund processing | Refund requested | 1. Process refund | Amount returned to client | Critical |
| TC-207 | Wallet | Monthly invoice generation | End of month | 1. Generate invoices | Invoices created | High |
| TC-208 | Wallet | Double-entry ledger | Any transaction | 1. Check ledger | Debit = Credit entries | Critical |
| TC-209 | Wallet | Transaction immutability | Transaction exists | 1. Try to modify | Modification denied | Critical |
| TC-210 | Wallet | Transaction audit trail | Any transaction | 1. View audit | Complete history shown | High |
| TC-211 | Wallet | Balance accuracy | Multiple transactions | 1. Verify balance | Calculated correctly | Critical |
| TC-212 | Wallet | Currency conversion | Multi-currency | 1. Convert currency | Rate applied correctly | High |
| TC-213 | Wallet | Minimum payout threshold | Below threshold | 1. Request payout | Error: minimum not met | High |
| TC-214 | Wallet | Payout approval workflow | Payout requested | 1. Admin approves | Payout processed | High |
| TC-215 | Wallet | Payout rejection | Payout requested | 1. Admin rejects | Rejection logged | High |
| TC-216 | Wallet | Scheduled payouts | Auto-payout enabled | 1. Scheduled date | Auto-payout executed | High |
| TC-217 | Wallet | Tax deduction | Payout processing | 1. Calculate tax | Tax deducted correctly | High |
| TC-218 | Wallet | GST calculation | Indian transaction | 1. Add GST | 18% GST applied | High |
| TC-219 | Wallet | Commission dispute | Dispute raised | 1. File dispute | Dispute created | High |
| TC-220 | Wallet | Dispute resolution | Dispute exists | 1. Resolve dispute | Resolution logged | High |
| TC-221 | Finance | Franchise commission | Franchise sale | 1. Complete sale | Commission credited | Critical |
| TC-222 | Finance | Reseller commission | Reseller sale | 1. Complete sale | Commission credited | Critical |
| TC-223 | Finance | Override commission | Reseller under franchise | 1. Reseller sale | Override to franchise | High |
| TC-224 | Finance | Influencer commission | Conversion tracked | 1. Lead converts | Influencer credited | High |
| TC-225 | Finance | Developer task payment | Task completed | 1. Complete task | Payment to wallet | Critical |
| TC-226 | Finance | Penalty deduction | Penalty applied | 1. Apply penalty | Amount deducted | Critical |
| TC-227 | Finance | Refund authorization | Refund requested | 1. Authorize refund | Refund approved | High |
| TC-228 | Finance | Chargeback handling | Chargeback received | 1. Process chargeback | Amount recovered | High |
| TC-229 | Finance | Revenue report | Period selected | 1. Generate report | Revenue calculated | High |
| TC-230 | Finance | Expense report | Period selected | 1. Generate report | Expenses calculated | High |
| TC-231 | Finance | Profit/Loss statement | Period selected | 1. Generate P&L | Accurate P&L | High |
| TC-232 | Finance | Balance sheet | Period end | 1. Generate balance sheet | Assets = Liabilities | High |
| TC-233 | Finance | Accounts receivable | Pending payments | 1. View AR | All pending listed | High |
| TC-234 | Finance | Accounts payable | Pending payouts | 1. View AP | All payables listed | High |
| TC-235 | Finance | Cash flow statement | Period selected | 1. Generate cash flow | Inflow/outflow shown | High |
| TC-236 | Finance | Payment gateway integration | Payment initiated | 1. Process payment | Payment succeeds | Critical |
| TC-237 | Finance | Payment failure handling | Payment fails | 1. Payment declines | Retry option shown | High |
| TC-238 | Finance | Recurring payment | Subscription active | 1. Due date arrives | Auto-charge processed | High |
| TC-239 | Finance | Invoice PDF generation | Invoice exists | 1. Download PDF | PDF generated | High |
| TC-240 | Finance | Invoice email | Invoice created | 1. Send invoice | Email delivered | High |
| TC-241 | Finance | Late payment reminder | Overdue invoice | 1. Auto-reminder | Reminder sent | Medium |
| TC-242 | Finance | Credit limit | Credit extended | 1. Exceed limit | Transaction blocked | High |
| TC-243 | Finance | Credit approval | Credit requested | 1. Approve credit | Credit limit set | High |
| TC-244 | Finance | Bulk payout | Multiple payouts | 1. Process batch | All processed | High |
| TC-245 | Finance | Payout reconciliation | Payouts processed | 1. Reconcile | All matched | High |
| TC-246 | Finance | Bank account verification | New bank | 1. Verify account | Micro-deposit verified | High |
| TC-247 | Finance | International payout | Non-INR payout | 1. Process payout | SWIFT/wire processed | High |
| TC-248 | Finance | Transaction limits | Daily limit | 1. Exceed limit | Transaction blocked | High |
| TC-249 | Finance | Fraud prevention | Suspicious txn | 1. Flag transaction | Review required | Critical |
| TC-250 | Finance | Compliance reporting | Quarter end | 1. Generate report | Compliance report ready | High |

---

## Section 6: Demo System (TC-251 to TC-300)

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-251 | Demo | Add demo link | Admin/Demo Mgr | 1. Create demo | Demo added to system | Critical |
| TC-252 | Demo | Multiple login links | Demo exists | 1. Add login link | Multiple logins enabled | High |
| TC-253 | Demo | Click tracking | Demo link shared | 1. Click demo link | Click logged | Critical |
| TC-254 | Demo | Health monitoring | Demo active | 1. Monitor health | Status updated | Critical |
| TC-255 | Demo | Auto-alert on failure | Demo down | 1. Demo becomes unreachable | Alert triggered | Critical |
| TC-256 | Demo | Backup URL failover | Primary down | 1. Access demo | Backup URL served | Critical |
| TC-257 | Demo | Category mapping | Demo exists | 1. Assign category | Category saved | High |
| TC-258 | Demo | Technology tag (PHP) | Demo exists | 1. Tag as PHP | Tag applied | High |
| TC-259 | Demo | Technology tag (Node) | Demo exists | 1. Tag as Node | Tag applied | High |
| TC-260 | Demo | Technology tag (Java) | Demo exists | 1. Tag as Java | Tag applied | High |
| TC-261 | Demo | Uptime percentage | Demo monitored | 1. Check uptime | Percentage calculated | High |
| TC-262 | Demo | Response time tracking | Demo active | 1. Check response | Response time logged | Medium |
| TC-263 | Demo | Demo rental assignment | Demo exists | 1. Assign rental | Rental created | High |
| TC-264 | Demo | Rental expiry | Rental exists | 1. Rental expires | Access revoked | High |
| TC-265 | Demo | Demo screenshot capture | Demo available | 1. Capture screenshot | Screenshot saved | Medium |
| TC-266 | Demo | Demo description | Demo exists | 1. Add description | Description saved | Medium |
| TC-267 | Demo | Demo pricing link | Demo exists | 1. Link to product | Pricing associated | High |
| TC-268 | Demo | Demo access logging | Demo accessed | 1. Access demo | Access logged | High |
| TC-269 | Demo | Unique click counting | Same user clicks | 1. Click multiple times | Unique count accurate | High |
| TC-270 | Demo | Device tracking | Demo clicked | 1. Track device | Device type logged | Medium |
| TC-271 | Demo | Geographic tracking | Demo clicked | 1. Track location | Country/region logged | Medium |
| TC-272 | Demo | Referrer tracking | Demo clicked | 1. Track referrer | Referrer logged | Medium |
| TC-273 | Demo | Browser tracking | Demo clicked | 1. Track browser | Browser logged | Low |
| TC-274 | Demo | Session duration | Demo viewed | 1. Track time | Duration logged | Medium |
| TC-275 | Demo | Conversion tracking | Lead created | 1. Mark conversion | Conversion logged | Critical |
| TC-276 | Demo | Demo deactivation | Demo exists | 1. Deactivate demo | Demo hidden | High |
| TC-277 | Demo | Demo reactivation | Demo inactive | 1. Reactivate demo | Demo visible | High |
| TC-278 | Demo | Demo deletion | Admin permission | 1. Delete demo | Demo removed | High |
| TC-279 | Demo | Multi-login credential | Demo with logins | 1. View credentials | All logins shown | High |
| TC-280 | Demo | Credential rotation | Demo active | 1. Rotate credentials | New credentials set | High |
| TC-281 | Demo | Demo banner text | Demo active | 1. Set banner | Banner displays | Medium |
| TC-282 | Demo | Disable destructive actions | Demo active | 1. Enable flag | Destructive blocked | High |
| TC-283 | Demo | Disable exports | Demo active | 1. Enable flag | Exports blocked | High |
| TC-284 | Demo | Max concurrent logins | Demo active | 1. Exceed limit | New login blocked | High |
| TC-285 | Demo | Health check interval | Demo active | 1. Set interval | Checks run accordingly | Medium |
| TC-286 | Demo | Trending demo flag | Demo popular | 1. Mark trending | Trending badge shown | Low |
| TC-287 | Demo | Video fallback | Demo down | 1. Access demo | Video plays instead | High |
| TC-288 | Demo | AI category suggestion | Demo created | 1. Check suggestion | AI suggests category | Medium |
| TC-289 | Demo | AI tech suggestion | Demo created | 1. Check suggestion | AI suggests tech stack | Medium |
| TC-290 | Demo | Demo renewal | Expiry approaching | 1. Renew demo | Expiry extended | High |
| TC-291 | Demo | Auto-renewal | Auto-renew enabled | 1. Expiry date | Auto-renewed | High |
| TC-292 | Demo | Renewal notification | 7 days to expiry | 1. Check notification | Renewal reminder sent | Medium |
| TC-293 | Demo | Demo analytics | Demo active | 1. View analytics | Stats displayed | High |
| TC-294 | Demo | Daily analytics | Demo active | 1. View daily stats | Daily breakdown shown | Medium |
| TC-295 | Demo | Demo documents | Demo exists | 1. Add document | Document attached | Medium |
| TC-296 | Demo | Public document access | Document public | 1. Access document | Document accessible | Medium |
| TC-297 | Demo | Private document access | Document private | 1. Try access | Access denied | High |
| TC-298 | Demo | Demo escalation | Issue detected | 1. Escalate | Escalation created | High |
| TC-299 | Demo | Escalation resolution | Escalation open | 1. Resolve | Resolution logged | High |
| TC-300 | Demo | Demo bulk upload | Multiple demos | 1. Upload CSV | All demos created | Medium |

---

## Section 7: Lead System (TC-301 to TC-350)

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-301 | Lead | New lead creation | User logged in | 1. Create lead | Lead saved | Critical |
| TC-302 | Lead | Lead qualification | Lead exists | 1. Qualify lead | Status updated | High |
| TC-303 | Lead | Lead assignment | Lead unassigned | 1. Assign lead | Lead assigned | Critical |
| TC-304 | Lead | Lead rejection | Lead exists | 1. Reject lead | Rejection logged | High |
| TC-305 | Lead | Lead escalation | Lead stale | 1. Escalate lead | Escalation created | High |
| TC-306 | Lead | Lead masking | Lead created | 1. View lead | Contact masked | Critical |
| TC-307 | Lead | Auto message on creation | Lead created | 1. Check messages | Welcome message sent | Medium |
| TC-308 | Lead | Buzzer on unassigned | Lead 120s old | 1. Wait 120s | Buzzer triggers | Critical |
| TC-309 | Lead | Lead scoring AI | Lead created | 1. Check score | AI score assigned | High |
| TC-310 | Lead | Lead pipeline view | Leads exist | 1. View pipeline | All stages visible | High |
| TC-311 | Lead | Pipeline drag-drop | Lead in stage | 1. Drag to next stage | Stage updated | High |
| TC-312 | Lead | Lead history | Lead exists | 1. View history | All changes logged | High |
| TC-313 | Lead | Lead notes | Lead exists | 1. Add note | Note saved | Medium |
| TC-314 | Lead | Lead task creation | Lead exists | 1. Create task | Task linked to lead | High |
| TC-315 | Lead | Lead conversion | Lead qualified | 1. Convert lead | Conversion logged | Critical |
| TC-316 | Lead | Lead source tracking | Lead created | 1. Check source | Source logged | High |
| TC-317 | Lead | Lead campaign tracking | From campaign | 1. Check campaign | Campaign linked | High |
| TC-318 | Lead | Duplicate lead detection | Duplicate contact | 1. Create lead | Warning: possible duplicate | High |
| TC-319 | Lead | Lead merge | Duplicates exist | 1. Merge leads | Single lead remains | High |
| TC-320 | Lead | Lead export | Leads exist | 1. Export leads | CSV with masked data | High |
| TC-321 | Lead | Lead import | CSV ready | 1. Import CSV | Leads created | High |
| TC-322 | Lead | Lead bulk assignment | Multiple leads | 1. Bulk assign | All assigned | High |
| TC-323 | Lead | Lead round-robin | Auto-assign on | 1. Create lead | Auto-assigned | High |
| TC-324 | Lead | Lead region routing | Regional lead | 1. Create lead | Routed to region | High |
| TC-325 | Lead | Lead language preference | Language set | 1. Check preference | Language logged | Medium |
| TC-326 | Lead | Lead industry tracking | Industry set | 1. Check industry | Industry logged | Medium |
| TC-327 | Lead | Lead value estimation | Value entered | 1. Check value | Value logged | High |
| TC-328 | Lead | Lead probability | Probability set | 1. Check probability | Probability logged | High |
| TC-329 | Lead | Lead close date | Date set | 1. Check date | Expected close logged | High |
| TC-330 | Lead | Lead closure | Lead won | 1. Close lead | Lead marked closed-won | Critical |
| TC-331 | Lead | Lead lost | Lead lost | 1. Close lead | Lead marked closed-lost | High |
| TC-332 | Lead | Lost reason tracking | Lead lost | 1. Enter reason | Reason logged | High |
| TC-333 | Lead | Lead reopen | Lead closed | 1. Reopen lead | Lead status reset | Medium |
| TC-334 | Lead | Lead activity timeline | Activities exist | 1. View timeline | All activities shown | High |
| TC-335 | Lead | Lead call logging | Call made | 1. Log call | Call logged | High |
| TC-336 | Lead | Lead email logging | Email sent | 1. Log email | Email logged | High |
| TC-337 | Lead | Lead meeting logging | Meeting held | 1. Log meeting | Meeting logged | High |
| TC-338 | Lead | Lead follow-up reminder | Follow-up set | 1. Reminder time | Notification sent | High |
| TC-339 | Lead | Lead ownership transfer | Lead assigned | 1. Transfer lead | New owner assigned | High |
| TC-340 | Lead | Lead sharing | Lead assigned | 1. Share lead | Shared access granted | Medium |
| TC-341 | Lead | Lead visibility (franchise) | Franchise lead | 1. View from other | Access denied | Critical |
| TC-342 | Lead | Lead visibility (reseller) | Reseller lead | 1. View from other | Access denied | Critical |
| TC-343 | Lead | Lead demo request | Lead exists | 1. Request demo | Demo request created | High |
| TC-344 | Lead | Lead product interest | Products exist | 1. Mark interest | Interest logged | High |
| TC-345 | Lead | Lead competitor info | Competitor known | 1. Add competitor | Competitor logged | Medium |
| TC-346 | Lead | Lead budget range | Budget known | 1. Set budget | Budget logged | High |
| TC-347 | Lead | Lead decision timeline | Timeline known | 1. Set timeline | Timeline logged | High |
| TC-348 | Lead | Lead stakeholder mapping | Contacts exist | 1. Add stakeholder | Stakeholder linked | Medium |
| TC-349 | Lead | Lead attachment | Document exists | 1. Attach document | Document linked | Medium |
| TC-350 | Lead | Lead analytics | Leads exist | 1. View analytics | Metrics displayed | High |

---

## Section 8: Internal Chat (TC-351 to TC-380)

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-351 | Chat | Message translation | Multi-language | 1. Send in Hindi | Translated to English | High |
| TC-352 | Chat | Translation accuracy | Known phrase | 1. Translate phrase | Accurate translation | Medium |
| TC-353 | Chat | Sender name masking | Chat active | 1. View messages | Sender masked | Critical |
| TC-354 | Chat | No message delete | Message exists | 1. Try delete | Delete disabled | Critical |
| TC-355 | Chat | No message edit | Message exists | 1. Try edit | Edit disabled | Critical |
| TC-356 | Chat | No message export | Chat exists | 1. Try export | Export disabled | Critical |
| TC-357 | Chat | Message logging | Message sent | 1. Check audit | Message logged | High |
| TC-358 | Chat | Profanity filter | Bad word used | 1. Send profanity | Message blocked | High |
| TC-359 | Chat | Spam detection | Repeated messages | 1. Spam messages | User warned/muted | High |
| TC-360 | Chat | Rate limiting | Fast messages | 1. Send 10 msgs/sec | Rate limited | High |
| TC-361 | Chat | File sharing blocked | Try attachment | 1. Attach file | Attachment blocked | High |
| TC-362 | Chat | Link sharing blocked | Try URL | 1. Paste URL | URL blocked | High |
| TC-363 | Chat | Contact info blocked | Try phone/email | 1. Type contact | Info masked/blocked | Critical |
| TC-364 | Chat | Social media blocked | Try social link | 1. Paste social | Link blocked | Critical |
| TC-365 | Chat | Role icon display | Chat active | 1. View messages | Role icons shown | Medium |
| TC-366 | Chat | Online status | User online | 1. View status | Green dot shown | Medium |
| TC-367 | Chat | Typing indicator | User typing | 1. Start typing | "Typing..." shown | Low |
| TC-368 | Chat | Read receipts | Message sent | 1. Message read | Read indicator | Low |
| TC-369 | Chat | Thread creation | Topic exists | 1. Create thread | Thread started | High |
| TC-370 | Chat | Thread reply | Thread exists | 1. Reply in thread | Reply added | High |
| TC-371 | Chat | Chat search | Messages exist | 1. Search keyword | Results found | Medium |
| TC-372 | Chat | Admin message review | Chat active | 1. Admin reviews | All messages visible | High |
| TC-373 | Chat | User muting | Violation occurs | 1. Mute user | User cannot send | High |
| TC-374 | Chat | Mute duration | User muted | 1. Check duration | Mute expires correctly | High |
| TC-375 | Chat | AI compliance monitor | Messages sent | 1. Monitor active | Violations flagged | High |
| TC-376 | Chat | Violation escalation | Severe violation | 1. Violation detected | Escalated to legal | High |
| TC-377 | Chat | Chat channel creation | Admin | 1. Create channel | Channel created | Medium |
| TC-378 | Chat | Channel membership | Channel exists | 1. Add members | Members added | Medium |
| TC-379 | Chat | Channel restrictions | Role-specific | 1. Access channel | Role validated | High |
| TC-380 | Chat | Chat backup | System backup | 1. Backup runs | Chat data backed up | High |

---

## Section 9: Masking Validation (TC-381 to TC-410)

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-381 | Mask | Client phone masking | Client exists | 1. View client | Phone: +91-98***XXX12 | Critical |
| TC-382 | Mask | Client email masking | Client exists | 1. View client | Email: j***@e***.com | Critical |
| TC-383 | Mask | Team identity masking | Team member | 1. View team | Name masked | Critical |
| TC-384 | Mask | Reseller access masking | Reseller viewing | 1. View any data | Appropriate masking | Critical |
| TC-385 | Mask | Franchise access masking | Franchise viewing | 1. View any data | Appropriate masking | Critical |
| TC-386 | Mask | Developer access masking | Developer viewing | 1. View task | Client fully masked | Critical |
| TC-387 | Mask | Masking in search results | Search performed | 1. Search data | Results masked | Critical |
| TC-388 | Mask | Masking in API response | API call | 1. Fetch data | Response masked | Critical |
| TC-389 | Mask | Masking in exports | Export data | 1. Export CSV | Data masked | Critical |
| TC-390 | Mask | Masking in reports | Generate report | 1. View report | Data masked | Critical |
| TC-391 | Mask | Masking in notifications | Notification sent | 1. View notification | Data masked | High |
| TC-392 | Mask | Masking in emails | Email sent | 1. Check email | Data masked | High |
| TC-393 | Mask | Masking in logs | Audit log | 1. View logs | Data masked | High |
| TC-394 | Mask | Masking consistency | Multiple views | 1. Check all views | Consistent masking | High |
| TC-395 | Mask | Unmasking by admin | Super admin | 1. Request unmask | Real data shown | High |
| TC-396 | Mask | Unmask audit logging | Unmask action | 1. Unmask data | Action logged | High |
| TC-397 | Mask | Partial phone mask | Phone number | 1. Apply mask | Last 4 visible only | High |
| TC-398 | Mask | Partial email mask | Email address | 1. Apply mask | First char + domain hint | High |
| TC-399 | Mask | Name masking pattern | Full name | 1. Apply mask | First letter + *** | High |
| TC-400 | Mask | Address masking | Address exists | 1. View address | City/State only | High |
| TC-401 | Mask | Bank account masking | Account exists | 1. View account | Last 4 digits only | Critical |
| TC-402 | Mask | Credit card masking | Card exists | 1. View card | ****-****-****-1234 | Critical |
| TC-403 | Mask | GST number masking | GST exists | 1. View GST | Partially masked | High |
| TC-404 | Mask | PAN number masking | PAN exists | 1. View PAN | Partially masked | High |
| TC-405 | Mask | Aadhaar masking | Aadhaar exists | 1. View Aadhaar | Last 4 only | Critical |
| TC-406 | Mask | Social media ID masking | Social exists | 1. View social | Masked handle | High |
| TC-407 | Mask | IP address masking | IP logged | 1. View IP | Partially masked | Medium |
| TC-408 | Mask | Device ID masking | Device logged | 1. View device | Partially masked | Medium |
| TC-409 | Mask | Mask bypass prevention | Try bypass | 1. Manipulate request | Masking enforced | Critical |
| TC-410 | Mask | Cross-role masking | Different roles | 1. Compare views | Role-appropriate masking | Critical |

---

## Section 10: Security & Penetration (TC-411 to TC-460)

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-411 | Security | SQL injection - login | None | 1. Enter ' OR '1'='1 | Input sanitized | Critical |
| TC-412 | Security | SQL injection - search | Search field | 1. Enter SQL in search | Query escaped | Critical |
| TC-413 | Security | SQL injection - form | Any form | 1. Enter SQL payload | Form validates | Critical |
| TC-414 | Security | XSS - script tag | Input field | 1. Enter <script> | Escaped, not executed | Critical |
| TC-415 | Security | XSS - event handler | Input field | 1. Enter onclick= | Sanitized | Critical |
| TC-416 | Security | XSS - img onerror | Input field | 1. Enter <img onerror> | Sanitized | Critical |
| TC-417 | Security | CSRF token missing | Form submit | 1. Remove CSRF token | Request rejected | Critical |
| TC-418 | Security | CSRF token invalid | Form submit | 1. Use wrong token | Request rejected | Critical |
| TC-419 | Security | Brute force login | Multiple attempts | 1. 10+ failed logins | Account locked | Critical |
| TC-420 | Security | Rate limit API | Rapid API calls | 1. 100+ calls/minute | Rate limited | Critical |
| TC-421 | Security | Unauthorized API access | No token | 1. Call protected API | 401 Unauthorized | Critical |
| TC-422 | Security | Expired token | Token expired | 1. Use expired token | 401 Unauthorized | Critical |
| TC-423 | Security | Token tampering | Valid token | 1. Modify token payload | Token rejected | Critical |
| TC-424 | Security | Privilege escalation | User role | 1. Try admin action | Access denied | Critical |
| TC-425 | Security | IDOR - view others | User logged in | 1. Access other's data | Access denied | Critical |
| TC-426 | Security | IDOR - modify others | User logged in | 1. Modify other's data | Access denied | Critical |
| TC-427 | Security | Directory traversal | File access | 1. Try ../../../etc | Path blocked | Critical |
| TC-428 | Security | File upload validation | Upload field | 1. Upload .exe file | File type rejected | Critical |
| TC-429 | Security | File size limit | Upload field | 1. Upload 100MB | Size rejected | High |
| TC-430 | Security | Malware scan | File upload | 1. Upload malware | File blocked | Critical |
| TC-431 | Security | HTTP header injection | Headers | 1. Inject CRLF | Injection blocked | High |
| TC-432 | Security | Session fixation | Session active | 1. Fix session ID | New session created | Critical |
| TC-433 | Security | Session hijacking | Session active | 1. Use stolen session | Session invalidated | Critical |
| TC-434 | Security | Cookie security | Cookies set | 1. Check flags | Secure, HttpOnly set | High |
| TC-435 | Security | HTTPS enforcement | HTTP request | 1. Access via HTTP | Redirected to HTTPS | High |
| TC-436 | Security | VPN detection | VPN active | 1. Access from VPN | Access blocked | High |
| TC-437 | Security | Tor detection | Tor browser | 1. Access from Tor | Access blocked | High |
| TC-438 | Security | Multi-IP login | Different IPs | 1. Login from 2 IPs | First session killed | Critical |
| TC-439 | Security | Device fingerprinting | New device | 1. Login new device | Device logged | High |
| TC-440 | Security | Suspicious activity | Unusual pattern | 1. Trigger detection | Alert created | High |
| TC-441 | Security | API key exposure | Code check | 1. Scan for API keys | No keys in client code | Critical |
| TC-442 | Security | Sensitive data exposure | Response check | 1. Check responses | No sensitive data leaked | Critical |
| TC-443 | Security | Error message leakage | Trigger error | 1. Cause error | Generic error shown | High |
| TC-444 | Security | Stack trace exposure | Server error | 1. Cause 500 error | No stack trace | High |
| TC-445 | Security | Version disclosure | HTTP headers | 1. Check headers | No version info | Medium |
| TC-446 | Security | Clickjacking | Page load | 1. Try iframe embed | X-Frame-Options set | High |
| TC-447 | Security | Content type sniffing | Response | 1. Check headers | X-Content-Type-Options set | Medium |
| TC-448 | Security | Open redirect | Redirect param | 1. Try external redirect | Redirect blocked | High |
| TC-449 | Security | Parameter pollution | Multiple params | 1. Duplicate params | Single value used | Medium |
| TC-450 | Security | XML external entity | XML input | 1. XXE payload | Entity blocked | High |
| TC-451 | Security | Server-side request | URL input | 1. SSRF payload | Request blocked | High |
| TC-452 | Security | Command injection | Input field | 1. Shell command | Command blocked | Critical |
| TC-453 | Security | LDAP injection | Input field | 1. LDAP payload | Injection blocked | High |
| TC-454 | Security | NoSQL injection | Input field | 1. NoSQL payload | Injection blocked | High |
| TC-455 | Security | Mass assignment | API request | 1. Extra fields | Extra fields ignored | High |
| TC-456 | Security | Timing attack | Password check | 1. Measure timing | Constant time check | Medium |
| TC-457 | Security | Denial of service | Regex input | 1. ReDoS payload | Request limited | High |
| TC-458 | Security | Resource exhaustion | Large request | 1. Send huge payload | Size limited | High |
| TC-459 | Security | Information disclosure | Error/debug | 1. Check for leaks | No info disclosed | High |
| TC-460 | Security | Security headers | Response | 1. Verify headers | All security headers set | High |

---

## Section 11: API Test Coverage (TC-461 to TC-500)

| Test Case ID | Module | Scenario | Preconditions | Steps | Expected Result | Severity |
|-------------|--------|----------|---------------|-------|-----------------|----------|
| TC-461 | API | POST /auth/login | Valid creds | 1. Call API | 200 + JWT token | Critical |
| TC-462 | API | POST /auth/register | New user | 1. Call API | 201 Created | Critical |
| TC-463 | API | POST /auth/refresh | Valid refresh | 1. Call API | New access token | Critical |
| TC-464 | API | GET /wallet | Authenticated | 1. Call API | Wallet balance | High |
| TC-465 | API | POST /wallet/credit | Admin auth | 1. Call API | Balance updated | Critical |
| TC-466 | API | POST /wallet/debit | Admin auth | 1. Call API | Balance updated | Critical |
| TC-467 | API | GET /demos | Authenticated | 1. Call API | Demo list | High |
| TC-468 | API | POST /demos/create | Demo manager | 1. Call API | Demo created | High |
| TC-469 | API | GET /demos/uptime | Demo manager | 1. Call API | Uptime stats | High |
| TC-470 | API | GET /leads | Lead manager | 1. Call API | Lead list | High |
| TC-471 | API | POST /leads/create | Lead manager | 1. Call API | Lead created | Critical |
| TC-472 | API | POST /leads/assign | Lead manager | 1. Call API | Lead assigned | High |
| TC-473 | API | POST /task/create | Task manager | 1. Call API | Task created | High |
| TC-474 | API | POST /task/assign | Task manager | 1. Call API | Task assigned | High |
| TC-475 | API | POST /task/timer/start | Developer | 1. Call API | Timer started | Critical |
| TC-476 | API | POST /task/timer/stop | Developer | 1. Call API | Timer stopped | Critical |
| TC-477 | API | POST /developer/deliver | Developer | 1. Call API | Delivery logged | Critical |
| TC-478 | API | GET /developer/performance | Developer | 1. Call API | Performance data | High |
| TC-479 | API | GET /notifications | Authenticated | 1. Call API | Notification list | High |
| TC-480 | API | POST /notifications/read | Authenticated | 1. Call API | Marked as read | Medium |
| TC-481 | API | GET /roles | Admin | 1. Call API | Role list | High |
| TC-482 | API | POST /roles/assign | Admin | 1. Call API | Role assigned | Critical |
| TC-483 | API | GET /permissions/matrix | Admin | 1. Call API | Permission matrix | High |
| TC-484 | API | POST /seo/meta/generate | SEO manager | 1. Call API | Meta tags generated | High |
| TC-485 | API | POST /seo/keywords | SEO manager | 1. Call API | Keywords generated | High |
| TC-486 | API | GET /support/tickets | Support | 1. Call API | Ticket list | High |
| TC-487 | API | POST /support/ticket | Authenticated | 1. Call API | Ticket created | High |
| TC-488 | API | POST /chat/send | Authenticated | 1. Call API | Message sent | High |
| TC-489 | API | GET /chat/history | Authenticated | 1. Call API | Chat history | High |
| TC-490 | API | POST /franchise/register | User | 1. Call API | Application created | High |
| TC-491 | API | POST /reseller/register | User | 1. Call API | Application created | High |
| TC-492 | API | POST /influencer/register | User | 1. Call API | Application created | High |
| TC-493 | API | GET /influencer/clicks | Influencer | 1. Call API | Click data | High |
| TC-494 | API | POST /prime/upgrade | User | 1. Call API | Subscription created | High |
| TC-495 | API | GET /prime/support | Prime | 1. Call API | Priority support | High |
| TC-496 | API | POST /rnd/idea | Authenticated | 1. Call API | Idea submitted | Medium |
| TC-497 | API | GET /performance | Admin | 1. Call API | Performance data | High |
| TC-498 | API | POST /legal/case | Legal | 1. Call API | Case created | High |
| TC-499 | API | POST /hr/onboard | HR | 1. Call API | Onboarding started | High |
| TC-500 | API | WebSocket connect | Authenticated | 1. Connect | Connection established | Critical |

---

## Section 12-15: Additional Test Cases (TC-501 to TC-550)

### Performance/Load Testing

| Test Case ID | Module | Scenario | Expected Result | Severity |
|-------------|--------|----------|-----------------|----------|
| TC-501 | Load | 50,000 leads/day creation | System handles without degradation | Critical |
| TC-502 | Load | 200 developers online simultaneously | All timers accurate | Critical |
| TC-503 | Load | 5,000 resellers accessing demos | Demo system responsive | Critical |
| TC-504 | Load | Demo click stress test (10k/min) | All clicks logged | Critical |
| TC-505 | Load | Wallet transaction burst (1k/sec) | All transactions accurate | Critical |
| TC-506 | Load | Concurrent API calls (5k/sec) | Rate limiting works | High |
| TC-507 | Load | Database query performance | Queries < 100ms | High |
| TC-508 | Load | File upload concurrency | No corruption | High |
| TC-509 | Load | WebSocket connections (10k) | All connected | High |
| TC-510 | Load | Memory usage under load | No memory leaks | High |

### UX/UI Testing

| Test Case ID | Module | Scenario | Expected Result | Severity |
|-------------|--------|----------|-----------------|----------|
| TC-511 | UX | Header notification only | No popup modals for notifications | High |
| TC-512 | UX | Pop-ups premium tone | Professional language in all modals | High |
| TC-513 | UX | No intrusive developer modals | Developer workflow uninterrupted | High |
| TC-514 | UX | AI chatbot on every screen | Chatbot accessible globally | High |
| TC-515 | UX | Mobile responsiveness | All screens work on mobile | High |
| TC-516 | UX | Dark theme consistency | No broken styles | Medium |
| TC-517 | UX | Loading states | Spinners during async operations | Medium |
| TC-518 | UX | Error message clarity | User-friendly error messages | High |
| TC-519 | UX | Form validation UX | Real-time validation feedback | Medium |
| TC-520 | UX | Keyboard navigation | Tab order correct | Medium |

### Reports & Analytics

| Test Case ID | Module | Scenario | Expected Result | Severity |
|-------------|--------|----------|-----------------|----------|
| TC-521 | Report | Performance report accuracy | Metrics match source data | High |
| TC-522 | Report | Financial report accuracy | Numbers reconcile | Critical |
| TC-523 | Report | Lead report completeness | All leads included | High |
| TC-524 | Report | Developer time report | Timer data accurate | High |
| TC-525 | Report | Franchise commission report | Commissions calculated correctly | High |
| TC-526 | Report | Reseller commission report | Commissions calculated correctly | High |
| TC-527 | Report | Influencer click report | Clicks validated | High |
| TC-528 | Report | Export to PDF | PDF generates correctly | Medium |
| TC-529 | Report | Export to Excel | Excel generates correctly | Medium |
| TC-530 | Report | Scheduled report delivery | Reports delivered on time | Medium |

### Fail Safe Behavior

| Test Case ID | Module | Scenario | Expected Result | Severity |
|-------------|--------|----------|-----------------|----------|
| TC-531 | Failsafe | Buzzer continues until acknowledged | No auto-dismiss | Critical |
| TC-532 | Failsafe | Demo reroute on downtime | Automatic failover | Critical |
| TC-533 | Failsafe | Task reassign on developer failure | Auto-reassignment | Critical |
| TC-534 | Failsafe | Auto-suspend on duplicate login | Session terminated | Critical |
| TC-535 | Failsafe | Alert escalation to super admin | Final escalation works | Critical |
| TC-536 | Failsafe | Database backup integrity | Backups restorable | Critical |
| TC-537 | Failsafe | Payment retry on failure | Automatic retry logic | High |
| TC-538 | Failsafe | Session recovery | State preserved | High |
| TC-539 | Failsafe | Graceful degradation | Core features work | High |
| TC-540 | Failsafe | Error recovery | System auto-recovers | High |

### Data Integrity

| Test Case ID | Module | Scenario | Expected Result | Severity |
|-------------|--------|----------|-----------------|----------|
| TC-541 | Data | Transaction consistency | ACID compliance | Critical |
| TC-542 | Data | Referential integrity | Foreign keys enforced | Critical |
| TC-543 | Data | Concurrent write handling | No data corruption | Critical |
| TC-544 | Data | Audit trail completeness | All changes logged | High |
| TC-545 | Data | Data validation | Invalid data rejected | High |
| TC-546 | Data | Unique constraint enforcement | No duplicates | High |
| TC-547 | Data | Cascade delete behavior | Related data handled | High |
| TC-548 | Data | Soft delete implementation | Data recoverable | Medium |
| TC-549 | Data | Data encryption at rest | PII encrypted | Critical |
| TC-550 | Data | Data encryption in transit | TLS enforced | Critical |

---

## Test Execution Summary Template

| Category | Total Tests | Passed | Failed | Blocked | Not Run |
|----------|-------------|--------|--------|---------|---------|
| Authentication | 50 | - | - | - | - |
| Role Dashboards | 70 | - | - | - | - |
| Buzzer & Alerts | 40 | - | - | - | - |
| Timer & Promise | 40 | - | - | - | - |
| Wallet & Finance | 50 | - | - | - | - |
| Demo System | 50 | - | - | - | - |
| Lead System | 50 | - | - | - | - |
| Internal Chat | 30 | - | - | - | - |
| Masking | 30 | - | - | - | - |
| Security | 50 | - | - | - | - |
| API Coverage | 40 | - | - | - | - |
| Performance | 10 | - | - | - | - |
| UX/UI | 10 | - | - | - | - |
| Reports | 10 | - | - | - | - |
| Failsafe | 10 | - | - | - | - |
| Data Integrity | 10 | - | - | - | - |
| **TOTAL** | **550** | - | - | - | - |

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Dev Lead | | | |
| Product Owner | | | |
| Security Analyst | | | |

---

*Document Version: 1.0*
*Last Updated: 2025-01-19*
*Author: Software Vala QA Team*
