import { errorResponse, jsonResponse } from '../_shared/utils.ts';
import { withAuth } from '../_shared/middleware.ts';

declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

function normalizePath(pathname: string) {
  return pathname
    .replace(/^.*\/functions\/v1\/api-notifications/, '')
    .replace(/^.*\/api-notifications/, '') || '/';
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = normalizePath(url.pathname);
  const method = req.method;

  if (method === 'GET' && (path === '/' || path === '/list')) {
    return withAuth(req, [], async ({ supabaseAdmin, user }) => {
      const limitParam = Number(url.searchParams.get('limit') || '50');
      const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 50;

      const { data, error } = await supabaseAdmin
        .from('user_notifications')
        .select('*')
        .eq('user_id', user.userId)
        .eq('is_dismissed', false)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return errorResponse(error.message, 500);
      }

      const items = (data || []).map((row: any) => ({
        id: row.id,
        type: row.type,
        message: row.message,
        event_type: row.event_type || '',
        action_label: row.action_label || null,
        action_url: row.action_url || null,
        is_buzzer: Boolean(row.is_buzzer),
        role_target: Array.isArray(row.role_target) ? row.role_target : [],
        is_read: Boolean(row.is_read),
        created_at: row.created_at,
      }));

      return jsonResponse({
        items,
        unread: items.filter((item: any) => !item.is_read).length,
      });
    }, { module: 'notifications', action: 'list', skipIPLock: true, skipKYC: true, skipSubscription: true });
  }

  if (method === 'POST' && path === '/create') {
    return withAuth(req, [], async ({ supabaseAdmin, user, body }) => {
      if (!body?.type || !body?.message) {
        return errorResponse('type and message are required');
      }

      const payload = {
        user_id: user.userId,
        type: body.type,
        message: body.message,
        event_type: body.event_type || '',
        action_label: body.action_label || null,
        action_url: body.action_url || null,
        is_buzzer: Boolean(body.is_buzzer),
        role_target: Array.isArray(body.role_target) ? body.role_target : [],
      };

      const { data, error } = await supabaseAdmin
        .from('user_notifications')
        .insert(payload)
        .select('*')
        .single();

      if (error) {
        return errorResponse(error.message, 500);
      }

      return jsonResponse(data, 201);
    }, { module: 'notifications', action: 'create', skipIPLock: true, skipKYC: true, skipSubscription: true });
  }

  if (method === 'POST' && path === '/read') {
    return withAuth(req, [], async ({ supabaseAdmin, user, body }) => {
      if (!body?.notification_id) {
        return errorResponse('notification_id is required');
      }

      const { error } = await supabaseAdmin
        .from('user_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', body.notification_id)
        .eq('user_id', user.userId);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return jsonResponse({ success: true });
    }, { module: 'notifications', action: 'read', skipIPLock: true, skipKYC: true, skipSubscription: true });
  }

  if (method === 'POST' && path === '/dismiss') {
    return withAuth(req, [], async ({ supabaseAdmin, user, body }) => {
      if (!body?.notification_id) {
        return errorResponse('notification_id is required');
      }

      const { error } = await supabaseAdmin
        .from('user_notifications')
        .update({ is_dismissed: true, dismissed_at: new Date().toISOString() })
        .eq('id', body.notification_id)
        .eq('user_id', user.userId);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return jsonResponse({ success: true });
    }, { module: 'notifications', action: 'dismiss', skipIPLock: true, skipKYC: true, skipSubscription: true });
  }

  if (method === 'POST' && path === '/clear') {
    return withAuth(req, [], async ({ supabaseAdmin, user }) => {
      const { error } = await supabaseAdmin
        .from('user_notifications')
        .update({ is_dismissed: true, dismissed_at: new Date().toISOString() })
        .eq('user_id', user.userId)
        .eq('is_buzzer', false)
        .eq('is_dismissed', false);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return jsonResponse({ success: true });
    }, { module: 'notifications', action: 'clear', skipIPLock: true, skipKYC: true, skipSubscription: true });
  }

  return errorResponse('Not found', 404);
});