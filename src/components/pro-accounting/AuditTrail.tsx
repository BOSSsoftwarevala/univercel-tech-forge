import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter,
  Download,
  Eye,
  History,
  User,
  Calendar,
  FileText,
  Edit2,
  Trash2,
  Plus,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const auditLogs = [
  { 
    id: 1, 
    timestamp: '2025-01-02 14:32:15', 
    user: 'CA Rahul Sharma', 
    role: 'accountant',
    action: 'Created', 
    module: 'Invoice', 
    reference: 'INV/2024-25/00156', 
    details: 'Created new tax invoice for Tech Solutions Pvt Ltd',
    ipAddress: '192.168.1.105',
    risk: 'low'
  },
  { 
    id: 2, 
    timestamp: '2025-01-02 14:15:42', 
    user: 'CA Rahul Sharma', 
    role: 'accountant',
    action: 'Modified', 
    module: 'Invoice', 
    reference: 'INV/2024-25/00155', 
    details: 'Updated item quantity from 10 to 15',
    ipAddress: '192.168.1.105',
    risk: 'medium'
  },
  { 
    id: 3, 
    timestamp: '2025-01-02 11:45:30', 
    user: 'Admin User', 
    role: 'admin',
    action: 'Deleted', 
    module: 'Expense', 
    reference: 'EXP/2024-25/00089', 
    details: 'Deleted expense entry - Duplicate record',
    ipAddress: '192.168.1.100',
    risk: 'high'
  },
  { 
    id: 4, 
    timestamp: '2025-01-02 10:30:00', 
    user: 'Auditor Singh', 
    role: 'auditor',
    action: 'Viewed', 
    module: 'Report', 
    reference: 'GSTR-3B/Dec-2024', 
    details: 'Viewed GSTR-3B compliance report',
    ipAddress: '192.168.1.110',
    risk: 'low'
  },
  { 
    id: 5, 
    timestamp: '2025-01-01 16:22:18', 
    user: 'CA Rahul Sharma', 
    role: 'accountant',
    action: 'Modified', 
    module: 'Tax Config', 
    reference: 'GST/18%', 
    details: 'Updated HSN mapping for 18% slab',
    ipAddress: '192.168.1.105',
    risk: 'high'
  },
  { 
    id: 6, 
    timestamp: '2025-01-01 14:10:55', 
    user: 'System', 
    role: 'system',
    action: 'Auto-Backup', 
    module: 'System', 
    reference: 'BKP-20250101', 
    details: 'Automated daily backup completed successfully',
    ipAddress: 'System',
    risk: 'low'
  },
];

const editHistory = [
  {
    id: 1,
    document: 'INV/2024-25/00155',
    type: 'Invoice',
    field: 'Quantity (Line 1)',
    oldValue: '10',
    newValue: '15',
    changedBy: 'CA Rahul Sharma',
    changedAt: '2025-01-02 14:15:42',
    reason: 'Customer requested quantity update',
  },
  {
    id: 2,
    document: 'INV/2024-25/00152',
    type: 'Invoice',
    field: 'Rate (Line 2)',
    oldValue: '₹5,000',
    newValue: '₹4,500',
    changedBy: 'CA Rahul Sharma',
    changedAt: '2025-01-01 11:30:00',
    reason: 'Discount applied as per agreement',
  },
  {
    id: 3,
    document: 'PUR/2024-25/00089',
    type: 'Purchase',
    field: 'Due Date',
    oldValue: '2025-01-15',
    newValue: '2025-01-30',
    changedBy: 'CA Rahul Sharma',
    changedAt: '2024-12-30 16:45:00',
    reason: 'Extended payment terms agreed',
  },
];

const AuditTrail: React.FC = () => {
  const [activeTab, setActiveTab] = useState('activity');
  const [selectedLog, setSelectedLog] = useState<typeof auditLogs[0] | null>(null);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Created': return <Plus className="w-4 h-4 text-emerald-500" />;
      case 'Modified': return <Edit2 className="w-4 h-4 text-amber-500" />;
      case 'Deleted': return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'Viewed': return <Eye className="w-4 h-4 text-blue-500" />;
      default: return <History className="w-4 h-4 text-slate-500" />;
    }
  };

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      Created: 'bg-emerald-100 text-emerald-700',
      Modified: 'bg-amber-100 text-amber-700',
      Deleted: 'bg-red-100 text-red-700',
      Viewed: 'bg-blue-100 text-blue-700',
      'Auto-Backup': 'bg-purple-100 text-purple-700',
    };
    return <Badge className={colors[action] || 'bg-slate-100 text-slate-700'}>{action}</Badge>;
  };

  const getRiskBadge = (risk: string) => {
    const colors: Record<string, string> = {
      low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      high: 'bg-red-100 text-red-700 border-red-200',
    };
    return <Badge variant="outline" className={colors[risk]}>{risk.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Audit Trail</h2>
          <p className="text-slate-500">Complete history of all system activities and changes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Security Notice */}
      <Card className="bg-slate-900 border-slate-800 text-white">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Audit Trail Protection</p>
            <p className="text-sm text-slate-400">All logs are encrypted and tamper-proof. Any attempts to modify audit records are automatically flagged.</p>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Compliant
          </Badge>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <History className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Events</p>
                <p className="text-xl font-bold text-slate-900">2,847</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Created</p>
                <p className="text-xl font-bold text-slate-900">1,245</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Edit2 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Modified</p>
                <p className="text-xl font-bold text-slate-900">856</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">High Risk</p>
                <p className="text-xl font-bold text-slate-900">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="activity" className="gap-2">
            <History className="w-4 h-4" />
            Activity Log
          </TabsTrigger>
          <TabsTrigger value="edits" className="gap-2">
            <Edit2 className="w-4 h-4" />
            Edit History
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Security Events
          </TabsTrigger>
        </TabsList>

        {/* Activity Log */}
        <TabsContent value="activity" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-slate-900">Activity Log</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search logs..." className="pl-9 w-64" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="created">Created</SelectItem>
                      <SelectItem value="modified">Modified</SelectItem>
                      <SelectItem value="deleted">Deleted</SelectItem>
                      <SelectItem value="viewed">Viewed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modules</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-center">Risk</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-slate-50">
                      <TableCell className="font-mono text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {log.timestamp}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                            log.role === 'admin' ? 'bg-purple-500' :
                            log.role === 'accountant' ? 'bg-indigo-500' :
                            log.role === 'auditor' ? 'bg-amber-500' :
                            'bg-slate-500'
                          }`}>
                            {log.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{log.user}</p>
                            <p className="text-xs text-slate-500 capitalize">{log.role}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getActionIcon(log.action)}
                          {getActionBadge(log.action)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.module}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.reference}</TableCell>
                      <TableCell className="text-center">{getRiskBadge(log.risk)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-indigo-600">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Audit Log Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-slate-500">Timestamp</p>
                                  <p className="font-medium">{log.timestamp}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-slate-500">User</p>
                                  <p className="font-medium">{log.user}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-slate-500">IP Address</p>
                                  <p className="font-mono">{log.ipAddress}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-slate-500">Risk Level</p>
                                  {getRiskBadge(log.risk)}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-slate-500">Details</p>
                                <p className="font-medium">{log.details}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Edit History */}
        <TabsContent value="edits" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Edit History</CardTitle>
              <CardDescription>Track all field-level changes to documents</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Document</TableHead>
                    <TableHead>Field</TableHead>
                    <TableHead>Old Value</TableHead>
                    <TableHead>New Value</TableHead>
                    <TableHead>Changed By</TableHead>
                    <TableHead>Changed At</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editHistory.map((edit) => (
                    <TableRow key={edit.id}>
                      <TableCell>
                        <div>
                          <p className="font-mono text-sm font-medium">{edit.document}</p>
                          <p className="text-xs text-slate-500">{edit.type}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">{edit.field}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-50 text-red-700 line-through">
                          {edit.oldValue}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                          {edit.newValue}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">{edit.changedBy}</TableCell>
                      <TableCell className="font-mono text-sm text-slate-500">{edit.changedAt}</TableCell>
                      <TableCell className="text-slate-600 max-w-[200px] truncate">{edit.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Events */}
        <TabsContent value="security" className="mt-6">
          <Card className="bg-white border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">Security Events</CardTitle>
              <CardDescription>High-risk activities and security alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-900">No Security Alerts</p>
                <p className="text-slate-500">All systems are operating normally</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditTrail;
