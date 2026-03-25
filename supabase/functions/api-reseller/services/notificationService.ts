import { getPagination, isManagerRole, resolveResellerId, ServiceUser } from './common.ts';

export async function listNotifications(supabaseAdmin: any, user: ServiceUser, url: URL) {
  const { page, limit, offset } = getPagination(url, 12, 100);
  let resellerId = url.searchParams.get('reseller_id');

  if (!isManagerRole(user.role)) {
    resellerId = await resolveResellerId(supabaseAdmin, user.userId);
  }

  let query = supabaseAdmin
    .from('reseller_notifications')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (resellerId) {
    query = query.eq('reseller_id', resellerId);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return {
    items: data || [],
    unread: (data || []).filter((row: any) => !row.is_read).length,
    page,
    limit,
    total: count || 0,
    total_pages: Math.max(Math.ceil((count || 0) / limit), 1),
  };
}

export async function markNotificationRead(supabaseAdmin: any, user: ServiceUser, body: Record<string, unknown>) {
  let resellerId = body.reseller_id as string | undefined;
  if (!isManagerRole(user.role)) {
    resellerId = await resolveResellerId(supabaseAdmin, user.userId) || undefined;
  }

  const query = supabaseAdmin
    .from('reseller_notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', body.notification_id);

  if (resellerId) {
    query.eq('reseller_id', resellerId);
  }

  const { error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}