import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSystemActions } from '@/hooks/useSystemActions';
import {
  Image,
  Video,
  FileText,
  Palette,
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Loader2,
  Plus,
  FolderOpen,
  RefreshCw,
} from 'lucide-react';

interface ContentItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'copy' | 'creative';
  url: string;
  thumbnail?: string;
  status: 'approved' | 'pending' | 'rejected';
  created_at: string;
  size?: string;
  dimensions?: string;
  tags: string[];
}

interface BrandRule {
  id: string;
  rule_type: string;
  title: string;
  description: string;
  value: string;
}

const MMContentLibrary: React.FC = () => {
  const { actions, executeAction, isLoading } = useSystemActions();
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [brandRules, setBrandRules] = useState<BrandRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchContent();
    fetchBrandRules();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    // Mock content data
    const mockContent: ContentItem[] = [
      { id: '1', name: 'Hero Banner Q1', type: 'image', url: '/placeholder.svg', status: 'approved', created_at: new Date().toISOString(), size: '2.4 MB', dimensions: '1920x1080', tags: ['banner', 'hero', 'q1'] },
      { id: '2', name: 'Product Demo Video', type: 'video', url: '/placeholder.svg', status: 'approved', created_at: new Date().toISOString(), size: '45 MB', tags: ['demo', 'product'] },
      { id: '3', name: 'Email Campaign Copy', type: 'copy', url: '', status: 'pending', created_at: new Date().toISOString(), tags: ['email', 'campaign'] },
      { id: '4', name: 'Social Media Kit', type: 'creative', url: '/placeholder.svg', status: 'approved', created_at: new Date().toISOString(), tags: ['social', 'kit'] },
      { id: '5', name: 'Landing Page Banner', type: 'image', url: '/placeholder.svg', status: 'rejected', created_at: new Date().toISOString(), size: '1.8 MB', dimensions: '1440x900', tags: ['landing', 'banner'] },
    ];

    setContent(mockContent);
    setLoading(false);
  };

  const fetchBrandRules = async () => {
    const mockRules: BrandRule[] = [
      { id: '1', rule_type: 'logo', title: 'Logo Usage', description: 'Minimum size 120px, clear space ratio 1:4', value: '#logo-guidelines' },
      { id: '2', rule_type: 'color', title: 'Primary Colors', description: 'Use brand colors consistently', value: '#10B981, #3B82F6, #1F2937' },
      { id: '3', rule_type: 'font', title: 'Typography', description: 'Inter for body, Poppins for headings', value: 'Inter, Poppins' },
      { id: '4', rule_type: 'tone', title: 'Brand Voice', description: 'Professional, friendly, innovative', value: 'professional' },
    ];
    setBrandRules(mockRules);
  };

  const handleAIContentSuggestion = useCallback(async () => {
    setGenerating(true);
    try {
      await executeAction({
        module: 'marketing',
        action: 'create',
        entityType: 'AIContentSuggestion',
        successMessage: 'AI generated 3 content suggestions'
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      setGenerating(false);
    }
  }, [executeAction]);

  const handleUpload = useCallback(() => {
    actions.create('marketing', 'ContentAsset', { type: 'upload' }, 'New Asset');
  }, [actions]);

  const handleRefresh = useCallback(() => {
    actions.refresh('marketing', 'ContentLibrary');
    fetchContent();
  }, [actions]);

  const handleDownload = useCallback((id: string, name: string) => {
    actions.export('marketing', 'ContentAsset', 'file');
  }, [actions]);

  const handleDelete = useCallback((id: string, name: string) => {
    actions.softDelete('marketing', 'ContentAsset', id, name);
    setContent(prev => prev.filter(c => c.id !== id));
  }, [actions]);

  const filteredContent = content.filter(item => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeTab !== 'all' && item.type !== activeTab) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-400 gap-1"><CheckCircle2 className="w-3 h-3" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 gap-1"><Clock className="w-3 h-3" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 gap-1"><AlertTriangle className="w-3 h-3" />Rejected</Badge>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'copy': return <FileText className="w-4 h-4" />;
      case 'creative': return <Palette className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <FolderOpen className="w-6 h-6 text-emerald-400" />
            Content Library
          </h2>
          <p className="text-slate-400 text-sm">Manage images, videos, copy, and brand assets</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAIContentSuggestion} variant="outline" disabled={generating}>
            {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            AI Suggest
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-white">{content.length}</div>
            <p className="text-xs text-slate-400">Total Assets</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-400">{content.filter(c => c.type === 'image').length}</div>
            <p className="text-xs text-slate-400">Images</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-400">{content.filter(c => c.type === 'video').length}</div>
            <p className="text-xs text-slate-400">Videos</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-400">{content.filter(c => c.status === 'approved').length}</div>
            <p className="text-xs text-slate-400">Approved</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-400">{content.filter(c => c.status === 'pending').length}</div>
            <p className="text-xs text-slate-400">Pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
            <TabsTrigger value="copy">Copy</TabsTrigger>
            <TabsTrigger value="creative">Creatives</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-1 border border-slate-700 rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Grid/List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredContent.map(item => (
                <div
                  key={item.id}
                  className="group relative bg-slate-900 rounded-lg overflow-hidden border border-slate-700 hover:border-emerald-500/50 cursor-pointer transition-all"
                  onClick={() => { setSelectedItem(item); setPreviewOpen(true); }}
                >
                  <div className="aspect-video bg-slate-800 flex items-center justify-center">
                    {item.type === 'image' || item.type === 'video' || item.type === 'creative' ? (
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                        {getTypeIcon(item.type)}
                      </div>
                    ) : (
                      <FileText className="w-12 h-12 text-slate-500" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-white font-medium truncate">{item.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      {getStatusBadge(item.status)}
                      <span className="text-xs text-slate-400">{item.size || ''}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                    <Button size="sm" variant="secondary">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {filteredContent.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-900 rounded-lg hover:bg-slate-800/80 cursor-pointer"
                    onClick={() => { setSelectedItem(item); setPreviewOpen(true); }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center">
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{item.name}</p>
                        <div className="flex gap-2 mt-1">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(item.status)}
                      <span className="text-xs text-slate-400">{item.size || '-'}</span>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Brand Rules */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Brand Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {brandRules.map(rule => (
              <div key={rule.id} className="p-4 bg-slate-900 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">{rule.title}</h4>
                <p className="text-xs text-slate-400 mb-3">{rule.description}</p>
                {rule.rule_type === 'color' && (
                  <div className="flex gap-2">
                    {rule.value.split(', ').map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border border-slate-600"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
                {rule.rule_type === 'font' && (
                  <p className="text-xs text-emerald-400">{rule.value}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedItem?.name}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                {getTypeIcon(selectedItem.type)}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Type</p>
                  <p className="text-white capitalize">{selectedItem.type}</p>
                </div>
                <div>
                  <p className="text-slate-400">Size</p>
                  <p className="text-white">{selectedItem.size || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-400">Dimensions</p>
                  <p className="text-white">{selectedItem.dimensions || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-400">Status</p>
                  {getStatusBadge(selectedItem.status)}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
            <Button className="bg-emerald-600">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MMContentLibrary;
