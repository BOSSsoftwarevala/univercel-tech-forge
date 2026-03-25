import React, { useState } from 'react';
import { 
  UtensilsCrossed, ShoppingBag, Users, Receipt, Clock, 
  ChefHat, Plus, Minus, Check, CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import softwareValaLogo from '@/assets/software-vala-logo.jpg';

// Core features only - 5 main functions
const menuItems = [
  { id: 1, name: 'Butter Chicken', price: 320, category: 'Main Course', image: '🍛' },
  { id: 2, name: 'Paneer Tikka', price: 280, category: 'Starters', image: '🧀' },
  { id: 3, name: 'Biryani', price: 350, category: 'Main Course', image: '🍚' },
  { id: 4, name: 'Dal Makhani', price: 220, category: 'Main Course', image: '🥘' },
  { id: 5, name: 'Naan', price: 40, category: 'Breads', image: '🫓' },
  { id: 6, name: 'Lassi', price: 80, category: 'Drinks', image: '🥛' },
];

const tables = [
  { id: 1, name: 'Table 1', status: 'occupied', guests: 4 },
  { id: 2, name: 'Table 2', status: 'available', guests: 0 },
  { id: 3, name: 'Table 3', status: 'occupied', guests: 2 },
  { id: 4, name: 'Table 4', status: 'reserved', guests: 0 },
  { id: 5, name: 'Table 5', status: 'available', guests: 0 },
  { id: 6, name: 'Table 6', status: 'occupied', guests: 6 },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const RestaurantPOSDemo = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState('pos');
  const [selectedTable, setSelectedTable] = useState<number | null>(1);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={softwareValaLogo} alt="Software Vala" className="w-10 h-10 rounded-full" />
            <div>
              <h1 className="font-bold text-lg">Restaurant POS</h1>
              <p className="text-xs text-muted-foreground">Powered by Software Vala</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              {new Date().toLocaleTimeString()}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="pos" className="gap-1">
              <ShoppingBag className="w-4 h-4" /> POS
            </TabsTrigger>
            <TabsTrigger value="tables" className="gap-1">
              <Users className="w-4 h-4" /> Tables
            </TabsTrigger>
            <TabsTrigger value="kitchen" className="gap-1">
              <ChefHat className="w-4 h-4" /> Kitchen
            </TabsTrigger>
          </TabsList>

          {/* POS Screen */}
          <TabsContent value="pos">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Menu */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <UtensilsCrossed className="w-4 h-4" />
                      Menu Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {menuItems.map(item => (
                        <button
                          key={item.id}
                          onClick={() => addToCart(item)}
                          className="p-3 border rounded-lg hover:bg-primary/5 hover:border-primary transition-colors text-left"
                        >
                          <div className="text-2xl mb-1">{item.image}</div>
                          <div className="font-medium text-sm truncate">{item.name}</div>
                          <div className="text-xs text-muted-foreground">₹{item.price}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cart */}
              <div>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Receipt className="w-4 h-4" />
                        Order #{selectedTable}
                      </span>
                      <Badge variant="secondary">{cart.length} items</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {cart.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Tap menu items to add
                      </p>
                    ) : (
                      <>
                        {cart.map(item => (
                          <div key={item.id} className="flex items-center justify-between gap-2 py-2 border-b">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{item.name}</div>
                              <div className="text-xs text-muted-foreground">₹{item.price} each</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}>
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-6 text-center text-sm">{item.quantity}</span>
                              <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}>
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="pt-3 border-t">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>₹{total.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <Button variant="outline" onClick={() => setCart([])}>Clear</Button>
                          <Button className="gap-1">
                            <CreditCard className="w-4 h-4" />
                            Pay
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tables View */}
          <TabsContent value="tables">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Table Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {tables.map(table => (
                    <button
                      key={table.id}
                      onClick={() => setSelectedTable(table.id)}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        selectedTable === table.id ? 'border-primary bg-primary/5' : ''
                      } ${
                        table.status === 'available' ? 'bg-green-500/10 border-green-500/30' :
                        table.status === 'occupied' ? 'bg-orange-500/10 border-orange-500/30' :
                        'bg-blue-500/10 border-blue-500/30'
                      }`}
                    >
                      <div className="font-medium">{table.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{table.status}</div>
                      {table.guests > 0 && (
                        <Badge variant="secondary" className="mt-1 text-xs">{table.guests} guests</Badge>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kitchen Display */}
          <TabsContent value="kitchen">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <ChefHat className="w-4 h-4" />
                  Kitchen Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[1, 3, 6].map(tableNum => (
                    <Card key={tableNum} className="border-orange-500/30 bg-orange-500/5">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge>Table {tableNum}</Badge>
                          <span className="text-xs text-muted-foreground">5 min ago</span>
                        </div>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-muted rounded flex items-center justify-center text-xs">2</span>
                            Butter Chicken
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-muted rounded flex items-center justify-center text-xs">1</span>
                            Biryani
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-muted rounded flex items-center justify-center text-xs">4</span>
                            Naan
                          </li>
                        </ul>
                        <Button size="sm" className="w-full mt-3 gap-1">
                          <Check className="w-3 h-3" /> Mark Ready
                        </Button>
                      </CardContent>
                    </Card>
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
          Powered by <span className="font-medium">Software Vala</span> • The Name of Trust
        </p>
      </footer>
    </div>
  );
};

export default RestaurantPOSDemo;
