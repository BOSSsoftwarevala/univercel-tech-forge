/**
 * CATEGORY MANAGEMENT
 * Categories, sub-categories, micro-categories
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderTree, Plus, ChevronRight, Edit, Power, 
  Folder, FolderOpen 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  productCount: number;
  subCategories?: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  productCount: number;
  microCategories?: { id: string; name: string; productCount: number }[];
}

const mockCategories: Category[] = [
  { 
    id: '1', 
    name: 'Education', 
    productCount: 45,
    subCategories: [
      { id: '1-1', name: 'School', productCount: 20, microCategories: [
        { id: '1-1-1', name: 'School ERP', productCount: 8 },
        { id: '1-1-2', name: 'LMS', productCount: 12 },
      ]},
      { id: '1-2', name: 'College', productCount: 15 },
      { id: '1-3', name: 'Training', productCount: 10 },
    ]
  },
  { 
    id: '2', 
    name: 'Healthcare', 
    productCount: 32,
    subCategories: [
      { id: '2-1', name: 'Hospital', productCount: 18 },
      { id: '2-2', name: 'Clinic', productCount: 14 },
    ]
  },
  { id: '3', name: 'Retail', productCount: 28 },
  { id: '4', name: 'Real Estate', productCount: 15 },
  { id: '5', name: 'Fitness', productCount: 12 },
];

export const Categories: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(new Set());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [categoryType, setCategoryType] = useState<'category' | 'sub' | 'micro'>('category');
  const [newName, setNewName] = useState('');
  const [parentCategory, setParentCategory] = useState('');

  const toggleCategory = (id: string) => {
    const newSet = new Set(expandedCategories);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedCategories(newSet);
  };

  const toggleSub = (id: string) => {
    const newSet = new Set(expandedSubs);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedSubs(newSet);
  };

  const handleAddCategory = () => {
    if (!newName) {
      toast.error('Category name is required');
      return;
    }
    toast.success(`${categoryType === 'category' ? 'Category' : categoryType === 'sub' ? 'Sub-Category' : 'Micro-Category'} "${newName}" added!`);
    setShowAddDialog(false);
    setNewName('');
    setParentCategory('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-violet-400" />
            Category Management
          </h1>
          <p className="text-sm text-muted-foreground">Organize products by category hierarchy</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Category Type</Label>
                <Select value={categoryType} onValueChange={(v: any) => setCategoryType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="category">Main Category</SelectItem>
                    <SelectItem value="sub">Sub Category</SelectItem>
                    <SelectItem value="micro">Micro Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(categoryType === 'sub' || categoryType === 'micro') && (
                <div className="space-y-2">
                  <Label>Parent Category</Label>
                  <Select value={parentCategory} onValueChange={setParentCategory}>
                    <SelectTrigger><SelectValue placeholder="Select parent" /></SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input 
                  placeholder="Enter category name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <Button onClick={handleAddCategory} className="w-full bg-violet-600 hover:bg-violet-700">
                Add Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Tree */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-4">
          <div className="space-y-2">
            {mockCategories.map((category) => {
              const isExpanded = expandedCategories.has(category.id);
              const hasSubs = category.subCategories && category.subCategories.length > 0;
              
              return (
                <div key={category.id} className="space-y-1">
                  {/* Main Category */}
                  <motion.div
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all",
                      isExpanded ? "bg-violet-500/10" : "hover:bg-muted/50"
                    )}
                    onClick={() => hasSubs && toggleCategory(category.id)}
                  >
                    {hasSubs && (
                      <ChevronRight className={cn(
                        "w-4 h-4 transition-transform",
                        isExpanded && "rotate-90"
                      )} />
                    )}
                    {!hasSubs && <div className="w-4" />}
                    {isExpanded ? (
                      <FolderOpen className="w-5 h-5 text-violet-400" />
                    ) : (
                      <Folder className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className="flex-1 font-medium text-foreground">{category.name}</span>
                    <span className="text-xs text-muted-foreground">{category.productCount} products</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Power className="w-3.5 h-3.5" />
                    </Button>
                  </motion.div>

                  {/* Sub Categories */}
                  {isExpanded && category.subCategories && (
                    <div className="ml-6 space-y-1">
                      {category.subCategories.map((sub) => {
                        const isSubExpanded = expandedSubs.has(sub.id);
                        const hasMicro = sub.microCategories && sub.microCategories.length > 0;
                        
                        return (
                          <div key={sub.id} className="space-y-1">
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={cn(
                                "flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all",
                                isSubExpanded ? "bg-blue-500/10" : "hover:bg-muted/30"
                              )}
                              onClick={() => hasMicro && toggleSub(sub.id)}
                            >
                              {hasMicro && (
                                <ChevronRight className={cn(
                                  "w-3.5 h-3.5 transition-transform",
                                  isSubExpanded && "rotate-90"
                                )} />
                              )}
                              {!hasMicro && <div className="w-3.5" />}
                              <Folder className="w-4 h-4 text-blue-400" />
                              <span className="flex-1 text-sm text-foreground">{sub.name}</span>
                              <span className="text-xs text-muted-foreground">{sub.productCount}</span>
                            </motion.div>

                            {/* Micro Categories */}
                            {isSubExpanded && sub.microCategories && (
                              <div className="ml-6 space-y-1">
                                {sub.microCategories.map((micro) => (
                                  <motion.div
                                    key={micro.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 cursor-pointer"
                                  >
                                    <div className="w-3" />
                                    <Folder className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="flex-1 text-xs text-foreground">{micro.name}</span>
                                    <span className="text-[10px] text-muted-foreground">{micro.productCount}</span>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
