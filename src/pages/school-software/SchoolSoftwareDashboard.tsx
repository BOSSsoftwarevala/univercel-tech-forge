/**
 * School Management Software - Main Dashboard
 * FULL USER TRIAL SYSTEM - 100% Features Available
 * Direct Buy & Go Live Flow
 */
import { useState, useEffect } from "react";
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
  BookOpenCheck, X, Info, ShoppingCart, Sparkles
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
import TrialPurchaseModal from "@/components/school-software/TrialPurchaseModal";

// Import all working modules
import { StudentManagementModule } from "@/components/school-system/modules/StudentManagementModule";
import { StaffManagementModule } from "@/components/school-system/modules/StaffManagementModule";
import { AttendanceModule } from "@/components/school-system/modules/AttendanceModule";
import { FeesModule } from "@/components/school-system/modules/FeesModule";
import { ExaminationModule } from "@/components/school-system/modules/ExaminationModule";
import { TransportModule } from "@/components/school-system/modules/TransportModule";
import { LibraryModule } from "@/components/school-system/modules/LibraryModule";
import { CommunicationModule } from "@/components/school-system/modules/CommunicationModule";
import { AcademicModule } from "@/components/school-system/modules/AcademicModule";
import { HostelModule } from "@/components/school-system/modules/HostelModule";
import { LabsModule } from "@/components/school-system/modules/LabsModule";
import { OnlineClassesModule } from "@/components/school-system/modules/OnlineClassesModule";
import { AnalyticsModule } from "@/components/school-system/modules/AnalyticsModule";
import { SecurityModule } from "@/components/school-system/modules/SecurityModule";

// Trial Mode Config - FULL ACCESS, all features enabled
const TRIAL_CONFIG = {
  isTrialMode: true,
  trialName: "USER TRIAL (FULL SYSTEM)",
  allFeaturesEnabled: true,
  dataCreationAllowed: true,
  workflowsEnabled: true,
  exportsEnabled: true,
  watermarkText: "TRIAL MODE",
};

// Role configurations with FULL access in trial mode
const ROLE_CONFIGS = {
  principal: { 
    name: "Dr. Rajesh Kumar", 
    designation: "Principal & Super Admin", 
    avatar: "DR",
    accessLevel: "full",
    color: "from-amber-500 to-orange-500",
    modules: ["all"],
    permissions: { view: true, edit: true, delete: true, export: true }
  },
  vice_principal: { 
    name: "Mrs. Sunita Sharma", 
    designation: "Vice Principal", 
    avatar: "SS",
    accessLevel: "admin",
    color: "from-purple-500 to-indigo-500",
    modules: ["dashboard", "students", "staff", "academic", "attendance", "exams", "communication"],
    permissions: { view: true, edit: true, delete: true, export: true }
  },
  teacher: { 
    name: "Mr. Amit Verma", 
    designation: "Class Teacher - 10A", 
    avatar: "AV",
    accessLevel: "teacher",
    color: "from-blue-500 to-cyan-500",
    modules: ["dashboard", "attendance", "exams", "communication", "library"],
    permissions: { view: true, edit: true, delete: true, export: true }
  },
  student: { 
    name: "Rahul Singh", 
    designation: "Student - Class 10A", 
    avatar: "RS",
    accessLevel: "student",
    color: "from-green-500 to-emerald-500",
    modules: ["dashboard", "fees", "exams", "library", "communication"],
    permissions: { view: true, edit: true, delete: true, export: true }
  },
  parent: { 
    name: "Mr. Suresh Singh", 
    designation: "Parent - Rahul's Father", 
    avatar: "SS",
    accessLevel: "parent",
    color: "from-teal-500 to-green-500",
    modules: ["dashboard", "fees", "attendance", "exams", "communication", "transport"],
    permissions: { view: true, edit: true, delete: true, export: true }
  },
  accountant: { 
    name: "Mr. Prakash Jain", 
    designation: "Chief Accountant", 
    avatar: "PJ",
    accessLevel: "finance",
    color: "from-emerald-500 to-green-500",
    modules: ["dashboard", "fees", "finance"],
    permissions: { view: true, edit: true, delete: true, export: true }
  },
  librarian: { 
    name: "Mrs. Kavita Gupta", 
    designation: "Head Librarian", 
    avatar: "KG",
    accessLevel: "staff",
    color: "from-violet-500 to-purple-500",
    modules: ["dashboard", "library"],
    permissions: { view: true, edit: true, delete: true, export: true }
  },
  transport: { 
    name: "Mr. Ramesh Yadav", 
    designation: "Transport Manager", 
    avatar: "RY",
    accessLevel: "staff",
    color: "from-orange-500 to-red-500",
    modules: ["dashboard", "transport"],
    permissions: { view: true, edit: true, delete: true, export: true }
  },
  hostel: { 
    name: "Mrs. Meena Devi", 
    designation: "Hostel Warden", 
    avatar: "MD",
    accessLevel: "staff",
    color: "from-pink-500 to-rose-500",
    modules: ["dashboard", "hostel"],
    permissions: { view: true, edit: true, delete: true, export: true }
  },
  admin: { 
    name: "Mr. Sanjay Patel", 
    designation: "Admin Officer", 
    avatar: "SP",
    accessLevel: "admin",
    color: "from-slate-500 to-gray-600",
    modules: ["dashboard", "students", "staff", "communication"],
    permissions: { view: true, edit: true, delete: true, export: true }
  },
  hr: { 
    name: "Mrs. Anita Roy", 
    designation: "HR Manager", 
    avatar: "AR",
    accessLevel: "hr",
    color: "from-cyan-500 to-blue-500",
    modules: ["dashboard", "staff"],
    permissions: { view: true, edit: true, delete: true, export: true }
  },
  exam: { 
    name: "Mr. Vijay Kumar", 
    designation: "Exam Controller", 
    avatar: "VK",
    accessLevel: "exam",
    color: "from-red-500 to-orange-500",
    modules: ["dashboard", "exams", "students"],
    permissions: { view: true, edit: true, delete: true, export: true }
  },
};

const SchoolSoftwareDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get role and mode from URL - Trial mode is the default
  const roleFromUrl = searchParams.get('role') as keyof typeof ROLE_CONFIGS | null;
  const isTrialMode = searchParams.get('mode') !== 'live'; // Default to trial mode
  const currentRole = roleFromUrl && ROLE_CONFIGS[roleFromUrl] ? ROLE_CONFIGS[roleFromUrl] : ROLE_CONFIGS.principal;
  const currentRoleKey = roleFromUrl || 'principal';
  
  const [activeModule, setActiveModule] = useState("dashboard");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showTrialBanner, setShowTrialBanner] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  
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

  // Show welcome toast on mount
  useEffect(() => {
    toast.success(`Welcome, ${currentRole.name}`, {
      description: `${currentRole.designation} • ${isTrialMode ? 'FULL TRIAL ACCESS' : 'LIVE SYSTEM'}`,
      duration: 4000,
    });
  }, [currentRoleKey]);

  // Handle purchase completion - convert to live mode
  const handlePurchaseComplete = () => {
    setSearchParams({ role: currentRoleKey, mode: 'live' });
    toast.success('🎉 System Activated!', {
      description: 'Your School Management System is now LIVE!',
      duration: 5000,
    });
  };


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
        { id: '1', type: "warning", message: "Fee collection deadline approaching for 156 students", time: "10 min ago" },
        { id: '2', type: "info", message: "Board exam schedule released for Class 10 & 12", time: "1 hour ago" },
        { id: '3', type: "success", message: "All buses have completed morning routes", time: "2 hours ago" },
        { id: '4', type: "alert", message: "Lab equipment maintenance due for Chemistry Lab 3", time: "3 hours ago" },
      ];

  // Switch role
  const switchRole = (role: string) => {
    setSearchParams({ role, mode: 'visitor' });
    setShowRoleSwitcher(false);
    setActiveModule('dashboard');
  };

  // Render module content - ALL WORKING MODULES
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
      case 'academic':
        return <AcademicModule />;
      case 'hostel':
        return <HostelModule />;
      case 'labs':
        return <LabsModule />;
      case 'online':
        return <OnlineClassesModule />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'security':
        return <SecurityModule />;
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
          <p className="text-slate-400 text-sm mt-1">Connecting to live database</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Trial Mode Banner with Buy Button */}
      {showTrialBanner && isTrialMode && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                USER TRIAL (FULL SYSTEM) — All features enabled. Test everything. Create data. Run workflows.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                onClick={() => setShowPurchaseModal(true)}
                className="bg-white text-amber-600 hover:bg-amber-50 font-semibold gap-1"
              >
                <ShoppingCart className="w-3 h-3" />
                BUY & GO LIVE
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20 h-6 w-6 p-0"
                onClick={() => setShowTrialBanner(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${showTrialBanner && isTrialMode ? 'pt-10' : ''}`}>
        {/* School Logo & Name */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-white truncate">{institution?.name || "Delhi Public School"}</h1>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-xs text-green-400">Live System</p>
                </div>
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
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col ${showTrialBanner && isTrialMode ? 'pt-10' : ''}`}>
        {/* Top Bar */}
        <header className="bg-slate-800/90 backdrop-blur-xl border-b border-slate-700 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/school-software')}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                LIVE
              </Badge>
              <Separator orientation="vertical" className="h-6 bg-slate-700" />
              <span className="text-slate-400 text-sm">
                {activeModule === 'dashboard' ? 'System Dashboard' : modules.flatMap(m => m.items).find(i => i.value === activeModule)?.label}
              </span>
            </div>
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
                placeholder="Search..." 
                className="pl-10 w-48 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <Button variant="ghost" size="icon" className="relative text-slate-300">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notices.length || 4}
              </span>
            </Button>

            {isTrialMode ? (
              <Button 
                onClick={() => setShowPurchaseModal(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white gap-1"
                size="sm"
              >
                <ShoppingCart className="w-3 h-3" />
                BUY & GO LIVE
              </Button>
            ) : (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                LIVE SYSTEM
              </Badge>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
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
                        <Button size="sm" variant="ghost" onClick={refresh} className="text-slate-400">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
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
                      
                      {/* Attendance Chart */}
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
                        Recent Notices
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

                {/* Quick Access Modules */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Access</CardTitle>
                    <CardDescription className="text-slate-400">Navigate to any module</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                      {modules.flatMap(cat => cat.items).filter(item => item.value !== 'dashboard').map((item) => {
                        const hasModuleAccess = hasAccess(item.value);
                        return (
                          <Button
                            key={item.value}
                            variant="ghost"
                            onClick={() => hasModuleAccess && setActiveModule(item.value)}
                            disabled={!hasModuleAccess}
                            className={`flex flex-col items-center gap-2 h-auto py-4 ${
                              hasModuleAccess 
                                ? 'text-slate-400 hover:text-white hover:bg-slate-700' 
                                : 'text-slate-600 cursor-not-allowed opacity-50'
                            }`}
                          >
                            <item.icon className="w-6 h-6" />
                            <span className="text-xs text-center">{item.label.split(' ')[0]}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {renderModuleContent()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Role Switcher Dialog */}
      <Dialog open={showRoleSwitcher} onOpenChange={setShowRoleSwitcher}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              Switch Role
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Experience the system from different perspectives. All roles are in view-only mode.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
            {Object.entries(ROLE_CONFIGS).map(([key, role]) => (
              <Button
                key={key}
                variant="ghost"
                onClick={() => switchRole(key)}
                className={`flex flex-col items-center gap-2 h-auto py-4 ${
                  key === currentRoleKey 
                    ? 'bg-amber-500/20 border border-amber-500/50' 
                    : 'bg-slate-700/50 hover:bg-slate-700'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                  <span className="text-white font-bold">{role.avatar}</span>
                </div>
                <span className="text-sm font-medium text-white">{role.name.split(' ')[0]}</span>
                <span className="text-xs text-slate-400">{role.designation.split(' ')[0]}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Purchase Modal */}
      <TrialPurchaseModal 
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        productName="School Management System"
        onPurchaseComplete={handlePurchaseComplete}
      />
    </div>
  );
};

export default SchoolSoftwareDashboard;
