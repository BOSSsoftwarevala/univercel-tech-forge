import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useProductActions } from '@/hooks/useProductActions';
import {
  Package,
  Plus,
  Upload,
  Download,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  PauseCircle,
  PlayCircle,
  Power,
  Trash2,
  MonitorPlay,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface Product {
  product_id: string;
  product_name: string;
  product_type: string;
  description: string;
  status: string;
  business_category_id: string;
  subcategory_id: string;
  pricing_model: string;
  lifetime_price: number;
  created_at: string;
  category?: { id: string; name: string };
  subcategory?: { id: string; name: string };
  demo_count?: number;
}

interface Category {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
}

const PMAllProducts: React.FC<{ onAddProduct: () => void }> = ({ onAddProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  const { 
    actionState, 
    updateProduct, 
    duplicateProduct, 
    parkProduct, 
    disableProduct, 
    deleteProduct, 
    exportProducts,
    aiAutoDescribe,
  } = useProductActions();

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase
      .from('business_categories')
      .select('*, subcategories:business_subcategories(id, name)')
      .eq('is_active', true);
    if (data) setCategories(data);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:business_categories(id, name),
          subcategory:business_subcategories(id, name)
        `)
        .order('created_at', { ascending: false });

      if (filterCategory !== 'all') query = query.eq('business_category_id', filterCategory);
      if (filterStatus !== 'all') query = query.eq('status', filterStatus);
      if (search) query = query.ilike('product_name', `%${search}%`);

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch products: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [filterCategory, filterStatus, search]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedProducts(checked ? products.map(p => p.product_id) : []);
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    setSelectedProducts(prev => 
      checked ? [...prev, productId] : prev.filter(id => id !== productId)
    );
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setShowViewDialog(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      product_name: product.product_name,
      product_type: product.product_type,
      description: product.description,
      business_category_id: product.business_category_id,
      subcategory_id: product.subcategory_id,
      pricing_model: product.pricing_model,
      lifetime_price: product.lifetime_price,
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedProduct) return;
    const success = await updateProduct(selectedProduct.product_id, {
      product_name: editForm.product_name,
      product_type: editForm.product_type as any,
      description: editForm.description,
      main_category_id: editForm.business_category_id,
      sub_category_id: editForm.subcategory_id,
      pricing_model: editForm.pricing_model as any,
      base_price: editForm.lifetime_price,
    });
    if (success) {
      setShowEditDialog(false);
      fetchProducts();
    }
  };

  const handleDuplicate = async (product: Product) => {
    const result = await duplicateProduct(product.product_id);
    if (result) fetchProducts();
  };

  const handlePark = async (product: Product) => {
    const isPark = product.status !== 'parked' && product.status !== 'inactive';
    const success = await parkProduct(product.product_id, product.product_name, isPark);
    if (success) fetchProducts();
  };

  const handleDisable = async (product: Product) => {
    const success = await disableProduct(product.product_id, product.product_name);
    if (success) fetchProducts();
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    const success = await deleteProduct(selectedProduct.product_id, selectedProduct.product_name);
    if (success) {
      setShowDeleteConfirm(false);
      setSelectedProduct(null);
      fetchProducts();
    }
  };

  const handleAIDescribe = async () => {
    if (!editForm.product_name) return;
    const description = await aiAutoDescribe(editForm.product_name, []);
    if (description) {
      setEditForm(prev => ({ ...prev, description }));
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    await exportProducts(format);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }> = {
      active: { variant: 'default', icon: CheckCircle },
      parked: { variant: 'secondary', icon: PauseCircle },
      inactive: { variant: 'secondary', icon: PauseCircle },
      draft: { variant: 'outline', icon: Edit },
      disabled: { variant: 'destructive', icon: XCircle },
    };
    const config = variants[status] || variants.draft;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const selectedCategory = categories.find(c => c.id === editForm.business_category_id);
  const subcategories = selectedCategory?.subcategories || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            All Products
          </h1>
          <p className="text-muted-foreground text-sm">Manage all products with full CRUD operations</p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('csv')}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>Export as JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={onAddProduct}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="parked">Parked</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={fetchProducts}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            {selectedProducts.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {selectedProducts.length} selected
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground text-sm mb-4">Get started by adding your first product</p>
              <Button onClick={onAddProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedProducts.length === products.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.product_id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.product_id)}
                        onCheckedChange={(checked) => handleSelectProduct(product.product_id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.product_name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.product_type || 'software'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{product.category?.name || '-'}</p>
                        <p className="text-xs text-muted-foreground">{product.subcategory?.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>
                      {product.lifetime_price ? `$${product.lifetime_price}` : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(product)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(product)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(product)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handlePark(product)}>
                              {product.status === 'parked' || product.status === 'inactive' ? (
                                <><PlayCircle className="w-4 h-4 mr-2" />Un-Park</>
                              ) : (
                                <><PauseCircle className="w-4 h-4 mr-2" />Park</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDisable(product)}>
                              <Power className="w-4 h-4 mr-2" />
                              Disable
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MonitorPlay className="w-4 h-4 mr-2" />
                              Assign Demo
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowDeleteConfirm(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedProduct.product_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedProduct.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{selectedProduct.product_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{selectedProduct.category?.name || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{selectedProduct.description || 'No description'}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
            <Button onClick={() => { setShowViewDialog(false); handleEdit(selectedProduct!); }}>Edit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product Name</label>
              <Input
                value={editForm.product_name || ''}
                onChange={(e) => setEditForm({ ...editForm, product_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={editForm.product_type || 'software'}
                  onValueChange={(v) => setEditForm({ ...editForm, product_type: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={editForm.business_category_id || ''}
                  onValueChange={(v) => setEditForm({ ...editForm, business_category_id: v, subcategory_id: '' })}
                >
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Sub-category</label>
              <Select
                value={editForm.subcategory_id || ''}
                onValueChange={(v) => setEditForm({ ...editForm, subcategory_id: v })}
                disabled={!editForm.business_category_id}
              >
                <SelectTrigger><SelectValue placeholder="Select sub-category" /></SelectTrigger>
                <SelectContent>
                  {subcategories.map(sub => (
                    <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium">Description</label>
                <Button variant="ghost" size="sm" onClick={handleAIDescribe} disabled={actionState.loading}>
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Price</label>
              <Input
                type="number"
                value={editForm.lifetime_price || ''}
                onChange={(e) => setEditForm({ ...editForm, lifetime_price: parseFloat(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={actionState.loading}>
              {actionState.loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedProduct?.product_name}"? This action will soft-delete the product and can be reversed by an admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PMAllProducts;
