import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, BookOpen, Calendar, Bell, 
  ClipboardList, DollarSign, FileText, 
  GraduationCap, Home, Settings, LogOut,
  Plus, Search, ChevronRight, CheckCircle,
  Clock, AlertCircle, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const SchoolSmallDemo = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { label: "Total Students", value: "156", icon: Users, color: "bg-blue-500", change: "+12" },
    { label: "Teachers", value: "8", icon: GraduationCap, color: "bg-green-500", change: "+1" },
    { label: "Classes", value: "6", icon: BookOpen, color: "bg-purple-500", change: "0" },
    { label: "Fee Collection", value: "₹2.4L", icon: DollarSign, color: "bg-amber-500", change: "+15%" },
  ];

  const students = [
    { id: 1, name: "Rahul Sharma", class: "Class 5", roll: "001", fees: "Paid", attendance: "92%", avatar: "RS" },
    { id: 2, name: "Priya Patel", class: "Class 5", roll: "002", fees: "Pending", attendance: "88%", avatar: "PP" },
    { id: 3, name: "Amit Kumar", class: "Class 4", roll: "003", fees: "Paid", attendance: "95%", avatar: "AK" },
    { id: 4, name: "Sneha Gupta", class: "Class 6", roll: "004", fees: "Partial", attendance: "90%", avatar: "SG" },
    { id: 5, name: "Vikash Singh", class: "Class 3", roll: "005", fees: "Paid", attendance: "85%", avatar: "VS" },
  ];

  const announcements = [
    { id: 1, title: "Annual Day Celebration", date: "15 Feb 2025", type: "Event" },
    { id: 2, title: "PTM Schedule", date: "20 Feb 2025", type: "Meeting" },
    { id: 3, title: "Fee Submission Reminder", date: "28 Feb 2025", type: "Notice" },
  ];

  const todayClasses = [
    { time: "9:00 AM", subject: "Mathematics", class: "Class 5", teacher: "Mr. Sharma" },
    { time: "10:00 AM", subject: "English", class: "Class 4", teacher: "Mrs. Patel" },
    { time: "11:00 AM", subject: "Science", class: "Class 6", teacher: "Mr. Kumar" },
    { time: "12:00 PM", subject: "Hindi", class: "Class 3", teacher: "Mrs. Gupta" },
  ];

  const menuItems = [
    { icon: Home, label: "Dashboard", value: "dashboard" },
    { icon: Users, label: "Students", value: "students" },
    { icon: GraduationCap, label: "Teachers", value: "teachers" },
    { icon: Calendar, label: "Attendance", value: "attendance" },
    { icon: DollarSign, label: "Fees", value: "fees" },
    { icon: Bell, label: "Notices", value: "notices" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Little Stars School</h1>
              <p className="text-xs text-gray-500">Small Scale ERP</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            ✓ Active
          </Badge>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {menuItems.map((item) => (
            <Button
              key={item.value}
              variant={activeTab === item.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(item.value)}
              className={activeTab === item.value ? "bg-blue-600" : ""}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </div>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {stat.change}
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Today's Classes */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Today's Classes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {todayClasses.map((cls, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{cls.subject}</p>
                          <p className="text-sm text-gray-500">{cls.class} • {cls.teacher}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{cls.time}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Announcements */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-600" />
                    Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <div>
                        <p className="font-medium text-gray-800">{ann.title}</p>
                        <p className="text-sm text-gray-500">{ann.date}</p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700">{ann.type}</Badge>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-blue-600">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search students..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="bg-blue-600">
                <Plus className="w-4 h-4 mr-2" /> Add Student
              </Button>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 font-medium text-gray-600">Student</th>
                        <th className="text-left p-4 font-medium text-gray-600">Class</th>
                        <th className="text-left p-4 font-medium text-gray-600">Roll No</th>
                        <th className="text-left p-4 font-medium text-gray-600">Fees</th>
                        <th className="text-left p-4 font-medium text-gray-600">Attendance</th>
                        <th className="text-left p-4 font-medium text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-blue-100 text-blue-600">{student.avatar}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{student.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">{student.class}</td>
                          <td className="p-4 text-gray-600">{student.roll}</td>
                          <td className="p-4">
                            <Badge className={
                              student.fees === "Paid" ? "bg-green-100 text-green-700" :
                              student.fees === "Pending" ? "bg-red-100 text-red-700" :
                              "bg-amber-100 text-amber-700"
                            }>
                              {student.fees}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Progress value={parseInt(student.attendance)} className="w-16 h-2" />
                              <span className="text-sm text-gray-600">{student.attendance}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Other tabs placeholder */}
        {![ "dashboard", "students"].includes(activeTab) && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {menuItems.find(m => m.value === activeTab)?.label} Module
              </h3>
              <p className="text-gray-500">
                This module is available in Small Scale package
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          School ERP - Small Scale (Up to 200 Students) | ₹15,000/year
        </div>
      </footer>
    </div>
  );
};

export default SchoolSmallDemo;
