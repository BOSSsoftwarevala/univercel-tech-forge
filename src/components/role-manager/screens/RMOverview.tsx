/**
 * ROLE MANAGER - ROLE OVERVIEW SCREEN
 */

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  ShieldCheck,
  ShieldOff,
  AlertTriangle,
  Eye,
  Pencil,
  Pause,
  Play,
  Trash2,
  FileText,
  CheckCircle,
  XCircle,
  TrendingUp,
  Lock,
} from "lucide-react";

const STATS = [
  { label: 'Total Roles', value: '42', icon: ShieldCheck, color: '#3b82f6', change: '+3' },
  { label: 'Active Roles', value: '38', icon: Users, color: '#22c55e', change: '+2' },
  { label: 'Suspended Roles', value: '4', icon: ShieldOff, color: '#ef4444', change: '-1' },
  { label: 'Pending Approvals', value: '7', icon: AlertTriangle, color: '#f59e0b', change: '+5' },
];

const ROLES = [
  { id: 1, name: 'Super Admin', users: 5, permissions: 156, status: 'active', locked: true, risk: 'low' },
  { id: 2, name: 'Country Manager', users: 12, permissions: 89, status: 'active', locked: false, risk: 'low' },
  { id: 3, name: 'Franchise Owner', users: 45, permissions: 67, status: 'active', locked: false, risk: 'medium' },
  { id: 4, name: 'Sales Executive', users: 120, permissions: 34, status: 'active', locked: false, risk: 'low' },
  { id: 5, name: 'Support Agent', users: 85, permissions: 28, status: 'active', locked: false, risk: 'low' },
  { id: 6, name: 'Temp Access', users: 8, permissions: 12, status: 'suspended', locked: false, risk: 'high' },
];

interface RMOverviewProps {
  activeItem: string;
}

export const RMOverview = memo<RMOverviewProps>(({ activeItem }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Role Overview</h1>
          <p className="text-sm text-slate-400">
            {activeItem === 'dashboard' && 'Complete role management dashboard'}
            {activeItem === 'role-statistics' && 'Role usage and distribution statistics'}
            {activeItem === 'active-roles' && 'All currently active roles'}
            {activeItem === 'inactive-roles' && 'Suspended and inactive roles'}
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <ShieldCheck className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${stat.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <Badge variant="outline" className="text-green-400 border-green-500/30">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Roles Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            All Roles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Role Name</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Users</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Permissions</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Risk Level</th>
                  <th className="text-right py-3 px-4 text-slate-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ROLES.map((role) => (
                  <tr key={role.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{role.name}</span>
                        {role.locked && <Lock className="w-3 h-3 text-yellow-400" />}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{role.users}</td>
                    <td className="py-3 px-4 text-slate-300">{role.permissions}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={role.status === 'active' 
                          ? 'text-green-400 border-green-500/30' 
                          : 'text-red-400 border-red-500/30'
                        }
                      >
                        {role.status === 'active' ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {role.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className={getRiskColor(role.risk)}>
                        {role.risk}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4 text-slate-400" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" disabled={role.locked}>
                          <Pencil className="w-4 h-4 text-slate-400" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          {role.status === 'active' ? (
                            <Pause className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <Play className="w-4 h-4 text-green-400" />
                          )}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" disabled={role.locked}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <FileText className="w-4 h-4 text-blue-400" />
                        </Button>
                      </div>
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

RMOverview.displayName = 'RMOverview';
