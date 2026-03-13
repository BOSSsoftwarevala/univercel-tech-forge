import { LucideIcon } from "lucide-react";

export interface MarketplaceProduct {
  id: string;
  name: string;
  category: string;
  masterCategory: string;
  description: string;
  cloneOf: string;
  url: string;
  icon: LucideIcon;
  status: "ACTIVE" | "COMING_SOON";
  features: string[];
  frontend: string[];
  backend: string[];
  color: string;
  /** Fixed: $249 lifetime for all */
  price: "$249";
  discountPrice: "$249";
}
