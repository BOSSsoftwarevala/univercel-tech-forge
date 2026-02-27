import { supabase } from "@/integrations/supabase/client";

export type ActivityType = "view" | "click" | "demo" | "apply" | "buy" | "search" | "share" | "bookmark";

export interface ActivityEvent {
  activityType: ActivityType;
  productId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export interface ActivityDashboard {
  totalActivities: number;
  activityCounts: Record<string, number>;
  topProducts: { id: string; views: number }[];
  conversionFunnel: { view: number; click: number; demo: number; apply: number; buy: number };
  period: string;
}

export const activityLoggerService = {
  // Log a user activity event
  async log(event: ActivityEvent): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      await supabase.functions.invoke("activity-tracker", {
        body: {
          userId,
          sessionId: event.sessionId,
          activityType: event.activityType,
          productId: event.productId,
          metadata: event.metadata || {},
        },
      });
    } catch (error) {
      // Silently fail - activity logging should never break UX
      console.warn("Activity log failed:", error);
    }
  },

  // Get activity analytics dashboard
  async getDashboard(): Promise<ActivityDashboard> {
    const { data, error } = await supabase.functions.invoke("activity-tracker", {
      method: "GET",
    });
    if (error) throw error;
    return data;
  },

  // Track product view
  trackView(productId: string, metadata?: Record<string, unknown>): void {
    this.log({ activityType: "view", productId, metadata });
  },

  // Track product click
  trackClick(productId: string, metadata?: Record<string, unknown>): void {
    this.log({ activityType: "click", productId, metadata });
  },

  // Track demo access
  trackDemo(productId: string, metadata?: Record<string, unknown>): void {
    this.log({ activityType: "demo", productId, metadata });
  },

  // Track purchase
  trackBuy(productId: string, metadata?: Record<string, unknown>): void {
    this.log({ activityType: "buy", productId, metadata });
  },
};
