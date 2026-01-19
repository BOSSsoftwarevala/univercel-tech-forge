/**
 * MARKETPLACE SCREEN
 * All Software, Category Wise, View/Cart/Favorites
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  ShoppingCart,
  Heart,
  Eye,
  GraduationCap,
  Building2,
  Users,
  UserCheck,
  Stethoscope,
  Landmark,
  ShoppingBag,
  Wrench,
  Grid,
  List,
} from 'lucide-react';

const categories = [
  { id: 'education', label: 'Education', icon: GraduationCap, count: 12 },
  { id: 'erp', label: 'ERP', icon: Building2, count: 8 },
  { id: 'crm', label: 'CRM', icon: Users, count: 6 },
  { id: 'hrm', label: 'HRM', icon: UserCheck, count: 5 },
  { id: 'healthcare', label: 'Healthcare', icon: Stethoscope, count: 9 },
  { id: 'government', label: 'Government', icon: Landmark, count: 4 },
  { id: 'ecommerce', label: 'E-Commerce', icon: ShoppingBag, count: 7 },
  { id: 'custom', label: 'Custom Solutions', icon: Wrench, count: 15 },
];

const software = [
  { id: 1, name: 'School Management Pro', category: 'Education', price: 2999, discount: 15, rating: 4.8 },
  { id: 2, name: 'Enterprise ERP Suite', category: 'ERP', price: 4999, discount: 20, rating: 4.9 },
  { id: 3, name: 'CRM Ultimate', category: 'CRM', price: 1999, discount: 10, rating: 4.7 },
  { id: 4, name: 'HR Management Plus', category: 'HRM', price: 1499, discount: 12, rating: 4.6 },
  { id: 5, name: 'Hospital Management', category: 'Healthcare', price: 3999, discount: 18, rating: 4.8 },
  { id: 6, name: 'E-Gov Portal', category: 'Government', price: 5999, discount: 25, rating: 4.9 },
];

export function FOMarketplaceScreen() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">Browse and order software solutions</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search software..." className="pl-9 w-64" />
          </div>
          <Button variant="outline" size="icon" onClick={() => setViewMode('grid')}>
            <Grid className={`h-4 w-4 ${viewMode === 'grid' ? 'text-primary' : ''}`} />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setViewMode('list')}>
            <List className={`h-4 w-4 ${viewMode === 'list' ? 'text-primary' : ''}`} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            All Software
          </TabsTrigger>
          <TabsTrigger value="category" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Category Wise
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Categories Quick Access */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Card
                  key={cat.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <CardContent className="p-3 text-center">
                    <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-xs font-medium truncate">{cat.label}</p>
                    <p className="text-[10px] text-muted-foreground">{cat.count} items</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Software Grid */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
            {software.map((item) => (
              <Card key={item.id} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className={viewMode === 'grid' ? 'p-4' : 'p-4 flex items-center justify-between'}>
                  <div className={viewMode === 'list' ? 'flex items-center gap-4 flex-1' : ''}>
                    <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-3 flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-primary/40" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-[10px]">{item.category}</Badge>
                        <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">
                          {item.discount}% OFF
                        </Badge>
                      </div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold text-primary">${item.price}</span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${Math.round(item.price / (1 - item.discount / 100))}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Heart className="h-3 w-3" />
                    </Button>
                    <Button size="sm" className="flex-1 gap-1">
                      <ShoppingCart className="h-3 w-3" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="category" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Card key={cat.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{cat.label}</h3>
                    <p className="text-sm text-muted-foreground">{cat.count} Software Available</p>
                    <Button className="mt-4 w-full" size="sm">
                      Browse Category
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FOMarketplaceScreen;
