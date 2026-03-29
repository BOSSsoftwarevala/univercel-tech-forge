import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { disableFactoryProductModule, enableFactoryProductModule, listFactoryProductModules, listFactoryProducts, lockFactoryProductModule, type FactoryModule, type FactoryProduct } from '@/lib/api/vala-factory';
import {
  Cpu, Lock, Eye, Edit3, History
} from 'lucide-react';

interface PMModuleManagementProps {
  moduleType: string;
}

const PMModuleManagement: React.FC<PMModuleManagementProps> = ({ moduleType }) => {
  const [products, setProducts] = useState<FactoryProduct[]>([]);
  const [modules, setModules] = useState<FactoryModule[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');

  const statusFilter = useMemo<'core' | 'optional' | 'role_based' | 'locked' | 'disabled' | undefined>(() => {
    if (moduleType === 'core-modules') return 'core';
    if (moduleType === 'optional-modules') return 'optional';
    if (moduleType === 'role-modules') return 'role_based';
    if (moduleType === 'locked-modules') return 'locked';
    if (moduleType === 'disabled-modules') return 'disabled';
    return undefined;
  }, [moduleType]);

  const load = async (productId?: string) => {
    try {
      const productResponse = await listFactoryProducts();
      const productItems = productResponse.data.items || [];
      setProducts(productItems);
      const nextProductId = productId || selectedProductId || productItems[0]?.id || '';
      if (!nextProductId) {
        setModules([]);
        return;
      }
      setSelectedProductId(nextProductId);
      const moduleResponse = await listFactoryProductModules(nextProductId, statusFilter);
      setModules(moduleResponse.data.items || []);
    } catch (error) {
      console.error('Failed to load modules', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load modules');
    }
  };

  useEffect(() => {
    void load();
  }, [moduleType]);

  const getTitle = () => {
    switch (moduleType) {
      case 'core-modules': return 'Core Modules';
      case 'optional-modules': return 'Optional Modules';
      case 'role-modules': return 'Role-Based Modules';
      case 'locked-modules': return 'Locked Modules';
      case 'disabled-modules': return 'Disabled Modules';
      default: return 'Module Management';
    }
  };

  const mutateModule = async (moduleId: string, action: 'enable' | 'disable' | 'lock') => {
    if (!selectedProductId) {
      toast.error('Select a product first');
      return;
    }
    try {
      if (action === 'enable') await enableFactoryProductModule(selectedProductId, moduleId);
      if (action === 'disable') await disableFactoryProductModule(selectedProductId, moduleId);
      if (action === 'lock') await lockFactoryProductModule(selectedProductId, moduleId);
      toast.success(`Module ${action}d`);
      await load(selectedProductId);
    } catch (error) {
      console.error('Failed to update module', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update module');
    }
  };

  const filteredModules = modules;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{getTitle()}</h1>
            <p className="text-sm text-muted-foreground">
              Manage system modules and their configurations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedProductId} onChange={(event) => void load(event.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">
            {products.map((product) => <option key={product.id} value={product.id}>{product.product_name}</option>)}
          </select>
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
          {filteredModules.length} Modules
          </Badge>
        </div>
      </motion.div>

      {/* Module Grid */}
      <ScrollArea className="h-[calc(100vh-14rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-card/50 border-border/50 hover:border-cyan-500/30 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{module.module_name}</CardTitle>
                    <Badge 
                      variant="outline" 
                          className={module.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }
                    >
                      {module.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{module.module_key}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Module Info */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-[10px]">
                      {module.type.toUpperCase()}
                    </Badge>
                      {(module as FactoryModule & { is_locked?: boolean }).is_locked && (
                      <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/30">
                        <Lock className="w-2.5 h-2.5 mr-1" /> Locked
                      </Badge>
                    )}
                    {module.module_type === 'role_based' && (
                      <Badge variant="outline" className="text-[10px] bg-violet-500/10 text-violet-400 border-violet-500/30">
                        <Lock className="w-2.5 h-2.5 mr-1" /> Role
                      </Badge>
                    )}
                  </div>

                  {/* Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <Switch checked={module.status === 'active'} onCheckedChange={() => void mutateModule(module.id, module.status === 'active' ? 'disable' : 'enable')} disabled={Boolean((module as FactoryModule & { is_locked?: boolean }).is_locked)} />
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-4 gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 text-[10px] flex-col gap-0.5"
                      onClick={() => toast.info(module.module_name)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 text-[10px] flex-col gap-0.5"
                      onClick={() => toast.info(`Module config source: ${module.source}`)}
                      disabled={Boolean((module as FactoryModule & { is_locked?: boolean }).is_locked)}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 text-[10px] flex-col gap-0.5"
                      onClick={() => void mutateModule(module.id, 'lock')}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Lock
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 text-[10px] flex-col gap-0.5"
                      onClick={() => toast.info(`Approval: ${(module as FactoryModule & { approval_status?: string }).approval_status || 'approved'}`)}
                    >
                      <History className="w-3.5 h-3.5" />
                      History
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

export default PMModuleManagement;
