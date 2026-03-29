import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Plus, Edit, Trash2, Check, X, Eye, Lock, 
  Crown, Building2, Code2, HeadphonesIcon, Megaphone, TrendingUp,
  Search, Wallet, UserCog, Settings, CheckCircle2, XCircle,
  Clock, AlertTriangle, Bot, Sparkles, Globe, MapPin, Server,
  FileText, Scale, Briefcase, Monitor, Database, Zap, Filter,
  ShieldAlert, ShieldCheck, Ban, Unlock, History, Save
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  isSuperAdmin?: boolean;
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

interface PermissionGrant {
  id: string;
  roleId: string;
  module: string;
  permission: string;
  grantedBy: string;
  grantedAt: Date;
  reason: string;
  expiresAt?: Date;
}

interface AuditLogEntry {
  id: string;
  action: string;
  roleId: string;
  roleName: string;
  module?: string;
  permission?: string;
  performedBy: string;
  performedAt: Date;
  reason?: string;
  previousState?: boolean;
  newState?: boolean;
}

// ============ PERMISSION TYPES ============
const permissionTypes = [
  { key: 'view', label: 'View', icon: Eye, description: 'Can view module data' },
  { key: 'create', label: 'Create', icon: Plus, description: 'Can create new records' },
  { key: 'edit', label: 'Edit', icon: Edit, description: 'Can modify existing records' },
  { key: 'delete', label: 'Delete', icon: Trash2, description: 'Can remove records' },
  { key: 'approve', label: 'Approve', icon: CheckCircle2, description: 'Can approve requests' },
  { key: 'assign', label: 'Assign', icon: Users, description: 'Can assign to users' },
  { key: 'export', label: 'Export', icon: FileText, description: 'Can export data' },
  { key: 'lock', label: 'Lock/Block', icon: Lock, description: 'Can lock or block' },
  { key: 'configure', label: 'Configure', icon: Settings, description: 'Can change settings' },
] as const;

// ============ MODULES (MASTER CSV) ============
const modules = [
  // Core
  { name: 'Dashboard', icon: Monitor, category: 'Core', isSensitive: false },
  { name: 'LiveActivity', icon: Zap, category: 'Core', isSensitive: false },
  { name: 'Notifications', icon: Settings, category: 'Core', isSensitive: false },
  // Users & Admins
  { name: 'Users', icon: Users, category: 'User Management', isSensitive: true },
  { name: 'Admins', icon: UserCog, category: 'User Management', isSensitive: true },
  // Roles & Permissions
  { name: 'Roles', icon: Shield, category: 'System', isSensitive: true },
  { name: 'Permissions', icon: Lock, category: 'System', isSensitive: true },
  { name: 'PermissionMatrix', icon: Settings, category: 'System', isSensitive: true },
  // Geography
  { name: 'Continents', icon: Globe, category: 'Geography', isSensitive: false },
  { name: 'Countries', icon: MapPin, category: 'Geography', isSensitive: false },
  { name: 'Areas', icon: MapPin, category: 'Geography', isSensitive: false },
  // Business
  { name: 'Franchise', icon: Building2, category: 'Business', isSensitive: false },
  { name: 'Reseller', icon: Users, category: 'Business', isSensitive: false },
  { name: 'Sales', icon: TrendingUp, category: 'Business', isSensitive: false },
  { name: 'Leads', icon: Users, category: 'Business', isSensitive: false },
  { name: 'ProUsers', icon: Zap, category: 'Business', isSensitive: true },
  // Operations
  { name: 'Tasks', icon: FileText, category: 'Operations', isSensitive: false },
  { name: 'Approvals', icon: CheckCircle2, category: 'Operations', isSensitive: true },
  { name: 'Rentals', icon: Building2, category: 'Operations', isSensitive: false },
  { name: 'Rules', icon: Scale, category: 'Operations', isSensitive: true },
  // Development
  { name: 'DeveloperPanel', icon: Code2, category: 'Development', isSensitive: true },
  { name: 'BugsIssues', icon: AlertTriangle, category: 'Development', isSensitive: false },
  { name: 'QAPanel', icon: CheckCircle2, category: 'Development', isSensitive: false },
  { name: 'Releases', icon: Zap, category: 'Development', isSensitive: true },
  { name: 'APIs', icon: Database, category: 'Development', isSensitive: true },
  // Support
  { name: 'Tickets', icon: HeadphonesIcon, category: 'Support', isSensitive: false },
  { name: 'SLA', icon: Clock, category: 'Support', isSensitive: true },
  { name: 'KnowledgeBase', icon: FileText, category: 'Support', isSensitive: false },
  // Finance
  { name: 'Transactions', icon: Wallet, category: 'Finance', isSensitive: true },
  { name: 'Commissions', icon: Wallet, category: 'Finance', isSensitive: true },
  { name: 'Payouts', icon: Wallet, category: 'Finance', isSensitive: true },
  { name: 'Invoices', icon: FileText, category: 'Finance', isSensitive: true },
  { name: 'TaxCompliance', icon: Scale, category: 'Finance', isSensitive: true },
  // Legal & Security
  { name: 'LegalCases', icon: Scale, category: 'Legal', isSensitive: true },
  { name: 'TrademarkIP', icon: Shield, category: 'Legal', isSensitive: true },
  { name: 'SecurityEvents', icon: ShieldAlert, category: 'Security', isSensitive: true },
  { name: 'SystemLock', icon: Lock, category: 'Security', isSensitive: true },
  { name: 'AuditLogs', icon: FileText, category: 'Security', isSensitive: true },
];

// ============ MASTER CSV PERMISSION MATRIX (Super Admin) ============
// 1 = Allowed, 0 = Denied | Editable ONLY by Super Admin | Use for DB seed/migration
const SUPER_ADMIN_CSV_MATRIX: Record<string, Record<string, number>> = {
  'Dashboard':       { view: 1, create: 0, edit: 0, delete: 0, approve: 0, assign: 0, export: 0, lock: 0, configure: 0 },
  'LiveActivity':    { view: 1, create: 0, edit: 0, delete: 0, approve: 0, assign: 0, export: 1, lock: 0, configure: 0 },
  'Notifications':   { view: 1, create: 0, edit: 0, delete: 0, approve: 0, assign: 0, export: 0, lock: 0, configure: 1 },
  'Users':           { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 1, configure: 0 },
  'Admins':          { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 1, configure: 0 },
  'Roles':           { view: 1, create: 1, edit: 1, delete: 1, approve: 1, assign: 1, export: 1, lock: 1, configure: 1 },
  'Permissions':     { view: 1, create: 1, edit: 1, delete: 1, approve: 1, assign: 1, export: 1, lock: 1, configure: 1 },
  'PermissionMatrix':{ view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 1, configure: 1 },
  'Continents':      { view: 1, create: 0, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 1, configure: 0 },
  'Countries':       { view: 1, create: 0, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 1, configure: 0 },
  'Areas':           { view: 1, create: 0, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 1, configure: 0 },
  'Franchise':       { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 1, configure: 0 },
  'Reseller':        { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 1, configure: 0 },
  'Sales':           { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 0, configure: 0 },
  'Leads':           { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 0, configure: 0 },
  'ProUsers':        { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 1, configure: 1 },
  'Tasks':           { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 0, configure: 0 },
  'Approvals':       { view: 1, create: 0, edit: 1, delete: 0, approve: 1, assign: 0, export: 1, lock: 0, configure: 0 },
  'Rentals':         { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 1, configure: 0 },
  'Rules':           { view: 1, create: 1, edit: 1, delete: 1, approve: 1, assign: 0, export: 1, lock: 1, configure: 1 },
  'DeveloperPanel':  { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 1, configure: 1 },
  'BugsIssues':      { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 0, configure: 0 },
  'QAPanel':         { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 0, configure: 0 },
  'Releases':        { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 0, export: 1, lock: 1, configure: 1 },
  'APIs':            { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 1, configure: 1 },
  'Tickets':         { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 0, configure: 0 },
  'SLA':             { view: 1, create: 0, edit: 1, delete: 0, approve: 1, assign: 0, export: 1, lock: 0, configure: 1 },
  'KnowledgeBase':   { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 0, export: 1, lock: 0, configure: 1 },
  'Transactions':    { view: 1, create: 0, edit: 0, delete: 0, approve: 1, assign: 0, export: 1, lock: 1, configure: 0 },
  'Commissions':     { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 1, export: 1, lock: 0, configure: 0 },
  'Payouts':         { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 0, export: 1, lock: 1, configure: 0 },
  'Invoices':        { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 0, export: 1, lock: 0, configure: 0 },
  'TaxCompliance':   { view: 1, create: 0, edit: 1, delete: 0, approve: 1, assign: 0, export: 1, lock: 0, configure: 1 },
  'LegalCases':      { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 0, export: 1, lock: 1, configure: 0 },
  'TrademarkIP':     { view: 1, create: 1, edit: 1, delete: 0, approve: 1, assign: 0, export: 1, lock: 1, configure: 0 },
  'SecurityEvents':  { view: 1, create: 0, edit: 1, delete: 0, approve: 1, assign: 0, export: 1, lock: 1, configure: 1 },
  'SystemLock':      { view: 1, create: 0, edit: 1, delete: 0, approve: 1, assign: 0, export: 1, lock: 1, configure: 1 },
  'AuditLogs':       { view: 1, create: 0, edit: 0, delete: 0, approve: 0, assign: 0, export: 1, lock: 0, configure: 0 },
};

// ============ SYSTEM ROLES - DEFAULT LOCKED ============
const systemRoles: Role[] = [
  { 
    id: 'super_admin', 
    name: 'super_admin', 
    displayName: 'Super Admin', 
    description: 'ONLY role with default full access. Controls all permissions for other roles.', 
    icon: Crown, 
    color: 'from-red-500 to-rose-600', 
    scopeLevel: 'global', 
    hierarchyLevel: 100, 
    isSystemRole: true, 
    canBeDeleted: false, 
    userCount: 1, 
    status: 'active', 
    createdAt: new Date('2023-01-01'), 
    createdBy: 'System',
    isSuperAdmin: true 
  },
  { id: 'master_admin', name: 'master_admin', displayName: 'Boss', description: 'System administration (permissions granted by Boss)', icon: ShieldCheck, color: 'from-violet-500 to-purple-600', scopeLevel: 'global', hierarchyLevel: 95, isSystemRole: true, canBeDeleted: false, userCount: 2, status: 'active', createdAt: new Date('2023-01-15'), createdBy: 'Boss' },
  { id: 'continent_super_admin', name: 'continent_super_admin', displayName: 'Continent Boss', description: 'Manages continent operations (permissions granted by Boss)', icon: Globe, color: 'from-blue-500 to-indigo-600', scopeLevel: 'continent', hierarchyLevel: 90, isSystemRole: true, canBeDeleted: false, userCount: 7, status: 'active', createdAt: new Date('2023-01-20'), createdBy: 'Boss' },
  { id: 'country_head', name: 'country_head', displayName: 'Country Head', description: 'Country-level management (permissions granted by Boss)', icon: MapPin, color: 'from-cyan-500 to-blue-600', scopeLevel: 'country', hierarchyLevel: 80, isSystemRole: true, canBeDeleted: false, userCount: 45, status: 'active', createdAt: new Date('2023-02-01'), createdBy: 'Boss' },
  { id: 'franchise_manager', name: 'franchise_manager', displayName: 'Franchise Manager', description: 'Franchise operations (permissions granted by Boss)', icon: Building2, color: 'from-emerald-500 to-teal-600', scopeLevel: 'region', hierarchyLevel: 70, isSystemRole: true, canBeDeleted: false, userCount: 128, status: 'active', createdAt: new Date('2023-02-15'), createdBy: 'Boss' },
  { id: 'reseller_manager', name: 'reseller_manager', displayName: 'Reseller Manager', description: 'Manages reseller network (permissions granted by Boss)', icon: Users, color: 'from-teal-500 to-cyan-600', scopeLevel: 'region', hierarchyLevel: 65, isSystemRole: true, canBeDeleted: false, userCount: 86, status: 'active', createdAt: new Date('2023-03-01'), createdBy: 'Boss' },
  { id: 'sales_manager', name: 'sales_manager', displayName: 'Sales Manager', description: 'Sales team management (permissions granted by Boss)', icon: TrendingUp, color: 'from-orange-500 to-amber-600', scopeLevel: 'region', hierarchyLevel: 60, isSystemRole: true, canBeDeleted: false, userCount: 54, status: 'active', createdAt: new Date('2023-03-15'), createdBy: 'Boss' },
  { id: 'lead_manager', name: 'lead_manager', displayName: 'Lead Manager', description: 'Lead tracking and conversion (permissions granted by Boss)', icon: Users, color: 'from-lime-500 to-green-600', scopeLevel: 'region', hierarchyLevel: 55, isSystemRole: true, canBeDeleted: false, userCount: 42, status: 'active', createdAt: new Date('2023-04-01'), createdBy: 'Boss' },
  { id: 'pro_manager', name: 'pro_manager', displayName: 'Pro Manager', description: 'Pro user management (permissions granted by Boss)', icon: Zap, color: 'from-yellow-500 to-amber-600', scopeLevel: 'global', hierarchyLevel: 50, isSystemRole: true, canBeDeleted: false, userCount: 18, status: 'active', createdAt: new Date('2023-04-15'), createdBy: 'Boss' },
  { id: 'legal_manager', name: 'legal_manager', displayName: 'Legal Manager', description: 'Legal and compliance (permissions granted by Boss)', icon: Scale, color: 'from-slate-500 to-gray-600', scopeLevel: 'global', hierarchyLevel: 75, isSystemRole: true, canBeDeleted: false, userCount: 8, status: 'active', createdAt: new Date('2023-05-01'), createdBy: 'Boss' },
  { id: 'hr_manager', name: 'hr_manager', displayName: 'HR Manager', description: 'Human resources (permissions granted by Boss)', icon: Briefcase, color: 'from-pink-500 to-rose-600', scopeLevel: 'global', hierarchyLevel: 70, isSystemRole: true, canBeDeleted: false, userCount: 24, status: 'active', createdAt: new Date('2023-05-15'), createdBy: 'Boss' },
  { id: 'finance_manager', name: 'finance_manager', displayName: 'Finance Manager', description: 'Financial operations (permissions granted by Boss)', icon: Wallet, color: 'from-amber-500 to-orange-600', scopeLevel: 'global', hierarchyLevel: 75, isSystemRole: true, canBeDeleted: false, userCount: 18, status: 'active', createdAt: new Date('2023-06-01'), createdBy: 'Boss' },
  { id: 'developer_manager', name: 'developer_manager', displayName: 'Developer Manager', description: 'Dev team management (permissions granted by Boss)', icon: Code2, color: 'from-purple-500 to-violet-600', scopeLevel: 'global', hierarchyLevel: 65, isSystemRole: true, canBeDeleted: false, userCount: 12, status: 'active', createdAt: new Date('2023-06-15'), createdBy: 'Boss' },
  { id: 'qa_manager', name: 'qa_manager', displayName: 'QA Manager', description: 'Quality assurance (permissions granted by Super Admin)', icon: CheckCircle2, color: 'from-green-500 to-emerald-600', scopeLevel: 'global', hierarchyLevel: 60, isSystemRole: true, canBeDeleted: false, userCount: 15, status: 'active', createdAt: new Date('2023-07-01'), createdBy: 'Super Admin' },
  { id: 'support_manager', name: 'support_manager', displayName: 'Support Manager', description: 'Customer support (permissions granted by Super Admin)', icon: HeadphonesIcon, color: 'from-rose-500 to-red-600', scopeLevel: 'global', hierarchyLevel: 55, isSystemRole: true, canBeDeleted: false, userCount: 28, status: 'active', createdAt: new Date('2023-07-15'), createdBy: 'Super Admin' },
  { id: 'developer', name: 'developer', displayName: 'Developer', description: 'Development tasks (permissions granted by Super Admin)', icon: Code2, color: 'from-indigo-500 to-blue-600', scopeLevel: 'local', hierarchyLevel: 40, isSystemRole: true, canBeDeleted: false, userCount: 89, status: 'active', createdAt: new Date('2023-08-01'), createdBy: 'Super Admin' },
  { id: 'influencer', name: 'influencer', displayName: 'Influencer', description: 'Marketing promotion (permissions granted by Super Admin)', icon: Megaphone, color: 'from-fuchsia-500 to-pink-600', scopeLevel: 'local', hierarchyLevel: 30, isSystemRole: true, canBeDeleted: false, userCount: 567, status: 'active', createdAt: new Date('2023-08-15'), createdBy: 'Super Admin' },
  { id: 'reseller', name: 'reseller', displayName: 'Reseller', description: 'Sales and clients (permissions granted by Super Admin)', icon: Users, color: 'from-cyan-500 to-teal-600', scopeLevel: 'local', hierarchyLevel: 35, isSystemRole: true, canBeDeleted: false, userCount: 1856, status: 'active', createdAt: new Date('2023-09-01'), createdBy: 'Super Admin' },
  { id: 'franchise', name: 'franchise', displayName: 'Franchise Owner', description: 'Franchise operations (permissions granted by Super Admin)', icon: Building2, color: 'from-emerald-500 to-green-600', scopeLevel: 'local', hierarchyLevel: 45, isSystemRole: true, canBeDeleted: false, userCount: 342, status: 'active', createdAt: new Date('2023-09-15'), createdBy: 'Super Admin' },
  { id: 'prime_user', name: 'prime_user', displayName: 'Prime User', description: 'Premium client access (permissions granted by Super Admin)', icon: Zap, color: 'from-yellow-500 to-orange-600', scopeLevel: 'local', hierarchyLevel: 25, isSystemRole: true, canBeDeleted: false, userCount: 2345, status: 'active', createdAt: new Date('2023-10-01'), createdBy: 'Super Admin' },
];

// ============ GENERATE DEFAULT-LOCK PERMISSION MATRIX ============
// ONLY Super Admin uses CSV matrix, ALL other roles start with ZERO
const generateDefaultLockMatrix = () => {
  const matrix: Record<string, Record<string, Record<string, boolean>>> = {};
  
  systemRoles.forEach(role => {
    matrix[role.id] = {};
    modules.forEach(module => {
      matrix[role.id][module.name] = {};
      
      if (role.isSuperAdmin) {
        // Super Admin uses MASTER CSV MATRIX
        const csvPerms = SUPER_ADMIN_CSV_MATRIX[module.name];
        permissionTypes.forEach(perm => {
          matrix[role.id][module.name][perm.key] = csvPerms ? csvPerms[perm.key] === 1 : false;
        });
      } else {
        // ALL other roles get ZERO permissions
        permissionTypes.forEach(perm => {
          matrix[role.id][module.name][perm.key] = false;
        });
      }
    });
  });
  
  return matrix;
};

// Mock approvals
const mockApprovals: RoleApproval[] = [
  {
    id: random.uuid(),
    roleName: 'Regional Auditor',
    requestedBy: generatePerson('asia').fullName,
    requestedByEmail: 'auditor.request@company.com',
    requestedAt: random.date(5),
    reason: 'Need audit access for quarterly compliance review in APAC region',
    permissions: ['Audit.view', 'Compliance.view', 'Reports.view'],
    status: 'pending',
    aiRecommendation: 'Approve with time-limited access (90 days). Low risk - read-only audit permissions.',
    riskScore: 25,
  },
  {
    id: random.uuid(),
    roleName: 'External Consultant',
    requestedBy: generatePerson('europe').fullName,
    requestedByEmail: 'consultant@external.com',
    requestedAt: random.date(3),
    reason: 'External security consultant requires access for penetration testing',
    permissions: ['Security.view', 'Server.view'],
    status: 'pending',
    aiRecommendation: 'HIGH RISK - External access. Recommend sandbox only with Super Admin oversight.',
    riskScore: 85,
  },
];

// Mock audit log for permission grants
const mockAuditLog: AuditLogEntry[] = [
  {
    id: random.uuid(),
    action: 'permission_granted',
    roleId: 'master_admin',
    roleName: 'Master Admin',
    module: 'Users',
    permission: 'view',
    performedBy: 'Super Admin',
    performedAt: random.date(30),
    reason: 'Initial role setup - User management access required',
    previousState: false,
    newState: true,
  },
  {
    id: random.uuid(),
    action: 'permission_granted',
    roleId: 'finance_manager',
    roleName: 'Finance Manager',
    module: 'Finance',
    permission: 'view',
    performedBy: 'Super Admin',
    performedAt: random.date(25),
    reason: 'Workload delegation - Finance reporting access',
    previousState: false,
    newState: true,
  },
  {
    id: random.uuid(),
    action: 'permission_revoked',
    roleId: 'developer',
    roleName: 'Developer',
    module: 'Database',
    permission: 'view',
    performedBy: 'Super Admin',
    performedAt: random.date(10),
    reason: 'Security policy update - Restricted access',
    previousState: true,
    newState: false,
  },
];

// ============ MAIN COMPONENT ============
const RoleManagerComplete = () => {
  const [roles, setRoles] = useState<Role[]>(systemRoles);
  const [approvals, setApprovals] = useState<RoleApproval[]>(mockApprovals);
  const [selectedRole, setSelectedRole] = useState<string>('super_admin');
  const [permissionMatrix, setPermissionMatrix] = useState(generateDefaultLockMatrix());
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(mockAuditLog);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isGrantDialogOpen, setIsGrantDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeFilter, setScopeFilter] = useState<string>('all');
  const [grantReason, setGrantReason] = useState('');
  const [pendingGrant, setPendingGrant] = useState<{ roleId: string; module: string; permission: string } | null>(null);
  
  // New role form state
  const [newRole, setNewRole] = useState({
    name: '',
    displayName: '',
    description: '',
    scopeLevel: 'local' as const,
    hierarchyLevel: 30,
  });

  const filteredRoles = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return roles.filter(role => {
      const matchesSearch = role.displayName.toLowerCase().includes(lowerQuery) ||
                           role.name.toLowerCase().includes(lowerQuery);
      const matchesScope = scopeFilter === 'all' || role.scopeLevel === scopeFilter;
      return matchesSearch && matchesScope;
    });
  }, [roles, searchQuery, scopeFilter]);

  const pendingApprovals = useMemo(() => approvals.filter(a => a.status === 'pending'), [approvals]);
  const currentRole = useMemo(() => roles.find(r => r.id === selectedRole), [roles, selectedRole]);
  const currentPermissions = useMemo(() => permissionMatrix[selectedRole] || {}, [permissionMatrix, selectedRole]);
  const isSuperAdminSelected = currentRole?.isSuperAdmin;

  // Count granted permissions for a role
  const countGrantedPermissions = (roleId: string) => {
    const rolePerms = permissionMatrix[roleId];
    if (!rolePerms) return 0;
    let count = 0;
    Object.values(rolePerms).forEach(modulePerms => {
      Object.values(modulePerms).forEach(granted => {
        if (granted) count++;
      });
    });
    return count;
  };

  const totalPermissionPoints = modules.length * permissionTypes.length;

  const handleCreateRole = () => {
    if (!newRole.name.trim() || !newRole.displayName.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const role: Role = {
      id: newRole.name.toLowerCase().replace(/\s+/g, '_'),
      name: newRole.name.toLowerCase().replace(/\s+/g, '_'),
      displayName: newRole.displayName,
      description: newRole.description || 'Permissions granted by Super Admin',
      icon: UserCog,
      color: 'from-slate-500 to-gray-600',
      scopeLevel: newRole.scopeLevel,
      hierarchyLevel: newRole.hierarchyLevel,
      isSystemRole: false,
      canBeDeleted: true,
      userCount: 0,
      status: 'pending',
      createdAt: new Date(),
      createdBy: 'Super Admin',
    };

    setRoles([...roles, role]);
    
    // Initialize with ZERO permissions (default-lock)
    const newPerms: Record<string, Record<string, boolean>> = {};
    modules.forEach(m => {
      newPerms[m.name] = {};
      permissionTypes.forEach(perm => {
        newPerms[m.name][perm.key] = false;
      });
    });
    setPermissionMatrix({ ...permissionMatrix, [role.id]: newPerms });

    // Add audit log
    setAuditLog([{
      id: random.uuid(),
      action: 'role_created',
      roleId: role.id,
      roleName: role.displayName,
      performedBy: 'Super Admin',
      performedAt: new Date(),
      reason: 'New role created with zero permissions (default-lock)',
    }, ...auditLog]);
    
    toast.success(`Role "${newRole.displayName}" created with ZERO permissions. Grant permissions as needed.`);
    setIsCreateDialogOpen(false);
    setNewRole({ name: '', displayName: '', description: '', scopeLevel: 'local', hierarchyLevel: 30 });
  };

  const handleApproveRole = (approvalId: string) => {
    setApprovals(approvals.map(a => 
      a.id === approvalId 
        ? { ...a, status: 'approved' as const, reviewedBy: 'Super Admin', reviewedAt: new Date() }
        : a
    ));
    toast.success('Role request approved by Super Admin');
  };

  const handleRejectRole = (approvalId: string) => {
    setApprovals(approvals.map(a => 
      a.id === approvalId 
        ? { ...a, status: 'rejected' as const, reviewedBy: 'Super Admin', reviewedAt: new Date() }
        : a
    ));
    toast.error('Role request rejected');
  };

  const initiatePermissionToggle = (roleId: string, module: string, permission: string) => {
    if (!isEditMode) return;
    
    const role = roles.find(r => r.id === roleId);
    if (role?.isSuperAdmin) {
      toast.error('Super Admin permissions cannot be modified');
      return;
    }

    const currentValue = permissionMatrix[roleId]?.[module]?.[permission];
    
    if (!currentValue) {
      // Granting permission - requires reason
      setPendingGrant({ roleId, module, permission });
      setGrantReason('');
      setIsGrantDialogOpen(true);
    } else {
      // Revoking permission
      revokePermission(roleId, module, permission);
    }
  };

  const grantPermission = () => {
    if (!pendingGrant || !grantReason.trim()) {
      toast.error('Reason is required for granting permissions');
      return;
    }

    const { roleId, module, permission } = pendingGrant;
    const role = roles.find(r => r.id === roleId);

    setPermissionMatrix(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [module]: {
          ...prev[roleId][module],
          [permission]: true,
        },
      },
    }));

    // Add audit log
    setAuditLog([{
      id: random.uuid(),
      action: 'permission_granted',
      roleId,
      roleName: role?.displayName || roleId,
      module,
      permission,
      performedBy: 'Super Admin',
      performedAt: new Date(),
      reason: grantReason,
      previousState: false,
      newState: true,
    }, ...auditLog]);

    toast.success(`Permission ${module}.${permission} granted to ${role?.displayName}`);
    setIsGrantDialogOpen(false);
    setPendingGrant(null);
    setGrantReason('');
  };

  const revokePermission = (roleId: string, module: string, permission: string) => {
    const role = roles.find(r => r.id === roleId);

    setPermissionMatrix(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [module]: {
          ...prev[roleId][module],
          [permission]: false,
        },
      },
    }));

    // Add audit log
    setAuditLog([{
      id: random.uuid(),
      action: 'permission_revoked',
      roleId,
      roleName: role?.displayName || roleId,
      module,
      permission,
      performedBy: 'Super Admin',
      performedAt: new Date(),
      reason: 'Permission revoked by Super Admin',
      previousState: true,
      newState: false,
    }, ...auditLog]);

    toast.info(`Permission ${module}.${permission} revoked from ${role?.displayName}`);
  };

  const savePermissionChanges = () => {
    toast.success('All permission changes saved and logged');
    setIsEditMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-7 h-7 text-violet-400" />
            Role Manager
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 ml-2">
              <Lock className="w-3 h-3 mr-1" />
              Default-Lock Model
            </Badge>
          </h1>
          <p className="text-slate-400 mt-1">
            Only Super Admin has full access. All other roles start with ZERO permissions.
          </p>
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

      {/* Security Notice Banner */}
      <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-500/20">
              <ShieldAlert className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white flex items-center gap-2">
                Global Permission Rule: Super Admin First
              </h3>
              <p className="text-sm text-slate-400">
                By DEFAULT, ONLY Super Admin has ALL permissions. All other roles have ZERO access until explicitly granted by Super Admin based on workload requirements.
              </p>
            </div>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              <Lock className="w-3 h-3 mr-1" />
              Enforced
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-500/20">
                <Crown className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">1</p>
                <p className="text-sm text-slate-400">Super Admin</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-violet-500/20">
                <Shield className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{roles.length - 1}</p>
                <p className="text-sm text-slate-400">Locked Roles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <Unlock className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{auditLog.filter(l => l.action === 'permission_granted').length}</p>
                <p className="text-sm text-slate-400">Permissions Granted</p>
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
                <History className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{auditLog.length}</p>
                <p className="text-sm text-slate-400">Audit Entries</p>
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
          <TabsTrigger value="audit" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            <History className="w-4 h-4 mr-2" />
            Audit Log
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
              const grantedPerms = countGrantedPermissions(role.id);
              const permissionPercent = Math.round((grantedPerms / totalPermissionPoints) * 100);
              
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
                  } ${role.isSuperAdmin ? 'ring-2 ring-red-500/30' : ''}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      {role.isSuperAdmin ? (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          <Crown className="w-3 h-3 mr-1" />
                          Full Access
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-700/50 text-slate-400 border-slate-600">
                          <Lock className="w-3 h-3 mr-1" />
                          {permissionPercent}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-white">{role.displayName}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{role.description}</p>
                  
                  {/* Permission Progress Bar */}
                  {!role.isSuperAdmin && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>Permissions</span>
                        <span>{grantedPerms}/{totalPermissionPoints}</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            grantedPerms === 0 ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${permissionPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
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
              {currentRole?.isSuperAdmin ? (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  <Crown className="w-3 h-3 mr-1" />
                  Full Access (Cannot Modify)
                </Badge>
              ) : (
                <Badge className="bg-slate-700/50 text-slate-400">
                  <Lock className="w-3 h-3 mr-1" />
                  {countGrantedPermissions(selectedRole)} / {totalPermissionPoints} Granted
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              {!isSuperAdminSelected && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Edit Mode (Super Admin Only)</span>
                    <Switch checked={isEditMode} onCheckedChange={setIsEditMode} />
                  </div>
                  {isEditMode && (
                    <Button size="sm" onClick={savePermissionChanges} className="bg-emerald-600 hover:bg-emerald-500">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {isSuperAdminSelected && (
            <Card className="bg-red-500/5 border-red-500/30">
              <CardContent className="py-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-slate-300">
                    Super Admin has ALL permissions by system design. This cannot be modified.
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section grouped modules */}
          {(() => {
            const groupedModules = [
              { section: 'CORE', modules: ['Dashboard', 'LiveActivity', 'Notifications'] },
              { section: 'USER MANAGEMENT', modules: ['Users', 'Admins'] },
              { section: 'ROLE & PERMISSION SYSTEM (SUPER ADMIN ONLY)', modules: ['Roles', 'Permissions', 'PermissionMatrix'] },
              { section: 'GEOGRAPHY', modules: ['Continents', 'Countries', 'Areas'] },
              { section: 'BUSINESS & PARTNERS', modules: ['Franchise', 'Reseller', 'Sales', 'Leads', 'ProUsers'] },
              { section: 'OPERATIONS', modules: ['Tasks', 'Approvals', 'Rentals', 'Rules'] },
              { section: 'TECH & PRODUCT', modules: ['DeveloperPanel', 'BugsIssues', 'QAPanel', 'Releases', 'APIs'] },
              { section: 'SUPPORT', modules: ['Tickets', 'SLA', 'KnowledgeBase'] },
              { section: 'FINANCE', modules: ['Transactions', 'Commissions', 'Payouts', 'Invoices', 'TaxCompliance'] },
              { section: 'LEGAL & SECURITY', modules: ['LegalCases', 'TrademarkIP', 'SecurityEvents', 'SystemLock', 'AuditLogs'] },
            ];

            return (
              <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden">
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-slate-800 z-20">
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-400 sticky left-0 bg-slate-800 z-30 min-w-[200px]">
                          MODULE / FEATURE
                        </TableHead>
                        <TableHead className="text-slate-400 text-center w-12">V</TableHead>
                        <TableHead className="text-slate-400 text-center w-12">C</TableHead>
                        <TableHead className="text-slate-400 text-center w-12">E</TableHead>
                        <TableHead className="text-slate-400 text-center w-12">D</TableHead>
                        <TableHead className="text-slate-400 text-center w-12">A</TableHead>
                        <TableHead className="text-slate-400 text-center w-12">S</TableHead>
                        <TableHead className="text-slate-400 text-center w-12">X</TableHead>
                        <TableHead className="text-slate-400 text-center w-12">L</TableHead>
                        <TableHead className="text-slate-400 text-center w-12">CFG</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedModules.map((group) => (
                        <>
                          {/* Section Header */}
                          <TableRow key={group.section} className="bg-slate-700/30 border-slate-600">
                            <TableCell colSpan={10} className="py-2">
                              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                                {group.section}
                              </span>
                            </TableCell>
                          </TableRow>
                          {/* Section Modules */}
                          {group.modules.map((moduleName) => {
                            const module = modules.find(m => m.name === moduleName);
                            if (!module) return null;
                            const perms = currentPermissions[module.name] || {};
                            const ModuleIcon = module.icon;
                            
                            return (
                              <TableRow key={module.name} className="border-slate-700/50 hover:bg-slate-700/20">
                                <TableCell className="sticky left-0 bg-slate-800/90 z-10">
                                  <div className="flex items-center gap-2">
                                    <ModuleIcon className="w-4 h-4 text-slate-400" />
                                    <span className="text-white text-sm">{module.name}</span>
                                    {module.isSensitive && (
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-red-500/10 border-red-500/30 text-red-400">
                                        Sensitive
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                {permissionTypes.map(perm => {
                                  const isGranted = perms[perm.key];
                                  const canEdit = isEditMode && !isSuperAdminSelected;
                                  
                                  return (
                                    <TableCell key={perm.key} className="text-center p-1">
                                      <button
                                        onClick={() => initiatePermissionToggle(selectedRole, module.name, perm.key)}
                                        disabled={!canEdit}
                                        className={`w-8 h-8 rounded flex items-center justify-center transition-all text-lg font-bold ${
                                          canEdit ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                                        } ${
                                          isGranted
                                            ? isSuperAdminSelected
                                              ? 'text-emerald-400'
                                              : 'text-emerald-400'
                                            : 'text-red-500/60'
                                        }`}
                                        title={isGranted ? 'Permission Granted' : 'No Permission'}
                                      >
                                        {isGranted ? '✔' : '✖'}
                                      </button>
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </Card>
            );
          })()}

          {/* Legend */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✔</span>
                <span className="text-slate-400">Allowed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-500/60 font-bold">✖</span>
                <span className="text-slate-400">Denied</span>
              </div>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <Lock className="w-3 h-3" />
              <span>V=View, C=Create, E=Edit, D=Delete, A=Approve, S=Assign, X=Export, L=Lock, CFG=Configure</span>
            </div>
          </div>

          {/* Strict Rule Warning */}
          <Card className="bg-amber-500/5 border-amber-500/30">
            <CardContent className="py-3">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-slate-300">
                  <strong className="text-amber-400">STRICT RULE:</strong> This entire table is editable ONLY by Super Admin. 
                  Other roles see READ-ONLY or NOTHING. Any deviation = security violation.
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-4">
          <div className="space-y-4">
            {approvals.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white">No Pending Approvals</h3>
                  <p className="text-slate-400">All role requests have been processed.</p>
                </CardContent>
              </Card>
            ) : (
              approvals.map((approval, index) => (
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
                        <span className="text-sm font-semibold text-violet-400">AI Security Analysis</span>
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
                        Approve (Super Admin)
                      </Button>
                      <Button 
                        onClick={() => handleRejectRole(approval.id)}
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {approval.status !== 'pending' && approval.reviewedBy && (
                    <div className="text-sm text-slate-500">
                      {approval.status === 'approved' ? 'Approved' : 'Rejected'} by {approval.reviewedBy} on {approval.reviewedAt?.toLocaleDateString()}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-400" />
                Permission Grant/Revoke Audit Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {auditLog.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`p-4 rounded-lg border ${
                        entry.action === 'permission_granted' 
                          ? 'bg-emerald-500/5 border-emerald-500/30'
                          : entry.action === 'permission_revoked'
                            ? 'bg-red-500/5 border-red-500/30'
                            : 'bg-violet-500/5 border-violet-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            entry.action === 'permission_granted' 
                              ? 'bg-emerald-500/20'
                              : entry.action === 'permission_revoked'
                                ? 'bg-red-500/20'
                                : 'bg-violet-500/20'
                          }`}>
                            {entry.action === 'permission_granted' ? (
                              <Unlock className="w-4 h-4 text-emerald-400" />
                            ) : entry.action === 'permission_revoked' ? (
                              <Lock className="w-4 h-4 text-red-400" />
                            ) : (
                              <Plus className="w-4 h-4 text-violet-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">{entry.roleName}</span>
                              {entry.module && entry.permission && (
                                <Badge variant="outline" className="text-xs bg-slate-700/30 border-slate-600">
                                  {entry.module}.{entry.permission}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-400">
                              {entry.action === 'permission_granted' ? 'Permission granted' : 
                               entry.action === 'permission_revoked' ? 'Permission revoked' : 
                               'Role created'} by <span className="text-white">{entry.performedBy}</span>
                            </p>
                            {entry.reason && (
                              <p className="text-xs text-slate-500 mt-1">Reason: {entry.reason}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-slate-500">
                          {entry.performedAt.toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
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
              New roles are created with ZERO permissions. Super Admin must grant permissions based on workload.
            </DialogDescription>
          </DialogHeader>

          {/* Default Lock Warning */}
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="py-3">
              <div className="flex items-center gap-2 text-sm text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>This role will start with NO permissions (Default-Lock Model)</span>
              </div>
            </CardContent>
          </Card>
          
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
                placeholder="Describe the role's purpose..."
                className="bg-slate-800 border-slate-700"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Scope Level</Label>
                <Select 
                  value={newRole.scopeLevel} 
                  onValueChange={(v) => setNewRole({ ...newRole, scopeLevel: v as any })}
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
                <Label className="text-slate-300">Hierarchy Level (1-99)</Label>
                <Input
                  type="number"
                  min={1}
                  max={99}
                  value={newRole.hierarchyLevel}
                  onChange={(e) => setNewRole({ ...newRole, hierarchyLevel: parseInt(e.target.value) || 30 })}
                  className="bg-slate-800 border-slate-700"
                />
                <p className="text-xs text-slate-500">100 is reserved for Super Admin</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-slate-600">
              Cancel
            </Button>
            <Button onClick={handleCreateRole} className="bg-violet-600 hover:bg-violet-500">
              <Plus className="w-4 h-4 mr-2" />
              Create Role (Zero Permissions)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grant Permission Dialog */}
      <AlertDialog open={isGrantDialogOpen} onOpenChange={setIsGrantDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <Unlock className="w-5 h-5 text-emerald-400" />
              Grant Permission
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              You are about to grant <span className="text-emerald-400 font-semibold">{pendingGrant?.module}.{pendingGrant?.permission}</span> to this role. 
              This action requires a reason and will be logged.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Label className="text-slate-300">Reason for granting permission *</Label>
            <Textarea
              value={grantReason}
              onChange={(e) => setGrantReason(e.target.value)}
              placeholder="e.g., Workload increase requires delegation of this permission..."
              className="bg-slate-800 border-slate-700 mt-2"
              rows={3}
            />
            <p className="text-xs text-slate-500 mt-2">This reason will be recorded in the audit log.</p>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={grantPermission}
              disabled={!grantReason.trim()}
              className="bg-emerald-600 hover:bg-emerald-500"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Grant Permission
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoleManagerComplete;
