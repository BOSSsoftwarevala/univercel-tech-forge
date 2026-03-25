import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote,
  Smartphone,
  Barcode,
  Package,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  barcode: string;
}

const sampleProducts = [
  { id: '1', name: 'Rice (1kg)', price: 55, barcode: '8901234567890', category: 'Grocery' },
  { id: '2', name: 'Cooking Oil (1L)', price: 140, barcode: '8901234567891', category: 'Grocery' },
  { id: '3', name: 'Sugar (1kg)', price: 45, barcode: '8901234567892', category: 'Grocery' },
  { id: '4', name: 'Tea (250g)', price: 120, barcode: '8901234567893', category: 'Beverages' },
  { id: '5', name: 'Milk (500ml)', price: 28, barcode: '8901234567894', category: 'Dairy' },
  { id: '6', name: 'Bread', price: 35, barcode: '8901234567895', category: 'Bakery' },
  { id: '7', name: 'Eggs (12pc)', price: 84, barcode: '8901234567896', category: 'Dairy' },
  { id: '8', name: 'Butter (100g)', price: 55, barcode: '8901234567897', category: 'Dairy' },
];

export const POSScreen: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showPayment, setShowPayment] = useState(false);

  const taxRate = 0.05; // 5% GST

  const filteredProducts = sampleProducts.filter(
    p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.barcode.includes(searchQuery)
  );

  const addToCart = (product: typeof sampleProducts[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount - discount;

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setShowPayment(false);
  };

  return (
    <div className="flex h-full">
      {/* Products Grid */}
      <div className="flex-1 p-6">
        {/* Search Bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by product name or scan barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-white border-slate-200 rounded-xl"
            />
          </div>
          <Button size="lg" className="h-14 px-6 bg-slate-700 hover:bg-slate-800 rounded-xl">
            <Barcode className="w-5 h-5 mr-2" />
            Scan
          </Button>
        </div>

        {/* Quick Products Grid */}
        <div className="grid grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white p-5 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all text-left"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                <Package className="w-6 h-6 text-slate-500" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{product.name}</h3>
              <p className="text-emerald-600 font-bold text-lg">₹{product.price}</p>
              <p className="text-xs text-slate-400 mt-1">{product.barcode}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col">
        {/* Cart Header */}
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Current Order</h2>
            {cart.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-red-500 hover:text-red-600">
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto p-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <ShoppingCart className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">Cart is empty</p>
              <p className="text-sm">Add products to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-slate-800">{item.name}</h4>
                      <p className="text-sm text-slate-500">₹{item.price} each</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="font-bold text-slate-800">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50">
          {/* Totals */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (5%)</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-slate-800 pt-2 border-t border-slate-300">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Discount Input */}
          <div className="flex gap-2 mb-4">
            <Input
              type="number"
              placeholder="Discount ₹"
              value={discount || ''}
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              className="h-12 rounded-xl"
            />
          </div>

          {/* Payment Buttons */}
          {!showPayment ? (
            <Button
              className="w-full h-16 text-xl font-bold bg-emerald-500 hover:bg-emerald-600 rounded-xl"
              disabled={cart.length === 0}
              onClick={() => setShowPayment(true)}
            >
              Pay ₹{total.toFixed(2)}
            </Button>
          ) : (
            <div className="space-y-3">
              <Button className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700 rounded-xl">
                <Banknote className="w-6 h-6 mr-3" />
                Cash Payment
              </Button>
              <Button className="w-full h-14 text-lg font-semibold bg-purple-600 hover:bg-purple-700 rounded-xl">
                <Smartphone className="w-6 h-6 mr-3" />
                UPI Payment
              </Button>
              <Button className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl">
                <CreditCard className="w-6 h-6 mr-3" />
                Card Payment
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl"
                onClick={() => setShowPayment(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ShoppingCart = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
