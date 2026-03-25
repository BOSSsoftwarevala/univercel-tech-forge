import React, { useState } from 'react';
import { 
  ShoppingCart, Package, Search, Heart, User, 
  Minus, Plus, Star, Truck, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import softwareValaLogo from '@/assets/software-vala-logo.jpg';

// Sample products
const products = [
  { id: 1, name: 'Wireless Earbuds', price: 2499, mrp: 3999, image: '🎧', rating: 4.5, reviews: 234 },
  { id: 2, name: 'Smart Watch', price: 4999, mrp: 7999, image: '⌚', rating: 4.3, reviews: 189 },
  { id: 3, name: 'Bluetooth Speaker', price: 1999, mrp: 2999, image: '🔊', rating: 4.7, reviews: 456 },
  { id: 4, name: 'Power Bank 20000mAh', price: 1499, mrp: 2499, image: '🔋', rating: 4.4, reviews: 312 },
  { id: 5, name: 'USB C Cable', price: 299, mrp: 499, image: '🔌', rating: 4.2, reviews: 567 },
  { id: 6, name: 'Laptop Stand', price: 1299, mrp: 1999, image: '💻', rating: 4.6, reviews: 123 },
  { id: 7, name: 'Wireless Mouse', price: 799, mrp: 1299, image: '🖱️', rating: 4.1, reviews: 289 },
  { id: 8, name: 'LED Desk Lamp', price: 899, mrp: 1499, image: '💡', rating: 4.5, reviews: 178 },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const EcommerceStoreDemo = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const addToCart = (product: typeof products[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = i.quantity + delta;
        return newQty > 0 ? { ...i, quantity: newQty } : i;
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={softwareValaLogo} alt="Software Vala" className="w-10 h-10 rounded-full" />
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg">E-Store</h1>
                <p className="text-xs text-muted-foreground">Powered by Software Vala</p>
              </div>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowCart(!showCart)}>
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <Badge className="h-5 w-5 p-0 flex items-center justify-center">{cartCount}</Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">All Products</h2>
              <Badge variant="outline">{filteredProducts.length} items</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden group">
                  <div className="aspect-square bg-muted flex items-center justify-center text-5xl">
                    {product.image}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm truncate">{product.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs">{product.rating}</span>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold">₹{product.price.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground line-through">₹{product.mrp}</span>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round((1 - product.price / product.mrp) * 100)}% off
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-2 gap-1"
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          {showCart && (
            <div className="w-80 shrink-0">
              <Card className="sticky top-20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Cart ({cartCount})</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowCart(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {cart.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Your cart is empty
                    </p>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-80 overflow-auto">
                        {cart.map(item => (
                          <div key={item.id} className="flex items-center gap-3 py-2 border-b">
                            <div className="text-2xl">{item.image}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">₹{item.price}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-5 text-center text-sm">{item.quantity}</span>
                              <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-3 mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                          <span className="flex items-center gap-1">
                            <Truck className="w-3 h-3" /> Delivery
                          </span>
                          <span>FREE</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <Button className="w-full mt-2">
                          Checkout
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-4 mt-8">
        <p className="text-center text-xs text-muted-foreground">
          Powered by <span className="font-medium">Software Vala</span> • The Name of Trust
        </p>
      </footer>
    </div>
  );
};

export default EcommerceStoreDemo;
