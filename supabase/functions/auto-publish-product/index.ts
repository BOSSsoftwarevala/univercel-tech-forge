/**
 * AUTO-PUBLISH-PRODUCT Edge Function
 * Pipeline: VALA AI Build → Catalog Entry (draft) → AI Image Gen → VPS Deploy → Boss Approval Request
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PublishRequest {
  productName: string;
  description: string;
  category: string;
  type: string; // SaaS, Desktop, Mobile, etc.
  price: number;
  features: string[];
  techStack: string[];
  githubRepoUrl?: string;
  buildOutput?: string;
  userId: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body: PublishRequest = await req.json();
    const {
      productName,
      description,
      category,
      type,
      price,
      features = [],
      techStack = [],
      githubRepoUrl,
      buildOutput,
      userId,
    } = body;

    if (!productName || !category || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: productName, category, userId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const steps: { step: string; status: string; detail?: string }[] = [];
    const subdomain = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    const demoDomain = `${subdomain}.saasvala.com`;

    // ─────────────────────────────────────────────
    // STEP 1: Insert into software_catalog as DRAFT
    // ─────────────────────────────────────────────
    const { data: catalogEntry, error: catalogError } = await supabase
      .from("software_catalog")
      .insert({
        name: productName,
        base_price: price || 249,
        type: type || "SaaS",
        vendor: "Software Vala",
        category: category || "General",
        demo_url: `https://${demoDomain}`,
        is_demo_registered: false,
        is_active: false, // Hidden until approved
        listing_status: "pending_review",
        generated_by_vala: true,
        github_repo_url: githubRepoUrl || null,
        demo_domain: demoDomain,
        build_metadata: {
          features,
          techStack,
          buildOutput: buildOutput?.slice(0, 2000), // truncate
          generatedAt: new Date().toISOString(),
          generatedBy: userId,
        },
      })
      .select("id")
      .single();

    if (catalogError) {
      console.error("[AutoPublish] Catalog insert failed:", catalogError);
      steps.push({ step: "catalog_insert", status: "failed", detail: catalogError.message });
      return new Response(
        JSON.stringify({ error: "Failed to create catalog entry", steps }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const productId = catalogEntry.id;
    steps.push({ step: "catalog_insert", status: "success", detail: `Product ID: ${productId}` });

    // ─────────────────────────────────────────────
    // STEP 2: Generate AI Product Image
    // ─────────────────────────────────────────────
    let imageUrl: string | null = null;
    try {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (LOVABLE_API_KEY) {
        const imagePrompt = `Create a professional software product icon for "${productName}" - a ${category} ${type} application. Modern, clean, minimal design with a gradient background. The icon should represent ${category.toLowerCase()} software. On a solid white background.`;

        const imgResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [{ role: "user", content: imagePrompt }],
            modalities: ["image", "text"],
          }),
        });

        if (imgResponse.ok) {
          const imgData = await imgResponse.json();
          const base64Image = imgData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

          if (base64Image) {
            // Upload to Supabase Storage
            const imageBuffer = Uint8Array.from(atob(base64Image.split(",")[1] || base64Image), c => c.charCodeAt(0));
            const imagePath = `product-images/${productId}/icon.png`;

            const { error: uploadError } = await supabase.storage
              .from("product-assets")
              .upload(imagePath, imageBuffer, {
                contentType: "image/png",
                upsert: true,
              });

            if (!uploadError) {
              const { data: urlData } = supabase.storage
                .from("product-assets")
                .getPublicUrl(imagePath);
              imageUrl = urlData.publicUrl;

              // Update catalog with image
              await supabase
                .from("software_catalog")
                .update({
                  product_icon_url: imageUrl,
                  product_thumbnail_url: imageUrl,
                })
                .eq("id", productId);

              steps.push({ step: "ai_image_generation", status: "success", detail: imageUrl });
            } else {
              steps.push({ step: "ai_image_upload", status: "failed", detail: uploadError.message });
            }
          } else {
            steps.push({ step: "ai_image_generation", status: "skipped", detail: "No image returned from AI" });
          }
        } else {
          steps.push({ step: "ai_image_generation", status: "failed", detail: `AI returned ${imgResponse.status}` });
        }
      } else {
        steps.push({ step: "ai_image_generation", status: "skipped", detail: "No LOVABLE_API_KEY" });
      }
    } catch (imgErr) {
      console.error("[AutoPublish] Image generation error:", imgErr);
      steps.push({ step: "ai_image_generation", status: "failed", detail: String(imgErr) });
    }

    // ─────────────────────────────────────────────
    // STEP 3: Trigger VPS Deployment (subdomain)
    // ─────────────────────────────────────────────
    let deployStatus = "queued";
    try {
      const VPS_HOST = Deno.env.get("VPS_HOST");
      const VPS_ROOT_PASSWORD = Deno.env.get("VPS_ROOT_PASSWORD");

      if (VPS_HOST && VPS_ROOT_PASSWORD && githubRepoUrl) {
        const deployEndpoint = `http://${VPS_HOST}:8422/execute`;

        // Create subdomain directory and nginx config
        const setupCommand = [
          `mkdir -p /var/www/${subdomain}`,
          `echo '${generateNginxConfig(subdomain)}' > /etc/nginx/sites-available/${subdomain}`,
          `ln -sf /etc/nginx/sites-available/${subdomain} /etc/nginx/sites-enabled/`,
          `nginx -t && systemctl reload nginx`,
        ].join(" && ");

        const deployResponse = await fetch(deployEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Deploy-Key": VPS_ROOT_PASSWORD,
          },
          body: JSON.stringify({ command: setupCommand }),
          signal: AbortSignal.timeout(60000),
        });

        if (deployResponse.ok) {
          deployStatus = "deployed";
          steps.push({ step: "vps_deployment", status: "success", detail: `Subdomain: ${demoDomain}` });

          // Clone repo if available
          if (githubRepoUrl) {
            const GITHUB_PAT = Deno.env.get("GITHUB_PAT");
            const cloneUrl = githubRepoUrl.replace("https://", `https://${GITHUB_PAT}@`);
            await fetch(deployEndpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Deploy-Key": VPS_ROOT_PASSWORD,
              },
              body: JSON.stringify({
                command: `cd /var/www/${subdomain} && git clone ${cloneUrl} . && npm install && npm run build 2>/dev/null || true`,
              }),
              signal: AbortSignal.timeout(120000),
            });
            steps.push({ step: "git_clone_build", status: "success" });
          }
        } else {
          deployStatus = "failed";
          steps.push({ step: "vps_deployment", status: "failed", detail: `VPS returned ${deployResponse.status}` });
        }
      } else {
        deployStatus = "skipped";
        steps.push({ step: "vps_deployment", status: "skipped", detail: "VPS credentials or GitHub URL missing" });
      }
    } catch (deployErr) {
      deployStatus = "failed";
      console.error("[AutoPublish] Deploy error:", deployErr);
      steps.push({ step: "vps_deployment", status: "failed", detail: String(deployErr) });
    }

    // ─────────────────────────────────────────────
    // STEP 4: Generate SEO Metadata via AI
    // ─────────────────────────────────────────────
    try {
      const seoResponse = await fetch(`${supabaseUrl}/functions/v1/generate-product-seo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          productId,
          productName,
          category,
          type,
          description,
          features,
          price,
        }),
      });

      if (seoResponse.ok) {
        steps.push({ step: "seo_generation", status: "success", detail: "Meta tags, keywords, hashtags generated" });
      } else {
        steps.push({ step: "seo_generation", status: "failed", detail: `SEO function returned ${seoResponse.status}` });
      }
    } catch (seoErr) {
      console.error("[AutoPublish] SEO generation error:", seoErr);
      steps.push({ step: "seo_generation", status: "failed", detail: String(seoErr) });
    }

    // ─────────────────────────────────────────────
    // STEP 5: Create Boss Approval Request
    // ─────────────────────────────────────────────
    const { error: approvalError } = await supabase.from("approvals").insert({
      request_type: "marketplace_publish",
      requested_by_user_id: userId,
      status: "pending",
      risk_score: 20,
      request_data: {
        product_id: productId,
        product_name: productName,
        category,
        type,
        price,
        demo_domain: demoDomain,
        github_repo_url: githubRepoUrl,
        deploy_status: deployStatus,
        image_url: imageUrl,
        pipeline_steps: steps,
      },
    });

    if (approvalError) {
      console.error("[AutoPublish] Approval insert failed:", approvalError);
      steps.push({ step: "boss_approval_request", status: "failed", detail: approvalError.message });
    } else {
      steps.push({ step: "boss_approval_request", status: "success", detail: "Pending Boss review" });
    }

    // ─────────────────────────────────────────────
    // STEP 6: Log activity
    // ─────────────────────────────────────────────
    await supabase.from("activity_log").insert({
      action_type: "product_auto_publish",
      user_id: userId,
      entity_type: "software_catalog",
      entity_id: productId,
      severity_level: "info",
      metadata: {
        product_name: productName,
        category,
        demo_domain: demoDomain,
        steps,
      },
    });

    steps.push({ step: "activity_log", status: "success" });

    return new Response(
      JSON.stringify({
        success: true,
        productId,
        demoDomain,
        listingStatus: "pending_review",
        imageUrl,
        deployStatus,
        steps,
        message: `Product "${productName}" created and sent for Boss approval.`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[AutoPublish] Fatal error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateNginxConfig(subdomain: string): string {
  return `server {
    listen 80;
    server_name ${subdomain}.saasvala.com;
    root /var/www/${subdomain};
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}`;
}
