import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Link2, 
  Wallet, 
  MessageSquare, 
  GraduationCap, 
  HeadphonesIcon,
  Bot,
  BarChart3,
  Target,
  MapPin,
  Megaphone,
  FileText,
  Award,
  Clock,
  ShoppingCart,
  Shield,
  Star,
  LogOut,
  Lock,
  Settings,
  ArrowLeft,
  KeyRound
} from 'lucide-react';
import softwareValaLogo from '@/assets/software-vala-logo.png';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Lead Inbox', icon: Users, badge: 12 },
  { id: 'demos', label: 'Demo Sharing', icon: Link2 },
  { id: 'scripts', label: 'AI Sales Script', icon: Bot },
  { id: 'wallet', label: 'Wallet & Commission', icon: Wallet },
  { id: 'chat', label: 'Customer Chat', icon: MessageSquare, badge: 5 },
  { id: 'marketing', label: 'Marketing Toolkit', icon: Megaphone },
  { id: 'targets', label: 'Targets & Goals', icon: Target },
  { id: 'performance', label: 'Performance Board', icon: BarChart3 },
  { id: 'escalations', label: 'Escalations', icon: HeadphonesIcon },
  { id: 'territory', label: 'Territory View', icon: MapPin },
  { id: 'training', label: 'Micro Training', icon: GraduationCap },
  { id: 'incentives', label: 'Incentives', icon: Award },
  { id: 'compliance', label: 'Compliance', icon: Shield }
];

interface ResellerSidebarProps {
  activeItem: string;
  onItemChange: (item: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export const ResellerSidebar = ({ 
  activeItem, 
  onItemChange, 
  collapsed, 
  onCollapsedChange 
}: ResellerSidebarProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-40 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} hidden lg:block`}>
      <div className="h-full bg-[hsl(220,60%,8%)]/95 backdrop-blur-xl border-r border-[hsl(200,80%,40%)]/20 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-[hsl(200,80%,40%)]/20">
          <div className="flex items-center gap-3">
            <motion.div 
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/')}
            >
              <img 
                src={softwareValaLogo} 
                alt="Software Vala" 
                className={`${collapsed ? 'h-8' : 'h-10'} w-auto object-contain`}
              />
            </motion.div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <p className="text-[10px] text-[hsl(200,80%,60%)]">Reseller Portal</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-[hsl(200,80%,40%)]/20">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onItemChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative ${
                  isActive
                    ? 'bg-[hsl(200,80%,50%)]/15 text-[hsl(200,80%,60%)] border border-[hsl(200,80%,50%)]/40'
                    : 'text-[hsl(220,20%,65%)] hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ x: collapsed ? 0 : 3 }}
              >
                <IconComponent className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[hsl(200,80%,60%)]' : ''}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium flex-1 text-left truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!collapsed && item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-[hsl(200,80%,50%)]/20 text-[hsl(200,80%,60%)]">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="resellerActiveIndicator"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[hsl(200,80%,60%)]"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Performance Widget */}
        {!collapsed && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-[hsl(200,80%,50%)]/10 to-[hsl(260,70%,55%)]/10 border border-[hsl(200,80%,40%)]/20">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-[hsl(45,90%,55%)]" />
              <span className="text-xs text-[hsl(220,20%,70%)]">Performance</span>
            </div>
            <div className="w-full h-1.5 bg-[hsl(220,40%,15%)] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[hsl(200,80%,50%)] to-[hsl(260,70%,55%)] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '72%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-xs text-[hsl(200,80%,60%)] mt-1">Rating: 4.2/5.0</p>
          </div>
        )}

        {/* Account Actions */}
        {!collapsed && (
          <div className="mx-3 mb-3 space-y-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[hsl(220,20%,65%)] hover:text-white hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Dashboard</span>
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/change-password')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[hsl(220,20%,65%)] hover:text-white hover:bg-white/5 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span className="text-sm">Password</span>
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[hsl(220,20%,65%)] hover:text-white hover:bg-white/5 transition-all"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>
            </div>
            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[hsl(220,20%,65%)] hover:text-white hover:bg-white/5 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span className="text-sm">Forgot Password</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        )}

        {/* Collapse Button */}
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="m-3 p-2 rounded-lg bg-white/5 text-[hsl(220,20%,65%)] hover:text-white transition-colors self-end"
        >
          <motion.div
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </button>
      </div>
    </aside>
  );
};
