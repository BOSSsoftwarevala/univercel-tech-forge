/**
 * RESELLER PRODUCTS - SELLING CATALOG
 * View Features, Demo, Share Link, Request Price, Start Sale
 * NO edit / NO clone / NO download
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  Eye,
  Share2,
  IndianRupee,
  ShoppingCart,
  GraduationCap,
  Heart,
  Briefcase,
  Store,
  Building2,
  Landmark,
  Wrench,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

const categories = [
  { id: 'education', label: 'Education Software', icon: GraduationCap },
  { id: 'healthcare', label: 'Healthcare Software', icon: Heart },
  { id: 'business', label: 'Business Management', icon: Briefcase },
  { id: 'retail', label: 'Retail / POS', icon: Store },
  { id: 'realestate', label: 'Real Estate', icon: Building2 },
  { id: 'government', label: 'Government / Utility', icon: Landmark },
  { id: 'custom', label: 'Custom Solutions', icon: Wrench },
];

const products = [
  {
    id: 1,
    name: 'School ERP Pro',
    category: 'education',
    price: '₹75,000',
    commission: '₹15,000',
    features: ['Student Management', 'Fee Collection', 'Exam Portal', 'Parent App', 'Transport Module'],
    demoUrl: 'https://demo.schoolerp.com',
    popular: true,
  },
  {
    id: 2,
    name: 'Hospital HMS',
    category: 'healthcare',
    price: '₹1,20,000',
    commission: '₹24,000',
    features: ['Patient Records', 'OPD/IPD', 'Pharmacy', 'Lab Management', 'Billing'],
    demoUrl: 'https://demo.hospitalhms.com',
    popular: true,
  },
  {
    id: 3,
    name: 'Retail POS System',
    category: 'retail',
    price: '₹35,000',
    commission: '₹7,000',
    features: ['Inventory', 'Billing', 'GST Reports', 'Multi-store', 'Barcode'],
    demoUrl: 'https://demo.retailpos.com',
    popular: false,
  },
  {
    id: 4,
    name: 'Real Estate CRM',
    category: 'realestate',
    price: '₹55,000',
    commission: '₹11,000',
    features: ['Lead Management', 'Property Listing', 'Site Visits', 'Documentation', 'Reports'],
    demoUrl: 'https://demo.realestate.com',
    popular: false,
  },
  {
    id: 5,
    name: 'Business ERP',
    category: 'business',
    price: '₹95,000',
    commission: '₹19,000',
    features: ['Accounting', 'HR Module', 'Inventory', 'CRM', 'Reports'],
    demoUrl: 'https://demo.businesserp.com',
    popular: true,
  },
];

export function RSProductsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleShare = (product: typeof products[0]) => {
    navigator.clipboard.writeText(`Check out ${product.name} - ${product.price}`);
    toast.success('Product link copied to clipboard!');
  };

  const handleRequestPrice = (product: typeof products[0]) => {
    toast.success(`Price request sent for ${product.name}`);
  };

  const handleStartSale = (product: typeof products[0]) => {
    toast.success(`Sale initiated for ${product.name}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products Catalog</h1>
          <p className="text-sm text-slate-400">Browse and sell Software Vala products</p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          {products.length} Products Available
        </Badge>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-900/50 border-slate-700 text-white"
        />
      </div>

      {/* Categories */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('all')}
            className={activeCategory === 'all' ? 'bg-emerald-600' : 'border-slate-700 text-slate-300'}
          >
            All
          </Button>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
                className={activeCategory === cat.id ? 'bg-emerald-600' : 'border-slate-700 text-slate-300'}
              >
                <Icon className="h-4 w-4 mr-1" />
                {cat.label}
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-800 hover:border-emerald-500/30 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{product.name}</CardTitle>
                    <p className="text-xs text-slate-400 capitalize">{product.category}</p>
                  </div>
                  {product.popular && (
                    <Badge className="bg-amber-500/20 text-amber-400">Popular</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Features Preview */}
                <div className="space-y-1">
                  {product.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                      <Check className="h-3 w-3 text-emerald-400" />
                      {feature}
                    </div>
                  ))}
                  {product.features.length > 3 && (
                    <p className="text-xs text-slate-500">+{product.features.length - 3} more features</p>
                  )}
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <p className="text-lg font-bold text-white">{product.price}</p>
                    <p className="text-xs text-emerald-400">Commission: {product.commission}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Features
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-800">
                      <DialogHeader>
                        <DialogTitle className="text-white">{product.name} - Features</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-2 mt-4">
                        {product.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-slate-300">
                            <Check className="h-4 w-4 text-emerald-400" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    onClick={() => window.open(product.demoUrl, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Demo
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    onClick={() => handleShare(product)}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                    onClick={() => handleRequestPrice(product)}
                  >
                    <IndianRupee className="h-4 w-4 mr-1" />
                    Request Price
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleStartSale(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Start Sale
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
