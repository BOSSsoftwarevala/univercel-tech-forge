import {
  Briefcase, Store, Users, Award, Truck, Building2, 
  CreditCard, Heart, GraduationCap, Utensils, Hotel
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
  }
];

export const getSectorById = (id: string): Sector | undefined => {
  return sectorsData.find(sector => sector.id === id);
};

export const getSubCategoryById = (sectorId: string, subCatId: string): SubCategory | undefined => {
  const sector = getSectorById(sectorId);
  return sector?.subCategories.find(sub => sub.id === subCatId);
};
