import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, UserCheck, UserX, Clock, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Employee {
  valaId: string;
  name: string;
  role: string;
  department: string;
  status: 'active' | 'onboarding' | 'on_leave' | 'terminated';
  joinDate: string;
}

const mockEmployees: Employee[] = [
  { valaId: 'EMP-1001', name: 'Employee A', role: 'Developer', department: 'Engineering', status: 'active', joinDate: '2024-01-15' },
  { valaId: 'EMP-1002', name: 'Employee B', role: 'Designer', department: 'Design', status: 'active', joinDate: '2024-03-20' },
  { valaId: 'EMP-1003', name: 'Employee C', role: 'Manager', department: 'Operations', status: 'on_leave', joinDate: '2023-08-10' },
  { valaId: 'EMP-1004', name: 'Employee D', role: 'Analyst', department: 'Finance', status: 'onboarding', joinDate: '2024-12-28' },
  { valaId: 'EMP-1005', name: 'Employee E', role: 'Developer', department: 'Engineering', status: 'active', joinDate: '2024-06-05' },
];

const getStatusConfig = (status: Employee['status']) => {
  switch (status) {
    case 'active': return { color: 'bg-emerald-500/20 text-emerald-400', label: 'Active' };
    case 'onboarding': return { color: 'bg-blue-500/20 text-blue-400', label: 'Onboarding' };
    case 'on_leave': return { color: 'bg-amber-500/20 text-amber-400', label: 'On Leave' };
    case 'terminated': return { color: 'bg-red-500/20 text-red-400', label: 'Terminated' };
  }
};

export default function HREmployeeOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.valaId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = mockEmployees.filter(e => e.status === 'active').length;
  const onboardingCount = mockEmployees.filter(e => e.status === 'onboarding').length;
  const onLeaveCount = mockEmployees.filter(e => e.status === 'on_leave').length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold">{mockEmployees.length}</p>
                <p className="text-xs text-zinc-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <UserCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold">{activeCount}</p>
                <p className="text-xs text-zinc-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold">{onboardingCount}</p>
                <p className="text-xs text-zinc-500">Onboarding</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <UserX className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-mono font-bold">{onLeaveCount}</p>
                <p className="text-xs text-zinc-500">On Leave</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search by name, ID, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-700"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] bg-zinc-900 border-zinc-700">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="onboarding">Onboarding</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
            <SelectItem value="terminated">Terminated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Employee List */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono tracking-wider text-zinc-400">
            EMPLOYEE DIRECTORY
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredEmployees.map((emp, idx) => {
            const statusConfig = getStatusConfig(emp.status);
            return (
              <motion.div
                key={emp.valaId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center font-mono text-sm">
                    {emp.name.charAt(emp.name.length - 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{emp.name}</span>
                      <span className="font-mono text-xs text-zinc-500">{emp.valaId}</span>
                    </div>
                    <div className="text-sm text-zinc-400">
                      {emp.role} • {emp.department}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">Joined</p>
                    <p className="text-sm font-mono">{new Date(emp.joinDate).toLocaleDateString()}</p>
                  </div>
                  <Badge className={statusConfig.color}>
                    {statusConfig.label}
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
