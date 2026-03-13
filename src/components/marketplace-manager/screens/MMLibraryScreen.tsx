import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Library, Monitor, Key, ExternalLink, Loader2, Package } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { marketplaceEnterpriseService } from '@/services/marketplaceEnterpriseService';

export function MMLibraryScreen() {
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
          <Library className="h-6 w-6 text-purple-400" />
          My Software Library
        </h1>
        <p className="text-slate-400 mt-1">Your purchased and licensed software</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-emerald-500/10 border-emerald-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-400">{licenses.filter(l => l.status === 'active').length}</p>
            <p className="text-xs text-emerald-400">Active Licenses</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-400">{licenses.filter(l => l.status === 'expired').length}</p>
            <p className="text-xs text-amber-400">Expired</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{licenses.length}</p>
            <p className="text-xs text-slate-400">Total Licenses</p>
          </CardContent>
        </Card>
      </div>

      {licenses.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No software in your library yet.</p>
          <p className="text-xs mt-1">Purchase from the marketplace to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {licenses.map(license => (
            <Card key={license.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-900/40 to-slate-800">
                    <Monitor className="h-8 w-8 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{license.product_id}</h3>
                      <Badge className={
                        license.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }>
                        {license.status}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Key className="h-3 w-3" />
                        <span className="font-mono">{license.license_key}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Type: {license.license_type}</span>
                        {license.expires_at && (
                          <span>Expires: {new Date(license.expires_at).toLocaleDateString()}</span>
                        )}
                        {license.max_installations && (
                          <span>Installs: {license.current_installations || 0}/{license.max_installations}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="border-slate-600 text-xs">
                        <ExternalLink className="h-3 w-3 mr-1" /> Access
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-xs">
                        <Key className="h-3 w-3 mr-1" /> Manage
                      </Button>
                    </div>
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
