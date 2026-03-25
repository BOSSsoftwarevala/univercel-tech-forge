import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, UserPlus, Calendar, Clock, FileText, 
  Award, Briefcase, DollarSign, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const HRM = () => {
  const employees = [
    { 
      id: 1, name: 'Rahul Sharma', department: 'Sales', designation: 'Sales Executive',
      joinDate: '15 Jan 2024', status: 'active', attendance: 95, leaves: 2
    },
    { 
      id: 2, name: 'Priya Patel', department: 'Operations', designation: 'Lead Manager',
      joinDate: '20 Mar 2023', status: 'active', attendance: 98, leaves: 1
    },
    { 
      id: 3, name: 'Amit Kumar', department: 'Sales', designation: 'Sales Executive',
      joinDate: '10 Jun 2024', status: 'probation', attendance: 88, leaves: 4
    },
    { 
      id: 4, name: 'Sneha Reddy', department: 'Support', designation: 'Support Agent',
      joinDate: '05 Aug 2024', status: 'active', attendance: 92, leaves: 3
    },
  ];

  const leaveRequests = [
    { name: 'Rahul Sharma', type: 'Casual Leave', from: '25 Dec', to: '26 Dec', reason: 'Personal work', status: 'pending' },
    { name: 'Priya Patel', type: 'Sick Leave', from: '28 Dec', to: '28 Dec', reason: 'Medical appointment', status: 'approved' },
    { name: 'Amit Kumar', type: 'Casual Leave', from: '1 Jan', to: '2 Jan', reason: 'Family function', status: 'pending' },
  ];

  const payrollSummary = [
    { label: 'Total Payroll', value: '₹4,50,000', icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Employees Paid', value: '12/12', icon: CheckCircle2, color: 'text-indigo-400' },
    { label: 'Pending Approvals', value: '3', icon: AlertCircle, color: 'text-orange-400' },
    { label: 'Next Payroll', value: '25 Dec', icon: Calendar, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">HRM</h1>
          <p className="text-slate-400 mt-1">Human Resource Management</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Employees</p>
                <p className="text-xl font-bold text-white">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Present Today</p>
                <p className="text-xl font-bold text-white">10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Leave Requests</p>
                <p className="text-xl font-bold text-white">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-indigo-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Open Positions</p>
                <p className="text-xl font-bold text-white">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList className="bg-slate-800/50 border border-indigo-500/20">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leaves">Leave Management</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-white">Employee Directory</CardTitle>
              <CardDescription>Manage your workforce</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employees.map((emp) => (
                  <div 
                    key={emp.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">{emp.name}</p>
                        <p className="text-slate-400 text-sm">{emp.designation} • {emp.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center hidden md:block">
                        <p className="text-white font-bold">{emp.attendance}%</p>
                        <p className="text-slate-400 text-xs">Attendance</p>
                      </div>
                      <div className="text-center hidden md:block">
                        <p className="text-indigo-400 font-bold">{emp.leaves}</p>
                        <p className="text-slate-400 text-xs">Leaves</p>
                      </div>
                      <Badge className={
                        emp.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-orange-500/20 text-orange-400'
                      }>
                        {emp.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-white">Today's Attendance</CardTitle>
              <CardDescription>Track daily attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((emp) => (
                  <div 
                    key={emp.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/50"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{emp.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-emerald-400 text-sm">09:00 AM</p>
                        <p className="text-slate-500 text-xs">Check In</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-400 text-sm">--:--</p>
                        <p className="text-slate-500 text-xs">Check Out</p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400">Present</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves">
          <Card className="bg-slate-800/50 border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-white">Leave Requests</CardTitle>
              <CardDescription>Approve or reject leave applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaveRequests.map((leave, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                          {leave.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">{leave.name}</p>
                        <p className="text-slate-400 text-sm">{leave.type} • {leave.from} to {leave.to}</p>
                        <p className="text-slate-500 text-xs mt-1">{leave.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {leave.status === 'pending' ? (
                        <>
                          <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                            Reject
                          </Button>
                          <Button size="sm" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
                            Approve
                          </Button>
                        </>
                      ) : (
                        <Badge className="bg-emerald-500/20 text-emerald-400">Approved</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {payrollSummary.map((item, idx) => (
                <Card key={idx} className="bg-slate-800/50 border-indigo-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">{item.label}</p>
                        <p className="text-xl font-bold text-white">{item.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-slate-800/50 border-indigo-500/20">
              <CardHeader>
                <CardTitle className="text-white">Payroll Processing</CardTitle>
                <CardDescription>Monthly salary processing status</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <DollarSign className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                <p className="text-slate-400">Payroll processing module coming soon</p>
                <Button variant="outline" className="mt-4 border-indigo-500/30 text-indigo-300">
                  Request Early Access
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRM;
