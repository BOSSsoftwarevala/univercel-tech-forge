import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Loader2, ToggleLeft } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";

const MPProductVisibility = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('product_name').limit(100);
    setProducts(data || []);
    setLoading(false);
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    await supabase.from('products').update({ is_active: !current } as any).eq('product_id', id);
    toast.success(`Product ${current ? 'hidden' : 'visible'} on marketplace`);
    fetchProducts();
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <ToggleLeft className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Product Visibility</h1>
            <p className="text-sm text-muted-foreground">Control which products appear on the marketplace</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : products.length === 0 ? (
          <EmptyState icon={<ToggleLeft className="w-12 h-12" />} title="No products" description="Add products first" />
        ) : (
          <Card className="border-border/50">
            <Table>
              <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead>Visibility</TableHead><TableHead>Toggle</TableHead></TableRow></TableHeader>
              <TableBody>
                {products.map(p => (
                  <TableRow key={p.product_id}>
                    <TableCell className="font-medium">{p.product_name}</TableCell>
                    <TableCell><Badge variant="outline">{p.category || 'N/A'}</Badge></TableCell>
                    <TableCell>
                      <Badge className={p.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"}>
                        {p.is_active ? 'Visible' : 'Hidden'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => toggleVisibility(p.product_id, p.is_active)}>
                        {p.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </TableCell>
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

export default MPProductVisibility;
