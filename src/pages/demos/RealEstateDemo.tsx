import { useState } from "react";
import { Home, Search, MapPin, Bed, Bath, Square, Phone, Heart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const properties = [
  { id: 1, title: "Modern Villa", location: "Mumbai", price: "₹2.5 Cr", beds: 4, baths: 3, sqft: 2500, type: "Sale", image: "🏠" },
  { id: 2, title: "Luxury Apartment", location: "Delhi", price: "₹45K/mo", beds: 3, baths: 2, sqft: 1800, type: "Rent", image: "🏢" },
  { id: 3, title: "Commercial Space", location: "Bangalore", price: "₹1.2 Cr", beds: 0, baths: 2, sqft: 3000, type: "Sale", image: "🏬" },
  { id: 4, title: "Penthouse Suite", location: "Pune", price: "₹85K/mo", beds: 5, baths: 4, sqft: 4000, type: "Rent", image: "🌆" },
];

export default function RealEstateDemo() {
  const [filter, setFilter] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredProperties = filter === "All" ? properties : properties.filter(p => p.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Home className="h-8 w-8 text-emerald-400" />
            <span className="text-xl font-bold text-white">PropertyHub</span>
            <Badge variant="outline" className="ml-2 text-emerald-400 border-emerald-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-4 text-white/80">
            <span className="hover:text-emerald-400 cursor-pointer">Buy</span>
            <span className="hover:text-emerald-400 cursor-pointer">Rent</span>
            <span className="hover:text-emerald-400 cursor-pointer">Sell</span>
            <span className="hover:text-emerald-400 cursor-pointer">Agents</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Find Your Dream Property</h1>
          <p className="text-emerald-200">Browse thousands of properties across India</p>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input placeholder="Search by location, property type..." className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50" />
          </div>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          {["All", "Sale", "Rent"].map(type => (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              onClick={() => setFilter(type)}
              className={filter === type ? "bg-emerald-600" : "border-white/20 text-white hover:bg-white/10"}
            >
              {type}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProperties.map(property => (
            <Card key={property.id} className="bg-white/10 border-white/20 overflow-hidden hover:bg-white/15 transition-all">
              <div className="h-40 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-6xl">
                {property.image}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{property.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFavorites(prev => prev.includes(property.id) ? prev.filter(id => id !== property.id) : [...prev, property.id])}
                  >
                    <Heart className={`h-5 w-5 ${favorites.includes(property.id) ? "fill-red-500 text-red-500" : "text-white/60"}`} />
                  </Button>
                </div>
                <div className="flex items-center gap-1 text-emerald-300 text-sm mb-2">
                  <MapPin className="h-4 w-4" /> {property.location}
                </div>
                <p className="text-2xl font-bold text-emerald-400 mb-3">{property.price}</p>
                <div className="flex gap-4 text-white/70 text-sm mb-4">
                  {property.beds > 0 && <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> {property.beds}</span>}
                  <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {property.baths}</span>
                  <span className="flex items-center gap-1"><Square className="h-4 w-4" /> {property.sqft}</span>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Phone className="h-4 w-4 mr-2" /> Contact
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
