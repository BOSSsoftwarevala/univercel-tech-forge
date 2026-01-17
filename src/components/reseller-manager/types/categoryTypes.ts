// Reseller Management Category Hierarchy Types

export interface NanoCategory {
  id: string;
  name: string;
  count: number;
  status: 'active' | 'inactive' | 'warning';
  microId: string;
}

export interface MicroCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  nanos: NanoCategory[];
  subId: string;
}

export interface SubCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  micros: MicroCategory[];
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
  subs: SubCategory[];
}

export interface CategoryPath {
  category?: Category;
  sub?: SubCategory;
  micro?: MicroCategory;
  nano?: NanoCategory;
}

export type CategoryLevel = 'category' | 'subcategory' | 'micro' | 'nano' | 'data';

export interface CategoryAction {
  type: 'view' | 'create' | 'edit' | 'approve' | 'reject' | 'suspend' | 'resume' | 'escalate' | 'export' | 'assign' | 'ai-review';
  label: string;
  icon: string;
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  requiresConfirmation?: boolean;
}
