import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tags as TagsIcon, Loader2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Tag = {
  id?: number | string;
  name?: string | null;
  slug?: string | null;
  created_at?: string | null;
  product_count?: number | null;
};

const MPTags = () => {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTags = async () => {
      setLoading(true);
      setError(null);
      setTags([]);

      const tryTables = ["product_tags", "tags"];
      for (const table of tryTables) {
        try {
          const { data, error: fetchError } = await supabase
            .from(table)
            .select("id, name, slug, created_at")
            .order("name", { ascending: true })
            .limit(200)
            .abortSignal(controller.signal);

          if (fetchError) {
            // If table doesn't exist or permission issue, try next
            console.warn(`Lookup table ${table} failed:`, fetchError.message || fetchError);
            continue;
          }

          if (data && Array.isArray(data) && data.length > 0) {
            setTags(data as Tag[]);
            return;
          }
        } catch (e) {
          if ((e as any)?.name === "AbortError") {
            // aborted, stop
            return;
          }
          console.error(`Error querying ${table}:`, e);
          continue;
        }
      }

      // If reached here, no tags found or tables unavailable
      setTags([]);
      setError(null);
      setLoading(false);
    };

    fetchTags().finally(() => {
      // fetchTags handles loading in flow, but ensure loading false if promise resolves
      setLoading(false);
    });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleView = (t: Tag) => {
    const slug = t.slug || t.name;
    if (slug) {
      window.open(`/marketplace?tag=${encodeURIComponent(String(slug))}`, "_blank", "noopener,noreferrer");
      return;
    }
    if (t.name) {
      try {
        navigator.clipboard?.writeText(t.name);
        toast.success("Tag copied to clipboard");
      } catch {
        // silent
      }
    }
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
            <TagsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Tags</h1>
            <p className="text-sm text-muted-foreground">Create and assign product tags for filtering</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <EmptyState
            icon={<TagsIcon className="w-12 h-12" />}
            title="Unable to load tags"
            description={error}
          />
        ) : tags.length === 0 ? (
          <EmptyState
            icon={<TagsIcon className="w-12 h-12" />}
            title="No tags created yet"
            description="Tags help users find products faster through search and filtering"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map((t) => (
              <Card key={String(t.id ?? t.slug ?? t.name)} className="border-border/50">
                <CardHeader>
                  <CardTitle>{t.name || "Untitled tag"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t.slug ? `slug: ${t.slug}` : "No slug available"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {t.created_at ? new Date(t.created_at).toLocaleDateString() : ""}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => handleView(t)}>
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

export default MPTags;
