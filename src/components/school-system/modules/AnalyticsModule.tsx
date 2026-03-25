/**
 * Analytics & Reports Module
 * Comprehensive analytics dashboard with reports
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, Download, Calendar, TrendingUp, TrendingDown,
  Users, DollarSign, GraduationCap, BookOpen, Award,
  PieChart, Activity, Target, Filter, FileText, Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useSchoolData } from "@/hooks/useSchoolData";
import { toast } from "sonner";

export const AnalyticsModule = () => {
  const { stats } = useSchoolData();
  const [period, setPeriod] = useState("month");

  const kpiData = [
    { label: "Total Revenue", value: `₹${(stats.monthlyRevenue / 100000).toFixed(1)}L`, change: "+12.5%", trend: "up", icon: DollarSign },
    { label: "Fee Collection Rate", value: "94.2%", change: "+3.2%", trend: "up", icon: Target },
    { label: "Attendance Rate", value: "92.8%", change: "+1.5%", trend: "up", icon: Users },
    { label: "Academic Performance", value: "87.5%", change: "-0.8%", trend: "down", icon: Award },
  ];

  const classPerformance = [
    { class: "Class 12A", students: 40, avgScore: 92, passRate: 100, topScore: 98 },
    { class: "Class 12B", students: 38, avgScore: 88, passRate: 97, topScore: 95 },
    { class: "Class 11A", students: 42, avgScore: 85, passRate: 95, topScore: 96 },
    { class: "Class 11B", students: 40, avgScore: 82, passRate: 92, topScore: 94 },
    { class: "Class 10A", students: 45, avgScore: 89, passRate: 98, topScore: 97 },
    { class: "Class 10B", students: 43, avgScore: 86, passRate: 95, topScore: 95 },
  ];

  const subjectAnalysis = [
    { subject: "Mathematics", avgScore: 78, passRate: 92, improvement: 5 },
    { subject: "Physics", avgScore: 82, passRate: 95, improvement: 3 },
    { subject: "Chemistry", avgScore: 80, passRate: 94, improvement: 4 },
    { subject: "Biology", avgScore: 85, passRate: 97, improvement: 2 },
    { subject: "English", avgScore: 88, passRate: 98, improvement: 1 },
    { subject: "Hindi", avgScore: 84, passRate: 96, improvement: 3 },
  ];

  const attendanceTrend = [85, 88, 92, 90, 93, 91, 94, 92, 95, 93, 92, 94];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const reportTypes = [
    { name: "Student Progress Report", description: "Individual student performance analysis", icon: Users },
    { name: "Fee Collection Report", description: "Monthly fee collection summary", icon: DollarSign },
    { name: "Attendance Report", description: "Class-wise attendance statistics", icon: Calendar },
    { name: "Exam Results Report", description: "Examination scores and rankings", icon: Award },
    { name: "Staff Performance Report", description: "Teacher evaluation metrics", icon: GraduationCap },
    { name: "Financial Summary", description: "Income, expenses, and balance", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-amber-500" />
            Analytics & Reports
          </h2>
          <p className="text-slate-400">Comprehensive insights and downloadable reports</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-slate-600 text-slate-300" onClick={() => toast.success('Exporting report...')}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{kpi.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{kpi.value}</p>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {kpi.change}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <kpi.icon className="w-6 h-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Attendance Trend Chart */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-500" />
                  Attendance Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end justify-between gap-2">
                  {attendanceTrend.map((val, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className="flex-1 bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-lg relative group"
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {val}%
                      </span>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  {months.map(m => <span key={m}>{m}</span>)}
                </div>
              </CardContent>
            </Card>

            {/* Subject Performance */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  Subject Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectAnalysis.map((subject, idx) => (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white">{subject.subject}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">{subject.avgScore}%</span>
                          <span className="text-green-400 text-xs">+{subject.improvement}%</span>
                        </div>
                      </div>
                      <Progress value={subject.avgScore} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Academic Tab */}
        <TabsContent value="academic" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Class-wise Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-3 text-slate-400 font-medium">Class</th>
                      <th className="text-center p-3 text-slate-400 font-medium">Students</th>
                      <th className="text-center p-3 text-slate-400 font-medium">Avg Score</th>
                      <th className="text-center p-3 text-slate-400 font-medium">Pass Rate</th>
                      <th className="text-center p-3 text-slate-400 font-medium">Top Score</th>
                      <th className="text-center p-3 text-slate-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classPerformance.map((cls, idx) => (
                      <motion.tr
                        key={cls.class}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-slate-700/50 hover:bg-slate-700/30"
                      >
                        <td className="p-3 text-white font-medium">{cls.class}</td>
                        <td className="p-3 text-center text-slate-300">{cls.students}</td>
                        <td className="p-3 text-center">
                          <Badge className={cls.avgScore >= 85 ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}>
                            {cls.avgScore}%
                          </Badge>
                        </td>
                        <td className="p-3 text-center text-slate-300">{cls.passRate}%</td>
                        <td className="p-3 text-center text-slate-300">{cls.topScore}</td>
                        <td className="p-3 text-center">
                          <Badge className={cls.passRate >= 95 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}>
                            {cls.passRate >= 95 ? 'Excellent' : 'Good'}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                  <p className="text-4xl font-bold text-green-400">₹{(stats.monthlyRevenue / 100000).toFixed(1)}L</p>
                  <p className="text-slate-400 mt-1">This Month</p>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Tuition Fees</span>
                    <span className="text-white">₹{((stats.monthlyRevenue * 0.7) / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Transport Fees</span>
                    <span className="text-white">₹{((stats.monthlyRevenue * 0.15) / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Other Fees</span>
                    <span className="text-white">₹{((stats.monthlyRevenue * 0.15) / 100000).toFixed(1)}L</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl">
                  <p className="text-4xl font-bold text-red-400">₹{((stats.monthlyRevenue * 0.65) / 100000).toFixed(1)}L</p>
                  <p className="text-slate-400 mt-1">This Month</p>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Salaries</span>
                    <span className="text-white">₹{((stats.monthlyRevenue * 0.45) / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Utilities</span>
                    <span className="text-white">₹{((stats.monthlyRevenue * 0.1) / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Maintenance</span>
                    <span className="text-white">₹{((stats.monthlyRevenue * 0.1) / 100000).toFixed(1)}L</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Net Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl">
                  <p className="text-4xl font-bold text-amber-400">₹{((stats.monthlyRevenue * 0.35) / 100000).toFixed(1)}L</p>
                  <p className="text-slate-400 mt-1">This Month</p>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 text-green-400">
                  <TrendingUp className="w-5 h-5" />
                  <span>+15.3% vs last month</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {reportTypes.map((report, idx) => (
              <motion.div
                key={report.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                        <report.icon className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{report.name}</h3>
                        <p className="text-sm text-slate-400 mt-1">{report.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white" onClick={() => toast.success('Generating PDF...')}>
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white" onClick={() => toast.info('Print preview')}>
                          <Printer className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
