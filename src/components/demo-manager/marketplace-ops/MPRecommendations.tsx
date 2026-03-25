import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Product = {
  id?: number | string;
  product_id?: string;
  product_name?: string | null;
  short_description?: string | null;
  category?: string | null;
  demo_url?: string | null;
  seo_slug?: string | null;
  updated_at?: string | null;
};

const MPRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRecommended = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("software_catalog")
          .select(
            "id, product_id, product_name, short_description, category, demo_url, seo_slug, updated_at"
          )
          .eq("is_active", true)
          .order("updated_at", { ascending: false })
          .limit(8)
          .abortSignal(controller.signal);

        if (fetchError) {
          console.error("Failed to fetch recommendations:", fetchError);
          setError("Failed to load recommendations");
          setProducts([]);
          toast.error("Unable to load recommendations");
        } else {
          setProducts((data as Product[]) || []);
        }
      } catch (e) {
        if ((e as any)?.name === "AbortError") {
          // request aborted, ignore
        } else {
          console.error("Unexpected error fetching recommendations:", e);
          setError("Failed to load recommendations");
          setProducts([]);
          toast.error("Unable to load recommendations");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleView = (p: Product) => {
    // Safe, non-destructive navigation: open product demo or marketplace detail in new tab
    const demo = p.demo_url;
    const seo = p.seo_slug;
    const pid = p.product_id || p.id;
    if (demo) {
      window.open(demo, "_blank", "noopener,noreferrer");
      return;
    }
    if (seo && typeof seo === "string" && seo.trim().length > 0) {
      window.open(`/marketplace/product/${encodeURIComponent(seo)}`, "_blank", "noopener,noreferrer");
      return;
    }
    if (pid !== undefined && pid !== null) {
      window.open(`/marketplace/product/${encodeURIComponent(String(pid))}`, "_blank", "noopener,noreferrer");
      return;
    }
    // fallback: copy product name to clipboard for manual search
    if (p.product_name) {
      try {
        navigator.clipboard?.writeText(p.product_name);
        toast("Product name copied to clipboard");
      } catch {
        // silent fallback
      }
    }
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Recommendations</h1>
            <p className="text-sm text-muted-foreground">AI-powered product recommendation engine</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <EmptyState
            icon={<Sparkles className="w-12 h-12" />}
            title="Unable to load recommendations"
            description={error}
          />
        ) : products.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="w-12 h-12" />}
            title="No recommendation rules"
            description="Configure recommendation algorithms, 'Similar Products', and 'Users Also Bought' sections"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <Card key={String(p.product_id ?? p.id ?? p.seo_slug ?? p.product_name)}>
                <CardHeader>
                  <CardTitle>{p.product_name || "Untitled product"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {p.short_description || "No description available"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{p.category || "General"}</span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => handleView(p)}>
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default MPRecommendations;
