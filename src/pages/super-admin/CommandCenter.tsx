import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Crown, Users, Building2, Store, Code2, Zap, Star, Target,
  ListTodo, HeadphonesIcon, TrendingUp, Brain,
  Activity, Globe, Shield, Scale, Search, UserPlus,
  Clock, RefreshCw, DollarSign, AlertTriangle, ChevronRight, ScanLine,
  Server, Megaphone, MonitorPlay, Handshake, LayoutDashboard, CheckCircle,
  ClipboardList, UserCog, ChevronDown, Terminal, ShoppingCart, LifeBuoy,
  FileCheck, User, Layout, Bot, Share2
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { SystemAuditPopup } from '@/components/system/SystemAuditPopup';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import RoleSwitchSidebar, { type ActiveRole, roleConfigs } from '@/components/super-admin-wireframe/RoleSwitchSidebar';
import CommandHeader from '@/components/layouts/CommandHeader';
import { TooltipProvider } from '@/components/ui/tooltip';

// ==========================================
// FIGMA MASTER PROMPT — CATEGORY HIERARCHY
// Category → Sub → Micro → Nano (4 Levels)
// ==========================================

interface NanoCategory {
  name: string;
}

interface MicroCategory {
  name: string;
  nanos: NanoCategory[];
}

interface SubCategory {
  name: string;
  micros: MicroCategory[];
}

interface Category {
  id: number;
  name: string;
  icon: LucideIcon;
  color: string;
  subs: SubCategory[];
}

const categories: Category[] = [
  {
    id: 1,
    name: "Super Admin",
    icon: Crown,
    color: "from-red-500 to-rose-600",
    subs: [{
      name: "System Control",
      micros: [
        { name: "Access Control", nanos: [{ name: "Freeze System" }, { name: "Emergency Lock" }] },
        { name: "Global Settings", nanos: [{ name: "Platform Toggle" }, { name: "Maintenance Mode" }] }
      ]
    }]
  },
  {
    id: 2,
    name: "Admin",
    icon: Shield,
    color: "from-orange-500 to-amber-600",
    subs: [{
      name: "Operations",
      micros: [
        { name: "User Operations", nanos: [{ name: "Activate" }, { name: "Suspend" }] },
        { name: "Data Operations", nanos: [{ name: "View Logs" }, { name: "Export" }] }
      ]
    }]
  },
  {
    id: 3,
    name: "Server Manager",
    icon: Server,
    color: "from-emerald-500 to-green-600",
    subs: [{
      name: "Infrastructure",
      micros: [
        { name: "Server Health", nanos: [{ name: "CPU" }, { name: "Memory" }] },
        { name: "Deployment", nanos: [{ name: "Manual Deploy" }, { name: "Rollback" }] }
      ]
    }]
  },
  {
    id: 4,
    name: "Franchise Manager",
    icon: Building2,
    color: "from-blue-500 to-indigo-600",
    subs: [{
      name: "Franchise Control",
      micros: [
        { name: "Area Management", nanos: [{ name: "Zone Assign" }, { name: "Zone Lock" }] },
        { name: "Performance", nanos: [{ name: "Revenue" }, { name: "Growth" }] }
      ]
    }]
  },
  {
    id: 5,
    name: "Sales & Support Manager",
    icon: HeadphonesIcon,
    color: "from-violet-500 to-purple-600",
    subs: [{
      name: "Sales Operations",
      micros: [
        { name: "Lead Handling", nanos: [{ name: "Assign Lead" }, { name: "Close Lead" }] },
        { name: "Support", nanos: [{ name: "Ticket View" }, { name: "Resolution" }] }
      ]
    }]
  },
  {
    id: 6,
    name: "Reseller Manager",
    icon: UserCog,
    color: "from-pink-500 to-rose-600",
    subs: [{
      name: "Reseller Network",
      micros: [
        { name: "Reseller Control", nanos: [{ name: "Approve" }, { name: "Suspend" }] },
        { name: "Commission", nanos: [{ name: "Calculate" }, { name: "Release" }] }
      ]
    }]
  },
  {
    id: 7,
    name: "API / AI Manager",
    icon: Bot,
    color: "from-cyan-500 to-teal-600",
    subs: [{
      name: "Intelligence",
      micros: [
        { name: "API Control", nanos: [{ name: "Key Issue" }, { name: "Revoke" }] },
        { name: "AI Logic", nanos: [{ name: "Training" }, { name: "Monitoring" }] }
      ]
    }]
  },
  {
    id: 8,
    name: "Influencer Manager",
    icon: Share2,
    color: "from-fuchsia-500 to-pink-600",
    subs: [{
      name: "Campaigns",
      micros: [
        { name: "Influencer Control", nanos: [{ name: "Approve" }, { name: "Block" }] },
        { name: "Tracking", nanos: [{ name: "Clicks" }, { name: "Conversion" }] }
      ]
    }]
  },
  {
    id: 9,
    name: "SEO Manager",
    icon: Search,
    color: "from-lime-500 to-green-600",
    subs: [{
      name: "Optimization",
      micros: [
        { name: "Content SEO", nanos: [{ name: "Meta" }, { name: "Keywords" }] },
        { name: "Analytics", nanos: [{ name: "Ranking" }, { name: "Traffic" }] }
      ]
    }]
  },
  {
    id: 10,
    name: "Marketing Manager",
    icon: Megaphone,
    color: "from-yellow-500 to-orange-600",
    subs: [{
      name: "Campaign Engine",
      micros: [
        { name: "Festival Offers", nanos: [{ name: "Create" }, { name: "Schedule" }] },
        { name: "Promotions", nanos: [{ name: "Discounts" }, { name: "Coupons" }] }
      ]
    }]
  },
  {
    id: 11,
    name: "Lead Manager",
    icon: Target,
    color: "from-red-500 to-orange-600",
    subs: [{
      name: "Lead System",
      micros: [
        { name: "Lead Flow", nanos: [{ name: "Capture" }, { name: "Distribute" }] },
        { name: "Quality", nanos: [{ name: "Score" }, { name: "Filter" }] }
      ]
    }]
  },
  {
    id: 12,
    name: "Pro Manager",
    icon: Star,
    color: "from-amber-500 to-yellow-600",
    subs: [{
      name: "Premium Control",
      micros: [
        { name: "Upgrade Flow", nanos: [{ name: "Request" }, { name: "Approve" }] },
        { name: "Benefits", nanos: [{ name: "Features" }, { name: "Priority" }] }
      ]
    }]
  },
  {
    id: 13,
    name: "Legal Manager",
    icon: Scale,
    color: "from-slate-500 to-gray-600",
    subs: [{
      name: "Compliance",
      micros: [
        { name: "Policies", nanos: [{ name: "Terms" }, { name: "Privacy" }] },
        { name: "Risk", nanos: [{ name: "Review" }, { name: "Approve" }] }
      ]
    }]
  },
  {
    id: 14,
    name: "Task Manager",
    icon: ListTodo,
    color: "from-indigo-500 to-blue-600",
    subs: [{
      name: "Task Engine",
      micros: [
        { name: "Assignment", nanos: [{ name: "Create" }, { name: "Reassign" }] },
        { name: "Tracking", nanos: [{ name: "Status" }, { name: "Deadline" }] }
      ]
    }]
  },
  {
    id: 15,
    name: "HR Manager",
    icon: UserPlus,
    color: "from-teal-500 to-cyan-600",
    subs: [{
      name: "Human Resource",
      micros: [
        { name: "Hiring", nanos: [{ name: "Apply" }, { name: "Review" }] },
        { name: "Records", nanos: [{ name: "Attendance" }, { name: "Performance" }] }
      ]
    }]
  },
  {
    id: 16,
    name: "Developer Manager",
    icon: Code2,
    color: "from-purple-500 to-violet-600",
    subs: [{
      name: "Development Control",
      micros: [
        { name: "Task Allocation", nanos: [{ name: "Assign" }, { name: "Review" }] },
        { name: "Quality", nanos: [{ name: "Bug" }, { name: "Fix" }] }
      ]
    }]
  },
  {
    id: 17,
    name: "Franchise",
    icon: Store,
    color: "from-emerald-500 to-teal-600",
    subs: [{
      name: "Business Panel",
      micros: [
        { name: "Sales", nanos: [{ name: "Deals" }, { name: "Revenue" }] },
        { name: "Area", nanos: [{ name: "Coverage" }, { name: "Expansion" }] }
      ]
    }]
  },
  {
    id: 18,
    name: "Developer",
    icon: Terminal,
    color: "from-gray-500 to-slate-600",
    subs: [{
      name: "Work Panel",
      micros: [
        { name: "Tasks", nanos: [{ name: "View" }, { name: "Submit" }] },
        { name: "Logs", nanos: [{ name: "Time" }, { name: "Activity" }] }
      ]
    }]
  },
  {
    id: 19,
    name: "Reseller",
    icon: ShoppingCart,
    color: "from-rose-500 to-pink-600",
    subs: [{
      name: "Sales Panel",
      micros: [
        { name: "Clients", nanos: [{ name: "Add" }, { name: "Manage" }] },
        { name: "Wallet", nanos: [{ name: "Balance" }, { name: "Request" }] }
      ]
    }]
  },
  {
    id: 20,
    name: "Influencer",
    icon: Zap,
    color: "from-fuchsia-500 to-purple-600",
    subs: [{
      name: "Promotion",
      micros: [
        { name: "Links", nanos: [{ name: "Create" }, { name: "Share" }] },
        { name: "Earnings", nanos: [{ name: "Track" }, { name: "Withdraw" }] }
      ]
    }]
  },
  {
    id: 21,
    name: "Prime User",
    icon: Crown,
    color: "from-yellow-500 to-amber-600",
    subs: [{
      name: "Premium Access",
      micros: [
        { name: "Products", nanos: [{ name: "Full Access" }, { name: "Priority" }] },
        { name: "Support", nanos: [{ name: "Fast Track" }, { name: "SLA" }] }
      ]
    }]
  },
  {
    id: 22,
    name: "User",
    icon: User,
    color: "from-blue-500 to-cyan-600",
    subs: [{
      name: "Usage",
      micros: [
        { name: "Demos", nanos: [{ name: "View" }, { name: "Test" }] },
        { name: "Account", nanos: [{ name: "Profile" }, { name: "Security" }] }
      ]
    }]
  },
  {
    id: 23,
    name: "Frontend",
    icon: Layout,
    color: "from-sky-500 to-blue-600",
    subs: [{
      name: "UI Layer",
      micros: [
        { name: "Components", nanos: [{ name: "Buttons" }, { name: "Forms" }] },
        { name: "Layout", nanos: [{ name: "Grid" }, { name: "Responsive" }] }
      ]
    }]
  },
  {
    id: 24,
    name: "Safe Assist",
    icon: LifeBuoy,
    color: "from-green-500 to-emerald-600",
    subs: [{
      name: "Remote Help",
      micros: [
        { name: "Session", nanos: [{ name: "Start" }, { name: "End" }] },
        { name: "Logs", nanos: [{ name: "Record" }, { name: "Review" }] }
      ]
    }]
  },
  {
    id: 25,
    name: "Assist Manager",
    icon: Handshake,
    color: "from-violet-500 to-indigo-600",
    subs: [{
      name: "Support Control",
      micros: [
        { name: "Team", nanos: [{ name: "Assign" }, { name: "Monitor" }] },
        { name: "Quality", nanos: [{ name: "SLA" }, { name: "Feedback" }] }
      ]
    }]
  },
  {
    id: 26,
    name: "Promise Tracker",
    icon: Clock,
    color: "from-orange-500 to-red-600",
    subs: [{
      name: "Commitment",
      micros: [
        { name: "Tracking", nanos: [{ name: "Timeline" }, { name: "Status" }] },
        { name: "Alerts", nanos: [{ name: "Delay" }, { name: "Notify" }] }
      ]
    }]
  },
  {
    id: 27,
    name: "Promise Management",
    icon: FileCheck,
    color: "from-teal-500 to-green-600",
    subs: [{
      name: "Promise Control",
      micros: [
        { name: "Approval", nanos: [{ name: "Accept" }, { name: "Reject" }] },
        { name: "Closure", nanos: [{ name: "Complete" }, { name: "Archive" }] }
      ]
    }]
  },
  {
    id: 28,
    name: "Dashboard Management",
    icon: LayoutDashboard,
    color: "from-indigo-500 to-purple-600",
    subs: [{
      name: "Visualization",
      micros: [
        { name: "Widgets", nanos: [{ name: "Add" }, { name: "Remove" }] },
        { name: "Layout", nanos: [{ name: "Arrange" }, { name: "Lock" }] }
      ]
    }]
  }
];

// ==========================================
// CATEGORY CARD COMPONENT (Expandable 4-Level)
// ==========================================

function CategoryCard({ category }: { category: Category }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSubs, setExpandedSubs] = useState<string[]>([]);
  const [expandedMicros, setExpandedMicros] = useState<string[]>([]);
  const Icon = category.icon;

  const toggleSub = (subName: string) => {
    setExpandedSubs(prev => 
      prev.includes(subName) ? prev.filter(s => s !== subName) : [...prev, subName]
    );
  };

  const toggleMicro = (microName: string) => {
    setExpandedMicros(prev => 
      prev.includes(microName) ? prev.filter(m => m !== microName) : [...prev, microName]
    );
  };

  const totalMicros = category.subs.reduce((acc, s) => acc + s.micros.length, 0);
  const totalNanos = category.subs.reduce((acc, s) => 
    acc + s.micros.reduce((acc2, m) => acc2 + m.nanos.length, 0), 0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/80 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-xl"
      style={{
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Category Header - Clean Style: Icon + Name Only */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center gap-3 p-4 transition-all",
          "hover:bg-slate-700/50",
          isExpanded && "bg-slate-700/30"
        )}
      >
        <div className={cn("p-2.5 rounded-xl bg-gradient-to-br shadow-lg", category.color)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="font-semibold text-white flex-1 text-left">{category.name}</h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-slate-400" />
        </motion.div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {category.subs.map((sub) => (
                <div key={sub.name} className="border-l-2 border-teal-500/30 pl-4">
                  {/* Sub Category (Level 2) - Clean */}
                  <button
                    onClick={() => toggleSub(sub.name)}
                    className="w-full flex items-center gap-2 py-2 text-left hover:text-teal-400 transition-colors group"
                  >
                    <motion.div
                      animate={{ rotate: expandedSubs.includes(sub.name) ? 90 : 0 }}
                    >
                      <ChevronRight className="h-4 w-4 text-teal-500" />
                    </motion.div>
                    <span className="text-sm font-medium text-white group-hover:text-teal-400">{sub.name}</span>
                  </button>

                  {/* Micro Categories (Level 3) */}
                  <AnimatePresence>
                    {expandedSubs.includes(sub.name) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-4 space-y-1 overflow-hidden"
                      >
                        {sub.micros.map((micro) => (
                          <div key={micro.name} className="border-l border-cyan-500/30 pl-3">
                            {/* Micro Category - Clean */}
                            <button
                              onClick={() => toggleMicro(`${sub.name}-${micro.name}`)}
                              className="w-full flex items-center gap-2 py-1.5 text-left hover:text-cyan-400 transition-colors group"
                            >
                              <motion.div
                                animate={{ rotate: expandedMicros.includes(`${sub.name}-${micro.name}`) ? 90 : 0 }}
                              >
                                <ChevronRight className="h-3 w-3 text-cyan-500/70" />
                              </motion.div>
                              <span className="text-xs text-slate-300 group-hover:text-cyan-400">{micro.name}</span>
                            </button>

                            {/* Nano Categories (Level 4) */}
                            <AnimatePresence>
                              {expandedMicros.includes(`${sub.name}-${micro.name}`) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="ml-4 py-1 space-y-1 overflow-hidden"
                                >
                                  {micro.nanos.map((nano) => (
                                    <motion.div
                                      key={nano.name}
                                      whileHover={{ x: 4 }}
                                      className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-teal-500/30 cursor-pointer transition-all group"
                                    >
                                      <div className="h-1.5 w-1.5 rounded-full bg-teal-500/60 group-hover:bg-teal-400" />
                                      <span className="text-[11px] text-slate-400 group-hover:text-teal-300">{nano.name}</span>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ==========================================
// HEADER STAT CARD
// ==========================================

const HeaderStatCard = ({ 
  title, 
  value, 
  subValue, 
  icon: Icon, 
  trend, 
  trendUp = true 
}: {
  title: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}) => (
  <motion.div 
    className="relative p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm overflow-hidden group"
    whileHover={{ scale: 1.02, y: -2 }}
    style={{
      boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
    }}
  >
    <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
    
    <div className="flex items-start justify-between mb-2">
      <div className="p-2 rounded-lg bg-slate-700/50">
        <Icon className="h-4 w-4 text-teal-400" />
      </div>
      {trend && (
        <Badge 
          variant="outline" 
          className={`text-[10px] ${trendUp ? 'text-emerald-400 border-emerald-500/30' : 'text-rose-400 border-rose-500/30'}`}
        >
          {trendUp ? '↑' : '↓'} {trend}
        </Badge>
      )}
    </div>
    
    <div className="space-y-0.5">
      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline gap-1.5">
        <motion.p 
          className="text-xl font-bold text-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          {value}
        </motion.p>
        {subValue && (
          <span className="text-xs text-slate-400">{subValue}</span>
        )}
      </div>
    </div>
  </motion.div>
);

// ==========================================
// MAIN COMMAND CENTER COMPONENT
// ==========================================

// Category titles for display when a specific category is selected
const categoryTitles: Record<string, string> = {
  "super-admin": "Super Admin",
  "admin": "Admin",
  "area-manager": "Area Manager",
  "server-manager": "Server Manager",
  "franchise-manager": "Franchise Manager",
  "sales-support-manager": "Sales & Support Manager",
  "reseller-manager": "Reseller Manager",
  "api-ai-manager": "API / AI Manager",
  "influencer-manager": "Influencer Manager",
  "seo-manager": "SEO Manager",
  "marketing-manager": "Marketing Manager",
  "lead-manager": "Lead Manager",
  "pro-manager": "Pro Manager",
  "legal-manager": "Legal Manager",
  "task-manager": "Task Manager",
  "hr-manager": "HR Manager",
  "developer-manager": "Developer Manager",
  "franchise": "Franchise",
  "developer": "Developer",
  "reseller": "Reseller",
  "influencer": "Influencer",
  "prime-user": "Prime User",
  "user": "User",
  "frontend": "Frontend",
  "safe-assist": "Safe Assist",
  "assist-manager": "Assist Manager",
  "promise-tracker": "Promise Tracker",
  "promise-management": "Promise Management",
  "dashboard-management": "Dashboard Management",
};

// Placeholder component for categories
const CategoryPlaceholder = ({ title }: { title: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center min-h-[400px] bg-slate-800/50 rounded-2xl border border-slate-700/50"
  >
    <div className="w-20 h-20 rounded-2xl bg-teal-500/20 flex items-center justify-center mb-4">
      <span className="text-4xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
    <p className="text-slate-400">This module is ready for sub/micro/nano mapping</p>
  </motion.div>
);

const SuperAdminCommandCenter = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeCategory = searchParams.get('cat');
  
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAudit, setShowAudit] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeRole, setActiveRole] = useState<ActiveRole>("continent_super_admin");
  const [liveStats, setLiveStats] = useState({
    totalLeads: 4523,
    activeDevelopers: 47,
    demosOnline: 156,
    totalRevenue: 12450000,
  });

  // Skip welcome animation if navigating to a specific category
  useEffect(() => {
    if (activeCategory) {
      setShowWelcome(false);
    } else {
      const timer = setTimeout(() => setShowWelcome(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [activeCategory]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        totalLeads: prev.totalLeads + Math.floor(Math.random() * 3),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle role change - navigate to role switch dashboard
  const handleRoleChange = (role: ActiveRole) => {
    setActiveRole(role);
    navigate(`/super-admin-system/role-switch?role=${role}`);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch {
      toast.error("Logout failed");
    }
  };

  // Render category-specific content when a category is selected
  const renderCategoryContent = () => {
    if (!activeCategory) return null;
    
    const title = categoryTitles[activeCategory] || activeCategory;
    return <CategoryPlaceholder title={title} />;
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Global Header */}
        <CommandHeader />
        
        {/* Main Content Area with Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* New Role Switch Sidebar */}
          <RoleSwitchSidebar
            activeRole={activeRole}
            onRoleChange={handleRoleChange}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            onLogout={handleLogout}
          />
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
      <SystemAuditPopup isVisible={showAudit} onClose={() => setShowAudit(false)} />
      
      {/* Welcome Animation Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-2xl"
                style={{ boxShadow: '0 0 60px rgba(20, 184, 166, 0.5)' }}
              >
                <Crown className="w-14 h-14 text-white" />
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white mb-4"
              >
                Welcome, Boss
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-slate-400"
              >
                Command Center Initializing...
              </motion.p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.7, duration: 1.5 }}
                className="h-1 bg-gradient-to-r from-teal-500 to-cyan-500 mt-8 mx-auto max-w-md rounded-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6 bg-slate-900 min-h-screen -m-6 p-6">
        {/* Command Center Header */}
        <motion.div 
          className="space-y-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div 
                className="relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 8px 24px rgba(20, 184, 166, 0.4)' }}>
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              </motion.div>
              
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {activeCategory ? categoryTitles[activeCategory] || activeCategory.toUpperCase() : 'DASHBOARD COMMAND CENTER'}
                </h1>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {activeCategory ? `Managing ${categoryTitles[activeCategory] || activeCategory}` : 'Category Hierarchy Structure • 4-Level System'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 px-3 py-1">
                <Activity className="h-3 w-3 mr-1.5 animate-pulse" />
                LIVE
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-teal-500/30 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20"
                onClick={() => setShowAudit(true)}
              >
                <ScanLine className="w-4 h-4" />
                Run Audit
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-700">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Summary - Only show when no category selected */}
          {!activeCategory && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <HeaderStatCard
                title="Total Categories"
                value="28"
                icon={LayoutDashboard}
              />
              <HeaderStatCard
                title="Sub Categories"
                value="28"
                icon={ClipboardList}
              />
              <HeaderStatCard
                title="Micro Categories"
                value="56"
                icon={CheckCircle}
              />
              <HeaderStatCard
                title="Nano Categories"
                value="112"
                icon={Target}
              />
            </div>
          )}
        </motion.div>

        {/* Render category-specific content OR default overview */}
        <AnimatePresence mode="wait">
          {activeCategory ? (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCategoryContent()}
            </motion.div>
          ) : (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Categories Grid - All 28 Categories with 4-Level Hierarchy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 rounded-full bg-gradient-to-b from-teal-400 to-cyan-500" />
                  <div>
                    <h2 className="text-lg font-bold text-white">All Categories</h2>
                    <p className="text-xs text-slate-400">Click to expand hierarchy: Category → Sub → Micro → Nano</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categories.map((category, idx) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.02 }}
                    >
                      <CategoryCard category={category} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* AI Insights & Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                {/* AI Insights */}
                <motion.div 
                  className="p-5 rounded-2xl bg-slate-800/60 border border-teal-500/20 backdrop-blur-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">AI Insights</h3>
                      <p className="text-[10px] text-slate-400">Powered by Vala Intelligence</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { insight: 'Lead conversion rate up 15% this week', type: 'positive' },
                      { insight: '3 developers approaching SLA deadline', type: 'warning' },
                      { insight: 'Mumbai region showing highest growth', type: 'info' },
                    ].map((item, idx) => (
                      <motion.div 
                        key={idx} 
                        className={`p-3 rounded-xl border ${
                          item.type === 'positive' 
                            ? 'bg-emerald-500/10 border-emerald-500/30' 
                            : item.type === 'warning' 
                            ? 'bg-amber-500/10 border-amber-500/30' 
                            : 'bg-teal-500/10 border-teal-500/30'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                      >
                        <div className="flex items-start gap-2">
                          {item.type === 'positive' && <TrendingUp className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />}
                          {item.type === 'warning' && <Clock className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />}
                          {item.type === 'info' && <Globe className="h-4 w-4 text-teal-400 mt-0.5 shrink-0" />}
                          <p className="text-xs text-slate-200">{item.insight}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Critical Alerts */}
                <motion.div 
                  className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-amber-500/20">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">Critical Alerts</h3>
                      <p className="text-[10px] text-slate-400">Requires immediate attention</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { type: 'critical', title: 'Demo Offline', desc: 'E-commerce v2.1 down', time: '2m ago' },
                      { type: 'warning', title: 'SLA Breach', desc: 'Task #4521 exceeded', time: '8m ago' },
                      { type: 'info', title: 'New Franchise', desc: 'Mumbai South approved', time: '3h ago' },
                    ].map((alert, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className={`p-3 rounded-xl border ${
                          alert.type === 'critical' 
                            ? 'bg-rose-500/10 border-rose-500/30' 
                            : alert.type === 'warning'
                            ? 'bg-amber-500/10 border-amber-500/30'
                            : 'bg-teal-500/10 border-teal-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-xs text-white">{alert.title}</p>
                            <p className="text-[10px] text-slate-400">{alert.desc}</p>
                          </div>
                          <span className="text-[10px] text-slate-500">{alert.time}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full gap-2 mt-3 text-xs text-slate-400 hover:text-white">
                    View All Alerts
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SuperAdminCommandCenter;
