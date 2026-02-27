import { supabase } from "@/integrations/supabase/client";

export interface CEODashboardData {
  revenue: {
    total: number;
    currency: string;
    period: string;
    ordersCount: number;
  };
  users: {
    active: number;
    recentWeek: number;
    retentionRate: number;
  };
  conversion: {
    rate: number;
    funnel: Record<string, number>;
  };
  products: {
    total: number;
    byCategory: Record<string, number>;
  };
  regionalPerformance: { region: string; revenue: number; users: number }[];
  systemHealth: {
    apiUptime: number;
    avgResponseMs: number;
    errorRate: number;
    activeConnections: number;
  };
  aiInsights: string[] | null;
  generatedAt: string;
}

export const ceoDashboardService = {
  // Fetch all CEO dashboard metrics
  async getDashboard(): Promise<CEODashboardData> {
    const { data, error } = await supabase.functions.invoke("ceo-dashboard", {
      body: {},
    });
    if (error) throw error;
    return data;
  },

  // Get revenue trends for charting
  async getRevenueTrends(days = 30): Promise<{ date: string; revenue: number }[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("amount, created_at")
      .eq("status", "completed")
      .gte("created_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Group by date
    const byDate: Record<string, number> = {};
    for (const order of (data || [])) {
      const date = order.created_at?.split("T")[0] || "";
      byDate[date] = (byDate[date] || 0) + (order.amount || 0);
    }

    return Object.entries(byDate).map(([date, revenue]) => ({ date, revenue }));
  },

  // Get active users count
  async getActiveUsersCount(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { count, error } = await supabase
      .from("user_activities")
      .select("user_id", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo)
      .not("user_id", "is", null);

    if (error) throw error;
    return count || 0;
  },
};
