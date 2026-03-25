import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  TrendingUp,
  Users,
  Timer,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const todayStats = {
  checkedIn: 142,
  total: 156,
  onTime: 128,
  late: 14,
  absent: 14,
  remote: 42
};

const attendanceLog = [
  { id: '1', name: 'Sarah Johnson', avatar: 'SJ', checkIn: '09:02 AM', checkOut: '06:15 PM', status: 'on-time', device: 'web', location: 'Office - HQ' },
  { id: '2', name: 'Mike Chen', avatar: 'MC', checkIn: '09:45 AM', checkOut: '06:30 PM', status: 'late', device: 'mobile', location: 'Remote - Home' },
  { id: '3', name: 'Emma Davis', avatar: 'ED', checkIn: '08:55 AM', checkOut: '05:00 PM', status: 'on-time', device: 'web', location: 'Office - Branch A' },
  { id: '4', name: 'Alex Wilson', avatar: 'AW', checkIn: '10:15 AM', checkOut: null, status: 'late', device: 'mobile', location: 'Remote - Cafe' },
  { id: '5', name: 'Lisa Brown', avatar: 'LB', checkIn: null, checkOut: null, status: 'absent', device: null, location: null },
];

const weeklyData = [
  { day: 'Mon', present: 148, late: 12, absent: 8 },
  { day: 'Tue', present: 152, late: 8, absent: 4 },
  { day: 'Wed', present: 145, late: 15, absent: 11 },
  { day: 'Thu', present: 150, late: 10, absent: 6 },
  { day: 'Fri', present: 142, late: 14, absent: 14 },
];

const SaasAttendance: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'bg-emerald-100 text-emerald-700';
      case 'late': return 'bg-amber-100 text-amber-700';
      case 'absent': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-time': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'late': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'absent': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Smart Attendance</h1>
          <p className="text-slate-500 mt-1">Track check-ins with geo and device-based logging</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Calendar className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Check-in Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-0 shadow-lg shadow-slate-200/50 bg-gradient-to-r from-violet-500 to-purple-600 text-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Your Status Today</p>
                <h2 className="text-3xl font-bold mt-2">
                  {isCheckedIn ? 'Checked In' : 'Not Checked In'}
                </h2>
                {isCheckedIn && (
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white/80" />
                      <span className="text-sm">09:02 AM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-white/80" />
                      <span className="text-sm">Office - HQ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-white/80" />
                      <span className="text-sm">Web Browser</span>
                    </div>
                  </div>
                )}
              </div>
              <Button
                size="lg"
                onClick={() => setIsCheckedIn(!isCheckedIn)}
                className={isCheckedIn 
                  ? "bg-white text-red-600 hover:bg-white/90"
                  : "bg-white text-violet-600 hover:bg-white/90"
                }
              >
                <Clock className="w-5 h-5 mr-2" />
                {isCheckedIn ? 'Check Out' : 'Check In'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Checked In', value: todayStats.checkedIn, color: 'emerald', icon: CheckCircle2 },
          { label: 'On Time', value: todayStats.onTime, color: 'blue', icon: Clock },
          { label: 'Late', value: todayStats.late, color: 'amber', icon: AlertCircle },
          { label: 'Absent', value: todayStats.absent, color: 'red', icon: XCircle },
          { label: 'Remote', value: todayStats.remote, color: 'purple', icon: MapPin },
          { label: 'Total', value: todayStats.total, color: 'slate', icon: Users },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-0 shadow-md shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 flex items-center justify-center mx-auto mb-2`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="bg-white/80 border border-slate-200/60 p-1">
          <TabsTrigger value="today" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Today's Log
          </TabsTrigger>
          <TabsTrigger value="weekly" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Weekly View
          </TabsTrigger>
          <TabsTrigger value="monthly" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
            Monthly Calendar
          </TabsTrigger>
        </TabsList>

        {/* Today's Log */}
        <TabsContent value="today">
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Attendance Log</CardTitle>
                <p className="text-sm text-slate-500">
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100">
                {attendanceLog.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-11 h-11">
                        <AvatarFallback className="bg-gradient-to-br from-violet-100 to-purple-100 text-violet-700">
                          {record.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900">{record.name}</h4>
                          {getStatusIcon(record.status)}
                        </div>
                        {record.location && (
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-500">{record.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">
                            {record.checkIn || '--:--'}
                          </span>
                          <span className="text-slate-400">→</span>
                          <span className="text-sm text-slate-600">
                            {record.checkOut || '--:--'}
                          </span>
                        </div>
                        {record.device && (
                          <div className="flex items-center justify-end gap-1 mt-1">
                            {record.device === 'web' ? (
                              <Monitor className="w-3 h-3 text-slate-400" />
                            ) : (
                              <Smartphone className="w-3 h-3 text-slate-400" />
                            )}
                            <span className="text-xs text-slate-400 capitalize">{record.device}</span>
                          </div>
                        )}
                      </div>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weekly View */}
        <TabsContent value="weekly">
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Weekly Overview</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium">Dec 30 - Jan 3</span>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {weeklyData.map((day, index) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-sm font-medium text-slate-600 mb-3">{day.day}</p>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-emerald-50">
                        <p className="text-lg font-bold text-emerald-700">{day.present}</p>
                        <p className="text-xs text-emerald-600">Present</p>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-50">
                        <p className="text-lg font-bold text-amber-700">{day.late}</p>
                        <p className="text-xs text-amber-600">Late</p>
                      </div>
                      <div className="p-3 rounded-xl bg-red-50">
                        <p className="text-lg font-bold text-red-700">{day.absent}</p>
                        <p className="text-xs text-red-600">Absent</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Calendar */}
        <TabsContent value="monthly">
          <Card className="border-0 shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>January 2026</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const dayNum = i - 3; // Offset for starting day
                  const isCurrentMonth = dayNum > 0 && dayNum <= 31;
                  const isToday = dayNum === 2;
                  const hasAttendance = isCurrentMonth && dayNum <= 2;
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm ${
                        !isCurrentMonth ? 'text-slate-300' :
                        isToday ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white' :
                        hasAttendance ? 'bg-emerald-50 text-emerald-700' :
                        'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {isCurrentMonth && dayNum}
                      {hasAttendance && !isToday && (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SaasAttendance;
