import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Loader2, Package } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

const MPPricing = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('products').select('product_id, product_name, category, pricing_model, monthly_price, lifetime_price').eq('is_active', true).order('product_name').limit(100);
      setProducts(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pricing & Plans</h1>
            <p className="text-sm text-muted-foreground">Manage product pricing across marketplace</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : products.length === 0 ? (
          <EmptyState icon={<Package className="w-12 h-12" />} title="No products" description="Add products first" />
        ) : (
          <Card className="border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Monthly</TableHead>
                  <TableHead>Lifetime</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(p => (
                  <TableRow key={p.product_id}>
                    <TableCell className="font-medium">{p.product_name}</TableCell>
                    <TableCell><Badge variant="outline">{p.category || 'N/A'}</Badge></TableCell>
                    <TableCell>{p.pricing_model || 'one-time'}</TableCell>
                    <TableCell className="font-mono">{p.monthly_price ? `₹${p.monthly_price}` : '—'}</TableCell>
                    <TableCell className="font-mono">{p.lifetime_price ? `₹${p.lifetime_price}` : '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
};

export default MPPricing;
