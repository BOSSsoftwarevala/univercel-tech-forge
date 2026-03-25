import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Play, Heart, ShoppingCart, Lightbulb, Filter, Search,
  Monitor, Server, Database, Code, Shield, Smartphone,
  GraduationCap, Heart as HealthIcon, Utensils, Hotel, Home, Car, Plane,
  CreditCard, Factory, Dumbbell, Scissors, Scale, Users, Truck,
  Baby, Dog, PartyPopper, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import softwareValaLogo from "@/assets/software-vala-logo.jpg";

interface Demo {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  icon: any;
  status: "ACTIVE" | "COMING_SOON";
  features: string[];
  frontend: string[];
  backend: string[];
  color: string;
}

const allDemos: Demo[] = [
  {
    id: "restaurant-pos",
    name: "Restaurant POS System",
    category: "Restaurant",
    description: "Complete restaurant management with table booking, kitchen display, billing, and order tracking.",
    url: "/demo/restaurant-pos",
    icon: Utensils,
    status: "ACTIVE",
    features: ["Table Management", "Kitchen Display", "Billing & Invoicing", "Order Tracking"],
    frontend: ["React", "TypeScript", "Tailwind CSS"],
    backend: ["Node.js", "PostgreSQL", "Real-time Sync"],
    color: "from-orange-600 to-red-600"
  },
  {
    id: "school-erp",
    name: "School ERP System",
    category: "Education",
    description: "Complete school management with student records, attendance, fees, and exam management.",
    url: "/demo/school-erp",
    icon: GraduationCap,
    status: "ACTIVE",
    features: ["Student Management", "Attendance System", "Fee Collection", "Exam Portal"],
    frontend: ["React", "TypeScript", "Charts"],
    backend: ["Node.js", "PostgreSQL", "SMS Integration"],
    color: "from-blue-600 to-indigo-600"
  },
  {
    id: "hospital-hms",
    name: "Hospital Management System",
    category: "Healthcare",
    description: "Complete HMS with patient records, appointments, pharmacy, billing, and lab management.",
    url: "/demo/hospital-hms",
    icon: HealthIcon,
    status: "ACTIVE",
    features: ["Patient Records", "Appointments", "Pharmacy", "Lab Reports"],
    frontend: ["React", "TypeScript", "Medical UI"],
    backend: ["Node.js", "PostgreSQL", "HL7 FHIR"],
    color: "from-emerald-600 to-teal-600"
  },
  {
    id: "ecommerce-store",
    name: "E-Commerce Platform",
    category: "Retail & POS",
    description: "Full-featured online store with cart, payments, inventory, and admin dashboard.",
    url: "/demo/ecommerce-store",
    icon: ShoppingCart,
    status: "ACTIVE",
    features: ["Product Catalog", "Shopping Cart", "Payment Gateway", "Order Management"],
    frontend: ["React", "TypeScript", "Responsive"],
    backend: ["Node.js", "PostgreSQL", "Stripe/Razorpay"],
    color: "from-purple-600 to-pink-600"
  },
  {
    id: "hotel-booking",
    name: "Hotel Booking System",
    category: "Hospitality",
    description: "Hotel management with room booking, guest management, billing, and housekeeping.",
    url: "/demo/hotel-booking",
    icon: Hotel,
    status: "ACTIVE",
    features: ["Room Booking", "Guest Management", "Billing", "Housekeeping"],
    frontend: ["React", "TypeScript", "Calendar"],
    backend: ["Node.js", "PostgreSQL", "Channel Manager"],
    color: "from-amber-600 to-orange-600"
  },
  {
    id: "real-estate",
    name: "Real Estate Portal",
    category: "Real Estate",
    description: "Property listing platform with search, filters, agent management, and lead tracking.",
    url: "/demo/real-estate",
    icon: Home,
    status: "ACTIVE",
    features: ["Property Listings", "Search & Filters", "Agent Portal", "Lead Management"],
    frontend: ["React", "TypeScript", "Maps API"],
    backend: ["Node.js", "PostgreSQL", "Geo-location"],
    color: "from-emerald-600 to-green-600"
  },
  {
    id: "automotive",
    name: "Auto Dealer System",
    category: "Automotive",
    description: "Vehicle dealership management with inventory, sales, service booking, and CRM.",
    url: "/demo/automotive",
    icon: Car,
    status: "ACTIVE",
    features: ["Vehicle Inventory", "Sales Management", "Service Booking", "Customer CRM"],
    frontend: ["React", "TypeScript", "Gallery"],
    backend: ["Node.js", "PostgreSQL", "RTO Integration"],
    color: "from-slate-600 to-zinc-600"
  },
  {
    id: "travel",
    name: "Travel Booking Platform",
    category: "Travel & Tourism",
    description: "Travel agency platform with tour packages, flight booking, and hotel reservations.",
    url: "/demo/travel",
    icon: Plane,
    status: "ACTIVE",
    features: ["Tour Packages", "Flight Booking", "Hotel Reservation", "Itinerary"],
    frontend: ["React", "TypeScript", "Booking UI"],
    backend: ["Node.js", "PostgreSQL", "GDS API"],
    color: "from-sky-600 to-blue-600"
  },
  {
    id: "finance",
    name: "Finance & Loan Manager",
    category: "Finance & Banking",
    description: "Lending platform with loan management, EMI calculator, collections, and reporting.",
    url: "/demo/finance",
    icon: CreditCard,
    status: "ACTIVE",
    features: ["Loan Management", "EMI Calculator", "Collections", "Reports"],
    frontend: ["React", "TypeScript", "Charts"],
    backend: ["Node.js", "PostgreSQL", "Banking API"],
    color: "from-violet-600 to-purple-600"
  },
  {
    id: "manufacturing",
    name: "Factory ERP System",
    category: "Manufacturing",
    description: "Manufacturing ERP with production planning, inventory, quality control, and machine monitoring.",
    url: "/demo/manufacturing",
    icon: Factory,
    status: "ACTIVE",
    features: ["Production Planning", "Inventory", "Quality Control", "Machine Monitor"],
    frontend: ["React", "TypeScript", "Dashboard"],
    backend: ["Node.js", "PostgreSQL", "IoT Ready"],
    color: "from-zinc-600 to-stone-600"
  },
  {
    id: "gym",
    name: "Gym Management System",
    category: "Fitness & Gym",
    description: "Fitness center management with member management, class scheduling, and billing.",
    url: "/demo/gym",
    icon: Dumbbell,
    status: "ACTIVE",
    features: ["Member Management", "Class Schedule", "Billing", "Trainer Assign"],
    frontend: ["React", "TypeScript", "Calendar"],
    backend: ["Node.js", "PostgreSQL", "Biometric"],
    color: "from-red-600 to-rose-600"
  },
  {
    id: "salon",
    name: "Salon & Spa Booking",
    category: "Salon & Spa",
    description: "Beauty salon management with appointment booking, staff scheduling, and billing.",
    url: "/demo/salon",
    icon: Scissors,
    status: "ACTIVE",
    features: ["Appointment Booking", "Staff Schedule", "Services Menu", "Billing"],
    frontend: ["React", "TypeScript", "Booking UI"],
    backend: ["Node.js", "PostgreSQL", "SMS Reminder"],
    color: "from-pink-600 to-fuchsia-600"
  },
  {
    id: "legal",
    name: "Legal Practice Manager",
    category: "Legal Services",
    description: "Law firm management with case tracking, client management, billing, and document handling.",
    url: "/demo/legal",
    icon: Scale,
    status: "ACTIVE",
    features: ["Case Management", "Client Portal", "Billing", "Documents"],
    frontend: ["React", "TypeScript", "Document UI"],
    backend: ["Node.js", "PostgreSQL", "E-Sign"],
    color: "from-slate-600 to-gray-600"
  },
  {
    id: "security",
    name: "Security Guard System",
    category: "Security",
    description: "Security agency management with guard tracking, patrol monitoring, and incident reporting.",
    url: "/demo/security",
    icon: Shield,
    status: "ACTIVE",
    features: ["Guard Tracking", "Patrol Monitor", "Incident Report", "Camera Feed"],
    frontend: ["React", "TypeScript", "Maps"],
    backend: ["Node.js", "PostgreSQL", "GPS Tracking"],
    color: "from-gray-600 to-slate-600"
  },
  {
    id: "telecom",
    name: "Mobile Store & Recharge",
    category: "Telecom",
    description: "Mobile shop management with inventory, recharge portal, and service center.",
    url: "/demo/telecom",
    icon: Smartphone,
    status: "ACTIVE",
    features: ["Phone Inventory", "Recharge Portal", "Service Center", "Customer DB"],
    frontend: ["React", "TypeScript", "E-commerce"],
    backend: ["Node.js", "PostgreSQL", "Recharge API"],
    color: "from-blue-600 to-indigo-600"
  },
  {
    id: "childcare",
    name: "Childcare Center System",
    category: "Childcare",
    description: "Daycare management with child attendance, parent communication, and activity tracking.",
    url: "/demo/childcare",
    icon: Baby,
    status: "ACTIVE",
    features: ["Child Attendance", "Parent Portal", "Activity Log", "Photo Sharing"],
    frontend: ["React", "TypeScript", "Parent App"],
    backend: ["Node.js", "PostgreSQL", "Push Notify"],
    color: "from-pink-400 to-purple-400"
  },
  {
    id: "petcare",
    name: "Pet Care & Vet Clinic",
    category: "Pet Care",
    description: "Veterinary clinic and pet shop management with appointments, records, and grooming.",
    url: "/demo/petcare",
    icon: Dog,
    status: "ACTIVE",
    features: ["Pet Records", "Appointments", "Grooming", "Pet Shop"],
    frontend: ["React", "TypeScript", "Pet UI"],
    backend: ["Node.js", "PostgreSQL", "Reminder"],
    color: "from-amber-400 to-orange-400"
  },
  {
    id: "event",
    name: "Event & Wedding Planner",
    category: "Events & Wedding",
    description: "Event management with vendor booking, venue management, and budget tracking.",
    url: "/demo/event",
    icon: PartyPopper,
    status: "ACTIVE",
    features: ["Event Planning", "Vendor Booking", "Venue Manage", "Budget Track"],
    frontend: ["React", "TypeScript", "Planner UI"],
    backend: ["Node.js", "PostgreSQL", "Vendor API"],
    color: "from-rose-600 to-pink-600"
  },
  {
    id: "crm",
    name: "Sales CRM System",
    category: "Business",
    description: "Customer relationship management with lead tracking, deals pipeline, and reporting.",
    url: "/demo/crm",
    icon: Users,
    status: "ACTIVE",
    features: ["Lead Management", "Deal Pipeline", "Activity Track", "Reports"],
    frontend: ["React", "TypeScript", "Dashboard"],
    backend: ["Node.js", "PostgreSQL", "Email API"],
    color: "from-blue-600 to-violet-600"
  },
  {
    id: "logistics",
    name: "Logistics & Fleet Manager",
    category: "Logistics",
    description: "Fleet and logistics management with shipment tracking, driver management, and route optimization.",
    url: "/demo/logistics",
    icon: Truck,
    status: "ACTIVE",
    features: ["Fleet Tracking", "Shipment Status", "Driver Manage", "Route Optimize"],
    frontend: ["React", "TypeScript", "Maps"],
    backend: ["Node.js", "PostgreSQL", "GPS API"],
    color: "from-emerald-600 to-teal-600"
  }
];

const categories = [
  "All", "Retail & POS", "Education", "Healthcare", "Restaurant", 
  "Logistics", "Business", "Real Estate", "Hospitality", "Finance & Banking",
  "Manufacturing", "Fitness & Gym", "Salon & Spa", "Automotive", "Travel & Tourism"
];

export default function PremiumDemoShowcase() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredDemos = allDemos.filter(demo => {
    const matchesCategory = activeCategory === "All" || demo.category === activeCategory;
    const matchesSearch = demo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          demo.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1e36] to-[#0a1628]">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 py-3 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={softwareValaLogo} alt="Software Vala" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <span className="text-white font-bold text-lg">Software Vala</span>
              <span className="text-white/80 text-sm ml-2">- The Name of Trust</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-white/20 text-white border-0 animate-pulse">
              🎉 New Year Sale - 40% OFF! 🎉
            </Badge>
            <Badge className="bg-white text-orange-600 font-bold">40% OFF</Badge>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="bg-[#0d1e36]/80 backdrop-blur-sm border-b border-cyan-500/20 py-4 px-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search demos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1a2d4a] border-cyan-500/30 text-white placeholder:text-gray-400"
              />
            </div>
            <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
              <Filter className="h-4 w-4 mr-2" /> Filters
            </Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className={activeCategory === cat 
                  ? "bg-cyan-500 text-white hover:bg-cyan-600" 
                  : "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200"
                }
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Grid */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDemos.map(demo => {
            const Icon = demo.icon;
            return (
              <Card key={demo.id} className="bg-[#1a2d4a]/80 border-cyan-500/20 overflow-hidden hover:border-cyan-400/50 transition-all group">
                {/* Card Header with Status & Favorite */}
                <div className={`h-40 bg-gradient-to-br ${demo.color} relative flex items-center justify-center`}>
                  <Badge className="absolute top-3 left-3 bg-emerald-500 text-white text-xs">
                    {demo.status === "ACTIVE" ? "ACTIVE" : "COMING SOON"}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => toggleFavorite(demo.id)}
                    className="absolute top-3 right-3 text-white hover:bg-white/20"
                  >
                    <Heart className={`h-5 w-5 ${favorites.includes(demo.id) ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Category */}
                  <p className="text-cyan-400 text-xs font-medium uppercase tracking-wide mb-2">
                    {demo.category}
                  </p>
                  
                  {/* Title & Description */}
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{demo.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{demo.description}</p>

                  {/* Features */}
                  <div className="mb-3">
                    <p className="text-cyan-400 text-xs font-medium mb-1">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {demo.features.slice(0, 3).map((f, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-cyan-500/30 text-cyan-300">
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div>
                      <p className="text-emerald-400 font-medium flex items-center gap-1">
                        <Monitor className="h-3 w-3" /> Frontend
                      </p>
                      <p className="text-gray-400">{demo.frontend.slice(0, 2).join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-orange-400 font-medium flex items-center gap-1">
                        <Server className="h-3 w-3" /> Backend
                      </p>
                      <p className="text-gray-400">{demo.backend.slice(0, 2).join(", ")}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-3">
                    <Button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white text-sm">
                      Buy Now
                    </Button>
                    <Link to={demo.url} className="flex-1">
                      <Button variant="outline" className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 text-sm">
                        <Play className="h-4 w-4 mr-1" /> Start Demo
                      </Button>
                    </Link>
                  </div>

                  {/* Secondary Actions */}
                  <div className="flex justify-between text-xs">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400 p-0 h-auto">
                      <ShoppingCart className="h-4 w-4 mr-1" /> Add to Cart
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400 p-0 h-auto">
                      <Lightbulb className="h-4 w-4 mr-1" /> Suggestions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredDemos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No demos found matching your criteria.</p>
          </div>
        )}
      </main>

      {/* Copyright & Trademark Footer */}
      <footer className="bg-[#0a1628] border-t border-cyan-500/20 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            <div className="flex items-center gap-3">
              <img src={softwareValaLogo} alt="Software Vala" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <p className="text-white font-bold text-lg">Software Vala</p>
                <p className="text-cyan-400 text-sm">The Name of Trust</p>
              </div>
            </div>
            <div className="flex gap-6 text-gray-400 text-sm">
              <span className="hover:text-cyan-400 cursor-pointer">Terms of Service</span>
              <span className="hover:text-cyan-400 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-cyan-400 cursor-pointer">Refund Policy</span>
              <span className="hover:text-cyan-400 cursor-pointer">Contact Us</span>
            </div>
          </div>
          
          {/* Trademark & Copyright Notice */}
          <div className="border-t border-cyan-500/10 pt-6">
            <div className="text-center space-y-3">
              <p className="text-white font-medium">
                © 2026 Software Vala™. All Rights Reserved.
              </p>
              <p className="text-red-400 font-semibold text-sm">
                ⚠️ STRICTLY PROHIBITED: Unauthorized reproduction, distribution, or modification of any content, demos, or software is a violation of Software Vala's intellectual property rights.
              </p>
              <p className="text-gray-400 text-xs max-w-4xl mx-auto">
                Software Vala® and the Software Vala logo are registered trademarks. All product names, logos, and brands are property of their respective owners. 
                Any unauthorized use, copying, or distribution of Software Vala's proprietary software, demos, documentation, or any related materials is strictly prohibited 
                and may result in severe civil and criminal penalties. Violators will be prosecuted to the maximum extent possible under law.
              </p>
              <div className="flex justify-center gap-4 text-xs text-gray-500">
                <span>🔒 SSL Secured</span>
                <span>•</span>
                <span>📜 ISO Certified</span>
                <span>•</span>
                <span>✓ Trademark Protected</span>
                <span>•</span>
                <span>⚖️ Legal Action for Violations</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
