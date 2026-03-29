import { useState } from "react";
import { Home, Search, MapPin, Bed, Bath, Square, Phone, Heart, Filter, X, Mail, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  image: string;
  agent: string;
  agentPhone: string;
  description: string;
}

const initialProperties: Property[] = [
  { id: 1, title: "Modern Villa", location: "Mumbai", price: "₹2.5 Cr", beds: 4, baths: 3, sqft: 2500, type: "Sale", image: "🏠", agent: "Rahul Sharma", agentPhone: "98765-43210", description: "Luxurious 4BHK villa with garden and parking" },
  { id: 2, title: "Luxury Apartment", location: "Delhi", price: "₹45K/mo", beds: 3, baths: 2, sqft: 1800, type: "Rent", image: "🏢", agent: "Priya Singh", agentPhone: "98765-43211", description: "Premium apartment in heart of Delhi with all amenities" },
  { id: 3, title: "Commercial Space", location: "Bangalore", price: "₹1.2 Cr", beds: 0, baths: 2, sqft: 3000, type: "Sale", image: "🏬", agent: "Amit Patel", agentPhone: "98765-43212", description: "Prime commercial space on main road" },
  { id: 4, title: "Penthouse Suite", location: "Pune", price: "₹85K/mo", beds: 5, baths: 4, sqft: 4000, type: "Rent", image: "🌆", agent: "Neha Gupta", agentPhone: "98765-43213", description: "Stunning penthouse with city views" },
  { id: 5, title: "Family Home", location: "Chennai", price: "₹1.8 Cr", beds: 3, baths: 2, sqft: 2200, type: "Sale", image: "🏡", agent: "Kumar Rajan", agentPhone: "98765-43214", description: "Perfect family home in peaceful neighborhood" },
  { id: 6, title: "Studio Apartment", location: "Hyderabad", price: "₹18K/mo", beds: 1, baths: 1, sqft: 650, type: "Rent", image: "🏙️", agent: "Lakshmi Devi", agentPhone: "98765-43215", description: "Cozy studio near IT hub" },
];

export default function RealEstateDemo() {
  const [filter, setFilter] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [inquiries, setInquiries] = useState<{ propertyId: number; name: string }[]>([]);

  const filteredProperties = initialProperties
    .filter(p => filter === "All" || p.type === filter)
    .filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id));
      toast.info("Removed from favorites");
    } else {
      setFavorites([...favorites, id]);
      toast.success("Added to favorites!");
    }
  };

  const handleInquiry = () => {
    if (!inquiryForm.name || !inquiryForm.phone) {
      toast.error("Please fill required fields");
      return;
    }
    if (selectedProperty) {
      setInquiries([...inquiries, { propertyId: selectedProperty.id, name: inquiryForm.name }]);
      toast.success(`Inquiry sent for ${selectedProperty.title}! Agent will contact you soon.`);
      setInquiryForm({ name: "", email: "", phone: "", message: "" });
      setShowInquiry(false);
    }
  };

  const callAgent = (phone: string, agent: string) => {
    toast.success(`Calling ${agent} at ${phone}...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Home className="h-8 w-8 text-emerald-400" />
            <span className="text-xl font-bold text-white">PropertyHub</span>
            <Badge variant="outline" className="ml-2 text-emerald-400 border-emerald-400">by Software Vala</Badge>
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex gap-4 text-white/80">
              <span className="hover:text-emerald-400 cursor-pointer">Buy</span>
              <span className="hover:text-emerald-400 cursor-pointer">Rent</span>
              <span className="hover:text-emerald-400 cursor-pointer">Sell</span>
              <span className="hover:text-emerald-400 cursor-pointer">Agents</span>
            </nav>
            {favorites.length > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-white/20 text-white relative">
                    <Heart className="h-4 w-4 mr-1 fill-red-500 text-red-500" />
                    Favorites
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500">{favorites.length}</Badge>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/20 text-white">
                  <DialogHeader>
                    <DialogTitle>Your Favorites</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    {favorites.map(id => {
                      const prop = initialProperties.find(p => p.id === id)!;
                      return (
                        <div key={id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{prop.image}</span>
                            <div>
                              <p className="font-medium">{prop.title}</p>
                              <p className="text-sm text-white/60">{prop.location} • {prop.price}</p>
                            </div>
                          </div>
                          <Button size="icon" variant="ghost" onClick={() => toggleFavorite(id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
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
            <Input 
              placeholder="Search by location, property type..." 
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
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
              {type} ({type === "All" ? initialProperties.length : initialProperties.filter(p => p.type === type).length})
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <Card key={property.id} className="bg-white/10 border-white/20 overflow-hidden hover:bg-white/15 transition-all">
              <div className="h-40 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-6xl relative">
                {property.image}
                <Badge className="absolute top-2 left-2 bg-black/50">{property.type}</Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{property.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(property.id)}
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
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => setSelectedProperty(property)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-white/20 text-white max-w-lg">
                      <DialogHeader>
                        <DialogTitle>{property.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="h-48 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center text-7xl">
                          {property.image}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-3xl font-bold text-emerald-400">{property.price}</span>
                          <Badge>{property.type}</Badge>
                        </div>
                        <p className="text-white/80">{property.description}</p>
                        <div className="grid grid-cols-3 gap-4 p-3 bg-white/5 rounded-lg">
                          {property.beds > 0 && <div className="text-center"><p className="text-2xl font-bold">{property.beds}</p><p className="text-xs text-white/60">Bedrooms</p></div>}
                          <div className="text-center"><p className="text-2xl font-bold">{property.baths}</p><p className="text-xs text-white/60">Bathrooms</p></div>
                          <div className="text-center"><p className="text-2xl font-bold">{property.sqft}</p><p className="text-xs text-white/60">Sq.ft</p></div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg flex justify-between items-center">
                          <div>
                            <p className="text-sm text-white/60">Listed by</p>
                            <p className="font-medium">{property.agent}</p>
                          </div>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => callAgent(property.agentPhone, property.agent)}>
                            <Phone className="h-4 w-4 mr-1" /> Call Agent
                          </Button>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => { setSelectedProperty(property); setShowInquiry(true); }}>
                          <MessageSquare className="h-4 w-4 mr-2" /> Send Inquiry
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="border-white/20 text-white" onClick={() => callAgent(property.agentPhone, property.agent)}>
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60">No properties found matching your criteria</p>
          </div>
        )}
      </main>

      {/* Inquiry Dialog */}
      <Dialog open={showInquiry} onOpenChange={setShowInquiry}>
        <DialogContent className="bg-slate-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Send Inquiry for {selectedProperty?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Your Name *</Label>
              <Input
                value={inquiryForm.name}
                onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                placeholder="Enter your name"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={inquiryForm.email}
                onChange={e => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                placeholder="Enter email"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label>Phone *</Label>
              <Input
                value={inquiryForm.phone}
                onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                placeholder="Enter phone number"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                value={inquiryForm.message}
                onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                placeholder="I'm interested in this property..."
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-white/20 text-white">Cancel</Button>
            </DialogClose>
            <Button onClick={handleInquiry} className="bg-emerald-600 hover:bg-emerald-700">
              <Mail className="h-4 w-4 mr-1" /> Send Inquiry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="mt-12 py-6 border-t border-white/10 text-center text-white/60">
        <p>© 2025 Software Vala - The Name of Trust. All rights reserved.</p>
      </footer>
    </div>
  );
}
