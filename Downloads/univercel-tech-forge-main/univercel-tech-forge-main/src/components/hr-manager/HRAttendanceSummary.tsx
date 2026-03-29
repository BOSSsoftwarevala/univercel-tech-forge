import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AttendanceRecord {
  valaId: string;
  name: string;
  department: string;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  leaveDays: number;
  workingDays: number;
  attendanceRate: number;
}

const mockAttendance: AttendanceRecord[] = [
  { valaId: 'EMP-1001', name: 'Employee A', department: 'Engineering', presentDays: 20, absentDays: 1, lateDays: 2, leaveDays: 1, workingDays: 22, attendanceRate: 95 },
  { valaId: 'EMP-1002', name: 'Employee B', department: 'Design', presentDays: 22, absentDays: 0, lateDays: 0, leaveDays: 0, workingDays: 22, attendanceRate: 100 },
  { valaId: 'EMP-1003', name: 'Employee C', department: 'Operations', presentDays: 15, absentDays: 3, lateDays: 4, leaveDays: 5, workingDays: 22, attendanceRate: 68 },
  { valaId: 'EMP-1005', name: 'Employee E', department: 'Engineering', presentDays: 19, absentDays: 2, lateDays: 1, leaveDays: 0, workingDays: 22, attendanceRate: 86 },
];

const getAttendanceColor = (rate: number) => {
  if (rate >= 95) return 'text-emerald-400';
  if (rate >= 80) return 'text-amber-400';
  return 'text-red-400';
};

export default function HRAttendanceSummary() {
  const [selectedMonth, setSelectedMonth] = useState('december_2024');

  const avgAttendance = Math.round(
    mockAttendance.reduce((sum, r) => sum + r.attendanceRate, 0) / mockAttendance.length
  );

  const totalPresent = mockAttendance.reduce((sum, r) => sum + r.presentDays, 0);
  const totalAbsent = mockAttendance.reduce((sum, r) => sum + r.absentDays, 0);
  const totalLate = mockAttendance.reduce((sum, r) => sum + r.lateDays, 0);

  return (
    <div className="space-y-4">
      {/* Month Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono text-zinc-400">ATTENDANCE SUMMARY</h3>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-700">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            <SelectItem value="december_2024">December 2024</SelectItem>
            <SelectItem value="november_2024">November 2024</SelectItem>
            <SelectItem value="october_2024">October 2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
            <p className="text-2xl font-mono font-bold">{totalPresent}</p>
            <p className="text-xs text-zinc-500">Total Present</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 text-center">
            <XCircle className="w-5 h-5 mx-auto mb-2 text-red-400" />
            <p className="text-2xl font-mono font-bold">{totalAbsent}</p>
            <p className="text-xs text-zinc-500">Total Absent</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-2 text-amber-400" />
            <p className="text-2xl font-mono font-bold">{totalLate}</p>
            <p className="text-xs text-zinc-500">Late Arrivals</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 text-center">
            <Calendar className="w-5 h-5 mx-auto mb-2 text-blue-400" />
            <p className={`text-2xl font-mono font-bold ${getAttendanceColor(avgAttendance)}`}>
              {avgAttendance}%
            </p>
            <p className="text-xs text-zinc-500">Avg Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Records */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono tracking-wider text-zinc-400">
            INDIVIDUAL ATTENDANCE
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockAttendance.map((record, idx) => (
            <motion.div
              key={record.valaId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{record.name}</span>
                    <span className="font-mono text-xs text-zinc-500">{record.valaId}</span>
                  </div>
                  <p className="text-sm text-zinc-400">{record.department}</p>
                </div>
                <div className={`text-2xl font-mono font-bold ${getAttendanceColor(record.attendanceRate)}`}>
                  {record.attendanceRate}%
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-2 bg-emerald-500/10 rounded">
                  <p className="text-lg font-mono font-bold text-emerald-400">{record.presentDays}</p>
                  <p className="text-xs text-zinc-500">Present</p>
                </div>
                <div className="p-2 bg-red-500/10 rounded">
                  <p className="text-lg font-mono font-bold text-red-400">{record.absentDays}</p>
                  <p className="text-xs text-zinc-500">Absent</p>
                </div>
                <div className="p-2 bg-amber-500/10 rounded">
                  <p className="text-lg font-mono font-bold text-amber-400">{record.lateDays}</p>
                  <p className="text-xs text-zinc-500">Late</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded">
                  <p className="text-lg font-mono font-bold text-blue-400">{record.leaveDays}</p>
                  <p className="text-xs text-zinc-500">Leave</p>
                </div>
              </div>

              {record.attendanceRate < 80 && (
                <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-red-400">Below minimum attendance threshold</span>
                </div>
              )}
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
