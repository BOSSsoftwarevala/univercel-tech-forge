import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Globe, 
  MapPin, 
  DollarSign, 
  AlertTriangle, 
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GlobalNetworkMap } from './GlobalNetworkMap';

// Summary cards with modern styling
const summaryCards = [
  { 
    label: 'Total Consultations', 
    value: '1,032', 
    icon: Users, 
    gradient: 'from-blue-500 to-cyan-400',
    bgGradient: 'from-blue-500/20 to-cyan-400/10'
  },
  { 
    label: 'In Progress', 
    value: '132', 
    icon: Clock, 
    gradient: 'from-orange-500 to-amber-400',
    bgGradient: 'from-orange-500/20 to-amber-400/10'
  },
  { 
    label: 'In Review', 
    value: '128', 
    icon: CheckCircle2, 
    gradient: 'from-purple-500 to-pink-400',
    bgGradient: 'from-purple-500/20 to-pink-400/10'
  },
];

const revenueData = [
  { month: 'Jan', revenue: 4500, trend: 3200 },
  { month: 'Feb', revenue: 5200, trend: 4100 },
  { month: 'Mar', revenue: 4800, trend: 5500 },
  { month: 'Apr', revenue: 6200, trend: 5800 },
  { month: 'May', revenue: 7800, trend: 6900 },
  { month: 'Jun', revenue: 8400, trend: 7200 },
];

const bookingData = [
  { day: 'Sun', value: 30 },
  { day: 'Mon', value: 42 },
  { day: 'Tue', value: 35 },
  { day: 'Wed', value: 45 },
  { day: 'Thu', value: 58 },
  { day: 'Fri', value: 48 },
  { day: 'Sat', value: 52 },
];

const incomeData = [
  { name: 'Income', value: 2000, color: '#8B5CF6' },
  { name: 'Expense', value: 1000, color: '#F97316' },
];

const appointments = [
  { name: 'Ronda Rousy', time: '10 am', duration: '30 Mins', avatar: 'RR' },
  { name: 'Redona Charles', time: '11:30 am', duration: '45 Mins', avatar: 'RC' },
  { name: 'Jia Nick', time: '12:15 pm', duration: '15 Mins', avatar: 'JN' },
  { name: 'Wales James', time: '12:40 pm', duration: '20 Mins', avatar: 'WJ' },
  { name: 'Maria Lucy', time: '12:40 pm', duration: '20 Mins', avatar: 'ML' },
];

const scheduleData = [
  { title: 'Aspirus Hospital', time: '8:00am - 10:00am', color: 'bg-emerald-500' },
  { title: 'Ron sesame st', time: '2:00pm - 4:00pm', color: 'bg-orange-500' },
  { title: 'Mayo Clinic', time: '5:00pm - 7:00pm', color: 'bg-violet-500' },
];

export function BossDashboard() {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Command Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time overview of all operations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Global Network Map - Full Width */}
      <GlobalNetworkMap className="w-full" />

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Charts */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Revenue Chart Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Incoming Activity History
              </h2>
              <select className="text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg border-0">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
            </div>
            
            {/* Stats Cards Row */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-blue-400/5 dark:from-blue-500/20 dark:to-blue-400/10 px-4 py-3 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">560</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">New Users</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500/10 to-amber-400/5 dark:from-orange-500/20 dark:to-amber-400/10 px-4 py-3 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">300</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-pink-400/5 dark:from-purple-500/20 dark:to-pink-400/10 px-4 py-3 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">200</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" className="dark:stroke-slate-700" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                />
                <Area 
                  type="monotone" 
                  dataKey="trend" 
                  stroke="#06B6D4" 
                  strokeWidth={2}
                  fill="url(#colorTrend)"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            {summaryCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${card.bgGradient} backdrop-blur-sm rounded-2xl p-5 border border-white/50 dark:border-slate-700/50 shadow-lg`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{card.value}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{card.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Booking Rate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Booking Rate</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Weekly</span>
              </div>
              <div className="flex items-end gap-4 mb-4">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">58%</span>
                <div className="flex items-center gap-1 text-emerald-500 text-sm pb-1">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>6%</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Your total booking on Friday</p>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={bookingData}>
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {bookingData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 4 ? '#F97316' : '#E2E8F0'} 
                        className="dark:fill-slate-600"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* My Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">My Schedule</h3>
                <select className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg border-0">
                  <option>Monthly</option>
                </select>
              </div>
              
              {/* Calendar Header */}
              <div className="flex justify-between mb-4">
                {['12', '13', '14', '15', '16', '17', '18', '19', '20', '21'].map((day, i) => (
                  <div 
                    key={day} 
                    className={`text-center ${i === 3 ? 'bg-gradient-to-br from-orange-500 to-amber-400 text-white rounded-xl px-2 py-1' : ''}`}
                  >
                    <p className="text-xs text-slate-400">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'][i]}</p>
                    <p className={`text-sm font-semibold ${i === 3 ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{day}</p>
                  </div>
                ))}
              </div>

              {/* Schedule Items */}
              <div className="space-y-2">
                {scheduleData.map((item, i) => (
                  <div key={i} className={`${item.color} text-white text-xs px-3 py-2 rounded-lg`}>
                    <p className="font-medium">{item.title}</p>
                    <p className="opacity-80">{item.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Profile & Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 text-center"
          >
            <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-violet-500/20">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" />
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xl">BA</AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Boss Admin</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">System Administrator</p>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-400/5 dark:from-blue-500/20 dark:to-cyan-400/10 rounded-xl p-3">
                <Briefcase className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Workload</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">16 Projects</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-400/5 dark:from-emerald-500/20 dark:to-teal-400/10 rounded-xl p-3">
                <Calendar className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Available</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">17/60 Slots</p>
              </div>
              <div className="bg-gradient-to-br from-violet-500/10 to-purple-400/5 dark:from-violet-500/20 dark:to-purple-400/10 rounded-xl p-3">
                <Mail className="w-5 h-5 text-violet-500 mx-auto mb-1" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">10 New</p>
              </div>
            </div>
          </motion.div>

          {/* Income Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your Income</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">Monthly</span>
            </div>
            
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie
                      data={incomeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {incomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xl font-bold text-slate-900 dark:text-white">$2000</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">Expense</span>
              </div>
            </div>
          </motion.div>

          {/* Appointments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
              <Button variant="link" className="text-violet-500 text-xs p-0 h-auto">View All</Button>
            </div>
            
            <div className="space-y-3">
              {appointments.map((apt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs">
                        {apt.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{apt.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{apt.time} · {apt.duration}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-violet-500 text-xs">
                    History
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
