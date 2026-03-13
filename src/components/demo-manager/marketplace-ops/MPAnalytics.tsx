import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart2, Loader2, Package, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPAnalytics = () => {
  const [stats, setStats] = useState({ totalProducts: 0, activeProducts: 0, totalOrders: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [prodRes, activeRes, orderRes, catRes] = await Promise.all([
        supabase.from('products').select('product_id', { count: 'exact', head: true }),
        supabase.from('products').select('product_id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('marketplace_orders').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('category'),
      ]);
      const cats = new Set((catRes.data || []).map((r: any) => r.category).filter(Boolean));
      setStats({
        totalProducts: prodRes.count || 0,
        activeProducts: activeRes.count || 0,
        totalOrders: orderRes.count || 0,
        categories: cats.size,
      });
      setLoading(false);
    };
    load();
  }, []);

  const cards = [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'from-primary/20 to-primary/5' },
    { label: 'Active Products', value: stats.activeProducts, icon: TrendingUp, color: 'from-emerald-500/20 to-emerald-500/5' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'from-amber-500/20 to-amber-500/5' },
    { label: 'Categories', value: stats.categories, icon: BarChart2, color: 'from-blue-500/20 to-blue-500/5' },
  ];

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sales Analytics</h1>
            <p className="text-sm text-muted-foreground">Marketplace performance overview</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {cards.map(c => (
              <Card key={c.label} className={`bg-gradient-to-br ${c.color} border-border/50`}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{c.label}</p>
                    <p className="text-3xl font-bold font-mono text-foreground">{c.value.toLocaleString()}</p>
                  </div>
                  <c.icon className="w-10 h-10 text-muted-foreground/30" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default MPAnalytics;
