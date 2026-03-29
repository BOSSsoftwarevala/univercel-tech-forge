import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getFactoryProductManagerCeoSummary, listFactoryProducts, type FactoryProduct, type FactoryProductManagerCeoSummary } from '@/lib/api/vala-factory';
import { Package, RefreshCw, Search, Globe2, Lock, Archive, Code, Rocket } from 'lucide-react';

interface PMFactoryProductsProps {
  statusFilter?: FactoryProduct['product_status'];
}

const statusMeta: Record<FactoryProduct['product_status'], { label: string; icon: React.ElementType }> = {
  active: { label: 'Active', icon: Globe2 },
  in_development: { label: 'In Development', icon: Code },
  deployed: { label: 'Deployed', icon: Rocket },
  locked: { label: 'Locked', icon: Lock },
  archived: { label: 'Archived', icon: Archive },
};

const PMFactoryProducts: React.FC<PMFactoryProductsProps> = ({ statusFilter }) => {
  const [products, setProducts] = useState<FactoryProduct[]>([]);
  const [summary, setSummary] = useState<FactoryProductManagerCeoSummary | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [response, summaryResponse] = await Promise.all([
        listFactoryProducts(statusFilter),
        getFactoryProductManagerCeoSummary(),
      ]);
      setProducts(response.data.items || []);
      setSummary(summaryResponse.data);
    } catch (error) {
      console.error('Failed to load factory products', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load factory products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [statusFilter]);

  const filtered = products.filter((product) => {
    const needle = search.toLowerCase();
    return !needle || product.product_name.toLowerCase().includes(needle) || String(product.home_category || '').toLowerCase().includes(needle);
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Package className="w-6 h-6 text-primary" /> Software Products</h1>
          <p className="text-sm text-muted-foreground">Live factory products created from prompts, imports, and deployment flows</p>
        </div>
        <Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</Button>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products or tech stack" className="pl-9" />
          </div>
          <Badge variant="secondary">{filtered.length} products</Badge>
        </CardContent>
      </Card>

      {summary ? (
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Products</p><p className="text-2xl font-bold">{summary.totals.products}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Deployed</p><p className="text-2xl font-bold">{summary.totals.deployed}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Critical Issues</p><p className="text-2xl font-bold">{summary.totals.critical_issues}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Pending Syncs</p><p className="text-2xl font-bold">{summary.totals.pending_syncs}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">AI Cost</p><p className="text-2xl font-bold">₹{summary.totals.ai_cost.toFixed(2)}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Online Servers</p><p className="text-2xl font-bold">{summary.totals.online_servers}</p></CardContent></Card>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product, index) => {
          const meta = statusMeta[product.product_status];
          const Icon = meta.icon;
          return (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
              <Card className="h-full bg-card/50 border-border/50 hover:border-primary/30 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{product.product_name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{product.home_category || 'Uncategorized'}</p>
                    </div>
                    <Badge variant="outline" className="gap-1"><Icon className="h-3 w-3" /> {meta.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Environment</span>
                    <span>{product.env_type}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">License</span>
                    <span className="truncate">{product.license_key}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Server</span>
                    <span>{product.assigned_server_id || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Updated</span>
                    <span>{new Date(product.updated_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {!filtered.length ? (
          <Card className="md:col-span-2 xl:col-span-3">
            <CardContent className="p-6 text-sm text-muted-foreground">No factory products match the current filter.</CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default PMFactoryProducts;