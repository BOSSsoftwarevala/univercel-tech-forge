import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  getFactorySystemStatus,
  listFactoryProductAccess,
  listFactoryProductModules,
  listFactoryProducts,
  updateFactoryProduct,
  updateFactoryProductAccess,
  type FactoryModule,
  type FactoryProduct,
  type FactoryProductAccess,
  type FactorySystemStatus,
} from '@/lib/api/vala-factory';
import {
  Shield, Eye, Copy, Download, Edit3, UserCheck, Globe2,
  Save, Users, Building2, MapPin, Activity
} from 'lucide-react';

interface PMAccessControlProps {
  permissionType: string;
}

const roleCatalog = [
  { id: 'boss_owner', name: 'Boss Owner', level: 1 },
  { id: 'ceo', name: 'CEO', level: 2 },
  { id: 'product_manager', name: 'Product Manager', level: 3 },
  { id: 'developer', name: 'Developer', level: 4 },
  { id: 'franchise_manager', name: 'Franchise Manager', level: 5 },
  { id: 'reseller', name: 'Reseller', level: 6 },
  { id: 'customer', name: 'Customer', level: 7 },
] as const;

type PermissionKey = 'view' | 'copy' | 'download' | 'edit';

type PermissionState = {
  allowed: boolean;
  permissions: Record<PermissionKey, boolean>;
};

type CountryAccessEntry = {
  code: string;
  name: string;
  enabled: boolean;
  franchises: number;
};

const PMAccessControl: React.FC<PMAccessControlProps> = ({ permissionType }) => {
  const [products, setProducts] = useState<FactoryProduct[]>([]);
  const [modules, setModules] = useState<FactoryModule[]>([]);
  const [accessItems, setAccessItems] = useState<FactoryProductAccess[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [permissionState, setPermissionState] = useState<Record<string, PermissionState>>({});
  const [countries, setCountries] = useState<CountryAccessEntry[]>([]);
  const [countryDraft, setCountryDraft] = useState({ code: '', name: '', franchises: '0' });
  const [systemStatus, setSystemStatus] = useState<FactorySystemStatus | null>(null);
  const [saving, setSaving] = useState(false);

  const permissionKey = useMemo<PermissionKey>(() => {
    if (permissionType === 'copy-permission') return 'copy';
    if (permissionType === 'download-permission') return 'download';
    if (permissionType === 'edit-permission') return 'edit';
    return 'view';
  }, [permissionType]);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) || null,
    [products, selectedProductId],
  );

  const selectedModule = useMemo(
    () => modules.find((module) => module.id === selectedModuleId) || null,
    [modules, selectedModuleId],
  );

  const syncPermissions = (items: FactoryProductAccess[], moduleId: string) => {
    const nextState: Record<string, PermissionState> = {};
    roleCatalog.forEach((role) => {
      const existing = items.find((item) => item.role === role.id && item.module_id === moduleId);
      nextState[role.id] = {
        allowed: existing?.allowed ?? false,
        permissions: {
          view: Boolean(existing?.permissions?.view),
          copy: Boolean(existing?.permissions?.copy),
          download: Boolean(existing?.permissions?.download),
          edit: Boolean(existing?.permissions?.edit),
        },
      };
    });
    setPermissionState(nextState);
  };

  const load = async (nextProductId?: string, nextModuleId?: string) => {
    try {
      const productResponse = await listFactoryProducts();
      const productItems = productResponse.data.items || [];
      setProducts(productItems);

      const resolvedProductId = nextProductId || selectedProductId || productItems[0]?.id || '';
      if (!resolvedProductId) {
        setModules([]);
        setAccessItems([]);
        setCountries([]);
        setSystemStatus(null);
        setPermissionState({});
        return;
      }

      setSelectedProductId(resolvedProductId);

      const selected = productItems.find((product) => product.id === resolvedProductId) || null;
      const storedCountries = Array.isArray(selected?.product_config?.country_access)
        ? selected.product_config.country_access as CountryAccessEntry[]
        : [];
      setCountries(storedCountries);

      const [moduleResponse, accessResponse, statusResponse] = await Promise.all([
        listFactoryProductModules(resolvedProductId),
        listFactoryProductAccess(resolvedProductId),
        getFactorySystemStatus(resolvedProductId),
      ]);

      const moduleItems = moduleResponse.data.items || [];
      const resolvedModuleId = nextModuleId || selectedModuleId || moduleItems[0]?.id || '';
      setModules(moduleItems);
      setSelectedModuleId(resolvedModuleId);
      setAccessItems(accessResponse.data.items || []);
      setSystemStatus(statusResponse.data);
      if (resolvedModuleId) syncPermissions(accessResponse.data.items || [], resolvedModuleId);
    } catch (error) {
      console.error('Failed to load access control', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load access control');
    }
  };

  useEffect(() => {
    void load();
  }, [permissionType]);

  const getTitle = () => {
    switch (permissionType) {
      case 'view-permission': return 'View Permission';
      case 'copy-permission': return 'Copy Permission';
      case 'download-permission': return 'Download Permission';
      case 'edit-permission': return 'Edit Permission';
      case 'role-visibility': return 'Role Visibility';
      case 'country-control': return 'Country/Franchise Control';
      default: return 'Access Control';
    }
  };

  const getIcon = () => {
    switch (permissionType) {
      case 'view-permission': return Eye;
      case 'copy-permission': return Copy;
      case 'download-permission': return Download;
      case 'edit-permission': return Edit3;
      case 'role-visibility': return UserCheck;
      case 'country-control': return Globe2;
      default: return Shield;
    }
  };

  const handlePermissionToggle = (roleId: string) => {
    setPermissionState((current) => {
      const existing = current[roleId] || { allowed: false, permissions: { view: false, copy: false, download: false, edit: false } };
      const nextPermissions = { ...existing.permissions };
      let nextAllowed = existing.allowed;
      if (permissionType === 'role-visibility') {
        nextAllowed = !existing.allowed;
      } else {
        nextPermissions[permissionKey] = !existing.permissions[permissionKey];
        nextAllowed = Object.values(nextPermissions).some(Boolean);
      }
      return {
        ...current,
        [roleId]: {
          allowed: nextAllowed,
          permissions: nextPermissions,
        },
      };
    });
  };

  const handleCountryToggle = (countryCode: string) => {
    setCountries((current) => current.map((country) => (
      country.code === countryCode ? { ...country, enabled: !country.enabled } : country
    )));
  };

  const handleSavePermissions = async () => {
    if (!selectedProductId || !selectedModuleId) {
      toast.error('Select a product and module first');
      return;
    }
    setSaving(true);
    try {
      for (const role of roleCatalog) {
        const current = permissionState[role.id] || { allowed: false, permissions: { view: false, copy: false, download: false, edit: false } };
        await updateFactoryProductAccess(selectedProductId, {
          module_id: selectedModuleId,
          role: role.id,
          allowed: current.allowed,
          permissions: current.permissions,
        });
      }
      toast.success('Permissions saved');
      await load(selectedProductId, selectedModuleId);
    } catch (error) {
      console.error('Failed to save permissions', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCountry = () => {
    if (!countryDraft.code.trim() || !countryDraft.name.trim()) {
      toast.error('Country code and name are required');
      return;
    }
    const code = countryDraft.code.trim().toUpperCase();
    if (countries.some((country) => country.code === code)) {
      toast.error('Country already exists');
      return;
    }
    setCountries((current) => [...current, {
      code,
      name: countryDraft.name.trim(),
      enabled: true,
      franchises: Number(countryDraft.franchises) || 0,
    }]);
    setCountryDraft({ code: '', name: '', franchises: '0' });
  };

  const handleSaveCountries = async () => {
    if (!selectedProduct) {
      toast.error('Select a product first');
      return;
    }
    setSaving(true);
    try {
      await updateFactoryProduct(selectedProduct.id, {
        product_config: {
          ...selectedProduct.product_config,
          country_access: countries,
        },
      });
      toast.success('Country control saved');
      await load(selectedProduct.id, selectedModuleId);
    } catch (error) {
      console.error('Failed to save country control', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save country control');
    } finally {
      setSaving(false);
    }
  };

  const Icon = getIcon();

  if (permissionType === 'country-control') {
    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Globe2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{getTitle()}</h1>
              <p className="text-sm text-muted-foreground">
                Manage country and franchise access
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select value={selectedProductId} onChange={(event) => void load(event.target.value, selectedModuleId)} className="rounded-md border bg-background px-3 py-2 text-sm">
              {products.map((product) => <option key={product.id} value={product.id}>{product.product_name}</option>)}
            </select>
            <Button onClick={() => void handleSaveCountries()} className="gap-2" disabled={saving || !selectedProductId}>
            <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </motion.div>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><Building2 className="w-4 h-4" /> Add Country Access</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <Input value={countryDraft.code} onChange={(event) => setCountryDraft((current) => ({ ...current, code: event.target.value }))} placeholder="Code" />
            <Input value={countryDraft.name} onChange={(event) => setCountryDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Country name" />
            <Input type="number" value={countryDraft.franchises} onChange={(event) => setCountryDraft((current) => ({ ...current, franchises: event.target.value }))} placeholder="Franchises" />
            <Button onClick={handleAddCountry}>Add Country</Button>
          </CardContent>
        </Card>

        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countries.map((country, index) => (
              <motion.div
                key={country.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`bg-card/50 border-border/50 hover:border-emerald-500/30 transition-all ${!country.enabled && 'opacity-60'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/30">
                          <MapPin className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">{country.name}</h3>
                          <p className="text-xs text-muted-foreground">{country.code}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={country.enabled}
                        onCheckedChange={() => handleCountryToggle(country.code)}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{country.franchises} Franchises</span>
                      </div>
                      <Badge variant={country.enabled ? 'default' : 'secondary'}>
                        {country.enabled ? 'Active' : 'Disabled'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{getTitle()}</h1>
            <p className="text-sm text-muted-foreground">
              Configure {permissionType.replace('-', ' ')} for each role
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedProductId} onChange={(event) => void load(event.target.value, selectedModuleId)} className="rounded-md border bg-background px-3 py-2 text-sm">
            {products.map((product) => <option key={product.id} value={product.id}>{product.product_name}</option>)}
          </select>
          <select value={selectedModuleId} onChange={(event) => { setSelectedModuleId(event.target.value); syncPermissions(accessItems, event.target.value); }} className="rounded-md border bg-background px-3 py-2 text-sm">
            {modules.map((module) => <option key={module.id} value={module.id}>{module.module_name}</option>)}
          </select>
          <Button onClick={() => void handleSavePermissions()} className="gap-2" disabled={saving || !selectedProductId || !selectedModuleId}>
          <Save className="w-4 h-4" /> Save Changes
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4" /> Role Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-3">
                {roleCatalog.map((role, index) => {
                  const current = permissionState[role.id] || { allowed: false, permissions: { view: false, copy: false, download: false, edit: false } };
                  const checked = permissionType === 'role-visibility' ? current.allowed : current.permissions[permissionKey];
                  return (
                    <motion.div
                      key={role.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          L{role.level}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{role.name}</p>
                          <p className="text-xs text-muted-foreground">{role.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Switch checked={checked} onCheckedChange={() => handlePermissionToggle(role.id)} />
                        <Badge variant={checked ? 'default' : 'secondary'}>
                          {checked ? 'Allowed' : 'Denied'}
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm">Selected Module</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Product</p>
                <p className="font-medium">{selectedProduct?.product_name || 'No product selected'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Module</p>
                <p className="font-medium">{selectedModule?.module_name || 'No module selected'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge variant="outline">{selectedModule?.status || 'n/a'}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2"><Activity className="w-4 h-4" /> System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Health</span>
                <Badge variant="outline">{systemStatus?.health || 'unknown'}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Version</span>
                <span>{systemStatus?.systemVersion || 'n/a'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Errors</span>
                <span>{systemStatus?.errors ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Latest Build</span>
                <span>{systemStatus?.latestBuild?.status || 'n/a'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PMAccessControl;
