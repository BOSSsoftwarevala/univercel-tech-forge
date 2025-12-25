import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const auditLogs = [
  { timestamp: '2024-12-25 10:30:15', role: 'Super Admin', action: 'User Creation', target: 'Africa Region', result: 'Success' },
  { timestamp: '2024-12-25 10:25:42', role: 'Master Admin', action: 'Rule Update', target: 'Global Settings', result: 'Success' },
  { timestamp: '2024-12-25 10:20:18', role: 'Super Admin', action: 'Approval', target: 'Financial Request #42', result: 'Approved' },
  { timestamp: '2024-12-25 10:15:33', role: 'Super Admin', action: 'Login', target: 'Asia Dashboard', result: 'Success' },
  { timestamp: '2024-12-25 10:10:05', role: 'Super Admin', action: 'Data Export', target: 'Europe Reports', result: 'Denied' },
  { timestamp: '2024-12-25 10:05:22', role: 'Master Admin', action: 'Security Override', target: 'System Lock', result: 'Success' },
];

const AuditView = () => {
  const [dateFilter, setDateFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Audit Log</h2>
        <p className="text-sm text-gray-500">Read-only system activity log — no export, no copy</p>
      </div>

      <Card className="p-4 bg-[#1a1a2e] border-gray-800/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-400">Date</Label>
            <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="bg-gray-800/50 border-gray-700 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-400">Role</Label>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#12121a] border-gray-800">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="master">Master Admin</SelectItem>
                <SelectItem value="super">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-400">Action Type</Label>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#12121a] border-gray-800">
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="approval">Approval</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="bg-[#1a1a2e] border-gray-800/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800/50 hover:bg-transparent">
              <TableHead className="text-gray-500">Timestamp</TableHead>
              <TableHead className="text-gray-500">Role</TableHead>
              <TableHead className="text-gray-500">Action</TableHead>
              <TableHead className="text-gray-500">Target</TableHead>
              <TableHead className="text-gray-500">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log, index) => (
              <TableRow key={index} className="border-gray-800/30 hover:bg-gray-800/30">
                <TableCell className="font-mono text-xs text-gray-400">{log.timestamp}</TableCell>
                <TableCell className="text-gray-400">{log.role}</TableCell>
                <TableCell className="text-gray-400">{log.action}</TableCell>
                <TableCell className="text-gray-400">{log.target}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    log.result === 'Success' || log.result === 'Approved' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                  }`}>{log.result}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      
      <p className="text-xs text-gray-500 text-center">Session-only view • Copy/Paste disabled • Export disabled</p>
    </div>
  );
};

export default AuditView;
