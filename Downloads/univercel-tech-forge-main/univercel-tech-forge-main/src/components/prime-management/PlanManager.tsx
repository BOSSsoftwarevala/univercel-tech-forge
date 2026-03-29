import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { 
  Crown, Zap, Star, Shield, Clock, Users, Edit, Check,
  Sparkles, HeadphonesIcon, Rocket
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  validity: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  maxUsers?: number;
  slaHours: number;
  priorityLevel: number;
}

export function PlanManager() {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // Static plans configuration (in production, this would come from database)
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 'monthly',
      name: 'Monthly',
      price: 4999,
      period: 'month',
      validity: 30,
      features: [
        'Priority Queue Access',
        '2-Hour SLA Response',
        'Dedicated Support Channel',
        'Basic Analytics Dashboard',
        'Email Support'
      ],
      isPopular: false,
      isActive: true,
      slaHours: 2,
      priorityLevel: 1
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: 49999,
      period: 'year',
      validity: 365,
      features: [
        'All Monthly Features',
        '20% Cost Savings',
        'Priority Developer Assignment',
        'VIP Badge & Recognition',
        'Advanced Analytics',
        'Phone Support',
        'Quarterly Business Reviews'
      ],
      isPopular: true,
      isActive: true,
      slaHours: 1,
      priorityLevel: 2
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: 199999,
      period: 'one-time',
      validity: 36500,
      features: [
        'All Yearly Features',
        'Forever Access',
        'Exclusive Beta Features',
        'Direct Manager Access',
        'Custom Integrations',
        'Dedicated Account Manager',
        '24/7 Emergency Line',
        'Priority Bug Fixes'
      ],
      isPopular: false,
      isActive: true,
      slaHours: 0.5,
      priorityLevel: 3
    }
  ]);

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan({ ...plan });
    setShowEditDialog(true);
  };

  const handleSavePlan = () => {
    if (!selectedPlan) return;
    
    setPlans(plans.map(p => p.id === selectedPlan.id ? selectedPlan : p));
    toast.success('Plan updated successfully');
    setShowEditDialog(false);
  };

  const getPlanIcon = (id: string) => {
    switch (id) {
      case 'monthly': return Zap;
      case 'yearly': return Crown;
      case 'lifetime': return Rocket;
      default: return Star;
    }
  };

  const getPlanGradient = (id: string) => {
    switch (id) {
      case 'monthly': return 'from-blue-500 to-blue-600';
      case 'yearly': return 'from-amber-500 to-amber-600';
      case 'lifetime': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const Icon = getPlanIcon(plan.id);
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden ${
                plan.isPopular ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-border/50'
              }`}>
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-stone-900 px-4 py-1 text-xs font-bold rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getPlanGradient(plan.id)} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-foreground">
                      ₹{plan.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* SLA & Priority Info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>{plan.slaHours}hr SLA</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: plan.priorityLevel }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Edit Button */}
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => handleEditPlan(plan)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Plan
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Plan Comparison */}
      <Card className="bg-card/50 border-amber-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Plan Features Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-amber-500/10">
                  <th className="text-left py-3 px-4">Feature</th>
                  {plans.map(plan => (
                    <th key={plan.id} className="text-center py-3 px-4">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">SLA Response Time</td>
                  {plans.map(plan => (
                    <td key={plan.id} className="text-center py-3 px-4 text-amber-400">
                      {plan.slaHours} hours
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">Priority Level</td>
                  {plans.map(plan => (
                    <td key={plan.id} className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        {Array.from({ length: plan.priorityLevel }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">VIP Badge</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">—</td>
                  <td className="text-center py-3 px-4 text-emerald-400">✓</td>
                  <td className="text-center py-3 px-4 text-emerald-400">✓</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">Dedicated Developer</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">—</td>
                  <td className="text-center py-3 px-4 text-emerald-400">✓</td>
                  <td className="text-center py-3 px-4 text-emerald-400">✓</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">Direct Manager Access</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">—</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">—</td>
                  <td className="text-center py-3 px-4 text-emerald-400">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">24/7 Emergency Line</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">—</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">—</td>
                  <td className="text-center py-3 px-4 text-emerald-400">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Plan Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-amber-500" />
              Edit {selectedPlan?.name} Plan
            </DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    value={selectedPlan.price}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, price: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>SLA Hours</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={selectedPlan.slaHours}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, slaHours: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Validity (days)</Label>
                  <Input
                    type="number"
                    value={selectedPlan.validity}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, validity: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priority Level (1-3)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="3"
                    value={selectedPlan.priorityLevel}
                    onChange={(e) => setSelectedPlan({ ...selectedPlan, priorityLevel: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Features (one per line)</Label>
                <Textarea
                  rows={6}
                  value={selectedPlan.features.join('\n')}
                  onChange={(e) => setSelectedPlan({ 
                    ...selectedPlan, 
                    features: e.target.value.split('\n').filter(f => f.trim()) 
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Mark as Popular</Label>
                <Switch
                  checked={selectedPlan.isPopular}
                  onCheckedChange={(v) => setSelectedPlan({ ...selectedPlan, isPopular: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Plan Active</Label>
                <Switch
                  checked={selectedPlan.isActive}
                  onCheckedChange={(v) => setSelectedPlan({ ...selectedPlan, isActive: v })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSavePlan}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
