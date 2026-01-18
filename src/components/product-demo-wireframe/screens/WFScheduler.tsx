/**
 * SCREEN 4: SCHEDULER
 * Calendar view, time slots, timezone selector
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Globe, Bell, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const mockSchedules: Record<number, { time: string; demo: string; attendees: number }[]> = {
  15: [{ time: '10:00 AM', demo: 'CRM Pro', attendees: 5 }],
  17: [{ time: '2:00 PM', demo: 'ERP Overview', attendees: 8 }],
  20: [
    { time: '9:00 AM', demo: 'HR Module', attendees: 3 },
    { time: '3:00 PM', demo: 'Analytics', attendees: 6 },
  ],
  22: [{ time: '11:00 AM', demo: 'Mobile App', attendees: 4 }],
  25: [{ time: '10:30 AM', demo: 'Security Features', attendees: 7 }],
};

export const WFScheduler: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [timezone, setTimezone] = useState('UTC+5:30');
  const [autoReminder, setAutoReminder] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Schedule</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage demo appointments</p>
        </div>
        <Button className="gap-2" onClick={() => toast.success('Schedule dialog would open')}>
          <Plus className="w-4 h-4" />
          New Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{MONTHS[month]} {year}</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const hasSchedule = day && mockSchedules[day];
                const isSelected = day === selectedDay;
                const isToday = day === new Date().getDate() && month === new Date().getMonth();

                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: day ? 1.05 : 1 }}
                    whileTap={{ scale: day ? 0.95 : 1 }}
                    onClick={() => day && setSelectedDay(day)}
                    className={`
                      aspect-square p-1 rounded-lg cursor-pointer transition-colors
                      ${!day ? 'cursor-default' : ''}
                      ${isSelected ? 'bg-primary text-primary-foreground' : ''}
                      ${isToday && !isSelected ? 'bg-primary/10 text-primary' : ''}
                      ${day && !isSelected && !isToday ? 'hover:bg-muted' : ''}
                    `}
                  >
                    {day && (
                      <div className="h-full flex flex-col items-center justify-center relative">
                        <span className="text-sm font-medium">{day}</span>
                        {hasSchedule && (
                          <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary-foreground' : 'bg-primary'}`} />
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Timezone */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Globe className="w-3 h-3" />
                  Timezone
                </label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                    <SelectItem value="UTC+5:30">UTC+5:30 (India)</SelectItem>
                    <SelectItem value="UTC-5">UTC-5 (New York)</SelectItem>
                    <SelectItem value="UTC-8">UTC-8 (Los Angeles)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Auto Reminder */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Auto Reminder</span>
                </div>
                <Switch checked={autoReminder} onCheckedChange={setAutoReminder} />
              </div>
            </CardContent>
          </Card>

          {/* Time Slots for Selected Day */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {selectedDay ? `${MONTHS[month]} ${selectedDay}` : 'Select a day'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDay && mockSchedules[selectedDay] ? (
                <div className="space-y-3">
                  {mockSchedules[selectedDay].map((slot, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{slot.demo}</p>
                          <p className="text-xs text-muted-foreground">{slot.time}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{slot.attendees}</Badge>
                    </motion.div>
                  ))}
                </div>
              ) : selectedDay ? (
                <div className="text-center py-6">
                  <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No demos scheduled</p>
                  <Button variant="link" size="sm" className="mt-2">
                    + Add slot
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  Click on a day to view slots
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
