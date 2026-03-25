import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Building2, TrendingDown, Wallet, UserPlus, UserMinus,
  Clock, Calendar, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const stats = [
  { label: 'Total Employees', value: '1,248', change: '+12', trend: 'up', icon: Users, color: 'from-violet-500 to-indigo-600' },
  { label: 'Active Departments', value: '12', change: '+2', trend: 'up', icon: Building2, color: 'from-blue-500 to-cyan-600' },
  { label: 'Attrition Rate', value: '4.2%', change: '-0.8%', trend: 'down', icon: TrendingDown, color: 'from-emerald-500 to-teal-600' },
  { label: 'Monthly Payroll', value: '₹2.4Cr', change: '+5.2%', trend: 'up', icon: Wallet, color: 'from-amber-500 to-orange-600' },
];

const departmentData = [
  { name: 'Engineering', employees: 320, color: '#8b5cf6' },
  { name: 'Sales', employees: 180, color: '#3b82f6' },
  { name: 'Marketing', employees: 120, color: '#10b981' },
  { name: 'Finance', employees: 85, color: '#f59e0b' },
  { name: 'HR', employees: 45, color: '#ef4444' },
  { name: 'Operations', employees: 210, color: '#6366f1' },
  { name: 'Support', employees: 156, color: '#14b8a6' },
  { name: 'Legal', employees: 32, color: '#f97316' },
];

const headcountTrend = [
  { month: 'Jul', employees: 1120, hires: 45, exits: 12 },
  { month: 'Aug', employees: 1150, hires: 42, exits: 15 },
  { month: 'Sep', employees: 1185, hires: 50, exits: 18 },
  { month: 'Oct', employees: 1210, hires: 38, exits: 22 },
  { month: 'Nov', employees: 1230, hires: 35, exits: 15 },
  { month: 'Dec', employees: 1248, hires: 28, exits: 10 },
];

const recentActivity = [
  { type: 'hire', name: 'Priya Sharma', department: 'Engineering', date: 'Today' },
  { type: 'promotion', name: 'Rahul Verma', department: 'Sales', date: 'Yesterday' },
  { type: 'leave', name: 'Amit Kumar', department: 'Finance', date: '2 days ago' },
  { type: 'exit', name: 'Neha Singh', department: 'Marketing', date: '3 days ago' },
];

const attendanceToday = { present: 1180, absent: 35, onLeave: 33 };

export default function CorporateDashboard() {
  const totalDeptEmployees = departmentData.reduce((sum, d) => sum + d.employees, 0);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      <div className={`flex items-center gap-1 mt-1 text-sm ${
                        stat.trend === 'up' ? 'text-emerald-600' : 'text-emerald-600'
                      }`}>
                        {stat.trend === 'up' ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        <span>{stat.change}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Headcount Trend */}
        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900">Headcount Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={headcountTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="employees" 
                    stroke="#8b5cf6" 
                    fill="url(#colorEmployees)" 
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorEmployees" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900">Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="employees"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {departmentData.slice(0, 4).map((dept) => (
                <div key={dept.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dept.color }} />
                  <span className="text-slate-600 truncate">{dept.name}</span>
                  <span className="text-slate-900 font-medium ml-auto">{dept.employees}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Attendance */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-500" />
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-slate-900">
                {Math.round((attendanceToday.present / 1248) * 100)}%
              </p>
              <p className="text-sm text-slate-500">Attendance Rate</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Present</span>
                <span className="text-sm font-semibold text-emerald-600">{attendanceToday.present}</span>
              </div>
              <Progress value={(attendanceToday.present / 1248) * 100} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Absent</span>
                <span className="text-sm font-semibold text-red-600">{attendanceToday.absent}</span>
              </div>
              <Progress value={(attendanceToday.absent / 1248) * 100} className="h-2 [&>div]:bg-red-500" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">On Leave</span>
                <span className="text-sm font-semibold text-amber-600">{attendanceToday.onLeave}</span>
              </div>
              <Progress value={(attendanceToday.onLeave / 1248) * 100} className="h-2 [&>div]:bg-amber-500" />
            </div>
          </CardContent>
        </Card>

        {/* Hires vs Exits */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900">Hires vs Exits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={headcountTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="hires" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="exits" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-slate-600">Hires</span>
              </div>
              <div className="flex items-center gap-2">
                <UserMinus className="w-4 h-4 text-red-500" />
                <span className="text-sm text-slate-600">Exits</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'hire' ? 'bg-emerald-100' :
                  activity.type === 'promotion' ? 'bg-blue-100' :
                  activity.type === 'leave' ? 'bg-amber-100' : 'bg-red-100'
                }`}>
                  {activity.type === 'hire' && <UserPlus className="w-4 h-4 text-emerald-600" />}
                  {activity.type === 'promotion' && <TrendingDown className="w-4 h-4 text-blue-600 rotate-180" />}
                  {activity.type === 'leave' && <Calendar className="w-4 h-4 text-amber-600" />}
                  {activity.type === 'exit' && <UserMinus className="w-4 h-4 text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{activity.name}</p>
                  <p className="text-xs text-slate-500">{activity.department}</p>
                </div>
                <span className="text-xs text-slate-400">{activity.date}</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
