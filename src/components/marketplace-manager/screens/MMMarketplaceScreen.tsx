import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { createSystemRequest } from '@/hooks/useSystemRequestLogger';
import { useAuth } from '@/hooks/useAuth';
import { Search, Star, Heart, Play, ShoppingCart, ChevronLeft, ChevronRight, X, Monitor, Zap, TrendingUp, Sparkles, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface Product {
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

type PartnerRequestType =
  | 'franchise_request'
  | 'reseller_request'
  | 'developer_request'
  | 'support_request'
  | 'job_apply'
  | 'enquiry';

const CATEGORIES = [
  'Restaurant', 'Education', 'Healthcare', 'E-commerce', 'Hotel',
  'Real Estate', 'Finance', 'Manufacturing', 'CRM', 'HRM',
  'Logistics', 'Salon', 'Gym', 'Legal', 'Retail'
];

const CATEGORY_ICONS: Record<string, string> = {
  'Restaurant': '🍽️', 'Education': '📚', 'Healthcare': '🏥', 'E-commerce': '🛒',
  'Hotel': '🏨', 'Real Estate': '🏠', 'Finance': '💰', 'Manufacturing': '🏭',
  'CRM': '📊', 'HRM': '👥', 'Logistics': '🚚', 'Salon': '💇', 'Gym': '💪',
  'Legal': '⚖️', 'Retail': '🏪'
};

const PARTNER_REQUEST_BUTTONS: { event: PartnerRequestType; label: string }[] = [
  { event: 'franchise_request', label: 'Franchise Request' },
  { event: 'reseller_request', label: 'Reseller Request' },
  { event: 'developer_request', label: 'Developer Request' },
  { event: 'support_request', label: 'Support Request' },
  { event: 'job_apply', label: 'Job Apply' },
  { event: 'enquiry', label: 'Enquiry' },
];

export const MMMarketplaceScreen = () => {
  const navigate = useNavigate();
  const { productId, categoryId } = useParams();
  const { user, userRole } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProducts();
    fetchFavorites();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryId ? decodeURIComponent(categoryId) : null);
  }, [categoryId]);

  useEffect(() => {
    if (!productId) {
      setSelectedProduct(null);
      return;
    }

    const matched = products.find((product) => product.product_id === productId);
    if (matched) {
      setSelectedProduct(matched);
    }
  }, [productId, products]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts(generateMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      const { data } = await supabase
        .from('product_favorites')
        .select('product_id')
        .eq('user_id', authUser.id);
      if (data) setFavorites(new Set(data.map((favorite) => favorite.product_id)));
    } catch {
      // ignore
    }
  };

  const logEvent = async (
    eventType: string,
    product?: Product,
    options?: {
      queueForBoss?: boolean;
      severity?: 'info' | 'warning' | 'critical' | 'emergency';
      metadata?: Record<string, unknown>;
    }
  ) => {
    const actorId = user?.id ?? null;
    const eventMetadata = {
      module: 'marketplace',
      product_name: product?.product_name,
      category: product?.category,
      timestamp: new Date().toISOString(),
      ...(options?.metadata || {}),
    };

    // 1. Always queue to system_events for Boss Panel visibility
    try {
      await createSystemRequest({
        action_type: eventType,
        role_type: userRole || 'public',
        payload_json: eventMetadata,
        user_id: actorId,
      });
    } catch (err) {
      console.error('[Marketplace] System event failed:', err);
    }

    // 2. Also log to activity_log for historical audit trail
    try {
      await supabase.from('activity_log').insert({
        action_type: eventType,
        entity_type: product ? 'product' : 'marketplace',
        entity_id: product?.product_id ?? null,
        user_id: actorId,
        role: userRole || null,
        severity_level: options?.severity || 'info',
        metadata: eventMetadata,
      });
    } catch (err) {
      console.error('[Marketplace] Activity log failed:', err);
    }
  };

  const toggleFavorite = async (productIdToToggle: string) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        toast.error('Please log in to save favorites');
        return;
      }

      const product = products.find((item) => item.product_id === productIdToToggle);
      const wasFavorite = favorites.has(productIdToToggle);

      if (wasFavorite) {
        await supabase
          .from('product_favorites')
          .delete()
          .eq('user_id', authUser.id)
          .eq('product_id', productIdToToggle);

        setFavorites((prev) => {
          const next = new Set(prev);
          next.delete(productIdToToggle);
          return next;
        });

        toast.success('Removed from favorites');
      } else {
        await supabase.from('product_favorites').insert({ user_id: authUser.id, product_id: productIdToToggle });
        setFavorites((prev) => new Set(prev).add(productIdToToggle));
        toast.success('Added to favorites');
      }

      void logEvent('favorite_toggle', product, {
        metadata: {
          favorite_state: wasFavorite ? 'removed' : 'added',
        },
      });
    } catch {
      toast.error('Failed to update favorites');
    }
  };

  const handleDemo = (product: Product) => {
    void logEvent('demo_request', product, {
      severity: 'info',
      metadata: { stage: 'demo_requested' },
    });
    toast.info(`Loading demo for ${product.product_name}...`);
  };

  const handleBuy = (product: Product) => {
    void logEvent('purchase_request', product, {
      severity: 'warning',
      metadata: {
        stage: 'purchase_initiated',
        price: product.monthly_price,
        discounted_price: product.monthly_price ? Math.round(product.monthly_price * 0.7) : null,
      },
    });
    toast.success(`Order initiated for ${product.product_name}`);
  };

  const handleProductView = (product: Product) => {
    void logEvent('product_view', product);
    setSelectedProduct(product);
    navigate(`/marketplace/product/${product.product_id}`);
  };

  const handlePartnerRequest = async (requestType: PartnerRequestType, label: string) => {
    const needsApplicationRecord = requestType === 'reseller_request' || requestType === 'job_apply' || requestType === 'developer_request';

    if (needsApplicationRecord && !user) {
      void logEvent(requestType, undefined, {
        severity: 'warning',
        metadata: { request_label: label, requires_auth: true },
      });
      toast.error('Please login first so we can process your application');
      return;
    }

    let applicationInsertError: string | null = null;

    if (needsApplicationRecord && user) {
      const userMeta = (user.user_metadata ?? {}) as Record<string, unknown>;
      const fallbackName = user.email?.split('@')[0] || 'Marketplace User';
      const fullName = String(userMeta.full_name || fallbackName);

      const applicationType = requestType === 'reseller_request' ? 'reseller' : 'developer';

      const { error } = await supabase
        .from('reseller_applications')
        .insert({
          user_id: user.id,
          application_type: applicationType,
          full_name: fullName,
          email: user.email || `${user.id}@softwarevala.local`,
          phone: null,
          country: null,
          id_proof_uploaded: false,
          terms_accepted: true,
          promise_acknowledged: true,
          status: 'pending',
        });

      if (error) {
        applicationInsertError = error.message;
      }
    }

    void logEvent(requestType, undefined, {
      severity: 'warning',
      metadata: {
        request_label: label,
        application_sync: applicationInsertError ? 'failed' : (needsApplicationRecord ? 'created' : 'not_required'),
      },
    });

    if (applicationInsertError) {
      toast.error(`Request logged but application save failed: ${applicationInsertError}`);
      return;
    }

    toast.success(`${label} submitted — Boss has been notified`);
  };

  const handleCategoryFilter = (category: string | null) => {
    if (category) {
      navigate(`/marketplace/category/${encodeURIComponent(category)}`);
      return;
    }

    navigate('/marketplace');
  };

  const handleCloseProductDialog = () => {
    setSelectedProduct(null);
    if (productId) {
      navigate('/marketplace');
    }
  };

  const filtered = useMemo(() => {
    let result = products;

    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase();
      result = result.filter((product) =>
        product.product_name.toLowerCase().includes(normalizedQuery) ||
        product.description?.toLowerCase().includes(normalizedQuery) ||
        product.category?.toLowerCase().includes(normalizedQuery)
      );
    }

    if (selectedCategory) {
      result = result.filter((product) => product.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    return result;
  }, [products, searchQuery, selectedCategory]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, Product[]> = {};

    products.forEach((product) => {
      const category = product.category || 'Other';
      if (!groups[category]) groups[category] = [];
      groups[category].push(product);
    });

    return groups;
  }, [products]);

  const featuredProducts = useMemo(() => products.slice(0, 5), [products]);
  const trendingProducts = useMemo(() => [...products].sort(() => 0.5 - Math.random()).slice(0, 8), [products]);
  const newReleases = useMemo(() => products.slice(0, 8), [products]);

  const discountedPrice = (price: number | null) => (price ? (price * 0.7).toFixed(0) : '0');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-950">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading Marketplace...</p>
        </div>
      </div>
    );
  }

  const isSearching = Boolean(searchQuery || selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold">Software Marketplace</h1>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 text-xs">
              {products.length} Products
            </Badge>
          </div>
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search software..."
                className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-slate-500 hover:text-white" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {PARTNER_REQUEST_BUTTONS.map((request) => (
            <Button
              key={request.event}
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300 hover:text-white"
              onClick={() => handlePartnerRequest(request.event, request.label)}
            >
              {request.label}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              !selectedCategory ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(selectedCategory === category ? null : category)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === category ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {CATEGORY_ICONS[category] || '📦'} {category}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 space-y-8">
        {isSearching ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              {selectedCategory && ` in ${selectedCategory}`}
              {searchQuery && ` for "${searchQuery}"`}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  isFav={favorites.has(product.product_id)}
                  onView={handleProductView}
                  onDemo={handleDemo}
                  onBuy={handleBuy}
                  onFav={toggleFavorite}
                  discountedPrice={discountedPrice}
                />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-500">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No products found</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {featuredProducts.length > 0 && (
              <HeroBanner products={featuredProducts} onDemo={handleDemo} onBuy={handleBuy} onView={handleProductView} discountedPrice={discountedPrice} />
            )}

            <ProductRow
              title="Featured Software"
              icon={<Sparkles className="w-5 h-5 text-yellow-400" />}
              products={featuredProducts}
              favorites={favorites}
              onView={handleProductView}
              onDemo={handleDemo}
              onBuy={handleBuy}
              onFav={toggleFavorite}
              discountedPrice={discountedPrice}
            />

            <ProductRow
              title="Trending Now"
              icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
              products={trendingProducts}
              favorites={favorites}
              onView={handleProductView}
              onDemo={handleDemo}
              onBuy={handleBuy}
              onFav={toggleFavorite}
              discountedPrice={discountedPrice}
            />

            <ProductRow
              title="New Releases"
              icon={<Zap className="w-5 h-5 text-purple-400" />}
              products={newReleases}
              favorites={favorites}
              onView={handleProductView}
              onDemo={handleDemo}
              onBuy={handleBuy}
              onFav={toggleFavorite}
              discountedPrice={discountedPrice}
            />

            {Object.entries(groupedByCategory).slice(0, 6).map(([category, categoryProducts]) => (
              <ProductRow
                key={category}
                title={`${CATEGORY_ICONS[category] || '📦'} ${category}`}
                products={categoryProducts}
                favorites={favorites}
                onView={handleProductView}
                onDemo={handleDemo}
                onBuy={handleBuy}
                onFav={toggleFavorite}
                discountedPrice={discountedPrice}
              />
            ))}
          </>
        )}
      </div>

      {selectedProduct && (
        <ProductDetailDialog
          product={selectedProduct}
          open={Boolean(selectedProduct)}
          onClose={handleCloseProductDialog}
          onDemo={handleDemo}
          onBuy={handleBuy}
          isFav={favorites.has(selectedProduct.product_id)}
          onFav={toggleFavorite}
          discountedPrice={discountedPrice}
        />
      )}
    </div>
  );
};

function HeroBanner({ products, onDemo, onBuy, onView, discountedPrice }: {
  products: Product[];
  onDemo: (product: Product) => void;
  onBuy: (product: Product) => void;
  onView: (product: Product) => void;
  discountedPrice: (price: number | null) => string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const bannerProducts = products.slice(0, 5);

  useEffect(() => {
    if (isPaused || bannerProducts.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % bannerProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, bannerProducts.length]);

  if (bannerProducts.length === 0) return null;

  const product = bannerProducts[activeIndex];

  const GRADIENTS = [
    'from-cyan-900/60 via-slate-900 to-purple-900/40',
    'from-emerald-900/60 via-slate-900 to-cyan-900/40',
    'from-purple-900/60 via-slate-900 to-pink-900/40',
    'from-amber-900/60 via-slate-900 to-red-900/40',
    'from-blue-900/60 via-slate-900 to-indigo-900/40',
  ];

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${GRADIENTS[activeIndex % GRADIENTS.length]} border border-slate-800 transition-all duration-700`}>
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1.5 px-6 pt-3">
          {bannerProducts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className="flex-1 h-1 rounded-full overflow-hidden bg-white/20 cursor-pointer"
            >
              <div
                className={`h-full rounded-full transition-all ${
                  idx === activeIndex
                    ? 'bg-cyan-400 animate-[progress_5s_linear]'
                    : idx < activeIndex
                    ? 'bg-white/40 w-full'
                    : 'w-0'
                }`}
                style={idx === activeIndex ? { animation: isPaused ? 'none' : 'progress 5s linear forwards' } : idx < activeIndex ? { width: '100%' } : { width: '0%' }}
              />
            </button>
          ))}
        </div>

        <div className="p-8 md:p-12 min-h-[280px] flex items-center">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">{product.category || 'Software'}</Badge>
              <Badge className="bg-white/10 text-white/70 border-white/20 text-[10px]">AD</Badge>
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold mb-3 cursor-pointer hover:text-cyan-300 transition-colors"
              onClick={() => onView(product)}
            >
              {product.product_name}
            </h2>
            <p className="text-slate-300 text-sm md:text-base mb-6 line-clamp-2 max-w-lg">
              {product.description || 'Enterprise-grade software solution built for scale.'}
            </p>
            <div className="flex items-center gap-4 mb-6">
              {product.monthly_price && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 line-through text-sm">₹{product.monthly_price}/mo</span>
                  <span className="text-2xl font-bold text-cyan-400">₹{discountedPrice(product.monthly_price)}/mo</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">30% OFF</Badge>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button onClick={() => onDemo(product)} variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10">
                <Play className="w-4 h-4 mr-2" /> Try Demo
              </Button>
              <Button onClick={() => onBuy(product)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                <ShoppingCart className="w-4 h-4 mr-2" /> Buy Now
              </Button>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <Monitor className="w-full h-full" />
          </div>
        </div>

        {/* Navigation arrows */}
        {bannerProducts.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((prev) => (prev - 1 + bannerProducts.length) % bannerProducts.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/70 hover:text-white transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % bannerProducts.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/70 hover:text-white transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {bannerProducts.length > 1 && (
        <div className="flex gap-2 mt-3 justify-center">
          {bannerProducts.map((bp, idx) => (
            <button
              key={bp.product_id}
              onClick={() => setActiveIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                idx === activeIndex
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800/60 text-slate-500 hover:text-slate-300 border border-transparent'
              }`}
            >
              {bp.product_name.length > 15 ? bp.product_name.slice(0, 15) + '…' : bp.product_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductRow({ title, icon, products, favorites, onView, onDemo, onBuy, onFav, discountedPrice }: {
  title: string;
  icon?: React.ReactNode;
  products: Product[];
  favorites: Set<string>;
  onView: (product: Product) => void;
  onDemo: (product: Product) => void;
  onBuy: (product: Product) => void;
  onFav: (id: string) => void;
  discountedPrice: (price: number | null) => string;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="flex gap-1">
          <button onClick={() => scroll('left')} className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll('right')} className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {products.map((product) => (
          <div key={product.product_id} className="flex-shrink-0 w-56">
            <ProductCard
              product={product}
              isFav={favorites.has(product.product_id)}
              onView={onView}
              onDemo={onDemo}
              onBuy={onBuy}
              onFav={onFav}
              discountedPrice={discountedPrice}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, isFav, onView, onDemo, onBuy, onFav, discountedPrice }: {
  product: Product;
  isFav: boolean;
  onView: (product: Product) => void;
  onDemo: (product: Product) => void;
  onBuy: (product: Product) => void;
  onFav: (id: string) => void;
  discountedPrice: (price: number | null) => string;
}) {
  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all cursor-pointer" onClick={() => onView(product)}>
      <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
        <Monitor className="w-10 h-10 text-slate-700" />
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400 bg-slate-900/80">
            {product.category || 'Software'}
          </Badge>
        </div>
        <button onClick={(event) => { event.stopPropagation(); onFav(product.product_id); }} className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 transition">
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
        </button>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button onClick={(event) => { event.stopPropagation(); onDemo(product); }} className="p-2 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 transition">
            <Play className="w-4 h-4 text-cyan-400" />
          </button>
          <button onClick={(event) => { event.stopPropagation(); onBuy(product); }} className="p-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500/40 transition">
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>
      <div className="p-3">
        <h4 className="text-sm font-medium truncate">{product.product_name}</h4>
        <p className="text-xs text-slate-500 truncate mt-0.5">{product.description || 'Enterprise software'}</p>
        <div className="flex items-center justify-between mt-2">
          {product.monthly_price ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-600 line-through">₹{product.monthly_price}</span>
              <span className="text-sm font-bold text-cyan-400">₹{discountedPrice(product.monthly_price)}</span>
            </div>
          ) : (
            <span className="text-xs text-slate-500">Contact Sales</span>
          )}
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] text-slate-400">4.8</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetailDialog({ product, open, onClose, onDemo, onBuy, isFav, onFav, discountedPrice }: {
  product: Product;
  open: boolean;
  onClose: () => void;
  onDemo: (product: Product) => void;
  onBuy: (product: Product) => void;
  isFav: boolean;
  onFav: (id: string) => void;
  discountedPrice: (price: number | null) => string;
}) {
  const features = Array.isArray(product.features_json) ? product.features_json : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.product_name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            <div className="h-40 bg-gradient-to-br from-cyan-900/40 to-slate-800 rounded-lg flex items-center justify-center">
              <Monitor className="w-16 h-16 text-slate-600" />
            </div>

            <div className="flex flex-wrap gap-2">
              {product.category && <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">{product.category}</Badge>}
              {product.tech_stack && <Badge variant="outline" className="border-purple-500/50 text-purple-400">{product.tech_stack}</Badge>}
              {product.product_type && <Badge variant="outline" className="border-slate-600 text-slate-400">{product.product_type}</Badge>}
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-1">Description</h3>
              <p className="text-sm text-slate-400">{product.description || 'Enterprise-grade software solution for your business.'}</p>
            </div>

            {features.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Features</h3>
                <ul className="grid grid-cols-2 gap-1.5">
                  {features.map((feature: string, index: number) => (
                    <li key={index} className="text-xs text-slate-400 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-3">Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                {product.monthly_price && (
                  <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
                    <p className="text-xs text-slate-500">Monthly</p>
                    <p className="text-slate-500 line-through text-xs">₹{product.monthly_price}</p>
                    <p className="text-lg font-bold text-cyan-400">₹{discountedPrice(product.monthly_price)}/mo</p>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px] mt-1">30% Franchise Discount</Badge>
                  </div>
                )}
                {product.lifetime_price && (
                  <div className="bg-slate-900 rounded-lg p-3 border border-cyan-500/30">
                    <p className="text-xs text-slate-500">Lifetime</p>
                    <p className="text-slate-500 line-through text-xs">₹{product.lifetime_price}</p>
                    <p className="text-lg font-bold text-cyan-400">₹{discountedPrice(product.lifetime_price)}</p>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-0 text-[10px] mt-1">Best Value</Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
          <Button onClick={() => onFav(product.product_id)} variant="outline" size="sm" className={`border-slate-700 ${isFav ? 'text-red-400' : 'text-slate-400'}`}>
            <Heart className={`w-4 h-4 mr-1 ${isFav ? 'fill-red-500' : ''}`} />
            {isFav ? 'Saved' : 'Save'}
          </Button>
          <Button onClick={() => onDemo(product)} variant="outline" size="sm" className="border-cyan-500/50 text-cyan-400">
            <Play className="w-4 h-4 mr-1" /> Demo
          </Button>
          <Button onClick={() => onBuy(product)} size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white ml-auto">
            <ShoppingCart className="w-4 h-4 mr-1" /> Buy Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generateMockProducts(): Product[] {
  const categories = ['Restaurant', 'Education', 'Healthcare', 'E-commerce', 'Hotel', 'CRM', 'HRM', 'Finance'];
  return Array.from({ length: 24 }, (_, index) => ({
    product_id: `mock-${index}`,
    product_name: `${categories[index % categories.length]} Management Pro ${index + 1}`,
    description: `Complete ${categories[index % categories.length].toLowerCase()} management solution with AI-powered features`,
    category: categories[index % categories.length],
    monthly_price: 2999 + index * 500,
    lifetime_price: 29999 + index * 5000,
    tech_stack: ['React', 'Node.js', 'Python', 'Flutter'][index % 4],
    product_type: 'SaaS',
    features_json: ['Dashboard', 'Reports', 'Analytics', 'API Access', 'Mobile App', '24/7 Support'],
    is_active: true,
    status: 'active',
    created_at: new Date().toISOString(),
  }));
}

