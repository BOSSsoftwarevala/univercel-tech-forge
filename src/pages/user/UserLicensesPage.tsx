import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Key, Copy, Check, Calendar, Package, Loader2, Store, ExternalLink, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface License {
  license_id: string;
  license_key: string;
  product_id: string | null;
  status: string | null;
  expires_at: string | null;
  max_installations: number | null;
  current_installations: number | null;
  created_at: string;
  products?: { product_name: string; category: string | null } | null;
}

function maskKey(key: string): string {
  if (key.length <= 8) return '****-****';
  return key.substring(0, 4) + '-****-****-' + key.slice(-4);
}

export default function UserLicensesPage() {
  const { user } = useAuth();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data } = await (supabase as any)
        .from('user_licenses')
        .select(`*, products (product_name, category)`)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setLicenses(data || []);
      setLoading(false);
    })();
  }, [user]);

  const copyKey = (licenseId: string, key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopied(licenseId);
      toast.success('License key copied!');
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {
      toast.error('Failed to copy — please copy manually');
    });
  };

  const statusColor = (status: string | null) => {
    if (status === 'active') return 'bg-green-900/50 text-green-300 border-green-700';
    if (status === 'expired') return 'bg-red-900/50 text-red-300 border-red-700';
    if (status === 'suspended') return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
    return 'bg-slate-700 text-slate-400';
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="h-6 w-6 text-purple-500" />
            <div>
              <h1 className="text-xl font-bold text-white">My Licenses</h1>
              <p className="text-slate-400 text-sm">Manage your software licenses</p>
            </div>
          </div>
          <Link to="/marketplace"><Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800"><Store className="h-4 w-4 mr-2" />Browse Marketplace</Button></Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 text-purple-500 animate-spin" /></div>
        ) : licenses.length === 0 ? (
          <div className="text-center py-20">
            <ShieldCheck className="h-16 w-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">No licenses found</p>
            <p className="text-slate-500 text-sm mb-6">Purchase products to receive license keys</p>
            <Link to="/marketplace"><Button className="bg-purple-600 hover:bg-purple-700">Explore Marketplace</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {licenses.map(lic => (
              <Card key={lic.license_id} className="bg-slate-800/80 border-slate-700 hover:border-purple-700 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-900/50 border border-purple-700/50 flex items-center justify-center">
                        <Key className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-base">{lic.products?.product_name || 'Unknown Product'}</CardTitle>
                        {lic.products?.category && <p className="text-slate-400 text-xs">{lic.products.category}</p>}
                      </div>
                    </div>
                    <Badge className={statusColor(lic.status)}>{lic.status || 'unknown'}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-slate-900 rounded-lg p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">License Key</p>
                      <code className="text-purple-300 text-sm font-mono">{maskKey(lic.license_key)}</code>
                    </div>
                    <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white shrink-0" onClick={() => copyKey(lic.license_id, lic.license_key)}>
                      {copied === lic.license_id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <div>
                        <p className="text-slate-500 text-xs">Expires</p>
                        <p>{lic.expires_at ? new Date(lic.expires_at).toLocaleDateString() : 'Never'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Package className="h-4 w-4" />
                      <div>
                        <p className="text-slate-500 text-xs">Installations</p>
                        <p>{lic.current_installations || 0} / {lic.max_installations || '∞'}</p>
                      </div>
                    </div>
                  </div>

                  {lic.product_id && (
                    <Link to={`/marketplace/product/${lic.product_id}`}>
                      <Button variant="outline" size="sm" className="w-full border-slate-700 text-slate-300 hover:bg-slate-700">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />View Product
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
