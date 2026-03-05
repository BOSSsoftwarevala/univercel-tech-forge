import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Store,
  Star,
  ShoppingCart,
  Wallet,
  CheckCircle,
  BarChart3,
  Megaphone,
  Users,
  Globe,
  Zap,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const GLOBAL_PRODUCT_PRICE_USD = 249;

interface Product {
  id: string;
  name: string;
  description: string;
  features: string[];
  icon: React.ElementType;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'CRM Pro Suite',
    description: 'Complete customer relationship management with lead tracking, pipeline management, and automated follow-ups.',
    features: ['Lead Management', 'Pipeline Tracking', 'Email Automation', 'Reports & Analytics'],
    icon: Users,
    category: 'CRM',
    rating: 4.8,
    reviews: 124,
    badge: 'Popular',
  },
  {
    id: '2',
    name: 'E-Shop Builder',
    description: 'Build a full-featured online store with product catalog, payment gateway, and order management.',
    features: ['Product Catalog', 'Payment Gateway', 'Order Management', 'Inventory Tracking'],
    icon: Store,
    category: 'E-Commerce',
    rating: 4.7,
    reviews: 98,
  },
  {
    id: '3',
    name: 'Marketing Autopilot',
    description: 'Automate your marketing campaigns across email, SMS, and social media with smart scheduling.',
    features: ['Email Campaigns', 'SMS Marketing', 'Social Scheduling', 'A/B Testing'],
    icon: Megaphone,
    category: 'Marketing',
    rating: 4.6,
    reviews: 87,
    badge: 'New',
  },
  {
    id: '4',
    name: 'Lead Magnet Pro',
    description: 'Capture and nurture leads with high-converting landing pages, forms, and automated sequences.',
    features: ['Landing Pages', 'Lead Forms', 'Drip Sequences', 'Lead Scoring'],
    icon: Zap,
    category: 'Lead Generation',
    rating: 4.5,
    reviews: 73,
  },
  {
    id: '5',
    name: 'Analytics Dashboard',
    description: 'Get deep insights into your business performance with real-time dashboards and custom reports.',
    features: ['Real-time Data', 'Custom Reports', 'Goal Tracking', 'Data Export'],
    icon: BarChart3,
    category: 'Analytics',
    rating: 4.9,
    reviews: 156,
    badge: 'Top Rated',
  },
  {
    id: '6',
    name: 'Business Website',
    description: 'Professional multi-page business website with SEO optimization, blog, and contact management.',
    features: ['Multi-page Site', 'SEO Optimized', 'Blog Module', 'Contact Forms'],
    icon: Globe,
    category: 'Website',
    rating: 4.7,
    reviews: 112,
  },
];

export function MMMarketplaceScreen() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const walletBalance = 1250.00;
  const canAfford = walletBalance >= GLOBAL_PRODUCT_PRICE_USD;

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product);
    setOrderConfirmed(false);
  };

  const handleConfirmOrder = () => {
    setOrderConfirmed(true);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setOrderConfirmed(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Store className="h-6 w-6 text-purple-400" />
            Marketplace
          </h1>
          <p className="text-slate-400 mt-1">Browse and order software products for your business</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
          <Wallet className="h-5 w-5 text-emerald-400" />
          <span className="text-sm text-slate-400">Wallet Balance:</span>
          <span className="font-bold text-emerald-400">${walletBalance.toFixed(2)}</span>
        </div>
      </div>

      {/* Global Price Banner */}
      <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center gap-3">
        <DollarSign className="h-5 w-5 text-purple-400 shrink-0" />
        <div>
          <p className="font-medium text-purple-300">Unified Pricing — All Products at <span className="font-bold">${GLOBAL_PRODUCT_PRICE_USD} USD</span></p>
          <p className="text-sm text-slate-400 mt-0.5">Every software product in the marketplace is available at the same flat price.</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-3 gap-6">
        {products.map(product => {
          const Icon = product.icon;
          return (
            <Card key={product.id} className="bg-slate-800/50 border-slate-700 flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-lg bg-purple-500/20">
                    <Icon className="h-6 w-6 text-purple-400" />
                  </div>
                  {product.badge && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      {product.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base mt-3">{product.name}</CardTitle>
                <Badge variant="outline" className="w-fit text-xs border-slate-600 text-slate-400">
                  {product.category}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 gap-4">
                <p className="text-sm text-slate-400 line-clamp-2">{product.description}</p>

                <ul className="space-y-1">
                  {product.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-slate-500">({product.reviews} reviews)</span>
                </div>

                <div className="mt-auto">
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-3xl font-bold">${GLOBAL_PRODUCT_PRICE_USD}</span>
                    <span className="text-slate-400 text-sm">USD</span>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    onClick={() => handleBuyNow(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Order Confirmation Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={open => !open && handleCloseDialog()}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>
              {orderConfirmed ? 'Order Placed!' : 'Confirm Your Order'}
            </DialogTitle>
          </DialogHeader>

          {orderConfirmed ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="p-4 rounded-full bg-emerald-500/20">
                <CheckCircle className="h-10 w-10 text-emerald-400" />
              </div>
              <p className="text-lg font-semibold text-emerald-400">Order Confirmed!</p>
              <p className="text-sm text-slate-400 text-center">
                Your order for <span className="text-white font-medium">{selectedProduct?.name}</span> has been placed successfully.
                Our team will start development shortly.
              </p>
              <div className="w-full p-4 rounded-lg bg-slate-800 border border-slate-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Product</span>
                  <span>{selectedProduct?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Amount Charged</span>
                  <span className="font-bold text-emerald-400">${GLOBAL_PRODUCT_PRICE_USD} USD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Remaining Balance</span>
                  <span>${(walletBalance - GLOBAL_PRODUCT_PRICE_USD).toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full bg-purple-500 hover:bg-purple-600" onClick={handleCloseDialog}>
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              {selectedProduct && (
                <>
                  <div className="p-4 rounded-lg bg-slate-800 border border-slate-700 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        {React.createElement(selectedProduct.icon, { className: 'h-5 w-5 text-purple-400' })}
                      </div>
                      <div>
                        <p className="font-semibold">{selectedProduct.name}</p>
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                          {selectedProduct.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 space-y-2">
                    <p className="text-sm font-medium text-slate-300 mb-3">Order Summary</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Product Price</span>
                      <span>${GLOBAL_PRODUCT_PRICE_USD} USD</span>
                    </div>
                    <div className="border-t border-slate-700 pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-purple-400">${GLOBAL_PRODUCT_PRICE_USD} USD</span>
                    </div>
                  </div>

                  {/* Wallet Balance Check */}
                  <div className={`p-3 rounded-lg border flex items-start gap-3 ${
                    canAfford
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    {canAfford ? (
                      <>
                        <Wallet className="h-5 w-5 text-emerald-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-emerald-400">Sufficient Balance</p>
                          <p className="text-xs text-slate-400">
                            Wallet: ${walletBalance.toFixed(2)} → After purchase: ${(walletBalance - GLOBAL_PRODUCT_PRICE_USD).toFixed(2)}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-400">Insufficient Balance</p>
                          <p className="text-xs text-slate-400">
                            Your wallet balance (${walletBalance.toFixed(2)}) is less than ${GLOBAL_PRODUCT_PRICE_USD} USD required.
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-600"
                      onClick={handleCloseDialog}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      disabled={!canAfford}
                      onClick={handleConfirmOrder}
                    >
                      Confirm & Pay ${GLOBAL_PRODUCT_PRICE_USD}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
