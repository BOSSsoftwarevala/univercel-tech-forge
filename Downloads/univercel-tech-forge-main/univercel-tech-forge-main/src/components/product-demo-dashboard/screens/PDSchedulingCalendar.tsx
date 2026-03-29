/**
 * PD SCHEDULING & CALENDAR
 * Calendar view and scheduling management
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Globe2, 
  Bell,
  Plus,
  Video,
  User
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ScheduledDemo {
  id: string;
  title: string;
  time: string;
  attendee: string;
  type: 'live' | 'recorded';
  status: 'confirmed' | 'pending' | 'completed';
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

const scheduledDemos: Record<string, ScheduledDemo[]> = {
  'Mon': [
    { id: '1', title: 'CRM Demo', time: '10:00 AM', attendee: 'Acme Corp', type: 'live', status: 'confirmed' },
    { id: '2', title: 'API Walkthrough', time: '02:00 PM', attendee: 'TechStart', type: 'live', status: 'pending' },
  ],
  'Tue': [
    { id: '3', title: 'Mobile SDK Demo', time: '11:00 AM', attendee: 'AppWorks', type: 'recorded', status: 'confirmed' },
  ],
  'Wed': [
    { id: '4', title: 'Enterprise Suite', time: '09:00 AM', attendee: 'BigCorp Inc', type: 'live', status: 'confirmed' },
    { id: '5', title: 'Analytics Demo', time: '03:00 PM', attendee: 'DataViz Co', type: 'live', status: 'confirmed' },
  ],
  'Thu': [
    { id: '6', title: 'Payment Gateway', time: '10:00 AM', attendee: 'PayFlow', type: 'live', status: 'pending' },
  ],
  'Fri': [
    { id: '7', title: 'Full Platform Tour', time: '01:00 PM', attendee: 'GlobalTech', type: 'live', status: 'confirmed' },
  ],
};

const timezones = [
  { value: 'IST', label: 'IST (India)' },
  { value: 'EST', label: 'EST (New York)' },
  { value: 'PST', label: 'PST (Los Angeles)' },
  { value: 'GMT', label: 'GMT (London)' },
  { value: 'SGT', label: 'SGT (Singapore)' },
];

export const PDSchedulingCalendar: React.FC = () => {
  const [selectedTimezone, setSelectedTimezone] = useState('IST');
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'month'>('week');
  const [autoSlots, setAutoSlots] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const handleScheduleDemo = () => {
    toast({
      title: "Schedule Demo",
      description: "Opening scheduling dialog...",
    });
  };

  const handleDemoClick = (demo: ScheduledDemo) => {
    toast({
      title: demo.title,
      description: `${demo.time} with ${demo.attendee}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Scheduling & Calendar</h1>
          <p className="text-slate-500 mt-1">Manage demo appointments and availability</p>
        </div>
        <Button onClick={handleScheduleDemo} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Demo
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Timezone Selector */}
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-slate-500" />
          <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Mode */}
        <div className="flex bg-slate-100 rounded-lg p-1">
          {(['day', 'week', 'month'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${
                viewMode === mode 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="icon">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-slate-700 min-w-[120px] text-center">
            Jan 13 - 19, 2025
          </span>
          <Button variant="outline" size="icon">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar View */}
        <Card className="border-0 shadow-sm lg:col-span-3">
          <CardContent className="p-4">
            {/* Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map((day, index) => {
                const date = 13 + index;
                const isToday = index === 2; // Wednesday as "today"
                return (
                  <div 
                    key={day}
                    className={`text-center p-2 rounded-lg ${
                      isToday ? 'bg-blue-50' : ''
                    }`}
                  >
                    <p className="text-xs text-slate-500">{day}</p>
                    <p className={`text-lg font-semibold ${
                      isToday ? 'text-blue-600' : 'text-slate-800'
                    }`}>
                      {date}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Demo Slots */}
            <div className="grid grid-cols-7 gap-2 min-h-[400px]">
              {weekDays.map((day) => {
                const demos = scheduledDemos[day] || [];
                return (
                  <div key={day} className="space-y-2">
                    {demos.map((demo) => (
                      <button
                        key={demo.id}
                        onClick={() => handleDemoClick(demo)}
                        className={`w-full p-2 rounded-lg text-left transition-all hover:scale-[1.02] ${
                          demo.status === 'confirmed' 
                            ? 'bg-blue-50 border-l-4 border-blue-500' 
                            : 'bg-amber-50 border-l-4 border-amber-500'
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <Video className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-600">{demo.time}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-800 truncate">{demo.title}</p>
                        <p className="text-xs text-slate-500 truncate">{demo.attendee}</p>
                      </button>
                    ))}
                    {demos.length === 0 && (
                      <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center">
                        <Plus className="w-4 h-4 text-slate-300" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Settings Panel */}
        <div className="space-y-4">
          {/* Auto Slot Availability */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Auto Slot Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Enable auto-slots</span>
                <Switch checked={autoSlots} onCheckedChange={setAutoSlots} />
              </div>
              <div className="text-xs text-slate-500">
                Automatically show available slots based on your calendar
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-700">Available Hours:</p>
                <div className="flex flex-wrap gap-1">
                  {timeSlots.slice(0, 6).map((slot) => (
                    <Badge key={slot} variant="outline" className="text-xs">
                      {slot}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reminder Notifications */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Email reminders</span>
                <Switch checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-700">Send before:</p>
                <Select defaultValue="60">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="1440">1 day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Demos */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-700">
                Upcoming Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduledDemos['Wed']?.map((demo) => (
                  <div key={demo.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{demo.title}</p>
                      <p className="text-xs text-slate-500">{demo.time}</p>
                    </div>
                    <Badge 
                      className={`text-xs ${
                        demo.status === 'confirmed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {demo.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
