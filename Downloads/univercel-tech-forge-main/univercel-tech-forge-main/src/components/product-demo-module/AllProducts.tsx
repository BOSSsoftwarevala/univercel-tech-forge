/**
 * ALL PRODUCTS LIST
 * Product cards with actions
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, Eye, Edit, Power, Copy, Monitor, 
  Search, Filter, Plus, MoreHorizontal 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const mockProducts = [
  { id: '1', name: 'School ERP Pro', category: 'Education', type: 'Software', lifetimePrice: 49999, yearlyPrice: 19999, demoStatus: 'active', technologies: ['React', 'Node.js', 'PostgreSQL'] },
  { id: '2', name: 'Hospital Management', category: 'Healthcare', type: 'Software', lifetimePrice: 89999, yearlyPrice: 34999, demoStatus: 'active', technologies: ['React', 'Python', 'MongoDB'] },
  { id: '3', name: 'Restaurant POS', category: 'Retail', type: 'Software', lifetimePrice: 29999, yearlyPrice: 12999, demoStatus: 'expired', technologies: ['Vue.js', 'Node.js', 'MySQL'] },
  { id: '4', name: 'Real Estate CRM', category: 'Real Estate', type: 'Software', lifetimePrice: 59999, yearlyPrice: 24999, demoStatus: 'active', technologies: ['React', 'Django', 'PostgreSQL'] },
  { id: '5', name: 'Gym Management', category: 'Fitness', type: 'Software', lifetimePrice: 24999, yearlyPrice: 9999, demoStatus: 'pending', technologies: ['React Native', 'Firebase'] },
];

export const AllProducts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    description: '',
    features: '',
    technology: '',
    pricing: 'lifetime',
    status: 'active',
  });

  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.category) {
      toast.error('Product name and category are required');
      return;
    }
    toast.success(`Product "${newProduct.name}" saved successfully!`);
    setShowCreateDialog(false);
    setNewProduct({ name: '', category: '', description: '', features: '', technology: '', pricing: 'lifetime', status: 'active' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Package className="w-5 h-5 text-violet-400" />
            All Products
          </h1>
          <p className="text-sm text-muted-foreground">Manage your product catalog</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input 
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={newProduct.category} onValueChange={(v) => setNewProduct({ ...newProduct, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="realestate">Real Estate</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Short Description</Label>
                <Textarea 
                  placeholder="Brief product description..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Key Features (bullet points)</Label>
                <Textarea 
                  placeholder="• Feature 1&#10;• Feature 2&#10;• Feature 3"
                  value={newProduct.features}
                  onChange={(e) => setNewProduct({ ...newProduct, features: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Technology</Label>
                  <Select value={newProduct.technology} onValueChange={(v) => setNewProduct({ ...newProduct, technology: v })}>
                    <SelectTrigger><SelectValue placeholder="Select tech" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="vue">Vue.js</SelectItem>
                      <SelectItem value="angular">Angular</SelectItem>
                      <SelectItem value="mobile">React Native</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Pricing Model</Label>
                  <Select value={newProduct.pricing} onValueChange={(v) => setNewProduct({ ...newProduct, pricing: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lifetime">Lifetime</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={newProduct.status} onValueChange={(v) => setNewProduct({ ...newProduct, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSaveProduct} className="w-full bg-violet-600 hover:bg-violet-700">
                Save Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProducts.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="bg-card/80 border-border/50 hover:border-violet-500/30 transition-all group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.category} • {product.type}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> View</DropdownMenuItem>
                      <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem><Power className="w-4 h-4 mr-2" /> Disable</DropdownMenuItem>
                      <DropdownMenuItem><Monitor className="w-4 h-4 mr-2" /> Create Demo</DropdownMenuItem>
                      <DropdownMenuItem><Copy className="w-4 h-4 mr-2" /> Clone Product</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={product.demoStatus === 'active' ? 'default' : product.demoStatus === 'expired' ? 'destructive' : 'secondary'}>
                    Demo: {product.demoStatus}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Lifetime</p>
                    <p className="font-semibold text-foreground">₹{product.lifetimePrice.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Yearly</p>
                    <p className="font-semibold text-foreground">₹{product.yearlyPrice.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {product.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-[10px]">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
