import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Plus, Edit, Trash2, Check, X, Eye, Lock, 
  Crown, Building2, Code2, HeadphonesIcon, Megaphone, TrendingUp,
  Search, Wallet, UserCog, Settings, CheckCircle2, XCircle,
  Clock, AlertTriangle, Bot, Sparkles, Globe, MapPin, Server,
  FileText, Scale, Briefcase, Monitor, Database, Zap, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { random, generatePerson } from '@/data/mockDataGenerator';

// ============ TYPES ============
interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: any;
  color: string;
  scopeLevel: 'global' | 'continent' | 'country' | 'region' | 'local';
  hierarchyLevel: number;
  isSystemRole: boolean;
  canBeDeleted: boolean;
  userCount: number;
  status: 'active' | 'pending' | 'suspended';
  createdAt: Date;
  createdBy: string;
}

interface Permission {
  id: string;
  code: string;
  name: string;
  description: string;
  module: string;
  isSensitive: boolean;
  requires2FA: boolean;
}

interface RoleApproval {
  id: string;
  roleName: string;
  requestedBy: string;
  requestedByEmail: string;
  requestedAt: Date;
  reason: string;
  permissions: string[];
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  aiRecommendation?: string;
  riskScore: number;
}

// ============ MOCK DATA ============
const systemRoles: Role[] = [
  { id: 'master', name: 'master', displayName: 'Master Admin', description: 'Supreme system control with full access', icon: Crown, color: 'from-red-500 to-rose-600', scopeLevel: 'global', hierarchyLevel: 100, isSystemRole: true, canBeDeleted: false, userCount: 1, status: 'active', createdAt: new Date('2023-01-01'), createdBy: 'System' },
  { id: 'continent_super_admin', name: 'continent_super_admin', displayName: 'Continent Super Admin', description: 'Manages entire continent operations', icon: Globe, color: 'from-violet-500 to-purple-600', scopeLevel: 'continent', hierarchyLevel: 90, isSystemRole: true, canBeDeleted: false, userCount: 7, status: 'active', createdAt: new Date('2023-01-15'), createdBy: 'System' },
  { id: 'country_admin', name: 'country_admin', displayName: 'Country Admin', description: 'Country-level management', icon: MapPin, color: 'from-blue-500 to-indigo-600', scopeLevel: 'country', hierarchyLevel: 80, isSystemRole: true, canBeDeleted: false, userCount: 45, status: 'active', createdAt: new Date('2023-02-01'), createdBy: 'System' },
  { id: 'area_manager', name: 'area_manager', displayName: 'Area Manager', description: 'Regional operations management', icon: MapPin, color: 'from-cyan-500 to-blue-600', scopeLevel: 'region', hierarchyLevel: 70, isSystemRole: true, canBeDeleted: false, userCount: 128, status: 'active', createdAt: new Date('2023-02-15'), createdBy: 'System' },
  { id: 'franchise', name: 'franchise', displayName: 'Franchise Owner', description: 'Franchise operations and reseller management', icon: Building2, color: 'from-emerald-500 to-teal-600', scopeLevel: 'local', hierarchyLevel: 60, isSystemRole: true, canBeDeleted: false, userCount: 342, status: 'active', createdAt: new Date('2023-03-01'), createdBy: 'System' },
  { id: 'reseller', name: 'reseller', displayName: 'Reseller', description: 'Sales and client management', icon: Users, color: 'from-teal-500 to-cyan-600', scopeLevel: 'local', hierarchyLevel: 50, isSystemRole: true, canBeDeleted: false, userCount: 1856, status: 'active', createdAt: new Date('2023-03-15'), createdBy: 'System' },
  { id: 'developer', name: 'developer', displayName: 'Developer', description: 'Task execution and code development', icon: Code2, color: 'from-purple-500 to-violet-600', scopeLevel: 'global', hierarchyLevel: 40, isSystemRole: true, canBeDeleted: false, userCount: 89, status: 'active', createdAt: new Date('2023-04-01'), createdBy: 'System' },
  { id: 'server_manager', name: 'server_manager', displayName: 'Server Manager', description: 'Infrastructure and server operations', icon: Server, color: 'from-zinc-500 to-slate-600', scopeLevel: 'global', hierarchyLevel: 85, isSystemRole: true, canBeDeleted: false, userCount: 12, status: 'active', createdAt: new Date('2023-04-15'), createdBy: 'System' },
  { id: 'hr_manager', name: 'hr_manager', displayName: 'HR Manager', description: 'Human resources and staff management', icon: Briefcase, color: 'from-pink-500 to-rose-600', scopeLevel: 'global', hierarchyLevel: 65, isSystemRole: true, canBeDeleted: false, userCount: 24, status: 'active', createdAt: new Date('2023-05-01'), createdBy: 'System' },
  { id: 'finance_manager', name: 'finance_manager', displayName: 'Finance Manager', description: 'Financial operations and reporting', icon: Wallet, color: 'from-amber-500 to-orange-600', scopeLevel: 'global', hierarchyLevel: 75, isSystemRole: true, canBeDeleted: false, userCount: 18, status: 'active', createdAt: new Date('2023-05-15'), createdBy: 'System' },
  { id: 'marketing_manager', name: 'marketing_manager', displayName: 'Marketing Manager', description: 'Marketing campaigns and promotions', icon: Megaphone, color: 'from-fuchsia-500 to-pink-600', scopeLevel: 'global', hierarchyLevel: 55, isSystemRole: true, canBeDeleted: false, userCount: 32, status: 'active', createdAt: new Date('2023-06-01'), createdBy: 'System' },
  { id: 'influencer', name: 'influencer', displayName: 'Influencer', description: 'Social media promotion and marketing', icon: Megaphone, color: 'from-rose-500 to-red-600', scopeLevel: 'local', hierarchyLevel: 30, isSystemRole: true, canBeDeleted: false, userCount: 567, status: 'active', createdAt: new Date('2023-06-15'), createdBy: 'System' },
  { id: 'support_agent', name: 'support_agent', displayName: 'Support Agent', description: 'Customer support and ticket handling', icon: HeadphonesIcon, color: 'from-orange-500 to-amber-600', scopeLevel: 'global', hierarchyLevel: 35, isSystemRole: true, canBeDeleted: false, userCount: 78, status: 'active', createdAt: new Date('2023-07-01'), createdBy: 'System' },
  { id: 'seo_manager', name: 'seo_manager', displayName: 'SEO Manager', description: 'Search optimization and content strategy', icon: Search, color: 'from-lime-500 to-green-600', scopeLevel: 'global', hierarchyLevel: 45, isSystemRole: true, canBeDeleted: false, userCount: 15, status: 'active', createdAt: new Date('2023-07-15'), createdBy: 'System' },
  { id: 'legal_manager', name: 'legal_manager', displayName: 'Legal Manager', description: 'Compliance and legal operations', icon: Scale, color: 'from-slate-500 to-gray-600', scopeLevel: 'global', hierarchyLevel: 70, isSystemRole: true, canBeDeleted: false, userCount: 8, status: 'active', createdAt: new Date('2023-08-01'), createdBy: 'System' },
  { id: 'prime_user', name: 'prime_user', displayName: 'Prime User', description: 'Premium client with extended access', icon: Zap, color: 'from-yellow-500 to-amber-600', scopeLevel: 'local', hierarchyLevel: 25, isSystemRole: true, canBeDeleted: false, userCount: 2345, status: 'active', createdAt: new Date('2023-08-15'), createdBy: 'System' },
];

const modules = [
  { name: 'Dashboard', icon: Monitor, category: 'Core' },
  { name: 'Users', icon: Users, category: 'Core' },
  { name: 'Franchise', icon: Building2, category: 'Business' },
  { name: 'Reseller', icon: Users, category: 'Business' },
  { name: 'Influencer', icon: Megaphone, category: 'Marketing' },
  { name: 'Developer', icon: Code2, category: 'Operations' },
  { name: 'Tasks', icon: FileText, category: 'Operations' },
  { name: 'Finance', icon: Wallet, category: 'Finance' },
  { name: 'Payouts', icon: Wallet, category: 'Finance' },
  { name: 'Reports', icon: TrendingUp, category: 'Analytics' },
  { name: 'Analytics', icon: TrendingUp, category: 'Analytics' },
  { name: 'Support', icon: HeadphonesIcon, category: 'Support' },
  { name: 'Tickets', icon: FileText, category: 'Support' },
  { name: 'Marketing', icon: Megaphone, category: 'Marketing' },
  { name: 'SEO', icon: Search, category: 'Marketing' },
  { name: 'HR', icon: Briefcase, category: 'HR' },
  { name: 'Legal', icon: Scale, category: 'Legal' },
  { name: 'Compliance', icon: Shield, category: 'Legal' },
  { name: 'Server', icon: Server, category: 'Infrastructure' },
  { name: 'Database', icon: Database, category: 'Infrastructure' },
  { name: 'Audit', icon: FileText, category: 'Security' },
  { name: 'Security', icon: Shield, category: 'Security' },
  { name: 'Settings', icon: Settings, category: 'System' },
  { name: 'Roles', icon: UserCog, category: 'System' },
];

const permissionTypes = ['view', 'create', 'edit', 'delete', 'admin', 'export'] as const;

// Generate permission matrix for all roles
const generatePermissionMatrix = () => {
  const matrix: Record<string, Record<string, Record<string, boolean>>> = {};
  
  systemRoles.forEach(role => {
    matrix[role.id] = {};
    modules.forEach(module => {
      const hasFullAccess = role.hierarchyLevel >= 90;
      const hasEditAccess = role.hierarchyLevel >= 60;
      const hasViewAccess = role.hierarchyLevel >= 20;
      
      matrix[role.id][module.name] = {
        view: hasViewAccess,
        create: hasEditAccess && Math.random() > 0.3,
        edit: hasEditAccess && Math.random() > 0.4,
        delete: hasFullAccess || Math.random() > 0.7,
        admin: hasFullAccess,
        export: hasEditAccess && Math.random() > 0.5,
      };
    });
  });
  
  // Ensure master has all permissions
  modules.forEach(module => {
    matrix['master'][module.name] = { view: true, create: true, edit: true, delete: true, admin: true, export: true };
  });
  
  return matrix;
};

const mockApprovals: RoleApproval[] = [
  {
    id: random.uuid(),
    roleName: 'Regional Auditor',
    requestedBy: generatePerson('asia').fullName,
    requestedByEmail: 'auditor.request@company.com',
    requestedAt: random.date(5),
    reason: 'Need audit access for quarterly compliance review in APAC region',
    permissions: ['Audit.view', 'Compliance.view', 'Reports.view', 'Finance.view'],
    status: 'pending',
    aiRecommendation: 'Approve with time-limited access (90 days). Low risk - standard audit permissions.',
    riskScore: 25,
  },
  {
    id: random.uuid(),
    roleName: 'External Consultant',
    requestedBy: generatePerson('europe').fullName,
    requestedByEmail: 'consultant@external.com',
    requestedAt: random.date(3),
    reason: 'External security consultant requires access for penetration testing',
    permissions: ['Security.view', 'Server.view', 'Database.view', 'Audit.view'],
    status: 'pending',
    aiRecommendation: 'Review carefully - external access request. Recommend sandbox environment only.',
    riskScore: 72,
  },
  {
    id: random.uuid(),
    roleName: 'Data Analyst',
    requestedBy: generatePerson('north-america').fullName,
    requestedByEmail: 'analyst@company.com',
    requestedAt: random.date(7),
    reason: 'Analytics team expansion - need read access to reporting modules',
    permissions: ['Analytics.view', 'Reports.view', 'Dashboard.view'],
    status: 'approved',
    reviewedBy: 'Admin User',
    reviewedAt: random.date(2),
    aiRecommendation: 'Safe to approve - read-only analytics access.',
    riskScore: 15,
  },
  {
    id: random.uuid(),
    roleName: 'Content Manager',
    requestedBy: generatePerson('australia').fullName,
    requestedByEmail: 'content@company.com',
    requestedAt: random.date(10),
    reason: 'SEO team needs content management capabilities',
    permissions: ['SEO.view', 'SEO.edit', 'Marketing.view', 'Marketing.edit'],
    status: 'rejected',
    reviewedBy: 'Security Admin',
    reviewedAt: random.date(5),
    aiRecommendation: 'Role already exists - use existing SEO Manager role instead.',
    riskScore: 35,
  },
];

// ============ MAIN COMPONENT ============
const RoleManagerComplete = () => {
  const [roles, setRoles] = useState<Role[]>(systemRoles);
  const [approvals, setApprovals] = useState<RoleApproval[]>(mockApprovals);
  const [selectedRole, setSelectedRole] = useState<string>('master');
  const [permissionMatrix, setPermissionMatrix] = useState(generatePermissionMatrix());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeFilter, setScopeFilter] = useState<string>('all');
  
  // New role form state
  const [newRole, setNewRole] = useState({
    name: '',
    displayName: '',
    description: '',
    scopeLevel: 'local' as const,
    hierarchyLevel: 50,
  });

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesScope = scopeFilter === 'all' || role.scopeLevel === scopeFilter;
    return matchesSearch && matchesScope;
  });

  const pendingApprovals = approvals.filter(a => a.status === 'pending');

  const handleCreateRole = () => {
    if (!newRole.name.trim() || !newRole.displayName.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const role: Role = {
      id: newRole.name.toLowerCase().replace(/\s+/g, '_'),
      name: newRole.name.toLowerCase().replace(/\s+/g, '_'),
      displayName: newRole.displayName,
      description: newRole.description,
      icon: UserCog,
      color: 'from-slate-500 to-gray-600',
      scopeLevel: newRole.scopeLevel,
      hierarchyLevel: newRole.hierarchyLevel,
      isSystemRole: false,
      canBeDeleted: true,
      userCount: 0,
      status: 'pending',
      createdAt: new Date(),
      createdBy: 'Current User',
    };

    setRoles([...roles, role]);
    
    // Initialize permissions for new role
    const newPerms: Record<string, Record<string, boolean>> = {};
    modules.forEach(m => {
      newPerms[m.name] = { view: false, create: false, edit: false, delete: false, admin: false, export: false };
    });
    setPermissionMatrix({ ...permissionMatrix, [role.id]: newPerms });
    
    toast.success(`Role "${newRole.displayName}" created successfully. Pending approval.`);
    setIsCreateDialogOpen(false);
    setNewRole({ name: '', displayName: '', description: '', scopeLevel: 'local', hierarchyLevel: 50 });
  };

  const handleApproveRole = (approvalId: string) => {
    setApprovals(approvals.map(a => 
      a.id === approvalId 
        ? { ...a, status: 'approved' as const, reviewedBy: 'Current User', reviewedAt: new Date() }
        : a
    ));
    toast.success('Role request approved');
  };

  const handleRejectRole = (approvalId: string) => {
    setApprovals(approvals.map(a => 
      a.id === approvalId 
        ? { ...a, status: 'rejected' as const, reviewedBy: 'Current User', reviewedAt: new Date() }
        : a
    ));
    toast.error('Role request rejected');
  };

  const togglePermission = (roleId: string, module: string, permission: string) => {
    if (!isEditMode) return;
    
    setPermissionMatrix(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [module]: {
          ...prev[roleId][module],
          [permission]: !prev[roleId][module][permission],
        },
      },
    }));
  };

  const currentRole = roles.find(r => r.id === selectedRole);
  const currentPermissions = permissionMatrix[selectedRole] || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-7 h-7 text-violet-400" />
            Role Manager
          </h1>
          <p className="text-slate-400 mt-1">Create, manage, and approve roles with granular permissions</p>
        </div>
        <div className="flex items-center gap-3">
          {pendingApprovals.length > 0 && (
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              <Clock className="w-3 h-3 mr-1" />
              {pendingApprovals.length} Pending Approvals
            </Badge>
          )}
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-violet-600 hover:bg-violet-500">
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-violet-500/20">
                <Shield className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{roles.length}</p>
                <p className="text-sm text-slate-400">Total Roles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{roles.reduce((acc, r) => acc + r.userCount, 0).toLocaleString()}</p>
                <p className="text-sm text-slate-400">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/20">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{pendingApprovals.length}</p>
                <p className="text-sm text-slate-400">Pending Approvals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <Lock className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{modules.length * permissionTypes.length}</p>
                <p className="text-sm text-slate-400">Permission Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="roles" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
            <Shield className="w-4 h-4 mr-2" />
            All Roles
          </TabsTrigger>
          <TabsTrigger value="matrix" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            <Settings className="w-4 h-4 mr-2" />
            Permission Matrix
          </TabsTrigger>
          <TabsTrigger value="approvals" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
            <Clock className="w-4 h-4 mr-2" />
            Approvals ({pendingApprovals.length})
          </TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roles..."
                className="pl-10 bg-slate-800/50 border-slate-700"
              />
            </div>
            <Select value={scopeFilter} onValueChange={setScopeFilter}>
              <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-700">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Scope Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scopes</SelectItem>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="continent">Continent</SelectItem>
                <SelectItem value="country">Country</SelectItem>
                <SelectItem value="region">Region</SelectItem>
                <SelectItem value="local">Local</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRoles.map((role, index) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              
              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-4 rounded-xl bg-slate-800/50 border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-violet-500/50 ring-2 ring-violet-500/20' 
                      : 'border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      {role.isSystemRole && (
                        <Badge variant="outline" className="text-xs bg-slate-700/50 border-slate-600 text-slate-300">
                          System
                        </Badge>
                      )}
                      <Badge className={
                        role.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                        role.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }>
                        {role.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-white">{role.displayName}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{role.description}</p>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/50">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-sm text-slate-300">{role.userCount.toLocaleString()}</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-slate-700/30 border-slate-600/50">
                      {role.scopeLevel}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Permission Matrix Tab */}
        <TabsContent value="matrix" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">
                Permission Matrix: {currentRole?.displayName}
              </h2>
              <Badge className={`bg-gradient-to-r ${currentRole?.color} text-white`}>
                Level {currentRole?.hierarchyLevel}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Edit Mode</span>
                <Switch checked={isEditMode} onCheckedChange={setIsEditMode} />
              </div>
              {isEditMode && (
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500">
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              )}
            </div>
          </div>

          <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-400 sticky left-0 bg-slate-800/90">Module</TableHead>
                    {permissionTypes.map(perm => (
                      <TableHead key={perm} className="text-slate-400 text-center capitalize">
                        {perm}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module) => {
                    const perms = currentPermissions[module.name] || {};
                    const ModuleIcon = module.icon;
                    
                    return (
                      <TableRow key={module.name} className="border-slate-700/50 hover:bg-slate-700/20">
                        <TableCell className="sticky left-0 bg-slate-800/90">
                          <div className="flex items-center gap-2">
                            <ModuleIcon className="w-4 h-4 text-slate-400" />
                            <span className="text-white">{module.name}</span>
                            <Badge variant="outline" className="text-xs bg-slate-700/30 border-slate-600/50">
                              {module.category}
                            </Badge>
                          </div>
                        </TableCell>
                        {permissionTypes.map(perm => (
                          <TableCell key={perm} className="text-center">
                            <button
                              onClick={() => togglePermission(selectedRole, module.name, perm)}
                              disabled={!isEditMode}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                isEditMode ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                              } ${
                                perms[perm]
                                  ? perm === 'admin' 
                                    ? 'bg-violet-500/30 text-violet-400' 
                                    : perm === 'delete'
                                      ? 'bg-red-500/30 text-red-400'
                                      : 'bg-emerald-500/30 text-emerald-400'
                                  : 'bg-slate-700/30 text-slate-600'
                              }`}
                            >
                              {perms[perm] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                            </button>
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Legend */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-500/30 flex items-center justify-center">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <span className="text-slate-400">Granted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-violet-500/30 flex items-center justify-center">
                <Check className="w-3 h-3 text-violet-400" />
              </div>
              <span className="text-slate-400">Admin Access</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-red-500/30 flex items-center justify-center">
                <Check className="w-3 h-3 text-red-400" />
              </div>
              <span className="text-slate-400">Delete Permission</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-slate-700/30 flex items-center justify-center">
                <X className="w-3 h-3 text-slate-600" />
              </div>
              <span className="text-slate-400">Not Granted</span>
            </div>
          </div>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-4">
          <div className="space-y-4">
            {approvals.map((approval, index) => (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-5 rounded-xl border ${
                  approval.status === 'pending' 
                    ? 'bg-amber-500/5 border-amber-500/30' 
                    : approval.status === 'approved'
                      ? 'bg-emerald-500/5 border-emerald-500/30'
                      : 'bg-red-500/5 border-red-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-white text-lg">{approval.roleName}</h3>
                      <Badge className={
                        approval.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        approval.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-red-500/20 text-red-400'
                      }>
                        {approval.status}
                      </Badge>
                      <Badge className={
                        approval.riskScore < 30 ? 'bg-emerald-500/20 text-emerald-400' :
                        approval.riskScore < 60 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }>
                        Risk: {approval.riskScore}%
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">
                      Requested by <span className="text-white">{approval.requestedBy}</span> • {approval.requestedByEmail}
                    </p>
                  </div>
                  <div className="text-right text-sm text-slate-500">
                    {approval.requestedAt.toLocaleDateString()}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-slate-300">{approval.reason}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-500 mb-2">Requested Permissions:</p>
                  <div className="flex flex-wrap gap-2">
                    {approval.permissions.map(perm => (
                      <Badge key={perm} variant="outline" className="bg-slate-700/30 border-slate-600">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>

                {approval.aiRecommendation && (
                  <div className="mb-4 p-3 rounded-lg bg-violet-500/10 border border-violet-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-violet-400" />
                      <span className="text-sm font-semibold text-violet-400">AI Recommendation</span>
                      <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <p className="text-sm text-slate-300">{approval.aiRecommendation}</p>
                  </div>
                )}

                {approval.status === 'pending' && (
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleApproveRole(approval.id)}
                      className="bg-emerald-600 hover:bg-emerald-500"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      onClick={() => handleRejectRole(approval.id)}
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-slate-300">
                      <Bot className="w-4 h-4 mr-2" />
                      AI Analysis
                    </Button>
                  </div>
                )}

                {approval.status !== 'pending' && approval.reviewedBy && (
                  <div className="text-sm text-slate-500">
                    {approval.status === 'approved' ? 'Approved' : 'Rejected'} by {approval.reviewedBy} on {approval.reviewedAt?.toLocaleDateString()}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-violet-400" />
              Create New Role
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Define a new role with custom permissions. Requires approval.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Role ID</Label>
                <Input
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  placeholder="e.g., regional_auditor"
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Display Name</Label>
                <Input
                  value={newRole.displayName}
                  onChange={(e) => setNewRole({ ...newRole, displayName: e.target.value })}
                  placeholder="e.g., Regional Auditor"
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Description</Label>
              <Textarea
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                placeholder="Describe the role's purpose and responsibilities..."
                className="bg-slate-800 border-slate-700"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Scope Level</Label>
                <Select 
                  value={newRole.scopeLevel} 
                  onValueChange={(value: any) => setNewRole({ ...newRole, scopeLevel: value })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="continent">Continent</SelectItem>
                    <SelectItem value="country">Country</SelectItem>
                    <SelectItem value="region">Region</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Hierarchy Level (1-100)</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={newRole.hierarchyLevel}
                  onChange={(e) => setNewRole({ ...newRole, hierarchyLevel: parseInt(e.target.value) || 50 })}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-slate-700">
              Cancel
            </Button>
            <Button onClick={handleCreateRole} className="bg-violet-600 hover:bg-violet-500">
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagerComplete;
