import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Category mapping based on repo name/description keywords
const categoryMap: Record<string, string[]> = {
  'Finance': ['accounting', 'finance', 'invoice', 'billing', 'payment', 'tax', 'gst', 'banking', 'wallet', 'ledger'],
  'Healthcare': ['hospital', 'clinic', 'medical', 'dental', 'pharmacy', 'health', 'patient', 'doctor', 'ehr', 'emr'],
  'Education': ['school', 'college', 'university', 'lms', 'coaching', 'student', 'exam', 'learning', 'education', 'academy', 'tutor'],
  'Hotel/Travel': ['hotel', 'resort', 'booking', 'travel', 'tourism', 'hostel', 'lodge', 'airbnb'],
  'Restaurant': ['restaurant', 'food', 'kitchen', 'cafe', 'canteen', 'catering', 'menu', 'recipe'],
  'E-Commerce': ['ecommerce', 'e-commerce', 'shop', 'store', 'cart', 'marketplace', 'shopping', 'vendor'],
  'POS': ['pos', 'point-of-sale', 'pointofsale', 'billing-counter', 'retail-pos'],
  'CRM': ['crm', 'customer', 'client-management', 'sales-crm', 'lead-management'],
  'HRM': ['hrm', 'payroll', 'employee', 'attendance', 'leave', 'hr-management', 'workforce'],
  'ERP': ['erp', 'enterprise', 'business-management', 'resource-planning'],
  'Real Estate': ['real-estate', 'property', 'realestate', 'housing', 'rental', 'broker', 'apartment'],
  'Logistics': ['transport', 'logistics', 'fleet', 'delivery', 'courier', 'shipping', 'tracking', 'freight'],
  'Inventory': ['inventory', 'warehouse', 'stock', 'supply-chain', 'godown'],
  'Project Management': ['project', 'task', 'kanban', 'agile', 'scrum', 'sprint', 'todo', 'planner'],
  'Fitness': ['gym', 'fitness', 'yoga', 'workout', 'sports', 'training'],
  'Events': ['event', 'ticket', 'conference', 'seminar', 'wedding', 'celebration'],
  'Lending': ['loan', 'microfinance', 'lending', 'credit', 'mortgage', 'emi'],
  'Insurance': ['insurance', 'policy', 'claim', 'premium'],
  'Manufacturing': ['mrp', 'manufacturing', 'production', 'factory', 'assembly'],
  'Automotive': ['cab', 'taxi', 'car', 'vehicle', 'garage', 'auto', 'mechanic', 'workshop'],
  'Beauty/Salon': ['salon', 'spa', 'beauty', 'parlour', 'parlor', 'grooming', 'barber'],
  'Library': ['library', 'book', 'reading', 'catalog'],
  'Subscription': ['membership', 'subscription', 'recurring', 'plan'],
  'Social Media': ['social', 'chat', 'messenger', 'community', 'forum', 'blog'],
  'Security': ['security', 'cctv', 'surveillance', 'guard', 'alarm', 'firewall'],
  'Agriculture': ['farm', 'agriculture', 'crop', 'agri', 'dairy', 'livestock'],
  'Legal': ['legal', 'law', 'advocate', 'court', 'case-management', 'lawyer'],
  'NGO/Charity': ['ngo', 'charity', 'donation', 'volunteer', 'nonprofit', 'trust'],
  'Telecom': ['telecom', 'isp', 'broadband', 'sms', 'call', 'voip'],
  'Media': ['media', 'news', 'video', 'streaming', 'podcast', 'ott'],
  'Jewellery': ['jewel', 'gold', 'diamond', 'ornament'],
  'Laundry': ['laundry', 'dry-clean', 'wash', 'ironing'],
  'Parking': ['parking', 'valet', 'garage-management'],
  'Utility': ['utility', 'electricity', 'water', 'gas', 'meter'],
  'Gaming': ['game', 'gaming', 'quiz', 'trivia', 'puzzle'],
  'AI/ML': ['ai', 'ml', 'machine-learning', 'artificial', 'nlp', 'chatbot', 'gpt', 'neural'],
  'DevOps': ['devops', 'ci-cd', 'docker', 'kubernetes', 'jenkins', 'deploy', 'pipeline'],
  'Analytics': ['analytics', 'dashboard', 'report', 'metrics', 'bi', 'visualization'],
  'Communication': ['email', 'notification', 'whatsapp', 'telegram', 'push'],
};

function detectCategory(name: string, description: string | null): string {
  const text = `${name} ${description || ''}`.toLowerCase().replace(/[-_]/g, ' ');
  
  let bestMatch = 'General';
  let bestScore = 0;
  
  for (const [category, keywords] of Object.entries(categoryMap)) {
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw)) {
        score += kw.length; // Longer keyword = more specific match
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = category;
    }
  }
  
  return bestMatch;
}

function detectType(language: string | null, topics: string[]): string {
  const allInfo = `${language || ''} ${topics.join(' ')}`.toLowerCase();
  if (allInfo.includes('android') || allInfo.includes('flutter') || allInfo.includes('react-native') || allInfo.includes('swift') || allInfo.includes('kotlin')) return 'Mobile';
  if (allInfo.includes('electron') || allInfo.includes('desktop') || allInfo.includes('wpf') || allInfo.includes('winforms')) return 'Desktop';
  if (allInfo.includes('python') || allInfo.includes('java') || allInfo.includes('c#') || allInfo.includes('csharp')) return 'Hybrid';
  return 'SaaS';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const githubPat = Deno.env.get('GITHUB_PAT');
    if (!githubPat) {
      return new Response(
        JSON.stringify({ success: false, error: 'GitHub PAT not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch ALL repos (paginated)
    let allRepos: any[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      console.log(`Fetching page ${page}...`);
      const res = await fetch(
        `https://api.github.com/user/repos?per_page=${perPage}&page=${page}&visibility=all&affiliation=owner&sort=updated`,
        {
          headers: {
            'Authorization': `Bearer ${githubPat}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'SoftwareVala-Importer',
          },
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`GitHub API error ${res.status}: ${errText}`);
      }

      const repos = await res.json();
      if (!Array.isArray(repos) || repos.length === 0) break;
      
      allRepos = allRepos.concat(repos);
      console.log(`Page ${page}: ${repos.length} repos (total: ${allRepos.length})`);
      
      if (repos.length < perPage) break;
      page++;
    }

    console.log(`Total repos fetched: ${allRepos.length}`);

    // Transform to products - NO mention of external platform names
    const products = allRepos.map((repo: any) => {
      const category = detectCategory(repo.name, repo.description);
      const softwareType = detectType(repo.language, repo.topics || []);
      
      return {
        product_name: repo.name
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c: string) => c.toUpperCase()),
        category,
        description: repo.description || `${category} software solution`,
        pricing_model: 'one-time',
        lifetime_price: 0,
        monthly_price: 0,
        features_json: JSON.stringify([
          `Language: ${repo.language || 'Multi'}`,
          `Type: ${softwareType}`,
          `Last Updated: ${new Date(repo.updated_at).toLocaleDateString()}`,
        ]),
        tech_stack: repo.language || 'Multi-Stack',
        is_active: true,
        product_type: 'software',
        status: 'active',
        has_broken_demo: false,
      };
    });

    // Check existing products to avoid duplicates
    const { data: existing } = await supabase
      .from('products')
      .select('product_name');
    
    const existingNames = new Set((existing || []).map((p: any) => p.product_name.toLowerCase()));
    const newProducts = products.filter((p: any) => !existingNames.has(p.product_name.toLowerCase()));

    console.log(`New products to insert: ${newProducts.length} (skipping ${products.length - newProducts.length} duplicates)`);

    // Insert in batches
    let imported = 0;
    let failed = 0;
    const batchSize = 50;

    for (let i = 0; i < newProducts.length; i += batchSize) {
      const batch = newProducts.slice(i, i + batchSize);
      const { error } = await supabase.from('products').insert(batch);
      
      if (error) {
        console.error(`Batch ${Math.floor(i / batchSize) + 1} error:`, error.message);
        failed += batch.length;
      } else {
        imported += batch.length;
      }
    }

    // Return category summary
    const categorySummary: Record<string, number> = {};
    for (const p of newProducts) {
      categorySummary[p.category] = (categorySummary[p.category] || 0) + 1;
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_repos: allRepos.length,
        imported,
        failed,
        skipped_duplicates: products.length - newProducts.length,
        categories: categorySummary,
        message: `${imported} products imported from ${allRepos.length} repositories`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Import error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Import failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
