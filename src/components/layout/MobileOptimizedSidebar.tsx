/**
 * Mobile-Optimized Sidebar
 * Touch-friendly, fast animations, proper z-index handling
 */

import { memo, useCallback, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, Building2, Users, Code2, Megaphone, Star, Target,
  ListTodo, Lightbulb, HeartHandshake, TrendingUp, Wallet,
  BarChart3, Monitor, UserPlus, Scale, Shield, Bot,
  Settings, X, Menu, Sparkles, Home, HeadphonesIcon, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  userRole?: string;
}

const navItems = [
  { icon: Home, label: 'Home', path: '/', accent: 'text-white' },
  { icon: Crown, label: 'Admin', path: '/super-admin', accent: 'text-yellow-400' },
  { icon: Building2, label: 'Franchise', path: '/franchise', accent: 'text-blue-400' },
  { icon: Users, label: 'Reseller', path: '/reseller', accent: 'text-green-400' },
  { icon: Code2, label: 'Developer', path: '/developer', accent: 'text-cyan-400' },
  { icon: Megaphone, label: 'Influencer', path: '/influencer', accent: 'text-pink-400' },
  { icon: Star, label: 'Prime', path: '/prime', accent: 'text-amber-400' },
  { icon: Target, label: 'Leads', path: '/leads', accent: 'text-red-400' },
  { icon: ListTodo, label: 'Tasks', path: '/tasks', accent: 'text-purple-400' },
  { icon: Monitor, label: 'Demos', path: '/demos', accent: 'text-teal-400' },
  { icon: Wallet, label: 'Finance', path: '/finance', accent: 'text-lime-400' },
  { icon: Bot, label: 'AI', path: '/ai-console', accent: 'text-sky-400' },
  // New roles (25-28)
  { icon: HeadphonesIcon, label: 'Safe Assist', path: '/safe-assist', accent: 'text-emerald-400' },
  { icon: Users, label: 'Assist Manager', path: '/assist-manager', accent: 'text-indigo-400' },
  { icon: Activity, label: 'Promise Tracker', path: '/promise-tracker', accent: 'text-orange-400' },
  { icon: Shield, label: 'Promise Mgmt', path: '/promise-management', accent: 'text-rose-400' },
  { icon: Settings, label: 'Settings', path: '/settings', accent: 'text-gray-400' },
];

// Memoized nav item for performance
const NavItem = memo(({ item, isActive, onClick }: { 
  item: typeof navItems[0]; 
  isActive: boolean; 
  onClick: () => void;
}) => {
  const Icon = item.icon;
  
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 active:scale-95",
        "min-h-[48px] touch-manipulation", // Touch-friendly
        isActive
          ? "bg-primary/20 text-primary border border-primary/30"
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && item.accent)} />
      <span className="text-sm font-medium">{item.label}</span>
    </NavLink>
  );
});
NavItem.displayName = 'NavItem';

const MobileOptimizedSidebar = memo(({ isOpen, onClose, onOpen, userRole }: MobileSidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Close on route change
  useEffect(() => {
    if (isOpen) onClose();
  }, [location.pathname]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  // Prevent body scroll when open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isMobile, isOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={onOpen}
          className={cn(
            "fixed top-4 left-4 z-40 p-2.5 rounded-xl",
            "bg-card/90 backdrop-blur border border-border/50",
            "shadow-lg active:scale-95 transition-transform",
            "min-w-[44px] min-h-[44px] flex items-center justify-center",
            isOpen && "opacity-0 pointer-events-none"
          )}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
      )}

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: '-100%' } : false}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className={cn(
              "fixed left-0 top-0 h-full z-50 flex flex-col",
              "bg-card/95 backdrop-blur-xl border-r border-border/50",
              "w-[280px] max-w-[85vw]",
              !isMobile && "w-64"
            )}
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg text-foreground">SoftwareVala</span>
              </div>
              {isMobile && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-secondary/50 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 overscroll-contain">
              {navItems.map((item) => (
                <NavItem
                  key={item.path}
                  item={item}
                  isActive={location.pathname === item.path || 
                    (item.path !== '/' && location.pathname.startsWith(item.path))}
                  onClick={onClose}
                />
              ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border/50">
              <div className="text-xs text-muted-foreground text-center">
                <span className="font-mono">v2035.1.0</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
});

MobileOptimizedSidebar.displayName = 'MobileOptimizedSidebar';

export default MobileOptimizedSidebar;
