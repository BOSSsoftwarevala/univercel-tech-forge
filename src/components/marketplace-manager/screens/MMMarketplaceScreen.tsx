import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Search, Star, Heart, Play, ShoppingCart, ChevronLeft, ChevronRight, X, Monitor, Tag, Zap, TrendingUp, Sparkles, Package } from 'lucide-react';
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

export const MMMarketplaceScreen = () => {
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
      // Fallback mock data
      setProducts(generateMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('product_favorites')
        .select('product_id')
        .eq('user_id', user.id);
      if (data) setFavorites(new Set(data.map(f => f.product_id)));
    } catch { /* ignore */ }
  };

  const toggleFavorite = async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error('Please log in to save favorites'); return; }

      if (favorites.has(productId)) {
        await supabase.from('product_favorites').delete()
          .eq('user_id', user.id).eq('product_id', productId);
        setFavorites(prev => { const n = new Set(prev); n.delete(productId); return n; });
        toast.success('Removed from favorites');
      } else {
        await supabase.from('product_favorites').insert({ user_id: user.id, product_id: productId });
        setFavorites(prev => new Set(prev).add(productId));
        toast.success('Added to favorites');
      }
      logEvent('favorite_toggle', productId);
    } catch { toast.error('Failed to update favorites'); }
  };

  const handleDemo = (product: Product) => {
    logEvent('demo_click', product.product_id);
    toast.info(`Loading demo for ${product.product_name}...`);
  };

  const handleBuy = (product: Product) => {
    logEvent('purchase_click', product.product_id);
    toast.success(`Order initiated for ${product.product_name}`);
  };

  const handleProductView = (product: Product) => {
    logEvent('product_view', product.product_id);
    setSelectedProduct(product);
  };

  const logEvent = async (eventType: string, productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('activity_log').insert({
        action_type: eventType,
        entity_type: 'product',
        entity_id: productId,
        user_id: user?.id || null,
        metadata: { module: 'marketplace', timestamp: new Date().toISOString() }
      });
    } catch { /* silent */ }
  };

  const filtered = useMemo(() => {
    let result = products;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.product_name.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q)) ||
        (p.category?.toLowerCase().includes(q))
      );
    }
    if (selectedCategory) {
      result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    return result;
  }, [products, searchQuery, selectedCategory]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    products.forEach(p => {
      const cat = p.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return groups;
  }, [products]);

  const featuredProducts = useMemo(() => products.slice(0, 5), [products]);
  const trendingProducts = useMemo(() => [...products].sort(() => 0.5 - Math.random()).slice(0, 8), [products]);
  const newReleases = useMemo(() => products.slice(0, 8), [products]);

  const discountedPrice = (price: number | null) => price ? (price * 0.7).toFixed(0) : '0';

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

  const isSearching = searchQuery || selectedCategory;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
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

        {/* Category Pills */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              !selectedCategory ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {CATEGORY_ICONS[cat] || '📦'} {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 space-y-8">
        {isSearching ? (
          /* Search Results */
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} 
              {selectedCategory && ` in ${selectedCategory}`}
              {searchQuery && ` for "${searchQuery}"`}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map(p => (
                <ProductCard key={p.product_id} product={p} isFav={favorites.has(p.product_id)}
                  onView={handleProductView} onDemo={handleDemo} onBuy={handleBuy} onFav={toggleFavorite}
                  discountedPrice={discountedPrice} />
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
            {/* Hero Banner */}
            {featuredProducts.length > 0 && <HeroBanner product={featuredProducts[0]} onDemo={handleDemo} onBuy={handleBuy} discountedPrice={discountedPrice} />}

            {/* Featured Row */}
            <ProductRow title="Featured Software" icon={<Sparkles className="w-5 h-5 text-yellow-400" />}
              products={featuredProducts} favorites={favorites}
              onView={handleProductView} onDemo={handleDemo} onBuy={handleBuy} onFav={toggleFavorite}
              discountedPrice={discountedPrice} />

            {/* Trending Row */}
            <ProductRow title="Trending Now" icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
              products={trendingProducts} favorites={favorites}
              onView={handleProductView} onDemo={handleDemo} onBuy={handleBuy} onFav={toggleFavorite}
              discountedPrice={discountedPrice} />

            {/* New Releases */}
            <ProductRow title="New Releases" icon={<Zap className="w-5 h-5 text-purple-400" />}
              products={newReleases} favorites={favorites}
              onView={handleProductView} onDemo={handleDemo} onBuy={handleBuy} onFav={toggleFavorite}
              discountedPrice={discountedPrice} />

            {/* Category Rows */}
            {Object.entries(groupedByCategory).slice(0, 6).map(([cat, prods]) => (
              <ProductRow key={cat} title={`${CATEGORY_ICONS[cat] || '📦'} ${cat}`}
                products={prods} favorites={favorites}
                onView={handleProductView} onDemo={handleDemo} onBuy={handleBuy} onFav={toggleFavorite}
                discountedPrice={discountedPrice} />
            ))}
          </>
        )}
      </div>

      {/* Product Detail Dialog */}
      {selectedProduct && (
        <ProductDetailDialog product={selectedProduct} open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)} onDemo={handleDemo} onBuy={handleBuy}
          isFav={favorites.has(selectedProduct.product_id)} onFav={toggleFavorite}
          discountedPrice={discountedPrice} />
      )}
    </div>
  );
};

/* ---- Sub Components ---- */

function HeroBanner({ product, onDemo, onBuy, discountedPrice }: {
  product: Product; onDemo: (p: Product) => void; onBuy: (p: Product) => void; discountedPrice: (p: number | null) => string;
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-cyan-900/60 via-slate-900 to-purple-900/40 border border-slate-800 p-8 md:p-12">
      <div className="relative z-10 max-w-2xl">
        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 mb-3">{product.category || 'Software'}</Badge>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">{product.product_name}</h2>
        <p className="text-slate-300 text-sm md:text-base mb-6 line-clamp-2">{product.description || 'Enterprise-grade software solution'}</p>
        <div className="flex items-center gap-4 mb-6">
          {product.monthly_price && (
            <div>
              <span className="text-slate-500 line-through text-sm">₹{product.monthly_price}/mo</span>
              <span className="text-2xl font-bold text-cyan-400 ml-2">₹{discountedPrice(product.monthly_price)}/mo</span>
              <Badge className="ml-2 bg-emerald-500/20 text-emerald-400 border-0 text-xs">30% OFF</Badge>
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
  );
}

function ProductRow({ title, icon, products, favorites, onView, onDemo, onBuy, onFav, discountedPrice }: {
  title: string; icon?: React.ReactNode; products: Product[]; favorites: Set<string>;
  onView: (p: Product) => void; onDemo: (p: Product) => void; onBuy: (p: Product) => void;
  onFav: (id: string) => void; discountedPrice: (p: number | null) => string;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
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
        {products.map(p => (
          <div key={p.product_id} className="flex-shrink-0 w-56">
            <ProductCard product={p} isFav={favorites.has(p.product_id)}
              onView={onView} onDemo={onDemo} onBuy={onBuy} onFav={onFav}
              discountedPrice={discountedPrice} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, isFav, onView, onDemo, onBuy, onFav, discountedPrice }: {
  product: Product; isFav: boolean;
  onView: (p: Product) => void; onDemo: (p: Product) => void; onBuy: (p: Product) => void;
  onFav: (id: string) => void; discountedPrice: (p: number | null) => string;
}) {
  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all cursor-pointer"
      onClick={() => onView(product)}>
      {/* Thumbnail */}
      <div className="h-32 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
        <Monitor className="w-10 h-10 text-slate-700" />
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400 bg-slate-900/80">
            {product.category || 'Software'}
          </Badge>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onFav(product.product_id); }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 transition"
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
        </button>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onDemo(product); }}
            className="p-2 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 transition">
            <Play className="w-4 h-4 text-cyan-400" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onBuy(product); }}
            className="p-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500/40 transition">
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>
      {/* Info */}
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
  product: Product; open: boolean; onClose: () => void;
  onDemo: (p: Product) => void; onBuy: (p: Product) => void;
  isFav: boolean; onFav: (id: string) => void; discountedPrice: (p: number | null) => string;
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
            {/* Hero */}
            <div className="h-40 bg-gradient-to-br from-cyan-900/40 to-slate-800 rounded-lg flex items-center justify-center">
              <Monitor className="w-16 h-16 text-slate-600" />
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-2">
              {product.category && <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">{product.category}</Badge>}
              {product.tech_stack && <Badge variant="outline" className="border-purple-500/50 text-purple-400">{product.tech_stack}</Badge>}
              {product.product_type && <Badge variant="outline" className="border-slate-600 text-slate-400">{product.product_type}</Badge>}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold mb-1">Description</h3>
              <p className="text-sm text-slate-400">{product.description || 'Enterprise-grade software solution for your business.'}</p>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Features</h3>
                <ul className="grid grid-cols-2 gap-1.5">
                  {features.map((f: string, i: number) => (
                    <li key={i} className="text-xs text-slate-400 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pricing */}
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

        {/* Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
          <Button onClick={() => onFav(product.product_id)} variant="outline" size="sm"
            className={`border-slate-700 ${isFav ? 'text-red-400' : 'text-slate-400'}`}>
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

/* Mock data fallback */
function generateMockProducts(): Product[] {
  const cats = ['Restaurant', 'Education', 'Healthcare', 'E-commerce', 'Hotel', 'CRM', 'HRM', 'Finance'];
  return Array.from({ length: 24 }, (_, i) => ({
    product_id: `mock-${i}`,
    product_name: `${cats[i % cats.length]} Management Pro ${i + 1}`,
    description: `Complete ${cats[i % cats.length].toLowerCase()} management solution with AI-powered features`,
    category: cats[i % cats.length],
    monthly_price: 2999 + (i * 500),
    lifetime_price: 29999 + (i * 5000),
    tech_stack: ['React', 'Node.js', 'Python', 'Flutter'][i % 4],
    product_type: 'SaaS',
    features_json: ['Dashboard', 'Reports', 'Analytics', 'API Access', 'Mobile App', '24/7 Support'],
    is_active: true,
    status: 'active',
    created_at: new Date().toISOString(),
  }));
}
