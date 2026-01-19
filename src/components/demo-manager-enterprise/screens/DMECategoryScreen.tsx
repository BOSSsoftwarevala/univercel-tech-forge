/**
 * CATEGORY CONTROL SCREEN
 * Category → Sub → Micro → Nano levels
 * Actions: Enable/Disable, Fix Missing, Assign AI
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  ChevronRight,
  ChevronDown,
  FolderTree,
  Building2,
  Hospital,
  Home,
  ShoppingCart,
  Truck,
  Landmark,
  Bot,
  Wrench,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface CategoryNode {
  id: string;
  name: string;
  icon?: any;
  enabled: boolean;
  children?: CategoryNode[];
  type: 'category' | 'sub' | 'micro' | 'nano';
}

const categoryTree: CategoryNode[] = [
  {
    id: 'education',
    name: 'Education',
    icon: Building2,
    enabled: true,
    type: 'category',
    children: [
      {
        id: 'school',
        name: 'School',
        enabled: true,
        type: 'sub',
        children: [
          {
            id: 'student-panel',
            name: 'Student Panel',
            enabled: true,
            type: 'micro',
            children: [
              { id: 'attendance-btn', name: 'Attendance Button', enabled: true, type: 'nano' },
              { id: 'fee-btn', name: 'Fee Button', enabled: true, type: 'nano' },
              { id: 'report-btn', name: 'Report Button', enabled: false, type: 'nano' },
            ]
          },
          { id: 'teacher-panel', name: 'Teacher Panel', enabled: true, type: 'micro' },
          { id: 'admin-panel', name: 'Admin Panel', enabled: true, type: 'micro' },
        ]
      },
      { id: 'college', name: 'College', enabled: true, type: 'sub' },
      { id: 'university', name: 'University', enabled: false, type: 'sub' },
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: Hospital,
    enabled: true,
    type: 'category',
    children: [
      { id: 'clinic', name: 'Clinic', enabled: true, type: 'sub' },
      { id: 'hospital', name: 'Hospital', enabled: true, type: 'sub' },
    ]
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: Home,
    enabled: true,
    type: 'category',
    children: [
      { id: 'builder', name: 'Builder', enabled: true, type: 'sub' },
      { id: 'broker', name: 'Broker', enabled: true, type: 'sub' },
    ]
  },
  {
    id: 'retail',
    name: 'Retail / POS',
    icon: ShoppingCart,
    enabled: true,
    type: 'category',
    children: [
      { id: 'retail-store', name: 'Retail', enabled: true, type: 'sub' },
      { id: 'wholesale', name: 'Wholesale', enabled: true, type: 'sub' },
    ]
  },
  {
    id: 'logistics',
    name: 'Logistics',
    icon: Truck,
    enabled: true,
    type: 'category',
  },
  {
    id: 'government',
    name: 'Government',
    icon: Landmark,
    enabled: false,
    type: 'category',
  },
];

interface TreeNodeProps {
  node: CategoryNode;
  level: number;
  onToggle: (id: string) => void;
  onAction: (id: string, action: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, level, onToggle, onAction }) => {
  const [expanded, setExpanded] = useState(level === 0);
  const Icon = node.icon || FolderTree;
  const hasChildren = node.children && node.children.length > 0;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'category': return 'text-primary';
      case 'sub': return 'text-neon-teal';
      case 'micro': return 'text-neon-green';
      case 'nano': return 'text-muted-foreground';
      default: return '';
    }
  };

  return (
    <div className="select-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-secondary/30 transition-colors ${
          level === 0 ? 'bg-secondary/20' : ''
        }`}
        style={{ marginLeft: `${level * 16}px` }}
      >
        {hasChildren ? (
          <button onClick={() => setExpanded(!expanded)} className="p-0.5">
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        <Icon className={`w-4 h-4 ${getTypeColor(node.type)}`} />
        <span className={`flex-1 text-sm ${node.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
          {node.name}
        </span>

        <Badge variant="outline" className="text-[10px] px-1.5">
          {node.type}
        </Badge>

        <Switch
          checked={node.enabled}
          onCheckedChange={() => onToggle(node.id)}
          className="h-4 w-8"
        />

        <div className="flex items-center gap-1 ml-2">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onAction(node.id, 'Fix')}>
            <Wrench className="w-3 h-3 text-neon-orange" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onAction(node.id, 'AI')}>
            <Bot className="w-3 h-3 text-primary" />
          </Button>
        </div>
      </motion.div>

      {expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              onAction={onAction}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const DMECategoryScreen: React.FC = () => {
  const [categories, setCategories] = useState(categoryTree);

  const handleToggle = (id: string) => {
    toast.success(`Toggled category: ${id}`);
  };

  const handleAction = (id: string, action: string) => {
    toast.success(`${action} action for: ${id}`);
  };

  const stats = {
    totalCategories: 6,
    enabled: 5,
    disabled: 1,
    issues: 3
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Category Control</h1>
          <p className="text-muted-foreground text-sm">Manage Category → Sub → Micro → Nano levels</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.totalCategories}</p>
            <p className="text-xs text-muted-foreground">Total Categories</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-neon-green">{stats.enabled}</p>
            <p className="text-xs text-muted-foreground">Enabled</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{stats.disabled}</p>
            <p className="text-xs text-muted-foreground">Disabled</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-neon-orange">{stats.issues}</p>
            <p className="text-xs text-muted-foreground">Missing Items</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Tree */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-primary" />
            Category Hierarchy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {categories.map((category) => (
              <TreeNode
                key={category.id}
                node={category}
                level={0}
                onToggle={handleToggle}
                onAction={handleAction}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
