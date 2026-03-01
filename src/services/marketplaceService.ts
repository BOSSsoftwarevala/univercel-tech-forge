/**
 * Marketplace Service
 * Connects marketplace activity to boss panel, product manager, orders, licenses, and notifications.
 */

import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface MarketplaceProduct {
  product_id: string;
  product_name: string;
  description: string | null;
  category: string | null;
  monthly_price: number | null;
  lifetime_price: number | null;
  pricing_model: string | null;
  status: string | null;
  is_active: boolean | null;
}

export interface MarketplaceOrder {
  id: string;
  order_number: string;
  client_name: string | null;
  client_email: string | null;
  order_status: string | null;
  created_at: string;
}

export interface MarketplaceNotification {
  id: string;
  type: string;
  message: string;
  is_read: boolean | null;
  created_at: string;
  event_type: string | null;
}

export interface MarketplaceStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  unreadNotifications: number;
}

export const marketplaceService = {
  /**
   * Fetch all active products from the products table.
   * Marketplace listing pulls from this data.
   */
  async getProducts(): Promise<MarketplaceProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select(
        'product_id, product_name, description, category, monthly_price, lifetime_price, pricing_model, status, is_active'
      )
      .eq('is_active', true)
      .order('product_name');

    if (error) throw error;
    return data ?? [];
  },

  /**
   * Fetch recent orders from demo_orders table.
   */
  async getOrders(limit = 10): Promise<MarketplaceOrder[]> {
    const { data, error } = await supabase
      .from('demo_orders')
      .select('id, order_number, client_name, client_email, order_status, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  },

  /**
   * Fetch boss panel notifications from user_notifications.
   */
  async getNotifications(userId: string, limit = 20): Promise<MarketplaceNotification[]> {
    const { data, error } = await supabase
      .from('user_notifications')
      .select('id, type, message, is_read, created_at, event_type')
      .eq('user_id', userId)
      .eq('is_dismissed', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  },

  /**
   * Aggregate marketplace stats for boss panel dashboard.
   */
  async getStats(): Promise<MarketplaceStats> {
    const [productsRes, ordersRes] = await Promise.all([
      supabase
        .from('products')
        .select('product_id, is_active', { count: 'exact', head: false }),
      supabase
        .from('demo_orders')
        .select('id, order_status', { count: 'exact', head: false }),
    ]);

    const totalProducts = productsRes.count ?? 0;
    const activeProducts =
      (productsRes.data ?? []).filter((p) => p.is_active).length;
    const totalOrders = ordersRes.count ?? 0;
    const pendingOrders = (ordersRes.data ?? []).filter(
      (o) => o.order_status === 'pending' || o.order_status === null
    ).length;

    return {
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      unreadNotifications: 0,
    };
  },

  /**
   * Mark a notification as read.
   */
  async markNotificationRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('user_notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) throw error;
  },

  /**
   * Subscribe to real-time product changes.
   * Marketplace listing auto-refreshes when products are updated.
   */
  subscribeToProductChanges(
    onUpdate: () => void
  ): RealtimeChannel {
    return supabase
      .channel('marketplace_products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        onUpdate
      )
      .subscribe();
  },

  /**
   * Subscribe to real-time order events.
   * Boss panel dashboard refreshes when new orders arrive.
   */
  subscribeToOrderChanges(
    onUpdate: () => void
  ): RealtimeChannel {
    return supabase
      .channel('marketplace_orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'demo_orders' },
        onUpdate
      )
      .subscribe();
  },

  /**
   * Subscribe to real-time boss notifications.
   */
  subscribeToNotifications(
    userId: string,
    onUpdate: () => void
  ): RealtimeChannel {
    return supabase
      .channel(`notifications_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${userId}`,
        },
        onUpdate
      )
      .subscribe();
  },
};
