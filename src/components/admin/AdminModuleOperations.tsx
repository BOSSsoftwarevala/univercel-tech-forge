// ==============================================
// Admin Module Operations
// Enable/Disable Non-Core Modules - Pause Demos
// Security Modules LOCKED
// ==============================================

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Boxes, Lock, Play, Pause, AlertTriangle,
  Shield, Eye, MessageSquare, BarChart, Users
} from 'lucide-react';
import { toast } from 'sonner';

interface Module {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'optional' | 'security' | 'demo';
  isEnabled: boolean;
  isLocked: boolean;
  lastToggled: string;
  toggledBy: string;
}

export function AdminModuleOperations() {
  const [modules, setModules] = useState<Module[]>([
    {
      id: 'mod-001',
      name: 'Analytics Dashboard',
      description: 'User behavior and conversion analytics',
      category: 'optional',
      isEnabled: true,
      isLocked: false,
      lastToggled: '2024-01-28 10:00',
      toggledBy: 'AD-****42',
    },
    {
      id: 'mod-002',
      name: 'Live Chat Support',
      description: 'Real-time chat support system',
      category: 'optional',
      isEnabled: true,
      isLocked: false,
      lastToggled: '2024-01-25 14:30',
      toggledBy: 'AD-****18',
    },
    {
      id: 'mod-003',
      name: 'Partner Portal',
      description: 'External partner access portal',
      category: 'optional',
      isEnabled: false,
      isLocked: false,
      lastToggled: '2024-01-20 09:15',
      toggledBy: 'AD-****42',
    },
    {
      id: 'mod-004',
      name: 'Demo Showcase',
      description: 'Product demo display module',
      category: 'demo',
      isEnabled: true,
      isLocked: false,
      lastToggled: '2024-01-15 11:00',
      toggledBy: 'AD-****18',
    },
    {
      id: 'mod-005',
      name: 'Two-Factor Auth',
      description: 'Security authentication module',
      category: 'security',
      isEnabled: true,
      isLocked: true,
      lastToggled: 'System',
      toggledBy: 'System',
    },
    {
      id: 'mod-006',
      name: 'Audit Logging',
      description: 'Compliance audit trail system',
      category: 'security',
      isEnabled: true,
      isLocked: true,
      lastToggled: 'System',
      toggledBy: 'System',
    },
    {
      id: 'mod-007',
      name: 'Fraud Detection',
      description: 'AI-powered fraud prevention',
      category: 'security',
      isEnabled: true,
      isLocked: true,
      lastToggled: 'System',
      toggledBy: 'System',
    },
    {
      id: 'mod-008',
      name: 'Core Authentication',
      description: 'Primary authentication system',
      category: 'core',
      isEnabled: true,
      isLocked: true,
      lastToggled: 'System',
      toggledBy: 'System',
    },
  ]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'optional': return BarChart;
      case 'security': return Shield;
      case 'demo': return Eye;
      case 'core': return Lock;
      default: return Boxes;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'optional': return 'bg-blue-500/20 text-blue-400';
      case 'security': return 'bg-red-500/20 text-red-400';
      case 'demo': return 'bg-purple-500/20 text-purple-400';
      case 'core': return 'bg-green-500/20 text-green-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleToggle = (moduleId: string, currentState: boolean) => {
    const module = modules.find(m => m.id === moduleId);
    
    if (module?.isLocked) {
      toast.error('BLOCKED: Security/Core modules cannot be modified by Admin');
      return;
    }

    setModules(prev => prev.map(m => 
      m.id === moduleId 
        ? { 
            ...m, 
            isEnabled: !currentState,
            lastToggled: new Date().toISOString(),
            toggledBy: 'AD-****XX',
          }
        : m
    ));

    toast.success(`${module?.name} ${!currentState ? 'enabled' : 'disabled'}`);
  };

  const handlePauseDemo = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module?.category !== 'demo') return;

    setModules(prev => prev.map(m => 
      m.id === moduleId 
        ? { ...m, isEnabled: !m.isEnabled }
        : m
    ));

    toast.success(`Demo module ${module?.isEnabled ? 'paused' : 'resumed'}`);
  };

  const groupedModules = {
    optional: modules.filter(m => m.category === 'optional'),
    demo: modules.filter(m => m.category === 'demo'),
    security: modules.filter(m => m.category === 'security'),
    core: modules.filter(m => m.category === 'core'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Boxes className="h-5 w-5 text-primary" />
          Module Operations
        </h2>
        <Badge variant="outline" className="bg-red-500/10 text-red-400">
          <Lock className="h-3 w-3 mr-1" />
          Security Modules Locked
        </Badge>
      </div>

      {/* Warning */}
      <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm text-yellow-400">
            <AlertTriangle className="h-4 w-4" />
            <span>Admin can toggle optional modules and pause demos. Security and core modules are locked.</span>
          </div>
        </CardContent>
      </Card>

      {/* Optional Modules */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart className="h-4 w-4 text-blue-400" />
            Optional Modules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {groupedModules.optional.map(module => (
            <div key={module.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{module.name}</span>
                  <Badge className={getCategoryColor(module.category)}>
                    {module.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{module.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Last toggled: {module.lastToggled} by {module.toggledBy}
                </p>
              </div>
              <Switch
                checked={module.isEnabled}
                onCheckedChange={() => handleToggle(module.id, module.isEnabled)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Demo Modules */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-4 w-4 text-purple-400" />
            Demo Modules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {groupedModules.demo.map(module => (
            <div key={module.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{module.name}</span>
                  <Badge className={module.isEnabled ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                    {module.isEnabled ? 'RUNNING' : 'PAUSED'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{module.description}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePauseDemo(module.id)}
                className="text-xs"
              >
                {module.isEnabled ? (
                  <>
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Resume
                  </>
                )}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security & Core Modules (Locked) */}
      <Card className="bg-card border-border opacity-75">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-400" />
            Security & Core Modules
            <Badge variant="outline" className="bg-red-500/10 text-red-400 text-xs">
              <Lock className="h-3 w-3 mr-1" />
              LOCKED
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...groupedModules.security, ...groupedModules.core].map(module => (
            <div key={module.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">{module.name}</span>
                  <Badge className={getCategoryColor(module.category)}>
                    {module.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{module.description}</p>
              </div>
              <Switch checked={module.isEnabled} disabled className="opacity-50" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
