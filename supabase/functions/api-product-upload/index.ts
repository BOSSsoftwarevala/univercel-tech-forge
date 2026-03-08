import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { jsonResponse, errorResponse } from "../_shared/utils.ts";
import { withAuth } from "../_shared/middleware.ts";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api-product-upload", "");

  if (path === "/upload" && req.method === "POST") {
    return withAuth(req, ["boss_owner", "admin", "product_manager"], async ({ supabaseAdmin, user }) => {
      try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const productId = formData.get("product_id") as string;
        const imageType = (formData.get("image_type") as string) || "product";

        if (!file) return errorResponse("File is required");
        if (!productId) return errorResponse("Product ID is required");
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          return errorResponse(`Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`);
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
          return errorResponse(`File too large. Max size: ${MAX_FILE_SIZE_MB}MB`);
        }

        const { data: product } = await supabaseAdmin.from("products").select("product_id").eq("product_id", productId).single();
        if (!product) return errorResponse("Product not found", 404);

        const timestamp = new Date().getTime();
        const fileName = `${productId}/${timestamp}-${file.name}`;
        const storagePath = `products/${fileName}`;

        const { error: uploadError } = await supabaseAdmin.storage.from("product-images").upload(storagePath, file, { cacheControl: "3600", upsert: false });
        if (uploadError) return errorResponse(`Upload failed: ${uploadError.message}`, 500);

        const { data: { publicUrl } } = supabaseAdmin.storage.from("product-images").getPublicUrl(storagePath);

        const { data: imageRecord, error: dbError } = await supabaseAdmin.from("product_images").insert({
          product_id: productId,
          image_name: file.name,
          image_url: publicUrl,
          thumbnail_url: publicUrl,
          image_type: imageType,
          file_size_bytes: file.size,
          mime_type: file.type,
          storage_path: storagePath,
          upload_status: "completed",
          created_by: user.userId,
        }).select().single();

        if (dbError) return errorResponse(`Database error: ${dbError.message}`, 500);

        if (imageType === "product") {
          await supabaseAdmin.from("products").update({ image_url: publicUrl, thumbnail_url: publicUrl }).eq("product_id", productId);
        }

        await supabaseAdmin.from("ai_action_audit_log").insert({
          user_id: user.userId,
          action_type: "product_upload",
          action_name: `Upload image: ${file.name}`,
          action_status: "executed",
          approval_required: false,
          action_payload: { product_id: productId, file_name: file.name, file_size: file.size, image_type: imageType },
          action_result: { image_record_id: imageRecord.id },
        });

        return jsonResponse({ success: true, message: "Image uploaded successfully", image: imageRecord });
      } catch (error) {
        return errorResponse(`Error: ${(error as Error).message}`, 500);
      }
    });
  }

  return errorResponse("Not found", 404);
});
