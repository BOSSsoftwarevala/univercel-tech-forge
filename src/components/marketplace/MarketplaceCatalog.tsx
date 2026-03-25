import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Eye, Globe, Heart, Package, Play, Search, ShoppingCart, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMarketplace, type MarketplaceProduct } from '@/hooks/useMarketplace';
import { useUnifiedWallet } from '@/hooks/useUnifiedWallet';
import { callEdgeRoute } from '@/lib/api/edge-client';

interface MarketplaceCatalogProps {
  title: string;
  subtitle: string;
  audienceLabel: string;
}

const heroGradients = [
  'from-cyan-500/25 via-slate-950 to-blue-500/20',
  'from-emerald-500/20 via-slate-950 to-teal-500/20',
  'from-amber-500/20 via-slate-950 to-orange-500/20',
  'from-fuchsia-500/20 via-slate-950 to-pink-500/20',
];

function detectLanguageLabel() {
  const locale = navigator.language || 'en-US';
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return `${locale} • ${timeZone}`;
}

function formatPrice(product: MarketplaceProduct, discountPercent: number) {
  const basePrice = Number(product.lifetime_price || product.monthly_price || 0);
  const discountedPrice = Math.round(basePrice * ((100 - discountPercent) / 100));
  return {
    basePrice,
    discountedPrice,
  };
}

export function MarketplaceCatalog({ title, subtitle, audienceLabel }: MarketplaceCatalogProps) {
  const navigate = useNavigate();
  const {
    products,
    categories,
    favourites,
    search,
    setSearch,
    category,
    setCategory,
    isCatalogLoading,
    isSubmittingOrder,
    isJoiningFranchise,
    isJoiningReseller,
    isJoiningInfluencer,
    hasMore,
    isLoadingMore,
    createOrder,
    toggleFavourite,
    joinFranchise,
    joinReseller,
    joinInfluencer,
    loadMoreProducts,
  } = useMarketplace();
  const { wallet, formatCurrency, refetch } = useUnifiedWallet();
  const [searchInput, setSearchInput] = useState(search);
  const deferredSearch = useDeferredValue(searchInput);
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'upi' | 'bank' | 'crypto'>('wallet');
  const [requirements, setRequirements] = useState('');
  const [clientDomain, setClientDomain] = useState('');
  const [externalReference, setExternalReference] = useState('');
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('growth');
  const [joinCity, setJoinCity] = useState('');
  const [joinBusinessType, setJoinBusinessType] = useState('software franchise');
  const [joinBusinessName, setJoinBusinessName] = useState('');
  const [isJoinResellerOpen, setIsJoinResellerOpen] = useState(false);
  const [joinResellerCountry, setJoinResellerCountry] = useState('India');
  const [joinResellerState, setJoinResellerState] = useState('');
  const [joinResellerCity, setJoinResellerCity] = useState('');
  const [joinResellerBusinessType, setJoinResellerBusinessType] = useState('software reseller');
  const [joinResellerBusinessName, setJoinResellerBusinessName] = useState('');
  const [isJoinInfluencerOpen, setIsJoinInfluencerOpen] = useState(false);
  const [joinInfluencerName, setJoinInfluencerName] = useState('');
  const [joinInfluencerPlatform, setJoinInfluencerPlatform] = useState('instagram');
  const [joinInfluencerNiche, setJoinInfluencerNiche] = useState('software');
  const [joinInfluencerFollowers, setJoinInfluencerFollowers] = useState('10000');
  const [joinInfluencerHandle, setJoinInfluencerHandle] = useState('');
  const [joinInfluencerCity, setJoinInfluencerCity] = useState('');
  const [joinInfluencerState, setJoinInfluencerState] = useState('');
  const [joinInfluencerCountry, setJoinInfluencerCountry] = useState('India');
  const [joinInfluencerBio, setJoinInfluencerBio] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSearch(deferredSearch);
  }, [deferredSearch, setSearch]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeroIndex((current) => {
        if (categories.length <= 1) {
          return 0;
        }
        return (current + 1) % Math.min(categories.length - 1, heroGradients.length);
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [categories.length]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        void loadMoreProducts();
      }
    }, { rootMargin: '300px' });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadMoreProducts]);

  const activeHeroCategory = categories[Math.max(1, (heroIndex % Math.max(categories.length - 1, 1)) + 0)] || categories[0];
  const activeGradient = heroGradients[heroIndex % heroGradients.length];
  const languageLabel = useMemo(() => detectLanguageLabel(), []);
  const discountPercent = audienceLabel === 'Franchise' ? 30 : audienceLabel === 'Reseller' ? 15 : 0;

  const walletBalance = Number(wallet?.available_balance || 0);

  const resetOrderForm = () => {
    setRequirements('');
    setClientDomain('');
    setExternalReference('');
    setPaymentMethod('wallet');
  };

  const resetJoinForm = () => {
    setSelectedPlan('growth');
    setJoinCity('');
    setJoinBusinessType('software franchise');
    setJoinBusinessName('');
  };

  const resetJoinResellerForm = () => {
    setJoinResellerCountry('India');
    setJoinResellerState('');
    setJoinResellerCity('');
    setJoinResellerBusinessType('software reseller');
    setJoinResellerBusinessName('');
  };

  const resetJoinInfluencerForm = () => {
    setJoinInfluencerName('');
    setJoinInfluencerPlatform('instagram');
    setJoinInfluencerNiche('software');
    setJoinInfluencerFollowers('10000');
    setJoinInfluencerHandle('');
    setJoinInfluencerCity('');
    setJoinInfluencerState('');
    setJoinInfluencerCountry('India');
    setJoinInfluencerBio('');
  };

  const handlePreview = async (product: MarketplaceProduct) => {
    if (!product.demo_id || product.has_broken_demo) {
      return;
    }

    try {
      await callEdgeRoute('api-demos', 'track/clicks', {
        method: 'POST',
        body: { demo_id: product.demo_id },
      });
    } catch {
      // Keep preview available even if analytics is unavailable.
    }

    navigate(`/demo/${product.demo_id}`);
  };

  const handleOrder = async () => {
    if (!selectedProduct) {
      return;
    }

    const result = await createOrder({
      productId: selectedProduct.product_id,
      paymentMethod,
      clientDomain,
      requirements,
      externalReference,
    });

    if (result) {
      setIsOrderOpen(false);
      resetOrderForm();
      await refetch();
    }
  };

  const handleJoinFranchise = async () => {
    const result = await joinFranchise({
      selectedPlan,
      city: joinCity,
      businessType: joinBusinessType,
      businessName: joinBusinessName || undefined,
    });

    if (!result) {
      return;
    }

    setIsJoinOpen(false);
    resetJoinForm();
    window.location.assign(result.redirect_to || '/franchise-dashboard');
  };

  const handleJoinReseller = async () => {
    const result = await joinReseller({
      country: joinResellerCountry,
      state: joinResellerState || undefined,
      city: joinResellerCity || undefined,
      businessType: joinResellerBusinessType,
      businessName: joinResellerBusinessName || undefined,
    });

    if (!result) return;

    setIsJoinResellerOpen(false);
    resetJoinResellerForm();
    window.location.assign(result.redirect_to || '/reseller-dashboard');
  };

  const handleJoinInfluencer = async () => {
    const result = await joinInfluencer({
      fullName: joinInfluencerName || undefined,
      platform: joinInfluencerPlatform,
      niche: joinInfluencerNiche,
      followersCount: Number(joinInfluencerFollowers || 0),
      socialHandle: joinInfluencerHandle || undefined,
      city: joinInfluencerCity || undefined,
      state: joinInfluencerState || undefined,
      country: joinInfluencerCountry || undefined,
      bio: joinInfluencerBio || undefined,
    });

    if (!result) return;

    setIsJoinInfluencerOpen(false);
    resetJoinInfluencerForm();
    window.location.assign(result.redirect_to || '/influencer-dashboard');
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    carouselRef.current?.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <section className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${activeGradient} p-6 shadow-2xl`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.18),transparent_28%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-4">
            <Badge className="border-cyan-400/40 bg-cyan-400/10 text-cyan-200">{audienceLabel} marketplace live</Badge>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">{subtitle}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Rotating spotlight</p>
                <p className="mt-2 text-lg font-semibold text-white">{activeHeroCategory?.label || 'Marketplace'}</p>
                <p className="text-sm text-slate-400">Category-aware banner rotation</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Wallet ready</p>
                <p className="mt-2 text-lg font-semibold text-emerald-300">{formatCurrency(walletBalance)}</p>
                <p className="text-sm text-slate-400">Real-time available balance</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Locale</p>
                <p className="mt-2 text-lg font-semibold text-white">{languageLabel}</p>
                <p className="text-sm text-slate-400">Auto-detected client region signal</p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Catalog scale</p>
              <p className="mt-2 text-2xl font-semibold text-white">Infinite paging</p>
              <p className="mt-1 text-sm text-slate-400">GPU-friendly horizontal rails, lazy paging, and zero-blocking product search.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Transaction engine</p>
              <p className="mt-2 text-2xl font-semibold text-white">Atomic orders</p>
              <p className="mt-1 text-sm text-slate-400">Wallet debits, orders, licenses, audit logs, notifications, and fraud hooks move together.</p>
            </div>
            <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100">One-click launch</p>
              <p className="mt-2 text-2xl font-semibold text-white">Join Franchise</p>
              <p className="mt-1 text-sm text-cyan-50/80">Auto-create the franchise, assign the role, connect marketplace sales, and open the manager system without manual setup.</p>
              <Button type="button" className="mt-4 w-full bg-white text-slate-950 hover:bg-cyan-50" onClick={() => setIsJoinOpen(true)}>
                <Sparkles className="mr-2 h-4 w-4" />
                Join Franchise
              </Button>
            </div>
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-100">Global distribution</p>
              <p className="mt-2 text-2xl font-semibold text-white">Join as Reseller</p>
              <p className="mt-1 text-sm text-emerald-50/80">Auto-create the reseller, assign dashboard and manager access, lock a territory, connect marketplace products, and start lead and revenue flow.</p>
              <Button type="button" className="mt-4 w-full bg-emerald-50 text-slate-950 hover:bg-white" onClick={() => setIsJoinResellerOpen(true)}>
                <Sparkles className="mr-2 h-4 w-4" />
                Join as Reseller
              </Button>
            </div>
            <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 sm:col-span-2 lg:col-span-1">
              <p className="text-xs uppercase tracking-[0.24em] text-amber-100">Traffic engine</p>
              <p className="mt-2 text-2xl font-semibold text-white">Join as Influencer</p>
              <p className="mt-1 text-sm text-amber-50/80">Auto-create the influencer account, connect promotable marketplace products, light up the dashboard, and sync every lead, fraud flag, campaign, and payout into the manager engine.</p>
              <Button type="button" className="mt-4 w-full bg-amber-100 text-slate-950 hover:bg-white" onClick={() => setIsJoinInfluencerOpen(true)}>
                <Sparkles className="mr-2 h-4 w-4" />
                Join as Influencer
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search products, categories, and use cases"
                className="h-12 border-slate-800 bg-slate-900/80 pl-10 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="icon" className="border-slate-800 bg-slate-900/70" onClick={() => scrollCategories('left')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="icon" className="border-slate-800 bg-slate-900/70" onClick={() => scrollCategories('right')}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div ref={carouselRef} className="mt-4 flex snap-x gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`snap-start rounded-full border px-4 py-2 text-sm transition-all ${category === item.id ? 'border-cyan-400/60 bg-cyan-400/15 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.2)]' : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:text-white'}`}
              >
                {item.label} <span className="ml-2 text-xs text-slate-500">{item.count}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Purchase modes</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            {['wallet', 'upi', 'bank', 'crypto'].map((mode) => (
              <div key={mode} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                <p className="text-sm font-medium capitalize text-white">{mode}</p>
                <p className="mt-1 text-xs text-slate-400">{mode === 'wallet' ? 'Verified instantly with license generation.' : 'Creates a pending-verification order with no fake success state.'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isCatalogLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 animate-pulse">
              <div className="h-6 w-2/3 rounded bg-slate-800" />
              <div className="mt-4 h-4 w-full rounded bg-slate-800" />
              <div className="mt-2 h-4 w-5/6 rounded bg-slate-800" />
              <div className="mt-5 flex gap-2">
                <div className="h-8 flex-1 rounded bg-slate-800" />
                <div className="h-8 flex-1 rounded bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {products.map((product) => {
              const { basePrice, discountedPrice } = formatPrice(product, discountPercent);
              const canAffordWallet = walletBalance >= discountedPrice;
              return (
                <Card key={product.product_id} className="group overflow-hidden border-slate-800 bg-slate-950/70 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_24px_80px_rgba(8,145,178,0.18)] [content-visibility:auto]" style={{ containIntrinsicSize: '380px' }}>
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">{product.category || 'General'}</Badge>
                        <CardTitle className="mt-3 text-xl text-white">{product.product_name}</CardTitle>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-200 transition-transform duration-300 group-hover:scale-110">
                        <Package className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="line-clamp-2 text-sm text-slate-400">{product.description || 'Production-ready business software with deployment and lifecycle support.'}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {product.features.slice(0, 4).map((feature) => (
                        <Badge key={feature} variant="outline" className="border-slate-800 bg-slate-900/80 text-slate-300">{feature}</Badge>
                      ))}
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Base price</span>
                        <span>{formatCurrency(basePrice)}</span>
                      </div>
                      <div className="mt-2 flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-semibold text-emerald-300">{formatCurrency(discountedPrice)}</p>
                          <p className="text-xs text-slate-500">{discountPercent}% {audienceLabel.toLowerCase()} pricing applied</p>
                        </div>
                        <div className="flex items-center gap-1 text-amber-300">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm">Ready</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="flex-1 border-slate-800 bg-slate-900/80 hover:bg-slate-800" onClick={() => navigate(`/product/${product.product_id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className={`border-slate-800 bg-slate-900/80 hover:bg-slate-800 ${favourites.has(product.product_id) ? 'text-rose-400 border-rose-400/40' : 'text-slate-400'}`}
                        onClick={() => void toggleFavourite(product.product_id)}
                        title={favourites.has(product.product_id) ? 'Remove from favourites' : 'Add to favourites'}
                      >
                        <Heart className={`h-4 w-4 ${favourites.has(product.product_id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="border-slate-800 bg-slate-900/80 hover:bg-slate-800 disabled:opacity-40"
                        onClick={() => product.demo_id && !product.has_broken_demo ? void handlePreview(product) : undefined}
                        disabled={!product.demo_id || product.has_broken_demo}
                        title={product.demo_id && !product.has_broken_demo ? 'Live Demo' : 'Demo not available'}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        className="flex-1 bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsOrderOpen(true);
                        }}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {canAffordWallet ? 'Buy now' : 'Pay externally'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div ref={sentinelRef} className="h-12 w-full">
            {isLoadingMore ? <div className="flex items-center justify-center text-sm text-slate-500">Loading more products...</div> : null}
          </div>
        </>
      )}

      <Dialog open={Boolean(selectedProduct) && !isOrderOpen} onOpenChange={(open) => {
        if (!open) {
          setSelectedProduct(null);
        }
      }}>
        <DialogContent className="max-w-3xl border-slate-800 bg-slate-950 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedProduct?.product_name}</DialogTitle>
          </DialogHeader>
          {selectedProduct ? (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-sm text-slate-400">{selectedProduct.description}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {selectedProduct.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-200">
                      <CheckCircle className="h-4 w-4 text-emerald-300" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Commercials</p>
                <p className="mt-3 text-3xl font-semibold text-emerald-300">{formatCurrency(formatPrice(selectedProduct, discountPercent).discountedPrice)}</p>
                <p className="text-sm text-slate-500">Base {formatCurrency(formatPrice(selectedProduct, discountPercent).basePrice)}</p>
                <Button className="mt-5 w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400" onClick={() => setIsOrderOpen(true)}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start checkout
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isOrderOpen} onOpenChange={(open) => {
        setIsOrderOpen(open);
        if (!open) {
          resetOrderForm();
        }
      }}>
        <DialogContent className="max-w-2xl border-slate-800 bg-slate-950 text-white">
          <DialogHeader>
            <DialogTitle>Checkout {selectedProduct ? `• ${selectedProduct.product_name}` : ''}</DialogTitle>
          </DialogHeader>
          {selectedProduct ? (
            <ScrollArea className="max-h-[75vh] pr-4">
              <div className="space-y-5">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{selectedProduct.product_name}</p>
                      <p className="text-sm text-slate-500">{selectedProduct.category || 'General'}</p>
                    </div>
                    <p className="text-xl font-semibold text-emerald-300">{formatCurrency(formatPrice(selectedProduct, discountPercent).discountedPrice)}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Payment method</Label>
                    <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'wallet' | 'upi' | 'bank' | 'crypto')}>
                      <SelectTrigger className="border-slate-800 bg-slate-900/80">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-slate-800 bg-slate-900 text-white">
                        <SelectItem value="wallet">Wallet</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="crypto">Crypto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Client domain</Label>
                    <Input value={clientDomain} onChange={(event) => setClientDomain(event.target.value)} placeholder="example.com" className="border-slate-800 bg-slate-900/80" />
                  </div>
                </div>
                {paymentMethod !== 'wallet' ? (
                  <div className="space-y-2">
                    <Label>External payment reference</Label>
                    <Input value={externalReference} onChange={(event) => setExternalReference(event.target.value)} placeholder="UTR / bank ref / transaction hash" className="border-slate-800 bg-slate-900/80" />
                  </div>
                ) : (
                  <div className={`rounded-2xl border p-4 ${walletBalance >= formatPrice(selectedProduct, discountPercent).discountedPrice ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-amber-500/30 bg-amber-500/10'}`}>
                    <p className="text-sm text-slate-300">Wallet available: <span className="font-semibold text-white">{formatCurrency(walletBalance)}</span></p>
                    <p className="mt-1 text-xs text-slate-400">Wallet payments verify instantly and generate a license in the same transaction.</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Requirements</Label>
                  <Textarea value={requirements} onChange={(event) => setRequirements(event.target.value)} placeholder="Deployment notes, branding, business logic, region requirements" className="min-h-28 border-slate-800 bg-slate-900/80" />
                </div>
                <Button className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400" disabled={isSubmittingOrder || (paymentMethod === 'wallet' && walletBalance < formatPrice(selectedProduct, discountPercent).discountedPrice)} onClick={() => void handleOrder()}>
                  {isSubmittingOrder ? 'Processing order...' : 'Create real order'}
                </Button>
              </div>
            </ScrollArea>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isJoinOpen} onOpenChange={(open) => {
        setIsJoinOpen(open);
        if (!open) {
          resetJoinForm();
        }
      }}>
        <DialogContent className="max-w-2xl border-slate-800 bg-slate-950 text-white">
          <DialogHeader>
            <DialogTitle>Join Franchise</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-slate-200">
              One click sets up your franchise record, owner access, manager panel, live dashboard, marketplace sync, and revenue wallet linkage.
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger className="border-slate-800 bg-slate-900/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-900 text-white">
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="elite">Elite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={joinCity} onChange={(event) => setJoinCity(event.target.value)} placeholder="Mumbai" className="border-slate-800 bg-slate-900/80" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Business type</Label>
                <Input value={joinBusinessType} onChange={(event) => setJoinBusinessType(event.target.value)} placeholder="Software franchise" className="border-slate-800 bg-slate-900/80" />
              </div>
              <div className="space-y-2">
                <Label>Business name</Label>
                <Input value={joinBusinessName} onChange={(event) => setJoinBusinessName(event.target.value)} placeholder="Optional business name" className="border-slate-800 bg-slate-900/80" />
              </div>
            </div>
            <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-300 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Auto setup</p>
                <p className="mt-2">Franchise account, store, manager profile, and wallet are seeded immediately.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Live sync</p>
                <p className="mt-2">Marketplace sales and new leads are pushed into franchise tables and sync events.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Direct landing</p>
                <p className="mt-2">After join, the app reloads into the franchise dashboard with manager access ready.</p>
              </div>
            </div>
            <Button
              type="button"
              className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              disabled={isJoiningFranchise || !joinCity.trim() || !joinBusinessType.trim()}
              onClick={() => void handleJoinFranchise()}
            >
              {isJoiningFranchise ? 'Connecting marketplace to franchise...' : 'Join Franchise'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isJoinResellerOpen} onOpenChange={(open) => {
        setIsJoinResellerOpen(open);
        if (!open) {
          resetJoinResellerForm();
        }
      }}>
        <DialogContent className="max-w-2xl border-slate-800 bg-slate-950 text-white">
          <DialogHeader>
            <DialogTitle>Join as Reseller</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-slate-200">
              One click provisions the reseller profile, wallet, territory assignment, contract, product access, dashboard route, manager route, and live marketplace sync.
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Country</Label>
                <Input value={joinResellerCountry} onChange={(event) => setJoinResellerCountry(event.target.value)} placeholder="India" className="border-slate-800 bg-slate-900/80" />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input value={joinResellerState} onChange={(event) => setJoinResellerState(event.target.value)} placeholder="Maharashtra" className="border-slate-800 bg-slate-900/80" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={joinResellerCity} onChange={(event) => setJoinResellerCity(event.target.value)} placeholder="Mumbai" className="border-slate-800 bg-slate-900/80" />
              </div>
              <div className="space-y-2">
                <Label>Business type</Label>
                <Input value={joinResellerBusinessType} onChange={(event) => setJoinResellerBusinessType(event.target.value)} placeholder="Software reseller" className="border-slate-800 bg-slate-900/80" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Business name</Label>
              <Input value={joinResellerBusinessName} onChange={(event) => setJoinResellerBusinessName(event.target.value)} placeholder="Optional business name" className="border-slate-800 bg-slate-900/80" />
            </div>
            <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-300 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Smart territory</p>
                <p className="mt-2">One region maps to one reseller. Conflicts are blocked and shifted to pending instead of leaking assignments.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Live revenue</p>
                <p className="mt-2">Marketplace sales convert into reseller revenue, commission, and wallet credits through the sync engine.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Dual access</p>
                <p className="mt-2">Reseller dashboard and reseller manager routes are activated together with no back-office setup.</p>
              </div>
            </div>
            <Button
              type="button"
              className="w-full bg-emerald-400 text-slate-950 hover:bg-emerald-300"
              disabled={isJoiningReseller || !joinResellerCountry.trim() || !joinResellerBusinessType.trim()}
              onClick={() => void handleJoinReseller()}
            >
              {isJoiningReseller ? 'Connecting marketplace to reseller...' : 'Join as Reseller'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isJoinInfluencerOpen} onOpenChange={(open) => {
        setIsJoinInfluencerOpen(open);
        if (!open) {
          resetJoinInfluencerForm();
        }
      }}>
        <DialogContent className="max-w-2xl border-slate-800 bg-slate-950 text-white">
          <DialogHeader>
            <DialogTitle>Join as Influencer</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-slate-200">
              One click provisions the influencer profile, promotable marketplace product links, sync event stream, dashboard route, manager visibility, and fraud-safe conversion pipeline.
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full name</Label>
                <Input value={joinInfluencerName} onChange={(event) => setJoinInfluencerName(event.target.value)} placeholder="Creator name" className="border-slate-800 bg-slate-900/80" />
              </div>
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={joinInfluencerPlatform} onValueChange={setJoinInfluencerPlatform}>
                  <SelectTrigger className="border-slate-800 bg-slate-900/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-slate-800 bg-slate-900 text-white">
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="x">X</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Niche</Label>
                <Input value={joinInfluencerNiche} onChange={(event) => setJoinInfluencerNiche(event.target.value)} placeholder="Software, SaaS, AI" className="border-slate-800 bg-slate-900/80" />
              </div>
              <div className="space-y-2">
                <Label>Followers</Label>
                <Input value={joinInfluencerFollowers} onChange={(event) => setJoinInfluencerFollowers(event.target.value)} placeholder="10000" className="border-slate-800 bg-slate-900/80" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Social handle</Label>
                <Input value={joinInfluencerHandle} onChange={(event) => setJoinInfluencerHandle(event.target.value)} placeholder="@creator" className="border-slate-800 bg-slate-900/80" />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={joinInfluencerCity} onChange={(event) => setJoinInfluencerCity(event.target.value)} placeholder="Mumbai" className="border-slate-800 bg-slate-900/80" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>State</Label>
                <Input value={joinInfluencerState} onChange={(event) => setJoinInfluencerState(event.target.value)} placeholder="Maharashtra" className="border-slate-800 bg-slate-900/80" />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input value={joinInfluencerCountry} onChange={(event) => setJoinInfluencerCountry(event.target.value)} placeholder="India" className="border-slate-800 bg-slate-900/80" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={joinInfluencerBio} onChange={(event) => setJoinInfluencerBio(event.target.value)} placeholder="Audience, offer angle, conversion style" className="min-h-24 border-slate-800 bg-slate-900/80" />
            </div>
            <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-300 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Auto products</p>
                <p className="mt-2">Promotable marketplace products are linked immediately so campaign setup starts with a real catalog.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Fraud guard</p>
                <p className="mt-2">Tracking bypass, fake clicks, duplicate leads, and bot traffic are blocked before they reach payout.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Live sync</p>
                <p className="mt-2">Dashboard and manager both read the same sync event stream for leads, campaigns, approvals, and wallet credits.</p>
              </div>
            </div>
            <Button
              type="button"
              className="w-full bg-amber-300 text-slate-950 hover:bg-amber-200"
              disabled={isJoiningInfluencer || !joinInfluencerPlatform.trim() || !joinInfluencerNiche.trim()}
              onClick={() => void handleJoinInfluencer()}
            >
              {isJoiningInfluencer ? 'Connecting marketplace to influencer engine...' : 'Join as Influencer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
