import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, ShoppingCart, Eye } from 'lucide-react';
import { toast } from 'sonner';

type UnifiedProduct = {
  id: string; // canonical id (products.product_id or marketplace_applications.id)
  source: 'products' | 'marketplace_applications';
  product_id?: string; // present when source === 'products'
  name: string;
  description?: string | null;
  category?: string | null;
  price?: number; // unified display price (USD)
  pricing_model?: string | null;
  is_active?: boolean;
  tech_stack?: string | null;
  product_type?: string | null;
  features?: string[];
  raw?: Record<string, any>;
};

async function fetchProductsFromProductsTable(): Promise<UnifiedProduct[] | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        'product_id, product_name, description, category, monthly_price, lifetime_price, pricing_model, is_active, tech_stack, product_type, features_json, status'
      )
      .order('product_name', { ascending: true })
      .limit(500);
    if (error) {
      // If table doesn't exist or permission denied, bubble up
      throw error;
    }
    if (!data) return [];
    return (data || []).map((r: any) => {
      const features: string[] = Array.isArray(r.features_json)
        ? r.features_json
        : typeof r.features_json === 'object' && r.features_json
        ? Object.values(r.features_json)
        : [];
      const price = r.monthly_price ?? r.lifetime_price ?? null;
      return {
        id: r.product_id,
        source: 'products' as const,
        product_id: r.product_id,
        name: r.product_name || 'Untitled',
        description: r.description || null,
        category: r.category || null,
        price,
        pricing_model: r.pricing_model || null,
        is_active: !!r.is_active,
        tech_stack: r.tech_stack || null,
        product_type: r.product_type || null,
        features,
        raw: r,
      } as UnifiedProduct;
    });
  } catch (err) {
    return null;
  }
}

async function fetchProductsFromMarketplaceApplications(): Promise<UnifiedProduct[] | null> {
  try {
    const { data, error } = await supabase
      .from('marketplace_applications')
      .select('id, name, description, category, price_usd, metadata, is_active')
      .order('name', { ascending: true })
      .limit(500);
    if (error) throw error;
    if (!data) return [];
    return (data || []).map((r: any) => ({
      id: r.id,
      source: 'marketplace_applications' as const,
      name: r.name || 'Untitled',
      description: r.description || null,
      category: r.category || null,
      price: r.price_usd ?? null,
      pricing_model: null,
      is_active: !!r.is_active,
      tech_stack: r.metadata?.tech_stack || null,
      product_type: r.metadata?.product_type || null,
      features: Array.isArray(r.metadata?.features) ? r.metadata.features : [],
      raw: r,
    } as UnifiedProduct));
  } catch (err) {
    return null;
  }
}

export function MMMarketplaceScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery(
    ['mm-marketplace-products'],
    async (): Promise<UnifiedProduct[]> => {
      // Prefer products table (used by many pages). Fallback to marketplace_applications if unavailable.
      const fromProducts = await fetchProductsFromProductsTable();
      if (fromProducts !== null) return fromProducts;

      const fromApps = await fetchProductsFromMarketplaceApplications();
      if (fromApps !== null) return fromApps;

      // If both attempts returned null (permission or relation issues), throw to let UI handle
      throw new Error('Failed to load marketplace products (products and marketplace_applications unavailable)');
    },
    {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    }
  );

  const visible = useMemo(() => {
    if (!products) return [];
    const q = query.trim().toLowerCase();

    return products
      .filter((p) => p && typeof p.id === 'string' && p.id.trim() !== '')
      .filter((p) => {
        if (!q) return true;
        return (
          (p.name || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.tech_stack || '').toLowerCase().includes(q)
        );
      });
  }, [products, query]);

  const handleBuyNow = async (product: UnifiedProduct) => {
    // Prevent double clicks
    if (buyingId) return;

    if (!product?.id) {
      toast.error('Product is not purchasable (missing id).');
      return;
    }

    setBuyingId(product.id);

    try {
      // Ensure authenticated
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) {
        toast.info('Please sign in to purchase');
        navigate('/auth');
        return;
      }

      // Prefer server/edge function for order creation (service-role safe)
      try {
        // Attempt to invoke edge function 'create-order-on-payment' if available
        // Provide a minimal payload; function should create order and return order id/checkout info.
        const fnPayload = {
          product_id: product.product_id ?? product.id,
          product_source: product.source,
          amount: product.price ?? 0,
          currency: 'USD',
          buyer_id: user.id,
        };

        // Ensure JSON body and content-type for functions
        const fnResult = await supabase.functions
          .invoke('create-order-on-payment', {
            body: JSON.stringify(fnPayload),
            headers: { 'Content-Type': 'application/json' },
          })
          .catch(() => null);

        if (fnResult) {
          // Normalize possible responses (supabase may return a Response-like or object)
          let body: any = null;
          try {
            // If it's a fetch Response-like with json()
            if (typeof (fnResult as any).json === 'function') {
              body = await (fnResult as any).json();
            } else if (typeof (fnResult as any).text === 'function') {
              const txt = await (fnResult as any).text();
              try {
                body = txt ? JSON.parse(txt) : null;
              } catch {
                body = txt;
              }
            } else {
              body = (fnResult as any).data ?? fnResult;
            }
          } catch {
            body = (fnResult as any).data ?? fnResult;
          }

          const checkout = body?.checkout_url || body?.checkoutUrl || body?.redirect;
          const orderId = body?.order_id || body?.id;
          toast.success('Order created', { description: orderId ? `Order: ${orderId}` : undefined });
          if (checkout) {
            window.location.href = checkout;
            return;
          }
          // If no checkout, navigate to library/orders page
          navigate('/user/library');
          return;
        }
      } catch (fnErr) {
        // swallow and fallback to direct insert
      }

      // Fallback: try inserting into orders table directly (may be blocked by RLS)
      const insertPayload: Record<string, any> = {
        user_id: user.id,
        currency: 'USD',
        gateway: 'manual_fallback',
        metadata: { source: product.source },
      };

      // If product came from products table, store product_id field; if marketplace_applications, store application_id
      if (product.source === 'products') {
        insertPayload['application_id'] = product.id; // best-effort mapping
        insertPayload['amount_usd'] = product.price ?? 0;
      } else {
        insertPayload['application_id'] = product.id;
        insertPayload['amount_usd'] = product.price ?? 0;
      }

      const { data: inserted, error: insertError } = await supabase.from('orders').insert(insertPayload).select().single();
      if (insertError) {
        // If insertion fails (permissions or relation missing), show helpful message
        throw insertError;
      }

      toast.success('Order created', { description: `Order ID: ${inserted?.id ?? 'unknown'}` });
      navigate('/user/library');
    } catch (err: any) {
      console.error('Purchase failed:', err);
      const msg = err?.message || String(err);
      if (msg.includes('relation') || msg.includes('permission')) {
        toast.error('Purchase failed due to backend configuration. Please contact admin.');
      } else {
        toast.error('Purchase failed: ' + msg);
      }
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Marketplace</h2>
            <p className="text-sm text-slate-400">Browse products and marketplace applications</p>
          </div>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search products, categories, tech..."
              value={query}
              onChange={(e: any) => setQuery(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
            />
            <Button variant="outline" onClick={() => refetch()}>
              <Eye className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </header>

        {isLoading && (
          <div className="py-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        )}

        {error && (
          <div className="py-6">
            <Card className="border-border/50">
              <CardHeader>
                <h3 className="text-lg font-semibold">Failed to load marketplace</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">Error: {(error as Error).message}</p>
                <div className="mt-4">
                  <Button onClick={() => refetch()}>Retry</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((p) => (
              <Card key={p.id} className="bg-slate-900 border-slate-800">
                <CardHeader className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold">{p.name}</h4>
                      {p.is_active ? (
                        <Badge className="bg-green-900/40 text-green-300 border-green-700">Live</Badge>
                      ) : (
                        <Badge className="bg-slate-800 text-slate-300">Draft</Badge>
                      )}
                    </div>
                    {p.category && <p className="text-xs text-slate-400 mt-1">{p.category}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-lg">
                      {p.price !== null && p.price !== undefined ? `$${Number(p.price).toFixed(2)}` : '—'}
                    </p>
                    <p className="text-xs text-slate-400">{p.pricing_model ?? (p.source === 'marketplace_applications' ? 'Fixed' : '')}</p>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-3">
                  <p className="text-sm text-slate-300 line-clamp-3">{p.description ?? 'No description available'}</p>
                  <div className="flex items-center justify-between gap-3">
                    {/* View Details must navigate to ProductDetailPage which expects product_id param for products table.
                        We pass product.product_id when available; otherwise fallback to id. */}
                    <Link to={`/marketplace/${p.product_id ?? p.id}`} className="no-underline">
                      <Button variant="ghost" className="gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </Link>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleBuyNow(p)}
                        disabled={buyingId !== null}
                        className="flex items-center gap-2"
                      >
                        {buyingId === p.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            Buy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {visible.length === 0 && (
              <div className="col-span-full">
                <Card className="border-border/50">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">No products found</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-400">Try a different search or refresh the list.</p>
                    <div className="mt-4">
                      <Button onClick={() => refetch()}>Refresh</Button>
                      <Link to="/demos" className="ml-3">
                        <Button variant="outline">Browse Demos</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MMMarketplaceScreen;
