import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Key,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Search,
  Filter,
  Lock,
  Unlock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuditLog {
  id: string;
  action: string;
  user: string;
  role: string;
  outlet: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  ip: string;
  device: string;
}

interface Role {
  id: string;
  name: string;
  users: number;
  permissions: string[];
  color: string;
}

const auditLogs: AuditLog[] = [
  { id: '1', action: 'Login Successful', user: 'John Smith', role: 'Manager', outlet: 'Downtown', timestamp: '2 mins ago', status: 'success', ip: '192.168.1.45', device: 'Desktop' },
  { id: '2', action: 'Price Override', user: 'Sarah Johnson', role: 'Cashier', outlet: 'Mall', timestamp: '15 mins ago', status: 'warning', ip: '192.168.1.52', device: 'POS Terminal' },
  { id: '3', action: 'Failed Login Attempt', user: 'Unknown', role: '-', outlet: 'Airport', timestamp: '23 mins ago', status: 'error', ip: '103.45.67.89', device: 'Mobile' },
  { id: '4', action: 'Void Transaction', user: 'Mike Brown', role: 'Supervisor', outlet: 'Downtown', timestamp: '1 hour ago', status: 'warning', ip: '192.168.1.45', device: 'POS Terminal' },
  { id: '5', action: 'Settings Updated', user: 'Admin User', role: 'Admin', outlet: 'All', timestamp: '2 hours ago', status: 'success', ip: '192.168.1.1', device: 'Desktop' },
  { id: '6', action: 'User Created', user: 'Admin User', role: 'Admin', outlet: 'Beach Front', timestamp: '3 hours ago', status: 'success', ip: '192.168.1.1', device: 'Desktop' },
];

const roles: Role[] = [
  { id: '1', name: 'Super Admin', users: 2, permissions: ['All Access'], color: 'bg-red-100 text-red-700' },
  { id: '2', name: 'Admin', users: 5, permissions: ['Dashboard', 'Reports', 'Settings', 'Users'], color: 'bg-violet-100 text-violet-700' },
  { id: '3', name: 'Manager', users: 12, permissions: ['Dashboard', 'Sales', 'Inventory', 'Staff'], color: 'bg-blue-100 text-blue-700' },
  { id: '4', name: 'Supervisor', users: 8, permissions: ['Sales', 'Void', 'Refunds'], color: 'bg-emerald-100 text-emerald-700' },
  { id: '5', name: 'Cashier', users: 45, permissions: ['POS', 'Basic Reports'], color: 'bg-amber-100 text-amber-700' },
];

const twoFactorStats = {
  enabled: 67,
  disabled: 5,
  pending: 8
};

export const SecurityAudit: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const stats = [
    { label: 'Active Sessions', value: '45', icon: Users, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Failed Logins (24h)', value: '12', icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
    { label: '2FA Enabled', value: `${twoFactorStats.enabled}%`, icon: Shield, color: 'bg-violet-100 text-violet-600' },
    { label: 'Active Roles', value: roles.length.toString(), icon: Key, color: 'bg-blue-100 text-blue-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Security & Audit</h1>
          <p className="text-slate-500">Activity logs, permissions, and security settings</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            Filter Logs
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-200 transition-all">
            <Shield className="w-4 h-4" />
            Security Settings
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audit Logs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200">
          <div className="p-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Activity Logs</h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search logs..."
                  className="w-64 h-9 pl-9 pr-4 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mt-0.5",
                      log.status === 'success' ? "bg-emerald-100" :
                      log.status === 'warning' ? "bg-amber-100" : "bg-red-100"
                    )}>
                      {log.status === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> :
                       log.status === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-600" /> :
                       <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{log.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-600">{log.user}</span>
                        <span className="text-slate-300">•</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{log.role}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-sm text-slate-500">{log.outlet}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">{log.timestamp}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      {log.device === 'Desktop' ? <Monitor className="w-3 h-3" /> : 
                       log.device === 'Mobile' ? <Smartphone className="w-3 h-3" /> :
                       <Monitor className="w-3 h-3" />}
                      <span>{log.ip}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-200">
            <button className="w-full py-2 text-sm font-medium text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
              View All Logs
            </button>
          </div>
        </div>

        {/* Roles & 2FA */}
        <div className="space-y-6">
          {/* Role Based Access */}
          <div className="bg-white rounded-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Role Management</h3>
                <button className="text-sm text-violet-600 font-medium hover:text-violet-700">
                  + Add Role
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => { setSelectedRole(role); setShowRoleModal(true); }}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", role.color)}>
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{role.name}</p>
                      <p className="text-xs text-slate-500">{role.users} users</p>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Two-Factor Authentication</h3>
              <p className="text-sm text-slate-500">User 2FA status overview</p>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-slate-600">Enabled</span>
                </div>
                <span className="font-semibold text-slate-900">{twoFactorStats.enabled}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full"
                  style={{ width: `${twoFactorStats.enabled}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-600">{twoFactorStats.enabled}%</p>
                  <p className="text-xs text-slate-500">Enabled</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-amber-600">{twoFactorStats.pending}%</p>
                  <p className="text-xs text-slate-500">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-red-600">{twoFactorStats.disabled}%</p>
                  <p className="text-xs text-slate-500">Disabled</p>
                </div>
              </div>
              <button className="w-full mt-4 py-2.5 bg-violet-50 text-violet-600 font-medium rounded-xl hover:bg-violet-100 transition-colors">
                Enforce 2FA for All Users
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Role Details Modal */}
      {showRoleModal && selectedRole && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", selectedRole.color)}>
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedRole.name}</h2>
                  <p className="text-sm text-slate-500">{selectedRole.users} users assigned</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-700">Permissions</h4>
              {selectedRole.permissions.map((permission, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Unlock className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-900">{permission}</span>
                  </div>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowRoleModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50">
                Close
              </button>
              <button className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg">
                Edit Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
