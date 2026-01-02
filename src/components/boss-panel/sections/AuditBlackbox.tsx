import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileSearch,
  Lock,
  Download,
  Search,
  Shield,
  Clock,
  User,
  Hash,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  hash: string;
  verified: boolean;
}

const auditLogs: AuditLog[] = [
  { id: '1', timestamp: new Date(Date.now() - 60000), user: 'John Smith', userRole: 'Super Admin', action: 'Role Updated', module: 'Security', details: 'Changed permissions for Franchise role', hash: 'a1b2c3d4e5', verified: true },
  { id: '2', timestamp: new Date(Date.now() - 120000), user: 'Maria Garcia', userRole: 'Country Admin', action: 'Lead Created', module: 'Leads', details: 'New lead from web form', hash: 'f6g7h8i9j0', verified: true },
  { id: '3', timestamp: new Date(Date.now() - 300000), user: 'System', userRole: 'AI Engine', action: 'Auto-Assignment', module: 'Leads', details: 'Assigned 5 leads to available agents', hash: 'k1l2m3n4o5', verified: true },
  { id: '4', timestamp: new Date(Date.now() - 600000), user: 'Wei Chen', userRole: 'Super Admin', action: 'Module Toggled', module: 'Servers', details: 'Enabled maintenance mode', hash: 'p6q7r8s9t0', verified: true },
  { id: '5', timestamp: new Date(Date.now() - 900000), user: 'Sarah Johnson', userRole: 'Franchise', action: 'Deal Closed', module: 'Sales', details: 'Closed $25,000 enterprise deal', hash: 'u1v2w3x4y5', verified: true },
  { id: '6', timestamp: new Date(Date.now() - 1200000), user: 'Boss', userRole: 'Owner', action: 'Super Admin Suspended', module: 'Security', details: 'Suspended Robert Brown for policy violation', hash: 'z6a7b8c9d0', verified: true },
];

export function AuditBlackbox() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUser, setFilterUser] = useState('all');
  const [filterAction, setFilterAction] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    if (searchQuery && !log.details.toLowerCase().includes(searchQuery.toLowerCase()) && !log.user.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit & Blackbox</h1>
          <p className="text-white/50 text-sm">Immutable, hash-verified audit trail</p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-1">
          <Shield className="w-3 h-3" />
          IMMUTABLE
        </Badge>
      </div>

      {/* Security Notice */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-4 flex items-center gap-3">
          <Lock className="w-5 h-5 text-blue-400" />
          <p className="text-blue-200 text-sm">
            All entries are cryptographically signed and tamper-proof. This log cannot be modified or deleted.
          </p>
        </CardContent>
      </Card>

      {/* Search & Filters */}
      <Card className="bg-[#12121a] border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by user, action, or details..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>

            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10">
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10">
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="boss">Boss</SelectItem>
                <SelectItem value="super-admin">Super Admin</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10">
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="border-white/20 text-white/70 hover:text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export (Read-only)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card className="bg-[#12121a] border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-amber-400" />
            Audit Log Entries
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-sm text-white/70 font-medium">Timestamp</th>
                  <th className="text-left p-4 text-sm text-white/70 font-medium">User</th>
                  <th className="text-left p-4 text-sm text-white/70 font-medium">Action</th>
                  <th className="text-left p-4 text-sm text-white/70 font-medium">Module</th>
                  <th className="text-left p-4 text-sm text-white/70 font-medium">Details</th>
                  <th className="text-left p-4 text-sm text-white/70 font-medium">Hash</th>
                  <th className="text-center p-4 text-sm text-white/70 font-medium">Verified</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <Clock className="w-3 h-3" />
                        {log.timestamp.toLocaleTimeString()}
                      </div>
                      <div className="text-xs text-white/40">
                        {log.timestamp.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-white/40" />
                        <div>
                          <div className="text-sm text-white">{log.user}</div>
                          <div className="text-xs text-white/40">{log.userRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="border-white/20 text-white/70">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-white/60">{log.module}</td>
                    <td className="p-4 text-sm text-white/60 max-w-[200px] truncate">{log.details}</td>
                    <td className="p-4">
                      <code className="text-xs text-amber-400/70 bg-amber-500/10 px-2 py-1 rounded flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {log.hash}
                      </code>
                    </td>
                    <td className="p-4 text-center">
                      {log.verified ? (
                        <Shield className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <Shield className="w-5 h-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
