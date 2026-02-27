import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  private: boolean;
  updated_at: string;
  license: { name: string } | null;
  homepage: string | null;
}

// Auto-categorize based on repo topics and language
function categorizeRepo(repo: GitHubRepo): string {
  const topics = repo.topics || [];
  const lang = (repo.language || "").toLowerCase();

  if (topics.includes("ecommerce") || topics.includes("shop")) return "E-Commerce";
  if (topics.includes("erp") || topics.includes("enterprise")) return "ERP";
  if (topics.includes("crm") || topics.includes("sales")) return "CRM";
  if (topics.includes("hrm") || topics.includes("hr")) return "HR Management";
  if (topics.includes("analytics") || topics.includes("dashboard")) return "Analytics";
  if (topics.includes("mobile") || topics.includes("android") || topics.includes("ios")) return "Mobile App";
  if (topics.includes("api") || topics.includes("backend")) return "Backend Service";
  if (lang === "python") return "Python Tool";
  if (lang === "javascript" || lang === "typescript") return "Web App";
  return "Software";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GITHUB_TOKEN = Deno.env.get("GITHUB_APP_TOKEN") || Deno.env.get("GITHUB_TOKEN");
    const GITHUB_ORG = Deno.env.get("GITHUB_ORG") || Deno.env.get("GITHUB_OWNER");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { repo, syncAll } = await req.json().catch(() => ({ repo: null, syncAll: true }));

    let repos: GitHubRepo[] = [];

    if (repo) {
      // Sync single repo
      const repoResponse = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "SoftwareVala-Sync/1.0",
        },
      });
      if (repoResponse.ok) {
        repos = [await repoResponse.json()];
      }
    } else if (syncAll && GITHUB_ORG) {
      // Sync all repos from org
      let page = 1;
      while (true) {
        const response = await fetch(
          `https://api.github.com/orgs/${GITHUB_ORG}/repos?per_page=100&page=${page}&type=public`,
          {
            headers: {
              Authorization: `Bearer ${GITHUB_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "SoftwareVala-Sync/1.0",
            },
          }
        );
        if (!response.ok) break;
        const batch: GitHubRepo[] = await response.json();
        if (batch.length === 0) break;
        repos.push(...batch);
        page++;
        if (batch.length < 100) break;
      }
    }

    const results = [];
    for (const r of repos) {
      const category = categorizeRepo(r);
      const { error } = await supabase.from("marketplace_products").upsert({
        github_repo_id: r.id,
        name: r.name,
        full_name: r.full_name,
        description: r.description || "",
        html_url: r.html_url,
        topics: r.topics || [],
        language: r.language || "",
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        is_private: r.private,
        category,
        license: r.license?.name || null,
        homepage: r.homepage || null,
        last_synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "github_repo_id" });

      results.push({ repo: r.full_name, category, error: error?.message || null });
    }

    console.log(`GitHub sync completed: ${repos.length} repos processed`);

    return new Response(JSON.stringify({
      synced: repos.length,
      results,
      timestamp: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GitHub sync error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
