import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Search, Star, TrendingUp, Sparkles, ThumbsUp, ShoppingCart,
  Play, Heart, ChevronLeft, ChevronRight, Eye, IndianRupee,
  Package, Monitor, Zap, Globe, Filter, X, ExternalLink, Users,
  Megaphone, GraduationCap, UserPlus, Layers
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────
interface Product {
  product_id: string;
  product_name: string;
  description: string | null;
  category: string | null;
  monthly_price: number | null;
  lifetime_price: number | null;
  pricing_model: string | null;
  product_type: string | null;
  tech_stack: string | null;
  features_json: any;
  is_active: boolean | null;
  status: string | null;
}

interface Section {
  id: string;
  title: string;
  slug: string;
  section_type: string;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

// ── Icon Resolver ──────────────────────────────────────
const sectionIcons: Record<string, React.ReactNode> = {
  Star: <Star className="h-5 w-5" />,
  TrendingUp: <TrendingUp className="h-5 w-5" />,
  Sparkles: <Sparkles className="h-5 w-5" />,
  ThumbsUp: <ThumbsUp className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  ShoppingCart: <ShoppingCart className="h-5 w-5" />,
  Megaphone: <Megaphone className="h-5 w-5" />,
  IndianRupee: <IndianRupee className="h-5 w-5" />,
  UserPlus: <UserPlus className="h-5 w-5" />,
  GraduationCap: <GraduationCap className="h-5 w-5" />,
};

// ── Product Card ───────────────────────────────────────
function ProductCard({ product, onView, onDemo, onBuy }: {
  product: Product;
  onView: () => void;
  onDemo: () => void;
  onBuy: () => void;
}) {
  const price = product.lifetime_price || product.monthly_price || 0;
  const discountedPrice = Math.round(price * 0.7); // 30% franchise discount

  const typeColors: Record<string, string> = {
    software: 'from-blue-600 to-cyan-600',
    service: 'from-purple-600 to-pink-600',
    digital: 'from-emerald-600 to-teal-600',
    physical: 'from-amber-600 to-orange-600',
  };
  const gradient = typeColors[product.product_type || 'software'] || typeColors.software;

  return (
    <div
      className="group relative flex-shrink-0 w-[220px] rounded-xl overflow-hidden bg-slate-800/80 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer"
      onClick={onView}
    >
      {/* Thumbnail */}
      <div className={`h-32 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
        <Package className="h-12 w-12 text-white/40" />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onDemo(); }} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition">
            <Play className="h-5 w-5 text-white" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onBuy(); }} className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 transition">
            <ShoppingCart className="h-5 w-5 text-white" />
          </button>
        </div>
        {/* Badge */}
        <Badge className="absolute top-2 right-2 bg-black/50 text-white border-0 text-[10px]">
          {product.product_type || 'Software'}
        </Badge>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        <h3 className="font-semibold text-sm text-white truncate">{product.product_name}</h3>
        <p className="text-xs text-slate-400 line-clamp-2 h-8">
          {product.description || 'Enterprise-grade software solution'}
        </p>
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs text-slate-500 line-through">₹{price.toLocaleString()}</span>
            <span className="text-sm font-bold text-emerald-400 ml-1">₹{discountedPrice.toLocaleString()}</span>
          </div>
          <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
            -30%
          </Badge>
        </div>
        {product.category && (
          <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">
            {product.category}
          </Badge>
        )}
      </div>
    </div>
  );
}

// ── Horizontal Row ─────────────────────────────────────
function ProductRow({ section, products, onViewProduct, onDemoProduct, onBuyProduct }: {
  section: Section;
  products: Product[];
  onViewProduct: (p: Product) => void;
  onDemoProduct: (p: Product) => void;
  onBuyProduct: (p: Product) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  useEffect(() => { checkScroll(); }, [products, checkScroll]);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -460 : 460, behavior: 'smooth' });
    setTimeout(checkScroll, 400);
  };

  if (products.length === 0) return null;

  const icon = section.icon ? sectionIcons[section.icon] : <Layers className="h-5 w-5" />;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-purple-400">{icon}</span>
          <h2 className="text-lg font-bold text-white">{section.title}</h2>
          <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400 ml-1">
            {products.length}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs">
          View All →
        </Button>
      </div>

      <div className="relative group/row">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-slate-950 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map(p => (
            <ProductCard
              key={p.product_id}
              product={p}
              onView={() => onViewProduct(p)}
              onDemo={() => onDemoProduct(p)}
              onBuy={() => onBuyProduct(p)}
            />
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-slate-950 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        )}
      </div>
    </section>
  );
}

// ── Hero Banner ────────────────────────────────────────
function HeroBanner() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-900/80 via-slate-900 to-pink-900/80 border border-purple-500/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
      <div className="relative px-8 py-12 flex items-center justify-between">
        <div className="max-w-lg space-y-4">
          <Badge className="bg-purple-500/30 text-purple-300 border-purple-500/50">
            <Sparkles className="h-3 w-3 mr-1" /> Software Marketplace
          </Badge>
          <h1 className="text-3xl font-bold text-white leading-tight">
            10,000+ Enterprise Software
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Under Your Brand
            </span>
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Browse, demo, and deploy software instantly. Auto-applied 30% franchise discount on every purchase. Powered by Vala AI deployment engine.
          </p>
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Globe className="h-4 w-4 mr-2" /> Browse Catalog
            </Button>
            <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
              <Play className="h-4 w-4 mr-2" /> Watch Demo
            </Button>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Products', value: '10K+', icon: Package },
              { label: 'Categories', value: '50+', icon: Layers },
              { label: 'Active Demos', value: '5K+', icon: Monitor },
              { label: 'Deployments', value: '2K+', icon: Zap },
            ].map(s => (
              <div key={s.label} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center min-w-[120px]">
                <s.icon className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Product Detail Dialog ──────────────────────────────
function ProductDetailDialog({ product, open, onClose, onBuy, onDemo }: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onBuy: () => void;
  onDemo: () => void;
}) {
  if (!product) return null;
  const price = product.lifetime_price || product.monthly_price || 0;
  const discountedPrice = Math.round(price * 0.7);
  const features = Array.isArray(product.features_json) ? product.features_json : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-400" />
            {product.product_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* Hero */}
          <div className="h-40 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <Package className="h-16 w-16 text-white/30" />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
              <p className="text-xs text-slate-400">Category</p>
              <p className="font-medium text-white">{product.category || 'General'}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
              <p className="text-xs text-slate-400">Type</p>
              <p className="font-medium text-white capitalize">{product.product_type || 'Software'}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
              <p className="text-xs text-slate-400">Pricing</p>
              <p className="font-medium text-white capitalize">{product.pricing_model || 'One-time'}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
              <p className="text-xs text-slate-400">Tech Stack</p>
              <p className="font-medium text-white">{product.tech_stack || 'Full Stack'}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-white mb-2">Description</h3>
            <p className="text-sm text-slate-300">{product.description || 'Enterprise-grade software solution built for scale.'}</p>
          </div>

          {/* Features */}
          {features.length > 0 && (
            <div>
              <h3 className="font-semibold text-white mb-2">Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {features.slice(0, 8).map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <Zap className="h-3 w-3 text-purple-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-400">Franchise Price (30% off)</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-500 line-through text-sm">₹{price.toLocaleString()}</span>
                  <span className="text-2xl font-bold text-emerald-400">₹{discountedPrice.toLocaleString()}</span>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-lg px-3">
                SAVE 30%
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={onDemo} variant="outline" className="flex-1 border-purple-500/50 text-purple-300">
              <Play className="h-4 w-4 mr-2" /> Try Demo
            </Button>
            <Button onClick={onBuy} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500">
              <ShoppingCart className="h-4 w-4 mr-2" /> Buy Now — ₹{discountedPrice.toLocaleString()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Marketplace Screen ────────────────────────────
export function MMMarketplaceScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [sectionsRes, productsRes] = await Promise.all([
      supabase.from('marketplace_sections').select('*').eq('is_active', true).order('display_order'),
      (supabase as any).from('products').select('*').eq('is_active', true).limit(500),
    ]);

    if (sectionsRes.data) setSections(sectionsRes.data);
    if (productsRes.data) setProducts(productsRes.data);
    setLoading(false);
  };

  const filteredProducts = searchQuery
    ? products.filter(p =>
        p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  // Distribute products to sections
  const getProductsForSection = (section: Section): Product[] => {
    switch (section.section_type) {
      case 'featured':
        return filteredProducts.slice(0, 20);
      case 'trending':
        return [...filteredProducts].sort(() => 0.5 - Math.random()).slice(0, 20);
      case 'new_releases':
        return filteredProducts.slice(0, 15);
      case 'recommended':
        return [...filteredProducts].reverse().slice(0, 20);
      case 'category': {
        const catName = section.title.toLowerCase();
        const catProducts = filteredProducts.filter(p =>
          (p.category || '').toLowerCase().includes(catName) ||
          (p.product_name || '').toLowerCase().includes(catName)
        );
        return catProducts.length > 0 ? catProducts.slice(0, 20) : filteredProducts.slice(0, 10);
      }
      default:
        return filteredProducts.slice(0, 15);
    }
  };

  const handleView = (p: Product) => { setSelectedProduct(p); setDetailOpen(true); };
  const handleDemo = (p: Product) => { toast.info(`Opening demo for ${p.product_name}...`); };
  const handleBuy = (p: Product) => {
    const price = p.lifetime_price || p.monthly_price || 0;
    toast.success(`Order initiated for ${p.product_name} — ₹${Math.round(price * 0.7).toLocaleString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Search Bar */}
      <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 px-6 py-3">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search 10,000+ software products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-slate-400 hover:text-white" />
              </button>
            )}
          </div>
          <Button variant="outline" size="icon" className="border-slate-700">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Hero */}
        {!searchQuery && <HeroBanner />}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center gap-3 text-slate-400">
              <div className="h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              Loading marketplace...
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchQuery && !loading && (
          <div>
            <p className="text-sm text-slate-400 mb-4">
              {filteredProducts.length} results for "<span className="text-white">{searchQuery}</span>"
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredProducts.slice(0, 30).map(p => (
                <ProductCard key={p.product_id} product={p} onView={() => handleView(p)} onDemo={() => handleDemo(p)} onBuy={() => handleBuy(p)} />
              ))}
            </div>
          </div>
        )}

        {/* Netflix Rows */}
        {!searchQuery && !loading && sections.map(section => (
          <ProductRow
            key={section.id}
            section={section}
            products={getProductsForSection(section)}
            onViewProduct={handleView}
            onDemoProduct={handleDemo}
            onBuyProduct={handleBuy}
          />
        ))}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Products Yet</h3>
            <p className="text-slate-400">Products will appear here once added by the admin.</p>
          </div>
        )}
      </div>

      {/* Product Detail */}
      <ProductDetailDialog
        product={selectedProduct}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onBuy={() => { if (selectedProduct) handleBuy(selectedProduct); setDetailOpen(false); }}
        onDemo={() => { if (selectedProduct) handleDemo(selectedProduct); setDetailOpen(false); }}
      />
    </div>
  );
}

export default MMMarketplaceScreen;
