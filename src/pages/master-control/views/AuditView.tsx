import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const auditLogs = [
  { timestamp: '2024-12-25 10:30:15', role: 'Super Admin', action: 'User Creation', target: 'Africa Region', result: 'Success' },
  { timestamp: '2024-12-25 10:25:42', role: 'Master Admin', action: 'Rule Update', target: 'Global Settings', result: 'Success' },
  { timestamp: '2024-12-25 10:20:18', role: 'Super Admin', action: 'Approval', target: 'Financial Request #42', result: 'Approved' },
  { timestamp: '2024-12-25 10:15:33', role: 'Super Admin', action: 'Login', target: 'Asia Dashboard', result: 'Success' },
  { timestamp: '2024-12-25 10:10:05', role: 'Super Admin', action: 'Data Export', target: 'Europe Reports', result: 'Denied' },
  { timestamp: '2024-12-25 10:05:22', role: 'Master Admin', action: 'Security Override', target: 'System Lock', result: 'Success' },
  { timestamp: '2024-12-25 10:00:11', role: 'Super Admin', action: 'User Modification', target: 'User ID 12345', result: 'Success' },
  { timestamp: '2024-12-25 09:55:48', role: 'Super Admin', action: 'Login', target: 'N. America Dashboard', result: 'Failed' },
  { timestamp: '2024-12-25 09:50:30', role: 'Master Admin', action: 'Approval', target: 'High Risk Request #38', result: 'Rejected' },
  { timestamp: '2024-12-25 09:45:15', role: 'Super Admin', action: 'Settings Change', target: 'S. America Config', result: 'Success' },
];

const AuditView = () => {
  const [dateFilter, setDateFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-800">Audit Log</h2>
        <p className="text-sm text-zinc-500">Read-only system activity log — no export, no copy</p>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white border-zinc-300">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-zinc-600">Date</Label>
            <Input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-zinc-50 border-zinc-300"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-600">Role</Label>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="bg-zinc-50 border-zinc-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="master">Master Admin</SelectItem>
                <SelectItem value="super">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-600">Action Type</Label>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="bg-zinc-50 border-zinc-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="approval">Approval</SelectItem>
                <SelectItem value="creation">Creation</SelectItem>
                <SelectItem value="modification">Modification</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Audit Table */}
      <Card className="bg-white border-zinc-300">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-200">
              <TableHead className="text-zinc-600">Timestamp</TableHead>
              <TableHead className="text-zinc-600">Role</TableHead>
              <TableHead className="text-zinc-600">Action</TableHead>
              <TableHead className="text-zinc-600">Target</TableHead>
              <TableHead className="text-zinc-600">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log, index) => (
              <TableRow key={index} className="border-zinc-200">
                <TableCell className="font-mono text-xs text-zinc-700">{log.timestamp}</TableCell>
                <TableCell className="text-zinc-700">{log.role}</TableCell>
                <TableCell className="text-zinc-700">{log.action}</TableCell>
                <TableCell className="text-zinc-700">{log.target}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    log.result === 'Success' || log.result === 'Approved'
                      ? 'bg-zinc-200 text-zinc-700'
                      : log.result === 'Failed' || log.result === 'Denied' || log.result === 'Rejected'
                      ? 'bg-zinc-800 text-white'
                      : 'bg-zinc-300 text-zinc-600'
                  }`}>
                    {log.result}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Security Notice */}
      <div className="text-center py-4">
        <p className="text-xs text-zinc-500">
          Session-only view • Copy/Paste disabled • Export disabled • All views logged
        </p>
      </div>
    </div>
  );
};

export default AuditView;
