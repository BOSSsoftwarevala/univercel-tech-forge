import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Settings, Plus, CheckCircle, XCircle, Clock,
  FileText, AlertTriangle, Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LeaveType {
  id: string;
  name: string;
  code: string;
  allowance: number;
  carryForward: boolean;
  maxCarry: number;
  paid: boolean;
  color: string;
}

interface LeaveRequest {
  id: string;
  employee: string;
  department: string;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
}

const leaveTypes: LeaveType[] = [
  { id: '1', name: 'Casual Leave', code: 'CL', allowance: 12, carryForward: false, maxCarry: 0, paid: true, color: 'bg-blue-500' },
  { id: '2', name: 'Sick Leave', code: 'SL', allowance: 8, carryForward: true, maxCarry: 5, paid: true, color: 'bg-red-500' },
  { id: '3', name: 'Earned Leave', code: 'EL', allowance: 15, carryForward: true, maxCarry: 30, paid: true, color: 'bg-emerald-500' },
  { id: '4', name: 'Maternity Leave', code: 'ML', allowance: 182, carryForward: false, maxCarry: 0, paid: true, color: 'bg-pink-500' },
  { id: '5', name: 'Paternity Leave', code: 'PL', allowance: 15, carryForward: false, maxCarry: 0, paid: true, color: 'bg-violet-500' },
  { id: '6', name: 'Loss of Pay', code: 'LOP', allowance: 0, carryForward: false, maxCarry: 0, paid: false, color: 'bg-slate-500' },
];

const leaveRequests: LeaveRequest[] = [
  { id: '1', employee: 'Rahul Kumar', department: 'Engineering', type: 'Casual Leave', from: '2025-01-06', to: '2025-01-08', days: 3, reason: 'Family function', status: 'pending', appliedOn: '2025-01-02' },
  { id: '2', employee: 'Priya Singh', department: 'HR', type: 'Sick Leave', from: '2025-01-03', to: '2025-01-03', days: 1, reason: 'Medical appointment', status: 'approved', appliedOn: '2025-01-02' },
  { id: '3', employee: 'Amit Sharma', department: 'Finance', type: 'Earned Leave', from: '2025-01-15', to: '2025-01-20', days: 6, reason: 'Vacation', status: 'pending', appliedOn: '2025-01-01' },
  { id: '4', employee: 'Neha Gupta', department: 'Marketing', type: 'Casual Leave', from: '2024-12-30', to: '2024-12-31', days: 2, reason: 'Personal work', status: 'rejected', appliedOn: '2024-12-28' },
];

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
  approved: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function CorporateLeave() {
  const [pendingCount] = useState(leaveRequests.filter(r => r.status === 'pending').length);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pending Requests</p>
                <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Approved Today</p>
                <p className="text-2xl font-bold text-slate-900">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">On Leave Today</p>
                <p className="text-2xl font-bold text-slate-900">33</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <FileText className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Leave Types</p>
                <p className="text-2xl font-bold text-slate-900">{leaveTypes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="requests" className="gap-2">
              <Calendar className="w-4 h-4" />
              Leave Requests
            </TabsTrigger>
            <TabsTrigger value="types" className="gap-2">
              <FileText className="w-4 h-4" />
              Leave Types
            </TabsTrigger>
            <TabsTrigger value="policies" className="gap-2">
              <Settings className="w-4 h-4" />
              Policy Rules
            </TabsTrigger>
          </TabsList>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600">
                <Plus className="w-4 h-4" />
                Add Leave Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Leave Type</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Leave Name</Label>
                  <Input placeholder="e.g., Bereavement Leave" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Code</Label>
                    <Input placeholder="e.g., BL" />
                  </div>
                  <div className="space-y-2">
                    <Label>Annual Allowance</Label>
                    <Input type="number" placeholder="e.g., 5" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <Label>Paid Leave</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <Label>Allow Carry Forward</Label>
                  <Switch />
                </div>
                <Button className="w-full">Create Leave Type</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leave Requests Tab */}
        <TabsContent value="requests">
          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Employee</TableHead>
                    <TableHead className="font-semibold">Leave Type</TableHead>
                    <TableHead className="font-semibold">Duration</TableHead>
                    <TableHead className="font-semibold">Days</TableHead>
                    <TableHead className="font-semibold">Reason</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((request, index) => {
                    const StatusIcon = statusConfig[request.status].icon;
                    return (
                      <motion.tr
                        key={request.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-slate-50"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">{request.employee}</p>
                            <p className="text-xs text-slate-500">{request.department}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.type}</Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {request.from} → {request.to}
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{request.days}</span>
                        </TableCell>
                        <TableCell className="text-slate-600 max-w-[200px] truncate">
                          {request.reason}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig[request.status].color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[request.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {request.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" className="text-emerald-600 hover:text-emerald-700">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Types Tab */}
        <TabsContent value="types">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leaveTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`px-3 py-1 ${type.color} rounded-full`}>
                        <span className="text-white font-medium text-sm">{type.code}</span>
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{type.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Annual Allowance</span>
                        <span className="font-medium">{type.allowance} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Carry Forward</span>
                        <Badge variant="outline" className={type.carryForward ? 'text-emerald-600' : 'text-slate-400'}>
                          {type.carryForward ? `Up to ${type.maxCarry}` : 'No'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Pay Status</span>
                        <Badge className={type.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                          {type.paid ? 'Paid' : 'Unpaid'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-base">Leave Policy Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">General Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Minimum Notice Period</p>
                        <p className="text-sm text-slate-500">Days before leave application</p>
                      </div>
                      <Input type="number" className="w-20" defaultValue="3" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Max Consecutive Days</p>
                        <p className="text-sm text-slate-500">Without additional approval</p>
                      </div>
                      <Input type="number" className="w-20" defaultValue="5" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Sandwich Rule</p>
                        <p className="text-sm text-slate-500">Count weekends between leaves</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Approval Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Auto-approve Single Day</p>
                        <p className="text-sm text-slate-500">For casual leave only</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">Require Documents</p>
                        <p className="text-sm text-slate-500">For sick leave &gt; 2 days</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">HR Approval Required</p>
                        <p className="text-sm text-slate-500">For leaves &gt; 5 days</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600">
                Save Policy Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
