import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, Loader2, Database, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const MPImportExport = () => {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);

  const importFromGitHub = async () => {
    setImporting(true);
    setProgress(20);
    setResult(null);
    try {
      toast.info("Fetching repositories and importing...");
      setProgress(40);
      const { data, error } = await supabase.functions.invoke('import-github-repos');
      setProgress(90);
      if (error) throw error;
      setResult(data);
      toast.success(`${data.imported} products imported successfully`);
    } catch (err: any) {
      toast.error(err.message || 'Import failed');
    } finally {
      setProgress(100);
      setTimeout(() => { setImporting(false); setProgress(0); }, 1500);
    }
  };

  const exportCSV = async () => {
    const { data } = await supabase.from('products').select('product_name, category, tech_stack, pricing_model, monthly_price, lifetime_price, is_active').eq('is_active', true);
    if (!data?.length) return toast.error('No products to export');
    
    const headers = ['Product Name', 'Category', 'Tech Stack', 'Pricing', 'Monthly', 'Lifetime', 'Active'];
    const csv = [
      headers.join(','),
      ...data.map((r: any) => [r.product_name, r.category, r.tech_stack, r.pricing_model, r.monthly_price, r.lifetime_price, r.is_active].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketplace-products-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success('CSV exported');
  };

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bulk Import / Export</h1>
            <p className="text-sm text-muted-foreground">Import from repositories or export marketplace data</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-bold text-foreground">Import from Repos</h3>
                  <p className="text-sm text-muted-foreground">Fetch all repositories, auto-categorize, and add to marketplace</p>
                </div>
              </div>
              <Button onClick={importFromGitHub} disabled={importing} className="w-full">
                {importing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                {importing ? 'Importing...' : 'Start Import'}
              </Button>
              {importing && <Progress value={progress} className="h-2" />}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Download className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-bold text-foreground">Export CSV</h3>
                  <p className="text-sm text-muted-foreground">Download all active products as CSV file</p>
                </div>
              </div>
              <Button onClick={exportCSV} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" /> Export Products
              </Button>
            </CardContent>
          </Card>
        </div>

        {result && (
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <p className="font-medium text-foreground">Import Complete</p>
                  <p className="text-sm text-muted-foreground">
                    {result.imported} imported • {result.skipped_duplicates || 0} duplicates skipped • {result.failed || 0} failed
                  </p>
                </div>
              </div>
              {result.categories && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(result.categories).sort((a: any, b: any) => b[1] - a[1]).map(([cat, count]: any) => (
                    <Badge key={cat} variant="outline">{cat}: {count}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
};

export default MPImportExport;
