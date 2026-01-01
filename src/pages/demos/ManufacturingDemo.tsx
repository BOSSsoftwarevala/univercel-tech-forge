import { useState } from "react";
import { Factory, Package, TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const orders = [
  { id: "ORD001", product: "Steel Rods", qty: 5000, status: "In Progress", progress: 65 },
  { id: "ORD002", product: "Copper Wires", qty: 2000, status: "Quality Check", progress: 90 },
  { id: "ORD003", product: "Aluminum Sheets", qty: 1500, status: "Pending", progress: 0 },
  { id: "ORD004", product: "Iron Pipes", qty: 3000, status: "Completed", progress: 100 },
];

export default function ManufacturingDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-neutral-800 to-stone-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Factory className="h-8 w-8 text-amber-400" />
            <span className="text-xl font-bold text-white">FactoryPro</span>
            <Badge variant="outline" className="ml-2 text-amber-400 border-amber-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-4 text-white/80">
            <span className="hover:text-amber-400 cursor-pointer">Dashboard</span>
            <span className="hover:text-amber-400 cursor-pointer">Production</span>
            <span className="hover:text-amber-400 cursor-pointer">Inventory</span>
            <span className="hover:text-amber-400 cursor-pointer">Quality</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Production Today</p>
                  <p className="text-2xl font-bold text-white">12,450</p>
                </div>
                <Package className="h-8 w-8 text-amber-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+8.3% vs yesterday</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Efficiency</p>
                  <p className="text-2xl font-bold text-white">94.5%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
              <Progress value={94.5} className="mt-2" />
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Quality Pass</p>
                  <p className="text-2xl font-bold text-white">98.2%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-emerald-400 text-sm mt-2">Above target</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Alerts</p>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-yellow-400 text-sm mt-2">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Production Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium">{order.product}</p>
                        <p className="text-white/60 text-sm">{order.id} • Qty: {order.qty.toLocaleString()}</p>
                      </div>
                      <Badge className={
                        order.status === "Completed" ? "bg-green-600" :
                        order.status === "In Progress" ? "bg-amber-600" :
                        order.status === "Quality Check" ? "bg-blue-600" : "bg-gray-600"
                      }>{order.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={order.progress} className="flex-1" />
                      <span className="text-white/60 text-sm w-12">{order.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Machine Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "CNC Machine 1", status: "Running", temp: "42°C" },
                { name: "Press Unit A", status: "Running", temp: "38°C" },
                { name: "Welding Bot 3", status: "Idle", temp: "25°C" },
                { name: "Assembly Line 2", status: "Maintenance", temp: "-" },
              ].map((machine, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Settings className={`h-5 w-5 ${machine.status === "Running" ? "text-green-400 animate-spin" : machine.status === "Idle" ? "text-gray-400" : "text-yellow-400"}`} />
                    <div>
                      <p className="text-white text-sm">{machine.name}</p>
                      <p className="text-white/50 text-xs">{machine.temp}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    machine.status === "Running" ? "border-green-400 text-green-400" :
                    machine.status === "Idle" ? "border-gray-400 text-gray-400" : "border-yellow-400 text-yellow-400"
                  }>{machine.status}</Badge>
                </div>
              ))}
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
