import { useState } from "react";
import { Smartphone, CreditCard, Signal, Package, TrendingUp, Users, Zap, Phone, Plus, ShoppingCart, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface PhoneItem {
  id: number;
  name: string;
  price: string;
  stock: number;
  brand: string;
  emoji: string;
}

interface RechargeRecord {
  id: number;
  mobile: string;
  operator: string;
  plan: string;
  status: string;
}

const initialPhones: PhoneItem[] = [
  { id: 1, name: "iPhone 15 Pro", price: "₹1,34,900", stock: 12, brand: "Apple", emoji: "📱" },
  { id: 2, name: "Samsung S24 Ultra", price: "₹1,29,999", stock: 8, brand: "Samsung", emoji: "📱" },
  { id: 3, name: "OnePlus 12", price: "₹64,999", stock: 15, brand: "OnePlus", emoji: "📱" },
  { id: 4, name: "Pixel 8 Pro", price: "₹1,06,999", stock: 5, brand: "Google", emoji: "📱" },
];

const recharges = [
  { operator: "Jio", plan: "₹299", validity: "28 days", data: "2GB/day" },
  { operator: "Airtel", plan: "₹349", validity: "28 days", data: "2.5GB/day" },
  { operator: "Vi", plan: "₹269", validity: "28 days", data: "1.5GB/day" },
];

export default function TelecomDemo() {
  const [mobile, setMobile] = useState("");
  const [phones, setPhones] = useState<PhoneItem[]>(initialPhones);
  const [rechargeHistory, setRechargeHistory] = useState<RechargeRecord[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<typeof recharges[0] | null>(null);
  const [showSellDialog, setShowSellDialog] = useState(false);
  const [showRechargeConfirm, setShowRechargeConfirm] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<PhoneItem | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [cart, setCart] = useState<PhoneItem[]>([]);

  const stats = {
    todaySales: phones.reduce((sum, p) => sum + (initialPhones.find(ip => ip.id === p.id)!.stock - p.stock) * parseInt(p.price.replace(/[₹,]/g, "")), 0),
    rechargesDone: rechargeHistory.length,
    rechargeValue: rechargeHistory.reduce((sum, r) => sum + parseInt(r.plan.replace("₹", "")), 0),
    lowStock: phones.filter(p => p.stock < 6).length
  };

  const handleRecharge = () => {
    if (!mobile || mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }
    const id = rechargeHistory.length + 1;
    setRechargeHistory([...rechargeHistory, {
      id,
      mobile: mobile,
      operator: selectedPlan.operator,
      plan: selectedPlan.plan,
      status: "success"
    }]);
    toast.success(`Recharge of ${selectedPlan.plan} successful for ${mobile}`);
    setMobile("");
    setSelectedPlan(null);
    setShowRechargeConfirm(false);
  };

  const handleSellPhone = () => {
    if (!selectedPhone || !customerName) {
      toast.error("Please fill all details");
      return;
    }
    if (selectedPhone.stock < 1) {
      toast.error("Phone out of stock!");
      return;
    }
    setPhones(phones.map(p => p.id === selectedPhone.id ? { ...p, stock: p.stock - 1 } : p));
    toast.success(`${selectedPhone.name} sold to ${customerName}`);
    setCustomerName("");
    setSelectedPhone(null);
    setShowSellDialog(false);
  };

  const addToCart = (phone: PhoneItem) => {
    if (phone.stock < 1) {
      toast.error("Out of stock!");
      return;
    }
    setCart([...cart, phone]);
    toast.success(`${phone.name} added to cart`);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const checkout = () => {
    cart.forEach(phone => {
      setPhones(prev => prev.map(p => p.id === phone.id ? { ...p, stock: p.stock - 1 } : p));
    });
    toast.success(`Checkout complete! ${cart.length} items sold`);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-violet-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Smartphone className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">MobileHub</span>
            <Badge variant="outline" className="ml-2 text-blue-400 border-blue-400">by Software Vala</Badge>
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex gap-4 text-white/80">
              <span className="hover:text-blue-400 cursor-pointer">Phones</span>
              <span className="hover:text-blue-400 cursor-pointer">Recharge</span>
              <span className="hover:text-blue-400 cursor-pointer">Accessories</span>
              <span className="hover:text-blue-400 cursor-pointer">Service</span>
            </nav>
            {cart.length > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-white/20 text-white relative">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Cart
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-blue-500">{cart.length}</Badge>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/20 text-white">
                  <DialogHeader>
                    <DialogTitle>Shopping Cart</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    {cart.map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-white/5 rounded">
                        <span>{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400">{item.price}</span>
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400" onClick={() => removeFromCart(i)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-white/20 pt-3 flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{cart.reduce((sum, p) => sum + parseInt(p.price.replace(/[₹,]/g, "")), 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={checkout} className="w-full bg-blue-600 hover:bg-blue-700">Checkout</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Today's Sales</p>
                  <p className="text-2xl font-bold text-white">₹{(stats.todaySales / 100000).toFixed(1)}L</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+18% vs yesterday</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Recharges Done</p>
                  <p className="text-2xl font-bold text-white">{stats.rechargesDone}</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-yellow-400 text-sm mt-2">₹{stats.rechargeValue.toLocaleString()} value</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Stock Items</p>
                  <p className="text-2xl font-bold text-white">{phones.reduce((sum, p) => sum + p.stock, 0)}</p>
                </div>
                <Package className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-orange-400 text-sm mt-2">{stats.lowStock} low stock</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Customers</p>
                  <p className="text-2xl font-bold text-white">1,842</p>
                </div>
                <Users className="h-8 w-8 text-violet-400" />
              </div>
              <p className="text-violet-400 text-sm mt-2">+{stats.rechargesDone} today</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Featured Phones</CardTitle>
              <Dialog open={showSellDialog} onOpenChange={setShowSellDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-1" /> Quick Sale
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/20 text-white">
                  <DialogHeader>
                    <DialogTitle>Quick Phone Sale</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Select Phone</Label>
                      <Select onValueChange={v => setSelectedPhone(phones.find(p => p.id === parseInt(v)) || null)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Choose phone" />
                        </SelectTrigger>
                        <SelectContent>
                          {phones.filter(p => p.stock > 0).map(phone => (
                            <SelectItem key={phone.id} value={phone.id.toString()}>
                              {phone.name} - {phone.price} ({phone.stock} in stock)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Customer Name</Label>
                      <Input
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        placeholder="Enter customer name"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    {selectedPhone && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-sm text-white/60">Sale Amount</p>
                        <p className="text-2xl font-bold text-blue-400">{selectedPhone.price}</p>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="border-white/20 text-white">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSellPhone} className="bg-green-600 hover:bg-green-700">Complete Sale</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {phones.map(phone => (
                  <div key={phone.id} className="p-4 bg-white/5 rounded-lg flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center text-3xl">
                      {phone.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{phone.name}</p>
                      <p className="text-white/60 text-sm">{phone.brand}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-blue-400 font-bold">{phone.price}</p>
                        <Badge className={phone.stock > 10 ? "bg-green-600" : phone.stock > 0 ? "bg-orange-600" : "bg-red-600"}>
                          {phone.stock > 0 ? `${phone.stock} in stock` : "Out of stock"}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700" 
                        onClick={() => addToCart(phone)}
                        disabled={phone.stock < 1}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" /> Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5" /> Quick Recharge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-white/70 text-sm">Mobile Number</label>
                <Input
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="Enter 10-digit number"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                {recharges.map((r, i) => (
                  <div 
                    key={i} 
                    className={`p-3 bg-white/5 rounded-lg flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors ${selectedPlan?.operator === r.operator ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => setSelectedPlan(r)}
                  >
                    <div className="flex items-center gap-2">
                      {selectedPlan?.operator === r.operator && <Check className="h-4 w-4 text-blue-400" />}
                      <div>
                        <p className="text-white font-medium">{r.operator}</p>
                        <p className="text-white/60 text-xs">{r.validity} • {r.data}</p>
                      </div>
                    </div>
                    <p className="text-blue-400 font-bold">{r.plan}</p>
                  </div>
                ))}
              </div>
              <Dialog open={showRechargeConfirm} onOpenChange={setShowRechargeConfirm}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    disabled={!mobile || !selectedPlan}
                    onClick={() => setShowRechargeConfirm(true)}
                  >
                    Recharge Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/20 text-white">
                  <DialogHeader>
                    <DialogTitle>Confirm Recharge</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-white/60">Mobile:</span><span>{mobile}</span></div>
                    <div className="flex justify-between"><span className="text-white/60">Operator:</span><span>{selectedPlan?.operator}</span></div>
                    <div className="flex justify-between"><span className="text-white/60">Plan:</span><span>{selectedPlan?.plan}</span></div>
                    <div className="flex justify-between"><span className="text-white/60">Validity:</span><span>{selectedPlan?.validity}</span></div>
                    <div className="flex justify-between"><span className="text-white/60">Data:</span><span>{selectedPlan?.data}</span></div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="border-white/20 text-white">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleRecharge} className="bg-green-600 hover:bg-green-700">
                      <CreditCard className="h-4 w-4 mr-1" /> Pay {selectedPlan?.plan}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {rechargeHistory.length > 0 && (
                <div className="mt-4">
                  <p className="text-white/60 text-sm mb-2">Recent Recharges</p>
                  <div className="space-y-2">
                    {rechargeHistory.slice(-3).reverse().map(r => (
                      <div key={r.id} className="p-2 bg-white/5 rounded text-sm flex justify-between">
                        <span className="text-white/80">{r.mobile.slice(0,4)}XXXX{r.mobile.slice(-2)}</span>
                        <span className="text-green-400">{r.plan} ✓</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-white/10 text-center text-white/60">
        <p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}
