import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Crown,
  Shield,
  Building2,
  Users,
  Code2,
  Megaphone,
  Headphones,
  Star,
  Target,
  ListTodo,
  Search,
  Lightbulb,
  HeartHandshake,
  TrendingUp,
  Wallet,
  Scale,
  UserPlus,
  Sparkles,
  Play,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Package,
  Settings,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WireframeSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  theme: 'dark' | 'light';
}

const sidebarItems = [
  // GRADE 0 - OWNERSHIP
  { icon: Crown, label: '1. Master Admin', path: '/wireframe/super-admin', color: 'text-red-500' },
  // GRADE 1 - PLATFORM CONTROL
  { icon: Shield, label: '2. Super Admin', path: '/wireframe/super-admin', color: 'text-orange-500' },
  { icon: Shield, label: '3. Admin', path: '/wireframe/admin', color: 'text-orange-400' },
  { icon: Settings, label: '4. Server Manager', path: '/wireframe/settings', color: 'text-gray-500' },
  // GRADE 2 - BUSINESS MANAGEMENT
  { icon: Building2, label: '5. Franchise Manager', path: '/wireframe/franchise', color: 'text-blue-500' },
  { icon: Headphones, label: '6. Sales & Support', path: '/wireframe/sales', color: 'text-green-500' },
  { icon: Users, label: '7. Reseller Manager', path: '/wireframe/reseller', color: 'text-cyan-500' },
  { icon: Bot, label: '8. API/AI Manager', path: '/wireframe/ai-console', color: 'text-cyan-400' },
  { icon: Sparkles, label: '9. Influencer Manager', path: '/wireframe/influencer', color: 'text-fuchsia-500' },
  { icon: Search, label: '10. SEO Manager', path: '/wireframe/seo-manager', color: 'text-emerald-500' },
  { icon: BarChart3, label: '11. Marketing Manager', path: '/wireframe/marketing', color: 'text-pink-400' },
  { icon: Target, label: '12. Lead Manager', path: '/wireframe/lead-manager', color: 'text-teal-500' },
  { icon: Star, label: '13. Pro Manager', path: '/wireframe/prime-user', color: 'text-amber-500' },
  { icon: Scale, label: '14. Legal Manager', path: '/wireframe/legal', color: 'text-stone-500' },
  { icon: ListTodo, label: '15. Task Manager', path: '/wireframe/task-manager', color: 'text-indigo-500' },
  { icon: UserPlus, label: '16. HR Manager', path: '/wireframe/hr', color: 'text-orange-400' },
  { icon: Code2, label: '17. Developer Manager', path: '/wireframe/developer', color: 'text-purple-500' },
  // GRADE 3 - PARTNERS
  { icon: Building2, label: '18. Franchise', path: '/wireframe/franchise', color: 'text-blue-400' },
  { icon: Code2, label: '19. Developer', path: '/wireframe/developer', color: 'text-purple-400' },
  { icon: Users, label: '20. Reseller', path: '/wireframe/reseller', color: 'text-cyan-400' },
  { icon: Sparkles, label: '21. Influencer', path: '/wireframe/influencer', color: 'text-fuchsia-400' },
  // GRADE 4 - USERS
  { icon: Star, label: '22. Prime User', path: '/wireframe/prime-user', color: 'text-amber-400' },
  { icon: Users, label: '23. User', path: '/wireframe/user', color: 'text-slate-400' },
  { icon: Play, label: '24. Frontend', path: '/wireframe/demo-manager', color: 'text-violet-500' },
  // GRADE 5 - SUPPORT & PROMISE
  { icon: HeartHandshake, label: '25. Safe Assist', path: '/wireframe/safe-assist', color: 'text-green-400' },
  { icon: Headphones, label: '26. Assist Manager', path: '/wireframe/assist-manager', color: 'text-sky-400' },
  { icon: TrendingUp, label: '27. Promise Tracker', path: '/wireframe/promise-tracker', color: 'text-rose-400' },
  { icon: Package, label: '28. Promise Management', path: '/wireframe/promise-management', color: 'text-emerald-400' },
];

export function WireframeSidebar({ collapsed, onToggle, theme }: WireframeSidebarProps) {
  const isDark = theme === 'dark';

  return (
    <TooltipProvider>
      <aside className={`fixed left-0 top-16 bottom-0 z-40 transition-all duration-300 border-r ${
        collapsed ? 'w-16' : 'w-64'
      } ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={`absolute -right-3 top-4 h-6 w-6 rounded-full border ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'
          }`}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>

        <ScrollArea className="h-full py-4">
          <nav className="space-y-1 px-2">
            {sidebarItems.map((item) => (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                      ${isActive 
                        ? isDark 
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30' 
                          : 'bg-gradient-to-r from-cyan-100 to-purple-100 border border-cyan-300'
                        : isDark 
                          ? 'hover:bg-slate-800' 
                          : 'hover:bg-gray-100'
                      }
                    `}
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${item.color}`} />
                    {!collapsed && (
                      <span className="text-sm font-medium truncate">{item.label}</span>
                    )}
                  </NavLink>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>
        </ScrollArea>
      </aside>
    </TooltipProvider>
  );
}
