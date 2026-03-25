import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  DollarSign,
  Plus,
  MoreVertical,
  Edit,
  Copy,
  Archive,
  Globe,
  Building2,
  Users,
  Check,
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  product_name: string;
  model: 'one_time' | 'subscription' | 'tier_based' | 'country_based';
  price: number;
  currency: string;
  billing_cycle?: string;
  tier_level?: number;
  country?: string;
  is_active: boolean;
  features: string[];
}

const mockPlans: PricingPlan[] = [
  { id: '1', name: 'Basic Plan', product_name: 'CRM Suite', model: 'subscription', price: 29, currency: 'USD', billing_cycle: 'monthly', is_active: true, features: ['5 Users', 'Basic Support'] },
  { id: '2', name: 'Pro Plan', product_name: 'CRM Suite', model: 'subscription', price: 99, currency: 'USD', billing_cycle: 'monthly', is_active: true, features: ['25 Users', 'Priority Support', 'API Access'] },
  { id: '3', name: 'Enterprise', product_name: 'CRM Suite', model: 'subscription', price: 299, currency: 'USD', billing_cycle: 'monthly', is_active: true, features: ['Unlimited Users', 'Dedicated Support', 'Custom Integrations'] },
  { id: '4', name: 'Lifetime License', product_name: 'HR Pro', model: 'one_time', price: 499, currency: 'USD', is_active: true, features: ['Lifetime Updates', 'Priority Support'] },
  { id: '5', name: 'India Pricing', product_name: 'CRM Suite', model: 'country_based', price: 999, currency: 'INR', billing_cycle: 'monthly', country: 'IN', is_active: true, features: ['All Pro Features'] },
];

const PMPricingPlans: React.FC = () => {
  const [plans, setPlans] = useState<PricingPlan[]>(mockPlans);
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    model: 'one_time',
    price: 0,
    currency: 'USD',
    billing_cycle: 'monthly',
  });

  const handleCreatePlan = () => {
    if (!formData.name || !formData.price) {
      toast.error('Name and price are required');
      return;
    }

    const newPlan: PricingPlan = {
      id: Date.now().toString(),
      name: formData.name,
      product_name: 'New Product',
      model: formData.model as any,
      price: formData.price,
      currency: formData.currency,
      billing_cycle: formData.billing_cycle,
      is_active: true,
      features: [],
    };

    setPlans([...plans, newPlan]);
    setShowCreateDialog(false);
    setFormData({ name: '', model: 'one_time', price: 0, currency: 'USD', billing_cycle: 'monthly' });
    toast.success('Pricing plan created');
  };

  const handleClonePlan = (plan: PricingPlan) => {
    const clonedPlan: PricingPlan = {
      ...plan,
      id: Date.now().toString(),
      name: `${plan.name} (Clone)`,
    };
    setPlans([...plans, clonedPlan]);
    toast.success('Plan cloned');
  };

  const handleArchivePlan = (planId: string) => {
    setPlans(plans.map(p => p.id === planId ? { ...p, is_active: false } : p));
    toast.success('Plan archived');
  };

  const filteredPlans = plans.filter(p => {
    if (activeTab === 'all') return true;
    return p.model === activeTab;
  });

  const getModelBadge = (model: string) => {
    const colors: Record<string, string> = {
      one_time: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
      subscription: 'bg-green-500/10 text-green-500 border-green-500/30',
      tier_based: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
      country_based: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    };
    return <Badge variant="outline" className={colors[model]}>{model.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-500" />
            Pricing & Plans
          </h1>
          <p className="text-muted-foreground text-sm">Manage pricing models, tiers, and country-specific pricing</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{plans.filter(p => p.model === 'one_time').length}</p>
              <p className="text-xs text-muted-foreground">One-Time</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{plans.filter(p => p.model === 'subscription').length}</p>
              <p className="text-xs text-muted-foreground">Subscription</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{plans.filter(p => p.model === 'tier_based').length}</p>
              <p className="text-xs text-muted-foreground">Tier-Based</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{plans.filter(p => p.model === 'country_based').length}</p>
              <p className="text-xs text-muted-foreground">Country-Based</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Plans ({plans.length})</TabsTrigger>
          <TabsTrigger value="one_time">One-Time</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="tier_based">Tier-Based</TabsTrigger>
          <TabsTrigger value="country_based">Country-Based</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Cycle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{plan.name}</p>
                          <p className="text-xs text-muted-foreground">{plan.features.length} features</p>
                        </div>
                      </TableCell>
                      <TableCell>{plan.product_name}</TableCell>
                      <TableCell>{getModelBadge(plan.model)}</TableCell>
                      <TableCell>
                        <span className="font-mono font-bold">
                          {plan.currency} {plan.price}
                        </span>
                      </TableCell>
                      <TableCell>
                        {plan.billing_cycle ? (
                          <Badge variant="outline">{plan.billing_cycle}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                          {plan.is_active ? 'Active' : 'Archived'}
                        </Badge>
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
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleClonePlan(plan)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Clone
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleArchivePlan(plan.id)}>
                                <Archive className="w-4 h-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Pricing Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Plan Name *</label>
              <Input
                placeholder="Enter plan name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Pricing Model</label>
              <Select
                value={formData.model}
                onValueChange={(v) => setFormData({ ...formData, model: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_time">One-Time</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="tier_based">Tier-Based</SelectItem>
                  <SelectItem value="country_based">Country-Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Price *</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Currency</label>
                <Select
                  value={formData.currency}
                  onValueChange={(v) => setFormData({ ...formData, currency: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {formData.model === 'subscription' && (
              <div>
                <label className="text-sm font-medium">Billing Cycle</label>
                <Select
                  value={formData.billing_cycle}
                  onValueChange={(v) => setFormData({ ...formData, billing_cycle: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleCreatePlan}>Create Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PMPricingPlans;
