import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, Calendar, Wallet, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  { label: 'Total Employees', value: '24', icon: Users, color: 'bg-primary/10 text-primary' },
  { label: 'Present Today', value: '21', icon: UserCheck, color: 'bg-emerald-500/10 text-emerald-600' },
  { label: 'On Leave', value: '3', icon: Calendar, color: 'bg-amber-500/10 text-amber-600' },
  { label: 'Salary This Month', value: '₹4.2L', icon: Wallet, color: 'bg-violet-500/10 text-violet-600' },
];

const recentActivities = [
  { name: 'Rahul Kumar', action: 'checked in', time: '9:02 AM' },
  { name: 'Priya Singh', action: 'applied for leave', time: '9:15 AM' },
  { name: 'Amit Sharma', action: 'checked in', time: '9:18 AM' },
  { name: 'Neha Gupta', action: 'leave approved', time: '9:30 AM' },
];

const upcomingLeaves = [
  { name: 'Vikram Patel', dates: 'Jan 5 - Jan 7', days: 3 },
  { name: 'Sunita Rao', dates: 'Jan 8 - Jan 9', days: 2 },
  { name: 'Rajesh Kumar', dates: 'Jan 10', days: 1 },
];

export default function HRMDashboard() {
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
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-medium text-sm">
                      {activity.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{activity.name}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Leaves */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Leaves
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingLeaves.map((leave, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center">
                    <span className="text-amber-600 font-medium text-sm">
                      {leave.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{leave.name}</p>
                    <p className="text-sm text-muted-foreground">{leave.dates}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-amber-500/10 text-amber-600 text-sm rounded-md">
                  {leave.days} day{leave.days > 1 ? 's' : ''}
                </span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Add Employee', 'Mark Attendance', 'Approve Leave', 'Generate Payslip'].map((action) => (
              <button
                key={action}
                className="p-4 bg-muted/50 hover:bg-primary/10 rounded-lg text-center transition-colors border border-transparent hover:border-primary/20"
              >
                <p className="font-medium text-foreground">{action}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
