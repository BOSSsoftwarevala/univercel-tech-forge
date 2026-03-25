import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, Check, X, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import SuperAdminWireframeLayout from "@/components/super-admin-wireframe/SuperAdminWireframeLayout";

interface Role {
  id: string;
  name: string;
  description: string;
  scope: string;
  userCount: number;
}

interface Permission {
  id: string;
  code: string;
  description: string;
  category: string;
}

const roles: Role[] = [
  { id: "R001", name: "Super Admin", description: "Full system access", scope: "Global", userCount: 12 },
  { id: "R002", name: "Admin", description: "Regional management", scope: "Regional", userCount: 147 },
  { id: "R003", name: "Franchise Manager", description: "Franchise operations", scope: "Country", userCount: 892 },
  { id: "R004", name: "Support Agent", description: "Customer support", scope: "Regional", userCount: 234 },
  { id: "R005", name: "Developer", description: "Development access", scope: "Global", userCount: 56 },
  { id: "R006", name: "Marketing Manager", description: "Marketing operations", scope: "Regional", userCount: 45 },
];

const permissions: Permission[] = [
  { id: "P001", code: "user.view", description: "View users", category: "Users" },
  { id: "P002", code: "user.create", description: "Create users", category: "Users" },
  { id: "P003", code: "user.edit", description: "Edit users", category: "Users" },
  { id: "P004", code: "user.delete", description: "Delete users", category: "Users" },
  { id: "P005", code: "admin.view", description: "View admins", category: "Admins" },
  { id: "P006", code: "admin.create", description: "Create admins", category: "Admins" },
  { id: "P007", code: "security.view", description: "View security events", category: "Security" },
  { id: "P008", code: "security.manage", description: "Manage security", category: "Security" },
  { id: "P009", code: "rental.view", description: "View rentals", category: "Rentals" },
  { id: "P010", code: "rental.manage", description: "Manage rentals", category: "Rentals" },
];

// Permission matrix - which roles have which permissions
const permissionMatrix: Record<string, string[]> = {
  "R001": ["P001", "P002", "P003", "P004", "P005", "P006", "P007", "P008", "P009", "P010"], // Super Admin - all
  "R002": ["P001", "P002", "P003", "P005", "P007", "P009", "P010"], // Admin
  "R003": ["P001", "P009"], // Franchise Manager
  "R004": ["P001", "P007", "P009"], // Support Agent
  "R005": ["P001", "P005", "P007"], // Developer
  "R006": ["P001", "P009"], // Marketing Manager
};

const SuperAdminRoles = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const hasPermission = (roleId: string, permissionId: string) => {
    return permissionMatrix[roleId]?.includes(permissionId);
  };

  const rightPanelContent = selectedRole && (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold">{selectedRole.name}</h4>
        <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
      </div>
      <div className="space-y-2">
        <p className="text-sm"><span className="text-muted-foreground">Scope:</span> {selectedRole.scope}</p>
        <p className="text-sm"><span className="text-muted-foreground">Users:</span> {selectedRole.userCount}</p>
      </div>
      <div className="space-y-2">
        <h5 className="text-sm font-medium">Permissions</h5>
        <div className="space-y-1">
          {permissions.filter(p => hasPermission(selectedRole.id, p.id)).map(permission => (
            <div key={permission.id} className="flex items-center gap-2 p-2 bg-secondary/30 rounded text-sm">
              <Check className="w-4 h-4 text-neon-green" />
              <span>{permission.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <SuperAdminWireframeLayout
      activeSection="roles"
      rightPanelOpen={!!selectedRole}
      rightPanelContent={rightPanelContent}
      onRightPanelClose={() => setSelectedRole(null)}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Roles & Permissions</h1>
            <p className="text-muted-foreground">View-only permission matrix</p>
          </div>
          <Badge variant="outline" className="bg-neon-orange/10 text-neon-orange border-neon-orange/50">
            <Eye className="w-3 h-3 mr-1" />
            Read Only
          </Badge>
        </div>

        {/* Roles List */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              System Roles
            </CardTitle>
            <CardDescription>Click a role to view detailed permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role, index) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedRole(role)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedRole?.id === role.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-secondary/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{role.name}</h4>
                    <Badge variant="outline" className="text-xs">{role.scope}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                  <p className="text-xs text-muted-foreground">{role.userCount} users</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Permission Matrix */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
            <CardDescription>Overview of role permissions across the system</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <div className="min-w-[800px]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Permission</th>
                      {roles.map(role => (
                        <th key={role.id} className="text-center py-3 px-2 text-sm font-medium">
                          <Tooltip>
                            <TooltipTrigger className="cursor-help">
                              {role.name.split(" ")[0]}
                            </TooltipTrigger>
                            <TooltipContent>{role.name}</TooltipContent>
                          </Tooltip>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((permission, index) => (
                      <motion.tr
                        key={permission.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-border/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{permission.description}</span>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-3 h-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-mono text-xs">{permission.code}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </td>
                        {roles.map(role => (
                          <td key={role.id} className="text-center py-3 px-2">
                            {hasPermission(role.id, permission.id) ? (
                              <Check className="w-5 h-5 text-neon-green mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                            )}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </SuperAdminWireframeLayout>
  );
};

export default SuperAdminRoles;
