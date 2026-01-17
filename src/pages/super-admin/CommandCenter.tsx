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
  FileCheck, User, Layout, Bot, Share2, Code, Hammer, Trophy, Layers, Eye
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

// Premium gradient color palette for cards - ULTRA VIBRANT
const gradientPalettes = [
  'from-violet-500 via-purple-500 to-fuchsia-500',
  'from-blue-500 via-cyan-400 to-teal-400',
  'from-emerald-500 via-green-400 to-teal-400',
  'from-rose-500 via-pink-500 to-fuchsia-400',
  'from-amber-500 via-orange-400 to-yellow-400',
  'from-indigo-500 via-purple-500 to-pink-400',
  'from-cyan-500 via-blue-400 to-indigo-500',
  'from-pink-500 via-rose-400 to-red-400',
];

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSubs, setExpandedSubs] = useState<string[]>([]);
  const [expandedMicros, setExpandedMicros] = useState<string[]>([]);
  const Icon = category.icon;
  const gradient = gradientPalettes[index % gradientPalettes.length];

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

  return (
    <div className="group relative">
      {/* Compact Premium Card - SMALLER SIZE like reference */}
      <div 
        className={cn(
          "relative rounded-xl overflow-hidden transition-all duration-200",
          "shadow-md hover:shadow-lg hover:-translate-y-0.5",
          "bg-gradient-to-br",
          gradient
        )}
      >
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/5" />
        
        {/* Card Content - COMPACT */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative w-full flex items-center gap-2.5 p-3 text-left"
        >
          {/* Icon Container - Smaller */}
          <div className="w-9 h-9 rounded-lg bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-sm border border-white/20 flex-shrink-0">
            <Icon className="h-4 w-4 text-white drop-shadow-sm" />
          </div>
          
          {/* Text - Compact */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-xs drop-shadow-sm tracking-tight truncate leading-tight">{category.name}</h3>
            <p className="text-white/70 text-[10px]">{category.subs.length} module{category.subs.length > 1 ? 's' : ''}</p>
          </div>
          
          {/* Chevron - Smaller */}
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <ChevronDown 
              className={cn(
                "h-3 w-3 text-white transition-transform duration-200",
                isExpanded && "rotate-180"
              )} 
            />
          </div>
        </button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-2">
                {category.subs.map((sub) => (
                  <div key={sub.name} className="border-l-2 border-white/40 pl-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSub(sub.name); }}
                      className="w-full flex items-center gap-2 py-2 text-left hover:bg-white/15 rounded-lg px-2 -ml-2 transition-colors group/sub"
                    >
                      <ChevronRight className={cn(
                        "h-4 w-4 text-white/80 transition-transform",
                        expandedSubs.includes(sub.name) && "rotate-90"
                      )} />
                      <span className="text-sm font-semibold text-white">{sub.name}</span>
                    </button>

                    {/* Micros */}
                    <AnimatePresence>
                      {expandedSubs.includes(sub.name) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-4 mt-1 space-y-1"
                        >
                          {sub.micros.map((micro) => (
                            <div key={micro.name}>
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleMicro(micro.name); }}
                                className="w-full flex items-center gap-2 py-1.5 text-left hover:bg-white/15 rounded px-2 transition-colors"
                              >
                                <ChevronRight className={cn(
                                  "h-3 w-3 text-white/70 transition-transform",
                                  expandedMicros.includes(micro.name) && "rotate-90"
                                )} />
                                <span className="text-xs font-medium text-white/90">{micro.name}</span>
                              </button>
                              
                              {/* Nanos */}
                              <AnimatePresence>
                                {expandedMicros.includes(micro.name) && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="ml-5 mt-1 space-y-1"
                                  >
                                    {micro.nanos.map((nano) => (
                                      <div
                                        key={nano.name}
                                        className="text-xs text-white/90 py-1.5 px-3 rounded-lg bg-white/15 hover:bg-white/25 cursor-pointer transition-colors font-medium"
                                      >
                                        {nano.name}
                                      </div>
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
      </div>
    </div>
  );
}


// ==========================================
// HEADER STAT CARD - ULTRA PREMIUM
// ==========================================

const statGradients = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500',
];

const HeaderStatCard = ({ 
  title, 
  value, 
  subValue, 
  icon: Icon, 
  trend, 
  trendUp = true,
  gradientIndex = 0 
}: {
  title: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  gradientIndex?: number;
}) => (
  <div className={cn(
    "relative p-5 rounded-2xl overflow-hidden transition-all duration-300",
    "bg-gradient-to-br shadow-lg hover:shadow-xl hover:-translate-y-0.5",
    statGradients[gradientIndex % statGradients.length]
  )}>
    {/* Glossy overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10" />
    
    <div className="relative">
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-inner border border-white/20">
          <Icon className="h-6 w-6 text-white drop-shadow-sm" />
        </div>
        {trend && (
          <Badge 
            className={`text-xs font-bold ${trendUp ? 'bg-white/25 text-white border-white/30' : 'bg-red-500/30 text-white border-red-300/30'}`}
          >
            {trendUp ? '↑' : '↓'} {trend}
          </Badge>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-xs text-white/80 uppercase tracking-wider font-semibold">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-white drop-shadow-sm">{value}</p>
          {subValue && (
            <span className="text-sm text-white/70 font-medium">{subValue}</span>
          )}
        </div>
      </div>
    </div>
  </div>
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
    className="flex flex-col items-center justify-center min-h-[400px] bg-card rounded-2xl border border-border shadow-lg"
  >
    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
      <span className="text-4xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
    <p className="text-muted-foreground">This module is ready for sub/micro/nano mapping</p>
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
    tasksCompleted: 283,
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
            className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center pointer-events-none"
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

      <div className="space-y-6 bg-background min-h-screen -m-6 p-6">
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
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              </motion.div>
              
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">
                  {activeCategory ? categoryTitles[activeCategory] || activeCategory.toUpperCase() : 'DASHBOARD COMMAND CENTER'}
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  {activeCategory ? `Managing ${categoryTitles[activeCategory] || activeCategory}` : 'Category Hierarchy Structure • 4-Level System'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-500 text-white border-emerald-400 px-3 py-1.5 shadow-md">
                <Activity className="h-3 w-3 mr-1.5 animate-pulse" />
                LIVE
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 font-medium"
                onClick={() => setShowAudit(true)}
              >
                <ScanLine className="w-4 h-4" />
                Run Audit
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-border bg-card text-foreground hover:bg-secondary font-medium shadow-sm">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* PREMIUM STATS ROW */}
          {!activeCategory && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              <HeaderStatCard 
                title="Total Leads" 
                value={liveStats.totalLeads.toLocaleString()} 
                icon={Target} 
                trend="12.5%" 
                trendUp={true}
                gradientIndex={0}
              />
              <HeaderStatCard 
                title="Active Developers" 
                value={liveStats.activeDevelopers.toString()} 
                icon={Code2} 
                trend="8%" 
                trendUp={true}
                gradientIndex={1}
              />
              <HeaderStatCard 
                title="Demos Online" 
                value={liveStats.demosOnline.toString()} 
                icon={Globe} 
                trend="5.2%" 
                trendUp={true}
                gradientIndex={2}
              />
              <HeaderStatCard 
                title="Tasks Done" 
                value={liveStats.tasksCompleted.toString()} 
                icon={CheckCircle} 
                trend="15%" 
                trendUp={true}
                gradientIndex={3}
              />
              <HeaderStatCard 
                title="Revenue Today" 
                value="₹12.4L" 
                subValue="+8.3%"
                icon={DollarSign} 
                trend="23%" 
                trendUp={true}
                gradientIndex={4}
              />
            </div>
          )}

          {/* Categories Grid - COMPACT Layout like reference */}
          {!activeCategory && (
            <div className="mb-5">
              <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                System Modules
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
                {categories.map((category, index) => (
                  <CategoryCard key={category.id} category={category} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* LIVE ACTIVITY - Regional Control Cards like reference image */}
          {!activeCategory && (
            <div className="space-y-4">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base">Live Activity</h3>
                    <p className="text-[10px] text-muted-foreground">Regional control & monitoring</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                  LIVE
                </Badge>
              </div>

              {/* Regional Control Cards Grid - White cards like reference */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { region: 'AFRICA CONTROL', items: 4, details: '2 Pending • 1 Critical • 1 Waiting', status: 'MEDIUM', statusColor: 'text-amber-600 bg-amber-100', time: '15m ago', icon: Globe },
                  { region: 'ASIA CONTROL', items: 7, details: '4 Queue • 2 Risk • 1 SLA', status: 'CRITICAL', statusColor: 'text-red-600 bg-red-100', time: '5m ago', icon: Globe },
                  { region: 'EUROPE CONTROL', items: 3, details: '2 Requests • 1 Legal', status: 'HIGH', statusColor: 'text-red-500 bg-red-50', time: '30m ago', icon: Globe },
                  { region: 'NORTH AMERICA', items: 5, details: '3 Pending • 2 Financial', status: 'HIGH', statusColor: 'text-red-500 bg-red-50', time: '10m ago', icon: Globe },
                  { region: 'SOUTH AMERICA', items: 2, details: '1 Ops • 1 Backlog', status: 'MEDIUM', statusColor: 'text-amber-600 bg-amber-100', time: '1h ago', icon: Globe },
                  { region: 'MIDDLE EAST', items: 3, details: '2 Security • 1 Override', status: 'HIGH', statusColor: 'text-red-500 bg-red-50', time: '23m ago', icon: Globe },
                  { region: 'CORE ADMIN OPS', items: 6, details: '4 System • 2 Escalations', status: 'HIGH', statusColor: 'text-red-500 bg-red-50', time: '8m ago', icon: Shield },
                  { region: 'FRANCHISE REQUESTS', items: 8, details: '5 New Apps • 3 Renewals', status: 'HIGH', statusColor: 'text-red-500 bg-red-50', time: '12m ago', icon: Building2 },
                  { region: 'RESELLER ACTIONS', items: 4, details: '2 Onboard • 2 Disputes', status: 'MEDIUM', statusColor: 'text-amber-600 bg-amber-100', time: '45m ago', icon: Users },
                ].map((card, idx) => (
                  <div
                    key={idx}
                    className="relative p-3 rounded-lg bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{card.region}</h4>
                        <p className="text-2xl font-bold text-foreground mt-0.5">{card.items}<span className="text-xs font-normal text-muted-foreground ml-1">items</span></p>
                      </div>
                      <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
                        <card.icon className="h-3 w-3 text-primary" />
                      </div>
                    </div>

                    {/* Details */}
                    <p className="text-[10px] text-muted-foreground mb-2">{card.details}</p>

                    {/* Status & Time Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] text-muted-foreground">Continent</span>
                        <Badge className={cn("text-[9px] px-1 py-0 font-semibold h-4", card.statusColor)}>
                          {card.status}
                        </Badge>
                      </div>
                      <span className="text-[9px] text-muted-foreground">{card.time}</span>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-border">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-blue-100">
                        <Eye className="h-3 w-3 text-blue-600" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-green-100">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-orange-100">
                        <RefreshCw className="h-3 w-3 text-orange-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Today's Summary Stats */}
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <p className="text-xs text-muted-foreground text-center mb-3">🎉 Today's Highlights</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 text-center">
                  <div>
                    <p className="text-xl font-bold text-primary">{liveStats.totalLeads.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">Total Leads</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-violet-500">{liveStats.activeDevelopers}</p>
                    <p className="text-[10px] text-muted-foreground">Active Devs</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-emerald-500">{liveStats.demosOnline}</p>
                    <p className="text-[10px] text-muted-foreground">Demos Live</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-amber-500">{liveStats.tasksCompleted}</p>
                    <p className="text-[10px] text-muted-foreground">Tasks Done</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-rose-500">₹{(liveStats.totalRevenue / 100000).toFixed(1)}L</p>
                    <p className="text-[10px] text-muted-foreground">Revenue</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Render category-specific content */}
        <AnimatePresence mode="wait">
          {activeCategory && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCategoryContent()}
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
