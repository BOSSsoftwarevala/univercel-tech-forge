import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GitHub API configuration
const GITHUB_ORG = "BOSSsoftwarevala";
const GITHUB_API = "https://api.github.com";

// Category mapping based on repo name patterns
const CATEGORY_PATTERNS: Record<string, string[]> = {
  'Education': ['school', 'college', 'university', 'education', 'lms', 'learning', 'student', 'academy', 'tutor', 'coaching'],
  'Healthcare': ['hospital', 'clinic', 'health', 'medical', 'doctor', 'patient', 'pharmacy', 'lab', 'dental'],
  'E-commerce': ['ecommerce', 'shop', 'store', 'marketplace', 'cart', 'retail', 'fashion'],
  'Restaurant': ['restaurant', 'food', 'kitchen', 'cafe', 'catering', 'delivery', 'menu'],
  'Hotel': ['hotel', 'resort', 'booking', 'travel', 'tourism', 'hospitality', 'lodge'],
  'Real Estate': ['realestate', 'property', 'housing', 'rental', 'apartment', 'builder', 'construction'],
  'Finance': ['finance', 'accounting', 'banking', 'payment', 'invoice', 'tax', 'billing', 'wallet'],
  'Manufacturing': ['manufacturing', 'factory', 'production', 'inventory', 'warehouse', 'supply'],
  'CRM': ['crm', 'customer', 'lead', 'sales', 'pipeline', 'contact'],
  'HRM': ['hrm', 'hr', 'payroll', 'employee', 'attendance', 'recruitment', 'leave'],
  'Logistics': ['logistics', 'transport', 'fleet', 'shipping', 'tracking', 'delivery'],
  'Salon': ['salon', 'spa', 'beauty', 'parlour', 'barber', 'grooming'],
  'Gym': ['gym', 'fitness', 'workout', 'yoga', 'sports', 'trainer'],
  'Legal': ['legal', 'law', 'advocate', 'court', 'compliance', 'contract'],
  'Retail': ['retail', 'pos', 'supermarket', 'grocery', 'wholesale'],
  'AI Tools': ['ai', 'ml', 'chatbot', 'automation', 'nlp', 'vision'],
};

function detectCategory(repoName: string, topics: string[]): string {
  const searchText = [repoName, ...topics].join(' ').toLowerCase();
  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    if (patterns.some(p => searchText.includes(p))) return category;
  }
  return 'Software';
}

function repoNameToProductName(repoName: string): string {
  return repoName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\bErp\b/gi, 'ERP')
    .replace(/\bCrm\b/gi, 'CRM')
    .replace(/\bHrm\b/gi, 'HRM')
    .replace(/\bPos\b/gi, 'POS')
    .replace(/\bAi\b/gi, 'AI')
    .replace(/\bApi\b/gi, 'API');
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const githubToken = Deno.env.get("GITHUB_PAT");
    if (!githubToken) {
      return new Response(
        JSON.stringify({ error: "GitHub PAT not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action || 'sync';
    const headers = {
      'Authorization': `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'SoftwareVala-Marketplace',
    };

    if (action === 'sync') {
      // Fetch all repos from the org (paginated)
      let allRepos: any[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(
          `${GITHUB_API}/orgs/${GITHUB_ORG}/repos?per_page=100&page=${page}&sort=updated`,
          { headers }
        );

        if (!response.ok) {
          // Fallback: try as user repos
          const userResponse = await fetch(
            `${GITHUB_API}/users/${GITHUB_ORG}/repos?per_page=100&page=${page}&sort=updated`,
            { headers }
          );
          if (!userResponse.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
          }
          const repos = await userResponse.json();
          allRepos = allRepos.concat(repos);
          hasMore = repos.length === 100;
        } else {
          const repos = await response.json();
          allRepos = allRepos.concat(repos);
          hasMore = repos.length === 100;
        }
        page++;
      }

      console.log(`Found ${allRepos.length} repositories from ${GITHUB_ORG}`);

      let synced = 0;
      let created = 0;
      let updated = 0;
      let errors = 0;

      for (const repo of allRepos) {
        try {
          const category = detectCategory(repo.name, repo.topics || []);
          const productName = repoNameToProductName(repo.name);

          // Fetch latest commit
          let lastCommit: any = null;
          try {
            const commitRes = await fetch(
              `${GITHUB_API}/repos/${repo.full_name}/commits?per_page=1`,
              { headers }
            );
            if (commitRes.ok) {
              const commits = await commitRes.json();
              lastCommit = commits[0] || null;
            }
          } catch { /* ignore commit fetch errors */ }

          // Upsert to github_repo_sync
          const syncData = {
            repo_full_name: repo.full_name,
            repo_url: repo.html_url,
            default_branch: repo.default_branch || 'main',
            category,
            last_commit_sha: lastCommit?.sha || null,
            last_commit_at: lastCommit?.commit?.author?.date || null,
            last_commit_message: lastCommit?.commit?.message?.substring(0, 255) || null,
            last_sync_at: new Date().toISOString(),
            demo_url: repo.homepage || null,
            is_active: !repo.archived,
            repo_visibility: repo.private ? 'private' : 'public',
            stars_count: repo.stargazers_count || 0,
            language: repo.language || null,
            topics: repo.topics || [],
            updated_at: new Date().toISOString(),
          };

          const { data: existingSync } = await supabase
            .from('github_repo_sync')
            .select('id, product_id')
            .eq('repo_full_name', repo.full_name)
            .single();

          if (existingSync) {
            await supabase
              .from('github_repo_sync')
              .update(syncData)
              .eq('id', existingSync.id);
            updated++;

            // Update linked product if exists
            if (existingSync.product_id) {
              await supabase
                .from('software_catalog')
                .update({
                  github_repo_url: repo.html_url,
                  demo_url: repo.homepage || undefined,
                  last_repo_sync_at: new Date().toISOString(),
                  repo_last_commit_sha: lastCommit?.sha || null,
                  repo_language: repo.language || null,
                  updated_at: new Date().toISOString(),
                } as any)
                .eq('id', existingSync.product_id);
            }
          } else {
            // Check if product already exists in catalog by name match
            const { data: existingProduct } = await supabase
              .from('software_catalog')
              .select('id')
              .ilike('name', `%${repo.name.replace(/-/g, '%')}%`)
              .limit(1)
              .single();

            let productId = existingProduct?.id || null;

            if (!productId) {
              // Create new product in catalog
              const { data: newProduct } = await supabase
                .from('software_catalog')
                .insert({
                  name: productName,
                  type: 'SaaS',
                  category,
                  github_repo_url: repo.html_url,
                  demo_url: repo.homepage || null,
                  is_active: !repo.archived,
                  listing_status: 'draft',
                  vendor: 'Software Vala',
                  short_description: repo.description || `${category} software solution by Software Vala`,
                  repo_language: repo.language || null,
                  last_repo_sync_at: new Date().toISOString(),
                  repo_last_commit_sha: lastCommit?.sha || null,
                } as any)
                .select('id')
                .single();

              productId = newProduct?.id || null;
              created++;
            } else {
              // Link existing product
              await supabase
                .from('software_catalog')
                .update({
                  github_repo_url: repo.html_url,
                  demo_url: repo.homepage || undefined,
                  last_repo_sync_at: new Date().toISOString(),
                  repo_last_commit_sha: lastCommit?.sha || null,
                  repo_language: repo.language || null,
                } as any)
                .eq('id', productId);
            }

            await supabase
              .from('github_repo_sync')
              .insert({ ...syncData, product_id: productId });
          }

          synced++;
        } catch (repoError) {
          console.error(`Error syncing repo ${repo.full_name}:`, repoError);
          errors++;
        }
      }

      // Log sync activity
      await supabase.from('audit_logs').insert({
        action: 'github_repo_sync_completed',
        module: 'marketplace',
        meta_json: {
          total_repos: allRepos.length,
          synced,
          created,
          updated,
          errors,
          org: GITHUB_ORG,
          timestamp: new Date().toISOString(),
        },
      });

      return new Response(
        JSON.stringify({
          success: true,
          summary: {
            total_repos: allRepos.length,
            synced,
            new_products_created: created,
            existing_updated: updated,
            errors,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === 'status') {
      // Get sync status
      const { data: syncRecords, error } = await supabase
        .from('github_repo_sync')
        .select('*, software_catalog(id, name, category, is_active)')
        .order('last_sync_at', { ascending: false });

      if (error) throw error;

      const stats = {
        total_repos: syncRecords?.length || 0,
        linked_to_products: syncRecords?.filter((r: any) => r.product_id).length || 0,
        active_repos: syncRecords?.filter((r: any) => r.is_active).length || 0,
        categories: [...new Set(syncRecords?.map((r: any) => r.category).filter(Boolean))],
        last_sync: syncRecords?.[0]?.last_sync_at || null,
      };

      return new Response(
        JSON.stringify({ success: true, stats, repos: syncRecords }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action. Use 'sync' or 'status'" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("GitHub sync error:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
