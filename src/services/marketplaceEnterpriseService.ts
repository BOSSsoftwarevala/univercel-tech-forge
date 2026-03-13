import { supabase } from '@/integrations/supabase/client';
import { createSystemRequest } from '@/hooks/useSystemRequestLogger';

// ─── Types ───────────────────────────────────────────────────────────
export interface MarketplaceProduct {
  product_id: string;
  product_name: string;
  description: string | null;
  category: string | null;
  monthly_price: number | null;
  lifetime_price: number | null;
  tech_stack: string | null;
  product_type: string | null;
  features_json: any;
  is_active: boolean | null;
  status: string | null;
  created_at: string;
}

export interface MarketplaceOrderInput {
  userId: string;
  userRole: string;
  franchiseId?: string;
  products: {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    discountPercent: number;
  }[];
  requirements?: string;
}

export interface OrderResult {
  success: boolean;
  orderNumber?: string;
  orderId?: string;
  error?: string;
}

// ─── Service ─────────────────────────────────────────────────────────
class MarketplaceEnterpriseService {

  // ── Fetch products with optional filters ──
  async getProducts(filters?: { category?: string; search?: string; limit?: number }) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.search) {
      query = query.or(`product_name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    return { data: data || [], error };
  }

  // ── Fetch sections for homepage rows ──
  async getSections() {
    const { data, error } = await supabase
      .from('marketplace_sections')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    return { data: data || [], error };
  }

  // ── Fetch active banners ──
  async getBanners() {
    const { data, error } = await supabase
      .from('marketplace_banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    return { data: data || [], error };
  }

  // ── Fetch featured products ──
  async getFeaturedProducts(sectionId?: string) {
    let query = supabase
      .from('marketplace_featured')
      .select('*, products(*)')
      .eq('is_active', true)
      .order('display_order');

    if (sectionId) {
      query = query.eq('section_id', sectionId);
    }

    const { data, error } = await query;
    return { data: data || [], error };
  }

  // ── Place a marketplace order (10-step flow) ──
  async placeOrder(input: MarketplaceOrderInput): Promise<OrderResult> {
    const orderNumber = `MKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const totalAmount = input.products.reduce((sum, p) => sum + p.unitPrice * p.quantity, 0);
    const discountAmount = input.products.reduce(
      (sum, p) => sum + (p.unitPrice * p.quantity * p.discountPercent) / 100,
      0
    );
    const finalAmount = totalAmount - discountAmount;

    // Step 1: Create order
    const { data: order, error: orderError } = await supabase
      .from('marketplace_orders')
      .insert({
        user_id: input.userId,
        franchise_id: input.franchiseId || null,
        order_number: orderNumber,
        total_amount: totalAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        payment_status: 'pending',
        status: 'pending',
        requirements: input.requirements || null,
      })
      .select('id')
      .single();

    if (orderError || !order) {
      return { success: false, error: orderError?.message || 'Failed to create order' };
    }

    // Step 2: Create order items
    const items = input.products.map((p) => ({
      order_id: order.id,
      product_id: p.productId,
      product_name: p.productName,
      unit_price: p.unitPrice,
      quantity: p.quantity,
      discount_percent: p.discountPercent,
      total_price: p.unitPrice * p.quantity * (1 - p.discountPercent / 100),
    }));

    const { error: itemsError } = await supabase
      .from('marketplace_order_items')
      .insert(items);

    if (itemsError) {
      // Compensate
      await supabase.from('marketplace_orders').delete().eq('id', order.id);
      return { success: false, error: itemsError.message };
    }

    // Step 3: Record status history
    await supabase.from('marketplace_order_status_history').insert({
      order_id: order.id,
      new_status: 'pending',
      changed_by: input.userId,
      reason: 'Order placed',
    });

    // Step 4: Log to activity_log (immutable)
    await supabase.from('activity_log').insert({
      action_type: 'order_created',
      entity_type: 'marketplace_order',
      entity_id: order.id,
      user_id: input.userId,
      role: input.userRole,
      severity_level: 'info',
      metadata: {
        order_number: orderNumber,
        total_amount: totalAmount,
        final_amount: finalAmount,
        products: input.products.map((p) => p.productName),
      },
    });

    // Step 5: Queue for Boss Panel
    await createSystemRequest({
      action_type: 'marketplace_order_placed',
      role_type: input.userRole,
      user_id: input.userId,
      payload_json: {
        order_number: orderNumber,
        order_id: order.id,
        total_amount: finalAmount,
        products_count: input.products.length,
      },
    });

    // Step 6: Notify user
    supabase.from('user_notifications').insert({
      user_id: input.userId,
      type: 'order',
      message: `Order ${orderNumber} placed successfully for ₹${finalAmount.toLocaleString()}`,
      event_type: 'order_placed',
    }).then(({ error }) => {
      if (error) console.error('[MarketplaceEnterprise] Notification failed:', error.message);
    });

    return { success: true, orderNumber, orderId: order.id };
  }

  // ── Get user orders ──
  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('marketplace_orders')
      .select('*, marketplace_order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  }

  // ── Get user licenses ──
  async getUserLicenses(userId: string) {
    const { data, error } = await supabase
      .from('user_licenses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  }

  // ── Toggle favorite ──
  async toggleFavorite(userId: string, productId: string): Promise<boolean> {
    const { data: existing } = await supabase
      .from('product_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (existing) {
      await supabase.from('product_favorites').delete().eq('id', existing.id);
      return false; // removed
    } else {
      await supabase.from('product_favorites').insert({ user_id: userId, product_id: productId });
      return true; // added
    }
  }

  // ── Get user favorites ──
  async getUserFavorites(userId: string) {
    const { data } = await supabase
      .from('product_favorites')
      .select('product_id')
      .eq('user_id', userId);
    return new Set((data || []).map((f) => f.product_id));
  }

  // ── Log analytics event ──
  async logAnalyticsEvent(
    userId: string | null,
    userRole: string | null,
    eventType: string,
    entityId?: string,
    metadata?: Record<string, unknown>
  ) {
    await supabase.from('activity_log').insert({
      action_type: eventType,
      entity_type: 'product',
      entity_id: entityId || null,
      user_id: userId,
      role: userRole,
      severity_level: 'info',
      metadata: { module: 'marketplace', ...metadata },
    });
  }
}

export const marketplaceEnterpriseService = new MarketplaceEnterpriseService();
