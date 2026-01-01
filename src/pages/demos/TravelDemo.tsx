import { useState } from "react";
import { Plane, Search, MapPin, Calendar, Users, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const packages = [
  { id: 1, name: "Goa Beach Getaway", duration: "4 Days", price: "₹15,999", rating: 4.8, location: "Goa", emoji: "🏖️" },
  { id: 2, name: "Kashmir Paradise", duration: "6 Days", price: "₹28,999", rating: 4.9, location: "Kashmir", emoji: "🏔️" },
  { id: 3, name: "Kerala Backwaters", duration: "5 Days", price: "₹22,500", rating: 4.7, location: "Kerala", emoji: "🛶" },
  { id: 4, name: "Rajasthan Heritage", duration: "7 Days", price: "₹35,000", rating: 4.8, location: "Rajasthan", emoji: "🏰" },
];

export default function TravelDemo() {
  const [travelers, setTravelers] = useState(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Plane className="h-8 w-8 text-sky-400" />
            <span className="text-xl font-bold text-white">TravelEase</span>
            <Badge variant="outline" className="ml-2 text-sky-400 border-sky-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-4 text-white/80">
            <span className="hover:text-sky-400 cursor-pointer">Flights</span>
            <span className="hover:text-sky-400 cursor-pointer">Hotels</span>
            <span className="hover:text-sky-400 cursor-pointer">Packages</span>
            <span className="hover:text-sky-400 cursor-pointer">Visa</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Explore Amazing Destinations</h1>
          <p className="text-sky-200">Book your dream vacation today</p>
        </div>

        <Card className="bg-white/10 border-white/20 p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-white/70 text-sm mb-1 block">From</label>
              <Input placeholder="Departure City" className="bg-white/10 border-white/20 text-white" />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">To</label>
              <Input placeholder="Destination" className="bg-white/10 border-white/20 text-white" />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Date</label>
              <Input type="date" className="bg-white/10 border-white/20 text-white" />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Travelers</label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setTravelers(Math.max(1, travelers - 1))} className="border-white/20 text-white">-</Button>
                <span className="text-white text-lg w-8 text-center">{travelers}</span>
                <Button variant="outline" size="icon" onClick={() => setTravelers(travelers + 1)} className="border-white/20 text-white">+</Button>
              </div>
            </div>
          </div>
          <Button className="w-full mt-4 bg-sky-600 hover:bg-sky-700">
            <Search className="h-4 w-4 mr-2" /> Search Packages
          </Button>
        </Card>

        <h2 className="text-2xl font-bold text-white mb-4">Popular Packages</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map(pkg => (
            <Card key={pkg.id} className="bg-white/10 border-white/20 overflow-hidden hover:bg-white/15 transition-all">
              <div className="h-40 bg-gradient-to-br from-sky-600 to-indigo-600 flex items-center justify-center text-6xl">
                {pkg.emoji}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-white text-lg mb-1">{pkg.name}</h3>
                <div className="flex items-center gap-2 text-sky-300 text-sm mb-2">
                  <MapPin className="h-4 w-4" /> {pkg.location}
                </div>
                <div className="flex items-center gap-4 text-white/70 text-sm mb-3">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {pkg.duration}</span>
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400" /> {pkg.rating}</span>
                </div>
                <p className="text-2xl font-bold text-sky-400 mb-3">{pkg.price}<span className="text-sm text-white/50">/person</span></p>
                <Button className="w-full bg-sky-600 hover:bg-sky-700">Book Now</Button>
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
