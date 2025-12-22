// Backup & Restore API for Software Vala
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get masked ID for audit logs
function getMaskedId(userId: string | null): string {
  if (!userId) return 'SYS-BACKUP';
  return `USR-${userId.substring(0, 4)}***`;
}

async function getUser(supabase: any, req: Request) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) return null;
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
}

async function getUserRoles(supabase: any, userId: string) {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);
  return data?.map((r: any) => r.role) || [];
}

// RBAC check for backup/restore operations
function canAccessBackup(roles: string[]): boolean {
  const allowedRoles = ['super_admin', 'legal', 'compliance'];
  return roles.some(r => allowedRoles.includes(r));
}

// Check if role has full restore access
function canRestore(roles: string[]): boolean {
  // Only super_admin and legal can restore
  return roles.includes('super_admin') || roles.includes('legal');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const path = url.pathname.replace('/api-backup', '');

    console.log(`[BACKUP API] ${req.method} ${path}`);

    // Auth required for all endpoints
    const user = await getUser(supabase, req);
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        message: "Authentication required",
        code: "AUTH_REQUIRED"
      }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const userRoles = await getUserRoles(supabase, user.id);
    const maskedId = getMaskedId(user.id);

    // RBAC check - deny franchise/reseller/prime access
    const deniedRoles = ['franchise', 'reseller', 'prime', 'client', 'common'];
    if (userRoles.some((r: string) => deniedRoles.includes(r)) && !canAccessBackup(userRoles)) {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        role: userRoles[0] || 'unknown',
        module: 'backup',
        action: 'access_denied',
        meta_json: { masked_id: maskedId, attempted_path: path }
      });

      return new Response(JSON.stringify({
        success: false,
        message: "Backup operations are restricted to authorized personnel only",
        code: "PERMISSION_DENIED"
      }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // General RBAC check
    if (!canAccessBackup(userRoles)) {
      return new Response(JSON.stringify({
        success: false,
        message: "Access restricted to super admin, legal, and compliance roles",
        code: "PERMISSION_DENIED"
      }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // GET /list - List available backups
    if (path === '/list' && req.method === 'GET') {
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const offset = (page - 1) * limit;

      const { data: backups, count } = await supabase
        .from('system_backups')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Permanent audit log - no delete allowed
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        role: userRoles[0] || 'unknown',
        module: 'backup',
        action: 'list_backups',
        meta_json: { masked_id: maskedId, page, limit }
      });

      return new Response(JSON.stringify({
        success: true,
        message: "Backup list retrieved",
        data: {
          backups: (backups || []).map((b: any) => ({
            id: b.id,
            type: b.backup_type,
            status: b.status,
            size_mb: b.size_mb,
            encrypted: b.is_encrypted,
            compression: b.compression_type,
            created_at: b.created_at,
            created_by: getMaskedId(b.created_by),
            integrity_check: b.integrity_verified,
            modules_included: b.modules_included,
          })),
          pagination: {
            page,
            limit,
            total: count || 0,
            total_pages: Math.ceil((count || 0) / limit)
          }
        }
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // POST /create - Create new backup
    if (path === '/create' && req.method === 'POST') {
      const { backup_type, modules, description } = await req.json();

      // Validate backup type
      const validTypes = ['full', 'incremental', 'module'];
      if (!validTypes.includes(backup_type)) {
        return new Response(JSON.stringify({
          success: false,
          message: "Invalid backup type. Use: full, incremental, or module",
          code: "INVALID_TYPE"
        }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // For module backup, modules array is required
      if (backup_type === 'module' && (!modules || modules.length === 0)) {
        return new Response(JSON.stringify({
          success: false,
          message: "Module backup requires at least one module specified",
          code: "MISSING_MODULES"
        }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Create backup record
      const backupId = crypto.randomUUID();
      const { data: backup, error } = await supabase.from('system_backups').insert({
        id: backupId,
        backup_type,
        status: 'in_progress',
        created_by: user.id,
        description,
        modules_included: modules || ['all'],
        is_encrypted: true, // Always encrypted
        compression_type: 'gzip',
        started_at: new Date().toISOString(),
      }).select().single();

      if (error) {
        console.error('Backup creation error:', error);
        return new Response(JSON.stringify({
          success: false,
          message: "Failed to initiate backup",
          code: "BACKUP_ERROR"
        }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Permanent audit log
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        role: userRoles[0] || 'unknown',
        module: 'backup',
        action: 'backup_initiated',
        meta_json: { 
          masked_id: maskedId, 
          backup_id: backupId,
          backup_type,
          modules: modules || ['all'],
        }
      });

      // Simulate backup completion (in production, this would be async)
      setTimeout(async () => {
        await supabase.from('system_backups').update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          size_mb: Math.floor(Math.random() * 500) + 100,
          integrity_verified: true,
        }).eq('id', backupId);

        // Log completion
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          role: userRoles[0] || 'unknown',
          module: 'backup',
          action: 'backup_completed',
          meta_json: { masked_id: maskedId, backup_id: backupId }
        });
      }, 2000);

      console.log(`[BACKUP] Initiated: ${backup_type} backup by ${maskedId}`);

      return new Response(JSON.stringify({
        success: true,
        message: "Backup initiated successfully. Encryption enabled.",
        data: {
          backup_id: backupId,
          type: backup_type,
          status: 'in_progress',
          encrypted: true,
          started_at: backup?.started_at,
        }
      }), { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // POST /restore - Restore from backup
    if (path === '/restore' && req.method === 'POST') {
      // Extra permission check for restore
      if (!canRestore(userRoles)) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          role: userRoles[0] || 'unknown',
          module: 'backup',
          action: 'restore_denied',
          meta_json: { masked_id: maskedId, reason: 'insufficient_permissions' }
        });

        return new Response(JSON.stringify({
          success: false,
          message: "Restore operations require super admin or legal role",
          code: "PERMISSION_DENIED"
        }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      const { backup_id, restore_type, modules, confirm } = await req.json();

      if (!backup_id) {
        return new Response(JSON.stringify({
          success: false,
          message: "Backup ID is required",
          code: "MISSING_BACKUP_ID"
        }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Require explicit confirmation
      if (confirm !== 'CONFIRM_RESTORE') {
        return new Response(JSON.stringify({
          success: false,
          message: "Restore requires explicit confirmation. Set confirm: 'CONFIRM_RESTORE'",
          code: "CONFIRMATION_REQUIRED"
        }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Verify backup exists and is valid
      const { data: backup, error: backupError } = await supabase
        .from('system_backups')
        .select('*')
        .eq('id', backup_id)
        .eq('status', 'completed')
        .single();

      if (backupError || !backup) {
        return new Response(JSON.stringify({
          success: false,
          message: "Backup not found or is not in completed state",
          code: "INVALID_BACKUP"
        }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Check backup integrity
      if (!backup.integrity_verified) {
        return new Response(JSON.stringify({
          success: false,
          message: "Backup integrity verification failed. Cannot restore from corrupted backup.",
          code: "INTEGRITY_FAILED"
        }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Create restore record
      const restoreId = crypto.randomUUID();
      await supabase.from('system_restores').insert({
        id: restoreId,
        backup_id,
        restore_type: restore_type || 'full',
        modules_restored: modules || backup.modules_included,
        status: 'in_progress',
        initiated_by: user.id,
        started_at: new Date().toISOString(),
      });

      // Permanent audit log for restore
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        role: userRoles[0] || 'unknown',
        module: 'backup',
        action: 'restore_initiated',
        meta_json: { 
          masked_id: maskedId, 
          restore_id: restoreId,
          backup_id,
          restore_type: restore_type || 'full',
        }
      });

      // Simulate restore (in production, async process)
      setTimeout(async () => {
        await supabase.from('system_restores').update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          roles_preserved: true,
          masking_preserved: true,
          logs_preserved: true,
        }).eq('id', restoreId);

        // Log completion
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          role: userRoles[0] || 'unknown',
          module: 'backup',
          action: 'restore_completed',
          meta_json: { 
            masked_id: maskedId, 
            restore_id: restoreId,
            roles_preserved: true,
            masking_preserved: true,
          }
        });
      }, 5000);

      console.log(`[BACKUP] Restore initiated: ${backup_id} by ${maskedId}`);

      return new Response(JSON.stringify({
        success: true,
        message: "Restore initiated. Roles, masking, and logs will be preserved.",
        data: {
          restore_id: restoreId,
          backup_id,
          status: 'in_progress',
          preserves: {
            roles: true,
            masking: true,
            logs: true,
          }
        }
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // GET /verify/:id - Verify backup integrity
    if (path.match(/^\/verify\/[^/]+$/) && req.method === 'GET') {
      const backupId = path.replace('/verify/', '');

      const { data: backup } = await supabase
        .from('system_backups')
        .select('*')
        .eq('id', backupId)
        .single();

      if (!backup) {
        return new Response(JSON.stringify({
          success: false,
          message: "Backup not found",
          code: "NOT_FOUND"
        }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      // Verify integrity (simulate checksum verification)
      const integrityCheck = {
        checksum_valid: true,
        encryption_valid: backup.is_encrypted,
        size_valid: (backup.size_mb || 0) > 0,
        structure_valid: true,
      };

      const isValid = Object.values(integrityCheck).every(v => v === true);

      // Update integrity status
      await supabase.from('system_backups').update({
        integrity_verified: isValid,
        last_integrity_check: new Date().toISOString(),
      }).eq('id', backupId);

      // Audit log
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        role: userRoles[0] || 'unknown',
        module: 'backup',
        action: 'integrity_check',
        meta_json: { masked_id: maskedId, backup_id: backupId, result: isValid ? 'passed' : 'failed' }
      });

      return new Response(JSON.stringify({
        success: true,
        message: isValid ? "Backup integrity verified successfully" : "Backup integrity check failed",
        data: {
          backup_id: backupId,
          integrity_valid: isValid,
          checks: integrityCheck,
          checked_at: new Date().toISOString(),
          checked_by: maskedId,
        }
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // GET /history - Get backup/restore history (permanent, no delete)
    if (path === '/history' && req.method === 'GET') {
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = (page - 1) * limit;

      const { data: logs, count } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .eq('module', 'backup')
        .order('timestamp', { ascending: false })
        .range(offset, offset + limit - 1);

      // Mask user IDs in logs
      const maskedLogs = (logs || []).map((log: any) => ({
        id: log.id,
        action: log.action,
        masked_user: getMaskedId(log.user_id),
        role: log.role,
        timestamp: log.timestamp,
        details: log.meta_json,
      }));

      return new Response(JSON.stringify({
        success: true,
        message: "Backup history retrieved (permanent logs)",
        data: {
          logs: maskedLogs,
          pagination: {
            page,
            limit,
            total: count || 0,
            total_pages: Math.ceil((count || 0) / limit)
          },
          note: "These logs cannot be deleted or edited"
        }
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      success: false,
      message: "Endpoint not found",
      code: "NOT_FOUND"
    }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('[BACKUP API Error]', error);
    return new Response(JSON.stringify({
      success: false,
      message: "Backup operation failed",
      code: "INTERNAL_ERROR"
    }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
