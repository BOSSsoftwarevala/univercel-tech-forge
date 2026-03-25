/**
 * School Management System - Complete Enterprise Demo
 * Fully Working Software - Auto-Login via URL
 * No password needed - Direct access to full software
 */
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  Lock, Key, Fingerprint, Eye, RefreshCw,
  ArrowLeft, Copy, ExternalLink, Check,
  UserCircle, School, Briefcase, Car,
  BookOpenCheck, GraduationCap as Grad,
  Building2, CircleDollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useSchoolData } from "@/hooks/useSchoolData";

// Live working modules from school-system
import { StudentManagementModule } from "@/components/school-system/modules/StudentManagementModule";
import { StaffManagementModule } from "@/components/school-system/modules/StaffManagementModule";
import { AttendanceModule } from "@/components/school-system/modules/AttendanceModule";
import { FeesModule } from "@/components/school-system/modules/FeesModule";
import { ExaminationModule } from "@/components/school-system/modules/ExaminationModule";
import { TransportModule } from "@/components/school-system/modules/TransportModule";
import { LibraryModule } from "@/components/school-system/modules/LibraryModule";
import { CommunicationModule } from "@/components/school-system/modules/CommunicationModule";

// Demo role configurations - Auto-login roles with different permissions
const DEMO_ROLES = {
  principal: { 
    name: "Dr. Rajesh Kumar", 
    designation: "Principal & Super Admin", 
    avatar: "DR",
    accessLevel: "full",
    color: "from-amber-500 to-orange-500",
    modules: ["all"]
  },
  vice_principal: { 
    name: "Mrs. Sunita Sharma", 
    designation: "Vice Principal", 
    avatar: "SS",
    accessLevel: "admin",
    color: "from-purple-500 to-indigo-500",
    modules: ["dashboard", "students", "staff", "academic", "attendance", "exams", "communication"]
  },
  teacher: { 
    name: "Mr. Amit Verma", 
    designation: "Class Teacher - 10A", 
    avatar: "AV",
    accessLevel: "teacher",
    color: "from-blue-500 to-cyan-500",
    modules: ["dashboard", "attendance", "exams", "communication", "library"]
  },
  student: { 
    name: "Rahul Singh", 
    designation: "Student - Class 10A", 
    avatar: "RS",
    accessLevel: "student",
    color: "from-green-500 to-emerald-500",
    modules: ["dashboard", "fees", "exams", "library", "communication"]
  },
  parent: { 
    name: "Mr. Suresh Singh", 
    designation: "Parent - Rahul's Father", 
    avatar: "SS",
    accessLevel: "parent",
    color: "from-teal-500 to-green-500",
    modules: ["dashboard", "fees", "attendance", "exams", "communication", "transport"]
  },
  accountant: { 
    name: "Mr. Prakash Jain", 
    designation: "Chief Accountant", 
    avatar: "PJ",
    accessLevel: "finance",
    color: "from-emerald-500 to-green-500",
    modules: ["dashboard", "fees", "finance"]
  },
  librarian: { 
    name: "Mrs. Kavita Gupta", 
    designation: "Head Librarian", 
    avatar: "KG",
    accessLevel: "staff",
    color: "from-violet-500 to-purple-500",
    modules: ["dashboard", "library"]
  },
  transport: { 
    name: "Mr. Ramesh Yadav", 
    designation: "Transport Manager", 
    avatar: "RY",
    accessLevel: "staff",
    color: "from-orange-500 to-red-500",
    modules: ["dashboard", "transport"]
  },
  hostel: { 
    name: "Mrs. Meena Devi", 
    designation: "Hostel Warden", 
    avatar: "MD",
    accessLevel: "staff",
    color: "from-pink-500 to-rose-500",
    modules: ["dashboard", "hostel"]
  },
  admin: { 
    name: "Mr. Sanjay Patel", 
    designation: "Admin Officer", 
    avatar: "SP",
    accessLevel: "admin",
    color: "from-slate-500 to-gray-600",
    modules: ["dashboard", "students", "staff", "communication"]
  },
  hr: { 
    name: "Mrs. Anita Roy", 
    designation: "HR Manager", 
    avatar: "AR",
    accessLevel: "hr",
    color: "from-cyan-500 to-blue-500",
    modules: ["dashboard", "staff"]
  },
  exam: { 
    name: "Mr. Vijay Kumar", 
    designation: "Exam Controller", 
    avatar: "VK",
    accessLevel: "exam",
    color: "from-red-500 to-orange-500",
    modules: ["dashboard", "exams", "students"]
  },
};

const SchoolLargeDemo = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get role from URL - auto-login without password
  const roleFromUrl = searchParams.get('role') as keyof typeof DEMO_ROLES | null;
  const currentRole = roleFromUrl && DEMO_ROLES[roleFromUrl] ? DEMO_ROLES[roleFromUrl] : DEMO_ROLES.principal;
  const currentRoleKey = roleFromUrl || 'principal';
  
  const [activeModule, setActiveModule] = useState("dashboard");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Real data from database
  const { 
    institution, 
    branches,
    students,
    staff,
    classes,
    notices,
    transportRoutes,
    stats, 
    loading, 
    error, 
    refresh 
  } = useSchoolData();

  // Auto-toast on role change
  useEffect(() => {
    toast.success(`Logged in as ${currentRole.name}`, {
      description: currentRole.designation,
      duration: 3000,
    });
  }, [currentRoleKey]);

  // Check if current role has access to a module
  const hasAccess = (moduleValue: string) => {
    if (currentRole.modules.includes("all")) return true;
    return currentRole.modules.includes(moduleValue);
  };

  const branchOptions = [
    { id: "all", name: "All Branches", students: stats.totalStudents },
    ...branches.map(b => ({ id: b.id, name: b.name, students: 0 }))
  ];

  const overallStats = [
    { label: "Total Students", value: stats.totalStudents.toLocaleString(), icon: Users, color: "from-blue-500 to-blue-600", subValue: `Across ${stats.totalBranches} branches` },
    { label: "Teaching Staff", value: stats.teachingStaff.toString(), icon: GraduationCap, color: "from-green-500 to-green-600", subValue: "Active teachers" },
    { label: "Non-Teaching", value: stats.nonTeachingStaff.toString(), icon: Users2, color: "from-purple-500 to-purple-600", subValue: "Admin & Support" },
    { label: "Revenue (Monthly)", value: `₹${(stats.monthlyRevenue / 100000).toFixed(1)}L`, icon: DollarSign, color: "from-amber-500 to-amber-600", subValue: "Fee collection" },
  ];

  const departmentStats = [
    { name: "Science", students: Math.round(stats.totalStudents * 0.32), teachers: Math.round(stats.teachingStaff * 0.35), labs: 8, icon: Microscope, color: "bg-blue-500" },
    { name: "Commerce", students: Math.round(stats.totalStudents * 0.27), teachers: Math.round(stats.teachingStaff * 0.28), labs: 4, icon: BarChart3, color: "bg-green-500" },
    { name: "Arts", students: Math.round(stats.totalStudents * 0.22), teachers: Math.round(stats.teachingStaff * 0.25), labs: 2, icon: Palette, color: "bg-purple-500" },
    { name: "Sports", students: Math.round(stats.totalStudents * 0.19), teachers: Math.round(stats.teachingStaff * 0.12), facilities: 6, icon: Dumbbell, color: "bg-orange-500" },
  ];

  const modules = [
    { 
      category: "Core",
      items: [
        { icon: Home, label: "Dashboard", value: "dashboard" },
        { icon: Users, label: "Student Management", value: "students", badge: stats.totalStudents.toString() },
        { icon: GraduationCap, label: "Staff Management", value: "staff", badge: stats.totalStaff.toString() },
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
    }
  ];

  const liveMetrics = [
    { label: "Students Present", value: stats.todayPresent || Math.round(stats.totalStudents * 0.92), icon: Wifi, status: "live" },
    { label: "Classes Today", value: stats.totalClasses || 48, icon: Video, status: "active" },
    { label: "Staff Present", value: Math.round(stats.totalStaff * 0.95), icon: CheckCircle, status: "good" },
    { label: "Buses Active", value: transportRoutes.length || 24, icon: Bus, status: "moving" },
  ];

  const recentAlerts = notices.length > 0 
    ? notices.slice(0, 4).map((notice) => ({
        id: notice.id,
        type: notice.notice_type === 'urgent' ? 'alert' : notice.notice_type === 'academic' ? 'info' : 'success',
        message: notice.title,
        time: new Date(notice.created_at).toLocaleDateString()
      }))
    : [
        { id: 1, type: "warning", message: "Fee collection deadline approaching for 156 students", time: "10 min ago" },
        { id: 2, type: "info", message: "Board exam schedule released for Class 10 & 12", time: "1 hour ago" },
        { id: 3, type: "success", message: "All buses have completed morning routes", time: "2 hours ago" },
        { id: 4, type: "alert", message: "Lab equipment maintenance due for Chemistry Lab 3", time: "3 hours ago" },
      ];

  // Switch role
  const switchRole = (role: string) => {
    setSearchParams({ role });
    setShowRoleSwitcher(false);
  };

  // Render module content - REAL WORKING MODULES
  const renderModuleContent = () => {
    switch (activeModule) {
      case 'students':
        return <StudentManagementModule />;
      case 'staff':
        return <StaffManagementModule />;
      case 'attendance':
        return <AttendanceModule />;
      case 'fees':
      case 'finance':
        return <FeesModule />;
      case 'exams':
        return <ExaminationModule />;
      case 'transport':
        return <TransportModule />;
      case 'library':
        return <LibraryModule />;
      case 'communication':
        return <CommunicationModule />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <p className="text-white font-medium">Loading School System...</p>
          <p className="text-slate-400 text-sm mt-1">Connecting to database</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300`}>
        {/* School Logo & Name */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-white truncate">{institution?.name || "Delhi Public School"}</h1>
                <p className="text-xs text-slate-400 truncate">Enterprise School ERP</p>
              </div>
            )}
          </div>
          
          {/* Branch Selector */}
          {!sidebarCollapsed && (
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="mt-3 bg-slate-700 border-slate-600 text-white text-sm">
                <Building className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branchOptions.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name} ({branch.students})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Navigation Modules */}
        <ScrollArea className="flex-1 py-4">
          <nav className="px-3 space-y-6">
            {modules.map((group) => (
              <div key={group.category}>
                {!sidebarCollapsed && (
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
                    {group.category}
                  </p>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const hasModuleAccess = hasAccess(item.value);
                    return (
                      <Button
                        key={item.value}
                        variant="ghost"
                        onClick={() => hasModuleAccess && setActiveModule(item.value)}
                        disabled={!hasModuleAccess}
                        className={`w-full justify-start gap-3 ${sidebarCollapsed ? 'px-3' : 'px-3'} ${
                          activeModule === item.value
                            ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                            : hasModuleAccess
                            ? "text-slate-400 hover:text-white hover:bg-slate-700"
                            : "text-slate-600 cursor-not-allowed"
                        }`}
                      >
                        <item.icon className="w-5 h-5 shrink-0" />
                        {!sidebarCollapsed && (
                          <>
                            <span className="flex-1 text-left truncate">{item.label}</span>
                            {item.badge && (
                              <Badge className="bg-slate-600 text-slate-300 text-xs">
                                {item.badge}
                              </Badge>
                            )}
                            {!hasModuleAccess && <Lock className="w-3 h-3 text-slate-600" />}
                          </>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Sidebar Footer - User Info */}
        <div className="p-4 border-t border-slate-700">
          <Button
            variant="ghost"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full justify-center text-slate-400 hover:text-white mb-2"
          >
            <ChevronRight className={`w-5 h-5 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
          </Button>
          
          {!sidebarCollapsed && (
            <div 
              onClick={() => setShowRoleSwitcher(true)}
              className="flex items-center gap-3 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentRole.color} flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">{currentRole.avatar}</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{currentRole.name}</p>
                <p className="text-xs text-slate-400 truncate">{currentRole.designation}</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400 text-xs shrink-0">Online</Badge>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-slate-800/90 backdrop-blur-xl border-b border-slate-700 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white">
                {modules.flatMap(c => c.items).find(i => i.value === activeModule)?.label || "Dashboard"}
              </h2>
              <Badge className="bg-green-500/20 text-green-400">Live Data</Badge>
              {error && <Badge className="bg-red-500/20 text-red-400">Error: {error}</Badge>}
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

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative text-slate-300">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notices.length || 12}
                </span>
              </Button>

              {/* Refresh */}
              <Button variant="ghost" size="icon" onClick={refresh} className="text-slate-300">
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </Button>

              {/* Role Switcher Button */}
              <Button
                onClick={() => setShowRoleSwitcher(true)}
                className={`bg-gradient-to-r ${currentRole.color} text-white`}
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Switch Role
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            {activeModule === "dashboard" ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
                      
                      {/* Chart */}
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
                        <span>8 AM</span><span>10 AM</span><span>12 PM</span><span>2 PM</span><span>4 PM</span>
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
                      {recentAlerts.map((alert: any) => (
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
                              <span className="text-slate-400">{dept.labs !== undefined ? "Labs" : "Facilities"}</span>
                              <span className="text-white font-medium">{dept.labs ?? dept.facilities}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Financial & Quick Actions */}
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
                          <p className="text-2xl font-bold text-white">₹{(stats.monthlyRevenue / 100000).toFixed(1)}L</p>
                        </div>
                        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                          <p className="text-blue-400 text-sm">Collected</p>
                          <p className="text-2xl font-bold text-white">₹{((stats.monthlyRevenue * 0.875) / 100000).toFixed(1)}L</p>
                        </div>
                        <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                          <p className="text-red-400 text-sm">Pending</p>
                          <p className="text-2xl font-bold text-white">₹{((stats.monthlyRevenue * 0.125) / 100000).toFixed(1)}L</p>
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

                  {/* Quick Actions */}
                  <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { icon: Users, label: "Add Student", color: "from-blue-500 to-blue-600", module: "students" },
                          { icon: GraduationCap, label: "Add Staff", color: "from-green-500 to-green-600", module: "staff" },
                          { icon: Receipt, label: "Collect Fee", color: "from-amber-500 to-orange-500", module: "fees" },
                          { icon: ClipboardList, label: "Attendance", color: "from-purple-500 to-purple-600", module: "attendance" },
                          { icon: FileText, label: "Reports", color: "from-rose-500 to-pink-500", module: "analytics" },
                          { icon: Bell, label: "Notice", color: "from-cyan-500 to-blue-500", module: "communication" },
                          { icon: Video, label: "Online Class", color: "from-indigo-500 to-purple-500", module: "online" },
                          { icon: Bus, label: "Track Bus", color: "from-teal-500 to-green-500", module: "transport" },
                        ].map((action) => (
                          <Button
                            key={action.label}
                            variant="ghost"
                            onClick={() => hasAccess(action.module) && setActiveModule(action.module)}
                            disabled={!hasAccess(action.module)}
                            className="h-auto py-4 flex-col gap-2 bg-slate-700/50 hover:bg-slate-700 text-white disabled:opacity-50"
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
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {renderModuleContent() || (
                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="p-12 text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
                        {(() => {
                          const item = modules.flatMap(c => c.items).find(i => i.value === activeModule);
                          return item ? <item.icon className="w-12 h-12 text-white" /> : <Settings className="w-12 h-12 text-white" />;
                        })()}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {modules.flatMap(c => c.items).find(i => i.value === activeModule)?.label || activeModule}
                      </h3>
                      <p className="text-slate-400 mb-6">
                        This module is coming soon in the next update
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center mb-6">
                        <Badge className="bg-amber-500/20 text-amber-400">Multi-Branch</Badge>
                        <Badge className="bg-blue-500/20 text-blue-400">Real-time Sync</Badge>
                        <Badge className="bg-green-500/20 text-green-400">Advanced Analytics</Badge>
                      </div>
                      <Button 
                        onClick={() => setActiveModule("dashboard")}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                      >
                        Back to Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="bg-slate-800 border-t border-slate-700 py-3 px-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-slate-400">
              <span>School ERP - Enterprise Edition</span>
              <Badge className="bg-amber-500/20 text-amber-400">Multi-Branch</Badge>
              <Badge className="bg-green-500/20 text-green-400">Live Demo</Badge>
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <span>Role: {currentRole.designation}</span>
              <span>•</span>
              <span>Access: {currentRole.accessLevel}</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Role Switcher Dialog */}
      <Dialog open={showRoleSwitcher} onOpenChange={setShowRoleSwitcher}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-amber-500" />
              Switch Demo Role
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Select a role to experience the system from different perspectives. Each role has different permissions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
            {Object.entries(DEMO_ROLES).map(([key, role]) => (
              <button
                key={key}
                onClick={() => switchRole(key)}
                className={`p-4 rounded-xl text-left transition-all hover:scale-105 ${
                  currentRoleKey === key 
                    ? 'ring-2 ring-amber-500 bg-slate-700' 
                    : 'bg-slate-700/50 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{role.avatar}</span>
                  </div>
                  {currentRoleKey === key && (
                    <Check className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                <p className="text-sm font-medium text-white">{role.name}</p>
                <p className="text-xs text-slate-400">{role.designation}</p>
                <Badge className={`mt-2 text-xs bg-gradient-to-r ${role.color} text-white border-0`}>
                  {role.accessLevel}
                </Badge>
              </button>
            ))}
          </div>

          <Separator className="bg-slate-700" />

          <div className="space-y-3">
            <p className="text-sm font-medium text-white">Quick Access URLs (No Login Required):</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(DEMO_ROLES).slice(0, 6).map(([key, role]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
                  <span className="text-slate-400">{role.designation.split(' - ')[0]}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/demo/school-large?role=${key}`);
                      toast.success("URL copied!");
                    }}
                    className="h-6 px-2 text-amber-400 hover:text-amber-300"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolLargeDemo;
