import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';

interface AttendanceRecord {
  employeeId: string;
  employeeName: string;
  date: Date;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'absent' | 'late' | 'leave';
}

const employees = [
  { id: '1', name: 'Rahul Kumar' },
  { id: '2', name: 'Priya Singh' },
  { id: '3', name: 'Amit Sharma' },
  { id: '4', name: 'Neha Gupta' },
  { id: '5', name: 'Vikram Patel' },
];

// Generate mock attendance for current month
const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  employees.forEach(emp => {
    for (let i = 1; i <= today.getDate(); i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), i);
      const dayOfWeek = date.getDay();
      
      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends
      
      const random = Math.random();
      let status: 'present' | 'absent' | 'late' | 'leave' = 'present';
      let checkIn = '09:00';
      let checkOut = '18:00';
      
      if (random > 0.9) {
        status = 'absent';
        checkIn = null;
        checkOut = null;
      } else if (random > 0.8) {
        status = 'leave';
        checkIn = null;
        checkOut = null;
      } else if (random > 0.7) {
        status = 'late';
        checkIn = '09:' + (15 + Math.floor(Math.random() * 45)).toString().padStart(2, '0');
      }
      
      records.push({
        employeeId: emp.id,
        employeeName: emp.name,
        date,
        checkIn,
        checkOut,
        status,
      });
    }
  });
  
  return records;
};

const statusConfig = {
  present: { label: 'Present', color: 'bg-emerald-500', badge: 'default' as const },
  absent: { label: 'Absent', color: 'bg-red-500', badge: 'destructive' as const },
  late: { label: 'Late', color: 'bg-amber-500', badge: 'secondary' as const },
  leave: { label: 'Leave', color: 'bg-blue-500', badge: 'outline' as const },
};

export default function HRMAttendance() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendanceRecords] = useState<AttendanceRecord[]>(generateMockAttendance());
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const today = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const todayRecords = attendanceRecords.filter(r => isSameDay(r.date, today));

  const handleCheckIn = (employeeId: string) => {
    console.log('Check in:', employeeId);
  };

  const handleCheckOut = (employeeId: string) => {
    console.log('Check out:', employeeId);
  };

  return (
    <div className="space-y-6">
      {/* Today's Quick Check-in/out */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Today's Attendance - {format(today, 'MMMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {employees.map((emp, index) => {
              const record = todayRecords.find(r => r.employeeId === emp.id);
              const hasCheckedIn = record?.checkIn;
              const hasCheckedOut = record?.checkOut && record?.checkIn;

              return (
                <motion.div
                  key={emp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-medium text-sm">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-lg">{emp.name}</p>
                      {record && (
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          {record.checkIn && <span>In: {record.checkIn}</span>}
                          {record.checkOut && <span>Out: {record.checkOut}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {record && (
                      <Badge variant={statusConfig[record.status].badge}>
                        {statusConfig[record.status].label}
                      </Badge>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="lg"
                        variant={hasCheckedIn ? 'outline' : 'default'}
                        onClick={() => handleCheckIn(emp.id)}
                        disabled={!!hasCheckedIn}
                        className="gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Check In
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => handleCheckOut(emp.id)}
                        disabled={!hasCheckedIn || !!hasCheckedOut}
                        className="gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Check Out
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Calendar View */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Monthly View
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-medium px-4">{format(currentMonth, 'MMMM yyyy')}</span>
              <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {daysInMonth.map(day => {
              const dayRecords = attendanceRecords.filter(r => isSameDay(r.date, day));
              const presentCount = dayRecords.filter(r => r.status === 'present' || r.status === 'late').length;
              const isToday = isSameDay(day, today);
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;

              return (
                <div
                  key={day.toISOString()}
                  className={`p-3 rounded-lg text-center border transition-colors ${
                    isToday 
                      ? 'border-primary bg-primary/10' 
                      : isWeekend 
                        ? 'bg-muted/30 border-transparent' 
                        : 'border-border/50 hover:border-primary/30'
                  }`}
                >
                  <span className={`text-lg font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                    {format(day, 'd')}
                  </span>
                  {!isWeekend && dayRecords.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {presentCount}/{employees.length}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-6 pt-4 border-t border-border justify-center">
            {Object.entries(statusConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${config.color}`} />
                <span className="text-sm text-muted-foreground">{config.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
