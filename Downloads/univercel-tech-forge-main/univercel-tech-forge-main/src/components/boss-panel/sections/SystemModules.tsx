import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Boxes,
  Users,
  Package,
  Presentation,
  CreditCard,
  Brain,
  Server,
  Shield,
  Power,
  Wrench,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useSystemModules } from '@/hooks/useSystemModules';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SystemModule {
  id: string;
  name: string;
  icon: React.ElementType;
  status: 'active' | 'maintenance' | 'disabled';
  health: number;
  lastUpdated: string;
  dependencies: string[];
}

const modules: SystemModule[] = [
  { id: 'leads', name: 'Leads', icon: Users, status: 'active', health: 98, lastUpdated: '2 min ago', dependencies: [] },
  { id: 'products', name: 'Products', icon: Package, status: 'active', health: 100, lastUpdated: '5 min ago', dependencies: [] },
  { id: 'demos', name: 'Demos', icon: Presentation, status: 'active', health: 95, lastUpdated: '10 min ago', dependencies: ['products'] },
  { id: 'billing', name: 'Billing', icon: CreditCard, status: 'active', health: 100, lastUpdated: '1 min ago', dependencies: [] },
  { id: 'ai-engine', name: 'AI Engine', icon: Brain, status: 'active', health: 87, lastUpdated: '30 sec ago', dependencies: [] },
  { id: 'servers', name: 'Servers', icon: Server, status: 'maintenance', health: 75, lastUpdated: '1 hour ago', dependencies: [] },
  { id: 'compliance', name: 'Compliance', icon: Shield, status: 'active', health: 100, lastUpdated: '15 min ago', dependencies: [] },
];

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  maintenance: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  disabled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const getHealthColor = (health: number) => {
  if (health >= 90) return 'text-green-400';
  if (health >= 70) return 'text-amber-400';
  return 'text-red-400';
};

export function SystemModules() {
  const { enableModule, disableModule, setMaintenance } = useSystemModules();
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; module: SystemModule | null; action: 'enable' | 'disable' | 'maintenance' }>({
    open: false,
    module: null,
    action: 'enable'
  });

  const handleAction = (module: SystemModule, action: 'enable' | 'disable' | 'maintenance') => {
    setConfirmDialog({ open: true, module, action });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.module) return;
    
    try {
      switch (confirmDialog.action) {
        case 'enable':
          await enableModule(confirmDialog.module.id, confirmDialog.module.name);
          break;
        case 'disable':
          await disableModule(confirmDialog.module.id, confirmDialog.module.name);
          break;
        case 'maintenance':
          await setMaintenance(confirmDialog.module.id, confirmDialog.module.name);
          break;
      }
    } catch (error) {
      console.error('Module action failed:', error);
    }

    const actionMessages = {
      enable: `${confirmDialog.module.name} module has been enabled`,
      disable: `${confirmDialog.module.name} module has been disabled`,
      maintenance: `${confirmDialog.module.name} module is now in maintenance mode`
    };
    toast.success(actionMessages[confirmDialog.action]);
    setConfirmDialog({ open: false, module: null, action: 'enable' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">System Modules</h1>
          <p className="text-white/50 text-sm">Manage and monitor system components</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            {modules.filter(m => m.status === 'active').length} Active
          </Badge>
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            {modules.filter(m => m.status === 'maintenance').length} Maintenance
          </Badge>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-[#12121a] border-white/10 hover:border-white/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusColors[module.status]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{module.name}</h3>
                        <Badge className={`${statusColors[module.status]} border text-[10px] mt-1`}>
                          {module.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <Switch 
                      checked={module.status === 'active'}
                      onCheckedChange={() => handleAction(module, module.status === 'active' ? 'disable' : 'enable')}
                    />
                  </div>

                  {/* Health Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/50">Health</span>
                      <span className={getHealthColor(module.health)}>{module.health}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          module.health >= 90 ? 'bg-green-500' : module.health >= 70 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${module.health}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-white/50 hover:text-white hover:bg-white/10"
                      onClick={() => handleAction(module, 'maintenance')}
                    >
                      <Wrench className="w-4 h-4 mr-1" />
                      Maintenance
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/50 hover:text-white hover:bg-white/10"
                      onClick={() => {
                        console.log(`View activity for module: ${module.name}`);
                      }}
                      title={`View activity for ${module.name}`}
                    >
                      <Activity className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Last Updated */}
                  <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-white/40">
                    Last updated: {module.lastUpdated}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <AlertDialogContent className="bg-[#1a1a2e] border-amber-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Confirm Module Action
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              You are about to {confirmDialog.action} the <strong className="text-white">{confirmDialog.module?.name}</strong> module.
              This action will be logged in the audit trail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={handleConfirmAction}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
