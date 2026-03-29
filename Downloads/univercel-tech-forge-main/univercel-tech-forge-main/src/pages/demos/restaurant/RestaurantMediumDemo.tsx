/**
 * Restaurant POS - Medium Scale (10-30 Tables, Multiple Counters)
 * For: Family Restaurants, Cafes, Multi-cuisine
 */

import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, ShoppingBag, Users, Receipt, Clock, 
  ChefHat, Plus, Minus, CreditCard, Printer, 
  ArrowLeft, Wallet, QrCode, Bell, Package, BarChart3,
  UserCheck, Timer, Flame, Coffee, Pizza
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Menu categories
const categories = ['All', 'Starters', 'Main Course', 'Breads', 'Drinks', 'Desserts'];

const menuItems = [
  { id: 1, name: 'Paneer Tikka', price: 280, category: 'Starters', image: '🧀', time: 15 },
  { id: 2, name: 'Chicken Tikka', price: 320, category: 'Starters', image: '🍗', time: 18 },
  { id: 3, name: 'Butter Chicken', price: 380, category: 'Main Course', image: '🍛', time: 20 },
  { id: 4, name: 'Dal Makhani', price: 220, category: 'Main Course', image: '🥘', time: 15 },
  { id: 5, name: 'Biryani', price: 350, category: 'Main Course', image: '🍚', time: 25 },
  { id: 6, name: 'Kadhai Paneer', price: 280, category: 'Main Course', image: '🍲', time: 18 },
  { id: 7, name: 'Butter Naan', price: 50, category: 'Breads', image: '🫓', time: 5 },
  { id: 8, name: 'Garlic Naan', price: 60, category: 'Breads', image: '🧄', time: 5 },
  { id: 9, name: 'Lassi', price: 80, category: 'Drinks', image: '🥛', time: 3 },
  { id: 10, name: 'Fresh Lime', price: 60, category: 'Drinks', image: '🍋', time: 2 },
  { id: 11, name: 'Gulab Jamun', price: 80, category: 'Desserts', image: '🍩', time: 5 },
  { id: 12, name: 'Ice Cream', price: 100, category: 'Desserts', image: '🍨', time: 3 },
];

const tables = [
  { id: 1, name: 'T1', status: 'occupied', guests: 4, waiter: 'Rahul', orderTotal: 890 },
  { id: 2, name: 'T2', status: 'available', guests: 0, waiter: null, orderTotal: 0 },
  { id: 3, name: 'T3', status: 'occupied', guests: 2, waiter: 'Priya', orderTotal: 540 },
  { id: 4, name: 'T4', status: 'reserved', guests: 6, waiter: null, orderTotal: 0 },
  { id: 5, name: 'T5', status: 'available', guests: 0, waiter: null, orderTotal: 0 },
  { id: 6, name: 'T6', status: 'occupied', guests: 8, waiter: 'Amit', orderTotal: 1850 },
  { id: 7, name: 'T7', status: 'occupied', guests: 3, waiter: 'Rahul', orderTotal: 720 },
  { id: 8, name: 'T8', status: 'available', guests: 0, waiter: null, orderTotal: 0 },
  { id: 9, name: 'T9', status: 'billing', guests: 4, waiter: 'Priya', orderTotal: 1200 },
  { id: 10, name: 'T10', status: 'available', guests: 0, waiter: null, orderTotal: 0 },
  { id: 11, name: 'T11', status: 'occupied', guests: 2, waiter: 'Amit', orderTotal: 480 },
  { id: 12, name: 'T12', status: 'reserved', guests: 4, waiter: null, orderTotal: 0 },
];

const kitchenOrders = [
  { id: 'K001', table: 'T1', items: ['2x Butter Chicken', '4x Naan', '1x Dal Makhani'], time: 8, status: 'cooking' },
  { id: 'K002', table: 'T3', items: ['1x Paneer Tikka', '2x Lassi'], time: 3, status: 'ready' },
  { id: 'K003', table: 'T6', items: ['3x Biryani', '2x Raita'], time: 12, status: 'cooking' },
  { id: 'K004', table: 'T7', items: ['1x Kadhai Paneer', '2x Butter Naan'], time: 5, status: 'new' },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const RestaurantMediumDemo = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState('pos');
  const [selectedTable, setSelectedTable] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addToCart = (item: typeof menuItems[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
    toast.success(`${item.name} added`);
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

  const filteredMenu = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(i => i.category === selectedCategory);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const gst = Math.round(total * 0.05);
  const grandTotal = total + gst;

  const getTableStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-green-500/20 border-green-500 text-green-700';
      case 'occupied': return 'bg-orange-500/20 border-orange-500 text-orange-700';
      case 'reserved': return 'bg-blue-500/20 border-blue-500 text-blue-700';
      case 'billing': return 'bg-purple-500/20 border-purple-500 text-purple-700';
      default: return 'bg-gray-500/20 border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/demos')} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg flex items-center gap-2">
                <Coffee className="w-5 h-5" /> Spice Garden Restaurant
              </h1>
              <p className="text-xs text-amber-200">Medium Scale • 12 Tables • Multi-Counter</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-white/20 text-white hidden sm:flex">
              <UserCheck className="w-3 h-3 mr-1" /> 3 Staff Online
            </Badge>
            <Badge className="bg-white/20 text-white">
              <Clock className="w-3 h-3 mr-1" />
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="pos" className="gap-1">
              <ShoppingBag className="w-4 h-4" /> POS
            </TabsTrigger>
            <TabsTrigger value="tables" className="gap-1">
              <Users className="w-4 h-4" /> Tables
            </TabsTrigger>
            <TabsTrigger value="kitchen" className="gap-1">
              <ChefHat className="w-4 h-4" /> Kitchen
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-1">
              <BarChart3 className="w-4 h-4" /> Reports
            </TabsTrigger>
          </TabsList>

          {/* POS Screen */}
          <TabsContent value="pos">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Menu */}
              <div className="lg:col-span-2 space-y-4">
                {/* Category Filter */}
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex gap-2 pb-2">
                    {categories.map(cat => (
                      <Button 
                        key={cat}
                        variant={selectedCategory === cat ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(cat)}
                        className="shrink-0"
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4" />
                        Menu ({filteredMenu.length} items)
                      </span>
                      <Badge variant="outline">Table {selectedTable}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {filteredMenu.map(item => (
                        <button
                          key={item.id}
                          onClick={() => addToCart(item)}
                          className="p-3 border rounded-xl hover:bg-primary/5 hover:border-primary transition-all text-left group"
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-2xl">{item.image}</span>
                            <Badge variant="secondary" className="text-[10px]">
                              <Timer className="w-2 h-2 mr-1" />{item.time}m
                            </Badge>
                          </div>
                          <div className="font-medium text-sm mt-2 truncate">{item.name}</div>
                          <div className="text-primary font-bold text-sm">₹{item.price}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cart */}
              <div>
                <Card className="sticky top-20">
                  <CardHeader className="pb-2 bg-muted/50 rounded-t-lg">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Receipt className="w-4 h-4" />
                        Order - Table {selectedTable}
                      </span>
                      <Badge>{cart.length} items</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    {cart.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Select items from menu</p>
                      </div>
                    ) : (
                      <>
                        <ScrollArea className="h-48">
                          {cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between gap-2 py-2 border-b">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{item.name}</div>
                                <div className="text-xs text-muted-foreground">₹{item.price}</div>
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
                              <div className="font-medium text-sm w-16 text-right">₹{item.price * item.quantity}</div>
                            </div>
                          ))}
                        </ScrollArea>

                        {/* Bill Summary */}
                        <div className="pt-3 border-t space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>₹{total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">GST (5%)</span>
                            <span>₹{gst}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold pt-2 border-t">
                            <span>Grand Total</span>
                            <span className="text-primary">₹{grandTotal}</span>
                          </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 gap-1">
                            <Wallet className="w-3 h-3" /> Cash
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 gap-1">
                            <CreditCard className="w-3 h-3" /> Card
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 gap-1">
                            <QrCode className="w-3 h-3" /> UPI
                          </Button>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" onClick={() => setCart([])}>Clear</Button>
                          <Button className="bg-green-600 hover:bg-green-700">
                            <Bell className="w-4 h-4 mr-1" /> Send to Kitchen
                          </Button>
                        </div>
                        <Button variant="outline" className="w-full gap-1">
                          <Printer className="w-4 h-4" /> Print KOT
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tables View */}
          <TabsContent value="tables">
            <div className="space-y-4">
              {/* Legend */}
              <div className="flex flex-wrap gap-3 text-sm">
                <Badge variant="outline" className="bg-green-500/20 border-green-500">Available</Badge>
                <Badge variant="outline" className="bg-orange-500/20 border-orange-500">Occupied</Badge>
                <Badge variant="outline" className="bg-blue-500/20 border-blue-500">Reserved</Badge>
                <Badge variant="outline" className="bg-purple-500/20 border-purple-500">Billing</Badge>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Floor Layout - 12 Tables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {tables.map(table => (
                      <button
                        key={table.id}
                        onClick={() => {
                          setSelectedTable(table.id);
                          setActiveTab('pos');
                        }}
                        className={`p-4 border-2 rounded-xl text-center transition-all hover:scale-105 ${getTableStatusColor(table.status)} ${selectedTable === table.id ? 'ring-2 ring-primary' : ''}`}
                      >
                        <div className="font-bold text-lg">{table.name}</div>
                        <div className="text-xs capitalize">{table.status}</div>
                        {table.guests > 0 && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            <Users className="w-2 h-2 mr-1" />{table.guests}
                          </Badge>
                        )}
                        {table.orderTotal > 0 && (
                          <div className="text-xs font-medium mt-1">₹{table.orderTotal}</div>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Kitchen Display */}
          <TabsContent value="kitchen">
            <Card>
              <CardHeader className="pb-2 bg-red-500/10">
                <CardTitle className="text-base flex items-center gap-2 text-red-700">
                  <Flame className="w-4 h-4" />
                  Kitchen Display System (KDS)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {kitchenOrders.map(order => (
                    <Card 
                      key={order.id} 
                      className={`border-2 ${
                        order.status === 'new' ? 'border-blue-500 bg-blue-500/5' :
                        order.status === 'cooking' ? 'border-orange-500 bg-orange-500/5' :
                        'border-green-500 bg-green-500/5'
                      }`}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline">{order.table}</Badge>
                          <Badge className={
                            order.status === 'new' ? 'bg-blue-500' :
                            order.status === 'cooking' ? 'bg-orange-500' :
                            'bg-green-500'
                          }>
                            {order.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Timer className="w-3 h-3" />
                          {order.time} min
                          <Progress value={(20 - order.time) / 20 * 100} className="flex-1 h-2" />
                        </div>
                        <ul className="space-y-1 text-sm">
                          {order.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Package className="w-3 h-3 text-muted-foreground" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <Button 
                          size="sm" 
                          className={`w-full mt-4 ${order.status === 'ready' ? 'bg-green-600' : ''}`}
                        >
                          {order.status === 'new' ? 'Start Cooking' :
                           order.status === 'cooking' ? 'Mark Ready' :
                           'Served ✓'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30">
                <CardContent className="pt-4 text-center">
                  <div className="text-3xl font-bold text-green-700">₹18,450</div>
                  <div className="text-sm text-green-600">Today's Revenue</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30">
                <CardContent className="pt-4 text-center">
                  <div className="text-3xl font-bold text-blue-700">47</div>
                  <div className="text-sm text-blue-600">Orders Completed</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30">
                <CardContent className="pt-4 text-center">
                  <div className="text-3xl font-bold text-purple-700">₹392</div>
                  <div className="text-sm text-purple-600">Avg Order Value</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/30">
                <CardContent className="pt-4 text-center">
                  <div className="text-3xl font-bold text-amber-700">18 min</div>
                  <div className="text-sm text-amber-600">Avg Prep Time</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Selling Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Butter Chicken', qty: 23, revenue: 8740 },
                    { name: 'Biryani', qty: 18, revenue: 6300 },
                    { name: 'Paneer Tikka', qty: 15, revenue: 4200 },
                    { name: 'Dal Makhani', qty: 12, revenue: 2640 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{item.revenue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{item.qty} orders</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t py-4 mt-8">
        <p className="text-center text-xs text-muted-foreground">
          <span className="font-medium text-primary">Medium Scale POS</span> • Complete Restaurant Management
        </p>
      </footer>
    </div>
  );
};

export default RestaurantMediumDemo;
