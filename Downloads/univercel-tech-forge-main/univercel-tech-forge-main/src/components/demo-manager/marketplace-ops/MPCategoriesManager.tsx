import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tags, Loader2, FolderOpen } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPCategoriesManager = () => {
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('category');
    const map: Record<string, number> = {};
    (data || []).forEach((r: any) => {
      const cat = r.category || 'Uncategorized';
      map[cat] = (map[cat] || 0) + 1;
    });
    setCategories(Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count));
    setLoading(false);
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Tags className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Categories Manager</h1>
            <p className="text-sm text-muted-foreground">{categories.length} categories found</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : categories.length === 0 ? (
          <EmptyState icon={<FolderOpen className="w-12 h-12" />} title="No categories" description="Import products to see categories" />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {categories.map(cat => (
              <Card key={cat.name} className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{cat.name}</p>
                  </div>
                  <Badge variant="secondary" className="text-lg font-mono">{cat.count}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default MPCategoriesManager;
