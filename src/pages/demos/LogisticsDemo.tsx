import { useState } from "react";
import { Truck, Package, MapPin, Clock, TrendingUp, AlertTriangle, CheckCircle, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const shipments = [
  { id: "SHP001", from: "Mumbai", to: "Delhi", status: "In Transit", eta: "2 hrs", driver: "Rajesh", progress: 75 },
  { id: "SHP002", from: "Bangalore", to: "Chennai", status: "Delivered", eta: "-", driver: "Kumar", progress: 100 },
  { id: "SHP003", from: "Pune", to: "Hyderabad", status: "Picked Up", eta: "6 hrs", driver: "Vijay", progress: 25 },
  { id: "SHP004", from: "Delhi", to: "Jaipur", status: "Pending", eta: "8 hrs", driver: "Amit", progress: 0 },
];

const fleet = [
  { id: "TRK001", driver: "Rajesh Kumar", status: "On Route", location: "Highway NH-48", fuel: 65 },
  { id: "TRK002", driver: "Suresh Yadav", status: "Available", location: "Warehouse A", fuel: 90 },
  { id: "TRK003", driver: "Vijay Singh", status: "Loading", location: "Pune Hub", fuel: 45 },
  { id: "TRK004", driver: "Anil Sharma", status: "Maintenance", location: "Service Center", fuel: 30 },
];

export default function LogisticsDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-zinc-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Truck className="h-8 w-8 text-emerald-400" />
            <span className="text-xl font-bold text-white">LogiTrack</span>
            <Badge variant="outline" className="ml-2 text-emerald-400 border-emerald-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-4 text-white/80">
            <span className="hover:text-emerald-400 cursor-pointer">Dashboard</span>
            <span className="hover:text-emerald-400 cursor-pointer">Shipments</span>
            <span className="hover:text-emerald-400 cursor-pointer">Fleet</span>
            <span className="hover:text-emerald-400 cursor-pointer">Reports</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Active Shipments</p>
                  <p className="text-2xl font-bold text-white">48</p>
                </div>
                <Package className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-emerald-400 text-sm mt-2">12 in transit</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">On-Time Delivery</p>
                  <p className="text-2xl font-bold text-white">94%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+2% vs last week</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Fleet Vehicles</p>
                  <p className="text-2xl font-bold text-white">24</p>
                </div>
                <Truck className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-blue-400 text-sm mt-2">18 active</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/60 text-sm">Delayed</p>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-yellow-400 text-sm mt-2">Action needed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Live Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipments.map(ship => (
                  <div key={ship.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{ship.id}</Badge>
                          <p className="text-white font-medium">{ship.from} → {ship.to}</p>
                        </div>
                        <p className="text-white/60 text-sm">Driver: {ship.driver} {ship.eta !== "-" && `• ETA: ${ship.eta}`}</p>
                      </div>
                      <Badge className={
                        ship.status === "Delivered" ? "bg-green-600" :
                        ship.status === "In Transit" ? "bg-blue-600" :
                        ship.status === "Picked Up" ? "bg-yellow-600" : "bg-gray-600"
                      }>{ship.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={ship.progress} className="flex-1" />
                      <span className="text-white/60 text-sm w-12">{ship.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Fleet Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fleet.map((truck, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white font-medium text-sm">{truck.driver}</p>
                        <p className="text-white/50 text-xs flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {truck.location}
                        </p>
                      </div>
                      <Badge className={
                        truck.status === "On Route" ? "bg-blue-600" :
                        truck.status === "Available" ? "bg-green-600" :
                        truck.status === "Loading" ? "bg-yellow-600" : "bg-red-600"
                      } variant="outline">{truck.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 text-xs">Fuel:</span>
                      <Progress value={truck.fuel} className="flex-1 h-2" />
                      <span className="text-white/60 text-xs">{truck.fuel}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">
                <Navigation className="h-4 w-4 mr-2" /> Track All Vehicles
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
