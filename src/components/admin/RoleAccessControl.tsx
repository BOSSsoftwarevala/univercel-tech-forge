import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Users, 
  Building2, 
  Code2, 
  HeadphonesIcon,
  Megaphone,
  TrendingUp,
  Search,
  Wallet,
  Eye,
  Edit,
  Lock,
  Unlock,
  Check,
  X,
  Crown,
  UserCog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Role {
  id: string;
  name: string;
  icon: any;
  color: string;
  userCount: number;
  description: string;
}

interface Permission {
  id: string;
  name: string;
  module: string;
}

const roles: Role[] = [
  { id: "super_admin", name: "Super Admin", icon: Crown, color: "from-primary to-neon-purple", userCount: 2, description: "Full system access" },
  { id: "franchise", name: "Franchise Owner", icon: Building2, color: "from-neon-cyan to-neon-teal", userCount: 42, description: "Regional management" },
  { id: "reseller", name: "Reseller", icon: Users, color: "from-neon-teal to-neon-green", userCount: 156, description: "Sales & commissions" },
  { id: "developer", name: "Developer", icon: Code2, color: "from-neon-purple to-neon-blue", userCount: 28, description: "Task execution" },
  { id: "support", name: "Support Agent", icon: HeadphonesIcon, color: "from-neon-red to-neon-orange", userCount: 12, description: "Customer support" },
  { id: "influencer", name: "Influencer", icon: Megaphone, color: "from-neon-purple to-neon-cyan", userCount: 89, description: "Marketing & promotion" },
  { id: "sales", name: "Sales Manager", icon: TrendingUp, color: "from-neon-orange to-neon-red", userCount: 15, description: "Lead management" },
  { id: "seo", name: "SEO Specialist", icon: Search, color: "from-neon-blue to-neon-cyan", userCount: 8, description: "SEO & content" },
  { id: "finance", name: "Finance Manager", icon: Wallet, color: "from-neon-teal to-neon-blue", userCount: 3, description: "Financial control" },
];

const modules = [
  "Dashboard", "Franchise", "Reseller", "Developer", "Support", 
  "SEO", "Influencer", "Finance", "Performance", "R&D", "Tasks", "Client Success"
];

const permissionMatrix: Record<string, Record<string, { view: boolean; edit: boolean; admin: boolean }>> = {
  super_admin: Object.fromEntries(modules.map(m => [m, { view: true, edit: true, admin: true }])),
  franchise: {
    Dashboard: { view: true, edit: false, admin: false },
    Franchise: { view: true, edit: true, admin: true },
    Reseller: { view: true, edit: false, admin: false },
    Developer: { view: false, edit: false, admin: false },
    Support: { view: true, edit: false, admin: false },
    SEO: { view: false, edit: false, admin: false },
    Influencer: { view: false, edit: false, admin: false },
    Finance: { view: true, edit: false, admin: false },
    Performance: { view: true, edit: false, admin: false },
    "R&D": { view: false, edit: false, admin: false },
    Tasks: { view: true, edit: true, admin: false },
    "Client Success": { view: true, edit: false, admin: false },
  },
  reseller: {
    Dashboard: { view: true, edit: false, admin: false },
    Franchise: { view: false, edit: false, admin: false },
    Reseller: { view: true, edit: true, admin: false },
    Developer: { view: false, edit: false, admin: false },
    Support: { view: false, edit: false, admin: false },
    SEO: { view: false, edit: false, admin: false },
    Influencer: { view: false, edit: false, admin: false },
    Finance: { view: true, edit: false, admin: false },
    Performance: { view: true, edit: false, admin: false },
    "R&D": { view: false, edit: false, admin: false },
    Tasks: { view: true, edit: false, admin: false },
    "Client Success": { view: false, edit: false, admin: false },
  },
  developer: {
    Dashboard: { view: true, edit: false, admin: false },
    Franchise: { view: false, edit: false, admin: false },
    Reseller: { view: false, edit: false, admin: false },
    Developer: { view: true, edit: true, admin: false },
    Support: { view: false, edit: false, admin: false },
    SEO: { view: false, edit: false, admin: false },
    Influencer: { view: false, edit: false, admin: false },
    Finance: { view: true, edit: false, admin: false },
    Performance: { view: true, edit: false, admin: false },
    "R&D": { view: true, edit: true, admin: false },
    Tasks: { view: true, edit: true, admin: false },
    "Client Success": { view: false, edit: false, admin: false },
  },
  support: Object.fromEntries(modules.map(m => [m, { view: m === "Support" || m === "Dashboard" || m === "Tasks", edit: m === "Support" || m === "Tasks", admin: false }])),
  influencer: Object.fromEntries(modules.map(m => [m, { view: m === "Influencer" || m === "Dashboard" || m === "Finance", edit: m === "Influencer", admin: false }])),
  sales: Object.fromEntries(modules.map(m => [m, { view: ["Dashboard", "Reseller", "Finance", "Tasks", "Client Success"].includes(m), edit: m === "Tasks", admin: false }])),
  seo: Object.fromEntries(modules.map(m => [m, { view: m === "SEO" || m === "Dashboard", edit: m === "SEO", admin: false }])),
  finance: Object.fromEntries(modules.map(m => [m, { view: true, edit: m === "Finance", admin: m === "Finance" }])),
};

const RoleAccessControl = () => {
  const [selectedRole, setSelectedRole] = useState<string>("super_admin");

  const currentPermissions = permissionMatrix[selectedRole] || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">Role-Based Access Control</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage permissions for each role across all modules</p>
        </div>
        <Button className="command-button-primary">
          <UserCog className="w-4 h-4 mr-2" />
          Create Custom Role
        </Button>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-3 gap-4">
        {roles.map((role, index) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          
          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedRole(role.id)}
              className={`glass-panel p-4 cursor-pointer transition-all duration-300 ${
                isSelected ? "border-primary/50 ring-2 ring-primary/20" : "hover:border-primary/30"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                {isSelected && (
                  <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50">
                    Selected
                  </Badge>
                )}
              </div>
              <h3 className="font-mono font-semibold text-foreground">{role.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{role.description}</p>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                <Users className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm font-mono text-primary">{role.userCount} users</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Permission Matrix */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel overflow-hidden"
      >
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-mono font-semibold text-foreground">
              Permission Matrix: {roles.find(r => r.id === selectedRole)?.name}
            </h2>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead className="font-mono">Module</TableHead>
              <TableHead className="font-mono text-center">
                <div className="flex items-center justify-center gap-1">
                  <Eye className="w-4 h-4" />
                  View
                </div>
              </TableHead>
              <TableHead className="font-mono text-center">
                <div className="flex items-center justify-center gap-1">
                  <Edit className="w-4 h-4" />
                  Edit
                </div>
              </TableHead>
              <TableHead className="font-mono text-center">
                <div className="flex items-center justify-center gap-1">
                  <Lock className="w-4 h-4" />
                  Admin
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((module) => {
              const perms = currentPermissions[module] || { view: false, edit: false, admin: false };
              return (
                <TableRow key={module} className="border-border/30">
                  <TableCell className="font-medium">{module}</TableCell>
                  <TableCell className="text-center">
                    {perms.view ? (
                      <Check className="w-5 h-5 text-neon-green mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {perms.edit ? (
                      <Check className="w-5 h-5 text-neon-cyan mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {perms.admin ? (
                      <Check className="w-5 h-5 text-neon-purple mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </motion.div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-neon-green" />
          <span className="text-muted-foreground">View - Can access and view data</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-neon-cyan" />
          <span className="text-muted-foreground">Edit - Can modify data</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-neon-purple" />
          <span className="text-muted-foreground">Admin - Full module control</span>
        </div>
      </div>
    </div>
  );
};

export default RoleAccessControl;
