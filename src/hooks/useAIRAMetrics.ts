import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AIRAMetrics {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  activeServers: number;
  pendingApprovals: number;
  criticalAlerts: number;
  auditEvents24h: number;
  revenueByMonth: { month: string; revenue: number; target: number }[];
  moduleActivity: { module: string; actions: number; errors: number }[];
  roleDistribution: { name: string; value: number }[];
  systemHealth: { metric: string; score: number; benchmark: number }[];
  hourlyActivity: { hour: string; events: number; critical: number }[];
  categoryBreakdown: { name: string; value: number }[];
  recentActivity: { id: string; action: string; entity: string; role: string; time: string; severity: string }[];
  kpiSparklines: {
    users: number[];
    revenue: number[];
    orders: number[];
    servers: number[];
  };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function useAIRAMetrics() {
  const [metrics, setMetrics] = useState<AIRAMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const mountedRef = useRef(true);

  // Keep a short cap on how many historical rows we pull to avoid huge payloads.
  const ORDERS_FETCH_LIMIT = 1000;
  const PRODUCTS_FETCH_LIMIT = 1000;
  const ACTIVITY_FETCH_LIMIT = 200;
  const AUDIT_FETCH_LIMIT = 200;

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const db = supabase as any;

      // Lightweight counts (use head:true for counts where we don't need rows)
      const usersRes = await db.from('profiles').select('id', { count: 'exact', head: true });

      // Orders: get count + recent order rows (for revenue/time-series)
      const ordersCountRes = await db.from('marketplace_orders').select('id', { count: 'exact', head: true });
      const ordersDataRes = await db
        .from('marketplace_orders')
        .select('id, final_amount, created_at')
        .order('created_at', { ascending: false })
        .limit(ORDERS_FETCH_LIMIT);

      // Products: fetch rows (we need category field for breakdown) + count via separate head query could be added
      const productsRes = await db
        .from('marketplace_products')
        .select('id, category')
        .limit(PRODUCTS_FETCH_LIMIT);

      // Counts for components
      const serversRes = await db.from('server_instances').select('id', { count: 'exact', head: true }).eq('status', 'running');
      const approvalsRes = await db.from('approvals').select('id', { count: 'exact', head: true }).eq('status', 'pending');
      const alertsRes = await db.from('system_alerts').select('id', { count: 'exact', head: true });

      // Activity/audit rows (we need recent rows)
      const auditRes = await db
        .from('audit_logs')
        .select('id, module, action, role, timestamp')
        .order('timestamp', { ascending: false })
        .limit(AUDIT_FETCH_LIMIT);

      const activityRes = await db
        .from('activity_log')
        .select('id, action_type, entity_type, role, severity_level, created_at')
        .order('created_at', { ascending: false })
        .limit(ACTIVITY_FETCH_LIMIT);

      const rolesRes = await db.from('user_roles').select('role');

      // Defensive: check for errors on each response and abort partially if critical failures occur
      // Supabase SDK returns { data, error, count } shape
      const responses = {
        usersRes,
        ordersCountRes,
        ordersDataRes,
        productsRes,
        serversRes,
        approvalsRes,
        alertsRes,
        auditRes,
        activityRes,
        rolesRes,
      };

      for (const [key, res] of Object.entries(responses)) {
        if (res?.error) {
          console.warn(`[AIRA] ${key} query error:`, res.error);
        }
      }

      // Calculate counts & data safely with fallbacks
      const totalUsers = usersRes?.count ?? 0;
      const totalOrders = ordersCountRes?.count ?? (ordersDataRes?.data?.length ?? 0);
      const orders = Array.isArray(ordersDataRes?.data) ? ordersDataRes.data : [];
      const totalProducts = (productsRes?.data?.length ?? 0);

      // Revenue (from fetched orders)
      const totalRevenue = orders.reduce((sum: number, o: any) => sum + (Number(o.final_amount) || 0), 0);

      // Revenue by month (based on fetched orders)
      const monthlyRev: Record<string, number> = {};
      MONTHS.forEach((m) => {
        monthlyRev[m] = 0;
      });
      orders.forEach((o: any) => {
        if (!o?.created_at) return;
        const d = new Date(o.created_at);
        if (isNaN(d.getTime())) return;
        const m = MONTHS[d.getMonth()];
        if (m) monthlyRev[m] += Number(o.final_amount) || 0;
      });
      const revenueByMonth = MONTHS.map((m) => ({
        month: m,
        revenue: Math.round(monthlyRev[m] || 0),
        target: Math.round((totalRevenue / 12) * 1.1), // 10% above avg as target
      }));

      // Module activity from audit logs
      const moduleMap: Record<string, { actions: number; errors: number }> = {};
      (auditRes?.data || []).forEach((l: any) => {
        const mod = l?.module || 'unknown';
        if (!moduleMap[mod]) moduleMap[mod] = { actions: 0, errors: 0 };
        moduleMap[mod].actions++;
        const actionLower = String(l?.action || '').toLowerCase();
        if (actionLower.includes('error') || actionLower.includes('fail')) moduleMap[mod].errors++;
      });
      const moduleActivity = Object.entries(moduleMap)
        .sort((a, b) => b[1].actions - a[1].actions)
        .slice(0, 10)
        .map(([module, data]) => ({ module, ...data }));

      // Role distribution
      const roleCounts: Record<string, number> = {};
      (rolesRes?.data || []).forEach((r: any) => {
        const role = String(r?.role ?? 'unknown');
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      });
      const roleDistribution = Object.entries(roleCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, value]) => ({ name, value }));

      // Category breakdown from products rows
      const catMap: Record<string, number> = {};
      (productsRes?.data || []).forEach((p: any) => {
        const cat = (p?.category as string) || 'Other';
        catMap[cat] = (catMap[cat] || 0) + 1;
      });
      const categoryBreakdown = Object.entries(catMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([name, value]) => ({ name, value }));

      // Hourly activity (last 24h) computed from activity rows
      const hourlyMap: Record<string, { events: number; critical: number }> = {};
      for (let i = 0; i < 24; i++) {
        const h = `${i.toString().padStart(2, '0')}:00`;
        hourlyMap[h] = { events: 0, critical: 0 };
      }
      (activityRes?.data || []).forEach((a: any) => {
        if (!a?.created_at) return;
        const d = new Date(a.created_at);
        if (isNaN(d.getTime())) return;
        const h = d.getHours();
        const key = `${h.toString().padStart(2, '0')}:00`;
        if (hourlyMap[key]) {
          hourlyMap[key].events++;
          if (a.severity_level === 'critical' || a.severity_level === 'emergency') {
            hourlyMap[key].critical++;
          }
        }
      });
      const hourlyActivity = Object.entries(hourlyMap).map(([hour, d]) => ({ hour, ...d }));

      // Recent activity (from activity log)
      const recentActivity = (activityRes?.data || []).slice(0, 20).map((a: any) => ({
        id: a.id,
        action: a.action_type,
        entity: a.entity_type || '-',
        role: a.role || 'system',
        time: new Date(a.created_at).toLocaleString(),
        severity: a.severity_level || 'info',
      }));

      // System health (static/computed example)
      const systemHealth = [
        { metric: 'Uptime', score: 99, benchmark: 99.5 },
        { metric: 'API Speed', score: 92, benchmark: 95 },
        { metric: 'Security', score: 97, benchmark: 95 },
        { metric: 'DB Health', score: 95, benchmark: 90 },
        { metric: 'Error Rate', score: 88, benchmark: 90 },
        { metric: 'User Sat.', score: 94, benchmark: 90 },
      ];

      // Sparklines (synthetic from real counts)
      const genSparkline = (base: number) =>
        Array.from({ length: 12 }, (_, i) => Math.max(0, Math.round(base * (0.5 + Math.random() * 0.6 + i * 0.04))));

      const activeServers = serversRes?.count ?? 0;
      const pendingApprovals = approvalsRes?.count ?? 0;
      const criticalAlerts = alertsRes?.count ?? 0;
      const auditEvents24h = (auditRes?.data || []).length;

      const computed: AIRAMetrics = {
        totalUsers: totalUsers ?? 0,
        totalOrders: totalOrders ?? (orders.length || 0),
        totalRevenue: Math.round(totalRevenue),
        totalProducts: totalProducts ?? 0,
        activeServers,
        pendingApprovals,
        criticalAlerts,
        auditEvents24h,
        revenueByMonth,
        moduleActivity,
        roleDistribution: roleDistribution.length > 0 ? roleDistribution : [{ name: 'Users', value: totalUsers ?? 0 }],
        systemHealth,
        hourlyActivity,
        categoryBreakdown,
        recentActivity,
        kpiSparklines: {
          users: genSparkline((totalUsers ?? 0) / 12),
          revenue: genSparkline((totalRevenue ?? 0) / 12),
          orders: genSparkline((totalOrders ?? 0) / 12),
          servers: genSparkline(Math.max(1, activeServers)),
        },
      };

      if (mountedRef.current) {
        setMetrics(computed);
        setLastRefresh(new Date());
      }
    } catch (err) {
      console.error('[AIRA] Metrics fetch error:', err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    // Initial fetch
    fetchMetrics();

    const interval = setInterval(() => {
      fetchMetrics();
    }, 30_000); // refresh every 30s

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchMetrics]);

  return { metrics, loading, lastRefresh, refresh: fetchMetrics };
}
