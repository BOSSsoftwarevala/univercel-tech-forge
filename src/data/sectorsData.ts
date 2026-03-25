import {
  Briefcase, Store, Users, Award, Truck, Building2, 
  CreditCard, Heart, GraduationCap, Utensils, Hotel,
  Car, Plane, Home, Factory, Dumbbell, Scissors,
  Camera, Smartphone, Shield, Scale, Baby, Dog
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
    id: "business",
    name: "Business Solutions",
    icon: Briefcase,
    subCategories: [
      { id: "crm", name: "Customer Management", icon: Users },
      { id: "accounting", name: "Billing & Accounts", icon: CreditCard },
      { id: "erp", name: "Business Operations", icon: Briefcase }
    ]
  },
  {
    id: "retail",
    name: "Retail & Commerce",
    icon: Store,
    subCategories: [
      { id: "pos", name: "Point of Sale", icon: CreditCard },
      { id: "ecommerce", name: "Online Store", icon: Store },
      { id: "inventory", name: "Stock Management", icon: Truck }
    ]
  },
  {
    id: "services",
    name: "Service Industry",
    icon: Utensils,
    subCategories: [
      { id: "restaurant", name: "Food Service", icon: Utensils },
      { id: "hotel", name: "Hospitality", icon: Hotel },
      { id: "salon", name: "Beauty & Wellness", icon: Heart }
    ]
  },
  {
    id: "professional",
    name: "Professional Services",
    icon: Award,
    subCategories: [
      { id: "healthcare", name: "Medical Practice", icon: Heart },
      { id: "education", name: "Learning Center", icon: GraduationCap },
      { id: "consulting", name: "Consulting Firm", icon: Briefcase }
    ]
  },
  {
    id: "operations",
    name: "Operations",
    icon: Truck,
    subCategories: [
      { id: "logistics", name: "Delivery & Transport", icon: Truck },
      { id: "warehouse", name: "Storage & Inventory", icon: Building2 },
      { id: "workforce", name: "Team Management", icon: Users }
    ]
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: Heart,
    subCategories: [
      { id: "hospital", name: "Hospital System", icon: Building2 },
      { id: "clinic", name: "Clinic Manager", icon: Heart },
      { id: "pharmacy", name: "Pharmacy Store", icon: Heart }
    ]
  },
  {
    id: "education",
    name: "Education",
    icon: GraduationCap,
    subCategories: [
      { id: "school", name: "School System", icon: GraduationCap },
      { id: "college", name: "College Portal", icon: Building2 },
      { id: "coaching", name: "Coaching Center", icon: Users }
    ]
  },
  {
    id: "realestate",
    name: "Real Estate",
    icon: Home,
    subCategories: [
      { id: "property", name: "Property Listing", icon: Home },
      { id: "rental", name: "Rental Manager", icon: Building2 },
      { id: "builder", name: "Builder Portal", icon: Building2 }
    ]
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: Car,
    subCategories: [
      { id: "dealer", name: "Vehicle Sales", icon: Car },
      { id: "garage", name: "Service Center", icon: Car },
      { id: "rental", name: "Vehicle Rental", icon: Car }
    ]
  },
  {
    id: "travel",
    name: "Travel & Tourism",
    icon: Plane,
    subCategories: [
      { id: "booking", name: "Travel Booking", icon: Plane },
      { id: "tour", name: "Tour Operator", icon: Camera },
      { id: "transport", name: "Transport Service", icon: Car }
    ]
  },
  {
    id: "finance",
    name: "Finance & Banking",
    icon: CreditCard,
    subCategories: [
      { id: "banking", name: "Banking System", icon: Building2 },
      { id: "lending", name: "Loan Manager", icon: CreditCard },
      { id: "investment", name: "Investment Portal", icon: CreditCard }
    ]
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: Factory,
    subCategories: [
      { id: "production", name: "Production Manager", icon: Factory },
      { id: "quality", name: "Quality Control", icon: Shield },
      { id: "supply", name: "Supply Chain", icon: Truck }
    ]
  },
  {
    id: "fitness",
    name: "Fitness & Gym",
    icon: Dumbbell,
    subCategories: [
      { id: "gym", name: "Gym Manager", icon: Dumbbell },
      { id: "yoga", name: "Wellness Center", icon: Heart },
      { id: "sports", name: "Sports Club", icon: Dumbbell }
    ]
  },
  {
    id: "salon",
    name: "Salon & Spa",
    icon: Scissors,
    subCategories: [
      { id: "beauty", name: "Beauty Parlor", icon: Scissors },
      { id: "spa", name: "Spa Center", icon: Heart },
      { id: "grooming", name: "Grooming Studio", icon: Scissors }
    ]
  },
  {
    id: "legal",
    name: "Legal Services",
    icon: Scale,
    subCategories: [
      { id: "lawfirm", name: "Law Firm", icon: Scale },
      { id: "notary", name: "Notary Service", icon: Briefcase },
      { id: "compliance", name: "Compliance Manager", icon: Shield }
    ]
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    subCategories: [
      { id: "surveillance", name: "Surveillance System", icon: Camera },
      { id: "guards", name: "Security Agency", icon: Shield },
      { id: "access", name: "Access Control", icon: Shield }
    ]
  },
  {
    id: "telecom",
    name: "Telecom",
    icon: Smartphone,
    subCategories: [
      { id: "mobile", name: "Mobile Store", icon: Smartphone },
      { id: "recharge", name: "Recharge Portal", icon: CreditCard },
      { id: "service", name: "Service Center", icon: Smartphone }
    ]
  },
  {
    id: "childcare",
    name: "Childcare",
    icon: Baby,
    subCategories: [
      { id: "daycare", name: "Daycare Center", icon: Baby },
      { id: "preschool", name: "Preschool", icon: GraduationCap },
      { id: "playschool", name: "Play School", icon: Baby }
    ]
  },
  {
    id: "petcare",
    name: "Pet Care",
    icon: Dog,
    subCategories: [
      { id: "petshop", name: "Pet Shop", icon: Dog },
      { id: "vet", name: "Vet Clinic", icon: Heart },
      { id: "grooming", name: "Pet Grooming", icon: Scissors }
    ]
  },
  {
    id: "events",
    name: "Events & Wedding",
    icon: Camera,
    subCategories: [
      { id: "planner", name: "Event Planner", icon: Camera },
      { id: "venue", name: "Venue Booking", icon: Building2 },
      { id: "catering", name: "Catering Service", icon: Utensils }
    ]
  }
];

export const getSectorById = (id: string): Sector | undefined => {
  return sectorsData.find(sector => sector.id === id);
};

export const getSubCategoryById = (sectorId: string, subCatId: string): SubCategory | undefined => {
  const sector = getSectorById(sectorId);
  return sector?.subCategories.find(sub => sub.id === subCatId);
};
