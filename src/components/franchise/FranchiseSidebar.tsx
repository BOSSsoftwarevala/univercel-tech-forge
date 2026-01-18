/**
 * FRANCHISE SIDEBAR
 * SINGLE-CONTEXT ENFORCEMENT: Uses sidebar store for strict isolation
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  MapPin, 
  PlayCircle, 
  UserPlus, 
  Bot, 
  HeadphonesIcon,
  TrendingUp,
  Shield,
  Package,
  Megaphone,
  FileText,
  BarChart3,
  Globe,
  Scale,
  History,
  Star,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useSidebarStore } from '@/stores/sidebarStore';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'territory', label: 'Territory Control', icon: MapPin },
  { id: 'leads', label: 'Lead Intake', icon: Users, badge: 23 },
  { id: 'demos', label: 'Demo Distribution', icon: PlayCircle },
  { id: 'resellers', label: 'Reseller Hub', icon: UserPlus },
  { id: 'wallet', label: 'Commission Wallet', icon: Wallet },
  { id: 'marketing', label: 'Local Marketing', icon: Megaphone },
  { id: 'escalation', label: 'Escalation', icon: HeadphonesIcon },
  { id: 'insights', label: 'Territory Insights', icon: TrendingUp },
  { id: 'orders', label: 'Order Execution', icon: Package },
  { id: 'compliance', label: 'Compliance Guard', icon: Shield },
  { id: 'conflicts', label: 'Conflict Resolution', icon: Scale },
  { id: 'expansion', label: 'Region Expansion', icon: Globe },
  { id: 'ai-lead', label: 'AI Lead Gen', icon: Bot },
  { id: 'success', label: 'Success Dashboard', icon: BarChart3 },
  { id: 'audit', label: 'Audit Logs', icon: History },
  { id: 'products', label: 'Product Library', icon: FileText }
];

interface FranchiseSidebarProps {
  activeItem: string;
  onItemChange: (item: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onBack?: () => void;
}

export const FranchiseSidebar = ({ 
  activeItem, 
  onItemChange, 
  collapsed, 
  onCollapsedChange,
  onBack 
}: FranchiseSidebarProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  // SINGLE-CONTEXT ENFORCEMENT: Use store for clean context transitions
  const { exitToGlobal, enterCategory } = useSidebarStore();
  
  // ALWAYS VISIBLE: When this component mounts, enter this category context
  React.useEffect(() => {
    enterCategory('franchise-manager');
    return () => {
      // Cleanup handled by exitToGlobal on back button
    };
  }, [enterCategory]);
  
  // Handle back navigation - triggers FULL context switch to Boss
  const handleBack = () => {
    exitToGlobal();
    onBack?.();
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  return (
    <aside className="w-64 flex flex-col h-full" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0d1b2a 100%)', borderRight: '1px solid #1e3a5f' }}>
      {/* Back Button */}
      <div className="p-2" style={{ borderBottom: '1px solid #1e3a5f' }}>
        <motion.button
          onClick={handleBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
          style={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Control Panel</span>
        </motion.button>
      </div>
      
      {/* Header */}
      <div className="p-4" style={{ borderBottom: '1px solid #1e3a5f' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(37, 99, 235, 0.2)' }}>
            <MapPin className="w-5 h-5" style={{ color: '#60a5fa' }} />
          </div>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: '#ffffff' }}>Franchise Portal</h2>
            <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Territory Management</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeItem === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onItemChange(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all relative"
              style={{
                background: isActive ? '#2563eb' : 'transparent',
                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
              }}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <IconComponent className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? '#ffffff' : '#60a5fa' }} />
              <span className="font-medium flex-1 text-left truncate">
                {item.label}
              </span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(37, 99, 235, 0.3)', color: '#60a5fa' }}>
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Performance Widget */}
      <div className="mx-3 mb-3 p-3 rounded-xl" style={{ background: 'rgba(30, 58, 95, 0.3)', border: '1px solid #1e3a5f' }}>
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-amber-500" />
          <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Performance</span>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(30, 58, 95, 0.5)' }}>
          <motion.div 
            className="h-full rounded-full"
            style={{ background: '#2563eb' }}
            initial={{ width: 0 }}
            animate={{ width: '85%' }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <p className="text-xs mt-1" style={{ color: '#60a5fa' }}>Rating: 4.8/5.0</p>
      </div>
    </aside>
  );
};
