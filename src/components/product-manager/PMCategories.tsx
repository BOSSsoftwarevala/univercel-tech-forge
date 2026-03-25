import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  FolderTree,
  Layers,
  Grid3X3,
  Microscope,
  Atom,
  Plus,
  Edit,
  Power,
  GripVertical,
  ChevronRight,
  ChevronDown,
  Loader2,
  RefreshCw,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  level: 'main' | 'sub' | 'micro' | 'nano';
  parent_id?: string;
  is_active: boolean;
  display_order: number;
  children?: Category[];
  product_count?: number;
}

interface PMCategoriesProps {
  level: 'main' | 'sub' | 'micro' | 'nano';
}

const levelConfig = {
  main: { title: 'Main Categories', icon: Layers, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  sub: { title: 'Sub Categories', icon: Grid3X3, color: 'text-green-500', bgColor: 'bg-green-500/10' },
  micro: { title: 'Micro Categories', icon: Microscope, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  nano: { title: 'Nano Categories', icon: Atom, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
};

const PMCategories: React.FC<PMCategoriesProps> = ({ level }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    parent_id: '',
  });
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const config = levelConfig[level];
  const Icon = config.icon;

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // For main categories, use business_categories
      if (level === 'main') {
        const { data, error } = await supabase
          .from('business_categories')
          .select('id, name, is_active, display_order')
          .order('display_order');
        
        if (error) throw error;
        setCategories((data || []).map(c => ({ ...c, level: 'main' as const })));
      } 
      // For sub categories, use business_subcategories
      else if (level === 'sub') {
        const { data: parents } = await supabase
          .from('business_categories')
          .select('id, name')
          .eq('is_active', true);
        setParentCategories((parents || []).map(p => ({ ...p, level: 'main' as const, is_active: true, display_order: 0 })));

        const { data, error } = await supabase
          .from('business_subcategories')
          .select('id, name, category_id, is_active, display_order')
          .order('display_order');
        
        if (error) throw error;
        setCategories((data || []).map(c => ({ ...c, level: 'sub' as const, parent_id: c.category_id })));
      }
      // For micro and nano, we'll use mock data for now
      else {
        setCategories([
          { id: '1', name: 'Source Type', level, is_active: true, display_order: 1, product_count: 12 },
          { id: '2', name: 'Budget Range', level, is_active: true, display_order: 2, product_count: 8 },
          { id: '3', name: 'Urgency Level', level, is_active: true, display_order: 3, product_count: 5 },
        ]);
      }
    } catch (error: any) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [level]);

  const handleCreate = async () => {
    if (!formData.name) {
      toast.error('Name is required');
      return;
    }

    try {
      if (level === 'main') {
        const { error } = await supabase
          .from('business_categories')
          .insert({ name: formData.name, is_active: true });
        if (error) throw error;
      } else if (level === 'sub') {
        if (!formData.parent_id) {
          toast.error('Parent category is required');
          return;
        }
        const { error } = await supabase
          .from('business_subcategories')
          .insert({ name: formData.name, category_id: formData.parent_id, is_active: true });
        if (error) throw error;
      }

      toast.success('Category created');
      setShowCreateDialog(false);
      setFormData({ name: '', parent_id: '' });
      fetchCategories();
    } catch (error: any) {
      toast.error('Failed to create category: ' + error.message);
    }
  };

  const handleEdit = async () => {
    if (!selectedCategory || !formData.name) return;

    try {
      if (level === 'main') {
        const { error } = await supabase
          .from('business_categories')
          .update({ name: formData.name })
          .eq('id', selectedCategory.id);
        if (error) throw error;
      } else if (level === 'sub') {
        const { error } = await supabase
          .from('business_subcategories')
          .update({ name: formData.name })
          .eq('id', selectedCategory.id);
        if (error) throw error;
      }

      toast.success('Category updated');
      setShowEditDialog(false);
      setSelectedCategory(null);
      setFormData({ name: '', parent_id: '' });
      fetchCategories();
    } catch (error: any) {
      toast.error('Failed to update category');
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      const newStatus = !category.is_active;
      if (level === 'main') {
        const { error } = await supabase
          .from('business_categories')
          .update({ is_active: newStatus })
          .eq('id', category.id);
        if (error) throw error;
      } else if (level === 'sub') {
        const { error } = await supabase
          .from('business_subcategories')
          .update({ is_active: newStatus })
          .eq('id', category.id);
        if (error) throw error;
      }

      toast.success(`Category ${newStatus ? 'enabled' : 'disabled'}`);
      fetchCategories();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setFormData({ name: category.name, parent_id: category.parent_id || '' });
    setShowEditDialog(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Icon className={`w-6 h-6 ${config.color}`} />
            {config.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage {level} level product categorization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchCategories}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add {level.charAt(0).toUpperCase() + level.slice(1)} Category
          </Button>
        </div>
      </div>

      {/* Category Level Indicator */}
      <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
        <div className="flex items-center gap-1">
          {Object.entries(levelConfig).map(([key, cfg], index) => {
            const LevelIcon = cfg.icon;
            const isActive = key === level;
            return (
              <React.Fragment key={key}>
                <div className={`p-2 rounded-lg ${isActive ? cfg.bgColor : 'bg-secondary'}`}>
                  <LevelIcon className={`w-4 h-4 ${isActive ? cfg.color : 'text-muted-foreground'}`} />
                </div>
                {index < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </React.Fragment>
            );
          })}
        </div>
        <span className="text-sm text-muted-foreground ml-auto">
          Hierarchy: Main → Sub → Micro → Nano
        </span>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderTree className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No Categories Found</h3>
            <p className="text-muted-foreground text-sm mb-4">Create your first {level} category</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className={!category.is_active ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={category.is_active ? 'default' : 'secondary'}>
                          {category.is_active ? 'Active' : 'Disabled'}
                        </Badge>
                        {category.product_count !== undefined && (
                          <span className="text-xs text-muted-foreground">
                            {category.product_count} products
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(category)}>
                      <Power className={`w-4 h-4 ${category.is_active ? 'text-green-500' : 'text-muted-foreground'}`} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create {level.charAt(0).toUpperCase() + level.slice(1)} Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {level !== 'main' && parentCategories.length > 0 && (
              <div>
                <label className="text-sm font-medium">Parent Category *</label>
                <Select
                  value={formData.parent_id}
                  onValueChange={(v) => setFormData({ ...formData, parent_id: v })}
                >
                  <SelectTrigger><SelectValue placeholder="Select parent" /></SelectTrigger>
                  <SelectContent>
                    {parentCategories.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Category Name *</label>
              <Input
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Category Name *</label>
              <Input
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PMCategories;
