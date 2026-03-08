import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileEdit, Search, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const MPEditProduct = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(50);
    setProducts(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    await supabase.from('products').update({
      product_name: editing.product_name,
      category: editing.category,
      tech_stack: editing.tech_stack,
      description: editing.description,
    } as any).eq('product_id', editing.product_id);
    setSaving(false);
    toast.success("Product updated");
    setEditing(null);
    fetchProducts();
  };

  const filtered = products.filter(p => p.product_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <FileEdit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
            <p className="text-sm text-muted-foreground">Modify existing product details</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<FileEdit className="w-12 h-12" />} title="No products found" description="Add products first" />
        ) : (
          <Card className="border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.product_id}>
                    <TableCell className="font-medium">{p.product_name}</TableCell>
                    <TableCell><Badge variant="outline">{p.category || 'N/A'}</Badge></TableCell>
                    <TableCell>{p.product_type || '-'}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => setEditing({ ...p })}>
                        <FileEdit className="w-4 h-4 mr-1" /> Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-4">
                <div className="space-y-2"><Label>Name</Label><Input value={editing.product_name} onChange={e => setEditing((p: any) => ({ ...p, product_name: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Category</Label><Input value={editing.category || ""} onChange={e => setEditing((p: any) => ({ ...p, category: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Tech Stack</Label><Input value={editing.tech_stack || ""} onChange={e => setEditing((p: any) => ({ ...p, tech_stack: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Description</Label><Input value={editing.description || ""} onChange={e => setEditing((p: any) => ({ ...p, description: e.target.value }))} /></div>
                <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  );
};

export default MPEditProduct;
