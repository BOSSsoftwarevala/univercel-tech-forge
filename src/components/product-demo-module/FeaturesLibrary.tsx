/**
 * FEATURES LIBRARY
 * Core, Optional, AI, Payment features management
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Puzzle, Sparkles, CreditCard, Cpu, Check, X, 
  Plus, Search, Filter 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Feature {
  id: string;
  name: string;
  category: 'core' | 'optional' | 'ai' | 'payment';
  enabled: boolean;
  assignedProducts: number;
}

const initialFeatures: Feature[] = [
  { id: '1', name: 'User Authentication', category: 'core', enabled: true, assignedProducts: 45 },
  { id: '2', name: 'Role Management', category: 'core', enabled: true, assignedProducts: 42 },
  { id: '3', name: 'Multi-language Support', category: 'optional', enabled: true, assignedProducts: 28 },
  { id: '4', name: 'Dark Mode', category: 'optional', enabled: true, assignedProducts: 35 },
  { id: '5', name: 'AI Chatbot', category: 'ai', enabled: true, assignedProducts: 12 },
  { id: '6', name: 'AI Analytics', category: 'ai', enabled: false, assignedProducts: 8 },
  { id: '7', name: 'Stripe Integration', category: 'payment', enabled: true, assignedProducts: 22 },
  { id: '8', name: 'Razorpay Integration', category: 'payment', enabled: true, assignedProducts: 18 },
];

const categoryConfig = {
  core: { icon: Puzzle, color: 'violet', label: 'Core Features' },
  optional: { icon: Sparkles, color: 'blue', label: 'Optional Features' },
  ai: { icon: Cpu, color: 'emerald', label: 'AI Features' },
  payment: { icon: CreditCard, color: 'amber', label: 'Payment Features' },
};

export const FeaturesLibrary: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredFeatures = features.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || f.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const toggleFeature = (id: string) => {
    setFeatures(prev => prev.map(f => 
      f.id === id ? { ...f, enabled: !f.enabled } : f
    ));
    toast.success('Feature status updated');
  };

  const handleAddFeature = () => {
    toast.info('Add Feature dialog would open');
  };

  const handleAssignToProduct = (featureName: string) => {
    toast.info(`Assign "${featureName}" to products`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-violet-400" />
            Features Library
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage core, optional, AI & payment features
          </p>
        </div>
        <Button onClick={handleAddFeature} className="bg-violet-600 hover:bg-violet-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Feature
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search features..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="core">Core</TabsTrigger>
          <TabsTrigger value="optional">Optional</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid gap-3">
            {filteredFeatures.map((feature, idx) => {
              const config = categoryConfig[feature.category];
              const Icon = config.icon;
              
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="bg-card/80 border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-${config.color}-500/20 flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 text-${config.color}-400`} />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{feature.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {config.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {feature.assignedProducts} products
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleAssignToProduct(feature.name)}
                          >
                            Assign
                          </Button>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {feature.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                            <Switch 
                              checked={feature.enabled}
                              onCheckedChange={() => toggleFeature(feature.id)}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
