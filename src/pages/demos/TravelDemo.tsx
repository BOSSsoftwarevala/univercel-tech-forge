import { useState } from "react";
import { Plane, Search, MapPin, Calendar, Users, Star, Clock, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Package {
  id: number;
  name: string;
  duration: string;
  price: number;
  rating: number;
  location: string;
  emoji: string;
  liked: boolean;
  booked: boolean;
}

const initialPackages: Package[] = [
  { id: 1, name: "Goa Beach Getaway", duration: "4 Days", price: 15999, rating: 4.8, location: "Goa", emoji: "🏖️", liked: false, booked: false },
  { id: 2, name: "Kashmir Paradise", duration: "6 Days", price: 28999, rating: 4.9, location: "Kashmir", emoji: "🏔️", liked: false, booked: false },
  { id: 3, name: "Kerala Backwaters", duration: "5 Days", price: 22500, rating: 4.7, location: "Kerala", emoji: "🛶", liked: false, booked: false },
  { id: 4, name: "Rajasthan Heritage", duration: "7 Days", price: 35000, rating: 4.8, location: "Rajasthan", emoji: "🏰", liked: false, booked: false },
];

export default function TravelDemo() {
  const [activeTab, setActiveTab] = useState("Packages");
  const [travelers, setTravelers] = useState(2);
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [bookingDetails, setBookingDetails] = useState({ name: "", email: "", phone: "" });
  const [stats, setStats] = useState({ bookings: 24, revenue: 450000 });

  const toggleLike = (packageId: number) => {
    setPackages(packages.map(pkg => {
      if (pkg.id === packageId) {
        toast.success(pkg.liked ? "Removed from wishlist" : "Added to wishlist!");
        return { ...pkg, liked: !pkg.liked };
      }
      return pkg;
    }));
  };

  const openBooking = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowBookingModal(true);
  };

  const handleBooking = () => {
    if (!bookingDetails.name || !bookingDetails.phone) {
      toast.error("Please fill all required fields");
      return;
    }
    setPackages(packages.map(pkg => {
      if (pkg.id === selectedPackage?.id) {
        return { ...pkg, booked: true };
      }
      return pkg;
    }));
    setStats({ ...stats, bookings: stats.bookings + 1, revenue: stats.revenue + (selectedPackage?.price || 0) * travelers });
    toast.success(`Booking confirmed for ${selectedPackage?.name}!`);
    setShowBookingModal(false);
    setBookingDetails({ name: "", email: "", phone: "" });
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    toast.success(`Found ${filteredPackages.length} packages`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Plane className="h-8 w-8 text-sky-400" />
            <span className="text-xl font-bold text-white">TravelEase</span>
            <Badge variant="outline" className="ml-2 text-sky-400 border-sky-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-1">
            {["Flights", "Hotels", "Packages", "Visa"].map(tab => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                className={activeTab === tab ? "bg-sky-600 hover:bg-sky-700" : "text-white/80 hover:text-sky-400 hover:bg-white/10"}
                onClick={() => { setActiveTab(tab); toast.info(`Viewing ${tab}`); }}
              >
                {tab}
              </Button>
            ))}
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
              <Input placeholder="Departure City" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">To / Search</label>
              <Input 
                placeholder="Search destination..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50" 
              />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Date</label>
              <Input type="date" className="bg-white/10 border-white/20 text-white" />
            </div>
            <div>
              <label className="text-white/70 text-sm mb-1 block">Travelers</label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setTravelers(Math.max(1, travelers - 1))} className="border-white/20 text-white hover:bg-white/10">-</Button>
                <span className="text-white text-lg w-8 text-center">{travelers}</span>
                <Button variant="outline" size="icon" onClick={() => setTravelers(travelers + 1)} className="border-white/20 text-white hover:bg-white/10">+</Button>
              </div>
            </div>
          </div>
          <Button className="w-full mt-4 bg-sky-600 hover:bg-sky-700" onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" /> Search Packages
          </Button>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Popular Packages</h2>
          <Badge className="bg-sky-600">
            {stats.bookings} bookings today • ₹{(stats.revenue / 100000).toFixed(1)}L revenue
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPackages.map(pkg => (
            <Card key={pkg.id} className="bg-white/10 border-white/20 overflow-hidden hover:bg-white/15 transition-all hover:scale-[1.02]">
              <div className="h-40 bg-gradient-to-br from-sky-600 to-indigo-600 flex items-center justify-center text-6xl relative">
                {pkg.emoji}
                <Button
                  size="sm"
                  variant="ghost"
                  className={`absolute top-2 right-2 h-8 w-8 p-0 ${pkg.liked ? "text-red-500" : "text-white/60 hover:text-red-400"}`}
                  onClick={() => toggleLike(pkg.id)}
                >
                  <Heart className={`h-5 w-5 ${pkg.liked ? "fill-red-500" : ""}`} />
                </Button>
                {pkg.booked && <Badge className="absolute top-2 left-2 bg-green-600">Booked</Badge>}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-white text-lg mb-1">{pkg.name}</h3>
                <div className="flex items-center gap-2 text-sky-300 text-sm mb-2">
                  <MapPin className="h-4 w-4" /> {pkg.location}
                </div>
                <div className="flex items-center gap-4 text-white/70 text-sm mb-3">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {pkg.duration}</span>
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> {pkg.rating}</span>
                </div>
                <p className="text-2xl font-bold text-sky-400 mb-3">₹{pkg.price.toLocaleString()}<span className="text-sm text-white/50">/person</span></p>
                <Button 
                  className={`w-full ${pkg.booked ? "bg-green-600" : "bg-sky-600 hover:bg-sky-700"}`}
                  onClick={() => !pkg.booked && openBooking(pkg)}
                  disabled={pkg.booked}
                >
                  {pkg.booked ? "Booked ✓" : "Book Now"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No packages found for "{searchQuery}"</p>
            <Button className="mt-4" variant="outline" onClick={() => setSearchQuery("")}>Clear Search</Button>
          </div>
        )}
      </main>

      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="bg-zinc-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Book Package - {selectedPackage?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Package Price</span>
                <span className="text-white">₹{selectedPackage?.price.toLocaleString()} x {travelers}</span>
              </div>
              <div className="flex justify-between items-center mt-2 text-xl font-bold">
                <span className="text-white">Total</span>
                <span className="text-sky-400">₹{((selectedPackage?.price || 0) * travelers).toLocaleString()}</span>
              </div>
            </div>
            <div>
              <Label>Full Name *</Label>
              <Input placeholder="Enter your name" value={bookingDetails.name} onChange={(e) => setBookingDetails({ ...bookingDetails, name: e.target.value })} className="bg-white/10 border-white/20 text-white mt-1" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="Enter your email" value={bookingDetails.email} onChange={(e) => setBookingDetails({ ...bookingDetails, email: e.target.value })} className="bg-white/10 border-white/20 text-white mt-1" />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input placeholder="Enter phone number" value={bookingDetails.phone} onChange={(e) => setBookingDetails({ ...bookingDetails, phone: e.target.value })} className="bg-white/10 border-white/20 text-white mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingModal(false)} className="border-white/20 text-white">Cancel</Button>
            <Button onClick={handleBooking} className="bg-sky-600 hover:bg-sky-700">Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="mt-12 py-6 border-t border-white/10 text-center text-white/60">
        <p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}
