import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { listFactoryProductLicenses, listFactoryProducts, updateFactoryProductLicense, type FactoryLicense, type FactoryProduct } from '@/lib/api/vala-factory';
import {
  Lock, Unlock, Globe2, Key, Timer, ShieldAlert, Shield,
  Eye, Edit3, Copy, AlertTriangle, CheckCircle2, XCircle, Calendar
} from 'lucide-react';

interface PMSecurityLicenseProps {
  securityType: string;
}

const PMSecurityLicense: React.FC<PMSecurityLicenseProps> = ({ securityType }) => {
  const [products, setProducts] = useState<FactoryProduct[]>([]);
  const [licenses, setLicenses] = useState<FactoryLicense[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [domainLock, setDomainLock] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [apiKeyBinding, setApiKeyBinding] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const selectedProduct = useMemo(() => products.find((product) => product.id === selectedProductId) || null, [products, selectedProductId]);

  const load = async (productId?: string) => {
    try {
      const productResponse = await listFactoryProducts();
      const productItems = productResponse.data.items || [];
      setProducts(productItems);
      const nextProductId = productId || selectedProductId || productItems[0]?.id || '';
      if (!nextProductId) {
        setLicenses([]);
        return;
      }
      setSelectedProductId(nextProductId);
      const licenseResponse = await listFactoryProductLicenses(nextProductId);
      setLicenses(licenseResponse.data.items || []);
    } catch (error) {
      console.error('Failed to load licenses', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load licenses');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const getTitle = () => {
    switch (securityType) {
      case 'license-lock': return 'License Lock';
      case 'domain-lock': return 'Domain Lock';
      case 'api-key-binding': return 'API Key Binding';
      case 'expiry-control': return 'Expiry Control';
      case 'abuse-protection': return 'Abuse Protection';
      default: return 'Security & License';
    }
  };

  const getIcon = () => {
    switch (securityType) {
      case 'license-lock': return Lock;
      case 'domain-lock': return Globe2;
      case 'api-key-binding': return Key;
      case 'expiry-control': return Timer;
      case 'abuse-protection': return ShieldAlert;
      default: return Shield;
    }
  };

  const runLicenseAction = async (action: 'generate' | 'lock' | 'update' | 'expire', licenseId?: string) => {
    if (!selectedProductId) {
      toast.error('Select a product first');
      return;
    }
    try {
      const response = await updateFactoryProductLicense(selectedProductId, {
        action,
        license_id: licenseId,
        domain_lock: domainLock || undefined,
        device_id: deviceId || undefined,
        api_key_binding: apiKeyBinding || undefined,
        expires_at: expiresAt || undefined,
      });
      toast.success(`License ${action} completed`);
      setDomainLock(response.data.license.domain_lock || '');
      setExpiresAt(response.data.license.expires_at || '');
      await load(selectedProductId);
    } catch (error) {
      console.error('Failed to update license', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update license');
    }
  };

  const Icon = getIcon();

  if (securityType === 'api-key-binding') {
    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{getTitle()}</h1>
              <p className="text-sm text-muted-foreground">Manage API keys and bindings</p>
            </div>
          </div>
          <Button className="gap-2" onClick={() => void runLicenseAction('generate')}>
            <Key className="w-4 h-4" /> Generate New Key
          </Button>
        </motion.div>

        <div className="grid gap-3 md:grid-cols-4">
          <select value={selectedProductId} onChange={(event) => void load(event.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
            {products.map((product) => <option key={product.id} value={product.id}>{product.product_name}</option>)}
          </select>
          <Input value={apiKeyBinding} onChange={(event) => setApiKeyBinding(event.target.value)} placeholder="Bind API key" />
          <Input value={domainLock} onChange={(event) => setDomainLock(event.target.value)} placeholder="Domain lock" />
          <Input value={deviceId} onChange={(event) => setDeviceId(event.target.value)} placeholder="Device id" />
        </div>

        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="space-y-3">
            {licenses.map((license, index) => (
              <motion.div
                key={license.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-card/50 border-border/50 hover:border-violet-500/30 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-sm">{selectedProduct?.product_name || 'License'}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{license.license_key}</p>
                      </div>
                      <Badge variant={license.status === 'active' ? 'default' : 'secondary'}>
                        {license.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Created: {new Date(license.created_at).toLocaleDateString()}</span>
                      <span>Expiry: {license.expires_at ? new Date(license.expires_at).toLocaleDateString() : 'not set'}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => navigator.clipboard.writeText(license.license_key).then(() => toast.success('License copied'))}>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => {
                        setDomainLock(license.domain_lock || '');
                        setDeviceId((license as FactoryLicense & { device_id?: string }).device_id || '');
                        setApiKeyBinding((license as FactoryLicense & { api_key_binding?: string }).api_key_binding || '');
                        setExpiresAt(license.expires_at || '');
                      }}>
                        <Eye className="w-3.5 h-3.5" /> View
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-red-400" onClick={() => void runLicenseAction('expire', license.id)}>
                        <XCircle className="w-3.5 h-3.5" /> Expire
                      </Button>
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

  if (securityType === 'abuse-protection') {
    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{getTitle()}</h1>
            <p className="text-sm text-muted-foreground">Monitor and resolve abuse alerts</p>
          </div>
        </motion.div>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Abuse protection is enforced through license metadata, rate limits, and automatic lock/expire actions. Use the license controls below to bind domain, device, API key, and expiry.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // License Lock, Domain Lock, Expiry Control views
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">{getTitle()}</h1>
          <p className="text-sm text-muted-foreground">Manage licenses and security</p>
        </div>
      </motion.div>

        <div className="grid gap-3 md:grid-cols-5">
          <select value={selectedProductId} onChange={(event) => void load(event.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
            {products.map((product) => <option key={product.id} value={product.id}>{product.product_name}</option>)}
          </select>
          <Input value={domainLock} onChange={(event) => setDomainLock(event.target.value)} placeholder="Domain lock" />
          <Input value={deviceId} onChange={(event) => setDeviceId(event.target.value)} placeholder="Device binding" />
          <Input value={apiKeyBinding} onChange={(event) => setApiKeyBinding(event.target.value)} placeholder="API key binding" />
          <Input value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} placeholder="Expiry ISO date" />
        </div>

        <div className="flex gap-2">
          <Button onClick={() => void runLicenseAction('generate')} className="gap-2"><Key className="w-4 h-4" /> Generate</Button>
          <Button variant="outline" onClick={() => void runLicenseAction('update')} className="gap-2"><Edit3 className="w-4 h-4" /> Update</Button>
        </div>

        <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-3">
          {licenses.map((license, index) => (
            <motion.div
                key={license.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-card/50 border-border/50 hover:border-amber-500/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${license.locked ? 'bg-amber-500/20' : 'bg-emerald-500/20'}`}>
                        {license.locked ? <Lock className="w-5 h-5 text-amber-400" /> : <Unlock className="w-5 h-5 text-emerald-400" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{selectedProduct?.product_name || 'License'}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{license.license_key}</p>
                      </div>
                    </div>
                    <Badge variant={license.status === 'active' ? 'default' : 'secondary'}>
                      {license.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                    {securityType === 'domain-lock' && (
                      <div>
                        <span className="text-muted-foreground">Domain</span>
                        <p className="font-medium">{license.domain_lock || 'Not bound'}</p>
                      </div>
                    )}
                    {securityType === 'expiry-control' && (
                      <div>
                        <span className="text-muted-foreground">Expires</span>
                        <p className="font-medium">{license.expires_at || 'Not set'}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => {
                      setDomainLock(license.domain_lock || '');
                      setExpiresAt(license.expires_at || '');
                    }}>
                      <Eye className="w-3.5 h-3.5" /> View
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => void runLicenseAction('update', license.id)}>
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => void runLicenseAction('lock', license.id)}>
                      <Lock className="w-3.5 h-3.5" />
                      Lock
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PMSecurityLicense;
