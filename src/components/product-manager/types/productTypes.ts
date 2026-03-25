// Product Manager Enterprise Types

export type ProductStatus = 'active' | 'parked' | 'draft' | 'disabled';
export type PricingModel = 'one_time' | 'subscription' | 'tier_based' | 'country_based';
export type DemoStatus = 'active' | 'paused' | 'expired' | 'disabled';

export interface ProductCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  parent_id?: string | null;
  level: 'main' | 'sub' | 'micro' | 'nano';
  is_active: boolean;
  display_order: number;
  children?: ProductCategory[];
  product_count?: number;
}

export interface Product {
  product_id: string;
  product_code: string;
  product_name: string;
  product_type: 'software' | 'service' | 'digital' | 'physical';
  description: string;
  features: string[];
  status: ProductStatus;
  main_category_id: string;
  sub_category_id?: string;
  micro_category_id?: string;
  nano_category_id?: string;
  demo_url?: string;
  pricing_model: PricingModel;
  base_price?: number;
  currency: string;
  tech_stack?: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
  // Computed/joined fields
  category?: ProductCategory;
  subcategory?: ProductCategory;
  demos?: ProductDemo[];
  pricing_plans?: PricingPlan[];
  inventory?: ProductInventory;
}

export interface ProductDemo {
  demo_id: string;
  product_id: string;
  title: string;
  url: string;
  status: DemoStatus;
  starts_at: string;
  expires_at?: string;
  access_type: 'public' | 'private' | 'password';
  password?: string;
  max_users?: number;
  active_users: number;
  total_views: number;
  conversions: number;
  conversion_rate: number;
  created_at: string;
  updated_at: string;
}

export interface PricingPlan {
  plan_id: string;
  product_id: string;
  plan_name: string;
  pricing_model: PricingModel;
  price: number;
  currency: string;
  billing_cycle?: 'monthly' | 'quarterly' | 'yearly' | 'one_time';
  tier_level?: number;
  country_code?: string;
  franchise_override?: boolean;
  reseller_override?: boolean;
  discount_percent?: number;
  features_included: string[];
  is_active: boolean;
  created_at: string;
}

export interface ProductInventory {
  inventory_id: string;
  product_id: string;
  stock_type: 'unlimited' | 'limited' | 'license';
  total_stock: number;
  available_stock: number;
  reserved_stock: number;
  low_stock_threshold: number;
  auto_restock: boolean;
  license_count?: number;
  allocated_licenses?: number;
  last_restock_at?: string;
}

export interface ProductOrder {
  order_id: string;
  product_id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  plan_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  license_key?: string;
  invoice_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PMSidebarItem {
  id: string;
  label: string;
  icon: string;
  badge?: number | string;
  children?: PMSidebarItem[];
  locked?: boolean;
}

export interface PMKPICard {
  id: string;
  label: string;
  value: number;
  trend?: number;
  trendLabel?: string;
  icon: string;
  color: string;
  filterKey?: string;
  filterValue?: string;
}

export interface ProductActionLog {
  id: string;
  product_id: string;
  product_name: string;
  action: string;
  action_details?: Record<string, any>;
  performer_id: string;
  performer_role: string;
  ip_address?: string;
  created_at: string;
}
