import { useState } from "react";
import { Car, Search, Fuel, Gauge, Calendar, IndianRupee, Phone, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const vehicles = [
  { id: 1, name: "Maruti Swift", year: 2023, price: "₹7.5L", km: "15,000", fuel: "Petrol", type: "Hatchback", emoji: "🚗" },
  { id: 2, name: "Hyundai Creta", year: 2022, price: "₹14.2L", km: "28,000", fuel: "Diesel", type: "SUV", emoji: "🚙" },
  { id: 3, name: "Tata Nexon EV", year: 2024, price: "₹16.5L", km: "5,000", fuel: "Electric", type: "SUV", emoji: "⚡" },
  { id: 4, name: "Honda City", year: 2023, price: "₹12.8L", km: "18,000", fuel: "Petrol", type: "Sedan", emoji: "🚘" },
];

export default function AutomotiveDemo() {
  const [filter, setFilter] = useState("All");

  const filteredVehicles = filter === "All" ? vehicles : vehicles.filter(v => v.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8 text-orange-400" />
            <span className="text-xl font-bold text-white">AutoDealer Pro</span>
            <Badge variant="outline" className="ml-2 text-orange-400 border-orange-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-4 text-white/80">
            <span className="hover:text-orange-400 cursor-pointer">New Cars</span>
            <span className="hover:text-orange-400 cursor-pointer">Used Cars</span>
            <span className="hover:text-orange-400 cursor-pointer">Service</span>
            <span className="hover:text-orange-400 cursor-pointer">Finance</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Find Your Perfect Vehicle</h1>
          <p className="text-orange-200">Certified pre-owned cars with warranty</p>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input placeholder="Search by make, model..." className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50" />
          </div>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {["All", "Hatchback", "Sedan", "SUV"].map(type => (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              onClick={() => setFilter(type)}
              className={filter === type ? "bg-orange-600" : "border-white/20 text-white hover:bg-white/10"}
            >
              {type}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVehicles.map(vehicle => (
            <Card key={vehicle.id} className="bg-white/10 border-white/20 overflow-hidden hover:bg-white/15 transition-all">
              <div className="h-40 bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-6xl">
                {vehicle.emoji}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-white text-lg mb-1">{vehicle.name}</h3>
                <Badge className="bg-orange-600/20 text-orange-300 mb-3">{vehicle.type}</Badge>
                <p className="text-2xl font-bold text-orange-400 mb-3">{vehicle.price}</p>
                <div className="grid grid-cols-2 gap-2 text-white/70 text-sm mb-4">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {vehicle.year}</span>
                  <span className="flex items-center gap-1"><Gauge className="h-4 w-4" /> {vehicle.km} km</span>
                  <span className="flex items-center gap-1"><Fuel className="h-4 w-4" /> {vehicle.fuel}</span>
                </div>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <Phone className="h-4 w-4 mr-2" /> Enquire Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="mt-12 py-6 border-t border-white/10 text-center text-white/60">
        <p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}
