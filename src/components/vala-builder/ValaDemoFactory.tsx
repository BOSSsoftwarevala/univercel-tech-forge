import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Copy, Palette, Globe, Zap, CheckCircle2, Clock,
  Plus, Search, Filter, Play, Eye, Settings, Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useEnterpriseAudit } from '@/hooks/useEnterpriseAudit';
import { toast } from 'sonner';

interface DemoTemplate {
  id: string;
  name: string;
  category: string;
  features: number;
  languages: string[];
  theme: string;
  cloneCount: number;
  lastUpdated: string;
  status: 'ready' | 'updating' | 'deprecated';
}

const templates: DemoTemplate[] = [
  { id: 'TPL-001', name: 'Restaurant POS Pro', category: 'Hospitality', features: 24, languages: ['EN', 'AR', 'FR'], theme: 'Modern Dark', cloneCount: 45, lastUpdated: '2 days ago', status: 'ready' },
  { id: 'TPL-002', name: 'Retail POS Lite', category: 'Retail', features: 18, languages: ['EN', 'ES'], theme: 'Clean Light', cloneCount: 78, lastUpdated: '1 week ago', status: 'ready' },
  { id: 'TPL-003', name: 'Hospital CRM', category: 'Healthcare', features: 32, languages: ['EN'], theme: 'Medical Blue', cloneCount: 23, lastUpdated: '3 days ago', status: 'ready' },
  { id: 'TPL-004', name: 'School ERP', category: 'Education', features: 28, languages: ['EN', 'AR'], theme: 'Academic Green', cloneCount: 34, lastUpdated: '5 days ago', status: 'updating' },
  { id: 'TPL-005', name: 'Hotel Management', category: 'Hospitality', features: 36, languages: ['EN', 'FR', 'DE'], theme: 'Luxury Gold', cloneCount: 19, lastUpdated: '1 day ago', status: 'ready' },
  { id: 'TPL-006', name: 'Pharmacy POS', category: 'Healthcare', features: 20, languages: ['EN', 'AR'], theme: 'Health White', cloneCount: 56, lastUpdated: '4 days ago', status: 'ready' },
];

interface ActiveDemo {
  id: string;
  templateName: string;
  client: string;
  progress: number;
  stage: string;
}

const activeGenerations: ActiveDemo[] = [
  { id: 'DEMO-001', templateName: 'Restaurant POS Pro', client: 'Al Mamlaka Foods', progress: 75, stage: 'Applying theme' },
  { id: 'DEMO-002', templateName: 'Retail POS Lite', client: 'Quick Mart UAE', progress: 45, stage: 'Setting language' },
];

const ValaDemoFactory = () => {
  const { logAction } = useEnterpriseAudit();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const handleCloneTemplate = useCallback(async (templateId: string) => {
    await logAction({
      action: 'clone_demo_template',
      module: 'vala_builder',
      severity: 'medium',
      target_id: templateId
    });
    toast.success('Demo generation started', {
      description: 'AI is creating your demo...'
    });
  }, [logAction]);

  const handleBulkGenerate = useCallback(async () => {
    await logAction({
      action: 'bulk_demo_generation',
      module: 'vala_builder',
      severity: 'high'
    });
    toast.success('Bulk demo generation queued', {
      description: 'Requires Boss approval'
    });
  }, [logAction]);

  const filteredTemplates = templates.filter(t => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-teal-400" />
            Demo Factory
          </h2>
          <p className="text-slate-400 text-sm">Bulk demo creation with auto theme & language matching</p>
        </div>
        <Button
          onClick={handleBulkGenerate}
          className="bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30"
        >
          <Layers className="w-4 h-4 mr-2" />
          Bulk Generate
        </Button>
      </div>

      {/* Active Generations */}
      {activeGenerations.length > 0 && (
        <Card className="bg-purple-500/10 border-purple-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-purple-300 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Active Demo Generations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeGenerations.map((demo) => (
                <div key={demo.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">{demo.templateName}</span>
                      <Badge variant="outline" className="text-xs text-purple-400 border-purple-500/30">
                        {demo.client}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={demo.progress} className="flex-1 h-1.5" />
                      <span className="text-xs text-slate-400">{demo.progress}%</span>
                    </div>
                    <span className="text-xs text-purple-400">{demo.stage}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-slate-400">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="pl-10 bg-slate-900/50 border-slate-700"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40 bg-slate-900/50 border-slate-700">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-900/50 border-slate-700 hover:border-teal-500/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{template.name}</h3>
                    <Badge variant="outline" className="text-xs text-slate-400 border-slate-600 mt-1">
                      {template.category}
                    </Badge>
                  </div>
                  <Badge className={
                    template.status === 'ready' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    template.status === 'updating' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    'bg-slate-500/20 text-slate-400 border-slate-500/30'
                  }>
                    {template.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Features
                    </span>
                    <span className="text-white">{template.features}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Languages
                    </span>
                    <span className="text-white">{template.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Palette className="w-3 h-3" /> Theme
                    </span>
                    <span className="text-white">{template.theme}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Cloned
                    </span>
                    <span className="text-teal-400">{template.cloneCount} times</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleCloneTemplate(template.id)}
                    disabled={template.status !== 'ready'}
                    className="flex-1 bg-teal-500/20 text-teal-400 border border-teal-500/30 hover:bg-teal-500/30"
                    size="sm"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Clone
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800">
                  <span className="text-xs text-slate-500">Updated: {template.lastUpdated}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ValaDemoFactory;
