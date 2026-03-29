import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useProductActions } from '@/hooks/useProductActions';
import {
  Package,
  Save,
  X,
  Sparkles,
  Loader2,
  Plus,
  Trash2,
  Image,
  MonitorPlay,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  subcategories?: { id: string; name: string }[];
}

interface Demo {
  id: string;
  title: string;
  url: string;
  status: string;
}

interface PMProductFormProps {
  productId?: string;
  onSave: () => void;
  onCancel: () => void;
}

const PMProductForm: React.FC<PMProductFormProps> = ({ productId, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [demos, setDemos] = useState<Demo[]>([]);
  const [formData, setFormData] = useState({
    product_name: '',
    product_type: 'software',
    description: '',
    business_category_id: '',
    subcategory_id: '',
    pricing_model: 'one_time',
    lifetime_price: 0,
    monthly_price: 0,
    status: 'draft',
    features: [] as string[],
    demo_ids: [] as string[],
  });
  const [newFeature, setNewFeature] = useState('');

  const { aiAutoDescribe, aiSuggestFeatures, actionState } = useProductActions();

  useEffect(() => {
    fetchCategories();
    fetchDemos();
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('business_categories')
      .select('*, subcategories:business_subcategories(id, name)')
      .eq('is_active', true)
      .order('display_order');
    if (data) setCategories(data);
  };

  const fetchDemos = async () => {
    const { data } = await supabase
      .from('demos')
      .select('id, title, url, status')
      .eq('status', 'active')
      .order('title');
    if (data) setDemos(data as Demo[]);
  };

  const fetchProduct = async () => {
    if (!productId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, demo_mappings:product_demo_mappings(demo_id)')
      .eq('product_id', productId)
      .single();

    if (data) {
      setFormData({
        product_name: data.product_name || '',
        product_type: data.product_type || 'software',
        description: data.description || '',
        business_category_id: data.business_category_id || '',
        subcategory_id: data.subcategory_id || '',
        pricing_model: data.pricing_model || 'one_time',
        lifetime_price: data.lifetime_price || 0,
        monthly_price: data.monthly_price || 0,
        status: data.status || 'draft',
        features: Array.isArray(data.features_json) 
          ? (data.features_json as unknown[]).map(f => String(f)) 
          : [],
        demo_ids: data.demo_mappings?.map((m: any) => m.demo_id) || [],
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.product_name) {
      toast.error('Product name is required');
      return;
    }

    setLoading(true);
    try {
      const productData = {
        product_name: formData.product_name,
        product_type: formData.product_type,
        description: formData.description,
        business_category_id: formData.business_category_id || null,
        subcategory_id: formData.subcategory_id || null,
        pricing_model: formData.pricing_model,
        lifetime_price: formData.lifetime_price,
        monthly_price: formData.monthly_price,
        status: formData.status,
        features_json: formData.features,
      };

      if (productId) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('product_id', productId);

        if (error) throw error;

        // Update demo mappings
        await supabase.from('product_demo_mappings').delete().eq('product_id', productId);
        if (formData.demo_ids.length > 0) {
          await supabase.from('product_demo_mappings').insert(
            formData.demo_ids.map(demo_id => ({ product_id: productId, demo_id }))
          );
        }

        // Log action
        await supabase.from('product_action_logs').insert([{
          product_id: productId,
          product_name: formData.product_name,
          action: 'product_updated',
          action_details: productData,
        }]);

        toast.success('Product updated successfully');
      } else {
        // Create new product
        const { data: newProduct, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();

        if (error) throw error;

        // Create demo mappings
        if (formData.demo_ids.length > 0 && newProduct) {
          await supabase.from('product_demo_mappings').insert(
            formData.demo_ids.map(demo_id => ({ product_id: newProduct.product_id, demo_id }))
          );
        }

        // Log action
        await supabase.from('product_action_logs').insert([{
          product_id: newProduct.product_id,
          product_name: formData.product_name,
          action: 'product_created',
          action_details: productData,
        }]);

        toast.success('Product created successfully');
      }

      onSave();
    } catch (error: any) {
      toast.error('Failed to save product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAIDescribe = async () => {
    const description = await aiAutoDescribe(formData.product_name, formData.features);
    if (description) {
      setFormData({ ...formData, description });
    }
  };

  const handleAISuggestFeatures = async () => {
    const suggestions = await aiSuggestFeatures(formData.product_type);
    if (suggestions.length > 0) {
      setFormData({ ...formData, features: [...formData.features, ...suggestions] });
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const selectedCategory = categories.find(c => c.id === formData.business_category_id);
  const subcategories = selectedCategory?.subcategories || [];

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            {productId ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {productId ? 'Update product details and settings' : 'Create a new product with full details'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Product
          </Button>
        </div>
      </div>

      {/* Form Sections */}
      <div className="grid gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product Name *</label>
              <Input
                placeholder="Enter product name"
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Product Type</label>
                <Select
                  value={formData.product_type}
                  onValueChange={(v) => setFormData({ ...formData, product_type: v })}
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
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="parked">Parked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Category Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Main Category</label>
                <Select
                  value={formData.business_category_id}
                  onValueChange={(v) => setFormData({ ...formData, business_category_id: v, subcategory_id: '' })}
                >
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Sub Category</label>
                <Select
                  value={formData.subcategory_id}
                  onValueChange={(v) => setFormData({ ...formData, subcategory_id: v })}
                  disabled={!formData.business_category_id}
                >
                  <SelectTrigger><SelectValue placeholder="Select sub-category" /></SelectTrigger>
                  <SelectContent>
                    {subcategories.map(sub => (
                      <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Description</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleAIDescribe}
              disabled={actionState.loading || !formData.product_name}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI Generate
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter product description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Features</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleAISuggestFeatures}
              disabled={actionState.loading}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI Suggest
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a feature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addFeature()}
              />
              <Button onClick={addFeature}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="gap-2">
                  {feature}
                  <button onClick={() => removeFeature(index)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pricing & Plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Pricing Model</label>
              <Select
                value={formData.pricing_model}
                onValueChange={(v) => setFormData({ ...formData, pricing_model: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_time">One-Time</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="tier_based">Tier-Based</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Lifetime Price (USD)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.lifetime_price || ''}
                  onChange={(e) => setFormData({ ...formData, lifetime_price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Monthly Price (USD)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.monthly_price || ''}
                  onChange={(e) => setFormData({ ...formData, monthly_price: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MonitorPlay className="w-4 h-4" />
              Demo Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Select demos to link with this product</p>
            <ScrollArea className="h-40 border rounded-lg p-3">
              {demos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No active demos available</p>
              ) : (
                <div className="space-y-2">
                  {demos.map(demo => (
                    <label key={demo.id} className="flex items-center gap-3 p-2 hover:bg-secondary/50 rounded cursor-pointer">
                      <Checkbox
                        checked={formData.demo_ids.includes(demo.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, demo_ids: [...formData.demo_ids, demo.id] });
                          } else {
                            setFormData({ ...formData, demo_ids: formData.demo_ids.filter(id => id !== demo.id) });
                          }
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{demo.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{demo.url}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{demo.status}</Badge>
                    </label>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PMProductForm;
