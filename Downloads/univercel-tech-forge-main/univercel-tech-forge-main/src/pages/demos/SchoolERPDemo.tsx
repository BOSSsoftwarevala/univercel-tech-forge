import React, { useState } from 'react';
import { 
  GraduationCap, Users, Calendar, FileText, Bell,
  BookOpen, ClipboardList, User, Check, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import softwareValaLogo from '@/assets/software-vala-logo.jpg';

// Sample data
const students = [
  { id: 1, name: 'Rahul Kumar', class: '10-A', roll: 1, attendance: 92, fees: 'paid' },
  { id: 2, name: 'Priya Sharma', class: '10-A', roll: 2, attendance: 88, fees: 'paid' },
  { id: 3, name: 'Amit Singh', class: '10-A', roll: 3, attendance: 75, fees: 'pending' },
  { id: 4, name: 'Neha Gupta', class: '10-A', roll: 4, attendance: 95, fees: 'paid' },
  { id: 5, name: 'Vikram Patel', class: '10-A', roll: 5, attendance: 82, fees: 'partial' },
];

const todaySchedule = [
  { time: '8:00', subject: 'Mathematics', teacher: 'Mr. Sharma' },
  { time: '9:00', subject: 'English', teacher: 'Ms. Verma' },
  { time: '10:00', subject: 'Science', teacher: 'Mr. Kumar' },
  { time: '11:00', subject: 'Break', teacher: '-' },
  { time: '11:30', subject: 'Hindi', teacher: 'Ms. Singh' },
  { time: '12:30', subject: 'Social Studies', teacher: 'Mr. Patel' },
];

const SchoolERPDemo = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});

  const toggleAttendance = (id: number) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const stats = [
    { label: 'Total Students', value: '1,245', icon: Users, color: 'text-blue-500' },
    { label: 'Teachers', value: '68', icon: GraduationCap, color: 'text-green-500' },
    { label: 'Classes', value: '42', icon: BookOpen, color: 'text-purple-500' },
    { label: 'Attendance Today', value: '94%', icon: ClipboardList, color: 'text-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={softwareValaLogo} alt="Software Vala" className="w-10 h-10 rounded-full" />
            <div>
              <h1 className="font-bold text-lg">School ERP</h1>
              <p className="text-xs text-muted-foreground">Powered by Software Vala</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Bell className="w-3 h-3" />
            3 Notices
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard" className="gap-1">
              <GraduationCap className="w-4 h-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="attendance" className="gap-1">
              <ClipboardList className="w-4 h-4" /> Attendance
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-1">
              <Calendar className="w-4 h-4" /> Schedule
            </TabsTrigger>
            <TabsTrigger value="fees" className="gap-1">
              <FileText className="w-4 h-4" /> Fees
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, i) => (
                <Card key={i}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Recent Notices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['Annual Day on 15th Jan', 'PTM scheduled for 20th Jan', 'Fee deadline: 25th Jan'].map((notice, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                      <Bell className="w-4 h-4 text-primary" />
                      <span className="text-sm">{notice}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Class Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { class: '10-A', avg: 78 },
                    { class: '10-B', avg: 82 },
                    { class: '9-A', avg: 75 },
                  ].map((c, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{c.class}</span>
                        <span>{c.avg}%</span>
                      </div>
                      <Progress value={c.avg} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Attendance */}
          <TabsContent value="attendance">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Class 10-A Attendance</CardTitle>
                  <Badge>{new Date().toLocaleDateString()}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {students.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-muted-foreground">Roll #{student.roll}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={attendance[student.id] === true ? 'default' : 'outline'}
                          className="h-8 w-8 p-0"
                          onClick={() => toggleAttendance(student.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={attendance[student.id] === false ? 'destructive' : 'outline'}
                          className="h-8 w-8 p-0"
                          onClick={() => setAttendance(prev => ({ ...prev, [student.id]: false }))}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">Save Attendance</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Today's Timetable - Class 10-A</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {todaySchedule.map((slot, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center gap-4 p-3 rounded-lg ${
                        slot.subject === 'Break' ? 'bg-muted' : 'border'
                      }`}
                    >
                      <div className="w-16 text-sm font-medium">{slot.time}</div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{slot.subject}</p>
                        <p className="text-xs text-muted-foreground">{slot.teacher}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fees */}
          <TabsContent value="fees">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Fee Status - Class 10-A</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {students.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{student.name}</p>
                        <p className="text-xs text-muted-foreground">Roll #{student.roll}</p>
                      </div>
                      <Badge variant={
                        student.fees === 'paid' ? 'default' :
                        student.fees === 'pending' ? 'destructive' : 'secondary'
                      }>
                        {student.fees}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t py-4 mt-8">
        <p className="text-center text-xs text-muted-foreground">
          Powered by <span className="font-medium">Software Vala</span> • The Name of Trust
        </p>
      </footer>
    </div>
  );
};

export default SchoolERPDemo;
