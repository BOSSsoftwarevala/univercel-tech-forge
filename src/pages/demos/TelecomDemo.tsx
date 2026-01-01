import { useState } from "react";
import { Smartphone, CreditCard, Signal, Package, TrendingUp, Users, Zap, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const phones = [
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-violet-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Smartphone className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">MobileHub</span>
            <Badge variant="outline" className="ml-2 text-blue-400 border-blue-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-4 text-white/80">
            <span className="hover:text-blue-400 cursor-pointer">Phones</span>
            <span className="hover:text-blue-400 cursor-pointer">Recharge</span>
            <span className="hover:text-blue-400 cursor-pointer">Accessories</span>
            <span className="hover:text-blue-400 cursor-pointer">Service</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Today's Sales</p>
                  <p className="text-2xl font-bold text-white">₹4.5L</p>
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
                  <p className="text-2xl font-bold text-white">245</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-yellow-400 text-sm mt-2">₹72,500 value</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Stock Items</p>
                  <p className="text-2xl font-bold text-white">156</p>
                </div>
                <Package className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-orange-400 text-sm mt-2">8 low stock</p>
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
              <p className="text-violet-400 text-sm mt-2">+32 today</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Featured Phones</CardTitle>
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
                        <Badge className={phone.stock > 10 ? "bg-green-600" : "bg-orange-600"}>
                          {phone.stock} in stock
                        </Badge>
                      </div>
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
                  onChange={e => setMobile(e.target.value)}
                  placeholder="Enter 10-digit number"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                {recharges.map((r, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-lg flex items-center justify-between cursor-pointer hover:bg-white/10">
                    <div>
                      <p className="text-white font-medium">{r.operator}</p>
                      <p className="text-white/60 text-xs">{r.validity} • {r.data}</p>
                    </div>
                    <p className="text-blue-400 font-bold">{r.plan}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Recharge Now
              </Button>
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
