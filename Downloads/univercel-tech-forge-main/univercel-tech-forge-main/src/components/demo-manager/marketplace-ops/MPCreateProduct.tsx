import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const MPCreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ product_name: "", category: "", product_type: "SaaS", tech_stack: "", description: "" });

  const handleSubmit = async () => {
    if (loading) return; // prevent double submit
    const name = form.product_name?.trim();
    if (!name) {
      toast.error("Product name is required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        product_name: name,
        name: name,
        short_description: form.description?.trim() || null,
        category: form.category?.trim() || null,
        type: form.product_type,
        tech_stack: form.tech_stack?.trim() || null,
        is_active: true,
        listing_status: "draft",
        vendor: "Self",
      } as any;

      const { data, error } = await supabase.from("software_catalog").insert(payload).select().single();

      if (error) {
        console.error("Create product error:", error);
        toast.error(error.message || "Failed to create product");
        return;
      }

      toast.success("Product created successfully");
      setForm({ product_name: "", category: "", product_type: "SaaS", tech_stack: "", description: "" });
    } catch (e: any) {
      console.error("Unexpected error creating product:", e);
      toast.error(e?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <PlusCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Product</h1>
            <p className="text-sm text-muted-foreground">Add a new product to the marketplace</p>
          </div>
        </div>

        <Card className="border-border/50 max-w-2xl">
          <CardHeader><CardTitle>Product Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input value={form.product_name} onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))} placeholder="Enter product name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Finance, Healthcare" />
              </div>
              <div className="space-y-2">
                <Label>Product Type</Label>
                <Select value={form.product_type} onValueChange={v => setForm(f => ({ ...f, product_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SaaS">SaaS</SelectItem>
                    <SelectItem value="Mobile">Mobile App</SelectItem>
                    <SelectItem value="Desktop">Desktop</SelectItem>
                    <SelectItem value="Web">Web App</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tech Stack</Label>
              <Input value={form.tech_stack} onChange={e => setForm(f => ({ ...f, tech_stack: e.target.value }))} placeholder="e.g. React, Node.js, PostgreSQL" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short product description" />
            </div>
            <Button onClick={handleSubmit} disabled={loading} className="w-full gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Create Product
            </Button>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default MPCreateProduct;
