import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FolderTree, 
  ChevronRight, 
  Eye, 
  Edit, 
  Plus,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';

interface PTCategoriesProps {
  category?: string;
}

const categoryData = {
  sales: {
    label: 'Sales',
    color: 'bg-blue-500/20 text-blue-400',
    subCategories: [
      { id: 'price-lock', label: 'Price Lock', count: 12 },
      { id: 'discount', label: 'Discount Commitment', count: 8 },
      { id: 'demo', label: 'Demo Timeline', count: 5 },
    ]
  },
  support: {
    label: 'Support',
    color: 'bg-green-500/20 text-green-400',
    subCategories: [
      { id: 'response', label: 'Response Time', count: 24 },
      { id: 'resolution', label: 'Resolution Time', count: 18 },
      { id: 'callback', label: 'Callback', count: 6 },
    ]
  },
  delivery: {
    label: 'Delivery',
    color: 'bg-purple-500/20 text-purple-400',
    subCategories: [
      { id: 'golive', label: 'Go-Live', count: 15 },
      { id: 'feature', label: 'Feature Delivery', count: 22 },
      { id: 'update', label: 'Update Release', count: 9 },
    ]
  },
  payment: {
    label: 'Payment',
    color: 'bg-amber-500/20 text-amber-400',
    subCategories: [
      { id: 'refund', label: 'Refund Promise', count: 7 },
      { id: 'payout', label: 'Payout Date', count: 11 },
      { id: 'invoice', label: 'Invoice Clearance', count: 4 },
    ]
  },
  legal: {
    label: 'Legal',
    color: 'bg-red-500/20 text-red-400',
    subCategories: [
      { id: 'agreement', label: 'Agreement Delivery', count: 3 },
      { id: 'nda', label: 'NDA', count: 5 },
      { id: 'compliance', label: 'Compliance', count: 2 },
    ]
  },
  partnership: {
    label: 'Partnership',
    color: 'bg-cyan-500/20 text-cyan-400',
    subCategories: [
      { id: 'revenue', label: 'Revenue Share', count: 4 },
      { id: 'integration', label: 'Integration Timeline', count: 6 },
      { id: 'support-level', label: 'Support Level', count: 2 },
    ]
  },
  sla: {
    label: 'SLA',
    color: 'bg-orange-500/20 text-orange-400',
    subCategories: [
      { id: 'uptime', label: 'Uptime Commitment', count: 8 },
      { id: 'response-sla', label: 'Response SLA', count: 12 },
      { id: 'resolution-sla', label: 'Resolution SLA', count: 10 },
    ]
  },
};

export default function PTCategories({ category }: PTCategoriesProps) {
  const logAction = (action: string, target: string) => {
    toast.success(`✓ ${action}`, {
      description: `${target} • ${new Date().toLocaleTimeString()}`,
    });
  };

  const displayCategories = category && category !== 'promise-categories' 
    ? { [category]: categoryData[category as keyof typeof categoryData] }
    : categoryData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/20 rounded-xl">
            <FolderTree className="h-8 w-8 text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Promise Categories</h1>
            <p className="text-slate-400">Category structure (Macro → Sub → Nano)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">RUNNING</Badge>
          <Button variant="outline" size="sm" onClick={() => logAction('Add Category', 'New Category')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(displayCategories).map(([key, cat]) => (
          <Card key={key} className="bg-slate-900/50 border-slate-700/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={cat.color}>{cat.label}</Badge>
                  <Badge variant="outline" className="text-slate-400">
                    {cat.subCategories.reduce((sum, sub) => sum + sub.count, 0)} promises
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => logAction('View', cat.label)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => logAction('Edit', cat.label)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cat.subCategories.map((sub) => (
                  <div 
                    key={sub.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 cursor-pointer transition-colors"
                    onClick={() => logAction('View Sub-Category', sub.label)}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-300">{sub.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{sub.count}</Badge>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Nano Categories */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Layers className="h-5 w-5" />
            Nano Categories (Micro Actions)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['Exact Date', 'Exact Time', 'Conditional Trigger', 'Dependency Linked', 'Auto Reminder'].map((nano) => (
              <Badge 
                key={nano} 
                className="bg-slate-800 text-slate-300 cursor-pointer hover:bg-slate-700"
                onClick={() => logAction('View Nano', nano)}
              >
                {nano}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
