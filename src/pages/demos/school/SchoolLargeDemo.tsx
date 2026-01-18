import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { 
  Users, BookOpen, Calendar, Bell, 
  ClipboardList, DollarSign, FileText, 
  GraduationCap, Home, Settings, LogOut,
  Plus, Search, ChevronRight, CheckCircle,
  Clock, AlertCircle, TrendingUp, Bus,
  Library, Utensils, Award, BarChart3,
  MessageSquare, Phone, Mail, MapPin,
  Download, Filter, MoreVertical, Shield,
  Globe, Wifi, Database, Server, Cloud,
  PieChart, Activity, Zap, Target,
  Building, Users2, BookMarked, Microscope,
  Music, Palette, Dumbbell, Laptop,
  CreditCard, Receipt, Wallet, BanknoteIcon,
  FileSpreadsheet, Printer, QrCode, Scan,
  Video, Camera, Mic, Headphones,
  Lock, Key, Fingerprint, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDemoTestMode } from "@/contexts/DemoTestModeContext";

// Demo role configurations - URL-based auto-access
const DEMO_ROLES = {
  principal: { name: "Dr. Rajesh Kumar", designation: "Principal & Super Admin", avatar: "DR" },
  vice_principal: { name: "Mrs. Sunita Sharma", designation: "Vice Principal", avatar: "SS" },
  teacher: { name: "Mr. Amit Verma", designation: "Class Teacher - 10A", avatar: "AV" },
  student: { name: "Rahul Singh", designation: "Student - Class 10A", avatar: "RS" },
  parent: { name: "Mr. Suresh Singh", designation: "Parent - Rahul's Father", avatar: "SS" },
  accountant: { name: "Mr. Prakash Jain", designation: "Chief Accountant", avatar: "PJ" },
  librarian: { name: "Mrs. Kavita Gupta", designation: "Head Librarian", avatar: "KG" },
  transport: { name: "Mr. Ramesh Yadav", designation: "Transport Manager", avatar: "RY" },
  hostel: { name: "Mrs. Meena Devi", designation: "Hostel Warden", avatar: "MD" },
  admin: { name: "Mr. Sanjay Patel", designation: "Admin Officer", avatar: "SP" },
  hr: { name: "Mrs. Anita Roy", designation: "HR Manager", avatar: "AR" },
  exam: { name: "Mr. Vijay Kumar", designation: "Exam Controller", avatar: "VK" },
};

const SchoolLargeDemo = () => {
  const [searchParams] = useSearchParams();
  const { isTestMode, skipLogin } = useDemoTestMode();
  
  // Get role from URL - auto-login without password
  const roleFromUrl = searchParams.get('role') as keyof typeof DEMO_ROLES | null;
  const currentRole = roleFromUrl && DEMO_ROLES[roleFromUrl] ? DEMO_ROLES[roleFromUrl] : DEMO_ROLES.principal;
  
  const [activeModule, setActiveModule] = useState("dashboard");
  const [isAutoLoggedIn, setIsAutoLoggedIn] = useState(false);

  // Auto-login on URL access - no password needed for demo
  useEffect(() => {
    if (isTestMode || skipLogin) {
      // Instant demo access - no authentication friction
      setIsAutoLoggedIn(true);
      console.log(`[DEMO] Auto-logged in as: ${currentRole.name} (${currentRole.designation})`);
    }
  }, [isTestMode, skipLogin, currentRole]);
  const [selectedBranch, setSelectedBranch] = useState("all");

  const branches = [
    { id: "all", name: "All Branches", students: 4520 },
    { id: "main", name: "Main Campus", students: 2100 },
    { id: "north", name: "North Branch", students: 1200 },
    { id: "south", name: "South Branch", students: 1220 },
  ];

  const overallStats = [
    { label: "Total Students", value: "4,520", icon: Users, color: "from-blue-500 to-blue-600", subValue: "Across 3 branches" },
    { label: "Teaching Staff", value: "186", icon: GraduationCap, color: "from-green-500 to-green-600", subValue: "Including 12 HODs" },
    { label: "Non-Teaching", value: "94", icon: Users2, color: "from-purple-500 to-purple-600", subValue: "Admin & Support" },
    { label: "Revenue (Monthly)", value: "₹1.2Cr", icon: DollarSign, color: "from-amber-500 to-amber-600", subValue: "+18% from last year" },
  ];

  const departmentStats = [
    { name: "Science", students: 1450, teachers: 42, labs: 8, icon: Microscope, color: "bg-blue-500" },
    { name: "Commerce", students: 1200, teachers: 35, labs: 4, icon: BarChart3, color: "bg-green-500" },
    { name: "Arts", students: 980, teachers: 38, labs: 2, icon: Palette, color: "bg-purple-500" },
    { name: "Sports", students: 890, teachers: 15, facilities: 6, icon: Dumbbell, color: "bg-orange-500" },
  ];

  const financialOverview = {
    monthlyRevenue: 12000000,
    collected: 10500000,
    pending: 1500000,
    scholarships: 450000,
    expenses: 8200000
  };

  const modules = [
    { 
      category: "Core",
      items: [
        { icon: Home, label: "Dashboard", value: "dashboard" },
        { icon: Users, label: "Student Management", value: "students", badge: "4,520" },
        { icon: GraduationCap, label: "Staff Management", value: "staff", badge: "280" },
        { icon: BookOpen, label: "Academic Management", value: "academic" },
      ]
    },
    {
      category: "Operations",
      items: [
        { icon: Calendar, label: "Attendance & Leave", value: "attendance" },
        { icon: ClipboardList, label: "Examination Center", value: "exams" },
        { icon: DollarSign, label: "Finance & Accounts", value: "finance" },
        { icon: Receipt, label: "Fee Management", value: "fees" },
      ]
    },
    {
      category: "Facilities",
      items: [
        { icon: Library, label: "Library Management", value: "library" },
        { icon: Bus, label: "Transport System", value: "transport" },
        { icon: Utensils, label: "Hostel & Canteen", value: "hostel" },
        { icon: Microscope, label: "Labs & Equipment", value: "labs" },
      ]
    },
    {
      category: "Advanced",
      items: [
        { icon: Video, label: "Online Classes", value: "online" },
        { icon: MessageSquare, label: "Communication Hub", value: "communication" },
        { icon: BarChart3, label: "Analytics & Reports", value: "analytics" },
        { icon: Shield, label: "Security & Access", value: "security" },
      ]
    },
    {
      category: "Integration",
      items: [
        { icon: Globe, label: "Website Portal", value: "website" },
        { icon: Laptop, label: "Mobile App", value: "mobile" },
        { icon: CreditCard, label: "Payment Gateway", value: "payments" },
        { icon: Database, label: "Data Management", value: "data" },
      ]
    }
  ];

  const liveMetrics = [
    { label: "Students Online", value: 1245, icon: Wifi, status: "live" },
    { label: "Classes Running", value: 48, icon: Video, status: "active" },
    { label: "Staff Present", value: 168, icon: CheckCircle, status: "good" },
    { label: "Buses Tracking", value: 24, icon: Bus, status: "moving" },
  ];

  const recentAlerts = [
    { id: 1, type: "warning", message: "Fee collection deadline approaching for 156 students", time: "10 min ago" },
    { id: 2, type: "info", message: "Board exam schedule released for Class 10 & 12", time: "1 hour ago" },
    { id: 3, type: "success", message: "All buses have completed morning routes", time: "2 hours ago" },
    { id: 4, type: "alert", message: "Lab equipment maintenance due for Chemistry Lab 3", time: "3 hours ago" },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top Navigation */}
      <header className="bg-slate-800/90 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-50">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">Delhi Public School</h1>
                <p className="text-xs text-slate-400">Enterprise School Management System</p>
              </div>
            </div>

            {/* Branch Selector */}
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <Building className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name} ({branch.students})
                  </SelectItem>
                ))}</SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Metrics */}
            <div className="hidden xl:flex items-center gap-4 px-4 py-2 bg-slate-700/50 rounded-lg">
              {liveMetrics.slice(0, 3).map((metric) => (
                <div key={metric.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <metric.icon className="w-4 h-4 text-slate-400" />
                  <span className="text-white font-medium">{metric.value}</span>
                </div>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Global search..." 
                className="pl-10 w-64 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <Button variant="ghost" size="icon" className="relative text-slate-300">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">12</span>
            </Button>

            {/* Dynamic Role Display - Based on URL Parameter */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
              <div className="relative">
                <Avatar>
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
                  <AvatarFallback className="bg-amber-500 text-white">{currentRole.avatar}</AvatarFallback>
                </Avatar>
                {isAutoLoggedIn && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800" />
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">{currentRole.name}</p>
                <p className="text-xs text-slate-400">{currentRole.designation}</p>
              </div>
              {isAutoLoggedIn && (
                <Badge className="bg-green-500/20 text-green-400 text-xs">Auto-Login</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Module Navigation */}
        <div className="px-6 py-2 border-t border-slate-700/50 overflow-x-auto">
          <div className="flex gap-1">
            {modules.flatMap(cat => cat.items).slice(0, 10).map((item) => (
              <Button
                key={item.value}
                variant="ghost"
                size="sm"
                onClick={() => setActiveModule(item.value)}
                className={`text-xs whitespace-nowrap ${
                  activeModule === item.value
                    ? "bg-amber-500/20 text-amber-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                <item.icon className="w-4 h-4 mr-1.5" />
                {item.label}
              </Button>
            ))}
            <Button variant="ghost" size="sm" className="text-slate-400">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Dashboard */}
        {activeModule === "dashboard" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Overall Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {overallStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-slate-400 text-sm">{stat.label}</p>
                          <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                          <p className="text-xs text-slate-500 mt-1">{stat.subValue}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Live Dashboard */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Chart Area */}
              <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-500" />
                    Real-time Analytics
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-400">Live</Badge>
                    <Select defaultValue="today">
                      <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {liveMetrics.map((metric) => (
                      <div key={metric.label} className="bg-slate-700/50 rounded-xl p-4 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <metric.icon className="w-5 h-5 text-amber-500" />
                        </div>
                        <p className="text-2xl font-bold text-white">{metric.value}</p>
                        <p className="text-xs text-slate-400">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Simulated Chart */}
                  <div className="h-48 bg-slate-700/30 rounded-xl flex items-end justify-between p-4 gap-2">
                    {[65, 78, 82, 75, 88, 92, 85, 79, 94, 87, 91, 89].map((val, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${val}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="flex-1 bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-lg"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-slate-500">
                    <span>8 AM</span>
                    <span>10 AM</span>
                    <span>12 PM</span>
                    <span>2 PM</span>
                    <span>4 PM</span>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts Panel */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`p-3 rounded-lg border ${
                        alert.type === "warning" ? "bg-amber-500/10 border-amber-500/30" :
                        alert.type === "success" ? "bg-green-500/10 border-green-500/30" :
                        alert.type === "alert" ? "bg-red-500/10 border-red-500/30" :
                        "bg-blue-500/10 border-blue-500/30"
                      }`}
                    >
                      <p className="text-sm text-white">{alert.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Department Overview */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-amber-500" />
                  Department Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {departmentStats.map((dept) => (
                    <div key={dept.name} className="bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 ${dept.color} rounded-xl flex items-center justify-center`}>
                          <dept.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{dept.name}</p>
                          <p className="text-xs text-slate-400">Department</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Students</span>
                          <span className="text-white font-medium">{dept.students.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Teachers</span>
                          <span className="text-white font-medium">{dept.teachers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{dept.labs ? "Labs" : "Facilities"}</span>
                          <span className="text-white font-medium">{dept.labs || dept.facilities}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Financial & Branch Summary */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Financial Overview */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-green-500" />
                    Financial Overview (This Month)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                      <p className="text-green-400 text-sm">Total Revenue</p>
                      <p className="text-2xl font-bold text-white">₹1.2Cr</p>
                    </div>
                    <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                      <p className="text-blue-400 text-sm">Collected</p>
                      <p className="text-2xl font-bold text-white">₹1.05Cr</p>
                    </div>
                    <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                      <p className="text-red-400 text-sm">Pending</p>
                      <p className="text-2xl font-bold text-white">₹15L</p>
                    </div>
                    <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                      <p className="text-purple-400 text-sm">Scholarships</p>
                      <p className="text-2xl font-bold text-white">₹4.5L</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Collection Progress</span>
                      <span className="text-white">87.5%</span>
                    </div>
                    <Progress value={87.5} className="h-3 bg-slate-700" />
                  </div>
                </CardContent>
              </Card>

              {/* Branch Summary */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-amber-500" />
                    Branch Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {branches.slice(1).map((branch) => (
                    <div key={branch.id} className="bg-slate-700/50 rounded-xl p-4 flex items-center justify-between hover:bg-slate-700 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{branch.name}</p>
                          <p className="text-sm text-slate-400">{branch.students.toLocaleString()} students</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-green-400 text-sm font-medium">94% Attendance</p>
                          <p className="text-xs text-slate-500">Today</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                  {[
                    { icon: Users, label: "Add Student", color: "from-blue-500 to-blue-600" },
                    { icon: GraduationCap, label: "Add Staff", color: "from-green-500 to-green-600" },
                    { icon: Receipt, label: "Collect Fee", color: "from-amber-500 to-orange-500" },
                    { icon: ClipboardList, label: "Take Attendance", color: "from-purple-500 to-purple-600" },
                    { icon: FileText, label: "Generate Report", color: "from-rose-500 to-pink-500" },
                    { icon: Bell, label: "Send Notice", color: "from-cyan-500 to-blue-500" },
                    { icon: Video, label: "Start Class", color: "from-indigo-500 to-purple-500" },
                    { icon: Bus, label: "Track Bus", color: "from-teal-500 to-green-500" },
                  ].map((action) => (
                    <Button
                      key={action.label}
                      variant="ghost"
                      className="h-auto py-4 flex-col gap-2 bg-slate-700/50 hover:bg-slate-700 text-white"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Other Module Placeholder */}
        {activeModule !== "dashboard" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
                  {(() => {
                    const item = modules.flatMap(c => c.items).find(i => i.value === activeModule);
                    return item ? <item.icon className="w-12 h-12 text-white" /> : null;
                  })()}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {modules.flatMap(c => c.items).find(i => i.value === activeModule)?.label}
                </h3>
                <p className="text-slate-400 mb-6">
                  Enterprise-grade module with multi-branch support
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  <Badge className="bg-amber-500/20 text-amber-400">Multi-Branch</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400">Real-time Sync</Badge>
                  <Badge className="bg-green-500/20 text-green-400">Advanced Analytics</Badge>
                  <Badge className="bg-purple-500/20 text-purple-400">API Integration</Badge>
                </div>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  Explore Module
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-4 px-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-slate-400">
            <span>School ERP - Enterprise Edition</span>
            <Badge className="bg-amber-500/20 text-amber-400">Multi-Branch</Badge>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Unlimited Students</span>
            <span>•</span>
            <span>Custom Pricing</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SchoolLargeDemo;
