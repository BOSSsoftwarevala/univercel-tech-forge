# SOFTWARE VALA - Complete API Specification

## API Version: v1
## Base URL: `https://feqdqyadkijpohyllfdq.supabase.co/functions/v1`
## WebSocket URL: `wss://feqdqyadkijpohyllfdq.supabase.co/functions/v1`

---

## Global Requirements

### Authentication
- **JWT Token**: Required for all authenticated endpoints
- **API Key Validation**: Optional for device/IP restrictions
- **Header**: `Authorization: Bearer <jwt_token>`

### Rate Limiting
- Standard: 100 requests/minute
- Authenticated: 500 requests/minute
- WebSocket: 60 messages/minute

### Response Format
```json
{
  "success": true|false,
  "message": "Human-friendly message",
  "data": { },
  "code": "ERROR_CODE",
  "next_action": "Suggested next step"
}
```

### Masking Rules
| Role | Can View Unmasked |
|------|-------------------|
| super_admin | ✅ |
| finance_manager | ✅ |
| legal | ✅ |
| All Others | ❌ |

---

## 🔐 AUTH & SECURITY APIs

### POST /api-auth/login
**Description**: Authenticate user and get tokens

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "device_fingerprint": "optional-device-id"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Welcome back! You're now logged in",
  "data": {
    "user": {
      "id": "uuid",
      "email": "us***@example.com",
      "roles": ["franchise", "reseller"]
    },
    "session": {
      "access_token": "jwt...",
      "refresh_token": "refresh...",
      "expires_at": 1234567890
    }
  },
  "next_action": "Navigate to your dashboard"
}
```

**Access**: Public

---

### POST /api-auth/logout
**Description**: End current session

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "message": "You've been safely logged out. See you soon!"
}
```

---

### POST /api-auth/refresh
**Description**: Refresh access token

**Request**:
```json
{
  "refresh_token": "refresh_token_here"
}
```

---

### GET /api-auth/device-check
**Description**: Validate device and IP restrictions

**Response**:
```json
{
  "success": true,
  "data": {
    "device_authorized": true,
    "ip_authorized": true,
    "requires_2fa": false
  }
}
```

---

### GET /api-auth/masked-identity
**Description**: Get user's masked contact info

**Access**: Authenticated

---

## 💰 WALLET & FINANCE APIs

### GET /api-wallet
**Description**: Get wallet balance

**Response**:
```json
{
  "success": true,
  "data": {
    "balance": 15000.00,
    "pending_balance": 2500.00,
    "currency": "INR",
    "last_updated": "2024-01-15T10:30:00Z"
  }
}
```

**Access**: Authenticated (own wallet)

---

### GET /api-wallet/transactions
**Description**: Get transaction history

**Query Params**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Access**: Authenticated

---

### POST /api-wallet/topup
**Description**: Add funds to wallet

**Request**:
```json
{
  "amount": 5000,
  "payment_method": "upi",
  "transaction_ref": "PAY123456"
}
```

---

### POST /api-wallet/withdraw
**Description**: Request withdrawal

**Request**:
```json
{
  "amount": 10000,
  "payout_method": "bank",
  "bank_details": {
    "account_number": "****1234",
    "ifsc": "HDFC0001234"
  }
}
```

---

### POST /api-wallet/commission/franchise
**Description**: Process franchise commission

**Request**:
```json
{
  "franchise_id": "uuid",
  "sale_amount": 50000,
  "commission_rate": 15,
  "lead_id": "uuid"
}
```

**Access**: super_admin, finance_manager

---

### POST /api-wallet/commission/reseller
**Description**: Process reseller commission

**Access**: super_admin, finance_manager, franchise

---

### GET /api-wallet/invoice/:id
**Description**: Get invoice details

**Access**: Owner, super_admin, finance_manager

---

## 📊 LEAD & SALES APIs

### POST /api-leads/create
**Description**: Create new lead

**Request**:
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "phone": "+919876543210",
  "company": "ABC Corp",
  "source": "website",
  "region": "Mumbai",
  "country": "India",
  "priority": "high",
  "industry": "Healthcare"
}
```

**Access**: super_admin, lead_manager, franchise, reseller, sales

---

### GET /api-leads/list
**Description**: List leads with pagination

**Query Params**:
- `page`, `limit`, `status`, `priority`

**Access**: Role-filtered (franchise sees own, reseller sees own, etc.)

---

### PATCH /api-leads/:id/assign
**Description**: Assign lead to user

**Request**:
```json
{
  "assigned_to": "user_uuid",
  "notes": "High priority client"
}
```

**Access**: super_admin, lead_manager, franchise

---

### PATCH /api-leads/:id/status
**Description**: Update lead status

**Valid Statuses**: `new`, `contacted`, `qualified`, `demo_scheduled`, `proposal_sent`, `negotiation`, `won`, `lost`

**Access**: Assignee, super_admin, lead_manager

---

### GET /api-leads/:id/timeline
**Description**: Get lead history/timeline

---

## 👨‍💻 DEVELOPER TASK APIs

### POST /api-tasks/create
**Description**: Create new task

**Request**:
```json
{
  "title": "Build API Module",
  "description": "Create REST API for wallet",
  "category": "development",
  "priority": "high",
  "tech_stack": ["nodejs", "typescript"],
  "deadline": "2024-01-20T18:00:00Z",
  "estimated_hours": 8,
  "sla_hours": 24
}
```

**Access**: super_admin, demo_manager, client_success

---

### PATCH /api-tasks/:id/assign
**Description**: Assign task to developer

**Access**: super_admin, demo_manager

---

### PATCH /api-tasks/:id/accept
**Description**: Developer accepts task

**Access**: Assigned developer only

---

### PATCH /api-tasks/:id/timer/start
**Description**: Start task timer

**Access**: Assigned developer

---

### PATCH /api-tasks/:id/timer/stop
**Description**: Stop task timer

**Request**:
```json
{
  "pause_reason": "Waiting for client clarification"
}
```

---

### GET /api-tasks/:id/progress
**Description**: Get task progress and timer data

**Response**:
```json
{
  "success": true,
  "data": {
    "task": { "id": "...", "title": "...", "status": "in_progress" },
    "time": {
      "total_minutes": 180,
      "estimated_hours": 8,
      "is_running": true,
      "current_session_start": "2024-01-15T10:00:00Z"
    },
    "checkpoints": [],
    "sla": {
      "hours": 24,
      "deadline": "2024-01-20T18:00:00Z",
      "is_overdue": false
    }
  }
}
```

---

### POST /api-tasks/:id/deliver
**Description**: Submit task delivery

**Request**:
```json
{
  "delivery_notes": "All features implemented and tested",
  "files": ["file1.zip", "file2.zip"]
}
```

---

## 🎯 DEMO SYSTEM APIs

### GET /api-demos/list
**Description**: List available demos (public)

**Query Params**: `page`, `limit`, `category`, `tech`

---

### POST /api-demos/upload
**Description**: Create new demo

**Request**:
```json
{
  "title": "Hospital Management System",
  "url": "https://demo.hospital.com",
  "category": "healthcare",
  "tech_stack": "php",
  "login_credentials": [
    { "role": "admin", "username": "admin", "password": "demo123" }
  ]
}
```

**Access**: super_admin, demo_manager

---

### PATCH /api-demos/:id/assign
**Description**: Assign demo to franchise/reseller

**Access**: super_admin, demo_manager, franchise

---

### GET /api-demos/:id/uptime
**Description**: Get demo uptime status

---

### POST /api-demos/rent
**Description**: Request demo rental access

---

### GET /api-demos/track/clicks
**Description**: Get click analytics

**Query Params**: `demo_id`, `start_date`, `end_date`

---

## 🔔 BUZZER & ALERT APIs

### POST /api-alerts/create
**Description**: Create new alert/buzzer

**Request**:
```json
{
  "trigger_type": "new_lead",
  "role_target": "sales",
  "priority": "high",
  "lead_id": "uuid",
  "auto_escalate_after": 300
}
```

---

### GET /api-alerts/live
**Description**: Get pending alerts for user's roles

---

### PATCH /api-alerts/:id/accept
**Description**: Accept and take ownership of alert

---

### PATCH /api-alerts/:id/escalate
**Description**: Escalate alert to higher role

**Request**:
```json
{
  "escalate_to_role": "super_admin",
  "reason": "Requires immediate attention"
}
```

---

## 🔌 WEBSOCKET CHANNELS

### Connection
```javascript
const ws = new WebSocket('wss://feqdqyadkijpohyllfdq.supabase.co/functions/v1/ws-realtime');
```

### Authentication
```json
{ "type": "auth", "token": "jwt_token" }
```

### Subscribe to Channels
```json
{ "type": "subscribe", "channels": ["alerts", "buzzer", "chat", "timer"] }
```

### Available Channels

| Channel | Events | Access |
|---------|--------|--------|
| `alerts` | new_alert, alert_acknowledged | Role-based |
| `buzzer` | buzzer_trigger, buzzer_accept | Role-based |
| `chat` | new_message | Authenticated |
| `timer` | timer_start, timer_stop, timer_update | Developer |
| `demo-status` | demo_up, demo_down | demo_manager |
| `prime-support` | priority_update | Prime users |

### Send Chat Message
```json
{ "type": "send_chat", "thread_id": "uuid", "message": "Hello!" }
```

### Acknowledge Alert
```json
{ "type": "acknowledge_alert", "alert_id": "uuid" }
```

---

## 📋 Role Access Matrix

| Endpoint | super_admin | demo_manager | franchise | reseller | developer | prime |
|----------|-------------|--------------|-----------|----------|-----------|-------|
| /wallet | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| /leads/create | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| /leads/assign | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| /tasks/create | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| /tasks/timer | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| /demos/upload | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| /demos/assign | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| /commission/* | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_REQUIRED | 401 | Authentication token missing |
| AUTH_FAILED | 401 | Invalid credentials |
| SESSION_EXPIRED | 401 | Token expired |
| PERMISSION_DENIED | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid request data |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

---

## Device & IP Restrictions

### Enforcement Rules
1. Validate device signature hash
2. Validate IP whitelist
3. Single active session for prime/franchise
4. Auto-alert superadmin on violation

### Violation Response
```json
{
  "success": false,
  "message": "Access denied from this device or location",
  "code": "DEVICE_RESTRICTED",
  "reason": "IP address not whitelisted"
}
```
