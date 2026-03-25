import { useState } from "react";
import { Car, Search, Fuel, Gauge, Calendar, IndianRupee, Phone, Filter, Heart, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Vehicle {
  id: number;
  name: string;
  year: number;
  price: number;
  km: string;
  fuel: string;
  type: string;
  emoji: string;
  liked: boolean;
  enquired: boolean;
}

const initialVehicles: Vehicle[] = [
  { id: 1, name: "Maruti Swift", year: 2023, price: 750000, km: "15,000", fuel: "Petrol", type: "Hatchback", emoji: "🚗", liked: false, enquired: false },
  { id: 2, name: "Hyundai Creta", year: 2022, price: 1420000, km: "28,000", fuel: "Diesel", type: "SUV", emoji: "🚙", liked: false, enquired: false },
  { id: 3, name: "Tata Nexon EV", year: 2024, price: 1650000, km: "5,000", fuel: "Electric", type: "SUV", emoji: "⚡", liked: false, enquired: false },
  { id: 4, name: "Honda City", year: 2023, price: 1280000, km: "18,000", fuel: "Petrol", type: "Sedan", emoji: "🚘", liked: false, enquired: false },
];

export default function AutomotiveDemo() {
  const [activeTab, setActiveTab] = useState("Used Cars");
  const [filter, setFilter] = useState("All");
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [enquiryDetails, setEnquiryDetails] = useState({ name: "", phone: "", message: "" });
  const [stats, setStats] = useState({ enquiries: 45, sales: 12 });

  const toggleLike = (vehicleId: number) => {
    setVehicles(vehicles.map(v => {
      if (v.id === vehicleId) {
        toast.success(v.liked ? "Removed from favorites" : "Added to favorites!");
        return { ...v, liked: !v.liked };
      }
      return v;
    }));
  };

  const openEnquiry = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEnquiryModal(true);
  };

  const handleEnquiry = () => {
    if (!enquiryDetails.name || !enquiryDetails.phone) {
      toast.error("Please fill all required fields");
      return;
    }
    setVehicles(vehicles.map(v => {
      if (v.id === selectedVehicle?.id) {
        return { ...v, enquired: true };
      }
      return v;
    }));
    setStats({ ...stats, enquiries: stats.enquiries + 1 });
    toast.success(`Enquiry submitted for ${selectedVehicle?.name}! Our team will contact you soon.`);
    setShowEnquiryModal(false);
    setEnquiryDetails({ name: "", phone: "", message: "" });
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesFilter = filter === "All" || v.type === filter;
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8 text-orange-400" />
            <span className="text-xl font-bold text-white">AutoDealer Pro</span>
            <Badge variant="outline" className="ml-2 text-orange-400 border-orange-400">by Software Vala</Badge>
          </div>
          <nav className="flex gap-1">
            {["New Cars", "Used Cars", "Service", "Finance"].map(tab => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                className={activeTab === tab ? "bg-orange-600 hover:bg-orange-700" : "text-white/80 hover:text-orange-400 hover:bg-white/10"}
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
          <h1 className="text-4xl font-bold text-white mb-2">Find Your Perfect Vehicle</h1>
          <p className="text-orange-200">Certified pre-owned cars with warranty</p>
          <Badge className="mt-2 bg-orange-600">
            {stats.enquiries} enquiries • {stats.sales} sales this month
          </Badge>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Search by make, model..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50" 
            />
          </div>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => toast.info("Filters coming soon!")}>
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {["All", "Hatchback", "Sedan", "SUV"].map(type => (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              onClick={() => { setFilter(type); toast.info(`Showing ${type === "All" ? "all vehicles" : type + "s"}`); }}
              className={filter === type ? "bg-orange-600 hover:bg-orange-700" : "border-white/20 text-white hover:bg-white/10"}
            >
              {type}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVehicles.map(vehicle => (
            <Card key={vehicle.id} className="bg-white/10 border-white/20 overflow-hidden hover:bg-white/15 transition-all hover:scale-[1.02]">
              <div className="h-40 bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center text-6xl relative">
                {vehicle.emoji}
                <Button
                  size="sm"
                  variant="ghost"
                  className={`absolute top-2 right-2 h-8 w-8 p-0 ${vehicle.liked ? "text-red-500" : "text-white/60 hover:text-red-400"}`}
                  onClick={() => toggleLike(vehicle.id)}
                >
                  <Heart className={`h-5 w-5 ${vehicle.liked ? "fill-red-500" : ""}`} />
                </Button>
                {vehicle.enquired && <Badge className="absolute top-2 left-2 bg-green-600">Enquired</Badge>}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-white text-lg mb-1">{vehicle.name}</h3>
                <Badge className="bg-orange-600/20 text-orange-300 mb-3">{vehicle.type}</Badge>
                <p className="text-2xl font-bold text-orange-400 mb-3">₹{(vehicle.price / 100000).toFixed(1)}L</p>
                <div className="grid grid-cols-2 gap-2 text-white/70 text-sm mb-4">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {vehicle.year}</span>
                  <span className="flex items-center gap-1"><Gauge className="h-4 w-4" /> {vehicle.km} km</span>
                  <span className="flex items-center gap-1"><Fuel className="h-4 w-4" /> {vehicle.fuel}</span>
                </div>
                <Button 
                  className={`w-full ${vehicle.enquired ? "bg-green-600" : "bg-orange-600 hover:bg-orange-700"}`}
                  onClick={() => openEnquiry(vehicle)}
                >
                  <Phone className="h-4 w-4 mr-2" /> {vehicle.enquired ? "Enquiry Sent ✓" : "Enquire Now"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No vehicles found</p>
            <Button className="mt-4" variant="outline" onClick={() => { setFilter("All"); setSearchQuery(""); }}>Clear Filters</Button>
          </div>
        )}
      </main>

      <Dialog open={showEnquiryModal} onOpenChange={setShowEnquiryModal}>
        <DialogContent className="bg-zinc-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Enquire About {selectedVehicle?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-white/5 p-4 rounded-lg flex items-center gap-4">
              <span className="text-4xl">{selectedVehicle?.emoji}</span>
              <div>
                <p className="text-white font-bold">{selectedVehicle?.name}</p>
                <p className="text-orange-400 text-xl font-bold">₹{((selectedVehicle?.price || 0) / 100000).toFixed(1)}L</p>
              </div>
            </div>
            <div>
              <Label>Your Name *</Label>
              <Input placeholder="Enter your name" value={enquiryDetails.name} onChange={(e) => setEnquiryDetails({ ...enquiryDetails, name: e.target.value })} className="bg-white/10 border-white/20 text-white mt-1" />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input placeholder="Enter phone number" value={enquiryDetails.phone} onChange={(e) => setEnquiryDetails({ ...enquiryDetails, phone: e.target.value })} className="bg-white/10 border-white/20 text-white mt-1" />
            </div>
            <div>
              <Label>Message (Optional)</Label>
              <Input placeholder="Any specific questions?" value={enquiryDetails.message} onChange={(e) => setEnquiryDetails({ ...enquiryDetails, message: e.target.value })} className="bg-white/10 border-white/20 text-white mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnquiryModal(false)} className="border-white/20 text-white">Cancel</Button>
            <Button onClick={handleEnquiry} className="bg-orange-600 hover:bg-orange-700">Submit Enquiry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="mt-12 py-6 border-t border-white/10 text-center text-white/60">
        <p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}
