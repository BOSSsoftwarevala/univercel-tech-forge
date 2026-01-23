/**
 * FRANCHISE OWNER MARKETPLACE SCREEN
 * Product listing with buy/order functionality
 * 30% franchise discount auto-applied
 * ALL ACTIONS LOGGED TO BOSS PANEL
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Filter, Eye, ShoppingCart, Star, Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useFranchiseActionLogger } from '@/hooks/useFranchiseActionLogger';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  commission: number;
  category: string;
  features: string[];
}

const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'E-Commerce Pro', 
    description: 'Full-featured e-commerce platform with payment integration', 
    price: 45000, 
    commission: 25,
    category: 'E-Commerce',
    features: ['Payment Gateway', 'Inventory', 'Analytics']
  },
  { 
    id: '2', 
    name: 'CRM Enterprise', 
    description: 'Customer relationship management system', 
    price: 35000, 
    commission: 20,
    category: 'CRM',
    features: ['Lead Management', 'Reports', 'Email Integration']
  },
  { 
    id: '3', 
    name: 'ERP Solution', 
    description: 'Enterprise resource planning for businesses', 
    price: 75000, 
    commission: 30,
    category: 'ERP',
    features: ['Accounting', 'HR Module', 'Inventory']
  },
  { 
    id: '4', 
    name: 'Mobile App Builder', 
    description: 'Build custom mobile apps without coding', 
    price: 55000, 
    commission: 22,
    category: 'Mobile',
    features: ['iOS & Android', 'Push Notifications', 'Analytics']
  },
  { 
    id: '5', 
    name: 'Restaurant POS', 
    description: 'Point of sale system for restaurants', 
    price: 28000, 
    commission: 18,
    category: 'POS',
    features: ['Order Management', 'Kitchen Display', 'Reports']
  },
  { 
    id: '6', 
    name: 'School Management', 
    description: 'Complete school management system', 
    price: 42000, 
    commission: 20,
    category: 'Education',
    features: ['Student Portal', 'Fee Management', 'Attendance']
  },
];

export function FOMarketplaceScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const { logPlaceOrder, logAction, logLegalAcceptance } = useFranchiseActionLogger();

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = async (product: Product) => {
    setSelectedProduct(product);
    // Log view action
    await logAction({
      action: 'view_product',
      module: 'fo_marketplace',
      targetId: product.id,
      targetName: product.name,
      riskLevel: 'low',
      details: { category: product.category }
    });
  };

  const handlePlaceOrder = (product: Product) => {
    setSelectedProduct(product);
    setShowOrderDialog(true);
  };

  const handleSubmitOrder = async () => {
    if (!legalAccepted) {
      toast.error('Please accept the legal terms to proceed');
      return;
    }
    
    if (selectedProduct) {
      // Log legal acceptance first
      await logLegalAcceptance('Order Terms & Conditions');
      
      // Log order placement - THIS WILL APPEAR ON BOSS PANEL
      await logPlaceOrder(
        selectedProduct.name, 
        selectedProduct.id, 
        getDiscountedPrice(selectedProduct.price)
      );
      
      toast.success(`Order placed for ${selectedProduct.name}. Pending approval.`);
    }
    
    setShowOrderDialog(false);
    setSelectedProduct(null);
    setLegalAccepted(false);
  };

  const getDiscountedPrice = (price: number) => {
    return price * 0.7; // 30% discount
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            Marketplace
          </h1>
          <p className="text-muted-foreground text-sm">Software Vala Products • 30% Franchise Discount</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="bg-card border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <Badge variant="secondary" className="text-[10px] mt-1">{product.category}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              
              {/* Features */}
              <div className="flex flex-wrap gap-1">
                {product.features.map((f, i) => (
                  <Badge key={i} variant="outline" className="text-[10px]">{f}</Badge>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">₹{getDiscountedPrice(product.price).toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">30% OFF</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Commission: {product.commission}%</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewDetails(product)}
                >
                  <Eye className="h-3.5 w-3.5 mr-1.5" />
                  View
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handlePlaceOrder(product)}
                >
                  <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Place Order - {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Product Info */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedProduct?.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedProduct?.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      ₹{selectedProduct ? getDiscountedPrice(selectedProduct.price).toLocaleString() : 0}
                    </p>
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">30% Discount Applied</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Domain/Hosting */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Domain URL</Label>
                <Input placeholder="example.com" />
              </div>
              <div className="space-y-2">
                <Label>Hosting Provider</Label>
                <Input placeholder="AWS, GoDaddy, etc." />
              </div>
              <div className="space-y-2">
                <Label>Hosting ID (Masked)</Label>
                <Input placeholder="Login ID" />
              </div>
              <div className="space-y-2">
                <Label>Hosting Password (Encrypted)</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <Label>Special Instructions (Max 100 words)</Label>
              <Textarea placeholder="Enter any special requirements..." rows={3} />
            </div>

            {/* Legal Checkbox */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
              <Checkbox 
                id="legal" 
                checked={legalAccepted}
                onCheckedChange={(checked) => setLegalAccepted(checked as boolean)}
              />
              <Label htmlFor="legal" className="text-sm cursor-pointer">
                I accept the Terms & Conditions, Privacy Policy, and agree to the order terms
              </Label>
            </div>

            {/* Submit */}
            <Button className="w-full" onClick={handleSubmitOrder} disabled={!legalAccepted}>
              Place Order → Pending Approval
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!selectedProduct && !showOrderDialog} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">{selectedProduct?.description}</p>
            <div className="flex flex-wrap gap-2">
              {selectedProduct?.features.map((f, i) => (
                <Badge key={i} variant="outline">{f}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">
                ₹{selectedProduct ? getDiscountedPrice(selectedProduct.price).toLocaleString() : 0}
              </span>
              <span className="text-muted-foreground line-through">
                ₹{selectedProduct?.price.toLocaleString()}
              </span>
            </div>
            <Button className="w-full" onClick={() => {
              setShowOrderDialog(true);
            }}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Proceed to Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
