/**
 * ROLE MANAGER - ROLE HIERARCHY SCREEN
 */

import { memo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GitBranch,
  ChevronRight,
  ChevronDown,
  Shield,
  Users,
  Crown,
  UserCog,
  User,
  Sparkles,
} from "lucide-react";

interface HierarchyNode {
  id: string;
  name: string;
  users: number;
  children?: HierarchyNode[];
}

const HIERARCHY: HierarchyNode[] = [
  {
    id: 'super-admin',
    name: 'Super Admin Roles',
    users: 5,
    children: [
      { id: 'boss', name: 'Boss / Owner', users: 1 },
      { id: 'ceo', name: 'CEO', users: 1 },
      { id: 'continent-admin', name: 'Continent Admin', users: 3 },
    ],
  },
  {
    id: 'admin',
    name: 'Admin Roles',
    users: 15,
    children: [
      { id: 'country-head', name: 'Country Head', users: 5 },
      { id: 'region-manager', name: 'Region Manager', users: 10 },
    ],
  },
  {
    id: 'manager',
    name: 'Manager Roles',
    users: 45,
    children: [
      { id: 'franchise-mgr', name: 'Franchise Manager', users: 12 },
      { id: 'sales-mgr', name: 'Sales Manager', users: 18 },
      { id: 'support-mgr', name: 'Support Manager', users: 8 },
      { id: 'finance-mgr', name: 'Finance Manager', users: 7 },
    ],
  },
  {
    id: 'staff',
    name: 'Staff Roles',
    users: 280,
    children: [
      { id: 'sales-exec', name: 'Sales Executive', users: 120 },
      { id: 'support-agent', name: 'Support Agent', users: 85 },
      { id: 'content-editor', name: 'Content Editor', users: 25 },
      { id: 'analyst', name: 'Analyst', users: 50 },
    ],
  },
  {
    id: 'custom',
    name: 'Custom Roles',
    users: 23,
    children: [
      { id: 'temp-access', name: 'Temporary Access', users: 8 },
      { id: 'partner-view', name: 'Partner View', users: 10 },
      { id: 'audit-only', name: 'Audit Only', users: 5 },
    ],
  },
];

const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'super-admin': return Crown;
    case 'admin': return Shield;
    case 'manager': return UserCog;
    case 'staff': return User;
    case 'custom': return Sparkles;
    default: return Users;
  }
};

const getCategoryColor = (id: string) => {
  switch (id) {
    case 'super-admin': return 'text-purple-400';
    case 'admin': return 'text-blue-400';
    case 'manager': return 'text-green-400';
    case 'staff': return 'text-cyan-400';
    case 'custom': return 'text-yellow-400';
    default: return 'text-slate-400';
  }
};

interface RMHierarchyProps {
  activeItem: string;
}

export const RMHierarchy = memo<RMHierarchyProps>(({ activeItem }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(['super-admin', 'admin', 'manager', 'staff', 'custom'])
  );

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Role Hierarchy</h1>
          <p className="text-sm text-slate-400">
            {activeItem === 'super-admin-roles' && 'Super Admin level roles'}
            {activeItem === 'admin-roles' && 'Administrator level roles'}
            {activeItem === 'manager-roles' && 'Manager level roles'}
            {activeItem === 'staff-roles' && 'Staff level roles'}
            {activeItem === 'custom-roles' && 'Custom defined roles'}
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <GitBranch className="w-4 h-4 mr-2" />
          Add Level
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {HIERARCHY.map((category) => {
          const Icon = getCategoryIcon(category.id);
          const color = getCategoryColor(category.id);
          return (
            <Card key={category.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className={`w-6 h-6 ${color}`} />
                <div>
                  <p className="text-xl font-bold text-white">{category.users}</p>
                  <p className="text-xs text-slate-400">{category.name}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Hierarchy Tree */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-blue-400" />
            Role Hierarchy Tree
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {HIERARCHY.map((category) => {
              const Icon = getCategoryIcon(category.id);
              const color = getCategoryColor(category.id);
              const isExpanded = expandedNodes.has(category.id);

              return (
                <div key={category.id} className="space-y-1">
                  <button
                    onClick={() => toggleNode(category.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-blue-500/30 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span className="text-white font-medium flex-1 text-left">{category.name}</span>
                    <Badge variant="outline" className="text-slate-400 border-slate-600">
                      {category.users} users
                    </Badge>
                    <Badge variant="outline" className={color}>
                      {category.children?.length || 0} roles
                    </Badge>
                  </button>

                  {isExpanded && category.children && (
                    <div className="ml-8 space-y-1">
                      {category.children.map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/30 border border-slate-700/50"
                        >
                          <div className="w-1 h-8 bg-slate-700 rounded-full" />
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300 flex-1">{child.name}</span>
                          <Badge variant="outline" className="text-slate-400 border-slate-600">
                            {child.users} users
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

RMHierarchy.displayName = 'RMHierarchy';
