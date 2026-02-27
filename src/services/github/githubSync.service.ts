import { supabase } from "@/integrations/supabase/client";

export interface MarketplaceProduct {
  id?: string;
  github_repo_id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  topics: string[];
  language: string;
  stars: number;
  forks: number;
  is_private: boolean;
  category?: string;
  license?: string | null;
  homepage?: string | null;
  last_synced_at?: string;
}

export const githubSyncService = {
  // Trigger a sync of all GitHub repos to marketplace
  async syncAll(): Promise<{ synced: number; results: { repo: string; category: string; error: string | null }[] }> {
    const { data, error } = await supabase.functions.invoke("github-sync", {
      body: { syncAll: true },
    });
    if (error) throw error;
    return data;
  },

  // Sync a single repository
  async syncRepo(repoFullName: string): Promise<{ synced: number }> {
    const { data, error } = await supabase.functions.invoke("github-sync", {
      body: { repo: repoFullName },
    });
    if (error) throw error;
    return data;
  },

  // Get all marketplace products
  async getProducts(category?: string): Promise<MarketplaceProduct[]> {
    let query = supabase
      .from("marketplace_products")
      .select("*")
      .eq("is_private", false)
      .order("stars", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as MarketplaceProduct[]) || [];
  },

  // Get distinct categories
  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from("marketplace_products")
      .select("category")
      .eq("is_private", false);

    if (error) throw error;
    const categories = [...new Set((data || []).map((p) => p.category).filter(Boolean))] as string[];
    return categories.sort();
  },
};
