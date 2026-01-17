/**
 * DEMO FACTORY
 * Bulk demo creation with AI cloning
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Factory, 
  Sparkles, 
  Layers,
  CheckCircle,
  Plus,
  Globe,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const categories = [
  { id: 'crm', label: 'CRM Systems', baseDemo: 'CRM-Pro' },
  { id: 'ecommerce', label: 'E-Commerce', baseDemo: 'Shop-Starter' },
  { id: 'restaurant', label: 'Restaurant / POS', baseDemo: 'POS-Master' },
  { id: 'healthcare', label: 'Healthcare', baseDemo: 'Health-Hub' },
  { id: 'education', label: 'Education / LMS', baseDemo: 'Edu-Platform' },
  { id: 'realestate', label: 'Real Estate', baseDemo: 'Property-Pro' },
];

const recentDemos = [
  { id: '1', name: 'CRM-Demo-001', category: 'CRM', status: 'ready', domain: 'demo1.softwarewala.net' },
  { id: '2', name: 'Shop-Demo-042', category: 'E-Commerce', status: 'ready', domain: 'demo2.softwarewala.net' },
  { id: '3', name: 'POS-Demo-015', category: 'Restaurant', status: 'generating', domain: 'pending' },
];

export const DemoFactory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [demoCount, setDemoCount] = useState('1');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDemos = async () => {
    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }

    setIsGenerating(true);
    
    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsGenerating(false);
    toast.success(`${demoCount} demo(s) generated successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Factory className="w-5 h-5 text-purple-400" />
          Demo Factory
        </h1>
        <p className="text-sm text-muted-foreground">Bulk generate demos with AI cloning</p>
      </div>

      {/* Generator Card */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-2 text-purple-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI Demo Generator</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Number of Demos</label>
              <Input 
                type="number" 
                min="1" 
                max="10"
                value={demoCount}
                onChange={(e) => setDemoCount(e.target.value)}
                className="bg-background/50 border-border/50"
              />
            </div>
          </div>

          {selectedCategory && (
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs text-muted-foreground">Base Demo Template</p>
              <p className="text-sm font-medium text-foreground mt-1">
                {categories.find(c => c.id === selectedCategory)?.baseDemo}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  <Lock className="w-3 h-3 mr-1" />
                  Domain Locked
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Auto Branding
                </Badge>
              </div>
            </div>
          )}

          <Button 
            onClick={handleGenerateDemos}
            disabled={isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                </motion.div>
                Generating...
              </>
            ) : (
              <>
                <Factory className="w-4 h-4 mr-2" />
                Generate Demos
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Demos */}
      <Card className="bg-card/80 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-muted-foreground" />
              Recent Demos
            </h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {recentDemos.map((demo, index) => (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    demo.status === 'ready' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                  )} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{demo.name}</p>
                    <p className="text-xs text-muted-foreground">{demo.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {demo.status === 'ready' ? (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Globe className="w-3 h-3" />
                      {demo.domain}
                    </div>
                  ) : (
                    <Badge className="bg-amber-500/20 text-amber-400 text-xs">Generating...</Badge>
                  )}
                  {demo.status === 'ready' && (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
