import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, Cpu, HardDrive, Network, Globe, Star, 
  Sparkles, TrendingUp, CheckCircle2, ArrowRight, Bookmark
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const plans = [
  { 
    id: 'compute-1', name: 'Compute S', type: 'Compute', 
    cpu: 2, ram: 4, storage: 80, bandwidth: 500, 
    regions: ['IN', 'SG', 'US'], price: { monthly: 1999, yearly: 19990 },
    recommended: false, tag: null
  },
  { 
    id: 'compute-2', name: 'Compute M', type: 'Compute', 
    cpu: 4, ram: 8, storage: 160, bandwidth: 1000, 
    regions: ['IN', 'SG', 'US', 'EU'], price: { monthly: 3999, yearly: 39990 },
    recommended: true, tag: 'Best Value'
  },
  { 
    id: 'memory-1', name: 'Memory L', type: 'Memory', 
    cpu: 4, ram: 32, storage: 200, bandwidth: 1000, 
    regions: ['IN', 'SG', 'US', 'EU'], price: { monthly: 7999, yearly: 79990 },
    recommended: false, tag: 'High Load'
  },
  { 
    id: 'storage-1', name: 'Storage XL', type: 'Storage', 
    cpu: 2, ram: 8, storage: 1000, bandwidth: 2000, 
    regions: ['IN', 'US', 'EU'], price: { monthly: 5999, yearly: 59990 },
    recommended: false, tag: 'Backup'
  },
  { 
    id: 'gpu-1', name: 'GPU Pro', type: 'GPU', 
    cpu: 8, ram: 64, storage: 500, bandwidth: 2000, 
    regions: ['US', 'EU'], price: { monthly: 24999, yearly: 249990 },
    recommended: false, tag: 'AI/ML'
  },
];

const aiSuggestions = [
  { title: 'Based on your usage', plan: 'Compute M', reason: 'Current load indicates 4 cores would be optimal' },
  { title: 'Cost optimized', plan: 'Compute S', reason: 'Save 50% with smaller instance for light workloads' },
  { title: 'Performance boost', plan: 'Memory L', reason: 'Your DB queries would benefit from more RAM' },
];

const SMExplorePlans = () => {
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const togglePlanSelection = (planId: string) => {
    setSelectedPlans(prev => 
      prev.includes(planId) ? prev.filter(id => id !== planId) : [...prev, planId]
    );
  };

  const handleSavePlan = (planName: string) => {
    toast.success(`${planName} saved to favorites`);
  };

  const handleProceed = (planName: string) => {
    toast.success(`Proceeding with ${planName}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Explore Plans</h1>
          <p className="text-slate-400">Find the perfect server configuration for your needs</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${
              billingCycle === 'monthly' ? 'bg-cyan-500 text-white' : 'text-slate-400'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-md text-sm transition-all ${
              billingCycle === 'yearly' ? 'bg-cyan-500 text-white' : 'text-slate-400'
            }`}
          >
            Yearly (Save 17%)
          </button>
        </div>
      </div>

      {/* AI Suggestions */}
      <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {aiSuggestions.map((suggestion, i) => (
              <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-cyan-400 text-sm font-medium mb-1">{suggestion.title}</p>
                <p className="text-white font-semibold mb-2">{suggestion.plan}</p>
                <p className="text-slate-400 text-sm">{suggestion.reason}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`bg-slate-900/50 border-cyan-500/20 relative overflow-hidden ${
              plan.recommended ? 'ring-2 ring-cyan-500/50' : ''
            }`}>
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-cyan-500 text-white text-xs px-3 py-1 rounded-bl-lg">
                  Recommended
                </div>
              )}
              {plan.tag && !plan.recommended && (
                <Badge className="absolute top-3 right-3 bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {plan.tag}
                </Badge>
              )}
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    {plan.type === 'GPU' ? <Sparkles className="w-5 h-5 text-cyan-400" /> :
                     plan.type === 'Memory' ? <HardDrive className="w-5 h-5 text-purple-400" /> :
                     plan.type === 'Storage' ? <HardDrive className="w-5 h-5 text-amber-400" /> :
                     <Cpu className="w-5 h-5 text-cyan-400" />}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{plan.name}</p>
                    <p className="text-slate-400 text-sm">{plan.type} Optimized</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">CPU Cores</span>
                    <span className="text-white">{plan.cpu} vCPU</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">RAM</span>
                    <span className="text-white">{plan.ram} GB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Storage</span>
                    <span className="text-white">{plan.storage} GB SSD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Bandwidth</span>
                    <span className="text-white">{plan.bandwidth} Mb/s</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  <Globe className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-400 text-xs">Available in: </span>
                  {plan.regions.map(r => (
                    <Badge key={r} variant="outline" className="text-xs border-slate-600 text-slate-400">
                      {r}
                    </Badge>
                  ))}
                </div>

                <div className="border-t border-slate-700 pt-4 mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">
                      ₹{(billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly / 12).toLocaleString()}
                    </span>
                    <span className="text-slate-400">/mo</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-emerald-400 text-sm">Save ₹{(plan.price.monthly * 12 - plan.price.yearly).toLocaleString()}/year</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-slate-600 text-slate-300"
                    onClick={() => handleSavePlan(plan.name)}
                  >
                    <Bookmark className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                    onClick={() => handleProceed(plan.name)}
                  >
                    Buy
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedPlans.length >= 2 && (
        <div className="fixed bottom-6 right-6">
          <Button className="bg-purple-500 hover:bg-purple-600 shadow-lg">
            Compare {selectedPlans.length} Plans
          </Button>
        </div>
      )}
    </div>
  );
};

export default SMExplorePlans;
