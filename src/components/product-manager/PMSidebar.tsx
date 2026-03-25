import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MonitorPlay,
  DollarSign,
  Warehouse,
  ShoppingCart,
  BarChart3,
  Activity,
  Settings,
  ChevronRight,
  ChevronDown,
  Layers,
  Grid3X3,
  Microscope,
  Atom,
  Lock,
  Shield,
  Cpu,
  Server,
  Eye,
  Copy,
  Download,
  Edit3,
  Globe2,
  Upload,
  FileCode,
  Archive,
  Rocket,
  GitBranch,
  RotateCcw,
  StopCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
  Zap,
  Key,
  Link2,
  Timer,
  ShieldAlert,
  History,
  ClipboardList,
  Bell,
  User,
  LogOut,
  Box,
  Code,
  ToggleLeft,
  UserCheck,
} from 'lucide-react';

interface PMSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  stats?: {
    totalProducts: number;
    activeDemos: number;
    pendingOrders: number;
    pendingDeployments?: number;
    criticalIssues?: number;
  };
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  children?: { id: string; label: string; icon: React.ElementType; badge?: number | string }[];
  locked?: boolean;
}

const menuItems: MenuItem[] = [
  // 1. DASHBOARD
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  
  // 2. SOFTWARE PRODUCTS (CORE)
  { 
    id: 'software-products', 
    label: 'Software Products', 
    icon: Package,
    children: [
      { id: 'all-products', label: 'All Software', icon: Box },
      { id: 'active-products', label: 'Active', icon: CheckCircle2 },
      { id: 'development-products', label: 'In Development', icon: Code },
      { id: 'deployed-products', label: 'Deployed', icon: Rocket },
      { id: 'locked-products', label: 'Locked', icon: Lock },
      { id: 'archived-products', label: 'Archived', icon: Archive },
      { id: 'software-profile', label: 'Software Profile', icon: FileText },
    ]
  },
  
  // 3. PRODUCT STRUCTURE (MANDATORY HIERARCHY)
  { 
    id: 'product-structure', 
    label: 'Product Structure', 
    icon: FolderTree,
    children: [
      { id: 'main-category', label: 'Category', icon: Layers },
      { id: 'sub-category', label: 'Sub-Category', icon: Grid3X3 },
      { id: 'micro-category', label: 'Micro-Category', icon: Microscope },
      { id: 'nano-category', label: 'Nano-Category', icon: Atom },
      { id: 'feature-binding', label: 'Feature Binding', icon: Link2 },
    ]
  },
  
  // 4. MODULE MANAGEMENT
  { 
    id: 'module-management', 
    label: 'Module Management', 
    icon: Cpu,
    children: [
      { id: 'core-modules', label: 'Core Modules', icon: Cpu },
      { id: 'optional-modules', label: 'Optional Modules', icon: ToggleLeft },
      { id: 'role-modules', label: 'Role-Based Modules', icon: UserCheck },
      { id: 'locked-modules', label: 'Locked Modules', icon: Lock },
      { id: 'disabled-modules', label: 'Disabled Modules', icon: StopCircle },
    ]
  },
  
  // 5. ACCESS & CONTROL (CRITICAL)
  { 
    id: 'access-control', 
    label: 'Access & Control', 
    icon: Shield,
    children: [
      { id: 'view-permission', label: 'View Permission', icon: Eye },
      { id: 'copy-permission', label: 'Copy Permission', icon: Copy },
      { id: 'download-permission', label: 'Download Permission', icon: Download },
      { id: 'edit-permission', label: 'Edit Permission', icon: Edit3 },
      { id: 'role-visibility', label: 'Role Visibility', icon: UserCheck },
      { id: 'country-control', label: 'Country/Franchise', icon: Globe2 },
    ]
  },
  
  // 6. FILE & BUILD MANAGEMENT
  { 
    id: 'file-build', 
    label: 'File & Build', 
    icon: FileCode,
    children: [
      { id: 'upload-build', label: 'Upload Build Files', icon: Upload },
      { id: 'apk-builds', label: 'APK Builds', icon: Package },
      { id: 'web-builds', label: 'Web Builds', icon: Globe2 },
      { id: 'assets', label: 'Assets', icon: Archive },
      { id: 'file-lock', label: 'File Lock', icon: Lock },
      { id: 'view-only-mode', label: 'View-Only Mode', icon: Eye },
      { id: 'version-history', label: 'Version History', icon: History },
    ]
  },
  
  // 7. DEPLOYMENT CONTROL
  { 
    id: 'deployment-control', 
    label: 'Deployment Control', 
    icon: Rocket,
    children: [
      { id: 'server-assignment', label: 'Server Assignment', icon: Server },
      { id: 'environment-select', label: 'Environment Select', icon: GitBranch },
      { id: 'client-deploy', label: '🚀 Client Deploy', icon: Rocket },
      { id: 'deploy', label: 'Deploy', icon: Rocket },
      { id: 'rollback', label: 'Rollback', icon: RotateCcw },
      { id: 'stop-deployment', label: 'Stop Deployment', icon: StopCircle },
      { id: 'deployment-logs', label: 'Deployment Logs', icon: FileText },
    ]
  },
  
  // 8. APPROVAL FLOW (INTERNAL)
  { 
    id: 'approval-flow', 
    label: 'Approval Flow', 
    icon: CheckCircle2,
    children: [
      { id: 'deployment-approval', label: 'Deployment Approval', icon: Rocket },
      { id: 'version-approval', label: 'Version Approval', icon: GitBranch },
      { id: 'module-approval', label: 'Module Approval', icon: Cpu },
      { id: 'emergency-override', label: 'Emergency Override', icon: AlertCircle },
    ]
  },
  
  // 9. SECURITY & LICENSE
  { 
    id: 'security-license', 
    label: 'Security & License', 
    icon: ShieldAlert,
    children: [
      { id: 'license-lock', label: 'License Lock', icon: Lock },
      { id: 'domain-lock', label: 'Domain Lock', icon: Globe2 },
      { id: 'api-key-binding', label: 'API Key Binding', icon: Key },
      { id: 'expiry-control', label: 'Expiry Control', icon: Timer },
      { id: 'abuse-protection', label: 'Abuse Protection', icon: ShieldAlert },
    ]
  },
  
  // 10. ACTIVITY & AUDIT LOGS
  { 
    id: 'activity-logs', 
    label: 'Activity & Audit', 
    icon: Activity,
    children: [
      { id: 'product-changes', label: 'Product Changes', icon: Edit3 },
      { id: 'file-upload-logs', label: 'File Upload Logs', icon: Upload },
      { id: 'lock-unlock-history', label: 'Lock/Unlock History', icon: Lock },
      { id: 'deployment-history', label: 'Deployment History', icon: Rocket },
      { id: 'approval-history', label: 'Approval History', icon: CheckCircle2 },
    ]
  },
  
  // 11. REPORTS
  { 
    id: 'reports', 
    label: 'Reports', 
    icon: BarChart3,
    children: [
      { id: 'software-usage', label: 'Software Usage', icon: BarChart3 },
      { id: 'deployment-success', label: 'Deployment Success', icon: CheckCircle2 },
      { id: 'failure-reports', label: 'Failure Reports', icon: AlertCircle },
      { id: 'export-reports', label: 'Export (Admin)', icon: Download },
    ]
  },

  {
    id: 'github-integration',
    label: 'GitHub Integration',
    icon: Github,
    badge: 'AUTO',
  },
  
  // 12. DEV STUDIO (LIVE)
  {
    id: 'dev-studio',
    label: 'Dev Studio',
    icon: Code,
    badge: 'LIVE',
  },
  
  // 13. SETTINGS (LIMITED)
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings,
    children: [
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'security-settings', label: 'Security', icon: Shield },
      { id: 'profile', label: 'Profile', icon: User },
      { id: 'logout', label: 'Logout', icon: LogOut },
    ]
  },
];

const PMSidebar: React.FC<PMSidebarProps> = ({ activeSection, onSectionChange, stats }) => {
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['software-products']);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isActive = (id: string) => activeSection === id;
  const isChildActive = (item: MenuItem) => 
    item.children?.some(child => activeSection === child.id);

  const handleItemClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      toggleExpand(item.id);
    } else {
      onSectionChange(item.id);
      toast.success(`Navigated to ${item.label}`, {
        description: 'Section loaded successfully'
      });
    }
  };

  const handleChildClick = (childId: string, childLabel: string) => {
    onSectionChange(childId);
    toast.success(`Navigated to ${childLabel}`, {
      description: 'Section loaded successfully'
    });
  };

  return (
    <div className="w-72 border-r border-border/50 bg-card/30 backdrop-blur-xl flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Product & Deployment</h2>
            <p className="text-xs text-muted-foreground">Manager Control</p>
          </div>
        </div>
      </div>

      {/* Policy Badge */}
      <div className="p-3">
        <div className="p-2.5 bg-primary/10 border border-primary/30 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">FULL CRUD MODE</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Create • Edit • Delete • Deploy • Audit</p>
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="px-3 pb-3 grid grid-cols-3 gap-2">
          <div className="p-2 bg-secondary/50 rounded-lg text-center">
            <p className="text-base font-bold text-primary">{stats.totalProducts}</p>
            <p className="text-[8px] text-muted-foreground">Products</p>
          </div>
          <div className="p-2 bg-secondary/50 rounded-lg text-center">
            <p className="text-base font-bold text-amber-500">{stats.pendingDeployments || 0}</p>
            <p className="text-[8px] text-muted-foreground">Pending</p>
          </div>
          <div className="p-2 bg-secondary/50 rounded-lg text-center">
            <p className="text-base font-bold text-red-500">{stats.criticalIssues || 0}</p>
            <p className="text-[8px] text-muted-foreground">Critical</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.id);
            const active = isActive(item.id) || isChildActive(item);

            return (
              <div key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  disabled={item.locked}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all",
                    active
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : item.locked
                      ? "text-muted-foreground/50 cursor-not-allowed"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-[9px] h-4 px-1.5">
                      {item.badge}
                    </Badge>
                  )}
                  {item.locked && <Lock className="w-3 h-3" />}
                  {hasChildren && (
                    isExpanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  )}
                </button>

                {/* Children */}
                {hasChildren && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-4 mt-0.5 space-y-0.5 border-l border-border/30 pl-2"
                  >
                    {item.children?.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <button
                          key={child.id}
                          onClick={() => handleChildClick(child.id, child.label)}
                          className={cn(
                            "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[11px] transition-all",
                            isActive(child.id)
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                          )}
                        >
                          <ChildIcon className="w-3 h-3 shrink-0" />
                          <span className="truncate">{child.label}</span>
                          {child.badge && (
                            <Badge variant="secondary" className="text-[8px] h-3.5 px-1 ml-auto">
                              {child.badge}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="w-3 h-3 text-green-500 animate-pulse" />
          <span>System Active • v2.0</span>
        </div>
      </div>
    </div>
  );
};

export default PMSidebar;
