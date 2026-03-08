import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus, Upload, Image as ImageIcon } from 'lucide-react';

interface ProductConfig {
  name: string;
  description: string;
  instructions: string;
  category: string;
  techStack: string[];
  features: { name: string; description: string; priority: string }[];
  pricing: { model: string; price: string; currency: string };
  logo: string | null;
  isPublic: boolean;
  autoDemo: boolean;
  licenseType: string;
}

interface PMBuilderConfigureTabProps {
  productData: any;
  onConfigChange: (config: ProductConfig) => void;
}

const PMBuilderConfigureTab = ({ productData, onConfigChange }: PMBuilderConfigureTabProps) => {
  const [config, setConfig] = useState<ProductConfig>({
    name: '',
    description: '',
    instructions: '',
    category: '',
    techStack: [],
    features: [],
    pricing: { model: 'subscription', price: '', currency: 'INR' },
    logo: null,
    isPublic: false,
    autoDemo: true,
    licenseType: 'per-device',
  });

  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    if (productData) {
      setConfig(prev => ({
        ...prev,
        name: productData.projectName || prev.name,
        description: productData.summary || prev.description,
        category: productData.category || prev.category,
        techStack: [
          ...(productData.techStack?.frontend || []),
          ...(productData.techStack?.backend || []),
        ],
        features: (productData.features || []).map((f: any) => ({
          name: f.name,
          description: f.description,
          priority: f.priority || 'core',
        })),
        pricing: {
          ...prev.pricing,
          price: productData.estimatedCost?.total?.toString() || prev.pricing.price,
        },
      }));
    }
  }, [productData]);

  const updateConfig = (key: string, value: any) => {
    const updated = { ...config, [key]: value };
    setConfig(updated);
    onConfigChange(updated);
  };

  const addTech = () => {
    if (newTech.trim() && !config.techStack.includes(newTech.trim())) {
      updateConfig('techStack', [...config.techStack, newTech.trim()]);
      setNewTech('');
    }
  };

  const removeTech = (tech: string) => {
    updateConfig('techStack', config.techStack.filter(t => t !== tech));
  };

  const removeFeature = (index: number) => {
    const updated = [...config.features];
    updated.splice(index, 1);
    updateConfig('features', updated);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-5 space-y-6">
        {/* Logo */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Logo</Label>
          <div className="w-20 h-20 rounded-xl border-2 border-dashed border-border/60 flex items-center justify-center cursor-pointer hover:border-emerald-500/50 transition-colors bg-muted/20">
            {config.logo ? (
              <img src={config.logo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="text-center">
                <ImageIcon className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                <span className="text-[10px] text-muted-foreground">Upload</span>
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</Label>
          <Input
            value={config.name}
            onChange={(e) => updateConfig('name', e.target.value)}
            placeholder="My Software Product"
            className="bg-muted/30 border-border/40 text-sm"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</Label>
          <Textarea
            value={config.description}
            onChange={(e) => updateConfig('description', e.target.value)}
            placeholder="What does this software do?"
            rows={3}
            className="bg-muted/30 border-border/40 text-sm resize-none"
          />
        </div>

        {/* Instructions (like GPT Builder) */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Instructions</Label>
          <Textarea
            value={config.instructions}
            onChange={(e) => updateConfig('instructions', e.target.value)}
            placeholder="Detailed instructions for building this product — architecture, modules, integrations, specific requirements..."
            rows={5}
            className="bg-muted/30 border-border/40 text-sm resize-none"
          />
          <p className="text-[11px] text-muted-foreground">These instructions guide the AI build process and define product behavior.</p>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</Label>
          <Select value={config.category} onValueChange={(v) => updateConfig('category', v)}>
            <SelectTrigger className="bg-muted/30 border-border/40 text-sm">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="E-commerce">E-commerce</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="ERP">ERP</SelectItem>
              <SelectItem value="CRM">CRM</SelectItem>
              <SelectItem value="POS">POS</SelectItem>
              <SelectItem value="SaaS">SaaS</SelectItem>
              <SelectItem value="Marketplace">Marketplace</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tech Stack */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tech Stack</Label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {config.techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1">
                {tech}
                <X className="w-3 h-3 cursor-pointer hover:text-red-400" onClick={() => removeTech(tech)} />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
              placeholder="Add technology..."
              className="bg-muted/30 border-border/40 text-sm"
            />
            <Button variant="outline" size="sm" onClick={addTech} className="shrink-0">
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Features ({config.features.length})</Label>
          <div className="space-y-2">
            {config.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/20 border border-border/30">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{feature.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{feature.description}</p>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">{feature.priority}</Badge>
                <X className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-red-400 shrink-0 mt-0.5" onClick={() => removeFeature(i)} />
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pricing</Label>
          <Select value={config.pricing.model} onValueChange={(v) => updateConfig('pricing', { ...config.pricing, model: v })}>
            <SelectTrigger className="bg-muted/30 border-border/40 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="subscription">Subscription (SaaS)</SelectItem>
              <SelectItem value="lifetime">Lifetime License</SelectItem>
              <SelectItem value="freemium">Freemium</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={config.pricing.price}
            onChange={(e) => updateConfig('pricing', { ...config.pricing, price: e.target.value })}
            placeholder="Price (e.g., 4999)"
            className="bg-muted/30 border-border/40 text-sm"
          />
        </div>

        {/* License Type */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">License Type</Label>
          <Select value={config.licenseType} onValueChange={(v) => updateConfig('licenseType', v)}>
            <SelectTrigger className="bg-muted/30 border-border/40 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="per-device">Per Device</SelectItem>
              <SelectItem value="per-user">Per User</SelectItem>
              <SelectItem value="site-license">Site License</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Toggles */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto-generate Demo</p>
              <p className="text-xs text-muted-foreground">Create live demo on publish</p>
            </div>
            <Switch checked={config.autoDemo} onCheckedChange={(v) => updateConfig('autoDemo', v)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Marketplace Listing</p>
              <p className="text-xs text-muted-foreground">Make visible in marketplace</p>
            </div>
            <Switch checked={config.isPublic} onCheckedChange={(v) => updateConfig('isPublic', v)} />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default PMBuilderConfigureTab;
