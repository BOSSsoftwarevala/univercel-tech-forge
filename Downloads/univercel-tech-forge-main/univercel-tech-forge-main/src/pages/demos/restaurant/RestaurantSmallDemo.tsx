/**
 * Restaurant POS - Small Scale (1-5 Tables, 1 Counter)
 * For: Small Dhabas, Food Stalls, Cafeterias
 */

import React, { useState } from 'react';
import { 
  UtensilsCrossed, ShoppingBag, Receipt, Clock, 
  Plus, Minus, CreditCard, Printer, Smartphone,
  ArrowLeft, Wallet, QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Small menu for dhaba/stall
const menuItems = [
  { id: 1, name: 'Chai', price: 15, category: 'Drinks', image: '☕' },
  { id: 2, name: 'Samosa', price: 20, category: 'Snacks', image: '🥟' },
  { id: 3, name: 'Paratha', price: 40, category: 'Main', image: '🫓' },
  { id: 4, name: 'Dal Fry', price: 60, category: 'Main', image: '🥘' },
  { id: 5, name: 'Rice', price: 30, category: 'Main', image: '🍚' },
  { id: 6, name: 'Lassi', price: 35, category: 'Drinks', image: '🥛' },
  { id: 7, name: 'Pakora', price: 25, category: 'Snacks', image: '🍘' },
  { id: 8, name: 'Thali', price: 80, category: 'Main', image: '🍛' },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const RestaurantSmallDemo = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | null>(null);

  const addToCart = (item: typeof menuItems[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
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

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handlePayment = () => {
    if (!paymentMethod) {
      toast.error('Payment method select karein');
      return;
    }
    toast.success(`₹${total} - Payment successful via ${paymentMethod.toUpperCase()}!`);
    setCart([]);
    setPaymentMethod(null);
    setCustomerPhone('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-orange-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/demos')} className="text-white hover:bg-orange-700">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">🍛 Shree Dhaba POS</h1>
              <p className="text-xs text-orange-200">Small Scale • Counter Billing</p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white">
            <Clock className="w-3 h-3 mr-1" />
            {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Menu Grid */}
          <div className="lg:col-span-2">
            <Card className="border-orange-200 dark:border-orange-900">
              <CardHeader className="pb-2 bg-orange-100 dark:bg-orange-900/30 rounded-t-lg">
                <CardTitle className="text-base flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <UtensilsCrossed className="w-4 h-4" />
                  Quick Menu • Tap to Add
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {menuItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className="p-4 border-2 border-orange-200 dark:border-orange-800 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:border-orange-400 transition-all text-center group"
                    >
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{item.image}</div>
                      <div className="font-semibold text-sm">{item.name}</div>
                      <div className="text-orange-600 font-bold">₹{item.price}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Summary */}
            <Card className="mt-4 border-green-200 dark:border-green-900">
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">₹2,450</div>
                    <div className="text-xs text-green-600">Today's Sale</div>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">23</div>
                    <div className="text-xs text-blue-600">Orders</div>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">₹106</div>
                    <div className="text-xs text-purple-600">Avg Order</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bill Panel */}
          <div>
            <Card className="border-orange-200 dark:border-orange-900 sticky top-20">
              <CardHeader className="pb-2 bg-orange-100 dark:bg-orange-900/30 rounded-t-lg">
                <CardTitle className="text-base flex items-center justify-between text-orange-800 dark:text-orange-200">
                  <span className="flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    Current Bill
                  </span>
                  <Badge variant="secondary">{cart.length} items</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Menu se item tap karein</p>
                  </div>
                ) : (
                  <>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between gap-2 py-2 border-b">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-muted-foreground">₹{item.price} × {item.quantity}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                            <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="font-semibold text-sm w-14 text-right">₹{item.price * item.quantity}</div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="pt-3 border-t-2 border-dashed">
                      <div className="flex justify-between text-xl font-bold text-orange-700">
                        <span>Total</span>
                        <span>₹{total}</span>
                      </div>
                    </div>

                    {/* Customer Phone */}
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Customer Phone (optional)" 
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    {/* Payment Methods */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('cash')}
                        className="gap-1"
                      >
                        <Wallet className="w-4 h-4" /> Cash
                      </Button>
                      <Button 
                        variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('upi')}
                        className="gap-1"
                      >
                        <QrCode className="w-4 h-4" /> UPI
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => setCart([])}>Clear</Button>
                      <Button 
                        className="bg-green-600 hover:bg-green-700 gap-1"
                        onClick={handlePayment}
                        disabled={cart.length === 0}
                      >
                        <CreditCard className="w-4 h-4" />
                        Pay ₹{total}
                      </Button>
                    </div>

                    <Button variant="outline" className="w-full gap-1">
                      <Printer className="w-4 h-4" /> Print Bill
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-4 mt-8 bg-white/50 dark:bg-gray-800/50">
        <p className="text-center text-xs text-muted-foreground">
          <span className="font-medium text-orange-600">Small Scale POS</span> • Perfect for Dhabas & Food Stalls
        </p>
      </footer>
    </div>
  );
};

export default RestaurantSmallDemo;
