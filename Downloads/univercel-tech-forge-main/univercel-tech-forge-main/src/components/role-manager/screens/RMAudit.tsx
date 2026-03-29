/**
 * ROLE MANAGER - AUDIT & LOGS SCREEN
 */

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  History,
  Users,
  Shield,
  Filter,
} from "lucide-react";

const ROLE_CHANGES = [
  { id: 1, action: 'Role Created', role: 'Regional Coordinator', by: 'Admin User', time: '2 hours ago', type: 'create' },
  { id: 2, action: 'Permission Added', role: 'Sales Manager', by: 'Super Admin', time: '4 hours ago', type: 'update' },
  { id: 3, action: 'Role Suspended', role: 'Temp Access', by: 'System', time: '1 day ago', type: 'suspend' },
  { id: 4, action: 'Permission Removed', role: 'Support Agent', by: 'Manager', time: '2 days ago', type: 'update' },
  { id: 5, action: 'Role Deleted', role: 'Legacy Role', by: 'Admin', time: '3 days ago', type: 'delete' },
];

const USER_ROLE_MAPPING = [
  { id: 1, user: 'John Smith', oldRole: 'Sales Executive', newRole: 'Sales Manager', by: 'HR Admin', time: '1 hour ago' },
  { id: 2, user: 'Sarah Johnson', oldRole: 'None', newRole: 'Support Agent', by: 'Manager', time: '5 hours ago' },
  { id: 3, user: 'Mike Chen', oldRole: 'Analyst', newRole: 'Senior Analyst', by: 'HR Admin', time: '1 day ago' },
  { id: 4, user: 'Lisa Brown', oldRole: 'Content Editor', newRole: 'Content Manager', by: 'Admin', time: '2 days ago' },
];

interface RMAuditProps {
  activeItem: string;
}

export const RMAudit = memo<RMAuditProps>(({ activeItem }) => {
  const getActionColor = (type: string) => {
    switch (type) {
      case 'create': return 'text-green-400';
      case 'update': return 'text-blue-400';
      case 'suspend': return 'text-yellow-400';
      case 'delete': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit & Logs</h1>
          <p className="text-sm text-slate-400">
            {activeItem === 'role-change-logs' && 'Role modification history'}
            {activeItem === 'permission-history' && 'Permission edit history'}
            {activeItem === 'user-role-mapping' && 'User-role assignment logs'}
            {activeItem === 'export-logs' && 'Export audit logs'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-600">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">1,245</p>
              <p className="text-xs text-slate-400">Total Logs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">89</p>
              <p className="text-xs text-slate-400">Role Changes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <History className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">234</p>
              <p className="text-xs text-slate-400">Permission Edits</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">567</p>
              <p className="text-xs text-slate-400">User Mappings</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Change Logs */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Role Change Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Action</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Changed By</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {ROLE_CHANGES.map((log) => (
                  <tr key={log.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-3 px-4">
                      <span className={`font-medium ${getActionColor(log.type)}`}>{log.action}</span>
                    </td>
                    <td className="py-3 px-4 text-white">{log.role}</td>
                    <td className="py-3 px-4 text-slate-300">{log.by}</td>
                    <td className="py-3 px-4 text-slate-400">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User-Role Mapping Logs */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            User-Role Mapping Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">User</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Previous Role</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">New Role</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Assigned By</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {USER_ROLE_MAPPING.map((log) => (
                  <tr key={log.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-3 px-4 text-white font-medium">{log.user}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-slate-400 border-slate-600">
                        {log.oldRole}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-green-400 border-green-500/30">
                        {log.newRole}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{log.by}</td>
                    <td className="py-3 px-4 text-slate-400">{log.time}</td>
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

RMAudit.displayName = 'RMAudit';
