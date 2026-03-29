/**
 * PD ANALYTICS & FEEDBACK
 * Analytics, attendance, and feedback reports
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  TrendingDown, 
  Star, 
  Download,
  Search,
  Play,
  Clock,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const attendanceData = [
  { demo: 'CRM Tour', scheduled: 45, attended: 38, rate: 84 },
  { demo: 'Mobile SDK', scheduled: 32, attended: 28, rate: 87 },
  { demo: 'API Guide', scheduled: 28, attended: 22, rate: 79 },
  { demo: 'Analytics', scheduled: 35, attended: 30, rate: 86 },
  { demo: 'Payment', scheduled: 25, attended: 21, rate: 84 },
];

const dropOffData = [
  { step: 'Welcome', viewers: 100 },
  { step: 'Overview', viewers: 92 },
  { step: 'Features', viewers: 78 },
  { step: 'Demo', viewers: 65 },
  { step: 'Pricing', viewers: 52 },
  { step: 'CTA', viewers: 45 },
];

const feedbackData = [
  { id: '1', demo: 'Enterprise CRM', user: 'John S.', rating: 5, comment: 'Very informative and well structured!', date: '2025-01-15' },
  { id: '2', demo: 'Mobile SDK', user: 'Sarah J.', rating: 4, comment: 'Great demo, would love more technical depth', date: '2025-01-14' },
  { id: '3', demo: 'API Integration', user: 'Mike P.', rating: 5, comment: 'Exactly what I needed to see', date: '2025-01-14' },
  { id: '4', demo: 'Analytics Suite', user: 'Emma W.', rating: 3, comment: 'Good but could be shorter', date: '2025-01-13' },
  { id: '5', demo: 'Payment Gateway', user: 'Raj P.', rating: 5, comment: 'Excellent presentation!', date: '2025-01-12' },
];

const ratingDistribution = [
  { rating: '5 Stars', count: 145, color: '#22C55E' },
  { rating: '4 Stars', count: 78, color: '#84CC16' },
  { rating: '3 Stars', count: 32, color: '#EAB308' },
  { rating: '2 Stars', count: 12, color: '#F97316' },
  { rating: '1 Star', count: 5, color: '#EF4444' },
];

const recordings = [
  { id: '1', name: 'CRM Demo - Jan 15', duration: '12:45', downloads: 45, size: '124 MB' },
  { id: '2', name: 'Mobile SDK Tour - Jan 14', duration: '18:30', downloads: 32, size: '186 MB' },
  { id: '3', name: 'API Walkthrough - Jan 12', duration: '15:20', downloads: 28, size: '156 MB' },
];

export const PDAnalyticsFeedback: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const avgRating = (feedbackData.reduce((acc, f) => acc + f.rating, 0) / feedbackData.length).toFixed(1);
  const avgAttendance = Math.round(attendanceData.reduce((acc, d) => acc + d.rate, 0) / attendanceData.length);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics & Feedback</h1>
          <p className="text-slate-500 mt-1">Track demo performance and user feedback</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{avgAttendance}%</p>
              <p className="text-xs text-slate-500">Avg Attendance</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{avgRating}</p>
              <p className="text-xs text-slate-500">Avg Rating</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">55%</p>
              <p className="text-xs text-slate-500">Drop-off Rate</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Download className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">105</p>
              <p className="text-xs text-slate-500">Downloads</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="attendance" className="data-[state=active]:bg-white">Attendance</TabsTrigger>
          <TabsTrigger value="dropoff" className="data-[state=active]:bg-white">Drop-off Points</TabsTrigger>
          <TabsTrigger value="feedback" className="data-[state=active]:bg-white">Feedback</TabsTrigger>
          <TabsTrigger value="recordings" className="data-[state=active]:bg-white">Recordings</TabsTrigger>
        </TabsList>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-700">Attendance Rate by Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="demo" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }}
                    />
                    <Bar dataKey="scheduled" name="Scheduled" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="attended" name="Attended" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drop-off Points Tab */}
        <TabsContent value="dropoff">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Drop-off Points Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dropOffData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="step" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="viewers" 
                      stroke="#EF4444" 
                      strokeWidth={3}
                      dot={{ fill: '#EF4444', strokeWidth: 2, r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-amber-50 rounded-xl">
                <p className="text-sm text-amber-800">
                  <strong>Insight:</strong> Major drop-off occurs between "Features" and "Demo" steps. Consider shortening the features section or making it more engaging.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feedback List */}
            <Card className="border-0 shadow-sm lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-slate-700">Recent Feedback</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-48"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedbackData.map((feedback) => (
                    <div key={feedback.id} className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{feedback.demo}</p>
                          <p className="text-xs text-slate-500">{feedback.user} • {feedback.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">"{feedback.comment}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rating Distribution */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-700">Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ratingDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="count"
                      >
                        {ratingDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {ratingDistribution.map((item) => (
                    <div key={item.rating} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-600">{item.rating}</span>
                      </div>
                      <span className="font-medium text-slate-700">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recordings Tab */}
        <TabsContent value="recordings">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-700">Demo Recordings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recordings.map((recording) => (
                  <div
                    key={recording.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Play className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{recording.name}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {recording.duration}
                          </span>
                          <span>•</span>
                          <span>{recording.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-700">{recording.downloads}</p>
                        <p className="text-xs text-slate-500">downloads</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
