/**
 * School Management Software - Professional Homepage
 * LIVE OPERATING SOFTWARE - NOT A DEMO
 * Premium education UI with role-based entry points
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap, Users, BookOpen, Calendar,
  DollarSign, Bus, Library, ClipboardList,
  Shield, BarChart3, MessageSquare, Video,
  ChevronRight, Play, Star, Award,
  Clock, CheckCircle, Building, Phone,
  Mail, MapPin, Globe, ArrowRight,
  Zap, Target, TrendingUp, Eye,
  UserCircle, School, Briefcase, User,
  Lock, Settings, Home, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Available roles for login
const SCHOOL_ROLES = [
  { 
    id: "principal", 
    name: "Principal / Admin", 
    icon: Shield, 
    color: "from-amber-500 to-orange-500",
    desc: "Full System Access",
    modules: "All Modules"
  },
  { 
    id: "vice_principal", 
    name: "Vice Principal", 
    icon: Award, 
    color: "from-purple-500 to-indigo-500",
    desc: "Academic & Operations",
    modules: "7 Modules"
  },
  { 
    id: "teacher", 
    name: "Teacher", 
    icon: GraduationCap, 
    color: "from-blue-500 to-cyan-500",
    desc: "Classes & Students",
    modules: "5 Modules"
  },
  { 
    id: "student", 
    name: "Student", 
    icon: User, 
    color: "from-green-500 to-emerald-500",
    desc: "Student Portal",
    modules: "5 Modules"
  },
  { 
    id: "parent", 
    name: "Parent", 
    icon: Users, 
    color: "from-teal-500 to-green-500",
    desc: "Child Tracking",
    modules: "6 Modules"
  },
  { 
    id: "accountant", 
    name: "Accountant", 
    icon: DollarSign, 
    color: "from-emerald-500 to-green-500",
    desc: "Fee & Finance",
    modules: "3 Modules"
  },
  { 
    id: "librarian", 
    name: "Librarian", 
    icon: Library, 
    color: "from-violet-500 to-purple-500",
    desc: "Library System",
    modules: "2 Modules"
  },
  { 
    id: "transport", 
    name: "Transport Manager", 
    icon: Bus, 
    color: "from-orange-500 to-red-500",
    desc: "Vehicle & Routes",
    modules: "2 Modules"
  },
];

// Core modules showcase
const CORE_MODULES = [
  { icon: Users, name: "Student Management", desc: "Admissions, profiles, attendance tracking" },
  { icon: GraduationCap, name: "Staff Management", desc: "Teachers, admin staff, HR management" },
  { icon: Calendar, name: "Attendance System", desc: "Daily tracking, reports, leave management" },
  { icon: ClipboardList, name: "Examination Center", desc: "Exams, results, report cards" },
  { icon: DollarSign, name: "Fee Management", desc: "Fee collection, invoices, payments" },
  { icon: BookOpen, name: "Academic Module", desc: "Curriculum, timetable, assignments" },
  { icon: Library, name: "Library System", desc: "Books, issue/return, catalog" },
  { icon: Bus, name: "Transport System", desc: "Routes, vehicles, tracking" },
  { icon: Video, name: "Online Classes", desc: "Virtual classrooms, recordings" },
  { icon: MessageSquare, name: "Communication Hub", desc: "SMS, email, notifications" },
  { icon: BarChart3, name: "Analytics & Reports", desc: "Insights, data visualization" },
  { icon: Shield, name: "Security & Access", desc: "Role permissions, audit logs" },
];

// Live stats to display
const LIVE_STATS = [
  { label: "Active Students", value: "2,450+", icon: Users },
  { label: "Teaching Staff", value: "185", icon: GraduationCap },
  { label: "Modules Active", value: "16", icon: Zap },
  { label: "Daily Logins", value: "3,200+", icon: TrendingUp },
];

const SchoolSoftwareHomepage = () => {
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  const handleRoleLogin = (roleId: string) => {
    navigate(`/school-software/dashboard?role=${roleId}&mode=visitor`);
  };

  const handleExploreSystem = () => {
    navigate('/school-software/dashboard?role=principal&mode=visitor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">School Management System</h1>
              <p className="text-xs text-slate-400">Enterprise Education Platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              LIVE SYSTEM
            </Badge>
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              <Eye className="w-3 h-3 mr-1" />
              VISITOR MODE
            </Badge>
            <Button 
              onClick={handleExploreSystem}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              Enter System
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-amber-400 text-sm font-medium">FULLY OPERATIONAL SOFTWARE</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Complete School <br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Management System
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 max-w-3xl mx-auto mb-8"
            >
              Experience a fully running enterprise-grade school ERP system with real workflows, 
              interconnected modules, and complete functionality. This is not a demo — 
              it's production-ready software.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-4"
            >
              <Button 
                size="lg"
                onClick={handleExploreSystem}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-lg px-8"
              >
                <Play className="w-5 h-5 mr-2" />
                Explore Live System
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-800 text-lg px-8"
                onClick={() => document.getElementById('roles-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View All Roles
              </Button>
            </motion.div>
          </div>

          {/* Live Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            {LIVE_STATS.map((stat, idx) => (
              <Card key={stat.label} className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardContent className="p-6 text-center relative">
                  <div className="absolute top-2 right-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse" />
                  </div>
                  <stat.icon className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section id="roles-section" className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Choose Your Role</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Experience the system from different perspectives. Each role has specific access 
              to relevant modules. All data is pre-filled with representative school data.
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Eye className="w-3 h-3 mr-1" />
                VIEW ONLY MODE
              </Badge>
              <span className="text-slate-500 text-sm">Navigate freely, no modifications allowed</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SCHOOL_ROLES.map((role, idx) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
              >
                <Card 
                  className={`bg-slate-800 border-slate-700 cursor-pointer transition-all duration-300 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 ${
                    hoveredRole === role.id ? 'scale-105' : ''
                  }`}
                  onClick={() => handleRoleLogin(role.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <role.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">{role.name}</h3>
                    <p className="text-sm text-slate-400 mb-3">{role.desc}</p>
                    <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                      {role.modules}
                    </Badge>
                    <Button 
                      className="w-full mt-4 bg-slate-700 hover:bg-amber-500 transition-colors"
                      size="sm"
                    >
                      Login as {role.name.split(' ')[0]}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Showcase */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">All Modules Active</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Every module is fully functional with complete workflows. 
              No placeholder screens, no broken links — everything works.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CORE_MODULES.map((module, idx) => (
              <motion.div
                key={module.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:border-amber-500/30 transition-colors h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center shrink-0">
                        <module.icon className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-1">{module.name}</h4>
                        <p className="text-xs text-slate-400">{module.desc}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400">Fully Operational</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* System Features */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-800/30 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Real Workflows</h3>
                <p className="text-slate-400">
                  Every button opens real screens. Every flow is connected end-to-end. 
                  Experience actual school operations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Visitor Mode</h3>
                <p className="text-slate-400">
                  Navigate all modules freely. View all data and screens. 
                  Modifications are restricted for security.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Enterprise Grade</h3>
                <p className="text-slate-400">
                  Production-ready with security, audit logs, role-based access, 
                  and complete data protection.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Experience the System?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Enter as any role and explore the complete school management system. 
              See how every module works together seamlessly.
            </p>
            <Button 
              size="lg"
              onClick={handleExploreSystem}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-lg px-12"
            >
              <Play className="w-5 h-5 mr-2" />
              Enter Live System
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-400 text-sm">School Management System • Enterprise Edition</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-green-500/20 text-green-400">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse" />
              Live System
            </Badge>
            <span className="text-slate-500 text-sm">v2.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SchoolSoftwareHomepage;
