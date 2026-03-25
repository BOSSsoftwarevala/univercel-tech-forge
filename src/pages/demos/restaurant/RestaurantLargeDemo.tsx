/**
 * Restaurant POS - Large Scale (50+ Tables, Multiple Outlets)
 * For: Hotel Restaurants, Chain Outlets, Banquet Halls
 */

import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, ShoppingBag, Users, Receipt, Clock, 
  ChefHat, Plus, Minus, CreditCard, Printer, 
  ArrowLeft, Wallet, QrCode, Bell, Package, BarChart3,
  UserCheck, Timer, Flame, Building2, MapPin, Truck,
  TrendingUp, AlertTriangle, Settings, Headphones, Globe,
  Shield, Database, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Multiple outlets
const outlets = [
  { id: 1, name: 'Main Restaurant', tables: 25, status: 'active' },
  { id: 2, name: 'Poolside Cafe', tables: 15, status: 'active' },
  { id: 3, name: 'Rooftop Bar', tables: 12, status: 'active' },
  { id: 4, name: 'Banquet Hall A', tables: 20, status: 'event' },
  { id: 5, name: 'Room Service', tables: 0, status: 'active' },
];

// Real-time stats
const liveStats = {
  totalRevenue: 285600,
  ordersToday: 342,
  activeGuests: 128,
  avgPrepTime: 14,
  staffOnline: 24,
  pendingOrders: 18,
  criticalAlerts: 2,
};

// Inventory alerts
const inventoryAlerts = [
  { item: 'Chicken', level: 15, threshold: 20, unit: 'kg' },
  { item: 'Paneer', level: 8, threshold: 15, unit: 'kg' },
  { item: 'Butter', level: 5, threshold: 10, unit: 'kg' },
];

// Staff performance
const staffPerformance = [
  { name: 'Rahul Sharma', role: 'Waiter', orders: 45, rating: 4.8, tips: 2400 },
  { name: 'Priya Patel', role: 'Waiter', orders: 42, rating: 4.9, tips: 2800 },
  { name: 'Amit Kumar', role: 'Captain', orders: 38, rating: 4.7, tips: 1900 },
  { name: 'Chef Rajan', role: 'Head Chef', orders: 120, rating: 4.9, tips: 0 },
];

// Recent orders across outlets
const recentOrders = [
  { id: 'ORD-1234', outlet: 'Main Restaurant', table: 'T12', amount: 2450, status: 'served', time: '2 min' },
  { id: 'ORD-1235', outlet: 'Room Service', table: 'R-405', amount: 1800, status: 'delivering', time: '5 min' },
  { id: 'ORD-1236', outlet: 'Poolside Cafe', table: 'P8', amount: 890, status: 'preparing', time: '8 min' },
  { id: 'ORD-1237', outlet: 'Rooftop Bar', table: 'B3', amount: 3200, status: 'new', time: '1 min' },
  { id: 'ORD-1238', outlet: 'Banquet Hall A', table: 'Event', amount: 45000, status: 'partial', time: '45 min' },
];

const RestaurantLargeDemo = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOutlet, setSelectedOutlet] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Enterprise Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/demos')} className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-bold text-xl flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-amber-500" /> 
                  Grand Hotel & Restaurants
                </h1>
                <p className="text-xs text-slate-400">Enterprise POS • 5 Outlets • 72 Tables</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Outlet Selector */}
              <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
                <SelectTrigger className="w-44 bg-slate-800 border-slate-700">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Outlets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Outlets</SelectItem>
                  {outlets.map(o => (
                    <SelectItem key={o.id} value={o.id.toString()}>{o.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Alerts */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                  {liveStats.criticalAlerts}
                </span>
              </Button>

              {/* Time */}
              <Badge className="bg-slate-800 text-slate-300 px-3 py-1.5">
                <Clock className="w-3 h-3 mr-2" />
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 bg-slate-800/50 p-1">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              <BarChart3 className="w-4 h-4 mr-1" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="outlets" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              <Building2 className="w-4 h-4 mr-1" /> Outlets
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              <Receipt className="w-4 h-4 mr-1" /> Live Orders
            </TabsTrigger>
            <TabsTrigger value="kitchen" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              <ChefHat className="w-4 h-4 mr-1" /> Kitchen Central
            </TabsTrigger>
            <TabsTrigger value="staff" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              <Users className="w-4 h-4 mr-1" /> Staff
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              <Package className="w-4 h-4 mr-1" /> Inventory
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
              <Card className="bg-gradient-to-br from-green-600/30 to-green-800/20 border-green-500/30">
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-green-400">₹{(liveStats.totalRevenue / 1000).toFixed(1)}K</div>
                  <div className="text-xs text-green-300/70">Today's Revenue</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-600/30 to-blue-800/20 border-blue-500/30">
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{liveStats.ordersToday}</div>
                  <div className="text-xs text-blue-300/70">Total Orders</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-600/30 to-purple-800/20 border-purple-500/30">
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{liveStats.activeGuests}</div>
                  <div className="text-xs text-purple-300/70">Active Guests</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-600/30 to-amber-800/20 border-amber-500/30">
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-amber-400">{liveStats.avgPrepTime}m</div>
                  <div className="text-xs text-amber-300/70">Avg Prep Time</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-cyan-600/30 to-cyan-800/20 border-cyan-500/30">
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400">{liveStats.staffOnline}</div>
                  <div className="text-xs text-cyan-300/70">Staff Online</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-600/30 to-orange-800/20 border-orange-500/30">
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">{liveStats.pendingOrders}</div>
                  <div className="text-xs text-orange-300/70">Pending Orders</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-red-600/30 to-red-800/20 border-red-500/30">
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-red-400">{liveStats.criticalAlerts}</div>
                  <div className="text-xs text-red-300/70">Alerts</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Recent Orders */}
              <Card className="lg:col-span-2 bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-amber-500" />
                      Live Orders Across Outlets
                    </span>
                    <Badge variant="outline" className="text-green-400 border-green-500">
                      LIVE
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            order.status === 'new' ? 'bg-blue-500 animate-pulse' :
                            order.status === 'preparing' ? 'bg-orange-500' :
                            order.status === 'delivering' ? 'bg-purple-500' :
                            order.status === 'served' ? 'bg-green-500' :
                            'bg-yellow-500'
                          }`} />
                          <div>
                            <div className="font-medium text-sm">{order.id}</div>
                            <div className="text-xs text-slate-400">{order.outlet} • {order.table}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">₹{order.amount.toLocaleString()}</div>
                          <div className="text-xs text-slate-400">{order.time} ago</div>
                        </div>
                        <Badge className={
                          order.status === 'new' ? 'bg-blue-500' :
                          order.status === 'preparing' ? 'bg-orange-500' :
                          order.status === 'delivering' ? 'bg-purple-500' :
                          order.status === 'served' ? 'bg-green-500' :
                          'bg-yellow-500'
                        }>
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Inventory Alerts */}
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    Inventory Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inventoryAlerts.map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.item}</span>
                        <span className="text-red-400">{item.level}/{item.threshold} {item.unit}</span>
                      </div>
                      <Progress 
                        value={(item.level / item.threshold) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black">
                    <Truck className="w-4 h-4 mr-2" /> Create Purchase Order
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Outlets */}
          <TabsContent value="outlets">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {outlets.map(outlet => (
                <Card key={outlet.id} className="bg-slate-900/50 border-slate-700 hover:border-amber-500/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{outlet.name}</h3>
                        <p className="text-sm text-slate-400">{outlet.tables > 0 ? `${outlet.tables} Tables` : 'Delivery Only'}</p>
                      </div>
                      <Badge className={outlet.status === 'active' ? 'bg-green-500' : 'bg-purple-500'}>
                        {outlet.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 bg-slate-800 rounded">
                        <div className="text-lg font-bold text-green-400">₹{Math.floor(Math.random() * 50 + 20)}K</div>
                        <div className="text-xs text-slate-400">Revenue</div>
                      </div>
                      <div className="text-center p-2 bg-slate-800 rounded">
                        <div className="text-lg font-bold text-blue-400">{Math.floor(Math.random() * 50 + 30)}</div>
                        <div className="text-xs text-slate-400">Orders</div>
                      </div>
                      <div className="text-center p-2 bg-slate-800 rounded">
                        <div className="text-lg font-bold text-purple-400">{Math.floor(Math.random() * 10 + 3)}</div>
                        <div className="text-xs text-slate-400">Staff</div>
                      </div>
                    </div>

                    <Button className="w-full" variant="outline">
                      Open POS Terminal
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Live Orders */}
          <TabsContent value="orders">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>All Live Orders</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-blue-400 border-blue-500">New: 5</Badge>
                    <Badge variant="outline" className="text-orange-400 border-orange-500">Preparing: 8</Badge>
                    <Badge variant="outline" className="text-green-400 border-green-500">Ready: 3</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-400">
                  <Receipt className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Full order management with real-time updates</p>
                  <p className="text-sm mt-2">Click on any outlet to manage orders</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kitchen Central */}
          <TabsContent value="kitchen">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader className="bg-red-500/10">
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <Flame className="w-5 h-5" />
                  Centralized Kitchen Display System
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['Main Kitchen', 'Tandoor Section', 'Chinese Wok', 'Desserts'].map((section, i) => (
                    <Card key={i} className="bg-slate-800 border-slate-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{section}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {[1, 2, 3].map(j => (
                            <div key={j} className="p-2 bg-slate-900 rounded text-xs">
                              <div className="flex justify-between">
                                <span>Order #{1200 + i * 10 + j}</span>
                                <Badge className="text-[10px]" variant="outline">T{i + j}</Badge>
                              </div>
                              <Progress value={Math.random() * 100} className="h-1 mt-2" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff */}
          <TabsContent value="staff">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  Staff Performance - Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffPerformance.map((staff, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 font-bold">
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{staff.name}</div>
                          <div className="text-sm text-slate-400">{staff.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 text-center">
                        <div>
                          <div className="font-bold text-blue-400">{staff.orders}</div>
                          <div className="text-xs text-slate-400">Orders</div>
                        </div>
                        <div>
                          <div className="font-bold text-amber-400">⭐ {staff.rating}</div>
                          <div className="text-xs text-slate-400">Rating</div>
                        </div>
                        <div>
                          <div className="font-bold text-green-400">₹{staff.tips}</div>
                          <div className="text-xs text-slate-400">Tips</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory */}
          <TabsContent value="inventory">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-500" />
                  Central Inventory Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-400">
                  <Database className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Centralized inventory tracking across all outlets</p>
                  <p className="text-sm mt-2">Auto-reorder, waste tracking, recipe costing</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 mt-8 bg-slate-900/50">
        <p className="text-center text-xs text-slate-500">
          <span className="font-medium text-amber-500">Enterprise POS</span> • Multi-Outlet Restaurant Chain Management
        </p>
      </footer>
    </div>
  );
};

export default RestaurantLargeDemo;
