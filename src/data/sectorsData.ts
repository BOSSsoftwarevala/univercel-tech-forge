import {
  GraduationCap, Building2, ShoppingCart, Stethoscope, Utensils,
  Hotel, Car, Plane, Home, Briefcase, Factory, Truck, CreditCard,
  Users, Heart, Dumbbell, Music, Film, Camera, Palette,
  BookOpen, Newspaper, Radio, Tv, Gamepad2, Trophy, Shirt,
  Watch, Gem, Flower2, Baby, Dog, TreeDeciduous, Sun,
  Leaf, Fish, Wheat, Tractor, Wrench, Hammer, Scissors,
  Paintbrush, Printer, Monitor, Smartphone, Laptop, Server, Wifi,
  Lock, Shield, Scale, Gavel
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface SubCategory {
  id: string;
  name: string;
  icon: LucideIcon;
}

export interface Sector {
  id: string;
  name: string;
  icon: LucideIcon;
  subCategories: SubCategory[];
}

export const sectorsData: Sector[] = [
  {
    id: "education",
    name: "Education",
    icon: GraduationCap,
    subCategories: [
      { id: "school", name: "School Management", icon: BookOpen },
      { id: "college", name: "College ERP", icon: GraduationCap },
      { id: "lms", name: "Learning Management", icon: Laptop }
    ]
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: Stethoscope,
    subCategories: [
      { id: "hospital", name: "Hospital Management", icon: Building2 },
      { id: "clinic", name: "Clinic Software", icon: Stethoscope },
      { id: "pharmacy", name: "Pharmacy System", icon: Heart }
    ]
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    icon: ShoppingCart,
    subCategories: [
      { id: "marketplace", name: "Marketplace", icon: ShoppingCart },
      { id: "b2b", name: "B2B Platform", icon: Briefcase },
      { id: "grocery", name: "Grocery Store", icon: Wheat }
    ]
  },
  {
    id: "hospitality",
    name: "Hospitality",
    icon: Hotel,
    subCategories: [
      { id: "hotel", name: "Hotel Booking", icon: Hotel },
      { id: "restaurant", name: "Restaurant POS", icon: Utensils },
      { id: "resort", name: "Resort Management", icon: Sun }
    ]
  },
  {
    id: "realestate",
    name: "Real Estate",
    icon: Home,
    subCategories: [
      { id: "property", name: "Property Listing", icon: Home },
      { id: "rental", name: "Rental Management", icon: Building2 },
      { id: "construction", name: "Construction ERP", icon: Hammer }
    ]
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: Car,
    subCategories: [
      { id: "dealer", name: "Car Dealership", icon: Car },
      { id: "garage", name: "Garage Management", icon: Wrench },
      { id: "rental-car", name: "Car Rental", icon: Car }
    ]
  },
  {
    id: "travel",
    name: "Travel & Tourism",
    icon: Plane,
    subCategories: [
      { id: "booking", name: "Travel Booking", icon: Plane },
      { id: "tour", name: "Tour Operator", icon: Camera },
      { id: "visa", name: "Visa Services", icon: Briefcase }
    ]
  },
  {
    id: "finance",
    name: "Finance & Banking",
    icon: CreditCard,
    subCategories: [
      { id: "banking", name: "Banking System", icon: Building2 },
      { id: "accounting", name: "Accounting Software", icon: CreditCard },
      { id: "investment", name: "Investment Platform", icon: Trophy }
    ]
  },
  {
    id: "hr",
    name: "HR & Payroll",
    icon: Users,
    subCategories: [
      { id: "hrm", name: "HRM System", icon: Users },
      { id: "payroll", name: "Payroll Management", icon: CreditCard },
      { id: "recruitment", name: "Recruitment Portal", icon: Briefcase }
    ]
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: Factory,
    subCategories: [
      { id: "erp", name: "Manufacturing ERP", icon: Factory },
      { id: "inventory", name: "Inventory System", icon: Truck },
      { id: "quality", name: "Quality Control", icon: Shield }
    ]
  },
  {
    id: "logistics",
    name: "Logistics",
    icon: Truck,
    subCategories: [
      { id: "delivery", name: "Delivery Management", icon: Truck },
      { id: "warehouse", name: "Warehouse System", icon: Building2 },
      { id: "fleet", name: "Fleet Management", icon: Car }
    ]
  },
  {
    id: "retail",
    name: "Retail & POS",
    icon: ShoppingCart,
    subCategories: [
      { id: "pos", name: "POS System", icon: CreditCard },
      { id: "supermarket", name: "Supermarket", icon: ShoppingCart },
      { id: "fashion", name: "Fashion Store", icon: Shirt }
    ]
  },
  {
    id: "fitness",
    name: "Fitness & Gym",
    icon: Dumbbell,
    subCategories: [
      { id: "gym", name: "Gym Management", icon: Dumbbell },
      { id: "yoga", name: "Yoga Studio", icon: Heart },
      { id: "sports", name: "Sports Club", icon: Trophy }
    ]
  },
  {
    id: "salon",
    name: "Salon & Spa",
    icon: Scissors,
    subCategories: [
      { id: "salon", name: "Salon Booking", icon: Scissors },
      { id: "spa", name: "Spa Management", icon: Flower2 },
      { id: "beauty", name: "Beauty Parlor", icon: Heart }
    ]
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: Film,
    subCategories: [
      { id: "cinema", name: "Cinema Booking", icon: Film },
      { id: "events", name: "Event Management", icon: Music },
      { id: "gaming", name: "Gaming Center", icon: Gamepad2 }
    ]
  },
  {
    id: "media",
    name: "Media & News",
    icon: Newspaper,
    subCategories: [
      { id: "news", name: "News Portal", icon: Newspaper },
      { id: "magazine", name: "Magazine CMS", icon: BookOpen },
      { id: "broadcast", name: "Broadcasting", icon: Radio }
    ]
  },
  {
    id: "photography",
    name: "Photography",
    icon: Camera,
    subCategories: [
      { id: "studio", name: "Photo Studio", icon: Camera },
      { id: "gallery", name: "Gallery Management", icon: Palette },
      { id: "portfolio", name: "Portfolio Builder", icon: Monitor }
    ]
  },
  {
    id: "music",
    name: "Music & Audio",
    icon: Music,
    subCategories: [
      { id: "streaming", name: "Music Streaming", icon: Music },
      { id: "podcast", name: "Podcast Platform", icon: Radio },
      { id: "recording", name: "Recording Studio", icon: Music }
    ]
  },
  {
    id: "video",
    name: "Video & Streaming",
    icon: Tv,
    subCategories: [
      { id: "ott", name: "OTT Platform", icon: Tv },
      { id: "video-call", name: "Video Conferencing", icon: Monitor },
      { id: "live", name: "Live Streaming", icon: Film }
    ]
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: Gamepad2,
    subCategories: [
      { id: "esports", name: "E-Sports Platform", icon: Trophy },
      { id: "arcade", name: "Arcade Management", icon: Gamepad2 },
      { id: "betting", name: "Fantasy Sports", icon: Trophy }
    ]
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: Shirt,
    subCategories: [
      { id: "clothing", name: "Clothing Store", icon: Shirt },
      { id: "tailor", name: "Tailor Management", icon: Scissors },
      { id: "designer", name: "Fashion Designer", icon: Palette }
    ]
  },
  {
    id: "jewelry",
    name: "Jewelry",
    icon: Gem,
    subCategories: [
      { id: "jeweler", name: "Jewelry Store", icon: Gem },
      { id: "goldsmith", name: "Goldsmith ERP", icon: Gem },
      { id: "watch", name: "Watch Store", icon: Watch }
    ]
  },
  {
    id: "childcare",
    name: "Childcare",
    icon: Baby,
    subCategories: [
      { id: "daycare", name: "Daycare Center", icon: Baby },
      { id: "preschool", name: "Preschool", icon: GraduationCap },
      { id: "nanny", name: "Nanny Service", icon: Heart }
    ]
  },
  {
    id: "petcare",
    name: "Pet Care",
    icon: Dog,
    subCategories: [
      { id: "petshop", name: "Pet Shop", icon: Dog },
      { id: "vet", name: "Veterinary Clinic", icon: Stethoscope },
      { id: "grooming", name: "Pet Grooming", icon: Scissors }
    ]
  },
  {
    id: "agriculture",
    name: "Agriculture",
    icon: Tractor,
    subCategories: [
      { id: "farm", name: "Farm Management", icon: Tractor },
      { id: "dairy", name: "Dairy Farm", icon: Leaf },
      { id: "agri-market", name: "Agri Marketplace", icon: Wheat }
    ]
  },
  {
    id: "environment",
    name: "Environment",
    icon: TreeDeciduous,
    subCategories: [
      { id: "waste", name: "Waste Management", icon: Leaf },
      { id: "solar", name: "Solar Energy", icon: Sun },
      { id: "recycling", name: "Recycling Center", icon: TreeDeciduous }
    ]
  },
  {
    id: "fishing",
    name: "Fishing & Marine",
    icon: Fish,
    subCategories: [
      { id: "fishery", name: "Fishery Management", icon: Fish },
      { id: "aquarium", name: "Aquarium Store", icon: Fish },
      { id: "seafood", name: "Seafood Market", icon: ShoppingCart }
    ]
  },
  {
    id: "printing",
    name: "Printing & Design",
    icon: Printer,
    subCategories: [
      { id: "print-shop", name: "Print Shop", icon: Printer },
      { id: "design", name: "Design Agency", icon: Palette },
      { id: "signage", name: "Signage Company", icon: Paintbrush }
    ]
  },
  {
    id: "it",
    name: "IT & Software",
    icon: Monitor,
    subCategories: [
      { id: "saas", name: "SaaS Platform", icon: Server },
      { id: "helpdesk", name: "IT Helpdesk", icon: Monitor },
      { id: "hosting", name: "Web Hosting", icon: Wifi }
    ]
  },
  {
    id: "telecom",
    name: "Telecom",
    icon: Smartphone,
    subCategories: [
      { id: "mobile", name: "Mobile Store", icon: Smartphone },
      { id: "recharge", name: "Recharge Portal", icon: CreditCard },
      { id: "network", name: "Network Provider", icon: Wifi }
    ]
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    subCategories: [
      { id: "cctv", name: "CCTV Systems", icon: Camera },
      { id: "guard", name: "Security Agency", icon: Shield },
      { id: "access", name: "Access Control", icon: Lock }
    ]
  },
  {
    id: "legal",
    name: "Legal",
    icon: Scale,
    subCategories: [
      { id: "law-firm", name: "Law Firm", icon: Scale },
      { id: "court", name: "Court Management", icon: Gavel },
      { id: "notary", name: "Notary Services", icon: Briefcase }
    ]
  },
  {
    id: "government",
    name: "Government",
    icon: Building2,
    subCategories: [
      { id: "municipality", name: "Municipality", icon: Building2 },
      { id: "tax", name: "Tax Portal", icon: CreditCard },
      { id: "citizen", name: "Citizen Services", icon: Users }
    ]
  },
  {
    id: "ngo",
    name: "NGO & Charity",
    icon: Heart,
    subCategories: [
      { id: "donation", name: "Donation Platform", icon: Heart },
      { id: "volunteer", name: "Volunteer Portal", icon: Users },
      { id: "campaign", name: "Campaign Manager", icon: Trophy }
    ]
  },
  {
    id: "religion",
    name: "Religious",
    icon: Building2,
    subCategories: [
      { id: "temple", name: "Temple Management", icon: Building2 },
      { id: "church", name: "Church Software", icon: Building2 },
      { id: "mosque", name: "Mosque System", icon: Building2 }
    ]
  },
  {
    id: "wedding",
    name: "Wedding",
    icon: Heart,
    subCategories: [
      { id: "planner", name: "Wedding Planner", icon: Heart },
      { id: "venue", name: "Venue Booking", icon: Building2 },
      { id: "catering", name: "Catering Service", icon: Utensils }
    ]
  },
  {
    id: "funeral",
    name: "Funeral Services",
    icon: Flower2,
    subCategories: [
      { id: "funeral-home", name: "Funeral Home", icon: Building2 },
      { id: "memorial", name: "Memorial Service", icon: Flower2 },
      { id: "cemetery", name: "Cemetery Management", icon: TreeDeciduous }
    ]
  },
  {
    id: "laundry",
    name: "Laundry",
    icon: Shirt,
    subCategories: [
      { id: "dry-clean", name: "Dry Cleaning", icon: Shirt },
      { id: "laundromat", name: "Laundromat", icon: Wrench },
      { id: "ironing", name: "Ironing Service", icon: Shirt }
    ]
  },
  {
    id: "cleaning",
    name: "Cleaning Services",
    icon: Home,
    subCategories: [
      { id: "home-clean", name: "Home Cleaning", icon: Home },
      { id: "office-clean", name: "Office Cleaning", icon: Building2 },
      { id: "pest", name: "Pest Control", icon: Shield }
    ]
  },
  {
    id: "moving",
    name: "Moving & Storage",
    icon: Truck,
    subCategories: [
      { id: "movers", name: "Moving Company", icon: Truck },
      { id: "storage", name: "Storage Units", icon: Building2 },
      { id: "packing", name: "Packing Service", icon: Briefcase }
    ]
  },
  {
    id: "courier",
    name: "Courier",
    icon: Truck,
    subCategories: [
      { id: "express", name: "Express Delivery", icon: Truck },
      { id: "parcel", name: "Parcel Service", icon: Briefcase },
      { id: "tracking", name: "Shipment Tracking", icon: Monitor }
    ]
  },
  {
    id: "food",
    name: "Food Delivery",
    icon: Utensils,
    subCategories: [
      { id: "food-app", name: "Food Ordering App", icon: Smartphone },
      { id: "cloud-kitchen", name: "Cloud Kitchen", icon: Utensils },
      { id: "meal-plan", name: "Meal Planning", icon: Heart }
    ]
  },
  {
    id: "grocery",
    name: "Grocery",
    icon: ShoppingCart,
    subCategories: [
      { id: "grocery-store", name: "Grocery Store", icon: ShoppingCart },
      { id: "organic", name: "Organic Market", icon: Leaf },
      { id: "wholesale", name: "Wholesale", icon: Truck }
    ]
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    icon: Heart,
    subCategories: [
      { id: "drug-store", name: "Drug Store", icon: Heart },
      { id: "medical-supply", name: "Medical Supply", icon: Stethoscope },
      { id: "online-pharma", name: "Online Pharmacy", icon: ShoppingCart }
    ]
  },
  {
    id: "optical",
    name: "Optical",
    icon: Monitor,
    subCategories: [
      { id: "eyewear", name: "Eyewear Store", icon: Monitor },
      { id: "lens", name: "Contact Lens", icon: Monitor },
      { id: "eye-clinic", name: "Eye Clinic", icon: Stethoscope }
    ]
  },
  {
    id: "dental",
    name: "Dental",
    icon: Stethoscope,
    subCategories: [
      { id: "dental-clinic", name: "Dental Clinic", icon: Stethoscope },
      { id: "orthodontics", name: "Orthodontics", icon: Heart },
      { id: "dental-lab", name: "Dental Lab", icon: Factory }
    ]
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: Shield,
    subCategories: [
      { id: "life", name: "Life Insurance", icon: Heart },
      { id: "vehicle", name: "Vehicle Insurance", icon: Car },
      { id: "health", name: "Health Insurance", icon: Stethoscope }
    ]
  },
  {
    id: "trading",
    name: "Trading",
    icon: Trophy,
    subCategories: [
      { id: "stock", name: "Stock Trading", icon: Trophy },
      { id: "forex", name: "Forex Platform", icon: CreditCard },
      { id: "crypto", name: "Crypto Exchange", icon: Lock }
    ]
  },
  {
    id: "coworking",
    name: "Co-Working",
    icon: Building2,
    subCategories: [
      { id: "space", name: "Co-Working Space", icon: Building2 },
      { id: "meeting", name: "Meeting Rooms", icon: Users },
      { id: "virtual", name: "Virtual Office", icon: Monitor }
    ]
  },
  {
    id: "parking",
    name: "Parking",
    icon: Car,
    subCategories: [
      { id: "lot", name: "Parking Lot", icon: Car },
      { id: "valet", name: "Valet Service", icon: Car },
      { id: "smart", name: "Smart Parking", icon: Monitor }
    ]
  }
];

export const getSectorById = (id: string): Sector | undefined => {
  return sectorsData.find(sector => sector.id === id);
};

export const getSubCategoryById = (sectorId: string, subCategoryId: string): SubCategory | undefined => {
  const sector = getSectorById(sectorId);
  return sector?.subCategories.find(sub => sub.id === subCategoryId);
};
