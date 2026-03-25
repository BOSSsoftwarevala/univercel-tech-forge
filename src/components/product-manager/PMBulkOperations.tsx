import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Upload,
  Download,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Package,
  DollarSign,
  ToggleLeft,
  Tag,
} from 'lucide-react';

interface BulkOperationResult {
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

interface PMBulkOperationsProps {
  onComplete: () => void;
}

const PMBulkOperations: React.FC<PMBulkOperationsProps> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState('import');
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BulkOperationResult | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [bulkValue, setBulkValue] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('product_id, product_name, status, pricing_model, lifetime_price')
      .neq('status', 'deleted')
      .order('product_name');
    if (data) setProducts(data);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setProgress(0);
    setResult(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const resultData: BulkOperationResult = {
        total: lines.length - 1,
        success: 0,
        failed: 0,
        errors: [],
      };

      for (let i = 1; i < lines.length; i++) {
        setProgress((i / (lines.length - 1)) * 100);
        
        const values = lines[i].split(',').map(v => v.trim());
        const product: Record<string, any> = {};
        
        headers.forEach((header, idx) => {
          if (values[idx]) {
            switch (header) {
              case 'product_name':
              case 'product_type':
              case 'description':
              case 'pricing_model':
              case 'status':
                product[header] = values[idx];
                break;
              case 'lifetime_price':
              case 'monthly_price':
                product[header] = parseFloat(values[idx]) || 0;
                break;
            }
          }
        });

        if (!product.product_name) {
          resultData.failed++;
          resultData.errors.push(`Row ${i}: Missing product name`);
          continue;
        }

        const { error } = await supabase.from('products').insert([product as any]);
        
        if (error) {
          resultData.failed++;
          resultData.errors.push(`Row ${i}: ${error.message}`);
        } else {
          resultData.success++;
        }
      }

      setResult(resultData);
      toast.success(`Imported ${resultData.success} products`);
      onComplete();
    } catch (error: any) {
      toast.error('Import failed: ' + error.message);
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('product_name, product_type, description, pricing_model, lifetime_price, monthly_price, status')
        .neq('status', 'deleted');

      if (error) throw error;

      const headers = ['product_name', 'product_type', 'description', 'pricing_model', 'lifetime_price', 'monthly_price', 'status'];
      const csvContent = [
        headers.join(','),
        ...(data || []).map(row => 
          headers.map(h => `"${String((row as any)[h] || '').replace(/"/g, '""')}"`).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Export completed');
    } catch (error: any) {
      toast.error('Export failed: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedProducts.length === 0 || !bulkAction) {
      toast.error('Select products and action');
      return;
    }

    setConfirmDialogOpen(false);
    setBulkUpdating(true);
    setProgress(0);

    try {
      let updateData: Record<string, any> = {};
      
      switch (bulkAction) {
        case 'status':
          updateData.status = bulkValue;
          break;
        case 'pricing_model':
          updateData.pricing_model = bulkValue;
          break;
        case 'price_increase':
          // Handle price increase separately
          for (let i = 0; i < selectedProducts.length; i++) {
            const product = products.find(p => p.product_id === selectedProducts[i]);
            if (product) {
              const increase = parseFloat(bulkValue) / 100;
              await supabase
                .from('products')
                .update({ 
                  lifetime_price: product.lifetime_price * (1 + increase) 
                })
                .eq('product_id', selectedProducts[i]);
            }
            setProgress(((i + 1) / selectedProducts.length) * 100);
          }
          toast.success(`Updated ${selectedProducts.length} products`);
          onComplete();
          setBulkUpdating(false);
          setSelectedProducts([]);
          return;
      }

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .in('product_id', selectedProducts);

      if (error) throw error;

      // Log bulk action
      await supabase.from('product_action_logs').insert(
        selectedProducts.map(pid => ({
          product_id: pid,
          product_name: products.find(p => p.product_id === pid)?.product_name || 'Unknown',
          action: 'bulk_update',
          action_details: { action: bulkAction, value: bulkValue },
        }))
      );

      toast.success(`Updated ${selectedProducts.length} products`);
      onComplete();
      setSelectedProducts([]);
    } catch (error: any) {
      toast.error('Bulk update failed: ' + error.message);
    } finally {
      setBulkUpdating(false);
    }
  };

  const toggleProductSelection = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(p => p !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const selectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.product_id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Bulk Operations
          </h2>
          <p className="text-sm text-muted-foreground">
            Import, export, and bulk update products
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="import">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="w-4 h-4 mr-2" />
            Export
          </TabsTrigger>
          <TabsTrigger value="bulk">
            <Package className="w-4 h-4 mr-2" />
            Bulk Update
          </TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Import Products from CSV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a CSV file with columns: product_name, product_type, description, pricing_model, lifetime_price, monthly_price, status
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <Button asChild disabled={importing}>
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    {importing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Select CSV File
                  </label>
                </Button>
              </div>

              {importing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-center text-muted-foreground">
                    Importing... {Math.round(progress)}%
                  </p>
                </div>
              )}

              {result && (
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {result.success} Success
                    </Badge>
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="w-3 h-3" />
                      {result.failed} Failed
                    </Badge>
                  </div>
                  {result.errors.length > 0 && (
                    <div className="bg-destructive/10 rounded-lg p-3 max-h-32 overflow-y-auto">
                      {result.errors.map((err, i) => (
                        <p key={i} className="text-xs text-destructive">{err}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Export Products to CSV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Export all products to a CSV file for backup or analysis.
              </p>
              <Button onClick={handleExport} disabled={exporting}>
                {exporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export All Products
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Select Products for Bulk Update</CardTitle>
                <Button variant="outline" size="sm" onClick={selectAll}>
                  {selectedProducts.length === products.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-48 overflow-y-auto space-y-1 mb-4">
                {products.map(product => (
                  <label 
                    key={product.product_id}
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                      selectedProducts.includes(product.product_id) 
                        ? 'bg-primary/10' 
                        : 'hover:bg-secondary/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.product_id)}
                      onChange={() => toggleProductSelection(product.product_id)}
                      className="rounded"
                    />
                    <span className="text-sm flex-1">{product.product_name}</span>
                    <Badge variant="secondary" className="text-xs">{product.status}</Badge>
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium">Action</label>
                  <Select value={bulkAction} onValueChange={setBulkAction}>
                    <SelectTrigger><SelectValue placeholder="Select action" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="status">
                        <span className="flex items-center gap-2">
                          <ToggleLeft className="w-3 h-3" />
                          Change Status
                        </span>
                      </SelectItem>
                      <SelectItem value="pricing_model">
                        <span className="flex items-center gap-2">
                          <Tag className="w-3 h-3" />
                          Change Pricing Model
                        </span>
                      </SelectItem>
                      <SelectItem value="price_increase">
                        <span className="flex items-center gap-2">
                          <DollarSign className="w-3 h-3" />
                          Price Increase %
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Value</label>
                  {bulkAction === 'status' ? (
                    <Select value={bulkValue} onValueChange={setBulkValue}>
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="parked">Parked</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : bulkAction === 'pricing_model' ? (
                    <Select value={bulkValue} onValueChange={setBulkValue}>
                      <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one_time">One-Time</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                        <SelectItem value="tier_based">Tier-Based</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      type="number" 
                      placeholder="e.g., 10 for 10%"
                      value={bulkValue}
                      onChange={(e) => setBulkValue(e.target.value)}
                    />
                  )}
                </div>
              </div>

              <Button 
                className="w-full mt-4"
                disabled={selectedProducts.length === 0 || !bulkAction || !bulkValue || bulkUpdating}
                onClick={() => setConfirmDialogOpen(true)}
              >
                {bulkUpdating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Update {selectedProducts.length} Products
              </Button>

              {bulkUpdating && (
                <div className="mt-4">
                  <Progress value={progress} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Confirm Bulk Update
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            You are about to update <strong>{selectedProducts.length} products</strong>.
            This action will be logged but cannot be easily undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkUpdate}>
              Confirm Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PMBulkOperations;
