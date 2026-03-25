import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  autoFixFactoryProductIssues,
  findFactoryCodeLibraryMatches,
  generateFactoryDevStudioBuild,
  getFactoryDevStudioState,
  listFactoryProducts,
  saveFactoryDevStudioConfig,
  scanFactoryProductIssues,
  sendFactoryProductToDeploy,
  validateFactoryDevStudio,
  type FactoryCodeLibraryItem,
  type FactoryDevStudioState,
  type FactoryProduct,
} from '@/lib/api/vala-factory';
import { Brain, Bug, Database, Hammer, Rocket, Save, SearchCode, ShieldCheck, Wrench } from 'lucide-react';

const PMDevStudio: React.FC = () => {
  const [products, setProducts] = useState<FactoryProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [state, setState] = useState<FactoryDevStudioState | null>(null);
  const [loading, setLoading] = useState(false);
  const [matchResults, setMatchResults] = useState<FactoryCodeLibraryItem[]>([]);
  const [config, setConfig] = useState({ logo: '', color: '', domain: '', language: 'en' });

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
        setState(null);
        setMatchResults([]);
        return;
      }
      setSelectedProductId(resolvedProductId);
      const response = await getFactoryDevStudioState(resolvedProductId);
      setState(response.data);
      const productConfig = response.data.product.product_config || {};
      setConfig({
        logo: String(productConfig.logo || ''),
        color: String(productConfig.color || ''),
        domain: String(productConfig.domain || ''),
        language: String(productConfig.language || 'en'),
      });
    } catch (error) {
      console.error('Failed to load Dev Studio', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load Dev Studio');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const execute = async (action: () => Promise<void>, message: string) => {
    setLoading(true);
    try {
      await action();
      toast.success(message);
      await load(selectedProductId);
    } catch (error) {
      console.error(message, error);
      toast.error(error instanceof Error ? error.message : message);
    } finally {
      setLoading(false);
    }
  };

  const issues = state?.issues || [];
  const aiLogs = state?.ai_logs || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dev Studio</h1>
          <p className="text-sm text-muted-foreground">Logic layer only: config, validate, issue scan, AI repair, build prep, and send-to-deploy handoff</p>
        </div>
        <select value={selectedProductId} onChange={(event) => void load(event.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
          {products.map((product) => <option key={product.id} value={product.id}>{product.product_name}</option>)}
        </select>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2"><Database className="h-4 w-4" /> Config Setup</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <Input value={config.logo} onChange={(event) => setConfig((current) => ({ ...current, logo: event.target.value }))} placeholder="Logo URL" />
              <Input value={config.color} onChange={(event) => setConfig((current) => ({ ...current, color: event.target.value }))} placeholder="Primary color" />
              <Input value={config.domain} onChange={(event) => setConfig((current) => ({ ...current, domain: event.target.value }))} placeholder="Domain" />
              <Input value={config.language} onChange={(event) => setConfig((current) => ({ ...current, language: event.target.value }))} placeholder="Language" />
              <div className="md:col-span-2 flex flex-wrap gap-3">
                <Button disabled={loading || !selectedProductId} onClick={() => void execute(async () => {
                  await saveFactoryDevStudioConfig(selectedProductId, config);
                }, 'Configuration saved')}><Save className="mr-2 h-4 w-4" /> Save Config</Button>
                <Button variant="outline" disabled={loading || !selectedProductId} onClick={() => void execute(async () => {
                  await validateFactoryDevStudio(selectedProductId);
                }, 'Validation completed')}><ShieldCheck className="mr-2 h-4 w-4" /> Validate</Button>
                <Button variant="outline" disabled={loading || !selectedProductId} onClick={() => void execute(async () => {
                  await generateFactoryDevStudioBuild(selectedProductId);
                }, 'Build generation started')}><Hammer className="mr-2 h-4 w-4" /> Generate Build</Button>
                <Button variant="outline" disabled={loading || !selectedProductId} onClick={() => void execute(async () => {
                  await sendFactoryProductToDeploy(selectedProductId, { env_type: 'production' });
                }, 'Sent to deployment control')}><Rocket className="mr-2 h-4 w-4" /> Send to Deploy</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2"><Bug className="h-4 w-4" /> AI Development Engine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" disabled={loading || !selectedProductId} onClick={() => void execute(async () => {
                  await scanFactoryProductIssues(selectedProductId);
                }, 'Issue scan completed')}><SearchCode className="mr-2 h-4 w-4" /> Scan Issues</Button>
                <Button variant="outline" disabled={loading || !selectedProductId} onClick={() => void execute(async () => {
                  await autoFixFactoryProductIssues(selectedProductId, { auto_deploy: false });
                }, 'Auto fix completed')}><Wrench className="mr-2 h-4 w-4" /> Auto Fix</Button>
                <Button variant="outline" disabled={loading || !selectedProductId} onClick={() => void execute(async () => {
                  await autoFixFactoryProductIssues(selectedProductId, { auto_deploy: false });
                }, 'AI improvement run completed')}><Brain className="mr-2 h-4 w-4" /> AI Improve Code</Button>
                <Button variant="outline" disabled={loading || !selectedProductId} onClick={() => void execute(async () => {
                  const response = await findFactoryCodeLibraryMatches(selectedProductId, selectedProduct?.product_name || '');
                  setMatchResults(response.data.items || []);
                }, 'Code library matches loaded')}><SearchCode className="mr-2 h-4 w-4" /> Find Best Match</Button>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-border/50 p-4">
                  <p className="mb-3 text-sm font-medium">Issues</p>
                  <div className="space-y-2">
                    {issues.map((issue) => (
                      <div key={issue.id} className="rounded-md border border-border/50 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{issue.title}</span>
                          <Badge variant="outline">{issue.status}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{issue.issue_type} • {issue.severity}</p>
                      </div>
                    ))}
                    {!issues.length ? <p className="text-sm text-muted-foreground">No tracked issues.</p> : null}
                  </div>
                </div>
                <div className="rounded-lg border border-border/50 p-4">
                  <p className="mb-3 text-sm font-medium">AI Logs</p>
                  <ScrollArea className="h-56">
                    <div className="space-y-2">
                      {aiLogs.map((log) => (
                        <div key={log.id} className="rounded-md border border-border/50 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium">{log.action}</span>
                            <Badge variant="outline">{log.status}</Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</p>
                        </div>
                      ))}
                      {!aiLogs.length ? <p className="text-sm text-muted-foreground">No AI logs yet.</p> : null}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm">Project Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Product</span><span>{selectedProduct?.product_name || 'n/a'}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Project Status</span><Badge variant="outline">{state?.project.project.status || 'n/a'}</Badge></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Pipeline</span><span>{state?.project.project.pipeline_status || 'n/a'}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Server</span><span>{selectedProduct?.assigned_server_id || 'Unassigned'}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Latest Build</span><span>{state?.project.mobileBuilds?.[0]?.status || 'n/a'}</span></div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm">Code Reuse Matches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {matchResults.map((item) => (
                <div key={item.id} className="rounded-md border border-border/50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm">{item.name}</span>
                    <Badge variant="outline">{item.similarity_score?.toFixed(1)}%</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{item.category} • {item.tech_stack}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Usage {item.usage_count} • Success {item.success_rate}%</p>
                </div>
              ))}
              {!matchResults.length ? <p className="text-sm text-muted-foreground">Run “Find Best Match” to score reusable code from the library.</p> : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PMDevStudio;