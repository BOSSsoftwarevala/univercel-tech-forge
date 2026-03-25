import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Library, Monitor, Key, ExternalLink, Loader2, Package } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { marketplaceEnterpriseService } from '@/services/marketplaceEnterpriseService';
import { toast } from 'sonner';

export function MMLibraryScreen() {
  const { user } = useAuth();
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadLicenses = async (userId?: string) => {
      if (!userId) {
        if (mounted) {
          setLicenses([]);
          setLoading(false);
        }
        return;
      }

      if (mounted) setLoading(true);

      try {
        const res = await marketplaceEnterpriseService.getUserLicenses(userId);

        // Debug the raw response so you can see shape in console
        console.debug('[MMLibraryScreen] getUserLicenses response:', res);

        // Support multiple service shapes: array or { data, error }
        const error = res?.error ?? null;
        const data = Array.isArray(res) ? res : res?.data ?? [];

        if (error) {
          console.error('[MMLibraryScreen] Failed to load licenses:', error);
          toast.error('Failed to load licenses: ' + (error?.message ?? 'server error'));
          if (mounted) setLicenses([]);
        } else {
          if (mounted) setLicenses(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('[MMLibraryScreen] Unexpected error loading licenses:', err);
        toast.error('Failed to load licenses (unexpected). Check console for details.');
        if (mounted) setLicenses([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadLicenses(user?.id);

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const activeCount = useMemo(() => licenses.filter(l => (l?.status ?? '') === 'active').length, [licenses]);
  const expiredCount = useMemo(() => licenses.filter(l => (l?.status ?? '') === 'expired').length, [licenses]);

  const formatDate = (d?: string | null) => {
    try {
      return d ? new Date(d).toLocaleDateString() : '';
    } catch {
      return '';
    }
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
            <p className="text-3xl font-bold text-emerald-400">{activeCount}</p>
            <p className="text-xs text-emerald-400">Active Licenses</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-400">{expiredCount}</p>
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
            <Card key={license?.id ?? `${license?.product_id}-${Math.random()}`} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-900/40 to-slate-800">
                    <Monitor className="h-8 w-8 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{license?.product_id ?? 'Unknown Product'}</h3>
                      <Badge className={
                        (license?.status ?? '') === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }>
                        {license?.status ?? 'unknown'}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Key className="h-3 w-3" />
                        <span className="font-mono">{license?.license_key ?? '—'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Type: {license?.license_type ?? '—'}</span>
                        {license?.expires_at && (
                          <span>Expires: {formatDate(license.expires_at)}</span>
                        )}
                        {license?.max_installations && (
                          <span>Installs: {license?.current_installations ?? 0}/{license.max_installations}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="border-slate-600 text-xs" onClick={() => {
                        // safe, client-side access: open in new tab
                        const url = license?.access_url ?? license?.product_url;
                        if (url) window.open(/^https?:\/\//i.test(url) ? url : `https://${String(url).replace(/^\/+/, '')}`, '_blank', 'noopener,noreferrer');
                        else toast('No access URL available', { type: 'error' } as any);
                      }}>
                        <ExternalLink className="h-3 w-3 mr-1" /> Access
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-xs" onClick={() => {
                        // placeholder manage action — keeping safe (non-breaking)
                        toast('Manage action not implemented in demo', { type: 'info' } as any);
                      }}>
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
