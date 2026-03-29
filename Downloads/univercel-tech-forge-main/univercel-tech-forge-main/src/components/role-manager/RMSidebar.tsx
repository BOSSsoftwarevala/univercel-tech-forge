/**
 * ROLE MANAGER SIDEBAR
 * 10 Sections - Fixed width - Icon + Text
 */

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UserPlus,
  ShieldCheck,
  Users,
  Bell,
  GitBranch,
  Brain,
  FileText,
  Lock,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const COLORS = {
  bg: '#0a1628',
  bgGradient: 'linear-gradient(180deg, #0a1628 0%, #0d1b2a 100%)',
  border: '#1e3a5f',
  activeHighlight: '#2563eb',
  hoverBg: 'rgba(37, 99, 235, 0.15)',
  cardBg: 'rgba(30, 58, 95, 0.3)',
  text: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.7)',
  iconColor: '#60a5fa',
};

interface NavItem {
  id: string;
  label: string;
  badge?: number;
}

interface SidebarSection {
  id: string;
  label: string;
  icon: React.ElementType;
  items: NavItem[];
}

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    id: 'overview',
    label: '1. Role Overview',
    icon: LayoutDashboard,
    items: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'role-statistics', label: 'Role Statistics' },
      { id: 'active-roles', label: 'Active Roles' },
      { id: 'inactive-roles', label: 'Inactive / Suspended Roles' },
    ],
  },
  {
    id: 'creation',
    label: '2. Role Creation',
    icon: UserPlus,
    items: [
      { id: 'create-role', label: 'Create New Role' },
      { id: 'clone-role', label: 'Clone Existing Role' },
      { id: 'ai-suggested', label: 'AI Suggested Role' },
      { id: 'role-templates', label: 'Role Templates' },
    ],
  },
  {
    id: 'permissions',
    label: '3. Permission Management',
    icon: ShieldCheck,
    items: [
      { id: 'permission-matrix', label: 'Permission Matrix' },
      { id: 'module-permissions', label: 'Module-Wise Permissions' },
      { id: 'button-permissions', label: 'Button-Level Permissions' },
      { id: 'crud-control', label: 'Read/Write/Edit/Delete Control' },
      { id: 'export-permissions', label: 'Export Permission Map' },
    ],
  },
  {
    id: 'assignment',
    label: '4. Role Assignment',
    icon: Users,
    items: [
      { id: 'assign-user', label: 'Assign Role to User' },
      { id: 'bulk-assignment', label: 'Bulk Role Assignment' },
      { id: 'role-department', label: 'Role by Department' },
      { id: 'role-region', label: 'Role by Region' },
      { id: 'temporary-access', label: 'Temporary Role Access' },
    ],
  },
  {
    id: 'approvals',
    label: '5. Approvals & Alerts',
    icon: Bell,
    items: [
      { id: 'pending-approvals', label: 'Pending Role Approvals', badge: 5 },
      { id: 'permission-requests', label: 'Permission Change Requests', badge: 3 },
      { id: 'emergency-requests', label: 'Emergency Access Requests', badge: 1 },
      { id: 'auto-expire', label: 'Auto-Expire Alerts', badge: 2 },
      { id: 'high-risk-alerts', label: 'High-Risk Permission Alert', badge: 4 },
    ],
  },
  {
    id: 'hierarchy',
    label: '6. Role Hierarchy',
    icon: GitBranch,
    items: [
      { id: 'super-admin-roles', label: 'Super Admin Roles' },
      { id: 'admin-roles', label: 'Admin Roles' },
      { id: 'manager-roles', label: 'Manager Roles' },
      { id: 'staff-roles', label: 'Staff Roles' },
      { id: 'custom-roles', label: 'Custom Roles' },
    ],
  },
  {
    id: 'ai-control',
    label: '7. AI Role Control',
    icon: Brain,
    items: [
      { id: 'ai-analyzer', label: 'AI Role Analyzer' },
      { id: 'risk-detection', label: 'Risk Detection' },
      { id: 'over-permission', label: 'Over-Permission Warning' },
      { id: 'compliance-suggestions', label: 'Compliance Suggestions' },
      { id: 'audit-flags', label: 'Audit Flags' },
    ],
  },
  {
    id: 'audit',
    label: '8. Audit & Logs',
    icon: FileText,
    items: [
      { id: 'role-change-logs', label: 'Role Change Logs' },
      { id: 'permission-history', label: 'Permission Edit History' },
      { id: 'user-role-mapping', label: 'User-Role Mapping Logs' },
      { id: 'export-logs', label: 'Export Logs' },
    ],
  },
  {
    id: 'security',
    label: '9. Security & Compliance',
    icon: Lock,
    items: [
      { id: 'policy-enforcement', label: 'Policy Enforcement' },
      { id: 'global-rules', label: 'GDPR / IT Act / Global Rules' },
      { id: 'restricted-lock', label: 'Restricted Role Lock' },
      { id: 'freeze-mode', label: 'Role Freeze Mode' },
    ],
  },
  {
    id: 'settings',
    label: '10. Settings',
    icon: Settings,
    items: [
      { id: 'default-settings', label: 'Default Role Settings' },
      { id: 'naming-rules', label: 'Role Naming Rules' },
      { id: 'approval-flow', label: 'Approval Flow Config' },
      { id: 'lock-critical', label: 'Lock Critical Roles' },
    ],
  },
];

interface RMSidebarProps {
  activeSection: string;
  activeItem: string;
  onNavigate: (sectionId: string, itemId: string) => void;
  onLogout?: () => void;
}

export const RMSidebar = memo<RMSidebarProps>(({
  activeSection,
  activeItem,
  onNavigate,
  onLogout,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['overview'])
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  return (
    <div
      className="h-screen w-[280px] flex flex-col border-r"
      style={{
        background: COLORS.bgGradient,
        borderColor: COLORS.border,
      }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: COLORS.border }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: COLORS.activeHighlight }}
          >
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Role Manager</h2>
            <p className="text-xs" style={{ color: COLORS.textMuted }}>
              Permissions & Access Control
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-1">
          {SIDEBAR_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSections.has(section.id);
            const isActiveSection = activeSection === section.id;
            const totalBadge = section.items.reduce((sum, item) => sum + (item.badge || 0), 0);

            return (
              <div key={section.id}>
                <motion.button
                  whileHover={{ x: 2 }}
                  onClick={() => toggleSection(section.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all",
                    isActiveSection && "ring-1 ring-blue-400/30"
                  )}
                  style={{
                    background: isActiveSection ? COLORS.hoverBg : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className="w-4 h-4"
                      style={{ color: isActiveSection ? COLORS.activeHighlight : COLORS.iconColor }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: isActiveSection ? '#fff' : COLORS.textMuted }}
                    >
                      {section.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {totalBadge > 0 && (
                      <Badge
                        variant="destructive"
                        className="h-5 px-1.5 text-xs"
                      >
                        {totalBadge}
                      </Badge>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" style={{ color: COLORS.textMuted }} />
                    ) : (
                      <ChevronRight className="w-4 h-4" style={{ color: COLORS.textMuted }} />
                    )}
                  </div>
                </motion.button>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 mt-1 space-y-0.5"
                  >
                    {section.items.map((item) => {
                      const isActive = activeSection === section.id && activeItem === item.id;

                      return (
                        <motion.button
                          key={item.id}
                          whileHover={{ x: 2 }}
                          onClick={() => onNavigate(section.id, item.id)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-all",
                            isActive && "ring-1 ring-blue-400/20"
                          )}
                          style={{
                            background: isActive ? COLORS.activeHighlight : 'transparent',
                          }}
                        >
                          <span
                            className="text-sm"
                            style={{ color: isActive ? '#fff' : COLORS.textMuted }}
                          >
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge
                              variant={isActive ? "secondary" : "destructive"}
                              className="h-5 px-1.5 text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Logout */}
      {onLogout && (
        <div className="p-3 border-t" style={{ borderColor: COLORS.border }}>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
});

RMSidebar.displayName = 'RMSidebar';
