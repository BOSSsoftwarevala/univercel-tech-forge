import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Target, Award, Users, Calendar, Star,
  ChevronRight, BarChart3, Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

interface AppraisalCycle {
  id: string;
  name: string;
  period: string;
  status: 'active' | 'upcoming' | 'completed';
  progress: number;
  totalEmployees: number;
  completed: number;
}

interface PerformanceRecord {
  id: string;
  employee: string;
  department: string;
  manager: string;
  selfScore: number;
  managerScore: number;
  finalScore: number;
  rating: string;
  status: 'completed' | 'pending_review' | 'in_progress';
}

const appraisalCycles: AppraisalCycle[] = [
  { id: '1', name: 'Annual Review 2024', period: 'Jan 2024 - Dec 2024', status: 'active', progress: 65, totalEmployees: 1248, completed: 812 },
  { id: '2', name: 'Mid-Year Review 2024', period: 'Jan 2024 - Jun 2024', status: 'completed', progress: 100, totalEmployees: 1180, completed: 1180 },
  { id: '3', name: 'Q1 Review 2025', period: 'Jan 2025 - Mar 2025', status: 'upcoming', progress: 0, totalEmployees: 1248, completed: 0 },
];

const performanceData: PerformanceRecord[] = [
  { id: '1', employee: 'Rahul Kumar', department: 'Engineering', manager: 'Rajesh Verma', selfScore: 4.2, managerScore: 4.5, finalScore: 4.4, rating: 'Exceeds Expectations', status: 'completed' },
  { id: '2', employee: 'Priya Singh', department: 'HR', manager: 'Neha Gupta', selfScore: 4.0, managerScore: 4.0, finalScore: 4.0, rating: 'Meets Expectations', status: 'completed' },
  { id: '3', employee: 'Amit Sharma', department: 'Finance', manager: 'Vikram Patel', selfScore: 3.8, managerScore: 3.5, finalScore: 3.6, rating: 'Needs Improvement', status: 'pending_review' },
  { id: '4', employee: 'Sunita Rao', department: 'Operations', manager: 'Kiran Kumar', selfScore: 4.5, managerScore: 4.8, finalScore: 4.7, rating: 'Outstanding', status: 'completed' },
];

const skillsData = [
  { skill: 'Technical', score: 85 },
  { skill: 'Communication', score: 78 },
  { skill: 'Leadership', score: 72 },
  { skill: 'Problem Solving', score: 88 },
  { skill: 'Teamwork', score: 82 },
  { skill: 'Innovation', score: 75 },
];

const departmentScores = [
  { department: 'Engineering', score: 4.2 },
  { department: 'Sales', score: 4.0 },
  { department: 'Marketing', score: 3.8 },
  { department: 'Finance', score: 4.1 },
  { department: 'HR', score: 4.3 },
  { department: 'Operations', score: 3.9 },
];

const ratingConfig: Record<string, { color: string; bg: string }> = {
  'Outstanding': { color: 'text-violet-700', bg: 'bg-violet-100' },
  'Exceeds Expectations': { color: 'text-emerald-700', bg: 'bg-emerald-100' },
  'Meets Expectations': { color: 'text-blue-700', bg: 'bg-blue-100' },
  'Needs Improvement': { color: 'text-amber-700', bg: 'bg-amber-100' },
  'Below Expectations': { color: 'text-red-700', bg: 'bg-red-100' },
};

const statusConfig = {
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
  pending_review: { label: 'Pending Review', color: 'bg-amber-100 text-amber-700' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
};

export default function CorporatePerformance() {
  const activeCycle = appraisalCycles.find(c => c.status === 'active');

  return (
    <div className="space-y-6">
      {/* Active Cycle Banner */}
      {activeCycle && (
        <Card className="border-0 shadow-md bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-white/20 text-white">Active Cycle</Badge>
                </div>
                <h3 className="text-xl font-bold mb-1">{activeCycle.name}</h3>
                <p className="text-white/80">{activeCycle.period}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{activeCycle.progress}%</p>
                <p className="text-white/80">{activeCycle.completed}/{activeCycle.totalEmployees} completed</p>
                <Progress value={activeCycle.progress} className="h-2 mt-2 bg-white/20 [&>div]:bg-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Target className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Avg. Score</p>
                <p className="text-xl font-bold text-slate-900">4.1/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Top Performers</p>
                <p className="text-xl font-bold text-slate-900">124</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pending Reviews</p>
                <p className="text-xl font-bold text-slate-900">436</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Goals Achieved</p>
                <p className="text-xl font-bold text-slate-900">78%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reviews" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="reviews" className="gap-2">
              <Star className="w-4 h-4" />
              Performance Reviews
            </TabsTrigger>
            <TabsTrigger value="cycles" className="gap-2">
              <Calendar className="w-4 h-4" />
              Appraisal Cycles
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600">
            <Target className="w-4 h-4" />
            Start New Cycle
          </Button>
        </div>

        {/* Performance Reviews Tab */}
        <TabsContent value="reviews">
          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Employee</TableHead>
                    <TableHead className="font-semibold">Manager</TableHead>
                    <TableHead className="font-semibold text-center">Self Score</TableHead>
                    <TableHead className="font-semibold text-center">Manager Score</TableHead>
                    <TableHead className="font-semibold text-center">Final Score</TableHead>
                    <TableHead className="font-semibold">Rating</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performanceData.map((record, index) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900">{record.employee}</p>
                          <p className="text-xs text-slate-500">{record.department}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{record.manager}</TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{record.selfScore}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{record.managerScore}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-lg font-bold text-violet-600">{record.finalScore}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${ratingConfig[record.rating]?.bg} ${ratingConfig[record.rating]?.color}`}>
                          {record.rating}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig[record.status].color}>
                          {statusConfig[record.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appraisal Cycles Tab */}
        <TabsContent value="cycles">
          <div className="grid gap-4">
            {appraisalCycles.map((cycle, index) => (
              <motion.div
                key={cycle.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          cycle.status === 'active' ? 'bg-violet-100' :
                          cycle.status === 'completed' ? 'bg-emerald-100' : 'bg-slate-100'
                        }`}>
                          <Calendar className={`w-6 h-6 ${
                            cycle.status === 'active' ? 'text-violet-600' :
                            cycle.status === 'completed' ? 'text-emerald-600' : 'text-slate-600'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900">{cycle.name}</h3>
                            <Badge variant="outline" className={
                              cycle.status === 'active' ? 'border-violet-500 text-violet-600' :
                              cycle.status === 'completed' ? 'border-emerald-500 text-emerald-600' :
                              'border-slate-400 text-slate-500'
                            }>
                              {cycle.status.charAt(0).toUpperCase() + cycle.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500">{cycle.period}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-slate-900">{cycle.completed}</p>
                          <p className="text-sm text-slate-500">of {cycle.totalEmployees}</p>
                        </div>
                        <div className="w-32">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-500">Progress</span>
                            <span className="font-medium">{cycle.progress}%</span>
                          </div>
                          <Progress value={cycle.progress} className="h-2" />
                        </div>
                        <Button variant="outline">
                          Manage <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Skills Assessment Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={skillsData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: '#64748b' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Department-wise Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentScores} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 12 }} />
                      <YAxis type="category" dataKey="department" tick={{ fontSize: 12 }} width={80} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
