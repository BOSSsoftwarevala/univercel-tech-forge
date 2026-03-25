import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Save, 
  Play, 
  X,
  Calendar,
  User,
  Target,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';

const categories = [
  { id: 'sales', label: 'Sales', subCategories: ['Price Lock', 'Discount Commitment', 'Demo Timeline'] },
  { id: 'support', label: 'Support', subCategories: ['Response Time', 'Resolution Time', 'Callback'] },
  { id: 'delivery', label: 'Delivery', subCategories: ['Go-Live', 'Feature Delivery', 'Update Release'] },
  { id: 'payment', label: 'Payment', subCategories: ['Refund Promise', 'Payout Date', 'Invoice Clearance'] },
  { id: 'legal', label: 'Legal', subCategories: ['Agreement Delivery', 'NDA', 'Compliance'] },
  { id: 'partnership', label: 'Partnership', subCategories: ['Revenue Share', 'Integration Timeline', 'Support Level'] },
  { id: 'sla', label: 'SLA', subCategories: ['Uptime Commitment', 'Response SLA', 'Resolution SLA'] },
];

const nanoCategories = ['Exact Date', 'Exact Time', 'Conditional Trigger', 'Dependency Linked', 'Auto Reminder'];

export default function PTCreatePromise() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subCategory: '',
    nanoCategory: '',
    owner: '',
    receiver: '',
    deadline: '',
    deadlineTime: '',
    priority: '',
    linkedModule: '',
  });

  const selectedCategory = categories.find(c => c.id === formData.category);

  const handleSaveDraft = () => {
    toast.success('Draft Saved', { description: 'Promise saved as draft' });
  };

  const handleActivate = () => {
    toast.success('Promise Activated', { description: 'Promise is now active and tracking' });
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      subCategory: '',
      nanoCategory: '',
      owner: '',
      receiver: '',
      deadline: '',
      deadlineTime: '',
      priority: '',
      linkedModule: '',
    });
    toast.info('Form Cleared');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/20 rounded-xl">
            <Plus className="h-8 w-8 text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Create Promise</h1>
            <p className="text-slate-400">Add new promise to the tracker</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">RUNNING</Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">AI ACTIVE</Badge>
        </div>
      </div>

      {/* Form */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="h-5 w-5" />
            Promise Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Promise Title *</Label>
              <Input 
                placeholder="Enter promise title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Priority *</Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Promise Description</Label>
            <Textarea 
              placeholder="Describe the promise in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-slate-800/50 border-slate-700 min-h-[100px]"
            />
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300 flex items-center gap-2">
                <Layers className="h-4 w-4" /> Category *
              </Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v, subCategory: '' })}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Sub Category *</Label>
              <Select 
                value={formData.subCategory} 
                onValueChange={(v) => setFormData({ ...formData, subCategory: v })}
                disabled={!formData.category}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue placeholder="Select sub category" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory?.subCategories.map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Nano Category</Label>
              <Select value={formData.nanoCategory} onValueChange={(v) => setFormData({ ...formData, nanoCategory: v })}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue placeholder="Select nano category" />
                </SelectTrigger>
                <SelectContent>
                  {nanoCategories.map(nano => (
                    <SelectItem key={nano} value={nano}>{nano}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Owner & Receiver */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300 flex items-center gap-2">
                <User className="h-4 w-4" /> Owner (Role/User) *
              </Label>
              <Input 
                placeholder="Enter owner"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Receiver (Client/User/System) *</Label>
              <Input 
                placeholder="Enter receiver"
                value={formData.receiver}
                onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>
          </div>

          {/* Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Deadline Date *
              </Label>
              <Input 
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Deadline Time</Label>
              <Input 
                type="time"
                value={formData.deadlineTime}
                onChange={(e) => setFormData({ ...formData, deadlineTime: e.target.value })}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Linked Module</Label>
              <Select value={formData.linkedModule} onValueChange={(v) => setFormData({ ...formData, linkedModule: v })}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="order">Order</SelectItem>
                  <SelectItem value="ticket">Ticket</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-700/50">
            <Button onClick={handleSaveDraft} variant="outline" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={handleActivate} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
              <Play className="h-4 w-4" />
              Activate
            </Button>
            <Button onClick={handleCancel} variant="ghost" className="flex items-center gap-2 text-slate-400">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
