/**
 * Module Catalog Service
 * Client-side service for Module → Category → Subcategory CRUD operations
 * Backed by: supabase/functions/api-module-catalog
 */

import { supabase } from '@/integrations/supabase/client';

// ============================================================
// TYPES
// ============================================================

export type ModuleStatus = 'active' | 'maintenance' | 'disabled';

export interface ModuleDefinition {
  id: string;
  module_key: string;
  name: string;
  description: string | null;
  icon: string | null;
  status: ModuleStatus;
  is_critical: boolean;
  sort_order: number;
  config: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ModuleCategory {
  id: string;
  module_id: string;
  category_key: string;
  name: string;
  description: string | null;
  icon: string | null;
  status: ModuleStatus;
  sort_order: number;
  config: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ModuleSubcategory {
  id: string;
  category_id: string;
  module_id: string;
  subcategory_key: string;
  name: string;
  description: string | null;
  icon: string | null;
  status: ModuleStatus;
  sort_order: number;
  config: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ModuleAccessRole {
  id: string;
  module_id: string;
  role: string;
  can_read: boolean;
  can_write: boolean;
  can_delete: boolean;
  can_admin: boolean;
  created_at: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

export type CreateModuleInput = Omit<ModuleDefinition, 'id' | 'created_by' | 'updated_by' | 'created_at' | 'updated_at'>;
export type UpdateModuleInput = Partial<Omit<CreateModuleInput, 'module_key'>>;

export type CreateCategoryInput = Omit<ModuleCategory, 'id' | 'module_id' | 'created_by' | 'updated_by' | 'created_at' | 'updated_at'>;
export type UpdateCategoryInput = Partial<Omit<CreateCategoryInput, 'category_key'>>;

export type CreateSubcategoryInput = Omit<ModuleSubcategory, 'id' | 'category_id' | 'module_id' | 'created_by' | 'updated_by' | 'created_at' | 'updated_at'>;
export type UpdateSubcategoryInput = Partial<Omit<CreateSubcategoryInput, 'subcategory_key'>>;

// ============================================================
// HELPERS
// ============================================================

type EdgeResult<T> = { data: T; error: null } | { data: null; error: Error };

async function callEdge<T>(path: string, options?: RequestInit): Promise<EdgeResult<T>> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api-module-catalog${path}`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...options,
      }
    );

    const json = await res.json();
    if (!res.ok || json.error) {
      return { data: null, error: new Error(json.error || json.message || `HTTP ${res.status}`) };
    }
    return { data: json as T, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// ============================================================
// MODULE CATALOG SERVICE
// ============================================================

export const moduleCatalogService = {
  // ---- Modules ----

  /** List all modules with optional status filter and pagination */
  async listModules(params?: {
    status?: ModuleStatus;
    page?: number;
    limit?: number;
  }): Promise<EdgeResult<PaginatedResult<ModuleDefinition>>> {
    const qs = new URLSearchParams();
    if (params?.status)  qs.set('status', params.status);
    if (params?.page)    qs.set('page',   String(params.page));
    if (params?.limit)   qs.set('limit',  String(params.limit));
    const query = qs.toString() ? `?${qs}` : '';
    return callEdge<PaginatedResult<ModuleDefinition>>(`/modules${query}`);
  },

  /** Get a single module with its categories and subcategories */
  async getModule(moduleId: string): Promise<EdgeResult<{ data: ModuleDefinition & { module_categories: (ModuleCategory & { module_subcategories: ModuleSubcategory[] })[] } }>> {
    return callEdge(`/modules/${moduleId}`);
  },

  /** Create a new module (admin only) */
  async createModule(input: CreateModuleInput): Promise<EdgeResult<{ data: ModuleDefinition }>> {
    return callEdge('/modules', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  /** Update a module (admin only) */
  async updateModule(moduleId: string, input: UpdateModuleInput): Promise<EdgeResult<{ data: ModuleDefinition }>> {
    return callEdge(`/modules/${moduleId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },

  /** Delete a module (admin only) */
  async deleteModule(moduleId: string): Promise<EdgeResult<{ success: boolean; message: string }>> {
    return callEdge(`/modules/${moduleId}`, { method: 'DELETE' });
  },

  // ---- Categories ----

  /** List categories within a module */
  async listCategories(moduleId: string, params?: {
    status?: ModuleStatus;
    page?: number;
    limit?: number;
  }): Promise<EdgeResult<PaginatedResult<ModuleCategory>>> {
    const qs = new URLSearchParams();
    if (params?.status)  qs.set('status', params.status);
    if (params?.page)    qs.set('page',   String(params.page));
    if (params?.limit)   qs.set('limit',  String(params.limit));
    const query = qs.toString() ? `?${qs}` : '';
    return callEdge<PaginatedResult<ModuleCategory>>(`/modules/${moduleId}/categories${query}`);
  },

  /** Get a single category with its subcategories */
  async getCategory(moduleId: string, categoryId: string): Promise<EdgeResult<{ data: ModuleCategory & { module_subcategories: ModuleSubcategory[] } }>> {
    return callEdge(`/modules/${moduleId}/categories/${categoryId}`);
  },

  /** Create a category within a module (admin only) */
  async createCategory(moduleId: string, input: CreateCategoryInput): Promise<EdgeResult<{ data: ModuleCategory }>> {
    return callEdge(`/modules/${moduleId}/categories`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  /** Update a category (admin only) */
  async updateCategory(moduleId: string, categoryId: string, input: UpdateCategoryInput): Promise<EdgeResult<{ data: ModuleCategory }>> {
    return callEdge(`/modules/${moduleId}/categories/${categoryId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },

  /** Delete a category (admin only) */
  async deleteCategory(moduleId: string, categoryId: string): Promise<EdgeResult<{ success: boolean; message: string }>> {
    return callEdge(`/modules/${moduleId}/categories/${categoryId}`, { method: 'DELETE' });
  },

  // ---- Subcategories ----

  /** List subcategories within a category */
  async listSubcategories(moduleId: string, categoryId: string, params?: {
    status?: ModuleStatus;
    page?: number;
    limit?: number;
  }): Promise<EdgeResult<PaginatedResult<ModuleSubcategory>>> {
    const qs = new URLSearchParams();
    if (params?.status)  qs.set('status', params.status);
    if (params?.page)    qs.set('page',   String(params.page));
    if (params?.limit)   qs.set('limit',  String(params.limit));
    const query = qs.toString() ? `?${qs}` : '';
    return callEdge<PaginatedResult<ModuleSubcategory>>(
      `/modules/${moduleId}/categories/${categoryId}/subcategories${query}`
    );
  },

  /** Get a single subcategory */
  async getSubcategory(moduleId: string, categoryId: string, subcategoryId: string): Promise<EdgeResult<{ data: ModuleSubcategory }>> {
    return callEdge(`/modules/${moduleId}/categories/${categoryId}/subcategories/${subcategoryId}`);
  },

  /** Create a subcategory within a category (admin only) */
  async createSubcategory(moduleId: string, categoryId: string, input: CreateSubcategoryInput): Promise<EdgeResult<{ data: ModuleSubcategory }>> {
    return callEdge(`/modules/${moduleId}/categories/${categoryId}/subcategories`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  /** Update a subcategory (admin only) */
  async updateSubcategory(moduleId: string, categoryId: string, subcategoryId: string, input: UpdateSubcategoryInput): Promise<EdgeResult<{ data: ModuleSubcategory }>> {
    return callEdge(`/modules/${moduleId}/categories/${categoryId}/subcategories/${subcategoryId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },

  /** Delete a subcategory (admin only) */
  async deleteSubcategory(moduleId: string, categoryId: string, subcategoryId: string): Promise<EdgeResult<{ success: boolean; message: string }>> {
    return callEdge(
      `/modules/${moduleId}/categories/${categoryId}/subcategories/${subcategoryId}`,
      { method: 'DELETE' }
    );
  },

  // ---- Access Roles ----

  /** List access roles for a module */
  async listModuleRoles(moduleId: string): Promise<EdgeResult<{ data: ModuleAccessRole[] }>> {
    return callEdge(`/modules/${moduleId}/roles`);
  },

  /** Upsert (create or update) a role for a module (admin only) */
  async upsertModuleRole(moduleId: string, input: {
    role: string;
    can_read?: boolean;
    can_write?: boolean;
    can_delete?: boolean;
    can_admin?: boolean;
  }): Promise<EdgeResult<{ data: ModuleAccessRole }>> {
    return callEdge(`/modules/${moduleId}/roles`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
};

export default moduleCatalogService;
