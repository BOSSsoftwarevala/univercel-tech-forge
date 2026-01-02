import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, Calendar, Sun, Moon, AlertTriangle, Timer,
  CheckCircle, XCircle, TrendingUp, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  employees: number;
  color: string;
}

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  shift: string;
  checkIn: string;
  checkOut: string | null;
  status: 'present' | 'late' | 'absent' | 'half-day';
  overtime: number;
  workHours: string;
}

const shifts: Shift[] = [
  { id: '1', name: 'Morning Shift', startTime: '06:00', endTime: '14:00', employees: 420, color: 'bg-amber-500' },
  { id: '2', name: 'General Shift', startTime: '09:00', endTime: '18:00', employees: 650, color: 'bg-blue-500' },
  { id: '3', name: 'Evening Shift', startTime: '14:00', endTime: '22:00', employees: 120, color: 'bg-violet-500' },
  { id: '4', name: 'Night Shift', startTime: '22:00', endTime: '06:00', employees: 58, color: 'bg-slate-700' },
];

const todayAttendance: AttendanceRecord[] = [
  { id: '1', employeeId: 'EMP001', employeeName: 'Rahul Kumar', department: 'Engineering', shift: 'General', checkIn: '09:02', checkOut: '18:15', status: 'present', overtime: 0.25, workHours: '9h 13m' },
  { id: '2', employeeId: 'EMP002', employeeName: 'Priya Singh', department: 'HR', shift: 'General', checkIn: '09:25', checkOut: null, status: 'late', overtime: 0, workHours: '6h 35m' },
  { id: '3', employeeId: 'EMP003', employeeName: 'Amit Sharma', department: 'Finance', shift: 'General', checkIn: '08:55', checkOut: '18:00', status: 'present', overtime: 0, workHours: '9h 05m' },
  { id: '4', employeeId: 'EMP004', employeeName: 'Neha Gupta', department: 'Marketing', shift: 'General', checkIn: '-', checkOut: '-', status: 'absent', overtime: 0, workHours: '-' },
  { id: '5', employeeId: 'EMP005', employeeName: 'Vikram Patel', department: 'Sales', shift: 'Morning', checkIn: '06:05', checkOut: '14:30', status: 'present', overtime: 0.5, workHours: '8h 25m' },
  { id: '6', employeeId: 'EMP006', employeeName: 'Sunita Rao', department: 'Operations', shift: 'Evening', checkIn: '14:10', checkOut: null, status: 'late', overtime: 0, workHours: '5h 50m' },
];

const statusConfig = {
  present: { label: 'Present', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  late: { label: 'Late', color: 'bg-amber-100 text-amber-700', icon: AlertTriangle },
  absent: { label: 'Absent', color: 'bg-red-100 text-red-700', icon: XCircle },
  'half-day': { label: 'Half Day', color: 'bg-blue-100 text-blue-700', icon: Timer },
};

const stats = [
  { label: 'Present Today', value: 1180, total: 1248, color: 'text-emerald-600' },
  { label: 'Late Arrivals', value: 42, total: 1248, color: 'text-amber-600' },
  { label: 'Absent', value: 35, total: 1248, color: 'text-red-600' },
  { label: 'Overtime Hours', value: 128, suffix: 'hrs', color: 'text-violet-600' },
];

export default function CorporateAttendance() {
  const [selectedShift, setSelectedShift] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                  {stat.total && <span className="text-sm text-slate-400">/ {stat.total}</span>}
                  {stat.suffix && <span className="text-sm text-slate-400">{stat.suffix}</span>}
                </div>
                {stat.total && (
                  <Progress value={(stat.value / stat.total) * 100} className="h-1.5 mt-2" />
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="attendance" className="w-full">
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="attendance" className="gap-2">
              <Clock className="w-4 h-4" />
              Today's Attendance
            </TabsTrigger>
            <TabsTrigger value="shifts" className="gap-2">
              <Sun className="w-4 h-4" />
              Shift Management
            </TabsTrigger>
            <TabsTrigger value="overtime" className="gap-2">
              <Timer className="w-4 h-4" />
              Overtime Tracking
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Select value={selectedShift} onValueChange={setSelectedShift}>
              <SelectTrigger className="w-[180px] bg-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                {shifts.map(shift => (
                  <SelectItem key={shift.id} value={shift.id}>{shift.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Search employee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px] bg-white"
            />
          </div>
        </div>

        {/* Today's Attendance Tab */}
        <TabsContent value="attendance">
          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Employee</TableHead>
                    <TableHead className="font-semibold">Department</TableHead>
                    <TableHead className="font-semibold">Shift</TableHead>
                    <TableHead className="font-semibold">Check In</TableHead>
                    <TableHead className="font-semibold">Check Out</TableHead>
                    <TableHead className="font-semibold">Work Hours</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Overtime</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAttendance.map((record, index) => {
                    const StatusIcon = statusConfig[record.status].icon;
                    return (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-slate-50"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">{record.employeeName}</p>
                            <p className="text-xs text-slate-500">{record.employeeId}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">{record.department}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{record.shift}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className={record.status === 'late' ? 'text-amber-600 font-medium' : 'text-slate-900'}>
                            {record.checkIn}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {record.checkOut || <span className="text-slate-400">—</span>}
                        </TableCell>
                        <TableCell className="font-medium">{record.workHours}</TableCell>
                        <TableCell>
                          <Badge className={statusConfig[record.status].color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[record.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {record.overtime > 0 ? (
                            <span className="text-violet-600 font-medium">+{record.overtime}h</span>
                          ) : (
                            <span className="text-slate-400">—</span>
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

        {/* Shifts Tab */}
        <TabsContent value="shifts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {shifts.map((shift, index) => (
              <motion.div
                key={shift.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${shift.color} rounded-xl flex items-center justify-center`}>
                        {shift.name.includes('Morning') && <Sun className="w-6 h-6 text-white" />}
                        {shift.name.includes('General') && <Clock className="w-6 h-6 text-white" />}
                        {shift.name.includes('Evening') && <Sun className="w-6 h-6 text-white" />}
                        {shift.name.includes('Night') && <Moon className="w-6 h-6 text-white" />}
                      </div>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{shift.name}</h3>
                    <p className="text-sm text-slate-500 mb-3">
                      {shift.startTime} - {shift.endTime}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gap-1">
                        <Users className="w-3 h-3" />
                        {shift.employees} employees
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Add New Shift Card */}
            <Dialog>
              <DialogTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="border-2 border-dashed border-slate-300 hover:border-violet-400 transition-colors cursor-pointer h-full">
                    <CardContent className="p-5 flex flex-col items-center justify-center h-full min-h-[180px]">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                        <Plus className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="font-medium text-slate-600">Add New Shift</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Shift</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Shift Name</Label>
                    <Input placeholder="e.g., Afternoon Shift" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input type="time" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Grace Period (minutes)</Label>
                    <Input type="number" placeholder="15" />
                  </div>
                  <Button className="w-full">Create Shift</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>

        {/* Overtime Tab */}
        <TabsContent value="overtime">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Timer className="w-5 h-5 text-violet-500" />
                Overtime Summary - This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-violet-50 rounded-lg">
                  <p className="text-sm text-violet-600 mb-1">Total Overtime Hours</p>
                  <p className="text-3xl font-bold text-violet-700">892 hrs</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-emerald-600 mb-1">Employees with OT</p>
                  <p className="text-3xl font-bold text-emerald-700">245</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-600 mb-1">Avg OT per Employee</p>
                  <p className="text-3xl font-bold text-amber-700">3.6 hrs</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Total OT Hours</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: 'Rajesh Kumar', dept: 'Engineering', hours: 24, rate: 500, amount: 12000, status: 'approved' },
                    { name: 'Priya Sharma', dept: 'Operations', hours: 18, rate: 400, amount: 7200, status: 'pending' },
                    { name: 'Amit Verma', dept: 'Sales', hours: 12, rate: 350, amount: 4200, status: 'approved' },
                  ].map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{record.dept}</TableCell>
                      <TableCell>{record.hours} hrs</TableCell>
                      <TableCell>₹{record.rate}/hr</TableCell>
                      <TableCell className="font-semibold text-violet-600">₹{record.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={record.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Users(props: any) {
  return <Clock {...props} />;
}

function Plus(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
