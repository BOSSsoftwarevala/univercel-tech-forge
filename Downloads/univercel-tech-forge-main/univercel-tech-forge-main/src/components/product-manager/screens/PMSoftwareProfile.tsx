import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  getFactoryProductDetail,
  getFactorySystemStatus,
  listFactoryProducts,
  updateFactoryProduct,
  type FactoryProduct,
  type FactoryProjectDetail,
  type FactorySystemStatus,
} from '@/lib/api/vala-factory';
import {
  FileText, Save, Edit3, Eye, History, Lock, Package,
  GitBranch, Cpu, Users, Globe2, Calendar, CheckCircle2
} from 'lucide-react';

type ProfileDraft = {
  hero_summary: string;
  home_category: string;
  product_status: FactoryProduct['product_status'];
  logo: string;
  color: string;
  domain: string;
  language: string;
};

const PMSoftwareProfile: React.FC = () => {
  const [products, setProducts] = useState<FactoryProduct[]>([]);
  const [detail, setDetail] = useState<FactoryProjectDetail | null>(null);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [systemStatus, setSystemStatus] = useState<FactorySystemStatus | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileDraft>({
    hero_summary: '',
    home_category: '',
    product_status: 'in_development',
    logo: '',
    color: '',
    domain: '',
    language: 'en',
  });

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) || null,
    [products, selectedProductId],
  );

  const load = async (nextProductId?: string) => {
    try {
      const productResponse = await listFactoryProducts();
      const productItems = productResponse.data.items || [];
      setProducts(productItems);

      const resolvedProductId = nextProductId || selectedProductId || productItems[0]?.id || '';
      if (!resolvedProductId) {
        setDetail(null);
        setSystemStatus(null);
        return;
      }

      setSelectedProductId(resolvedProductId);
      const [detailResponse, statusResponse] = await Promise.all([
        getFactoryProductDetail(resolvedProductId),
        getFactorySystemStatus(resolvedProductId),
      ]);

      setDetail(detailResponse.data.project);
      setSystemStatus(statusResponse.data);
      const product = detailResponse.data.product;
      const config = product.product_config || {};
      setDraft({
        hero_summary: product.hero_summary || '',
        home_category: product.home_category || '',
        product_status: product.product_status,
        logo: String(config.logo || ''),
        color: String(config.color || ''),
        domain: String(config.domain || ''),
        language: String(config.language || 'en'),
      });
    } catch (error) {
      console.error('Failed to load software profile', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load software profile');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleSave = async () => {
    if (!selectedProduct) {
      toast.error('Select a product first');
      return;
    }
    try {
      await updateFactoryProduct(selectedProduct.id, {
        product_status: draft.product_status,
        hero_summary: draft.hero_summary,
        home_category: draft.home_category,
        product_config: {
          ...selectedProduct.product_config,
          logo: draft.logo,
          color: draft.color,
          domain: draft.domain,
          language: draft.language,
        },
      });
      setIsEditing(false);
      toast.success('Software profile saved', {
        description: selectedProduct.product_name,
      });
      await load(selectedProduct.id);
    } catch (error) {
      console.error('Failed to save software profile', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save software profile');
    }
  };

  const handleAction = (action: string) => {
    toast.success(`${action} available in live control`, {
      description: selectedProduct?.product_name || 'No product selected',
    });
  };

  const modules = detail?.modules || [];
  const latestDeployment = detail?.deployments?.[0] || null;

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Package className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{selectedProduct?.product_name || 'Software Profile'}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                {selectedProduct?.product_status || 'in_development'}
              </Badge>
              <Badge variant="outline">v{detail?.project.version || 1}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select value={selectedProductId} onChange={(event) => void load(event.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
            {products.map((product) => <option key={product.id} value={product.id}>{product.product_name}</option>)}
          </select>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" /> Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="gap-2" onClick={() => handleAction('View')}>
                <Eye className="w-4 h-4" /> View
              </Button>
              <Button className="gap-2" onClick={() => setIsEditing(true)} disabled={!selectedProduct}>
                <Edit3 className="w-4 h-4" /> Edit
              </Button>
            </>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" /> Software Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Product Name</label>
                  <p className="font-medium">{selectedProduct?.product_name || 'No product selected'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Version</label>
                  <p className="font-medium">v{detail?.project.version || 1}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Hero Summary</label>
                {isEditing ? (
                  <Textarea 
                    value={draft.hero_summary}
                    onChange={(e) => setDraft((current) => ({ ...current, hero_summary: e.target.value }))}
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{selectedProduct?.hero_summary || 'No summary yet'}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Status</label>
                  {isEditing ? (
                    <Select value={draft.product_status} onValueChange={(value) => setDraft((current) => ({ ...current, product_status: value as FactoryProduct['product_status'] }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="in_development">In Development</SelectItem>
                        <SelectItem value="deployed">Deployed</SelectItem>
                        <SelectItem value="locked">Locked</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge>{selectedProduct?.product_status || 'in_development'}</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Home Category</label>
                  {isEditing ? (
                    <Input value={draft.home_category} onChange={(e) => setDraft((current) => ({ ...current, home_category: e.target.value }))} />
                  ) : (
                    <p className="font-medium">{selectedProduct?.home_category || 'Unassigned'}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Domain</label>
                  {isEditing ? <Input value={draft.domain} onChange={(e) => setDraft((current) => ({ ...current, domain: e.target.value }))} /> : <p className="font-medium">{draft.domain || 'Not configured'}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Language</label>
                  {isEditing ? <Input value={draft.language} onChange={(e) => setDraft((current) => ({ ...current, language: e.target.value }))} /> : <p className="font-medium">{draft.language || 'en'}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Logo URL</label>
                  {isEditing ? <Input value={draft.logo} onChange={(e) => setDraft((current) => ({ ...current, logo: e.target.value }))} /> : <p className="font-medium break-all">{draft.logo || 'Not configured'}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Brand Color</label>
                  {isEditing ? <Input value={draft.color} onChange={(e) => setDraft((current) => ({ ...current, color: e.target.value }))} /> : <p className="font-medium">{draft.color || 'Not configured'}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Module Mapping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {modules.map((module) => (
                  <Badge key={module.id} variant="secondary" className="px-3 py-1">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />
                    {module.module_name}
                  </Badge>
                ))}
                {!modules.length ? <p className="text-sm text-muted-foreground">No modules mapped yet.</p> : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Deployments</span>
                </div>
                <span className="font-bold">{detail?.deployments?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">Health</span>
                </div>
                <span className="font-bold">{systemStatus?.health || 'unknown'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-violet-400" />
                  <span className="text-sm">Modules</span>
                </div>
                <span className="font-bold">{modules.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span>{selectedProduct ? new Date(selectedProduct.created_at).toLocaleDateString() : 'n/a'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Updated:</span>
                <span>{selectedProduct ? new Date(selectedProduct.updated_at).toLocaleDateString() : 'n/a'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Live URL:</span>
                <span className="truncate">{latestDeployment?.live_url || latestDeployment?.preview_url || 'Not deployed'}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleAction('Version Control')}>
                <GitBranch className="w-4 h-4" /> Version Control
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleAction('Lock')}>
                <Lock className="w-4 h-4" /> Lock Software
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => handleAction('History')}>
                <History className="w-4 h-4" /> View History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PMSoftwareProfile;
