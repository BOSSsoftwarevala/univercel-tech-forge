import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Crown,
  Building2,
  Users,
  Code2,
  Megaphone,
  Star,
  Target,
  ListTodo,
  Lightbulb,
  HeartHandshake,
  TrendingUp,
  Wallet,
  BarChart3,
  Monitor,
  UserPlus,
  Scale,
  Shield,
  Bot,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  lowDataMode: boolean;
}

const roleNavItems = [
  { icon: Crown, label: 'Super Admin', path: '/super-admin', accent: 'text-yellow-400' },
  { icon: Building2, label: 'Franchise', path: '/franchise', accent: 'text-blue-400' },
  { icon: Users, label: 'Reseller', path: '/reseller', accent: 'text-green-400' },
  { icon: Code2, label: 'Developer', path: '/developer', accent: 'text-cyan-400' },
  { icon: Megaphone, label: 'Influencer', path: '/influencer', accent: 'text-pink-400' },
  { icon: Star, label: 'Prime User', path: '/prime', accent: 'text-amber-400' },
  { icon: Target, label: 'Lead Manager', path: '/leads', accent: 'text-red-400' },
  { icon: ListTodo, label: 'Task Manager', path: '/tasks', accent: 'text-purple-400' },
  { icon: Lightbulb, label: 'R&D', path: '/rnd', accent: 'text-orange-400' },
  { icon: HeartHandshake, label: 'Client Success', path: '/clients', accent: 'text-rose-400' },
  { icon: TrendingUp, label: 'Performance', path: '/performance', accent: 'text-emerald-400' },
  { icon: Wallet, label: 'Finance', path: '/finance', accent: 'text-lime-400' },
  { icon: BarChart3, label: 'Marketing', path: '/marketing', accent: 'text-violet-400' },
  { icon: Monitor, label: 'Demo Manager', path: '/demos', accent: 'text-teal-400' },
  { icon: UserPlus, label: 'HR/Hiring', path: '/hr', accent: 'text-indigo-400' },
  { icon: Scale, label: 'Legal/Compliance', path: '/legal', accent: 'text-slate-400' },
  { icon: Shield, label: 'API/Security', path: '/security', accent: 'text-red-500' },
  { icon: Bot, label: 'ChatBot', path: '/chatbot', accent: 'text-sky-400' },
  { icon: CreditCard, label: 'Wallet', path: '/wallet', accent: 'text-green-500' },
  { icon: Settings, label: 'Settings', path: '/settings', accent: 'text-gray-400' },
];

const GlobalSidebar2035 = ({ collapsed, onToggle, lowDataMode }: SidebarProps) => {
  const location = useLocation();
  const { userRole } = useAuth();

  const filteredItems = roleNavItems.filter(
    (item) => item.path !== '/super-admin' || userRole === 'super_admin'
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      className={cn(
        "fixed left-0 top-0 h-screen z-50 flex flex-col",
        lowDataMode 
          ? "bg-background border-r border-border" 
          : "bg-gradient-to-b from-[#0d1025]/95 to-[#0a0a1a]/95 backdrop-blur-xl border-r border-white/5"
      )}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-white/5 relative">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-6 w-6 text-cyan-400" />
            <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              SOFTWARE VALA
            </span>
          </motion.div>
        )}
        {collapsed && <Sparkles className="h-6 w-6 text-cyan-400" />}
        
        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-white/10">
        <TooltipProvider delayDuration={0}>
          <ul className="space-y-1 px-2">
            {filteredItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-white/60 hover:bg-white/5 hover:text-white/90"
                        )}
                      >
                        {/* Active indicator glow */}
                        {isActive && !lowDataMode && (
                          <motion.div
                            layoutId="activeIndicator"
                            className={cn(
                              "absolute left-0 top-0 bottom-0 w-1 rounded-r",
                              item.accent.replace('text-', 'bg-')
                            )}
                          />
                        )}
                        
                        <Icon className={cn(
                          "h-5 w-5 flex-shrink-0 transition-colors",
                          isActive ? item.accent : "text-current"
                        )} />
                        
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm font-medium truncate"
                          >
                            {item.label}
                          </motion.span>
                        )}

                        {/* Hover glow effect */}
                        {!lowDataMode && (
                          <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                            "bg-gradient-to-r from-transparent via-white/5 to-transparent"
                          )} />
                        )}
                      </NavLink>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" className="bg-background/95 backdrop-blur">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </TooltipProvider>
      </nav>

      {/* Version Badge */}
      <div className="p-4 border-t border-white/5">
        {!collapsed && (
          <div className="text-xs text-white/40 text-center">
            <span className="font-mono">v2035.1.0</span>
            <br />
            <span>Enterprise Edition</span>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default GlobalSidebar2035;
