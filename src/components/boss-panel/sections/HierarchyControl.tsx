import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  User, 
  ChevronRight, 
  ChevronDown,
  Shield,
  Globe,
  MapPin,
  Building,
  Users,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HierarchyNode {
  id: string;
  name: string;
  role: string;
  icon: React.ElementType;
  status: 'active' | 'inactive' | 'suspended';
  scope?: string;
  assignedCount?: number;
  children?: HierarchyNode[];
}

const hierarchyData: HierarchyNode = {
  id: 'boss',
  name: 'Boss / Owner',
  role: 'Supreme Authority',
  icon: Crown,
  status: 'active',
  scope: 'Global',
  assignedCount: 1,
  children: [
    {
      id: 'ceo',
      name: 'CEO',
      role: 'Chief Executive',
      icon: User,
      status: 'active',
      scope: 'Global',
      assignedCount: 1,
    },
    {
      id: 'super-admins',
      name: 'Super Admins',
      role: 'System Administrators',
      icon: Shield,
      status: 'active',
      scope: 'Multi-Region',
      assignedCount: 12,
      children: [
        {
          id: 'continent-admin',
          name: 'Continent Admins',
          role: 'Regional Authority',
          icon: Globe,
          status: 'active',
          scope: 'Continent',
          assignedCount: 5,
          children: [
            {
              id: 'country-admin',
              name: 'Country Admins',
              role: 'Country Management',
              icon: MapPin,
              status: 'active',
              scope: 'Country',
              assignedCount: 47,
              children: [
                {
                  id: 'franchise',
                  name: 'Franchises',
                  role: 'Business Operations',
                  icon: Building,
                  status: 'active',
                  scope: 'Local',
                  assignedCount: 234,
                },
                {
                  id: 'reseller',
                  name: 'Resellers',
                  role: 'Sales Partners',
                  icon: Users,
                  status: 'active',
                  scope: 'Local',
                  assignedCount: 567,
                },
                {
                  id: 'lead-manager',
                  name: 'Lead Managers',
                  role: 'Lead Operations',
                  icon: Users,
                  status: 'active',
                  scope: 'Local',
                  assignedCount: 189,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  suspended: 'bg-red-500/20 text-red-400 border-red-500/30',
};

function TreeNode({
  node,
  level = 0,
  selectedId,
  onSelect,
}: {
  node: HierarchyNode;
  level?: number;
  selectedId: string | null;
  onSelect: (node: HierarchyNode) => void;
}) {
  const [expanded, setExpanded] = useState(level < 2);
  const Icon = node.icon;
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <div className="select-none">
      <motion.div
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
          isSelected ? "bg-amber-500/20 border border-amber-500/30" : "hover:bg-white/5"
        )}
        style={{ paddingLeft: `${level * 24 + 8}px` }}
        onClick={() => onSelect(node)}
        role="button"
        aria-pressed={isSelected}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(node);
          }
        }}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="p-1 hover:bg-white/10 rounded"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-white/50" />
            ) : (
              <ChevronRight className="w-4 h-4 text-white/50" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-6" />}

        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            level === 0
              ? "bg-amber-500/20 text-amber-400"
              : isSelected
                ? "bg-amber-500/15 text-amber-300"
                : "bg-white/10 text-white/60"
          )}
        >
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1">
          <div className="text-sm font-medium text-white">{node.name}</div>
          <div className="text-[10px] text-white/50">{node.role}</div>
        </div>

        <Badge className={`${statusColors[node.status]} border text-[10px]`}>
          {node.assignedCount}
        </Badge>
      </motion.div>

      {hasChildren && expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function HierarchyControl() {
  const [selectedNode, setSelectedNode] = useState<HierarchyNode | null>(hierarchyData);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Hierarchy Control</h1>
        <p className="text-white/50 text-sm">View and monitor organizational structure</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tree View */}
        <Card className="bg-[#12121a] border-white/10 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              Organizational Tree
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              <TreeNode
                node={hierarchyData}
                selectedId={selectedNode?.id ?? null}
                onSelect={setSelectedNode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Detail Panel */}
        <Card className="bg-[#12121a] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              Role Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <selectedNode.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedNode.name}</h3>
                    <p className="text-sm text-white/50">{selectedNode.role}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex justify-between">
                    <span className="text-white/50 text-sm">Status</span>
                    <Badge className={`${statusColors[selectedNode.status]} border`}>
                      {selectedNode.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 text-sm">Scope</span>
                    <span className="text-white text-sm">{selectedNode.scope}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 text-sm">Assigned Count</span>
                    <span className="text-white text-sm">{selectedNode.assignedCount}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-sm font-medium text-white/70 mb-2">Quick Audit</h4>
                  <div className="text-xs text-white/40 space-y-1">
                    <p>• Last activity: 2 minutes ago</p>
                    <p>• Active sessions: 3</p>
                    <p>• Risk level: Low</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-white/40">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a role to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
