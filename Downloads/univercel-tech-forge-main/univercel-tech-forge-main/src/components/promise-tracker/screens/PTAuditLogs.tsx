import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Search, 
  Filter, 
  Download,
  Lock,
  User,
  Clock,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

const auditLogs = [
  { id: 'LOG-001', timestamp: '2024-01-18 14:32:15', action: 'Promise Created', promiseId: 'PRM-019', user: 'admin@softwarevala.com', role: 'Admin', details: 'New promise created for Client XYZ' },
  { id: 'LOG-002', timestamp: '2024-01-18 14:15:22', action: 'Status Changed', promiseId: 'PRM-003', user: 'support@softwarevala.com', role: 'Support Lead', details: 'Status changed from Active to Fulfilled' },
  { id: 'LOG-003', timestamp: '2024-01-18 13:45:10', action: 'Fine Applied', promiseId: 'PRM-007', user: 'finance@softwarevala.com', role: 'Finance', details: 'Fine of ₹5,000 applied for broken promise' },
  { id: 'LOG-004', timestamp: '2024-01-18 12:30:45', action: 'Tip Released', promiseId: 'PRM-013', user: 'manager@softwarevala.com', role: 'Manager', details: 'Tip of ₹5,000 released for early delivery' },
  { id: 'LOG-005', timestamp: '2024-01-18 11:20:33', action: 'Escalated', promiseId: 'PRM-002', user: 'system', role: 'System', details: 'Auto-escalated to Level 3 due to repeated delays' },
  { id: 'LOG-006', timestamp: '2024-01-18 10:15:00', action: 'Deadline Extended', promiseId: 'PRM-009', user: 'sales@softwarevala.com', role: 'Sales', details: 'Deadline extended by 8 days with approval' },
  { id: 'LOG-007', timestamp: '2024-01-18 09:45:22', action: 'Promise Edited', promiseId: 'PRM-004', user: 'admin@softwarevala.com', role: 'Admin', details: 'Priority changed from High to Critical' },
];

const getActionIcon = (action: string) => {
  if (action.includes('Created') || action.includes('Edited')) return FileText;
  if (action.includes('Status')) return Clock;
  if (action.includes('Fine')) return DollarSign;
  if (action.includes('Tip')) return DollarSign;
  if (action.includes('Escalated')) return TrendingUp;
  return FileText;
};

const getActionColor = (action: string) => {
  if (action.includes('Created')) return 'bg-blue-500/20 text-blue-400';
  if (action.includes('Fulfilled')) return 'bg-green-500/20 text-green-400';
  if (action.includes('Fine')) return 'bg-red-500/20 text-red-400';
  if (action.includes('Tip')) return 'bg-emerald-500/20 text-emerald-400';
  if (action.includes('Escalated')) return 'bg-orange-500/20 text-orange-400';
  if (action.includes('Extended')) return 'bg-yellow-500/20 text-yellow-400';
  return 'bg-slate-500/20 text-slate-400';
};

export default function PTAuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.promiseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action.toLowerCase().includes(actionFilter.toLowerCase());
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-500/20 rounded-xl">
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
            <p className="text-slate-400">Complete history (Non-Editable)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
            <Lock className="w-3 h-3 mr-1" />
            READ ONLY
          </Badge>
          <Button variant="outline" size="sm" onClick={() => toast.success('Exported', { description: 'Audit logs exported to CSV' })}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search logs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-slate-800/50 border-slate-700"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[160px] bg-slate-800/50 border-slate-700">
                  <SelectValue placeholder="Action Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="status">Status Changed</SelectItem>
                  <SelectItem value="fine">Fine Applied</SelectItem>
                  <SelectItem value="tip">Tip Released</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline" className="text-slate-400">
              {filteredLogs.length} entries
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 text-slate-400 text-sm">
                  <th className="text-left py-3 px-4">Timestamp</th>
                  <th className="text-left py-3 px-4">Action</th>
                  <th className="text-left py-3 px-4">Promise ID</th>
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const ActionIcon = getActionIcon(log.action);
                  return (
                    <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-xs text-slate-500 font-mono">{log.timestamp}</td>
                      <td className="py-3 px-4">
                        <Badge className={getActionColor(log.action)}>
                          <ActionIcon className="w-3 h-3 mr-1" />
                          {log.action}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-sm text-slate-300">{log.promiseId}</td>
                      <td className="py-3 px-4 text-slate-400 text-sm">{log.user}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-xs">{log.role}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-sm max-w-xs truncate">{log.details}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
