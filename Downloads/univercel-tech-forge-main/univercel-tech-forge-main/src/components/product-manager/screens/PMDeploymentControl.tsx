import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  assignFactoryClientDeployment,
  assignFactoryDeploymentServer,
  listFactoryDeploymentLogs,
  listFactoryDeploymentServers,
  listFactoryProducts,
  rollbackFactoryDeployment,
  setFactoryDeploymentEnvironment,
  startFactoryDeployment,
  stopFactoryDeployment,
  type FactoryDeployLog,
  type FactoryProduct,
  type FactoryServer,
} from '@/lib/api/vala-factory';
import { Rocket, Server, GitBranch, RotateCcw, StopCircle, FileText, RefreshCw, Globe2, Activity, Loader2 } from 'lucide-react';

interface PMDeploymentControlProps {
  deploymentType: string;
}

const PMDeploymentControl: React.FC<PMDeploymentControlProps> = ({ deploymentType }) => {
  const [products, setProducts] = useState<FactoryProduct[]>([]);
  const [servers, setServers] = useState<FactoryServer[]>([]);
  const [logs, setLogs] = useState<FactoryDeployLog[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedServerId, setSelectedServerId] = useState('');
  const [selectedEnv, setSelectedEnv] = useState<'dev' | 'staging' | 'production'>('staging');
  const [clientId, setClientId] = useState('client-enterprise');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const selectedProduct = useMemo(() => products.find((product) => product.id === selectedProductId) || null, [products, selectedProductId]);

  const load = async (productId?: string) => {
    try {
      setLoading(true);
      const [productsResponse, serversResponse] = await Promise.all([listFactoryProducts(), listFactoryDeploymentServers()]);
      const productItems = productsResponse.data.items || [];
      setProducts(productItems);
      setServers(serversResponse.data.items || []);
      const nextProductId = productId || selectedProductId || productItems[0]?.id || '';
      if (nextProductId) {
        setSelectedProductId(nextProductId);
        const logResponse = await listFactoryDeploymentLogs(nextProductId);
        setLogs(logResponse.data.items || []);
        const activeProduct = productItems.find((item) => item.id === nextProductId);
        if (activeProduct?.assigned_server_id) setSelectedServerId(activeProduct.assigned_server_id);
        if (activeProduct?.env_type) setSelectedEnv(activeProduct.env_type);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error('Failed to load deployment control', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load deployment control');
    } finally {
      setLoading(false);
      setBusy(null);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const runAction = async (action: string, task: () => Promise<void>) => {
    if (!selectedProductId) {
      toast.error('Select a product first');
      return;
    }
    try {
      setBusy(action);
      await task();
      await load(selectedProductId);
    } catch (error) {
      console.error(`Failed ${action}`, error);
      toast.error(error instanceof Error ? error.message : `Failed ${action}`);
      setBusy(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Deployment Control</h1>
            <p className="text-sm text-muted-foreground">Server assignment, environment, deploy, rollback, stop, and logs are all live.</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => void load(selectedProductId)}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh
        </Button>
      </motion.div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm">Live Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Product</label>
              <Select value={selectedProductId} onValueChange={(value) => void load(value)}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>{products.map((product) => <SelectItem key={product.id} value={product.id}>{product.product_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Environment</label>
              <Select value={selectedEnv} onValueChange={(value) => setSelectedEnv(value as 'dev' | 'staging' | 'production')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dev">dev</SelectItem>
                  <SelectItem value="staging">staging</SelectItem>
                  <SelectItem value="production">production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Server</label>
              <Select value={selectedServerId} onValueChange={setSelectedServerId}>
                <SelectTrigger><SelectValue placeholder="Select server" /></SelectTrigger>
                <SelectContent>{servers.map((server) => <SelectItem key={server.id} value={server.id}>{server.server_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-3">
            <Button variant="outline" className="gap-2" onClick={() => void runAction('server', async () => {
              const response = await assignFactoryDeploymentServer(selectedProductId, { server_id: selectedServerId });
              toast.success(`Assigned to ${response.data.server.server_name}`);
            })} disabled={!selectedServerId || busy === 'server'}>
              <Server className="h-4 w-4" />
              Server Assignment
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => void runAction('env', async () => {
              await setFactoryDeploymentEnvironment(selectedProductId, { env_type: selectedEnv });
              toast.success(`Environment set to ${selectedEnv}`);
            })} disabled={busy === 'env'}>
              <GitBranch className="h-4 w-4" />
              Environment Select
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => void runAction('client', async () => {
              await assignFactoryClientDeployment(selectedProductId, { client_id: clientId });
              toast.success(`Client mapped: ${clientId}`);
            })} disabled={busy === 'client'}>
              <Globe2 className="h-4 w-4" />
              Client Deploy
            </Button>
            <Button className="gap-2 bg-emerald-600 text-white hover:bg-emerald-500" onClick={() => void runAction('deploy', async () => {
              const response = await startFactoryDeployment(selectedProductId);
              toast.success(`Deployment ${response.data.deployment.deployment_status}`);
            })} disabled={busy === 'deploy'}>
              <Rocket className="h-4 w-4" />
              Deploy
            </Button>
            <Button variant="outline" className="gap-2 border-amber-500/40 text-amber-400" onClick={() => void runAction('rollback', async () => {
              const response = await rollbackFactoryDeployment(selectedProductId);
              toast.success(`Rollback target ${response.data.targetVersion || 'previous version'}`);
            })} disabled={busy === 'rollback'}>
              <RotateCcw className="h-4 w-4" />
              Rollback
            </Button>
            <Button variant="outline" className="gap-2 border-red-500/40 text-red-400" onClick={() => void runAction('stop', async () => {
              await stopFactoryDeployment(selectedProductId);
              toast.success('Deployment stopped');
            })} disabled={busy === 'stop'}>
              <StopCircle className="h-4 w-4" />
              Stop Deployment
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedProduct ? (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Product</p><p className="font-semibold">{selectedProduct.product_name}</p></CardContent></Card>
          <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Status</p><Badge variant="outline">{selectedProduct.product_status}</Badge></CardContent></Card>
          <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Environment</p><p className="font-semibold">{selectedProduct.env_type}</p></CardContent></Card>
          <Card className="bg-card/50 border-border/50"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Assigned Server</p><p className="font-semibold">{selectedProduct.assigned_server_id || 'Not assigned'}</p></CardContent></Card>
        </div>
      ) : null}

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2"><Activity className="h-4 w-4" /> Deployment Logs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-22rem)]">
            <div className="divide-y divide-border/50">
              {logs.map((log) => (
                <div key={log.id} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{log.message}</p>
                      <p className="text-xs text-muted-foreground">{log.env_type} • {new Date(log.created_at).toLocaleString()}</p>
                    </div>
                    <Badge variant="outline">{log.status}</Badge>
                  </div>
                  {log.error ? <p className="mt-2 text-xs text-red-400">{log.error}</p> : null}
                </div>
              ))}
              {!logs.length && !loading ? <div className="p-8 text-center text-sm text-muted-foreground"><FileText className="mx-auto mb-2 h-10 w-10 opacity-50" />No deployment logs yet.</div> : null}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PMDeploymentControl;
