import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Key, Shield, Copy, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { marketplaceEnterpriseService } from '@/services/marketplaceEnterpriseService';
import { toast } from 'sonner';

export function MMLicensesScreen() {
  const { user } = useAuth();
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    loadLicenses();
  }, [user?.id]);

  const loadLicenses = async () => {
    const { data } = await marketplaceEnterpriseService.getUserLicenses(user!.id);
    setLicenses(data);
    setLoading(false);
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('License key copied');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Key className="h-6 w-6 text-purple-400" />
          License Manager
        </h1>
        <p className="text-slate-400 mt-1">View and manage all your software licenses</p>
      </div>

      {licenses.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No licenses found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {licenses.map(license => (
            <Card key={license.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Shield className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium">{license.product_id}</p>
                      <p className="text-xs text-slate-400 font-mono">{license.license_key}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs text-slate-500">
                      <p>Type: {license.license_type}</p>
                      {license.expires_at && <p>Exp: {new Date(license.expires_at).toLocaleDateString()}</p>}
                    </div>
                    <Badge className={
                      license.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }>
                      {license.status}
                    </Badge>
                    <Button size="sm" variant="outline" className="border-slate-600" onClick={() => copyKey(license.license_key)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
