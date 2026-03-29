import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gift, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Offer = {
  id?: number | string;
  offer_id?: string;
  title?: string | null;
  description?: string | null;
  discount_percent?: number | null;
  demo_url?: string | null;
  product_id?: string | number | null;
  valid_until?: string | null;
  updated_at?: string | null;
};

const MPOffers = () => {
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchOffers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("offers")
          .select(
            "id, offer_id, title, description, discount_percent, demo_url, product_id, valid_until, updated_at"
          )
          .eq("is_active", true)
          .order("updated_at", { ascending: false })
          .limit(8)
          .abortSignal(controller.signal);

        if (fetchError) {
          console.error("Failed to fetch offers:", fetchError);
          setError("Failed to load offers");
          setOffers([]);
          toast.error("Unable to load offers");
          return;
        }

        setOffers((data as Offer[]) || []);
      } catch (e) {
        if ((e as any)?.name === "AbortError") {
          // Aborted, ignore
        } else {
          console.error("Unexpected error fetching offers:", e);
          setError("Failed to load offers");
          setOffers([]);
          toast.error("Unable to load offers");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleView = (o: Offer) => {
    const demo = o.demo_url;
    const oid = o.offer_id ?? o.id;
    const pid = o.product_id;
    if (demo) {
      window.open(demo, "_blank", "noopener,noreferrer");
      return;
    }
    if (oid !== undefined && oid !== null) {
      window.open(`/marketplace/offer/${encodeURIComponent(String(oid))}`, "_blank", "noopener,noreferrer");
      return;
    }
    if (pid !== undefined && pid !== null) {
      window.open(`/marketplace/product/${encodeURIComponent(String(pid))}`, "_blank", "noopener,noreferrer");
      return;
    }
    if (o.title) {
      try {
        navigator.clipboard?.writeText(o.title);
        toast.success("Offer title copied to clipboard");
      } catch {
        // silent
      }
    }
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Offers</h1>
            <p className="text-sm text-muted-foreground">Create and manage promotional offers</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <EmptyState
            icon={<Gift className="w-12 h-12" />}
            title="Unable to load offers"
            description={error}
          />
        ) : offers.length === 0 ? (
          <EmptyState
            icon={<Gift className="w-12 h-12" />}
            title="No active offers"
            description="Create time-limited offers, bundle deals, and promotional campaigns"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((o) => (
              <Card key={String(o.offer_id ?? o.id ?? o.title)}>
                <CardHeader>
                  <CardTitle>{o.title || "Untitled offer"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {o.description || "No description available"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {o.discount_percent ? `${o.discount_percent}% off` : "No discount specified"}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => handleView(o)}>
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

export default MPOffers;
