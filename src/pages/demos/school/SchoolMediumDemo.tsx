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
  Download, Filter, MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SchoolMediumDemo = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    { label: "Total Students", value: "847", icon: Users, color: "from-blue-500 to-blue-600", change: "+45", trend: "up" },
    { label: "Teachers", value: "42", icon: GraduationCap, color: "from-green-500 to-green-600", change: "+3", trend: "up" },
    { label: "Classes", value: "24", icon: BookOpen, color: "from-purple-500 to-purple-600", change: "+2", trend: "up" },
    { label: "Fee Collection", value: "₹18.5L", icon: DollarSign, color: "from-amber-500 to-amber-600", change: "+22%", trend: "up" },
    { label: "Attendance Today", value: "94%", icon: CheckCircle, color: "from-teal-500 to-teal-600", change: "+2%", trend: "up" },
    { label: "Library Books", value: "2,450", icon: Library, color: "from-rose-500 to-rose-600", change: "+120", trend: "up" },
  ];

  const recentActivities = [
    { id: 1, action: "New admission", student: "Riya Sharma", class: "Class 8", time: "2 min ago", type: "admission" },
    { id: 2, action: "Fee payment", student: "Arjun Patel", amount: "₹15,000", time: "15 min ago", type: "payment" },
    { id: 3, action: "Exam result", class: "Class 10", subject: "Mathematics", time: "1 hour ago", type: "exam" },
    { id: 4, action: "Leave request", teacher: "Mrs. Gupta", days: "3 days", time: "2 hours ago", type: "leave" },
    { id: 5, action: "Transport update", route: "Route 5", time: "3 hours ago", type: "transport" },
  ];

  const upcomingEvents = [
    { id: 1, name: "Science Exhibition", date: "Feb 15", participants: 120 },
    { id: 2, name: "Sports Day", date: "Feb 22", participants: 450 },
    { id: 3, name: "Parent-Teacher Meet", date: "Mar 1", participants: 200 },
    { id: 4, name: "Annual Function", date: "Mar 15", participants: 800 },
  ];

  const classPerformance = [
    { class: "Class 10", avg: 82, top: "Priya M.", attendance: 96 },
    { class: "Class 9", avg: 78, top: "Rahul S.", attendance: 94 },
    { class: "Class 8", avg: 85, top: "Amit K.", attendance: 95 },
    { class: "Class 7", avg: 80, top: "Sneha G.", attendance: 93 },
  ];

  const feeStats = {
    collected: 1850000,
    pending: 420000,
    total: 2270000,
    defaulters: 45
  };

  const sidebarItems = [
    { icon: Home, label: "Dashboard", value: "dashboard" },
    { icon: Users, label: "Students", value: "students", badge: "847" },
    { icon: GraduationCap, label: "Teachers", value: "teachers", badge: "42" },
    { icon: BookOpen, label: "Classes", value: "classes" },
    { icon: Calendar, label: "Attendance", value: "attendance" },
    { icon: ClipboardList, label: "Examinations", value: "exams" },
    { icon: DollarSign, label: "Fee Management", value: "fees" },
    { icon: Library, label: "Library", value: "library" },
    { icon: Bus, label: "Transport", value: "transport" },
    { icon: Utensils, label: "Canteen", value: "canteen" },
    { icon: Bell, label: "Notifications", value: "notifications", badge: "5" },
    { icon: FileText, label: "Reports", value: "reports" },
    { icon: Settings, label: "Settings", value: "settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: sidebarOpen ? 260 : 80 }}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="bg-gradient-to-b from-indigo-900 via-indigo-800 to-purple-900 text-white fixed h-full z-40 shadow-2xl"
      >
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="font-bold text-lg">Sunrise Academy</h1>
                <p className="text-xs text-indigo-300">Medium Scale ERP</p>
              </motion.div>
            )}
          </div>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          {sidebarItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveModule(item.value)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                activeModule === item.value
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-indigo-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  {item.badge && (
                    <Badge className="bg-white/20 text-white text-xs">{item.badge}</Badge>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 py-2 text-indigo-300 hover:text-white transition-colors"
          >
            <ChevronRight className={`w-5 h-5 transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
            {sidebarOpen && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all ${sidebarOpen ? "ml-[260px]" : "ml-[80px]"}`}>
        {/* Top Bar */}
        <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search students, teachers, classes..." className="pl-10 w-80" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">5</span>
              </Button>
              <div className="flex items-center gap-3 pl-4 border-l">
                <Avatar>
                  <AvatarFallback className="bg-indigo-100 text-indigo-600">PA</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Principal Admin</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Dashboard */}
          {activeModule === "dashboard" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Welcome Banner */}
              <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white border-0 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Good Morning, Principal! 👋</h2>
                      <p className="text-white/80">Here's what's happening at Sunrise Academy today</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">847</p>
                      <p className="text-white/80">Students Present Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                      <CardContent className="p-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600">{stat.change}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <Card className="lg:col-span-2 border-0 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Recent Activities</CardTitle>
                    <Button variant="ghost" size="sm">View All</Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === "admission" ? "bg-blue-100 text-blue-600" :
                          activity.type === "payment" ? "bg-green-100 text-green-600" :
                          activity.type === "exam" ? "bg-purple-100 text-purple-600" :
                          activity.type === "leave" ? "bg-amber-100 text-amber-600" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {activity.type === "admission" && <Users className="w-5 h-5" />}
                          {activity.type === "payment" && <DollarSign className="w-5 h-5" />}
                          {activity.type === "exam" && <ClipboardList className="w-5 h-5" />}
                          {activity.type === "leave" && <Calendar className="w-5 h-5" />}
                          {activity.type === "transport" && <Bus className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{activity.action}</p>
                          <p className="text-sm text-gray-500">
                            {activity.student || activity.class || activity.teacher || activity.route}
                            {activity.amount && ` • ${activity.amount}`}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">{activity.time}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Fee Overview */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Fee Collection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-4">
                      <p className="text-4xl font-bold text-gray-800">₹18.5L</p>
                      <p className="text-sm text-gray-500">Total Collected</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Collection Progress</span>
                        <span className="text-sm font-medium">82%</span>
                      </div>
                      <Progress value={82} className="h-3" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <p className="text-lg font-bold text-green-700">₹18.5L</p>
                        <p className="text-xs text-green-600">Collected</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg text-center">
                        <p className="text-lg font-bold text-red-700">₹4.2L</p>
                        <p className="text-xs text-red-600">Pending</p>
                      </div>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        <span className="text-sm text-amber-700">Defaulters</span>
                      </div>
                      <Badge className="bg-amber-200 text-amber-800">45 Students</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Class Performance & Events */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                      Class Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {classPerformance.map((cls) => (
                        <div key={cls.class} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-16 text-center">
                            <p className="font-bold text-lg text-gray-800">{cls.avg}%</p>
                            <p className="text-xs text-gray-500">Average</p>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium">{cls.class}</p>
                              <Badge variant="outline" className="text-xs">Top: {cls.top}</Badge>
                            </div>
                            <Progress value={cls.avg} className="h-2" />
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-green-600">{cls.attendance}%</p>
                            <p className="text-xs text-gray-500">Attendance</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingEvents.map((event) => (
                        <div key={event.id} className="flex items-center gap-4 p-3 border border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex flex-col items-center justify-center text-white">
                            <span className="text-lg font-bold">{event.date.split(" ")[0]}</span>
                            <span className="text-xs">{event.date.split(" ")[1]}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{event.name}</p>
                            <p className="text-sm text-gray-500">{event.participants} participants expected</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Other Modules Placeholder */}
          {activeModule !== "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    {(() => {
                      const item = sidebarItems.find(i => i.value === activeModule);
                      return item ? <item.icon className="w-10 h-10 text-indigo-600" /> : null;
                    })()}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {sidebarItems.find(i => i.value === activeModule)?.label} Module
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Full-featured module available in Medium Scale package
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline">Student Management</Badge>
                    <Badge variant="outline">Teacher Portal</Badge>
                    <Badge variant="outline">Attendance Tracking</Badge>
                    <Badge variant="outline">Fee Management</Badge>
                    <Badge variant="outline">Library System</Badge>
                    <Badge variant="outline">Transport</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-white border-t py-4 px-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>School ERP - Medium Scale (Up to 1000 Students)</span>
            <span>₹45,000/year</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default SchoolMediumDemo;
