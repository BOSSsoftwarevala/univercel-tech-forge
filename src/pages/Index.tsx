import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Play, Heart, ShoppingCart, Lightbulb, Filter, Search,
  Monitor, Server, Database, Code, Shield, Smartphone,
  GraduationCap, Heart as HealthIcon, Utensils, Hotel, Home, Car, Plane,
  CreditCard, Factory, Dumbbell, Scissors, Scale, Users, Truck,
  Baby, Dog, PartyPopper, Briefcase, Phone, Mail, MapPin, Star, Award, CheckCircle,
  Pill, Cake, Apple, BookOpen, Gem, Shirt, Droplets, Camera, Printer, Palette,
  Building, HardHat, Tractor, Milk, Package, Tv, Sofa, Trophy, Music, Drama
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
  price: string;
  discountPrice: string;
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
    color: "from-orange-600 to-red-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
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
    color: "from-blue-600 to-indigo-600",
    price: "₹59,999",
    discountPrice: "₹35,999"
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
    color: "from-emerald-600 to-teal-600",
    price: "₹79,999",
    discountPrice: "₹47,999"
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
    color: "from-purple-600 to-pink-600",
    price: "₹69,999",
    discountPrice: "₹41,999"
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
    color: "from-amber-600 to-orange-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
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
    color: "from-emerald-600 to-green-600",
    price: "₹64,999",
    discountPrice: "₹38,999"
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
    color: "from-slate-600 to-zinc-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
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
    color: "from-sky-600 to-blue-600",
    price: "₹74,999",
    discountPrice: "₹44,999"
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
    color: "from-violet-600 to-purple-600",
    price: "₹89,999",
    discountPrice: "₹53,999"
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
    color: "from-zinc-600 to-stone-600",
    price: "₹99,999",
    discountPrice: "₹59,999"
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
    color: "from-red-600 to-rose-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
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
    color: "from-pink-600 to-fuchsia-600",
    price: "₹34,999",
    discountPrice: "₹20,999"
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
    color: "from-slate-600 to-gray-600",
    price: "₹59,999",
    discountPrice: "₹35,999"
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
    color: "from-gray-600 to-slate-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
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
    color: "from-blue-600 to-indigo-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
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
    color: "from-pink-400 to-purple-400",
    price: "₹34,999",
    discountPrice: "₹20,999"
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
    color: "from-amber-400 to-orange-400",
    price: "₹39,999",
    discountPrice: "₹23,999"
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
    color: "from-rose-600 to-pink-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
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
    color: "from-blue-600 to-violet-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
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
    color: "from-emerald-600 to-teal-600",
    price: "₹64,999",
    discountPrice: "₹38,999"
  },
  // ============= COMING SOON DEMOS (20 More) =============
  {
    id: "pharmacy",
    name: "Pharmacy Management",
    category: "Pharmacy",
    description: "Complete pharmacy management with inventory, prescriptions, billing, and expiry tracking.",
    url: "#",
    icon: Pill,
    status: "COMING_SOON",
    features: ["Medicine Inventory", "Prescription Management", "Expiry Alerts", "Billing"],
    frontend: ["React", "TypeScript", "Medical UI"],
    backend: ["Node.js", "PostgreSQL", "Drug API"],
    color: "from-green-600 to-emerald-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "bakery",
    name: "Bakery & Cafe System",
    category: "Bakery & Cafe",
    description: "Bakery management with order booking, recipe management, and delivery tracking.",
    url: "#",
    icon: Cake,
    status: "COMING_SOON",
    features: ["Order Booking", "Recipe Management", "Delivery", "POS Billing"],
    frontend: ["React", "TypeScript", "Food UI"],
    backend: ["Node.js", "PostgreSQL", "Delivery API"],
    color: "from-amber-500 to-yellow-500",
    price: "₹34,999",
    discountPrice: "₹20,999"
  },
  {
    id: "grocery",
    name: "Grocery Store System",
    category: "Grocery",
    description: "Grocery store management with inventory, barcode scanning, and multi-branch support.",
    url: "#",
    icon: Apple,
    status: "COMING_SOON",
    features: ["Inventory Management", "Barcode Scanner", "Multi-Branch", "Online Orders"],
    frontend: ["React", "TypeScript", "POS UI"],
    backend: ["Node.js", "PostgreSQL", "Barcode API"],
    color: "from-green-500 to-lime-500",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },
  {
    id: "library",
    name: "Library Management",
    category: "Library",
    description: "Digital library system with book catalog, member management, and fine tracking.",
    url: "#",
    icon: BookOpen,
    status: "COMING_SOON",
    features: ["Book Catalog", "Member Cards", "Issue/Return", "Fine Management"],
    frontend: ["React", "TypeScript", "Library UI"],
    backend: ["Node.js", "PostgreSQL", "ISBN API"],
    color: "from-indigo-600 to-blue-600",
    price: "₹29,999",
    discountPrice: "₹17,999"
  },
  {
    id: "jewellery",
    name: "Jewellery Store System",
    category: "Jewellery",
    description: "Jewellery shop management with gold rate, inventory, billing, and customer tracking.",
    url: "#",
    icon: Gem,
    status: "COMING_SOON",
    features: ["Gold Rate Updates", "Stock Management", "Billing", "Customer History"],
    frontend: ["React", "TypeScript", "Luxury UI"],
    backend: ["Node.js", "PostgreSQL", "Rate API"],
    color: "from-yellow-500 to-amber-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
  },
  {
    id: "laundry",
    name: "Laundry Service System",
    category: "Laundry",
    description: "Laundry management with order tracking, pickup/delivery, and pricing management.",
    url: "#",
    icon: Droplets,
    status: "COMING_SOON",
    features: ["Order Tracking", "Pickup/Delivery", "Pricing", "SMS Alerts"],
    frontend: ["React", "TypeScript", "Service UI"],
    backend: ["Node.js", "PostgreSQL", "SMS API"],
    color: "from-cyan-500 to-blue-500",
    price: "₹29,999",
    discountPrice: "₹17,999"
  },
  {
    id: "photography",
    name: "Photography Studio",
    category: "Photography",
    description: "Studio management with booking, album creation, and photo gallery management.",
    url: "#",
    icon: Camera,
    status: "COMING_SOON",
    features: ["Booking System", "Album Creator", "Gallery", "Client Portal"],
    frontend: ["React", "TypeScript", "Gallery UI"],
    backend: ["Node.js", "PostgreSQL", "Cloud Storage"],
    color: "from-purple-600 to-violet-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "printing",
    name: "Printing Press System",
    category: "Printing",
    description: "Print shop management with job tracking, quotation, and production scheduling.",
    url: "#",
    icon: Printer,
    status: "COMING_SOON",
    features: ["Job Tracking", "Quotation", "Production", "Invoice"],
    frontend: ["React", "TypeScript", "Production UI"],
    backend: ["Node.js", "PostgreSQL", "Job API"],
    color: "from-gray-600 to-slate-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },
  {
    id: "interior",
    name: "Interior Design Studio",
    category: "Interior Design",
    description: "Interior design management with project tracking, 3D visualization, and client portal.",
    url: "#",
    icon: Palette,
    status: "COMING_SOON",
    features: ["Project Tracking", "3D Visualization", "Client Portal", "Material List"],
    frontend: ["React", "TypeScript", "Design UI"],
    backend: ["Node.js", "PostgreSQL", "3D API"],
    color: "from-pink-600 to-rose-600",
    price: "₹64,999",
    discountPrice: "₹38,999"
  },
  {
    id: "architect",
    name: "Architect Firm System",
    category: "Architecture",
    description: "Architecture firm management with project blueprints, client management, and billing.",
    url: "#",
    icon: Building,
    status: "COMING_SOON",
    features: ["Project Management", "Blueprint Storage", "Client Portal", "Billing"],
    frontend: ["React", "TypeScript", "CAD UI"],
    backend: ["Node.js", "PostgreSQL", "File Storage"],
    color: "from-slate-600 to-zinc-600",
    price: "₹69,999",
    discountPrice: "₹41,999"
  },
  {
    id: "construction",
    name: "Construction Company",
    category: "Construction",
    description: "Construction project management with site tracking, material management, and labor tracking.",
    url: "#",
    icon: HardHat,
    status: "COMING_SOON",
    features: ["Site Tracking", "Material Mgmt", "Labor Management", "Progress Reports"],
    frontend: ["React", "TypeScript", "Project UI"],
    backend: ["Node.js", "PostgreSQL", "GPS API"],
    color: "from-orange-600 to-amber-600",
    price: "₹79,999",
    discountPrice: "₹47,999"
  },
  {
    id: "agriculture",
    name: "Agriculture Farm System",
    category: "Agriculture",
    description: "Farm management with crop tracking, irrigation scheduling, and harvest management.",
    url: "#",
    icon: Tractor,
    status: "COMING_SOON",
    features: ["Crop Tracking", "Irrigation", "Harvest Mgmt", "Weather API"],
    frontend: ["React", "TypeScript", "Farm UI"],
    backend: ["Node.js", "PostgreSQL", "Weather API"],
    color: "from-green-600 to-emerald-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
  },
  {
    id: "dairy",
    name: "Dairy Management System",
    category: "Dairy",
    description: "Dairy farm management with milk collection, quality testing, and distribution.",
    url: "#",
    icon: Milk,
    status: "COMING_SOON",
    features: ["Milk Collection", "Quality Testing", "Distribution", "Farmer Payments"],
    frontend: ["React", "TypeScript", "Dairy UI"],
    backend: ["Node.js", "PostgreSQL", "IoT Ready"],
    color: "from-blue-400 to-cyan-400",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "courier",
    name: "Courier Service System",
    category: "Courier",
    description: "Courier management with parcel tracking, delivery assignment, and proof of delivery.",
    url: "#",
    icon: Package,
    status: "COMING_SOON",
    features: ["Parcel Tracking", "Delivery Assignment", "POD", "Route Optimization"],
    frontend: ["React", "TypeScript", "Tracking UI"],
    backend: ["Node.js", "PostgreSQL", "GPS API"],
    color: "from-red-600 to-orange-600",
    price: "₹54,999",
    discountPrice: "₹32,999"
  },
  {
    id: "fashion",
    name: "Fashion Store System",
    category: "Fashion",
    description: "Clothing store management with inventory, size management, and e-commerce integration.",
    url: "#",
    icon: Shirt,
    status: "COMING_SOON",
    features: ["Inventory", "Size Management", "E-commerce", "Barcode"],
    frontend: ["React", "TypeScript", "Fashion UI"],
    backend: ["Node.js", "PostgreSQL", "E-com API"],
    color: "from-pink-500 to-fuchsia-500",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "electronics",
    name: "Electronics Store System",
    category: "Electronics",
    description: "Electronics shop management with inventory, warranty tracking, and service center.",
    url: "#",
    icon: Tv,
    status: "COMING_SOON",
    features: ["Inventory", "Warranty Track", "Service Center", "POS"],
    frontend: ["React", "TypeScript", "Tech UI"],
    backend: ["Node.js", "PostgreSQL", "Serial API"],
    color: "from-blue-600 to-indigo-600",
    price: "₹49,999",
    discountPrice: "₹29,999"
  },
  {
    id: "furniture",
    name: "Furniture Store System",
    category: "Furniture",
    description: "Furniture shop management with catalog, custom orders, and delivery scheduling.",
    url: "#",
    icon: Sofa,
    status: "COMING_SOON",
    features: ["Product Catalog", "Custom Orders", "Delivery", "EMI Options"],
    frontend: ["React", "TypeScript", "Catalog UI"],
    backend: ["Node.js", "PostgreSQL", "Delivery API"],
    color: "from-amber-600 to-orange-600",
    price: "₹44,999",
    discountPrice: "₹26,999"
  },
  {
    id: "sports",
    name: "Sports Academy System",
    category: "Sports Academy",
    description: "Sports academy management with player registration, training schedules, and tournaments.",
    url: "#",
    icon: Trophy,
    status: "COMING_SOON",
    features: ["Player Registration", "Training Schedule", "Tournaments", "Performance"],
    frontend: ["React", "TypeScript", "Sports UI"],
    backend: ["Node.js", "PostgreSQL", "Stats API"],
    color: "from-green-600 to-teal-600",
    price: "₹39,999",
    discountPrice: "₹23,999"
  },
  {
    id: "music",
    name: "Music Academy System",
    category: "Music Academy",
    description: "Music school management with student enrollment, class scheduling, and recital management.",
    url: "#",
    icon: Music,
    status: "COMING_SOON",
    features: ["Student Enrollment", "Class Schedule", "Recitals", "Practice Rooms"],
    frontend: ["React", "TypeScript", "Music UI"],
    backend: ["Node.js", "PostgreSQL", "Audio API"],
    color: "from-purple-600 to-pink-600",
    price: "₹34,999",
    discountPrice: "₹20,999"
  },
  {
    id: "dance",
    name: "Dance Academy System",
    category: "Dance Academy",
    description: "Dance studio management with class booking, performance scheduling, and video lessons.",
    url: "#",
    icon: Drama,
    status: "COMING_SOON",
    features: ["Class Booking", "Performance", "Video Lessons", "Costume Mgmt"],
    frontend: ["React", "TypeScript", "Dance UI"],
    backend: ["Node.js", "PostgreSQL", "Video API"],
    color: "from-rose-600 to-red-600",
    price: "₹34,999",
    discountPrice: "₹20,999"
  }
];

const categories = [
  "All", "Retail & POS", "Education", "Healthcare", "Restaurant", 
  "Logistics", "Business", "Real Estate", "Hospitality", "Finance & Banking",
  "Manufacturing", "Fitness & Gym", "Salon & Spa", "Automotive", "Travel & Tourism",
  "Legal Services", "Security", "Telecom", "Childcare", "Pet Care", "Events & Wedding",
  "Pharmacy", "Bakery & Cafe", "Grocery", "Library", "Jewellery", "Laundry",
  "Photography", "Printing", "Interior Design", "Architecture", "Construction",
  "Agriculture", "Dairy", "Courier", "Fashion", "Electronics", "Furniture",
  "Sports Academy", "Music Academy", "Dance Academy"
];

const Index = () => {
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
      {/* Premium Header */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 py-4 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <img src={softwareValaLogo} alt="Software Vala" className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-lg" />
              <div>
                <h1 className="text-white font-bold text-2xl">Software Vala</h1>
                <p className="text-white/90 text-sm">- The Name of Trust</p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <Badge className="bg-white/20 text-white border-0 animate-pulse text-sm px-4 py-2">
                🎉 New Year Sale - 40% OFF! 🎉
              </Badge>
              <Badge className="bg-white text-orange-600 font-bold text-lg px-4 py-2">40% OFF</Badge>
              <Link to="/admin">
                <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-b from-[#0d1e36] to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-4">
              <Star className="h-3 w-3 mr-1" /> Premium Software Solutions
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              20+ Ready-to-Deploy <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Software Solutions</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
              Complete business software with modern design, powerful features, and full source code. 
              Start your business today with our premium solutions!
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="h-5 w-5" /> Full Source Code
              </div>
              <div className="flex items-center gap-2 text-cyan-400">
                <CheckCircle className="h-5 w-5" /> 1 Year Free Support
              </div>
              <div className="flex items-center gap-2 text-orange-400">
                <CheckCircle className="h-5 w-5" /> Free Installation
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <CheckCircle className="h-5 w-5" /> Lifetime Updates
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              {filteredDemos.length} Products
            </Badge>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.slice(0, 10).map(cat => (
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
          {filteredDemos.map((demo, index) => {
            const Icon = demo.icon;
            return (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="bg-[#1a2d4a]/80 border-cyan-500/20 overflow-hidden hover:border-cyan-400/50 transition-all group hover:shadow-xl hover:shadow-cyan-500/10">
                  {/* Card Header with Status & Favorite */}
                  <div className={`h-40 bg-gradient-to-br ${demo.color} relative flex items-center justify-center`}>
                    <Badge className={`absolute top-3 left-3 text-white text-xs ${demo.status === "ACTIVE" ? "bg-emerald-500" : "bg-orange-500 animate-pulse"}`}>
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
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3">
                      <Badge className="bg-white text-gray-800 font-bold text-xs line-through opacity-70 mr-1">
                        {demo.price}
                      </Badge>
                      <Badge className="bg-emerald-500 text-white font-bold">
                        {demo.discountPrice}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {/* Category */}
                    <p className="text-cyan-400 text-xs font-medium uppercase tracking-wide mb-2">
                      {demo.category}
                    </p>
                    
                    {/* Title & Description */}
                    <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">{demo.name}</h3>
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
                      <Button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs hover:from-orange-600 hover:to-red-600">
                        Buy Now
                      </Button>
                      <Link to={demo.url} className="flex-1">
                        <Button variant="outline" className="w-full border-cyan-500/50 text-cyan-400 text-xs hover:bg-cyan-500/10">
                          <Play className="h-3 w-3 mr-1" /> Demo
                        </Button>
                      </Link>
                    </div>

                    {/* Secondary Links */}
                    <div className="flex justify-between text-xs">
                      <button className="text-gray-400 hover:text-cyan-400 flex items-center gap-1">
                        <ShoppingCart className="h-3 w-3" /> Add to Cart
                      </button>
                      <button className="text-gray-400 hover:text-orange-400 flex items-center gap-1">
                        <Lightbulb className="h-3 w-3" /> Suggestions
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Contact Section */}
      <section className="py-12 px-4 bg-gradient-to-t from-[#0a1628] to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Contact Us</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="tel:+919876543210" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
              <Phone className="h-5 w-5" /> +91 98765 43210
            </a>
            <a href="mailto:info@softwarevala.com" className="flex items-center gap-2 text-orange-400 hover:text-orange-300">
              <Mail className="h-5 w-5" /> info@softwarevala.com
            </a>
            <span className="flex items-center gap-2 text-gray-400">
              <MapPin className="h-5 w-5" /> Ahmedabad, Gujarat, India
            </span>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-[#0a1628] border-t border-cyan-500/10 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <img src={softwareValaLogo} alt="Software Vala" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <span className="text-white font-bold text-xl">Software Vala</span>
                <span className="text-cyan-400 text-sm ml-2">™</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <Award className="h-3 w-3 mr-1" /> Trusted by 500+ Clients
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Shield className="h-3 w-3 mr-1" /> 100% Secure
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Star className="h-3 w-3 mr-1" /> 5 Star Rating
              </Badge>
            </div>

            {/* Copyright */}
            <div className="border-t border-cyan-500/10 pt-6 w-full text-center space-y-3">
              <p className="text-white font-medium">
                © 2026 Software Vala™. All Rights Reserved.
              </p>
              <p className="text-red-400 font-semibold text-sm">
                ⚠️ STRICTLY PROHIBITED: Unauthorized reproduction, distribution, or modification of any content, demos, or software is a violation of Software Vala's intellectual property rights.
              </p>
              <div className="text-gray-500 text-xs space-y-1">
                <p>📜 Software Vala™ is a registered trademark. All product names, logos, and brands are property of their respective owners.</p>
                <p>⚖️ Legal action will be taken against copyright infringement under the IT Act, 2000 and Copyright Act, 1957.</p>
                <p className="text-cyan-400">🔒 Protected by Indian Intellectual Property Laws</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
