/**
 * ROLE MANAGER - PERMISSION MANAGEMENT SCREEN
 */

import { memo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShieldCheck,
  Grid3X3,
  Layers,
  MousePointer,
  FileDown,
  Eye,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

const MODULES = [
  { id: 'users', name: 'User Management', read: true, write: true, edit: true, delete: false },
  { id: 'roles', name: 'Role Management', read: true, write: false, edit: false, delete: false },
  { id: 'finance', name: 'Finance Module', read: true, write: true, edit: true, delete: true },
  { id: 'reports', name: 'Reports', read: true, write: false, edit: false, delete: false },
  { id: 'settings', name: 'System Settings', read: true, write: true, edit: true, delete: false },
  { id: 'leads', name: 'Lead Management', read: true, write: true, edit: true, delete: true },
  { id: 'products', name: 'Product Catalog', read: true, write: true, edit: true, delete: false },
  { id: 'support', name: 'Support Tickets', read: true, write: true, edit: true, delete: false },
];

interface RMPermissionsProps {
  activeItem: string;
}

export const RMPermissions = memo<RMPermissionsProps>(({ activeItem }) => {
  const [permissions, setPermissions] = useState(MODULES);

  const togglePermission = (moduleId: string, type: 'read' | 'write' | 'edit' | 'delete') => {
    setPermissions(prev =>
      prev.map(m =>
        m.id === moduleId ? { ...m, [type]: !m[type] } : m
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Permission Management</h1>
          <p className="text-sm text-slate-400">
            {activeItem === 'permission-matrix' && 'Complete permission matrix view'}
            {activeItem === 'module-permissions' && 'Module-wise permission settings'}
            {activeItem === 'button-permissions' && 'Button-level access control'}
            {activeItem === 'crud-control' && 'Read/Write/Edit/Delete controls'}
            {activeItem === 'export-permissions' && 'Export permission configuration'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-600">
            <FileDown className="w-4 h-4 mr-2" />
            Export Map
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Permission
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">156</p>
              <p className="text-sm text-slate-400">Total Permissions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-sm text-slate-400">Modules</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">89</p>
              <p className="text-sm text-slate-400">Button Actions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">42</p>
              <p className="text-sm text-slate-400">Active Roles</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permission Matrix */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-blue-400" />
            Permission Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Module</th>
                  <th className="text-center py-3 px-4 text-slate-400 text-sm font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="w-4 h-4" />
                      Read
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 text-slate-400 text-sm font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <Plus className="w-4 h-4" />
                      Write
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 text-slate-400 text-sm font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <Pencil className="w-4 h-4" />
                      Edit
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 text-slate-400 text-sm font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((module) => (
                  <tr key={module.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-3 px-4">
                      <span className="text-white font-medium">{module.name}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Checkbox
                        checked={module.read}
                        onCheckedChange={() => togglePermission(module.id, 'read')}
                        className="border-green-500 data-[state=checked]:bg-green-500"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Checkbox
                        checked={module.write}
                        onCheckedChange={() => togglePermission(module.id, 'write')}
                        className="border-blue-500 data-[state=checked]:bg-blue-500"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Checkbox
                        checked={module.edit}
                        onCheckedChange={() => togglePermission(module.id, 'edit')}
                        className="border-yellow-500 data-[state=checked]:bg-yellow-500"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Checkbox
                        checked={module.delete}
                        onCheckedChange={() => togglePermission(module.id, 'delete')}
                        className="border-red-500 data-[state=checked]:bg-red-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

RMPermissions.displayName = 'RMPermissions';
