import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock,
  Eye,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Role {
  id: string;
  name: string;
  level: number;
  permissions: Record<string, boolean>;
  scope: string;
  dependsOn: string | null;
}

const roles: Role[] = [
  { id: 'boss', name: 'Boss / Owner', level: 0, permissions: { read: true, approve: true, lock: true, archive: true, edit: false, delete: false }, scope: 'Global', dependsOn: null },
  { id: 'ceo', name: 'CEO', level: 1, permissions: { read: true, approve: true, lock: false, archive: true, edit: true, delete: false }, scope: 'Global', dependsOn: 'boss' },
  { id: 'super-admin', name: 'Super Admin', level: 2, permissions: { read: true, approve: true, lock: false, archive: false, edit: true, delete: false }, scope: 'Multi-Region', dependsOn: 'ceo' },
  { id: 'continent-admin', name: 'Continent Admin', level: 3, permissions: { read: true, approve: true, lock: false, archive: false, edit: true, delete: false }, scope: 'Continent', dependsOn: 'super-admin' },
  { id: 'country-admin', name: 'Country Admin', level: 4, permissions: { read: true, approve: true, lock: false, archive: false, edit: true, delete: false }, scope: 'Country', dependsOn: 'continent-admin' },
  { id: 'franchise', name: 'Franchise', level: 5, permissions: { read: true, approve: false, lock: false, archive: false, edit: true, delete: false }, scope: 'Local', dependsOn: 'country-admin' },
  { id: 'reseller', name: 'Reseller', level: 6, permissions: { read: true, approve: false, lock: false, archive: false, edit: false, delete: false }, scope: 'Local', dependsOn: 'franchise' },
  { id: 'lead-manager', name: 'Lead Manager', level: 6, permissions: { read: true, approve: false, lock: false, archive: false, edit: true, delete: false }, scope: 'Local', dependsOn: 'country-admin' },
];

const permissionLabels = ['read', 'approve', 'lock', 'archive', 'edit', 'delete'];

export function RolesPermissions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Roles & Permissions</h1>
          <p className="text-white/50 text-sm">View-only role configuration matrix</p>
        </div>
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 flex items-center gap-1">
          <Lock className="w-3 h-3" />
          LOCKED
        </Badge>
      </div>

      {/* Warning Banner */}
      <Card className="bg-amber-500/10 border-amber-500/30">
        <CardContent className="p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <p className="text-amber-200 text-sm">
            This section is read-only. Role modifications require system-level access and are logged in the audit trail.
          </p>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <Card className="bg-[#12121a] border-white/10 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Permission Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-sm text-white/70 font-medium">Role</th>
                  <th className="text-left p-4 text-sm text-white/70 font-medium">Level</th>
                  <th className="text-left p-4 text-sm text-white/70 font-medium">Scope</th>
                  {permissionLabels.map((perm) => (
                    <th key={perm} className="text-center p-4 text-sm text-white/70 font-medium capitalize">
                      {perm}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles.map((role, index) => (
                  <motion.tr
                    key={role.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Shield className={`w-4 h-4 ${role.level === 0 ? 'text-amber-400' : 'text-white/40'}`} />
                        <span className="text-white font-medium">{role.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="border-white/20 text-white/60">
                        L{role.level}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-white/60">{role.scope}</td>
                    {permissionLabels.map((perm) => (
                      <td key={perm} className="p-4 text-center">
                        {role.permissions[perm] ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-red-400/50 mx-auto" />
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Role Dependency Graph */}
      <Card className="bg-[#12121a] border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-400" />
            Role Dependency Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2 py-4">
            {roles.map((role, index) => (
              <React.Fragment key={role.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`px-6 py-3 rounded-lg border ${
                    role.level === 0 
                      ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' 
                      : 'bg-white/5 border-white/10 text-white/70'
                  }`}
                  style={{ marginLeft: `${role.level * 20}px` }}
                >
                  {role.name}
                </motion.div>
                {index < roles.length - 1 && roles[index + 1].dependsOn && (
                  <div className="h-4 w-px bg-white/20" style={{ marginLeft: `${role.level * 20}px` }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
