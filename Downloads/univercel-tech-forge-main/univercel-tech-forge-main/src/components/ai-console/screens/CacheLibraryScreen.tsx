import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Clock, RefreshCw, Search, FileText, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const cacheTemplates = [
  { id: 1, category: 'FAQ', title: 'Product Features', version: 'v2.3', lastUpdated: '2 hours ago', hitRate: 94 },
  { id: 2, category: 'FAQ', title: 'Pricing Questions', version: 'v1.8', lastUpdated: '5 hours ago', hitRate: 89 },
  { id: 3, category: 'Pricing', title: 'Enterprise Plans', version: 'v3.1', lastUpdated: '1 day ago', hitRate: 92 },
  { id: 4, category: 'Feature Lists', title: 'Core Features', version: 'v4.0', lastUpdated: '3 hours ago', hitRate: 87 },
  { id: 5, category: 'Feature Lists', title: 'Premium Features', version: 'v2.5', lastUpdated: '12 hours ago', hitRate: 85 },
  { id: 6, category: 'Onboarding', title: 'Welcome Flow', version: 'v5.2', lastUpdated: '30 min ago', hitRate: 96 },
  { id: 7, category: 'Onboarding', title: 'Setup Guide', version: 'v3.7', lastUpdated: '2 days ago', hitRate: 91 },
  { id: 8, category: 'Support', title: 'Common Issues', version: 'v2.1', lastUpdated: '6 hours ago', hitRate: 88 },
];

const CacheLibraryScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(cacheTemplates.map(t => t.category))];
  
  const filteredTemplates = cacheTemplates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground font-mono flex items-center gap-3">
          <Database className="w-6 h-6 text-primary" />
          Cache Library
        </h2>
        <Button className="gap-2 bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30">
          <Plus className="w-4 h-4" />
          Add Template
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null ? 'bg-primary text-primary-foreground' : ''}
          >
            All
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'bg-primary text-primary-foreground' : ''}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template, idx) => (
          <motion.div
            key={template.id}
            className="metric-card group cursor-pointer hover:border-primary/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
              </div>
              <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                {template.hitRate}% hit
              </Badge>
            </div>

            <h3 className="text-sm font-medium text-foreground mb-2">{template.title}</h3>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {template.lastUpdated}
              </span>
              <span>{template.version}</span>
            </div>

            <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="outline" size="sm" className="flex-1 text-xs h-7">
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10 h-7 w-7 p-0">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Templates', value: '847' },
          { label: 'Avg Hit Rate', value: '89%' },
          { label: 'Cache Size', value: '2.4 GB' },
          { label: 'Last Sync', value: '2 min ago' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            className="p-4 rounded-lg bg-secondary/30 border border-border/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
          >
            <span className="text-xs text-muted-foreground">{stat.label}</span>
            <p className="text-lg font-bold text-foreground mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CacheLibraryScreen;
