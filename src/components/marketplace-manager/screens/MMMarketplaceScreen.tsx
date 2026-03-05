import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Store, 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Eye,
  Sparkles,
  Tag,
  CheckCircle,
  ArrowRight,
  Heart,
  Bell,
  BellOff,
  Play,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { marketplaceService } from '@/services/marketplaceService';

interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  features: string[];
  basePrice: number;
  franchiseDiscount: number;
  franchisePrice: number;
  rating: number;
  reviews: number;
  popular: boolean;
  demoUrl?: string;
}

const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'crm', label: 'CRM Solutions' },
  { id: 'hrm', label: 'HRM Systems' },
  { id: 'erp', label: 'ERP Software' },
  { id: 'ecommerce', label: 'E-Commerce' },
  { id: 'marketing', label: 'Marketing Tools' },
];

const products: Product[] = [
  {
    id: '1',
    name: 'CRM Pro Suite',
    category: 'crm',
    subCategory: 'Sales CRM',
    description: 'Complete customer relationship management solution with AI insights',
    features: ['Lead Management', 'Sales Pipeline', 'Email Integration', 'AI Analytics'],
    basePrice: 50000,
    franchiseDiscount: 30,
    franchisePrice: 35000,
    rating: 4.8,
    reviews: 124,
    popular: true,
    demoUrl: 'https://demo.softwarewala.net/crm-pro',
  },
  {
    id: '2',
    name: 'HRM Enterprise',
    category: 'hrm',
    subCategory: 'Employee Management',
    description: 'Full-featured human resource management system',
    features: ['Attendance', 'Payroll', 'Performance', 'Recruitment'],
    basePrice: 75000,
    franchiseDiscount: 30,
    franchisePrice: 52500,
    rating: 4.6,
    reviews: 89,
    popular: true,
    demoUrl: 'https://demo.softwarewala.net/hrm-enterprise',
  },
  {
    id: '3',
    name: 'E-Shop Builder',
    category: 'ecommerce',
    subCategory: 'Online Store',
    description: 'Build stunning online stores with integrated payments',
    features: ['Store Builder', 'Payment Gateway', 'Inventory', 'Shipping'],
    basePrice: 40000,
    franchiseDiscount: 30,
    franchisePrice: 28000,
    rating: 4.9,
    reviews: 203,
    popular: true,
    demoUrl: 'https://demo.softwarewala.net/eshop-builder',
  },
  {
    id: '4',
    name: 'Marketing Autopilot',
    category: 'marketing',
    subCategory: 'Automation',
    description: 'AI-powered marketing automation platform',
    features: ['Email Campaigns', 'Social Media', 'SEO Tools', 'Analytics'],
    basePrice: 35000,
    franchiseDiscount: 30,
    franchisePrice: 24500,
    rating: 4.7,
    reviews: 156,
    popular: false,
    demoUrl: 'https://demo.softwarewala.net/marketing-autopilot',
  },
  {
    id: '5',
    name: 'ERP Complete',
    category: 'erp',
    subCategory: 'Business Management',
    description: 'End-to-end enterprise resource planning solution',
    features: ['Finance', 'Inventory', 'Manufacturing', 'Supply Chain'],
    basePrice: 120000,
    franchiseDiscount: 30,
    franchisePrice: 84000,
    rating: 4.5,
    reviews: 67,
    popular: false,
    demoUrl: 'https://demo.softwarewala.net/erp-complete',
  },
  {
    id: '6',
    name: 'Lead Magnet Pro',
    category: 'crm',
    subCategory: 'Lead Generation',
    description: 'Capture and convert leads with intelligent forms',
    features: ['Smart Forms', 'Landing Pages', 'A/B Testing', 'Integrations'],
    basePrice: 25000,
    franchiseDiscount: 30,
    franchisePrice: 17500,
    rating: 4.8,
    reviews: 178,
    popular: true,
    demoUrl: 'https://demo.softwarewala.net/lead-magnet-pro',
  },
];

export function MMMarketplaceScreen() {
  const { user, userRole } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderRequirements, setOrderRequirements] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<Set<string>>(new Set());
  const [walletBalance, setWalletBalance] = useState(0);
  const [franchiseId, setFranchiseId] = useState<string | null>(null);

  const fetchWalletData = useCallback(async () => {
    if (!user) return;
    try {
      const { data: franchise } = await supabase
        .from('franchise_accounts')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (franchise) {
        setFranchiseId(franchise.id);

        const { data: ledger } = await supabase
          .from('franchise_wallet_ledger')
          .select('balance_after')
          .eq('franchise_id', franchise.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (ledger) {
          setWalletBalance(ledger.balance_after);
        }
      }
    } catch {
      // Keep default balance if fetch fails
    }
  }, [user]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const handleConfirmOrder = async () => {
    if (!user || !franchiseId) {
      toast.error('Authentication required. Please log in again.');
      return;
    }
    if (!selectedProduct) return;

    if (walletBalance < selectedProduct.franchisePrice) {
      const shortfall = selectedProduct.franchisePrice - walletBalance;
      toast.error(`Insufficient balance. Please add ₹${shortfall.toLocaleString()} to proceed.`);
      return;
    }

    setIsPlacingOrder(true);
    try {
      const result = await marketplaceService.placeOrder({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        franchiseId,
        userId: user.id,
        userRole: userRole || 'franchise',
        amount: selectedProduct.franchisePrice,
        baseAmount: selectedProduct.basePrice,
        discountPercent: selectedProduct.franchiseDiscount,
        currentWalletBalance: walletBalance,
        requirements: orderRequirements,
      });

      if (!result.success) {
        toast.error(result.error || 'Failed to place order. Please try again.');
        return;
      }

      setWalletBalance(prev => prev - selectedProduct.franchisePrice);
      setShowOrderDialog(false);
      setOrderRequirements('');
      toast.success(
        `Order placed successfully! ${result.orderNumber} — ₹${selectedProduct.franchisePrice.toLocaleString()} deducted from wallet.`
      );
    } catch (err: any) {
      toast.error(err?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleToggleFavorite = (productId: string, productName: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        toast.info(`${productName} removed from wishlist.`);
      } else {
        next.add(productId);
        toast.success(`${productName} added to wishlist!`);
      }
      return next;
    });
  };

  const handleToggleNotify = (productId: string, productName: string) => {
    setNotifications(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        toast.info(`Unsubscribed from updates for ${productName}.`);
      } else {
        next.add(productId);
        toast.success(`You'll be notified about updates for ${productName}!`);
      }
      return next;
    });
  };

  const handleOpenDemo = (product: Product) => {
    if (product.demoUrl) {
      try {
        const url = new URL(product.demoUrl);
        if (url.protocol === 'https:' || url.protocol === 'http:') {
          window.open(url.toString(), '_blank', 'noopener,noreferrer');
        } else {
          toast.error('Invalid demo URL.');
        }
      } catch {
        toast.error('Invalid demo URL.');
      }
    } else {
      toast.info(`Demo for ${product.name} is coming soon.`);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Store className="h-6 w-6 text-purple-400" />
            Software Marketplace
          </h1>
          <p className="text-slate-400 mt-1">Browse and purchase software solutions</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            30% Franchise Discount Applied
          </Badge>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700"
          />
        </div>
        <Button variant="outline" className="border-slate-700">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat.id)}
            className={activeCategory === cat.id 
              ? "bg-purple-500 hover:bg-purple-600" 
              : "border-slate-700 hover:bg-slate-800"
            }
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-xs text-slate-400 mt-1">{product.subCategory}</p>
                </div>
                <div className="flex items-center gap-1">
                  {product.popular && (
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-300">{product.description}</p>
              
              {/* Features */}
              <div className="flex flex-wrap gap-1">
                {product.features.slice(0, 3).map((feature, i) => (
                  <Badge key={i} variant="outline" className="text-xs border-slate-600">
                    {feature}
                  </Badge>
                ))}
                {product.features.length > 3 && (
                  <Badge variant="outline" className="text-xs border-slate-600">
                    +{product.features.length - 3}
                  </Badge>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-400">({product.reviews} reviews)</span>
              </div>

              {/* Pricing */}
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Base Price</span>
                  <span className="text-sm line-through text-slate-500">₹{product.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs text-emerald-400">{product.franchiseDiscount}% OFF</span>
                  </div>
                  <span className="text-xl font-bold text-emerald-400">₹{product.franchisePrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {/* Demo Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-blue-400 hover:text-blue-300"
                  onClick={() => handleOpenDemo(product)}
                  title="Open Demo"
                >
                  <Play className="h-4 w-4" />
                </Button>

                {/* Favorites Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-slate-600 ${favorites.has(product.id) ? 'text-pink-400' : 'text-slate-400 hover:text-pink-400'}`}
                  onClick={() => handleToggleFavorite(product.id, product.name)}
                  title={favorites.has(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-pink-400' : ''}`} />
                </Button>

                {/* Notify Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-slate-600 ${notifications.has(product.id) ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400'}`}
                  onClick={() => handleToggleNotify(product.id, product.name)}
                  title={notifications.has(product.id) ? 'Unsubscribe from Updates' : 'Subscribe to Updates'}
                >
                  {notifications.has(product.id) ? (
                    <Bell className="h-4 w-4 fill-amber-400" />
                  ) : (
                    <BellOff className="h-4 w-4" />
                  )}
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-slate-600"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{product.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <p className="text-slate-300">{product.description}</p>
                      <div>
                        <h4 className="font-medium mb-2">Features</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {product.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                        <div className="flex items-center justify-between">
                          <span>Your Price</span>
                          <span className="text-2xl font-bold text-emerald-400">
                            ₹{product.franchisePrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                        onClick={() => handleOpenDemo(product)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Open Live Demo
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={showOrderDialog && selectedProduct?.id === product.id} onOpenChange={(open) => {
                  setShowOrderDialog(open);
                  if (!open) setOrderRequirements('');
                }}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-purple-500 hover:bg-purple-600"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowOrderDialog(true);
                      }}
                      disabled={walletBalance < product.franchisePrice}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-slate-700">
                    <DialogHeader>
                      <DialogTitle>Place Order - {product.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      {/* Order Summary */}
                      <div className="p-4 rounded-lg bg-slate-800 border border-slate-700">
                        <h4 className="font-medium mb-3">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Product</span>
                            <span>{product.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Base Price</span>
                            <span className="line-through text-slate-500">₹{product.basePrice.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-emerald-400">
                            <span>Franchise Discount ({product.franchiseDiscount}%)</span>
                            <span>-₹{(product.basePrice - product.franchisePrice).toLocaleString()}</span>
                          </div>
                          <div className="border-t border-slate-600 pt-2 mt-2">
                            <div className="flex justify-between font-bold text-lg">
                              <span>Total</span>
                              <span className="text-emerald-400">₹{product.franchisePrice.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Wallet Balance Check */}
                      <div className={`p-3 rounded-lg border ${
                        walletBalance >= product.franchisePrice 
                          ? 'bg-emerald-500/10 border-emerald-500/30' 
                          : 'bg-red-500/10 border-red-500/30'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Wallet Balance</span>
                          <span className={`font-bold ${
                            walletBalance >= product.franchisePrice ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            ₹{walletBalance.toLocaleString()}
                          </span>
                        </div>
                        {walletBalance < product.franchisePrice && (
                          <p className="text-xs text-red-400 mt-2">
                            Insufficient balance. Please add ₹{(product.franchisePrice - walletBalance).toLocaleString()} to proceed.
                          </p>
                        )}
                      </div>

                      {/* Requirements */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Additional Requirements (Optional)</label>
                        <Textarea 
                          placeholder="Any specific requirements or customizations..."
                          className="bg-slate-800 border-slate-700"
                          value={orderRequirements}
                          onChange={(e) => setOrderRequirements(e.target.value)}
                        />
                      </div>

                      {/* Upload Payment Screenshot */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Payment Screenshot (Optional)</label>
                        <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
                          <p className="text-sm text-slate-400">Click to upload or drag and drop</p>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-purple-500 hover:bg-purple-600"
                        disabled={walletBalance < product.franchisePrice || isPlacingOrder}
                        onClick={handleConfirmOrder}
                      >
                        {isPlacingOrder ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Placing Order...
                          </>
                        ) : (
                          <>
                            Confirm Order
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {walletBalance < product.franchisePrice && (
                <p className="text-xs text-red-400 text-center">
                  Insufficient wallet balance
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
