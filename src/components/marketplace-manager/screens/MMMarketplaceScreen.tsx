import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { createSystemRequest } from '@/hooks/useSystemRequestLogger';
import { useAuth } from '@/hooks/useAuth';
import { Search, Star, Heart, Play, ShoppingCart, ChevronLeft, ChevronRight, X, Monitor, Zap, TrendingUp, Sparkles, Package, Github, ExternalLink, GitCommit, RefreshCw, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useValaVoice } from '@/hooks/useValaVoice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { ProductSEOHead } from '@/components/seo/ProductSEOHead';

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
  demo_url?: string | null;
  demo_id?: string | null;
  github_repo_url?: string | null;
  repo_language?: string | null;
  demo_build_status?: string | null;
  last_repo_sync_at?: string | null;
  listing_status?: string | null;
  source?: string | null;
  product_thumbnail_url?: string | null;
  product_icon_url?: string | null;
}

type PartnerRequestType =
  | 'franchise_request'
  | 'reseller_request'
  | 'developer_request'
  | 'support_request'
  | 'job_apply'
  | 'enquiry';

const CATEGORY_ICONS: Record<string, string> = {
  'Restaurant': '🍽️', 'Education': '📚', 'Healthcare': '🏥', 'E-Commerce': '🛒',
  'E-commerce': '🛒', 'Hotel': '🏨', 'Hotel/Travel': '🏨', 'Real Estate': '🏠',
  'Finance': '💰', 'Manufacturing': '🏭', 'CRM': '📊', 'HRM': '👥',
  'Logistics': '🚚', 'Salon': '💇', 'Beauty/Salon': '💇', 'Gym': '💪',
  'Fitness': '💪', 'Legal': '⚖️', 'Retail': '🏪', 'POS': '🏪',
  'ERP': '🏢', 'Inventory': '📦', 'Insurance': '🛡️', 'Lending': '🏦',
  'Automotive': '🚗', 'Events': '🎉', 'Library': '📖', 'General': '📦',
  'Project Management': '📋', 'Subscription': '🔄',
};

const PARTNER_REQUEST_BUTTONS: { event: PartnerRequestType; label: string }[] = [
  { event: 'franchise_request', label: 'Franchise Request' },
  { event: 'reseller_request', label: 'Reseller Request' },
  { event: 'developer_request', label: 'Developer Request' },
  { event: 'support_request', label: 'Support Request' },
  { event: 'job_apply', label: 'Job Apply' },
  { event: 'enquiry', label: 'Enquiry' },
];

// Constants for pagination - optimized for 10K+ products
const PAGE_SIZE = 50;
const CATEGORY_PREVIEW_SIZE = 15;
const SEARCH_DEBOUNCE_MS = 300;

// Transform raw DB data to Product format
const transformProduct = (item: any): Product => ({
  product_id: item.id || item.product_id,
  product_name: item.name || item.product_name || 'Unnamed Product',
  description: item.description || item.short_description || `${item.category || 'Enterprise'} software solution by ${item.vendor || 'Software Vala'}`,
  category: item.category,
  monthly_price: item.base_price ? Number(item.base_price) : 249,
  lifetime_price: item.base_price ? Math.round(Number(item.base_price) * 10) : 2490,
  tech_stack: item.tech_stack || item.type || null,
  product_type: item.type || item.product_type || 'SaaS',
  features_json: item.features_json || null,
  is_active: item.is_active ?? true,
  status: item.status || 'active',
  created_at: item.created_at,
  demo_url: item.demo_url || null,
  demo_id: item.demo_id || null,
  github_repo_url: item.github_repo_url || null,
  repo_language: item.repo_language || null,
  demo_build_status: item.demo_build_status || null,
  last_repo_sync_at: item.last_repo_sync_at || null,
  listing_status: item.listing_status || 'draft',
  source: item.source || 'vala_ai',
  product_thumbnail_url: item.product_thumbnail_url || null,
  product_icon_url: item.product_icon_url || null,
});

export const MMMarketplaceScreen = () => {
  const navigate = useNavigate();
  const { productId, categoryId } = useParams();
  const { user, userRole } = useAuth();

  // Core state
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [totalCount, setTotalCount] = useState(0);

  // Paginated data
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchPage, setSearchPage] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasMoreSearch, setHasMoreSearch] = useState(true);

  // Featured sections (cached)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestLaunches, setLatestLaunches] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [upcomingProducts, setUpcomingProducts] = useState<Product[]>([]);

  // Category data
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Record<string, Product[]>>({});
  const [categoryLoading, setCategoryLoading] = useState<Record<string, boolean>>({});

  // Refs for infinite scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Initial load - get counts and featured products only
  useEffect(() => {
    initializeMarketplace();
    fetchFavorites();
  }, []);

  // Handle URL params
  useEffect(() => {
    setSelectedCategory(categoryId ? decodeURIComponent(categoryId) : null);
  }, [categoryId]);

  // Fetch product from URL
  useEffect(() => {
    if (!productId) {
      setSelectedProduct(null);
      return;
    }
    fetchProductById(productId);
  }, [productId]);

  // Database search when debounced query changes
  useEffect(() => {
    if (debouncedSearch || selectedCategory) {
      performSearch(0, true);
    } else {
      setSearchResults([]);
      setSearchPage(0);
      setHasMoreSearch(true);
    }
  }, [debouncedSearch, selectedCategory]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreSearch && !searchLoading && (debouncedSearch || selectedCategory)) {
          performSearch(searchPage + 1, false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMoreSearch, searchLoading, searchPage, debouncedSearch, selectedCategory]);

  const initializeMarketplace = async () => {
    try {
      // Parallel fetch: count, categories, and featured sections
      const [countResult, categoriesResult, featuredResult, latestResult, trendingResult, upcomingResult] = await Promise.all([
        supabase.from('software_catalog' as any).select('id', { count: 'exact', head: true }),
        supabase.from('software_catalog' as any).select('category').not('category', 'is', null),
        supabase.from('software_catalog' as any).select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('software_catalog' as any).select('*').or('listing_status.eq.live,demo_url.not.is.null').order('created_at', { ascending: false }).limit(10),
        supabase.from('software_catalog' as any).select('*').order('created_at', { ascending: false }).range(100, 115),
        supabase.from('software_catalog' as any).select('*').or('listing_status.eq.upcoming,listing_status.eq.coming_soon').limit(10),
      ]);

      // Set total count
      setTotalCount(countResult.count || 0);

      // Extract unique categories
      if (categoriesResult.data) {
        const cats = Array.from(new Set(categoriesResult.data.map((p: any) => p.category).filter(Boolean) as string[])).sort();
        setDynamicCategories(cats);
      }

      // Set featured sections
      if (featuredResult.data) setFeaturedProducts(featuredResult.data.map(transformProduct));
      if (latestResult.data && latestResult.data.length > 0) {
        setLatestLaunches(latestResult.data.map(transformProduct));
      } else if (featuredResult.data) {
        setLatestLaunches(featuredResult.data.slice(0, 10).map(transformProduct));
      }
      if (trendingResult.data) setTrendingProducts(trendingResult.data.map(transformProduct));
      if (upcomingResult.data) setUpcomingProducts(upcomingResult.data.map(transformProduct));

    } catch (err) {
      console.error('Failed to initialize marketplace:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('software_catalog' as any)
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setSelectedProduct(transformProduct(data));
      }
    } catch (err) {
      console.error('Failed to fetch product:', err);
    }
  };

  const performSearch = async (page: number, reset: boolean) => {
    if (searchLoading) return;
    setSearchLoading(true);

    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('software_catalog' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      // Apply category filter
      if (selectedCategory) {
        query = query.ilike('category', selectedCategory);
      }

      // Apply text search using database ILIKE (faster than client-side)
      if (debouncedSearch) {
        query = query.or(`name.ilike.%${debouncedSearch}%,category.ilike.%${debouncedSearch}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const products = (data || []).map(transformProduct);

      if (reset) {
        setSearchResults(products);
        setSearchPage(0);
      } else {
        setSearchResults(prev => [...prev, ...products]);
        setSearchPage(page);
      }

      setHasMoreSearch(products.length === PAGE_SIZE);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const loadCategoryProducts = useCallback(async (category: string) => {
    if (categoryProducts[category] || categoryLoading[category]) return;

    setCategoryLoading(prev => ({ ...prev, [category]: true }));

    try {
      const { data, error } = await supabase
        .from('software_catalog' as any)
        .select('*')
        .ilike('category', category)
        .order('created_at', { ascending: false })
        .limit(CATEGORY_PREVIEW_SIZE);

      if (!error && data) {
        setCategoryProducts(prev => ({ ...prev, [category]: data.map(transformProduct) }));
      }
    } catch (err) {
      console.error(`Failed to load ${category}:`, err);
    } finally {
      setCategoryLoading(prev => ({ ...prev, [category]: false }));
    }
  }, [categoryProducts, categoryLoading]);

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
    } catch {
      toast.error('Failed to update favorites');
    }
  };

  const handleDemo = (product: Product) => {
    void logEvent('demo_request', product, { severity: 'info' });
    const demoUrl = product.demo_url;
    if (demoUrl) {
      window.open(demoUrl, '_blank');
      toast.success(`Opening demo for ${product.product_name}`);
    } else {
      const category = product.category?.toLowerCase().replace(/[^a-z]/g, '-') || 'general';
      navigate(`/demo-directory?category=${category}&product=${product.product_id}`);
      toast.info(`Loading demo for ${product.product_name}...`);
    }
  };

  const handleBuy = (product: Product) => {
    void logEvent('purchase_request', product, { severity: 'warning' });
    navigate(`/marketplace/product/${product.product_id}`);
    setSelectedProduct(product);
    toast.success(`Opening purchase page for ${product.product_name}`);
  };

  const handleProductView = (product: Product) => {
    void logEvent('product_view', product);
    setSelectedProduct(product);
    navigate(`/marketplace/product/${product.product_id}`);
  };

  const handlePartnerRequest = async (requestType: PartnerRequestType, label: string) => {
    const needsApplicationRecord = requestType === 'reseller_request' || requestType === 'job_apply' || requestType === 'developer_request';

    if (needsApplicationRecord && !user) {
      toast.error('Please login first so we can process your application');
      return;
    }

    if (needsApplicationRecord && user) {
      const userMeta = (user.user_metadata ?? {}) as Record<string, unknown>;
      const fallbackName = user.email?.split('@')[0] || 'Marketplace User';
      const fullName = String(userMeta.full_name || fallbackName);
      const applicationType = requestType === 'reseller_request' ? 'reseller' : 'developer';

      await supabase.from('reseller_applications').insert({
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
    }

    void logEvent(requestType, undefined, { severity: 'warning', metadata: { request_label: label } });
    toast.success(`${label} submitted — Boss has been notified`);
  };

  const handleCategoryFilter = (category: string | null) => {
    if (category) {
      navigate(`/marketplace/category/${encodeURIComponent(category)}`);
    } else {
      navigate('/marketplace');
    }
  };

  const handleCloseProductDialog = () => {
    setSelectedProduct(null);
    if (productId) navigate('/marketplace');
  };

  const formatPrice = (price: number | null) => price ? `$${price.toLocaleString()}` : '$249';

  const isSearching = Boolean(debouncedSearch || selectedCategory);

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

  return (
    <div className="min-h-screen bg-slate-950 text-white" ref={scrollContainerRef}>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold">Software Marketplace</h1>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 text-xs">
              {totalCount.toLocaleString()} Products
            </Badge>
          </div>
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Partner Buttons */}
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

        {/* Category Pills */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
              !selectedCategory ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500'
            }`}
          >
            All
          </button>
          {dynamicCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(selectedCategory === category ? null : category)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                selectedCategory === category ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500'
              }`}
            >
              {CATEGORY_ICONS[category] || '📦'} {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-4 space-y-8">
        {isSearching ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {searchResults.length}+ result{searchResults.length !== 1 ? 's' : ''}
              {selectedCategory && ` in ${selectedCategory}`}
              {debouncedSearch && ` for "${debouncedSearch}"`}
            </h2>
            
            {/* Virtualized Grid for Search Results */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {searchResults.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  isFav={favorites.has(product.product_id)}
                  onView={handleProductView}
                  onDemo={handleDemo}
                  onBuy={handleBuy}
                  onFav={toggleFavorite}
                  formatPrice={formatPrice}
                />
              ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className="py-8 flex justify-center">
              {searchLoading && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading more...</span>
                </div>
              )}
              {!hasMoreSearch && searchResults.length > 0 && (
                <p className="text-slate-500 text-sm">All products loaded</p>
              )}
            </div>

            {searchResults.length === 0 && !searchLoading && (
              <div className="text-center py-16 text-slate-500">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No products found</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Hero Banner */}
            {latestLaunches.length > 0 && (
              <HeroBanner products={latestLaunches} onDemo={handleDemo} onBuy={handleBuy} onView={handleProductView} formatPrice={formatPrice} />
            )}

            {/* Featured Rows */}
            {latestLaunches.length > 0 && (
              <ProductRow
                title="🚀 Latest Launch"
                icon={<Zap className="w-5 h-5 text-red-400" />}
                products={latestLaunches}
                favorites={favorites}
                onView={handleProductView}
                onDemo={handleDemo}
                onBuy={handleBuy}
                onFav={toggleFavorite}
                formatPrice={formatPrice}
              />
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
              formatPrice={formatPrice}
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
              formatPrice={formatPrice}
            />

            {upcomingProducts.length > 0 && (
              <ProductRow
                title="🔜 Coming Soon"
                icon={<Monitor className="w-5 h-5 text-amber-400" />}
                products={upcomingProducts}
                favorites={favorites}
                onView={handleProductView}
                onDemo={handleDemo}
                onBuy={handleBuy}
                onFav={toggleFavorite}
                formatPrice={formatPrice}
              />
            )}

            {/* Lazy-loaded Category Rows */}
            {dynamicCategories.slice(0, 8).map((category) => (
              <LazyProductRow
                key={category}
                title={`${CATEGORY_ICONS[category] || '📦'} ${category}`}
                category={category}
                products={categoryProducts[category]}
                loading={categoryLoading[category]}
                onLoad={() => loadCategoryProducts(category)}
                favorites={favorites}
                onView={handleProductView}
                onDemo={handleDemo}
                onBuy={handleBuy}
                onFav={toggleFavorite}
                formatPrice={formatPrice}
              />
            ))}
          </>
        )}
      </div>

      {/* Product Detail Dialog */}
      {selectedProduct && (
        <>
          <ProductSEOHead
            productName={selectedProduct.product_name}
            category={selectedProduct.category || undefined}
            price={selectedProduct.monthly_price || undefined}
            type={selectedProduct.product_type || undefined}
            slug={selectedProduct.product_id}
          />
          <ProductDetailDialog
            product={selectedProduct}
            open={Boolean(selectedProduct)}
            onClose={handleCloseProductDialog}
            onDemo={handleDemo}
            onBuy={handleBuy}
            isFav={favorites.has(selectedProduct.product_id)}
            onFav={toggleFavorite}
            formatPrice={formatPrice}
          />
        </>
      )}
    </div>
  );
};

// Lazy-loaded category row with intersection observer
function LazyProductRow({
  title,
  category,
  products,
  loading,
  onLoad,
  favorites,
  onView,
  onDemo,
  onBuy,
  onFav,
  formatPrice,
}: {
  title: string;
  category: string;
  products?: Product[];
  loading?: boolean;
  onLoad: () => void;
  favorites: Set<string>;
  onView: (p: Product) => void;
  onDemo: (p: Product) => void;
  onBuy: (p: Product) => void;
  onFav: (id: string) => void;
  formatPrice: (p: number | null) => string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!rowRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          onLoad();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(rowRef.current);
    return () => observer.disconnect();
  }, [isVisible, onLoad]);

  return (
    <div ref={rowRef} className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 py-8">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : products && products.length > 0 ? (
        <ProductRow
          title=""
          products={products}
          favorites={favorites}
          onView={onView}
          onDemo={onDemo}
          onBuy={onBuy}
          onFav={onFav}
          formatPrice={formatPrice}
          hideTitle
        />
      ) : (
        <div className="text-slate-500 text-sm py-4">No products yet</div>
      )}
    </div>
  );
}

function HeroBanner({ products, onDemo, onBuy, onView, formatPrice }: {
  products: Product[];
  onDemo: (product: Product) => void;
  onBuy: (product: Product) => void;
  onView: (product: Product) => void;
  formatPrice: (price: number | null) => string;
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
      className={`relative rounded-xl overflow-hidden bg-gradient-to-r ${GRADIENTS[activeIndex % GRADIENTS.length]} p-8 md:p-12`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            {product.category && (
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                {CATEGORY_ICONS[product.category] || '📦'} {product.category}
              </Badge>
            )}
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
              New Launch
            </Badge>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold">{product.product_name}</h2>
          <p className="text-slate-300 text-sm md:text-base line-clamp-2">{product.description}</p>

          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-cyan-400">{formatPrice(product.monthly_price)}</div>
            {product.lifetime_price && (
              <div className="text-sm text-slate-400">
                <span className="line-through">${Math.round(product.lifetime_price * 1.5)}</span> Lifetime
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={() => onDemo(product)} variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10">
              <Play className="w-4 h-4 mr-2" /> Watch Demo
            </Button>
            <Button onClick={() => onBuy(product)} className="bg-gradient-to-r from-cyan-500 to-blue-600">
              <ShoppingCart className="w-4 h-4 mr-2" /> Buy Now
            </Button>
          </div>
        </div>

        {product.product_thumbnail_url && (
          <div className="w-64 h-40 rounded-lg overflow-hidden bg-slate-800">
            <img src={product.product_thumbnail_url} alt={product.product_name} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerProducts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${idx === activeIndex ? 'bg-cyan-400 w-6' : 'bg-slate-600'}`}
          />
        ))}
      </div>

      {/* Nav Arrows */}
      {bannerProducts.length > 1 && (
        <>
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + bannerProducts.length) % bannerProducts.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/50 hover:bg-slate-900/80"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % bannerProducts.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/50 hover:bg-slate-900/80"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}

function ProductRow({
  title,
  icon,
  products,
  favorites,
  onView,
  onDemo,
  onBuy,
  onFav,
  formatPrice,
  hideTitle,
}: {
  title: string;
  icon?: React.ReactNode;
  products: Product[];
  favorites: Set<string>;
  onView: (p: Product) => void;
  onDemo: (p: Product) => void;
  onBuy: (p: Product) => void;
  onFav: (id: string) => void;
  formatPrice: (p: number | null) => string;
  hideTitle?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (products.length === 0) return null;

  return (
    <div className="space-y-3">
      {!hideTitle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <div className="flex gap-1">
            <button onClick={() => scroll('left')} className="p-1.5 rounded-full hover:bg-slate-800">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll('right')} className="p-1.5 rounded-full hover:bg-slate-800">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
        {products.map((product) => (
          <ProductCard
            key={product.product_id}
            product={product}
            isFav={favorites.has(product.product_id)}
            onView={onView}
            onDemo={onDemo}
            onBuy={onBuy}
            onFav={onFav}
            formatPrice={formatPrice}
          />
        ))}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  isFav,
  onView,
  onDemo,
  onBuy,
  onFav,
  formatPrice,
}: {
  product: Product;
  isFav: boolean;
  onView: (p: Product) => void;
  onDemo: (p: Product) => void;
  onBuy: (p: Product) => void;
  onFav: (id: string) => void;
  formatPrice: (p: number | null) => string;
}) {
  return (
    <div
      onClick={() => onView(product)}
      className="flex-shrink-0 w-48 bg-slate-900/80 rounded-lg overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="h-28 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {product.product_thumbnail_url ? (
          <img src={product.product_thumbnail_url} alt={product.product_name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-4xl">{CATEGORY_ICONS[product.category || ''] || '📦'}</div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onFav(product.product_id); }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
        </button>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs bg-slate-900/80 text-slate-300">
            {product.category}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <h4 className="font-medium text-sm line-clamp-2 text-white">{product.product_name}</h4>
        
        <div className="flex items-center justify-between">
          <span className="text-cyan-400 font-bold text-sm">{formatPrice(product.monthly_price)}</span>
          <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
            {product.product_type || 'SaaS'}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => { e.stopPropagation(); onDemo(product); }}
            className="flex-1 h-7 text-xs border-slate-700 hover:border-cyan-500"
          >
            <Play className="w-3 h-3 mr-1" /> Demo
          </Button>
          <Button
            size="sm"
            onClick={(e) => { e.stopPropagation(); onBuy(product); }}
            className="flex-1 h-7 text-xs bg-cyan-600 hover:bg-cyan-500"
          >
            Buy
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProductDetailDialog({
  product,
  open,
  onClose,
  onDemo,
  onBuy,
  isFav,
  onFav,
  formatPrice,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
  onDemo: (p: Product) => void;
  onBuy: (p: Product) => void;
  isFav: boolean;
  onFav: (id: string) => void;
  formatPrice: (p: number | null) => string;
}) {
  const { speak, stop, isPlaying } = useValaVoice();

  const handleVoice = () => {
    if (isPlaying) {
      stop();
      return;
    }
    speak(`${product.product_name}. ${product.description || ''} Price: ${formatPrice(product.monthly_price)}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{product.product_name}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                {product.category && (
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    {CATEGORY_ICONS[product.category] || '📦'} {product.category}
                  </Badge>
                )}
                <Badge variant="outline" className="border-slate-600">{product.product_type || 'SaaS'}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleVoice}>
                {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onFav(product.product_id)}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Thumbnail */}
            {product.product_thumbnail_url && (
              <div className="rounded-lg overflow-hidden bg-slate-800">
                <img src={product.product_thumbnail_url} alt={product.product_name} className="w-full h-48 object-cover" />
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-slate-300 text-sm">{product.description}</p>
            </div>

            {/* Tech Stack */}
            {product.tech_stack && (
              <div>
                <h4 className="font-semibold mb-2">Technology</h4>
                <Badge variant="outline" className="border-slate-600">{product.tech_stack}</Badge>
              </div>
            )}

            {/* Pricing */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Pricing</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-slate-900">
                  <div className="text-2xl font-bold text-cyan-400">{formatPrice(product.monthly_price)}</div>
                  <div className="text-xs text-slate-400">Starting Price</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-900">
                  <div className="text-2xl font-bold text-emerald-400">{formatPrice(product.lifetime_price)}</div>
                  <div className="text-xs text-slate-400">Lifetime License</div>
                </div>
              </div>
            </div>

            {/* Demo URL */}
            {product.demo_url && (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                <a href={product.demo_url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                  Live Demo Available
                </a>
              </div>
            )}

            {/* GitHub */}
            {product.github_repo_url && (
              <div className="flex items-center gap-2 text-sm">
                <Github className="w-4 h-4 text-slate-400" />
                <a href={product.github_repo_url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white">
                  View Source
                </a>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-700">
          <Button onClick={() => onDemo(product)} variant="outline" className="flex-1 border-cyan-500 text-cyan-400">
            <Play className="w-4 h-4 mr-2" /> Watch Demo
          </Button>
          <Button onClick={() => onBuy(product)} className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600">
            <ShoppingCart className="w-4 h-4 mr-2" /> Purchase Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
