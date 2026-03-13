import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Globe,
  Calendar,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Download,
} from 'lucide-react';
import { format, addDays, addMonths, addYears } from 'date-fns';

interface License {
  id: string;
  license_key: string;
  product_id: string;
  product_name: string;
  domain_bound: string | null;
  expires_at: string | null;
  status: string;
  created_at: string;
  user_email?: string;
}

const PMLicenseManager: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [filter, setFilter] = useState({ status: 'all', product: 'all' });
  const [generateForm, setGenerateForm] = useState({
    product_id: '',
    quantity: 1,
    expiry_type: 'none',
    domain_bind: '',
  });

  useEffect(() => {
    fetchLicenses();
    fetchProducts();
  }, []);

  const fetchLicenses = async () => {
    setLoading(true);
    // Simulating license data from a hypothetical table
    // In real implementation, this would query a licenses table
    const mockLicenses: License[] = [
      {
        id: '1',
        license_key: 'PROD-XXXX-YYYY-ZZZZ',
        product_id: 'p1',
        product_name: 'Enterprise Suite',
        domain_bound: 'example.com',
        expires_at: addMonths(new Date(), 6).toISOString(),
        status: 'active',
        created_at: new Date().toISOString(),
        user_email: 'user@example.com',
      },
    ];
    setLicenses(mockLicenses);
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('product_id, product_name')
      .eq('status', 'active')
      .order('product_name');
    if (data) setProducts(data);
  };

  const generateLicenseKey = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [];
    for (let s = 0; s < 4; s++) {
      let segment = '';
      for (let i = 0; i < 4; i++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }
    return segments.join('-');
  };

  const handleGenerateLicenses = async () => {
    if (!generateForm.product_id) {
      toast.error('Select a product');
      return;
    }

    setGenerating(true);
    try {
      const product = products.find(p => p.product_id === generateForm.product_id);
      const newLicenses: License[] = [];

      let expiresAt: string | null = null;
      switch (generateForm.expiry_type) {
        case '30days':
          expiresAt = addDays(new Date(), 30).toISOString();
          break;
        case '1year':
          expiresAt = addYears(new Date(), 1).toISOString();
          break;
        case 'lifetime':
          expiresAt = null;
          break;
      }

      for (let i = 0; i < generateForm.quantity; i++) {
        newLicenses.push({
          id: `gen-${Date.now()}-${i}`,
          license_key: generateLicenseKey(),
          product_id: generateForm.product_id,
          product_name: product?.product_name || 'Unknown',
          domain_bound: generateForm.domain_bind || null,
          expires_at: expiresAt,
          status: 'unused',
          created_at: new Date().toISOString(),
        });
      }

      setLicenses([...newLicenses, ...licenses]);
      toast.success(`Generated ${generateForm.quantity} license(s)`);
      setShowGenerateDialog(false);
      setGenerateForm({ product_id: '', quantity: 1, expiry_type: 'none', domain_bind: '' });
    } catch (error: any) {
      toast.error('Failed to generate licenses');
    } finally {
      setGenerating(false);
    }
  };

  const copyLicenseKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('License key copied');
  };

  const revokeLicense = (id: string) => {
    setLicenses(licenses.map(l => 
      l.id === id ? { ...l, status: 'revoked' } : l
    ));
    toast.success('License revoked');
  };

  const exportLicenses = () => {
    const csvContent = [
      ['License Key', 'Product', 'Status', 'Domain', 'Expires', 'Created'].join(','),
      ...licenses.map(l => [
        l.license_key,
        l.product_name,
        l.status,
        l.domain_bound || '',
        l.expires_at ? format(new Date(l.expires_at), 'yyyy-MM-dd') : 'Never',
        format(new Date(l.created_at), 'yyyy-MM-dd'),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `licenses_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredLicenses = licenses.filter(l => {
    if (filter.status !== 'all' && l.status !== filter.status) return false;
    if (filter.product !== 'all' && l.product_id !== filter.product) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-500 gap-1"><CheckCircle2 className="w-3 h-3" />Active</Badge>;
      case 'unused':
        return <Badge variant="secondary" className="gap-1"><Key className="w-3 h-3" />Unused</Badge>;
      case 'expired':
        return <Badge variant="outline" className="gap-1"><Calendar className="w-3 h-3" />Expired</Badge>;
      case 'revoked':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" />Revoked</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Key className="w-5 h-5" />
            License Manager
          </h2>
          <p className="text-sm text-muted-foreground">
            Generate, manage, and track product licenses
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportLicenses}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowGenerateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Generate Licenses
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{licenses.length}</div>
            <p className="text-xs text-muted-foreground">Total Licenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-500">
              {licenses.filter(l => l.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-500">
              {licenses.filter(l => l.status === 'unused').length}
            </div>
            <p className="text-xs text-muted-foreground">Unused</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-500">
              {licenses.filter(l => l.status === 'expired' || l.status === 'revoked').length}
            </div>
            <p className="text-xs text-muted-foreground">Expired/Revoked</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-4">
            <div className="w-48">
              <Select value={filter.status} onValueChange={(v) => setFilter({ ...filter, status: v })}>
                <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="unused">Unused</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="revoked">Revoked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select value={filter.product} onValueChange={(v) => setFilter({ ...filter, product: v })}>
                <SelectTrigger><SelectValue placeholder="Filter by product" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {products.map(p => (
                    <SelectItem key={p.product_id} value={p.product_id}>{p.product_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* License List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Licenses ({filteredLicenses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : filteredLicenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No licenses found
              </div>
            ) : (
              <div className="space-y-2">
                {filteredLicenses.map(license => (
                  <div 
                    key={license.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/30"
                  >
                    <div className="flex items-center gap-4">
                      <Key className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-secondary px-2 py-0.5 rounded">
                            {license.license_key}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => copyLicenseKey(license.license_key)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{license.product_name}</span>
                          {license.domain_bound && (
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {license.domain_bound}
                            </span>
                          )}
                          {license.expires_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Expires {format(new Date(license.expires_at), 'MMM d, yyyy')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(license.status)}
                      {license.status !== 'revoked' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => revokeLicense(license.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Generate Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Licenses</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product</label>
              <Select 
                value={generateForm.product_id} 
                onValueChange={(v) => setGenerateForm({ ...generateForm, product_id: v })}
              >
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>
                  {products.map(p => (
                    <SelectItem key={p.product_id} value={p.product_id}>{p.product_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Quantity</label>
              <Input 
                type="number" 
                min={1} 
                max={100}
                value={generateForm.quantity}
                onChange={(e) => setGenerateForm({ ...generateForm, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Expiry</label>
              <Select 
                value={generateForm.expiry_type} 
                onValueChange={(v) => setGenerateForm({ ...generateForm, expiry_type: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Expiry (Lifetime)</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Domain Binding (Optional)</label>
              <Input 
                placeholder="e.g., example.com"
                value={generateForm.domain_bind}
                onChange={(e) => setGenerateForm({ ...generateForm, domain_bind: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateLicenses} disabled={generating}>
              {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PMLicenseManager;
