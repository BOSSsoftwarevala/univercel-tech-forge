# Backend Hooks Reference
## Real API Integration Hooks for Boss Dashboard

This document outlines all the custom React hooks created for real backend integration in the Boss Dashboard module.

---

## Hook 1: `useSystemModules`
**Location:** `src/hooks/useSystemModules.ts`
**Purpose:** Real system module management with automatic state updates

### Exported Functions

#### `enableModule(moduleId: string, moduleName: string)`
```typescript
// Enables a disabled system module
// Returns: { success: boolean; data: ModuleStatus; message: string }
// Side Effects:
//   - Module status changes to 'active'
//   - Health metrics reset
//   - Audit log created (module_status_changed)
// Error Cases: Module not found, already enabled, permission denied
```

#### `disableModule(moduleId: string, moduleName: string)`
```typescript
// Disables an active system module
// Returns: { success: boolean; data: ModuleStatus; message: string }
// Side Effects:
//   - Module status changes to 'disabled'
//   - All active requests are gracefully shut down
//   - Audit log created (module_status_changed)
// Error Cases: Module not found, has dependent modules, permission denied
```

#### `setMaintenance(moduleId: string, moduleName: string, reason: string)`
```typescript
// Places module in maintenance mode
// Returns: { success: boolean; data: ModuleStatus; maintenanceWindow: object }
// Side Effects:
//   - Users see maintenance message
//   - Requests redirected to status page
//   - Backend notifies admins
//   - Audit log created with reason (module_maintenance_start)
// Error Cases: Already in maintenance, invalid reason
```

#### `getActivity(moduleId?: string)`
```typescript
// Fetches module activity logs
// Returns: Activity[] (up to 50 recent logs)
// Data Includes:
//   - Timestamp, action (enable/disable/error)
//   - User who triggered action
//   - Result/error message
//   - Module status at that time
// Real-time: Fetched directly from backend
```

#### `getHealthMetrics(moduleId: string)`
```typescript
// Fetches current health metrics
// Returns: { health: number; uptime: string; responseTime: string; errorRate: string }
// Data Includes:
//   - Overall health percentage
//   - Uptime duration
//   - Average response time in ms
//   - Current error rate percentage
// Updates: Every module detail refresh
```

### Hook State
```typescript
// useState hooks managed internally:
// - loading: boolean (prevents duplicate submissions)
// - error: Error | null (stores last error)
// - activity: Activity[] (cached activity logs)
// - metrics: HealthMetrics | null (cached metrics)
```

### Usage Example
```typescript
function SystemModules() {
  const { enableModule, disableModule, setMaintenance, getActivity } = useSystemModules();
  
  const handleEnable = async (moduleId: string) => {
    try {
      const result = await enableModule(moduleId, 'Payment Processing');
      if (result.success) {
        toast.success('Module enabled');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
}
```

---

## Hook 2: `useAdminActions`
**Location:** `src/hooks/useAdminActions.ts`
**Purpose:** Super admin operations with audit trail and security checks

### Exported Functions

#### `viewAdminDetails(adminId: string)`
```typescript
// Fetches complete admin profile
// Returns: { 
//   id: string;
//   email: string;
//   role: string;
//   permissions: string[];
//   suspensionStatus: 'active' | 'suspended' | 'locked';
//   suspendedUntil?: string;
//   activityHistory: AdminAction[];
//   scopeRegions: string[];
// }
// Audit Log: admin_detail_viewed (severity: info)
// Safe: Read-only operation
```

#### `suspendAdmin(adminId: string, adminName: string, reason: string)`
```typescript
// Immediately suspends admin account
// Returns: { success: boolean; suspensionId: string; suspendedUntil: string }
// Side Effects:
//   - All API keys revoked immediately
//   - Sessions invalidated
//   - Email sent to admin with suspension details
//   - Cannot be undone until reactivation
//   - Audit log created (admin_suspended, severity: critical)
// Requirements: Caller must have SUPER_ADMIN role, 2FA verification required
// Error Cases: Admin not found, already suspended, 2FA not verified
```

#### `reactivateAdmin(adminId: string, adminName: string)`
```typescript
// Reactivates suspended admin account
// Returns: { success: boolean; reactivatedAt: string }
// Side Effects:
//   - Admin can log in again
//   - New API keys must be generated
//   - Email sent to admin notification
//   - Audit log created (admin_reactivated, severity: critical)
// Requirements: Caller must have SUPER_ADMIN role, 2FA verification required
// Error Cases: Admin not found, not currently suspended
```

#### `updateAdminScope(adminId: string, newScope: string[], reason: string)`
```typescript
// Updates admin region management scope
// Returns: { success: boolean; previousScope: string[]; newScope: string[] }
// Side Effects:
//   - Admin can now manage specified regions
//   - Previous region access revoked
//   - Audit log created with reason (admin_scope_changed)
// Error Cases: Invalid regions, admin not found, scope conflict
```

#### `getAdminActivityHistory(adminId: string, limit?: number)`
```typescript
// Fetches admin's complete action history
// Returns: AdminAction[]
// Includes:
//   - All logins with IP addresses
//   - All API calls made
//   - All data accessed
//   - All changes made
//   - Timestamps for each
// Security: Immutable, used for compliance audits
// Real-time: Fetched directly from audit table
```

#### `revokePermissions(adminId: string, adminName: string, reason: string)`
```typescript
// Immediately revokes all admin permissions
// Returns: { success: boolean; revokedAt: string; apisRevoked: number }
// Side Effects:
//   - All API keys invalidated
//   - 2FA reset
//   - New credentials must be generated to regain access
//   - Audit log created (admin_permissions_revoked, severity: critical)
// Requirements: Caller must have SUPER_ADMIN role, 2FA verification required
// Error Cases: Admin not found, already revoked
```

#### `grantPermissions(adminId: string, permissions: string[], reason: string)`
```typescript
// Grants new permissions to admin
// Returns: { success: boolean; newPermissions: string[]; grantedAt: string }
// Side Effects:
//   - Admin gains new system access
//   - Can take up to 60 seconds to propagate
//   - Audit log created (admin_permissions_granted)
// Requirements: Caller must have SUPER_ADMIN role
// Error Cases: Invalid permissions, admin not found
```

### Hook State
```typescript
// useState hooks managed internally:
// - loading: boolean (prevents duplicate submissions)
// - error: Error | null (stores last error)
// - adminDetails: AdminProfile | null (cached admin details)
// - activityHistory: AdminAction[] (cached activity history)
```

### Audit Trail
All admin operations automatically create audit log entries with:
- Admin performing action
- Admin being acted upon
- Action type (suspend, grant, revoke, etc.)
- Reason provided
- Timestamp
- Severity level (critical, warning, info)
- IP address and user agent

### Usage Example
```typescript
function SuperAdminsView() {
  const { suspendAdmin, viewAdminDetails, getAdminActivityHistory } = useAdminActions();
  
  const handleSuspend = async (adminId: string) => {
    try {
      const result = await suspendAdmin(adminId, 'John Admin', 'Unauthorized access attempt');
      if (result.success) {
        toast.success('Admin suspended and removed from system');
      }
    } catch (error) {
      toast.error(`Suspension failed: ${error.message}`);
    }
  };
}
```

---

## Hook 3: `useHostingManager` (Pre-existing)
**Location:** `src/hooks/useHostingManager.ts`
**Purpose:** Deployment and hosting operations

### Available Functions
- `deploy(projectName, config)` - Triggers real deployment
- `checkDomain(domain)` - Checks DNS availability
- `verifyDnis(domain)` - Verifies DNS records
- `getDeploymentStatus(deploymentId)` - Fetches real build logs
- `rollback(deploymentId)` - Rolls back to previous version
- `scaleInstance(currentSize, targetSize)` - Resizes instance
- `configureSSL(domain)` - Sets up SSL certificate
- `getAnalytics(domain)` - Fetches deployment analytics

### Current Usage
Used by `ServerHosting.tsx` component for all deployment operations.

---

## Hook 4: `useCodePilotAI` (Pre-existing)
**Location:** `src/hooks/useCodePilotAI.ts`
**Purpose:** AI code generation and optimization

### Available Functions
- `generateCode(prompt, options)` - AI code generation
- `fixIssue(issue, context)` - AI bug fixing
- `reviewCode(code, standards)` - Code review
- `optimizeCode(code, goals)` - Performance optimization
- `generateTests(code)` - Auto test generation
- `devOpsTask(task, config)` - DevOps automation
- `chat(messages)` - Advanced AI chat

### Current Usage
Used by `CodePilot.tsx` component for AI-powered code operations.

---

## Integration Pattern

All hooks follow the same pattern:

```typescript
// 1. Call hook function with parameters
const result = await hookFunction(params);

// 2. Check if successful
if (result?.success) {
  // 3. Use returned data (real backend data)
  updateUI(result.data);
  // 4. Show success message
  toast.success(result.message || 'Operation successful');
} else {
  // 5. Handle error
  throw new Error(result?.message || 'Unknown error');
}
```

---

## Backend Integration Details

### Supabase Functions Called
```
- system-modules-manager
  Actions: enable_module, disable_module, set_maintenance, get_activity, get_health_metrics

- admin-operations  
  Actions: view_admin_details, suspend_admin, reactivate_admin, update_admin_scope, 
           get_admin_activity_history, revoke_permissions, grant_permissions

- hosting-manager
  Actions: deploy, check_domain, verify_dns, get_deployment_status, rollback,
           scale_instance, configure_ssl, get_analytics

- codepilot-ai
  Actions: generate_code, fix_issue, review_code, optimize_code, generate_tests,
           devops_task, chat
```

### Response Format
All functions return consistent format:
```typescript
{
  success: boolean;
  data?: T; // The actual result data
  message?: string; // Human-readable message
  error?: string; // Error details if failed
}
```

---

## Security Features

### Authentication
- All operations require authenticated Supabase user
- User role/permissions checked on backend

### 2FA Requirement
- Suspend/Revoke/Reactivate operations require 2FA
- Enforced by backend before action completion

### Audit Logging
- Every operation logged with timestamp
- Immutable audit records in database
- Source IP and user agent recorded
- Severity levels assigned (critical, warning, info)

### Rate Limiting
- Backend limits API calls per user per minute
- Prevents brute force attacks
- Graceful error messages when limit exceeded

---

## Error Handling

All hooks implement standard error handling:

```typescript
try {
  const fnError = error as Error;
  if (fnError) {
    throw new Error(fnError.message);
  }
  
  if (!result?.success) {
    throw new Error(result?.message || 'Operation failed');
  }
  
  return result.data;
} catch (err) {
  logErrorToSentry(err); // For monitoring
  throw err; // Re-throw for component to handle
}
```

---

## Testing Hooks

Each hook can be tested independently:

```typescript
// Test module enabling
const { enableModule } = useSystemModules();
const result = await enableModule('module-1', 'Test Module');
expect(result.success).toBe(true);
expect(result.data.status).toBe('active');

// Test admin suspension  
const { suspendAdmin } = useAdminActions();
const suspensionResult = await suspendAdmin('admin-1', 'Test Admin', 'Testing');
expect(suspensionResult.success).toBe(true);
```

---

## Summary

These hooks provide:
✅ Real backend integration via Supabase Functions
✅ Proper error handling and user feedback
✅ Automatic audit trail logging
✅ Security requirements (2FA, permissions checking)
✅ Consistent response handling
✅ Type safety with TypeScript
✅ No simulation/fake logic
✅ Production-ready code
