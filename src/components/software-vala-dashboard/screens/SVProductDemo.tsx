/**
 * PRODUCT DEMO MANAGEMENT
 * Demo scheduling, management, and conversion tracking
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Calendar, 
  Users, 
  TrendingUp,
  Clock,
  Video,
  Globe,
  Plus,
  ChevronLeft,
  ChevronRight,
  Bell
} from 'lucide-react';

const demos = [
  { name: 'Enterprise AI Suite', product: 'AI Platform', type: 'Live', status: 'active', manager: 'John D.', scheduled: 5, completed: 23 },
  { name: 'Mobile SDK Demo', product: 'Android SDK', type: 'Recorded', status: 'active', manager: 'Sarah M.', scheduled: 3, completed: 45 },
  { name: 'API Integration', product: 'REST API', type: 'Interactive', status: 'draft', manager: 'Dev Team', scheduled: 0, completed: 12 },
];

const scheduleData = [
  { time: '09:00', demo: 'Enterprise AI Suite', attendee: 'Acme Corp', timezone: 'EST', status: 'confirmed' },
  { time: '11:30', demo: 'Mobile SDK Demo', attendee: 'TechStart Inc', timezone: 'PST', status: 'pending' },
  { time: '14:00', demo: 'API Integration', attendee: 'DataFlow Ltd', timezone: 'GMT', status: 'confirmed' },
  { time: '16:30', demo: 'Enterprise AI Suite', attendee: 'Global Systems', timezone: 'IST', status: 'confirmed' },
];

const calendarDays = [
  { day: 14, events: 0 },
  { day: 15, events: 2 },
  { day: 16, events: 1 },
  { day: 17, events: 4, today: true },
  { day: 18, events: 2 },
  { day: 19, events: 0 },
  { day: 20, events: 3 },
];

export const SVProductDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimezone, setSelectedTimezone] = useState('utc');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Product Demo</h1>
          <p className="text-slate-500">Manage product demonstrations and scheduling</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Sync Calendar
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Demo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Demos</p>
                <p className="text-2xl font-bold text-slate-800">12</p>
              </div>
              <Play className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Demos</p>
                <p className="text-2xl font-bold text-slate-800">8</p>
              </div>
              <Video className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Scheduled Today</p>
                <p className="text-2xl font-bold text-slate-800">4</p>
              </div>
              <Calendar className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Conversion Rate</p>
                <p className="text-2xl font-bold text-slate-800">34%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="overview">Demo List</TabsTrigger>
          <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">All Demos</CardTitle>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Demo Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Product</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Manager</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Scheduled</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Completed</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demos.map((demo, i) => (
                      <tr key={i} className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Play className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{demo.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{demo.product}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{demo.type}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={demo.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}>
                            {demo.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{demo.manager}</td>
                        <td className="py-3 px-4 text-slate-600">{demo.scheduled}</td>
                        <td className="py-3 px-4 text-slate-600">{demo.completed}</td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduler" className="mt-4">
          <div className="grid grid-cols-12 gap-6">
            {/* Calendar */}
            <Card className="col-span-4">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">January 2024</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-center text-xs text-slate-400 py-2">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((d, i) => (
                    <div 
                      key={i} 
                      className={`p-2 text-center rounded-lg cursor-pointer hover:bg-slate-100 ${
                        d.today ? 'bg-blue-100 text-blue-700 font-bold' : ''
                      }`}
                    >
                      <span className="text-sm">{d.day}</span>
                      {d.events > 0 && (
                        <div className="flex justify-center mt-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Timezone</span>
                    <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">EST</SelectItem>
                        <SelectItem value="pst">PST</SelectItem>
                        <SelectItem value="ist">IST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Auto Reminder: 30 min before</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule List */}
            <Card className="col-span-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Today's Schedule</CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Slot
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scheduleData.map((slot, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-slate-800">{slot.time}</p>
                          <p className="text-xs text-slate-400">{slot.timezone}</p>
                        </div>
                        <div className="h-12 w-px bg-slate-200"></div>
                        <div>
                          <p className="font-medium text-slate-800">{slot.demo}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Users className="w-3 h-3 text-slate-400" />
                            <span className="text-sm text-slate-500">{slot.attendee}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={slot.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                          {slot.status}
                        </Badge>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Video className="w-4 h-4 mr-1" />
                          Join
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Demo Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-slate-100 rounded-full h-8">
                      <div className="bg-blue-500 h-8 rounded-full flex items-center justify-end pr-3" style={{ width: '100%' }}>
                        <span className="text-white text-sm font-medium">1,000 Views</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-slate-100 rounded-full h-8">
                      <div className="bg-blue-500 h-8 rounded-full flex items-center justify-end pr-3" style={{ width: '65%' }}>
                        <span className="text-white text-sm font-medium">650 Scheduled</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-slate-100 rounded-full h-8">
                      <div className="bg-blue-500 h-8 rounded-full flex items-center justify-end pr-3" style={{ width: '45%' }}>
                        <span className="text-white text-sm font-medium">450 Attended</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-full bg-slate-100 rounded-full h-8">
                      <div className="bg-green-500 h-8 rounded-full flex items-center justify-end pr-3" style={{ width: '34%' }}>
                        <span className="text-white text-sm font-medium">340 Converted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Country-wise Demos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { country: 'United States', flag: '🇺🇸', count: 156 },
                    { country: 'India', flag: '🇮🇳', count: 134 },
                    { country: 'United Kingdom', flag: '🇬🇧', count: 89 },
                    { country: 'Germany', flag: '🇩🇪', count: 67 },
                    { country: 'Singapore', flag: '🇸🇬', count: 45 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.flag}</span>
                        <span className="font-medium">{item.country}</span>
                      </div>
                      <span className="text-slate-600">{item.count} demos</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
