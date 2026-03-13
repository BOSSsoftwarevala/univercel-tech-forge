import { RequestContext } from "./middleware.ts";

export interface ProductPermission {
  user_id: string;
  permission_type: "upload" | "publish" | "delete" | "feature" | "sync_marketplace";
  is_active: boolean;
  expires_at?: string;
}

export async function checkProductPermission(context: RequestContext, permission: ProductPermission["permission_type"]): Promise<boolean> {
  if (context.user.role === "admin" || context.user.role === "boss_owner") {
    return true;
  }
  if (context.user.role !== "product_manager") {
    return false;
  }

  const { data: perms } = await context.supabaseAdmin
    .from("product_manager_permissions")
    .select("*")
    .eq("user_id", context.user.userId)
    .eq("permission_type", permission)
    .eq("is_active", true)
    .single();

  if (!perms) return false;
  if (perms.expires_at && new Date(perms.expires_at) < new Date()) {
    return false;
  }
  return true;
}

export async function validateFileUpload(file: File, maxSizeMB: number = 10, allowedTypes: string[] = ["image/jpeg", "image/png", "image/webp", "image/gif"]): Promise<{ valid: boolean; error?: string }> {
  if (!file) {
    return { valid: false, error: "File is required" };
  }
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Invalid file type. Allowed: ${allowedTypes.join(", ")}` };
  }
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `File too large. Max size: ${maxSizeMB}MB` };
  }
  return { valid: true };
}

export async function validateProductForPublish(product: any): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  if (!product.product_name) errors.push("Product name is required");
  if (!product.description) errors.push("Product description is required");
  if (!product.image_url) errors.push("Product image is required");
  if (!product.lifetime_price || product.lifetime_price <= 0) {
    errors.push("Product price must be greater than 0");
  }
  return { valid: errors.length === 0, errors };
}