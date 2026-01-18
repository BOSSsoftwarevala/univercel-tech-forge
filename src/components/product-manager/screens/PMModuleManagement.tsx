import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  Cpu, Lock, Unlock, Eye, Edit3, History, Power, StopCircle,
  ToggleLeft, UserCheck, Shield, CheckCircle2, XCircle, Settings
} from 'lucide-react';

interface PMModuleManagementProps {
  moduleType: string;
}

const mockModules = [
  { id: 'MOD-001', name: 'User Authentication', type: 'core', status: 'active', locked: false, roleRestricted: false },
  { id: 'MOD-002', name: 'Dashboard Analytics', type: 'core', status: 'active', locked: true, roleRestricted: false },
  { id: 'MOD-003', name: 'Report Generator', type: 'optional', status: 'active', locked: false, roleRestricted: true },
  { id: 'MOD-004', name: 'API Integration', type: 'optional', status: 'disabled', locked: false, roleRestricted: false },
  { id: 'MOD-005', name: 'Admin Panel', type: 'role', status: 'active', locked: true, roleRestricted: true },
  { id: 'MOD-006', name: 'Backup System', type: 'core', status: 'active', locked: false, roleRestricted: false },
  { id: 'MOD-007', name: 'Email Notifications', type: 'optional', status: 'disabled', locked: false, roleRestricted: false },
  { id: 'MOD-008', name: 'Multi-Language', type: 'optional', status: 'active', locked: false, roleRestricted: false },
];

const PMModuleManagement: React.FC<PMModuleManagementProps> = ({ moduleType }) => {
  const [modules, setModules] = useState(mockModules);

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

  const getFilteredModules = () => {
    switch (moduleType) {
      case 'core-modules': return modules.filter(m => m.type === 'core');
      case 'optional-modules': return modules.filter(m => m.type === 'optional');
      case 'role-modules': return modules.filter(m => m.roleRestricted);
      case 'locked-modules': return modules.filter(m => m.locked);
      case 'disabled-modules': return modules.filter(m => m.status === 'disabled');
      default: return modules;
    }
  };

  const handleAction = (action: string, moduleName: string) => {
    toast.success(`${action} action triggered`, {
      description: `Module: ${moduleName}`
    });
  };

  const toggleModuleStatus = (moduleId: string) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId 
        ? { ...m, status: m.status === 'active' ? 'disabled' : 'active' }
        : m
    ));
    const module = modules.find(m => m.id === moduleId);
    toast.success(`Module ${module?.status === 'active' ? 'disabled' : 'enabled'}`, {
      description: module?.name
    });
  };

  const toggleLock = (moduleId: string) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId ? { ...m, locked: !m.locked } : m
    ));
    const module = modules.find(m => m.id === moduleId);
    toast.success(`Module ${module?.locked ? 'unlocked' : 'locked'}`, {
      description: module?.name
    });
  };

  const filteredModules = getFilteredModules();

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
        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
          {filteredModules.length} Modules
        </Badge>
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
                    <CardTitle className="text-sm font-medium">{module.name}</CardTitle>
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
                  <p className="text-xs text-muted-foreground">{module.id}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Module Info */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-[10px]">
                      {module.type.toUpperCase()}
                    </Badge>
                    {module.locked && (
                      <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/30">
                        <Lock className="w-2.5 h-2.5 mr-1" /> Locked
                      </Badge>
                    )}
                    {module.roleRestricted && (
                      <Badge variant="outline" className="text-[10px] bg-violet-500/10 text-violet-400 border-violet-500/30">
                        <UserCheck className="w-2.5 h-2.5 mr-1" /> Role
                      </Badge>
                    )}
                  </div>

                  {/* Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <Switch 
                      checked={module.status === 'active'}
                      onCheckedChange={() => toggleModuleStatus(module.id)}
                      disabled={module.locked}
                    />
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-4 gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 text-[10px] flex-col gap-0.5"
                      onClick={() => handleAction('View', module.name)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 text-[10px] flex-col gap-0.5"
                      onClick={() => handleAction('Edit', module.name)}
                      disabled={module.locked}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 text-[10px] flex-col gap-0.5"
                      onClick={() => toggleLock(module.id)}
                    >
                      {module.locked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      {module.locked ? 'Unlock' : 'Lock'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 text-[10px] flex-col gap-0.5"
                      onClick={() => handleAction('History', module.name)}
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
