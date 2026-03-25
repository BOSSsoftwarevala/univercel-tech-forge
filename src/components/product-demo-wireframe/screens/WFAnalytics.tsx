/**
 * ANALYTICS & FEEDBACK
 * Performance metrics, feedback, downloads
 */
import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Clock, Star, Download, 
  ArrowUpRight, ArrowDownRight, Eye, Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, 
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const attendanceData = [
  { day: 'Mon', rate: 78 },
  { day: 'Tue', rate: 85 },
  { day: 'Wed', rate: 72 },
  { day: 'Thu', rate: 91 },
  { day: 'Fri', rate: 68 },
  { day: 'Sat', rate: 45 },
  { day: 'Sun', rate: 38 },
];

const dropOffData = [
  { step: 'Intro', users: 100 },
  { step: 'Overview', users: 92 },
  { step: 'Features', users: 78 },
  { step: 'Demo', users: 65 },
  { step: 'Pricing', users: 52 },
  { step: 'CTA', users: 41 },
];

const feedbackData = [
  { rating: 5, count: 156 },
  { rating: 4, count: 89 },
  { rating: 3, count: 34 },
  { rating: 2, count: 12 },
  { rating: 1, count: 5 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export const WFAnalytics: React.FC = () => {
  const stats = [
    { label: 'Attendance Rate', value: '76%', change: '+5%', up: true, icon: Users },
    { label: 'Avg. Duration', value: '12:34', change: '+1:20', up: true, icon: Clock },
    { label: 'Avg. Rating', value: '4.6', change: '+0.2', up: true, icon: Star },
    { label: 'Downloads', value: '234', change: '-12', up: false, icon: Download },
  ];

  const recentFeedback = [
    { name: 'John S.', rating: 5, comment: 'Excellent demo, very informative!' },
    { name: 'Sarah M.', rating: 4, comment: 'Good overview, could use more examples.' },
    { name: 'Mike R.', rating: 5, comment: 'Perfect walkthrough of all features.' },
    { name: 'Lisa K.', rating: 3, comment: 'Decent but a bit long.' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Demo performance & feedback insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                      {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="dropoff">Drop-off</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
        </TabsList>

        {/* Attendance Rate */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Weekly Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`${value}%`, 'Rate']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drop-off Points */}
        <TabsContent value="dropoff">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">User Drop-off Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dropOffData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="step" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="users" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback */}
        <TabsContent value="feedback">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rating Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedbackData.map((item) => (
                    <div key={item.rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                      <Progress value={(item.count / 156) * 100} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground w-10 text-right">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Feedback */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentFeedback.map((feedback, i) => (
                  <div key={i} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{feedback.name}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: feedback.rating }).map((_, j) => (
                          <Star key={j} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{feedback.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Downloads */}
        <TabsContent value="downloads">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recording Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'CRM Pro Full Demo', downloads: 89, views: 234 },
                  { name: 'Feature Highlights', downloads: 67, views: 189 },
                  { name: 'Getting Started Guide', downloads: 45, views: 156 },
                  { name: 'Advanced Features', downloads: 33, views: 98 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Play className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {item.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {item.downloads} downloads
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">{Math.round((item.downloads / item.views) * 100)}%</Badge>
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
