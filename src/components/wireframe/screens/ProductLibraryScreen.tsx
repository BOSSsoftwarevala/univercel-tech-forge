import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Star, 
  TrendingUp,
  Tag,
  Layers,
  Box,
  BarChart3
} from 'lucide-react';

// Mock data
const productStats = {
  totalProducts: 156,
  activeProducts: 142,
  categories: 12,
  avgRating: 4.6
};

const products = [
  { id: 1, name: 'Enterprise CRM Suite', category: 'Software', status: 'active', price: '$299/mo', sales: 1245, rating: 4.8, stock: 'Unlimited' },
  { id: 2, name: 'Marketing Automation Pro', category: 'Software', status: 'active', price: '$199/mo', sales: 892, rating: 4.7, stock: 'Unlimited' },
  { id: 3, name: 'HR Management System', category: 'Software', status: 'active', price: '$149/mo', sales: 654, rating: 4.5, stock: 'Unlimited' },
  { id: 4, name: 'Analytics Dashboard', category: 'Add-on', status: 'active', price: '$49/mo', sales: 2341, rating: 4.9, stock: 'Unlimited' },
  { id: 5, name: 'API Integration Pack', category: 'Add-on', status: 'beta', price: '$79/mo', sales: 234, rating: 4.3, stock: 'Unlimited' },
  { id: 6, name: 'White-label Solution', category: 'Enterprise', status: 'active', price: 'Custom', sales: 45, rating: 4.8, stock: 'Limited' },
  { id: 7, name: 'Mobile App Builder', category: 'Software', status: 'coming-soon', price: '$249/mo', sales: 0, rating: 0, stock: 'N/A' },
  { id: 8, name: 'Security Compliance Kit', category: 'Add-on', status: 'active', price: '$99/mo', sales: 567, rating: 4.6, stock: 'Unlimited' }
];

const categories = [
  { name: 'Software', count: 45, revenue: '$2.4M' },
  { name: 'Add-ons', count: 32, revenue: '$890K' },
  { name: 'Enterprise', count: 12, revenue: '$1.8M' },
  { name: 'Services', count: 28, revenue: '$560K' },
  { name: 'Training', count: 18, revenue: '$320K' },
  { name: 'Support Plans', count: 21, revenue: '$450K' }
];

const topPerformers = [
  { name: 'Analytics Dashboard', growth: '+45%', revenue: '$234K' },
  { name: 'Enterprise CRM Suite', growth: '+32%', revenue: '$567K' },
  { name: 'Marketing Automation Pro', growth: '+28%', revenue: '$345K' },
  { name: 'Security Compliance Kit', growth: '+22%', revenue: '$123K' }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/20 text-green-400';
    case 'beta': return 'bg-purple-500/20 text-purple-400';
    case 'coming-soon': return 'bg-blue-500/20 text-blue-400';
    case 'discontinued': return 'bg-red-500/20 text-red-400';
    default: return 'bg-muted text-muted-foreground';
  }
};

export function ProductLibraryScreen() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Library</h1>
          <p className="text-muted-foreground">Manage products, pricing & inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." className="pl-10" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{productStats.totalProducts}</p>
                <p className="text-sm text-muted-foreground">Total Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Box className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{productStats.activeProducts}</p>
                <p className="text-sm text-muted-foreground">Active Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Layers className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{productStats.categories}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{productStats.avgRating}</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{product.name}</p>
                      <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {product.category}
                      </span>
                      <span>{product.price}</span>
                      {product.rating > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400" />
                          {product.rating}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.sales.toLocaleString()} sales</p>
                    <p className="text-sm text-muted-foreground">{product.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">{category.count} products</p>
                    </div>
                    <p className="font-medium text-green-400">{category.revenue}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPerformers.map((product, index) => (
                  <div key={index} className="p-2 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <Badge className="bg-green-500/20 text-green-400">{product.growth}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Revenue: {product.revenue}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
