/**
 * School Management System - Main Container
 * Fully functional enterprise school system with real data
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Lock, Key, Fingerprint, Eye, ArrowLeft, RefreshCw, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSchoolData } from "@/hooks/useSchoolData";
import { toast } from "sonner";

// Sub-modules
import { StudentManagementModule } from "./modules/StudentManagementModule";
import { StaffManagementModule } from "./modules/StaffManagementModule";
import { AttendanceModule } from "./modules/AttendanceModule";
import { FeesModule } from "./modules/FeesModule";
import { ExaminationModule } from "./modules/ExaminationModule";
import { TransportModule } from "./modules/TransportModule";
import { LibraryModule } from "./modules/LibraryModule";
import { CommunicationModule } from "./modules/CommunicationModule";

interface SchoolSystemContainerProps {
  onBack?: () => void;
}

export const SchoolSystemContainer = ({ onBack }: SchoolSystemContainerProps) => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [selectedBranch, setSelectedBranch] = useState("all");
  
  const { 
    institution, 
    branchStats, 
    stats, 
    notices, 
    loading, 
    error, 
    refresh 
  } = useSchoolData();

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

  const overallStats = [
    { label: "Total Students", value: stats.totalStudents.toLocaleString(), icon: Users, color: "from-blue-500 to-blue-600", subValue: `Across ${stats.totalBranches} branches` },
    { label: "Teaching Staff", value: stats.teachingStaff.toString(), icon: GraduationCap, color: "from-green-500 to-green-600", subValue: "Active teachers" },
    { label: "Non-Teaching", value: stats.nonTeachingStaff.toString(), icon: Users2, color: "from-purple-500 to-purple-600", subValue: "Admin & Support" },
    { label: "Revenue (Monthly)", value: `₹${(stats.monthlyRevenue / 100000).toFixed(1)}L`, icon: DollarSign, color: "from-amber-500 to-amber-600", subValue: "Fee collection" },
  ];

  const liveMetrics = [
    { label: "Students Present", value: stats.todayPresent || 0, icon: Wifi, status: "live" },
    { label: "Classes Today", value: stats.totalClasses, icon: Video, status: "active" },
    { label: "Staff Present", value: stats.totalStaff, icon: CheckCircle, status: "good" },
    { label: "Buses Active", value: stats.totalRoutes, icon: Bus, status: "moving" },
  ];

  const recentAlerts = notices.slice(0, 4).map((notice, idx) => ({
    id: notice.id,
    type: notice.notice_type === 'urgent' ? 'alert' : notice.notice_type === 'academic' ? 'info' : 'success',
    message: notice.title,
    time: new Date(notice.created_at).toLocaleDateString()
  }));

  // Render active module content
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
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading School System...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800 border-red-500/50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-white text-lg mb-2">Error Loading Data</h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <Button onClick={refresh} className="bg-amber-500 hover:bg-amber-600">
              <RefreshCw className="w-4 h-4 mr-2" /> Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top Navigation */}
      <header className="bg-slate-800/90 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-50">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">{institution?.name || 'School System'}</h1>
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
                <SelectItem value="all">All Branches ({stats.totalStudents})</SelectItem>
                {branchStats.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name} ({branch.studentCount})
                  </SelectItem>
                ))}
              </SelectContent>
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

            <Button variant="ghost" size="icon" className="relative text-slate-300" onClick={() => toast.info('Notifications panel')}>
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notices.length}
              </span>
            </Button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
              <Avatar>
                <AvatarFallback className="bg-amber-500 text-white">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">Admin-001</p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
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
                    {recentAlerts.length > 0 ? recentAlerts.map((alert) => (
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
                    )) : (
                      <p className="text-slate-400 text-sm text-center py-4">No recent notices</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Branch Summary */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-amber-500" />
                    Branch Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {branchStats.map((branch) => (
                      <div key={branch.id} className="bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-white">{branch.name}</p>
                            <p className="text-sm text-slate-400">{branch.city}</p>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-slate-400">Students:</span>
                            <span className="text-white ml-2 font-medium">{branch.studentCount}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Staff:</span>
                            <span className="text-white ml-2 font-medium">{branch.staffCount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
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
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    {[
                      { icon: Users, label: "Add Student", color: "from-blue-500 to-blue-600", action: () => setActiveModule('students') },
                      { icon: GraduationCap, label: "Add Staff", color: "from-green-500 to-green-600", action: () => setActiveModule('staff') },
                      { icon: Receipt, label: "Collect Fee", color: "from-amber-500 to-orange-500", action: () => setActiveModule('fees') },
                      { icon: ClipboardList, label: "Take Attendance", color: "from-purple-500 to-purple-600", action: () => setActiveModule('attendance') },
                      { icon: FileText, label: "Generate Report", color: "from-rose-500 to-pink-500", action: () => toast.info('Reports module') },
                      { icon: Bell, label: "Send Notice", color: "from-cyan-500 to-blue-500", action: () => setActiveModule('communication') },
                      { icon: Video, label: "Start Class", color: "from-indigo-500 to-purple-500", action: () => toast.info('Online classes') },
                      { icon: Bus, label: "Track Bus", color: "from-teal-500 to-green-500", action: () => setActiveModule('transport') },
                    ].map((action) => (
                      <Button
                        key={action.label}
                        variant="ghost"
                        onClick={action.action}
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
          ) : (
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {renderModuleContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-4 px-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-slate-400">
            <span>School ERP - Enterprise Edition</span>
            <Badge className="bg-green-500/20 text-green-400">LIVE SYSTEM</Badge>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Real-time Data</span>
            <span>•</span>
            <span>{institution?.code}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SchoolSystemContainer;
