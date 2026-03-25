/**
 * Education Demo Hub - All Education Software Demos
 * Complete, fully working demos ready to use
 * Auto-login via URL - No password needed
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap, BookOpen, Users, Building2,
  School, Library, Bus, Calendar, ClipboardList,
  DollarSign, Video, MessageSquare, Award,
  UserCircle, ChevronRight, Star, Download,
  ExternalLink, Play, Check, Zap, Globe,
  Laptop, Smartphone, Database, Shield,
  Clock, TrendingUp, BarChart3, Target,
  Heart, Coffee, Lightbulb, Rocket,
  ArrowLeft, Copy, Settings, Monitor
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Education Demo Categories
const EDUCATION_DEMOS = [
  {
    id: "school-erp",
    name: "School Management System",
    shortName: "School ERP",
    description: "Complete K-12 school management with multi-branch support, student/staff management, fees, exams, transport, library, and more.",
    icon: School,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    status: "LIVE",
    demoUrl: "/demo/school-large",
    tiers: [
      { name: "Small", students: "Up to 500", price: "₹29,999", url: "/demo/school-small" },
      { name: "Medium", students: "500-2000", price: "₹49,999", url: "/demo/school-medium" },
      { name: "Large", students: "2000+", price: "₹89,999", url: "/demo/school-large" },
    ],
    features: [
      "Student & Staff Management",
      "Multi-Branch Support",
      "Fee Collection & Accounting",
      "Examination & Report Cards",
      "Attendance (Biometric/Manual)",
      "Transport & GPS Tracking",
      "Library Management",
      "Online Classes Integration",
      "Parent & Student Portals",
      "SMS/Email Notifications",
      "Hostel Management",
      "HR & Payroll"
    ],
    roles: ["principal", "teacher", "student", "parent", "accountant", "librarian", "transport", "admin"],
    modules: 25,
    users: "Unlimited"
  },
  {
    id: "college-erp",
    name: "College / University ERP",
    shortName: "College ERP",
    description: "University management system with admission, courses, faculty, exams, placements, research, and hostel management.",
    icon: Building2,
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    status: "COMING_SOON",
    demoUrl: "/demo/college-large",
    tiers: [
      { name: "Small", students: "Up to 2000", price: "₹49,999", url: "/demo/college-small" },
      { name: "Medium", students: "2000-10000", price: "₹89,999", url: "/demo/college-medium" },
      { name: "Large", students: "10000+", price: "₹1,49,999", url: "/demo/college-large" },
    ],
    features: [
      "Admission Management",
      "Course & Curriculum",
      "Faculty Management",
      "Department Control",
      "Semester/Credit System",
      "Online Exam Portal",
      "Placement Cell",
      "Research Portal",
      "Alumni Management",
      "Hostel & Mess",
      "Sports & Events",
      "Financial Aid"
    ],
    roles: ["registrar", "hod", "professor", "student", "placement_officer", "warden"],
    modules: 32,
    users: "Unlimited"
  },
  {
    id: "coaching-center",
    name: "Coaching Center Management",
    shortName: "Coaching",
    description: "Coaching institute software for batches, tests, study materials, fee tracking, and student performance analytics.",
    icon: Users,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    status: "COMING_SOON",
    demoUrl: "/demo/coaching-large",
    tiers: [
      { name: "Basic", students: "Up to 200", price: "₹14,999", url: "/demo/coaching-small" },
      { name: "Pro", students: "200-1000", price: "₹29,999", url: "/demo/coaching-medium" },
      { name: "Enterprise", students: "1000+", price: "₹49,999", url: "/demo/coaching-large" },
    ],
    features: [
      "Batch Management",
      "Student Enrollment",
      "Test Series & Mock Tests",
      "Study Material Portal",
      "Fee Collection",
      "Performance Analytics",
      "Doubt Sessions",
      "Attendance Tracking",
      "Parent Updates",
      "Result Analysis",
      "Competition Prep Modules",
      "Video Classes"
    ],
    roles: ["director", "teacher", "student", "parent", "admin"],
    modules: 18,
    users: "Unlimited"
  },
  {
    id: "lms",
    name: "Learning Management System",
    shortName: "LMS",
    description: "Complete e-learning platform with video courses, quizzes, certificates, progress tracking, and live classes.",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    status: "COMING_SOON",
    demoUrl: "/demo/lms-large",
    tiers: [
      { name: "Starter", courses: "Up to 50", price: "₹19,999", url: "/demo/lms-small" },
      { name: "Growth", courses: "50-500", price: "₹49,999", url: "/demo/lms-medium" },
      { name: "Enterprise", courses: "Unlimited", price: "₹99,999", url: "/demo/lms-large" },
    ],
    features: [
      "Video Course Builder",
      "Quiz & Assessments",
      "Certificate Generator",
      "Progress Tracking",
      "Live Classes (Zoom/Meet)",
      "Discussion Forums",
      "Assignment Submission",
      "Instructor Dashboard",
      "Student Analytics",
      "Mobile App Ready",
      "Payment Gateway",
      "Multi-language Support"
    ],
    roles: ["admin", "instructor", "student", "mentor"],
    modules: 22,
    users: "Unlimited"
  },
  {
    id: "tuition-center",
    name: "Tuition Center Software",
    shortName: "Tuition",
    description: "Home tuition and small batch management software for individual tutors and small coaching classes.",
    icon: Lightbulb,
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    status: "COMING_SOON",
    demoUrl: "/demo/tuition",
    tiers: [
      { name: "Solo Tutor", students: "Up to 50", price: "₹4,999", url: "/demo/tuition-solo" },
      { name: "Small Center", students: "50-200", price: "₹9,999", url: "/demo/tuition-small" },
      { name: "Multi-Center", students: "200+", price: "₹19,999", url: "/demo/tuition-multi" },
    ],
    features: [
      "Student Registration",
      "Batch Scheduling",
      "Fee Management",
      "Attendance via App",
      "Parent Communication",
      "Progress Reports",
      "Assignment Tracking",
      "Expense Management",
      "Revenue Dashboard",
      "WhatsApp Integration",
      "SMS Reminders",
      "Simple Reports"
    ],
    roles: ["tutor", "student", "parent"],
    modules: 12,
    users: "Unlimited"
  },
  {
    id: "exam-portal",
    name: "Online Examination Portal",
    shortName: "Exam Portal",
    description: "Secure online examination system with proctoring, auto-grading, result analysis, and certificate generation.",
    icon: ClipboardList,
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    status: "COMING_SOON",
    demoUrl: "/demo/exam-portal",
    tiers: [
      { name: "Basic", exams: "Up to 100/year", price: "₹14,999", url: "/demo/exam-basic" },
      { name: "Pro", exams: "Unlimited", price: "₹29,999", url: "/demo/exam-pro" },
      { name: "Enterprise", exams: "Unlimited + Proctoring", price: "₹59,999", url: "/demo/exam-enterprise" },
    ],
    features: [
      "Question Bank Builder",
      "MCQ/Subjective Support",
      "Auto Timer & Submission",
      "AI Proctoring",
      "Plagiarism Detection",
      "Auto Grading",
      "Result Analytics",
      "Certificate Generation",
      "Leaderboards",
      "Bulk Student Import",
      "Randomized Questions",
      "Secure Browser Mode"
    ],
    roles: ["admin", "examiner", "evaluator", "student"],
    modules: 15,
    users: "Unlimited"
  }
];

// Stats for the hub
const PLATFORM_STATS = [
  { label: "Education Demos", value: "6+", icon: GraduationCap },
  { label: "Total Modules", value: "120+", icon: Settings },
  { label: "User Roles", value: "30+", icon: Users },
  { label: "Live Demos", value: "1", icon: Play },
];

const EducationDemoHub = () => {
  const navigate = useNavigate();
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const handleDemoClick = (demo: typeof EDUCATION_DEMOS[0]) => {
    if (demo.status === "LIVE") {
      navigate(demo.demoUrl);
    } else {
      toast.info(`${demo.name} - Coming Soon!`, {
        description: "This demo is under development. Check back soon!",
      });
    }
  };

  const copyDemoUrl = (url: string) => {
    navigator.clipboard.writeText(`${window.location.origin}${url}`);
    toast.success("URL copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 mb-6"
            >
              <GraduationCap className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-medium">Education Software Suite</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Complete Education
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"> Software Demos</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 mb-8"
            >
              Fully working, ready-to-use education management systems. 
              <br />
              Auto-login via URL - No password needed. Test any role instantly.
            </motion.p>

            {/* Platform Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
            >
              {PLATFORM_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-slate-800/50 backdrop-blur rounded-xl p-4 border border-slate-700"
                >
                  <stat.icon className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </header>

      {/* Demo Cards Grid */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EDUCATION_DEMOS.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-slate-800 border-slate-700 hover:border-slate-600 transition-all h-full flex flex-col ${
                demo.status === "LIVE" ? "ring-2 ring-green-500/30" : ""
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${demo.color} flex items-center justify-center shadow-lg`}>
                      <demo.icon className="w-7 h-7 text-white" />
                    </div>
                    <Badge className={demo.status === "LIVE" 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-slate-600 text-slate-300"
                    }>
                      {demo.status === "LIVE" ? "🟢 LIVE" : "Coming Soon"}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-xl">{demo.name}</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    {demo.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className={`${demo.bgColor} rounded-lg p-2 text-center`}>
                      <p className="text-lg font-bold text-white">{demo.modules}</p>
                      <p className="text-xs text-slate-400">Modules</p>
                    </div>
                    <div className={`${demo.bgColor} rounded-lg p-2 text-center`}>
                      <p className="text-lg font-bold text-white">{demo.roles.length}</p>
                      <p className="text-xs text-slate-400">Roles</p>
                    </div>
                    <div className={`${demo.bgColor} rounded-lg p-2 text-center`}>
                      <p className="text-lg font-bold text-white">{demo.users}</p>
                      <p className="text-xs text-slate-400">Users</p>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-1 mb-4">
                    {demo.features.slice(0, 5).map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                        <Check className="w-4 h-4 text-green-400 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {demo.features.length > 5 && (
                      <p className="text-xs text-slate-500 pl-6">
                        +{demo.features.length - 5} more features
                      </p>
                    )}
                  </div>

                  {/* Tiers Preview */}
                  <div className="flex gap-1">
                    {demo.tiers.map((tier) => (
                      <Badge key={tier.name} variant="outline" className="text-xs border-slate-600 text-slate-400">
                        {tier.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button
                    onClick={() => handleDemoClick(demo)}
                    disabled={demo.status !== "LIVE"}
                    className={`flex-1 ${demo.status === "LIVE" 
                      ? `bg-gradient-to-r ${demo.color} text-white hover:opacity-90` 
                      : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {demo.status === "LIVE" ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Open Demo
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Coming Soon
                      </>
                    )}
                  </Button>
                  {demo.status === "LIVE" && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyDemoUrl(demo.demoUrl)}
                      className="border-slate-600 text-slate-400 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* School ERP Detailed Section - Since it's LIVE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              🎓 School ERP - <span className="text-green-400">LIVE NOW</span>
            </h2>
            <p className="text-slate-400">
              Complete working demo with all modules. Try any role - no login required!
            </p>
          </div>

          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left - Role Access */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <UserCircle className="w-5 h-5 text-amber-500" />
                    Quick Access - All Roles
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Click any role to instantly access the demo as that user:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { role: "principal", name: "Principal", desc: "Full Access" },
                      { role: "teacher", name: "Teacher", desc: "Classes & Exams" },
                      { role: "student", name: "Student", desc: "Portal View" },
                      { role: "parent", name: "Parent", desc: "Child Tracking" },
                      { role: "accountant", name: "Accountant", desc: "Fees & Finance" },
                      { role: "librarian", name: "Librarian", desc: "Library Mgmt" },
                      { role: "transport", name: "Transport", desc: "Bus Tracking" },
                      { role: "admin", name: "Admin", desc: "Office Work" },
                    ].map((item) => (
                      <Button
                        key={item.role}
                        variant="outline"
                        onClick={() => navigate(`/demo/school-large?role=${item.role}`)}
                        className="justify-start h-auto py-3 border-slate-600 hover:border-amber-500 hover:bg-amber-500/10"
                      >
                        <div className="text-left">
                          <p className="font-medium text-white">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 ml-auto text-slate-500" />
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Right - Features */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Included Modules
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Users, name: "Student Management" },
                      { icon: GraduationCap, name: "Staff Management" },
                      { icon: Calendar, name: "Attendance System" },
                      { icon: DollarSign, name: "Fee Collection" },
                      { icon: ClipboardList, name: "Examination" },
                      { icon: Library, name: "Library" },
                      { icon: Bus, name: "Transport" },
                      { icon: MessageSquare, name: "Communication" },
                      { icon: Video, name: "Online Classes" },
                      { icon: BarChart3, name: "Analytics" },
                      { icon: Shield, name: "Security" },
                      { icon: Settings, name: "Settings" },
                    ].map((module) => (
                      <div
                        key={module.name}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700"
                      >
                        <module.icon className="w-5 h-5 text-amber-500" />
                        <span className="text-sm text-white">{module.name}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => navigate("/demo/school-large")}
                    className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg py-6"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Launch School ERP Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tech Stack & Download Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Built With Modern Tech Stack</h2>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Framer Motion", "Shadcn UI"].map((tech) => (
              <Badge key={tech} className="bg-slate-700 text-slate-300 px-4 py-2 text-sm">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="border-slate-600 text-slate-300">
              <Globe className="w-4 h-4 mr-2" />
              Web Version
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300">
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile Ready
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300">
              <Database className="w-4 h-4 mr-2" />
              Cloud Database
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300">
              <Download className="w-4 h-4 mr-2" />
              Source Code Available
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-500">
            Education Software Suite by SoftwareWala.net
          </p>
          <p className="text-slate-600 text-sm mt-2">
            All demos are fully functional. Contact for customization and deployment.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EducationDemoHub;
