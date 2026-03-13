import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, LayoutList, Eye, EyeOff, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";

const MPProductListing = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 25;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, categoryFilter]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('products').select('category').not('category', 'is', null);
    const cats = [...new Set((data || []).map((r: any) => r.category).filter(Boolean))];
    setCategories(cats as string[]);
  };

  const fetchProducts = async () => {
    setLoading(true);
    let q = supabase.from('products').select('*').order('created_at', { ascending: false }).range(page * pageSize, (page + 1) * pageSize - 1);
    if (categoryFilter !== 'all') q = q.eq('category', categoryFilter);
    const { data } = await q;
    setProducts(data || []);
    setLoading(false);
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('products').update({ is_active: !current } as any).eq('product_id', id);
    toast.success(`Product ${current ? 'hidden' : 'shown'} on marketplace`);
    fetchProducts();
  };

  const filtered = products.filter(p => 
    p.product_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <LayoutList className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Product Listing</h1>
              <p className="text-sm text-muted-foreground">Manage all marketplace products</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Package className="w-12 h-12" />} title="No products found" description="Import products or adjust filters" />
        ) : (
          <Card className="border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Tech Stack</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.product_id}>
                    <TableCell className="font-medium">{p.product_name}</TableCell>
                    <TableCell><Badge variant="outline">{p.category || 'N/A'}</Badge></TableCell>
                    <TableCell>{p.product_type || 'software'}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{p.tech_stack || '-'}</TableCell>
                    <TableCell>
                      <Badge className={p.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-muted text-muted-foreground"}>
                        {p.is_active ? 'Active' : 'Hidden'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => toggleActive(p.product_id, p.is_active)}>
                        {p.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        <div className="flex justify-between">
          <Button variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <span className="text-sm text-muted-foreground">Page {page + 1}</span>
          <Button variant="outline" disabled={filtered.length < pageSize} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default MPProductListing;
