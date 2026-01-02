import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  X,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  MessageSquare,
  Printer,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

const menuCategories = [
  { id: 'starters', name: 'Starters', icon: '🥗' },
  { id: 'main', name: 'Main Course', icon: '🍛' },
  { id: 'rice', name: 'Rice & Biryani', icon: '🍚' },
  { id: 'breads', name: 'Breads', icon: '🫓' },
  { id: 'drinks', name: 'Beverages', icon: '🥤' },
  { id: 'desserts', name: 'Desserts', icon: '🍨' },
];

const menuItems = {
  starters: [
    { id: '1', name: 'Paneer Tikka', price: 280, veg: true },
    { id: '2', name: 'Chicken Tikka', price: 320, veg: false },
    { id: '3', name: 'Veg Spring Roll', price: 180, veg: true },
    { id: '4', name: 'Fish Fry', price: 350, veg: false },
  ],
  main: [
    { id: '5', name: 'Butter Chicken', price: 380, veg: false },
    { id: '6', name: 'Dal Makhani', price: 280, veg: true },
    { id: '7', name: 'Paneer Butter Masala', price: 320, veg: true },
    { id: '8', name: 'Mutton Rogan Josh', price: 450, veg: false },
  ],
  rice: [
    { id: '9', name: 'Veg Biryani', price: 280, veg: true },
    { id: '10', name: 'Chicken Biryani', price: 350, veg: false },
    { id: '11', name: 'Mutton Biryani', price: 420, veg: false },
    { id: '12', name: 'Jeera Rice', price: 150, veg: true },
  ],
  breads: [
    { id: '13', name: 'Butter Naan', price: 60, veg: true },
    { id: '14', name: 'Garlic Naan', price: 70, veg: true },
    { id: '15', name: 'Tandoori Roti', price: 40, veg: true },
    { id: '16', name: 'Laccha Paratha', price: 80, veg: true },
  ],
  drinks: [
    { id: '17', name: 'Masala Chai', price: 50, veg: true },
    { id: '18', name: 'Fresh Lime Soda', price: 80, veg: true },
    { id: '19', name: 'Mango Lassi', price: 120, veg: true },
    { id: '20', name: 'Cold Coffee', price: 150, veg: true },
  ],
  desserts: [
    { id: '21', name: 'Gulab Jamun', price: 100, veg: true },
    { id: '22', name: 'Rasmalai', price: 120, veg: true },
    { id: '23', name: 'Ice Cream', price: 150, veg: true },
    { id: '24', name: 'Kulfi', price: 100, veg: true },
  ],
};

const tables = [
  { id: 'T1', name: 'Table 1', seats: 2, status: 'available' },
  { id: 'T2', name: 'Table 2', seats: 4, status: 'occupied' },
  { id: 'T3', name: 'Table 3', seats: 4, status: 'available' },
  { id: 'T4', name: 'Table 4', seats: 6, status: 'reserved' },
  { id: 'T5', name: 'Table 5', seats: 2, status: 'available' },
  { id: 'T6', name: 'Table 6', seats: 8, status: 'available' },
];

export const RestaurantPOSScreen: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('starters');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [noteItem, setNoteItem] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const addToOrder = (item: typeof menuItems.starters[0]) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setOrderItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeItem = (id: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
  };

  const addNote = (id: string) => {
    const item = orderItems.find(i => i.id === id);
    if (item) {
      setOrderItems(prev => prev.map(i => i.id === id ? { ...i, notes: noteText } : i));
      setNoteItem(null);
      setNoteText('');
    }
  };

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const serviceCharge = orderType === 'dine-in' ? subtotal * 0.10 : 0;
  const total = subtotal + tax + serviceCharge;

  const clearOrder = () => {
    setOrderItems([]);
    setSelectedTable(null);
    setShowPayment(false);
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Menu */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setOrderType('dine-in')}
              className={cn(
                "px-5 py-3 rounded-xl font-medium flex items-center gap-2 transition-all",
                orderType === 'dine-in' 
                  ? "bg-orange-500 text-white" 
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              )}
            >
              <Users className="w-4 h-4" />
              Dine In
            </button>
            <button
              onClick={() => setOrderType('takeaway')}
              className={cn(
                "px-5 py-3 rounded-xl font-medium flex items-center gap-2 transition-all",
                orderType === 'takeaway' 
                  ? "bg-orange-500 text-white" 
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              )}
            >
              <ShoppingBag className="w-4 h-4" />
              Takeaway
            </button>
          </div>

          {orderType === 'dine-in' && (
            <div className="flex gap-2">
              {tables.filter(t => t.status === 'available').map(table => (
                <button
                  key={table.id}
                  onClick={() => setSelectedTable(table.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    selectedTable === table.id 
                      ? "bg-green-500 text-white" 
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  )}
                >
                  {table.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {menuCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-5 py-3 rounded-xl font-medium whitespace-nowrap flex items-center gap-2 transition-all",
                  activeCategory === cat.id 
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" 
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                )}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-4 gap-3">
            {menuItems[activeCategory as keyof typeof menuItems]?.map((item) => (
              <button
                key={item.id}
                onClick={() => addToOrder(item)}
                className="bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-orange-500/50 rounded-xl p-4 text-left transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={cn(
                    "w-4 h-4 rounded-sm border-2 flex items-center justify-center text-xs",
                    item.veg ? "border-green-500 text-green-500" : "border-red-500 text-red-500"
                  )}>
                    ●
                  </span>
                  <Plus className="w-5 h-5 text-zinc-600 group-hover:text-orange-500 transition-colors" />
                </div>
                <h3 className="font-medium text-white mb-1">{item.name}</h3>
                <p className="text-orange-400 font-bold">₹{item.price}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Order */}
      <div className="w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col">
        {/* Order Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Current Order</h2>
              <p className="text-sm text-zinc-500">
                {orderType === 'dine-in' && selectedTable 
                  ? `Table ${selectedTable.replace('T', '')}` 
                  : orderType === 'takeaway' 
                    ? 'Takeaway Order' 
                    : 'Select Table'}
              </p>
            </div>
            {orderItems.length > 0 && (
              <button onClick={clearOrder} className="text-red-400 hover:text-red-300 text-sm">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="flex-1 overflow-auto p-4">
          {orderItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600">
              <UtensilsCrossed className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">No items added</p>
              <p className="text-sm">Select items from menu</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orderItems.map((item) => (
                <div key={item.id} className="bg-zinc-800/50 rounded-xl p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{item.name}</h4>
                      <p className="text-sm text-zinc-500">₹{item.price} each</p>
                      {item.notes && (
                        <p className="text-xs text-orange-400 mt-1">📝 {item.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setNoteItem(item.id);
                          setNoteText(item.notes || '');
                        }}
                        className="p-1.5 text-zinc-500 hover:text-orange-400"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeItem(item.id)} className="p-1.5 text-zinc-500 hover:text-red-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {noteItem === item.id && (
                    <div className="flex gap-2 mb-2">
                      <Input
                        placeholder="Less spicy, no onion..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="h-9 bg-zinc-900 border-zinc-700 text-sm"
                      />
                      <Button size="sm" onClick={() => addNote(item.id)} className="bg-orange-500 hover:bg-orange-600">
                        Add
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center hover:bg-zinc-600"
                      >
                        <Minus className="w-4 h-4 text-white" />
                      </button>
                      <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center hover:bg-zinc-600"
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <span className="font-bold text-white">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/80">
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>GST (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            {orderType === 'dine-in' && (
              <div className="flex justify-between text-zinc-400">
                <span>Service (10%)</span>
                <span>₹{serviceCharge.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-zinc-700">
              <span>Total</span>
              <span className="text-orange-400">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {!showPayment ? (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-14 border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-xl"
                disabled={orderItems.length === 0}
              >
                <Printer className="w-5 h-5 mr-2" />
                KOT
              </Button>
              <Button
                className="h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl"
                disabled={orderItems.length === 0 || (orderType === 'dine-in' && !selectedTable)}
                onClick={() => setShowPayment(true)}
              >
                Pay ₹{total.toFixed(0)}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-xl">
                <Banknote className="w-5 h-5 mr-2" />
                Cash
              </Button>
              <Button className="w-full h-12 bg-purple-600 hover:bg-purple-700 rounded-xl">
                <Smartphone className="w-5 h-5 mr-2" />
                UPI
              </Button>
              <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-xl">
                <CreditCard className="w-5 h-5 mr-2" />
                Card
              </Button>
              <Button variant="outline" className="w-full h-10 rounded-xl border-zinc-700" onClick={() => setShowPayment(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
