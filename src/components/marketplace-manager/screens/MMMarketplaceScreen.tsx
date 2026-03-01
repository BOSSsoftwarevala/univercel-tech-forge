import React, { useState, useEffect } from 'react';
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
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { marketplaceService, type MarketplaceProduct } from '@/services/marketplaceService';

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
}

const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'crm', label: 'CRM Solutions' },
  { id: 'hrm', label: 'HRM Systems' },
  { id: 'erp', label: 'ERP Software' },
  { id: 'ecommerce', label: 'E-Commerce' },
  { id: 'marketing', label: 'Marketing Tools' },
];

function mapSupabaseProduct(p: MarketplaceProduct): Product {
  const basePrice = p.lifetime_price ?? p.monthly_price ?? 0;
  return {
    id: p.product_id,
    name: p.product_name,
    category: (p.category ?? 'other').toLowerCase(),
    subCategory: p.category ?? 'Software',
    description: p.description ?? 'Enterprise software solution',
    features: Array.isArray((p as any).features_json) ? (p as any).features_json : [],
    basePrice,
    franchiseDiscount: 30,
    franchisePrice: Math.round(basePrice * 0.7),
    rating: 4.5,
    reviews: 0,
    popular: p.status === 'active',
  };
}

export function MMMarketplaceScreen() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    marketplaceService
      .getProducts()
      .then((data) => setProducts(data.map(mapSupabaseProduct)))
      .catch((err) => console.error('Failed to load marketplace products:', err))
      .finally(() => setLoading(false));

    const channel = marketplaceService.subscribeToProductChanges(() => {
      marketplaceService
        .getProducts()
        .then((data) => setProducts(data.map(mapSupabaseProduct)))
        .catch((err) => console.error('Failed to refresh marketplace products:', err));
    });

    return () => { channel.unsubscribe(); };
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const walletBalance = 45230; // Would come from state/API

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Store className="h-6 w-6 text-purple-400" />
            Software Marketplace
          </h1>
          <p className="text-slate-400 mt-1">
            Browse and purchase software solutions
            {!loading && <span className="ml-2 text-purple-400">({products.length} products)</span>}
          </p>
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
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          <span className="ml-3 text-slate-400">Loading products from database...</span>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-xs text-slate-400 mt-1">{product.subCategory}</p>
                </div>
                {product.popular && (
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
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
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={showOrderDialog && selectedProduct?.id === product.id} onOpenChange={setShowOrderDialog}>
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
                        disabled={walletBalance < product.franchisePrice}
                      >
                        Confirm Order
                        <ArrowRight className="h-4 w-4 ml-2" />
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
      )}
    </div>
  );
}
