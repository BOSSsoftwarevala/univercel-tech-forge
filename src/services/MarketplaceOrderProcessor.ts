import { supabase } from '@/integrations/supabase/client';

type OrderRow = any;
type ProductRow = any;

/**
 * MarketplaceOrderProcessor
 *
 * - Client-side service to perform common marketplace/order tasks.
 * - Methods are best-effort and return results or throw on unexpected failures.
 *
 * NOTE: Depending on your Row-Level Security (RLS) setup, some write operations
 * from the browser may be blocked. If you get permission errors, perform these
 * actions via a server/Edge Function using the SUPABASE_SERVICE_ROLE_KEY.
 */
export default class MarketplaceOrderProcessor {
  /**
   * Process order confirmation:
   * - Fetches the order
   * - Attempts to mark it as 'confirmed' and create a license (if applicable)
   * - Updates order with license_id and logs a transaction
   * - Inserts a buyer notification
   */
  async processOrderConfirmation(orderId: string): Promise<{ success: boolean; order?: OrderRow; license?: any; error?: any }> {
    try {
      // fetch order
      const { data: order, error: fetchErr } = await supabase
        .from('marketplace_orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (fetchErr) {
        console.error('[MarketplaceOrderProcessor] fetch order error', fetchErr);
        return { success: false, error: fetchErr };
      }
      if (!order) {
        return { success: false, error: 'Order not found' };
      }

      // Update status to confirmed (processing step)
      const { data: updatedOrder, error: updateErr } = await supabase
        .from('marketplace_orders')
        .update({ status: 'confirmed', updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();

      if (updateErr) {
        console.error('[MarketplaceOrderProcessor] update order status error', updateErr);
        return { success: false, error: updateErr };
      }

      let license: any = null;
      try {
        // Create license if product requires a license (best-effort)
        const licenseKey = `LIC-${String(orderId).substring(0, 8).toUpperCase()}-${crypto.randomUUID().replace(/-/g, '').substring(0, 12).toUpperCase()}`;
        const expiry = order.license_type === 'lifetime'
          ? null
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

        const { data: licenseData, error: licenseErr } = await supabase
          .from('licenses')
          .insert({
            order_id: orderId,
            user_id: order.user_id ?? null,
            product_id: order.product_id ?? null,
            license_key: licenseKey,
            license_type: order.license_type ?? 'standard',
            is_lifetime: order.license_type === 'lifetime',
            expiry_date: expiry,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (licenseErr) {
          console.warn('[MarketplaceOrderProcessor] license creation failed (best-effort)', licenseErr);
        } else {
          license = licenseData;
          // attach license to order
          await supabase
            .from('marketplace_orders')
            .update({ license_id: license.id, status: 'completed', completed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
            .eq('id', orderId);
        }
      } catch (e) {
        console.warn('[MarketplaceOrderProcessor] license creation exception', e);
      }

      // Log transaction (best-effort)
      try {
        await supabase.from('transactions').insert({
          type: 'order_confirmed',
          amount: Number(order.amount) || 0,
          currency: order.currency ?? 'INR',
          status: 'success',
          reference: order.order_number ?? null,
          related_user: order.user_id ?? null,
          created_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('[MarketplaceOrderProcessor] transaction log failed', e);
      }

      // Notify buyer (best-effort)
      try {
        await supabase.from('user_notifications').insert({
          user_id: order.user_id ?? null,
          title: 'Order Confirmed',
          message: `Your order ${order.order_number ?? orderId} has been confirmed.`,
          type: 'order',
          event_type: 'order_confirmed',
          action_id: orderId,
          is_read: false,
          created_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('[MarketplaceOrderProcessor] notify buyer failed', e);
      }

      return { success: true, order: updatedOrder, license: license || undefined };
    } catch (err) {
      console.error('[MarketplaceOrderProcessor] processOrderConfirmation unexpected error', err);
      return { success: false, error: err };
    }
  }

  /**
   * Retrieve product details by id
   */
  async getProductDetails(productId: string): Promise<{ success: boolean; product?: ProductRow; error?: any }> {
    try {
      const { data, error } = await supabase.from('marketplace_products').select('*').eq('id', productId).single();
      if (error) {
        console.error('[MarketplaceOrderProcessor] getProductDetails error', error);
        return { success: false, error };
      }
      return { success: true, product: data };
    } catch (err) {
      console.error('[MarketplaceOrderProcessor] getProductDetails unexpected error', err);
      return { success: false, error: err };
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: string): Promise<{ success: boolean; order?: OrderRow; error?: any }> {
    try {
      const { data, error } = await supabase
        .from('marketplace_orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('[MarketplaceOrderProcessor] updateOrderStatus error', error);
        return { success: false, error };
      }
      return { success: true, order: data };
    } catch (err) {
      console.error('[MarketplaceOrderProcessor] updateOrderStatus unexpected error', err);
      return { success: false, error: err };
    }
  }

  /**
   * Notify buyer for a specific order
   */
  async notifyBuyer(orderId: string, message: string): Promise<{ success: boolean; inserted?: any; error?: any }> {
    try {
      const { data: order, error: fetchErr } = await supabase
        .from('marketplace_orders')
        .select('id, user_id, order_number, buyer_email')
        .eq('id', orderId)
        .single();

      if (fetchErr) {
        console.error('[MarketplaceOrderProcessor] notifyBuyer fetch order error', fetchErr);
        return { success: false, error: fetchErr };
      }
      if (!order) {
        return { success: false, error: 'Order not found' };
      }

      // Insert user notification
      const payload = {
        user_id: order.user_id ?? null,
        title: `Update for order ${order.order_number ?? orderId}`,
        message,
        type: 'order',
        event_type: 'order_update',
        action_id: orderId,
        is_read: false,
        created_at: new Date().toISOString(),
      };

      const { data: inserted, error: insertErr } = await supabase.from('user_notifications').insert(payload).select();
      if (insertErr) {
        console.error('[MarketplaceOrderProcessor] notifyBuyer insert error', insertErr);
        return { success: false, error: insertErr };
      }

      return { success: true, inserted };
    } catch (err) {
      console.error('[MarketplaceOrderProcessor] notifyBuyer unexpected error', err);
      return { success: false, error: err };
    }
  }
}
