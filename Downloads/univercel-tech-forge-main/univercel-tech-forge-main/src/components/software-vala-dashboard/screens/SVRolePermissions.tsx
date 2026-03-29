import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield, Users, Brain, MessageSquare, Presentation,
  Smartphone, CreditCard, FileText, Code, Settings,
  Lock, UserCog, Bot, Route, Key, BookOpen, Eye,
  Search, Check, X, ChevronRight, Info
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Types
type PermissionAction = 'read' | 'create' | 'update' | 'delete' | 'approve';

interface RolePermissions {
  [module: string]: PermissionAction[];
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  priority: number;
  isSystem: boolean;
  permissions: RolePermissions;
  color: string;
  icon: React.ReactNode;
}

// Module definitions
const modules = [
  { id: 'users', name: 'Users', icon: Users, category: 'Core' },
  { id: 'roles', name: 'Roles', icon: UserCog, category: 'Core' },
  { id: 'ai_models', name: 'AI Models', icon: Brain, category: 'AI' },
  { id: 'prompts', name: 'Prompts', icon: Code, category: 'AI' },
  { id: 'routing', name: 'Routing', icon: Route, category: 'AI' },
  { id: 'security', name: 'Security', icon: Shield, category: 'System' },
  { id: 'billing', name: 'Billing', icon: CreditCard, category: 'System' },
  { id: 'android', name: 'Android', icon: Smartphone, category: 'Platform' },
  { id: 'logs', name: 'Logs', icon: FileText, category: 'System' },
  { id: 'audit', name: 'Audit', icon: FileText, category: 'System' },
  { id: 'chatbots', name: 'Chatbots', icon: Bot, category: 'Support' },
  { id: 'live_chat', name: 'Live Chat', icon: MessageSquare, category: 'Support' },
  { id: 'knowledge_base', name: 'Knowledge Base', icon: BookOpen, category: 'Support' },
  { id: 'demos', name: 'Demos', icon: Presentation, category: 'Demo' },
  { id: 'leads', name: 'Leads', icon: Users, category: 'Demo' },
  { id: 'api_keys', name: 'API Keys', icon: Key, category: 'Developer' },
  { id: 'sdk', name: 'SDK', icon: Code, category: 'Developer' },
  { id: 'dashboards', name: 'Dashboards', icon: Eye, category: 'Analytics' },
  { id: 'reports', name: 'Reports', icon: FileText, category: 'Analytics' },
  { id: 'settings', name: 'Settings', icon: Settings, category: 'System' },
];

const actions: PermissionAction[] = ['read', 'create', 'update', 'delete', 'approve'];

// Role definitions based on wireframe
const roles: Role[] = [
  {
    id: 'super_admin',
    name: 'super_admin',
    displayName: 'Super Admin',
    description: 'Full system access with billing, compliance, and all settings control',
    priority: 100,
    isSystem: true,
    color: 'bg-red-500',
    icon: <Shield className="h-4 w-4" />,
    permissions: Object.fromEntries(modules.map(m => [m.id, ['read', 'create', 'update', 'delete', 'approve'] as PermissionAction[]]))
  },
  {
    id: 'platform_admin',
    name: 'platform_admin',
    displayName: 'Platform Admin',
    description: 'Platform operations without billing access',
    priority: 90,
    isSystem: true,
    color: 'bg-orange-500',
    icon: <UserCog className="h-4 w-4" />,
    permissions: {
      ai_models: ['read', 'create', 'update'],
      prompts: ['read', 'create', 'update'],
      routing: ['read', 'create', 'update'],
      chatbots: ['read', 'create', 'update'],
      demos: ['read', 'create', 'update'],
      logs: ['read'],
      dashboards: ['read'],
      reports: ['read'],
      android: ['read', 'create', 'update'],
    }
  },
  {
    id: 'ai_admin',
    name: 'ai_admin',
    displayName: 'AI Admin',
    description: 'AI-specific control for models, prompts, and evaluation',
    priority: 80,
    isSystem: true,
    color: 'bg-purple-500',
    icon: <Brain className="h-4 w-4" />,
    permissions: {
      ai_models: ['read', 'create', 'update', 'approve'],
      prompts: ['read', 'create', 'update', 'delete'],
      routing: ['read', 'create', 'update'],
      dashboards: ['read'],
      logs: ['read'],
    }
  },
  {
    id: 'support_manager',
    name: 'support_manager',
    displayName: 'Support Manager',
    description: 'Support operations and chatbot management',
    priority: 70,
    isSystem: true,
    color: 'bg-blue-500',
    icon: <Bot className="h-4 w-4" />,
    permissions: {
      chatbots: ['read', 'create', 'update', 'delete'],
      live_chat: ['read', 'create', 'update'],
      knowledge_base: ['read', 'create', 'update', 'delete'],
      dashboards: ['read'],
      reports: ['read'],
    }
  },
  {
    id: 'demo_manager',
    name: 'demo_manager',
    displayName: 'Demo Manager',
    description: 'Product demo and lead management',
    priority: 60,
    isSystem: true,
    color: 'bg-green-500',
    icon: <Presentation className="h-4 w-4" />,
    permissions: {
      demos: ['read', 'create', 'update', 'delete'],
      leads: ['read', 'create', 'update', 'delete'],
      dashboards: ['read'],
      reports: ['read'],
    }
  },
  {
    id: 'developer',
    name: 'developer',
    displayName: 'Developer',
    description: 'Technical API and SDK access',
    priority: 50,
    isSystem: true,
    color: 'bg-cyan-500',
    icon: <Code className="h-4 w-4" />,
    permissions: {
      api_keys: ['read', 'create', 'update', 'delete'],
      sdk: ['read'],
      logs: ['read'],
      ai_models: ['read'],
      dashboards: ['read'],
    }
  },
  {
    id: 'client_admin',
    name: 'client_admin',
    displayName: 'Client Admin',
    description: 'Client-level feature control within allowed scope',
    priority: 40,
    isSystem: true,
    color: 'bg-amber-500',
    icon: <Users className="h-4 w-4" />,
    permissions: {
      dashboards: ['read'],
      reports: ['read'],
      settings: ['read', 'update'],
      logs: ['read'],
    }
  },
  {
    id: 'viewer',
    name: 'viewer',
    displayName: 'Viewer',
    description: 'Read-only access to dashboards and reports',
    priority: 10,
    isSystem: true,
    color: 'bg-slate-500',
    icon: <Eye className="h-4 w-4" />,
    permissions: {
      dashboards: ['read'],
      reports: ['read'],
    }
  },
];

const actionColors: Record<PermissionAction, string> = {
  read: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  create: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  update: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  delete: 'bg-red-500/20 text-red-400 border-red-500/30',
  approve: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

// Role Card Component
const RoleCard = ({ role, onClick, isSelected }: { role: Role; onClick: () => void; isSelected: boolean }) => {
  const permissionCount = Object.values(role.permissions).flat().length;
  const moduleCount = Object.keys(role.permissions).length;

  return (
    <Card 
      className={`cursor-pointer transition-all hover:border-primary/50 ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border/50'}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg ${role.color} flex items-center justify-center text-white`}>
            {role.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">{role.displayName}</h3>
              {role.isSystem && (
                <Badge variant="outline" className="text-[10px] px-1">System</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{role.description}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-muted-foreground">
                {moduleCount} modules
              </span>
              <span className="text-xs text-muted-foreground">
                {permissionCount} permissions
              </span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
};

// Permission Matrix Component
const PermissionMatrix = ({ selectedRole }: { selectedRole: Role | null }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredModules = modules.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedModules = filteredModules.reduce((acc, module) => {
    if (!acc[module.category]) acc[module.category] = [];
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, typeof modules>);

  if (!selectedRole) {
    return (
      <Card className="border-border/50 bg-card/50 h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <Lock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-medium text-muted-foreground">Select a Role</h3>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Choose a role to view and manage its permissions
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${selectedRole.color} flex items-center justify-center text-white`}>
              {selectedRole.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{selectedRole.displayName}</CardTitle>
              <CardDescription>{selectedRole.description}</CardDescription>
            </div>
          </div>
          <Badge variant="outline">Priority: {selectedRole.priority}</Badge>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search modules..."
            className="pl-9 bg-background/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {/* Action Legend */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {actions.map(action => (
            <Badge key={action} variant="outline" className={`${actionColors[action]} text-xs capitalize`}>
              {action}
            </Badge>
          ))}
        </div>

        <ScrollArea className="h-[calc(100vh-450px)]">
          <Accordion type="multiple" defaultValue={Object.keys(groupedModules)} className="space-y-2">
            {Object.entries(groupedModules).map(([category, categoryModules]) => (
              <AccordionItem key={category} value={category} className="border rounded-lg px-3">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <span className="text-sm font-medium">{category}</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {categoryModules.length}
                  </Badge>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pb-3">
                    {categoryModules.map(module => {
                      const Icon = module.icon;
                      const modulePerms = selectedRole.permissions[module.id] || [];
                      
                      return (
                        <div key={module.id} className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
                          <div className="flex items-center gap-2 min-w-[140px]">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{module.name}</span>
                          </div>
                          <div className="flex items-center gap-1 flex-1">
                            {actions.map(action => {
                              const hasPermission = modulePerms.includes(action);
                              return (
                                <TooltipProvider key={action}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                                        hasPermission 
                                          ? actionColors[action] 
                                          : 'bg-muted/30 text-muted-foreground/30'
                                      }`}>
                                        {hasPermission ? (
                                          <Check className="h-3.5 w-3.5" />
                                        ) : (
                                          <X className="h-3.5 w-3.5" />
                                        )}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="capitalize">{action}: {hasPermission ? 'Allowed' : 'Denied'}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Comparison View Component
const ComparisonView = () => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['super_admin', 'platform_admin']);

  const toggleRole = (roleId: string) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter(r => r !== roleId));
    } else if (selectedRoles.length < 4) {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const selectedRoleData = roles.filter(r => selectedRoles.includes(r.id));

  return (
    <div className="space-y-4">
      {/* Role Selection */}
      <div className="flex flex-wrap gap-2">
        {roles.map(role => (
          <Button
            key={role.id}
            variant={selectedRoles.includes(role.id) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleRole(role.id)}
            className="gap-2"
          >
            {role.icon}
            {role.displayName}
          </Button>
        ))}
      </div>

      {/* Comparison Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-350px)]">
            <table className="w-full">
              <thead className="sticky top-0 bg-card z-10">
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium">Module / Action</th>
                  {selectedRoleData.map(role => (
                    <th key={role.id} className="text-center p-3 min-w-[100px]">
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-lg ${role.color} flex items-center justify-center text-white`}>
                          {role.icon}
                        </div>
                        <span className="text-xs font-medium">{role.displayName}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map(module => (
                  <tr key={module.id} className="border-b hover:bg-muted/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <module.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{module.name}</span>
                      </div>
                    </td>
                    {selectedRoleData.map(role => {
                      const perms = role.permissions[module.id] || [];
                      return (
                        <td key={role.id} className="p-3 text-center">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {perms.length > 0 ? (
                              perms.map(action => (
                                <Badge 
                                  key={action} 
                                  variant="outline" 
                                  className={`${actionColors[action]} text-[10px] px-1`}
                                >
                                  {action.charAt(0).toUpperCase()}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground/50 text-xs">—</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Component
export const SVRolePermissions = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoles = roles.filter(r =>
    r.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Role Permissions</h1>
          <p className="text-muted-foreground text-sm">Manage role-based access control for the platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Info className="h-3 w-3" />
            {roles.length} Roles
          </Badge>
          <Badge variant="outline" className="gap-1">
            {modules.length} Modules
          </Badge>
          <Badge variant="outline" className="gap-1">
            {actions.length} Actions
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {roles.slice(0, 4).map(role => (
          <Card key={role.id} className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${role.color} flex items-center justify-center text-white`}>
                  {role.icon}
                </div>
                <div>
                  <div className="font-semibold text-sm">{role.displayName}</div>
                  <div className="text-xs text-muted-foreground">
                    {Object.values(role.permissions).flat().length} permissions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="matrix">Permission Matrix</TabsTrigger>
          <TabsTrigger value="compare">Compare Roles</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Role List */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roles..."
                  className="pl-9 bg-background/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="space-y-2 pr-2">
                  {filteredRoles.map(role => (
                    <RoleCard
                      key={role.id}
                      role={role}
                      onClick={() => setSelectedRole(role)}
                      isSelected={selectedRole?.id === role.id}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Permission Matrix */}
            <div className="lg:col-span-2">
              <PermissionMatrix selectedRole={selectedRole} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="compare">
          <ComparisonView />
        </TabsContent>

        <TabsContent value="audit">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Permission Audit Log</CardTitle>
              <CardDescription>Track all permission checks and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { user: 'admin@softwarevala.com', action: 'Granted ai_admin role', time: '2 minutes ago', type: 'grant' },
                  { user: 'dev@softwarevala.com', action: 'Accessed API Keys module', time: '5 minutes ago', type: 'access' },
                  { user: 'support@softwarevala.com', action: 'Updated chatbot settings', time: '10 minutes ago', type: 'update' },
                  { user: 'demo@softwarevala.com', action: 'Created new demo', time: '15 minutes ago', type: 'create' },
                  { user: 'viewer@softwarevala.com', action: 'Access being configured: billing.read', time: '20 minutes ago', type: 'config' },
                ].map((log, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                    <div className={`w-2 h-2 rounded-full ${
                      log.type === 'config' ? 'bg-primary' :
                      log.type === 'grant' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
