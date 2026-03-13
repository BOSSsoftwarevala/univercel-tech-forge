import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Plus, Trash2, Package, Image, Layers, Star, BarChart3, Loader2, Eye, EyeOff, ShoppingBag } from 'lucide-react';

interface Product {
  product_id: string;
  product_name: string;
  category: string | null;
  monthly_price: number | null;
  lifetime_price: number | null;
  pricing_model: string | null;
  product_type: string | null;
  tech_stack: string | null;
  description: string | null;
  features_json: any;
  is_active: boolean | null;
  status: string | null;
}

interface Banner {
  banner_id: string;
  title: string;
  subtitle: string | null;
  cta_text: string | null;
  cta_link: string | null;
  bg_color: string | null;
  display_order: number;
  is_active: boolean;
}

interface Section {
  id: string;
  title: string;
  slug: string;
  section_type: string;
  display_order: number;
  is_active: boolean;
}

interface Featured {
  featured_id: string;
  section_id: string | null;
  product_id: string | null;
  display_order: number;
  products?: { product_name: string } | null;
  marketplace_sections?: { title: string } | null;
}

export function BossMarketplaceAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [featured, setFeatured] = useState<Featured[]>([]);
  const [analytics, setAnalytics] = useState({ totalProducts: 0, activeProducts: 0, totalOrders: 0, totalItems: 0 });
  const [loading, setLoading] = useState(true);

  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showBannerDialog, setShowBannerDialog] = useState(false);
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [showFeaturedDialog, setShowFeaturedDialog] = useState(false);

  const [newProduct, setNewProduct] = useState({ product_name: '', category: '', description: '', monthly_price: '', lifetime_price: '', pricing_model: 'monthly', product_type: '', tech_stack: '', features_csv: '', is_active: true });
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', cta_text: '', cta_link: '', bg_color: 'from-purple-900 to-slate-900', display_order: 1, is_active: true });
  const [newSection, setNewSection] = useState({ title: '', slug: '', section_type: 'grid', display_order: 1, is_active: true });
  const [newFeatured, setNewFeatured] = useState({ section_id: '', product_id: '', display_order: 1 });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchBanners(), fetchSections(), fetchFeatured(), fetchAnalytics()]);
    setLoading(false);
  }

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('product_name');
    setProducts((data || []) as Product[]);
  }

  async function fetchBanners() {
    const { data } = await (supabase as any).from('marketplace_banners').select('*').order('display_order');
    setBanners(data || []);
  }

  async function fetchSections() {
    const { data } = await (supabase as any).from('marketplace_sections').select('*').order('display_order');
    setSections(data || []);
  }

  async function fetchFeatured() {
    const { data } = await (supabase as any).from('marketplace_featured').select('*, products(product_name), marketplace_sections(title)');
    setFeatured(data || []);
  }

  async function fetchAnalytics() {
    const [p, o, i] = await Promise.all([
      supabase.from('products').select('product_id, is_active'),
      (supabase as any).from('marketplace_orders').select('order_id'),
      (supabase as any).from('marketplace_order_items').select('order_item_id'),
    ]);
    const prods = (p.data || []) as Array<{ is_active: boolean | null }>;
    setAnalytics({
      totalProducts: prods.length,
      activeProducts: prods.filter(prod => prod.is_active).length,
      totalOrders: (o.data || []).length,
      totalItems: (i.data || []).length,
    });
  }

  async function addProduct() {
    if (!newProduct.product_name.trim()) { toast.error('Product name required'); return; }
    const monthlyVal = newProduct.monthly_price ? parseFloat(newProduct.monthly_price) : null;
    const lifetimeVal = newProduct.lifetime_price ? parseFloat(newProduct.lifetime_price) : null;
    if (monthlyVal !== null && (isNaN(monthlyVal) || monthlyVal <= 0)) { toast.error('Monthly price must be a positive number'); return; }
    if (lifetimeVal !== null && (isNaN(lifetimeVal) || lifetimeVal <= 0)) { toast.error('Lifetime price must be a positive number'); return; }
    const features = newProduct.features_csv ? newProduct.features_csv.split(',').map(f => f.trim()).filter(Boolean) : [];
    const { error } = await supabase.from('products').insert({
      product_name: newProduct.product_name,
      category: newProduct.category || null,
      description: newProduct.description || null,
      monthly_price: monthlyVal,
      lifetime_price: lifetimeVal,
      pricing_model: newProduct.pricing_model || null,
      product_type: newProduct.product_type || null,
      tech_stack: newProduct.tech_stack || null,
      features_json: features.length ? features : null,
      is_active: newProduct.is_active,
      status: 'active',
    } as any);
    if (error) { toast.error('Failed to add product'); return; }
    toast.success('Product added');
    setShowProductDialog(false);
    setNewProduct({ product_name: '', category: '', description: '', monthly_price: '', lifetime_price: '', pricing_model: 'monthly', product_type: '', tech_stack: '', features_csv: '', is_active: true });
    fetchProducts();
    fetchAnalytics();
  }

  async function toggleProductActive(id: string, current: boolean | null) {
    await supabase.from('products').update({ is_active: !current } as any).eq('product_id', id);
    fetchProducts();
  }

  async function deleteProduct(id: string) {
    const { data: existingOrders } = await (supabase as any)
      .from('marketplace_order_items')
      .select('order_item_id')
      .eq('product_id', id)
      .limit(1);
    if (existingOrders && existingOrders.length > 0) {
      toast.error('Cannot delete: product has existing orders');
      return;
    }
    const { error } = await supabase.from('products').delete().eq('product_id', id);
    if (error) { toast.error('Failed to delete'); return; }
    toast.success('Product deleted');
    fetchProducts();
    fetchAnalytics();
  }

  async function addBanner() {
    if (!newBanner.title.trim()) { toast.error('Title required'); return; }
    const { error } = await (supabase as any).from('marketplace_banners').insert(newBanner);
    if (error) { toast.error('Failed to add banner'); return; }
    toast.success('Banner added');
    setShowBannerDialog(false);
    setNewBanner({ title: '', subtitle: '', cta_text: '', cta_link: '', bg_color: 'from-purple-900 to-slate-900', display_order: 1, is_active: true });
    fetchBanners();
  }

  async function deleteBanner(id: string) {
    await (supabase as any).from('marketplace_banners').delete().eq('banner_id', id);
    toast.success('Banner deleted');
    fetchBanners();
  }

  async function addSection() {
    if (!newSection.title.trim() || !newSection.slug.trim()) { toast.error('Title and slug required'); return; }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(newSection.slug)) {
      toast.error('Slug must be lowercase with hyphens only (e.g. featured-products)');
      return;
    }
    const { error } = await (supabase as any).from('marketplace_sections').insert(newSection);
    if (error) { toast.error('Failed to add section'); return; }
    toast.success('Section added');
    setShowSectionDialog(false);
    setNewSection({ title: '', slug: '', section_type: 'grid', display_order: 1, is_active: true });
    fetchSections();
  }

  async function deleteSection(id: string) {
    await (supabase as any).from('marketplace_sections').delete().eq('id', id);
    toast.success('Section deleted');
    fetchSections();
  }

  async function addFeatured() {
    if (!newFeatured.section_id || !newFeatured.product_id) { toast.error('Section and product required'); return; }
    const { error } = await (supabase as any).from('marketplace_featured').insert(newFeatured);
    if (error) { toast.error('Failed to add featured'); return; }
    toast.success('Featured product added');
    setShowFeaturedDialog(false);
    setNewFeatured({ section_id: '', product_id: '', display_order: 1 });
    fetchFeatured();
  }

  async function deleteFeatured(id: string) {
    await (supabase as any).from('marketplace_featured').delete().eq('featured_id', id);
    toast.success('Removed from featured');
    fetchFeatured();
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-purple-500 animate-spin" /></div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Marketplace Admin</h2>
        <p className="text-slate-400 text-sm mt-1">Manage products, banners, sections, and featured content</p>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="products" className="data-[state=active]:bg-purple-600"><Package className="h-4 w-4 mr-1.5" />Products</TabsTrigger>
          <TabsTrigger value="banners" className="data-[state=active]:bg-purple-600"><Image className="h-4 w-4 mr-1.5" />Banners</TabsTrigger>
          <TabsTrigger value="sections" className="data-[state=active]:bg-purple-600"><Layers className="h-4 w-4 mr-1.5" />Sections</TabsTrigger>
          <TabsTrigger value="featured" className="data-[state=active]:bg-purple-600"><Star className="h-4 w-4 mr-1.5" />Featured</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600"><BarChart3 className="h-4 w-4 mr-1.5" />Analytics</TabsTrigger>
        </TabsList>

        {/* PRODUCTS TAB */}
        <TabsContent value="products" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-slate-400 text-sm">{products.length} total products</p>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowProductDialog(true)}><Plus className="h-4 w-4 mr-1.5" />Add Product</Button>
          </div>
          <Card className="bg-slate-800/80 border-slate-700">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-400">Name</TableHead>
                  <TableHead className="text-slate-400">Category</TableHead>
                  <TableHead className="text-slate-400">Monthly</TableHead>
                  <TableHead className="text-slate-400">Lifetime</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Active</TableHead>
                  <TableHead className="text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(p => (
                  <TableRow key={p.product_id} className="border-slate-700 hover:bg-slate-700/30">
                    <TableCell className="text-white font-medium">{p.product_name}</TableCell>
                    <TableCell className="text-slate-400">{p.category || '—'}</TableCell>
                    <TableCell className="text-slate-400">{p.monthly_price ? `₹${p.monthly_price}` : '—'}</TableCell>
                    <TableCell className="text-slate-400">{p.lifetime_price ? `₹${p.lifetime_price}` : '—'}</TableCell>
                    <TableCell><Badge className={p.status === 'active' ? 'bg-green-900/50 text-green-300 border-green-700' : 'bg-slate-700 text-slate-400'}>{p.status || '—'}</Badge></TableCell>
                    <TableCell>
                      <button onClick={() => toggleProductActive(p.product_id, p.is_active)} className="text-slate-400 hover:text-white transition-colors">
                        {p.is_active ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-7 w-7 p-0" onClick={() => deleteProduct(p.product_id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-slate-500 py-8">No products yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* BANNERS TAB */}
        <TabsContent value="banners" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-slate-400 text-sm">{banners.length} banners</p>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowBannerDialog(true)}><Plus className="h-4 w-4 mr-1.5" />Add Banner</Button>
          </div>
          <div className="space-y-3">
            {banners.map(b => (
              <Card key={b.banner_id} className="bg-slate-800/80 border-slate-700">
                <CardContent className="py-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{b.title}</p>
                    {b.subtitle && <p className="text-slate-400 text-sm">{b.subtitle}</p>}
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">Order: {b.display_order}</Badge>
                      <Badge className={b.is_active ? 'bg-green-900/50 text-green-300 border-green-700 text-xs' : 'bg-slate-700 text-slate-400 text-xs'}>{b.is_active ? 'Active' : 'Inactive'}</Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => deleteBanner(b.banner_id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
            {banners.length === 0 && <p className="text-center text-slate-500 py-8">No banners yet</p>}
          </div>
        </TabsContent>

        {/* SECTIONS TAB */}
        <TabsContent value="sections" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-slate-400 text-sm">{sections.length} sections</p>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowSectionDialog(true)}><Plus className="h-4 w-4 mr-1.5" />Add Section</Button>
          </div>
          <Card className="bg-slate-800/80 border-slate-700">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-400">Title</TableHead>
                  <TableHead className="text-slate-400">Slug</TableHead>
                  <TableHead className="text-slate-400">Type</TableHead>
                  <TableHead className="text-slate-400">Order</TableHead>
                  <TableHead className="text-slate-400">Active</TableHead>
                  <TableHead className="text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.map(s => (
                  <TableRow key={s.id} className="border-slate-700 hover:bg-slate-700/30">
                    <TableCell className="text-white">{s.title}</TableCell>
                    <TableCell className="text-slate-400 font-mono text-sm">{s.slug}</TableCell>
                    <TableCell className="text-slate-400">{s.section_type}</TableCell>
                    <TableCell className="text-slate-400">{s.display_order}</TableCell>
                    <TableCell><Badge className={s.is_active ? 'bg-green-900/50 text-green-300 border-green-700 text-xs' : 'bg-slate-700 text-slate-400 text-xs'}>{s.is_active ? 'Yes' : 'No'}</Badge></TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-7 w-7 p-0" onClick={() => deleteSection(s.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {sections.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-8">No sections yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* FEATURED TAB */}
        <TabsContent value="featured" className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-slate-400 text-sm">{featured.length} featured products</p>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowFeaturedDialog(true)}><Plus className="h-4 w-4 mr-1.5" />Add Featured</Button>
          </div>
          <Card className="bg-slate-800/80 border-slate-700">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-400">Product</TableHead>
                  <TableHead className="text-slate-400">Section</TableHead>
                  <TableHead className="text-slate-400">Order</TableHead>
                  <TableHead className="text-slate-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {featured.map(f => (
                  <TableRow key={f.featured_id} className="border-slate-700 hover:bg-slate-700/30">
                    <TableCell className="text-white">{f.products?.product_name || f.product_id || '—'}</TableCell>
                    <TableCell className="text-slate-400">{f.marketplace_sections?.title || f.section_id || '—'}</TableCell>
                    <TableCell className="text-slate-400">{f.display_order}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-7 w-7 p-0" onClick={() => deleteFeatured(f.featured_id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {featured.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center text-slate-500 py-8">No featured products yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics" className="mt-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Products', value: analytics.totalProducts, icon: Package, color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-700/50' },
              { label: 'Active Products', value: analytics.activeProducts, icon: Eye, color: 'text-green-400', bg: 'bg-green-900/20 border-green-700/50' },
              { label: 'Total Orders', value: analytics.totalOrders, icon: ShoppingBag, color: 'text-purple-400', bg: 'bg-purple-900/20 border-purple-700/50' },
              { label: 'Order Items', value: analytics.totalItems, icon: BarChart3, color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-700/50' },
            ].map(stat => (
              <Card key={stat.label} className={`border ${stat.bg}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">{stat.label}</p>
                      <p className="text-white text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-slate-400 text-sm">Product Name *</Label>
                <Input className="mt-1 bg-slate-800 border-slate-700 text-white" value={newProduct.product_name} onChange={e => setNewProduct(p => ({ ...p, product_name: e.target.value }))} />
              </div>
              <div>
                <Label className="text-slate-400 text-sm">Category</Label>
                <Input className="mt-1 bg-slate-800 border-slate-700 text-white" value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} />
              </div>
              <div>
                <Label className="text-slate-400 text-sm">Product Type</Label>
                <Input className="mt-1 bg-slate-800 border-slate-700 text-white" placeholder="e.g. SaaS, Desktop" value={newProduct.product_type} onChange={e => setNewProduct(p => ({ ...p, product_type: e.target.value }))} />
              </div>
              <div>
                <Label className="text-slate-400 text-sm">Monthly Price (₹)</Label>
                <Input type="number" className="mt-1 bg-slate-800 border-slate-700 text-white" value={newProduct.monthly_price} onChange={e => setNewProduct(p => ({ ...p, monthly_price: e.target.value }))} />
              </div>
              <div>
                <Label className="text-slate-400 text-sm">Lifetime Price (₹)</Label>
                <Input type="number" className="mt-1 bg-slate-800 border-slate-700 text-white" value={newProduct.lifetime_price} onChange={e => setNewProduct(p => ({ ...p, lifetime_price: e.target.value }))} />
              </div>
              <div>
                <Label className="text-slate-400 text-sm">Pricing Model</Label>
                <Select value={newProduct.pricing_model} onValueChange={v => setNewProduct(p => ({ ...p, pricing_model: v }))}>
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="lifetime">Lifetime</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-400 text-sm">Tech Stack</Label>
                <Input className="mt-1 bg-slate-800 border-slate-700 text-white" placeholder="React, Node.js, ..." value={newProduct.tech_stack} onChange={e => setNewProduct(p => ({ ...p, tech_stack: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <Label className="text-slate-400 text-sm">Description</Label>
                <Textarea className="mt-1 bg-slate-800 border-slate-700 text-white min-h-[80px]" value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <Label className="text-slate-400 text-sm">Features (comma-separated)</Label>
                <Textarea className="mt-1 bg-slate-800 border-slate-700 text-white min-h-[60px]" placeholder="Feature 1, Feature 2, Feature 3" value={newProduct.features_csv} onChange={e => setNewProduct(p => ({ ...p, features_csv: e.target.value }))} />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={newProduct.is_active} onCheckedChange={v => setNewProduct(p => ({ ...p, is_active: v }))} />
                <Label className="text-slate-400">Active</Label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setShowProductDialog(false)}>Cancel</Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={addProduct}>Add Product</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Banner Dialog */}
      <Dialog open={showBannerDialog} onOpenChange={setShowBannerDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader><DialogTitle>Add Banner</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-slate-400 text-sm">Title *</Label>
              <Input className="mt-1 bg-slate-800 border-slate-700 text-white" value={newBanner.title} onChange={e => setNewBanner(b => ({ ...b, title: e.target.value }))} />
            </div>
            <div>
              <Label className="text-slate-400 text-sm">Subtitle</Label>
              <Input className="mt-1 bg-slate-800 border-slate-700 text-white" value={newBanner.subtitle} onChange={e => setNewBanner(b => ({ ...b, subtitle: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-400 text-sm">CTA Text</Label>
                <Input className="mt-1 bg-slate-800 border-slate-700 text-white" value={newBanner.cta_text} onChange={e => setNewBanner(b => ({ ...b, cta_text: e.target.value }))} />
              </div>
              <div>
                <Label className="text-slate-400 text-sm">CTA Link</Label>
                <Input className="mt-1 bg-slate-800 border-slate-700 text-white" value={newBanner.cta_link} onChange={e => setNewBanner(b => ({ ...b, cta_link: e.target.value }))} />
              </div>
              <div>
                <Label className="text-slate-400 text-sm">Display Order</Label>
                <Input type="number" className="mt-1 bg-slate-800 border-slate-700 text-white" value={newBanner.display_order} onChange={e => setNewBanner(b => ({ ...b, display_order: parseInt(e.target.value) || 1 }))} />
              </div>
              <div className="flex items-center gap-3 mt-6">
                <Switch checked={newBanner.is_active} onCheckedChange={v => setNewBanner(b => ({ ...b, is_active: v }))} />
                <Label className="text-slate-400">Active</Label>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setShowBannerDialog(false)}>Cancel</Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={addBanner}>Add Banner</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Section Dialog */}
      <Dialog open={showSectionDialog} onOpenChange={setShowSectionDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader><DialogTitle>Add Section</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-slate-400 text-sm">Title *</Label>
              <Input className="mt-1 bg-slate-800 border-slate-700 text-white" value={newSection.title} onChange={e => setNewSection(s => ({ ...s, title: e.target.value }))} />
            </div>
            <div>
              <Label className="text-slate-400 text-sm">Slug *</Label>
              <Input className="mt-1 bg-slate-800 border-slate-700 text-white font-mono" placeholder="e.g. featured-products" value={newSection.slug} onChange={e => setNewSection(s => ({ ...s, slug: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-400 text-sm">Section Type</Label>
                <Select value={newSection.section_type} onValueChange={v => setNewSection(s => ({ ...s, section_type: v }))}>
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="carousel">Carousel</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-400 text-sm">Display Order</Label>
                <Input type="number" className="mt-1 bg-slate-800 border-slate-700 text-white" value={newSection.display_order} onChange={e => setNewSection(s => ({ ...s, display_order: parseInt(e.target.value) || 1 }))} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={newSection.is_active} onCheckedChange={v => setNewSection(s => ({ ...s, is_active: v }))} />
              <Label className="text-slate-400">Active</Label>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setShowSectionDialog(false)}>Cancel</Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={addSection}>Add Section</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Featured Dialog */}
      <Dialog open={showFeaturedDialog} onOpenChange={setShowFeaturedDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader><DialogTitle>Add Featured Product</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-slate-400 text-sm">Section *</Label>
              <Select value={newFeatured.section_id} onValueChange={v => setNewFeatured(f => ({ ...f, section_id: v }))}>
                <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Select section" /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {sections.map(s => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-400 text-sm">Product *</Label>
              <Select value={newFeatured.product_id} onValueChange={v => setNewFeatured(f => ({ ...f, product_id: v }))}>
                <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-white"><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {products.map(p => <SelectItem key={p.product_id} value={p.product_id}>{p.product_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-400 text-sm">Display Order</Label>
              <Input type="number" className="mt-1 bg-slate-800 border-slate-700 text-white" value={newFeatured.display_order} onChange={e => setNewFeatured(f => ({ ...f, display_order: parseInt(e.target.value) || 1 }))} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => setShowFeaturedDialog(false)}>Cancel</Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={addFeatured}>Add Featured</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
