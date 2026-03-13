import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database, Search, Upload, Tag, Filter, FolderOpen,
  Package, Grid3X3, List, Plus, Archive, RefreshCw,
  FileArchive, Globe, Smartphone, Server, Layers, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import UploadInterface from './UploadInterface';

interface VaultItem {
  id: string;
  name: string;
  category: string;
  type: 'web' | 'mobile' | 'api' | 'desktop' | 'library';
  version: string;
  size: string;
  tags: string[];
  uploadedAt: string;
  framework: string;
  starred?: boolean;
}

interface SoftwareVaultProps {
  className?: string;
}

const DEMO_ITEMS: VaultItem[] = [
  { id: '1', name: 'School ERP System', category: 'Education', type: 'web', version: '3.2.1', size: '45 MB', tags: ['education', 'erp', 'react'], uploadedAt: '2 days ago', framework: 'React', starred: true },
  { id: '2', name: 'Hospital Management', category: 'Healthcare', type: 'web', version: '2.1.0', size: '67 MB', tags: ['health', 'management'], uploadedAt: '1 week ago', framework: 'Vue.js' },
  { id: '3', name: 'E-Commerce Platform', category: 'Business', type: 'web', version: '5.0.2', size: '89 MB', tags: ['ecommerce', 'shop'], uploadedAt: '3 days ago', framework: 'Next.js', starred: true },
  { id: '4', name: 'CRM Software', category: 'Business', type: 'web', version: '1.8.5', size: '34 MB', tags: ['crm', 'sales'], uploadedAt: '5 days ago', framework: 'Angular' },
  { id: '5', name: 'Inventory Manager Mobile', category: 'Retail', type: 'mobile', version: '2.0.0', size: '28 MB', tags: ['inventory', 'mobile'], uploadedAt: '1 day ago', framework: 'React Native' },
  { id: '6', name: 'REST API Gateway', category: 'Infrastructure', type: 'api', version: '3.1.0', size: '12 MB', tags: ['api', 'gateway'], uploadedAt: '1 week ago', framework: 'Node.js' },
  { id: '7', name: 'HR Management System', category: 'HR', type: 'web', version: '4.2.3', size: '55 MB', tags: ['hr', 'payroll'], uploadedAt: '2 weeks ago', framework: 'React' },
  { id: '8', name: 'Finance Dashboard', category: 'Finance', type: 'web', version: '2.7.1', size: '42 MB', tags: ['finance', 'dashboard'], uploadedAt: '4 days ago', framework: 'React', starred: true },
];

const CATEGORIES = ['All', 'Education', 'Healthcare', 'Business', 'Retail', 'Finance', 'HR', 'Infrastructure'];

const TYPE_ICONS: Record<string, React.ElementType> = {
  web: Globe,
  mobile: Smartphone,
  api: Server,
  desktop: Layers,
  library: Package,
};

const TYPE_COLORS: Record<string, string> = {
  web: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  mobile: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  api: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  desktop: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  library: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
};

const SoftwareVault: React.FC<SoftwareVaultProps> = ({ className }) => {
  const [items] = useState<VaultItem[]>(DEMO_ITEMS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUpload, setShowUpload] = useState(false);

  const filtered = items.filter((item) => {
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some((t) => t.includes(search.toLowerCase()));
    const matchesCategory = category === 'All' || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={cn('flex flex-col h-full bg-slate-950 text-slate-200', className)}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <Database className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Software Vault</h2>
            <p className="text-[10px] text-slate-500">{items.length} software packages</p>
          </div>
        </div>
        <div className="flex-1" />
        <Button
          onClick={() => setShowUpload(!showUpload)}
          size="sm"
          className="gap-2 h-8 text-xs bg-violet-600 hover:bg-violet-500"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload Software
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs border-slate-700 text-slate-400"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Upload panel */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-slate-800"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-slate-300">Upload to Vault</p>
                <button
                  onClick={() => setShowUpload(false)}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  Close
                </button>
              </div>
              <UploadInterface
                accept=".zip,.apk,.tar.gz"
                onUpload={(files) => {
                  toast.success(`${files.length} file(s) uploaded to vault`);
                  setTimeout(() => setShowUpload(false), 1500);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-slate-800">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 7000+ software..."
            className="pl-8 h-8 text-xs bg-slate-900 border-slate-700 text-slate-300 placeholder:text-slate-600"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-8 w-36 text-xs bg-slate-900 border-slate-700 text-slate-300">
            <Filter className="w-3 h-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat} className="text-xs text-slate-300">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={cn('p-1.5 rounded', viewMode === 'grid' ? 'text-slate-200 bg-slate-800' : 'text-slate-600')}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn('p-1.5 rounded', viewMode === 'list' ? 'text-slate-200 bg-slate-800' : 'text-slate-600')}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-auto p-6">
        <p className="text-[10px] text-slate-600 mb-3">
          {filtered.length} results{category !== 'All' ? ` in ${category}` : ''}
        </p>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((item, idx) => {
              const TypeIcon = TYPE_ICONS[item.type] || Package;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-lg border flex items-center justify-center',
                        TYPE_COLORS[item.type]
                      )}
                    >
                      <TypeIcon className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.starred && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      <Badge className={cn('text-[9px] h-4 px-1.5 border capitalize', TYPE_COLORS[item.type])}>
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-slate-200 mb-1 truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-500 mb-2">{item.category} • {item.framework}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-600">v{item.version}</span>
                    <span className="text-[10px] text-slate-600">{item.size}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-1.5">
            {filtered.map((item, idx) => {
              const TypeIcon = TYPE_ICONS[item.type] || Package;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                >
                  <div className={cn('w-8 h-8 rounded-lg border flex items-center justify-center shrink-0', TYPE_COLORS[item.type])}>
                    <TypeIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-slate-200 truncate">{item.name}</p>
                      {item.starred && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-500">{item.category} • {item.framework} • v{item.version}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="hidden lg:block text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">
                        #{tag}
                      </span>
                    ))}
                    <span className="text-[10px] text-slate-600">{item.size}</span>
                    <span className="text-[10px] text-slate-600">{item.uploadedAt}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SoftwareVault;
