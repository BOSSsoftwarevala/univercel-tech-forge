import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { buildFactoryMobile, controlFactoryPipeline, getFactoryProductDetail, listFactoryProducts, type FactoryProduct, type FactoryProjectDetail } from '@/lib/api/vala-factory';
import {
  FileCode, Upload, Package, Globe2, Archive, Lock,
  Eye, Download, Edit3, History, Trash2, File,
  CheckCircle2, Clock
} from 'lucide-react';

interface PMFileBuildProps {
  buildType: string;
}

const PMFileBuild: React.FC<PMFileBuildProps> = ({ buildType }) => {
  const [products, setProducts] = useState<FactoryProduct[]>([]);
  const [detail, setDetail] = useState<FactoryProjectDetail | null>(null);
  const [selectedProductId, setSelectedProductId] = useState('');

  const selectedProduct = useMemo(() => products.find((product) => product.id === selectedProductId) || null, [products, selectedProductId]);

  const load = async (productId?: string) => {
    try {
      const productsResponse = await listFactoryProducts();
      const productItems = productsResponse.data.items || [];
      setProducts(productItems);
      const nextProductId = productId || selectedProductId || productItems[0]?.id || '';
      if (!nextProductId) {
        setDetail(null);
        return;
      }
      setSelectedProductId(nextProductId);
      const detailResponse = await getFactoryProductDetail(nextProductId);
      setDetail(detailResponse.data.project);
    } catch (error) {
      console.error('Failed to load file/build data', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load file/build data');
    }
  };

  useEffect(() => {
    void load();
  }, [buildType]);

  const getTitle = () => {
    switch (buildType) {
      case 'upload-build': return 'Upload Build Files';
      case 'apk-builds': return 'APK Builds';
      case 'web-builds': return 'Web Builds';
      case 'assets': return 'Assets';
      case 'file-lock': return 'File Lock';
      case 'view-only-mode': return 'View-Only Mode';
      case 'version-history': return 'Version History';
      default: return 'File & Build Management';
    }
  };

  const handleUpload = () => {
    toast.error('Direct binary upload is not connected to storage yet. Use Build Project or Build APK to create a real build record.');
  };

  const handleBuildProject = async () => {
    if (!selectedProduct) {
      toast.error('Select a product first');
      return;
    }
    try {
      await controlFactoryPipeline(selectedProduct.project_id, { action: 'start' });
      toast.success('Build pipeline started');
      await load(selectedProduct.id);
    } catch (error) {
      console.error('Failed to start project build', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start project build');
    }
  };

  const handleMobileBuild = async (type: 'apk-release' | 'pwa') => {
    if (!selectedProduct) {
      toast.error('Select a product first');
      return;
    }
    try {
      await buildFactoryMobile(selectedProduct.project_id, { build_type: type });
      toast.success(`${type} build recorded`);
      await load(selectedProduct.id);
    } catch (error) {
      console.error('Failed mobile build', error);
      toast.error(error instanceof Error ? error.message : 'Failed mobile build');
    }
  };

  if (buildType === 'upload-build') {
    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{getTitle()}</h1>
            <p className="text-sm text-muted-foreground">Upload APK, Web Build, or Assets</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { type: 'APK', icon: Package, color: 'emerald', desc: 'Android Package' },
            { type: 'Web Build', icon: Globe2, color: 'blue', desc: 'Web Application' },
            { type: 'Assets', icon: Archive, color: 'amber', desc: 'Images, Icons, etc.' },
          ].map((item) => (
            <Card key={item.type} className="bg-card/50 border-border/50 hover:border-primary/30 transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/20 flex items-center justify-center mb-4 border border-${item.color}-500/30`}>
                  <item.icon className={`w-8 h-8 text-${item.color}-400`} />
                </div>
                <h3 className="font-semibold mb-1">{item.type}</h3>
                <p className="text-xs text-muted-foreground mb-4">{item.desc}</p>
                <Button onClick={handleUpload} className="w-full gap-2">
                  <Upload className="w-4 h-4" /> Upload
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">Build Artifacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Factory build history is live.</p>
            <p>Binary file upload is blocked until a storage bucket and artifact-ingest route are connected.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const builds = detail?.mobileBuilds || [];
  const filteredBuilds = buildType === 'apk-builds'
    ? builds.filter((item) => item.build_type !== 'pwa')
    : buildType === 'web-builds'
      ? builds.filter((item) => item.build_type === 'pwa')
      : builds;

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <FileCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{getTitle()}</h1>
            <p className="text-sm text-muted-foreground">
              {filteredBuilds.length} files available
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select value={selectedProductId} onChange={(event) => void load(event.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
            {products.map((product) => <option key={product.id} value={product.id}>{product.product_name}</option>)}
          </select>
          <Button variant="outline" onClick={() => void handleMobileBuild('apk-release')}>Build APK</Button>
          <Button variant="outline" onClick={() => void handleBuildProject()}>Build Project</Button>
        </div>
      </motion.div>

      {buildType === 'version-history' ? (
        <Card className="bg-card/50 border-border/50">
          <CardContent className="divide-y divide-border/50 p-0">
            {(detail?.versions || []).map((version) => (
              <div key={version.id} className="p-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{version.version_label}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(version.created_at).toLocaleString()}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{version.change_summary || 'No summary'}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <ScrollArea className="h-[calc(100vh-14rem)]">
        <div className="space-y-3">
          {filteredBuilds.map((build, index) => (
            <motion.div
              key={build.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-card/50 border-border/50 hover:border-indigo-500/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <File className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm">{build.build_type}</h3>
                            {build.signing_status === 'signed' ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : null}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{build.version_name}</span>
                          <span>•</span>
                            <span>{build.version_code}</span>
                          <span>•</span>
                            <span>{new Date(build.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline"
                          className={build.status === 'completed' || build.status === 'signed' 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }
                      >
                          {build.status === 'completed' || build.status === 'signed' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {build.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => toast.info(JSON.stringify(build.output_metadata))}>
                      <Eye className="w-3.5 h-3.5" /> View
                    </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => build.artifact_url ? window.open(build.artifact_url, '_blank') : toast.info('No artifact URL yet')}>
                      <Download className="w-3.5 h-3.5" /> Download
                    </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => toast.info(`Signing: ${build.signing_status}`)}>
                        <Lock className="w-3.5 h-3.5" /> Lock
                    </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-red-400 hover:text-red-300" onClick={() => toast.info('Artifacts are managed by the build pipeline history')}>
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
            {!filteredBuilds.length ? (
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-6 text-sm text-muted-foreground">No build records yet. Use Build Project or Build APK to create one.</CardContent>
              </Card>
            ) : null}
            {buildType !== 'version-history' && detail?.runtimeLogs?.length ? (
              <Card className="bg-card/50 border-border/50">
                <CardHeader><CardTitle className="text-sm">View Build Logs</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {detail.runtimeLogs.slice(0, 8).map((log) => (
                    <div key={log.id} className="rounded-md border border-border/50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{log.message}</span>
                        <Badge variant="outline">{log.severity}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PMFileBuild;
